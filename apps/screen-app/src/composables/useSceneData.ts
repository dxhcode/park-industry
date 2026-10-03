import { computed, reactive } from 'vue'
import { activeContractStatuses, contractStatuses, enterpriseStatuses, parkShort, parks, performanceStatuses, policyStatuses, projectSources, projectStages, spaceStatuses, type PerformanceRow, type PolicyRow } from '@/mock/ledger'
import { countBars, formatArea, formatYi, parseWan, parseYi, shortCompany, tone, type BarItem } from '@/mock/format'
import { useCockpitStore } from '@/stores/cockpit'
import { useLedgerStore } from '@/stores/ledger'

export interface ListRow {
  id: string
  title: string
  meta: string
  value: string
  tone?: string
}

export interface MapNode {
  id: string
  shortName: string
  city: string
  x: number
  y: number
  labelX: number
  labelY: number
  anchor: 'start' | 'middle' | 'end'
  color: string
  projects: number
  signed: string
  selected: boolean
  dimmed: boolean
}

export interface StackRow {
  id: string
  label: string
  segments: { label: string; value: number; color: string }[]
}

export interface AlertItem {
  id: string
  level: '紧急' | '重要' | '提示'
  title: string
  detail: string
  park: string
}

const talkingStages = new Set(['初洽', '尽调', '谈判'])

function inPark<T extends { parkId: string }>(rows: readonly T[], parkId: string): T[] {
  if (parkId === 'all') return [...rows]
  return rows.filter((row) => row.parkId === parkId)
}

function sumYi(texts: string[]): number {
  return texts.reduce((sum, text) => sum + (parseYi(text) ?? 0), 0)
}

export function useSceneData() {
  const cockpit = useCockpitStore()
  const ledger = useLedgerStore()
  const parkId = computed(() => cockpit.parkId)

  const projects = computed(() => inPark(ledger.projects, parkId.value))
  const leads = computed(() => inPark(ledger.leads, parkId.value))
  const visits = computed(() => inPark(ledger.visits, parkId.value))
  const contracts = computed(() => inPark(ledger.contracts, parkId.value))
  const enterprises = computed(() => inPark(ledger.enterprises, parkId.value))
  const spaces = computed(() => inPark(ledger.spaces, parkId.value))
  const policies = computed(() => inPark(ledger.policies, parkId.value))

  const contractMap = computed(() => new Map(contracts.value.map((item) => [item.id, item])))
  const performances = computed(() =>
    ledger.performances.flatMap((item) => {
      const contract = contractMap.value.get(item.contractId)
      if (!contract) return []
      return [{ ...item, contract, parkId: contract.parkId }]
    }),
  )

  const openLeads = computed(() => leads.value.filter((item) => item.status === '新线索' || item.status === '跟进中').length)
  const talking = computed(() => projects.value.filter((item) => talkingStages.has(item.stage)).length)
  const upcomingVisits = computed(() => visits.value.filter((item) => item.status === '待进行').length)
  const conversionText = computed(() => {
    const valid = leads.value.filter((item) => item.status !== '无效')
    if (!valid.length) return '暂无'
    const converted = valid.filter((item) => item.status === '已转化').length
    return `${Math.round((converted / valid.length) * 100)}%`
  })

  const signedYi = computed(() => sumYi(contracts.value.filter((item) => activeContractStatuses.includes(item.status)).map((item) => item.amount)))
  const intentYi = computed(() => sumYi(projects.value.filter((item) => item.stage !== '搁置').map((item) => item.intentInvestment)))
  const signedText = computed(() => formatYi(signedYi.value))
  const intentText = computed(() => formatYi(intentYi.value))

  const stageBars = computed(() => countBars(projectStages, projects.value, 'stage'))
  const sourceBars = computed(() => countBars(projectSources, projects.value, 'source', true))
  const cityBars = computed(() => {
    const cities = [...new Set(projects.value.map((item) => item.fromCity || '未填城市'))]
    return cities
      .map((label) => ({
        label: label.replace(/市$/, ''),
        value: projects.value.filter((item) => item.fromCity === label).length,
        color: '#38bdf8',
      }))
      .sort((a, b) => b.value - a.value)
  })

  const mapNodes = computed<MapNode[]>(() =>
    parks.map((park) => {
      const mine = ledger.projects.filter((item) => item.parkId === park.id && item.stage !== '搁置')
      const signed = sumYi(
        ledger.contracts.filter((item) => item.parkId === park.id && activeContractStatuses.includes(item.status)).map((item) => item.amount),
      )
      return {
        id: park.id,
        shortName: park.shortName,
        city: park.city,
        x: park.x,
        y: park.y,
        labelX: park.labelX,
        labelY: park.labelY,
        anchor: park.anchor,
        color: park.color,
        projects: mine.length,
        signed: formatYi(signed),
        selected: parkId.value === park.id,
        dimmed: parkId.value !== 'all' && parkId.value !== park.id,
      }
    }),
  )

  const projectRows = computed<ListRow[]>(() => projects.value.map((item) => ({
    id: item.id,
    title: item.name,
    meta: `${parkShort(item.parkId)} · ${item.industry} · ${item.owner}`,
    value: item.stage,
    tone: item.stage,
  })))

  const contractBars = computed(() => countBars(contractStatuses, contracts.value, 'status'))
  const contractRows = computed<ListRow[]>(() => contracts.value.map((item) => ({
    id: item.id,
    title: item.title,
    meta: `${shortCompany(item.partyB)} · ${item.kind} · ${item.owner}`,
    value: item.amount,
    tone: item.status,
  })))
  const pendingContracts = computed(() => contracts.value.filter((item) => item.status === '待签署').length)
  const draftingContracts = computed(() => contracts.value.filter((item) => item.status === '起草中').length)
  const performanceBars = computed(() => countBars(performanceStatuses, performances.value, 'status'))
  const lateNodes = computed(() => performances.value.filter((item) => item.status === '逾期').length)

  const industryBars = computed(() => {
    const labels = [...new Set(enterprises.value.map((item) => item.industry))]
    return countBars(labels, enterprises.value, 'industry', true)
  })
  const enterpriseRows = computed<ListRow[]>(() => enterprises.value.map((item) => ({
    id: item.id,
    title: item.name,
    meta: `${parkShort(item.parkId)} · ${item.location || item.industry} · ${item.phone || '无电话'}`,
    value: item.status,
    tone: item.status,
  })))
  const enterpriseIn = computed(() => enterprises.value.filter((item) => item.status === '在园' || item.status === '重点').length)
  const enterpriseKey = computed(() => enterprises.value.filter((item) => item.status === '重点').length)
  const enterpriseTodo = computed(() => enterprises.value.filter((item) => item.status === '待完善').length)
  const enterpriseOut = computed(() => enterprises.value.filter((item) => item.status === '已迁出').length)
  const enterpriseStatusBars = computed(() => countBars(enterpriseStatuses, enterprises.value, 'status'))

  const industrialSpaces = computed(() => spaces.value.filter((item) => item.kind !== '配套'))
  const vacantArea = computed(() => industrialSpaces.value.filter((item) => item.status === '空置').reduce((sum, item) => sum + item.areaSqm, 0))
  const openArea = computed(() => industrialSpaces.value.filter((item) => item.status === '可招商' || item.status === '空置').reduce((sum, item) => sum + item.areaSqm, 0))
  const leasedCount = computed(() => spaces.value.filter((item) => item.status === '在租').length)
  const vacantCount = computed(() => industrialSpaces.value.filter((item) => item.status === '空置').length)
  const spaceBars = computed(() => countBars(spaceStatuses, industrialSpaces.value, 'status'))
  const spaceRows = computed<ListRow[]>(() => spaces.value.map((item) => ({
    id: item.id,
    title: item.name,
    meta: `${parkShort(item.parkId)} · ${item.building} · ${item.tenant || '未入住'}`,
    value: item.kind === '配套' ? '配套' : formatArea(item.areaSqm),
    tone: item.status,
  })))
  const parkStacks = computed<StackRow[]>(() => {
    const scope = parkId.value === 'all' ? parks : parks.filter((item) => item.id === parkId.value)
    return scope.map((park) => ({
      id: park.id,
      label: park.shortName,
      segments: spaceStatuses.map((label) => ({
        label,
        value: industrialSpaces.value.filter((item) => item.parkId === park.id && item.status === label).reduce((sum, item) => sum + item.areaSqm, 0),
        color: tone(label),
      })),
    }))
  })

  const policyBars = computed(() => countBars(policyStatuses, policies.value, 'status'))
  const policyMoney = computed<BarItem[]>(() =>
    policies.value.flatMap((item) => {
      const wan = parseWan(item.amount)
      if (wan === null) return []
      return [{ label: shortCompany(item.enterpriseName), value: wan, color: tone(item.status), text: `${wan} 万` }]
    }),
  )
  const policyRows = computed<ListRow[]>(() => policies.value.map((item) => ({
    id: item.id,
    title: item.title,
    meta: `${shortCompany(item.enterpriseName)} · ${item.policyName} · ${item.owner}`,
    value: item.amount,
    tone: item.status,
  })))
  const policyApplying = computed(() => policies.value.filter((item) => item.status === '申报中').length)
  const policyReview = computed(() => policies.value.filter((item) => item.status === '审核中').length)
  const policyPay = computed(() => policies.value.filter((item) => item.status === '待兑付').length)
  const policyBack = computed(() => policies.value.filter((item) => item.status === '退回').length)

  const alerts = computed<AlertItem[]>(() => {
    const items: AlertItem[] = []
    for (const node of performances.value) items.push(...performanceAlert(node))
    for (const space of industrialSpaces.value) {
      if (space.status !== '空置') continue
      items.push({
        id: space.id,
        level: '重要',
        title: `${space.name}空置`,
        detail: `${formatArea(space.areaSqm)} · ${space.building}`,
        park: parkShort(space.parkId),
      })
    }
    for (const policy of policies.value) {
      if (policy.status !== '退回') continue
      items.push(policyAlert(policy))
    }
    for (const contract of contracts.value) {
      if (contract.status !== '待签署') continue
      items.push({
        id: contract.id,
        level: '提示',
        title: contract.title,
        detail: `${shortCompany(contract.partyB)} · ${contract.amount} · 待签署`,
        park: parkShort(contract.parkId),
      })
    }
    for (const lead of leads.value) {
      if (lead.status !== '新线索') continue
      items.push({
        id: lead.id,
        level: '提示',
        title: lead.company,
        detail: `${lead.industry} · ${lead.phone}`,
        park: parkShort(lead.parkId),
      })
    }
    const rank = { 紧急: 0, 重要: 1, 提示: 2 }
    return items.sort((a, b) => rank[a.level] - rank[b.level])
  })
  const alertUrgent = computed(() => alerts.value.filter((item) => item.level === '紧急').length)
  const alertMajor = computed(() => alerts.value.filter((item) => item.level === '重要').length)
  const alertHint = computed(() => alerts.value.filter((item) => item.level === '提示').length)

  const tickerItems = computed(() => {
    const names = projects.value.filter((item) => talkingStages.has(item.stage)).slice(0, 3).map((item) => item.name)
    return [
      `${cockpit.scopeLabel} · 在谈项目 ${talking.value} 个`,
      `待跟进线索 ${openLeads.value} 条`,
      `已生效及履行 ${signedText.value}`,
      `在跟意向 ${intentText.value}`,
      `逾期节点 ${lateNodes.value} 个`,
      `产业空置 ${formatArea(vacantArea.value)}`,
      names.length ? `在谈：${names.join('、')}` : '当前范围没有在谈项目',
      '电话与金额均为虚构',
    ]
  })

  const signedByPark = computed<BarItem[]>(() =>
    (parkId.value === 'all' ? parks : parks.filter((item) => item.id === parkId.value)).map((park) => {
      const value = sumYi(ledger.contracts.filter((item) => item.parkId === park.id && activeContractStatuses.includes(item.status)).map((item) => item.amount))
      return { label: park.shortName, value, color: park.color, text: formatYi(value) }
    }),
  )

  return reactive({
    scopeLabel: computed(() => cockpit.scopeLabel),
    selectPark: (id: string) => cockpit.setPark(id),
    openLeads,
    talking,
    upcomingVisits,
    conversionText,
    signedText,
    intentText,
    stageBars,
    sourceBars,
    cityBars,
    mapNodes,
    projectRows,
    contractBars,
    contractRows,
    pendingContracts,
    draftingContracts,
    performanceBars,
    lateNodes,
    industryBars,
    enterpriseRows,
    enterpriseIn,
    enterpriseKey,
    enterpriseTodo,
    enterpriseOut,
    enterpriseStatusBars,
    vacantAreaText: computed(() => formatArea(vacantArea.value)),
    openAreaText: computed(() => formatArea(openArea.value)),
    leasedCount,
    vacantCount,
    spaceBars,
    spaceRows,
    parkStacks,
    policyBars,
    policyMoney,
    policyRows,
    policyApplying,
    policyReview,
    policyPay,
    policyBack,
    alerts,
    alertUrgent,
    alertMajor,
    alertHint,
    tickerItems,
    signedByPark,
  })
}

function performanceAlert(node: PerformanceRow & { contract: { title: string; parkId: string } }): AlertItem[] {
  if (node.status !== '逾期' && node.status !== '即将到期') return []
  return [{
    id: node.id,
    level: node.status === '逾期' ? '紧急' : '重要',
    title: node.name,
    detail: `${node.contract.title} · ${node.dueAt} · ${node.metric}`,
    park: parkShort(node.contract.parkId),
  }]
}

function policyAlert(policy: PolicyRow): AlertItem {
  return {
    id: policy.id,
    level: '重要',
    title: policy.title,
    detail: `${shortCompany(policy.enterpriseName)} · ${policy.amount} · 材料退回`,
    park: parkShort(policy.parkId),
  }
}
