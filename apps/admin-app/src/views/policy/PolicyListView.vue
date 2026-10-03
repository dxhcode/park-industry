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
import { parkFilterOptions, policyStatuses, toOptions } from '@/mock/options'
import { parkShortName } from '@/mock/parks'
import type { PolicyClaim } from '@/mock/ops-types'
import { useOpsStore } from '@/stores/ops'

const store = useOpsStore()
const router = useRouter()
const keyword = ref('')
const status = ref('')
const parkId = ref('')

const rows = computed(() =>
  store.policies.filter((item) => {
    if (status.value && item.status !== status.value) return false
    if (parkId.value && item.parkId !== parkId.value) return false
    return includesKeyword([item.title, item.code, item.policyName, item.enterpriseName, item.owner], keyword.value)
  }),
)

const filteredOut = computed(() => rows.value.length === 0 && store.policies.length > 0)
const applying = computed(() => store.policies.filter((item) => item.status === '申报中').length)
const reviewing = computed(() => store.policies.filter((item) => item.status === '审核中').length)
const paying = computed(() => store.policies.filter((item) => item.status === '待兑付').length)

const columns: TableColumnsType<PolicyClaim> = [
  { title: '编号', dataIndex: 'code', width: 130 },
  { title: '申报', key: 'title', dataIndex: 'title', ellipsis: true },
  { title: '企业', dataIndex: 'enterpriseName', ellipsis: true },
  { title: '状态', key: 'status', dataIndex: 'status', width: 100 },
  { title: '园区', key: 'park', width: 110 },
  { title: '额度', dataIndex: 'amount', width: 120 },
  { title: '经办', dataIndex: 'owner', width: 90 },
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
  void router.push('/policy/new')
}
</script>

<template>
  <section>
    <PageHeader eyebrow="政策兑现" title="政策兑现" subtitle="申报、审核和兑付分开记。退回的材料留在列表里，补齐后可以改回申报中。">
      <template #extra>
        <ScreenJump scene="policy">政策兑现</ScreenJump>
        <a-button type="primary" @click="router.push('/policy/new')">新建申报</a-button>
      </template>
    </PageHeader>
    <div class="kpi-grid">
      <KpiStat label="申报中" :value="applying" hint="材料还没收齐" />
      <KpiStat label="审核中" :value="reviewing" hint="已受理，未到拨付" />
      <KpiStat label="待兑付" :value="paying" hint="审核已过" />
      <KpiStat label="申报条数" :value="store.policies.length" hint="含已兑付和退回" />
    </div>
    <div class="filter-bar">
      <a-input-search v-model:value="keyword" class="keyword" allow-clear placeholder="搜索政策、企业、编号或经办人" />
      <a-select v-model:value="status" class="filter" :options="toOptions(policyStatuses, '全部状态')" />
      <a-select v-model:value="parkId" class="filter" :options="parkFilterOptions" />
    </div>
    <div class="panel">
      <a-table :columns="columns" :data-source="rows" :pagination="pagination" row-key="id" :scroll="{ x: 1000 }">
        <template #emptyText>
          <EmptyState
            :title="filteredOut ? '没有符合条件的申报' : '还没有政策申报'"
            :description="filteredOut ? '换一个关键词，或清空筛选后再看。' : '从一条扶持申报开始，记下企业和额度。'"
            :primary="filteredOut ? '清空筛选' : '新建申报'"
            :secondary="filteredOut ? '新建申报' : ''"
            @primary-click="onEmptyPrimary"
            @secondary-click="router.push('/policy/new')"
          />
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'title'">
            <button class="linkish" type="button" @click="router.push(`/policy/${record.id}`)">{{ record.title }}</button>
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
