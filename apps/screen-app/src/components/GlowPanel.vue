<script setup lang="ts">
import { GlassCard } from '@park/components'

defineProps<{
  title: string
  note?: string
}>()
</script>

<template>
  <GlassCard class="glow" :title="title">
    <template v-if="note" #extra>
      <span>{{ note }}</span>
    </template>
    <slot />
  </GlassCard>
</template>

<style scoped>
.glow {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.glow :deep(.park-glass__body) {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  overflow: auto;
}

.glow :deep(.park-glass__header h2) {
  color: var(--park-color-text);
  font-weight: 620;
}
</style>
