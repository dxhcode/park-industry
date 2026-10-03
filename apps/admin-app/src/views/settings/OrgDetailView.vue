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
import { parkName } from '@/mock/parks'
import { useOpsStore } from '@/stores/ops'

const route = useRoute()
const router = useRouter()
const store = useOpsStore()
const orgId = computed(() => String(route.params.id ?? ''))
const org = computed(() => store.orgById(orgId.value))

usePageTitle(() => org.value?.name ?? '')

function remove() {
  const current = org.value
  if (!current) return
  confirmRemove(current.name, () => {
    store.removeOrg(current.id)
    message.success('已从本机移除')
    void router.push('/settings/orgs')
  })
}
</script>

<template>
  <section>
    <SettingsNav />
    <MissingBlock v-if="!org" message="没有找到这个组织。" to="/settings/orgs" action="返回组织架构" />
    <template v-else>
      <PageHeader eyebrow="系统设置 / 组织架构" :title="org.name" :subtitle="org.note">
        <template #extra>
          <a-button @click="router.push('/settings/orgs')">返回列表</a-button>
          <a-button danger @click="remove">删除</a-button>
          <a-button type="primary" @click="router.push(`/settings/orgs/${org.id}/edit`)">编辑</a-button>
        </template>
      </PageHeader>
      <div class="block">
        <a-descriptions bordered :column="2" size="middle">
          <a-descriptions-item label="编号">{{ org.code }}</a-descriptions-item>
          <a-descriptions-item label="类型"><StatusTag :value="org.kind" /></a-descriptions-item>
          <a-descriptions-item label="园区">{{ parkName(org.parkId) }}</a-descriptions-item>
          <a-descriptions-item label="负责人">{{ org.leader || '—' }}</a-descriptions-item>
          <a-descriptions-item label="上级">{{ org.parentName || '—' }}</a-descriptions-item>
        </a-descriptions>
      </div>
    </template>
  </section>
</template>
