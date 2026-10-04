<script setup lang="ts">
import { computed } from 'vue'
import BarChart from '@/components/BarChart.vue'
import DataList from '@/components/DataList.vue'
import DonutChart from '@/components/DonutChart.vue'
import GlowPanel from '@/components/GlowPanel.vue'
import MetricCard from '@/components/MetricCard.vue'
import { useSceneData } from '@/composables/useSceneData'

const data = useSceneData()
const total = computed(() => data.policyBars.reduce((sum, item) => sum + item.value, 0))
</script>

<template>
  <section class="scene-page">
    <header class="scene-head">
      <div>
        <p class="kicker">政策兑现</p>
        <h2>申报、审核和兑付</h2>
      </div>
      <p class="scope">{{ data.scopeLabel }}</p>
    </header>
    <div class="metric-row">
      <MetricCard label="申报中" :value="data.policyApplying" hint="材料还没收齐" />
      <MetricCard label="审核中" :value="data.policyReview" hint="已受理，未到拨付" />
      <MetricCard label="待兑付" :value="data.policyPay" hint="审核已过" />
      <MetricCard label="退回" :value="data.policyBack" hint="补齐后可以再报" />
    </div>
    <div class="board">
      <GlowPanel title="兑现进度" note="与政策台账状态一致">
        <DonutChart :items="data.policyBars" :center="String(total)" />
      </GlowPanel>
      <GlowPanel title="可计量金额" note="只画写了万元的申报">
        <BarChart horizontal :items="data.policyMoney" />
      </GlowPanel>
    </div>
    <GlowPanel title="申报名单" note="点名称打开中台申报。套数和折扣仍按原文显示">
      <DataList :rows="data.policyRows" />
    </GlowPanel>
  </section>
</template>
