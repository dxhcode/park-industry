import { createRouter, createWebHistory } from 'vue-router'
import { adminMenus, flattenMenus } from '@/config/menus'
import AdminLayout from '@/layouts/AdminLayout.vue'
import PlaceholderView from '@/views/PlaceholderView.vue'

const pages = flattenMenus(adminMenus)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AdminLayout,
      redirect: '/workbench',
      children: pages.map((page) => ({
        path: page.path.replace(/^\//, ''),
        name: page.key,
        component: PlaceholderView,
        meta: {
          title: page.title,
          group: page.group,
          description: page.description,
          hints: page.hints,
        },
      })),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/workbench',
    },
  ],
})

router.afterEach((to) => {
  const title = typeof to.meta.title === 'string' ? to.meta.title : ''
  document.title = title ? `${title} · 产业运营平台` : '产业运营平台'
})

export default router
