package CodeSquad.IssueTracker.milestone;

import CodeSquad.IssueTracker.issue.IssueRepository;
import CodeSquad.IssueTracker.milestone.dto.MilestoneIssueCount;
import CodeSquad.IssueTracker.milestone.dto.MilestoneListResponse;
import CodeSquad.IssueTracker.milestone.dto.MilestoneResponse;
import CodeSquad.IssueTracker.milestone.dto.MilestoneUpdateDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MilestoneService {

    private final MilestoneRepository milestoneRepository;
    private final IssueRepository issueRepository;

    public Milestone save(Milestone milestone) {
        return milestoneRepository.save(milestone);
    }

    public Iterable<Milestone> findAll() {
        return milestoneRepository.findAll();
    }

    public void update(Long id, MilestoneUpdateDto updateDto) {
        milestoneRepository.update(id, updateDto);
    }

    @Transactional
    public void deleteById(Long id) {
        issueRepository.clearMilestoneFromIssues(id);
        milestoneRepository.deleteById(id);
    }

    public Optional<MilestoneResponse> findMilestoneResponsesByIssueId(Long issueId) {
        return milestoneRepository.findMilestoneResponsesByIssueId(issueId);
    }

    public MilestoneListResponse getMilestonesByStatus(boolean isOpen) {
        List<Milestone> milestones = milestoneRepository.findByStatus(isOpen);

        List<MilestoneResponse> milestoneResponses = milestones.stream()
                .map(milestone -> {
                    setCalculateProcessingRate(milestone);
                    MilestoneResponse response = MilestoneResponse.convertMilestoneResponse(milestone);
                    setOpenClosedIssueCount(milestone, response);
                    return response;
                })
                .toList();

        return new MilestoneListResponse(
                milestoneResponses,
                countOpenAndClose(true),
                countOpenAndClose(false)
        );
    }

    private Integer countOpenAndClose(boolean isOpen){
        return milestoneRepository.countByStatus(isOpen);
    }

    private void setCalculateProcessingRate(Milestone milestone){
        milestone.setProcessingRate(milestoneRepository.calculateProcessingRate(milestone));
    }

    private void setOpenClosedIssueCount(Milestone milestone, MilestoneResponse response) {
        MilestoneIssueCount count = milestoneRepository.getIssueCountByMilestoneId(milestone.getMilestoneId());
        response.setOpenIssue(count.getOpenCount());
        response.setCloseIssue(count.getClosedCount());
    }

}
