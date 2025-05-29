package CodeSquad.IssueTracker.oauth.dto;

import CodeSquad.IssueTracker.global.dto.BaseResponseDto;
import CodeSquad.IssueTracker.login.dto.LoginResponseDto;
import CodeSquad.IssueTracker.oauth.GithubOauthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static CodeSquad.IssueTracker.global.message.SuccessMessage.GITHUB_LOGIN_SUCCESS;

@RestController
@RequiredArgsConstructor
public class GithubLoginController {

    private final GithubOauthService githubOauthService;

    @GetMapping("/oauth/callback/github")
    public BaseResponseDto<LoginResponseDto> login(@RequestParam String code) {
        LoginResponseDto response = githubOauthService.login(code);
        return BaseResponseDto.success(GITHUB_LOGIN_SUCCESS.getMessage(), response);
    }
}
