import { createRouter, createWebHistory } from 'vue-router'
import { adminMenus, flattenMenus, type FlatPage } from '@/config/menus'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { useAuthStore } from '@/stores/auth'
import PlaceholderView from '@/views/PlaceholderView.vue'
import LeadDetailView from '@/views/investment/LeadDetailView.vue'
import LeadFormView from '@/views/investment/LeadFormView.vue'
import LeadListView from '@/views/investment/LeadListView.vue'
import ProjectDetailView from '@/views/investment/ProjectDetailView.vue'
import ProjectFormView from '@/views/investment/ProjectFormView.vue'
import ProjectListView from '@/views/investment/ProjectListView.vue'
import VisitDetailView from '@/views/investment/VisitDetailView.vue'
import VisitFormView from '@/views/investment/VisitFormView.vue'
import VisitListView from '@/views/investment/VisitListView.vue'
import LoginView from '@/views/login/LoginView.vue'
import ContractDetailView from '@/views/signing/ContractDetailView.vue'
import ContractFormView from '@/views/signing/ContractFormView.vue'
import ContractListView from '@/views/signing/ContractListView.vue'
import PerformanceDetailView from '@/views/signing/PerformanceDetailView.vue'
import PerformanceFormView from '@/views/signing/PerformanceFormView.vue'
import PerformanceListView from '@/views/signing/PerformanceListView.vue'

const mainline = new Set([
  '/investment/projects',
  '/investment/leads',
  '/investment/visits',
  '/signing/contracts',
  '/signing/performance',
])

const pages = flattenMenus(adminMenus)

function metaOf(path: string) {
  const page = pages.find((item) => item.path === path)
  return {
    title: page?.title ?? '',
    group: page?.group ?? '',
    description: page?.description ?? '',
    hints: page?.hints ?? [],
  }
}

function placeholderRoute(page: FlatPage) {
  return {
    path: page.path.replace(/^\//, ''),
    name: page.key,
    component: PlaceholderView,
    meta: metaOf(page.path),
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { public: true, title: '登录' },
    },
    {
      path: '/',
      component: AdminLayout,
      redirect: '/workbench',
      children: [
        ...pages.filter((page) => !mainline.has(page.path)).map(placeholderRoute),
        { path: 'investment/projects', name: 'investment-projects', component: ProjectListView, meta: metaOf('/investment/projects') },
        { path: 'investment/projects/new', name: 'investment-projects-new', component: ProjectFormView, meta: { title: '新建招商项目', group: '产业招商' } },
        { path: 'investment/projects/:id', name: 'investment-projects-detail', component: ProjectDetailView, meta: { title: '项目详情', group: '产业招商' } },
        { path: 'investment/projects/:id/edit', name: 'investment-projects-edit', component: ProjectFormView, meta: { title: '编辑招商项目', group: '产业招商' } },
        { path: 'investment/leads', name: 'investment-leads', component: LeadListView, meta: metaOf('/investment/leads') },
        { path: 'investment/leads/new', name: 'investment-leads-new', component: LeadFormView, meta: { title: '登记线索', group: '产业招商' } },
        { path: 'investment/leads/:id', name: 'investment-leads-detail', component: LeadDetailView, meta: { title: '线索详情', group: '产业招商' } },
        { path: 'investment/leads/:id/edit', name: 'investment-leads-edit', component: LeadFormView, meta: { title: '编辑线索', group: '产业招商' } },
        { path: 'investment/visits', name: 'investment-visits', component: VisitListView, meta: metaOf('/investment/visits') },
        { path: 'investment/visits/new', name: 'investment-visits-new', component: VisitFormView, meta: { title: '登记拜访', group: '产业招商' } },
        { path: 'investment/visits/:id', name: 'investment-visits-detail', component: VisitDetailView, meta: { title: '拜访详情', group: '产业招商' } },
        { path: 'investment/visits/:id/edit', name: 'investment-visits-edit', component: VisitFormView, meta: { title: '编辑拜访', group: '产业招商' } },
        { path: 'signing/contracts', name: 'signing-contracts', component: ContractListView, meta: metaOf('/signing/contracts') },
        { path: 'signing/contracts/new', name: 'signing-contracts-new', component: ContractFormView, meta: { title: '新建签约合同', group: '签约管理' } },
        { path: 'signing/contracts/:id', name: 'signing-contracts-detail', component: ContractDetailView, meta: { title: '合同详情', group: '签约管理' } },
        { path: 'signing/contracts/:id/edit', name: 'signing-contracts-edit', component: ContractFormView, meta: { title: '编辑签约合同', group: '签约管理' } },
        { path: 'signing/performance', name: 'signing-performance', component: PerformanceListView, meta: metaOf('/signing/performance') },
        { path: 'signing/performance/new', name: 'signing-performance-new', component: PerformanceFormView, meta: { title: '登记履约节点', group: '签约管理' } },
        { path: 'signing/performance/:id', name: 'signing-performance-detail', component: PerformanceDetailView, meta: { title: '履约详情', group: '签约管理' } },
        { path: 'signing/performance/:id/edit', name: 'signing-performance-edit', component: PerformanceFormView, meta: { title: '编辑履约节点', group: '签约管理' } },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/workbench',
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.public) {
    if (to.path === '/login' && auth.isLoggedIn) return { path: '/workbench' }
    return true
  }
  if (!auth.isLoggedIn) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  return true
})

router.afterEach((to) => {
  const title = typeof to.meta.title === 'string' ? to.meta.title : ''
  document.title = title ? `${title} · 产业运营平台` : '产业运营平台'
})

export default router
