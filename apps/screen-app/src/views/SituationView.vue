<script setup lang="ts">
import BarChart from '@/components/BarChart.vue'
import DataList from '@/components/DataList.vue'
import GlowPanel from '@/components/GlowPanel.vue'
import MetricCard from '@/components/MetricCard.vue'
import ParkMap from '@/components/ParkMap.vue'
import { useSceneData } from '@/composables/useSceneData'

const data = useSceneData()
</script>

<template>
  <section class="scene-page">
    <header class="scene-head">
      <div>
        <p class="kicker">招商态势</p>
        <h2>线索、在谈和落点</h2>
      </div>
      <p class="scope">{{ data.scopeLabel }}</p>
    </header>
    <div class="metric-row">
      <MetricCard label="待跟进线索" :value="data.openLeads" hint="新线索与跟进中" />
      <MetricCard label="在谈项目" :value="data.talking" hint="初洽、尽调、谈判" />
      <MetricCard label="待进行拜访" :value="data.upcomingVisits" hint="已排期、还没发生" />
      <MetricCard label="线索转化率" :value="data.conversionText" hint="不含无效线索" />
    </div>
    <div class="board">
      <GlowPanel title="投资地理" note="云栖科创、临港智造、光谷生命">
        <ParkMap :nodes="data.mapNodes" @select="data.selectPark" />
      </GlowPanel>
      <div class="stack">
        <GlowPanel title="项目阶段" note="与项目库阶段一致">
          <BarChart :items="data.stageBars" />
        </GlowPanel>
        <GlowPanel title="来源城市" note="按项目登记的城市">
          <BarChart horizontal :items="data.cityBars" unit=" 个" />
        </GlowPanel>
      </div>
    </div>
    <GlowPanel title="项目名单" note="点名称打开中台项目">
      <DataList :rows="data.projectRows" />
    </GlowPanel>
  </section>
</template>
