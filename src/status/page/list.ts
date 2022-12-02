import * as Vue from 'vue';
import * as Dom from '@/script/base/dom';
import * as Util from '@/script/base/util';
import Global from '@/script/base/global';
import * as Const from '@/script/const/const';
import * as Lang from '@/script/lang/lang';
import * as notice from '@/status/popup/notice';
import * as dialog from '@/status/popup/dialog';
import * as root from '@/status/page/root';

export const getter = {
  classItem: Vue.computed(() => (listId: string): object => ({
    select: root.state.listId === listId,
    edit: root.state.list.data[listId].status === `edit`,
    hide: root.state.list.data[listId].status === `hide`,
  })),
  classText: Vue.computed(() => (listId: string): object => ({
    warn: ((flag) => {
      Object.values(root.state.list.data[listId].data).forEach((main) => {
        new Date(`${main.date || `9999/99/99`} ${main.time || `00:00`}`).getTime() <
          new Date().setDate(new Date().getDate() + 2) && (flag = true);
      });
      return flag;
    })(false),
    error: ((flag) => {
      Object.values(root.state.list.data[listId].data).forEach((main) => {
        new Date(`${main.date || `9999/99/99`} ${main.time || `00:00`}`).getTime() <
          new Date().setDate(new Date().getDate() + 1) && (flag = true);
      });
      return flag;
    })(false),
  })),
  textCount: Vue.computed(() => (listId: string): string =>
    `${Object.values(root.state.list.data[listId].data).reduce((prev, main) =>
      (!main.check ? ++prev : prev), 0)}/${root.state.list.data[listId].sort.length}`),
};

export const action = {
  insertItem: (): void => {
    dialog.action.open({
      mode: `text`,
      title: Lang[root.state.conf.lang].dialog.insert,
      message: ``,
      text: {
        value: ``,
        placeholder: Lang[root.state.conf.lang].page.list,
      },
      ok: {
        name: Lang[root.state.conf.lang].common.ok,
        callback: () => {
          const listId = String(new Date().getTime());
          root.state.list.sort.unshift(listId);
          root.state.list.data[listId] = {
            status: ``,
            title: dialog.state.text.value,
            sort: [],
            data: {},
          };
          dialog.action.close();
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
  copyItem: (payload: {$event: Event; listId: string;}): void => {
    const listId = String(new Date().getTime());
    root.state.list.sort.splice(root.state.list.sort.indexOf(payload.listId) + 1, 0, listId);
    root.state.list.data[payload.listId].status = ``;
    root.state.list.data[listId] = Util.copy(root.state.list.data[payload.listId]);
    root.action.saveList();
    // 画面遷移キャンセル
    payload.$event.stopPropagation();
  },
  deleteItem: (payload: {$event: Event; listId: string;}): void => {
    dialog.action.open({
      mode: `confirm`,
      title: Lang[root.state.conf.lang].dialog.delete,
      message: ``,
      ok: {
        name: Lang[root.state.conf.lang].common.ok,
        callback: () => {
          const backup = Util.copy(root.state.list);
          backup.data[payload.listId].status = ``;
          root.state.list.data[payload.listId].sort.forEach((mainId) => {
            root.state.list.data[`2`].sort.push(mainId);
            root.state.list.data[`2`].data[mainId] = root.state.list.data[payload.listId].data[mainId];
          });
          root.state.list.sort.splice(root.state.list.sort.indexOf(payload.listId), 1);
          delete root.state.list.data[payload.listId];
          dialog.action.close();
          root.action.saveList();
          Const.Sound.warn.play();
          notice.action.open({
            message: Lang[root.state.conf.lang].notice.message,
            button: Lang[root.state.conf.lang].notice.button,
            callback: () => {
              notice.action.close();
              root.state.list = backup;
              root.action.saveList();
            },
          });
        },
      },
      cancel: {
        name: Lang[root.state.conf.lang].common.cancel,
        callback: () => {
          dialog.action.close();
          root.state.list.data[payload.listId].status = ``;
        },
      },
    });
    // 画面遷移キャンセル
    payload.$event.stopPropagation();
  },
  switchEdit: (payload?: {listId: string;}): void => {
    root.state.list.sort.forEach((listId) => {
      root.state.list.data[listId].status = listId === payload?.listId ? `edit` : ``;
    });
  },
  dragInit: (payload: {$event: TouchEvent; listId: string;}): void => {
    const item = Dom.get(`.itemList[data-id="${payload.listId}"]`)!.getBoundingClientRect();
    Global.drag.id = payload.listId;
    Global.drag.y = (payload.$event.detail as any).clientY;
    Global.drag.top = item.top;
    Global.drag.left = item.left;
    Global.drag.width = item.width;
    Global.drag.height = item.height;
    root.state.conf.vibrate && navigator.vibrate(40);
  },
  dragStart: (payload: {$event: TouchEvent;}): void => {
    if (Global.drag.id && !Global.drag.clone) {
      Global.drag.clone =
        Dom.get(`.itemList[data-id="${Global.drag.id}"]`)!.cloneNode(true) as HTMLElement;
      Global.drag.clone.style.position = `absolute`;
      Global.drag.clone.style.zIndex = `1`;
      Global.drag.clone.style.top = `${Global.drag.top}px`;
      Global.drag.clone.style.left = `${Global.drag.left}px`;
      Global.drag.clone.style.width = `${Global.drag.width}px`;
      Global.drag.clone.style.height = `${Global.drag.height}px`;
      Dom.get(`#itemListRoot`)!.appendChild(Global.drag.clone);
      root.state.list.data[Global.drag.id].status = `hide`;
      // スクロール解除
      payload.$event.preventDefault();
    }
  },
  dragMove: (payload: {$event: TouchEvent;}): void => {
    if (Global.drag.id && Global.drag.clone) {
      Global.drag.clone.style.top = `${Global.drag.top! + payload.$event.changedTouches[0].clientY - Global.drag.y!}px`;
      const sort = root.state.list.sort;
      const index = sort.indexOf(Global.drag.id);
      const clone = Global.drag.clone.getBoundingClientRect();
      const wrap = Dom.get(`#itemListRoot`)!.getBoundingClientRect();
      const prev = Dom.get(`.itemList[data-id="${sort[index - 1]}"]`)?.getBoundingClientRect();
      const current = Dom.get(`.itemList[data-id="${sort[index]}"]`)!.getBoundingClientRect();
      const next = Dom.get(`.itemList[data-id="${sort[index + 1]}"]`)?.getBoundingClientRect();
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
          `${Dom.get(`.itemList[data-id="${Global.drag.id}"]`)!.getBoundingClientRect().top}px`],
      }, Const.Base.duration[root.state.conf.speed]).addEventListener(`finish`, () => {
        root.state.list.data[Global.drag.id!].status = ``;
        root.action.saveList();
        Global.drag.clone!.remove();
        Global.drag = {};
      });
    } else if (Global.drag.id && !Global.drag.clone) {
      Global.drag = {};
    }
  },
  swipeInit: (payload: {$event: TouchEvent;}): void => {
    Global.swipe.status = Global.swipe.status === `end` ? `move` : `start`;
    Global.swipe.target = payload.$event.currentTarget as HTMLElement;
    Global.swipe.x = payload.$event.changedTouches[0].clientX;
    Global.swipe.y = payload.$event.changedTouches[0].clientY;
    Global.swipe.side = (payload.$event.currentTarget as HTMLElement).getBoundingClientRect().left;
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
      Global.swipe.target!.style.transform = `translateX(${x < 0 ? x : 0}px)`;
    }
  },
  swipeEnd: (payload: {$event: TouchEvent;}): void => {
    if (Global.swipe.status === `move`) {
      Global.swipe.status = `end`;
      if (Global.swipe.side! + payload.$event.changedTouches[0].clientX - Global.swipe.x! < -100) {
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
