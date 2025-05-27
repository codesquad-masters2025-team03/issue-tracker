import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { someHandler } from '@/utils/common/someHandler';

const useIssueDetailStore = create(
  immer((set) => ({
    // issue 프로퍼티 -> 서버로부터 DB에 있는 데이터를 보내줄때 업데이트하는 용도입니다.
    issue: {
      id: '',
      title: '',
      content: '',
      imageUrl: '',
      authorId: null,
      milestoneId: null,
      isOpen: '',
      lastModifiedAt: '',
    },

    /* 
    - 아래의 프로퍼티 4개는 서버로부터 데이터를 받을때(*이슈 상세페이지_이슈가 이미 존재할경우*) 업데이트 됩니다.
    - 새로운 이슈 작성할 경우(*이슈 작성 페이지*) 사용자가 선택한 옵션이 아래 프로퍼티에 업데이트 됩니다. -> 아래의 프로퍼티를 그대로 서버에 POST요청을 보냅니다.
    - (*이슈 상세 페이지*)이 상황에서는 서버에 PATCH 요청을 보낼때 아래의 프로퍼티를 보냅니다.
    */
    assignees: [],
    labels: [],
    milestone: {},
    comments: [],
    //클릭하는 순간 적용
    toggleAssignee: (item) => {
      set((state) => {
        const assignees = state.assignees;
        if (someHandler(assignees, item.id)) {
          state.assignees = assignees.filter(({ id }) => id !== item.id);
        } else {
          state.assignees.push(item);
        }
      });
    },

    toggleLabel: (item) => {
      set((state) => {
        const labels = state.labels;
        if (someHandler(labels, item.id)) {
          state.labels = labels.filter(({ id }) => id !== item.id);
        } else {
          state.labels.push(item);
        }
      });
    },

    toggleMilestone: (item) => {
      set((state) => {
        const milestone = state.milestone;
        if (milestone?.id === item.id) {
          state.milestone = {};
          state.issue.milestoneId = null;
        } else {
          state.milestone = item;
          state.issue.milestoneId = item.id;
        }
      });
    },
  })),
);

export default useIssueDetailStore;
