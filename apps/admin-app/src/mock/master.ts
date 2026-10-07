import { buildings, enterprises, getById } from '@park/mock'

/** 楼宇名称以 @park/mock 主数据为准。产业侧只保留楼层、状态和承租关系。 */
export function buildingName(id: string): string {
  const row = getById(buildings, id)
  if (!row) throw new Error(`@park/mock 没有楼宇 ${id}`)
  return row.name
}

/** 企业全称以 @park/mock 主数据为准。招商状态和面积仍由本仓库样例决定。 */
export function masterName(id: string): string {
  const row = enterprises.find((item) => item.id === id)
  if (!row) throw new Error(`@park/mock 没有企业 ${id}`)
  return row.name
}
