import { typography } from '@/styles/foundation';
import { GhostButton } from '../components/Button';
import styled from 'styled-components';

const Button = styled(GhostButton)`
  color: ${({ theme }) => theme.danger.text};
  svg {
    stroke: ${({ theme }) => theme.danger.text};
  }
`;

export default function DeleteIssueBtn({ onClick }) {
  return (
    <Button onClick={onClick}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 4H3.33333H14"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.33337 4.00016V2.66683C5.33337 2.31321 5.47385 1.97407 5.7239 1.72402C5.97395 1.47397 6.31309 1.3335 6.66671 1.3335H9.33337C9.687 1.3335 10.0261 1.47397 10.2762 1.72402C10.5262 1.97407 10.6667 2.31321 10.6667 2.66683V4.00016M12.6667 4.00016V13.3335C12.6667 13.6871 12.5262 14.0263 12.2762 14.2763C12.0261 14.5264 11.687 14.6668 11.3334 14.6668H4.66671C4.31309 14.6668 3.97395 14.5264 3.7239 14.2763C3.47385 14.0263 3.33337 13.6871 3.33337 13.3335V4.00016H12.6667Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.66663 7.3335V11.3335"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.33337 7.3335V11.3335"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>이슈 삭제</span>
    </Button>
  );
}
