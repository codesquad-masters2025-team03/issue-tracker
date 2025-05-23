package CodeSquad.IssueTracker.issueLabel.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SummaryLabelDto {
    private Long labelId;
    private String name;
    private String color;
}
