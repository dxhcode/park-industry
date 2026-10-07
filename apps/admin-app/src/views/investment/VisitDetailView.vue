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
const visitId = computed(() => String(route.params.id ?? ''))
const visit = computed(() => store.visitById(visitId.value))
const project = computed(() => (visit.value?.projectId ? store.projectById(visit.value.projectId) : undefined))
const lead = computed(() => (visit.value?.leadId ? store.leadById(visit.value.leadId) : undefined))

usePageTitle(() => visit.value?.title ?? '')
</script>

<template>
  <section>
    <div v-if="!visit" class="missing">
      <p>没有找到这条拜访。</p>
      <a-button type="primary" @click="router.push('/investment/visits')">返回拜访</a-button>
    </div>
    <template v-else>
      <PageHeader eyebrow="产业招商 / 拜访" :title="visit.title" :subtitle="visit.summary || '还没有纪要。'">
        <template #extra>
          <a-button @click="router.push('/investment/visits')">返回列表</a-button>
          <a-button type="primary" @click="router.push(`/investment/visits/${visit.id}/edit`)">编辑</a-button>
        </template>
      </PageHeader>
      <div class="block">
        <a-descriptions bordered :column="2" size="middle">
          <a-descriptions-item label="编号">{{ visit.code }}</a-descriptions-item>
          <a-descriptions-item label="状态"><StatusTag :value="visit.status" /></a-descriptions-item>
          <a-descriptions-item label="类型"><StatusTag :value="visit.kind" /></a-descriptions-item>
          <a-descriptions-item label="时间">{{ visit.visitAt }}</a-descriptions-item>
          <a-descriptions-item label="园区">{{ parkName(visit.parkId) }}</a-descriptions-item>
          <a-descriptions-item label="主陪">{{ visit.host }}</a-descriptions-item>
          <a-descriptions-item label="来宾">{{ visit.guests }}</a-descriptions-item>
          <a-descriptions-item label="下一步">{{ visit.nextAction || '—' }}</a-descriptions-item>
          <a-descriptions-item label="关联项目">
            <button v-if="project" class="linkish" type="button" @click="router.push(`/investment/projects/${project.id}`)">
              {{ project.name }}
            </button>
            <span v-else>—</span>
          </a-descriptions-item>
          <a-descriptions-item label="关联线索">
            <button v-if="lead" class="linkish" type="button" @click="router.push(`/investment/leads/${lead.id}`)">
              {{ lead.company }}
            </button>
            <span v-else>—</span>
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </template>
  </section>
</template>
