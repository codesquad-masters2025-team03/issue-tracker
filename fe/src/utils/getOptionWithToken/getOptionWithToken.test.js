import { describe, it, expect } from 'vitest';
import getOptionWithToken from './getOptionWithToken';

describe('getOptionWithToken 함수', () => {
  it('기존 옵션객체와 토큰 문자열 입력시 하나의 새로운 옵션으로 나와야한다.', () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ test: true }),
    };
    const token = 'sampleToken123';
    const result = getOptionWithToken(options, token);

    expect(result).toEqual({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer sampleToken123',
      },
      body: JSON.stringify({ test: true }),
    });
  });
});
