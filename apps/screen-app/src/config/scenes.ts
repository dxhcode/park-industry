export interface ScenePage {
  key: string
  title: string
  path: string
  description: string
  hints: string[]
}

export const scenes: ScenePage[] = [
  {
    key: 'situation',
    title: '招商态势',
    path: '/situation',
    description: '三园线索、在谈项目和来源城市。',
    hints: ['待跟进线索', '在谈项目', '待进行拜访', '线索转化率'],
  },
  {
    key: 'signing',
    title: '签约看板',
    path: '/signing',
    description: '已生效金额、合同状态和履约节点。',
    hints: ['签约额', '待签署', '起草中', '逾期节点'],
  },
  {
    key: 'enterprises',
    title: '企业分布',
    path: '/enterprises',
    description: '在园、重点和意向企业的产业与落点。',
    hints: ['在园企业', '重点企业', '待完善', '已迁出'],
  },
  {
    key: 'space',
    title: '空间利用',
    path: '/space',
    description: '可招商、在租、装修和空置面积。',
    hints: ['产业空置', '可招商', '在租', '空置资源'],
  },
  {
    key: 'policy',
    title: '政策兑现',
    path: '/policy',
    description: '申报、审核、待兑付和退回。',
    hints: ['申报中', '审核中', '待兑付', '退回'],
  },
  {
    key: 'alerts',
    title: '告警中心',
    path: '/alerts',
    description: '履约逾期、空置空间、退回申报和待签署。',
    hints: ['紧急', '重要', '提示', '告警条数'],
  },
]
