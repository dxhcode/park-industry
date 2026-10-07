import { defineStore } from 'pinia'
import { computed, onScopeDispose, ref } from 'vue'
import { parkById } from '@/mock/ledger'

export const useCockpitStore = defineStore('cockpit', () => {
  const parkId = ref('all')
  const now = ref(new Date())
  let timer: ReturnType<typeof setInterval> | undefined

  const clockText = computed(() =>
    new Intl.DateTimeFormat('zh-CN', {
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(now.value),
  )

  const headline = computed(() => {
    if (parkId.value === 'all') return '三园联屏'
    return parkById(parkId.value)?.name ?? '三园联屏'
  })

  const scopeLabel = computed(() => {
    if (parkId.value === 'all') return '三园合计'
    return parkById(parkId.value)?.name ?? '三园合计'
  })

  function setPark(id: string) {
    parkId.value = parkId.value === id ? 'all' : id
  }

  function showAll() {
    parkId.value = 'all'
  }

  function stopClock() {
    if (!timer) return
    clearInterval(timer)
    timer = undefined
  }

  function startClock() {
    if (timer) return
    timer = setInterval(() => {
      now.value = new Date()
    }, 1000)
  }

  onScopeDispose(stopClock)

  return { parkId, now, clockText, headline, scopeLabel, setPark, showAll, startClock, stopClock }
})
