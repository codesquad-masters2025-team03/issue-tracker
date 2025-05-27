import { describe, it, expect } from 'vitest';
import { mapIssueListToUnifiedId } from './mapIssueListToUnifiedId';

describe('mapIssueListToUnifiedId', () => {
  it('should map labelId to id in labels', () => {
    const issues = [
      {
        id: 1,
        labels: [{ labelId: 2, name: 'bug' }],
        milestone: null,
      },
    ];
    const result = mapIssueListToUnifiedId(issues);
    expect(result[0].labels[0].id).toBe(2);
    expect(result[0].labels[0].labelId).toBe(2);
  });

  it('should map milestoneId to id in milestone', () => {
    const issues = [
      {
        id: 1,
        labels: [],
        milestone: { milestoneId: 5, name: 'v1.0' },
      },
    ];
    const result = mapIssueListToUnifiedId(issues);
    expect(result[0].milestone.id).toBe(5);
    expect(result[0].milestone.milestoneId).toBe(5);
  });

  it('should return empty array if input is not an array', () => {
    const result = mapIssueListToUnifiedId(null);
    expect(result).toEqual([]);
  });
});
