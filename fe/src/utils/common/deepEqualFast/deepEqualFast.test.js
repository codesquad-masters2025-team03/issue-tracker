import { describe, it, expect } from 'vitest';
import deepEqualFast from './deepEqualFast';

describe('deepEqualFast 함수', () => {
  it('같은 정수형 숫자는 값이 true 여야함', () => {
    expect(deepEqualFast(1, 1)).toBe(true);
  });
  it('다른 정수형 숫자는 값이 false 여야함', () => {
    expect(deepEqualFast(1, 4)).toBe(false);
  });
  it('참조값이 다르더라도 값이 같은 객체는 값이 true여야함', () => {
    const a = { id: 1 };
    const b = { id: 1 };
    expect(deepEqualFast(a, b)).toBe(true);
  });

  it('참조가 다르고 복잡한 구조의 객체의 값이 다르더라도 값이 false여야함', () => {
    const a = [
      {
        id: 1,
        title: '로그인 오류',
        isOpen: true,
        author: { id: 101, nickName: 'devchan' },
        assignees: [
          { id: 102, nickName: 'alice' },
          { id: 103, nickName: 'bob' },
        ],
        labels: [
          { id: 1, name: 'bug', color: '#ff0000' },
          { id: 2, name: 'urgent', color: '#ffcc00' },
        ],
        milestone: { id: 5, name: 'v1.0 릴리즈' },
        lastModifiedAt: '2025-05-12T09:00:00Z',
      },
      {
        id: 2,
        title: 'UI 개선 요청',
        isOpen: true,
        author: { id: 102, nickName: 'alice' },
        assignees: [{ id: 104, nickName: 'charlie' }],
        labels: [{ id: 3, name: 'feature', color: '#00ff00' }],
        milestone: { id: 6, name: 'v1.1 릴리즈' },
        lastModifiedAt: '2025-05-15T14:30:00Z',
      },
    ];
    const b = [
      {
        id: 1,
        title: '로그인 오류',
        isOpen: true,
        author: { id: 101, nickName: 'devchan' },
        assignees: [
          { id: 102, nickName: 'alice' },
          { id: 103, nickName: 'bob' },
        ],
        labels: [
          { id: 1, name: 'bug', color: '#ff0000' },
          { id: 2, name: 'urgent', color: '#ffcc00' },
        ],
        milestone: { id: 5, name: 'v1.0 릴리즈' },
        lastModifiedAt: '2025-05-12T09:00:00Z',
      },
      {
        id: 2,
        title: 'UI 개선 요청',
        isOpen: false,
        author: { id: 102, nickName: 'alice' },
        assignees: [{ id: 104, nickName: 'charlie' }],
        labels: [{ id: 3, name: 'feature', color: '#00ff00' }],
        milestone: { id: 6, name: 'v1.1 릴리즈' },
        lastModifiedAt: '2025-05-15T14:30:00Z',
      },
    ];
    expect(deepEqualFast(a, b)).toBe(false);
  });
});
