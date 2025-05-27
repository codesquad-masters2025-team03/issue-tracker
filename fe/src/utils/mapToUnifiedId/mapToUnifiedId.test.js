import { describe, it, expect } from 'vitest';
import { mapToUnifiedId } from './mapToUnifiedId';

describe('mapToUnifiedId 테스트', () => {
  it('should map labelId to id', () => {
    const input = [{ labelId: 1, name: 'bug' }];
    const result = mapToUnifiedId(input);
    expect(result[0]).toHaveProperty('id', 1);
    expect(result[0]).toHaveProperty('labelId', 1);
  });

  it('should map milestoneId to id', () => {
    const input = [{ milestoneId: 10, name: 'v1.0' }];
    const result = mapToUnifiedId(input);
    expect(result[0]).toHaveProperty('id', 10);
    expect(result[0]).toHaveProperty('milestoneId', 10);
  });

  it('should return empty array if input is not an array', () => {
    const result = mapToUnifiedId(null);
    expect(result).toEqual([]);
  });
});
