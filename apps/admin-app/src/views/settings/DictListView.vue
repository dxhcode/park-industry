<script setup lang="ts">
import { PageHeader, EmptyState } from '@park/components'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { TableColumnsType } from 'ant-design-vue'
import SettingsNav from '@/components/SettingsNav.vue'
import StatusTag from '@/components/StatusTag.vue'
import { includesKeyword } from '@/mock/helpers'
import { dictStates, toOptions } from '@/mock/options'
import type { DictEntry } from '@/mock/ops-types'
import { useOpsStore } from '@/stores/ops'

const store = useOpsStore()
const router = useRouter()
const keyword = ref('')
const category = ref('')
const state = ref('')

const categories = computed(() => {
  const values = [...new Set(store.dicts.map((item) => item.category))]
  return [{ label: '全部分类', value: '' }, ...values.map((item) => ({ label: item, value: item }))]
})

const rows = computed(() =>
  store.dicts.filter((item) => {
    if (category.value && item.category !== category.value) return false
    if (state.value && item.state !== state.value) return false
    return includesKeyword([item.label, item.code, item.category, item.value], keyword.value)
  }),
)

const filteredOut = computed(() => rows.value.length === 0 && store.dicts.length > 0)

const columns: TableColumnsType<DictEntry> = [
  { title: '编号', dataIndex: 'code', width: 130 },
  { title: '名称', key: 'label', dataIndex: 'label' },
  { title: '分类', dataIndex: 'category', width: 120 },
  { title: '编码', dataIndex: 'value', width: 140 },
  { title: '状态', key: 'state', dataIndex: 'state', width: 90 },
]

const pagination = { pageSize: 8, showSizeChanger: false, showTotal: (total: number) => `共 ${total} 条` }

function clearFilters() {
  keyword.value = ''
  category.value = ''
  state.value = ''
}

function onEmptyPrimary() {
  if (filteredOut.value) {
    clearFilters()
    return
  }
  void router.push('/settings/dicts/new')
}
</script>

<template>
  <section>
    <PageHeader eyebrow="系统设置" title="数据字典" subtitle="产业、阶段、空间和政策用词放在字典里。停用的条目不再建议新选，历史数据仍保留。">
      <template #extra>
        <a-button type="primary" @click="router.push('/settings/dicts/new')">新建字典</a-button>
      </template>
    </PageHeader>
    <SettingsNav />
    <div class="filter-bar">
      <a-input-search v-model:value="keyword" class="keyword" allow-clear placeholder="搜索名称、分类或编码" />
      <a-select v-model:value="category" class="filter" :options="categories" />
      <a-select v-model:value="state" class="filter" :options="toOptions(dictStates, '全部状态')" />
    </div>
    <div class="panel">
      <a-table :columns="columns" :data-source="rows" :pagination="pagination" row-key="id" :scroll="{ x: 820 }">
        <template #emptyText>
          <EmptyState
            :variant="filteredOut ? 'search' : 'empty'"
            :title="filteredOut ? '没有符合条件的字典' : '还没有字典'"
            :description="filteredOut ? '换一个关键词，或清空筛选后再看。' : '先加一条产业分类或空间状态。'"
            :primary-text="filteredOut ? '清空筛选' : '新建字典'"
            :secondary-text="filteredOut ? '新建字典' : ''"
            @primary="onEmptyPrimary"
            @secondary="router.push('/settings/dicts/new')"
          />
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'label'">
            <button class="linkish" type="button" @click="router.push(`/settings/dicts/${record.id}`)">{{ record.label }}</button>
          </template>
          <template v-else-if="column.key === 'state'">
            <StatusTag :value="record.state" />
          </template>
        </template>
      </a-table>
    </div>
  </section>
</template>
