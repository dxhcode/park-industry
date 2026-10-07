<script setup lang="ts">
import { PageHeader } from '@park/components'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { performanceStatuses, toOptions } from '@/mock/options'
import type { PerformanceStatus } from '@/mock/types'
import { useAuthStore } from '@/stores/auth'
import { usePipelineStore, type PerformanceDraft } from '@/stores/pipeline'

const route = useRoute()
const router = useRouter()
const store = usePipelineStore()
const auth = useAuthStore()
const missing = ref(false)
const saving = ref(false)
const editingId = computed(() => (route.name === 'signing-performance-edit' ? String(route.params.id ?? '') : ''))

const contractOptions = computed(() =>
  store.contracts.map((item) => ({ label: `${item.code} ${item.title}`, value: item.id })),
)

function createDraft(): PerformanceDraft {
  return {
    contractId: '',
    name: '',
    dueAt: '',
    status: '正常履约',
    metric: '',
    owner: auth.user?.name ?? '',
    note: '',
  }
}

const form = reactive(createDraft())
const rules: Record<string, Rule[]> = {
  contractId: [{ required: true, message: '请选择合同', trigger: 'change' }],
  name: [{ required: true, message: '请填写节点名称', trigger: 'blur' }],
  dueAt: [{ required: true, message: '请选择到期日', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  metric: [{ required: true, message: '请填写完成指标', trigger: 'blur' }],
  owner: [{ required: true, message: '请填写责任人', trigger: 'blur' }],
}

const dueAt = computed({
  get: () => form.dueAt || undefined,
  set: (value?: string) => {
    form.dueAt = value ?? ''
  },
})

function applyContract(contractId: string) {
  const contract = store.contractById(contractId)
  if (!contract) return
  form.contractId = contract.id
  form.owner = contract.owner
}

function load() {
  missing.value = false
  if (!editingId.value) {
    Object.assign(form, createDraft())
    const contractId = typeof route.query.contractId === 'string' ? route.query.contractId : ''
    if (contractId) applyContract(contractId)
    return
  }
  const current = store.performanceById(editingId.value)
  if (!current) {
    missing.value = true
    return
  }
  Object.assign(form, {
    contractId: current.contractId,
    name: current.name,
    dueAt: current.dueAt,
    status: current.status,
    metric: current.metric,
    owner: current.owner,
    note: current.note,
  })
}

watch(() => route.fullPath, load, { immediate: true })

function onFinish() {
  saving.value = true
  const saved = store.savePerformance(
    { ...form, status: form.status as PerformanceStatus },
    editingId.value || undefined,
  )
  saving.value = false
  if (!saved) {
    message.error('没有找到原节点，未能保存')
    return
  }
  message.success(editingId.value ? '节点已更新' : '节点已登记')
  void router.push(`/signing/performance/${saved.id}`)
}
</script>

<template>
  <section>
    <PageHeader eyebrow="签约管理 / 履约" :title="editingId ? '编辑履约节点' : '登记履约节点'" subtitle="节点从合同带出责任人。到期日和指标写清楚，列表才能筛逾期。" />
    <div v-if="missing" class="missing">
      <p>没有找到要编辑的节点。</p>
      <a-button type="primary" @click="router.push('/signing/performance')">返回履约</a-button>
    </div>
    <div v-else class="block">
      <a-form :model="form" :rules="rules" layout="vertical" @finish="onFinish">
        <div class="form-grid">
          <a-form-item class="span-2" label="合同" name="contractId">
            <a-select
              v-model:value="form.contractId"
              :options="contractOptions"
              show-search
              option-filter-prop="label"
              @change="applyContract(String($event ?? ''))"
            />
          </a-form-item>
          <a-form-item label="节点名称" name="name">
            <a-input v-model:value="form.name" placeholder="例如：设备进场、投产、投资到账" />
          </a-form-item>
          <a-form-item label="状态" name="status">
            <a-select v-model:value="form.status" :options="toOptions(performanceStatuses)" />
          </a-form-item>
          <a-form-item label="到期日" name="dueAt">
            <a-date-picker v-model:value="dueAt" value-format="YYYY-MM-DD" style="width: 100%" />
          </a-form-item>
          <a-form-item label="责任人" name="owner">
            <a-input v-model:value="form.owner" />
          </a-form-item>
          <a-form-item class="span-2" label="完成指标" name="metric">
            <a-input v-model:value="form.metric" placeholder="怎样算完成" />
          </a-form-item>
          <a-form-item class="span-2" label="说明" name="note">
            <a-textarea v-model:value="form.note" :rows="4" />
          </a-form-item>
        </div>
        <div class="form-actions">
          <a-button type="primary" html-type="submit" :loading="saving">保存</a-button>
          <a-button @click="router.push(editingId ? `/signing/performance/${editingId}` : '/signing/performance')">取消</a-button>
        </div>
      </a-form>
    </div>
  </section>
</template>
