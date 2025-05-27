package CodeSquad.IssueTracker.milestone;


import CodeSquad.IssueTracker.milestone.dto.MilestoneResponse;
import CodeSquad.IssueTracker.milestone.dto.MilestoneUpdateDto;

import java.util.List;
import java.util.Optional;

public interface MilestoneRepository {
    Milestone save(Milestone milestone);
    Optional<Milestone> findById(Long milestoneId);
    List<Milestone> findAll();
    void deleteById(Long milestoneId);
    void update(Long id, MilestoneUpdateDto updateDto);
    MilestoneResponse findMilestoneResponsesByIssueId(Long issueId);
}
