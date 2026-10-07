<script setup lang="ts">
import { PageHeader } from '@park/components'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StatusTag from '@/components/StatusTag.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { parkName } from '@/mock/parks'
import { usePipelineStore } from '@/stores/pipeline'

const route = useRoute()
const router = useRouter()
const store = usePipelineStore()
const leadId = computed(() => String(route.params.id ?? ''))
const lead = computed(() => store.leadById(leadId.value))
const project = computed(() => (lead.value?.projectId ? store.projectById(lead.value.projectId) : undefined))
const relatedVisits = computed(() => store.visits.filter((item) => item.leadId === leadId.value))

usePageTitle(() => lead.value?.company ?? '')
</script>

<template>
  <section>
    <div v-if="!lead" class="missing">
      <p>没有找到这条线索。</p>
      <a-button type="primary" @click="router.push('/investment/leads')">返回线索</a-button>
    </div>
    <template v-else>
      <PageHeader eyebrow="产业招商 / 线索" :title="lead.company" :subtitle="lead.note">
        <template #extra>
          <a-button @click="router.push('/investment/leads')">返回列表</a-button>
          <a-button @click="router.push(`/investment/visits/new?leadId=${lead.id}`)">登记拜访</a-button>
          <a-button v-if="!project" @click="router.push(`/investment/projects/new?leadId=${lead.id}`)">转化为项目</a-button>
          <a-button type="primary" @click="router.push(`/investment/leads/${lead.id}/edit`)">编辑</a-button>
        </template>
      </PageHeader>
      <div class="block">
        <a-descriptions bordered :column="2" size="middle">
          <a-descriptions-item label="线索编号">{{ lead.code }}</a-descriptions-item>
          <a-descriptions-item label="状态"><StatusTag :value="lead.status" /></a-descriptions-item>
          <a-descriptions-item label="产业">{{ lead.industry }}</a-descriptions-item>
          <a-descriptions-item label="来源">{{ lead.source }}</a-descriptions-item>
          <a-descriptions-item label="园区">{{ parkName(lead.parkId) }}</a-descriptions-item>
          <a-descriptions-item label="跟进人">{{ lead.owner }}</a-descriptions-item>
          <a-descriptions-item label="联系人">{{ lead.contact }} · {{ lead.phone }}</a-descriptions-item>
          <a-descriptions-item label="登记日期">{{ lead.createdAt }}</a-descriptions-item>
          <a-descriptions-item label="关联项目">
            <button v-if="project" class="linkish" type="button" @click="router.push(`/investment/projects/${project.id}`)">
              {{ project.code }} {{ project.name }}
            </button>
            <span v-else>尚未转化</span>
          </a-descriptions-item>
        </a-descriptions>
      </div>
      <div class="block">
        <h2>相关拜访</h2>
        <p v-if="relatedVisits.length === 0" class="prose">还没有拜访。</p>
        <ul v-else class="related">
          <li v-for="item in relatedVisits" :key="item.id">
            <router-link :to="`/investment/visits/${item.id}`">{{ item.visitAt }} {{ item.title }}</router-link>
            <StatusTag :value="item.status" />
          </li>
        </ul>
      </div>
    </template>
  </section>
</template>
