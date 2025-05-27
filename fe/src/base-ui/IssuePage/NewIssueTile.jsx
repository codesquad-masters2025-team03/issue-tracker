import { typography } from '@/styles/foundation';
import styled from 'styled-components';

const Title = styled.h1`
  ${typography.display.bold32}
  color:${({ theme }) => theme.text.strong};
`;

export default function NewIssueTile({ title }) {
  return <Title>{title}</Title>;
}
