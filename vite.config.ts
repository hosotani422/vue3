import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/style/const/index.scss";`,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, `src`),
    },
  },
  server: {
    port: 3000,
  },
});
