<script setup lang="ts">
import { PageHeader } from '@park/components'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import MissingBlock from '@/components/MissingBlock.vue'
import { dateModel } from '@/composables/dateModel'
import { enterpriseStatuses, industries, parkOptions, toOptions } from '@/mock/options'
import type { EnterpriseDraft, EnterpriseStatus } from '@/mock/ops-types'
import { useAuthStore } from '@/stores/auth'
import { useOpsStore } from '@/stores/ops'

const route = useRoute()
const router = useRouter()
const store = useOpsStore()
const auth = useAuthStore()
const missing = ref(false)
const saving = ref(false)
const editingId = computed(() => (route.name === 'enterprises-edit' ? String(route.params.id ?? '') : ''))
const pageTitle = computed(() => (editingId.value ? '编辑企业档案' : '新建企业档案'))

function createDraft(): EnterpriseDraft {
  return {
    name: '',
    parkId: auth.user?.parkId || parkOptions[0]?.value || '',
    industry: '人工智能',
    status: '待完善',
    contact: '',
    phone: '',
    areaSqm: 0,
    settledAt: '',
    location: '',
    intro: '',
  }
}

const form = reactive(createDraft())
const settledAt = dateModel(
  () => form.settledAt,
  (value) => {
    form.settledAt = value
  },
)

const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: '请填写企业名称', trigger: 'blur' }],
  parkId: [{ required: true, message: '请选择园区', trigger: 'change' }],
  industry: [{ required: true, message: '请选择产业', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  contact: [{ required: true, message: '请填写联系人', trigger: 'blur' }],
  phone: [{ required: true, message: '请填写联系电话', trigger: 'blur' }],
  intro: [{ required: true, message: '请填写档案说明', trigger: 'blur' }],
}

function load() {
  missing.value = false
  if (!editingId.value) {
    Object.assign(form, createDraft())
    return
  }
  const current = store.enterpriseById(editingId.value)
  if (!current) {
    missing.value = true
    return
  }
  Object.assign(form, {
    name: current.name,
    parkId: current.parkId,
    industry: current.industry,
    status: current.status,
    contact: current.contact,
    phone: current.phone,
    areaSqm: current.areaSqm,
    settledAt: current.settledAt,
    location: current.location,
    intro: current.intro,
  })
}

watch(() => route.fullPath, load, { immediate: true })

function onFinish() {
  saving.value = true
  const saved = store.saveEnterprise(
    { ...form, status: form.status as EnterpriseStatus, areaSqm: Number(form.areaSqm) },
    editingId.value || undefined,
  )
  saving.value = false
  if (!saved) {
    message.error('没有找到原档案，未能保存')
    return
  }
  message.success(editingId.value ? '档案已更新' : '档案已建立')
  void router.push(`/enterprises/${saved.id}`)
}
</script>

<template>
  <section>
    <PageHeader eyebrow="企业档案" :title="pageTitle" subtitle="尚未入驻的企业也可以建档。入驻日期可以先空着。" />
    <MissingBlock v-if="missing" message="没有找到要编辑的企业。" to="/enterprises" action="返回企业档案" />
    <div v-else class="block">
      <a-form :model="form" :rules="rules" layout="vertical" @finish="onFinish">
        <div class="form-grid">
          <a-form-item class="span-2" label="企业名称" name="name">
            <a-input v-model:value="form.name" placeholder="企业全称，便于和招商项目对上" />
          </a-form-item>
          <a-form-item label="产业" name="industry">
            <a-select v-model:value="form.industry" :options="toOptions(industries)" />
          </a-form-item>
          <a-form-item label="园区" name="parkId">
            <a-select v-model:value="form.parkId" :options="parkOptions" />
          </a-form-item>
          <a-form-item label="状态" name="status">
            <a-select v-model:value="form.status" :options="toOptions(enterpriseStatuses)" />
          </a-form-item>
          <a-form-item label="用房面积（㎡）" name="areaSqm">
            <a-input-number v-model:value="form.areaSqm" :min="0" :step="100" style="width: 100%" />
          </a-form-item>
          <a-form-item label="入驻日期" name="settledAt">
            <a-date-picker v-model:value="settledAt" value-format="YYYY-MM-DD" style="width: 100%" placeholder="未入驻可留空" />
          </a-form-item>
          <a-form-item label="位置" name="location">
            <a-input v-model:value="form.location" placeholder="例如：M1 智能厂房南跨" />
          </a-form-item>
          <a-form-item label="联系人" name="contact">
            <a-input v-model:value="form.contact" />
          </a-form-item>
          <a-form-item label="联系电话" name="phone">
            <a-input v-model:value="form.phone" />
          </a-form-item>
          <a-form-item class="span-2" label="档案说明" name="intro">
            <a-textarea v-model:value="form.intro" :rows="4" />
          </a-form-item>
        </div>
        <div class="form-actions">
          <a-button type="primary" html-type="submit" :loading="saving">保存</a-button>
          <a-button @click="router.push(editingId ? `/enterprises/${editingId}` : '/enterprises')">取消</a-button>
        </div>
      </a-form>
    </div>
  </section>
</template>
