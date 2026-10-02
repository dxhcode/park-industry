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
const claimId = computed(() => String(route.params.id ?? ''))
const claim = computed(() => store.policyById(claimId.value))
const enterprise = computed(() => store.enterprises.find((item) => item.name === claim.value?.enterpriseName))

usePageTitle(() => claim.value?.title ?? '')

function remove() {
  const current = claim.value
  if (!current) return
  confirmRemove(current.title, () => {
    store.removePolicy(current.id)
    message.success('已从本机移除')
    void router.push('/policy')
  })
}
</script>

<template>
  <section>
    <MissingBlock v-if="!claim" message="没有找到这条申报。" to="/policy" action="返回政策兑现" />
    <template v-else>
      <PageHeader eyebrow="政策兑现" :title="claim.title" :subtitle="claim.note">
        <template #extra>
          <a-button @click="router.push('/policy')">返回列表</a-button>
          <a-button danger @click="remove">删除</a-button>
          <a-button type="primary" @click="router.push(`/policy/${claim.id}/edit`)">编辑</a-button>
        </template>
      </PageHeader>
      <div class="block">
        <a-descriptions bordered :column="2" size="middle">
          <a-descriptions-item label="编号">{{ claim.code }}</a-descriptions-item>
          <a-descriptions-item label="状态"><StatusTag :value="claim.status" /></a-descriptions-item>
          <a-descriptions-item label="政策名称">{{ claim.policyName }}</a-descriptions-item>
          <a-descriptions-item label="园区">{{ parkName(claim.parkId) }}</a-descriptions-item>
          <a-descriptions-item label="申报企业">
            <router-link v-if="enterprise" :to="`/enterprises/${enterprise.id}`">{{ claim.enterpriseName }}</router-link>
            <template v-else>{{ claim.enterpriseName }}</template>
          </a-descriptions-item>
          <a-descriptions-item label="额度">{{ claim.amount }}</a-descriptions-item>
          <a-descriptions-item label="经办人">{{ claim.owner }}</a-descriptions-item>
          <a-descriptions-item label="申报日期">{{ claim.submittedAt || '—' }}</a-descriptions-item>
        </a-descriptions>
      </div>
    </template>
  </section>
</template>
