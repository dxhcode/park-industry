import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useShellStore = defineStore('shell', () => {
  const parkName = ref('滨江云栖科创园')
  const collapsed = ref(false)
  const pageTitle = ref('')

  function toggleCollapsed() {
    collapsed.value = !collapsed.value
  }

  return { parkName, collapsed, toggleCollapsed, pageTitle }
})
