package CodeSquad.IssueTracker.oauth;

import CodeSquad.IssueTracker.login.dto.LoginResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequiredArgsConstructor
public class GithubLoginController {

    private final GithubOauthService githubOauthService;

    @Value("${spring.frontendApiBaseUrl}")
    String frontedApiBaseUrl;

    @GetMapping("/oauth/callback/github")
    public String login(@RequestParam String code) {
        LoginResponseDto response = githubOauthService.login(code);
        String token = response.getAccessToken();
        return "redirect:" + frontedApiBaseUrl + "/oauth-success?token=" + token ;
    }
}
