import * as Vue from 'vue';
import * as VueRouter from 'vue-router';
import constant from '@/script/const';
import * as base from '@/script/const/base';
import * as root from '@/composables/page/root';
import * as main from '@/composables/page/main';
import * as sub from '@/composables/page/sub';
import * as conf from '@/composables/page/conf';
import * as calendar from '@/composables/popup/calendar';
import * as dialog from '@/composables/popup/dialog';
import * as clock from '@/composables/popup/clock';
import * as notice from '@/composables/popup/notice';

describe(`sub`, () => {
  const refTitles = {
    $el: {style: {height: 0}, scrollHeight: 0, selectionStart: 0, selectionEnd: 0, focus: () => {}},
  } as Vue.ComponentPublicInstance<HTMLElement>;
  const refItems = {$el: {
    style: {height: 0},
    scrollHeight: 0,
    cloneNode: () => ({
      style: {position: ``, zIndex: ``, top: ``, left: ``, height: ``, width: ``},
      classList: {remove: () => {}},
      animate: () => ({addEventListener: (_type: string, listener: Function) => {
        listener();
      }}),
      remove: () => {},
      getBoundingClientRect: () => ({top: 0}),
    }),
    getBoundingClientRect: () => ({top: 0, left: 0, width: 0, height: 9}),
    addEventListener: (_type: string, listener: Function) => {
      listener();
    },
    removeEventListener: () => {},
  }} as Vue.ComponentPublicInstance<HTMLElement>;
  const refClock = {value: {$el: {
    getContext: () => ({
      lineWidth: 0,
      font: ``,
      textAlign: ``,
      textBaseline: ``,
      fillStyle: ``,
      strokeStyle: ``,
      canvas: {setAttribute: () => {}},
      beginPath: () => {},
      arc: () => {},
      fill: () => {},
      translate: () => {},
      rotate: () => {},
      moveTo: () => {},
      lineTo: () => {},
      stroke: () => {},
      fillText: () => {},
    }),
    getBoundingClientRect: () => ({height: 0}),
  }}} as Vue.Ref<Vue.ComponentPublicInstance<HTMLElement> | undefined>;
  const swipeMock = {event: {
    changedTouches: [{clientX: 0, clientY: 0}],
    currentTarget: {
      style: {transform: ``},
      classList: {add: () => {}, remove: () => {}},
      getBoundingClientRect: () => ({left: 0, width: 0}),
      addEventListener: (_type: string, listener: Function) => {
        listener();
      },
      removeEventListener: () => {},
    },
  } as unknown as TouchEvent};
  beforeAll(() => {
    conf.state.data.vibrate = `off`;
    root.state.listId = base.id.inbox;
    main.action.insertItem();
    dialog.variable.callback.ok!();
    const mainId = main.getter.stateFull().sort[0]!;
    root.lib.route = {params: {mainId}} as unknown as VueRouter.RouteLocationNormalizedLoaded;
    const subId = sub.getter.stateFull().sort[0]!;
    sub.ref.home = {value: {$el: {getBoundingClientRect: () => ({left: 0})}}} as
      Vue.Ref<Vue.ComponentPublicInstance<HTMLElement> | undefined>;
    sub.ref.wrap = {value: {$el: {appendChild: () => {}, getBoundingClientRect: () => {}}}} as
      Vue.Ref<Vue.ComponentPublicInstance<HTMLElement> | undefined>;
    sub.ref.titles = {value: {[subId]: refTitles}} as
      Vue.Ref<{[K: string]: Vue.ComponentPublicInstance<HTMLElement>;}>;
    sub.ref.items = {value: {[subId]: refItems}} as
      Vue.Ref<{[K: string]: Vue.ComponentPublicInstance<HTMLElement>;}>;
    clock.ref.hour = refClock;
    clock.ref.minute = refClock;
  });
  test(`action.inputItem`, () => {
    const subId = sub.getter.stateFull().sort[0]!;
    sub.action.inputItem({event: {target: {value: `subtitle`}} as unknown as Event, subId});
    expect(sub.getter.stateFull().data[subId]!.title).toBe(`subtitle`);
  });
  test(`action.enterItem`, async() => {
    const subId = sub.getter.stateFull().sort[0]!;
    const newId = `sub${root.lib.dayjs().valueOf()}`;
    sub.ref.titles!.value[newId] = refTitles;
    sub.ref.items!.value[newId]! = refItems;
    await sub.action.enterItem(
      {event: {target: {value: `subtitle`, selectionStart: 3}} as unknown as KeyboardEvent, subId});
    expect(sub.getter.stateFull().sort).toStrictEqual([subId, newId]);
    expect(sub.getter.stateFull().data[subId]!.title).toBe(`sub`);
    expect(sub.getter.stateFull().data[newId]!.title).toBe(`title`);
  });
  test(`getter.stateFull`, () => {
    expect(sub.getter.stateFull().sort).toHaveLength(2);
  });
  test(`getter.stateUnit`, () => {
    const [subId, newId] = sub.getter.stateFull().sort as [string, string];
    expect(sub.getter.stateUnit(undefined, undefined, subId)).toStrictEqual({check: false, title: `sub`});
    expect(sub.getter.stateUnit(undefined, undefined, newId)).toStrictEqual({check: false, title: `title`});
  });
  test(`getter.classItem`, () => {
    const subId = sub.getter.stateFull().sort[0]!;
    expect(sub.getter.classItem(subId)).toStrictEqual({check: false, edit: false, drag: false, hide: false});
  });
  test(`getter.textMemo`, () => {
    expect(sub.getter.textMemo()).toBe(`sub\ntitle`);
  });
  test(`action.deleteItem`, async() => {
    const [subId, newId] = sub.getter.stateFull().sort as unknown as [string, string];
    await sub.action.deleteItem({subId: newId});
    expect(sub.getter.stateFull().sort).toStrictEqual([subId]);
    expect(sub.getter.stateFull().data[newId]).toBeUndefined();
    expect(notice.state.open).toBe(true);
    await notice.variable.callback();
    expect(sub.getter.stateFull().sort).toStrictEqual([subId, newId]);
    expect(sub.getter.stateFull().data[newId]).toStrictEqual({check: false, title: `title`});
    expect(notice.state.open).toBe(false);
  });
  test(`action.backItem`, async() => {
    const [subId, newId] = sub.getter.stateFull().sort as unknown as [string, string];
    await sub.action.backItem({event:
      {target: {selectionStart: 0}, preventDefault: () => {}} as unknown as KeyboardEvent, subId: newId});
    expect(sub.getter.stateFull().sort).toStrictEqual([subId]);
    expect(sub.getter.stateFull().data[subId]).toStrictEqual({check: false, title: `subtitle`});
    expect(sub.getter.stateFull().data[newId]).toBeUndefined();
  });
  test(`action.checkItem1`, async() => {
    const subId = sub.getter.stateFull().sort[0]!;
    await sub.action.checkItem({event: {target: {checked: true}} as unknown as Event, subId});
    expect(sub.getter.stateFull().sort).toStrictEqual([subId]);
    expect(sub.getter.stateFull().data[subId]!.check).toBe(true);
  });
  test(`action.checkItem2`, async() => {
    const subId = sub.getter.stateFull().sort[0]!;
    await sub.action.checkItem({event: {target: {checked: false}} as unknown as Event, subId});
    expect(sub.getter.stateFull().sort).toStrictEqual([subId]);
    expect(sub.getter.stateFull().data[subId]!.check).toBe(false);
  });
  test(`action.switchItem1`, () => {
    sub.action.switchItem();
    expect(main.getter.stateUnit().task).toBe(false);
  });
  test(`action.switchItem2`, () => {
    sub.action.switchItem();
    expect(main.getter.stateUnit().task).toBe(true);
  });
  test(`action.switchEdit1`, () => {
    const subId = sub.getter.stateFull().sort[0]!;
    sub.action.switchEdit({subId});
    expect(sub.state.status[subId]).toBe(`edit`);
  });
  test(`action.switchEdit2`, () => {
    const subId = sub.getter.stateFull().sort[0]!;
    sub.action.switchEdit();
    expect(sub.state.status[subId]).toBe(``);
  });
  test(`action.openCalendar`, () => {
    sub.action.openCalendar({date: ``});
    expect(calendar.state.open).toBe(true);
    calendar.variable.callback(`2099/12/31`);
    expect(main.getter.stateUnit().date).toBe(`2099/12/31`);
    expect(calendar.state.open).toBe(false);
  });
  test(`action.openClock`, () => {
    sub.action.openClock({time: ``});
    expect(clock.state.open).toBe(true);
    clock.variable.callback(12, 45);
    expect(main.getter.stateUnit().time).toBe(`12:45`);
    expect(clock.state.open).toBe(false);
  });
  test(`action.openAlarm1`, () => {
    sub.action.openAlarm();
    expect(dialog.state.open).toBe(true);
    dialog.variable.callback.cancel!();
    expect(dialog.state.open).toBe(false);
  });
  test(`action.openAlarm2`, () => {
    sub.action.openAlarm();
    expect(dialog.state.open).toBe(true);
    dialog.state.check.data[`1`]!.check = true;
    dialog.variable.callback.ok!();
    expect(main.getter.stateUnit().alarm).toStrictEqual([`1`]);
    expect(dialog.state.open).toBe(false);
  });
  test(`getter.classLimit`, () => {
    expect(sub.getter.classLimit()).toStrictEqual({warn: false, error: false});
  });
  test(`getter.textAlarm`, () => {
    expect(sub.getter.textAlarm()).toBe(`時刻通り`);
  });
  test(`action.dragInit`, () => {
    const subId = sub.getter.stateFull().sort[0]!;
    sub.action.dragInit({event: {changedTouches: [{clientY: 0}]} as unknown as TouchEvent, subId});
    expect(sub.variable.drag.status).toBe(`start`);
    expect(sub.state.status[subId]).toBe(`edit`);
  });
  test(`action.dragStart`, () => {
    const subId = sub.getter.stateFull().sort[0]!;
    sub.action.dragStart({event: {preventDefault: () => {}} as unknown as TouchEvent});
    expect(sub.variable.drag.status).toBe(`move`);
    expect(sub.state.status[subId]).toBe(`hide`);
  });
  test(`action.dragMove`, () => {
    sub.action.dragMove({event:
      {changedTouches: [{clientY: 0}], preventDefault: () => {}} as unknown as TouchEvent});
    expect(sub.variable.drag.status).toBe(`move`);
  });
  test(`action.dragEnd`, () => {
    sub.action.dragEnd();
    expect(sub.variable.drag.status).toBeUndefined();
  });
  test(`action.dragEnd:none`, () => {
    sub.variable.drag.status = `start`;
    sub.variable.drag.id = `subno`;
    sub.action.dragEnd();
    expect(sub.variable.drag.status).toBeUndefined();
  });
  test(`action.swipeInit`, () => {
    sub.action.swipeInit(swipeMock);
    expect(sub.variable.swipe.status).toBe(`start`);
  });
  test(`action.swipeStart`, () => {
    sub.action.swipeStart({event: {changedTouches: [{clientX: 16, clientY: 0}]} as unknown as TouchEvent});
    expect(sub.variable.swipe.status).toBe(`move`);
  });
  test(`action.swipeMove`, () => {
    sub.action.swipeMove({event: {changedTouches: [{clientX: 0}]} as unknown as TouchEvent});
    expect(sub.variable.swipe.target!.style.transform).toBe(`translateX(0px)`);
  });
  test(`action.swipeEnd`, () => {
    sub.action.swipeEnd({event: {changedTouches: [{clientX: 0}]} as unknown as TouchEvent});
    expect(sub.variable.swipe.status).toBeUndefined();
  });
  test(`action.swipeInit:again`, () => {
    sub.variable.swipe.status = `end`;
    sub.action.swipeInit(swipeMock);
    expect(sub.variable.swipe.status).toBe(`move`);
  });
  test(`action.swipeEnd:again`, () => {
    sub.action.swipeEnd({event: {changedTouches: [{clientX: 101}]} as unknown as TouchEvent});
    expect(sub.variable.swipe.status).toBeUndefined();
  });
  test(`action.initPage`, () => {
    localStorage.removeItem(`sub`);
    sub.action.initPage();
  });
  test(`action.loadItem`, () => {
    sub.action.loadItem();
    expect(sub.state.data).toStrictEqual(constant.init.sub);
  });
  test(`action.saveItem`, () => {
    sub.action.saveItem();
    expect(JSON.parse(localStorage.getItem(`sub`)!)).toStrictEqual(constant.init.sub);
  });
  test(`action.inputMemo`, () => {
    sub.action.inputMemo({event: {target: {value: `sub\ntitle`}} as unknown as Event});
    const sort = sub.getter.stateFull().sort as [string, string];
    expect(sort).toHaveLength(2);
    expect(sub.getter.stateFull().data[sort[0]]).toStrictEqual({check: false, title: `sub`});
    expect(sub.getter.stateFull().data[sort[1]]).toStrictEqual({check: false, title: `title`});
  });
});
