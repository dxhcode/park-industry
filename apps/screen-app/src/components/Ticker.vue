<script setup lang="ts">
import { computed } from 'vue'
import { KpiTicker } from '@park/components'
import type { TickerItem } from '@park/components'

const props = defineProps<{
  items: string[]
}>()

const tickerItems = computed<TickerItem[]>(() =>
  (props.items.length ? props.items : ['暂无指标']).map((label, index) => ({
    id: `tick-${index}-${label}`,
    label,
    level: '指标',
  })),
)
</script>

<template>
  <div class="ticker-wrap">
    <KpiTicker :items="tickerItems" label="关键指标滚动" />
  </div>
</template>

<style scoped>
.ticker-wrap {
  position: relative;
  z-index: 1;
  margin: 0 18px;
}
</style>
