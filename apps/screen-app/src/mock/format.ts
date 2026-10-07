export interface BarItem {
  label: string
  value: number
  color: string
  text?: string
}

export function parseYi(text: string): number | null {
  const matched = text.replace(/,/g, '').match(/(\d+(?:\.\d+)?)\s*(亿元|万元)/)
  if (!matched) return null
  const value = Number(matched[1])
  if (!Number.isFinite(value)) return null
  return matched[2] === '亿元' ? value : value / 10000
}

export function parseWan(text: string): number | null {
  const matched = text.replace(/,/g, '').match(/(\d+(?:\.\d+)?)\s*万元/)
  if (!matched) return null
  const value = Number(matched[1])
  return Number.isFinite(value) ? value : null
}

export function formatYi(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return '暂无'
  if (value >= 1) return `${trim(Math.round(value * 100) / 100)} 亿元`
  return `${trim(Math.round(value * 10000 * 10) / 10)} 万元`
}

export function formatArea(value: number): string {
  return `${Math.round(value).toLocaleString('zh-CN')} ㎡`
}

export function shortCompany(name: string): string {
  return name.replace(/(股份有限公司|有限公司)$/, '')
}

function trim(value: number): string {
  return Number(value.toFixed(2)).toString()
}

const stageColors: Record<string, string> = {
  线索: '#7dd3fc',
  初洽: '#38bdf8',
  尽调: '#22d3ee',
  谈判: '#2dd4bf',
  签约: '#f3d7a6',
  落地: '#86efac',
  搁置: '#94a3b8',
}

const statusColors: Record<string, string> = {
  起草中: '#7dd3fc',
  待签署: '#f3d7a6',
  已生效: '#2dd4bf',
  履行中: '#86efac',
  已终止: '#94a3b8',
  正常履约: '#86efac',
  即将到期: '#f3d7a6',
  逾期: '#fb7185',
  已完成: '#67e8f9',
  在园: '#38bdf8',
  重点: '#f3d7a6',
  待完善: '#c4b5fd',
  已迁出: '#94a3b8',
  可招商: '#7dd3fc',
  在租: '#2dd4bf',
  已售: '#86efac',
  装修中: '#f3d7a6',
  空置: '#fb7185',
  申报中: '#7dd3fc',
  审核中: '#38bdf8',
  待兑付: '#f3d7a6',
  已兑付: '#86efac',
  退回: '#fb7185',
  新线索: '#7dd3fc',
  跟进中: '#2dd4bf',
  已转化: '#86efac',
  无效: '#94a3b8',
  人工智能: '#22d3ee',
  生物医药: '#34d399',
  软件信息: '#38bdf8',
  高端装备: '#fbbf24',
  新能源: '#a3e635',
  供应链: '#94a3b8',
  医疗器械: '#f472b6',
  合成生物: '#c084fc',
  集成电路: '#818cf8',
  推介会: '#f3d7a6',
  渠道推荐: '#38bdf8',
  主动咨询: '#2dd4bf',
  政府转介: '#c4b5fd',
  以商招商: '#86efac',
}

export function tone(label: string): string {
  return statusColors[label] ?? stageColors[label] ?? '#94a3b8'
}

export function countBars(labels: readonly string[], rows: readonly object[], key: string, hideZero = false): BarItem[] {
  const seen = new Set<string>(labels)
  const extras: string[] = []
  const read = (row: object) => {
    const value = (row as Record<string, unknown>)[key]
    return typeof value === 'string' ? value : ''
  }
  for (const row of rows) {
    const value = read(row)
    if (!value || seen.has(value) || extras.includes(value)) continue
    extras.push(value)
  }
  return [...labels, ...extras]
    .map((label) => ({
      label,
      value: rows.filter((row) => read(row) === label).length,
      color: tone(label),
    }))
    .filter((item) => !hideZero || item.value > 0)
}
