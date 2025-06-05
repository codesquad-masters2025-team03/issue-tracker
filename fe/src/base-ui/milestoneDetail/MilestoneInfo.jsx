import styled from 'styled-components';
import { typography } from '@/styles/foundation';
import formatDateToDotYMD from '@/utils/common/formatDateToDotYMD';

export default function MilestoneInfo({ milestoneName, endDate, description }) {
  return (
    <Container>
      <TitleWrapper>
        <Title>
          <svg
            width="15"
            height="16"
            viewBox="0 0 15 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.75 0C6.94891 0 7.13968 0.0790176 7.28033 0.21967C7.42098 0.360322 7.5 0.551088 7.5 0.75V3H11.134C11.548 3 11.948 3.147 12.264 3.414L14.334 5.164C14.5282 5.32828 14.6842 5.53291 14.7912 5.76364C14.8982 5.99437 14.9537 6.24566 14.9537 6.5C14.9537 6.75434 14.8982 7.00563 14.7912 7.23636C14.6842 7.46709 14.5282 7.67172 14.334 7.836L12.264 9.586C11.9481 9.85325 11.5478 9.99993 11.134 10H7.5V15.25C7.5 15.4489 7.42098 15.6397 7.28033 15.7803C7.13968 15.921 6.94891 16 6.75 16C6.55109 16 6.36032 15.921 6.21967 15.7803C6.07902 15.6397 6 15.4489 6 15.25V10H1.75C1.28587 10 0.840752 9.81563 0.512563 9.48744C0.184374 9.15925 0 8.71413 0 8.25V4.75C0 3.784 0.784 3 1.75 3H6V0.75C6 0.551088 6.07902 0.360322 6.21967 0.21967C6.36032 0.0790176 6.55109 0 6.75 0ZM6.75 8.5H11.134C11.1931 8.49965 11.2501 8.47839 11.295 8.44L13.365 6.69C13.3924 6.66653 13.4145 6.63739 13.4296 6.60459C13.4447 6.57179 13.4525 6.53611 13.4525 6.5C13.4525 6.46389 13.4447 6.42821 13.4296 6.39541C13.4145 6.36261 13.3924 6.33347 13.365 6.31L11.295 4.56C11.2501 4.52161 11.1931 4.50035 11.134 4.5H1.75C1.6837 4.5 1.62011 4.52634 1.57322 4.57322C1.52634 4.62011 1.5 4.6837 1.5 4.75V8.25C1.5 8.388 1.612 8.5 1.75 8.5H6.75Z"
              fill="currentColor"
            />
          </svg>
          <span>{milestoneName}</span>
        </Title>
        <EndDate>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.6667 2.66699H3.33333C2.59695 2.66699 2 3.26395 2 4.00033V13.3337C2 14.07 2.59695 14.667 3.33333 14.667H12.6667C13.403 14.667 14 14.07 14 13.3337V4.00033C14 3.26395 13.403 2.66699 12.6667 2.66699Z"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M10.6665 1.33301V3.99967"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M5.3335 1.33301V3.99967"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M2 6.66699H14"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>{formatDateToDotYMD(endDate)}</span>
        </EndDate>
      </TitleWrapper>
      <Description>{description}</Description>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

const TitleWrapper = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const Title = styled.div`
  ${typography.available.medium16}
  display: flex;
  gap: 8px;
  align-items: center;
  color: ${({ theme }) => theme.text.strong};
  svg {
    color: ${({ theme }) => theme.palette.blue};
  }
`;

const EndDate = styled.div`
  ${typography.display.medium12}
  display:flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.text.weak};
`;

const Description = styled.div`
  ${typography.display.medium16};
  color: ${({ theme }) => theme.text.weak};
  display: flex;
  max-width: 932px;
  word-break: break-all;
  overflow-wrap: break-word;
`;
