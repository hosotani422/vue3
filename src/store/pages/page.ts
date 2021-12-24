import * as Vue from 'vue';
import router from '@/router';
import * as Util from '@/assets/script/base/util';
import * as Dom from '@/assets/script/base/dom';
import * as Cordova from '@/assets/script/cordova/cordova';
import Global from '@/assets/script/base/global';
import * as Const from '@/assets/script/const/const';
import * as Lang from '@/assets/script/lang/lang';

export const namespaced = true;

export const state = () => ({
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
} as const);

export const getters: Getters<ReturnType<typeof state>, RootState> = {
  classItemList: (_state, _getters, _rootState, _rootGetters) => (listId: string): object => ({
    select: _state.listId === listId,
    edit: _state.list.data[listId].status === `edit`,
    hide: _state.list.data[listId].status === `hide`,
    warn: ((flag) => {
      Object.values(_state.list.data[listId].data).forEach((main) => {
        new Date(`${main.date || `9999/99/99`} ${main.time || `00:00`}`).getTime() <
          new Date().setDate(new Date().getDate() + 2) && (flag = true);
      });
      return flag;
    })(false),
    error: ((flag) => {
      Object.values(_state.list.data[listId].data).forEach((main) => {
        new Date(`${main.date || `9999/99/99`} ${main.time || `00:00`}`).getTime() <
          new Date().setDate(new Date().getDate() + 1) && (flag = true);
      });
      return flag;
    })(false),
  }),
  textCountList: (_state, _getters, _rootState, _rootGetters) => (listId: string): string =>
    `${Object.values(_state.list.data[listId].data).reduce((prev, main) =>
      (!main.check ? ++prev : prev), 0)}/${_state.list.data[listId].sort.length}`,
  classItemMain: (_state, _getters, _rootState, _rootGetters) => (mainId: string): object => {
    const main = _state.list.data[_state.listId].data[mainId];
    return {
      select: _rootState.route.params.mainId === mainId,
      check: main.check,
      edit: main.status === `edit`,
      drag: main.status === `drag`,
      hide: main.status === `hide`,
      warn: new Date(`${main.date || `9999/99/99`} ${main.time || `00:00`}`).getTime() <
        new Date().setDate(new Date().getDate() + 2),
      error: new Date(`${main.date || `9999/99/99`} ${main.time || `00:00`}`).getTime() <
        new Date().setDate(new Date().getDate() + 1),
    };
  },
  textCountMain: (_state, _getters, _rootState, _rootGetters) => (mainId: string): string => {
    const main = _state.list.data[_state.listId].data[mainId];
    return `${Object.values(main.data).reduce((prev, sub) =>
      (!sub.check ? ++prev : prev), 0)}/${main.sort.length}`;
  },
  classTaskSub: (_state, _getters, _rootState, _rootGetters) => (subId: string): object => {
    const sub = _state.list.data[_state.listId]
      .data[_rootState.route.params.mainId].data[subId];
    return {
      check: sub.check,
      edit: sub.status === `edit`,
      drag: sub.status === `drag`,
      hide: sub.status === `hide`,
    };
  },
  textMemoSub: (_state, _getters, _rootState, _rootGetters) => (): string => {
    const main = _state.list.data[_state.listId].data[_rootState.route.params.mainId];
    return Object.values(main.data).reduce((prev, sub) => `${prev}\n${sub.title}`, ``).slice(1);
  },
  classFootSub: (_state, _getters, _rootState, _rootGetters) => (): object => {
    const main = _state.list.data[_state.listId].data[_rootState.route.params.mainId];
    return {
      warn: new Date(`${main.date || `9999/99/99`} ${main.time || `00:00`}`).getTime() <
        new Date().setDate(new Date().getDate() + 2),
      error: new Date(`${main.date || `9999/99/99`} ${main.time || `00:00`}`).getTime() <
        new Date().setDate(new Date().getDate() + 1),
    };
  },
  textAlarmSub: (_state, _getters, _rootState, _rootGetters) => (): string =>
    _state.list.data[_state.listId]
      .data[_rootState.route.params.mainId].alarm.reduce((prev, alarmId) =>
        `${prev},${Lang[_state.conf.lang].dialog.alarm.data[alarmId].label}`, ``).slice(1),
};

export const actions: Actions<ReturnType<typeof state>, RootState> = {
  init(_context, _payload: void) {
    _context.dispatch(`loadConf`);
    _context.dispatch(`loadList`);
    _context.dispatch(`loadRoute`);
    _context.dispatch(`emptyTrash`);
  },
  loadRoute(_context, _payload: void) {
    _context.dispatch(`routerMain`,
      {listId: localStorage.getItem(`route`) || Const.Init.listId});
  },
  saveRoute(_context, _payload: void) {
    localStorage.setItem(`route`, _context.state.listId);
  },
  loadList(_context, _payload: void) {
    _context.commit(`generic`,
      [`list`, JSON.parse(localStorage.getItem(`list`)!) || Const.Init.list]);
    _context.dispatch(`reactAlarm`);
  },
  saveList(_context, _payload: void) {
    localStorage.setItem(`list`, JSON.stringify(_context.state.list));
    _context.dispatch(`reactAlarm`);
  },
  loadConf(_context, _payload: void) {
    _context.commit(`generic`,
      [`conf`, JSON.parse(localStorage.getItem(`conf`)!) || Const.Init.conf]);
    _context.dispatch(`reactSound`);
  },
  saveConf(_context, _payload: void) {
    localStorage.setItem(`conf`, JSON.stringify(_context.state.conf));
    _context.dispatch(`reactSound`);
  },
  reactAlarm(_context, _payload: void) {
    Cordova.Notice.removeAll();
    Object.values(_context.state.list.data).forEach((list) => {
      Object.values(list.data).forEach((main) => {
        if (main.date) {
          main.alarm.forEach((alarm) => {
            Cordova.Notice.insert({
              title: Lang[_context.state.conf.lang].alarm.title,
              message: `${list.title} ⇒ ${main.title}`,
              date: ((date) => {
                date.setMinutes(date.getMinutes() -
                Lang[_context.state.conf.lang].dialog.alarm.data[alarm].value);
                return date;
              })(new Date(`${main.date}${main.time || `00:00`}`)),
            });
          });
        }
      });
    });
  },
  reactSound(_context, _payload: void) {
    Object.values(Const.Sound).forEach((sound) => {
      sound.volume = Number(_context.state.conf.volume) / 3;
    });
  },
  emptyTrash(_context, _payload: void) {
    _context.commit(`generic`, [`list`, `data`, `2`, {sort: [], data: {}}]);
    _context.dispatch(`saveList`);
  },
  routerMain(_context, _payload: {listId: string;}) {
    _context.commit(`generic`, [`listId`, _payload.listId]);
    _context.dispatch(`saveRoute`);
    !_context.rootState.route.path ?
      router.push(`/${_payload.listId}`) :
      _context.dispatch(`routerBack`);
  },
  routerList(_context, _payload: void) {
    router.push(`/${_context.state.listId}/list`);
  },
  routerSub(_context, _payload: {mainId: string;}) {
    router.push(`/${_context.state.listId}/sub/${_payload.mainId}`);
  },
  routerConf(_context, _payload: void) {
    router.push(`/${_context.state.listId}/conf`);
  },
  routerBack(_context, _payload: void) {
    router.back();
  },
  insertItemList(_context, _payload: void) {
    _context.dispatch(`popup/dialog/open`, {
      mode: `text`,
      title: Lang[_context.state.conf.lang].dialog.insert,
      message: ``,
      text: {
        value: ``,
        placeholder: Lang[_context.state.conf.lang].page.list,
      },
      ok: {
        name: Lang[_context.state.conf.lang].common.ok,
        callback: () => {
          _context.commit(`generic`, [`list`, ((list) => {
            const listId = String(new Date().getTime());
            list.sort.unshift(listId);
            list.data[listId] = {
              status: ``,
              title: _context.rootState.popup.dialog.text.value,
              sort: [],
              data: {},
            };
            return list;
          })(Util.copy(_context.state.list))]);
          _context.dispatch(`popup/dialog/close`, {}, {root: true});
          _context.dispatch(`saveList`);
        },
      },
      cancel: {
        name: Lang[_context.state.conf.lang].common.cancel,
        callback: () => {
          _context.dispatch(`popup/dialog/close`, {}, {root: true});
        },
      },
    }, {root: true});
  },
  copyItemList(_context, _payload: {$event: Event; listId: string;}) {
    _context.commit(`generic`, [`list`, ((list) => {
      const listId = String(new Date().getTime());
      list.sort.splice(list.sort.indexOf(_payload.listId) + 1, 0, listId);
      list.data[_payload.listId].status = ``;
      list.data[listId] = Util.copy(list.data[_payload.listId]);
      return list;
    })(Util.copy(_context.state.list))]);
    _context.dispatch(`saveList`);
    // 画面遷移キャンセル
    _payload.$event.stopPropagation();
  },
  deleteItemList(_context, _payload: {$event: Event; listId: string;}) {
    _context.dispatch(`popup/dialog/open`, {
      mode: `confirm`,
      title: Lang[_context.state.conf.lang].dialog.delete,
      message: ``,
      ok: {
        name: Lang[_context.state.conf.lang].common.ok,
        callback: () => {
          const backup = Util.copy(_context.state.list);
          backup.data[_payload.listId].status = ``;
          _context.commit(`generic`, [`list`, ((list) => {
            list.data[_payload.listId].sort.forEach((mainId) => {
              list.data[`2`].sort.push(mainId);
              list.data[`2`].data[mainId] = list.data[_payload.listId].data[mainId];
            });
            list.sort.splice(list.sort.indexOf(_payload.listId), 1);
            delete list.data[_payload.listId];
            return list;
          })(Util.copy(_context.state.list))]);
          _context.dispatch(`popup/dialog/close`, {}, {root: true});
          _context.dispatch(`saveList`);
          Const.Sound.warn.play();
          _context.dispatch(`popup/notice/open`, {
            message: Lang[_context.state.conf.lang].notice.message,
            button: Lang[_context.state.conf.lang].notice.button,
            callback: () => {
              _context.dispatch(`popup/notice/close`, {}, {root: true});
              _context.commit(`generic`, [`list`, backup]);
              _context.dispatch(`saveList`);
            },
          }, {root: true});
        },
      },
      cancel: {
        name: Lang[_context.state.conf.lang].common.cancel,
        callback: () => {
          _context.dispatch(`popup/dialog/close`, {}, {root: true});
          _context.commit(`generic`, [`list`, `data`, _payload.listId, `status`, ``]);
        },
      },
    }, {root: true});
    // 画面遷移キャンセル
    _payload.$event.stopPropagation();
  },
  switchEditList(_context, _payload: {listId: string;}) {
    _context.state.list.sort.forEach((listId) => {
      _context.commit(`generic`, [`list`, `data`, listId, `status`,
        listId === _payload?.listId ? `edit` : ``]);
    });
  },
  dragInitList(_context, _payload: {listId: string; y: number;}) {
    const item = Dom.get(`.item-list[data-id="${_payload.listId}"]`)!.getBoundingClientRect();
    Global.drag.id = _payload.listId;
    Global.drag.y = _payload.y;
    Global.drag.top = item.top;
    Global.drag.left = item.left;
    Global.drag.width = item.width;
    Global.drag.height = item.height;
    _context.state.conf.vibrate && navigator.vibrate(40);
  },
  dragStartList(_context, _payload: {$event: TouchEvent;}) {
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
      _context.commit(`generic`, [`list`, `data`, Global.drag.id, `status`, `hide`]);
      // スクロール解除
      _payload.$event.preventDefault();
    }
  },
  dragMoveList(_context, _payload: {y: number; $event: TouchEvent;}) {
    if (Global.drag.id && Global.drag.clone) {
      Global.drag.clone.style.top = `${Global.drag.top! + _payload.y - Global.drag.y!}px`;
      _context.commit(`generic`, [`list`, `sort`, ((sort) => {
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
        return sort;
      })(Util.copy(_context.state.list.sort))]);
      // スクロール解除
      _payload.$event.preventDefault();
    }
  },
  dragEndList(_context, _payload: void) {
    if (Global.drag.id && Global.drag.clone) {
      Global.drag.clone.classList.remove(`edit`);
      Global.drag.clone.animate({
        top: [`${Global.drag.clone.getBoundingClientRect().top}px`,
          `${Dom.get(`.item-list[data-id="${Global.drag.id}"]`)!.getBoundingClientRect().top}px`],
      }, Const.Base.duration[_context.state.conf.speed]).addEventListener(`finish`, () => {
        _context.commit(`generic`, [`list`, `data`, Global.drag.id, `status`, ``]);
        _context.dispatch(`saveList`);
        Global.drag.clone!.remove();
        Global.drag = {};
      });
    } else if (Global.drag.id && !Global.drag.clone) {
      Global.drag = {};
    }
  },
  swipeInitList(_context, _payload: {target: HTMLElement; x: number; y: number;}) {
    Global.swipe.status = Global.swipe.status === `end` ? `move` : `start`;
    Global.swipe.target = _payload.target;
    Global.swipe.x = _payload.x;
    Global.swipe.y = _payload.y;
    Global.swipe.side = _payload.target.getBoundingClientRect().left;
    if (Global.swipe.status === `move`) {
      Global.swipe.target!.removeEventListener(`transitionend`, Global.swipe.listener!);
      Global.swipe.target!.classList.remove(`v-enter-active`);
      Global.swipe.target!.style.transform = `translateX(${Global.swipe.side}px)`;
    }
  },
  swipeStartList(_context, _payload: {x: number; y: number;}) {
    if (Global.swipe.status === `start`) {
      if (Math.abs(_payload.x - Global.swipe.x!) + Math.abs(_payload.y - Global.swipe.y!) > 15) {
        Math.abs(_payload.x - Global.swipe.x!) > Math.abs(_payload.y - Global.swipe.y!) ?
          (Global.swipe.status = `move`) : (Global.swipe = {});
      }
    }
  },
  swipeMoveList(_context, _payload: {x: number; y: number;}) {
    if (Global.swipe.status === `move`) {
      const x = Global.swipe.side! + _payload.x - Global.swipe.x!;
      Global.swipe.target!.style.transform = `translateX(${x < 0 ? x : 0}px)`;
    }
  },
  swipeEndList(_context, _payload: {x: number;}) {
    if (Global.swipe.status === `move`) {
      Global.swipe.status = `end`;
      if (Global.swipe.side! + _payload.x - Global.swipe.x! < -100) {
        _context.dispatch(`routerBack`);
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
  insertItemMain(_context, _payload: void) {
    _context.dispatch(`popup/dialog/open`, {
      mode: `text`,
      title: Lang[_context.state.conf.lang].dialog.insert,
      message: ``,
      text: {
        value: ``,
        placeholder: Lang[_context.state.conf.lang].page.main,
      },
      ok: {
        name: Lang[_context.state.conf.lang].common.ok,
        callback: () => {
          _context.commit(`generic`, [`list`, `data`, _context.state.listId, ((main) => {
            const mainId = String(new Date().getTime());
            main.sort.unshift(mainId);
            main.data[mainId] = {
              status: ``,
              check: false,
              title: _context.rootState.popup.dialog.text.value,
              date: ``,
              time: ``,
              alarm: [],
              task: true,
              sort: [`1`],
              data: {'1': {status: ``, check: false, title: ``}},
            };
            return main;
          })(Util.copy(_context.state.list.data[_context.state.listId]))]);
          _context.dispatch(`popup/dialog/close`, {}, {root: true});
          _context.dispatch(`saveList`);
        },
      },
      cancel: {
        name: Lang[_context.state.conf.lang].common.cancel,
        callback: () => {
          _context.dispatch(`popup/dialog/close`, {}, {root: true});
        },
      },
    }, {root: true});
  },
  copyItemMain(_context, _payload: {$event: Event; mainId: string;}) {
    _context.commit(`generic`, [`list`, `data`, _context.state.listId, ((main) => {
      const mainId = String(new Date().getTime());
      main.sort.splice(main.sort.indexOf(_payload.mainId) + 1, 0, mainId);
      main.data[_payload.mainId].status = ``;
      main.data[mainId] = Util.copy(main.data[_payload.mainId]);
      return main;
    })(Util.copy(_context.state.list.data[_context.state.listId]))]);
    _context.dispatch(`saveList`);
    // 画面遷移キャンセル
    _payload.$event.stopPropagation();
  },
  moveItemMain(_context, _payload: {$event: Event; mainId: string;}) {
    _context.dispatch(`popup/dialog/open`, {
      mode: `radio`,
      title: Lang[_context.state.conf.lang].dialog.move,
      message: ``,
      radio: {
        none: false,
        select: _context.state.listId,
        sort: _context.state.list.sort,
        data: _context.state.list.data,
      },
      ok: {
        name: ``,
        callback: () => {
          _context.commit(`generic`, [`list`, ((list) => {
            const from = list.data[_context.state.listId];
            const to = list.data[_context.rootState.popup.dialog.radio.select];
            to.sort.unshift(_payload.mainId);
            to.data[_payload.mainId] = from.data[_payload.mainId];
            to.data[_payload.mainId].status = ``;
            from.sort.splice(from.sort.indexOf(_payload.mainId), 1);
            delete from.data[_payload.mainId];
            return list;
          })(Util.copy(_context.state.list))]);
          _context.dispatch(`popup/dialog/close`, {}, {root: true});
          _context.dispatch(`saveList`);
        },
      },
      cancel: {
        name: Lang[_context.state.conf.lang].common.cancel,
        callback: () => {
          _context.dispatch(`popup/dialog/close`, {}, {root: true});
          _context.commit(`generic`, [`list`, `data`,
            _context.state.listId, `data`, _payload.mainId, `status`, ``]);
        },
      },
    }, {root: true});
    // 画面遷移キャンセル
    _payload.$event.stopPropagation();
  },
  deleteItemMain(_context, _payload: {$event: Event; mainId: string;}) {
    const backup = Util.copy(_context.state.list);
    backup.data[_context.state.listId].data[_payload.mainId].status = ``;
    _context.commit(`generic`, [`list`, ((list) => {
      const main = list.data[_context.state.listId];
      if (_context.state.listId !== `2`) {
        list.data[`2`].sort.push(_payload.mainId);
        list.data[`2`].data[_payload.mainId] = main.data[_payload.mainId];
        list.data[`2`].data[_payload.mainId].status = ``;
      }
      main.sort.splice(main.sort.indexOf(_payload.mainId), 1);
      delete main.data[_payload.mainId];
      return list;
    })(Util.copy(_context.state.list))]);
    _context.dispatch(`saveList`);
    Const.Sound.warn.play();
    _context.dispatch(`popup/notice/open`, {
      message: Lang[_context.state.conf.lang].notice.message,
      button: Lang[_context.state.conf.lang].notice.button,
      callback: () => {
        _context.dispatch(`popup/notice/close`, {}, {root: true});
        _context.commit(`generic`, [`list`, backup]);
        _context.dispatch(`saveList`);
      },
    }, {root: true});
    // 画面遷移キャンセル
    _payload.$event.stopPropagation();
  },
  checkItemMain(_context, _payload: {mainId: string; checked: boolean;}) {
    _context.commit(`generic`, [`list`, `data`, _context.state.listId, ((main) => {
      main.sort.splice(main.sort.indexOf(_payload.mainId), 1);
      main.sort[_payload.checked ? `push` : `unshift`](_payload.mainId);
      main.data[_payload.mainId].check = _payload.checked;
      return main;
    })(Util.copy(_context.state.list.data[_context.state.listId]))]);
    _context.dispatch(`saveList`);
    Const.Sound[_payload.checked ? `ok` : `cancel`].play();
  },
  switchEditMain(_context, _payload: {mainId: string;}) {
    _context.state.list.data[_context.state.listId].sort.forEach((mainId) => {
      _context.commit(`generic`, [`list`, `data`, _context.state.listId,
        `data`, mainId, `status`, mainId === _payload?.mainId ? `edit` : ``]);
    });
  },
  dragInitMain(_context, _payload: {mainId: string; y: number;}) {
    const item = Dom.get(`.item-main[data-id="${_payload.mainId}"]`)!.getBoundingClientRect();
    Global.drag.id = _payload.mainId;
    Global.drag.y = _payload.y;
    Global.drag.top = item.top;
    Global.drag.left = item.left;
    Global.drag.width = item.width;
    Global.drag.height = item.height;
    _context.state.conf.vibrate && navigator.vibrate(40);
  },
  dragStartMain(_context, _payload: {$event: TouchEvent;}) {
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
      _context.commit(`generic`, [`list`, `data`,
        _context.state.listId, `data`, Global.drag.id, `status`, `hide`]);
      // スクロール解除
      _payload.$event.preventDefault();
    }
  },
  dragMoveMain(_context, _payload: {y: number; $event: TouchEvent;}) {
    if (Global.drag.id && Global.drag.clone) {
      Global.drag.clone.style.top = `${Global.drag.top! + _payload.y - Global.drag.y!}px`;
      _context.commit(`generic`, [`list`, `data`, _context.state.listId, `sort`, ((sort) => {
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
        return sort;
      })(Util.copy(_context.state.list.data[_context.state.listId].sort))]);
      // スクロール解除
      _payload.$event.preventDefault();
    }
  },
  dragEndMain(_context, _payload: void) {
    if (Global.drag.id && Global.drag.clone) {
      Global.drag.clone.classList.remove(`edit`);
      Global.drag.clone.animate({
        top: [`${Global.drag.clone.getBoundingClientRect().top}px`,
          `${Dom.get(`.item-main[data-id="${Global.drag.id}"]`)!.getBoundingClientRect().top}px`],
      }, Const.Base.duration[_context.state.conf.speed]).addEventListener(`finish`, () => {
        _context.commit(`generic`, [`list`, `data`,
          _context.state.listId, `data`, Global.drag.id, `status`, ``]);
        _context.dispatch(`saveList`);
        Global.drag.clone!.remove();
        Global.drag = {};
      });
    } else if (Global.drag.id && !Global.drag.clone) {
      Global.drag = {};
    }
  },
  inputItemSub(_context, _payload: {subId: string; value: string;}) {
    _context.commit(`generic`, [`list`, `data`, _context.state.listId, `data`,
      _context.rootState.route.params.mainId, `data`, _payload.subId, `title`, _payload.value]);
    _context.dispatch(`saveList`);
    Dom.resize(Dom.get(`.item-sub[data-id="${_payload.subId}"] > .title`)!);
  },
  async enterItemSub(_context, _payload: {subId: string; value: string; caret: number;}) {
    const listId = _context.state.listId;
    const mainId = _context.rootState.route.params.mainId;
    const subId = String(new Date().getTime());
    _context.commit(`generic`, [`list`, `data`, listId, `data`, mainId, ((sub) => {
      sub.sort.splice(sub.sort.indexOf(_payload.subId) + 1, 0, subId);
      sub.data[_payload.subId].title = _payload.value.slice(0, _payload.caret);
      sub.data[subId] = {status: ``, check: false, title: _payload.value.slice(_payload.caret)};
      return sub;
    })(Util.copy(_context.state.list.data[listId].data[mainId]))]);
    _context.dispatch(`saveList`);
    await Vue.nextTick();
    Dom.resize(Dom.get(`.item-sub[data-id="${_payload.subId}"] > .title`)!);
    Dom.get(`.item-sub[data-id="${subId}"] > .title`)!.focus();
    ((element) => {
      Dom.resize(element);
      element.addEventListener(`transitionend`, function listener() {
        element.removeEventListener(`transitionend`, listener);
        element.style.height = ``;
      });
    })(Dom.get(`.item-sub[data-id="${subId}"]`)!);
  },
  async backItemSub(_context, _payload:
  {subId: string; index: number; caret: number; $event: KeyboardEvent;}) {
    if (_payload.caret === 0 && _payload.index > 0) {
      const listId = _context.state.listId;
      const mainId = _context.rootState.route.params.mainId;
      const sub = Util.copy(_context.state.list.data[listId].data[mainId]);
      const prevId = sub.sort[sub.sort.indexOf(_payload.subId) - 1];
      const caret = sub.data[prevId].title.length;
      _context.commit(`generic`, [`list`, `data`, listId, `data`, mainId, (() => {
        sub.sort.splice(sub.sort.indexOf(_payload.subId), 1);
        sub.data[prevId].title = `${sub.data[prevId].title}${sub.data[_payload.subId].title}`;
        delete sub.data[_payload.subId];
        return sub;
      })()]);
      _context.dispatch(`saveList`);
      Dom.resize(Dom.get(`.item-sub[data-id="${_payload.subId}"]`)!);
      await Vue.nextTick();
      ((element) => {
        Dom.resize(element);
        element.focus();
        element.selectionStart = caret;
        element.selectionEnd = caret;
      })(Dom.get(`.item-sub[data-id="${prevId}"] > .title`) as HTMLInputElement);
      // 文字削除キャンセル
      _payload.$event.preventDefault();
    }
  },
  async deleteItemSub(_context, _payload: {subId: string;}) {
    const listId = _context.state.listId;
    const mainId = _context.rootState.route.params.mainId;
    const backup = Util.copy(_context.state.list.data[listId].data[mainId]);
    Dom.resize(Dom.get(`.item-sub[data-id="${_payload.subId}"]`)!);
    _context.commit(`generic`, [`list`, `data`, listId, `data`, mainId, ((sub) => {
      sub.sort.splice(sub.sort.indexOf(_payload.subId), 1);
      delete sub.data[_payload.subId];
      return sub;
    })(Util.copy(_context.state.list.data[listId].data[mainId]))]);
    _context.dispatch(`saveList`);
    Const.Sound.warn.play();
    await Vue.nextTick();
    _context.dispatch(`popup/notice/open`, {
      message: Lang[_context.state.conf.lang].notice.message,
      button: Lang[_context.state.conf.lang].notice.button,
      callback: async() => {
        _context.dispatch(`popup/notice/close`, {}, {root: true});
        _context.commit(`generic`, [`list`, `data`, listId, `data`, mainId, backup]);
        _context.dispatch(`saveList`);
        await Vue.nextTick();
        ((element) => {
          Dom.resize(element);
          element.addEventListener(`transitionend`, function listener() {
            element.removeEventListener(`transitionend`, listener);
            element.style.height = ``;
          });
        })(Dom.get(`.item-sub[data-id="${_payload.subId}"]`)!);
      },
    }, {root: true});
  },
  checkItemSub(_context, _payload: {subId: string; checked: boolean;}) {
    const listId = _context.state.listId;
    const mainId = _context.rootState.route.params.mainId;
    _context.commit(`generic`, [`list`, `data`, listId, `data`, mainId, ((sub) => {
      sub.sort.splice(sub.sort.indexOf(_payload.subId), 1);
      sub.sort[_payload.checked ? `push` : `unshift`](_payload.subId);
      sub.data[_payload.subId].check = _payload.checked;
      return sub;
    })(Util.copy(_context.state.list.data[listId].data[mainId]))]);
    _context.dispatch(`saveList`);
    Const.Sound[_payload.checked ? `ok` : `cancel`].play();
  },
  switchItemSub(_context, _payload: void) {
    const listId = _context.state.listId;
    const mainId = _context.rootState.route.params.mainId;
    _context.commit(`generic`, [`list`, `data`, listId, `data`,
      mainId, `task`, !_context.state.list.data[listId].data[mainId].task]);
    _context.dispatch(`saveList`);
  },
  inputMemoSub(_context, _payload: {value: string;}) {
    const listId = _context.state.listId;
    const mainId = _context.rootState.route.params.mainId;
    _context.commit(`generic`, [`list`, `data`, listId, `data`, mainId, ((sub) => {
      sub.sort = [];
      sub.data = {};
      _payload.value.split(`\n`).forEach((title, i) => {
        const subId = String(new Date().getTime()) + i;
        sub.sort.push(subId);
        sub.data[subId] = {status: ``, check: false, title};
      });
      return sub;
    })(Util.copy(_context.state.list.data[listId].data[mainId]))]);
    _context.dispatch(`saveList`);
  },
  openDateSub(_context, _payload: {date: string;}) {
    const listId = _context.state.listId;
    const mainId = _context.rootState.route.params.mainId;
    _context.dispatch(`popup/date/open`, {
      select: _payload.date,
      current: ((date) =>
        `${date.getFullYear()}/${date.getMonth() + 1}`)(new Date(_payload.date || new Date())),
      cancel: Lang[_context.state.conf.lang].common.cancel,
      clear: Lang[_context.state.conf.lang].common.clear,
      callback: (date: string) => {
        _context.dispatch(`popup/date/close`, {}, {root: true});
        _context.commit(`generic`, [`list`, `data`, listId, `data`, mainId, `date`, date]);
        _context.dispatch(`saveList`);
      },
    }, {root: true});
  },
  openTimeSub(_context, _payload: {time: string;}) {
    const listId = _context.state.listId;
    const mainId = _context.rootState.route.params.mainId;
    _context.dispatch(`popup/time/open`, {
      hour: _payload.time ? Number(_payload.time.split(`:`)[0]) : 0,
      minute: _payload.time ? Number(_payload.time.split(`:`)[1]) : 0,
      cancel: Lang[_context.state.conf.lang].common.cancel,
      clear: Lang[_context.state.conf.lang].common.clear,
      ok: Lang[_context.state.conf.lang].common.ok,
      callback: (hour: number, minute: number) => {
        _context.dispatch(`popup/time/close`, {}, {root: true});
        _context.commit(`generic`, [`list`, `data`, listId, `data`, mainId, `time`,
          `${String(hour).padStart(2, `0`)}:${String(minute).padStart(2, `0`)}`]);
        _context.dispatch(`saveList`);
      },
    }, {root: true});
  },
  openAlarmSub(_context, _payload: void) {
    const listId = _context.state.listId;
    const mainId = _context.rootState.route.params.mainId;
    _context.dispatch(`popup/dialog/open`, {
      mode: `check`,
      title: Lang[_context.state.conf.lang].dialog.alarm.title,
      message: ``,
      check: {
        all: true,
        sort: Lang[_context.state.conf.lang].dialog.alarm.sort,
        data: ((data) => {
          Lang[_context.state.conf.lang].dialog.alarm.sort.forEach((id) => {
            data[id] = {check: _context.state.list.data[listId].data[mainId].alarm.includes(id),
              title: Lang[_context.state.conf.lang].dialog.alarm.data[id].label};
          });
          return data;
        })({} as any),
      },
      ok: {
        name: Lang[_context.state.conf.lang].common.ok,
        callback: () => {
          _context.dispatch(`popup/dialog/close`, {}, {root: true});
          _context.commit(`generic`,
            [`list`, `data`, listId, `data`, mainId, `alarm`, ((alarm) => {
              Object.entries(_context.rootState.popup.dialog.check.data).forEach(([key, value]) => {
                value.check && alarm.push(key);
              });
              return alarm;
            })([] as string[])]);
          _context.dispatch(`saveList`);
        },
      },
      cancel: {
        name: Lang[_context.state.conf.lang].common.cancel,
        callback: () => {
          _context.dispatch(`popup/dialog/close`, {}, {root: true});
        },
      },
    }, {root: true});
  },
  dragInitSub(_context, _payload: {subId: string; y: number;}) {
    const item = Dom.get(`.item-sub[data-id="${_payload.subId}"]`)!.getBoundingClientRect();
    Global.drag.id = _payload.subId;
    Global.drag.y = _payload.y;
    Global.drag.top = item.top;
    Global.drag.left = item.left -
      Dom.get(`.page-sub > .home`)!.getBoundingClientRect().left;
    Global.drag.width = item.width;
    Global.drag.height = item.height;
    _context.commit(`generic`, [`list`, `data`, _context.state.listId,
      `data`, _context.rootState.route.params.mainId, `data`, _payload.subId, `status`, `edit`]);
    _context.state.conf.vibrate && navigator.vibrate(40);
  },
  dragStartSub(_context, _payload: {$event: TouchEvent;}) {
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
      _context.commit(`generic`, [`list`, `data`, _context.state.listId, `data`,
        _context.rootState.route.params.mainId, `data`, Global.drag.id, `status`, `hide`]);
      // スクロール解除
      _payload.$event.preventDefault();
    }
  },
  dragMoveSub(_context, _payload: {y: number; $event: TouchEvent;}) {
    if (Global.drag.id && Global.drag.clone) {
      Global.drag.clone.style.top = `${Global.drag.top! + _payload.y - Global.drag.y!}px`;
      _context.commit(`generic`, [`list`, `data`, _context.state.listId,
        `data`, _context.rootState.route.params.mainId, `sort`, ((sort) => {
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
          return sort;
        })(Util.copy(_context.state.list.data[_context.state.listId]
          .data[_context.rootState.route.params.mainId].sort))]);
      // スクロール解除
      _payload.$event.preventDefault();
    }
  },
  dragEndSub(_context, _payload: void) {
    if (Global.drag.id && Global.drag.clone) {
      Global.drag.clone.classList.remove(`edit`);
      Global.drag.clone.animate({
        top: [`${Global.drag.clone.getBoundingClientRect().top}px`,
          `${Dom.get(`.item-sub[data-id="${Global.drag.id}"]`)!.getBoundingClientRect().top}px`],
      }, Const.Base.duration[_context.state.conf.speed]).addEventListener(`finish`, () => {
        _context.commit(`generic`, [`list`, `data`, _context.state.listId,
          `data`, _context.rootState.route.params.mainId, `data`, Global.drag.id, `status`, ``]);
        _context.dispatch(`saveList`);
        Global.drag.clone!.remove();
        Global.drag = {};
      });
    } else if (Global.drag.id && !Global.drag.clone) {
      _context.commit(`generic`, [`list`, `data`, _context.state.listId,
        `data`, _context.rootState.route.params.mainId, `data`, Global.drag.id, `status`, ``]);
      Global.drag = {};
    }
  },
  swipeInitSub(_context, _payload: {target: HTMLElement; x: number; y: number;}) {
    const item = _payload.target.getBoundingClientRect();
    Global.swipe.status = Global.swipe.status === `end` ? `move` : `start`;
    Global.swipe.target = _payload.target;
    Global.swipe.x = _payload.x;
    Global.swipe.y = _payload.y;
    Global.swipe.side = item.left + (item.width / 2);
    if (Global.swipe.status === `move`) {
      Global.swipe.target!.removeEventListener(`transitionend`, Global.swipe.listener!);
      Global.swipe.target!.classList.remove(`v-enter-active`);
      Global.swipe.target!.style.transform = `translateX(${Global.swipe.side}px)`;
    }
  },
  swipeStartSub(_context, _payload: {x: number; y: number;}) {
    if (Global.swipe.status === `start`) {
      if (Math.abs(_payload.x - Global.swipe.x!) + Math.abs(_payload.y - Global.swipe.y!) > 15) {
        Math.abs(_payload.x - Global.swipe.x!) > Math.abs(_payload.y - Global.swipe.y!) ?
          (Global.swipe.status = `move`) : (Global.swipe = {});
      }
    }
  },
  swipeMoveSub(_context, _payload: {x: number; y: number;}) {
    if (Global.swipe.status === `move`) {
      const x = Global.swipe.side! + _payload.x - Global.swipe.x!;
      Global.swipe.target!.style.transform = `translateX(${x > 0 ? x : 0}px)`;
    }
  },
  swipeEndSub(_context, _payload: {x: number;}) {
    if (Global.swipe.status === `move`) {
      Global.swipe.status = `end`;
      if (Global.swipe.side! + _payload.x - Global.swipe.x! > 100) {
        _context.dispatch(`routerBack`);
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
  downloadBackupConf(_context, _payload: {target: HTMLElement;}) {
    const data = `${localStorage.getItem(`route`) || Const.Init.listId}\n` +
      `${localStorage.getItem(`list`) || JSON.stringify(Const.Init.list)}\n` +
      `${localStorage.getItem(`conf`) || JSON.stringify(Const.Init.conf)}`;
    if (process.env.mode !== `app`) {
      _payload.target.setAttribute(`download`, Const.Base.backup);
      _payload.target.setAttribute(`href`, `data:text/plain,${encodeURIComponent(data)}`);
    } else {
      Cordova.File.write(Const.Base.backup, data,
        (filePath) => {
          _context.dispatch(`popup/dialog/open`, {
            mode: `alert`,
            title: Lang[_context.state.conf.lang].dialog.backup,
            message: filePath,
            cancel: {
              name: Lang[_context.state.conf.lang].common.ok,
              callback: () => {
                _context.dispatch(`popup/dialog/close`, {}, {root: true});
              },
            },
          }, {root: true});
        }, (errorCode) => {
          _context.dispatch(`popup/dialog/open`, {
            mode: `alert`,
            title: Lang[_context.state.conf.lang].dialog.backupError,
            message: errorCode,
            cancel: {
              name: Lang[_context.state.conf.lang].common.ok,
              callback: () => {
                _context.dispatch(`popup/dialog/close`, {}, {root: true});
              },
            },
          }, {root: true});
        });
    }
  },
  uploadBackupConf(_context, _payload: {file: File;}) {
    const reader = new FileReader();
    reader.onload = (_event: any) => {
      const fileList = _event.target.result.split(`\n`);
      if (fileList.length === 3 && Util.isJson(fileList[1]) && Util.isJson(fileList[2])) {
        _context.commit(`generic`, [`conf`, JSON.parse(fileList[2])]);
        _context.commit(`generic`, [`list`, JSON.parse(fileList[1])]);
        _context.dispatch(`routerMain`, {listId: fileList[0]});
        _context.dispatch(`saveConf`);
        _context.dispatch(`saveList`);
      } else {
        _context.dispatch(`popup/dialog/open`, {
          mode: `alert`,
          title: Lang[_context.state.conf.lang].dialog.fileError,
          message: ``,
          cancel: {
            name: Lang[_context.state.conf.lang].common.ok,
            callback: () => {
              _context.dispatch(`popup/dialog/close`, {}, {root: true});
            },
          },
        }, {root: true});
      }
    };
    reader.readAsText(_payload.file);
  },
  resetConfConf(_context, _payload: void) {
    _context.dispatch(`popup/dialog/open`, {
      mode: `confirm`,
      title: Lang[_context.state.conf.lang].dialog.reset,
      message: ``,
      ok: {
        name: Lang[_context.state.conf.lang].common.ok,
        callback: () => {
          _context.dispatch(`popup/dialog/close`, {}, {root: true});
          _context.commit(`generic`, [`conf`, Const.Init.conf]);
          _context.dispatch(`saveConf`);
        },
      },
      cancel: {
        name: Lang[_context.state.conf.lang].common.cancel,
        callback: () => {
          _context.dispatch(`popup/dialog/close`, {}, {root: true});
        },
      },
    }, {root: true});
  },
  resetListConf(_context, _payload: void) {
    _context.dispatch(`popup/dialog/open`, {
      mode: `confirm`,
      title: Lang[_context.state.conf.lang].dialog.reset,
      message: ``,
      ok: {
        name: Lang[_context.state.conf.lang].common.ok,
        callback: () => {
          _context.dispatch(`popup/dialog/close`, {}, {root: true});
          _context.commit(`generic`, [`list`, Const.Init.list]);
          _context.dispatch(`routerMain`, {listId: Const.Init.listId});
          _context.dispatch(`saveList`);
        },
      },
      cancel: {
        name: Lang[_context.state.conf.lang].common.cancel,
        callback: () => {
          _context.dispatch(`popup/dialog/close`, {}, {root: true});
        },
      },
    }, {root: true});
  },
  swipeInitConf(_context, _payload: {target: HTMLElement; x: number; y: number;}) {
    const item = _payload.target.getBoundingClientRect();
    Global.swipe.status = Global.swipe.status === `end` ? `move` : `start`;
    Global.swipe.target = _payload.target;
    Global.swipe.x = _payload.x;
    Global.swipe.y = _payload.y;
    Global.swipe.side = item.top + (item.height / 2);
    if (Global.swipe.status === `move`) {
      Global.swipe.target!.removeEventListener(`transitionend`, Global.swipe.listener!);
      Global.swipe.target!.classList.remove(`v-enter-active`);
      Global.swipe.target!.style.transform = `translateY(${Global.swipe.side}px)`;
    }
  },
  swipeStartConf(_context, _payload: {x: number; y: number;}) {
    if (Global.swipe.status === `start`) {
      if (Math.abs(_payload.x - Global.swipe.x!) + Math.abs(_payload.y - Global.swipe.y!) > 15) {
        Math.abs(_payload.x - Global.swipe.x!) < Math.abs(_payload.y - Global.swipe.y!) ?
          (Global.swipe.status = `move`) : (Global.swipe = {});
      }
    }
  },
  swipeMoveConf(_context, _payload: {x: number; y: number;}) {
    if (Global.swipe.status === `move`) {
      const y = Global.swipe.side! + _payload.y - Global.swipe.y!;
      Global.swipe.target!.style.transform = `translateY(${y > 0 ? y : 0}px)`;
    }
  },
  swipeEndConf(_context, _payload: {y: number;}) {
    if (Global.swipe.status === `move`) {
      Global.swipe.status = `end`;
      if (Global.swipe.side! + _payload.y - Global.swipe.y! > 100) {
        _context.dispatch(`routerBack`);
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

export const mutations: Mutations<ReturnType<typeof state>> = {
  generic(_state, _payload: any[]) {
    if (_payload.length > 1) {
      _payload.slice(0, -2).reduce((prev: any, item) =>
        prev[item], _state)[_payload.slice(-2, -1)[0]] = _payload.slice(-1)[0];
    } else {
      Object.assign(_state, _payload[0]);
    }
  },
};
