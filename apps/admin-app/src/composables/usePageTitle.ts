import { onBeforeRouteLeave } from 'vue-router'
import { watch } from 'vue'
import { useShellStore } from '@/stores/shell'

export function usePageTitle(source: () => string) {
  const shell = useShellStore()
  watch(source, (value) => {
    shell.pageTitle = value
  }, { immediate: true })
  onBeforeRouteLeave(() => {
    shell.pageTitle = ''
  })
}
