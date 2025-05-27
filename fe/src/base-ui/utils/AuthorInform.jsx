import styled from 'styled-components';
import { typography } from '@/styles/foundation';
import useTimeAgo from '@/hooks/useTimeAgo';

const Container = styled.div`
  ${typography.display.medium16};
  color: ${({ theme }) => theme.text.weak};
`;

export default function AuthorInform({ lastModifiedAt, author }) {
  const gapTime = useTimeAgo(lastModifiedAt);
  // const isOpenText = isOpen ? '열렸습니다' : '닫혔습니다';
  const text = `이 이슈가 ${gapTime} 전에 ${author}님에 의해 수정됨.`;
  return <Container>{text}</Container>;
}
