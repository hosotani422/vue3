import * as Vue from 'vue';
import * as root from '@/composables/page/root';
import * as calendar from '@/composables/popup/calendar';

describe(`calendar`, () => {
  beforeAll(() => {
    calendar.ref.area = {value: {$el: {
      classList: {add: () => {}, remove: () => {}},
      addEventListener: (_type: string, listener: Function) => {
        listener();
      },
      removeEventListener: () => {},
    }}} as Vue.Ref<Vue.ComponentPublicInstance<HTMLElement> | undefined>;
    calendar.ref.body = {value: {$el: {parentElement: {getBoundingClientRect: () => ({left: 0})}}}} as
      Vue.Ref<Vue.ComponentPublicInstance<HTMLElement> | undefined>;
  });
  test(`action.open`, () => {
    calendar.action.open({
      select: `2022/01/01`,
      current: `2022/01`,
      cancel: root.getter.lang().button.cancel,
      clear: root.getter.lang().button.clear,
      callback: () => {},
    });
    expect(calendar.state.open).toBe(true);
  });
  test(`getter.textWeek`, () => {
    expect(calendar.getter.textWeek()).toStrictEqual([`日`, `月`, `火`, `水`, `木`, `金`, `土`]);
  });
  test(`getter.textDay`, () => {
    expect(calendar.getter.textDay()).toHaveLength(3);
  });
  test(`getter.classDay1`, () => {
    expect(calendar.getter.classDay(`2022/01`, `2022/01/01`))
      .toStrictEqual({select: true, today: false, hide: false});
  });
  test(`getter.classDay2`, () => {
    expect(calendar.getter.classDay(`2022/02`, `2022/01/31`))
      .toStrictEqual({select: false, today: false, hide: true});
  });
  test(`getter.classDay3`, () => {
    expect(calendar.getter.classDay(root.lib.dayjs().format(`YYYY/MM`), root.lib.dayjs().format(`YYYY/MM/DD`)))
      .toStrictEqual({select: false, today: true, hide: false});
  });
  test(`action.close`, () => {
    calendar.action.close();
    expect(calendar.state.open).toBe(false);
  });
  test(`action.pageMove1`, () => {
    calendar.action.pageMove({prev: true});
    expect(calendar.state.current).toBe(`2021/12`);
  });
  test(`action.pageMove2`, () => {
    calendar.action.pageMove({prev: false});
    expect(calendar.state.current).toBe(`2022/01`);
  });
  test(`action.swipeInit`, () => {
    calendar.action.swipeInit({event: {
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
    } as unknown as TouchEvent});
    expect(calendar.variable.swipe.status).toBe(`start`);
  });
  test(`action.swipeStart`, () => {
    calendar.action.swipeStart({event: {changedTouches: [{clientX: 11, clientY: 0}]} as unknown as TouchEvent});
    expect(calendar.variable.swipe.status).toBe(`move`);
  });
  test(`action.swipeMove`, () => {
    calendar.action.swipeMove({event: {changedTouches: [{clientX: 0}]} as unknown as TouchEvent});
    expect(calendar.variable.swipe.status).toBe(`move`);
  });
  test(`action.swipeEnd1`, () => {
    calendar.action.swipeEnd({event: {changedTouches: [{clientX: 0}]} as unknown as TouchEvent});
    expect(calendar.state.current).toBe(`2022/01`);
    expect(calendar.variable.swipe).toStrictEqual({});
  });
  test(`action.swipeEnd2`, () => {
    calendar.variable.swipe = {status: `move`, x: 0, y: 0, target: {
      style: {transform: ``}, classList: {add: () => {}, remove: () => {}},
      addEventListener: () => {}, removeEventListener: () => {},
    }} as unknown as typeof calendar.variable.swipe;
    calendar.action.swipeEnd({event: {changedTouches: [{clientX: 100}]} as unknown as TouchEvent});
    expect(calendar.state.current).toBe(`2021/12`);
    expect(calendar.variable.swipe).toStrictEqual({});
  });
  test(`action.swipeEnd3`, () => {
    calendar.variable.swipe = {status: `move`, x: 0, y: 0, target: {
      style: {transform: ``}, classList: {add: () => {}, remove: () => {}},
      addEventListener: () => {}, removeEventListener: () => {},
    }} as unknown as typeof calendar.variable.swipe;
    calendar.action.swipeEnd({event: {changedTouches: [{clientX: -100}]} as unknown as TouchEvent});
    expect(calendar.state.current).toBe(`2022/01`);
    expect(calendar.variable.swipe).toStrictEqual({});
  });
  test(`action.swipeEnd4`, () => {
    calendar.action.swipeEnd({event: {changedTouches: [{clientX: 0}]} as unknown as TouchEvent});
    expect(calendar.variable.swipe).toStrictEqual({});
  });
});
