<script setup lang="ts">
import { PageHeader } from '@park/components'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { industries, leadStatuses, parkOptions, projectSources, toOptions } from '@/mock/options'
import type { LeadStatus, ProjectSource } from '@/mock/types'
import { useAuthStore } from '@/stores/auth'
import { usePipelineStore, type LeadDraft } from '@/stores/pipeline'

const route = useRoute()
const router = useRouter()
const store = usePipelineStore()
const auth = useAuthStore()
const missing = ref(false)
const saving = ref(false)
const editingId = computed(() => (route.name === 'investment-leads-edit' ? String(route.params.id ?? '') : ''))

const projectOptions = computed(() => [
  { label: '暂不关联项目', value: '' },
  ...store.projects.map((item) => ({ label: `${item.code} ${item.name}`, value: item.id })),
])

function createDraft(): LeadDraft {
  return {
    company: '',
    industry: '人工智能',
    source: '主动咨询',
    status: '新线索',
    parkId: auth.user?.parkId || parkOptions[0]?.value || '',
    projectId: '',
    owner: auth.user?.name ?? '',
    contact: '',
    phone: '',
    note: '',
  }
}

const form = reactive(createDraft())
const rules: Record<string, Rule[]> = {
  company: [{ required: true, message: '请填写企业名称', trigger: 'blur' }],
  industry: [{ required: true, message: '请选择产业', trigger: 'change' }],
  source: [{ required: true, message: '请选择来源', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  parkId: [{ required: true, message: '请选择园区', trigger: 'change' }],
  owner: [{ required: true, message: '请填写跟进人', trigger: 'blur' }],
  contact: [{ required: true, message: '请填写联系人', trigger: 'blur' }],
  phone: [{ required: true, message: '请填写电话', trigger: 'blur' }],
}

function load() {
  missing.value = false
  if (!editingId.value) {
    Object.assign(form, createDraft())
    return
  }
  const current = store.leadById(editingId.value)
  if (!current) {
    missing.value = true
    return
  }
  Object.assign(form, {
    company: current.company,
    industry: current.industry,
    source: current.source,
    status: current.status,
    parkId: current.parkId,
    projectId: current.projectId,
    owner: current.owner,
    contact: current.contact,
    phone: current.phone,
    note: current.note,
  })
}

watch(() => route.fullPath, load, { immediate: true })

function onFinish() {
  saving.value = true
  const saved = store.saveLead(
    { ...form, source: form.source as ProjectSource, status: form.status as LeadStatus },
    editingId.value || undefined,
  )
  saving.value = false
  if (!saved) {
    message.error('没有找到原线索，未能保存')
    return
  }
  message.success(editingId.value ? '线索已更新' : '线索已登记')
  void router.push(`/investment/leads/${saved.id}`)
}
</script>

<template>
  <section>
    <PageHeader
      eyebrow="产业招商 / 线索"
      :title="editingId ? '编辑线索' : '登记线索'"
      subtitle="无效线索请改状态，不必删除。转化为项目会在项目表单里完成。"
    />
    <div v-if="missing" class="missing">
      <p>没有找到要编辑的线索。</p>
      <a-button type="primary" @click="router.push('/investment/leads')">返回线索</a-button>
    </div>
    <div v-else class="block">
      <a-form :model="form" :rules="rules" layout="vertical" @finish="onFinish">
        <div class="form-grid">
          <a-form-item label="企业名称" name="company">
            <a-input v-model:value="form.company" />
          </a-form-item>
          <a-form-item label="产业" name="industry">
            <a-select v-model:value="form.industry" :options="toOptions(industries)" />
          </a-form-item>
          <a-form-item label="来源" name="source">
            <a-select v-model:value="form.source" :options="toOptions(projectSources)" />
          </a-form-item>
          <a-form-item label="状态" name="status">
            <a-select v-model:value="form.status" :options="toOptions(leadStatuses)" />
          </a-form-item>
          <a-form-item label="园区" name="parkId">
            <a-select v-model:value="form.parkId" :options="parkOptions" />
          </a-form-item>
          <a-form-item label="关联项目" name="projectId">
            <a-select v-model:value="form.projectId" :options="projectOptions" />
          </a-form-item>
          <a-form-item label="跟进人" name="owner">
            <a-input v-model:value="form.owner" />
          </a-form-item>
          <a-form-item label="联系人" name="contact">
            <a-input v-model:value="form.contact" />
          </a-form-item>
          <a-form-item label="电话" name="phone">
            <a-input v-model:value="form.phone" />
          </a-form-item>
          <a-form-item class="span-2" label="跟进说明" name="note">
            <a-textarea v-model:value="form.note" :rows="4" />
          </a-form-item>
        </div>
        <div class="form-actions">
          <a-button type="primary" html-type="submit" :loading="saving">保存</a-button>
          <a-button @click="router.push(editingId ? `/investment/leads/${editingId}` : '/investment/leads')">取消</a-button>
        </div>
      </a-form>
    </div>
  </section>
</template>
