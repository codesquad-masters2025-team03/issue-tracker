package CodeSquad.IssueTracker.comment;

import CodeSquad.IssueTracker.comment.dto.CommentUpdateDto;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class JdbcTemplatesCommentRepository implements CommentRepository {

    private final NamedParameterJdbcTemplate template;
    private final SimpleJdbcInsert jdbcInsert;

    public JdbcTemplatesCommentRepository(DataSource dataSource) {
        this.template = new NamedParameterJdbcTemplate(dataSource);
        this.jdbcInsert = new SimpleJdbcInsert(dataSource)
                .withTableName("comments")
                .usingGeneratedKeyColumns("id");
    }

    @Override
    public Comment save(Comment comment) {
        SqlParameterSource param = new BeanPropertySqlParameterSource(comment);
        Number key = jdbcInsert.executeAndReturnKey(param);
        comment.setCommentId(key.longValue());
        return comment;
    }

    @Override
    public Optional<Comment> findById(Long commentId) {
        String sql = "SELECT * FROM comments WHERE comment_Id = :commentId";
        Map<String, Object> param = Map.of("commentId", commentId);
        Comment comment = template.queryForObject(sql, param, commentRowMapper());
        return Optional.ofNullable(comment);
    }

    @Override
    public List<Comment> findAll() {
        String sql = "SELECT * FROM comments";
        return template.query(sql, commentRowMapper());
    }

    @Override
    public void deleteById(Long commentId) {
        String sql = "DELETE FROM comments WHERE comment_Id = :commentId";
        Map<String, Object> param = Map.of("commentId", commentId);
        template.update(sql, param);
    }

    @Override
    public void update(Long commentId, CommentUpdateDto updateDto) {
        String sql = "UPDATE comments SET content = :content, last_modified_at = NOW() WHERE comment_id = :id";
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("content", updateDto.getContent())
                .addValue("id", commentId);
        template.update(sql, param);
    }

    @Override
    public List<Comment> findByIssueId(Long issueId) {
        String sql ="SELECT * FROM comments WHERE issue_id = :issueId";
        Map<String, Object> param = Map.of("issueId", issueId);
        return template.query(sql, param, commentRowMapper());
    }

    @Override
    public void deleteByIssueId(Long issueId) {
        String sql = "DELETE FROM comments WHERE issue_id = :issueId";
        Map<String, Object> param = Map.of("issueId", issueId);
        template.update(sql, param);
    }

    private RowMapper<Comment> commentRowMapper(){
        return BeanPropertyRowMapper.newInstance(Comment.class);
    }
}
