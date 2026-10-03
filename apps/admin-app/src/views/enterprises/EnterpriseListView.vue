<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { TableColumnsType } from 'ant-design-vue'
import EmptyState from '@/components/EmptyState.vue'
import KpiStat from '@/components/KpiStat.vue'
import PageHeader from '@/components/PageHeader.vue'
import ScreenJump from '@/components/ScreenJump.vue'
import StatusTag from '@/components/StatusTag.vue'
import { formatArea, includesKeyword } from '@/mock/helpers'
import { enterpriseStatuses, parkFilterOptions, toOptions } from '@/mock/options'
import { parkShortName } from '@/mock/parks'
import type { Enterprise } from '@/mock/ops-types'
import { useOpsStore } from '@/stores/ops'

const store = useOpsStore()
const router = useRouter()
const keyword = ref('')
const status = ref('')
const parkId = ref('')

const rows = computed(() =>
  store.enterprises.filter((item) => {
    if (status.value && item.status !== status.value) return false
    if (parkId.value && item.parkId !== parkId.value) return false
    return includesKeyword([item.name, item.code, item.industry, item.contact, item.location], keyword.value)
  }),
)

const filteredOut = computed(() => rows.value.length === 0 && store.enterprises.length > 0)
const inPark = computed(() => store.enterprises.filter((item) => item.status === '在园' || item.status === '重点').length)
const keyAccounts = computed(() => store.enterprises.filter((item) => item.status === '重点').length)
const incomplete = computed(() => store.enterprises.filter((item) => item.status === '待完善').length)

const columns: TableColumnsType<Enterprise> = [
  { title: '编号', dataIndex: 'code', width: 130 },
  { title: '企业', key: 'name', dataIndex: 'name', ellipsis: true },
  { title: '产业', dataIndex: 'industry', width: 110 },
  { title: '状态', key: 'status', dataIndex: 'status', width: 100 },
  { title: '园区', key: 'park', width: 110 },
  { title: '用房', key: 'area', width: 120 },
  { title: '联系人', dataIndex: 'contact', width: 90 },
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
  void router.push('/enterprises/new')
}
</script>

<template>
  <section>
    <PageHeader eyebrow="企业档案" title="企业档案" subtitle="在园、重点和尚未入驻的企业放在一起。名称与招商项目对齐，联系电话是虚构的。">
      <template #extra>
        <ScreenJump scene="enterprises">企业分布</ScreenJump>
        <a-button type="primary" @click="router.push('/enterprises/new')">新建档案</a-button>
      </template>
    </PageHeader>
    <div class="kpi-grid">
      <KpiStat label="在园企业" :value="inPark" hint="含重点企业" />
      <KpiStat label="重点企业" :value="keyAccounts" hint="单独盯投资和兑现" />
      <KpiStat label="待完善档案" :value="incomplete" hint="还没入驻或资料不全" />
      <KpiStat label="档案总数" :value="store.enterprises.length" hint="含已迁出" />
    </div>
    <div class="filter-bar">
      <a-input-search v-model:value="keyword" class="keyword" allow-clear placeholder="搜索企业、产业、联系人或位置" />
      <a-select v-model:value="status" class="filter" :options="toOptions(enterpriseStatuses, '全部状态')" />
      <a-select v-model:value="parkId" class="filter" :options="parkFilterOptions" />
    </div>
    <div class="panel">
      <a-table :columns="columns" :data-source="rows" :pagination="pagination" row-key="id" :scroll="{ x: 980 }">
        <template #emptyText>
          <EmptyState
            :title="filteredOut ? '没有符合条件的企业' : '还没有企业档案'"
            :description="filteredOut ? '换一个关键词，或清空筛选后再看。' : '建档后保存在本机，详情里可以跳回招商项目。'"
            :primary="filteredOut ? '清空筛选' : '新建档案'"
            :secondary="filteredOut ? '新建档案' : ''"
            @primary-click="onEmptyPrimary"
            @secondary-click="router.push('/enterprises/new')"
          />
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <button class="linkish" type="button" @click="router.push(`/enterprises/${record.id}`)">{{ record.name }}</button>
          </template>
          <template v-else-if="column.key === 'status'">
            <StatusTag :value="record.status" />
          </template>
          <template v-else-if="column.key === 'park'">{{ parkShortName(record.parkId) }}</template>
          <template v-else-if="column.key === 'area'">{{ formatArea(record.areaSqm) }}</template>
        </template>
      </a-table>
    </div>
  </section>
</template>
