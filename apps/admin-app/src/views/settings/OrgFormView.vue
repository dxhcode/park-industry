<script setup lang="ts">
import { PageHeader } from '@park/components'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import MissingBlock from '@/components/MissingBlock.vue'
import SettingsNav from '@/components/SettingsNav.vue'
import { orgKinds, parkOptions, toOptions } from '@/mock/options'
import type { OrgDraft, OrgKind } from '@/mock/ops-types'
import { useAuthStore } from '@/stores/auth'
import { useOpsStore } from '@/stores/ops'

const route = useRoute()
const router = useRouter()
const store = useOpsStore()
const auth = useAuthStore()
const missing = ref(false)
const saving = ref(false)
const editingId = computed(() => (route.name === 'settings-orgs-edit' ? String(route.params.id ?? '') : ''))
const pageTitle = computed(() => (editingId.value ? '编辑组织' : '新建组织'))

function createDraft(): OrgDraft {
  return {
    name: '',
    kind: '部门',
    parkId: auth.user?.parkId || parkOptions[0]?.value || '',
    parentName: '',
    leader: auth.user?.name ?? '',
    note: '',
  }
}

const form = reactive(createDraft())

const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
  kind: [{ required: true, message: '请选择类型', trigger: 'change' }],
  parkId: [{ required: true, message: '请选择园区', trigger: 'change' }],
  leader: [{ required: true, message: '请填写负责人', trigger: 'blur' }],
  note: [{ required: true, message: '请填写说明', trigger: 'blur' }],
}

function load() {
  missing.value = false
  if (!editingId.value) {
    Object.assign(form, createDraft())
    return
  }
  const current = store.orgById(editingId.value)
  if (!current) {
    missing.value = true
    return
  }
  Object.assign(form, {
    name: current.name,
    kind: current.kind,
    parkId: current.parkId,
    parentName: current.parentName,
    leader: current.leader,
    note: current.note,
  })
}

watch(() => route.fullPath, load, { immediate: true })

function onFinish() {
  saving.value = true
  const saved = store.saveOrg({ ...form, kind: form.kind as OrgKind }, editingId.value || undefined)
  saving.value = false
  if (!saved) {
    message.error('没有找到原组织，未能保存')
    return
  }
  message.success(editingId.value ? '组织已更新' : '组织已建立')
  void router.push(`/settings/orgs/${saved.id}`)
}
</script>

<template>
  <section>
    <SettingsNav />
    <PageHeader eyebrow="系统设置 / 组织架构" :title="pageTitle" subtitle="园区节点建议使用合同甲方的公司全称。" />
    <MissingBlock v-if="missing" message="没有找到要编辑的组织。" to="/settings/orgs" action="返回组织架构" />
    <div v-else class="block">
      <a-form :model="form" :rules="rules" layout="vertical" @finish="onFinish">
        <div class="form-grid">
          <a-form-item class="span-2" label="名称" name="name">
            <a-input v-model:value="form.name" />
          </a-form-item>
          <a-form-item label="类型" name="kind">
            <a-select v-model:value="form.kind" :options="toOptions(orgKinds)" />
          </a-form-item>
          <a-form-item label="园区" name="parkId">
            <a-select v-model:value="form.parkId" :options="parkOptions" />
          </a-form-item>
          <a-form-item label="上级" name="parentName">
            <a-input v-model:value="form.parentName" placeholder="园区节点可留空" />
          </a-form-item>
          <a-form-item label="负责人" name="leader">
            <a-input v-model:value="form.leader" />
          </a-form-item>
          <a-form-item class="span-2" label="说明" name="note">
            <a-textarea v-model:value="form.note" :rows="4" />
          </a-form-item>
        </div>
        <div class="form-actions">
          <a-button type="primary" html-type="submit" :loading="saving">保存</a-button>
          <a-button @click="router.push(editingId ? `/settings/orgs/${editingId}` : '/settings/orgs')">取消</a-button>
        </div>
      </a-form>
    </div>
  </section>
</template>
