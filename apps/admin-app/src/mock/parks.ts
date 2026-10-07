import { getById, parks as sharedParks } from '@park/mock'
import type { ParkRef } from '@/mock/types'

/**
 * 编号、名称、简称和城市来自 @park/mock。
 * 合同甲方是产业运营自己的字段，共享主数据里没有。
 */
const partyNames: Record<string, string> = {
  'park-binjiang': '杭州云栖科创园发展有限公司',
  'park-lingang': '上海临港智造园区运营有限公司',
  'park-guanggu': '武汉光谷生命科学园有限公司',
}

export const parks: ParkRef[] = sharedParks.map((park) => ({
  id: park.id,
  name: park.name,
  shortName: park.shortName,
  city: park.city,
  partyName: partyNames[park.id] ?? park.name,
}))

export function findPark(parkId: string): ParkRef | undefined {
  return getById(parks, parkId)
}

export function parkName(parkId: string): string {
  return findPark(parkId)?.name ?? '未分配园区'
}

export function parkShortName(parkId: string): string {
  return findPark(parkId)?.shortName ?? '—'
}

export function parkLabel(parkId: string): string {
  if (parkId === 'all') return '三园合计'
  return parkName(parkId)
}
