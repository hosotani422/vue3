export const namespaced = true;

export const state = () => ({
  open: false as boolean,
  mode: `` as string,
  title: `` as string,
  message: `` as string,
  text: {
    value: `` as string,
    placeholder: `` as string,
  },
  check: {
    all: false as boolean,
    sort: [] as string[],
    data: {} as {
      [K: string]: {
        check: boolean;
        title: string;
      };
    },
  },
  radio: {
    none: false as boolean,
    select: `` as string,
    sort: [] as string[],
    data: {} as {
      [K: string]: {
        status: string;
        title: string;
      };
    },
  },
  ok: {
    name: `` as string,
    callback: (() => ``) as Function,
  },
  cancel: {
    name: `` as string,
    callback: (() => ``) as Function,
  },
} as const);

export const getters: Getters<ReturnType<typeof state>, RootState> = {
  stateCheckAll: (_state, _getters, _rootState, _rootGetters) => (): boolean =>
    Object.values(_state.check.data).reduce((prev: boolean, item) => prev && item.check, true),
};

export const actions: Actions<ReturnType<typeof state>, RootState> = {
  open(_context, _payload: ReturnType<typeof state>) {
    _context.commit(`generic`, [Object.assign(_payload, {open: true})]);
  },
  close(_context, _payload: void) {
    _context.commit(`generic`, [`open`, false]);
  },
  clickCheckAll(_context, _payload: {checked: boolean;}) {
    _context.state.check.sort.forEach((id) => {
      _context.commit(`generic`, [`check`, `data`, id, `check`, _payload.checked]);
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
