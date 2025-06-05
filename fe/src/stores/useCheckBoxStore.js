import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const useCheckBoxStore = create(
  immer((set) => ({
    checkBoxEntry: {},

    toggleCheckBox: (id) =>
      set((state) => {
        state.checkBoxEntry[id] = !state.checkBoxEntry[id];
      }),

    // 상단 체크박스의 상태에 따라서 체크박스 선택,해제 여부 정해짐
    allToggleIssue: (checkBoxStatus) =>
      set((state) => {
        Object.keys(state.checkBoxEntry).forEach((key) => {
          state.checkBoxEntry[key] = !checkBoxStatus;
        });
      }),
    //서버에서 다시 새로운 데이터를 받아오면 이 로직은 필요가 없다.
    deleteIssueToEntry: (id) =>
      set((state) => {
        delete state.checkBoxEntry[id];
      }),
    setEntry: (issues) =>
      set((state) => {
        state.checkBoxEntry = {};
        issues.forEach(({ issueId }) => {
          state.checkBoxEntry[issueId] = false;
        });
      }),
  })),
);

export default useCheckBoxStore;
