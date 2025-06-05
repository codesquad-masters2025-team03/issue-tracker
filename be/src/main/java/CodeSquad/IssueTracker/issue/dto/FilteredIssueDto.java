package CodeSquad.IssueTracker.issue.dto;

import CodeSquad.IssueTracker.issueLabel.dto.SummaryLabelDto;
import CodeSquad.IssueTracker.milestone.dto.SummaryMilestoneDto;
import CodeSquad.IssueTracker.user.dto.SummaryUserDto;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class FilteredIssueDto {
    private Long issueId;
    private String title;
    private Boolean isOpen;
    private SummaryUserDto author;
    private List<SummaryUserDto> assignees;
    private List<SummaryLabelDto> labels;
    private SummaryMilestoneDto milestone;
    private LocalDateTime lastModifiedAt;
}
