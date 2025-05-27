import React from 'react';
import styled from 'styled-components';

// Pagination Container
const PaginationWrapper = styled.nav`
  display: flex;
  justify-content: center;
  padding: 1rem;
  gap: 4px;
`;

const PaginationItem = styled.button`
  display: inline-block;
  padding: 8px 12px;
  border-radius: 4px;
  background-color: ${({ isActive }) => (isActive ? '#333' : 'transparent')};
  color: ${({ isActive }) => (isActive ? 'white' : '#333')};
  border: 1px solid #ddd;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    background-color: #eee;
  }
`;

const PaginationEllipsis = styled.span`
  display: inline-block;
  padding: 8px 12px;
  color: #999;
`;

export function Pagination() {
  return (
    <PaginationWrapper aria-label="페이지네이션">
      <PaginationItem>‹</PaginationItem>
      <PaginationItem>1</PaginationItem>
      <PaginationItem>2</PaginationItem>
      <PaginationItem>3</PaginationItem>
      <PaginationItem>
        <PaginationEllipsis>...</PaginationEllipsis>
      </PaginationItem>
      <PaginationItem>+</PaginationItem>
    </PaginationWrapper>
  );
}
