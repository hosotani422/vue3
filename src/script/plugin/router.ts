import * as VueRouter from 'vue-router';
import PageList from '@/components/page/PageList.vue';
import PageMain from '@/components/page/PageMain.vue';
import PageSub from '@/components/page/PageSub.vue';
import PageConf from '@/components/page/PageConf.vue';
import * as root from '@/composables/page/root';

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes: [
    {
      path: `/:listId`,
      component: PageMain,
      children: [
        {
          path: `list`,
          component: PageList,
        }, {
          path: `sub/:mainId`,
          component: PageSub,
        }, {
          path: `conf`,
          component: PageConf,
        },
      ],
    },
  ],
});

/**
 * メイン画面遷移（ヒストリーバック）時に強制的に変数値を適用
 * ※ パラメータ値を変数値に書き換える
 */
router.beforeEach((_to: VueRouter.RouteLocationNormalized,
  _from: VueRouter.RouteLocationNormalized, _next: VueRouter.NavigationGuardNext) => {
  if (!_to.params.listId && _from.params.listId && root.state.back) {
    _next((() => {
      const path = _to.path.split(`/`);
      path.splice(1, 1, root.state.listId);
      root.state.back = false;
      return {path: path.join(`/`), replace: true};
    })());
  } else {
    _next(true);
  }
});

export default router;
