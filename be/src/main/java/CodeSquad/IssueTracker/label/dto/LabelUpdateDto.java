package CodeSquad.IssueTracker.label.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LabelUpdateDto {

    private String name;
    private String description;
    private String color;

    public LabelUpdateDto(String name, String description, String color) {
        this.name = name;
        this.description = description;
        this.color = color;
    }
}
