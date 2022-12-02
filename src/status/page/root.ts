import * as Vue from 'vue';
import * as VueRouter from 'vue-router';
import * as Dom from '@/script/base/dom';
import * as Util from '@/script/base/util';
import * as Cordova from '@/script/cordova/cordova';
import Global from '@/script/base/global';
import * as Const from '@/script/const/const';
import * as Lang from '@/script/lang/lang';

export const state = Vue.reactive({
  listId: `` as string,
  list: {
    sort: [] as string[],
    data: {} as {
      [K: string]: {
        status: string;
        title: string;
        sort: string[];
        data: {
          [K: string]: {
            status: string;
            check: boolean;
            title: string;
            task: boolean;
            date: string;
            time: string;
            alarm: (`1` | `2` | `3` | `4` | `5` | `6` | `7` | `8` | `9` | `10` | `11` | `12`)[];
            sort: string[];
            data: {
              [K: string]: {
                check: boolean;
                status: string;
                title: string;
              };
            };
          };
        };
      };
    },
  },
  conf: {
    size: 2 as 1 | 2 | 3,
    speed: 2 as 1 | 2 | 3,
    volume: 2 as 0 | 1 | 2 | 3,
    vibrate: `on` as string,
    theme: `light` as `light` | `dark`,
    lang: `jp` as `jp` | `en`,
  },
});

export const getter = {
  mode: Vue.computed(() => process.env.VUE_APP_MODE),
  classFoot: Vue.computed(() => {
    if (window.outerHeight <= 400) {
      return `small`;
    } else if (window.outerHeight <= 720) {
      return `middle`;
    }
    return `large`;
  }),
};

export const action = {
  initPage: (): void => {
    Global.route = VueRouter.useRoute();
    Global.router = VueRouter.useRouter();
    action.loadRoute();
    action.loadList();
    action.loadConf();
    action.reactFont();
    action.emptyTrash();
    Vue.watch(
      () => Util.copy(state.list),
      () => {
        action.saveList();
      },
    );
    Vue.watch(
      () => Util.copy(state.conf.size),
      () => {
        action.reactFont();
      },
    );
    Vue.watch(
      () => Util.copy(state.conf),
      () => {
        action.saveConf();
      },
    );
  },
  loadRoute: (): void => {
    action.routerMain({listId: localStorage.getItem(`route`) || Const.Init.listId});
  },
  saveRoute: (): void => {
    localStorage.setItem(`route`, state.listId);
  },
  loadList: (): void => {
    state.list = JSON.parse(localStorage.getItem(`list`)!) || Const.Init.list;
    action.reactAlarm();
  },
  saveList: (): void => {
    localStorage.setItem(`list`, JSON.stringify(state.list));
    action.reactAlarm();
  },
  loadConf: (): void => {
    state.conf = JSON.parse(localStorage.getItem(`conf`)!) || Const.Init.conf;
    action.reactSound();
  },
  saveConf: (): void => {
    localStorage.setItem(`conf`, JSON.stringify(state.conf));
    action.reactSound();
  },
  reactAlarm: (): void => {
    Cordova.Notice.removeAll();
    Object.values(state.list.data).forEach((list) => {
      Object.values(list.data).forEach((main) => {
        if (main.date) {
          main.alarm.forEach((alarm) => {
            Cordova.Notice.insert({
              title: Lang[state.conf.lang].alarm.title,
              message: `${list.title} ⇒ ${main.title}`,
              date: ((date) => {
                date.setMinutes(date.getMinutes() -
                Lang[state.conf.lang].dialog.alarm.data[alarm].value);
                return date;
              })(new Date(`${main.date}${main.time || `00:00`}`)),
            });
          });
        }
      });
    });
  },
  reactFont: (): void => {
    Dom.get(`html`)!.style.fontSize = ((font): string => {
      if (state.conf.size === 1) {
        font = `14px`;
      } else if (state.conf.size === 2) {
        font = `16px`;
      } else if (state.conf.size === 3) {
        font = `18px`;
      }
      return font;
    })(`10px`);
  },
  reactSound: (): void => {
    Object.values(Const.Sound).forEach((sound) => {
      sound.volume = Number(state.conf.volume) / 3;
    });
  },
  emptyTrash: (): void => {
    state.list.data[`2`] = {status: ``, title: `Trash`, sort: [], data: {}};
    action.saveList();
  },
  routerMain: (payload: {listId: string;}): void => {
    state.listId = payload.listId;
    action.saveRoute();
    !Global.route?.params.listId ? Global.router!.push(`/${payload.listId}`) : action.routerBack();
  },
  routerList: (): void => {
    Global.router?.push(`/${state.listId}/list`);
  },
  routerSub: (payload: {mainId: string;}): void => {
    Global.router?.push(`/${state.listId}/sub/${payload.mainId}`);
  },
  routerConf: (): void => {
    Global.router?.push(`/${state.listId}/conf`);
  },
  routerBack: (): void => {
    Global.router?.back();
  },
};
