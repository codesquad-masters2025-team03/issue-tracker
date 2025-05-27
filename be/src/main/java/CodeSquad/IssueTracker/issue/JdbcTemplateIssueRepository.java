package CodeSquad.IssueTracker.issue;


import CodeSquad.IssueTracker.home.dto.IssueFilterCondition;
import CodeSquad.IssueTracker.issue.dto.FilteredIssueDto;
import CodeSquad.IssueTracker.issue.dto.IssueUpdateDto;
import CodeSquad.IssueTracker.milestone.dto.SummaryMilestoneDto;
import CodeSquad.IssueTracker.user.dto.SummaryUserDto;
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
public class JdbcTemplateIssueRepository implements IssueRepository {

    public static final int LIMIT_SIZE = 20;

    private final NamedParameterJdbcTemplate template;
    private final SimpleJdbcInsert jdbcInsert;

    public JdbcTemplateIssueRepository(DataSource dataSource) {
        this.template = new NamedParameterJdbcTemplate(dataSource);
        this.jdbcInsert = new SimpleJdbcInsert(dataSource)
                .withTableName("issues")
                .usingGeneratedKeyColumns("issue_id");
    }

    @Override
    public Issue save(Issue issue) {
        SqlParameterSource param = new BeanPropertySqlParameterSource(issue);
        Number key = jdbcInsert.executeAndReturnKey(param);
        issue.setIssueId((key.longValue()));
        return issue;
    }

    @Override
    public void update(Long issueId, IssueUpdateDto updateParam) {
        String sql = "UPDATE issues SET title = :title, content = :content, is_Open = :isOpen, timestamp = :timestamp, assignee_Id = :assigneeId, milestone_Id = :milestoneId WHERE id = :id";
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("title", updateParam.getTitle())
                .addValue("content", updateParam.getContent())
                .addValue("isOpen", updateParam.getIsOpen())
                .addValue("timestamp", updateParam.getTimestamp())
                .addValue("milestoneId", updateParam.getMilestoneId())
                .addValue("assigneeId", updateParam.getAssigneeId())
                .addValue("id", issueId);
        template.update(sql, param);
    }

    @Override
    public Optional<Issue> findById(Long issueId) {
        String sql = "SELECT * FROM issues WHERE issue_Id = :issueId";
        Map<String, Object> param = Map.of("issueId", issueId);
        Issue issue = template.queryForObject(sql, param, issueRowMapper());
        return Optional.ofNullable(issue);
    }

    @Override
    public List<Issue> findAll() {
        String sql = "SELECT * FROM issues";
        return template.query(sql, issueRowMapper());
    }

    @Override
    public List<FilteredIssueDto> findIssuesByFilter(int page, IssueFilterCondition condition) {
        IssueFilterQueryBuilder queryBuilder = new IssueFilterQueryBuilder(condition.getIsOpen(), condition);
        String sql = """
            SELECT DISTINCT
            i.issue_id, i.title, i.is_open, i.author_id, u.nick_name, i.milestone_id, m.name AS milestone_name, i.last_modified_at
            FROM issues i
            LEFT JOIN milestones m ON i.milestone_id = m.milestone_id
            LEFT JOIN users u ON i.author_id = u.id
            LEFT JOIN issue_assignee ia ON i.issue_id = ia.issue_id
            LEFT JOIN issue_label il ON i.issue_id = il.issue_id
            LEFT JOIN comments c ON i.issue_id = c.issue_id
         """ + queryBuilder.getWhereClause() + """
            ORDER BY i.issue_id DESC LIMIT :limit OFFSET :page
         """;

        MapSqlParameterSource params = queryBuilder.getParams();
        params.addValue("limit", LIMIT_SIZE);
        params.addValue("page", (page - 1) * LIMIT_SIZE);

        return template.query(sql.toString(), params, (rs, rowNum) -> {
            FilteredIssueDto dto = new FilteredIssueDto();
            dto.setIssueId(rs.getLong("issue_id"));
            dto.setTitle(rs.getString("title"));
            dto.setIsOpen(rs.getBoolean("is_open"));
            dto.setAuthor(new SummaryUserDto(rs.getLong("author_id"), rs.getString("nick_name")));
            dto.setMilestone(new SummaryMilestoneDto(rs.getLong("milestone_id"), rs.getString("milestone_name")));
            dto.setLastModifiedAt(rs.getTimestamp("last_modified_at").toLocalDateTime());
            return dto;
        });
    }

    @Override
    public int countFilteredIssuesByIsOpen(boolean isOpen, IssueFilterCondition condition) {
        String countSql = """
            SELECT COUNT(DISTINCT i.issue_id)
            FROM issues i
            LEFT JOIN milestones m ON i.milestone_id = m.milestone_id
            LEFT JOIN users u ON i.author_id = u.id
            LEFT JOIN issue_assignee ia ON i.issue_id = ia.issue_id
            LEFT JOIN issue_label il ON i.issue_id = il.issue_id
            LEFT JOIN comments c ON i.issue_id = c.issue_id
            """;

        IssueFilterQueryBuilder queryBuilder = new IssueFilterQueryBuilder(isOpen, condition);
        String whereClause = queryBuilder.getWhereClause().toString();
        String finalSql = countSql + whereClause;

        return template.queryForObject(finalSql, queryBuilder.getParams(), Integer.class);
    }

    private RowMapper<Issue> issueRowMapper() {
        return BeanPropertyRowMapper.newInstance(Issue.class);
    }
}
