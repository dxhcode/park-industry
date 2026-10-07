<script setup lang="ts">
import { PageHeader } from '@park/components'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import MissingBlock from '@/components/MissingBlock.vue'
import SettingsNav from '@/components/SettingsNav.vue'
import { parkOptions, roleNames, roleScopes, roleStates, toOptions } from '@/mock/options'
import type { RoleDraft, RoleName, RoleScope, RoleState } from '@/mock/ops-types'
import { useAuthStore } from '@/stores/auth'
import { useOpsStore } from '@/stores/ops'

const route = useRoute()
const router = useRouter()
const store = useOpsStore()
const auth = useAuthStore()
const missing = ref(false)
const saving = ref(false)
const editingId = computed(() => (route.name === 'settings-roles-edit' ? String(route.params.id ?? '') : ''))
const pageTitle = computed(() => (editingId.value ? '编辑角色权限' : '新建角色权限'))

function createDraft(): RoleDraft {
  return {
    person: '',
    role: '招商经理',
    username: '',
    parkId: auth.user?.parkId || parkOptions[0]?.value || '',
    state: '启用',
    scope: '只读查阅',
    note: '样例同事，不能登录。',
  }
}

const form = reactive(createDraft())

const rules: Record<string, Rule[]> = {
  person: [{ required: true, message: '请填写姓名', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  username: [{ required: true, message: '请填写账号名', trigger: 'blur' }],
  parkId: [{ required: true, message: '请选择园区', trigger: 'change' }],
  state: [{ required: true, message: '请选择状态', trigger: 'change' }],
  scope: [{ required: true, message: '请选择范围', trigger: 'change' }],
  note: [{ required: true, message: '请填写说明', trigger: 'blur' }],
}

function load() {
  missing.value = false
  if (!editingId.value) {
    Object.assign(form, createDraft())
    return
  }
  const current = store.roleById(editingId.value)
  if (!current) {
    missing.value = true
    return
  }
  Object.assign(form, {
    person: current.person,
    role: current.role,
    username: current.username,
    parkId: current.parkId,
    state: current.state,
    scope: current.scope,
    note: current.note,
  })
}

watch(() => route.fullPath, load, { immediate: true })

function onFinish() {
  saving.value = true
  const saved = store.saveRole(
    {
      ...form,
      role: form.role as RoleName,
      state: form.state as RoleState,
      scope: form.scope as RoleScope,
    },
    editingId.value || undefined,
  )
  saving.value = false
  if (!saved) {
    message.error('没有找到原权限，未能保存')
    return
  }
  message.success(editingId.value ? '权限已更新' : '权限已登记')
  void router.push(`/settings/roles/${saved.id}`)
}
</script>

<template>
  <section>
    <SettingsNav />
    <PageHeader eyebrow="系统设置 / 角色权限" :title="pageTitle" subtitle="新账号名不会变成可登录用户。演示登录仍只有三个账号。" />
    <MissingBlock v-if="missing" message="没有找到要编辑的权限。" to="/settings/roles" action="返回角色权限" />
    <div v-else class="block">
      <a-form :model="form" :rules="rules" layout="vertical" @finish="onFinish">
        <div class="form-grid">
          <a-form-item label="姓名" name="person">
            <a-input v-model:value="form.person" />
          </a-form-item>
          <a-form-item label="账号名" name="username">
            <a-input v-model:value="form.username" placeholder="例如：suwan" />
          </a-form-item>
          <a-form-item label="角色" name="role">
            <a-select v-model:value="form.role" :options="toOptions(roleNames)" />
          </a-form-item>
          <a-form-item label="状态" name="state">
            <a-select v-model:value="form.state" :options="toOptions(roleStates)" />
          </a-form-item>
          <a-form-item label="园区" name="parkId">
            <a-select v-model:value="form.parkId" :options="parkOptions" />
          </a-form-item>
          <a-form-item label="范围" name="scope">
            <a-select v-model:value="form.scope" :options="toOptions(roleScopes)" />
          </a-form-item>
          <a-form-item class="span-2" label="说明" name="note">
            <a-textarea v-model:value="form.note" :rows="4" />
          </a-form-item>
        </div>
        <div class="form-actions">
          <a-button type="primary" html-type="submit" :loading="saving">保存</a-button>
          <a-button @click="router.push(editingId ? `/settings/roles/${editingId}` : '/settings/roles')">取消</a-button>
        </div>
      </a-form>
    </div>
  </section>
</template>
