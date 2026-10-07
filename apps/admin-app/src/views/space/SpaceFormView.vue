<script setup lang="ts">
import { PageHeader } from '@park/components'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import MissingBlock from '@/components/MissingBlock.vue'
import { parkOptions, spaceKinds, spaceStatuses, toOptions } from '@/mock/options'
import type { SpaceDraft, SpaceKind, SpaceStatus } from '@/mock/ops-types'
import { useAuthStore } from '@/stores/auth'
import { useOpsStore } from '@/stores/ops'

const route = useRoute()
const router = useRouter()
const store = useOpsStore()
const auth = useAuthStore()
const missing = ref(false)
const saving = ref(false)
const editingId = computed(() => (route.name === 'space-edit' ? String(route.params.id ?? '') : ''))
const pageTitle = computed(() => (editingId.value ? '编辑空间资源' : '新建空间资源'))

function createDraft(): SpaceDraft {
  return {
    name: '',
    parkId: auth.user?.parkId || parkOptions[0]?.value || '',
    building: '',
    floor: '',
    kind: '研发楼',
    status: '可招商',
    areaSqm: 1000,
    rent: '',
    tenant: '',
    note: '',
  }
}

const form = reactive(createDraft())

const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: '请填写资源名称', trigger: 'blur' }],
  parkId: [{ required: true, message: '请选择园区', trigger: 'change' }],
  building: [{ required: true, message: '请填写楼栋', trigger: 'blur' }],
  floor: [{ required: true, message: '请填写楼层', trigger: 'blur' }],
  kind: [{ required: true, message: '请选择类型', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  areaSqm: [{ required: true, type: 'number', min: 1, message: '请填写面积', trigger: 'change' }],
  note: [{ required: true, message: '请填写说明', trigger: 'blur' }],
}

function load() {
  missing.value = false
  if (!editingId.value) {
    Object.assign(form, createDraft())
    return
  }
  const current = store.spaceById(editingId.value)
  if (!current) {
    missing.value = true
    return
  }
  Object.assign(form, {
    name: current.name,
    parkId: current.parkId,
    building: current.building,
    floor: current.floor,
    kind: current.kind,
    status: current.status,
    areaSqm: current.areaSqm,
    rent: current.rent,
    tenant: current.tenant,
    note: current.note,
  })
}

watch(() => route.fullPath, load, { immediate: true })

function onFinish() {
  saving.value = true
  const saved = store.saveSpace(
    {
      ...form,
      kind: form.kind as SpaceKind,
      status: form.status as SpaceStatus,
      areaSqm: Number(form.areaSqm),
    },
    editingId.value || undefined,
  )
  saving.value = false
  if (!saved) {
    message.error('没有找到原资源，未能保存')
    return
  }
  message.success(editingId.value ? '资源已更新' : '资源已建档')
  void router.push(`/space/${saved.id}`)
}
</script>

<template>
  <section>
    <PageHeader eyebrow="产业空间" :title="pageTitle" subtitle="空置和可招商可以不填承租方。在租请写企业全称，方便从档案跳过来。" />
    <MissingBlock v-if="missing" message="没有找到要编辑的空间资源。" to="/space" action="返回产业空间" />
    <div v-else class="block">
      <a-form :model="form" :rules="rules" layout="vertical" @finish="onFinish">
        <div class="form-grid">
          <a-form-item class="span-2" label="资源名称" name="name">
            <a-input v-model:value="form.name" placeholder="例如：C1 低区" />
          </a-form-item>
          <a-form-item label="楼栋" name="building">
            <a-input v-model:value="form.building" placeholder="例如：C1 研发中心" />
          </a-form-item>
          <a-form-item label="楼层" name="floor">
            <a-input v-model:value="form.floor" placeholder="例如：1-2 层" />
          </a-form-item>
          <a-form-item label="园区" name="parkId">
            <a-select v-model:value="form.parkId" :options="parkOptions" />
          </a-form-item>
          <a-form-item label="类型" name="kind">
            <a-select v-model:value="form.kind" :options="toOptions(spaceKinds)" />
          </a-form-item>
          <a-form-item label="状态" name="status">
            <a-select v-model:value="form.status" :options="toOptions(spaceStatuses)" />
          </a-form-item>
          <a-form-item label="面积（㎡）" name="areaSqm">
            <a-input-number v-model:value="form.areaSqm" :min="1" :step="100" style="width: 100%" />
          </a-form-item>
          <a-form-item label="租金" name="rent">
            <a-input v-model:value="form.rent" placeholder="例如：4.6 元/㎡·天，或合同价" />
          </a-form-item>
          <a-form-item class="span-2" label="承租方" name="tenant">
            <a-input v-model:value="form.tenant" placeholder="企业全称，空置可留空" />
          </a-form-item>
          <a-form-item class="span-2" label="说明" name="note">
            <a-textarea v-model:value="form.note" :rows="4" />
          </a-form-item>
        </div>
        <div class="form-actions">
          <a-button type="primary" html-type="submit" :loading="saving">保存</a-button>
          <a-button @click="router.push(editingId ? `/space/${editingId}` : '/space')">取消</a-button>
        </div>
      </a-form>
    </div>
  </section>
</template>
