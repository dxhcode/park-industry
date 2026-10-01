<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { TableColumnsType } from 'ant-design-vue'
import KpiStat from '@/components/KpiStat.vue'
import PageHeader from '@/components/PageHeader.vue'
import StatusTag from '@/components/StatusTag.vue'
import { includesKeyword } from '@/mock/helpers'
import { performanceStatuses, toOptions } from '@/mock/options'
import type { PerformanceNode } from '@/mock/types'
import { usePipelineStore } from '@/stores/pipeline'

const store = usePipelineStore()
const router = useRouter()
const keyword = ref('')
const status = ref('')

const rows = computed(() =>
  store.performances.filter((item) => {
    if (status.value && item.status !== status.value) return false
    const contract = store.contractById(item.contractId)
    return includesKeyword([item.name, item.code, item.metric, item.owner, contract?.title ?? '', contract?.code ?? ''], keyword.value)
  }),
)

const normal = computed(() => store.performances.filter((item) => item.status === '正常履约').length)
const soon = computed(() => store.performances.filter((item) => item.status === '即将到期').length)
const late = computed(() => store.performances.filter((item) => item.status === '逾期').length)
const done = computed(() => store.performances.filter((item) => item.status === '已完成').length)

const columns: TableColumnsType<PerformanceNode> = [
  { title: '编号', dataIndex: 'code', width: 140 },
  { title: '节点', key: 'name', dataIndex: 'name' },
  { title: '状态', key: 'status', width: 110 },
  { title: '到期日', dataIndex: 'dueAt', width: 120 },
  { title: '指标', dataIndex: 'metric', ellipsis: true },
  { title: '合同', key: 'contract', ellipsis: true },
  { title: '责任人', dataIndex: 'owner', width: 90 },
]

const pagination = { pageSize: 8, showSizeChanger: false, showTotal: (total: number) => `共 ${total} 条` }

function contractLabel(id: string) {
  const contract = store.contractById(id)
  return contract ? `${contract.code} ${contract.title}` : '合同已删除'
}
</script>

<template>
  <section>
    <PageHeader eyebrow="签约管理" title="履约" subtitle="跟踪投资、开工、进场和投产节点。节点挂在合同上。">
      <template #extra>
        <a-button type="primary" @click="router.push('/signing/performance/new')">登记节点</a-button>
      </template>
    </PageHeader>
    <div class="kpi-grid">
      <KpiStat label="正常履约" :value="normal" hint="未到风险窗口" />
      <KpiStat label="即将到期" :value="soon" hint="需要本周催办" />
      <KpiStat label="逾期" :value="late" hint="已过节点日" />
      <KpiStat label="已完成" :value="done" hint="资料已归档" />
    </div>
    <div class="filter-bar">
      <a-input-search v-model:value="keyword" class="keyword" allow-clear placeholder="搜索节点、合同或指标" />
      <a-select v-model:value="status" class="filter" :options="toOptions(performanceStatuses, '全部状态')" />
    </div>
    <div class="panel">
      <a-table :columns="columns" :data-source="rows" :pagination="pagination" row-key="id" :scroll="{ x: 980 }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <button class="linkish" type="button" @click="router.push(`/signing/performance/${record.id}`)">{{ record.name }}</button>
          </template>
          <template v-else-if="column.key === 'status'"><StatusTag :value="record.status" /></template>
          <template v-else-if="column.key === 'contract'">
            <button class="linkish" type="button" @click="router.push(`/signing/contracts/${record.contractId}`)">
              {{ contractLabel(record.contractId) }}
            </button>
          </template>
        </template>
      </a-table>
    </div>
  </section>
</template>
