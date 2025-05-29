package CodeSquad.IssueTracker.oauth.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class GithubAccessTokenRequest {
    private final String client_id;
    private final String client_secret;
    private final String code;
    private final String redirect_uri;
}
