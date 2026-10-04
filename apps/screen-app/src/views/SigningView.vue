<script setup lang="ts">
import { computed } from 'vue'
import BarChart from '@/components/BarChart.vue'
import DataList from '@/components/DataList.vue'
import DonutChart from '@/components/DonutChart.vue'
import GlowPanel from '@/components/GlowPanel.vue'
import MetricCard from '@/components/MetricCard.vue'
import { useSceneData } from '@/composables/useSceneData'

const data = useSceneData()
const contractTotal = computed(() => data.contractBars.reduce((sum, item) => sum + item.value, 0))
</script>

<template>
  <section class="scene-page">
    <header class="scene-head">
      <div>
        <p class="kicker">签约看板</p>
        <h2>协议、履约和到账</h2>
      </div>
      <p class="scope">{{ data.scopeLabel }}</p>
    </header>
    <div class="metric-row">
      <MetricCard label="已生效及履行" :value="data.signedText" hint="海弈、远能这类已进台账的金额" />
      <MetricCard label="在跟意向" :value="data.intentText" hint="不含搁置项目" />
      <MetricCard label="待签署" :value="data.pendingContracts" hint="文本已定、未盖章" />
      <MetricCard label="逾期节点" :value="data.lateNodes" hint="已过约定日期" />
    </div>
    <div class="board">
      <GlowPanel title="合同状态" note="起草、待签、生效、履行">
        <DonutChart :items="data.contractBars" :center="String(contractTotal)" />
      </GlowPanel>
      <GlowPanel title="分园签约额" note="只计已生效和履行中">
        <BarChart horizontal :items="data.signedByPark" />
      </GlowPanel>
    </div>
    <div class="board">
      <GlowPanel title="履约节点" note="逾期会进告警中心">
        <BarChart :items="data.performanceBars" />
      </GlowPanel>
      <GlowPanel title="合同名单" :note="`起草中 ${data.draftingContracts} 份，点名称打开中台`">
        <DataList :rows="data.contractRows" />
      </GlowPanel>
    </div>
  </section>
</template>
