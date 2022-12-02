import * as Vue from 'vue';
import Global from '@/script/base/global';

export const state = Vue.reactive({
  open: false as boolean,
  message: `` as string,
  button: `` as string,
  callback: (() => {}) as () => void,
});

export const getter = {};

export const action = {
  open: (payload: {message: typeof state.message;
    button: typeof state.button; callback: typeof state.callback;}): void => {
    state.open = true;
    state.message = payload.message;
    state.button = payload.button;
    state.callback = payload.callback;
    clearTimeout(Global.timeoutId);
    Global.timeoutId = window.setTimeout(() => {
      action.close();
    }, 3000);
  },
  close: (): void => {
    state.open = false;
  },
};
