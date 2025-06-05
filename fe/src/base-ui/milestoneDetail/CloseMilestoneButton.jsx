import { GhostButton } from '@/base-ui/components/Button';
import styled from 'styled-components';

const OpenButton = styled(GhostButton)`
  gap: 4px;
`;

export default function CloseMilestoneButton({ isOpen, number, onClick }) {
  const textLabel = `닫힌 마일스톤(${number})`;

  return (
    <OpenButton className={isOpen ? '' : 'active'} onClick={onClick}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_14852_5722)">
          <path
            d="M14 5.33337V14H2V5.33337"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15.3332 2H0.666504V5.33333H15.3332V2Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.6665 8H9.33317"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_14852_5722">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>

      <span>{textLabel}</span>
    </OpenButton>
  );
}
