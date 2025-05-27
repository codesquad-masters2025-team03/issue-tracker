package CodeSquad.IssueTracker.comment;

import CodeSquad.IssueTracker.global.exception.NoAuthorityException;
import CodeSquad.IssueTracker.global.exception.NoParametersException;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@Data
@Table("comments")
public class Comment {
    @Id
    private Long commentId;
    private Long issueId;       // ✅ 이슈 ID: 이 댓글이 속한 이슈
    private String content;
    private Long authorId;
    private LocalDateTime lastModifiedAt;
    private String imageUrl;

    public Comment() {
    }

    public Comment(Long commentId, Long issueId, String content, Long authorId, LocalDateTime lastModifiedAt, String imageUrl) {
        this.commentId = commentId;
        this.issueId = issueId;
        this.content = content;
        this.authorId = authorId;
        this.lastModifiedAt = lastModifiedAt;
        this.imageUrl = imageUrl;
    }

    public static Comment createComment(Long issueId, String content, Long authorId, String imageUrl) {
        if (content == null || content.isBlank()) {
            throw new NoParametersException("댓글 내용은 필수입니다.", HttpStatus.BAD_REQUEST);
        }
        return new Comment(null, issueId, content, authorId, LocalDateTime.now(), imageUrl);
    }

    private void verifyAuthor(Long requesterId) {
        if (!this.authorId.equals(requesterId)) {
            throw new NoAuthorityException("작성자만 댓글을 수정할 수 있습니다.", HttpStatus.valueOf(401));
        }
    }

    public void update(String content, String imageUrl, Long requesterId) {
        verifyAuthor(requesterId);
        this.content = content;
        this.imageUrl = imageUrl;
        this.lastModifiedAt = LocalDateTime.now();
    }


}

