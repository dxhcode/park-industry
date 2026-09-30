import { defineStore } from 'pinia'
import { computed, onScopeDispose, ref } from 'vue'

export const useCockpitStore = defineStore('cockpit', () => {
  const parkName = ref('临港科创产业园')
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

  return { parkName, now, clockText, startClock, stopClock }
})
