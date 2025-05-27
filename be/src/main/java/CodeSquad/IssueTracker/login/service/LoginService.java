package CodeSquad.IssueTracker.login.service;

import CodeSquad.IssueTracker.login.dto.LoginRequestDto;
import CodeSquad.IssueTracker.login.dto.LoginResponseDto;
import CodeSquad.IssueTracker.login.exception.PasswordMismatchException;
import CodeSquad.IssueTracker.login.exception.UserNotFoundException;
import CodeSquad.IssueTracker.jwt.util.JWTUtil;
import CodeSquad.IssueTracker.user.User;
import CodeSquad.IssueTracker.user.JdbcTemplatesUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Log4j2
@Service
@RequiredArgsConstructor
public class LoginService {

    private final JdbcTemplatesUserRepository userRepository;
    private final JWTUtil jwtUtil;

    /*
    사용자가 입력한 loginId, password와 대조하여 일치하면 Access Token과 Refresh Token을 반환하고 아니면 예외를 발생시킵니다. Refresh Token은 DB에도 저장합니다.
     */
    @Transactional
    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
        User targetUser = getUser(loginRequestDto.getLoginId());
        validatePassword(targetUser, loginRequestDto.getPassword());
        return generateToken(targetUser);
    }

    private User getUser(String loginId) {
        Optional<User> foundUser = userRepository.findByLoginId(loginId);
        return foundUser.orElseThrow(UserNotFoundException::new);
    }

    private void validatePassword(User targetUser, String password) {
        if (!targetUser.getPassword().equals(password)) {
            throw new PasswordMismatchException();
        }
    }

    private LoginResponseDto generateToken(User targetUser) {
        String accessToken = jwtUtil.createAccessToken(targetUser);
        String refreshToken = jwtUtil.createRefreshToken();
        return new LoginResponseDto(accessToken, refreshToken);
    }
}
