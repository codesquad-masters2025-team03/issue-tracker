package CodeSquad.IssueTracker.milestone;

import CodeSquad.IssueTracker.milestone.dto.MilestoneIssueCount;
import CodeSquad.IssueTracker.milestone.dto.MilestoneResponse;
import CodeSquad.IssueTracker.milestone.dto.MilestoneUpdateDto;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.*;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class JdbcTemplatesMilestoneRepository implements MilestoneRepository {

    private final NamedParameterJdbcTemplate template;
    private final SimpleJdbcInsert jdbcInsert;

    public JdbcTemplatesMilestoneRepository(DataSource dataSource) {
        this.template = new NamedParameterJdbcTemplate(dataSource);
        this.jdbcInsert = new SimpleJdbcInsert(dataSource)
                .withTableName("milestones")
                .usingGeneratedKeyColumns("milestone_id");
    }

    @Override
    public Milestone save(Milestone milestone) {
        SqlParameterSource param = new BeanPropertySqlParameterSource(milestone);
        Number key = jdbcInsert.executeAndReturnKey(param);
        milestone.setMilestoneId(key.longValue());
        return milestone;
    }

    @Override
    public Optional<Milestone> findById(Long milestoneId) {
        String sql = "SELECT * FROM milestones WHERE milestone_id = :milestoneId";
        Map<String, Object> param = Map.of("milestoneId", milestoneId);
        Milestone milestone = template.queryForObject(sql, param, milestoneRowMapper());
        return Optional.ofNullable(milestone);
    }

    @Override
    public List<Milestone> findAll() {
        String sql = "SELECT * FROM milestones";
        return template.query(sql, milestoneRowMapper());
    }

    @Override
    public void deleteById(Long milestoneId) {
        String sql = "DELETE FROM milestones WHERE milestone_id = :milestoneId";
        Map<String, Object> param = Map.of("milestoneId", milestoneId);
        template.update(sql, param);
    }

    @Override
    public void update(Long id, MilestoneUpdateDto updateDto) {
        String sql = """
                UPDATE milestones 
                SET name = :name,
                    description = :description,
                    end_date = :endDate,        
                    is_open = :isOpen           
                WHERE milestone_id = :id       
                """;
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("name", updateDto.getName())
                .addValue("description", updateDto.getDescription())
                .addValue("endDate", updateDto.getEndDate())
                .addValue("isOpen", updateDto.getIsOpen())
                .addValue("id", id);
        template.update(sql, param);
    }

    @Override
    public Optional<MilestoneResponse> findMilestoneResponsesByIssueId(Long issueId) {
        String sql = """
            SELECT
                m.milestone_id,
                m.name,
                m.description,
                DATE_FORMAT(m.end_date, '%Y-%m-%d') AS end_date,
                m.is_open,
                (
                    SELECT COUNT(*)
                    FROM issues i2
                    WHERE i2.milestone_id = m.milestone_id AND i2.is_open = false
                ) * 100 / NULLIF((
                    SELECT COUNT(*)
                    FROM issues i3
                    WHERE i3.milestone_id = m.milestone_id
                ), 0) AS processing_rate
            FROM milestones m
            JOIN issues i ON m.milestone_id = i.milestone_id
            WHERE i.issue_id = :issueId
            LIMIT 1
            """;

        List<MilestoneResponse> result = template.query(sql, Map.of("issueId", issueId), (rs, rowNum) -> {
            MilestoneResponse res = new MilestoneResponse();
            res.setMilestoneId(rs.getLong("milestone_id"));
            res.setName(rs.getString("name"));
            res.setDescription(rs.getString("description"));
            res.setEndDate(rs.getString("end_date")); // ISO string
            res.setIsOpen(rs.getBoolean("is_open"));
            res.setProcessingRate(rs.getLong("processing_rate"));
            return res;
        });

        return result.stream().findFirst();
    }


    @Override
    public Long calculateProcessingRate(Milestone milestone) {
        String sql = """
        SELECT (
            SELECT COUNT(*)
            FROM issues i2
            WHERE i2.milestone_id = :milestoneId AND i2.is_open = false
        ) * 100 / NULLIF((
            SELECT COUNT(*)
            FROM issues i3
            WHERE i3.milestone_id = :milestoneId
        ), 0) AS processing_rate
    """;

        Map<String, Object> params = Map.of("milestoneId", milestone.getMilestoneId());

        Long rate = template.queryForObject(sql, params, Long.class);
        return rate != null ? rate : 0L;
    }

    @Override
    public List<Milestone> findByStatus(boolean isOpen) {
        String sql = "SELECT * FROM milestones WHERE is_open = :isOpen ORDER BY milestone_id DESC";
        Map<String, Object> param = Map.of("isOpen", isOpen);
        return template.query(sql, param, milestoneRowMapper());
    }

    @Override
    public Integer countByStatus(boolean isOpen) {
        String sql = "SELECT COUNT(*) FROM milestones WHERE is_open = :isOpen";
        Map<String, Object> param = Map.of("isOpen", isOpen);
        return template.queryForObject(sql, param, Integer.class);
    }

    @Override
    public MilestoneIssueCount getIssueCountByMilestoneId(Long milestoneId) {
        String sql = """
        SELECT 
            SUM(CASE WHEN is_open = true THEN 1 ELSE 0 END) AS openCount,
            SUM(CASE WHEN is_open = false THEN 1 ELSE 0 END) AS closedCount
        FROM issues
        WHERE milestone_id = :milestoneId
    """;

        return template.queryForObject(sql, Map.of("milestoneId", milestoneId), (rs, rowNum) ->
                new MilestoneIssueCount(
                        rs.getInt("openCount"),
                        rs.getInt("closedCount")
                )
        );
    }


    private RowMapper<Milestone> milestoneRowMapper() {
        return BeanPropertyRowMapper.newInstance(Milestone.class);
    }
}
