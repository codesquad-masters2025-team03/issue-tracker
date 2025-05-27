import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const useIssuesStore = create(
  immer((set) => ({
    issues: [],
    metaData: {},
    setIssues: (issues) =>
      set((state) => {
        if (!issues) return;
        state.issues = issues;
      }),

    addIssue: (issue) =>
      set((state) => {
        state.issues.push(issue);
      }),
    toggleIssues: (IssueIdArr) =>
      set((state) => {
        state.issues = state.issues.map((issue) => {
          if (!IssueIdArr.includes(issue.id)) return issue;
          return { ...issue, isOpen: !issue.isOpen };
        });
      }),
    updateIssue: (updatedIssue) =>
      set((state) => {
        const index = state.issues.findIndex((i) => i.id === updatedIssue.id);
        if (index !== -1) {
          state.issues[index] = updatedIssue;
        }
      }),

    removeIssue: (id) =>
      set((state) => {
        state.issues = state.issues.filter((i) => i.id !== id);
      }),

    // -> 오픈 ID 관리 로직 수정 필요
    // 분기 처리도 현재 필터의 상태 (isOpen 의 쿼리 파람 상태)에 돤련된 id 를 추적 해야한다.
    setMetaData: (metaData) =>
      set((state) => {
        state.metaData = metaData;
      }),
  })),
);

export default useIssuesStore;
