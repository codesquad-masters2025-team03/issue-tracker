package CodeSquad.IssueTracker.oauth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GithubAccessTokenResponse {

    @JsonProperty("access_token")
    private String accessToken;
}
