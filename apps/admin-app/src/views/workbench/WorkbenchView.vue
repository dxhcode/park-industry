<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { TableColumnsType } from 'ant-design-vue'
import EmptyState from '@/components/EmptyState.vue'
import KpiStat from '@/components/KpiStat.vue'
import PageHeader from '@/components/PageHeader.vue'
import ScreenJump from '@/components/ScreenJump.vue'
import { screenHref } from '@/nav/screenLink'
import StatusTag from '@/components/StatusTag.vue'
import { includesKeyword } from '@/mock/helpers'
import { parkFilterOptions, taskKinds, taskStatuses, toOptions } from '@/mock/options'
import { parkShortName } from '@/mock/parks'
import type { WorkTask } from '@/mock/ops-types'
import { useOpsStore } from '@/stores/ops'
import { usePipelineStore } from '@/stores/pipeline'

const ops = useOpsStore()
const pipeline = usePipelineStore()
const router = useRouter()
const keyword = ref('')
const status = ref('')
const kind = ref('')
const parkId = ref('')

const openLeads = computed(() => pipeline.leads.filter((item) => item.status === '新线索' || item.status === '跟进中').length)
const talking = computed(() => pipeline.projects.filter((item) => ['初洽', '尽调', '谈判'].includes(item.stage)).length)
const upcomingVisits = computed(() => pipeline.visits.filter((item) => item.status === '待进行').length)
const openTasks = computed(() => ops.tasks.filter((item) => item.status !== '已完成').length)

const rows = computed(() =>
  ops.tasks.filter((item) => {
    if (status.value && item.status !== status.value) return false
    if (kind.value && item.kind !== kind.value) return false
    if (parkId.value && item.parkId !== parkId.value) return false
    return includesKeyword([item.title, item.code, item.owner, item.relatedLabel], keyword.value)
  }),
)

const filteredOut = computed(() => rows.value.length === 0 && ops.tasks.length > 0)

const columns: TableColumnsType<WorkTask> = [
  { title: '编号', dataIndex: 'code', width: 130 },
  { title: '待办', key: 'title', dataIndex: 'title', ellipsis: true },
  { title: '类型', key: 'kind', dataIndex: 'kind', width: 110 },
  { title: '状态', key: 'status', dataIndex: 'status', width: 100 },
  { title: '园区', key: 'park', width: 110 },
  { title: '负责人', dataIndex: 'owner', width: 90 },
  { title: '到期', dataIndex: 'dueAt', width: 120 },
]

const pagination = { pageSize: 8, showSizeChanger: false, showTotal: (total: number) => `共 ${total} 条` }
const situationHref = screenHref('situation', '/workbench')
const signingHref = screenHref('signing', '/workbench')
const alertsHref = screenHref('alerts', '/workbench')

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
  void router.push('/workbench/tasks/new')
}
</script>

<template>
  <section>
    <PageHeader eyebrow="工作台" title="工作台" subtitle="待办写在本机。线索、项目和拜访仍从招商菜单进入，数字跟那条主线走。">
      <template #extra>
        <ScreenJump scene="situation">招商态势</ScreenJump>
        <ScreenJump scene="alerts">告警中心</ScreenJump>
        <a-button type="primary" @click="router.push('/workbench/tasks/new')">新建待办</a-button>
      </template>
    </PageHeader>
    <div class="kpi-grid">
      <KpiStat label="待跟进线索" :value="openLeads" hint="新线索与跟进中" />
      <KpiStat label="在谈项目" :value="talking" hint="初洽、尽调、谈判" />
      <KpiStat label="待进行拜访" :value="upcomingVisits" hint="还没发生的接待和外出" />
      <KpiStat label="未完成待办" :value="openTasks" hint="不含已完成" />
    </div>
    <ul class="jump-row">
      <li><a :href="situationHref">招商态势</a></li>
      <li><a :href="signingHref">签约看板</a></li>
      <li><a :href="alertsHref">告警中心</a></li>
      <li><router-link to="/investment/leads">线索</router-link></li>
      <li><router-link to="/investment/projects">项目库</router-link></li>
      <li><router-link to="/investment/visits">拜访</router-link></li>
      <li><router-link to="/enterprises">企业档案</router-link></li>
      <li><router-link to="/space">产业空间</router-link></li>
      <li><router-link to="/policy">政策兑现</router-link></li>
      <li><router-link to="/promotion">投资促进</router-link></li>
      <li><router-link to="/analytics">数据分析</router-link></li>
    </ul>
    <div class="filter-bar">
      <a-input-search v-model:value="keyword" class="keyword" allow-clear placeholder="搜索待办、编号、负责人或关联对象" />
      <a-select v-model:value="status" class="filter" :options="toOptions(taskStatuses, '全部状态')" />
      <a-select v-model:value="kind" class="filter" :options="toOptions(taskKinds, '全部类型')" />
      <a-select v-model:value="parkId" class="filter" :options="parkFilterOptions" />
    </div>
    <div class="panel">
      <a-table :columns="columns" :data-source="rows" :pagination="pagination" row-key="id" :scroll="{ x: 980 }">
        <template #emptyText>
          <EmptyState
            :title="filteredOut ? '没有符合条件的待办' : '还没有待办'"
            :description="filteredOut ? '换一个关键词，或清空筛选后再看。' : '把要跟的线索、拜访和审阅记在这里。'"
            :primary="filteredOut ? '清空筛选' : '新建待办'"
            :secondary="filteredOut ? '新建待办' : ''"
            @primary-click="onEmptyPrimary"
            @secondary-click="router.push('/workbench/tasks/new')"
          />
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'title'">
            <button class="linkish" type="button" @click="router.push(`/workbench/tasks/${record.id}`)">{{ record.title }}</button>
          </template>
          <template v-else-if="column.key === 'kind'">
            <StatusTag :value="record.kind" />
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
