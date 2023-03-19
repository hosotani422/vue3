import * as root from '@/composables/page/root';
import * as dialog from '@/composables/popup/dialog';

describe(`dialog`, () => {
  test(`action.open:alert`, () => {
    dialog.action.open({
      mode: `alert`,
      title: `title`,
      message: `message`,
      cancel: root.getter.lang().button.ok,
      callback: {
        cancel: () => {},
      },
    });
    expect(dialog.state.mode).toBe(`alert`);
    expect(dialog.state.open).toBe(true);
  });
  test(`action.open:confirm`, () => {
    dialog.action.open({
      mode: `confirm`,
      title: `title`,
      message: `message`,
      ok: root.getter.lang().button.ok,
      cancel: root.getter.lang().button.cancel,
      callback: {
        ok: () => {},
        cancel: () => {},
      },
    });
    expect(dialog.state.mode).toBe(`confirm`);
    expect(dialog.state.open).toBe(true);
  });
  test(`action.open:text`, () => {
    dialog.action.open({
      mode: `text`,
      title: `title`,
      message: `message`,
      text: {
        value: `value`,
        placeholder: `placeholder`,
      },
      ok: root.getter.lang().button.ok,
      cancel: root.getter.lang().button.cancel,
      callback: {
        ok: () => {},
        cancel: () => {},
      },
    });
    expect(dialog.state.mode).toBe(`text`);
    expect(dialog.state.open).toBe(true);
  });
  test(`action.open:check`, () => {
    dialog.action.open({
      mode: `check`,
      title: `title`,
      message: `message`,
      check: {
        all: true,
        sort: [`1`, `2`, `3`],
        data: {
          '1': {check: false, title: `1`},
          '2': {check: false, title: `2`},
          '3': {check: false, title: `3`},
        },
      },
      ok: root.getter.lang().button.ok,
      cancel: root.getter.lang().button.cancel,
      callback: {
        ok: () => {},
        cancel: () => {},
      },
    });
    expect(dialog.state.mode).toBe(`check`);
    expect(dialog.state.open).toBe(true);
  });
  test(`action.clickCheckAll:true`, () => {
    dialog.action.clickCheckAll({event: {target: {checked: true}} as unknown as Event});
    expect(dialog.getter.stateCheckAll()).toBe(true);
  });
  test(`action.clickCheckAll:false`, () => {
    dialog.action.clickCheckAll({event: {target: {checked: false}} as unknown as Event});
    expect(dialog.getter.stateCheckAll()).toBe(false);
  });
  test(`action.open:radio`, () => {
    dialog.action.open({
      mode: `radio`,
      title: `title`,
      message: `message`,
      radio: {
        none: false,
        select: `1`,
        sort: [`1`, `2`, `3`],
        data: {
          '1': {title: `title1`},
          '2': {title: `title2`},
          '3': {title: `title3`},
        },
      },
      ok: root.getter.lang().button.ok,
      cancel: root.getter.lang().button.cancel,
      callback: {
        ok: () => {},
        cancel: () => {},
      },
    });
    expect(dialog.state.mode).toBe(`radio`);
    expect(dialog.state.open).toBe(true);
  });
  test(`action.close`, () => {
    dialog.action.close();
    expect(dialog.state.open).toBe(false);
  });
});
