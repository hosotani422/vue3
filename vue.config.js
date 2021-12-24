module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "./src/assets/style/const/index.scss";`,
      },
    },
  },
};
