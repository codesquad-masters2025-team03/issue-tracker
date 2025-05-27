import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const useLabelStore = create(
  immer((set) => ({
    labels: [],

    setLabels: (labels) =>
      set((state) => {
        state.labels = labels;
      }),

    // 나중에 보완하기. 커스텀 훅의 fetchFn 함수 받아서 사용하기, 커스텀훅의 response받아서 사용하기
    //일단 이 메서드 쓰지마라.
    fetchLabels: async (fetchFn, state) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });
      try {
        const res = await fetch('/api/labels');
        if (!res.ok) throw new Error('Failed to fetch labels');
        const data = await res.json();
        set((state) => {
          state.labels = data;
          state.isLoading = false;
        });
      } catch (err) {
        set((state) => {
          state.error = err.message;
          state.isLoading = false;
        });
      }
    },

    addLabel: (label) =>
      set((state) => {
        state.labels.push(label);
      }),

    removeLabel: (id) =>
      set((state) => {
        state.labels = state.labels.filter((label) => label.id !== id);
      }),

    updateLabel: (updatedLabel) =>
      set((state) => {
        const index = state.labels.findIndex((l) => l.id === updatedLabel.id);
        if (index !== -1) {
          state.labels[index] = updatedLabel;
        }
      }),
  })),
);

export default useLabelStore;
