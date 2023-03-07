import * as VueRouter from 'vue-router';
import constant from '@/script/const';
import jp from '@/script/lang/jp';
import * as root from '@/composables/page/root';
import * as main from '@/composables/page/main';
import * as sub from '@/composables/page/sub';

describe(`root`, () => {
  test(`getter.isApp`, () => {
    expect(root.getter.isApp()).toBe(false);
  });
  test(`getter.lang`, () => {
    expect(root.getter.lang()).toStrictEqual(jp);
  });
  test(`getter.classTop`, () => {
    expect(root.getter.classTop()).toStrictEqual([`speed2`, `light`]);
  });
  test(`getter.classFoot`, () => {
    expect(root.getter.classFoot()).toBe(`middle`);
  });
  test(`action.initPage`, () => {
    root.action.initPage();
  });
  test(`action.loadRoute`, () => {
    root.action.loadRoute();
    expect(root.state.listId).toBe(constant.init.listId);
  });
  test(`action.saveRoute`, () => {
    root.action.saveRoute();
    expect(localStorage.getItem(`route`)).toBe(root.state.listId);
  });
  test(`action.routerList`, () => {
    root.action.routerList();
  });
  test(`action.routerMain:normal`, () => {
    root.action.routerMain({listId: constant.init.listId});
    expect(root.state.listId).toBe(constant.init.listId);
    expect(root.state.back).toBe(false);
  });
  test(`action.routerMain:back`, () => {
    root.lib.route = {params: {listId: constant.init.listId, mainId: `mainId`}} as
      unknown as VueRouter.RouteLocationNormalizedLoaded;
    root.action.routerMain({listId: constant.init.listId});
    expect(root.state.listId).toBe(constant.init.listId);
    expect(root.state.back).toBe(true);
  });
  test(`getter.listId`, () => {
    expect(root.getter.listId()).toBe(constant.init.listId);
  });
  test(`getter.mainId`, () => {
    expect(root.getter.mainId()).toBe(`mainId`);
  });
  test(`action.routerSub`, () => {
    root.action.routerSub({mainId: `mainId`});
  });
  test(`action.routerConf`, () => {
    root.action.routerConf();
  });
  test(`action.routerBack`, () => {
    root.action.routerBack();
  });
  test(`action.clearTrash`, () => {
    root.action.clearTrash();
    expect(main.state.data[constant.base.id.trash]).toStrictEqual({sort: [], data: {}});
    expect(sub.state.data[constant.base.id.trash]).toStrictEqual({data: {}});
  });
});
