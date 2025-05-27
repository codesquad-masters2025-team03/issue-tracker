/*
로그인 ID (nickname)
비밀번호
devchan - 1234
alice - 1234
bob - 1234
charlie - 1234
david - 1234
eve - 1234

*/

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export const useAuthStore = create(
  immer((set) => ({
    loginId: null,
    imgUrl: null,
    accessToken: null,

    resetUser: () =>
      set((state) => {
        state.loginId = null;
        state.imgUrl = null;
        state.accessToken = null;
      }),
    setUser: (loginId, imgUrl, accessToken) =>
      set((state) => {
        state.loginId = loginId;
        state.imgUrl = imgUrl;
        state.accessToken = accessToken;
      }),
  })),
);
