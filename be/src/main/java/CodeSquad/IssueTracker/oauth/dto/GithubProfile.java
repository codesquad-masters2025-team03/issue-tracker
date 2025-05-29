package CodeSquad.IssueTracker.oauth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GithubProfile {

    @JsonProperty("login")
    private String loginId;

    @JsonProperty("name")
    private String nickname;

    @JsonProperty("avatar_url")
    private String profileImageUrl;
}
