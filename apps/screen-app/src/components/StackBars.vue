<script setup lang="ts">
import type { StackRow } from '@/composables/useSceneData'
import { formatArea, tone } from '@/mock/format'

defineProps<{
  rows: StackRow[]
}>()

const legend = ['可招商', '在租', '装修中', '空置', '已售']

function total(row: StackRow) {
  return row.segments.reduce((sum, item) => sum + item.value, 0)
}

function widthOf(row: StackRow, value: number) {
  const base = total(row) || 1
  if (!value) return '0%'
  return `${(value / base) * 100}%`
}
</script>

<template>
  <div class="stacks">
    <div v-for="row in rows" :key="row.id" class="row">
      <span class="name">{{ row.label }}</span>
      <div class="bar" :aria-label="`${row.label} ${formatArea(total(row))}`">
        <i
          v-for="segment in row.segments"
          :key="segment.label"
          :style="{ width: widthOf(row, segment.value), background: segment.color }"
          :title="`${segment.label} ${formatArea(segment.value)}`"
        />
      </div>
      <span class="sum">{{ formatArea(total(row)) }}</span>
    </div>
    <ul class="legend">
      <li v-for="label in legend" :key="label">
        <i :style="{ background: tone(label) }" />
        {{ label }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.stacks {
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
  height: 100%;
}

.row {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) 88px;
  gap: 8px;
  align-items: center;
}

.name,
.sum {
  color: #d5e6f5;
  font-size: 13px;
}

.sum {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.bar {
  display: flex;
  height: 14px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(148, 196, 214, 0.1);
}

.bar i {
  display: block;
  height: 100%;
  box-shadow: 0 0 10px rgba(45, 212, 191, 0.2);
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
  margin: 4px 0 0;
  padding: 0;
  color: #9fb4c9;
  font-size: 12px;
  list-style: none;
}

.legend li {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.legend i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
</style>
