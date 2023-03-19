import * as Vue from 'vue';
import * as VueRouter from 'vue-router';
import * as lodash from 'lodash';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import lang from '@/script/lang/lang';
import constant from '@/script/const';
import * as root from '@/composables/page/root';
import * as list from '@/composables/page/list';
import * as main from '@/composables/page/main';
import * as sub from '@/composables/page/sub';
import * as conf from '@/composables/page/conf';

export const lib: {
  lodash: typeof lodash;
  dayjs: typeof dayjs;
  route?: VueRouter.RouteLocationNormalizedLoaded;
  router?: VueRouter.Router;
} = {
  lodash,
  dayjs: (() => {
    dayjs.locale(`ja`);
    return dayjs;
  })(),
};

export const state: {
  listId: string;
  back: boolean;
} = Vue.reactive({
  listId: ``,
  back: false,
});

export const getter = Vue.reactive({
  isApp: Vue.computed(() => (): boolean => false),
  listId: Vue.computed(() => (): string => state.listId),
  mainId: Vue.computed(() => (): string =>
    (lib.route?.params.mainId && !Array.isArray(lib.route.params.mainId) ? lib.route.params.mainId : ``)),
  lang: Vue.computed(() => (): typeof lang[typeof conf.state.data.lang] => lang[conf.state.data.lang]),
  classTop: Vue.computed(() => (): string[] => [`speed${conf.state.data.speed}`, conf.state.data.theme]),
  classFoot: Vue.computed(() => (): string => {
    if (window.outerHeight <= 400) {
      return `small`;
    } else if (window.outerHeight >= 720) {
      return `large`;
    }
    return `middle`;
  }),
});

export const action = {
  initPage: (): void => {
    root.lib.route = VueRouter.useRoute();
    root.lib.router = VueRouter.useRouter();
    list.action.initPage();
    main.action.initPage();
    sub.action.initPage();
    conf.action.initPage();
    action.loadRoute();
    action.clearTrash();
  },
  loadRoute: (): void => {
    action.routerMain({listId: localStorage.getItem(`route`) ?? constant.init.listId});
  },
  saveRoute: (): void => {
    localStorage.setItem(`route`, state.listId);
  },
  routerList: (): void => {
    root.lib.router?.push(`/${getter.listId()}/list`);
  },
  routerMain: (payload: {listId: string;}): void => {
    state.listId = payload.listId;
    if (!root.lib.route?.params.listId) {
      state.back = false;
      root.lib.router?.push(`/${payload.listId}`);
    } else {
      state.back = true;
      action.routerBack();
    }
    action.saveRoute();
  },
  routerSub: (payload: {mainId: string;}): void => {
    root.lib.router?.push(`/${getter.listId()}/sub/${payload.mainId}`);
  },
  routerConf: (): void => {
    root.lib.router?.push(`/${getter.listId()}/conf`);
  },
  routerBack: (): void => {
    root.lib.router?.back();
  },
  clearTrash: (): void => {
    main.state.data[constant.base.id.trash] = {sort: [], data: {}};
    sub.state.data[constant.base.id.trash] = {data: {}};
  },
};
