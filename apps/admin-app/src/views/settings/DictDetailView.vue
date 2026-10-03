<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import MissingBlock from '@/components/MissingBlock.vue'
import PageHeader from '@/components/PageHeader.vue'
import SettingsNav from '@/components/SettingsNav.vue'
import StatusTag from '@/components/StatusTag.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { confirmRemove } from '@/feedback/confirmRemove'
import { useOpsStore } from '@/stores/ops'

const route = useRoute()
const router = useRouter()
const store = useOpsStore()
const dictId = computed(() => String(route.params.id ?? ''))
const entry = computed(() => store.dictById(dictId.value))

usePageTitle(() => entry.value?.label ?? '')

function remove() {
  const current = entry.value
  if (!current) return
  confirmRemove(current.label, () => {
    store.removeDict(current.id)
    message.success('已从本机移除')
    void router.push('/settings/dicts')
  })
}
</script>

<template>
  <section>
    <SettingsNav />
    <MissingBlock v-if="!entry" message="没有找到这条字典。" to="/settings/dicts" action="返回数据字典" />
    <template v-else>
      <PageHeader eyebrow="系统设置 / 数据字典" :title="entry.label" :subtitle="entry.note">
        <template #extra>
          <a-button @click="router.push('/settings/dicts')">返回列表</a-button>
          <a-button danger @click="remove">删除</a-button>
          <a-button type="primary" @click="router.push(`/settings/dicts/${entry.id}/edit`)">编辑</a-button>
        </template>
      </PageHeader>
      <div class="block">
        <a-descriptions bordered :column="2" size="middle">
          <a-descriptions-item label="编号">{{ entry.code }}</a-descriptions-item>
          <a-descriptions-item label="状态"><StatusTag :value="entry.state" /></a-descriptions-item>
          <a-descriptions-item label="分类">{{ entry.category }}</a-descriptions-item>
          <a-descriptions-item label="编码">{{ entry.value }}</a-descriptions-item>
        </a-descriptions>
      </div>
    </template>
  </section>
</template>
