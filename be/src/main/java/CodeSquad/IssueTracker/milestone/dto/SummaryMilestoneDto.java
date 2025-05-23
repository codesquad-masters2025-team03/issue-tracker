package CodeSquad.IssueTracker.milestone.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SummaryMilestoneDto {
    private Long milestoneId;
    private String name;
}
