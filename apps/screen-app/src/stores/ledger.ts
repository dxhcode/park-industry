import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { loadBundle, OPS_KEY, originLabel, PIPELINE_KEY, type Bundle } from '@/mock/ledger'

export const useLedgerStore = defineStore('ledger', () => {
  const bundle = ref<Bundle>(loadBundle())

  function reload() {
    bundle.value = loadBundle()
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
      if (event.key === PIPELINE_KEY || event.key === OPS_KEY) reload()
    })
  }

  const projects = computed(() => bundle.value.projects)
  const contracts = computed(() => bundle.value.contracts)
  const leads = computed(() => bundle.value.leads)
  const visits = computed(() => bundle.value.visits)
  const performances = computed(() => bundle.value.performances)
  const enterprises = computed(() => bundle.value.enterprises)
  const spaces = computed(() => bundle.value.spaces)
  const policies = computed(() => bundle.value.policies)
  const label = computed(() => originLabel(bundle.value))

  return {
    projects,
    contracts,
    leads,
    visits,
    performances,
    enterprises,
    spaces,
    policies,
    label,
    reload,
  }
})
