import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { someHandler } from '@/utils/common/someHandler';

const initialState = {
  issue: {
    issueId: '',
    title: '',
    content: '',
    issueFileUrl: null,
    authorId: null,
    milestoneId: null,
    isOpen: '',
    lastModifiedAt: '',
  },
  comments: [],
  commentsEditing: {},
  newComment: { content: '', issueFileUrl: null },
  assignees: [],
  labels: [],
  milestone: {},
};

const useIssueDetailStore = create(
  immer((set) => ({
    // issue 프로퍼티 -> 서버로부터 DB에 있는 데이터를 보내줄때 업데이트하는 용도입니다.
    issue: {
      issueId: '',
      title: '',
      content: '',
      issueFileUrl: null,
      authorId: null,
      milestoneId: null,
      isOpen: '',
      lastModifiedAt: '',
    },

    mainCommentEditting: {},

    //입력 액션이 발생하면 계속해서 변하는 필드
    comments: [],
    // comment: { commentId: null, content: '', issueFileUrl: [] },
    commentsEditing: {
      // [commentId]: { content: '', issueFileUrl: [] } -> 여러 코멘트 동시 관리.
    },

    //상세 이슈 페이지에서 새로운 코멘트 작성
    newComment: { content: '', issueFileUrl: null },

    /* 
    - 아래의 프로퍼티 4개는 서버로부터 데이터를 받을때(*이슈 상세페이지_이슈가 이미 존재할경우*) 업데이트 됩니다.
    - 새로운 이슈 작성할 경우(*이슈 작성 페이지*) 사용자가 선택한 옵션이 아래 프로퍼티에 업데이트 됩니다. -> 아래의 프로퍼티를 그대로 서버에 POST요청을 보냅니다.
    - (*이슈 상세 페이지*)이 상황에서는 서버에 PATCH 요청을 보낼때 아래의 프로퍼티를 보냅니다.
    */
    assignees: [],
    labels: [],
    milestone: {},

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

    changeTitle: (value) => {
      set((state) => {
        state.issue.title = value;
      });
    },

    //이슈 등록 페이지의 코멘트 등록 액션
    addMainComment: (value) => {
      set((s) => {
        s.issue.content = value;
      });
    },

    addNewComment: (value) => {
      set((s) => {
        s.newComment.content = value;
      });
    },

    //상세 이슈페이지의 코멘트 관련 액션
    addOrEditComment: (value, commentId = null) => {
      set((state) => {
        if (commentId) {
          // 편집 모드: comments에서 해당 객체로 교체(초기화), 이후 state.comment에 입력값 적용
          const target = state.comments.find((comment) => comment.commentId === commentId);
          state.comment = target;
        }
        state.comment = {
          commentId: null,
          content: value,
          issueFileUrl: null,
        };
      });
    },

    // 1. 메인 코멘트(이슈 본문) 파일첨부용
    setFileForMainComment: (file) =>
      set((state) => {
        state.issue.issueFileUrl = file ? file : null;
      }),

    // 2. 상세 이슈페이지의 특정 코멘트 파일첨부용
    //항상 comment 작업은 comments에서 comment로 추출해서 편집 후, 서버에 comment 를 보낸다.
    setFileForEditComment: (commentId, file) =>
      set((state) => {
        state.commentsEditing[commentId].issueFileUrl = file ? file : null;
      }),
    // 새로운 코멘트 등록의 파일 첨부용
    setFileForNewComment: (file) =>
      set((state) => {
        state.newComment.issueFileUrl = file ? file : null;
      }),

    //편집 버튼 누르는 순간 GET 요청으로 받아온 comments 에서 comment로 데이터 이동-> 코멘트 편집 해야함!
    startEditComment: (commentId) =>
      set((state) => {
        const target = state.comments.find((comment) => comment.commentId === commentId);
        state.commentsEditing[commentId] = target;
      }),

    updateEditComment: (commentId, value) => {
      set((state) => {
        if (state.commentsEditing[commentId]) {
          state.commentsEditing[commentId].content = value;
        }
      });
    },

    cancelEditComment: (commentId) => {
      (state) => {
        delete state.commentsEditing[commentId];
      };
    },

    // 메인코멘트 편집 핸들러 액션
    startEditMainComment: () =>
      set((state) => {
        const target = { content: state.issue.content, issueFileUrl: state.issue.issueFileUrl };
        state.mainCommentEditting = target;
      }),

    updateEditMainComment: (value) => {
      set((state) => {
        state.mainCommentEditting.content = value;
      });
    },

    //메인코멘트 편집용 스토어 상태 생각해야함
    setFileForEdittingMainComment: (file) =>
      set((state) => {
        state.mainCommentEditting.issueFileUrl = file ? file : null;
      }),

    // 상세 이슈페이지 GET 패치 후 초기화 로직
    initStore: (data) => {
      set((state) => {
        // 1. 이슈 정보
        state.issue = { ...data.issue };

        // 2. 담당자, 라벨, 마일스톤
        state.assignees = data.assignees || [];
        state.labels = data.labels || [];
        state.milestone = data.milestone || {};

        // 3. 코멘트 (comments)
        // 서버에서 받은 comments 배열을 그대로 할당 (가공이 필요하다면 여기서 변환)
        state.comments = data.comments || [];

        // 4. 코멘트 편집 중 상태 초기화
        state.commentsEditing = {};

        // 5. 새로운 코멘트(입력폼) 상태 초기화
        state.newComment = { content: '', issueFileUrl: null };
      });
    },

    resetStore: () =>
      set((state) => {
        Object.assign(state, initialState);
      }),
  })),
);

export default useIssueDetailStore;
