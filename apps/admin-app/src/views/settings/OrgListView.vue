<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { TableColumnsType } from 'ant-design-vue'
import EmptyState from '@/components/EmptyState.vue'
import PageHeader from '@/components/PageHeader.vue'
import SettingsNav from '@/components/SettingsNav.vue'
import StatusTag from '@/components/StatusTag.vue'
import { includesKeyword } from '@/mock/helpers'
import { orgKinds, parkFilterOptions, toOptions } from '@/mock/options'
import { parkShortName } from '@/mock/parks'
import type { OrgUnit } from '@/mock/ops-types'
import { useOpsStore } from '@/stores/ops'

const store = useOpsStore()
const router = useRouter()
const keyword = ref('')
const kind = ref('')
const parkId = ref('')

const rows = computed(() =>
  store.orgs.filter((item) => {
    if (kind.value && item.kind !== kind.value) return false
    if (parkId.value && item.parkId !== parkId.value) return false
    return includesKeyword([item.name, item.code, item.leader, item.parentName], keyword.value)
  }),
)

const filteredOut = computed(() => rows.value.length === 0 && store.orgs.length > 0)

const columns: TableColumnsType<OrgUnit> = [
  { title: '编号', dataIndex: 'code', width: 130 },
  { title: '名称', key: 'name', dataIndex: 'name', ellipsis: true },
  { title: '类型', key: 'kind', dataIndex: 'kind', width: 90 },
  { title: '园区', key: 'park', width: 110 },
  { title: '上级', dataIndex: 'parentName', ellipsis: true },
  { title: '负责人', dataIndex: 'leader', width: 100 },
]

const pagination = { pageSize: 8, showSizeChanger: false, showTotal: (total: number) => `共 ${total} 条` }

function clearFilters() {
  keyword.value = ''
  kind.value = ''
  parkId.value = ''
}

function onEmptyPrimary() {
  if (filteredOut.value) {
    clearFilters()
    return
  }
  void router.push('/settings/orgs/new')
}
</script>

<template>
  <section>
    <PageHeader eyebrow="系统设置" title="组织架构" subtitle="园区运营主体、部门和岗位。合同甲方名称从这里对。">
      <template #extra>
        <a-button type="primary" @click="router.push('/settings/orgs/new')">新建组织</a-button>
      </template>
    </PageHeader>
    <SettingsNav />
    <div class="filter-bar">
      <a-input-search v-model:value="keyword" class="keyword" allow-clear placeholder="搜索名称、负责人或上级" />
      <a-select v-model:value="kind" class="filter" :options="toOptions(orgKinds, '全部类型')" />
      <a-select v-model:value="parkId" class="filter" :options="parkFilterOptions" />
    </div>
    <div class="panel">
      <a-table :columns="columns" :data-source="rows" :pagination="pagination" row-key="id" :scroll="{ x: 920 }">
        <template #emptyText>
          <EmptyState
            :title="filteredOut ? '没有符合条件的组织' : '还没有组织'"
            :description="filteredOut ? '换一个关键词，或清空筛选后再看。' : '先记下运营公司和部门。'"
            :primary="filteredOut ? '清空筛选' : '新建组织'"
            :secondary="filteredOut ? '新建组织' : ''"
            @primary-click="onEmptyPrimary"
            @secondary-click="router.push('/settings/orgs/new')"
          />
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <button class="linkish" type="button" @click="router.push(`/settings/orgs/${record.id}`)">{{ record.name }}</button>
          </template>
          <template v-else-if="column.key === 'kind'">
            <StatusTag :value="record.kind" />
          </template>
          <template v-else-if="column.key === 'park'">{{ parkShortName(record.parkId) }}</template>
          <template v-else-if="column.dataIndex === 'parentName'">{{ record.parentName || '—' }}</template>
        </template>
      </a-table>
    </div>
  </section>
</template>
