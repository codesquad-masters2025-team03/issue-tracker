package CodeSquad.IssueTracker.global;

import CodeSquad.IssueTracker.global.dto.BaseResponseDto;
import CodeSquad.IssueTracker.global.exception.ApplicationException;
import CodeSquad.IssueTracker.jwt.exception.JwtValidationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    @ExceptionHandler
    public ResponseEntity<BaseResponseDto<String>> handleCustomExceptions(ApplicationException e) {
        log.error(e.getMessage(), e);
        return ResponseEntity
                .status(e.getHttpStatus())
                .body(BaseResponseDto.failure(e.getMessage()));
    }

    @ExceptionHandler
    public ResponseEntity<BaseResponseDto<String>> handleValidationException(MethodArgumentNotValidException e) {
        FieldError fieldError = e.getBindingResult().getFieldError();

        log.error(fieldError.getDefaultMessage());

        return ResponseEntity
                .badRequest()
                .body(BaseResponseDto.failure(fieldError.getDefaultMessage()));
    }

    @ExceptionHandler
    public ResponseEntity<BaseResponseDto<String>> handleJwtValidationException(JwtValidationException e) {
        log.error(e.getMessage());
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(BaseResponseDto.failure(e.getMessage()));
    }
}
