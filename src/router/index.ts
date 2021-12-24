import * as VueRouter from 'vue-router';
import Main from '@/views/main.vue';
import List from '@/views/list.vue';
import Sub from '@/views/sub.vue';
import Conf from '@/views/conf.vue';

const routes: VueRouter.RouteRecordRaw[] = [
  {
    path: `/:listId`,
    components: {
      main: Main,
    },
  },
  {
    path: `/:listId/list`,
    components: {
      main: Main,
      sub: List,
    },
  },
  {
    path: `/:listId/sub/:mainId`,
    components: {
      main: Main,
      sub: Sub,
    },
  },
  {
    path: `/:listId/conf`,
    components: {
      main: Main,
      sub: Conf,
    },
  },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
