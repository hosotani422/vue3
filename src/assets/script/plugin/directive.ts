import * as Vue from 'vue';
import * as Dom from '@/assets/script/base/dom';

export default {
  install: (app: Vue.App): void => {
    app.directive(`focus`, {
      mounted: (el: HTMLElement) => {
        el.focus();
      },
    });
    app.directive(`height`, {
      mounted: (el: HTMLElement) => {
        Dom.resize(el);
      },
    });
  },
};
