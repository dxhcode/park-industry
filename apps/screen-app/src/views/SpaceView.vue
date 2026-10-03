<script setup lang="ts">
import DataList from '@/components/DataList.vue'
import GlowPanel from '@/components/GlowPanel.vue'
import MetricCard from '@/components/MetricCard.vue'
import StackBars from '@/components/StackBars.vue'
import BarChart from '@/components/BarChart.vue'
import { useSceneData } from '@/composables/useSceneData'

const data = useSceneData()
</script>

<template>
  <section class="scene-page">
    <header class="scene-head">
      <div>
        <p class="kicker">空间利用</p>
        <h2>可招商、在租和空置</h2>
      </div>
      <p class="scope">{{ data.scopeLabel }}</p>
    </header>
    <div class="metric-row">
      <MetricCard label="产业空置" :value="data.vacantAreaText" hint="不含人才公寓" />
      <MetricCard label="可招商加空置" :value="data.openAreaText" hint="还没锁成在租" />
      <MetricCard label="在租资源" :value="data.leasedCount" hint="含配套公寓" />
      <MetricCard label="空置资源" :value="data.vacantCount" hint="未出租也未在谈锁房" />
    </div>
    <div class="board">
      <GlowPanel title="分园面积" note="按状态叠在一起，公寓不计入">
        <StackBars :rows="data.parkStacks" />
      </GlowPanel>
      <GlowPanel title="状态个数" note="产业空间，不含配套">
        <BarChart :items="data.spaceBars" />
      </GlowPanel>
    </div>
    <GlowPanel title="楼栋与厂房" note="在谈但没锁房的仍是可招商">
      <DataList :rows="data.spaceRows" />
    </GlowPanel>
  </section>
</template>
