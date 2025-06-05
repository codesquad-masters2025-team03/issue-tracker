package CodeSquad.IssueTracker.issueAssignee.dto;

import lombok.Data;

@Data
public class IssueAssigneeResponse {
    private Long id;
    private String nickName;
    private String profileImageUrl;


    public IssueAssigneeResponse(Long id, String nickName, String profileImageUrl) {
        this.id = id;
        this.nickName = nickName;
        this.profileImageUrl = profileImageUrl;
    }
}
