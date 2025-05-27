package CodeSquad.IssueTracker.issue;

import CodeSquad.IssueTracker.home.dto.IssueFilterCondition;
import CodeSquad.IssueTracker.issue.dto.FilteredIssueDto;
import CodeSquad.IssueTracker.issue.dto.IssueUpdateDto;

import java.util.List;
import java.util.Optional;

public interface IssueRepository {

    Issue save(Issue issue);

    void update(Long issueId, IssueUpdateDto updateParam);

    Optional<Issue> findById(Long issueId);

    List<Issue> findAll();

    List<FilteredIssueDto> findIssuesByFilter(int page, IssueFilterCondition condition);

    int countFilteredIssuesByIsOpen(boolean isOpen, IssueFilterCondition condition);
}
