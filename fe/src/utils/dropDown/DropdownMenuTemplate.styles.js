import styled from 'styled-components';
import { typography } from '@/styles/foundation';

export const Container = styled.div`
  position: relative;
  display: inline-block;
`;

export const Overlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0px;
  left: 0px;
  height: 100vh;
  width: 100vw;
  z-index: 999;
`;

export const TriggerButton = styled.button`
  ${typography.available.medium16}
  width:80px;
  height: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0px;
  background: transparent;
  cursor: pointer;
  color: ${({ theme }) => theme.text.default};

  &:hover {
    opacity: 0.8;
  }
`;

export const Menu = styled.div`
  position: absolute;
  top: 100%;
  left: -60px;
  width: ${({ $width }) => $width || '12rem'};
  background-color: ${({ theme }) => theme.surface.strong};

  background: white;
  border: 1px solid ${({ theme }) => theme.border.default};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  border-radius: 16px;

  animation: slideDown 0.2s ease-out forwards;

  @keyframes slideDown {
    0% {
      transform: translateY(-20px);
      opacity: 0;
    }
    60% {
      transform: translateY(5px);
      opacity: 1;
    }
    100% {
      transform: translateY(0px);
      opacity: 1;
    }
  }
`;

export const Label = styled.div`
  ${typography.display.medium12}
  color:${({ theme }) => theme.text.weak};
  background-color: ${({ theme }) => theme.surface.default};
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;

  padding: 8px 16px;
`;

export const Separator = styled.hr`
  border-top: 1px solid ${({ theme }) => theme.border.default};
`;

export const Group = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Item = styled.div`
  ${typography.available.medium16}
  padding: 11px 16px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: ${({ disabled }) => (disabled ? 'none' : '#f5f5f5')};
  }
`;

export const Shortcut = styled.span`
  opacity: 0.6;
  font-size: 0.75rem;
`;
