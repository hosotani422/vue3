import * as VueRouter from 'vue-router';
import PageMain from '@/views/page-main.vue';
import PageList from '@/views/page-list.vue';
import PageSub from '@/views/page-sub.vue';
import PageConf from '@/views/page-conf.vue';
import * as page from '@/composition/pages/page';

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(process.env.BASE_URL),
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
  const stateId = page.state.listId;
  _next(paramId && stateId && paramId !== stateId ? (() => {
    const path = _to.path.split(`/`);
    path.splice(1, 1, stateId);
    return {path: path.join(`/`), replace: true};
  })() : true);
});

export default router;
