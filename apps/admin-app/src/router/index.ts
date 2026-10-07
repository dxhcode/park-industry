import { createRouter, createWebHistory } from 'vue-router'
import { adminMenus, flattenMenus } from '@/config/menus'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { useAuthStore } from '@/stores/auth'
import AnalyticsDetailView from '@/views/analytics/AnalyticsDetailView.vue'
import AnalyticsFormView from '@/views/analytics/AnalyticsFormView.vue'
import AnalyticsListView from '@/views/analytics/AnalyticsListView.vue'
import EnterpriseDetailView from '@/views/enterprises/EnterpriseDetailView.vue'
import EnterpriseFormView from '@/views/enterprises/EnterpriseFormView.vue'
import EnterpriseListView from '@/views/enterprises/EnterpriseListView.vue'
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
import PolicyDetailView from '@/views/policy/PolicyDetailView.vue'
import PolicyFormView from '@/views/policy/PolicyFormView.vue'
import PolicyListView from '@/views/policy/PolicyListView.vue'
import PromotionDetailView from '@/views/promotion/PromotionDetailView.vue'
import PromotionFormView from '@/views/promotion/PromotionFormView.vue'
import PromotionListView from '@/views/promotion/PromotionListView.vue'
import DictDetailView from '@/views/settings/DictDetailView.vue'
import DictFormView from '@/views/settings/DictFormView.vue'
import DictListView from '@/views/settings/DictListView.vue'
import OrgDetailView from '@/views/settings/OrgDetailView.vue'
import OrgFormView from '@/views/settings/OrgFormView.vue'
import OrgListView from '@/views/settings/OrgListView.vue'
import RoleDetailView from '@/views/settings/RoleDetailView.vue'
import RoleFormView from '@/views/settings/RoleFormView.vue'
import RoleListView from '@/views/settings/RoleListView.vue'
import ContractDetailView from '@/views/signing/ContractDetailView.vue'
import ContractFormView from '@/views/signing/ContractFormView.vue'
import ContractListView from '@/views/signing/ContractListView.vue'
import PerformanceDetailView from '@/views/signing/PerformanceDetailView.vue'
import PerformanceFormView from '@/views/signing/PerformanceFormView.vue'
import PerformanceListView from '@/views/signing/PerformanceListView.vue'
import SpaceDetailView from '@/views/space/SpaceDetailView.vue'
import SpaceFormView from '@/views/space/SpaceFormView.vue'
import SpaceListView from '@/views/space/SpaceListView.vue'
import TaskDetailView from '@/views/workbench/TaskDetailView.vue'
import TaskFormView from '@/views/workbench/TaskFormView.vue'
import WorkbenchView from '@/views/workbench/WorkbenchView.vue'

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
        { path: 'workbench', name: 'workbench', component: WorkbenchView, meta: metaOf('/workbench') },
        { path: 'workbench/tasks/new', name: 'workbench-tasks-new', component: TaskFormView, meta: { title: '新建待办', group: '工作台' } },
        { path: 'workbench/tasks/:id/edit', name: 'workbench-tasks-edit', component: TaskFormView, meta: { title: '编辑待办', group: '工作台' } },
        { path: 'workbench/tasks/:id', name: 'workbench-tasks-detail', component: TaskDetailView, meta: { title: '待办详情', group: '工作台' } },
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
        { path: 'enterprises', name: 'enterprises', component: EnterpriseListView, meta: metaOf('/enterprises') },
        { path: 'enterprises/new', name: 'enterprises-new', component: EnterpriseFormView, meta: { title: '新建企业档案', group: '企业档案' } },
        { path: 'enterprises/:id/edit', name: 'enterprises-edit', component: EnterpriseFormView, meta: { title: '编辑企业档案', group: '企业档案' } },
        { path: 'enterprises/:id', name: 'enterprises-detail', component: EnterpriseDetailView, meta: { title: '企业详情', group: '企业档案' } },
        { path: 'space', name: 'space', component: SpaceListView, meta: metaOf('/space') },
        { path: 'space/new', name: 'space-new', component: SpaceFormView, meta: { title: '新建空间资源', group: '产业空间' } },
        { path: 'space/:id/edit', name: 'space-edit', component: SpaceFormView, meta: { title: '编辑空间资源', group: '产业空间' } },
        { path: 'space/:id', name: 'space-detail', component: SpaceDetailView, meta: { title: '空间详情', group: '产业空间' } },
        { path: 'policy', name: 'policy', component: PolicyListView, meta: metaOf('/policy') },
        { path: 'policy/new', name: 'policy-new', component: PolicyFormView, meta: { title: '新建政策申报', group: '政策兑现' } },
        { path: 'policy/:id/edit', name: 'policy-edit', component: PolicyFormView, meta: { title: '编辑政策申报', group: '政策兑现' } },
        { path: 'policy/:id', name: 'policy-detail', component: PolicyDetailView, meta: { title: '申报详情', group: '政策兑现' } },
        { path: 'promotion', name: 'promotion', component: PromotionListView, meta: metaOf('/promotion') },
        { path: 'promotion/new', name: 'promotion-new', component: PromotionFormView, meta: { title: '新建促进活动', group: '投资促进' } },
        { path: 'promotion/:id/edit', name: 'promotion-edit', component: PromotionFormView, meta: { title: '编辑促进活动', group: '投资促进' } },
        { path: 'promotion/:id', name: 'promotion-detail', component: PromotionDetailView, meta: { title: '活动详情', group: '投资促进' } },
        { path: 'analytics', name: 'analytics', component: AnalyticsListView, meta: metaOf('/analytics') },
        { path: 'analytics/new', name: 'analytics-new', component: AnalyticsFormView, meta: { title: '新建阶段快报', group: '数据分析' } },
        { path: 'analytics/:id/edit', name: 'analytics-edit', component: AnalyticsFormView, meta: { title: '编辑阶段快报', group: '数据分析' } },
        { path: 'analytics/:id', name: 'analytics-detail', component: AnalyticsDetailView, meta: { title: '快报详情', group: '数据分析' } },
        { path: 'settings', redirect: '/settings/orgs' },
        { path: 'settings/orgs', name: 'settings-orgs', component: OrgListView, meta: { title: '组织架构', group: '系统设置' } },
        { path: 'settings/orgs/new', name: 'settings-orgs-new', component: OrgFormView, meta: { title: '新建组织', group: '系统设置' } },
        { path: 'settings/orgs/:id/edit', name: 'settings-orgs-edit', component: OrgFormView, meta: { title: '编辑组织', group: '系统设置' } },
        { path: 'settings/orgs/:id', name: 'settings-orgs-detail', component: OrgDetailView, meta: { title: '组织详情', group: '系统设置' } },
        { path: 'settings/dicts', name: 'settings-dicts', component: DictListView, meta: { title: '数据字典', group: '系统设置' } },
        { path: 'settings/dicts/new', name: 'settings-dicts-new', component: DictFormView, meta: { title: '新建字典', group: '系统设置' } },
        { path: 'settings/dicts/:id/edit', name: 'settings-dicts-edit', component: DictFormView, meta: { title: '编辑字典', group: '系统设置' } },
        { path: 'settings/dicts/:id', name: 'settings-dicts-detail', component: DictDetailView, meta: { title: '字典详情', group: '系统设置' } },
        { path: 'settings/roles', name: 'settings-roles', component: RoleListView, meta: { title: '角色权限', group: '系统设置' } },
        { path: 'settings/roles/new', name: 'settings-roles-new', component: RoleFormView, meta: { title: '新建角色权限', group: '系统设置' } },
        { path: 'settings/roles/:id/edit', name: 'settings-roles-edit', component: RoleFormView, meta: { title: '编辑角色权限', group: '系统设置' } },
        { path: 'settings/roles/:id', name: 'settings-roles-detail', component: RoleDetailView, meta: { title: '权限详情', group: '系统设置' } },
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
