package CodeSquad.IssueTracker.oauth;

import CodeSquad.IssueTracker.jwt.util.JWTUtil;
import CodeSquad.IssueTracker.login.dto.LoginResponseDto;
import CodeSquad.IssueTracker.oauth.dto.GithubProfile;
import CodeSquad.IssueTracker.user.User;
import CodeSquad.IssueTracker.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GithubOauthService {

    private final GithubApiClient githubApiClient;
    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;

    public LoginResponseDto login(String code) {
        String accessToken = githubApiClient.getAccessToken(code);
        GithubProfile githubProfile = githubApiClient.getUserInfo(accessToken);

        Optional<User> foundUser = userRepository.findByLoginId(githubProfile.getLoginId());

        if (foundUser.isPresent()) {
            return generateToken(foundUser.get());
        }

        User loginUser = userRepository.save(User.builder()
                .loginId(githubProfile.getLoginId())
                .nickName(githubProfile.getNickname())
                .profileImageUrl(githubProfile.getProfileImageUrl())
                .build());

        return generateToken(loginUser);
    }

    private LoginResponseDto generateToken(User targetUser) {
        String accessToken = jwtUtil.createAccessToken(targetUser);
        String refreshToken = jwtUtil.createRefreshToken();
        return new LoginResponseDto(accessToken, refreshToken);
    }
}
