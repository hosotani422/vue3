import * as Vuex from 'vuex';
import * as page from '@/store/pages/page';
import * as date from '@/store/popup/date';
import * as dialog from '@/store/popup/dialog';
import * as notice from '@/store/popup/notice';
import * as time from '@/store/popup/time';

export default Vuex.createStore({
  modules: {
    pages: {
      namespaced: true,
      modules: {
        page,
      },
    },
    popup: {
      namespaced: true,
      modules: {
        date,
        dialog,
        notice,
        time,
      },
    },
  },
});
