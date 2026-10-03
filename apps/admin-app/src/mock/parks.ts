import type { ParkRef } from '@/mock/types'

/** 与 park-shared 样例园区对齐：滨江云栖、临港智造、光谷生命。名称与主体均为虚构。 */
export const parks: ParkRef[] = [
  {
    id: 'park-binjiang',
    name: '滨江云栖科创园',
    shortName: '云栖科创',
    city: '杭州市',
    partyName: '杭州云栖科创园发展有限公司',
  },
  {
    id: 'park-lingang',
    name: '临港智造产业园',
    shortName: '临港智造',
    city: '上海市',
    partyName: '上海临港智造园区运营有限公司',
  },
  {
    id: 'park-guanggu',
    name: '光谷生命科学园',
    shortName: '光谷生命',
    city: '武汉市',
    partyName: '武汉光谷生命科学园有限公司',
  },
]

export function findPark(parkId: string): ParkRef | undefined {
  return parks.find((item) => item.id === parkId)
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
