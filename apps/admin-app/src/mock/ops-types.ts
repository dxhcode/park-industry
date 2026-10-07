export type TaskKind = '线索跟进' | '拜访安排' | '合同审阅' | '空间巡检' | '政策审核'
export type TaskStatus = '待处理' | '进行中' | '已完成'
export type EnterpriseStatus = '在园' | '重点' | '待完善' | '已迁出'
export type SpaceKind = '研发楼' | '厂房' | '中试楼' | '配套'
export type SpaceStatus = '可招商' | '在租' | '已售' | '装修中' | '空置'
export type PolicyStatus = '申报中' | '审核中' | '待兑付' | '已兑付' | '退回'
export type EventKind = '推介会' | '来园考察' | '渠道沙龙' | '外出招商'
export type EventStatus = '筹备中' | '待接待' | '进行中' | '已结束'
export type ReportStatus = '草稿' | '已发布'
export type OrgKind = '园区' | '部门' | '岗位'
export type DictState = '启用' | '停用'
export type RoleName = '园区管理员' | '招商经理' | '签约专员' | '企业服务' | '空间运营'
export type RoleScope = '全部功能' | '招商与企业' | '签约与政策' | '空间与促进' | '只读查阅'
export type RoleState = '启用' | '停用'

export interface WorkTask {
  id: string
  code: string
  title: string
  kind: TaskKind
  status: TaskStatus
  parkId: string
  owner: string
  dueAt: string
  relatedLabel: string
  relatedPath: string
  note: string
}

export interface Enterprise {
  id: string
  code: string
  name: string
  parkId: string
  industry: string
  status: EnterpriseStatus
  contact: string
  phone: string
  areaSqm: number
  settledAt: string
  location: string
  intro: string
}

export interface SpaceUnit {
  id: string
  code: string
  name: string
  parkId: string
  building: string
  floor: string
  kind: SpaceKind
  status: SpaceStatus
  areaSqm: number
  rent: string
  tenant: string
  note: string
}

export interface PolicyClaim {
  id: string
  code: string
  title: string
  policyName: string
  parkId: string
  enterpriseName: string
  status: PolicyStatus
  amount: string
  owner: string
  submittedAt: string
  note: string
}

export interface PromotionEvent {
  id: string
  code: string
  title: string
  kind: EventKind
  status: EventStatus
  parkId: string
  heldAt: string
  place: string
  host: string
  guests: string
  channel: string
  note: string
}

export interface OpsReport {
  id: string
  code: string
  title: string
  period: string
  parkId: string
  status: ReportStatus
  metric: string
  valueText: string
  owner: string
  publishedAt: string
  summary: string
}

export interface OrgUnit {
  id: string
  code: string
  name: string
  kind: OrgKind
  parkId: string
  parentName: string
  leader: string
  note: string
}

export interface DictEntry {
  id: string
  code: string
  category: string
  label: string
  value: string
  state: DictState
  note: string
}

export interface RoleGrant {
  id: string
  code: string
  person: string
  role: RoleName
  username: string
  parkId: string
  state: RoleState
  scope: RoleScope
  note: string
}

export type WorkTaskDraft = Omit<WorkTask, 'id' | 'code'>
export type EnterpriseDraft = Omit<Enterprise, 'id' | 'code'>
export type SpaceDraft = Omit<SpaceUnit, 'id' | 'code'>
export type PolicyDraft = Omit<PolicyClaim, 'id' | 'code'>
export type EventDraft = Omit<PromotionEvent, 'id' | 'code'>
export type ReportDraft = Omit<OpsReport, 'id' | 'code'>
export type OrgDraft = Omit<OrgUnit, 'id' | 'code'>
export type DictDraft = Omit<DictEntry, 'id' | 'code'>
export type RoleDraft = Omit<RoleGrant, 'id' | 'code'>
