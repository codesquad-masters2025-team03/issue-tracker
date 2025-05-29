package CodeSquad.IssueTracker.oauth;

import CodeSquad.IssueTracker.oauth.dto.GithubAccessTokenRequest;
import CodeSquad.IssueTracker.oauth.dto.GithubAccessTokenResponse;
import CodeSquad.IssueTracker.oauth.dto.GithubProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Objects;


@Component
@RequiredArgsConstructor
public class GithubApiClient {

    private final WebClient webClient;

    @Value("${spring.github.client-id}")
    private String clientId;

    @Value("${spring.github.client-secret}")
    private String clientSecret;

    @Value("${spring.github.redirect-uri}")
    private String redirectUri;

    /*
     * GitHub OAuth 요청에 필요한 클라이언트 ID, 시크릿, 리다이렉트 URI를 포함해
     * 인가 코드를 사용하여 Access Token을 받아옵니다.
     */
    public String getAccessToken(String code) {
        String url = "https://github.com/login/oauth/access_token";

        GithubAccessTokenRequest accessTokenRequest = GithubAccessTokenRequest.builder()
                .client_id(clientId)
                .client_secret(clientSecret)
                .redirect_uri(redirectUri)
                .code(code)
                .build();

        GithubAccessTokenResponse githubAccessToken = webClient.post()
                .uri(url)
                .headers(headers -> {
                    headers.setAccept(List.of(MediaType.APPLICATION_JSON));
                    headers.setContentType(MediaType.APPLICATION_JSON);
                })
                .bodyValue(accessTokenRequest)
                .retrieve()
                .bodyToMono(GithubAccessTokenResponse.class)
                .block(); // 결과를 기다려서 동기적으로 반환

        return Objects.requireNonNull(githubAccessToken).getAccessToken();
    }

    /*
     * GitHub OAuth로 받은 Access Token을 사용해
     * GitHub 사용자 정보를 조회합니다.
     */
    public GithubProfile getUserInfo(String accessToken) {
        String url = "https://api.github.com/user";

        return webClient.get()
                .uri(url)
                .headers(headers -> {
                    headers.setBearerAuth(accessToken);
                    headers.setAccept(List.of(MediaType.APPLICATION_JSON));
                })
                .retrieve()
                .bodyToMono(GithubProfile.class)
                .block(); // 결과를 기다려서 동기적으로 반환
    }
}
