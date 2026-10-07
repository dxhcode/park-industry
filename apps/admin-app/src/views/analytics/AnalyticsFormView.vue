<script setup lang="ts">
import { PageHeader } from '@park/components'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import MissingBlock from '@/components/MissingBlock.vue'
import { dateModel } from '@/composables/dateModel'
import { reportParkOptions, reportStatuses, toOptions } from '@/mock/options'
import type { ReportDraft, ReportStatus } from '@/mock/ops-types'
import { useAuthStore } from '@/stores/auth'
import { useOpsStore } from '@/stores/ops'

const route = useRoute()
const router = useRouter()
const store = useOpsStore()
const auth = useAuthStore()
const missing = ref(false)
const saving = ref(false)
const editingId = computed(() => (route.name === 'analytics-edit' ? String(route.params.id ?? '') : ''))
const pageTitle = computed(() => (editingId.value ? '编辑阶段快报' : '新建阶段快报'))

function createDraft(): ReportDraft {
  return {
    title: '',
    period: '',
    parkId: auth.user?.parkId || 'all',
    status: '草稿',
    metric: '',
    valueText: '',
    owner: auth.user?.name ?? '',
    publishedAt: '',
    summary: '',
  }
}

const form = reactive(createDraft())
const publishedAt = dateModel(
  () => form.publishedAt,
  (value) => {
    form.publishedAt = value
  },
)

const rules: Record<string, Rule[]> = {
  title: [{ required: true, message: '请填写快报标题', trigger: 'blur' }],
  period: [{ required: true, message: '请填写统计周期', trigger: 'blur' }],
  parkId: [{ required: true, message: '请选择范围', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  metric: [{ required: true, message: '请填写指标名称', trigger: 'blur' }],
  valueText: [{ required: true, message: '请填写数值', trigger: 'blur' }],
  owner: [{ required: true, message: '请填写编写人', trigger: 'blur' }],
  summary: [{ required: true, message: '请填写快报说明', trigger: 'blur' }],
  publishedAt: [
    {
      validator: async () => {
        if (form.status === '已发布' && !form.publishedAt) throw new Error('已发布的快报需要填写发布日期')
      },
      trigger: 'change',
    },
  ],
}

function load() {
  missing.value = false
  if (!editingId.value) {
    Object.assign(form, createDraft())
    return
  }
  const current = store.reportById(editingId.value)
  if (!current) {
    missing.value = true
    return
  }
  Object.assign(form, {
    title: current.title,
    period: current.period,
    parkId: current.parkId,
    status: current.status,
    metric: current.metric,
    valueText: current.valueText,
    owner: current.owner,
    publishedAt: current.publishedAt,
    summary: current.summary,
  })
}

watch(() => route.fullPath, load, { immediate: true })

function onFinish() {
  saving.value = true
  const saved = store.saveReport({ ...form, status: form.status as ReportStatus }, editingId.value || undefined)
  saving.value = false
  if (!saved) {
    message.error('没有找到原快报，未能保存')
    return
  }
  message.success(editingId.value ? '快报已更新' : '快报已登记')
  void router.push(`/analytics/${saved.id}`)
}
</script>

<template>
  <section>
    <PageHeader eyebrow="数据分析" :title="pageTitle" subtitle="数值用文字填写，例如 40% 或 4.3 亿元。这里不生成图。" />
    <MissingBlock v-if="missing" message="没有找到要编辑的快报。" to="/analytics" action="返回数据分析" />
    <div v-else class="block">
      <a-form :model="form" :rules="rules" layout="vertical" @finish="onFinish">
        <div class="form-grid">
          <a-form-item class="span-2" label="标题" name="title">
            <a-input v-model:value="form.title" placeholder="例如：滨江九月线索转化快报" />
          </a-form-item>
          <a-form-item label="统计周期" name="period">
            <a-input v-model:value="form.period" placeholder="例如：2026年9月" />
          </a-form-item>
          <a-form-item label="范围" name="parkId">
            <a-select v-model:value="form.parkId" :options="reportParkOptions" />
          </a-form-item>
          <a-form-item label="状态" name="status">
            <a-select v-model:value="form.status" :options="toOptions(reportStatuses)" />
          </a-form-item>
          <a-form-item label="发布日期" name="publishedAt">
            <a-date-picker v-model:value="publishedAt" value-format="YYYY-MM-DD" style="width: 100%" placeholder="草稿可留空" />
          </a-form-item>
          <a-form-item label="指标" name="metric">
            <a-input v-model:value="form.metric" placeholder="例如：线索转化率" />
          </a-form-item>
          <a-form-item label="数值" name="valueText">
            <a-input v-model:value="form.valueText" placeholder="例如：40%" />
          </a-form-item>
          <a-form-item class="span-2" label="编写人" name="owner">
            <a-input v-model:value="form.owner" />
          </a-form-item>
          <a-form-item class="span-2" label="说明" name="summary">
            <a-textarea v-model:value="form.summary" :rows="4" placeholder="口径、不含哪些数" />
          </a-form-item>
        </div>
        <div class="form-actions">
          <a-button type="primary" html-type="submit" :loading="saving">保存</a-button>
          <a-button @click="router.push(editingId ? `/analytics/${editingId}` : '/analytics')">取消</a-button>
        </div>
      </a-form>
    </div>
  </section>
</template>
