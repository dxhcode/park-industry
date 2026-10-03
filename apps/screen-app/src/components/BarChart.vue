<script setup lang="ts">
import { computed } from 'vue'
import type { BarItem } from '@/mock/format'

const props = defineProps<{
  items: BarItem[]
  horizontal?: boolean
  unit?: string
}>()

const max = computed(() => Math.max(1, ...props.items.map((item) => item.value)))
const summary = computed(() => props.items.map((item) => `${item.label}${item.text ?? item.value}`).join('，'))

function widthOf(value: number) {
  return `${Math.max(value > 0 ? 4 : 0, (value / max.value) * 100)}%`
}

function heightOf(value: number) {
  return `${Math.max(value > 0 ? 6 : 0, (value / max.value) * 100)}%`
}
</script>

<template>
  <p v-if="!items.length" class="empty">这个范围里还没有可画的数</p>
  <div v-else-if="horizontal" class="hbars" role="img" :aria-label="summary">
    <div v-for="(item, index) in items" :key="item.label" class="hrow">
      <span class="lab">{{ item.label }}</span>
      <div class="track">
        <i :style="{ width: widthOf(item.value), background: item.color, animationDelay: `${index * 70}ms` }" />
      </div>
      <span class="val">{{ item.text ?? `${item.value}${unit ?? ''}` }}</span>
    </div>
  </div>
  <div v-else class="bars" role="img" :aria-label="summary">
    <div v-for="(item, index) in items" :key="item.label" class="col">
      <span class="val">{{ item.text ?? `${item.value}${unit ?? ''}` }}</span>
      <div class="vtrack">
        <i :style="{ height: heightOf(item.value), background: item.color, animationDelay: `${index * 60}ms` }" />
      </div>
      <span class="lab">{{ item.label }}</span>
    </div>
  </div>
</template>

<style scoped>
.empty {
  margin: 12px 0;
  color: #93a8bd;
}

.bars {
  display: flex;
  align-items: end;
  gap: 8px;
  height: 100%;
  min-height: 168px;
}

.col {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  min-width: 0;
  height: 100%;
}

.vtrack {
  display: flex;
  flex: 1;
  align-items: end;
  width: 100%;
  min-height: 96px;
  margin: 6px 0;
  border-radius: 8px;
  background: rgba(148, 196, 214, 0.08);
  overflow: hidden;
}

.vtrack i,
.track i {
  display: block;
  border-radius: 8px;
  box-shadow: 0 0 14px rgba(45, 212, 191, 0.28);
  transform-origin: bottom center;
  animation: rise 0.7s ease both;
}

.vtrack i {
  width: 100%;
}

.lab,
.val {
  color: #b7c9da;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.col .lab {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hbars {
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: flex-start;
  height: 100%;
  overflow: auto;
}

.hrow {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) 72px;
  gap: 8px;
  align-items: center;
}

.track {
  height: 10px;
  border-radius: 999px;
  background: rgba(148, 196, 214, 0.1);
  overflow: hidden;
}

.track i {
  height: 100%;
  transform-origin: left center;
  animation-name: grow;
}

.hrow .val {
  text-align: right;
}

@keyframes rise {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}

@keyframes grow {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .vtrack i,
  .track i {
    animation: none;
  }
}
</style>
