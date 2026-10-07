<script setup lang="ts">
import type { MapNode } from '@/composables/useSceneData'

defineProps<{
  nodes: MapNode[]
}>()

const emit = defineEmits<{
  select: [id: string]
}>()
</script>

<template>
  <div class="map">
    <svg viewBox="0 0 720 420" role="img" aria-label="三园投资地理示意，不是测绘底图">
      <defs>
        <radialGradient id="radar" cx="58%" cy="46%" r="58%">
          <stop offset="0%" stop-color="rgba(45,212,191,0.2)" />
          <stop offset="70%" stop-color="rgba(56,189,248,0.05)" />
          <stop offset="100%" stop-color="rgba(7,11,18,0)" />
        </radialGradient>
        <linearGradient id="land" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="rgba(20,48,68,0.95)" />
          <stop offset="100%" stop-color="rgba(8,18,32,0.9)" />
        </linearGradient>
      </defs>
      <rect width="720" height="420" fill="url(#radar)" />
      <g class="grid" aria-hidden="true">
        <circle cx="430" cy="210" r="70" />
        <circle cx="430" cy="210" r="130" />
        <circle cx="430" cy="210" r="190" />
        <path d="M80 210 H660 M430 20 V400" />
      </g>
      <path
        class="land"
        fill="url(#land)"
        d="M96 78 C150 36 230 62 292 42 C360 18 430 58 512 34 C590 48 650 96 642 156 C676 198 650 246 612 286 C568 338 500 372 410 360 C300 392 190 360 132 312 C70 258 48 176 78 124 C86 104 90 90 96 78 Z"
      />
      <path class="coast" d="M512 34 C590 48 650 96 642 156 C676 198 650 246 612 286" />
      <path class="flow" d="M198 262 C320 230 430 190 568 168" />
      <path class="flow flow-b" d="M568 168 C590 200 560 230 512 248" />
      <path class="flow flow-c" d="M198 262 C320 300 420 300 512 248" />
      <g
        v-for="node in nodes"
        :key="node.id"
        class="node"
        :class="{ selected: node.selected, dimmed: node.dimmed }"
        tabindex="0"
        role="button"
        :aria-pressed="node.selected"
        :aria-label="`${node.city}${node.shortName}，在跟项目 ${node.projects} 个，已签约 ${node.signed}`"
        @click="emit('select', node.id)"
        @keydown.enter.prevent="emit('select', node.id)"
        @keydown.space.prevent="emit('select', node.id)"
      >
        <circle class="ping" :cx="node.x" :cy="node.y" r="16" :stroke="node.color" />
        <circle class="core" :cx="node.x" :cy="node.y" r="7" :fill="node.color" />
        <text :x="node.labelX" :y="node.labelY" :text-anchor="node.anchor" class="name">{{ node.shortName }}</text>
        <text :x="node.labelX" :y="node.labelY + 16" :text-anchor="node.anchor" class="meta">
          {{ node.city }} · {{ node.projects }} 项 · {{ node.signed }}
        </text>
      </g>
    </svg>
    <p>示意位置，不是测绘底图。再点一次已选园区，回到三园合计。</p>
  </div>
</template>

<style scoped>
.map {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 240px;
}

svg {
  width: 100%;
  height: 100%;
  min-height: 220px;
}

.grid {
  fill: none;
  stroke: rgba(125, 211, 252, 0.16);
  stroke-width: 1;
}

.land {
  stroke: rgba(125, 211, 252, 0.45);
  stroke-width: 1.4;
}

.coast {
  fill: none;
  stroke: #67e8f9;
  stroke-width: 2;
  stroke-linecap: round;
  filter: drop-shadow(0 0 6px rgba(103, 232, 249, 0.8));
}

.flow {
  fill: none;
  stroke: rgba(45, 212, 191, 0.75);
  stroke-width: 1.6;
  stroke-dasharray: 7 8;
  animation: dash 8s linear infinite;
}

.flow-b {
  animation-duration: 6s;
}

.flow-c {
  stroke: rgba(196, 181, 253, 0.7);
  animation-duration: 10s;
}

.node {
  cursor: pointer;
  outline: none;
}

.core {
  filter: drop-shadow(0 0 6px rgba(45, 212, 191, 0.9));
}

.ping {
  fill: none;
  stroke-width: 1.4;
  transform-box: fill-box;
  transform-origin: center;
  animation: ping 2.6s ease-out infinite;
}

.name {
  fill: #f4fffd;
  font-size: 16px;
  font-weight: 680;
}

.meta {
  fill: #b7c9da;
  font-size: 12px;
}

.dimmed {
  opacity: 0.38;
}

.selected .name {
  fill: #d8fff6;
}

.node:focus-visible .core {
  stroke: #fff;
  stroke-width: 2;
}

p {
  margin: 4px 0 0;
  color: #7f93a8;
  font-size: 12px;
}

@keyframes dash {
  to {
    stroke-dashoffset: -120;
  }
}

@keyframes ping {
  0% {
    transform: scale(1);
    opacity: 0.85;
  }
  100% {
    transform: scale(2.15);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .flow,
  .ping {
    animation: none;
  }
}
</style>
