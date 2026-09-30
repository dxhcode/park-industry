import { createRouter, createWebHistory } from 'vue-router'
import { scenes } from '@/config/scenes'
import ScreenLayout from '@/layouts/ScreenLayout.vue'
import SceneView from '@/views/SceneView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: ScreenLayout,
      redirect: '/situation',
      children: scenes.map((scene) => ({
        path: scene.path.replace(/^\//, ''),
        name: scene.key,
        component: SceneView,
        meta: {
          title: scene.title,
          group: '产业驾驶舱',
          description: scene.description,
          hints: scene.hints,
        },
      })),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/situation',
    },
  ],
})

router.afterEach((to) => {
  const title = typeof to.meta.title === 'string' ? to.meta.title : ''
  document.title = title ? `${title} · 产业驾驶舱` : '产业驾驶舱'
})

export default router
