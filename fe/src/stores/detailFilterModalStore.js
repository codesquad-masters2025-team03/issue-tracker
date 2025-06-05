// useFilterStore.js
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

const useFilterModalStore = create(
  persist(
    immer((set) => ({
      isActive: false, // 모달의 열림/닫힘 상태 관리

      filterEntry: {
        author: [], // 담당자 목록 & 작성자 목록
        label: [],
        milestone: [],
        assignee: [],
      },
      isLoaded: false, // 사이드바가 렌더될 수 있을 만큼 로딩이 끝났는지
      updatedAt: 0, // 캐시 생성 시간

      setFilterData: (users, labels, milestones) =>
        set((state) => {
          state.filterEntry = {
            author: users,
            label: labels,
            milestone: milestones,
            assignee: users,
          };
          state.isLoaded = true;
          state.updatedAt = Date.now();
        }),

      clearFilterData: () =>
        set((s) => {
          s.filterEntry = { assignee: [], label: [], milestone: [], author: [] };
          s.isLoaded = false;
          s.updatedAt = 0;
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
    {
      name: 'issue-metaData-cache',
      version: 1,
      merge: (persistedState, currentState) => {
        if (!persistedState) return currentState;
        const MAX_AGE = 1000 * 60 * 60 * 24; // 24 h
        const updatedAt = persistedState.updatedAt;
        const isStale = Date.now() - updatedAt > MAX_AGE;
        return isStale ? currentState : { ...currentState, ...persistedState };
      },
      /* merge가 끝난 뒤(=hydrate 완료) 바로 실행되는 훅 */
      onRehydrateStorage: (state) => {
        console.log('[rehydrate start]', state); // 1️⃣ 항상 한 번 호출
        return (postState, error) => {
          if (error) {
            console.error(error);
            return;
          }
          console.log('[rehydrate end]', postState.filterEntry); // 2️⃣ merge + hydrate 끝
        };
      },

      partialize: (s) => ({
        filterEntry: s.filterEntry,
        updatedAt: s.updatedAt,
      }),

      getStorage: () => localStorage,
    },
  ),
);

export default useFilterModalStore;
