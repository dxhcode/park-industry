<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { TableColumnsType } from 'ant-design-vue'
import EmptyState from '@/components/EmptyState.vue'
import KpiStat from '@/components/KpiStat.vue'
import PageHeader from '@/components/PageHeader.vue'
import ScreenJump from '@/components/ScreenJump.vue'
import StatusTag from '@/components/StatusTag.vue'
import { includesKeyword } from '@/mock/helpers'
import { contractStatuses, parkFilterOptions, toOptions } from '@/mock/options'
import { parkShortName } from '@/mock/parks'
import type { SigningContract } from '@/mock/types'
import { usePipelineStore } from '@/stores/pipeline'

const store = usePipelineStore()
const router = useRouter()
const keyword = ref('')
const status = ref('')
const parkId = ref('')

const rows = computed(() =>
  store.contracts.filter((item) => {
    if (status.value && item.status !== status.value) return false
    if (parkId.value && item.parkId !== parkId.value) return false
    const projectName = store.projectById(item.projectId)?.name ?? ''
    return includesKeyword([item.title, item.code, item.partyB, item.owner, projectName], keyword.value)
  }),
)

const filteredOut = computed(() => rows.value.length === 0 && store.contracts.length > 0)
const drafting = computed(() => store.contracts.filter((item) => item.status === '起草中').length)
const pending = computed(() => store.contracts.filter((item) => item.status === '待签署').length)
const active = computed(() => store.contracts.filter((item) => item.status === '已生效' || item.status === '履行中').length)

const columns: TableColumnsType<SigningContract> = [
  { title: '编号', dataIndex: 'code', width: 130 },
  { title: '合同名称', key: 'title', dataIndex: 'title', ellipsis: true },
  { title: '类型', key: 'kind', dataIndex: 'kind', width: 110 },
  { title: '状态', key: 'status', dataIndex: 'status', width: 110 },
  { title: '签约主体', dataIndex: 'partyB', ellipsis: true },
  { title: '关联项目', key: 'project', ellipsis: true },
  { title: '园区', key: 'park', width: 110 },
  { title: '金额', dataIndex: 'amount', width: 120 },
  { title: '责任人', dataIndex: 'owner', width: 90 },
]

const pagination = {
  pageSize: 8,
  showSizeChanger: false,
  showTotal: (total: number) => `共 ${total} 条`,
}

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
  void router.push('/signing/contracts/new')
}

function projectName(id: string) {
  return store.projectById(id)?.name ?? '未关联项目'
}

function openDetail(id: string) {
  void router.push(`/signing/contracts/${id}`)
}
</script>

<template>
  <section>
    <PageHeader eyebrow="签约管理" title="合同" subtitle="登记投资协议、租赁合同和补充协议，并挂到对应招商项目。">
      <template #extra>
        <ScreenJump scene="signing">签约看板</ScreenJump>
        <a-button type="primary" @click="router.push('/signing/contracts/new')">新建合同</a-button>
      </template>
    </PageHeader>
    <div class="kpi-grid">
      <KpiStat label="起草中" :value="drafting" hint="条款还在改" />
      <KpiStat label="待签署" :value="pending" hint="文本已定、未盖章" />
      <KpiStat label="生效或履行" :value="active" hint="进入履约台账" />
      <KpiStat label="合同份数" :value="store.contracts.length" hint="当前台账" />
    </div>
    <div class="filter-bar">
      <a-input-search v-model:value="keyword" class="keyword" allow-clear placeholder="搜索合同、企业、项目或编号" />
      <a-select v-model:value="status" class="filter" :options="toOptions(contractStatuses, '全部状态')" />
      <a-select v-model:value="parkId" class="filter" :options="parkFilterOptions" />
    </div>
    <div class="panel">
      <a-table :columns="columns" :data-source="rows" :pagination="pagination" row-key="id" :scroll="{ x: 1100 }">
        <template #emptyText>
          <EmptyState
            :title="filteredOut ? '没有符合条件的合同' : '还没有合同'"
            :description="filteredOut ? '换一个关键词，或清空筛选后再看。' : '合同必须挂到一个招商项目。'"
            :primary="filteredOut ? '清空筛选' : '新建合同'"
            :secondary="filteredOut ? '新建合同' : ''"
            @primary-click="onEmptyPrimary"
            @secondary-click="router.push('/signing/contracts/new')"
          />
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'title'">
            <button class="linkish" type="button" @click="openDetail(record.id)">{{ record.title }}</button>
          </template>
          <template v-else-if="column.key === 'kind'"><StatusTag :value="record.kind" /></template>
          <template v-else-if="column.key === 'status'"><StatusTag :value="record.status" /></template>
          <template v-else-if="column.key === 'project'">
            <button class="linkish" type="button" @click="router.push(`/investment/projects/${record.projectId}`)">
              {{ projectName(record.projectId) }}
            </button>
          </template>
          <template v-else-if="column.key === 'park'">{{ parkShortName(record.parkId) }}</template>
        </template>
      </a-table>
    </div>
  </section>
</template>
