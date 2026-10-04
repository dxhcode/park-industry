<script setup lang="ts">
import GlowPanel from '@/components/GlowPanel.vue'
import MetricCard from '@/components/MetricCard.vue'
import { useSceneData } from '@/composables/useSceneData'

const data = useSceneData()

function levelClass(level: string) {
  if (level === '紧急') return 'urgent'
  if (level === '重要') return 'major'
  return 'hint'
}
</script>

<template>
  <section class="scene-page">
    <header class="scene-head">
      <div>
        <p class="kicker">告警中心</p>
        <h2>逾期、空置和退回</h2>
      </div>
      <p class="scope">{{ data.scopeLabel }}</p>
    </header>
    <div class="metric-row">
      <MetricCard label="紧急" :value="data.alertUrgent" hint="履约已经逾期" />
      <MetricCard label="重要" :value="data.alertMajor" hint="即将到期、空置或退回" />
      <MetricCard label="提示" :value="data.alertHint" hint="待签署和新线索" />
      <MetricCard label="告警条数" :value="data.alerts.length" hint="随左侧园区范围变化" />
    </div>
    <GlowPanel title="需要盯的事项" note="点一条回到中台对应档案">
      <p v-if="!data.alerts.length" class="empty">这个范围里没有需要盯的告警。</p>
      <div v-else class="alert-list">
        <a v-for="item in data.alerts" :key="item.id" class="alert-row" :href="item.href">
          <div>
            <strong>{{ item.title }}</strong>
            <span>{{ item.park }} · {{ item.detail }}</span>
          </div>
          <em class="level" :class="levelClass(item.level)">{{ item.level }}</em>
        </a>
      </div>
    </GlowPanel>
  </section>
</template>
