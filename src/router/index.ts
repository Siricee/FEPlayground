import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { viewRouters } from './view-router'
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/cover',
    name: '/',
    strict: true,
    children: [
      {
        path: 'cover',
        name: 'Cover',
        component: () => import('@/components/Cover.vue'),
      },
      {
        path: 'grid',
        name: 'SketchList',
        component: () => import('@/components/SketchList.vue'),
      },
      {
        path: '',
        name: 'Container',
        component: () => import('@/views/Container.vue'),
        children: [
          ...(Object.values(viewRouters).flat()),
          {
            path: '/:pathMatch(.*)*',
            strict: true,
            name: '404 Page',
            redirect: '/404',
          },
        ],
      },
      {
        path: '404',
        component: () => import('@/components/Error.vue'),
      },
    ],
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
