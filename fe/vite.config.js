// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default ({ mode }) => {
  // .env, .env.production 등 읽기
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    define: {
      // 👇 VITE_API_BASE_URL을 import.meta.env에서 사용할 수 있게 삽입
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL),
    },
  });
};
