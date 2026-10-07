<script setup lang="ts">
import { PageHeader, EmptyState, KpiStat } from '@park/components'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { TableColumnsType } from 'ant-design-vue'
import StatusTag from '@/components/StatusTag.vue'
import { includesKeyword } from '@/mock/helpers'
import { eventKinds, eventStatuses, parkFilterOptions, toOptions } from '@/mock/options'
import { parkShortName } from '@/mock/parks'
import type { PromotionEvent } from '@/mock/ops-types'
import { useOpsStore } from '@/stores/ops'

const store = useOpsStore()
const router = useRouter()
const keyword = ref('')
const status = ref('')
const kind = ref('')
const parkId = ref('')

const rows = computed(() =>
  store.events.filter((item) => {
    if (status.value && item.status !== status.value) return false
    if (kind.value && item.kind !== kind.value) return false
    if (parkId.value && item.parkId !== parkId.value) return false
    return includesKeyword([item.title, item.code, item.place, item.host, item.channel, item.guests], keyword.value)
  }),
)

const filteredOut = computed(() => rows.value.length === 0 && store.events.length > 0)
const upcoming = computed(() => store.events.filter((item) => item.status === '筹备中' || item.status === '待接待').length)
const hosting = computed(() => store.events.filter((item) => item.status === '待接待').length)
const live = computed(() => store.events.filter((item) => item.status === '进行中').length)

const columns: TableColumnsType<PromotionEvent> = [
  { title: '编号', dataIndex: 'code', width: 130 },
  { title: '活动', key: 'title', dataIndex: 'title', ellipsis: true },
  { title: '类型', key: 'kind', dataIndex: 'kind', width: 110 },
  { title: '状态', key: 'status', dataIndex: 'status', width: 100 },
  { title: '园区', key: 'park', width: 110 },
  { title: '日期', dataIndex: 'heldAt', width: 120 },
  { title: '主持', dataIndex: 'host', width: 90 },
]

const pagination = { pageSize: 8, showSizeChanger: false, showTotal: (total: number) => `共 ${total} 条` }

function clearFilters() {
  keyword.value = ''
  status.value = ''
  kind.value = ''
  parkId.value = ''
}

function onEmptyPrimary() {
  if (filteredOut.value) {
    clearFilters()
    return
  }
  void router.push('/promotion/new')
}
</script>

<template>
  <section>
    <PageHeader eyebrow="投资促进" title="投资促进" subtitle="推介会、来园考察、渠道沙龙和外出招商记在这里。活动本身不替代线索和项目。">
      <template #extra>
        <a-button type="primary" @click="router.push('/promotion/new')">新建活动</a-button>
      </template>
    </PageHeader>
    <div class="kpi-grid">
      <KpiStat label="近期活动" :value="upcoming" hint="筹备中与待接待" />
      <KpiStat label="待接待" :value="hosting" hint="来园场次还没发生" />
      <KpiStat label="进行中" :value="live" hint="人已经在路上或在现场" />
      <KpiStat label="活动条数" :value="store.events.length" hint="含已结束" />
    </div>
    <div class="filter-bar">
      <a-input-search v-model:value="keyword" class="keyword" allow-clear placeholder="搜索活动、地点、主持或渠道" />
      <a-select v-model:value="status" class="filter" :options="toOptions(eventStatuses, '全部状态')" />
      <a-select v-model:value="kind" class="filter" :options="toOptions(eventKinds, '全部类型')" />
      <a-select v-model:value="parkId" class="filter" :options="parkFilterOptions" />
    </div>
    <div class="panel">
      <a-table :columns="columns" :data-source="rows" :pagination="pagination" row-key="id" :scroll="{ x: 1000 }">
        <template #emptyText>
          <EmptyState
            :variant="filteredOut ? 'search' : 'empty'"
            :title="filteredOut ? '没有符合条件的活动' : '还没有促进活动'"
            :description="filteredOut ? '换一个关键词，或清空筛选后再看。' : '先记一场推介会或来园考察。'"
            :primary-text="filteredOut ? '清空筛选' : '新建活动'"
            :secondary-text="filteredOut ? '新建活动' : ''"
            @primary="onEmptyPrimary"
            @secondary="router.push('/promotion/new')"
          />
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'title'">
            <button class="linkish" type="button" @click="router.push(`/promotion/${record.id}`)">{{ record.title }}</button>
          </template>
          <template v-else-if="column.key === 'kind'">
            <StatusTag :value="record.kind" />
          </template>
          <template v-else-if="column.key === 'status'">
            <StatusTag :value="record.status" />
          </template>
          <template v-else-if="column.key === 'park'">{{ parkShortName(record.parkId) }}</template>
        </template>
      </a-table>
    </div>
  </section>
</template>
