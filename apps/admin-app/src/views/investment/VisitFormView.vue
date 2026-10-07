<script setup lang="ts">
import { PageHeader } from '@park/components'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { parkOptions, toOptions, visitKinds, visitStatuses } from '@/mock/options'
import type { VisitKind, VisitStatus } from '@/mock/types'
import { useAuthStore } from '@/stores/auth'
import { usePipelineStore, type VisitDraft } from '@/stores/pipeline'

const route = useRoute()
const router = useRouter()
const store = usePipelineStore()
const auth = useAuthStore()
const missing = ref(false)
const saving = ref(false)
const editingId = computed(() => (route.name === 'investment-visits-edit' ? String(route.params.id ?? '') : ''))

const projectOptions = computed(() => [
  { label: '不关联项目', value: '' },
  ...store.projects.map((item) => ({ label: `${item.code} ${item.name}`, value: item.id })),
])
const leadOptions = computed(() => [
  { label: '不关联线索', value: '' },
  ...store.leads.map((item) => ({ label: `${item.code} ${item.company}`, value: item.id })),
])

function createDraft(): VisitDraft {
  return {
    title: '',
    kind: '来园接待',
    status: '待进行',
    parkId: auth.user?.parkId || parkOptions[0]?.value || '',
    projectId: '',
    leadId: '',
    visitAt: '',
    host: auth.user?.name ?? '',
    guests: '',
    summary: '',
    nextAction: '',
  }
}

const form = reactive(createDraft())
const rules: Record<string, Rule[]> = {
  title: [{ required: true, message: '请填写主题', trigger: 'blur' }],
  kind: [{ required: true, message: '请选择类型', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  parkId: [{ required: true, message: '请选择园区', trigger: 'change' }],
  visitAt: [{ required: true, message: '请填写时间', trigger: 'change' }],
  host: [{ required: true, message: '请填写主陪', trigger: 'blur' }],
  guests: [{ required: true, message: '请填写来宾', trigger: 'blur' }],
}

const visitAt = computed({
  get: () => form.visitAt || undefined,
  set: (value?: string) => {
    form.visitAt = value ?? ''
  },
})

function load() {
  missing.value = false
  if (!editingId.value) {
    Object.assign(form, createDraft())
    const projectId = typeof route.query.projectId === 'string' ? route.query.projectId : ''
    const leadId = typeof route.query.leadId === 'string' ? route.query.leadId : ''
    if (projectId) {
      const project = store.projectById(projectId)
      if (project) {
        form.projectId = project.id
        form.parkId = project.parkId
        form.title = `${project.enterpriseName}来访`
        form.guests = project.contact
      }
    }
    if (leadId) {
      const lead = store.leadById(leadId)
      if (lead) {
        form.leadId = lead.id
        form.parkId = lead.parkId
        form.guests = lead.contact
        if (!form.title) form.title = `${lead.company}拜访`
      }
    }
    return
  }
  const current = store.visitById(editingId.value)
  if (!current) {
    missing.value = true
    return
  }
  Object.assign(form, {
    title: current.title,
    kind: current.kind,
    status: current.status,
    parkId: current.parkId,
    projectId: current.projectId,
    leadId: current.leadId,
    visitAt: current.visitAt,
    host: current.host,
    guests: current.guests,
    summary: current.summary,
    nextAction: current.nextAction,
  })
}

watch(() => route.fullPath, load, { immediate: true })

function onProjectChange(value: unknown) {
  const project = store.projectById(String(value ?? ''))
  if (project) form.parkId = project.parkId
}

function onFinish() {
  if (!form.projectId && !form.leadId) {
    message.warning('请至少关联一个项目或一条线索')
    return
  }
  saving.value = true
  const saved = store.saveVisit(
    { ...form, kind: form.kind as VisitKind, status: form.status as VisitStatus },
    editingId.value || undefined,
  )
  saving.value = false
  if (!saved) {
    message.error('没有找到原拜访，未能保存')
    return
  }
  message.success(editingId.value ? '拜访已更新' : '拜访已登记')
  void router.push(`/investment/visits/${saved.id}`)
}
</script>

<template>
  <section>
    <PageHeader eyebrow="产业招商 / 拜访" :title="editingId ? '编辑拜访' : '登记拜访'" subtitle="时间精确到分钟。至少挂到项目或线索其中一边。" />
    <div v-if="missing" class="missing">
      <p>没有找到要编辑的拜访。</p>
      <a-button type="primary" @click="router.push('/investment/visits')">返回拜访</a-button>
    </div>
    <div v-else class="block">
      <a-form :model="form" :rules="rules" layout="vertical" @finish="onFinish">
        <div class="form-grid">
          <a-form-item class="span-2" label="主题" name="title">
            <a-input v-model:value="form.title" />
          </a-form-item>
          <a-form-item label="类型" name="kind">
            <a-select v-model:value="form.kind" :options="toOptions(visitKinds)" />
          </a-form-item>
          <a-form-item label="状态" name="status">
            <a-select v-model:value="form.status" :options="toOptions(visitStatuses)" />
          </a-form-item>
          <a-form-item label="时间" name="visitAt">
            <a-date-picker v-model:value="visitAt" show-time value-format="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm" style="width: 100%" />
          </a-form-item>
          <a-form-item label="园区" name="parkId">
            <a-select v-model:value="form.parkId" :options="parkOptions" />
          </a-form-item>
          <a-form-item label="关联项目" name="projectId">
            <a-select v-model:value="form.projectId" :options="projectOptions" @change="onProjectChange" />
          </a-form-item>
          <a-form-item label="关联线索" name="leadId">
            <a-select v-model:value="form.leadId" :options="leadOptions" />
          </a-form-item>
          <a-form-item label="主陪" name="host">
            <a-input v-model:value="form.host" />
          </a-form-item>
          <a-form-item label="来宾" name="guests">
            <a-input v-model:value="form.guests" placeholder="多人用顿号分开" />
          </a-form-item>
          <a-form-item class="span-2" label="纪要" name="summary">
            <a-textarea v-model:value="form.summary" :rows="4" />
          </a-form-item>
          <a-form-item class="span-2" label="下一步" name="nextAction">
            <a-input v-model:value="form.nextAction" />
          </a-form-item>
        </div>
        <div class="form-actions">
          <a-button type="primary" html-type="submit" :loading="saving">保存</a-button>
          <a-button @click="router.push(editingId ? `/investment/visits/${editingId}` : '/investment/visits')">取消</a-button>
        </div>
      </a-form>
    </div>
  </section>
</template>
