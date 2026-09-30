<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const title = computed(() => route.meta.title ?? '未命名场景')
const description = computed(() => route.meta.description ?? '场景骨架已就绪。')
const hints = computed(() => route.meta.hints ?? [])
</script>

<template>
  <section class="panel">
    <header class="head">
      <div>
        <p class="kicker">场景</p>
        <h2>{{ title }}</h2>
        <p class="desc">{{ description }}</p>
      </div>
      <a-tag color="gold">待接入</a-tag>
    </header>

    <div class="body">
      <div class="metrics">
        <article v-for="hint in hints" :key="hint" class="metric">
          <span>{{ hint }}</span>
          <strong>—</strong>
          <em>暂无数据</em>
        </article>
      </div>
      <div class="canvas">
        <div class="radar" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
          <i></i>
        </div>
        <h3>场景骨架已就绪</h3>
        <p>导航可以切换。指标、图表、地图和告警列表都留空，等待后续接入。</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 420px;
  padding: 18px 18px 16px;
  border: 1px solid rgba(125, 211, 252, 0.22);
  border-radius: 18px;
  background: rgba(8, 16, 28, 0.62);
  box-shadow:
    0 0 0 1px rgba(45, 212, 191, 0.05) inset,
    0 20px 60px rgba(0, 0, 0, 0.28),
    0 0 32px rgba(45, 212, 191, 0.08);
  backdrop-filter: blur(16px);
}

.head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(148, 196, 214, 0.16);
}

.kicker {
  margin: 0 0 4px;
  color: #67e8f9;
  font-size: 11px;
  letter-spacing: 0.24em;
}

h2 {
  margin: 0;
  font-size: 26px;
  letter-spacing: 0.06em;
}

.desc {
  max-width: 640px;
  margin: 8px 0 0;
  color: #9fb0c3;
  line-height: 1.7;
}

.body {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 16px;
  flex: 1;
  min-height: 0;
  padding-top: 16px;
}

.metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  align-content: start;
}

.metric {
  padding: 14px 14px 12px;
  border: 1px solid rgba(148, 196, 214, 0.16);
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(20, 36, 56, 0.72), rgba(9, 16, 28, 0.4));
  box-shadow: inset 0 0 18px rgba(45, 212, 191, 0.04);
}

.metric span,
.metric em {
  color: #93a8bd;
  font-size: 12px;
  font-style: normal;
}

.metric strong {
  display: block;
  margin: 8px 0 4px;
  color: #d7fff8;
  font-size: 28px;
  font-weight: 560;
  font-variant-numeric: tabular-nums;
  text-shadow: 0 0 12px rgba(45, 212, 191, 0.35);
}

.canvas {
  display: grid;
  place-items: center;
  align-content: center;
  min-height: 280px;
  padding: 24px;
  border: 1px dashed rgba(125, 211, 252, 0.35);
  border-radius: 16px;
  text-align: center;
  background:
    radial-gradient(280px 180px at 50% 42%, rgba(45, 212, 191, 0.12), transparent 70%),
    rgba(5, 10, 18, 0.35);
}

.radar {
  position: relative;
  width: 148px;
  height: 148px;
  margin-bottom: 8px;
}

.radar span,
.radar i {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(45, 212, 191, 0.35);
  border-radius: 50%;
}

.radar span:nth-child(2) {
  inset: 22px;
}

.radar span:nth-child(3) {
  inset: 46px;
}

.radar i {
  background: conic-gradient(from 0deg, transparent 0 72%, rgba(45, 212, 191, 0.35) 100%);
  border: 0;
  animation: sweep 6s linear infinite;
}

h3 {
  margin: 8px 0;
  font-size: 18px;
}

.canvas p {
  max-width: 420px;
  margin: 0;
  color: #9fb0c3;
  line-height: 1.7;
}

@keyframes sweep {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1100px) {
  .body {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .radar i {
    animation: none;
  }
}
</style>
