import * as Vue from 'vue';
import * as root from '@/composables/page/root';
import * as clock from '@/composables/popup/clock';

describe(`clock`, () => {
  const ctx = {
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
    rotate: () => {},
    translate: () => {},
    moveTo: () => {},
    lineTo: () => {},
    stroke: () => {},
    fillText: () => {},
  };
  beforeAll(() => {
    clock.ref.hour = {value: {$el: {getContext: () => (ctx), getBoundingClientRect: () => ({height: 0})}}} as
      Vue.Ref<Vue.ComponentPublicInstance<HTMLElement> | undefined>;
    clock.ref.minute = {value: {$el: {getContext: () => (ctx), getBoundingClientRect: () => ({height: 0})}}} as
      Vue.Ref<Vue.ComponentPublicInstance<HTMLElement> | undefined>;
  });
  test(`action.open`, () => {
    clock.action.open({
      hour: 0,
      minute: 0,
      cancel: root.getter.lang().button.cancel,
      clear: root.getter.lang().button.clear,
      ok: root.getter.lang().button.ok,
      callback: () => {},
    });
    expect(clock.state.open).toBe(true);
  });
  test(`action.close`, () => {
    clock.action.close();
    expect(clock.state.open).toBe(false);
  });
  test(`action.inputHour`, () => {
    clock.action.inputHour({event: {
      touches: [{pageX: 0, pageY: 0}],
      target: {getBoundingClientRect: () => ({top: 0, left: 0, height: 0}), getContext: () => (ctx)},
    } as unknown as TouchEvent});
  });
  test(`action.inputMinute`, () => {
    clock.action.inputMinute({event: {
      touches: [{pageX: 0, pageY: 0}],
      target: {getBoundingClientRect: () => ({top: 0, left: 0, height: 0}), getContext: () => (ctx)},
    } as unknown as TouchEvent});
  });
});
