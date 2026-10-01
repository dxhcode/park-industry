export function includesKeyword(values: readonly string[], keyword: string): boolean {
  const needle = keyword.trim().toLowerCase()
  if (!needle) return true
  return values.some((value) => value.toLowerCase().includes(needle))
}

export function formatArea(value: number): string {
  return `${value.toLocaleString('zh-CN')} ㎡`
}

export function todayStamp(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`
}

export function nextCode(prefix: string, codes: readonly string[]): string {
  const numbers = codes.map((code) => Number(code.split('-').pop())).filter((item) => Number.isFinite(item))
  const max = numbers.length > 0 ? Math.max(...numbers) : 0
  return `${prefix}-${String(max + 1).padStart(3, '0')}`
}
