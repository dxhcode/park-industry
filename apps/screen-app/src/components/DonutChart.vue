<script setup lang="ts">
import { computed } from 'vue'
import type { BarItem } from '@/mock/format'

const props = defineProps<{
  items: BarItem[]
  center: string
}>()

const total = computed(() => props.items.reduce((sum, item) => sum + item.value, 0))
const arcs = computed(() => {
  const radius = 42
  const circumference = 2 * Math.PI * radius
  let offset = 0
  const base = total.value || 1
  return props.items
    .filter((item) => item.value > 0)
    .map((item) => {
      const length = (item.value / base) * circumference
      const arc = { ...item, length, gap: circumference - length, offset }
      offset += length
      return arc
    })
})
const summary = computed(() => props.items.map((item) => `${item.label}${item.value}`).join('，'))
</script>

<template>
  <div class="donut" role="img" :aria-label="summary">
    <svg viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="42" class="ring" />
      <circle
        v-for="arc in arcs"
        :key="arc.label"
        cx="60"
        cy="60"
        r="42"
        fill="none"
        :stroke="arc.color"
        stroke-width="12"
        :stroke-dasharray="`${arc.length} ${arc.gap}`"
        :stroke-dashoffset="-arc.offset"
        transform="rotate(-90 60 60)"
      />
      <text x="60" y="58" text-anchor="middle" class="num">{{ center }}</text>
      <text x="60" y="74" text-anchor="middle" class="cap">合计</text>
    </svg>
    <ul>
      <li v-for="item in items" :key="item.label">
        <i :style="{ background: item.color }" />
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.donut {
  display: grid;
  grid-template-columns: 148px minmax(0, 1fr);
  gap: 8px;
  align-items: center;
  height: 100%;
}

svg {
  width: 148px;
  height: 148px;
  filter: drop-shadow(0 0 8px rgba(45, 212, 191, 0.25));
}

.ring {
  fill: none;
  stroke: rgba(148, 196, 214, 0.16);
  stroke-width: 12;
}

.num {
  fill: #e9fffb;
  font-size: 18px;
  font-weight: 680;
}

.cap {
  fill: #93a8bd;
  font-size: 10px;
}

ul {
  display: grid;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

li {
  display: grid;
  grid-template-columns: 8px minmax(0, 1fr) auto;
  gap: 8px;
  align-items: center;
  color: #d5e6f5;
  font-size: 13px;
}

i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  box-shadow: 0 0 8px currentColor;
}

strong {
  font-variant-numeric: tabular-nums;
}

@media (max-width: 720px) {
  .donut {
    grid-template-columns: 1fr;
    justify-items: center;
  }
}
</style>
