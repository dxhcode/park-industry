<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { TableColumnsType } from 'ant-design-vue'
import KpiStat from '@/components/KpiStat.vue'
import PageHeader from '@/components/PageHeader.vue'
import ScreenJump from '@/components/ScreenJump.vue'
import StatusTag from '@/components/StatusTag.vue'
import { includesKeyword } from '@/mock/helpers'
import { leadStatuses, parkFilterOptions, toOptions } from '@/mock/options'
import { parkShortName } from '@/mock/parks'
import type { Lead } from '@/mock/types'
import { usePipelineStore } from '@/stores/pipeline'

const store = usePipelineStore()
const router = useRouter()
const keyword = ref('')
const status = ref('')
const parkId = ref('')

const rows = computed(() =>
  store.leads.filter((item) => {
    if (status.value && item.status !== status.value) return false
    if (parkId.value && item.parkId !== parkId.value) return false
    return includesKeyword([item.company, item.code, item.industry, item.owner, item.contact], keyword.value)
  }),
)

const fresh = computed(() => store.leads.filter((item) => item.status === '新线索').length)
const following = computed(() => store.leads.filter((item) => item.status === '跟进中').length)
const converted = computed(() => store.leads.filter((item) => item.status === '已转化').length)

const columns: TableColumnsType<Lead> = [
  { title: '编号', dataIndex: 'code', width: 140 },
  { title: '企业', key: 'company', dataIndex: 'company', ellipsis: true },
  { title: '产业', dataIndex: 'industry', width: 110 },
  { title: '状态', key: 'status', width: 100 },
  { title: '来源', dataIndex: 'source', width: 110 },
  { title: '园区', key: 'park', width: 110 },
  { title: '跟进人', dataIndex: 'owner', width: 90 },
  { title: '登记日期', dataIndex: 'createdAt', width: 120 },
  { title: '关联项目', key: 'project', ellipsis: true },
]

const pagination = { pageSize: 8, showSizeChanger: false, showTotal: (total: number) => `共 ${total} 条` }

function projectLabel(id: string) {
  if (!id) return '未转化'
  const project = store.projectById(id)
  return project ? project.name : '项目已删除'
}
</script>

<template>
  <section>
    <PageHeader eyebrow="产业招商" title="线索" subtitle="推介会、渠道和主动咨询进来的线索。转化后会挂到项目库。">
      <template #extra>
        <ScreenJump scene="situation">招商态势</ScreenJump>
        <a-button type="primary" @click="router.push('/investment/leads/new')">登记线索</a-button>
      </template>
    </PageHeader>
    <div class="kpi-grid">
      <KpiStat label="新线索" :value="fresh" hint="尚未分配跟进动作" />
      <KpiStat label="跟进中" :value="following" hint="已联系、未建项" />
      <KpiStat label="已转化" :value="converted" hint="已进入项目库" />
      <KpiStat label="线索合计" :value="store.leads.length" hint="含无效" />
    </div>
    <div class="filter-bar">
      <a-input-search v-model:value="keyword" class="keyword" allow-clear placeholder="搜索企业、编号或跟进人" />
      <a-select v-model:value="status" class="filter" :options="toOptions(leadStatuses, '全部状态')" />
      <a-select v-model:value="parkId" class="filter" :options="parkFilterOptions" />
    </div>
    <div class="panel">
      <a-table :columns="columns" :data-source="rows" :pagination="pagination" row-key="id" :scroll="{ x: 1080 }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'company'">
            <button class="linkish" type="button" @click="router.push(`/investment/leads/${record.id}`)">{{ record.company }}</button>
          </template>
          <template v-else-if="column.key === 'status'"><StatusTag :value="record.status" /></template>
          <template v-else-if="column.key === 'park'">{{ parkShortName(record.parkId) }}</template>
          <template v-else-if="column.key === 'project'">
            <button v-if="record.projectId" class="linkish" type="button" @click="router.push(`/investment/projects/${record.projectId}`)">
              {{ projectLabel(record.projectId) }}
            </button>
            <span v-else>未转化</span>
          </template>
        </template>
      </a-table>
    </div>
  </section>
</template>
