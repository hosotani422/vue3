import * as Vue from 'vue';
import * as Dom from '@/assets/script/base/dom';

export const namespaced = true;

export const state = () => ({
  open: false as boolean,
  hour: 0 as number,
  minute: 0 as number,
  cancel: `` as string,
  clear: `` as string,
  ok: `` as string,
  callback: (() => ``) as Function,
} as const);

export const getters: Getters<ReturnType<typeof state>, RootState> = {};

export const actions: Actions<ReturnType<typeof state>, RootState> = {
  async open(_context, _payload: ReturnType<typeof state>) {
    _context.commit(`generic`, [Object.assign(_payload, {open: true})]);
    await Vue.nextTick();
    _context.dispatch(`drawHour`, {target: Dom.get(`.item-hour`)});
    _context.dispatch(`drawMinute`, {target: Dom.get(`.item-minute`)});
  },
  close(_context, _payload: void) {
    _context.commit(`generic`, [`open`, false]);
  },
  inputHour(context, _payload: {target: HTMLElement; x: number; y: number;}) {
    const x = _payload.x - (_payload.target).getBoundingClientRect().left;
    const y = _payload.y - (_payload.target).getBoundingClientRect().top;
    const half = _payload.target.getBoundingClientRect().height / 2;
    const angle = (Math.atan((half - y) /
      (half - x)) * 360 / (Math.PI * 2)) + (x >= half ? 90 : 270);
    const inner = Math.sqrt(((half - x) ** 2) + ((half - y) ** 2)) < half * 0.66;
    let hour = Math.round(angle / 30) + (inner ? 12 : 0);
    (hour % 12 === 0) && (hour = inner ? 0 : 12);
    context.commit(`generic`, [`hour`, hour]);
    context.dispatch(`drawHour`, {target: _payload.target});
  },
  inputMinute(_context, _payload: {target: HTMLElement; x: number; y: number;}) {
    const x = _payload.x - (_payload.target).getBoundingClientRect().left;
    const y = _payload.y - (_payload.target).getBoundingClientRect().top;
    const half = _payload.target.getBoundingClientRect().height / 2;
    const angle = (Math.atan((half - y) /
      (half - x)) * 360 / (Math.PI * 2)) + (x >= half ? 90 : 270);
    const minute = Math.round(angle / 6) === 60 ? 0 : Math.round(angle / 6);
    _context.commit(`generic`, [`minute`, minute]);
    _context.dispatch(`drawMinute`, {target: _payload.target});
  },
  drawHour(_context, _payload: {target: HTMLCanvasElement;}) {
    const ctx = _payload.target.getContext(`2d`)!;
    const half = _payload.target.getBoundingClientRect().height / 2;
    const hour = _context.state.hour === 0 ? 24 : _context.state.hour;
    ctx.canvas.setAttribute(`width`, `${half * 2}px`);
    ctx.canvas.setAttribute(`height`, `${half * 2}px`);
    // 基準位置
    ctx.translate(half, half);
    // 外側円
    _context.dispatch(`drawCircle`, {ctx, x: 0, y: 0, half,
      color: _context.rootState.pages.page.conf.theme === `light` ? `#dddddd` : `#000000`});
    // 中心円
    _context.dispatch(`drawCircle`, {ctx, x: 0, y: 0, half: 3, color: `#1188dd`});
    // 回転開始
    ctx.rotate(hour * 30 * (Math.PI / 180));
    // 選択円
    _context.dispatch(`drawCircle`,
      {ctx, x: 0, y: half * (hour > 12 ? -0.52 : -0.82), half: half * 0.16, color: `#1188dd`});
    // 選択線
    _context.dispatch(`drawLine`, {ctx, fromX: 0, fromY: 0,
      toX: 0, toY: half * (hour > 12 ? -0.52 : -0.82), width: 1, color: `#1188dd`});
    // 回転終了
    ctx.rotate(-hour * 30 * (Math.PI / 180));
    // 外側文字
    _context.dispatch(`drawChar`, {list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      ctx, select: hour, size: `1rem`, range: half * 0.82,
      color: _context.rootState.pages.page.conf.theme === `dark` ? `#ffffff` : `#333333`});
    // 内側文字
    _context.dispatch(`drawChar`, {list: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
      ctx, select: hour, size: `0.8rem`, range: half * 0.52,
      color: _context.rootState.pages.page.conf.theme === `dark` ? `#ffffff` : `#333333`});
  },
  drawMinute(_context, _payload: {target: HTMLCanvasElement;}) {
    const ctx = _payload.target.getContext(`2d`)!;
    const half = _payload.target.getBoundingClientRect().height / 2;
    const minute = _context.state.minute;
    ctx.canvas.setAttribute(`width`, `${half * 2}px`);
    ctx.canvas.setAttribute(`height`, `${half * 2}px`);
    // 基準位置
    ctx.translate(half, half);
    // 外側円
    _context.dispatch(`drawCircle`, {ctx, x: 0, y: 0, half,
      color: _context.rootState.pages.page.conf.theme === `light` ? `#dddddd` : `#000000`});
    // 中心円
    _context.dispatch(`drawCircle`, {ctx, x: 0, y: 0, half: 3, color: `#1188dd`});
    // 回転開始
    ctx.rotate(minute * 6 * (Math.PI / 180));
    // 選択円
    _context.dispatch(`drawCircle`,
      {ctx, x: 0, y: half * -0.82, half: half * 0.16, color: `#1188dd`});
    // 選択線
    _context.dispatch(`drawLine`, {ctx, fromX: 0, fromY: 0,
      toX: 0, toY: half * -0.82, width: 1, color: `#1188dd`});
    // 回転終了
    ctx.rotate(-minute * 6 * (Math.PI / 180));
    // 文字
    _context.dispatch(`drawChar`, {list: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 0],
      ctx, select: minute, size: `1rem`, range: half * 0.82,
      color: _context.rootState.pages.page.conf.theme === `dark` ? `#ffffff` : `#333333`});
  },
  drawCircle(_context, _payload: {ctx: CanvasRenderingContext2D;
    x: number; y: number; half: number; color: string;}) {
    _payload.ctx.beginPath();
    _payload.ctx.fillStyle = _payload.color;
    _payload.ctx.arc(_payload.x, _payload.y, _payload.half, 0, 360 * (Math.PI / 180), false);
    _payload.ctx.fill();
  },
  drawLine(_context, _payload: {ctx: CanvasRenderingContext2D;
    fromX: number; fromY: number; toX: number; toY: number; width: number; color: string;}) {
    _payload.ctx.beginPath();
    _payload.ctx.lineWidth = _payload.width;
    _payload.ctx.strokeStyle = _payload.color;
    _payload.ctx.moveTo(_payload.fromX, _payload.fromY);
    _payload.ctx.lineTo(_payload.toX, _payload.toY);
    _payload.ctx.stroke();
  },
  drawChar(_context, _payload: {ctx: CanvasRenderingContext2D;
    list: number[]; select: number; size: string; range: number; color: string;}) {
    _payload.ctx.font = `normal ${_payload.size} sans-serif`;
    _payload.ctx.textAlign = `center`;
    _payload.ctx.textBaseline = `middle`;
    _payload.list.forEach((item, i) => {
      _payload.ctx.fillStyle = item === _payload.select ? `#ffffff` : _payload.color;
      _payload.ctx.fillText(String(item),
        _payload.range * Math.sin((i + 1) * 30 * (Math.PI / 180)),
        -_payload.range * Math.cos((i + 1) * 30 * (Math.PI / 180)));
    });
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
