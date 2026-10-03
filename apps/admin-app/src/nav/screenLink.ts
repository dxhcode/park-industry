const SCREEN_BASE = '/park-industry/screen'
const scenes = ['situation', 'signing', 'enterprises', 'space', 'policy', 'alerts'] as const

export type ScreenScene = (typeof scenes)[number]

export function screenHref(scene: string, fromPath: string): string {
  const safeScene = scenes.includes(scene as ScreenScene) ? scene : 'situation'
  const from = fromPath.startsWith('/') && !fromPath.startsWith('//') && !fromPath.includes('?') ? fromPath : '/workbench'
  const full = `${SCREEN_BASE}/${safeScene}?from=${encodeURIComponent(from)}`
  if (import.meta.env.DEV) return `http://localhost:5174${full}`
  return full
}

export function sceneForAdminPath(path: string): ScreenScene {
  if (path.startsWith('/signing')) return 'signing'
  if (path.startsWith('/enterprises')) return 'enterprises'
  if (path.startsWith('/space')) return 'space'
  if (path.startsWith('/policy')) return 'policy'
  if (path.startsWith('/analytics')) return 'situation'
  return 'situation'
}
