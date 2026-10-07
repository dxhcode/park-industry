<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import MissingBlock from '@/components/MissingBlock.vue'
import PageHeader from '@/components/PageHeader.vue'
import ScreenJump from '@/components/ScreenJump.vue'
import StatusTag from '@/components/StatusTag.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { confirmRemove } from '@/feedback/confirmRemove'
import { parkLabel } from '@/mock/parks'
import { useOpsStore } from '@/stores/ops'

const route = useRoute()
const router = useRouter()
const store = useOpsStore()
const reportId = computed(() => String(route.params.id ?? ''))
const report = computed(() => store.reportById(reportId.value))

usePageTitle(() => report.value?.title ?? '')

function remove() {
  const current = report.value
  if (!current) return
  confirmRemove(current.title, () => {
    store.removeReport(current.id)
    message.success('已从本机移除')
    void router.push('/analytics')
  })
}
</script>

<template>
  <section>
    <MissingBlock v-if="!report" message="没有找到这条快报。" to="/analytics" action="返回数据分析" />
    <template v-else>
      <PageHeader eyebrow="数据分析" :title="report.title" :subtitle="report.summary">
        <template #extra>
          <ScreenJump scene="situation">招商态势</ScreenJump>
          <a-button @click="router.push('/analytics')">返回列表</a-button>
          <a-button danger @click="remove">删除</a-button>
          <a-button type="primary" @click="router.push(`/analytics/${report.id}/edit`)">编辑</a-button>
        </template>
      </PageHeader>
      <div class="block">
        <a-descriptions bordered :column="2" size="middle">
          <a-descriptions-item label="编号">{{ report.code }}</a-descriptions-item>
          <a-descriptions-item label="状态"><StatusTag :value="report.status" /></a-descriptions-item>
          <a-descriptions-item label="周期">{{ report.period }}</a-descriptions-item>
          <a-descriptions-item label="范围">{{ parkLabel(report.parkId) }}</a-descriptions-item>
          <a-descriptions-item label="指标">{{ report.metric }}</a-descriptions-item>
          <a-descriptions-item label="数值">{{ report.valueText }}</a-descriptions-item>
          <a-descriptions-item label="编写人">{{ report.owner }}</a-descriptions-item>
          <a-descriptions-item label="发布日期">{{ report.publishedAt || '未发布' }}</a-descriptions-item>
        </a-descriptions>
        <p class="prose chart-note">这条快报本身不画图。同样的园区数字在产业驾驶舱里。</p>
      </div>
    </template>
  </section>
</template>

<style scoped>
.chart-note {
  margin-top: 12px;
}
</style>
