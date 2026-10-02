<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const title = computed(() => route.meta.title ?? '未命名场景')
const description = computed(() => route.meta.description ?? '场景骨架已就绪。')
const hints = computed(() => route.meta.hints ?? [])
const gaps = [
  { title: '地图', text: '落点留到第四天' },
  { title: '图表', text: '指标图留到第四天' },
  { title: '告警', text: '列表留到第四天' },
]
</script>

<template>
  <section class="panel">
    <header class="head">
      <div>
        <p class="kicker">场景</p>
        <h2>{{ title }}</h2>
        <p class="desc">{{ description }}</p>
      </div>
      <a-tag color="gold">第四天接入</a-tag>
    </header>

    <div class="body">
      <div class="metrics">
        <article v-for="hint in hints" :key="hint" class="metric">
          <span>{{ hint }}</span>
          <strong>—</strong>
          <em>暂无数据</em>
        </article>
      </div>
      <div class="soon">
        <article class="glass hero">
          <p class="soon-kicker">即将开放</p>
          <h3>{{ title }}还没有接上数据</h3>
          <p>这张卡片只是空位。地图、图表和告警列表都留在第四天，今天可以切换场景，但不会出现驾驶舱数字。</p>
        </article>
        <div class="chips">
          <article v-for="item in gaps" :key="item.title" class="glass chip">
            <strong>{{ item.title }}</strong>
            <span>{{ item.text }}</span>
          </article>
        </div>
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

.soon {
  display: grid;
  gap: 12px;
  align-content: start;
}

.glass {
  border: 1px solid rgba(125, 211, 252, 0.28);
  border-radius: 16px;
  background:
    linear-gradient(180deg, rgba(20, 40, 58, 0.55), rgba(8, 16, 28, 0.35)),
    rgba(5, 10, 18, 0.35);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.04),
    0 16px 40px rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(18px);
}

.hero {
  min-height: 220px;
  padding: 28px 24px;
  background:
    radial-gradient(280px 160px at 18% 20%, rgba(45, 212, 191, 0.16), transparent 70%),
    linear-gradient(180deg, rgba(20, 40, 58, 0.55), rgba(8, 16, 28, 0.35));
}

.soon-kicker {
  margin: 0 0 8px;
  color: #f3d7a6;
  font-size: 12px;
  letter-spacing: 0.18em;
}

h3 {
  margin: 0;
  font-size: 22px;
  letter-spacing: 0.04em;
}

.hero p:last-child {
  max-width: 520px;
  margin: 12px 0 0;
  color: #9fb0c3;
  line-height: 1.7;
}

.chips {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.chip {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 92px;
  padding: 16px;
}

.chip strong {
  color: #e7f3ff;
  font-size: 16px;
}

.chip span {
  color: #93a8bd;
  font-size: 13px;
}

@media (max-width: 1100px) {
  .body,
  .chips {
    grid-template-columns: 1fr;
  }
}
</style>
