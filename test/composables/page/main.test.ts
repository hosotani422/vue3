import * as Vue from 'vue';
import * as VueRouter from 'vue-router';
import constant from '@/script/const';
import * as base from '@/script/const/base';
import * as root from '@/composables/page/root';
import * as main from '@/composables/page/main';
import * as sub from '@/composables/page/sub';
import * as conf from '@/composables/page/conf';
import * as dialog from '@/composables/popup/dialog';
import * as notice from '@/composables/popup/notice';

describe(`main`, () => {
  const mainItems = (mainId: string): Vue.Ref<{[K: string]: Vue.ComponentPublicInstance<HTMLElement>;}> => ({
    value: {[mainId]: {$el: {cloneNode: () => ({
      style: {position: ``, zIndex: ``, top: ``, left: ``, height: ``, width: ``},
      classList: {remove: () => {}},
      remove: () => {},
      animate: () => ({addEventListener: (_type: string, listener: Function) => {
        listener();
      }}),
      getBoundingClientRect: () => ({top: 0, height: 0}),
    }),
    getBoundingClientRect: () => ({top: 0, left: 0, height: 0, width: 0})}}},
  } as Vue.Ref<{[K: string]: Vue.ComponentPublicInstance<HTMLElement>;}>);
  beforeAll(() => {
    conf.state.data.vibrate = `off`;
    root.state.listId = base.id.inbox;
    main.ref.wrap = {value: {$el: {appendChild: () => {}}}} as
      Vue.Ref<Vue.ComponentPublicInstance<HTMLElement> | undefined>;
  });
  test(`action.initPage`, () => {
    main.action.initPage();
  });
  test(`action.loadItem`, () => {
    main.action.loadItem();
    expect(main.state.data).toStrictEqual(constant.init.main);
  });
  test(`action.saveItem`, () => {
    main.action.saveItem();
    expect(JSON.parse(localStorage.getItem(`main`)!)).toStrictEqual(constant.init.main);
  });
  test(`action.insertItem:cancel`, () => {
    main.action.insertItem();
    expect(dialog.state.open).toBe(true);
    dialog.variable.callback.cancel!();
    expect(dialog.state.open).toBe(false);
  });
  test(`action.insertItem:ok`, () => {
    main.action.insertItem();
    expect(dialog.state.open).toBe(true);
    dialog.variable.callback.ok!();
    const mainId = main.getter.stateFull().sort[0]!;
    const subId = sub.getter.stateFull(undefined, mainId).sort[0]!;
    expect(main.getter.stateFull().sort).toHaveLength(1);
    expect(main.getter.stateFull().data[mainId]).toStrictEqual(
      {check: false, title: dialog.state.text.value, date: ``, time: ``, alarm: [], task: true});
    expect(sub.getter.stateFull(undefined, mainId).sort).toHaveLength(1);
    expect(sub.getter.stateUnit(undefined, mainId, subId)).toStrictEqual({check: false, title: ``});
    expect(dialog.state.open).toBe(false);
  });
  test(`action.copyItem`, () => {
    const mainId = main.getter.stateFull().sort[0]!;
    main.action.copyItem({event: {stopPropagation: () => {}} as Event, mainId});
    const copyId = main.getter.stateFull().sort[1]!;
    expect(main.getter.stateFull().sort).toHaveLength(2);
    expect(main.getter.stateUnit(undefined, copyId)).toStrictEqual(main.getter.stateUnit(undefined, mainId));
    expect(sub.getter.stateFull(undefined, copyId)).toStrictEqual(sub.getter.stateFull(undefined, mainId));
  });
  test(`action.moveItem:cancel`, () => {
    const mainId = main.getter.stateFull().sort[1]!;
    main.action.moveItem({event: {stopPropagation: () => {}} as Event, mainId});
    expect(dialog.state.open).toBe(true);
    dialog.variable.callback.cancel!();
    expect(dialog.state.open).toBe(false);
  });
  test(`action.moveItem:ok`, () => {
    const mainId = main.getter.stateFull().sort[1]!;
    const subId = sub.getter.stateFull(undefined, mainId).sort[0]!;
    main.action.moveItem({event: {stopPropagation: () => {}} as Event, mainId});
    expect(dialog.state.open).toBe(true);
    dialog.state.radio.select = base.id.trash;
    dialog.variable.callback.ok!();
    expect(main.getter.stateFull().sort).toHaveLength(1);
    expect(main.getter.stateUnit(undefined, mainId)).toBeUndefined();
    expect(sub.getter.stateFull(undefined, mainId)).toBeUndefined();
    expect(main.getter.stateFull(base.id.trash).sort).toHaveLength(1);
    expect(main.getter.stateUnit(base.id.trash, mainId)).toStrictEqual(
      {check: false, title: dialog.state.text.value, date: ``, time: ``, alarm: [], task: true});
    expect(sub.getter.stateFull(base.id.trash, mainId)).toStrictEqual(
      {sort: [subId], data: {[subId]: {check: false, title: ``}}});
    expect(dialog.state.open).toBe(false);
  });
  test(`action.deleteItem`, () => {
    const mainId = main.getter.stateFull().sort[0]!;
    const subId = sub.getter.stateFull(undefined, mainId).sort[0]!;
    main.action.deleteItem({event: {stopPropagation: () => {}} as Event, mainId});
    expect(main.getter.stateFull().sort).toHaveLength(0);
    expect(main.getter.stateUnit(undefined, mainId)).toBeUndefined();
    expect(sub.getter.stateFull(undefined, mainId)).toBeUndefined();
    expect(main.getter.stateFull(base.id.trash).sort).toHaveLength(2);
    expect(main.getter.stateUnit(base.id.trash, mainId)).toStrictEqual(
      {check: false, title: dialog.state.text.value, date: ``, time: ``, alarm: [], task: true});
    expect(sub.getter.stateFull(base.id.trash, mainId)).toStrictEqual(
      {sort: [subId], data: {[subId]: {check: false, title: ``}}});
    expect(notice.state.open).toBe(true);
    notice.variable.callback();
    expect(main.getter.stateFull().sort).toHaveLength(1);
    expect(main.getter.stateUnit(undefined, mainId)).toStrictEqual(
      {check: false, title: dialog.state.text.value, date: ``, time: ``, alarm: [], task: true});
    expect(sub.getter.stateFull(undefined, mainId)).toStrictEqual(
      {sort: [subId], data: {[subId]: {check: false, title: ``}}});
    expect(main.getter.stateFull(base.id.trash).sort).toHaveLength(1);
    expect(main.getter.stateUnit(base.id.trash, mainId)).toBeUndefined();
    expect(sub.getter.stateFull(base.id.trash, mainId)).toBeUndefined();
    expect(notice.state.open).toBe(false);
  });
  test(`action.checkItem`, () => {
    const mainId = main.getter.stateFull().sort[0]!;
    main.action.checkItem({event: {target: {checked: true}} as unknown as Event, mainId});
    expect(main.getter.stateUnit(undefined, mainId).check).toBe(true);
  });
  test(`action.switchEdit:select`, () => {
    const mainId = main.getter.stateFull().sort[0]!;
    main.action.switchEdit({mainId});
    expect(main.state.status[mainId]).toBe(`edit`);
  });
  test(`action.switchEdit:cancel`, () => {
    const mainId = main.getter.stateFull().sort[0]!;
    main.action.switchEdit();
    expect(main.state.status[mainId]).toBe(``);
  });
  test(`getter.stateFull`, () => {
    const mainId = main.getter.stateFull().sort[0]!;
    expect(main.getter.stateFull()).toStrictEqual(
      {sort: [mainId], data: {[mainId]: {check: true, title: ``, date: ``, time: ``, alarm: [], task: true}}});
  });
  test(`getter.stateUnit`, () => {
    const mainId = main.getter.stateFull().sort[0]!;
    root.lib.route = {params: {mainId}} as unknown as VueRouter.RouteLocationNormalizedLoaded;
    expect(main.getter.stateUnit()).toStrictEqual(
      {check: true, title: ``, date: ``, time: ``, alarm: [], task: true});
  });
  test(`getter.classItem`, () => {
    expect(main.getter.classItem(main.getter.stateFull().sort[0]!)).toStrictEqual(
      {select: true, check: true, edit: false, drag: false, hide: false});
  });
  test(`getter.classLimit`, () => {
    expect(main.getter.classLimit(main.getter.stateFull().sort[0]!)).toStrictEqual(
      {warn: false, error: false});
  });
  test(`getter.textCount`, () => {
    expect(main.getter.textCount(main.getter.stateFull().sort[0]!)).toBe(`1/1`);
  });
  test(`action.dragInit`, () => {
    const mainId = main.getter.stateFull().sort[0]!;
    main.ref.items = mainItems(mainId);
    main.action.dragInit(
      {event: {detail: {changedTouches: [{clientY: 0}]}} as unknown as TouchEvent, mainId});
    expect(main.variable.drag.status).toBe(`start`);
  });
  test(`action.dragStart`, () => {
    main.action.dragStart({event: {preventDefault: () => {}} as TouchEvent});
    expect(main.variable.drag.status).toBe(`move`);
  });
  test(`action.dragMove`, () => {
    main.action.dragMove(
      {event: {changedTouches: [{clientY: 0}], preventDefault: () => {}} as unknown as TouchEvent});
    expect(main.variable.drag.status).toBe(`move`);
  });
  test(`action.dragEnd`, () => {
    main.action.dragEnd();
    expect(main.variable.drag.status).toBeUndefined();
  });
  test(`action.dragEnd:none`, () => {
    main.variable.drag.status = `start`;
    main.variable.drag.id = `mainno`;
    delete main.variable.drag.clone;
    main.action.dragEnd();
    expect(main.variable.drag.status).toBeUndefined();
  });
});
