package CodeSquad.IssueTracker.issue;

import CodeSquad.IssueTracker.comment.CommentService;
import CodeSquad.IssueTracker.comment.dto.CommentResponseDto;
import CodeSquad.IssueTracker.global.exception.NotFoundException;
import CodeSquad.IssueTracker.home.dto.IssueFilterCondition;
import CodeSquad.IssueTracker.issue.dto.*;
import CodeSquad.IssueTracker.issueAssignee.IssueAssigneeRepository;
import CodeSquad.IssueTracker.issueAssignee.IssueAssigneeService;
import CodeSquad.IssueTracker.issueAssignee.dto.IssueAssigneeResponse;
import CodeSquad.IssueTracker.issueLabel.IssueLabelRepository;
import CodeSquad.IssueTracker.issueLabel.IssueLabelService;
import CodeSquad.IssueTracker.issueLabel.dto.IssueLabelResponse;
import CodeSquad.IssueTracker.issueLabel.dto.SummaryLabelDto;
import CodeSquad.IssueTracker.milestone.MilestoneService;
import CodeSquad.IssueTracker.user.User;
import CodeSquad.IssueTracker.user.UserService;
import CodeSquad.IssueTracker.user.dto.SummaryUserDto;
import CodeSquad.IssueTracker.util.Uploader;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

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

    public IssueDetailResponse update(Long issueId, IssueUpdateDto updateParam, List<MultipartFile> files) throws IOException {

        String updateIssueFileUrl=null;

        if(files != null && !files.isEmpty()) {
            MultipartFile file = files.getFirst();
            updateIssueFileUrl = s3Uploader.upload(file);
        }

        issueRepository.update(issueId,updateParam,updateIssueFileUrl);

        if(updateParam.getAssigneeId() != null && !updateParam.getAssigneeId().isEmpty()) {
            issueAssigneeService.assignAssignees(issueId, updateParam.getAssigneeId());
        }

        if(updateParam.getLabelId() != null && !updateParam.getLabelId().isEmpty()) {
            issueLabelService.assignLabels(issueId, updateParam.getLabelId());
        }

        return toDetailResponse(findById(issueId));
    }

    public Issue findById(Long id) {
        return issueRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("존재하지 않는 이슈입니다"));
    }

    public Iterable<Issue> findAll(){
        return issueRepository.findAll();
    }

    public IssueDetailResponse createIssue(IssueCreateRequest request, List<MultipartFile> files, String loginId) throws IOException {
        User author = userService.findByLoginId(loginId);

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
        // ✅ 작성자 정보 조회
        User author = userService.findById(issue.getAuthorId());
        IssueWithAuthorInfo issueWithAuthorInfo = IssueWithAuthorInfo.from(issue, author);

        IssueDetailResponse response = new IssueDetailResponse();
        response.setIssue(issueWithAuthorInfo);

        // ✅ Assignees 정보 조회
        List<IssueAssigneeResponse> assignees =
                issueAssigneeService.findAssigneeResponsesByIssueId(issue.getIssueId());
        response.setAssignees(assignees);

        // ✅ Labels 정보 조회
        List<IssueLabelResponse> labels =
                issueLabelService.findIssueLabelResponsesByIssueId(issue.getIssueId());
        response.setLabels(labels);

        // ✅ Milestone 정보 조회
        milestoneService.findMilestoneResponsesByIssueId(issue.getIssueId())
                .ifPresent(response::setMilestone);

        // ✅ Comments 정보 조회
        List<CommentResponseDto> comments =
                commentService.findCommentResponsesByIssueId(issue.getIssueId());
        response.setComments(comments);

        return response;
    }

    public Iterable<FilteredIssueDto> findIssuesByFilter(int page, IssueFilterCondition condition) {
        List<FilteredIssueDto> issues = issueRepository.findIssuesByFilter(page, condition);
        List<Long> issueIds = issues.stream().map(FilteredIssueDto::getIssueId).toList();

        Map<Long, List<SummaryUserDto>> assigneesMap = issueAssigneeRepository.findSummaryAssigneesByIssueIds(issueIds);
        Map<Long, List<SummaryLabelDto>> labelsMap = issueLabelRepository.findSummaryLabelsByIssueIds(issueIds);

        for (FilteredIssueDto issue : issues) {
            issue.setAssignees(assigneesMap.getOrDefault(issue.getIssueId(), List.of()));
            issue.setLabels(labelsMap.getOrDefault(issue.getIssueId(), List.of()));
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

    public void updateIssueOpenState(IssueStatusUpdateRequest condition) {
        issueRepository.updateIsOpen(condition);
    }

    @Transactional
    public void deleteIssue(Long issueId) {
        commentService.deleteAllByIssueId(issueId);
        issueAssigneeService.unassignAssignee(issueId);
        issueLabelService.unassignLabel(issueId);
        issueRepository.deleteById(issueId);
    }

    public GroupedCountDto getGroupedIssueCounts(IssueFilterCondition condition) {
        return issueRepository.countGroupedIssues(condition);
    }

}

