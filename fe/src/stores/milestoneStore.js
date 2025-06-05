import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// 마일스톤 하나의 타입
// {
//   milestoneId: number,
//   name: string,
//   description: string,
//   endDate: string,
//   processingRate: number,
//   isOpen: boolean
// }

const useMilestoneStore = create(
  immer((set) => ({
    milestone: {
      milestones: [],
      openCount: 0,
      closedCount: 0,
    },

    // API 응답 받아서 한 번에 초기화
    initMilestones: (payload) => {
      set((state) => {
        state.milestone.milestones = payload.milestones;
        state.milestone.openCount = payload.openCount;
        state.milestone.closedCount = payload.closedCount;
      });
    },
  })),
);

export default useMilestoneStore;
