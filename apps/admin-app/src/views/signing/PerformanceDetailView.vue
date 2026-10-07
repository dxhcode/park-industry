<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import StatusTag from '@/components/StatusTag.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { usePipelineStore } from '@/stores/pipeline'

const route = useRoute()
const router = useRouter()
const store = usePipelineStore()
const nodeId = computed(() => String(route.params.id ?? ''))
const node = computed(() => store.performanceById(nodeId.value))
const contract = computed(() => (node.value ? store.contractById(node.value.contractId) : undefined))
const project = computed(() => (contract.value ? store.projectById(contract.value.projectId) : undefined))

usePageTitle(() => (node.value ? `${node.value.name}履约` : ''))
</script>

<template>
  <section>
    <div v-if="!node" class="missing">
      <p>没有找到这个履约节点。</p>
      <a-button type="primary" @click="router.push('/signing/performance')">返回履约</a-button>
    </div>
    <template v-else>
      <PageHeader eyebrow="签约管理 / 履约" :title="node.name" :subtitle="node.note || node.metric">
        <template #extra>
          <a-button @click="router.push('/signing/performance')">返回列表</a-button>
          <a-button type="primary" @click="router.push(`/signing/performance/${node.id}/edit`)">编辑</a-button>
        </template>
      </PageHeader>
      <div class="block">
        <a-descriptions bordered :column="2" size="middle">
          <a-descriptions-item label="编号">{{ node.code }}</a-descriptions-item>
          <a-descriptions-item label="状态"><StatusTag :value="node.status" /></a-descriptions-item>
          <a-descriptions-item label="到期日">{{ node.dueAt }}</a-descriptions-item>
          <a-descriptions-item label="责任人">{{ node.owner }}</a-descriptions-item>
          <a-descriptions-item label="完成指标" :span="2">{{ node.metric }}</a-descriptions-item>
          <a-descriptions-item label="说明" :span="2">{{ node.note || '—' }}</a-descriptions-item>
          <a-descriptions-item label="合同">
            <button v-if="contract" class="linkish" type="button" @click="router.push(`/signing/contracts/${contract.id}`)">
              {{ contract.code }} {{ contract.title }}
            </button>
            <span v-else>未关联</span>
          </a-descriptions-item>
          <a-descriptions-item label="项目">
            <button v-if="project" class="linkish" type="button" @click="router.push(`/investment/projects/${project.id}`)">
              {{ project.name }}
            </button>
            <span v-else>—</span>
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </template>
  </section>
</template>
