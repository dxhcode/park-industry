<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import MissingBlock from '@/components/MissingBlock.vue'
import PageHeader from '@/components/PageHeader.vue'
import StatusTag from '@/components/StatusTag.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { confirmRemove } from '@/feedback/confirmRemove'
import { formatArea } from '@/mock/helpers'
import { parkName } from '@/mock/parks'
import { useOpsStore } from '@/stores/ops'

const route = useRoute()
const router = useRouter()
const store = useOpsStore()
const spaceId = computed(() => String(route.params.id ?? ''))
const space = computed(() => store.spaceById(spaceId.value))
const tenant = computed(() => store.enterprises.find((item) => item.name === space.value?.tenant))

usePageTitle(() => space.value?.name ?? '')

function remove() {
  const current = space.value
  if (!current) return
  confirmRemove(current.name, () => {
    store.removeSpace(current.id)
    message.success('已从本机移除')
    void router.push('/space')
  })
}
</script>

<template>
  <section>
    <MissingBlock v-if="!space" message="没有找到这项空间资源。" to="/space" action="返回产业空间" />
    <template v-else>
      <PageHeader eyebrow="产业空间" :title="space.name" :subtitle="space.note">
        <template #extra>
          <a-button @click="router.push('/space')">返回列表</a-button>
          <a-button danger @click="remove">删除</a-button>
          <a-button type="primary" @click="router.push(`/space/${space.id}/edit`)">编辑</a-button>
        </template>
      </PageHeader>
      <div class="block">
        <a-descriptions bordered :column="2" size="middle">
          <a-descriptions-item label="编号">{{ space.code }}</a-descriptions-item>
          <a-descriptions-item label="状态"><StatusTag :value="space.status" /></a-descriptions-item>
          <a-descriptions-item label="类型"><StatusTag :value="space.kind" /></a-descriptions-item>
          <a-descriptions-item label="园区">{{ parkName(space.parkId) }}</a-descriptions-item>
          <a-descriptions-item label="楼栋">{{ space.building }}</a-descriptions-item>
          <a-descriptions-item label="楼层">{{ space.floor }}</a-descriptions-item>
          <a-descriptions-item label="面积">{{ formatArea(space.areaSqm) }}</a-descriptions-item>
          <a-descriptions-item label="租金">{{ space.rent || '—' }}</a-descriptions-item>
          <a-descriptions-item label="承租方">
            <router-link v-if="tenant" :to="`/enterprises/${tenant.id}`">{{ space.tenant }}</router-link>
            <template v-else>{{ space.tenant || '空置' }}</template>
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </template>
  </section>
</template>
