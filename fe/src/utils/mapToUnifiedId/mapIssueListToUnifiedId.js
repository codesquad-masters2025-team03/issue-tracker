export function mapIssueListToUnifiedId(issues) {
  if (!Array.isArray(issues)) return [];

  return issues.map((issue) => ({
    ...issue,
    labels: issue.labels?.map((l) => ({ ...l, id: l.labelId })) || [],
    milestone: issue.milestone ? { ...issue.milestone, id: issue.milestone.milestoneId } : null,
  }));
}
