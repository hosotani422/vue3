import * as root from '@/composables/page/root';
import * as notice from '@/composables/popup/notice';

describe(`notice`, () => {
  test(`action.open`, () => {
    notice.action.open({
      message: root.getter.lang().notice.message,
      button: root.getter.lang().notice.button,
      callback: () => {},
    });
    expect(notice.state.open).toBe(true);
  });
  test(`action.close`, () => {
    notice.action.close();
    expect(notice.state.open).toBe(false);
  });
});
