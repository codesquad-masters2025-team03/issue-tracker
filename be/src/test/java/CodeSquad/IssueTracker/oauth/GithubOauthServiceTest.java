package CodeSquad.IssueTracker.oauth;

import CodeSquad.IssueTracker.jwt.util.JWTUtil;
import CodeSquad.IssueTracker.login.dto.LoginResponseDto;
import CodeSquad.IssueTracker.oauth.dto.GithubProfile;
import CodeSquad.IssueTracker.user.User;
import CodeSquad.IssueTracker.user.UserRepository;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
public class GithubOauthServiceTest {

    @Mock
    private GithubApiClient githubApiClient;

    @Mock
    private UserRepository userRepository;

    private JWTUtil jwtUtil;
    private GithubOauthService githubOauthService;

    private User user;
    private GithubProfile githubProfile;

    @BeforeEach
    void setup() {
        String testKey = "3Three-Squad-test-AccessKey-1234567890-abcdefg";
        jwtUtil = new JWTUtil(testKey, testKey);

        githubOauthService = new GithubOauthService(
                githubApiClient,
                jwtUtil,
                userRepository
        );

        user = User.builder()
                .loginId("user1@example.com")
                .nickName("user1")
                .profileImageUrl("https://my-issue-image-bucket.s3.ap-northeast-2.amazonaws.com/sample-image.png")
                .build();

        githubProfile = GithubProfile.builder()
                .loginId(user.getLoginId())
                .nickname(user.getNickName())
                .profileImageUrl(user.getProfileImageUrl())
                .build();
    }

    @Test
    @DisplayName("기존 사용자가 Github 로그인을 하면 로그인한 유저의 정보가 담긴 access token을 발급한다.")
    void githubLoginTest() {
        // given
        String code = "1234";
        String githubAccessToken = "github access token";

        Mockito.when(githubApiClient.getAccessToken(code)).thenReturn(githubAccessToken);
        Mockito.when(githubApiClient.getUserInfo(githubAccessToken)).thenReturn(githubProfile);
        Mockito.when(userRepository.findByLoginId(githubProfile.getLoginId()))
                .thenReturn(Optional.of(user));

        // when
        LoginResponseDto loginResponseDto = githubOauthService.login(code);
        Claims claims = jwtUtil.validateAccessToken(loginResponseDto.getAccessToken());

        // then
        assertThat(claims.get("loginUser")).isEqualTo(githubProfile.getLoginId());
    }

    @Test
    @DisplayName("신규 사용자가 Github 로그인하면 사용자 정보가 등록되고 access token을 발급한다.")
    void newUserLoginTest() {
        // given
        String code = "1234";
        String githubAccessToken = "github access token";

        Mockito.when(githubApiClient.getAccessToken(code)).thenReturn(githubAccessToken);
        Mockito.when(githubApiClient.getUserInfo(githubAccessToken)).thenReturn(githubProfile);
        Mockito.when(userRepository.findByLoginId(githubProfile.getLoginId()))
                .thenReturn(Optional.empty());
        Mockito.when(userRepository.save(user)).thenReturn(user);

        // when
        LoginResponseDto loginResponseDto = githubOauthService.login(code);

        Claims claims = jwtUtil.validateAccessToken(loginResponseDto.getAccessToken());

        // then
        assertThat(claims.get("loginUser")).isEqualTo(githubProfile.getLoginId());
    }
}
