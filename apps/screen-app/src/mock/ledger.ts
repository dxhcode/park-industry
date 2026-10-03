import { shortCompany } from '@/mock/format'

/** 与运营中台招商签约、企业、空间、政策样例同名。电话和金额均为虚构。 */

export interface ParkNode {
  id: string
  name: string
  shortName: string
  city: string
  x: number
  y: number
  labelX: number
  labelY: number
  anchor: 'start' | 'middle' | 'end'
  color: string
}

export interface ProjectRow {
  id: string
  name: string
  parkId: string
  enterpriseName: string
  industry: string
  stage: string
  source: string
  intentAreaSqm: number
  intentInvestment: string
  owner: string
  fromCity: string
  phone: string
}

export interface ContractRow {
  id: string
  title: string
  kind: string
  status: string
  parkId: string
  partyB: string
  amount: string
  owner: string
}

export interface LeadRow {
  id: string
  company: string
  industry: string
  source: string
  status: string
  parkId: string
  owner: string
  phone: string
}

export interface VisitRow {
  id: string
  title: string
  status: string
  parkId: string
  visitAt: string
  host: string
}

export interface PerformanceRow {
  id: string
  contractId: string
  name: string
  dueAt: string
  status: string
  metric: string
  owner: string
}

export interface EnterpriseRow {
  id: string
  name: string
  parkId: string
  industry: string
  status: string
  phone: string
  areaSqm: number
  location: string
}

export interface SpaceRow {
  id: string
  name: string
  parkId: string
  building: string
  kind: string
  status: string
  areaSqm: number
  tenant: string
}

export interface PolicyRow {
  id: string
  title: string
  policyName: string
  parkId: string
  enterpriseName: string
  status: string
  amount: string
  owner: string
}

export interface Bundle {
  projects: ProjectRow[]
  contracts: ContractRow[]
  leads: LeadRow[]
  visits: VisitRow[]
  performances: PerformanceRow[]
  enterprises: EnterpriseRow[]
  spaces: SpaceRow[]
  policies: PolicyRow[]
  pipelineOrigin: 'local' | 'seed'
  opsOrigin: 'local' | 'seed'
}

export const parks: ParkNode[] = [
  {
    id: 'park-guanggu',
    name: '光谷生命科学园',
    shortName: '光谷生命',
    city: '武汉',
    x: 198,
    y: 262,
    labelX: 176,
    labelY: 236,
    anchor: 'end',
    color: '#c4b5fd',
  },
  {
    id: 'park-binjiang',
    name: '滨江云栖科创园',
    shortName: '滨江云栖',
    city: '杭州',
    x: 512,
    y: 248,
    labelX: 512,
    labelY: 292,
    anchor: 'middle',
    color: '#38bdf8',
  },
  {
    id: 'park-lingang',
    name: '临港智造产业园',
    shortName: '临港智造',
    city: '上海',
    x: 568,
    y: 168,
    labelX: 592,
    labelY: 158,
    anchor: 'start',
    color: '#2dd4bf',
  },
]

export const projectStages = ['线索', '初洽', '尽调', '谈判', '签约', '落地', '搁置'] as const
export const projectSources = ['推介会', '渠道推荐', '主动咨询', '政府转介', '以商招商'] as const
export const contractStatuses = ['起草中', '待签署', '已生效', '履行中', '已终止'] as const
export const performanceStatuses = ['正常履约', '即将到期', '逾期', '已完成'] as const
export const enterpriseStatuses = ['在园', '重点', '待完善', '已迁出'] as const
export const spaceStatuses = ['可招商', '在租', '装修中', '空置', '已售'] as const
export const policyStatuses = ['申报中', '审核中', '待兑付', '已兑付', '退回'] as const
export const activeContractStatuses = ['已生效', '履行中']

const PIPELINE_KEY = 'park-industry.pipeline.v1'
const OPS_KEY = 'park-industry.ops.v1'

const seedProjects: ProjectRow[] = [
  { id: 'proj-xinglan-ii', name: '星澜智造二期扩产', parkId: 'park-binjiang', enterpriseName: '星澜智造科技有限公司', industry: '人工智能', stage: '谈判', source: '以商招商', intentAreaSqm: 8600, intentInvestment: '1.6 亿元', owner: '陈启明', fromCity: '杭州市', phone: '0571-86001101' },
  { id: 'proj-qinghe', name: '青禾抗体中试平台', parkId: 'park-binjiang', enterpriseName: '青禾生物医药有限公司', industry: '生物医药', stage: '尽调', source: '政府转介', intentAreaSqm: 4200, intentInvestment: '8000 万元', owner: '苏晚', fromCity: '杭州市', phone: '0571-86001102' },
  { id: 'proj-luanshu', name: '峦数数据服务中心', parkId: 'park-binjiang', enterpriseName: '峦数信息技术有限公司', industry: '软件信息', stage: '初洽', source: '主动咨询', intentAreaSqm: 1200, intentInvestment: '1500 万元', owner: '苏晚', fromCity: '杭州市', phone: '0571-86001103' },
  { id: 'proj-haiyi', name: '海弈精密减速器项目', parkId: 'park-lingang', enterpriseName: '海弈装备股份有限公司', industry: '高端装备', stage: '签约', source: '渠道推荐', intentAreaSqm: 18000, intentInvestment: '3.2 亿元', owner: '周岚', fromCity: '上海市', phone: '021-58002101' },
  { id: 'proj-yuanneng', name: '远能储能 PACK 产线', parkId: 'park-lingang', enterpriseName: '远能动力科技有限公司', industry: '新能源', stage: '落地', source: '推介会', intentAreaSqm: 9600, intentInvestment: '1.1 亿元', owner: '周岚', fromCity: '上海市', phone: '021-58002102' },
  { id: 'proj-jinfan', name: '锦帆智慧仓回流评估', parkId: 'park-lingang', enterpriseName: '锦帆物流科技有限公司', industry: '供应链', stage: '搁置', source: '渠道推荐', intentAreaSqm: 6400, intentInvestment: '4000 万元', owner: '江衡', fromCity: '苏州市', phone: '021-58002103' },
  { id: 'proj-qiming', name: '启明手术机器人组装', parkId: 'park-guanggu', enterpriseName: '启明医疗器械有限公司', industry: '医疗器械', stage: '谈判', source: '政府转介', intentAreaSqm: 7200, intentInvestment: '1.4 亿元', owner: '刘澄', fromCity: '武汉市', phone: '027-87003101' },
  { id: 'proj-baiyu', name: '白屿合成生物中试', parkId: 'park-guanggu', enterpriseName: '白屿合成生物有限公司', industry: '合成生物', stage: '初洽', source: '推介会', intentAreaSqm: 5100, intentInvestment: '6000 万元', owner: '何安', fromCity: '武汉市', phone: '027-87003102' },
  { id: 'proj-chengxin', name: '澄芯光电先进封装', parkId: 'park-binjiang', enterpriseName: '澄芯光电科技有限公司', industry: '集成电路', stage: '线索', source: '主动咨询', intentAreaSqm: 3000, intentInvestment: '9000 万元', owner: '陈启明', fromCity: '嘉兴市', phone: '0571-86001409' },
  { id: 'proj-lanwan', name: '岚湾氢能测试中心', parkId: 'park-lingang', enterpriseName: '岚湾氢能科技有限公司', industry: '新能源', stage: '尽调', source: '政府转介', intentAreaSqm: 4500, intentInvestment: '7000 万元', owner: '江衡', fromCity: '宁波市', phone: '021-58002410' },
]

const seedContracts: ContractRow[] = [
  { id: 'con-haiyi', title: '海弈精密减速器投资协议', kind: '投资协议', status: '已生效', parkId: 'park-lingang', partyB: '海弈装备股份有限公司', amount: '3.2 亿元', owner: '周岚' },
  { id: 'con-yuanneng', title: '远能储能 PACK 厂房租赁合同', kind: '租赁合同', status: '履行中', parkId: 'park-lingang', partyB: '远能动力科技有限公司', amount: '1.1 亿元', owner: '周岚' },
  { id: 'con-xinglan', title: '星澜智造二期补充协议', kind: '补充协议', status: '待签署', parkId: 'park-binjiang', partyB: '星澜智造科技有限公司', amount: '1.6 亿元', owner: '陈启明' },
  { id: 'con-qiming', title: '启明手术机器人投资协议', kind: '投资协议', status: '起草中', parkId: 'park-guanggu', partyB: '启明医疗器械有限公司', amount: '1.4 亿元', owner: '刘澄' },
  { id: 'con-qinghe', title: '青禾抗体中试租赁合同', kind: '租赁合同', status: '起草中', parkId: 'park-binjiang', partyB: '青禾生物医药有限公司', amount: '8000 万元', owner: '苏晚' },
]

const seedLeads: LeadRow[] = [
  { id: 'lead-chengxin', company: '澄芯光电科技有限公司', industry: '集成电路', source: '主动咨询', status: '已转化', parkId: 'park-binjiang', owner: '陈启明', phone: '0571-86001409' },
  { id: 'lead-lanwan', company: '岚湾氢能科技有限公司', industry: '新能源', source: '政府转介', status: '已转化', parkId: 'park-lingang', owner: '江衡', phone: '021-58002410' },
  { id: 'lead-beidou', company: '北渚机器人有限公司', industry: '高端装备', source: '推介会', status: '跟进中', parkId: 'park-guanggu', owner: '刘澄', phone: '027-87003616' },
  { id: 'lead-songlin', company: '松麟材料科技有限公司', industry: '合成生物', source: '渠道推荐', status: '新线索', parkId: 'park-binjiang', owner: '苏晚', phone: '0571-86001717' },
  { id: 'lead-huichuan', company: '汇川传感科技有限公司', industry: '人工智能', source: '以商招商', status: '跟进中', parkId: 'park-lingang', owner: '周岚', phone: '021-58002818' },
  { id: 'lead-old', company: '旧港包装制品厂', industry: '供应链', source: '主动咨询', status: '无效', parkId: 'park-lingang', owner: '江衡', phone: '021-58000909' },
]

const seedVisits: VisitRow[] = [
  { id: 'vis-haiyi', title: '海弈开工条件现场核对', status: '已完成', parkId: 'park-lingang', visitAt: '2026-09-16 14:00', host: '周岚' },
  { id: 'vis-xinglan', title: '星澜杭州总部条款沟通', status: '待纪要', parkId: 'park-binjiang', visitAt: '2026-09-28 10:30', host: '陈启明' },
  { id: 'vis-baiyu', title: '白屿中试楼二次看场', status: '待进行', parkId: 'park-guanggu', visitAt: '2026-10-09 09:30', host: '何安' },
  { id: 'vis-beidou', title: '北渚机器人武汉办公室拜访', status: '待进行', parkId: 'park-guanggu', visitAt: '2026-10-11 15:00', host: '刘澄' },
  { id: 'vis-yuanneng', title: '远能产线进场复查', status: '已完成', parkId: 'park-lingang', visitAt: '2026-09-11 09:00', host: '周岚' },
  { id: 'vis-qiming', title: '启明洁净车间方案会', status: '待纪要', parkId: 'park-guanggu', visitAt: '2026-09-29 13:30', host: '刘澄' },
]

const seedPerformances: PerformanceRow[] = [
  { id: 'pf-haiyi-start', contractId: 'con-haiyi', name: '开工', dueAt: '2026-08-31', status: '已完成', metric: '取得开工影像与基础图确认单', owner: '周岚' },
  { id: 'pf-haiyi-capital', contractId: 'con-haiyi', name: '第二期投资款到账', dueAt: '2026-10-20', status: '即将到期', metric: '到账不低于 8000 万元', owner: '周岚' },
  { id: 'pf-yuan-equip', contractId: 'con-yuanneng', name: '主要设备进场', dueAt: '2026-09-12', status: '逾期', metric: '主线设备进场并留存影像', owner: '周岚' },
  { id: 'pf-yuan-prod', contractId: 'con-yuanneng', name: '投产', dueAt: '2027-03-31', status: '正常履约', metric: '形成连续一周的量产记录', owner: '江衡' },
  { id: 'pf-xinglan-sign', contractId: 'con-xinglan', name: '补充协议签署', dueAt: '2026-10-16', status: '即将到期', metric: '双方盖章扫描件归档', owner: '陈启明' },
  { id: 'pf-qiming-term', contractId: 'con-qiming', name: '关键条款确认', dueAt: '2026-10-31', status: '正常履约', metric: '企业书面确认补贴拨付与采购比例', owner: '刘澄' },
]

const seedEnterprises: EnterpriseRow[] = [
  { id: 'ent-xinglan', name: '星澜智造科技有限公司', parkId: 'park-binjiang', industry: '人工智能', status: '重点', phone: '0571-86001101', areaSqm: 6200, location: 'A1 研发楼东侧' },
  { id: 'ent-qinghe', name: '青禾生物医药有限公司', parkId: 'park-binjiang', industry: '生物医药', status: '待完善', phone: '0571-86001102', areaSqm: 4200, location: '意向 B2 实验楼 4-5 层' },
  { id: 'ent-luanshu', name: '峦数信息技术有限公司', parkId: 'park-binjiang', industry: '软件信息', status: '待完善', phone: '0571-86001103', areaSqm: 1200, location: '意向 A1 研发楼 8 层' },
  { id: 'ent-haiyi', name: '海弈装备股份有限公司', parkId: 'park-lingang', industry: '高端装备', status: '重点', phone: '021-58002101', areaSqm: 18000, location: 'M1 智能厂房北跨' },
  { id: 'ent-yuanneng', name: '远能动力科技有限公司', parkId: 'park-lingang', industry: '新能源', status: '在园', phone: '021-58002102', areaSqm: 9600, location: 'M1 智能厂房南跨' },
  { id: 'ent-jinfan', name: '锦帆物流科技有限公司', parkId: 'park-lingang', industry: '供应链', status: '已迁出', phone: '021-58002103', areaSqm: 0, location: '原 M3 仓储，已退租' },
  { id: 'ent-qiming', name: '启明医疗器械有限公司', parkId: 'park-guanggu', industry: '医疗器械', status: '待完善', phone: '027-87003101', areaSqm: 7200, location: '意向 C1 研发中心低区' },
  { id: 'ent-baiyu', name: '白屿合成生物有限公司', parkId: 'park-guanggu', industry: '合成生物', status: '待完善', phone: '027-87003102', areaSqm: 5100, location: '意向 C2 中试楼' },
  { id: 'ent-chengxin', name: '澄芯光电科技有限公司', parkId: 'park-binjiang', industry: '集成电路', status: '待完善', phone: '0571-86001409', areaSqm: 3000, location: '意向洁净厂房，楼栋未定' },
]

const seedSpaces: SpaceRow[] = [
  { id: 'sp-a1-8', name: 'A1 研发楼 8 层', parkId: 'park-binjiang', building: 'A1 研发楼', kind: '研发楼', status: '可招商', areaSqm: 1200, tenant: '' },
  { id: 'sp-a1-east', name: 'A1 东侧扩建', parkId: 'park-binjiang', building: 'A1 研发楼', kind: '厂房', status: '装修中', areaSqm: 8600, tenant: '星澜智造科技有限公司' },
  { id: 'sp-b2', name: 'B2 实验楼 4-5 层', parkId: 'park-binjiang', building: 'B2 实验楼', kind: '中试楼', status: '可招商', areaSqm: 4200, tenant: '' },
  { id: 'sp-m1-south', name: 'M1 南跨', parkId: 'park-lingang', building: 'M1 智能厂房', kind: '厂房', status: '在租', areaSqm: 9600, tenant: '远能动力科技有限公司' },
  { id: 'sp-m1-north', name: 'M1 北跨', parkId: 'park-lingang', building: 'M1 智能厂房', kind: '厂房', status: '在租', areaSqm: 18000, tenant: '海弈装备股份有限公司' },
  { id: 'sp-m2', name: 'M2 测试舱', parkId: 'park-lingang', building: 'M2 动力站', kind: '厂房', status: '空置', areaSqm: 4500, tenant: '' },
  { id: 'sp-c1', name: 'C1 低区', parkId: 'park-guanggu', building: 'C1 研发中心', kind: '研发楼', status: '可招商', areaSqm: 7200, tenant: '' },
  { id: 'sp-c2', name: 'C2 二层', parkId: 'park-guanggu', building: 'C2 中试楼', kind: '中试楼', status: '空置', areaSqm: 5100, tenant: '' },
  { id: 'sp-apt', name: '人才公寓 A 栋', parkId: 'park-binjiang', building: '人才公寓', kind: '配套', status: '在租', areaSqm: 8600, tenant: '园区统一配租' },
]

const seedPolicies: PolicyRow[] = [
  { id: 'pol-xinglan', title: '星澜人才公寓配租', policyName: '人才公寓配租办法', parkId: 'park-binjiang', enterpriseName: '星澜智造科技有限公司', status: '审核中', amount: '40 套', owner: '陈启明' },
  { id: 'pol-haiyi', title: '海弈固定资产投资奖励', policyName: '固定资产投资奖励', parkId: 'park-lingang', enterpriseName: '海弈装备股份有限公司', status: '待兑付', amount: '960 万元', owner: '周岚' },
  { id: 'pol-yuan', title: '远能设备进场补贴', policyName: '设备进场补贴', parkId: 'park-lingang', enterpriseName: '远能动力科技有限公司', status: '退回', amount: '180 万元', owner: '周岚' },
  { id: 'pol-qiming', title: '启明装修补贴', policyName: '洁净装修补贴', parkId: 'park-guanggu', enterpriseName: '启明医疗器械有限公司', status: '申报中', amount: '待核定', owner: '刘澄' },
  { id: 'pol-qinghe', title: '青禾中试平台补助', policyName: '生物医药中试补助', parkId: 'park-binjiang', enterpriseName: '青禾生物医药有限公司', status: '审核中', amount: '220 万元', owner: '苏晚' },
  { id: 'pol-chengxin', title: '澄芯租金递减', policyName: '租金扶持', parkId: 'park-binjiang', enterpriseName: '澄芯光电科技有限公司', status: '申报中', amount: '首年九折', owner: '陈启明' },
]

function seedBundle(): Bundle {
  return {
    projects: seedProjects,
    contracts: seedContracts,
    leads: seedLeads,
    visits: seedVisits,
    performances: seedPerformances,
    enterprises: seedEnterprises,
    spaces: seedSpaces,
    policies: seedPolicies,
    pipelineOrigin: 'seed',
    opsOrigin: 'seed',
  }
}

function readSnapshot(key: string): Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null
    const row = parsed as Record<string, unknown>
    if (row.version !== 1) return null
    return row
  } catch {
    return null
  }
}

function text(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function amount(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function mapList<T>(snapshot: Record<string, unknown> | null, field: string, mapRow: (row: Record<string, unknown>) => T | null): T[] | null {
  if (!snapshot || !Array.isArray(snapshot[field])) return null
  const rows: T[] = []
  for (const item of snapshot[field]) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) continue
    const mapped = mapRow(item as Record<string, unknown>)
    if (mapped) rows.push(mapped)
  }
  return rows
}

function mapProject(row: Record<string, unknown>): ProjectRow | null {
  if (typeof row.id !== 'string') return null
  return {
    id: row.id,
    name: text(row.name, '未命名项目'),
    parkId: text(row.parkId),
    enterpriseName: text(row.enterpriseName, shortCompany(text(row.name, '未命名企业'))),
    industry: text(row.industry, '未分类'),
    stage: text(row.stage, '线索'),
    source: text(row.source, '主动咨询'),
    intentAreaSqm: amount(row.intentAreaSqm),
    intentInvestment: text(row.intentInvestment, '未填'),
    owner: text(row.owner, '未分配'),
    fromCity: text(row.fromCity, '未填城市'),
    phone: text(row.phone),
  }
}

function mapContract(row: Record<string, unknown>): ContractRow | null {
  if (typeof row.id !== 'string') return null
  return {
    id: row.id,
    title: text(row.title, '未命名合同'),
    kind: text(row.kind, '投资协议'),
    status: text(row.status, '起草中'),
    parkId: text(row.parkId),
    partyB: text(row.partyB, '未填乙方'),
    amount: text(row.amount, '未填'),
    owner: text(row.owner, '未分配'),
  }
}

function mapLead(row: Record<string, unknown>): LeadRow | null {
  if (typeof row.id !== 'string') return null
  return {
    id: row.id,
    company: text(row.company, '未命名企业'),
    industry: text(row.industry, '未分类'),
    source: text(row.source, '主动咨询'),
    status: text(row.status, '新线索'),
    parkId: text(row.parkId),
    owner: text(row.owner, '未分配'),
    phone: text(row.phone),
  }
}

function mapVisit(row: Record<string, unknown>): VisitRow | null {
  if (typeof row.id !== 'string') return null
  return {
    id: row.id,
    title: text(row.title, '未命名拜访'),
    status: text(row.status, '待进行'),
    parkId: text(row.parkId),
    visitAt: text(row.visitAt),
    host: text(row.host, '未分配'),
  }
}

function mapPerformance(row: Record<string, unknown>): PerformanceRow | null {
  if (typeof row.id !== 'string' || typeof row.contractId !== 'string') return null
  return {
    id: row.id,
    contractId: row.contractId,
    name: text(row.name, '未命名节点'),
    dueAt: text(row.dueAt),
    status: text(row.status, '正常履约'),
    metric: text(row.metric),
    owner: text(row.owner, '未分配'),
  }
}

function mapEnterprise(row: Record<string, unknown>): EnterpriseRow | null {
  if (typeof row.id !== 'string') return null
  return {
    id: row.id,
    name: text(row.name, '未命名企业'),
    parkId: text(row.parkId),
    industry: text(row.industry, '未分类'),
    status: text(row.status, '待完善'),
    phone: text(row.phone),
    areaSqm: amount(row.areaSqm),
    location: text(row.location),
  }
}

function mapSpace(row: Record<string, unknown>): SpaceRow | null {
  if (typeof row.id !== 'string') return null
  return {
    id: row.id,
    name: text(row.name, '未命名空间'),
    parkId: text(row.parkId),
    building: text(row.building),
    kind: text(row.kind, '厂房'),
    status: text(row.status, '可招商'),
    areaSqm: amount(row.areaSqm),
    tenant: text(row.tenant),
  }
}

function mapPolicy(row: Record<string, unknown>): PolicyRow | null {
  if (typeof row.id !== 'string') return null
  return {
    id: row.id,
    title: text(row.title, '未命名申报'),
    policyName: text(row.policyName),
    parkId: text(row.parkId),
    enterpriseName: text(row.enterpriseName, '未填企业'),
    status: text(row.status, '申报中'),
    amount: text(row.amount, '未填'),
    owner: text(row.owner, '未分配'),
  }
}

export function parkById(id: string): ParkNode | undefined {
  return parks.find((item) => item.id === id)
}

export function parkShort(id: string): string {
  return parkById(id)?.shortName ?? '未分配'
}

export function loadBundle(): Bundle {
  const base = seedBundle()
  const pipeline = readSnapshot(PIPELINE_KEY)
  const ops = readSnapshot(OPS_KEY)
  const projects = mapList(pipeline, 'projects', mapProject)
  const contracts = mapList(pipeline, 'contracts', mapContract)
  const leads = mapList(pipeline, 'leads', mapLead)
  const visits = mapList(pipeline, 'visits', mapVisit)
  const performances = mapList(pipeline, 'performances', mapPerformance)
  const enterprises = mapList(ops, 'enterprises', mapEnterprise)
  const spaces = mapList(ops, 'spaces', mapSpace)
  const policies = mapList(ops, 'policies', mapPolicy)
  const pipelineReady = projects && contracts && leads && visits && performances
  const opsReady = enterprises && spaces && policies
  return {
    projects: pipelineReady ? projects : base.projects,
    contracts: pipelineReady ? contracts : base.contracts,
    leads: pipelineReady ? leads : base.leads,
    visits: pipelineReady ? visits : base.visits,
    performances: pipelineReady ? performances : base.performances,
    enterprises: opsReady ? enterprises : base.enterprises,
    spaces: opsReady ? spaces : base.spaces,
    policies: opsReady ? policies : base.policies,
    pipelineOrigin: pipelineReady ? 'local' : 'seed',
    opsOrigin: opsReady ? 'local' : 'seed',
  }
}

export function originLabel(bundle: Bundle): string {
  if (bundle.pipelineOrigin === 'local' && bundle.opsOrigin === 'local') return '数字来自本机台账'
  if (bundle.pipelineOrigin === 'local') return '招商数字来自本机台账'
  if (bundle.opsOrigin === 'local') return '空间与政策来自本机台账'
  return '数字与招商签约示例一致'
}

export { OPS_KEY, PIPELINE_KEY }
