package CodeSquad.IssueTracker.issueAssignee;

import CodeSquad.IssueTracker.issueAssignee.dto.IssueAssigneeResponse;
import CodeSquad.IssueTracker.user.User;
import CodeSquad.IssueTracker.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.ref.PhantomReference;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IssueAssigneeService {

    private final IssueAssigneeRepository issueAssigneeRepository;

    @Transactional
    public void assignAssignees(Long issueId, List<Long> assigneeIds) {
        // 기존 담당자 모두 제거 (전체 덮어쓰기 정책)
        issueAssigneeRepository.deleteByIssueId(issueId);

        for (Long assigneeId : assigneeIds) {
            IssueAssignee entity = new IssueAssignee();
            entity.setIssueId(issueId);
            entity.setAssigneeId(assigneeId);
            entity.setLastModifiedAt(LocalDateTime.now());
            issueAssigneeRepository.save(entity);
        }
    }

    @Transactional
    public List<IssueAssigneeResponse> findAssigneeResponsesByIssueId(Long issueId) {
        return issueAssigneeRepository.findAssigneeResponsesByIssueId(issueId);
    }


}
