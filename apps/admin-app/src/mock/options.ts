import { parks } from '@/mock/parks'
import type { ContractKind, ContractStatus, LeadStatus, PerformanceStatus, ProjectSource, ProjectStage, VisitKind, VisitStatus } from '@/mock/types'

export const projectStages: ProjectStage[] = ['线索', '初洽', '尽调', '谈判', '签约', '落地', '搁置']
export const projectSources: ProjectSource[] = ['推介会', '渠道推荐', '主动咨询', '政府转介', '以商招商']
export const industries = ['人工智能', '生物医药', '软件信息', '集成电路', '高端装备', '新能源', '供应链', '医疗器械', '合成生物']
export const contractKinds: ContractKind[] = ['投资协议', '租赁合同', '补充协议']
export const contractStatuses: ContractStatus[] = ['起草中', '待签署', '已生效', '履行中', '已终止']
export const leadStatuses: LeadStatus[] = ['新线索', '跟进中', '已转化', '无效']
export const visitKinds: VisitKind[] = ['来园接待', '外出拜访']
export const visitStatuses: VisitStatus[] = ['待进行', '待纪要', '已完成']
export const performanceStatuses: PerformanceStatus[] = ['正常履约', '即将到期', '逾期', '已完成']

export function toOptions(values: readonly string[], allLabel?: string) {
  const options = values.map((value) => ({ label: value, value }))
  if (!allLabel) return options
  return [{ label: allLabel, value: '' }, ...options]
}

export const parkOptions = parks.map((item) => ({ label: item.name, value: item.id }))
export const parkFilterOptions = [{ label: '全部园区', value: '' }, ...parkOptions]
