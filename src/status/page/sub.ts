import * as Vue from 'vue';
import * as Util from '@/script/base/util';
import * as Dom from '@/script/base/dom';
import Global from '@/script/base/global';
import * as Const from '@/script/const/const';
import * as Lang from '@/script/lang/lang';
import * as notice from '@/status/popup/notice';
import * as dialog from '@/status/popup/dialog';
import * as clock from '@/status/popup/clock';
import * as calendar from '@/status/popup/calendar';
import * as root from '@/status/page/root';

export const getter = {
  classTask: Vue.computed(() => (subId: string): object => {
    const sub = root.state.list.data[root.state.listId]
      .data[Global.route?.params.mainId as string].data[subId];
    return {
      check: sub.check,
      edit: sub.status === `edit`,
      drag: sub.status === `drag`,
      hide: sub.status === `hide`,
    };
  }),
  textMemo: Vue.computed(() => (): string => {
    const main = root.state.list.data[root.state.listId].data[Global.route?.params.mainId as string];
    return Object.values(main.data).reduce((prev, sub) => `${prev}\n${sub.title}`, ``).slice(1);
  }),
  classFoot: Vue.computed(() => (): object => {
    const main = root.state.list.data[root.state.listId].data[Global.route?.params.mainId as string];
    return {
      warn: new Date(`${main.date || `9999/99/99`} ${main.time || `00:00`}`).getTime() <
        new Date().setDate(new Date().getDate() + 2),
      error: new Date(`${main.date || `9999/99/99`} ${main.time || `00:00`}`).getTime() <
        new Date().setDate(new Date().getDate() + 1),
    };
  }),
  textAlarm: Vue.computed(() => (): string =>
    root.state.list.data[root.state.listId]
      .data[Global.route?.params.mainId as string].alarm.reduce((prev, alarmId) =>
        `${prev},${Lang[root.state.conf.lang].dialog.alarm.data[alarmId].label}`, ``).slice(1)),
};

export const action = {
  inputItem: (payload: {$event: Event; subId: string;}): void => {
    root.state.list.data[root.state.listId].data[Global.route?.params.mainId as string]
      .data[payload.subId].title = (payload.$event.target as HTMLInputElement).value;
    root.action.saveList();
    Dom.resize(Dom.get(`.itemSub[data-id="${payload.subId}"] > .title`)!);
  },
  enterItem: async(payload: {$event: KeyboardEvent; subId: string;}) => {
    const listId = root.state.listId;
    const mainId = Global.route?.params.mainId as string;
    const subId = String(new Date().getTime());
    const sub = root.state.list.data[listId].data[mainId];
    sub.sort.splice(sub.sort.indexOf(payload.subId) + 1, 0, subId);
    sub.data[payload.subId].title = (payload.$event.target as HTMLInputElement).value
      .slice(0, (payload.$event.target as HTMLInputElement).selectionStart!);
    sub.data[subId] = {status: ``, check: false, title: (payload.$event.target as HTMLInputElement).value
      .slice((payload.$event.target as HTMLInputElement).selectionStart!)};
    root.action.saveList();
    await Vue.nextTick();
    Dom.get(`.itemSub[data-id="${subId}"] > .title`)!.focus();
    const element = Dom.get(`.itemSub[data-id="${payload.subId}"]`)!;
    Dom.resize(element);
    element.addEventListener(`transitionend`, function listener() {
      element.removeEventListener(`transitionend`, listener);
      element.style.height = ``;
    });
  },
  backItem: async(
    payload: {$event: KeyboardEvent; subId: string; index: number;}) => {
    if ((payload.$event.target as HTMLInputElement).selectionStart === 0 && payload.index > 0) {
      const listId = root.state.listId;
      const mainId = Global.route?.params.mainId as string;
      const sub = root.state.list.data[listId].data[mainId];
      const prevId = sub.sort[sub.sort.indexOf(payload.subId) - 1];
      const caret = sub.data[prevId].title.length;
      sub.sort.splice(sub.sort.indexOf(payload.subId), 1);
      sub.data[prevId].title = `${sub.data[prevId].title}${sub.data[payload.subId].title}`;
      delete sub.data[payload.subId];
      root.action.saveList();
      Dom.resize(Dom.get(`.itemSub[data-id="${payload.subId}"]`)!);
      await Vue.nextTick();
      ((element) => {
        Dom.resize(element);
        element.focus();
        element.selectionStart = caret;
        element.selectionEnd = caret;
      })(Dom.get(`.itemSub[data-id="${prevId}"] > .title`) as HTMLInputElement);
      // 文字削除キャンセル
      payload.$event.preventDefault();
    }
  },
  deleteItem: async(payload: {subId: string;}) => {
    const listId = root.state.listId;
    const mainId = Global.route?.params.mainId as string;
    const backup = Util.copy(root.state.list.data[listId].data[mainId]);
    const height = Dom.resize(Dom.get(`.itemSub[data-id="${payload.subId}"]`)!);
    const sub = root.state.list.data[listId].data[mainId];
    sub.sort.splice(sub.sort.indexOf(payload.subId), 1);
    delete sub.data[payload.subId];
    root.action.saveList();
    Const.Sound.warn.play();
    await Vue.nextTick();
    notice.action.open({
      message: Lang[root.state.conf.lang].notice.message,
      button: Lang[root.state.conf.lang].notice.button,
      callback: async() => {
        notice.action.close();
        root.state.list.data[listId].data[mainId] = backup;
        root.state.list.data[listId].data[mainId].data[payload.subId].status = ``;
        root.action.saveList();
        await Vue.nextTick();
        ((element) => {
          Dom.resize(element, height);
          element.addEventListener(`transitionend`, function listener() {
            element.removeEventListener(`transitionend`, listener);
            element.style.height = ``;
          });
        })(Dom.get(`.itemSub[data-id="${payload.subId}"]`)!);
      },
    });
  },
  checkItem: (payload: {$event: Event; subId: string;}): void => {
    const listId = root.state.listId;
    const mainId = Global.route?.params.mainId as string;
    const sub = root.state.list.data[listId].data[mainId];
    sub.sort.splice(sub.sort.indexOf(payload.subId), 1);
    sub.sort[(payload.$event.target as HTMLInputElement).checked ? `push` : `unshift`](payload.subId);
    sub.data[payload.subId].check = (payload.$event.target as HTMLInputElement).checked;
    root.action.saveList();
    Const.Sound[(payload.$event.target as HTMLInputElement).checked ? `ok` : `cancel`].play();
  },
  switchItem: (): void => {
    const listId = root.state.listId;
    const mainId = Global.route?.params.mainId as string;
    root.state.list.data[listId].data[mainId].task = !root.state.list.data[listId].data[mainId].task;
    root.action.saveList();
  },
  inputMemo: (payload: {$event: Event;}): void => {
    const listId = root.state.listId;
    const mainId = Global.route?.params.mainId as string;
    const sub = root.state.list.data[listId].data[mainId];
    sub.sort = [];
    sub.data = {};
    (payload.$event.target as HTMLInputElement).value.split(`\n`).forEach((title, i) => {
      const subId = String(new Date().getTime()) + i;
      sub.sort.push(subId);
      sub.data[subId] = {status: ``, check: false, title};
    });
    root.action.saveList();
  },
  openCalendar: (payload: {date: string;}): void => {
    const listId = root.state.listId;
    const mainId = Global.route?.params.mainId as string;
    calendar.action.open({
      select: payload.date,
      current: ((date) =>
        `${date.getFullYear()}/${date.getMonth() + 1}`)(new Date(payload.date || new Date())),
      cancel: Lang[root.state.conf.lang].common.cancel,
      clear: Lang[root.state.conf.lang].common.clear,
      callback: (date: string) => {
        calendar.action.close();
        root.state.list.data[listId].data[mainId].date = date;
        root.action.saveList();
      },
    });
  },
  openClock: (payload: {time: string;}): void => {
    const listId = root.state.listId;
    const mainId = Global.route?.params.mainId as string;
    clock.action.open({
      hour: payload.time ? Number(payload.time.split(`:`)[0]) : 0,
      minute: payload.time ? Number(payload.time.split(`:`)[1]) : 0,
      cancel: Lang[root.state.conf.lang].common.cancel,
      clear: Lang[root.state.conf.lang].common.clear,
      ok: Lang[root.state.conf.lang].common.ok,
      callback: (hour?: number, minute?: number) => {
        clock.action.close();
        root.state.list.data[listId].data[mainId].time = hour && minute ?
          `${String(hour).padStart(2, `0`)}:${String(minute).padStart(2, `0`)}` : ``;
        root.action.saveList();
      },
    });
  },
  openAlarm: (): void => {
    const listId = root.state.listId;
    const mainId = Global.route?.params.mainId as string;
    dialog.action.open({
      mode: `check`,
      title: Lang[root.state.conf.lang].dialog.alarm.title,
      message: ``,
      check: {
        all: true,
        sort: Lang[root.state.conf.lang].dialog.alarm.sort as unknown as string[],
        data: ((data) => {
          Lang[root.state.conf.lang].dialog.alarm.sort.forEach((id) => {
            data[id] = {check: root.state.list.data[listId].data[mainId].alarm.includes(id as
              `1` | `2` | `3` | `4` | `5` | `6` | `7` | `8` | `9` | `10` | `11` | `12`),
            title: Lang[root.state.conf.lang].dialog.alarm.data[id as
              `1` | `2` | `3` | `4` | `5` | `6` | `7` | `8` | `9` | `10` | `11` | `12`].label};
          });
          return data;
        })({} as any),
      },
      ok: {
        name: Lang[root.state.conf.lang].common.ok,
        callback: () => {
          dialog.action.close();
          root.state.list.data[listId].data[mainId].alarm = ((alarm) => {
            Object.entries(dialog.state.check.data).forEach(([key, value]) => {
              value.check && alarm.push(key as
                `1` | `2` | `3` | `4` | `5` | `6` | `7` | `8` | `9` | `10` | `11` | `12`);
            });
            return alarm;
          })([] as (`1` | `2` | `3` | `4` | `5` | `6` | `7` | `8` | `9` | `10` | `11` | `12`)[]);
          root.action.saveList();
        },
      },
      cancel: {
        name: Lang[root.state.conf.lang].common.cancel,
        callback: () => {
          dialog.action.close();
        },
      },
    });
  },
  switchEdit: (payload?: {subId: string;}): void => {
    const main = root.state.list.data[root.state.listId].data[Global.route?.params.mainId as string];
    main.sort.forEach((subId) => {
      main.data[subId].status = subId === payload?.subId ? `edit` : ``;
    });
  },
  dragInit: (payload: {$event: TouchEvent; subId: string;}): void => {
    const item = Dom.get(`.itemSub[data-id="${payload.subId}"]`)!.getBoundingClientRect();
    Global.drag.id = payload.subId;
    Global.drag.y = payload.$event.changedTouches[0].clientY;
    Global.drag.top = item.top;
    Global.drag.left = item.left -
      Dom.get(`.pageSub > .home`)!.getBoundingClientRect().left;
    Global.drag.width = item.width;
    Global.drag.height = item.height;
    root.state.list.data[root.state.listId].data[Global.route?.params.mainId as string]
      .data[payload.subId].status = `edit`;
    root.state.conf.vibrate && navigator.vibrate(40);
  },
  dragStart: (payload: {$event: TouchEvent;}): void => {
    if (Global.drag.id && !Global.drag.clone) {
      Global.drag.clone =
        Dom.get(`.itemSub[data-id="${Global.drag.id}"]`)!.cloneNode(true) as HTMLElement;
      Global.drag.clone.style.position = `absolute`;
      Global.drag.clone.style.zIndex = `1`;
      Global.drag.clone.style.top = `${Global.drag.top}px`;
      Global.drag.clone.style.left = `${Global.drag.left}px`;
      Global.drag.clone.style.width = `${Global.drag.width}px`;
      Global.drag.clone.style.height = `${Global.drag.height}px`;
      Dom.get(`#itemSubRoot`)!.appendChild(Global.drag.clone);
      root.state.list.data[root.state.listId].data[Global.route?.params.mainId as string]
        .data[Global.drag.id].status = `hide`;
      // スクロール解除
      payload.$event.preventDefault();
    }
  },
  dragMove: (payload: {$event: TouchEvent;}): void => {
    if (Global.drag.id && Global.drag.clone) {
      Global.drag.clone.style.top = `${Global.drag.top! + payload.$event.changedTouches[0].clientY - Global.drag.y!}px`;
      const sort = root.state.list.data[root.state.listId].data[Global.route?.params.mainId as string].sort;
      const index = sort.indexOf(Global.drag.id);
      const clone = Global.drag.clone.getBoundingClientRect();
      const wrap = Dom.get(`#itemSubRoot`)!.getBoundingClientRect();
      const prev = Dom.get(`.itemSub[data-id="${sort[index - 1]}"]`)?.getBoundingClientRect();
      const current = Dom.get(`.itemSub[data-id="${sort[index]}"]`)!.getBoundingClientRect();
      const next = Dom.get(`.itemSub[data-id="${sort[index + 1]}"]`)?.getBoundingClientRect();
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
  dragEnd: (): void => {
    if (Global.drag.id && Global.drag.clone) {
      Global.drag.clone.classList.remove(`edit`);
      Global.drag.clone.animate({
        top: [`${Global.drag.clone.getBoundingClientRect().top}px`,
          `${Dom.get(`.itemSub[data-id="${Global.drag.id}"]`)!.getBoundingClientRect().top}px`],
      }, Const.Base.duration[root.state.conf.speed]).addEventListener(`finish`, () => {
        root.state.list.data[root.state.listId]
          .data[Global.route?.params.mainId as string].data[Global.drag.id!].status = ``;
        root.action.saveList();
        Global.drag.clone!.remove();
        Global.drag = {};
      });
    } else if (Global.drag.id && !Global.drag.clone) {
      root.state.list.data[root.state.listId]
        .data[Global.route?.params.mainId as string].data[Global.drag.id].status = ``;
      Global.drag = {};
    }
  },
  swipeInit: (payload: {$event: TouchEvent;}): void => {
    const item = (payload.$event.currentTarget as HTMLElement).getBoundingClientRect();
    Global.swipe.status = Global.swipe.status === `end` ? `move` : `start`;
    Global.swipe.target = payload.$event.currentTarget as HTMLElement;
    Global.swipe.x = payload.$event.changedTouches[0].clientX;
    Global.swipe.y = payload.$event.changedTouches[0].clientY;
    Global.swipe.side = item.left + (item.width / 2);
    if (Global.swipe.status === `move`) {
      Global.swipe.target!.removeEventListener(`transitionend`, Global.swipe.listener!);
      Global.swipe.target!.classList.remove(`v-enter-active`);
      Global.swipe.target!.style.transform = `translateX(${Global.swipe.side}px)`;
    }
  },
  swipeStart: (payload: {$event: TouchEvent;}): void => {
    if (Global.swipe.status === `start`) {
      if (Math.abs(payload.$event.changedTouches[0].clientX - Global.swipe.x!) +
        Math.abs(payload.$event.changedTouches[0].clientY - Global.swipe.y!) > 15) {
        Math.abs(payload.$event.changedTouches[0].clientX - Global.swipe.x!) >
        Math.abs(payload.$event.changedTouches[0].clientY - Global.swipe.y!) ?
          (Global.swipe.status = `move`) : (Global.swipe = {});
      }
    }
  },
  swipeMove: (payload: {$event: TouchEvent;}): void => {
    if (Global.swipe.status === `move`) {
      const x = Global.swipe.side! + payload.$event.changedTouches[0].clientX - Global.swipe.x!;
      Global.swipe.target!.style.transform = `translateX(${x > 0 ? x : 0}px)`;
    }
  },
  swipeEnd: (payload: {$event: TouchEvent;}): void => {
    if (Global.swipe.status === `move`) {
      Global.swipe.status = `end`;
      if (Global.swipe.side! + payload.$event.changedTouches[0].clientX - Global.swipe.x! > 100) {
        root.action.routerBack();
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
