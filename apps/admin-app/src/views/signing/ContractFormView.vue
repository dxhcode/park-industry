<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import PageHeader from '@/components/PageHeader.vue'
import { contractKinds, contractStatuses, parkOptions, toOptions } from '@/mock/options'
import { findPark } from '@/mock/parks'
import type { ContractKind, ContractStatus } from '@/mock/types'
import { useAuthStore } from '@/stores/auth'
import { usePipelineStore, type ContractDraft } from '@/stores/pipeline'

const route = useRoute()
const router = useRouter()
const store = usePipelineStore()
const auth = useAuthStore()
const missing = ref(false)
const saving = ref(false)
const editingId = computed(() => (route.name === 'signing-contracts-edit' ? String(route.params.id ?? '') : ''))
const pageTitle = computed(() => (editingId.value ? '编辑签约合同' : '新建签约合同'))

const projectOptions = computed(() =>
  store.projects.map((item) => ({ label: `${item.code} ${item.name}`, value: item.id })),
)

function createDraft(): ContractDraft {
  return {
    title: '',
    kind: '投资协议',
    status: '起草中',
    projectId: '',
    parkId: auth.user?.parkId || parkOptions[0]?.value || '',
    partyA: '',
    partyB: '',
    amount: '',
    areaSqm: 1000,
    termYears: 5,
    signedAt: '',
    effectiveAt: '',
    expireAt: '',
    owner: auth.user?.name ?? '',
    clauses: '',
  }
}

const form = reactive(createDraft())

const rules: Record<string, Rule[]> = {
  title: [{ required: true, message: '请填写合同名称', trigger: 'blur' }],
  kind: [{ required: true, message: '请选择合同类型', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  projectId: [{ required: true, message: '请选择关联项目', trigger: 'change' }],
  parkId: [{ required: true, message: '请选择园区', trigger: 'change' }],
  partyB: [{ required: true, message: '请填写乙方', trigger: 'blur' }],
  amount: [{ required: true, message: '请填写金额', trigger: 'blur' }],
  areaSqm: [{ required: true, type: 'number', min: 1, message: '请填写面积', trigger: 'change' }],
  termYears: [{ required: true, type: 'number', min: 1, message: '请填写期限', trigger: 'change' }],
  owner: [{ required: true, message: '请填写责任人', trigger: 'blur' }],
}

function applyProject(projectId: string) {
  const project = store.projectById(projectId)
  if (!project) return
  form.projectId = project.id
  form.parkId = project.parkId
  form.partyB = project.enterpriseName
  form.partyA = findPark(project.parkId)?.partyName ?? ''
  form.amount = project.intentInvestment
  form.areaSqm = project.intentAreaSqm
  form.owner = project.owner || form.owner
  if (!form.title) form.title = `${project.enterpriseName}${form.kind}`
}

function load() {
  missing.value = false
  if (!editingId.value) {
    Object.assign(form, createDraft())
    const projectId = typeof route.query.projectId === 'string' ? route.query.projectId : ''
    if (projectId) applyProject(projectId)
    else form.partyA = findPark(form.parkId)?.partyName ?? ''
    return
  }
  const current = store.contractById(editingId.value)
  if (!current) {
    missing.value = true
    return
  }
  Object.assign(form, {
    title: current.title,
    kind: current.kind,
    status: current.status,
    projectId: current.projectId,
    parkId: current.parkId,
    partyA: current.partyA,
    partyB: current.partyB,
    amount: current.amount,
    areaSqm: current.areaSqm,
    termYears: current.termYears,
    signedAt: current.signedAt,
    effectiveAt: current.effectiveAt,
    expireAt: current.expireAt,
    owner: current.owner,
    clauses: current.clauses,
  })
}

watch(() => route.fullPath, load, { immediate: true })

function onProjectChange(value: unknown) {
  applyProject(String(value ?? ''))
}

function dateModel(field: 'signedAt' | 'effectiveAt' | 'expireAt') {
  return computed({
    get: () => form[field] || undefined,
    set: (value?: string) => {
      form[field] = value ?? ''
    },
  })
}

const signedAt = dateModel('signedAt')
const effectiveAt = dateModel('effectiveAt')
const expireAt = dateModel('expireAt')

function onFinish() {
  saving.value = true
  const saved = store.saveContract(
    {
      ...form,
      kind: form.kind as ContractKind,
      status: form.status as ContractStatus,
      areaSqm: Number(form.areaSqm),
      termYears: Number(form.termYears),
      partyA: form.partyA || findPark(form.parkId)?.partyName || '',
    },
    editingId.value || undefined,
  )
  saving.value = false
  if (!saved) {
    message.error('没有找到原合同，未能保存')
    return
  }
  message.success(editingId.value ? '合同已更新' : '合同已登记')
  void router.push(`/signing/contracts/${saved.id}`)
}

function cancel() {
  if (editingId.value) {
    void router.push(`/signing/contracts/${editingId.value}`)
    return
  }
  void router.push('/signing/contracts')
}
</script>

<template>
  <section>
    <PageHeader eyebrow="签约管理 / 合同" :title="pageTitle" subtitle="合同必须挂到一个招商项目。选择项目后会带出企业、园区和投资额，仍可改。" />
    <div v-if="missing" class="missing">
      <p>没有找到要编辑的合同。</p>
      <a-button type="primary" @click="router.push('/signing/contracts')">返回合同列表</a-button>
    </div>
    <div v-else class="block">
      <a-form :model="form" :rules="rules" layout="vertical" @finish="onFinish">
        <div class="form-grid">
          <a-form-item class="span-2" label="合同名称" name="title">
            <a-input v-model:value="form.title" placeholder="例如：海弈精密减速器投资协议" />
          </a-form-item>
          <a-form-item label="关联项目" name="projectId">
            <a-select v-model:value="form.projectId" :options="projectOptions" show-search option-filter-prop="label" @change="onProjectChange" />
          </a-form-item>
          <a-form-item label="园区" name="parkId">
            <a-select v-model:value="form.parkId" :options="parkOptions" />
          </a-form-item>
          <a-form-item label="类型" name="kind">
            <a-select v-model:value="form.kind" :options="toOptions(contractKinds)" />
          </a-form-item>
          <a-form-item label="状态" name="status">
            <a-select v-model:value="form.status" :options="toOptions(contractStatuses)" />
          </a-form-item>
          <a-form-item label="甲方" name="partyA">
            <a-input v-model:value="form.partyA" placeholder="园区运营主体" />
          </a-form-item>
          <a-form-item label="乙方" name="partyB">
            <a-input v-model:value="form.partyB" placeholder="企业全称" />
          </a-form-item>
          <a-form-item label="金额 / 投资额" name="amount">
            <a-input v-model:value="form.amount" placeholder="例如：1.6 亿元" />
          </a-form-item>
          <a-form-item label="面积（㎡）" name="areaSqm">
            <a-input-number v-model:value="form.areaSqm" :min="1" :step="100" style="width: 100%" />
          </a-form-item>
          <a-form-item label="期限（年）" name="termYears">
            <a-input-number v-model:value="form.termYears" :min="1" :max="30" style="width: 100%" />
          </a-form-item>
          <a-form-item label="责任人" name="owner">
            <a-input v-model:value="form.owner" />
          </a-form-item>
          <a-form-item label="签署日期">
            <a-date-picker v-model:value="signedAt" value-format="YYYY-MM-DD" style="width: 100%" placeholder="未签署可留空" />
          </a-form-item>
          <a-form-item label="生效日期">
            <a-date-picker v-model:value="effectiveAt" value-format="YYYY-MM-DD" style="width: 100%" />
          </a-form-item>
          <a-form-item label="到期日期">
            <a-date-picker v-model:value="expireAt" value-format="YYYY-MM-DD" style="width: 100%" />
          </a-form-item>
          <a-form-item class="span-2" label="关键条款" name="clauses">
            <a-textarea v-model:value="form.clauses" :rows="4" placeholder="投资强度、面积、节点和违约约定" />
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
