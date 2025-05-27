package CodeSquad.IssueTracker.issue.dto;

import CodeSquad.IssueTracker.comment.dto.CommentResponseDto;
import CodeSquad.IssueTracker.issue.Issue;
import CodeSquad.IssueTracker.issueAssignee.dto.IssueAssigneeResponse;
import CodeSquad.IssueTracker.issueLabel.dto.IssueLabelResponse;
import CodeSquad.IssueTracker.milestone.dto.MilestoneResponse;
import lombok.Data;

import java.util.List;

@Data
public class IssueDetailResponse {
    private Issue issue;

    private List<IssueAssigneeResponse> assignees = List.of();
    private List<IssueLabelResponse> labels = List.of();
    private MilestoneResponse milestone = null;
    private List<CommentResponseDto> comments = List.of();
}

