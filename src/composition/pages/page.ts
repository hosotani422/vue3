import * as Vue from 'vue';
import * as VueRouter from 'vue-router';
import * as Util from '@/assets/script/base/util';
import * as Dom from '@/assets/script/base/dom';
import * as Cordova from '@/assets/script/cordova/cordova';
import Global from '@/assets/script/base/global';
import * as Const from '@/assets/script/const/const';
import * as Lang from '@/assets/script/lang/lang';
import * as notice from '@/composition/popup/notice';
import * as dialog from '@/composition/popup/dialog';
import * as clock from '@/composition/popup/clock';
import * as calendar from '@/composition/popup/calendar';

let route: VueRouter.RouteLocationNormalizedLoaded | null = null;
let router: VueRouter.Router | null = null;

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
    size: `2` as `1` | `2` | `3`,
    speed: `2` as `1` | `2` | `3`,
    volume: `2` as `0` | `1` | `2` | `3`,
    vibrate: true as boolean,
    theme: `light` as `light` | `dark`,
    lang: `jp` as `jp` | `en`,
  },
});

export const getter = {
  classItemList: Vue.computed(() => (listId: string): object => ({
    select: state.listId === listId,
    edit: state.list.data[listId].status === `edit`,
    hide: state.list.data[listId].status === `hide`,
    warn: ((flag) => {
      Object.values(state.list.data[listId].data).forEach((main) => {
        new Date(`${main.date || `9999/99/99`} ${main.time || `00:00`}`).getTime() <
          new Date().setDate(new Date().getDate() + 2) && (flag = true);
      });
      return flag;
    })(false),
    error: ((flag) => {
      Object.values(state.list.data[listId].data).forEach((main) => {
        new Date(`${main.date || `9999/99/99`} ${main.time || `00:00`}`).getTime() <
          new Date().setDate(new Date().getDate() + 1) && (flag = true);
      });
      return flag;
    })(false),
  })),
  textCountList: Vue.computed(() => (listId: string): string =>
    `${Object.values(state.list.data[listId].data).reduce((prev, main) =>
      (!main.check ? ++prev : prev), 0)}/${state.list.data[listId].sort.length}`),
  classItemMain: Vue.computed(() => (mainId: string): object => {
    const main = state.list.data[state.listId].data[mainId];
    return {
      select: route?.params.mainId === mainId,
      check: main.check,
      edit: main.status === `edit`,
      drag: main.status === `drag`,
      hide: main.status === `hide`,
      warn: new Date(`${main.date || `9999/99/99`} ${main.time || `00:00`}`).getTime() <
        new Date().setDate(new Date().getDate() + 2),
      error: new Date(`${main.date || `9999/99/99`} ${main.time || `00:00`}`).getTime() <
        new Date().setDate(new Date().getDate() + 1),
    };
  }),
  textCountMain: Vue.computed(() => (mainId: string): string => {
    const main = state.list.data[state.listId].data[mainId];
    return `${Object.values(main.data).reduce((prev, sub) =>
      (!sub.check ? ++prev : prev), 0)}/${main.sort.length}`;
  }),
  classTaskSub: Vue.computed(() => (subId: string): object => {
    const sub = state.list.data[state.listId]
      .data[route?.params.mainId as string].data[subId];
    return {
      check: sub.check,
      edit: sub.status === `edit`,
      drag: sub.status === `drag`,
      hide: sub.status === `hide`,
    };
  }),
  textMemoSub: Vue.computed(() => (): string => {
    const main = state.list.data[state.listId].data[route?.params.mainId as string];
    return Object.values(main.data).reduce((prev, sub) => `${prev}\n${sub.title}`, ``).slice(1);
  }),
  classFootSub: Vue.computed(() => (): object => {
    const main = state.list.data[state.listId].data[route?.params.mainId as string];
    return {
      warn: new Date(`${main.date || `9999/99/99`} ${main.time || `00:00`}`).getTime() <
        new Date().setDate(new Date().getDate() + 2),
      error: new Date(`${main.date || `9999/99/99`} ${main.time || `00:00`}`).getTime() <
        new Date().setDate(new Date().getDate() + 1),
    };
  }),
  textAlarmSub: Vue.computed(() => (): string =>
    state.list.data[state.listId]
      .data[route?.params.mainId as string].alarm.reduce((prev, alarmId) =>
        `${prev},${Lang[state.conf.lang].dialog.alarm.data[alarmId].label}`, ``).slice(1)),
};

export const action = {
  init: (): void => {
    route = VueRouter.useRoute();
    router = VueRouter.useRouter();
    action.loadConf();
    action.loadList();
    action.loadRoute();
    action.emptyTrash();
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
  reactSound: (): void => {
    Object.values(Const.Sound).forEach((sound) => {
      sound.volume = Number(state.conf.volume) / 3;
    });
  },
  emptyTrash: (): void => {
    state.list.data[`2`] = {status: ``, title: ``, sort: [], data: {}};
    action.saveList();
  },
  routerMain: (payload: {listId: string;}): void => {
    state.listId = payload.listId;
    action.saveRoute();
    !route?.params.listId ? router!.push(`/${payload.listId}`) : action.routerBack();
  },
  routerList: (): void => {
    router?.push(`/${state.listId}/list`);
  },
  routerSub: (payload: {mainId: string;}): void => {
    router?.push(`/${state.listId}/sub/${payload.mainId}`);
  },
  routerConf: (): void => {
    router?.push(`/${state.listId}/conf`);
  },
  routerBack: (): void => {
    router?.back();
  },
  insertItemList: (): void => {
    dialog.action.open({
      mode: `text`,
      title: Lang[state.conf.lang].dialog.insert,
      message: ``,
      text: {
        value: ``,
        placeholder: Lang[state.conf.lang].page.list,
      },
      ok: {
        name: Lang[state.conf.lang].common.ok,
        callback: () => {
          const listId = String(new Date().getTime());
          state.list.sort.unshift(listId);
          state.list.data[listId] = {
            status: ``,
            title: dialog.state.text.value,
            sort: [],
            data: {},
          };
          dialog.action.close();
          action.saveList();
        },
      },
      cancel: {
        name: Lang[state.conf.lang].common.cancel,
        callback: () => {
          dialog.action.close();
        },
      },
    });
  },
  copyItemList: (payload: {$event: Event; listId: string;}): void => {
    const listId = String(new Date().getTime());
    state.list.sort.splice(state.list.sort.indexOf(payload.listId) + 1, 0, listId);
    state.list.data[payload.listId].status = ``;
    state.list.data[listId] = Util.copy(state.list.data[payload.listId]);
    action.saveList();
    // 画面遷移キャンセル
    payload.$event.stopPropagation();
  },
  deleteItemList: (payload: {$event: Event; listId: string;}): void => {
    dialog.action.open({
      mode: `confirm`,
      title: Lang[state.conf.lang].dialog.delete,
      message: ``,
      ok: {
        name: Lang[state.conf.lang].common.ok,
        callback: () => {
          const backup = Util.copy(state.list);
          backup.data[payload.listId].status = ``;
          state.list.data[payload.listId].sort.forEach((mainId) => {
            state.list.data[`2`].sort.push(mainId);
            state.list.data[`2`].data[mainId] = state.list.data[payload.listId].data[mainId];
          });
          state.list.sort.splice(state.list.sort.indexOf(payload.listId), 1);
          delete state.list.data[payload.listId];
          dialog.action.close();
          action.saveList();
          Const.Sound.warn.play();
          notice.action.open({
            message: Lang[state.conf.lang].notice.message,
            button: Lang[state.conf.lang].notice.button,
            callback: () => {
              notice.action.close();
              state.list = backup;
              action.saveList();
            },
          });
        },
      },
      cancel: {
        name: Lang[state.conf.lang].common.cancel,
        callback: () => {
          dialog.action.close();
          state.list.data[payload.listId].status = ``;
        },
      },
    });
    // 画面遷移キャンセル
    payload.$event.stopPropagation();
  },
  switchEditList: (payload: {listId: string;}): void => {
    state.list.sort.forEach((listId) => {
      state.list.data[listId].status = listId === payload?.listId ? `edit` : ``;
    });
  },
  dragInitList: (payload: {listId: string; y: number;}): void => {
    const item = Dom.get(`.item-list[data-id="${payload.listId}"]`)!.getBoundingClientRect();
    Global.drag.id = payload.listId;
    Global.drag.y = payload.y;
    Global.drag.top = item.top;
    Global.drag.left = item.left;
    Global.drag.width = item.width;
    Global.drag.height = item.height;
    state.conf.vibrate && navigator.vibrate(40);
  },
  dragStartList: (payload: {$event: TouchEvent;}): void => {
    if (Global.drag.id && !Global.drag.clone) {
      Global.drag.clone =
        Dom.get(`.item-list[data-id="${Global.drag.id}"]`)!.cloneNode(true) as HTMLElement;
      Global.drag.clone.style.position = `absolute`;
      Global.drag.clone.style.zIndex = `1`;
      Global.drag.clone.style.top = `${Global.drag.top}px`;
      Global.drag.clone.style.left = `${Global.drag.left}px`;
      Global.drag.clone.style.width = `${Global.drag.width}px`;
      Global.drag.clone.style.height = `${Global.drag.height}px`;
      Dom.get(`.page-list > .home > .body > .wrap`)!.appendChild(Global.drag.clone);
      state.list.data[Global.drag.id].status = `hide`;
      // スクロール解除
      payload.$event.preventDefault();
    }
  },
  dragMoveList: (payload: {y: number; $event: TouchEvent;}): void => {
    if (Global.drag.id && Global.drag.clone) {
      Global.drag.clone.style.top = `${Global.drag.top! + payload.y - Global.drag.y!}px`;
      const sort = state.list.sort;
      const index = sort.indexOf(Global.drag.id);
      const clone = Global.drag.clone.getBoundingClientRect();
      const wrap = Dom.get(`.page-list > .home > .body > .wrap`)!.getBoundingClientRect();
      const prev = Dom.get(`.item-list[data-id="${sort[index - 1]}"]`)?.getBoundingClientRect();
      const current = Dom.get(`.item-list[data-id="${sort[index]}"]`)!.getBoundingClientRect();
      const next = Dom.get(`.item-list[data-id="${sort[index + 1]}"]`)?.getBoundingClientRect();
      if (prev && clone.top + (clone.height / 2) <
        (next ? next.top : wrap.top + wrap.height) - ((prev.height + current.height) / 2)) {
        sort.splice(index - 1, 0, sort.splice(index, 1)[0]);
      } else if (next && clone.top + (clone.height / 2) >
        (prev ? prev.top + prev.height : wrap.top) + ((current.height + next.height) / 2)) {
        sort.splice(index + 1, 0, sort.splice(index, 1)[0]);
      }
      // スクロール解除
      payload.$event.preventDefault();
    }
  },
  dragEndList: (): void => {
    if (Global.drag.id && Global.drag.clone) {
      Global.drag.clone.classList.remove(`edit`);
      Global.drag.clone.animate({
        top: [`${Global.drag.clone.getBoundingClientRect().top}px`,
          `${Dom.get(`.item-list[data-id="${Global.drag.id}"]`)!.getBoundingClientRect().top}px`],
      }, Const.Base.duration[state.conf.speed]).addEventListener(`finish`, () => {
        state.list.data[Global.drag.id!].status = ``;
        action.saveList();
        Global.drag.clone!.remove();
        Global.drag = {};
      });
    } else if (Global.drag.id && !Global.drag.clone) {
      Global.drag = {};
    }
  },
  swipeInitList: (payload: {target: HTMLElement; x: number; y: number;}): void => {
    Global.swipe.status = Global.swipe.status === `end` ? `move` : `start`;
    Global.swipe.target = payload.target;
    Global.swipe.x = payload.x;
    Global.swipe.y = payload.y;
    Global.swipe.side = payload.target.getBoundingClientRect().left;
    if (Global.swipe.status === `move`) {
      Global.swipe.target!.removeEventListener(`transitionend`, Global.swipe.listener!);
      Global.swipe.target!.classList.remove(`v-enter-active`);
      Global.swipe.target!.style.transform = `translateX(${Global.swipe.side}px)`;
    }
  },
  swipeStartList: (payload: {x: number; y: number;}): void => {
    if (Global.swipe.status === `start`) {
      if (Math.abs(payload.x - Global.swipe.x!) + Math.abs(payload.y - Global.swipe.y!) > 15) {
        Math.abs(payload.x - Global.swipe.x!) > Math.abs(payload.y - Global.swipe.y!) ?
          (Global.swipe.status = `move`) : (Global.swipe = {});
      }
    }
  },
  swipeMoveList: (payload: {x: number; y: number;}): void => {
    if (Global.swipe.status === `move`) {
      const x = Global.swipe.side! + payload.x - Global.swipe.x!;
      Global.swipe.target!.style.transform = `translateX(${x < 0 ? x : 0}px)`;
    }
  },
  swipeEndList: (payload: {x: number;}): void => {
    if (Global.swipe.status === `move`) {
      Global.swipe.status = `end`;
      if (Global.swipe.side! + payload.x - Global.swipe.x! < -100) {
        action.routerBack();
        Global.swipe = {};
      } else {
        Global.swipe.target!.style.transform = ``;
        Global.swipe.target!.classList.add(`v-enter-active`);
        Global.swipe.target!.addEventListener(`transitionend`, (Global.swipe.listener = () => {
          Global.swipe.target!.removeEventListener(`transitionend`, Global.swipe.listener!);
          Global.swipe.target!.classList.remove(`v-enter-active`);
          Global.swipe = {};
        }));
      }
    } else {
      Global.swipe = {};
    }
  },
  insertItemMain: (): void => {
    dialog.action.open({
      mode: `text`,
      title: Lang[state.conf.lang].dialog.insert,
      message: ``,
      text: {
        value: ``,
        placeholder: Lang[state.conf.lang].page.main,
      },
      ok: {
        name: Lang[state.conf.lang].common.ok,
        callback: () => {
          const main = state.list.data[state.listId];
          const mainId = String(new Date().getTime());
          main.sort.unshift(mainId);
          main.data[mainId] = {
            status: ``,
            check: false,
            title: dialog.state.text.value,
            date: ``,
            time: ``,
            alarm: [],
            task: true,
            sort: [`1`],
            data: {'1': {status: ``, check: false, title: ``}},
          };
          dialog.action.close();
          action.saveList();
        },
      },
      cancel: {
        name: Lang[state.conf.lang].common.cancel,
        callback: () => {
          dialog.action.close();
        },
      },
    });
  },
  copyItemMain: (payload: {$event: Event; mainId: string;}): void => {
    const main = state.list.data[state.listId];
    const mainId = String(new Date().getTime());
    main.sort.splice(main.sort.indexOf(payload.mainId) + 1, 0, mainId);
    main.data[payload.mainId].status = ``;
    main.data[mainId] = Util.copy(main.data[payload.mainId]);
    action.saveList();
    // 画面遷移キャンセル
    payload.$event.stopPropagation();
  },
  moveItemMain: (payload: {$event: Event; mainId: string;}): void => {
    dialog.action.open({
      mode: `radio`,
      title: Lang[state.conf.lang].dialog.move,
      message: ``,
      radio: {
        none: false,
        select: state.listId,
        sort: state.list.sort,
        data: state.list.data,
      },
      ok: {
        name: Lang[state.conf.lang].common.ok,
        callback: () => {
          const from = state.list.data[state.listId];
          const to = state.list.data[dialog.state.radio.select];
          to.sort.unshift(payload.mainId);
          to.data[payload.mainId] = from.data[payload.mainId];
          to.data[payload.mainId].status = ``;
          from.sort.splice(from.sort.indexOf(payload.mainId), 1);
          delete from.data[payload.mainId];
          dialog.action.close();
          action.saveList();
        },
      },
      cancel: {
        name: Lang[state.conf.lang].common.cancel,
        callback: () => {
          dialog.action.close();
          state.list.data[state.listId].data[payload.mainId].status = ``;
        },
      },
    });
    // 画面遷移キャンセル
    payload.$event.stopPropagation();
  },
  deleteItemMain: (payload: {$event: Event; mainId: string;}): void => {
    const backup = Util.copy(state.list);
    backup.data[state.listId].data[payload.mainId].status = ``;
    const main = state.list.data[state.listId];
    if (state.listId !== `2`) {
      state.list.data[`2`].sort.push(payload.mainId);
      state.list.data[`2`].data[payload.mainId] = main.data[payload.mainId];
      state.list.data[`2`].data[payload.mainId].status = ``;
    }
    main.sort.splice(main.sort.indexOf(payload.mainId), 1);
    delete main.data[payload.mainId];
    action.saveList();
    Const.Sound.warn.play();
    notice.action.open({
      message: Lang[state.conf.lang].notice.message,
      button: Lang[state.conf.lang].notice.button,
      callback: () => {
        notice.action.close();
        state.list = backup;
        action.saveList();
      },
    });
    // 画面遷移キャンセル
    payload.$event.stopPropagation();
  },
  checkItemMain: (payload: {mainId: string; checked: boolean;}): void => {
    const main = state.list.data[state.listId];
    main.sort.splice(main.sort.indexOf(payload.mainId), 1);
    main.sort[payload.checked ? `push` : `unshift`](payload.mainId);
    main.data[payload.mainId].check = payload.checked;
    action.saveList();
    Const.Sound[payload.checked ? `ok` : `cancel`].play();
  },
  switchEditMain: (payload: {mainId: string;}): void => {
    state.list.data[state.listId].sort.forEach((mainId) => {
      state.list.data[state.listId].data[mainId].status = mainId === payload?.mainId ? `edit` : ``;
    });
  },
  dragInitMain: (payload: {mainId: string; y: number;}): void => {
    const item = Dom.get(`.item-main[data-id="${payload.mainId}"]`)!.getBoundingClientRect();
    Global.drag.id = payload.mainId;
    Global.drag.y = payload.y;
    Global.drag.top = item.top;
    Global.drag.left = item.left;
    Global.drag.width = item.width;
    Global.drag.height = item.height;
    state.conf.vibrate && navigator.vibrate(40);
  },
  dragStartMain: (payload: {$event: TouchEvent;}): void => {
    if (Global.drag.id && !Global.drag.clone) {
      Global.drag.clone =
        Dom.get(`.item-main[data-id="${Global.drag.id}"]`)!.cloneNode(true) as HTMLElement;
      Global.drag.clone.style.position = `absolute`;
      Global.drag.clone.style.zIndex = `1`;
      Global.drag.clone.style.top = `${Global.drag.top}px`;
      Global.drag.clone.style.left = `${Global.drag.left}px`;
      Global.drag.clone.style.width = `${Global.drag.width}px`;
      Global.drag.clone.style.height = `${Global.drag.height}px`;
      Dom.get(`.page-main > .body > .wrap`)!.appendChild(Global.drag.clone);
      state.list.data[state.listId].data[Global.drag.id].status = `hide`;
      // スクロール解除
      payload.$event.preventDefault();
    }
  },
  dragMoveMain: (payload: {y: number; $event: TouchEvent;}): void => {
    if (Global.drag.id && Global.drag.clone) {
      Global.drag.clone.style.top = `${Global.drag.top! + payload.y - Global.drag.y!}px`;
      const sort = state.list.data[state.listId].sort;
      const index = sort.indexOf(Global.drag.id);
      const clone = Global.drag.clone.getBoundingClientRect();
      const wrap = Dom.get(`.page-main > .body > .wrap`)!.getBoundingClientRect();
      const prev = Dom.get(`.item-main[data-id="${sort[index - 1]}"]`)?.getBoundingClientRect();
      const current = Dom.get(`.item-main[data-id="${sort[index]}"]`)!.getBoundingClientRect();
      const next = Dom.get(`.item-main[data-id="${sort[index + 1]}"]`)?.getBoundingClientRect();
      if (prev && clone.top + (clone.height / 2) <
        (next ? next.top : wrap.top + wrap.height) - ((prev.height + current.height) / 2)) {
        sort.splice(index - 1, 0, sort.splice(index, 1)[0]);
      } else if (next && clone.top + (clone.height / 2) >
        (prev ? prev.top + prev.height : wrap.top) + ((current.height + next.height) / 2)) {
        sort.splice(index + 1, 0, sort.splice(index, 1)[0]);
      }
      // スクロール解除
      payload.$event.preventDefault();
    }
  },
  dragEndMain: (): void => {
    if (Global.drag.id && Global.drag.clone) {
      Global.drag.clone.classList.remove(`edit`);
      Global.drag.clone.animate({
        top: [`${Global.drag.clone.getBoundingClientRect().top}px`,
          `${Dom.get(`.item-main[data-id="${Global.drag.id}"]`)!.getBoundingClientRect().top}px`],
      }, Const.Base.duration[state.conf.speed]).addEventListener(`finish`, () => {
        state.list.data[state.listId].data[Global.drag.id!].status = ``;
        action.saveList();
        Global.drag.clone!.remove();
        Global.drag = {};
      });
    } else if (Global.drag.id && !Global.drag.clone) {
      Global.drag = {};
    }
  },
  inputItemSub: (payload: {subId: string; value: string;}): void => {
    state.list.data[state.listId].data[route?.params.mainId as string]
      .data[payload.subId].title = payload.value;
    action.saveList();
    Dom.resize(Dom.get(`.item-sub[data-id="${payload.subId}"] > .title`)!);
  },
  enterItemSub: async(payload: {subId: string; value: string; caret: number;}) => {
    const listId = state.listId;
    const mainId = route?.params.mainId as string;
    const subId = String(new Date().getTime());
    const sub = state.list.data[listId].data[mainId];
    sub.sort.splice(sub.sort.indexOf(payload.subId) + 1, 0, subId);
    sub.data[payload.subId].title = payload.value.slice(0, payload.caret);
    sub.data[subId] = {status: ``, check: false, title: payload.value.slice(payload.caret)};
    action.saveList();
    await Vue.nextTick();
    Dom.resize(Dom.get(`.item-sub[data-id="${payload.subId}"] > .title`)!);
    Dom.get(`.item-sub[data-id="${subId}"] > .title`)!.focus();
    ((element) => {
      Dom.resize(element);
      element.addEventListener(`transitionend`, function listener() {
        element.removeEventListener(`transitionend`, listener);
        element.style.height = ``;
      });
    })(Dom.get(`.item-sub[data-id="${subId}"]`)!);
  },
  backItemSub: async(
    payload: {subId: string; index: number; caret: number; $event: KeyboardEvent;}) => {
    if (payload.caret === 0 && payload.index > 0) {
      const listId = state.listId;
      const mainId = route?.params.mainId as string;
      const sub = state.list.data[listId].data[mainId];
      const prevId = sub.sort[sub.sort.indexOf(payload.subId) - 1];
      const caret = sub.data[prevId].title.length;
      sub.sort.splice(sub.sort.indexOf(payload.subId), 1);
      sub.data[prevId].title = `${sub.data[prevId].title}${sub.data[payload.subId].title}`;
      delete sub.data[payload.subId];
      action.saveList();
      Dom.resize(Dom.get(`.item-sub[data-id="${payload.subId}"]`)!);
      await Vue.nextTick();
      ((element) => {
        Dom.resize(element);
        element.focus();
        element.selectionStart = caret;
        element.selectionEnd = caret;
      })(Dom.get(`.item-sub[data-id="${prevId}"] > .title`) as HTMLInputElement);
      // 文字削除キャンセル
      payload.$event.preventDefault();
    }
  },
  deleteItemSub: async(payload: {subId: string;}) => {
    const listId = state.listId;
    const mainId = route?.params.mainId as string;
    const backup = Util.copy(state.list.data[listId].data[mainId]);
    Dom.resize(Dom.get(`.item-sub[data-id="${payload.subId}"]`)!);
    const sub = state.list.data[listId].data[mainId];
    sub.sort.splice(sub.sort.indexOf(payload.subId), 1);
    delete sub.data[payload.subId];
    action.saveList();
    Const.Sound.warn.play();
    await Vue.nextTick();
    notice.action.open({
      message: Lang[state.conf.lang].notice.message,
      button: Lang[state.conf.lang].notice.button,
      callback: async() => {
        notice.action.close();
        state.list.data[listId].data[mainId] = backup;
        action.saveList();
        await Vue.nextTick();
        ((element) => {
          Dom.resize(element);
          element.addEventListener(`transitionend`, function listener() {
            element.removeEventListener(`transitionend`, listener);
            element.style.height = ``;
          });
        })(Dom.get(`.item-sub[data-id="${payload.subId}"]`)!);
      },
    });
  },
  checkItemSub: (payload: {subId: string; checked: boolean;}): void => {
    const listId = state.listId;
    const mainId = route?.params.mainId as string;
    const sub = state.list.data[listId].data[mainId];
    sub.sort.splice(sub.sort.indexOf(payload.subId), 1);
    sub.sort[payload.checked ? `push` : `unshift`](payload.subId);
    sub.data[payload.subId].check = payload.checked;
    action.saveList();
    Const.Sound[payload.checked ? `ok` : `cancel`].play();
  },
  switchItemSub: (): void => {
    const listId = state.listId;
    const mainId = route?.params.mainId as string;
    state.list.data[listId].data[mainId].task = !state.list.data[listId].data[mainId].task;
    action.saveList();
  },
  inputMemoSub: (payload: {value: string;}): void => {
    const listId = state.listId;
    const mainId = route?.params.mainId as string;
    const sub = state.list.data[listId].data[mainId];
    sub.sort = [];
    sub.data = {};
    payload.value.split(`\n`).forEach((title, i) => {
      const subId = String(new Date().getTime()) + i;
      sub.sort.push(subId);
      sub.data[subId] = {status: ``, check: false, title};
    });
    action.saveList();
  },
  openCalendarSub: (payload: {date: string;}): void => {
    const listId = state.listId;
    const mainId = route?.params.mainId as string;
    calendar.action.open({
      select: payload.date,
      current: ((date) =>
        `${date.getFullYear()}/${date.getMonth() + 1}`)(new Date(payload.date || new Date())),
      cancel: Lang[state.conf.lang].common.cancel,
      clear: Lang[state.conf.lang].common.clear,
      callback: (date: string) => {
        calendar.action.close();
        state.list.data[listId].data[mainId].date = date;
        action.saveList();
      },
    });
  },
  openClockSub: (payload: {time: string;}): void => {
    const listId = state.listId;
    const mainId = route?.params.mainId as string;
    clock.action.open({
      hour: payload.time ? Number(payload.time.split(`:`)[0]) : 0,
      minute: payload.time ? Number(payload.time.split(`:`)[1]) : 0,
      cancel: Lang[state.conf.lang].common.cancel,
      clear: Lang[state.conf.lang].common.clear,
      ok: Lang[state.conf.lang].common.ok,
      callback: (hour: number, minute: number) => {
        clock.action.close();
        state.list.data[listId].data[mainId].time =
          `${String(hour).padStart(2, `0`)}:${String(minute).padStart(2, `0`)}`;
        action.saveList();
      },
    });
  },
  openAlarmSub: (): void => {
    const listId = state.listId;
    const mainId = route?.params.mainId as string;
    dialog.action.open({
      mode: `check`,
      title: Lang[state.conf.lang].dialog.alarm.title,
      message: ``,
      check: {
        all: true,
        sort: Lang[state.conf.lang].dialog.alarm.sort as unknown as string[],
        data: ((data) => {
          Lang[state.conf.lang].dialog.alarm.sort.forEach((id) => {
            data[id] = {check: state.list.data[listId].data[mainId].alarm.includes(id as
              `1` | `2` | `3` | `4` | `5` | `6` | `7` | `8` | `9` | `10` | `11` | `12`),
            title: Lang[state.conf.lang].dialog.alarm.data[id as
              `1` | `2` | `3` | `4` | `5` | `6` | `7` | `8` | `9` | `10` | `11` | `12`].label};
          });
          return data;
        })({} as any),
      },
      ok: {
        name: Lang[state.conf.lang].common.ok,
        callback: () => {
          dialog.action.close();
          state.list.data[listId].data[mainId].alarm = ((alarm) => {
            Object.entries(dialog.state.check.data).forEach(([key, value]) => {
              value.check && alarm.push(key as
                `1` | `2` | `3` | `4` | `5` | `6` | `7` | `8` | `9` | `10` | `11` | `12`);
            });
            return alarm;
          })([] as (`1` | `2` | `3` | `4` | `5` | `6` | `7` | `8` | `9` | `10` | `11` | `12`)[]);
          action.saveList();
        },
      },
      cancel: {
        name: Lang[state.conf.lang].common.cancel,
        callback: () => {
          dialog.action.close();
        },
      },
    });
  },
  dragInitSub: (payload: {subId: string; y: number;}): void => {
    const item = Dom.get(`.item-sub[data-id="${payload.subId}"]`)!.getBoundingClientRect();
    Global.drag.id = payload.subId;
    Global.drag.y = payload.y;
    Global.drag.top = item.top;
    Global.drag.left = item.left -
      Dom.get(`.page-sub > .home`)!.getBoundingClientRect().left;
    Global.drag.width = item.width;
    Global.drag.height = item.height;
    state.list.data[state.listId].data[route?.params.mainId as string]
      .data[payload.subId].status = `edit`;
    state.conf.vibrate && navigator.vibrate(40);
  },
  dragStartSub: (payload: {$event: TouchEvent;}): void => {
    if (Global.drag.id && !Global.drag.clone) {
      Global.drag.clone =
        Dom.get(`.item-sub[data-id="${Global.drag.id}"]`)!.cloneNode(true) as HTMLElement;
      Global.drag.clone.style.position = `absolute`;
      Global.drag.clone.style.zIndex = `1`;
      Global.drag.clone.style.top = `${Global.drag.top}px`;
      Global.drag.clone.style.left = `${Global.drag.left}px`;
      Global.drag.clone.style.width = `${Global.drag.width}px`;
      Global.drag.clone.style.height = `${Global.drag.height}px`;
      Dom.get(`.page-sub > .home > .body > .task`)!.appendChild(Global.drag.clone);
      state.list.data[state.listId].data[route?.params.mainId as string]
        .data[Global.drag.id].status = `hide`;
      // スクロール解除
      payload.$event.preventDefault();
    }
  },
  dragMoveSub: (payload: {y: number; $event: TouchEvent;}): void => {
    if (Global.drag.id && Global.drag.clone) {
      Global.drag.clone.style.top = `${Global.drag.top! + payload.y - Global.drag.y!}px`;
      const sort = state.list.data[state.listId].data[route?.params.mainId as string].sort;
      const index = sort.indexOf(Global.drag.id);
      const clone = Global.drag.clone.getBoundingClientRect();
      const wrap = Dom.get(`.page-sub > .home > .body > .task`)!.getBoundingClientRect();
      const prev = Dom.get(`.item-sub[data-id="${sort[index - 1]}"]`)?.getBoundingClientRect();
      const current = Dom.get(`.item-sub[data-id="${sort[index]}"]`)!.getBoundingClientRect();
      const next = Dom.get(`.item-sub[data-id="${sort[index + 1]}"]`)?.getBoundingClientRect();
      if (prev && clone.top + (clone.height / 2) <
          (next ? next.top : wrap.top + wrap.height) - ((prev.height + current.height) / 2)) {
        sort.splice(index - 1, 0, sort.splice(index, 1)[0]);
      } else if (next && clone.top + (clone.height / 2) >
          (prev ? prev.top + prev.height : wrap.top) + ((current.height + next.height) / 2)) {
        sort.splice(index + 1, 0, sort.splice(index, 1)[0]);
      }
      // スクロール解除
      payload.$event.preventDefault();
    }
  },
  dragEndSub: (): void => {
    if (Global.drag.id && Global.drag.clone) {
      Global.drag.clone.classList.remove(`edit`);
      Global.drag.clone.animate({
        top: [`${Global.drag.clone.getBoundingClientRect().top}px`,
          `${Dom.get(`.item-sub[data-id="${Global.drag.id}"]`)!.getBoundingClientRect().top}px`],
      }, Const.Base.duration[state.conf.speed]).addEventListener(`finish`, () => {
        state.list.data[state.listId]
          .data[route?.params.mainId as string].data[Global.drag.id!].status = ``;
        action.saveList();
        Global.drag.clone!.remove();
        Global.drag = {};
      });
    } else if (Global.drag.id && !Global.drag.clone) {
      state.list.data[state.listId]
        .data[route?.params.mainId as string].data[Global.drag.id].status = ``;
      Global.drag = {};
    }
  },
  swipeInitSub: (payload: {target: HTMLElement; x: number; y: number;}): void => {
    const item = payload.target.getBoundingClientRect();
    Global.swipe.status = Global.swipe.status === `end` ? `move` : `start`;
    Global.swipe.target = payload.target;
    Global.swipe.x = payload.x;
    Global.swipe.y = payload.y;
    Global.swipe.side = item.left + (item.width / 2);
    if (Global.swipe.status === `move`) {
      Global.swipe.target!.removeEventListener(`transitionend`, Global.swipe.listener!);
      Global.swipe.target!.classList.remove(`v-enter-active`);
      Global.swipe.target!.style.transform = `translateX(${Global.swipe.side}px)`;
    }
  },
  swipeStartSub: (payload: {x: number; y: number;}): void => {
    if (Global.swipe.status === `start`) {
      if (Math.abs(payload.x - Global.swipe.x!) + Math.abs(payload.y - Global.swipe.y!) > 15) {
        Math.abs(payload.x - Global.swipe.x!) > Math.abs(payload.y - Global.swipe.y!) ?
          (Global.swipe.status = `move`) : (Global.swipe = {});
      }
    }
  },
  swipeMoveSub: (payload: {x: number; y: number;}): void => {
    if (Global.swipe.status === `move`) {
      const x = Global.swipe.side! + payload.x - Global.swipe.x!;
      Global.swipe.target!.style.transform = `translateX(${x > 0 ? x : 0}px)`;
    }
  },
  swipeEndSub: (payload: {x: number;}): void => {
    if (Global.swipe.status === `move`) {
      Global.swipe.status = `end`;
      if (Global.swipe.side! + payload.x - Global.swipe.x! > 100) {
        action.routerBack();
        Global.swipe = {};
      } else {
        Global.swipe.target!.style.transform = ``;
        Global.swipe.target!.classList.add(`v-enter-active`);
        Global.swipe.target!.addEventListener(`transitionend`, (Global.swipe.listener = () => {
          Global.swipe.target!.removeEventListener(`transitionend`, Global.swipe.listener!);
          Global.swipe.target!.classList.remove(`v-enter-active`);
          Global.swipe = {};
        }));
      }
    } else {
      Global.swipe = {};
    }
  },
  downloadBackupConf: (payload: {target: HTMLElement;}): void => {
    const data = `${localStorage.getItem(`route`) || Const.Init.listId}\n` +
      `${localStorage.getItem(`list`) || JSON.stringify(Const.Init.list)}\n` +
      `${localStorage.getItem(`conf`) || JSON.stringify(Const.Init.conf)}`;
    if (process.env.mode !== `app`) {
      payload.target.setAttribute(`download`, Const.Base.backup);
      payload.target.setAttribute(`href`, `data:text/plain,${encodeURIComponent(data)}`);
    } else {
      Cordova.File.write(Const.Base.backup, data,
        (filePath) => {
          dialog.action.open({
            mode: `alert`,
            title: Lang[state.conf.lang].dialog.backup,
            message: filePath,
            cancel: {
              name: Lang[state.conf.lang].common.ok,
              callback: () => {
                dialog.action.close();
              },
            },
          });
        }, (errorCode) => {
          dialog.action.open({
            mode: `alert`,
            title: Lang[state.conf.lang].dialog.backupError,
            message: String(errorCode),
            cancel: {
              name: Lang[state.conf.lang].common.ok,
              callback: () => {
                dialog.action.close();
              },
            },
          });
        });
    }
  },
  uploadBackupConf: (payload: {file: File;}): void => {
    const reader = new FileReader();
    reader.onload = (_event: any) => {
      const fileList = _event.target.result.split(`\n`);
      if (fileList.length === 3 && Util.isJson(fileList[1]) && Util.isJson(fileList[2])) {
        state.conf = JSON.parse(fileList[2]);
        state.list = JSON.parse(fileList[1]);
        action.routerMain({listId: fileList[0]});
        action.saveConf();
        action.saveList();
      } else {
        dialog.action.open({
          mode: `alert`,
          title: Lang[state.conf.lang].dialog.fileError,
          message: ``,
          cancel: {
            name: Lang[state.conf.lang].common.ok,
            callback: () => {
              dialog.action.close();
            },
          },
        });
      }
    };
    reader.readAsText(payload.file);
  },
  resetConfConf: (): void => {
    dialog.action.open({
      mode: `confirm`,
      title: Lang[state.conf.lang].dialog.reset,
      message: ``,
      ok: {
        name: Lang[state.conf.lang].common.ok,
        callback: () => {
          dialog.action.close();
          state.conf = Const.Init.conf;
          action.saveConf();
        },
      },
      cancel: {
        name: Lang[state.conf.lang].common.cancel,
        callback: () => {
          dialog.action.close();
        },
      },
    });
  },
  resetListConf: (): void => {
    dialog.action.open({
      mode: `confirm`,
      title: Lang[state.conf.lang].dialog.reset,
      message: ``,
      ok: {
        name: Lang[state.conf.lang].common.ok,
        callback: () => {
          dialog.action.close();
          state.list = Const.Init.list;
          action.routerMain({listId: Const.Init.listId});
          action.saveList();
        },
      },
      cancel: {
        name: Lang[state.conf.lang].common.cancel,
        callback: () => {
          dialog.action.close();
        },
      },
    });
  },
  swipeInitConf: (payload: {target: HTMLElement; x: number; y: number;}): void => {
    const item = payload.target.getBoundingClientRect();
    Global.swipe.status = Global.swipe.status === `end` ? `move` : `start`;
    Global.swipe.target = payload.target;
    Global.swipe.x = payload.x;
    Global.swipe.y = payload.y;
    Global.swipe.side = item.top + (item.height / 2);
    if (Global.swipe.status === `move`) {
      Global.swipe.target!.removeEventListener(`transitionend`, Global.swipe.listener!);
      Global.swipe.target!.classList.remove(`v-enter-active`);
      Global.swipe.target!.style.transform = `translateY(${Global.swipe.side}px)`;
    }
  },
  swipeStartConf: (payload: {x: number; y: number;}): void => {
    if (Global.swipe.status === `start`) {
      if (Math.abs(payload.x - Global.swipe.x!) + Math.abs(payload.y - Global.swipe.y!) > 15) {
        Math.abs(payload.x - Global.swipe.x!) < Math.abs(payload.y - Global.swipe.y!) ?
          (Global.swipe.status = `move`) : (Global.swipe = {});
      }
    }
  },
  swipeMoveConf: (payload: {x: number; y: number;}): void => {
    if (Global.swipe.status === `move`) {
      const y = Global.swipe.side! + payload.y - Global.swipe.y!;
      Global.swipe.target!.style.transform = `translateY(${y > 0 ? y : 0}px)`;
    }
  },
  swipeEndConf: (payload: {y: number;}): void => {
    if (Global.swipe.status === `move`) {
      Global.swipe.status = `end`;
      if (Global.swipe.side! + payload.y - Global.swipe.y! > 100) {
        action.routerBack();
        Global.swipe = {};
      } else {
        Global.swipe.target!.style.transform = ``;
        Global.swipe.target!.classList.add(`v-enter-active`);
        Global.swipe.target!.addEventListener(`transitionend`, (Global.swipe.listener = () => {
          Global.swipe.target!.removeEventListener(`transitionend`, Global.swipe.listener!);
          Global.swipe.target!.classList.remove(`v-enter-active`);
          Global.swipe = {};
        }));
      }
    } else {
      Global.swipe = {};
    }
  },
};
