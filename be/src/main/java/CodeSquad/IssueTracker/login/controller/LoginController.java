package CodeSquad.IssueTracker.login.controller;

import CodeSquad.IssueTracker.global.dto.BaseResponseDto;
import CodeSquad.IssueTracker.login.dto.LoginRequestDto;
import CodeSquad.IssueTracker.login.dto.LoginResponseDto;
import CodeSquad.IssueTracker.login.service.LoginService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import static CodeSquad.IssueTracker.global.message.SuccessMessage.LOGIN_SUCCESS;

@RestController
@RequiredArgsConstructor
public class LoginController {

    private final LoginService loginService;

    @PostMapping("/login")
    public BaseResponseDto<LoginResponseDto> login(@RequestBody @Valid LoginRequestDto loginRequestDto) {
        LoginResponseDto response = loginService.login(loginRequestDto);
        return BaseResponseDto.success(LOGIN_SUCCESS.getMessage(), response);
    }

}
