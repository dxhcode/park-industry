import { ref, watch, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { createId, nextCode } from '@/mock/helpers'
import {
  seedDicts,
  seedEnterprises,
  seedEvents,
  seedOrgs,
  seedPolicies,
  seedReports,
  seedRoles,
  seedSpaces,
  seedTasks,
} from '@/mock/ops-seed'
import type {
  DictDraft,
  DictEntry,
  Enterprise,
  EnterpriseDraft,
  EventDraft,
  OpsReport,
  OrgDraft,
  OrgUnit,
  PolicyClaim,
  PolicyDraft,
  PromotionEvent,
  ReportDraft,
  RoleDraft,
  RoleGrant,
  SpaceDraft,
  SpaceUnit,
  WorkTask,
  WorkTaskDraft,
} from '@/mock/ops-types'

const STORAGE_KEY = 'park-industry.ops.v1'

interface OpsSnapshot {
  version: number
  tasks: WorkTask[]
  enterprises: Enterprise[]
  spaces: SpaceUnit[]
  policies: PolicyClaim[]
  events: PromotionEvent[]
  reports: OpsReport[]
  orgs: OrgUnit[]
  dicts: DictEntry[]
  roles: RoleGrant[]
}

function seedSnapshot(): OpsSnapshot {
  return {
    version: 1,
    tasks: structuredClone(seedTasks),
    enterprises: structuredClone(seedEnterprises),
    spaces: structuredClone(seedSpaces),
    policies: structuredClone(seedPolicies),
    events: structuredClone(seedEvents),
    reports: structuredClone(seedReports),
    orgs: structuredClone(seedOrgs),
    dicts: structuredClone(seedDicts),
    roles: structuredClone(seedRoles),
  }
}

function isSnapshot(value: unknown): value is OpsSnapshot {
  if (!value || typeof value !== 'object') return false
  const row = value as Partial<OpsSnapshot>
  return (
    row.version === 1 &&
    Array.isArray(row.tasks) &&
    Array.isArray(row.enterprises) &&
    Array.isArray(row.spaces) &&
    Array.isArray(row.policies) &&
    Array.isArray(row.events) &&
    Array.isArray(row.reports) &&
    Array.isArray(row.orgs) &&
    Array.isArray(row.dicts) &&
    Array.isArray(row.roles)
  )
}

function loadSnapshot(): OpsSnapshot {
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

function upsert<T extends { id: string; code: string }>(
  list: Ref<T[]>,
  draft: Omit<T, 'id' | 'code'>,
  idPrefix: string,
  codePrefix: string,
  id?: string,
): T | undefined {
  if (id) {
    const index = list.value.findIndex((item) => item.id === id)
    const current = list.value[index]
    if (!current) return undefined
    const next = { ...current, ...draft, id: current.id, code: current.code }
    list.value.splice(index, 1, next)
    return next
  }
  const created = {
    ...draft,
    id: createId(idPrefix),
    code: nextCode(codePrefix, list.value.map((item) => item.code)),
  } as T
  list.value.unshift(created)
  return created
}

function removeById<T extends { id: string }>(list: Ref<T[]>, id: string) {
  const index = list.value.findIndex((item) => item.id === id)
  if (index >= 0) list.value.splice(index, 1)
}

export const useOpsStore = defineStore('ops', () => {
  const initial = loadSnapshot()
  const tasks = ref<WorkTask[]>(initial.tasks)
  const enterprises = ref<Enterprise[]>(initial.enterprises)
  const spaces = ref<SpaceUnit[]>(initial.spaces)
  const policies = ref<PolicyClaim[]>(initial.policies)
  const events = ref<PromotionEvent[]>(initial.events)
  const reports = ref<OpsReport[]>(initial.reports)
  const orgs = ref<OrgUnit[]>(initial.orgs)
  const dicts = ref<DictEntry[]>(initial.dicts)
  const roles = ref<RoleGrant[]>(initial.roles)

  watch(
    [tasks, enterprises, spaces, policies, events, reports, orgs, dicts, roles],
    () => {
      const snapshot: OpsSnapshot = {
        version: 1,
        tasks: tasks.value,
        enterprises: enterprises.value,
        spaces: spaces.value,
        policies: policies.value,
        events: events.value,
        reports: reports.value,
        orgs: orgs.value,
        dicts: dicts.value,
        roles: roles.value,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
    },
    { deep: true },
  )

  function reset() {
    const snapshot = seedSnapshot()
    tasks.value = snapshot.tasks
    enterprises.value = snapshot.enterprises
    spaces.value = snapshot.spaces
    policies.value = snapshot.policies
    events.value = snapshot.events
    reports.value = snapshot.reports
    orgs.value = snapshot.orgs
    dicts.value = snapshot.dicts
    roles.value = snapshot.roles
  }

  return {
    tasks,
    enterprises,
    spaces,
    policies,
    events,
    reports,
    orgs,
    dicts,
    roles,
    reset,
    saveTask: (draft: WorkTaskDraft, id?: string) => upsert(tasks, draft, 'task', 'DB-2026', id),
    saveEnterprise: (draft: EnterpriseDraft, id?: string) => upsert(enterprises, draft, 'ent', 'QY-2026', id),
    saveSpace: (draft: SpaceDraft, id?: string) => upsert(spaces, draft, 'sp', 'KJ-2026', id),
    savePolicy: (draft: PolicyDraft, id?: string) => upsert(policies, draft, 'pol', 'ZC-2026', id),
    saveEvent: (draft: EventDraft, id?: string) => upsert(events, draft, 'ev', 'HD-2026', id),
    saveReport: (draft: ReportDraft, id?: string) => upsert(reports, draft, 'rpt', 'FX-2026', id),
    saveOrg: (draft: OrgDraft, id?: string) => upsert(orgs, draft, 'org', 'ZZ-2026', id),
    saveDict: (draft: DictDraft, id?: string) => upsert(dicts, draft, 'dict', 'ZD-2026', id),
    saveRole: (draft: RoleDraft, id?: string) => upsert(roles, draft, 'role', 'JS-2026', id),
    removeTask: (id: string) => removeById(tasks, id),
    removeEnterprise: (id: string) => removeById(enterprises, id),
    removeSpace: (id: string) => removeById(spaces, id),
    removePolicy: (id: string) => removeById(policies, id),
    removeEvent: (id: string) => removeById(events, id),
    removeReport: (id: string) => removeById(reports, id),
    removeOrg: (id: string) => removeById(orgs, id),
    removeDict: (id: string) => removeById(dicts, id),
    removeRole: (id: string) => removeById(roles, id),
    taskById: (id: string) => byId(tasks.value, id),
    enterpriseById: (id: string) => byId(enterprises.value, id),
    spaceById: (id: string) => byId(spaces.value, id),
    policyById: (id: string) => byId(policies.value, id),
    eventById: (id: string) => byId(events.value, id),
    reportById: (id: string) => byId(reports.value, id),
    orgById: (id: string) => byId(orgs.value, id),
    dictById: (id: string) => byId(dicts.value, id),
    roleById: (id: string) => byId(roles.value, id),
  }
})
