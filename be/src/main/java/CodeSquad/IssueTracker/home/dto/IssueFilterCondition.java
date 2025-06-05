package CodeSquad.IssueTracker.home.dto;

import lombok.Data;

@Data
public class IssueFilterCondition {
    private Boolean isOpen = true;
    private Long label;
    private Long assignee;
    private Long author;
    private Long milestone;
    private Long commentedBy;
}
