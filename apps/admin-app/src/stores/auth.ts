import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { demoAccounts, toSessionUser, type SessionUser } from '@/auth/accounts'

const SESSION_KEY = 'park-industry.session'

function readSession(): SessionUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<SessionUser>
    if (!parsed.username || !parsed.name || !parsed.parkId || !parsed.parkName) return null
    return {
      username: parsed.username,
      name: parsed.name,
      role: parsed.role ?? '园区运营',
      title: parsed.title ?? '',
      parkId: parsed.parkId,
      parkName: parsed.parkName,
    }
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<SessionUser | null>(readSession())
  const isLoggedIn = computed(() => user.value !== null)

  function login(username: string, password: string): string | null {
    const account = demoAccounts.find((item) => item.username === username.trim())
    if (!account || account.password !== password) {
      return '账号或密码不正确'
    }
    const session = toSessionUser(account)
    user.value = session
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    return null
  }

  function logout() {
    user.value = null
    localStorage.removeItem(SESSION_KEY)
  }

  return { user, isLoggedIn, login, logout }
})
