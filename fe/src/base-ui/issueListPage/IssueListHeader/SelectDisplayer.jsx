import styled from 'styled-components';
import { typography } from '@/styles/foundation';

const Wrapper = styled.span`
  ${typography.display.bold16}
  color:${({ theme }) => theme.text.default};
`;

export default function SelectDisplayer({ count }) {
  const textLabel = `${count}개 이슈 선택`;
  return <Wrapper>{textLabel}</Wrapper>;
}
