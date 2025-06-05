import styled from 'styled-components';
import { typography } from '@/styles/foundation';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4); // 회색 딤처리
  z-index: 999; // 모달보다 낮지 않도록 설정
`;

export const ModalContainer = styled.div`
  width: 384px;
  background-color: ${({ theme }) => theme.surface.default};
  border: 1px solid ${({ theme }) => theme.border.default};
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); // 정중앙 배치
  z-index: 1000; // 오버레이보다 위에 있어야 함
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;

export const ModalTile = styled.div`
  ${typography.display.bold16}
  color: ${({ theme }) => theme.text.strong};
  margin: 0;
`;

export const ModalSubMessage = styled.ul`
  ${typography.display.bold16}
  margin: 8px 0 0 0;
  padding-left: 20px;
  color: ${({ theme }) => theme.text.default};
`;

export const ModalButtonGroup = styled.div`
  display: flex;
  border-top: 1px solid ${({ theme }) => theme.border.default};
`;

export const ModalButton = styled.button`
  ${typography.display.bold16}
  flex: 1;
  padding: 16px 0;
  background: none;
  border: none;
  cursor: pointer;

  &:first-child {
    color: ${({ theme }) => theme.text.strong};
  }

  &:last-child {
    color: ${({ theme }) => theme.danger.text}; // 예: 삭제는 빨간색
  }
`;
