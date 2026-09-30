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
    description: '总览新增线索、在谈项目和招商推进热度。当前仅保留场景骨架。',
    hints: ['新增线索', '在谈项目', '本月拜访', '转化率'],
  },
  {
    key: 'signing',
    title: '签约看板',
    path: '/signing',
    description: '预留签约额、合同状态和履约节点的指挥视图。',
    hints: ['签约额', '新签合同', '履约正常', '逾期节点'],
  },
  {
    key: 'enterprises',
    title: '企业分布',
    path: '/enterprises',
    description: '预留产业分布与企业落点。地图不在本日范围。',
    hints: ['在园企业', '主导产业', '重点企业', '新增入驻'],
  },
  {
    key: 'space',
    title: '空间利用',
    path: '/space',
    description: '预留楼宇去化、可招商面积与空置情况。',
    hints: ['总建筑面积', '可招商', '已去化', '空置率'],
  },
  {
    key: 'policy',
    title: '政策兑现',
    path: '/policy',
    description: '预留申报量、审核通过和兑付金额的进度视图。',
    hints: ['在办申报', '审核通过', '待兑付', '已兑付'],
  },
  {
    key: 'alerts',
    title: '告警中心',
    path: '/alerts',
    description: '预留履约逾期、长期空置和异常事项的告警列表。',
    hints: ['紧急', '重要', '提示', '已关闭'],
  },
]
