import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const useLabelStore = create(
  immer((set) => ({
    labels: [],
    count: null,

    setLabels: (labels, count = null) =>
      set((state) => {
        state.labels = labels;
        state.count = count ? count : 0;
      }),

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
