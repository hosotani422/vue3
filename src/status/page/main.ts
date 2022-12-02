import * as Vue from 'vue';
import * as Util from '@/script/base/util';
import * as Dom from '@/script/base/dom';
import Global from '@/script/base/global';
import * as Const from '@/script/const/const';
import * as Lang from '@/script/lang/lang';
import * as notice from '@/status/popup/notice';
import * as dialog from '@/status/popup/dialog';
import * as root from '@/status/page/root';

export const getter = {
  classItem: Vue.computed(() => (mainId: string): object => {
    const main = root.state.list.data[root.state.listId].data[mainId];
    return {
      select: Global.route?.params.mainId === mainId,
      check: main.check,
      edit: main.status === `edit`,
      drag: main.status === `drag`,
      hide: main.status === `hide`,
    };
  }),
  classText: Vue.computed(() => (mainId: string): object => {
    const main = root.state.list.data[root.state.listId].data[mainId];
    return {
      warn: new Date(`${main.date || `9999/99/99`} ${main.time || `00:00`}`).getTime() <
        new Date().setDate(new Date().getDate() + 2),
      error: new Date(`${main.date || `9999/99/99`} ${main.time || `00:00`}`).getTime() <
        new Date().setDate(new Date().getDate() + 1),
    };
  }),
  textCount: Vue.computed(() => (mainId: string): string => {
    const main = root.state.list.data[root.state.listId].data[mainId];
    return `${Object.values(main.data).reduce((prev, sub) =>
      (!sub.check ? ++prev : prev), 0)}/${main.sort.length}`;
  }),
};

export const action = {
  insertItem: (): void => {
    dialog.action.open({
      mode: `text`,
      title: Lang[root.state.conf.lang].dialog.insert,
      message: ``,
      text: {
        value: ``,
        placeholder: Lang[root.state.conf.lang].page.main,
      },
      ok: {
        name: Lang[root.state.conf.lang].common.ok,
        callback: () => {
          const main = root.state.list.data[root.state.listId];
          const mainId = String(new Date().getTime());
          main.sort.unshift(mainId);
          main.data[mainId] = {
            status: ``,
            check: false,
            title: dialog.state.text.value,
            date: ``,
            time: ``,
            alarm: [],
            task: true,
            sort: [`1`],
            data: {'1': {status: ``, check: false, title: ``}},
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
  copyItem: (payload: {$event: Event; mainId: string;}): void => {
    const main = root.state.list.data[root.state.listId];
    const mainId = String(new Date().getTime());
    main.sort.splice(main.sort.indexOf(payload.mainId) + 1, 0, mainId);
    main.data[payload.mainId].status = ``;
    main.data[mainId] = Util.copy(main.data[payload.mainId]);
    root.action.saveList();
    // 画面遷移キャンセル
    payload.$event.stopPropagation();
  },
  moveItem: (payload: {$event: Event; mainId: string;}): void => {
    dialog.action.open({
      mode: `radio`,
      title: Lang[root.state.conf.lang].dialog.move,
      message: ``,
      radio: {
        none: false,
        select: root.state.listId,
        sort: root.state.list.sort,
        data: root.state.list.data,
      },
      ok: {
        name: Lang[root.state.conf.lang].common.ok,
        callback: () => {
          const from = root.state.list.data[root.state.listId];
          const to = root.state.list.data[dialog.state.radio.select];
          to.sort.unshift(payload.mainId);
          to.data[payload.mainId] = from.data[payload.mainId];
          to.data[payload.mainId].status = ``;
          from.sort.splice(from.sort.indexOf(payload.mainId), 1);
          delete from.data[payload.mainId];
          dialog.action.close();
          root.action.saveList();
        },
      },
      cancel: {
        name: Lang[root.state.conf.lang].common.cancel,
        callback: () => {
          dialog.action.close();
          root.state.list.data[root.state.listId].data[payload.mainId].status = ``;
        },
      },
    });
    // 画面遷移キャンセル
    payload.$event.stopPropagation();
  },
  deleteItem: (payload: {$event: Event; mainId: string;}): void => {
    const backup = Util.copy(root.state.list);
    backup.data[root.state.listId].data[payload.mainId].status = ``;
    const main = root.state.list.data[root.state.listId];
    if (root.state.listId !== `2`) {
      root.state.list.data[`2`].sort.push(payload.mainId);
      root.state.list.data[`2`].data[payload.mainId] = main.data[payload.mainId];
      root.state.list.data[`2`].data[payload.mainId].status = ``;
    }
    main.sort.splice(main.sort.indexOf(payload.mainId), 1);
    delete main.data[payload.mainId];
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
    // 画面遷移キャンセル
    payload.$event.stopPropagation();
  },
  checkItem: (payload: {$event: Event; mainId: string;}): void => {
    const main = root.state.list.data[root.state.listId];
    main.sort.splice(main.sort.indexOf(payload.mainId), 1);
    main.sort[(payload.$event.target as HTMLInputElement).checked ? `push` : `unshift`](payload.mainId);
    main.data[payload.mainId].check = (payload.$event.target as HTMLInputElement).checked;
    root.action.saveList();
    Const.Sound[(payload.$event.target as HTMLInputElement).checked ? `ok` : `cancel`].play();
  },
  switchEdit: (payload?: {mainId: string;}): void => {
    root.state.list.data[root.state.listId].sort.forEach((mainId) => {
      root.state.list.data[root.state.listId].data[mainId].status = mainId === payload?.mainId ? `edit` : ``;
    });
  },
  dragInit: (payload: {$event: TouchEvent; mainId: string;}): void => {
    const item = Dom.get(`.itemMain[data-id="${payload.mainId}"]`)!.getBoundingClientRect();
    Global.drag.id = payload.mainId;
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
        Dom.get(`.itemMain[data-id="${Global.drag.id}"]`)!.cloneNode(true) as HTMLElement;
      Global.drag.clone.style.position = `absolute`;
      Global.drag.clone.style.zIndex = `1`;
      Global.drag.clone.style.top = `${Global.drag.top}px`;
      Global.drag.clone.style.left = `${Global.drag.left}px`;
      Global.drag.clone.style.width = `${Global.drag.width}px`;
      Global.drag.clone.style.height = `${Global.drag.height}px`;
      Dom.get(`#itemMainRoot`)!.appendChild(Global.drag.clone);
      root.state.list.data[root.state.listId].data[Global.drag.id].status = `hide`;
      // スクロール解除
      payload.$event.preventDefault();
    }
  },
  dragMove: (payload: {$event: TouchEvent;}): void => {
    if (Global.drag.id && Global.drag.clone) {
      Global.drag.clone.style.top = `${Global.drag.top! + payload.$event.changedTouches[0].clientY - Global.drag.y!}px`;
      const sort = root.state.list.data[root.state.listId].sort;
      const index = sort.indexOf(Global.drag.id);
      const clone = Global.drag.clone.getBoundingClientRect();
      const wrap = Dom.get(`#itemMainRoot`)!.getBoundingClientRect();
      const prev = Dom.get(`.itemMain[data-id="${sort[index - 1]}"]`)?.getBoundingClientRect();
      const current = Dom.get(`.itemMain[data-id="${sort[index]}"]`)!.getBoundingClientRect();
      const next = Dom.get(`.itemMain[data-id="${sort[index + 1]}"]`)?.getBoundingClientRect();
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
          `${Dom.get(`.itemMain[data-id="${Global.drag.id}"]`)!.getBoundingClientRect().top}px`],
      }, Const.Base.duration[root.state.conf.speed]).addEventListener(`finish`, () => {
        root.state.list.data[root.state.listId].data[Global.drag.id!].status = ``;
        root.action.saveList();
        Global.drag.clone!.remove();
        Global.drag = {};
      });
    } else if (Global.drag.id && !Global.drag.clone) {
      Global.drag = {};
    }
  },
};
