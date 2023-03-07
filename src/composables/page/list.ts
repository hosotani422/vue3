import * as Vue from 'vue';
import constant from '@/script/const';
import * as root from '@/composables/page/root';
import * as main from '@/composables/page/main';
import * as sub from '@/composables/page/sub';
import * as conf from '@/composables/page/conf';
import * as dialog from '@/composables/popup/dialog';
import * as notice from '@/composables/popup/notice';

export const ref: {
  wrap?: Vue.Ref<Vue.ComponentPublicInstance<HTMLElement> | undefined>;
  items?: Vue.Ref<{[K: string]: Vue.ComponentPublicInstance<HTMLElement>;}>;
} = {};

export const variable: {
  drag: {
    status?: `start` | `move` | `end`;
    id?: string;
    y?: number;
    top?: number;
    left?: number;
    height?: number;
    width?: number;
    clone?: HTMLElement;
  };
  swipe: {
    status?: `start` | `move` | `end`;
    target?: HTMLElement;
    x?: number;
    y?: number;
    left?: number;
    listener?: () => void;
  };
} = {
  drag: {},
  swipe: {},
};

export const state: {
  data: {
    sort: string[];
    data: {
      [K: string]: {
        title: string;
      };
    };
  };
  status: {[K: string]: string;};
} = Vue.reactive({
  data: constant.init.list,
  status: {},
});

export const getter = Vue.reactive({
  stateFull: Vue.computed(() => (): typeof state[`data`] => state.data),
  stateUnit: Vue.computed(() => (listId?: string): typeof state[`data`][`data`][string] =>
    state.data.data[listId || root.getter.listId()]!),
  classItem: Vue.computed(() => (listId: string): {[K in `select` | `edit` | `hide`]: boolean;} => ({
    select: root.getter.listId() === listId,
    edit: state.status[listId] === `edit`,
    hide: state.status[listId] === `hide`,
  })),
  iconType: Vue.computed(() => (listId: string): `IconInbox` | `IconTrash` | `IconList` => {
    if (listId === constant.base.id.inbox) {
      return `IconInbox`;
    } else if (listId === constant.base.id.trash) {
      return `IconTrash`;
    }
    return `IconList`;
  }),
  classLimit: Vue.computed(() => (listId: string): {[K in `warn` | `error`]: boolean;} => {
    const limit = {warn: false, error: false};
    for (const mainId of main.getter.stateFull(listId).sort) {
      const unit = main.getter.stateUnit(listId, mainId);
      const date = `${unit.date || `9999/99/99`} ${unit.time || `00:00`}`;
      root.lib.dayjs(date).isBefore(root.lib.dayjs().add(2, `day`)) && (limit.warn = true);
      root.lib.dayjs(date).isBefore(root.lib.dayjs().add(1, `day`)) && (limit.error = true);
    }
    return limit;
  }),
  textCount: Vue.computed(() => (listId: string): string => {
    let count = 0;
    for (const mainId of main.getter.stateFull(listId).sort) {
      !main.getter.stateUnit(listId, mainId).check && ++count;
    }
    return `${count}/${main.getter.stateFull(listId).sort.length}`;
  }),
});

export const action = {
  initPage: (): void => {
    Vue.watch(
      () => root.lib.lodash.cloneDeep(state.data),
      () => {
        action.saveItem();
      },
      {deep: true},
    );
    action.loadItem();
  },
  loadItem: (): void => {
    state.data = JSON.parse(localStorage.getItem(`list`)!) ?? constant.init.list;
  },
  saveItem: (): void => {
    localStorage.setItem(`list`, JSON.stringify(state.data));
  },
  insertItem: (): void => {
    dialog.action.open({
      mode: `text`,
      title: root.getter.lang().dialog.title.insert,
      message: ``,
      text: {
        value: ``,
        placeholder: root.getter.lang().placeholder.list,
      },
      ok: root.getter.lang().button.ok,
      cancel: root.getter.lang().button.cancel,
      callback: {
        ok: () => {
          const listId = `list${root.lib.dayjs().valueOf()}`;
          getter.stateFull().sort.unshift(listId);
          getter.stateFull().data[listId] = {
            title: dialog.state.text.value,
          };
          main.state.data[listId] = {sort: [], data: {}};
          sub.state.data[listId] = {data: {}};
          dialog.action.close();
        },
        cancel: () => {
          dialog.action.close();
        },
      },
    });
  },
  copyItem: (payload: {event: Event; listId: string;}): void => {
    const listId = `list${root.lib.dayjs().valueOf()}`;
    getter.stateFull().sort.splice(getter.stateFull().sort.indexOf(payload.listId) + 1, 0, listId);
    getter.stateFull().data[listId] = root.lib.lodash.cloneDeep(getter.stateUnit(payload.listId));
    delete state.status[payload.listId];
    main.state.data[listId] = root.lib.lodash.cloneDeep(main.getter.stateFull(payload.listId));
    sub.state.data[listId] = root.lib.lodash.cloneDeep(sub.state.data[payload.listId]!);
    // 画面遷移キャンセル
    payload.event.stopPropagation();
  },
  deleteItem: (payload: {event: Event; listId: string;}): void => {
    dialog.action.open({
      mode: `confirm`,
      title: root.getter.lang().dialog.title.delete,
      message: ``,
      ok: root.getter.lang().button.ok,
      cancel: root.getter.lang().button.cancel,
      callback: {
        ok: () => {
          const backup = {
            list: root.lib.lodash.cloneDeep(state.data),
            main: root.lib.lodash.cloneDeep(main.state.data),
            sub: root.lib.lodash.cloneDeep(sub.state.data),
          };
          for (const mainId of main.getter.stateFull(payload.listId).sort) {
            main.getter.stateFull(constant.base.id.trash).sort.push(mainId);
            main.getter.stateFull(constant.base.id.trash).data[mainId] = main.getter.stateUnit(payload.listId, mainId);
            sub.state.data[constant.base.id.trash]!.data[mainId] = sub.getter.stateFull(payload.listId, mainId);
          }
          getter.stateFull().sort.splice(getter.stateFull().sort.indexOf(payload.listId), 1);
          delete getter.stateFull().data[payload.listId];
          delete state.status[payload.listId];
          delete main.state.data[payload.listId];
          delete sub.state.data[payload.listId];
          dialog.action.close();
          constant.sound.play(`warn`);
          notice.action.open({
            message: root.getter.lang().notice.message,
            button: root.getter.lang().notice.button,
            callback: () => {
              state.data = backup.list;
              main.state.data = backup.main;
              sub.state.data = backup.sub;
              notice.action.close();
            },
          });
        },
        cancel: () => {
          delete state.status[payload.listId];
          dialog.action.close();
        },
      },
    });
    // 画面遷移キャンセル
    payload.event.stopPropagation();
  },
  switchEdit: (payload?: {listId: string;}): void => {
    for (const listId of getter.stateFull().sort) {
      state.status[listId] = listId === payload?.listId ? `edit` : ``;
    }
  },
  dragInit: (payload: {event: TouchEvent; listId: string;}): void => {
    const item = ref.items!.value[payload.listId]!.$el.getBoundingClientRect();
    variable.drag.status = `start`;
    variable.drag.id = payload.listId;
    variable.drag.y = (payload.event.detail as unknown as TouchEvent).changedTouches[0]!.clientY;
    variable.drag.top = item.top;
    variable.drag.left = item.left;
    variable.drag.height = item.height;
    variable.drag.width = item.width;
    conf.state.data.vibrate === `on` && navigator.vibrate(40);
  },
  dragStart: (payload: {event: TouchEvent;}): void => {
    if (variable.drag.status === `start`) {
      variable.drag.status = `move`;
      variable.drag.clone = ref.items!.value[variable.drag.id!]!.$el.cloneNode(true) as HTMLElement;
      variable.drag.clone.style.position = `absolute`;
      variable.drag.clone.style.zIndex = `1`;
      variable.drag.clone.style.top = `${variable.drag.top}px`;
      variable.drag.clone.style.left = `${variable.drag.left}px`;
      variable.drag.clone.style.height = `${variable.drag.height}px`;
      variable.drag.clone.style.width = `${variable.drag.width}px`;
      ref.wrap!.value!.$el.appendChild(variable.drag.clone);
      state.status[variable.drag.id!] = `hide`;
      // スクロール解除
      payload.event.preventDefault();
    }
  },
  dragMove: (payload: {event: TouchEvent;}): void => {
    if (variable.drag.status === `move`) {
      variable.drag.clone!.style.top =
        `${variable.drag.top! + payload.event.changedTouches[0]!.clientY - variable.drag.y!}px`;
      const index = getter.stateFull().sort.indexOf(variable.drag.id!);
      const clone = variable.drag.clone!.getBoundingClientRect();
      const prev = ref.items!.value[getter.stateFull().sort[index - 1]!]?.$el.getBoundingClientRect();
      const current = ref.items!.value[getter.stateFull().sort[index]!]?.$el.getBoundingClientRect();
      const next = ref.items!.value[getter.stateFull().sort[index + 1]!]?.$el.getBoundingClientRect();
      if (prev && clone.top + (clone.height / 2) <
        (next ? next.top : current.top + current.height) - ((prev.height + current.height) / 2)) {
        getter.stateFull().sort.splice(index - 1, 0, ...getter.stateFull().sort.splice(index, 1));
      } else if (next && clone.top + (clone.height / 2) >
        (prev ? prev.top + prev.height : current.top) + ((current.height + next.height) / 2)) {
        getter.stateFull().sort.splice(index + 1, 0, ...getter.stateFull().sort.splice(index, 1));
      }
      // スクロール解除
      payload.event.preventDefault();
    }
  },
  dragEnd: (): void => {
    if (variable.drag.status === `move`) {
      variable.drag.status = `end`;
      variable.drag.clone!.classList.remove(`edit`);
      variable.drag.clone!.animate({
        top: [`${variable.drag.clone!.getBoundingClientRect().top}px`,
          `${ref.items!.value[variable.drag.id!]!.$el.getBoundingClientRect().top}px`],
      }, constant.base.duration[conf.state.data.speed]).addEventListener(`finish`, () => {
        delete state.status[variable.drag.id!];
        variable.drag.clone!.remove();
        variable.drag = {};
      });
    } else if (variable.drag.id && !variable.drag.clone) {
      variable.drag = {};
    }
  },
  swipeInit: (payload: {event: TouchEvent;}): void => {
    variable.swipe.status = variable.swipe.status === `end` ? `move` : `start`;
    variable.swipe.target = payload.event.currentTarget as HTMLElement;
    variable.swipe.x = payload.event.changedTouches[0]!.clientX;
    variable.swipe.y = payload.event.changedTouches[0]!.clientY;
    variable.swipe.left = variable.swipe.target.getBoundingClientRect().left;
    // スワイプ終了前に再開時
    if (variable.swipe.status === `move`) {
      variable.swipe.target.removeEventListener(`transitionend`, variable.swipe.listener!);
      variable.swipe.target.classList.remove(`v-enter-active`);
      variable.swipe.target.style.transform = `translateX(${variable.swipe.left}px)`;
    }
  },
  swipeStart: (payload: {event: TouchEvent;}): void => {
    if (variable.swipe.status === `start`) {
      const changed = payload.event.changedTouches[0]!;
      if (Math.abs(changed.clientX - variable.swipe.x!) + Math.abs(changed.clientY - variable.swipe.y!) > 15) {
        Math.abs(changed.clientX - variable.swipe.x!) > Math.abs(changed.clientY - variable.swipe.y!) ?
          (variable.swipe.status = `move`) : (variable.swipe = {});
      }
    }
  },
  swipeMove: (payload: {event: TouchEvent;}): void => {
    if (variable.swipe.status === `move`) {
      const x = variable.swipe.left! + payload.event.changedTouches[0]!.clientX - variable.swipe.x!;
      variable.swipe.target!.style.transform = `translateX(${x < 0 ? x : 0}px)`;
    }
  },
  swipeEnd: (payload: {event: TouchEvent;}): void => {
    if (variable.swipe.status === `move`) {
      variable.swipe.status = `end`;
      if (variable.swipe.left! + payload.event.changedTouches[0]!.clientX - variable.swipe.x! < -100) {
        root.action.routerBack();
        variable.swipe = {};
      } else {
        variable.swipe.target!.style.transform = ``;
        variable.swipe.target!.classList.add(`v-enter-active`);
        variable.swipe.target!.addEventListener(`transitionend`, (variable.swipe.listener = () => {
          variable.swipe.target!.removeEventListener(`transitionend`, variable.swipe.listener!);
          variable.swipe.target!.classList.remove(`v-enter-active`);
          variable.swipe = {};
        }));
      }
    } else {
      variable.swipe = {};
    }
  },
};
