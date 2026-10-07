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

const projectId = computed(() => String(route.params.id ?? ''))
const project = computed(() => store.projectById(projectId.value))
const relatedContracts = computed(() => store.contracts.filter((item) => item.projectId === projectId.value))
const relatedVisits = computed(() => store.visits.filter((item) => item.projectId === projectId.value))
const relatedLeads = computed(() => store.leads.filter((item) => item.projectId === projectId.value))

usePageTitle(() => project.value?.name ?? '')
</script>

<template>
  <section>
    <div v-if="!project" class="missing">
      <p>没有找到这个招商项目。</p>
      <a-button type="primary" @click="router.push('/investment/projects')">返回项目库</a-button>
    </div>
    <template v-else>
      <PageHeader eyebrow="产业招商 / 项目库" :title="project.name" :subtitle="project.summary">
        <template #extra>
          <a-button @click="router.push('/investment/projects')">返回列表</a-button>
          <a-button @click="router.push(`/investment/visits/new?projectId=${project.id}`)">登记拜访</a-button>
          <a-button @click="router.push(`/signing/contracts/new?projectId=${project.id}`)">起草合同</a-button>
          <a-button type="primary" @click="router.push(`/investment/projects/${project.id}/edit`)">编辑</a-button>
        </template>
      </PageHeader>
      <div class="block">
        <a-descriptions bordered :column="2" size="middle">
          <a-descriptions-item label="项目编号">{{ project.code }}</a-descriptions-item>
          <a-descriptions-item label="阶段"><StatusTag :value="project.stage" /></a-descriptions-item>
          <a-descriptions-item label="意向企业">{{ project.enterpriseName }}</a-descriptions-item>
          <a-descriptions-item label="产业">{{ project.industry }}</a-descriptions-item>
          <a-descriptions-item label="所在园区">{{ parkName(project.parkId) }}</a-descriptions-item>
          <a-descriptions-item label="企业所在地">{{ project.fromCity || '—' }}</a-descriptions-item>
          <a-descriptions-item label="项目来源">{{ project.source }}</a-descriptions-item>
          <a-descriptions-item label="意向面积">{{ formatArea(project.intentAreaSqm) }}</a-descriptions-item>
          <a-descriptions-item label="意向投资">{{ project.intentInvestment }}</a-descriptions-item>
          <a-descriptions-item label="拟签约日期">{{ project.expectedSignAt || '—' }}</a-descriptions-item>
          <a-descriptions-item label="责任人">{{ project.owner }}</a-descriptions-item>
          <a-descriptions-item label="企业联系人">{{ project.contact }} · {{ project.phone }}</a-descriptions-item>
          <a-descriptions-item label="最近更新">{{ project.updatedAt }}</a-descriptions-item>
          <a-descriptions-item label="下一步">{{ project.nextAction || '—' }}</a-descriptions-item>
        </a-descriptions>
      </div>
      <div class="block">
        <h2>关联线索</h2>
        <p v-if="relatedLeads.length === 0" class="prose">还没有挂到这个项目上的线索。</p>
        <ul v-else class="related">
          <li v-for="item in relatedLeads" :key="item.id">
            <router-link :to="`/investment/leads/${item.id}`">{{ item.code }} {{ item.company }}</router-link>
            <StatusTag :value="item.status" />
          </li>
        </ul>
        <h2>拜访记录</h2>
        <p v-if="relatedVisits.length === 0" class="prose">还没有拜访记录。</p>
        <ul v-else class="related">
          <li v-for="item in relatedVisits" :key="item.id">
            <router-link :to="`/investment/visits/${item.id}`">{{ item.visitAt }} {{ item.title }}</router-link>
            <StatusTag :value="item.status" />
          </li>
        </ul>
        <h2>签约合同</h2>
        <p v-if="relatedContracts.length === 0" class="prose">还没有合同。可以从这里起草，并带回当前项目。</p>
        <ul v-else class="related">
          <li v-for="item in relatedContracts" :key="item.id">
            <router-link :to="`/signing/contracts/${item.id}`">{{ item.code }} {{ item.title }}</router-link>
            <StatusTag :value="item.status" />
          </li>
        </ul>
      </div>
    </template>
  </section>
</template>
