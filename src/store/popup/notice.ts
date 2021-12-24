import Global from '@/assets/script/base/global';

export const namespaced = true;

export const state = () => ({
  open: false as boolean,
  message: `` as string,
  button: `` as string,
  callback: (() => ``) as Function,
} as const);

export const getters: Getters<ReturnType<typeof state>, RootState> = {};

export const actions: Actions<ReturnType<typeof state>, RootState> = {
  open(_context, _payload: ReturnType<typeof state>) {
    _context.commit(`generic`, [Object.assign(_payload, {open: true})]);
    clearTimeout(Global.timeoutId);
    Global.timeoutId = window.setTimeout(() => {
      _context.dispatch(`close`);
    }, 3000);
  },
  close(_context, _payload: void) {
    _context.commit(`generic`, [`open`, false]);
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
