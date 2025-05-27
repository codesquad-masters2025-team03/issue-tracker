// useFilterStore.js
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const useFilterModalStore = create(
  immer((set) => ({
    isActive: false, // 모달의 열림/닫힘 상태 관리

    filterEntry: {
      author: null, // 담당자 목록 & 작성자 목록
      label: null,
      milestone: null,
      assignee: null,
    },

    setFilterData: (users, labels, milestones) =>
      set((state) => {
        const filterEntry = state.filterEntry;
        filterEntry.author = users;
        filterEntry.label = labels;
        filterEntry.milestone = milestones;
        filterEntry.assignee = users;
      }),

    openModal: () =>
      set((state) => {
        state.isActive = true;
      }),
    closeModal: () =>
      set((state) => {
        state.isActive = false;
      }),
  })),
);

export default useFilterModalStore;
