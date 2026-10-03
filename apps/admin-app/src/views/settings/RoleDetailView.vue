<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { demoAccounts } from '@/auth/accounts'
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
const roleId = computed(() => String(route.params.id ?? ''))
const grant = computed(() => store.roleById(roleId.value))
const canLogin = computed(() => demoAccounts.some((item) => item.username === grant.value?.username))

usePageTitle(() => (grant.value ? `${grant.value.person}的权限` : ''))

function remove() {
  const current = grant.value
  if (!current) return
  confirmRemove(current.person, () => {
    store.removeRole(current.id)
    message.success('已从本机移除')
    void router.push('/settings/roles')
  })
}
</script>

<template>
  <section>
    <SettingsNav />
    <MissingBlock v-if="!grant" message="没有找到这条权限。" to="/settings/roles" action="返回角色权限" />
    <template v-else>
      <PageHeader eyebrow="系统设置 / 角色权限" :title="grant.person" :subtitle="grant.note">
        <template #extra>
          <a-button @click="router.push('/settings/roles')">返回列表</a-button>
          <a-button danger @click="remove">删除</a-button>
          <a-button type="primary" @click="router.push(`/settings/roles/${grant.id}/edit`)">编辑</a-button>
        </template>
      </PageHeader>
      <div class="block">
        <a-descriptions bordered :column="2" size="middle">
          <a-descriptions-item label="编号">{{ grant.code }}</a-descriptions-item>
          <a-descriptions-item label="状态"><StatusTag :value="grant.state" /></a-descriptions-item>
          <a-descriptions-item label="角色">{{ grant.role }}</a-descriptions-item>
          <a-descriptions-item label="账号">{{ grant.username }}</a-descriptions-item>
          <a-descriptions-item label="园区">{{ parkName(grant.parkId) }}</a-descriptions-item>
          <a-descriptions-item label="范围">{{ grant.scope }}</a-descriptions-item>
          <a-descriptions-item label="能否登录">{{ canLogin ? '可以，密码仍是 demo123' : '不能登录' }}</a-descriptions-item>
        </a-descriptions>
      </div>
    </template>
  </section>
</template>
