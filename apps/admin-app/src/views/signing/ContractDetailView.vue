<script setup lang="ts">
import { PageHeader } from '@park/components'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StatusTag from '@/components/StatusTag.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { formatArea } from '@/mock/helpers'
import { parkName } from '@/mock/parks'
import { usePipelineStore } from '@/stores/pipeline'

const route = useRoute()
const router = useRouter()
const store = usePipelineStore()
const contractId = computed(() => String(route.params.id ?? ''))
const contract = computed(() => store.contractById(contractId.value))
const project = computed(() => (contract.value ? store.projectById(contract.value.projectId) : undefined))
const nodes = computed(() => store.performances.filter((item) => item.contractId === contractId.value))

usePageTitle(() => contract.value?.title ?? '')
</script>

<template>
  <section>
    <div v-if="!contract" class="missing">
      <p>没有找到这份合同。</p>
      <a-button type="primary" @click="router.push('/signing/contracts')">返回合同列表</a-button>
    </div>
    <template v-else>
      <PageHeader eyebrow="签约管理 / 合同" :title="contract.title" :subtitle="contract.clauses">
        <template #extra>
          <a-button @click="router.push('/signing/contracts')">返回列表</a-button>
          <a-button @click="router.push(`/signing/performance/new?contractId=${contract.id}`)">登记履约</a-button>
          <a-button type="primary" @click="router.push(`/signing/contracts/${contract.id}/edit`)">编辑</a-button>
        </template>
      </PageHeader>
      <div class="block">
        <a-descriptions bordered :column="2" size="middle">
          <a-descriptions-item label="合同编号">{{ contract.code }}</a-descriptions-item>
          <a-descriptions-item label="状态"><StatusTag :value="contract.status" /></a-descriptions-item>
          <a-descriptions-item label="类型"><StatusTag :value="contract.kind" /></a-descriptions-item>
          <a-descriptions-item label="园区">{{ parkName(contract.parkId) }}</a-descriptions-item>
          <a-descriptions-item label="甲方">{{ contract.partyA }}</a-descriptions-item>
          <a-descriptions-item label="乙方">{{ contract.partyB }}</a-descriptions-item>
          <a-descriptions-item label="金额 / 投资额">{{ contract.amount }}</a-descriptions-item>
          <a-descriptions-item label="面积">{{ formatArea(contract.areaSqm) }}</a-descriptions-item>
          <a-descriptions-item label="期限">{{ contract.termYears }} 年</a-descriptions-item>
          <a-descriptions-item label="签署日期">{{ contract.signedAt || '—' }}</a-descriptions-item>
          <a-descriptions-item label="生效日期">{{ contract.effectiveAt || '—' }}</a-descriptions-item>
          <a-descriptions-item label="到期日期">{{ contract.expireAt || '—' }}</a-descriptions-item>
          <a-descriptions-item label="责任人">{{ contract.owner }}</a-descriptions-item>
          <a-descriptions-item label="最近更新">{{ contract.updatedAt }}</a-descriptions-item>
          <a-descriptions-item label="关联项目">
            <button v-if="project" class="linkish" type="button" @click="router.push(`/investment/projects/${project.id}`)">
              {{ project.code }} {{ project.name }}
            </button>
            <span v-else>未关联</span>
          </a-descriptions-item>
        </a-descriptions>
      </div>
      <div class="block">
        <h2>履约节点</h2>
        <p v-if="nodes.length === 0" class="prose">还没有履约节点。</p>
        <ul v-else class="related">
          <li v-for="item in nodes" :key="item.id">
            <router-link :to="`/signing/performance/${item.id}`">{{ item.dueAt }} {{ item.name }}</router-link>
            <StatusTag :value="item.status" />
            <span class="prose">{{ item.metric }}</span>
          </li>
        </ul>
      </div>
    </template>
  </section>
</template>
