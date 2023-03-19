import * as Vue from 'vue';
import constant from '@/script/const';
import * as base from '@/script/const/base';
import * as list from '@/composables/page/list';
import * as main from '@/composables/page/main';
import * as sub from '@/composables/page/sub';
import * as conf from '@/composables/page/conf';
import * as dialog from '@/composables/popup/dialog';
import * as notice from '@/composables/popup/notice';

describe(`list`, () => {
  const swipeMock = {
    event: {
      changedTouches: [{clientX: 0, clientY: 0}],
      currentTarget: {
        style: {transform: ``},
        classList: {add: () => {}, remove: () => {}},
        getBoundingClientRect: () => ({left: 0}),
        addEventListener: (_type: string, listener: Function) => {
          listener();
        },
        removeEventListener: () => {},
      },
    } as unknown as TouchEvent,
  };
  beforeAll(() => {
    conf.state.data.vibrate = `off`;
    list.ref.wrap = {value: {$el: {appendChild: () => {}}}} as
      Vue.Ref<Vue.ComponentPublicInstance<HTMLElement> | undefined>;
    list.ref.items = {value: {[base.id.inbox]: {$el: {
      cloneNode: () => ({
        style: {position: ``, zIndex: ``, top: ``, left: ``, height: ``, width: ``},
        classList: {remove: () => {}},
        remove: () => {},
        animate: () => ({addEventListener: (_type: string, listener: Function): void => {
          listener();
        }}),
        getBoundingClientRect: () => ({top: 0, height: 0}),
      }),
      getBoundingClientRect: () => ({top: 0, left: 0, height: 0, width: 0}),
    }}}} as Vue.Ref<{[K: string]: Vue.ComponentPublicInstance<HTMLElement>;}>;
  });
  test(`action.initPage`, () => {
    list.action.initPage();
  });
  test(`action.loadItem`, () => {
    list.action.loadItem();
    expect(list.state.data).toStrictEqual(constant.init.list);
  });
  test(`action.saveItem`, () => {
    list.action.saveItem();
    expect(JSON.parse(localStorage.getItem(`list`)!)).toStrictEqual(constant.init.list);
  });
  test(`getter.stateFull`, () => {
    expect(list.getter.stateFull()).toStrictEqual(constant.init.list);
  });
  test(`getter.stateUnit`, () => {
    expect(list.getter.stateUnit(base.id.inbox)).toStrictEqual({title: `Inbox`});
    expect(list.getter.stateUnit(base.id.trash)).toStrictEqual({title: `Trash`});
  });
  test(`getter.classItem`, () => {
    expect(list.getter.classItem(base.id.inbox)).toStrictEqual({select: false, edit: false, hide: false});
  });
  test(`action.insertItem:cancel`, () => {
    list.action.insertItem();
    expect(dialog.state.open).toBe(true);
    dialog.variable.callback.cancel!();
    expect(dialog.state.open).toBe(false);
  });
  test(`action.insertItem:ok`, () => {
    list.action.insertItem();
    expect(dialog.state.open).toBe(true);
    dialog.state.text.value = `listtitle`;
    dialog.variable.callback.ok!();
    const listId = list.state.data.sort[0]!;
    expect(list.state.data.sort).toHaveLength(3);
    expect(list.state.data.data[listId]).toStrictEqual({title: `listtitle`});
    expect(main.state.data[listId]).toStrictEqual({sort: [], data: {}});
    expect(sub.state.data[listId]).toStrictEqual({data: {}});
    expect(dialog.state.open).toBe(false);
  });
  test(`action.copyItem`, () => {
    const listId = list.state.data.sort[0]!;
    list.action.copyItem({event: {stopPropagation: () => {}} as Event, listId});
    const copyId = list.state.data.sort[1]!;
    expect(list.state.data.sort).toHaveLength(4);
    expect(list.state.data.data[copyId]).toStrictEqual({title: `listtitle`});
    expect(main.state.data[copyId]).toStrictEqual({sort: [], data: {}});
    expect(sub.state.data[copyId]).toStrictEqual({data: {}});
  });
  test(`action.deleteItem:cancel`, () => {
    const listId = list.state.data.sort[1]!;
    list.action.deleteItem({event: {stopPropagation: () => {}} as Event, listId});
    expect(dialog.state.open).toBe(true);
    dialog.variable.callback.cancel!();
    expect(list.state.data.sort.length).toBe(4);
    expect(list.state.data.data[listId]).toStrictEqual({title: `listtitle`});
    expect(main.state.data[listId]).toStrictEqual({sort: [], data: {}});
    expect(sub.state.data[listId]).toStrictEqual({data: {}});
    expect(dialog.state.open).toBe(false);
  });
  test(`action.deleteItem:ok`, () => {
    const listId = list.state.data.sort[1]!;
    list.action.deleteItem({event: {stopPropagation: () => {}} as Event, listId});
    expect(dialog.state.open).toBe(true);
    dialog.variable.callback.ok!();
    expect(list.state.data.sort.length).toBe(3);
    expect(list.state.data.data[listId]).toBeUndefined();
    expect(main.state.data[listId]).toBeUndefined();
    expect(sub.state.data[listId]).toBeUndefined();
    expect(dialog.state.open).toBe(false);
    expect(notice.state.open).toBe(true);
    notice.variable.callback();
    expect(list.state.data.data[listId]).toStrictEqual({title: `listtitle`});
    expect(main.state.data[listId]).toStrictEqual({sort: [], data: {}});
    expect(sub.state.data[listId]).toStrictEqual({data: {}});
    expect(notice.state.open).toBe(false);
  });
  test(`action.switchEdit:select`, () => {
    list.action.switchEdit({listId: base.id.inbox});
    expect(list.state.status[base.id.inbox]).toBe(`edit`);
  });
  test(`action.switchEdit:cancel`, () => {
    list.action.switchEdit();
    expect(list.state.status[base.id.inbox]).toBe(``);
  });
  test(`getter.iconType`, () => {
    expect(list.getter.iconType(list.getter.stateFull().sort[0]!)).toBe(`IconList`);
    expect(list.getter.iconType(base.id.inbox)).toBe(`IconInbox`);
    expect(list.getter.iconType(base.id.trash)).toBe(`IconTrash`);
  });
  test(`getter.classLimit`, () => {
    expect(list.getter.classLimit(base.id.inbox)).toStrictEqual({warn: false, error: false});
  });
  test(`getter.textCount`, () => {
    expect(list.getter.textCount(base.id.inbox)).toBe(`0/0`);
  });
  test(`action.dragInit`, () => {
    list.action.dragInit(
      {event: {detail: {changedTouches: [{clientY: 0}]}} as unknown as TouchEvent, listId: base.id.inbox});
    expect(list.variable.drag.status).toBe(`start`);
  });
  test(`action.dragStart`, () => {
    list.action.dragStart({event: {preventDefault: () => {}} as TouchEvent});
    expect(list.variable.drag.status).toBe(`move`);
    expect(list.state.status[base.id.inbox]).toBe(`hide`);
  });
  test(`action.dragMove`, () => {
    list.action.dragMove(
      {event: {changedTouches: [{clientY: 0}], preventDefault: () => {}} as unknown as TouchEvent});
    expect(list.variable.drag.status).toBe(`move`);
  });
  test(`action.dragEnd`, () => {
    list.action.dragEnd();
    expect(list.variable.drag.status).toBeUndefined();
  });
  test(`action.dragEnd:none`, () => {
    list.variable.drag.status = `start`;
    list.variable.drag.id = base.id.inbox;
    delete list.variable.drag.clone;
    list.action.dragEnd();
    expect(list.variable.drag.status).toBeUndefined();
  });
  test(`action.swipeInit`, () => {
    list.action.swipeInit(swipeMock);
    expect(list.variable.swipe.status).toBe(`start`);
  });
  test(`action.swipeStart`, () => {
    list.action.swipeStart(
      {event: {changedTouches: [{clientX: 16, clientY: 0}]} as unknown as TouchEvent});
    expect(list.variable.swipe.status).toBe(`move`);
  });
  test(`action.swipeMove`, () => {
    list.action.swipeMove({event: {changedTouches: [{clientX: 0}]} as unknown as TouchEvent});
    expect(list.variable.swipe.target!.style.transform).toBe(`translateX(0px)`);
  });
  test(`action.swipeEnd`, () => {
    list.action.swipeEnd({event: {changedTouches: [{clientX: 0}]} as unknown as TouchEvent});
    expect(list.variable.swipe.status).toBeUndefined();
  });
  test(`action.swipeInit:again`, () => {
    list.variable.swipe.status = `end`;
    list.action.swipeInit(swipeMock);
    expect(list.variable.swipe.status).toBe(`move`);
  });
  test(`action.swipeEnd:again`, () => {
    list.action.swipeEnd({event: {changedTouches: [{clientX: -101}]} as unknown as TouchEvent});
    expect(list.variable.swipe.status).toBeUndefined();
  });
});
