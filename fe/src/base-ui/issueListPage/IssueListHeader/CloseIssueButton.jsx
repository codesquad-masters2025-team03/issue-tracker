import { GhostButton } from '@/base-ui/components/Button';
import styled from 'styled-components';

const CloseButton = styled(GhostButton)`
  color: ${({ theme }) => theme.text.default};
  gap: 4px;
`;

export default function CloseIssueButton({ isOpen, number, onClick }) {
  const textLabel = `닫힌 이슈(${number})`;

  return (
    <CloseButton className={isOpen ? '' : 'active'} onClick={onClick}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_29943_39391)">
          <path
            d="M14 5.33337V14H2V5.33337"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15.3333 2H0.666656V5.33333H15.3333V2Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.66666 8H9.33332"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_29943_39391">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>

      <span>{textLabel}</span>
    </CloseButton>
  );
}
