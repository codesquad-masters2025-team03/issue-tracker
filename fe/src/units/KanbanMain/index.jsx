import React from 'react';
import styled from 'styled-components';
import IssueItem from './IssueItem';
import useIssuesStore from '@/stores/issuesStore';
import EmptyItem from './IssueItem/EmptyItem';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  // 최소 높이는 설정 하지 않는다. -> 조건 만족하는 아이템이 없으면 안내 블럭을 띄워주는데 그 블럭이 최소 높이 역할.
`;

const Devider = styled.hr`
  border-top: 1px solid ${({ theme }) => theme.border.default};
`;

export default function KanbanMain() {
  const issues = useIssuesStore((state) => state.issues);

  return (
    <Container>
      {issues.map((issue, idx, arr) => {
        return (
          <React.Fragment key={idx}>
            <IssueItem issue={issue} />
            {arr.length - 1 !== idx && <Devider />}
          </React.Fragment>
        );
      })}
      {issues.length === 0 && <EmptyItem />}
    </Container>
  );
}
