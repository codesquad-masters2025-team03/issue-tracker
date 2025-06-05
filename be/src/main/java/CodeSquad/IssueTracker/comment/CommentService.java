package CodeSquad.IssueTracker.comment;

import CodeSquad.IssueTracker.comment.dto.CommentRequestDto;
import CodeSquad.IssueTracker.comment.dto.CommentResponseDto;
import CodeSquad.IssueTracker.comment.dto.CommentUpdateDto;
import CodeSquad.IssueTracker.global.exception.NotFoundException;
import CodeSquad.IssueTracker.user.User;
import CodeSquad.IssueTracker.user.UserService;
import CodeSquad.IssueTracker.util.Uploader;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserService userService;
    private final Uploader s3Uploader;

    public CommentResponseDto createComment(CommentRequestDto dto, List<MultipartFile> files,Long authorId) throws IOException {
        Comment comment = Comment.createComment(dto.getIssueId(), dto.getContent(), authorId);

        if(files != null && !files.isEmpty()){
            MultipartFile file = files.getFirst();
            String issueFileUrl = s3Uploader.upload(file);
            comment.setIssueFileUrl(issueFileUrl);
        }

        commentRepository.save(comment);

        User author = userService.findById(authorId);
        return new CommentResponseDto(comment,author); //이중으로 null 체크를 해야할까?
    }

    public Iterable<Comment> findAll() {
        return commentRepository.findAll();
    }

    public void deleteById(Long id) {
        commentRepository.deleteById(id);
    }

    public Comment findById(Long id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("존재하지 않는 댓글항목입니다"));
    }

    public CommentResponseDto update(Long commentId, CommentUpdateDto dto,  List<MultipartFile> files,Long requesterId) throws IOException {
        Comment comment = findById(commentId);

        if(files != null && !files.isEmpty()){
            MultipartFile file = files.getFirst();
            String issueFileUrl = s3Uploader.upload(file);
            comment.setIssueFileUrl(issueFileUrl);
        }

        comment.update(dto.getContent(), requesterId );
        return new CommentResponseDto(comment,userService.findById(requesterId));
    }

    public List<Comment> findByIssueId(Long issueId) {
        return commentRepository.findByIssueId(issueId);
    }

    public List<CommentResponseDto> findCommentResponsesByIssueId(Long issueId) {
        List<Comment> comments = commentRepository.findByIssueId(issueId);

        return comments.stream()
                .map(comment -> {
                    User author = userService.findById(comment.getAuthorId());
                    return new CommentResponseDto(comment, author);
                })
                .toList();
    }

    @Transactional
    public void  deleteAllByIssueId(Long issueId) {
        commentRepository.deleteByIssueId(issueId);
    }

}
