import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { ghostButtonStyle } from '@/base-ui/components/Button';

// 공통 버튼 스타일
const StyledNavButton = styled(NavLink)`
  ${ghostButtonStyle}
  text-decoration: none;
  width: 160px;
  height: 40px;
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;

  &.active {
    font-weight: 700;
    color: ${({ theme }) => theme.text.strong};
    background-color: ${({ theme }) => theme.surface.bold};
  }
`;

// 좌우 버튼 스타일
const LeftButton = styled(StyledNavButton)``;

const RightButton = styled(StyledNavButton)`
  border-left: 1px solid ${({ theme }) => theme.border.default};
`;

export function LabelButton({ number }) {
  const textLabel = `레이블(${number})`;
  return (
    <LeftButton to="/issue/labels">
      <svg
        width="17"
        height="16"
        viewBox="0 0 17 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_30764_287)">
          <path
            d="M4.91683 4.66659H4.9235M13.9768 8.93992L9.19683 13.7199C9.073 13.8439 8.92595 13.9422 8.76408 14.0093C8.60222 14.0764 8.42872 14.111 8.2535 14.111C8.07828 14.111 7.90477 14.0764 7.74291 14.0093C7.58105 13.9422 7.43399 13.8439 7.31016 13.7199L1.5835 7.99992V1.33325H8.25016L13.9768 7.05992C14.2252 7.30974 14.3646 7.64767 14.3646 7.99992C14.3646 8.35217 14.2252 8.6901 13.9768 8.93992Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_30764_287">
            <rect width="16" height="16" fill="white" transform="translate(0.25)" />
          </clipPath>
        </defs>
      </svg>
      <span>{textLabel}</span>
    </LeftButton>
  );
}

export function MilestoneButton({ number }) {
  const textLabel = `마일스톤(${number})`;
  return (
    <RightButton to="/issue/milestones">
      <svg
        width="17"
        height="16"
        viewBox="0 0 17 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.9168 8.00008L8.91683 4.66675V6.66675H1.5835V9.33341H8.91683V11.3334L13.9168 8.00008Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{textLabel}</span>
    </RightButton>
  );
}
