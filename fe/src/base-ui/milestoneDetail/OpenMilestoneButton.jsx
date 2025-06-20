import { GhostButton } from '@/base-ui/components/Button';
import styled from 'styled-components';

const OpenButton = styled(GhostButton)`
  gap: 4px;
`;

export default function OpenMilestoneButton({ isOpen, number, onClick }) {
  const textLabel = `열린 마일스톤(${number})`;

  return (
    <OpenButton className={isOpen ? 'active' : ''} onClick={onClick}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_14852_5674)">
          <path
            d="M8.00016 14.6667C11.6821 14.6667 14.6668 11.6819 14.6668 8.00004C14.6668 4.31814 11.6821 1.33337 8.00016 1.33337C4.31826 1.33337 1.3335 4.31814 1.3335 8.00004C1.3335 11.6819 4.31826 14.6667 8.00016 14.6667Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 5.33337V8.00004"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 10.6666H8.00667"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_14852_5674">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <span>{textLabel}</span>
    </OpenButton>
  );
}
