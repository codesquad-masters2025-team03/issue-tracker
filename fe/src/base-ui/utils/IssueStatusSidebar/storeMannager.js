export const issueDetailStoreSelectorMap = {
  assignee: (state) => state.assignees,
  label: (state) => state.labels,
  milestone: (state) => state.milestone,
};

export const toggleSelectorMap = {
  assignee: (state) => state.toggleAssignee,
  label: (state) => state.toggleLabel,
  milestone: (state) => state.toggleMilestone,
};
