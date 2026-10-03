<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import PageHeader from '@/components/PageHeader.vue'
import { industries, parkOptions, projectSources, projectStages, toOptions } from '@/mock/options'
import type { ProjectSource, ProjectStage } from '@/mock/types'
import { useAuthStore } from '@/stores/auth'
import { usePipelineStore, type ProjectDraft } from '@/stores/pipeline'

const route = useRoute()
const router = useRouter()
const store = usePipelineStore()
const auth = useAuthStore()
const missing = ref(false)
const saving = ref(false)

const editingId = computed(() => (route.name === 'investment-projects-edit' ? String(route.params.id ?? '') : ''))
const leadId = computed(() => (typeof route.query.leadId === 'string' ? route.query.leadId : ''))
const pageTitle = computed(() => (editingId.value ? '编辑招商项目' : '新建招商项目'))

function createDraft(): ProjectDraft {
  return {
    name: '',
    enterpriseName: '',
    industry: '人工智能',
    parkId: auth.user?.parkId || parkOptions[0]?.value || '',
    stage: '初洽',
    source: '主动咨询',
    intentAreaSqm: 1000,
    intentInvestment: '',
    owner: auth.user?.name ?? '',
    contact: '',
    phone: '',
    fromCity: '',
    expectedSignAt: '',
    summary: '',
    nextAction: '',
  }
}

const form = reactive(createDraft())

const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: '请填写项目名称', trigger: 'blur' }],
  enterpriseName: [{ required: true, message: '请填写意向企业', trigger: 'blur' }],
  industry: [{ required: true, message: '请选择产业', trigger: 'change' }],
  parkId: [{ required: true, message: '请选择园区', trigger: 'change' }],
  stage: [{ required: true, message: '请选择阶段', trigger: 'change' }],
  source: [{ required: true, message: '请选择来源', trigger: 'change' }],
  intentAreaSqm: [{ required: true, type: 'number', min: 1, message: '请填写意向面积', trigger: 'change' }],
  intentInvestment: [{ required: true, message: '请填写意向投资', trigger: 'blur' }],
  owner: [{ required: true, message: '请填写责任人', trigger: 'blur' }],
  contact: [{ required: true, message: '请填写企业联系人', trigger: 'blur' }],
  phone: [{ required: true, message: '请填写联系电话', trigger: 'blur' }],
}

function load() {
  missing.value = false
  if (!editingId.value) {
    Object.assign(form, createDraft())
    const lead = leadId.value ? store.leadById(leadId.value) : undefined
    if (lead) {
      form.enterpriseName = lead.company
      form.industry = lead.industry
      form.source = lead.source
      form.parkId = lead.parkId
      form.contact = lead.contact
      form.phone = lead.phone
      form.owner = lead.owner
      form.stage = '线索'
      form.name = `${lead.company}入驻意向`
      form.summary = lead.note
    }
    return
  }
  const current = store.projectById(editingId.value)
  if (!current) {
    missing.value = true
    return
  }
  Object.assign(form, {
    name: current.name,
    enterpriseName: current.enterpriseName,
    industry: current.industry,
    parkId: current.parkId,
    stage: current.stage,
    source: current.source,
    intentAreaSqm: current.intentAreaSqm,
    intentInvestment: current.intentInvestment,
    owner: current.owner,
    contact: current.contact,
    phone: current.phone,
    fromCity: current.fromCity,
    expectedSignAt: current.expectedSignAt,
    summary: current.summary,
    nextAction: current.nextAction,
  })
}

watch(() => route.fullPath, load, { immediate: true })

const expectedSignAt = computed({
  get: () => form.expectedSignAt || undefined,
  set: (value?: string) => {
    form.expectedSignAt = value ?? ''
  },
})

function onFinish() {
  saving.value = true
  const saved = store.saveProject(
    {
      ...form,
      stage: form.stage as ProjectStage,
      source: form.source as ProjectSource,
      intentAreaSqm: Number(form.intentAreaSqm),
    },
    editingId.value || undefined,
    leadId.value || undefined,
  )
  saving.value = false
  if (!saved) {
    message.error('没有找到原项目，未能保存')
    return
  }
  message.success(editingId.value ? '项目已更新' : '项目已建档')
  void router.push(`/investment/projects/${saved.id}`)
}

function cancel() {
  if (editingId.value) {
    void router.push(`/investment/projects/${editingId.value}`)
    return
  }
  void router.push('/investment/projects')
}
</script>

<template>
  <section>
    <PageHeader eyebrow="产业招商 / 项目库" :title="pageTitle" subtitle="保存后写入本机项目库，可在详情里继续起草合同或登记拜访。" />
    <div v-if="missing" class="missing">
      <p>没有找到要编辑的项目。</p>
      <a-button type="primary" @click="router.push('/investment/projects')">返回项目库</a-button>
    </div>
    <div v-else class="block">
      <a-form :model="form" :rules="rules" layout="vertical" @finish="onFinish">
        <div class="form-grid">
          <a-form-item class="span-2" label="项目名称" name="name">
            <a-input v-model:value="form.name" placeholder="例如：星澜智造二期扩产" />
          </a-form-item>
          <a-form-item label="意向企业" name="enterpriseName">
            <a-input v-model:value="form.enterpriseName" placeholder="企业全称" />
          </a-form-item>
          <a-form-item label="产业" name="industry">
            <a-select v-model:value="form.industry" :options="toOptions(industries)" />
          </a-form-item>
          <a-form-item label="所在园区" name="parkId">
            <a-select v-model:value="form.parkId" :options="parkOptions" />
          </a-form-item>
          <a-form-item label="阶段" name="stage">
            <a-select v-model:value="form.stage" :options="toOptions(projectStages)" />
          </a-form-item>
          <a-form-item label="来源" name="source">
            <a-select v-model:value="form.source" :options="toOptions(projectSources)" />
          </a-form-item>
          <a-form-item label="企业所在地" name="fromCity">
            <a-input v-model:value="form.fromCity" placeholder="例如：杭州市" />
          </a-form-item>
          <a-form-item label="意向面积（㎡）" name="intentAreaSqm">
            <a-input-number v-model:value="form.intentAreaSqm" :min="1" :step="100" style="width: 100%" />
          </a-form-item>
          <a-form-item label="意向投资" name="intentInvestment">
            <a-input v-model:value="form.intentInvestment" placeholder="例如：1.2 亿元" />
          </a-form-item>
          <a-form-item label="拟签约日期" name="expectedSignAt">
            <a-date-picker v-model:value="expectedSignAt" value-format="YYYY-MM-DD" style="width: 100%" placeholder="选择日期" />
          </a-form-item>
          <a-form-item label="责任人" name="owner">
            <a-input v-model:value="form.owner" />
          </a-form-item>
          <a-form-item label="企业联系人" name="contact">
            <a-input v-model:value="form.contact" />
          </a-form-item>
          <a-form-item label="联系电话" name="phone">
            <a-input v-model:value="form.phone" />
          </a-form-item>
          <a-form-item class="span-2" label="项目说明" name="summary">
            <a-textarea v-model:value="form.summary" :rows="4" placeholder="载体、诉求和当前卡点" />
          </a-form-item>
          <a-form-item class="span-2" label="下一步" name="nextAction">
            <a-input v-model:value="form.nextAction" placeholder="下一次动作和时间" />
          </a-form-item>
        </div>
        <div class="form-actions">
          <a-button type="primary" html-type="submit" :loading="saving">保存</a-button>
          <a-button @click="cancel">取消</a-button>
        </div>
      </a-form>
    </div>
  </section>
</template>
