package CodeSquad.IssueTracker.issue;

import CodeSquad.IssueTracker.home.dto.IssueFilterCondition;
import lombok.Getter;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;

@Getter
public class IssueFilterQueryBuilder {

    private final StringBuilder whereClause = new StringBuilder();
    private final MapSqlParameterSource params = new MapSqlParameterSource();

    public IssueFilterQueryBuilder(Boolean isOpen, IssueFilterCondition condition) {
        whereClause.append(" WHERE 1=1 ");

        // 열림/닫힘 필터링
        if (isOpen != null) {
            whereClause.append("AND i.is_open = :isOpen ");
            params.addValue("isOpen", isOpen);
        }

        // 작성자 필터링
        if (condition.getAuthor() != null) {
            whereClause.append("AND i.author_id = :authorId ");
            params.addValue("authorId", condition.getAuthor());
        }

        // 마일스톤 필터링
        if (condition.getMilestone() != null) {
            whereClause.append("AND i.milestone_id = :milestoneId ");
            params.addValue("milestoneId", condition.getMilestone());
        }

        // 레이블 필터링 - EXISTS로 최적화
        if (condition.getLabel() != null) {
            whereClause.append("""
                AND EXISTS (
                    SELECT 1 FROM issue_label il
                    WHERE il.issue_id = i.issue_id AND il.label_id = :labelId
                )
            """);
            params.addValue("labelId", condition.getLabel());
        }

        // 담당자 필터링 - EXISTS로 최적화
        if (condition.getAssignee() != null) {
            whereClause.append("""
                AND EXISTS (
                    SELECT 1 FROM issue_assignee ia
                    WHERE ia.issue_id = i.issue_id AND ia.assignee_id = :assigneeId
                )
            """);
            params.addValue("assigneeId", condition.getAssignee());
        }

        // 댓글 단 사람 필터링 - EXISTS로 최적화
        if (condition.getCommentedBy() != null) {
            whereClause.append("""
                AND EXISTS (
                    SELECT 1 FROM comments c
                    WHERE c.issue_id = i.issue_id AND c.author_id = :commentedBy
                )
            """);
            params.addValue("commentedBy", condition.getCommentedBy());
        }
    }
}
