package CodeSquad.IssueTracker.global.message;

import lombok.Getter;

@Getter
public enum SuccessMessage {
    GITHUB_LOGIN_SUCCESS("Github 로그인을 성공했습니다");

    private final String message;

    SuccessMessage(String message) {
        this.message = message;
    }
}
