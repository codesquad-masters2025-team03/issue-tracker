package CodeSquad.IssueTracker.global.exception;

import CodeSquad.IssueTracker.global.exception.message.Error;
import CodeSquad.IssueTracker.global.exception.model.CustomException;
import org.springframework.http.HttpStatus;

public class NotFoundException extends CustomException {

    @Override
    public HttpStatus getHttpStatus() {
        return super.getHttpStatus();
    }

    protected NotFoundException() {
        super(Error.NOT_FOUND_EXCEPTION);
    }

    public NotFoundException(String formattedMessage) {
        super(Error.NOT_FOUND_EXCEPTION, formattedMessage);
    }
}
