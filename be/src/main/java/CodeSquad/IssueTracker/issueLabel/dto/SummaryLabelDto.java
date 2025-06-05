package CodeSquad.IssueTracker.issueLabel.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SummaryLabelDto {
    private Long labelId;
    private String name;
    private String color;

    public SummaryLabelDto(Long labelId, String name, String color) {
        this.labelId = labelId;
        this.name = name;
        this.color = color;
    }
}
