<script setup lang="ts">
import { PageHeader, EmptyState } from '@park/components'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { TableColumnsType } from 'ant-design-vue'
import SettingsNav from '@/components/SettingsNav.vue'
import StatusTag from '@/components/StatusTag.vue'
import { includesKeyword } from '@/mock/helpers'
import { parkFilterOptions, roleStates, toOptions } from '@/mock/options'
import { parkShortName } from '@/mock/parks'
import type { RoleGrant } from '@/mock/ops-types'
import { useOpsStore } from '@/stores/ops'

const store = useOpsStore()
const router = useRouter()
const keyword = ref('')
const state = ref('')
const parkId = ref('')

const rows = computed(() =>
  store.roles.filter((item) => {
    if (state.value && item.state !== state.value) return false
    if (parkId.value && item.parkId !== parkId.value) return false
    return includesKeyword([item.person, item.username, item.role, item.scope, item.code], keyword.value)
  }),
)

const filteredOut = computed(() => rows.value.length === 0 && store.roles.length > 0)

const columns: TableColumnsType<RoleGrant> = [
  { title: '编号', dataIndex: 'code', width: 130 },
  { title: '姓名', key: 'person', dataIndex: 'person', width: 100 },
  { title: '角色', dataIndex: 'role', width: 120 },
  { title: '账号', dataIndex: 'username', width: 120 },
  { title: '状态', key: 'state', dataIndex: 'state', width: 90 },
  { title: '园区', key: 'park', width: 110 },
  { title: '范围', dataIndex: 'scope', ellipsis: true },
]

const pagination = { pageSize: 8, showSizeChanger: false, showTotal: (total: number) => `共 ${total} 条` }

function clearFilters() {
  keyword.value = ''
  state.value = ''
  parkId.value = ''
}

function onEmptyPrimary() {
  if (filteredOut.value) {
    clearFilters()
    return
  }
  void router.push('/settings/roles/new')
}
</script>

<template>
  <section>
    <PageHeader eyebrow="系统设置" title="角色权限" subtitle="三个演示账号可以登录。其余人员只是权限示意，改这里不会改掉登录密码。">
      <template #extra>
        <a-button type="primary" @click="router.push('/settings/roles/new')">新建权限</a-button>
      </template>
    </PageHeader>
    <SettingsNav />
    <a-alert class="notice" type="warning" show-icon message="能登录的只有 chenqm、zhoulan、liucheng，密码仍是 demo123。" />
    <div class="filter-bar">
      <a-input-search v-model:value="keyword" class="keyword" allow-clear placeholder="搜索姓名、账号、角色或范围" />
      <a-select v-model:value="state" class="filter" :options="toOptions(roleStates, '全部状态')" />
      <a-select v-model:value="parkId" class="filter" :options="parkFilterOptions" />
    </div>
    <div class="panel">
      <a-table :columns="columns" :data-source="rows" :pagination="pagination" row-key="id" :scroll="{ x: 980 }">
        <template #emptyText>
          <EmptyState
            :variant="filteredOut ? 'search' : 'empty'"
            :title="filteredOut ? '没有符合条件的权限' : '还没有角色权限'"
            :description="filteredOut ? '换一个关键词，或清空筛选后再看。' : '给一位同事记下角色和可见范围。这不会创建登录账号。'"
            :primary-text="filteredOut ? '清空筛选' : '新建权限'"
            :secondary-text="filteredOut ? '新建权限' : ''"
            @primary="onEmptyPrimary"
            @secondary="router.push('/settings/roles/new')"
          />
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'person'">
            <button class="linkish" type="button" @click="router.push(`/settings/roles/${record.id}`)">{{ record.person }}</button>
          </template>
          <template v-else-if="column.key === 'state'">
            <StatusTag :value="record.state" />
          </template>
          <template v-else-if="column.key === 'park'">{{ parkShortName(record.parkId) }}</template>
        </template>
      </a-table>
    </div>
  </section>
</template>

<style scoped>
.notice {
  margin-bottom: 14px;
}
</style>
