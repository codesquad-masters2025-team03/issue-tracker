import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const useDeleteModalStore = create(
  immer((set) => ({
    isOpen: false,
    modalType: '',
    onConfirm: null,
    openModal({ modalType, onConfirm }) {
      set((state) => {
        if (state.isOpen) return; // 중복 방지
        state.isOpen = true;
        state.modalType = modalType;
        state.onConfirm = onConfirm;
      });
    },
    closeModal() {
      set((state) => {
        state.isOpen = false;
        state.modalType = '';
        state.onConfirm = null;
      });
    },
  })),
);

export default useDeleteModalStore;
