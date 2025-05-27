package CodeSquad.IssueTracker.issue;

import CodeSquad.IssueTracker.comment.CommentService;
import CodeSquad.IssueTracker.comment.dto.CommentResponseDto;
import CodeSquad.IssueTracker.home.dto.IssueFilterCondition;
import CodeSquad.IssueTracker.issue.dto.FilteredIssueDto;
import CodeSquad.IssueTracker.issue.dto.IssueCreateRequest;
import CodeSquad.IssueTracker.issue.dto.IssueDetailResponse;
import CodeSquad.IssueTracker.issue.dto.IssueUpdateDto;
import CodeSquad.IssueTracker.issueAssignee.IssueAssigneeRepository;
import CodeSquad.IssueTracker.issueAssignee.IssueAssigneeService;
import CodeSquad.IssueTracker.issueAssignee.dto.IssueAssigneeResponse;
import CodeSquad.IssueTracker.issueLabel.IssueLabelRepository;
import CodeSquad.IssueTracker.issueLabel.IssueLabelService;
import CodeSquad.IssueTracker.issueLabel.dto.IssueLabelResponse;
import CodeSquad.IssueTracker.milestone.MilestoneService;
import CodeSquad.IssueTracker.milestone.dto.MilestoneResponse;
import CodeSquad.IssueTracker.user.User;
import CodeSquad.IssueTracker.user.UserService;
import CodeSquad.IssueTracker.util.Uploader;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class IssueService {

    public static final int LIMIT_SIZE = 20;

    private final IssueRepository issueRepository;
    private final IssueAssigneeRepository issueAssigneeRepository;
    private final IssueLabelRepository issueLabelRepository;
    private final IssueAssigneeService issueAssigneeService;
    private final IssueLabelService issueLabelService;
    private final UserService userService;
    private final MilestoneService milestoneService;
    private final CommentService commentService;
    private final Uploader s3Uploader;

    public void update(Long issueId, IssueUpdateDto updateParam){
        issueRepository.update(issueId, updateParam);
    }

    public Optional<Issue> findById(Long issueId){
        return issueRepository.findById(issueId);
    }

    public Iterable<Issue> findAll(){
        return issueRepository.findAll();
    }

    public IssueDetailResponse createIssue(IssueCreateRequest request, List<MultipartFile> files, String loginId) throws IOException {
        User author = userService.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + loginId));

        Issue issue = new Issue();
        issue.setTitle(request.getTitle());
        issue.setContent(request.getContent());
        issue.setAuthorId(author.getId()); // ✅ 여기서 ID를 찾아서 넣음
        issue.setMilestoneId(request.getMilestoneId());
        issue.setIsOpen(true);
        issue.setLastModifiedAt(LocalDateTime.now());

        if (files != null && !files.isEmpty()) {
            MultipartFile file = files.getFirst();
            String issueFileUrl = s3Uploader.upload(file);
            issue.setIssueFileUrl(issueFileUrl);
        }

        Issue saved = issueRepository.save(issue);

        if (request.getAssigneeIds() != null && !request.getAssigneeIds().isEmpty()) {
            issueAssigneeService.assignAssignees(saved.getIssueId(), request.getAssigneeIds());
        }

        if (request.getLabelIds() != null && !request.getLabelIds().isEmpty()) {
            issueLabelService.assignLabels(saved.getIssueId(), request.getLabelIds());
        }

        return toDetailResponse(issue);
    }

    public IssueDetailResponse toDetailResponse(Issue issue) {
        IssueDetailResponse response = new IssueDetailResponse();
        response.setIssue(issue);

        // ✅ 1. Assignees
        List<IssueAssigneeResponse> issueAssignees = issueAssigneeService.findAssigneeResponsesByIssueId(issue.getIssueId());


        // ✅ 2. Labels
        List<IssueLabelResponse> issueLabels = issueLabelService.findIssueLabelResponsesByIssueId(issue.getIssueId());

        // ✅ 3. Milestone
        MilestoneResponse milestones = milestoneService.findMilestoneResponsesByIssueId(issue.getIssueId());

        // ✅ 4. Comments
        List<CommentResponseDto> comments = commentService.findCommentResponsesByIssueId(issue.getIssueId());

        response.setAssignees(issueAssignees);
        response.setLabels(issueLabels);
        response.setComments(comments);
        response.setMilestone(milestones);

        return response;
    }

    public Iterable<FilteredIssueDto> findIssuesByFilter(int page, IssueFilterCondition condition) {
        List<FilteredIssueDto> issues = issueRepository.findIssuesByFilter(page, condition);

        for (FilteredIssueDto issue : issues) {
            issue.setAssignees(issueAssigneeRepository.findSummaryAssigneeByIssueId(issue.getIssueId()));
            issue.setLabels(issueLabelRepository.findSummaryLabelByIssueId(issue.getIssueId()));
        }

        return issues;
    }

    public int getIssueMaxPage(IssueFilterCondition condition) {
        int totalCount =  issueRepository.countFilteredIssuesByIsOpen(condition.getIsOpen(), condition);
        return  (int) Math.ceil((double) totalCount / LIMIT_SIZE);
    }

    public int countIssuesByOpenStatus(boolean isOpen, IssueFilterCondition condition) {
        return issueRepository.countFilteredIssuesByIsOpen(isOpen, condition);
    }
}
