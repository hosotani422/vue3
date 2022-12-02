import * as Vue from 'vue';

export const state = Vue.reactive({
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
    callback: (() => {}) as () => void,
  },
  cancel: {
    name: `` as string,
    callback: (() => {}) as () => void,
  },
});

export const getter = {
  stateCheckAll: Vue.computed(() => (): boolean =>
    Object.values(state.check.data).reduce((prev: boolean, item) => prev && item.check, true)),
};

export const action = {
  open: (payload: {
    mode: typeof state.mode; title: typeof state.title; message: typeof state.message;
    text?: typeof state.text; check?: typeof state.check; radio?: typeof state.radio;
    ok?: typeof state.ok; cancel?: typeof state.cancel;}): void => {
    state.open = true;
    state.mode = payload.mode;
    state.title = payload.title;
    state.message = payload.message;
    payload.text && (state.text = payload.text);
    payload.check && (state.check = payload.check);
    payload.radio && (state.radio = payload.radio);
    payload.ok && (state.ok = payload.ok);
    payload.cancel && (state.cancel = payload.cancel);
  },
  close: (): void => {
    state.open = false;
  },
  clickCheckAll: (payload: {event: Event;}): void => {
    state.check.sort.forEach((id) => {
      state.check.data[id].check = (payload.event.target as HTMLInputElement).checked;
    });
  },
};
