<script setup lang="ts">
import { PageHeader, EmptyState, KpiStat } from '@park/components'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { TableColumnsType } from 'ant-design-vue'
import ScreenJump from '@/components/ScreenJump.vue'
import StatusTag from '@/components/StatusTag.vue'
import { formatArea, includesKeyword } from '@/mock/helpers'
import { parkFilterOptions, spaceKinds, spaceStatuses, toOptions } from '@/mock/options'
import { parkShortName } from '@/mock/parks'
import type { SpaceUnit } from '@/mock/ops-types'
import { useOpsStore } from '@/stores/ops'

const store = useOpsStore()
const router = useRouter()
const keyword = ref('')
const status = ref('')
const kind = ref('')
const parkId = ref('')

const rows = computed(() =>
  store.spaces.filter((item) => {
    if (status.value && item.status !== status.value) return false
    if (kind.value && item.kind !== kind.value) return false
    if (parkId.value && item.parkId !== parkId.value) return false
    return includesKeyword([item.name, item.code, item.building, item.tenant, item.floor], keyword.value)
  }),
)

const filteredOut = computed(() => rows.value.length === 0 && store.spaces.length > 0)
const openArea = computed(() =>
  formatArea(store.spaces.filter((item) => item.status === '可招商' || item.status === '空置').reduce((sum, item) => sum + item.areaSqm, 0)),
)
const leased = computed(() => store.spaces.filter((item) => item.status === '在租').length)
const vacant = computed(() => store.spaces.filter((item) => item.status === '空置').length)

const columns: TableColumnsType<SpaceUnit> = [
  { title: '编号', dataIndex: 'code', width: 130 },
  { title: '资源', key: 'name', dataIndex: 'name', ellipsis: true },
  { title: '类型', key: 'kind', dataIndex: 'kind', width: 100 },
  { title: '状态', key: 'status', dataIndex: 'status', width: 100 },
  { title: '园区', key: 'park', width: 110 },
  { title: '面积', key: 'area', width: 120 },
  { title: '承租方', dataIndex: 'tenant', ellipsis: true },
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
  void router.push('/space/new')
}
</script>

<template>
  <section>
    <PageHeader eyebrow="产业空间" title="产业空间" subtitle="楼层和厂房按可招商、在租、空置分开记。在谈但没锁房的，状态仍是可招商。">
      <template #extra>
        <ScreenJump scene="space">空间利用</ScreenJump>
        <a-button type="primary" @click="router.push('/space/new')">新建资源</a-button>
      </template>
    </PageHeader>
    <div class="kpi-grid">
      <KpiStat label="可招商或空置" :value="openArea" hint="面积合计，不含在租和装修" />
      <KpiStat label="在租资源" :value="leased" hint="已有承租方" />
      <KpiStat label="空置资源" :value="vacant" hint="未在谈、也未出租" />
      <KpiStat label="资源条数" :value="store.spaces.length" hint="含配套公寓" />
    </div>
    <div class="filter-bar">
      <a-input-search v-model:value="keyword" class="keyword" allow-clear placeholder="搜索楼栋、楼层、编号或承租方" />
      <a-select v-model:value="status" class="filter" :options="toOptions(spaceStatuses, '全部状态')" />
      <a-select v-model:value="kind" class="filter" :options="toOptions(spaceKinds, '全部类型')" />
      <a-select v-model:value="parkId" class="filter" :options="parkFilterOptions" />
    </div>
    <div class="panel">
      <a-table :columns="columns" :data-source="rows" :pagination="pagination" row-key="id" :scroll="{ x: 1040 }">
        <template #emptyText>
          <EmptyState
            :variant="filteredOut ? 'search' : 'empty'"
            :title="filteredOut ? '没有符合条件的空间' : '还没有空间资源'"
            :description="filteredOut ? '换一个关键词，或清空筛选后再看。' : '先把楼层或厂房记下来，再标可招商还是在租。'"
            :primary-text="filteredOut ? '清空筛选' : '新建资源'"
            :secondary-text="filteredOut ? '新建资源' : ''"
            @primary="onEmptyPrimary"
            @secondary="router.push('/space/new')"
          />
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <button class="linkish" type="button" @click="router.push(`/space/${record.id}`)">{{ record.name }}</button>
          </template>
          <template v-else-if="column.key === 'kind'">
            <StatusTag :value="record.kind" />
          </template>
          <template v-else-if="column.key === 'status'">
            <StatusTag :value="record.status" />
          </template>
          <template v-else-if="column.key === 'park'">{{ parkShortName(record.parkId) }}</template>
          <template v-else-if="column.key === 'area'">{{ formatArea(record.areaSqm) }}</template>
          <template v-else-if="column.dataIndex === 'tenant'">{{ record.tenant || '—' }}</template>
        </template>
      </a-table>
    </div>
  </section>
</template>
