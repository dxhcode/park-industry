<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { TableColumnsType } from 'ant-design-vue'
import KpiStat from '@/components/KpiStat.vue'
import PageHeader from '@/components/PageHeader.vue'
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

function linkLabel(item: Visit) {
  if (item.projectId) return store.projectById(item.projectId)?.name ?? '项目'
  if (item.leadId) return store.leadById(item.leadId)?.company ?? '线索'
  return '未关联'
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
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'title'">
            <button class="linkish" type="button" @click="router.push(`/investment/visits/${record.id}`)">{{ record.title }}</button>
          </template>
          <template v-else-if="column.key === 'kind'"><StatusTag :value="record.kind" /></template>
          <template v-else-if="column.key === 'status'"><StatusTag :value="record.status" /></template>
          <template v-else-if="column.key === 'park'">{{ parkShortName(record.parkId) }}</template>
          <template v-else-if="column.key === 'link'">{{ linkLabel(record) }}</template>
        </template>
      </a-table>
    </div>
  </section>
</template>
