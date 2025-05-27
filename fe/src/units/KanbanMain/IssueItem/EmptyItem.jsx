import { typography } from '@/styles/foundation';
import styled from 'styled-components';

const Container = styled.div`
  color: ${({ theme }) => theme.text.strong};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const Emoji = styled.div`
  font-size: 200px;
  line-height: 1.25;
`;

const Description = styled.div`
  ${typography.display.medium20}
`;

export default function EmptyItem() {
  const emptyEmoji = '(·_·)';
  const emptyLabel = '해당하는 이슈가 없습니다.';
  return (
    <Container>
      <Emoji>{emptyEmoji}</Emoji>
      <Description>{emptyLabel}</Description>
    </Container>
  );
}
