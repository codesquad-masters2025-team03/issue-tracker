// components/ui/Button.jsx
import styled, { css } from 'styled-components';
import { typography } from '@/styles/foundation';
import { radius } from '@/styles/foundation';

const DefaultButton = styled.button`
  all: unset;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  border-radius: ${radius.medium};
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.64;
  }

  &:disabled {
    opacity: 0.32;
    cursor: not-allowed;
  }
`;

const ghostButtonStyle = css`
  ${typography.available.medium16}
  all: unset;
  display: flex;
  align-items: center;
  background-color: transparent;
  color: ${({ theme }) => theme.text.default};
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    color: ${({ theme }) => theme.text.strong};
    ${typography.selected.bold16}
    svg {
      path {
        stroke: ${({ theme }) => theme.text.strong};
      }
    }
  }

  &.active {
    color: ${({ theme }) => theme.text.strong};
    ${typography.selected.bold16}
    svg {
      path {
        stroke: ${({ theme }) => theme.text.strong};
      }
    }
  }

  svg path {
    stroke: ${({ theme }) => theme.text.default};
    transition: stroke 0.2s ease;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  &:active {
    border-radius: 12px;
    background-color: ${({ theme }) => theme.surface.bold};
  }
`;

const GhostButton = styled.button`
  ${ghostButtonStyle}
`;

export { DefaultButton, GhostButton, ghostButtonStyle };
