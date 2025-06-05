package CodeSquad.IssueTracker.issueAssignee;

import CodeSquad.IssueTracker.user.dto.SummaryUserDto;
import CodeSquad.IssueTracker.issueAssignee.dto.IssueAssigneeResponse;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.util.*;

@Repository
public class JdbcTemplateAssigneeRepository implements IssueAssigneeRepository {

    private final NamedParameterJdbcTemplate template;
    private final SimpleJdbcInsert jdbcInsert;

    public JdbcTemplateAssigneeRepository(DataSource dataSource) {
        this.template = new NamedParameterJdbcTemplate(dataSource);
        this.jdbcInsert = new SimpleJdbcInsert(dataSource)
                .withTableName("issue_assignee")
                .usingGeneratedKeyColumns("issue_assignee_id");
    }

    @Override
    public void save(IssueAssignee issueAssignee) {
        SqlParameterSource param = new BeanPropertySqlParameterSource(issueAssignee);
        Number key = jdbcInsert.executeAndReturnKey(param);
        issueAssignee.setIssueAssigneeId(key.longValue());
    }

    @Override
    public void deleteByIssueId(Long issueId) {
        String sql = "DELETE FROM issue_assignee WHERE issue_id = :issueId";
        template.update(sql, Map.of("issueId", issueId));
    }

    @Override
    public List<IssueAssigneeResponse> findAssigneeResponsesByIssueId(Long issueId) {
        String sql = """
        SELECT 
            u.id AS assignee_id,
            u.nick_name AS nickname,
            u.profile_image_url AS profile_image_url
        FROM issue_assignee ia
        JOIN users u ON ia.assignee_id = u.id
        WHERE ia.issue_id = :issueId
        """;

        return template.query(sql, Map.of("issueId", issueId), (rs, rowNum) ->
                new IssueAssigneeResponse(
                        rs.getLong("assignee_id"),
                        rs.getString("nickname"),
                        rs.getString("profile_image_url")
                )
        );
    }
    @Override
    public Map<Long, List<SummaryUserDto>> findSummaryAssigneesByIssueIds(List<Long> issueIds) {
        if (issueIds == null || issueIds.isEmpty()) {
            return Collections.emptyMap();  // ✅ 리스트가 비면 SQL 실행 X
        }

        String sql = """
        SELECT ia.issue_id, u.id, u.nick_name, u.profile_image_url
        FROM issue_assignee ia
        JOIN users u ON ia.assignee_id = u.id
        WHERE ia.issue_id IN (:ids)
    """;

        MapSqlParameterSource params = new MapSqlParameterSource("ids", issueIds);

        return template.query(sql, params, rs -> {
            Map<Long, List<SummaryUserDto>> result = new HashMap<>();
            while (rs.next()) {
                long issueId = rs.getLong("issue_id");
                SummaryUserDto user = new SummaryUserDto(rs.getLong("id"), rs.getString("nick_name"), rs.getNString("profile_image_url"));
                result.computeIfAbsent(issueId, k -> new ArrayList<>()).add(user);
            }
            return result;
        });
    }


    @Override
    public List<SummaryUserDto> findSummaryAssigneeByIssueId(Long issueId) {
        String sql = "SELECT u.id, u.nick_name FROM issue_assignee ia LEFT JOIN users u ON ia.assignee_id = u.id WHERE ia.issue_id = :issueId ";
        return template.query(sql, Map.of("issueId", issueId), summaryUserRowMapper());
    }

    private RowMapper<SummaryUserDto> summaryUserRowMapper(){
        return BeanPropertyRowMapper.newInstance(SummaryUserDto.class);
    }
}
