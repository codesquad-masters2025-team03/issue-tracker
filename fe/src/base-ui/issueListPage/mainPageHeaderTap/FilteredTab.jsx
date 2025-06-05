// 필터 상태의 객체를 입력 받음

import styled from 'styled-components';
import { typography } from '@/styles/foundation';

const Container = styled.div`
  display: flex;
  width: 100%;
  gap: 4px;
  height: 40px;
  padding: 8px 24px;
  align-items: center;
  background-color: transparent;
  border-left: 1px solid ${({ theme }) => theme.border.default};
  margin-left: 24px;
`;

const FilterText = styled.span`
  ${typography.display.medium16};
  color: ${({ theme }) => theme.text.weak};
  background-color: transparent;
  width: 100%;

  &:focus {
    color: ${({ theme }) => theme.text.default};
  }
`;

export function FilterSearchField({ selectedFilters }) {
  const arr = Object.entries(selectedFilters).reduce((acc, [key, value], idx, arr) => {
    if (value === null) return acc;
    const isLast = idx === arr?.length - 1;
    acc += `${key}:${value}${isLast ? '' : ', '}`;
    return acc;
  }, '');
  return (
    <Container>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.0001 14.0001L11.1001 11.1001"
          stroke="#4E4B66"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <FilterText>{arr}</FilterText>
    </Container>
  );
}
