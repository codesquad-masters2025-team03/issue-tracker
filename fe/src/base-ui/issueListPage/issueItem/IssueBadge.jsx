import styled from 'styled-components';

export default function IssueBadge({ isOpen }) {
  return (
    <>
      {isOpen ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_29943_36970)">
            <path
              d="M8.00004 14.6666C11.6819 14.6666 14.6667 11.6818 14.6667 7.99992C14.6667 4.31802 11.6819 1.33325 8.00004 1.33325C4.31814 1.33325 1.33337 4.31802 1.33337 7.99992C1.33337 11.6818 4.31814 14.6666 8.00004 14.6666Z"
              stroke="#007AFF"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8 5.33325V7.99992"
              stroke="#007AFF"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8 10.6667H8.00667"
              stroke="#007AFF"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_29943_36970">
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
          <g clip-path="url(#clip0_14852_5722)">
            <path
              d="M14 5.33337V14H2V5.33337"
              stroke="rgb(171, 125, 248)"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M15.3332 2H0.666504V5.33333H15.3332V2Z"
              stroke="rgb(171, 125, 248)"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M6.6665 8H9.33317"
              stroke="rgb(171, 125, 248)"
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
      )}
    </>
  );
}
