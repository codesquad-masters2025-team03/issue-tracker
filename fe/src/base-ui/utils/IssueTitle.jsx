import styled from 'styled-components';
import { typography } from '@/styles/foundation';

const Container = styled.div`
  ${typography.available.medium20};
  color: ${({ theme }) => theme.text.strong};
  display: flex;
  gap: 8px;
  align-items: center;
`;

export default function IssueTitle({ title }) {
  return (
    <Container>
      <div>{title}</div>
    </Container>
  );
}
