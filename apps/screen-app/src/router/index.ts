import { createRouter, createWebHistory } from 'vue-router'
import { scenes } from '@/config/scenes'
import ScreenLayout from '@/layouts/ScreenLayout.vue'
import AlertsView from '@/views/AlertsView.vue'
import EnterprisesView from '@/views/EnterprisesView.vue'
import PolicyView from '@/views/PolicyView.vue'
import SigningView from '@/views/SigningView.vue'
import SituationView from '@/views/SituationView.vue'
import SpaceView from '@/views/SpaceView.vue'

const sceneViews = {
  situation: SituationView,
  signing: SigningView,
  enterprises: EnterprisesView,
  space: SpaceView,
  policy: PolicyView,
  alerts: AlertsView,
}

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
        component: sceneViews[scene.key as keyof typeof sceneViews],
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
