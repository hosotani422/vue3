import constant from '@/script/const';
import * as base from '@/script/const/base';
import * as root from '@/composables/page/root';
import * as list from '@/composables/page/list';
import * as main from '@/composables/page/main';
import * as sub from '@/composables/page/sub';
import * as conf from '@/composables/page/conf';
import * as dialog from '@/composables/popup/dialog';

describe(`conf`, () => {
  const swipeMock = {
    event: {
      changedTouches: [{clientX: 0, clientY: 0}],
      currentTarget: {
        style: {transform: ``},
        classList: {add: () => {}, remove: () => {}},
        addEventListener: (_type: string, listener: Function) => {
          listener();
        },
        removeEventListener: () => {},
        getBoundingClientRect: () => ({top: 0, height: 0}),
      },
    } as unknown as TouchEvent,
  };
  beforeAll(() => {
    root.state.listId = base.id.inbox;
    main.getter.stateFull().sort = [`1`];
    main.getter.stateFull().data[`1`] = {
      check: false,
      title: `title`,
      task: false,
      date: `2022/01/01`,
      time: `01:01`,
      alarm: [`1`],
    };
  });
  test(`action.initPage`, () => {
    conf.action.initPage();
  });
  test(`action.loadItem`, () => {
    conf.action.loadItem();
    expect(conf.state.data).toStrictEqual(constant.init.conf);
  });
  test(`action.saveItem`, () => {
    conf.action.saveItem();
    expect(JSON.parse(localStorage.getItem(`conf`)!)).toStrictEqual(constant.init.conf);
  });
  test(`action.reactFont:small`, () => {
    conf.state.data.size = 1;
    conf.action.reactFont();
    expect(document.querySelector(`html`)!.style.fontSize).toBe(`14px`);
  });
  test(`action.reactFont:middle`, () => {
    conf.state.data.size = 2;
    conf.action.reactFont();
    expect(document.querySelector(`html`)!.style.fontSize).toBe(`16px`);
  });
  test(`action.reactFont:large`, () => {
    conf.state.data.size = 3;
    conf.action.reactFont();
    expect(document.querySelector(`html`)!.style.fontSize).toBe(`18px`);
  });
  test(`action.reactFont:none`, () => {
    conf.state.data.size = 0 as 1;
    conf.action.reactFont();
    expect(document.querySelector(`html`)!.style.fontSize).toBe(`10px`);
  });
  test(`action.reactSound`, () => {
    conf.action.reactSound();
  });
  test(`action.reactAlarm`, () => {
    conf.action.reactAlarm();
  });
  test(`action.downloadBackup`, () => {
    conf.action.downloadBackup({event: {currentTarget: {setAttribute: () => {}}} as unknown as Event});
  });
  test(`action.uploadBackup`, () => {
    conf.action.uploadBackup({event: {target: {files: [{}]}} as unknown as Event});
  });
  test(`action.resetConf:ok`, () => {
    conf.action.resetConf();
    expect(dialog.state.open).toBe(true);
    dialog.variable.callback.ok!();
    expect(conf.state.data).toContain(constant.init.conf);
    expect(dialog.state.open).toBe(false);
  });
  test(`action.resetConf:cancel`, () => {
    conf.action.resetConf();
    expect(dialog.state.open).toBe(true);
    dialog.variable.callback.cancel!();
    expect(dialog.state.open).toBe(false);
  });
  test(`action.resetList:ok`, () => {
    conf.action.resetList();
    expect(dialog.state.open).toBe(true);
    dialog.variable.callback.ok!();
    expect(sub.state.data).toStrictEqual(constant.init.sub);
    expect(main.state.data).toStrictEqual(constant.init.main);
    expect(list.state.data).toStrictEqual(constant.init.list);
    expect(dialog.state.open).toBe(false);
  });
  test(`action.resetList:cancel`, () => {
    conf.action.resetList();
    expect(dialog.state.open).toBe(true);
    dialog.variable.callback.cancel!();
    expect(dialog.state.open).toBe(false);
  });
  test(`action.swipeInit`, () => {
    conf.action.swipeInit(swipeMock);
    expect(conf.variable.swipe.status).toBe(`start`);
  });
  test(`action.swipeStart`, () => {
    conf.action.swipeStart({event: {changedTouches: [{clientX: 0, clientY: 16}]} as unknown as TouchEvent});
    expect(conf.variable.swipe.status).toBe(`move`);
  });
  test(`action.swipeMove`, () => {
    conf.action.swipeMove({event: {changedTouches: [{clientY: 0}]} as unknown as TouchEvent});
    expect(conf.variable.swipe.target!.style.transform).toBe(`translateY(0px)`);
  });
  test(`action.swipeEnd`, () => {
    conf.action.swipeEnd({event: {changedTouches: [{clientY: 0}]} as unknown as TouchEvent});
    expect(conf.variable.swipe.status).toBeUndefined();
  });
  test(`action.swipeInit:again`, () => {
    conf.variable.swipe.status = `end`;
    conf.action.swipeInit(swipeMock);
    expect(conf.variable.swipe.status).toBe(`move`);
  });
  test(`action.swipeEnd:again`, () => {
    conf.action.swipeEnd({event: {changedTouches: [{clientY: 101}]} as unknown as TouchEvent});
    expect(conf.variable.swipe.status).toBeUndefined();
  });
});
