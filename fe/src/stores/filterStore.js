/*
- 유저가 필터 적용시  항상 이 스토어를 통해 필터 적용(바로 쿼리 적용을 하는게 아니라 한번에 입력을 받은뒤.
서버에 데이터 요청을 할때 이 스토어의 상태를 기준으로 요청을 한다)
- 현재 필터 상황 이 스토어에서 확인 가능
*/

// assignee: null,
// label: null,
// milestone: null,
// author: null,
// commentedBy: null,

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const useFilterStore = create(
  immer((set) => ({
    selectedFilters: {
      page: 1,

      isOpen: true,
    },

    setFilter: (key, value) =>
      set((state) => {
        if (key === 'isOpen') {
          state.selectedFilters[key] = value;
          return;
        }
        if (key in state.selectedFilters) {
          if (Number(state.selectedFilters[key]) === Number(value)) {
            delete state.selectedFilters[key];
          } else {
            state.selectedFilters[key] = value;
          }
        } else {
          state.selectedFilters[key] = value;
        }
      }),

    initFilter: (filters) =>
      set((state) => {
        state.selectedFilters = filters;
      }),

    resetFilters: () =>
      set((state) => {
        state.selectedFilters = {
          page: 1,
          assignee: null,
          label: null,
          milestone: null,
          author: null,
          commentedBy: null,
          isOpen: true,
        };
      }),
  })),
);

export default useFilterStore;
