<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { TableColumnsType } from 'ant-design-vue'
import KpiStat from '@/components/KpiStat.vue'
import PageHeader from '@/components/PageHeader.vue'
import ScreenJump from '@/components/ScreenJump.vue'
import StatusTag from '@/components/StatusTag.vue'
import { formatArea, includesKeyword } from '@/mock/helpers'
import { parkFilterOptions, projectStages, toOptions } from '@/mock/options'
import { parkShortName } from '@/mock/parks'
import type { InvestmentProject } from '@/mock/types'
import { usePipelineStore } from '@/stores/pipeline'

const store = usePipelineStore()
const router = useRouter()
const keyword = ref('')
const stage = ref('')
const parkId = ref('')

const stageOptions = toOptions(projectStages, '全部阶段')

const rows = computed(() =>
  store.projects.filter((item) => {
    if (stage.value && item.stage !== stage.value) return false
    if (parkId.value && item.parkId !== parkId.value) return false
    return includesKeyword([item.name, item.enterpriseName, item.code, item.industry, item.owner], keyword.value)
  }),
)

const talking = computed(() => store.projects.filter((item) => ['初洽', '尽调', '谈判'].includes(item.stage)).length)
const signing = computed(() => store.projects.filter((item) => item.stage === '签约').length)
const landed = computed(() => store.projects.filter((item) => item.stage === '落地').length)
const area = computed(() =>
  formatArea(store.projects.filter((item) => item.stage !== '搁置').reduce((sum, item) => sum + item.intentAreaSqm, 0)),
)

const columns: TableColumnsType<InvestmentProject> = [
  { title: '编号', dataIndex: 'code', width: 130 },
  { title: '项目名称', key: 'name', dataIndex: 'name', ellipsis: true },
  { title: '意向企业', dataIndex: 'enterpriseName', ellipsis: true },
  { title: '产业', dataIndex: 'industry', width: 110 },
  { title: '阶段', key: 'stage', dataIndex: 'stage', width: 100 },
  { title: '园区', key: 'park', width: 110 },
  { title: '意向面积', key: 'area', width: 120 },
  { title: '责任人', dataIndex: 'owner', width: 90 },
  { title: '更新', dataIndex: 'updatedAt', width: 120 },
]

const pagination = {
  pageSize: 8,
  showSizeChanger: false,
  showTotal: (total: number) => `共 ${total} 条`,
}

function openDetail(id: string) {
  void router.push(`/investment/projects/${id}`)
}

function recordId(record: InvestmentProject) {
  return record.id
}
</script>

<template>
  <section>
    <PageHeader eyebrow="产业招商" title="项目库" subtitle="跟踪储备、在谈、签约和已落地的招商项目。数据为园区样例，保存在本机。">
      <template #extra>
        <ScreenJump scene="situation">招商态势</ScreenJump>
        <a-button type="primary" @click="router.push('/investment/projects/new')">新建项目</a-button>
      </template>
    </PageHeader>
    <div class="kpi-grid">
      <KpiStat label="在谈项目" :value="talking" hint="初洽、尽调、谈判" />
      <KpiStat label="待签约" :value="signing" hint="协议已谈定、待盖章" />
      <KpiStat label="已落地" :value="landed" hint="完成入驻或开工" />
      <KpiStat label="有效意向面积" :value="area" hint="不含搁置项目" />
    </div>
    <div class="filter-bar">
      <a-input-search v-model:value="keyword" class="keyword" allow-clear placeholder="搜索项目、企业、编号或责任人" />
      <a-select v-model:value="stage" class="filter" :options="stageOptions" />
      <a-select v-model:value="parkId" class="filter" :options="parkFilterOptions" />
    </div>
    <div class="panel">
      <a-table
        :columns="columns"
        :data-source="rows"
        :pagination="pagination"
        row-key="id"
        :scroll="{ x: 1100 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <button class="linkish" type="button" @click="openDetail(recordId(record))">{{ record.name }}</button>
          </template>
          <template v-else-if="column.key === 'stage'">
            <StatusTag :value="record.stage" />
          </template>
          <template v-else-if="column.key === 'park'">{{ parkShortName(record.parkId) }}</template>
          <template v-else-if="column.key === 'area'">{{ formatArea(record.intentAreaSqm) }}</template>
        </template>
      </a-table>
    </div>
  </section>
</template>
