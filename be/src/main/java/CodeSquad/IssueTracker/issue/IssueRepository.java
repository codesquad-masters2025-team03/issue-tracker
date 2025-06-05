package CodeSquad.IssueTracker.issue;

import CodeSquad.IssueTracker.home.dto.IssueFilterCondition;
import CodeSquad.IssueTracker.issue.dto.FilteredIssueDto;
import CodeSquad.IssueTracker.issue.dto.GroupedCountDto;
import CodeSquad.IssueTracker.issue.dto.IssueStatusUpdateRequest;
import CodeSquad.IssueTracker.issue.dto.IssueUpdateDto;

import java.util.List;
import java.util.Optional;

public interface IssueRepository {

    Issue save(Issue issue);

    void update(Long issueId, IssueUpdateDto updateParam ,String issueFileUrl);

    Optional<Issue> findById(Long issueId);

    List<Issue> findAll();

    List<FilteredIssueDto> findIssuesByFilter(int page, IssueFilterCondition condition);

    int countFilteredIssuesByIsOpen(boolean isOpen, IssueFilterCondition condition);

    void updateIsOpen(IssueStatusUpdateRequest condition);

    void deleteById(Long issueId);

    void clearMilestoneFromIssues(Long milestoneId);

    GroupedCountDto countGroupedIssues(IssueFilterCondition condition);
}
