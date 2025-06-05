import styled from 'styled-components';
import { typography } from '@/styles/foundation';
import { GhostButton } from '../components/Button';

export default function MilestoneController({ isOpen, statusHandler, editHandler, deleteHandler }) {
  return (
    <Container>
      <StyledButton onClick={statusHandler}>
        {isOpen ? (
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
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M15.3332 2H0.666504V5.33333H15.3332V2Z"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.6665 8H9.33317"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_14852_5722">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_14852_5674)">
              <path
                d="M8.00016 14.6667C11.6821 14.6667 14.6668 11.6819 14.6668 8.00004C14.6668 4.31814 11.6821 1.33337 8.00016 1.33337C4.31826 1.33337 1.3335 4.31814 1.3335 8.00004C1.3335 11.6819 4.31826 14.6667 8.00016 14.6667Z"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8 5.33337V8.00004"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8 10.6666H8.00667"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_14852_5674">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>
        )}
        <span>{isOpen ? `닫기` : `열기`}</span>
      </StyledButton>
      <StyledButton onClick={editHandler}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_31607_40096)">
            <path
              d="M13.3335 9.77317V13.3332C13.3335 13.6868 13.193 14.0259 12.943 14.276C12.6929 14.526 12.3538 14.6665 12.0002 14.6665H2.66683C2.31321 14.6665 1.97407 14.526 1.72402 14.276C1.47397 14.0259 1.3335 13.6868 1.3335 13.3332V3.99984C1.3335 3.64622 1.47397 3.30708 1.72402 3.05703C1.97407 2.80698 2.31321 2.6665 2.66683 2.6665H6.22683"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12.0002 1.3335L14.6668 4.00016L8.00016 10.6668H5.3335V8.00016L12.0002 1.3335Z"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_31607_40096">
              <rect width="16" height="16" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <span>편집</span>
      </StyledButton>
      <DeleteButton onClick={deleteHandler}>
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
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M5.33337 4.00016V2.66683C5.33337 2.31321 5.47385 1.97407 5.7239 1.72402C5.97395 1.47397 6.31309 1.3335 6.66671 1.3335H9.33337C9.687 1.3335 10.0261 1.47397 10.2762 1.72402C10.5262 1.97407 10.6667 2.31321 10.6667 2.66683V4.00016M12.6667 4.00016V13.3335C12.6667 13.6871 12.5262 14.0263 12.2762 14.2763C12.0261 14.5264 11.687 14.6668 11.3334 14.6668H4.66671C4.31309 14.6668 3.97395 14.5264 3.7239 14.2763C3.47385 14.0263 3.33337 13.6871 3.33337 13.3335V4.00016H12.6667Z"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M6.66663 7.3335V11.3335"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M9.33337 7.3335V11.3335"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>삭제</span>
      </DeleteButton>
    </Container>
  );
}

const Container = styled.div`
  ${typography.available.medium16}
  display: flex;
  gap: 24px;
  align-items: center;
  color: ${({ theme }) => theme.text.default};
`;

const StyledButton = styled(GhostButton)`
  gap: 4px;
`;

const DeleteButton = styled(StyledButton)`
  color: ${({ theme }) => theme.danger.text.default};
`;
