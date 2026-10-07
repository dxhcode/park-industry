<script setup lang="ts">
import { PageHeader, EmptyState, KpiStat } from '@park/components'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { TableColumnsType } from 'ant-design-vue'
import ScreenJump from '@/components/ScreenJump.vue'
import StatusTag from '@/components/StatusTag.vue'
import { includesKeyword } from '@/mock/helpers'
import { parkFilterOptions, toOptions, visitStatuses } from '@/mock/options'
import { parkShortName } from '@/mock/parks'
import type { Visit } from '@/mock/types'
import { usePipelineStore } from '@/stores/pipeline'

const store = usePipelineStore()
const router = useRouter()
const keyword = ref('')
const status = ref('')
const parkId = ref('')

const rows = computed(() =>
  store.visits.filter((item) => {
    if (status.value && item.status !== status.value) return false
    if (parkId.value && item.parkId !== parkId.value) return false
    return includesKeyword([item.title, item.code, item.host, item.guests], keyword.value)
  }),
)

const filteredOut = computed(() => rows.value.length === 0 && store.visits.length > 0)
const upcoming = computed(() => store.visits.filter((item) => item.status === '待进行').length)
const notes = computed(() => store.visits.filter((item) => item.status === '待纪要').length)
const done = computed(() => store.visits.filter((item) => item.status === '已完成').length)

const columns: TableColumnsType<Visit> = [
  { title: '编号', dataIndex: 'code', width: 140 },
  { title: '主题', key: 'title', dataIndex: 'title', ellipsis: true },
  { title: '类型', key: 'kind', width: 110 },
  { title: '状态', key: 'status', width: 100 },
  { title: '时间', dataIndex: 'visitAt', width: 160 },
  { title: '园区', key: 'park', width: 110 },
  { title: '主陪', dataIndex: 'host', width: 90 },
  { title: '关联', key: 'link', ellipsis: true },
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
  void router.push('/investment/visits/new')
}

function linkLabel(item: Visit) {
  if (item.projectId) return store.projectById(item.projectId)?.name ?? '项目已删除'
  if (item.leadId) return store.leadById(item.leadId)?.company ?? '线索已删除'
  return '未关联'
}

function openLink(item: Visit) {
  if (item.projectId) {
    void router.push(`/investment/projects/${item.projectId}`)
    return
  }
  if (item.leadId) void router.push(`/investment/leads/${item.leadId}`)
}
</script>

<template>
  <section>
    <PageHeader eyebrow="产业招商" title="拜访" subtitle="来园接待和外出拜访。记录挂在项目或线索上。">
      <template #extra>
        <ScreenJump scene="situation">招商态势</ScreenJump>
        <a-button type="primary" @click="router.push('/investment/visits/new')">登记拜访</a-button>
      </template>
    </PageHeader>
    <div class="kpi-grid">
      <KpiStat label="待进行" :value="upcoming" hint="已排期" />
      <KpiStat label="待纪要" :value="notes" hint="见过面、还没归档" />
      <KpiStat label="已完成" :value="done" hint="纪要已写" />
      <KpiStat label="拜访合计" :value="store.visits.length" hint="含历史记录" />
    </div>
    <div class="filter-bar">
      <a-input-search v-model:value="keyword" class="keyword" allow-clear placeholder="搜索主题、主陪或来宾" />
      <a-select v-model:value="status" class="filter" :options="toOptions(visitStatuses, '全部状态')" />
      <a-select v-model:value="parkId" class="filter" :options="parkFilterOptions" />
    </div>
    <div class="panel">
      <a-table :columns="columns" :data-source="rows" :pagination="pagination" row-key="id" :scroll="{ x: 1080 }">
        <template #emptyText>
          <EmptyState
            :variant="filteredOut ? 'search' : 'empty'"
            :title="filteredOut ? '没有符合条件的拜访' : '还没有拜访'"
            :description="filteredOut ? '换一个关键词，或清空筛选后再看。' : '登记时至少挂到一个项目或一条线索。'"
            :primary-text="filteredOut ? '清空筛选' : '登记拜访'"
            :secondary-text="filteredOut ? '登记拜访' : ''"
            @primary="onEmptyPrimary"
            @secondary="router.push('/investment/visits/new')"
          />
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'title'">
            <button class="linkish" type="button" @click="router.push(`/investment/visits/${record.id}`)">{{ record.title }}</button>
          </template>
          <template v-else-if="column.key === 'kind'"><StatusTag :value="record.kind" /></template>
          <template v-else-if="column.key === 'status'"><StatusTag :value="record.status" /></template>
          <template v-else-if="column.key === 'park'">{{ parkShortName(record.parkId) }}</template>
          <template v-else-if="column.key === 'link'">
            <button v-if="record.projectId || record.leadId" class="linkish" type="button" @click="openLink(record)">
              {{ linkLabel(record) }}
            </button>
            <span v-else>未关联</span>
          </template>
        </template>
      </a-table>
    </div>
  </section>
</template>
