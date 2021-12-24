import * as Vue from 'vue';
import * as Dom from '@/assets/script/base/dom';
import Global from '@/assets/script/base/global';
import * as Lang from '@/assets/script/lang/lang';
import * as page from '@/composition/pages/page';

export const state = Vue.reactive({
  open: false as boolean,
  select: `` as string,
  current: `` as string,
  cancel: `` as string,
  clear: `` as string,
  callback: (() => {}) as (date: string) => void,
});

export const getter = {
  labelWeek: Vue.computed(() => (): readonly string[] => Lang[page.state.conf.lang].date.week),
  labelDay: Vue.computed(() => (): {id: string;
    day: {id: string; text: string; select: boolean; today: boolean; hide: boolean;}[];}[] => {
    const month = [] as {id: string;
      day: {id: string; text: string; select: boolean; today: boolean; hide: boolean;}[];}[];
    for (const curMonth =
      new Date(new Date(state.current).setMonth(new Date(state.current).getMonth() - 1)),
      limMonth =
      new Date(new Date(state.current).setMonth(new Date(state.current).getMonth() + 2));
      curMonth.getTime() < limMonth.getTime(); curMonth.setMonth(curMonth.getMonth() + 1)) {
      const day = [] as
        {id: string; text: string; select: boolean; today: boolean; hide: boolean;}[];
      for (const curDay = ((date) => new Date(date.setDate(date.getDate() -
        date.getDay())))(new Date(new Date(curMonth).setDate(1))),
        limDay = ((date) => new Date(date.setDate(1)))(
          new Date(new Date(curMonth).setMonth(new Date(curMonth).getMonth() + 1)));
        curDay.getTime() < limDay.getTime(); curDay.setDate(curDay.getDate() + 1)) {
        day.push({
          id: curDay.toLocaleDateString(),
          text: String(curDay.getDate()),
          select: curDay.toLocaleDateString() === state.select,
          today: curDay.toLocaleDateString() === new Date().toLocaleDateString(),
          hide: curDay.getMonth() !== curMonth.getMonth(),
        });
      }
      month.push({id: `${curMonth.getFullYear()}/${curMonth.getMonth() + 1}`, day});
    }
    return month;
  }),
};

export const action = {
  open: (payload: {select: typeof state.select; current: typeof state.current;
    cancel: typeof state.cancel; clear: typeof state.clear;
    callback: typeof state.callback;}): void => {
    state.open = true;
    state.select = payload.select;
    state.current = payload.current;
    state.cancel = payload.cancel;
    state.clear = payload.clear;
    state.callback = payload.callback;
  },
  close: (): void => {
    state.open = false;
  },
  pageMove: (payload: {prev: boolean;}): void => {
    const item = Dom.get(`.popup-calendar > .home > .body > .area`)!;
    item.classList.add(payload.prev ? `prev` : `next`);
    item.addEventListener(`transitionend`, function listener() {
      item.removeEventListener(`transitionend`, listener);
      item.classList.remove(payload.prev ? `prev` : `next`);
      state.current = ((current) => {
        current.setMonth(current.getMonth() + (payload.prev ? -1 : 1));
        return `${current.getFullYear()}/${current.getMonth() + 1}`;
      })(new Date(state.current));
    });
  },
  swipeInit: (payload: {target: HTMLElement; x: number; y: number;}): void => {
    Global.swipe.status = `start`;
    Global.swipe.target = payload.target;
    Global.swipe.x = payload.x;
    Global.swipe.y = payload.y;
    Global.swipe.side = Global.swipe.target!.getBoundingClientRect().left -
      Dom.get(`.popup-calendar > .home`)!.getBoundingClientRect().left;
  },
  swipeStart: (payload: {x: number; y: number;}): void => {
    if (Global.swipe.status === `start`) {
      if (Math.abs(payload.x - Global.swipe.x!) + Math.abs(payload.y - Global.swipe.y!) > 10) {
        Math.abs(payload.x - Global.swipe.x!) > Math.abs(payload.y - Global.swipe.y!) ?
          (Global.swipe.status = `move`) : (Global.swipe = {});
      }
    }
  },
  swipeMove: (payload: {x: number; y: number;}): void => {
    if (Global.swipe.status === `move`) {
      Global.swipe.target!.style.transform =
        `translateX(${Global.swipe.side! + payload.x - Global.swipe.x!}px)`;
    }
  },
  swipeEnd: (payload: {x: number; y: number;}): void => {
    if (Global.swipe.status === `move`) {
      Global.swipe.target!.style.transform = ``;
      if (payload.x - Global.swipe.x! >= 75) {
        action.pageMove({prev: true});
        Global.swipe = {};
      } else if (payload.x - Global.swipe.x! <= -75) {
        action.pageMove({prev: false});
        Global.swipe = {};
      } else {
        Global.swipe.target!.classList.add(`back`);
        Global.swipe.target!.addEventListener(`transitionend`, function listener() {
          Global.swipe.target!.removeEventListener(`transitionend`, listener);
          Global.swipe.target!.classList.remove(`back`);
          Global.swipe = {};
        });
      }
    } else {
      Global.swipe = {};
    }
  },
};
