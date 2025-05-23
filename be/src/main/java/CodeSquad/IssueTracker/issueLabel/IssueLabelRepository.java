package CodeSquad.IssueTracker.issueLabel;

import CodeSquad.IssueTracker.issueLabel.dto.SummaryLabelDto;
import CodeSquad.IssueTracker.issueLabel.dto.IssueLabelResponse;

import java.util.List;

public interface IssueLabelRepository {

    void save(IssueLabel issueLabel);

    void deleteByIssueId(Long issueId);

    List<IssueLabelResponse> returnedIssueLabelResponsesByIssueId(Long issueId);

    List<SummaryLabelDto> findSummaryLabelByIssueId(Long issueId);
}
