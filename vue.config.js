module.exports = {
  pages: {
    index: {
      entry: `src/index.ts`,
    },
  },
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "./src/assets/style/const/index.scss";`,
      },
    },
  },
  outputDir: `.bundle`,
};
