import * as Dom from '@/assets/script/base/dom';

export default {
  install(_Vue: any, _options: any) {
    _Vue.directive(`focus`, {
      mounted: (el: any) => {
        el.focus();
      },
    });
    _Vue.directive(`height`, {
      mounted: (el: any) => {
        Dom.resize(el);
      },
    });
  },
};
