module.exports = {
  publicPath: `./`,
  outputDir: `.bundle`,
  pages: {
    index: {
      entry: `src/index.ts`,
    },
  },
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "./src/style/const/index.scss";`,
      },
    },
  },
};
