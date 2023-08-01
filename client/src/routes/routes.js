import * as VueRouter from 'vue-router';

import config from '../configs/config';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import EmptyLayout from '../layouts/EmptyLayout.vue'




const routes = [
  {
    path: config.route.home,
    component: () => import('../pages/Home.vue'),
    meta: {
      layout: DefaultLayout,
      title: 'home'
    },
  },
  {
    path: config.route.pageNotFound,
    component: () => import('../pages/404NotFound.vue'),
    meta: {
      layout: EmptyLayout,
      title: 'Not found'
    },
  },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

export default router;
