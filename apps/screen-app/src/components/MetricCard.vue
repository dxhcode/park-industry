<script setup lang="ts">
import { KpiStat } from '@park/components'

defineProps<{
  label: string
  value: string | number
  hint: string
}>()
</script>

<template>
  <article class="metric-card">
    <KpiStat :label="label" :value="value" :hint="hint" />
  </article>
</template>

<style scoped>
.metric-card {
  position: relative;
  overflow: hidden;
  padding: 12px 14px 10px 16px;
  border: 1px solid var(--park-glass-border);
  border-radius: 16px;
  background: var(--park-glass-bg);
  box-shadow: inset 0 0 18px rgba(34, 211, 238, 0.05);
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 2px;
  background: linear-gradient(var(--park-color-primary), var(--park-color-accent));
  box-shadow: 0 0 10px var(--park-color-glow);
}

.metric-card :deep(.park-kpi__value) {
  font-size: 26px;
}

.metric-card :deep(.park-kpi__label),
.metric-card :deep(.park-kpi__hint) {
  letter-spacing: 0.04em;
}
</style>
