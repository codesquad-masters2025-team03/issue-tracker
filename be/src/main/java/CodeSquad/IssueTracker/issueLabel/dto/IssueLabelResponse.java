package CodeSquad.IssueTracker.issueLabel.dto;

import lombok.Data;

@Data
public class IssueLabelResponse {
    private Long id;
    private String name;
    private String color;

    public IssueLabelResponse(Long id, String name, String color) {
        this.id = id;
        this.name = name;
        this.color = color;
    }
}
