<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  items: string[]
}>()

const loop = computed(() => props.items.length ? props.items : ['暂无指标'])
</script>

<template>
  <div class="ticker" aria-label="关键指标滚动">
    <div class="track">
      <div class="group">
        <span v-for="(item, index) in loop" :key="`a-${index}`">{{ item }}</span>
      </div>
      <div class="group" aria-hidden="true">
        <span v-for="(item, index) in loop" :key="`b-${index}`">{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ticker {
  position: relative;
  z-index: 1;
  overflow: hidden;
  margin: 0 18px;
  border: 1px solid rgba(45, 212, 191, 0.28);
  border-radius: 999px;
  background: rgba(8, 18, 30, 0.72);
  box-shadow: inset 0 0 16px rgba(45, 212, 191, 0.08), 0 0 18px rgba(45, 212, 191, 0.08);
}

.track {
  display: flex;
  width: max-content;
  animation: marquee 36s linear infinite;
}

.group {
  display: flex;
  flex: none;
}

span {
  padding: 7px 22px;
  color: #d8fff6;
  font-size: 13px;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

span::before {
  content: '◆';
  margin-right: 10px;
  color: #2dd4bf;
  font-size: 10px;
}

.ticker:hover .track {
  animation-play-state: paused;
}

@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ticker {
    overflow-x: auto;
  }

  .track {
    animation: none;
  }

  .group[aria-hidden='true'] {
    display: none;
  }
}
</style>
