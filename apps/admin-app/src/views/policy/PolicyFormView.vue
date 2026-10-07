<script setup lang="ts">
import { PageHeader } from '@park/components'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import MissingBlock from '@/components/MissingBlock.vue'
import { dateModel } from '@/composables/dateModel'
import { parkOptions, policyStatuses, toOptions } from '@/mock/options'
import type { PolicyDraft, PolicyStatus } from '@/mock/ops-types'
import { useAuthStore } from '@/stores/auth'
import { useOpsStore } from '@/stores/ops'

const route = useRoute()
const router = useRouter()
const store = useOpsStore()
const auth = useAuthStore()
const missing = ref(false)
const saving = ref(false)
const editingId = computed(() => (route.name === 'policy-edit' ? String(route.params.id ?? '') : ''))
const pageTitle = computed(() => (editingId.value ? '编辑政策申报' : '新建政策申报'))

function createDraft(): PolicyDraft {
  return {
    title: '',
    policyName: '',
    parkId: auth.user?.parkId || parkOptions[0]?.value || '',
    enterpriseName: '',
    status: '申报中',
    amount: '',
    owner: auth.user?.name ?? '',
    submittedAt: '',
    note: '',
  }
}

const form = reactive(createDraft())
const submittedAt = dateModel(
  () => form.submittedAt,
  (value) => {
    form.submittedAt = value
  },
)

const rules: Record<string, Rule[]> = {
  title: [{ required: true, message: '请填写申报标题', trigger: 'blur' }],
  policyName: [{ required: true, message: '请填写政策名称', trigger: 'blur' }],
  parkId: [{ required: true, message: '请选择园区', trigger: 'change' }],
  enterpriseName: [{ required: true, message: '请填写申报企业', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  amount: [{ required: true, message: '请填写额度', trigger: 'blur' }],
  owner: [{ required: true, message: '请填写经办人', trigger: 'blur' }],
  submittedAt: [{ required: true, message: '请选择申报日期', trigger: 'change' }],
  note: [{ required: true, message: '请填写办理说明', trigger: 'blur' }],
}

function load() {
  missing.value = false
  if (!editingId.value) {
    Object.assign(form, createDraft())
    return
  }
  const current = store.policyById(editingId.value)
  if (!current) {
    missing.value = true
    return
  }
  Object.assign(form, {
    title: current.title,
    policyName: current.policyName,
    parkId: current.parkId,
    enterpriseName: current.enterpriseName,
    status: current.status,
    amount: current.amount,
    owner: current.owner,
    submittedAt: current.submittedAt,
    note: current.note,
  })
}

watch(() => route.fullPath, load, { immediate: true })

function onFinish() {
  saving.value = true
  const saved = store.savePolicy({ ...form, status: form.status as PolicyStatus }, editingId.value || undefined)
  saving.value = false
  if (!saved) {
    message.error('没有找到原申报，未能保存')
    return
  }
  message.success(editingId.value ? '申报已更新' : '申报已登记')
  void router.push(`/policy/${saved.id}`)
}
</script>

<template>
  <section>
    <PageHeader eyebrow="政策兑现" :title="pageTitle" subtitle="企业名称与档案一致时，详情里会带上企业链接。" />
    <MissingBlock v-if="missing" message="没有找到要编辑的申报。" to="/policy" action="返回政策兑现" />
    <div v-else class="block">
      <a-form :model="form" :rules="rules" layout="vertical" @finish="onFinish">
        <div class="form-grid">
          <a-form-item class="span-2" label="申报标题" name="title">
            <a-input v-model:value="form.title" placeholder="例如：海弈固定资产投资奖励" />
          </a-form-item>
          <a-form-item label="政策名称" name="policyName">
            <a-input v-model:value="form.policyName" placeholder="例如：固定资产投资奖励" />
          </a-form-item>
          <a-form-item label="园区" name="parkId">
            <a-select v-model:value="form.parkId" :options="parkOptions" />
          </a-form-item>
          <a-form-item label="申报企业" name="enterpriseName">
            <a-input v-model:value="form.enterpriseName" placeholder="企业全称" />
          </a-form-item>
          <a-form-item label="状态" name="status">
            <a-select v-model:value="form.status" :options="toOptions(policyStatuses)" />
          </a-form-item>
          <a-form-item label="额度" name="amount">
            <a-input v-model:value="form.amount" placeholder="例如：960 万元，或 40 套" />
          </a-form-item>
          <a-form-item label="经办人" name="owner">
            <a-input v-model:value="form.owner" />
          </a-form-item>
          <a-form-item label="申报日期" name="submittedAt">
            <a-date-picker v-model:value="submittedAt" value-format="YYYY-MM-DD" style="width: 100%" placeholder="选择日期" />
          </a-form-item>
          <a-form-item class="span-2" label="办理说明" name="note">
            <a-textarea v-model:value="form.note" :rows="4" />
          </a-form-item>
        </div>
        <div class="form-actions">
          <a-button type="primary" html-type="submit" :loading="saving">保存</a-button>
          <a-button @click="router.push(editingId ? `/policy/${editingId}` : '/policy')">取消</a-button>
        </div>
      </a-form>
    </div>
  </section>
</template>
