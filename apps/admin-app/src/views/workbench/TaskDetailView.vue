<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import MissingBlock from '@/components/MissingBlock.vue'
import PageHeader from '@/components/PageHeader.vue'
import StatusTag from '@/components/StatusTag.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { confirmRemove } from '@/feedback/confirmRemove'
import { parkName } from '@/mock/parks'
import { useOpsStore } from '@/stores/ops'

const route = useRoute()
const router = useRouter()
const store = useOpsStore()
const taskId = computed(() => String(route.params.id ?? ''))
const task = computed(() => store.taskById(taskId.value))

usePageTitle(() => task.value?.title ?? '')

function remove() {
  const current = task.value
  if (!current) return
  confirmRemove(current.title, () => {
    store.removeTask(current.id)
    message.success('已从本机移除')
    void router.push('/workbench')
  })
}
</script>

<template>
  <section>
    <MissingBlock v-if="!task" message="没有找到这条待办。" to="/workbench" action="返回工作台" />
    <template v-else>
      <PageHeader eyebrow="工作台 / 待办" :title="task.title" :subtitle="task.note">
        <template #extra>
          <a-button @click="router.push('/workbench')">返回列表</a-button>
          <a-button v-if="task.relatedPath" @click="router.push(task.relatedPath)">打开关联</a-button>
          <a-button danger @click="remove">删除</a-button>
          <a-button type="primary" @click="router.push(`/workbench/tasks/${task.id}/edit`)">编辑</a-button>
        </template>
      </PageHeader>
      <div class="block">
        <a-descriptions bordered :column="2" size="middle">
          <a-descriptions-item label="编号">{{ task.code }}</a-descriptions-item>
          <a-descriptions-item label="状态"><StatusTag :value="task.status" /></a-descriptions-item>
          <a-descriptions-item label="类型"><StatusTag :value="task.kind" /></a-descriptions-item>
          <a-descriptions-item label="园区">{{ parkName(task.parkId) }}</a-descriptions-item>
          <a-descriptions-item label="负责人">{{ task.owner }}</a-descriptions-item>
          <a-descriptions-item label="到期">{{ task.dueAt || '—' }}</a-descriptions-item>
          <a-descriptions-item label="关联对象">{{ task.relatedLabel || '—' }}</a-descriptions-item>
          <a-descriptions-item label="站内路径">{{ task.relatedPath || '—' }}</a-descriptions-item>
        </a-descriptions>
      </div>
    </template>
  </section>
</template>
