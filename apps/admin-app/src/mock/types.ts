export type ProjectStage = '线索' | '初洽' | '尽调' | '谈判' | '签约' | '落地' | '搁置'
export type ProjectSource = '推介会' | '渠道推荐' | '主动咨询' | '政府转介' | '以商招商'
export type ContractKind = '投资协议' | '租赁合同' | '补充协议'
export type ContractStatus = '起草中' | '待签署' | '已生效' | '履行中' | '已终止'
export type LeadStatus = '新线索' | '跟进中' | '已转化' | '无效'
export type VisitKind = '来园接待' | '外出拜访'
export type VisitStatus = '待进行' | '待纪要' | '已完成'
export type PerformanceStatus = '正常履约' | '即将到期' | '逾期' | '已完成'

export interface ParkRef {
  id: string
  name: string
  shortName: string
  city: string
  partyName: string
}

export interface InvestmentProject {
  id: string
  code: string
  name: string
  parkId: string
  enterpriseName: string
  industry: string
  stage: ProjectStage
  source: ProjectSource
  intentAreaSqm: number
  intentInvestment: string
  owner: string
  contact: string
  phone: string
  fromCity: string
  expectedSignAt: string
  updatedAt: string
  summary: string
  nextAction: string
}

export interface SigningContract {
  id: string
  code: string
  title: string
  kind: ContractKind
  status: ContractStatus
  projectId: string
  parkId: string
  partyA: string
  partyB: string
  amount: string
  areaSqm: number
  termYears: number
  signedAt: string
  effectiveAt: string
  expireAt: string
  owner: string
  clauses: string
  updatedAt: string
}

export interface Lead {
  id: string
  code: string
  company: string
  industry: string
  source: ProjectSource
  status: LeadStatus
  parkId: string
  projectId: string
  owner: string
  contact: string
  phone: string
  createdAt: string
  note: string
}

export interface Visit {
  id: string
  code: string
  title: string
  kind: VisitKind
  status: VisitStatus
  parkId: string
  projectId: string
  leadId: string
  visitAt: string
  host: string
  guests: string
  summary: string
  nextAction: string
}

export interface PerformanceNode {
  id: string
  code: string
  contractId: string
  name: string
  dueAt: string
  status: PerformanceStatus
  metric: string
  owner: string
  note: string
}
