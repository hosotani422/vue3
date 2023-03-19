import vue from '@vitejs/plugin-vue';
import * as Vitest from 'vitest/config';
import * as path from 'path';

export default Vitest.defineConfig(({mode}) => ({
  define: {
    vitest: undefined,
    'import.meta.vitest': mode !== `production`,
  },
  test: {
    globals: true,
    environment: `happy-dom`,
    includeSource: [`test/**/*.{ts, tsx}`],
    reporters: [`default`, `html`],
    outputFile: `./.html/index.html`,
    coverage: {
      provider: `c8`,
      reportsDirectory: `./.coverage`,
    },
  },
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
}));
