package CodeSquad.IssueTracker.issueAssignee.dto;

import lombok.Data;

@Data
public class IssueAssigneeResponse {
    private Long id;
    private String nickname;
    private String profileImageUrl;


    public IssueAssigneeResponse(Long id, String nickname, String profileImageUrl) {
        this.id = id;
        this.nickname = nickname;
        this.profileImageUrl = profileImageUrl;
    }
}
