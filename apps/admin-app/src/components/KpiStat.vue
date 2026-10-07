<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  hint?: string
}>()
</script>

<template>
  <article class="kpi">
    <p class="label">{{ label }}</p>
    <p class="value">{{ value }}</p>
    <p v-if="hint" class="hint">{{ hint }}</p>
  </article>
</template>

<style scoped>
.kpi {
  position: relative;
  overflow: hidden;
  padding: 16px 18px 14px;
  border: 1px solid var(--park-color-border);
  border-radius: 16px;
  background: var(--park-color-surface);
  box-shadow: 0 10px 28px rgba(14, 19, 32, 0.04);
}

.kpi::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 3px;
  background: linear-gradient(var(--park-color-primary), var(--park-color-highlight));
}

.label {
  margin: 0;
  color: var(--park-color-text-secondary);
  font-size: 13px;
}

.value {
  margin: 10px 0 4px;
  font-size: 28px;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  line-height: 1;
}

.hint {
  margin: 0;
  color: #8b93a7;
  font-size: 12px;
}
</style>
