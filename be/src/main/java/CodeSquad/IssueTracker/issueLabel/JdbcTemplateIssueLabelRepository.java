package CodeSquad.IssueTracker.issueLabel;

import CodeSquad.IssueTracker.issueLabel.dto.SummaryLabelDto;
import CodeSquad.IssueTracker.issueLabel.dto.IssueLabelResponse;
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
public class JdbcTemplateIssueLabelRepository implements IssueLabelRepository {

    private final NamedParameterJdbcTemplate template;
    private final SimpleJdbcInsert jdbcInsert;

    public JdbcTemplateIssueLabelRepository(DataSource dataSource) {
        this.template = new NamedParameterJdbcTemplate(dataSource);
        this.jdbcInsert = new SimpleJdbcInsert(dataSource)
                .withTableName("issue_label")
                .usingGeneratedKeyColumns("issue_label_id");
    }

    @Override
    public void save(IssueLabel issueLabel) {
        SqlParameterSource param = new BeanPropertySqlParameterSource(issueLabel);
        Number key = jdbcInsert.executeAndReturnKey(param);
        issueLabel.setIssueLabelId(key.longValue());
    }

    @Override
    public void deleteByIssueId(Long issueId) {
        String sql = "DELETE FROM issue_label WHERE issue_id = :issueId";
        template.update(sql, Map.of("issueId", issueId));
    }

    @Override
    public List<IssueLabelResponse> returnedIssueLabelResponsesByIssueId(Long issueId) {
        String sql = """
            SELECT 
                l.label_id,
                l.name,
                l.color,
                l.description
            FROM 
                issue_label il
                JOIN labels l ON il.label_id = l.label_id
            WHERE 
                il.issue_id = :issueId
        """;

        return template.query(sql, Map.of("issueId", issueId), (rs, rowNum) ->
                new IssueLabelResponse(
                        rs.getLong("label_id"),
                        rs.getString("name"),
                        rs.getString("color"),
                        rs.getString("description")
                )
        );
    }

    @Override
    public Map<Long, List<SummaryLabelDto>> findSummaryLabelsByIssueIds(List<Long> issueIds) {
        if (issueIds == null || issueIds.isEmpty()) {
            return Collections.emptyMap();  // ✅ 리스트가 비면 SQL 실행 X
        }

        String sql = """
        SELECT il.issue_id, l.label_id, l.name, l.color
        FROM issue_label il
        JOIN labels l ON il.label_id = l.label_id
        WHERE il.issue_id IN (:ids)
    """;

        MapSqlParameterSource params = new MapSqlParameterSource("ids", issueIds);

        return template.query(sql, params, rs -> {
            Map<Long, List<SummaryLabelDto>> result = new HashMap<>();
            while (rs.next()) {
                long issueId = rs.getLong("issue_id");

                SummaryLabelDto label = new SummaryLabelDto(
                        rs.getLong("label_id"),   // 🔧 여기서도 필드명 맞춰줌
                        rs.getString("name"),
                        rs.getString("color")
                );

                result.computeIfAbsent(issueId, k -> new ArrayList<>()).add(label);
            }
            return result;
        });
    }


    @Override
    public List<SummaryLabelDto> findSummaryLabelByIssueId(Long issueId) {
        String sql = """
            SELECT 
                l.label_id, 
                l.name, 
                l.color 
            FROM issue_label il 
            LEFT JOIN labels l ON il.label_id = l.label_id
            WHERE il.issue_id = :issueId    
        """;

        return template.query(sql, Map.of("issueId", issueId), summaryLabelDtoRowMapper());
    }

    @Override
    public void deleteByLabelId(Long labelId) {
        String sql = "DELETE FROM issue_label WHERE label_id = :labelId";
        template.update(sql, Map.of("labelId", labelId));
    }

    private RowMapper<SummaryLabelDto> summaryLabelDtoRowMapper(){
        return BeanPropertyRowMapper.newInstance(SummaryLabelDto.class);
    }
}
