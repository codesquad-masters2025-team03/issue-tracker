package CodeSquad.IssueTracker.issue.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GroupedCountDto {
    private int openCount;
    private int closedCount;
    private int totalCount;
}