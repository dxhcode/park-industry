<script setup lang="ts">
import { PageHeader } from '@park/components'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import MissingBlock from '@/components/MissingBlock.vue'
import SettingsNav from '@/components/SettingsNav.vue'
import { dictStates, toOptions } from '@/mock/options'
import type { DictDraft, DictState } from '@/mock/ops-types'
import { useOpsStore } from '@/stores/ops'

const route = useRoute()
const router = useRouter()
const store = useOpsStore()
const missing = ref(false)
const saving = ref(false)
const editingId = computed(() => (route.name === 'settings-dicts-edit' ? String(route.params.id ?? '') : ''))
const pageTitle = computed(() => (editingId.value ? '编辑字典' : '新建字典'))

function createDraft(): DictDraft {
  return { category: '产业分类', label: '', value: '', state: '启用', note: '' }
}

const form = reactive(createDraft())

const rules: Record<string, Rule[]> = {
  category: [{ required: true, message: '请填写分类', trigger: 'blur' }],
  label: [{ required: true, message: '请填写名称', trigger: 'blur' }],
  value: [{ required: true, message: '请填写编码', trigger: 'blur' }],
  state: [{ required: true, message: '请选择状态', trigger: 'change' }],
  note: [{ required: true, message: '请填写说明', trigger: 'blur' }],
}

function load() {
  missing.value = false
  if (!editingId.value) {
    Object.assign(form, createDraft())
    return
  }
  const current = store.dictById(editingId.value)
  if (!current) {
    missing.value = true
    return
  }
  Object.assign(form, {
    category: current.category,
    label: current.label,
    value: current.value,
    state: current.state,
    note: current.note,
  })
}

watch(() => route.fullPath, load, { immediate: true })

function onFinish() {
  saving.value = true
  const saved = store.saveDict({ ...form, state: form.state as DictState }, editingId.value || undefined)
  saving.value = false
  if (!saved) {
    message.error('没有找到原字典，未能保存')
    return
  }
  message.success(editingId.value ? '字典已更新' : '字典已建立')
  void router.push(`/settings/dicts/${saved.id}`)
}
</script>

<template>
  <section>
    <SettingsNav />
    <PageHeader eyebrow="系统设置 / 数据字典" :title="pageTitle" subtitle="分类可以新写，例如「政策名称」。停用后仍能在历史快报里看到旧词。" />
    <MissingBlock v-if="missing" message="没有找到要编辑的字典。" to="/settings/dicts" action="返回数据字典" />
    <div v-else class="block">
      <a-form :model="form" :rules="rules" layout="vertical" @finish="onFinish">
        <div class="form-grid">
          <a-form-item label="分类" name="category">
            <a-input v-model:value="form.category" placeholder="例如：产业分类" />
          </a-form-item>
          <a-form-item label="状态" name="state">
            <a-select v-model:value="form.state" :options="toOptions(dictStates)" />
          </a-form-item>
          <a-form-item label="名称" name="label">
            <a-input v-model:value="form.label" placeholder="界面上显示的词" />
          </a-form-item>
          <a-form-item label="编码" name="value">
            <a-input v-model:value="form.value" placeholder="例如：AI" />
          </a-form-item>
          <a-form-item class="span-2" label="说明" name="note">
            <a-textarea v-model:value="form.note" :rows="4" />
          </a-form-item>
        </div>
        <div class="form-actions">
          <a-button type="primary" html-type="submit" :loading="saving">保存</a-button>
          <a-button @click="router.push(editingId ? `/settings/dicts/${editingId}` : '/settings/dicts')">取消</a-button>
        </div>
      </a-form>
    </div>
  </section>
</template>
