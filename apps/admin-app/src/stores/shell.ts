import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useShellStore = defineStore('shell', () => {
  const parkName = ref('临港科创产业园')
  const collapsed = ref(false)

  function toggleCollapsed() {
    collapsed.value = !collapsed.value
  }

  return { parkName, collapsed, toggleCollapsed }
})
