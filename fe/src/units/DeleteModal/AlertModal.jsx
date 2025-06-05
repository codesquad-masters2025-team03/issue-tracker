import {
  ModalOverlay,
  ModalContainer,
  ModalTile,
  ModalButtonGroup,
  ModalButton,
} from '@/base-ui/modal/Styled';
import useDeleteModalStore from '@/stores/deleteModalStore';
export default function AlertModal() {
  const { isOpen, modalType, onConfirm, closeModal } = useDeleteModalStore();
  if (!isOpen) return null;

  const messages = [
    '삭제된 이슈는 복구할 수 없습니다.',
    '관리자만 이슈를 삭제할 수 있습니다.',
    '삭제된 이슈는 검색에서 제외되며, 기존 참조는 대체 문구로 표시됩니다.',
  ];
  return (
    <>
      <ModalOverlay />
      <ModalContainer>
        <ModalTile>{`${modalType}을 삭제 하시겠습니까?`}</ModalTile>

        <ModalSubMessage>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ModalSubMessage>

        <ModalButtonGroup>
          <ModalButton type="button" onClick={closeModal}>
            취소
          </ModalButton>
          <ModalButton
            type="button"
            onClick={() => {
              if (onConfirm) onConfirm();
              closeModal();
            }}
          >
            삭제
          </ModalButton>
        </ModalButtonGroup>
      </ModalContainer>
    </>
  );
}
