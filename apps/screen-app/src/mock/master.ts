import { buildings, enterprises, getById } from '@park/mock'

export function buildingName(id: string): string {
  const row = getById(buildings, id)
  if (!row) throw new Error(`@park/mock 没有楼宇 ${id}`)
  return row.name
}

export function masterName(id: string): string {
  const row = enterprises.find((item) => item.id === id)
  if (!row) throw new Error(`@park/mock 没有企业 ${id}`)
  return row.name
}
