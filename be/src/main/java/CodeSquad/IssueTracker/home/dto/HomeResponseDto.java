package CodeSquad.IssueTracker.home.dto;

import CodeSquad.IssueTracker.issue.dto.FilteredIssueDto;
import CodeSquad.IssueTracker.label.Label;
import CodeSquad.IssueTracker.milestone.Milestone;
import CodeSquad.IssueTracker.user.dto.DetailUserDto;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class HomeResponseDto {
    private Iterable<FilteredIssueDto> issues;
    private Iterable<DetailUserDto> users;
    private Iterable<Label> labels;
    private Iterable<Milestone> milestones;
}
