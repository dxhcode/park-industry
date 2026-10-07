<script setup lang="ts">
import { PageHeader } from '@park/components'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import MissingBlock from '@/components/MissingBlock.vue'
import StatusTag from '@/components/StatusTag.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { confirmRemove } from '@/feedback/confirmRemove'
import { parkName } from '@/mock/parks'
import { useOpsStore } from '@/stores/ops'

const route = useRoute()
const router = useRouter()
const store = useOpsStore()
const eventId = computed(() => String(route.params.id ?? ''))
const item = computed(() => store.eventById(eventId.value))

usePageTitle(() => item.value?.title ?? '')

function remove() {
  const current = item.value
  if (!current) return
  confirmRemove(current.title, () => {
    store.removeEvent(current.id)
    message.success('已从本机移除')
    void router.push('/promotion')
  })
}
</script>

<template>
  <section>
    <MissingBlock v-if="!item" message="没有找到这场活动。" to="/promotion" action="返回投资促进" />
    <template v-else>
      <PageHeader eyebrow="投资促进" :title="item.title" :subtitle="item.note">
        <template #extra>
          <a-button @click="router.push('/promotion')">返回列表</a-button>
          <a-button danger @click="remove">删除</a-button>
          <a-button type="primary" @click="router.push(`/promotion/${item.id}/edit`)">编辑</a-button>
        </template>
      </PageHeader>
      <div class="block">
        <a-descriptions bordered :column="2" size="middle">
          <a-descriptions-item label="编号">{{ item.code }}</a-descriptions-item>
          <a-descriptions-item label="状态"><StatusTag :value="item.status" /></a-descriptions-item>
          <a-descriptions-item label="类型"><StatusTag :value="item.kind" /></a-descriptions-item>
          <a-descriptions-item label="园区">{{ parkName(item.parkId) }}</a-descriptions-item>
          <a-descriptions-item label="日期">{{ item.heldAt || '—' }}</a-descriptions-item>
          <a-descriptions-item label="地点">{{ item.place }}</a-descriptions-item>
          <a-descriptions-item label="主持">{{ item.host }}</a-descriptions-item>
          <a-descriptions-item label="渠道">{{ item.channel || '—' }}</a-descriptions-item>
          <a-descriptions-item label="嘉宾">{{ item.guests || '—' }}</a-descriptions-item>
        </a-descriptions>
      </div>
    </template>
  </section>
</template>
