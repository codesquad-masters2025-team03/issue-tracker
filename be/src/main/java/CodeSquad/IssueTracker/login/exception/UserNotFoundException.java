package CodeSquad.IssueTracker.login.exception;

import CodeSquad.IssueTracker.global.exception.ApplicationException;
import org.springframework.http.HttpStatus;

public class UserNotFoundException extends ApplicationException {

    public UserNotFoundException() {
        super("존재하지 않는 회원입니다.", HttpStatus.NOT_FOUND);
    }
}
