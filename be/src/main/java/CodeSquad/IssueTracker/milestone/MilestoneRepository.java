package CodeSquad.IssueTracker.milestone;


import CodeSquad.IssueTracker.milestone.dto.MilestoneIssueCount;
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
    Optional<MilestoneResponse> findMilestoneResponsesByIssueId(Long issueId);
    List<Milestone> findByStatus(boolean isOpen);
    Long calculateProcessingRate(Milestone milestone);
    Integer countByStatus(boolean isOpen);
    MilestoneIssueCount getIssueCountByMilestoneId(Long milestoneId);
}
