package CodeSquad.IssueTracker.issue.dto;

import lombok.Data;

import java.util.List;

@Data
public class IssueUpdateDto {

    private String title;
    private String content;
    private Boolean isOpen;
    private List<Long> assigneeId;
    private List<Long> labelId;
    private Long milestoneId;

}
