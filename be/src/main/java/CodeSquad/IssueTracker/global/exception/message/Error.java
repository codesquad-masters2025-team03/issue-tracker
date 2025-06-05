package CodeSquad.IssueTracker.global.exception.message;

import lombok.Getter;
import org.springframework.http.HttpStatus;

public enum Error {

    UserNotFoundException("해당 유저를 찾을 수 없습니다", HttpStatus.NOT_FOUND),
    NO_PARAMETERS("%s 는 필수로 입력해야 합니다.",HttpStatus.BAD_REQUEST),
    NO_USER_EXCEPTION("없는 유저이거나 탈퇴한 유저 입니다",HttpStatus.NOT_FOUND),
    NO_AUTHORITY_EXCEPTION("권한이 없습니다",HttpStatus.UNAUTHORIZED),
    PASSWORD_MISMATCH_EXCEPTION("비밀번호가 일치하지 않습니다",HttpStatus.UNAUTHORIZED),
    NOT_FOUND_EXCEPTION("존재하지 않는 데이터를 요청했습니다.",HttpStatus.NOT_FOUND),
    CUSTOM_MESSAGE_EXCEPTION("%s ",HttpStatus.UNAUTHORIZED);

    @Getter
    private final String message;
    @Getter
    private final HttpStatus status;

    Error(String message, HttpStatus status) {
        this.message = message;
        this.status = status;
    }

    public String formatMessageOf(String message) {
        return String.format(this.message, message);
    }

}
