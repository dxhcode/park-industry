const ADMIN_BASE = '/park-industry/admin'

export function adminHref(from: unknown): string {
  const path = safeAdminPath(from)
  const full = `${ADMIN_BASE}${path}`
  if (import.meta.env.DEV) return `http://localhost:5173${full}`
  return full
}

function safeAdminPath(from: unknown): string {
  const value = Array.isArray(from) ? from[0] : from
  if (typeof value !== 'string') return '/workbench'
  if (!value.startsWith('/') || value.startsWith('//')) return '/workbench'
  if (value.includes('://') || value.includes('\\') || value.includes('?')) return '/workbench'
  return value
}
