import * as VueRouter from 'vue-router';
import PageMain from '@/view/page/PageMain.vue';
import PageList from '@/view/page/PageList.vue';
import PageSub from '@/view/page/PageSub.vue';
import PageConf from '@/view/page/PageConf.vue';
import * as root from '@/status/page/root';

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(process.env.BASE_URL),
  routes: [
    {
      path: `/:listId`,
      components: {
        main: PageMain,
      },
    },
    {
      path: `/:listId/list`,
      components: {
        main: PageMain,
        sub: PageList,
      },
    },
    {
      path: `/:listId/sub/:mainId`,
      components: {
        main: PageMain,
        sub: PageSub,
      },
    },
    {
      path: `/:listId/conf`,
      components: {
        main: PageMain,
        sub: PageConf,
      },
    },
  ],
});

router.beforeEach((_to: any, _from: any, _next: any) => {
  const paramId = _to.params?.listId;
  const stateId = root.state.listId;
  _next(paramId && stateId && paramId !== stateId ? (() => {
    const path = _to.path.split(`/`);
    path.splice(1, 1, stateId);
    return {path: path.join(`/`), replace: true};
  })() : true);
});

export default router;
