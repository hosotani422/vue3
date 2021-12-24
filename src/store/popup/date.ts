import * as Dom from '@/assets/script/base/dom';
import Global from '@/assets/script/base/global';
import * as Lang from '@/assets/script/lang/lang';

export const namespaced = true;

export const state = () => ({
  open: false as boolean,
  select: `` as string,
  current: `` as string,
  cancel: `` as string,
  clear: `` as string,
  callback: (() => ``) as Function,
} as const);

export const getters: Getters<ReturnType<typeof state>, RootState> = {
  labelWeek: (_state, _getters, _rootState, _rootGetters) =>
    (): readonly string[] => Lang[_rootState.pages.page.conf.lang].date.week,
  labelDay: (_state, _getters, _rootState, _rootGetters) => (): {id: string;
    day: {id: string; text: string; select: boolean; today: boolean; hide: boolean;}[];}[] => {
    const month = [] as {id: string;
      day: {id: string; text: string; select: boolean; today: boolean; hide: boolean;}[];}[];
    for (const curMonth =
      new Date(new Date(_state.current).setMonth(new Date(_state.current).getMonth() - 1)),
      limMonth =
      new Date(new Date(_state.current).setMonth(new Date(_state.current).getMonth() + 2));
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
          select: curDay.toLocaleDateString() === _state.select,
          today: curDay.toLocaleDateString() === new Date().toLocaleDateString(),
          hide: curDay.getMonth() !== curMonth.getMonth(),
        });
      }
      month.push({id: `${curMonth.getFullYear()}/${curMonth.getMonth() + 1}`, day});
    }
    return month;
  },
};

export const actions: Actions<ReturnType<typeof state>, RootState> = {
  open(_context, _payload: ReturnType<typeof state>) {
    _context.commit(`generic`, [Object.assign(_payload, {open: true})]);
  },
  close(_context, _payload: void) {
    _context.commit(`generic`, [`open`, false]);
  },
  pageMove(_context, _payload: {prev: boolean;}) {
    const item = Dom.get(`.popup-date > .home > .body > .area`)!;
    item.classList.add(_payload.prev ? `prev` : `next`);
    item.addEventListener(`transitionend`, function listener() {
      item.removeEventListener(`transitionend`, listener);
      item.classList.remove(_payload.prev ? `prev` : `next`);
      _context.commit(`generic`, [`current`, ((current) => {
        current.setMonth(current.getMonth() + (_payload.prev ? -1 : 1));
        return `${current.getFullYear()}/${current.getMonth() + 1}`;
      })(new Date(_context.state.current))]);
    });
  },
  swipeInit(_context, _payload: {target: HTMLElement; x: number; y: number;}) {
    Global.swipe.status = `start`;
    Global.swipe.target = _payload.target;
    Global.swipe.x = _payload.x;
    Global.swipe.y = _payload.y;
    Global.swipe.side = Global.swipe.target!.getBoundingClientRect().left -
      Dom.get(`.popup-date > .home`)!.getBoundingClientRect().left;
  },
  swipeStart(_context, _payload: {x: number; y: number;}) {
    if (Global.swipe.status === `start`) {
      if (Math.abs(_payload.x - Global.swipe.x!) + Math.abs(_payload.y - Global.swipe.y!) > 10) {
        Math.abs(_payload.x - Global.swipe.x!) > Math.abs(_payload.y - Global.swipe.y!) ?
          (Global.swipe.status = `move`) : (Global.swipe = {});
      }
    }
  },
  swipeMove(_context, _payload: {x: number; y: number;}) {
    if (Global.swipe.status === `move`) {
      Global.swipe.target!.style.transform =
        `translateX(${Global.swipe.side! + _payload.x - Global.swipe.x!}px)`;
    }
  },
  swipeEnd(_context, _payload: {x: number; y: number;}) {
    if (Global.swipe.status === `move`) {
      Global.swipe.target!.style.transform = ``;
      if (_payload.x - Global.swipe.x! >= 75) {
        _context.dispatch(`pageMove`, {prev: true});
        Global.swipe = {};
      } else if (_payload.x - Global.swipe.x! <= -75) {
        _context.dispatch(`pageMove`, {prev: false});
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
