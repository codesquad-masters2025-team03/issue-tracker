package CodeSquad.IssueTracker.login;

import CodeSquad.IssueTracker.jwt.util.JWTUtil;
import CodeSquad.IssueTracker.login.dto.LoginRequestDto;
import CodeSquad.IssueTracker.login.dto.LoginResponseDto;
import CodeSquad.IssueTracker.login.exception.PasswordMismatchException;
import CodeSquad.IssueTracker.login.exception.UserNotFoundException;
import CodeSquad.IssueTracker.login.service.LoginService;
import CodeSquad.IssueTracker.user.JdbcTemplatesUserRepository;
import CodeSquad.IssueTracker.user.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class LoginServiceTest {

    @Mock
    private JdbcTemplatesUserRepository userRepository;

    @Mock
    private JWTUtil jwtUtil;

    @InjectMocks
    private LoginService loginService;

    @Test
    @DisplayName("로그인 성공 시 AccessToken과 RefreshToken이 정상 발급된다")
    void loginSuccessTest() {
        // given
        String loginId = "testUserId";
        String password = "1234";
        String accessToken = "access-token";
        String refreshToken = "refresh-token";

        LoginRequestDto loginRequest = new LoginRequestDto(loginId, password);
        User mockUser = User.builder()
                .id(1L)
                .loginId(loginId)
                .password(password)
                .nickName("testUser")
                .build();

        Mockito.when(userRepository.findByLoginId(loginId)).thenReturn(Optional.of(mockUser));
        Mockito.when(jwtUtil.createAccessToken(Mockito.any(User.class))).thenReturn(accessToken);
        Mockito.when(jwtUtil.createRefreshToken()).thenReturn(refreshToken);

        // when
        LoginResponseDto response = loginService.login(loginRequest);

        // then
        assertNotNull(response);
        assertEquals(accessToken, response.getAccessToken());
        assertEquals(refreshToken, response.getRefreshToken());
    }

    @Test
    @DisplayName("비밀번호가 틀리면 PasswordMismatchException이 발생한다")
    void loginWithWrongPasswordTest() {
        // given
        String loginId = "testUserId";
        String correctPassword = "1234";
        String wrongPassword = "5678";

        LoginRequestDto loginRequest = new LoginRequestDto(loginId, wrongPassword);
        User mockUser = User.builder()
                .id(1L)
                .loginId(loginId)
                .password(correctPassword)
                .nickName("testUser")
                .build();

        Mockito.when(userRepository.findByLoginId(loginId)).thenReturn(Optional.of(mockUser));

        // when & then
        assertThrows(PasswordMismatchException.class, () -> loginService.login(loginRequest));
    }

    @Test
    @DisplayName("“존재하지 않는 아이디로 로그인하면 UserNotFoundException이 발생한다.")
    void loginWithNonExistentLoginIdTest() {
        // given
        String nonExistentLoginId = "nonExistentTestUserId";
        String password = "1234";

        LoginRequestDto loginRequest = new LoginRequestDto(nonExistentLoginId, password);

        Mockito.when(userRepository.findByLoginId(nonExistentLoginId)).thenReturn(Optional.empty());

        // when & then
        assertThrows(UserNotFoundException.class, () -> loginService.login(loginRequest));
    }
}
