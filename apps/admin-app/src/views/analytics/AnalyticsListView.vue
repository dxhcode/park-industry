<script setup lang="ts">
import { PageHeader, EmptyState, KpiStat } from '@park/components'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { TableColumnsType } from 'ant-design-vue'
import ScreenJump from '@/components/ScreenJump.vue'
import StatusTag from '@/components/StatusTag.vue'
import { includesKeyword } from '@/mock/helpers'
import { parkFilterOptions, reportStatuses, toOptions } from '@/mock/options'
import { parkLabel } from '@/mock/parks'
import type { OpsReport } from '@/mock/ops-types'
import { useOpsStore } from '@/stores/ops'

const store = useOpsStore()
const router = useRouter()
const keyword = ref('')
const status = ref('')
const parkId = ref('')

const parkOptions = [{ label: '全部范围', value: '' }, { label: '三园合计', value: 'all' }, ...parkFilterOptions.slice(1)]

const rows = computed(() =>
  store.reports.filter((item) => {
    if (status.value && item.status !== status.value) return false
    if (parkId.value && item.parkId !== parkId.value) return false
    return includesKeyword([item.title, item.code, item.metric, item.period, item.owner, item.valueText], keyword.value)
  }),
)

const filteredOut = computed(() => rows.value.length === 0 && store.reports.length > 0)
const published = computed(() => store.reports.filter((item) => item.status === '已发布').length)
const drafts = computed(() => store.reports.filter((item) => item.status === '草稿').length)

const columns: TableColumnsType<OpsReport> = [
  { title: '编号', dataIndex: 'code', width: 130 },
  { title: '快报', key: 'title', dataIndex: 'title', ellipsis: true },
  { title: '指标', dataIndex: 'metric', width: 120 },
  { title: '数值', dataIndex: 'valueText', width: 120 },
  { title: '状态', key: 'status', dataIndex: 'status', width: 100 },
  { title: '范围', key: 'park', width: 110 },
  { title: '周期', dataIndex: 'period', width: 130 },
]

const pagination = { pageSize: 8, showSizeChanger: false, showTotal: (total: number) => `共 ${total} 条` }

function clearFilters() {
  keyword.value = ''
  status.value = ''
  parkId.value = ''
}

function onEmptyPrimary() {
  if (filteredOut.value) {
    clearFilters()
    return
  }
  void router.push('/analytics/new')
}
</script>

<template>
  <section>
    <PageHeader
      eyebrow="数据分析"
      title="数据分析"
      subtitle="这里仍只登记阶段快报。地图和指标图在产业驾驶舱。"
    >
      <template #extra>
        <ScreenJump scene="situation">招商态势</ScreenJump>
        <a-button type="primary" @click="router.push('/analytics/new')">新建快报</a-button>
      </template>
    </PageHeader>
    <a-alert
      class="notice"
      type="info"
      show-icon
      message="快报仍只保存文字和数值。转化率、签约额和空置图在产业驾驶舱。"
    />
    <div class="kpi-grid">
      <KpiStat label="已发布" :value="published" hint="可以对外转述的快报" />
      <KpiStat label="草稿" :value="drafts" hint="还没核对" />
      <KpiStat label="快报条数" :value="store.reports.length" hint="含三园合计" />
      <KpiStat label="驾驶舱" value="已接入" hint="从右上角进入" />
    </div>
    <div class="filter-bar">
      <a-input-search v-model:value="keyword" class="keyword" allow-clear placeholder="搜索快报、指标、周期或数值" />
      <a-select v-model:value="status" class="filter" :options="toOptions(reportStatuses, '全部状态')" />
      <a-select v-model:value="parkId" class="filter" :options="parkOptions" />
    </div>
    <div class="panel">
      <a-table :columns="columns" :data-source="rows" :pagination="pagination" row-key="id" :scroll="{ x: 1040 }">
        <template #emptyText>
          <EmptyState
            :variant="filteredOut ? 'search' : 'empty'"
            :title="filteredOut ? '没有符合条件的快报' : '还没有阶段快报'"
            :description="filteredOut ? '换一个关键词，或清空筛选后再看。' : '先写一条周期、指标和数值。图在产业驾驶舱。'"
            :primary-text="filteredOut ? '清空筛选' : '新建快报'"
            :secondary-text="filteredOut ? '新建快报' : ''"
            @primary="onEmptyPrimary"
            @secondary="router.push('/analytics/new')"
          />
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'title'">
            <button class="linkish" type="button" @click="router.push(`/analytics/${record.id}`)">{{ record.title }}</button>
          </template>
          <template v-else-if="column.key === 'status'">
            <StatusTag :value="record.status" />
          </template>
          <template v-else-if="column.key === 'park'">{{ parkLabel(record.parkId) }}</template>
        </template>
      </a-table>
    </div>
  </section>
</template>

<style scoped>
.notice {
  margin-bottom: 14px;
}
</style>
