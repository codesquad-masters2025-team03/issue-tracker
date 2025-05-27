import { describe, it, expect } from 'vitest';
import { someHandler } from './someHandler';

describe('someHandler테스트 코드', () => {
  it('객체 배열 안에 해당하는 키의 value 와 target의 값이 같으면 true를 반환해야한다.', () => {
    const a = [
      { id: 2, content: 'test' },
      { id: 12, content: 'test' },
    ];
    const target = 12;

    expect(someHandler(a, target)).toBe(true);
  });
  it('빈 배열도 안전하게 비교할 수 있어야한다.', () => {
    const a = [];
    const target = 12;

    expect(someHandler(a, target)).toBe(false);
  });
});
