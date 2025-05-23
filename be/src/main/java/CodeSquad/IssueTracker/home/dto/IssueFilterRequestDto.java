package CodeSquad.IssueTracker.home.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IssueFilterRequestDto {
    private Boolean isOpen;
    private Long label;
    private Long assignee;
    private Long author;
    private Long milestone;
    private Long commentedBy;
}
