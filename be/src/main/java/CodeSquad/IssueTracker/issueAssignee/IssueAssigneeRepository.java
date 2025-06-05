package CodeSquad.IssueTracker.issueAssignee;

import CodeSquad.IssueTracker.user.dto.SummaryUserDto;
import CodeSquad.IssueTracker.issueAssignee.dto.IssueAssigneeResponse;

import java.util.List;
import java.util.Map;

public interface IssueAssigneeRepository {

    void save(IssueAssignee issueAssignee);

    void deleteByIssueId(Long issueId);

    List<IssueAssigneeResponse> findAssigneeResponsesByIssueId(Long issueId);

    List<SummaryUserDto> findSummaryAssigneeByIssueId(Long issueId);

    Map<Long, List<SummaryUserDto>> findSummaryAssigneesByIssueIds(List<Long> issueIds);
}
