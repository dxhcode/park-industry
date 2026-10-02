<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import MissingBlock from '@/components/MissingBlock.vue'
import PageHeader from '@/components/PageHeader.vue'
import { dateModel } from '@/composables/dateModel'
import { parkOptions, taskKinds, taskStatuses, toOptions } from '@/mock/options'
import type { TaskKind, TaskStatus, WorkTaskDraft } from '@/mock/ops-types'
import { useAuthStore } from '@/stores/auth'
import { useOpsStore } from '@/stores/ops'

const route = useRoute()
const router = useRouter()
const store = useOpsStore()
const auth = useAuthStore()
const missing = ref(false)
const saving = ref(false)
const editingId = computed(() => (route.name === 'workbench-tasks-edit' ? String(route.params.id ?? '') : ''))
const pageTitle = computed(() => (editingId.value ? '编辑待办' : '新建待办'))

function createDraft(): WorkTaskDraft {
  return {
    title: '',
    kind: '线索跟进',
    status: '待处理',
    parkId: auth.user?.parkId || parkOptions[0]?.value || '',
    owner: auth.user?.name ?? '',
    dueAt: '',
    relatedLabel: '',
    relatedPath: '',
    note: '',
  }
}

const form = reactive(createDraft())
const dueAt = dateModel(
  () => form.dueAt,
  (value) => {
    form.dueAt = value
  },
)

const rules: Record<string, Rule[]> = {
  title: [{ required: true, message: '请填写待办标题', trigger: 'blur' }],
  kind: [{ required: true, message: '请选择类型', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  parkId: [{ required: true, message: '请选择园区', trigger: 'change' }],
  owner: [{ required: true, message: '请填写负责人', trigger: 'blur' }],
  dueAt: [{ required: true, message: '请选择到期日', trigger: 'change' }],
  relatedPath: [
    {
      validator: async (_rule, value: string) => {
        if (value && !value.startsWith('/')) throw new Error('站内路径需要以 / 开头')
      },
      trigger: 'blur',
    },
  ],
}

function load() {
  missing.value = false
  if (!editingId.value) {
    Object.assign(form, createDraft())
    return
  }
  const current = store.taskById(editingId.value)
  if (!current) {
    missing.value = true
    return
  }
  Object.assign(form, {
    title: current.title,
    kind: current.kind,
    status: current.status,
    parkId: current.parkId,
    owner: current.owner,
    dueAt: current.dueAt,
    relatedLabel: current.relatedLabel,
    relatedPath: current.relatedPath,
    note: current.note,
  })
}

watch(() => route.fullPath, load, { immediate: true })

function onFinish() {
  saving.value = true
  const saved = store.saveTask(
    {
      ...form,
      kind: form.kind as TaskKind,
      status: form.status as TaskStatus,
    },
    editingId.value || undefined,
  )
  saving.value = false
  if (!saved) {
    message.error('没有找到原待办，未能保存')
    return
  }
  message.success(editingId.value ? '待办已更新' : '待办已记下')
  void router.push(`/workbench/tasks/${saved.id}`)
}
</script>

<template>
  <section>
    <PageHeader eyebrow="工作台 / 待办" :title="pageTitle" subtitle="保存后只写在这台浏览器里。关联路径可以跳回招商或政策。" />
    <MissingBlock v-if="missing" message="没有找到要编辑的待办。" to="/workbench" action="返回工作台" />
    <div v-else class="block">
      <a-form :model="form" :rules="rules" layout="vertical" @finish="onFinish">
        <div class="form-grid">
          <a-form-item class="span-2" label="标题" name="title">
            <a-input v-model:value="form.title" placeholder="例如：催办远能进场影像" />
          </a-form-item>
          <a-form-item label="类型" name="kind">
            <a-select v-model:value="form.kind" :options="toOptions(taskKinds)" />
          </a-form-item>
          <a-form-item label="状态" name="status">
            <a-select v-model:value="form.status" :options="toOptions(taskStatuses)" />
          </a-form-item>
          <a-form-item label="园区" name="parkId">
            <a-select v-model:value="form.parkId" :options="parkOptions" />
          </a-form-item>
          <a-form-item label="负责人" name="owner">
            <a-input v-model:value="form.owner" />
          </a-form-item>
          <a-form-item label="到期日" name="dueAt">
            <a-date-picker v-model:value="dueAt" value-format="YYYY-MM-DD" style="width: 100%" placeholder="选择日期" />
          </a-form-item>
          <a-form-item label="关联对象" name="relatedLabel">
            <a-input v-model:value="form.relatedLabel" placeholder="项目、企业或合同名称" />
          </a-form-item>
          <a-form-item label="站内路径" name="relatedPath">
            <a-input v-model:value="form.relatedPath" placeholder="/investment/projects/..." />
          </a-form-item>
          <a-form-item class="span-2" label="说明" name="note">
            <a-textarea v-model:value="form.note" :rows="4" placeholder="卡在哪、下一步做什么" />
          </a-form-item>
        </div>
        <div class="form-actions">
          <a-button type="primary" html-type="submit" :loading="saving">保存</a-button>
          <a-button @click="router.push(editingId ? `/workbench/tasks/${editingId}` : '/workbench')">取消</a-button>
        </div>
      </a-form>
    </div>
  </section>
</template>
