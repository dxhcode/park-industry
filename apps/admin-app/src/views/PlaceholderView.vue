<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const title = computed(() => route.meta.title ?? '未命名页面')
const group = computed(() => route.meta.group ?? '产业运营')
const description = computed(() => route.meta.description ?? '页面骨架已就绪。')
const hints = computed(() => route.meta.hints ?? [])
</script>

<template>
  <section class="page">
    <header class="head">
      <div>
        <p class="eyebrow">{{ group }}</p>
        <h1>{{ title }}</h1>
        <p class="desc">{{ description }}</p>
      </div>
      <a-tag color="gold">待接入</a-tag>
    </header>

    <div class="metrics">
      <article v-for="hint in hints" :key="hint" class="metric">
        <span>{{ hint }}</span>
        <strong>—</strong>
        <em>暂无数据</em>
      </article>
    </div>

    <div class="stage">
      <svg class="glyph" viewBox="0 0 80 80" aria-hidden="true">
        <rect x="8" y="14" width="64" height="48" rx="8" fill="none" stroke="currentColor" stroke-width="2" />
        <path d="M8 28h64" stroke="currentColor" stroke-width="2" />
        <circle cx="18" cy="21" r="2" fill="currentColor" />
        <circle cx="26" cy="21" r="2" fill="currentColor" />
        <path d="M24 42h28M24 50h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.55" />
      </svg>
      <h2>页面骨架已就绪</h2>
      <p>此路由可以点击访问。业务数据、图表和接口将在后续迭代接入。</p>
    </div>
  </section>
</template>

<style scoped>
.head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.eyebrow {
  margin: 0 0 6px;
  color: var(--park-color-primary);
  font-size: 12px;
  letter-spacing: 0.16em;
}

h1 {
  margin: 0;
  font-size: 28px;
  letter-spacing: 0.02em;
}

.desc {
  max-width: 680px;
  margin: 8px 0 0;
  color: #5c6b7a;
  line-height: 1.7;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 14px;
}

.metric {
  position: relative;
  overflow: hidden;
  padding: 16px 18px 14px;
  border: 1px solid #e6eeee;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 10px 28px rgba(15, 35, 52, 0.04);
}

.metric::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 3px;
  background: linear-gradient(var(--park-color-primary), var(--park-color-highlight));
}

.metric span {
  color: #5c6b7a;
  font-size: 13px;
}

.metric strong {
  display: block;
  margin: 10px 0 4px;
  color: #9aa8b5;
  font-size: 28px;
  font-variant-numeric: tabular-nums;
  font-weight: 560;
}

.metric em {
  color: #8b99a6;
  font-size: 12px;
  font-style: normal;
}

.stage {
  display: grid;
  place-items: center;
  min-height: 320px;
  padding: 48px 24px;
  border: 1px dashed #c5d6d4;
  border-radius: 16px;
  text-align: center;
  background:
    radial-gradient(520px 180px at 100% 0%, rgba(29, 57, 196, 0.08), transparent 60%),
    #fff;
}

.glyph {
  width: 72px;
  height: 72px;
  color: var(--park-color-primary);
}

.stage h2 {
  margin: 12px 0 8px;
  font-size: 18px;
}

.stage p {
  max-width: 460px;
  margin: 0;
  color: #6b7c8a;
  line-height: 1.7;
}

@media (max-width: 860px) {
  .metrics {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 24px;
  }
}
</style>
