<script setup lang="ts">
import { computed } from 'vue'
import DataList from '@/components/DataList.vue'
import DonutChart from '@/components/DonutChart.vue'
import GlowPanel from '@/components/GlowPanel.vue'
import MetricCard from '@/components/MetricCard.vue'
import ParkMap from '@/components/ParkMap.vue'
import { useSceneData } from '@/composables/useSceneData'

const data = useSceneData()
const total = computed(() => data.enterpriseRows.length)
</script>

<template>
  <section class="scene-page">
    <header class="scene-head">
      <div>
        <p class="kicker">企业分布</p>
        <h2>在园、重点和意向</h2>
      </div>
      <p class="scope">{{ data.scopeLabel }}</p>
    </header>
    <div class="metric-row">
      <MetricCard label="在园含重点" :value="data.enterpriseIn" hint="已经有空间关系" />
      <MetricCard label="重点企业" :value="data.enterpriseKey" hint="星澜、海弈这一档" />
      <MetricCard label="待完善" :value="data.enterpriseTodo" hint="还没入驻或资料不全" />
      <MetricCard label="已迁出" :value="data.enterpriseOut" hint="档案保留" />
    </div>
    <div class="board">
      <GlowPanel title="落点" note="点园区可以只看该园企业">
        <ParkMap :nodes="data.mapNodes" @select="data.selectPark" />
      </GlowPanel>
      <GlowPanel title="产业构成" note="按企业档案产业">
        <DonutChart :items="data.industryBars" :center="String(total)" />
      </GlowPanel>
    </div>
    <GlowPanel title="企业名单" note="电话是虚构的，与档案一致">
      <DataList :rows="data.enterpriseRows" />
    </GlowPanel>
  </section>
</template>
