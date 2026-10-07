import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { createId, nextCode, todayStamp } from '@/mock/helpers'
import { findPark } from '@/mock/parks'
import { seedContracts, seedLeads, seedPerformances, seedProjects, seedVisits } from '@/mock/seed'
import type {
  ContractKind,
  ContractStatus,
  InvestmentProject,
  Lead,
  LeadStatus,
  PerformanceNode,
  PerformanceStatus,
  ProjectSource,
  ProjectStage,
  SigningContract,
  Visit,
  VisitKind,
  VisitStatus,
} from '@/mock/types'

const STORAGE_KEY = 'park-industry.pipeline.v1'

export interface ProjectDraft {
  name: string
  enterpriseName: string
  industry: string
  parkId: string
  stage: ProjectStage
  source: ProjectSource
  intentAreaSqm: number
  intentInvestment: string
  owner: string
  contact: string
  phone: string
  fromCity: string
  expectedSignAt: string
  summary: string
  nextAction: string
}

export interface ContractDraft {
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
}

export interface LeadDraft {
  company: string
  industry: string
  source: ProjectSource
  status: LeadStatus
  parkId: string
  projectId: string
  owner: string
  contact: string
  phone: string
  note: string
}

export interface VisitDraft {
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

export interface PerformanceDraft {
  contractId: string
  name: string
  dueAt: string
  status: PerformanceStatus
  metric: string
  owner: string
  note: string
}

interface Snapshot {
  version: number
  projects: InvestmentProject[]
  contracts: SigningContract[]
  leads: Lead[]
  visits: Visit[]
  performances: PerformanceNode[]
}

function seedSnapshot(): Snapshot {
  return {
    version: 1,
    projects: structuredClone(seedProjects),
    contracts: structuredClone(seedContracts),
    leads: structuredClone(seedLeads),
    visits: structuredClone(seedVisits),
    performances: structuredClone(seedPerformances),
  }
}

function isSnapshot(value: unknown): value is Snapshot {
  if (!value || typeof value !== 'object') return false
  const row = value as Partial<Snapshot>
  return (
    row.version === 1 &&
    Array.isArray(row.projects) &&
    Array.isArray(row.contracts) &&
    Array.isArray(row.leads) &&
    Array.isArray(row.visits) &&
    Array.isArray(row.performances)
  )
}

function loadSnapshot(): Snapshot {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedSnapshot()
    const parsed: unknown = JSON.parse(raw)
    if (!isSnapshot(parsed)) return seedSnapshot()
    return parsed
  } catch {
    return seedSnapshot()
  }
}

function byId<T extends { id: string }>(rows: readonly T[], id: string): T | undefined {
  return rows.find((item) => item.id === id)
}

export const usePipelineStore = defineStore('pipeline', () => {
  const initial = loadSnapshot()
  const projects = ref<InvestmentProject[]>(initial.projects)
  const contracts = ref<SigningContract[]>(initial.contracts)
  const leads = ref<Lead[]>(initial.leads)
  const visits = ref<Visit[]>(initial.visits)
  const performances = ref<PerformanceNode[]>(initial.performances)

  watch(
    [projects, contracts, leads, visits, performances],
    () => {
      const snapshot: Snapshot = {
        version: 1,
        projects: projects.value,
        contracts: contracts.value,
        leads: leads.value,
        visits: visits.value,
        performances: performances.value,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
    },
    { deep: true },
  )

  function reset() {
    const snapshot = seedSnapshot()
    projects.value = snapshot.projects
    contracts.value = snapshot.contracts
    leads.value = snapshot.leads
    visits.value = snapshot.visits
    performances.value = snapshot.performances
  }

  function saveProject(draft: ProjectDraft, id?: string, leadId?: string) {
    const updatedAt = todayStamp()
    if (id) {
      const index = projects.value.findIndex((item) => item.id === id)
      const current = projects.value[index]
      if (!current) return undefined
      const next: InvestmentProject = { ...current, ...draft, id: current.id, code: current.code, updatedAt }
      projects.value.splice(index, 1, next)
      return next
    }
    const next: InvestmentProject = {
      ...draft,
      id: createId('proj'),
      code: nextCode('ZS-2026', projects.value.map((item) => item.code)),
      updatedAt,
    }
    projects.value.unshift(next)
    if (leadId) {
      const lead = leads.value.find((item) => item.id === leadId)
      if (lead) {
        lead.status = '已转化'
        lead.projectId = next.id
      }
    }
    return next
  }

  function saveContract(draft: ContractDraft, id?: string) {
    const updatedAt = todayStamp()
    const park = findPark(draft.parkId)
    const partyA = draft.partyA || park?.partyName || ''
    if (id) {
      const index = contracts.value.findIndex((item) => item.id === id)
      const current = contracts.value[index]
      if (!current) return undefined
      const next: SigningContract = { ...current, ...draft, partyA, id: current.id, code: current.code, updatedAt }
      contracts.value.splice(index, 1, next)
      return next
    }
    const next: SigningContract = {
      ...draft,
      partyA,
      id: createId('con'),
      code: nextCode('HT-2026', contracts.value.map((item) => item.code)),
      updatedAt,
    }
    contracts.value.unshift(next)
    return next
  }

  function saveLead(draft: LeadDraft, id?: string) {
    if (id) {
      const index = leads.value.findIndex((item) => item.id === id)
      const current = leads.value[index]
      if (!current) return undefined
      const next: Lead = { ...current, ...draft, id: current.id, code: current.code, createdAt: current.createdAt }
      leads.value.splice(index, 1, next)
      return next
    }
    const next: Lead = {
      ...draft,
      id: createId('lead'),
      code: nextCode('XS-2026', leads.value.map((item) => item.code)),
      createdAt: todayStamp(),
    }
    leads.value.unshift(next)
    return next
  }

  function saveVisit(draft: VisitDraft, id?: string) {
    if (id) {
      const index = visits.value.findIndex((item) => item.id === id)
      const current = visits.value[index]
      if (!current) return undefined
      const next: Visit = { ...current, ...draft, id: current.id, code: current.code }
      visits.value.splice(index, 1, next)
      return next
    }
    const next: Visit = {
      ...draft,
      id: createId('vis'),
      code: nextCode('BF-2026', visits.value.map((item) => item.code)),
    }
    visits.value.unshift(next)
    return next
  }

  function savePerformance(draft: PerformanceDraft, id?: string) {
    if (id) {
      const index = performances.value.findIndex((item) => item.id === id)
      const current = performances.value[index]
      if (!current) return undefined
      const next: PerformanceNode = { ...current, ...draft, id: current.id, code: current.code }
      performances.value.splice(index, 1, next)
      return next
    }
    const next: PerformanceNode = {
      ...draft,
      id: createId('pf'),
      code: nextCode('LY-2026', performances.value.map((item) => item.code)),
    }
    performances.value.unshift(next)
    return next
  }

  return {
    projects,
    contracts,
    leads,
    visits,
    performances,
    reset,
    saveProject,
    saveContract,
    saveLead,
    saveVisit,
    savePerformance,
    projectById: (id: string) => byId(projects.value, id),
    contractById: (id: string) => byId(contracts.value, id),
    leadById: (id: string) => byId(leads.value, id),
    visitById: (id: string) => byId(visits.value, id),
    performanceById: (id: string) => byId(performances.value, id),
  }
})
