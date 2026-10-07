<script setup lang="ts">
import { PageHeader } from '@park/components'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import MissingBlock from '@/components/MissingBlock.vue'
import { dateModel } from '@/composables/dateModel'
import { eventKinds, eventStatuses, parkOptions, toOptions } from '@/mock/options'
import type { EventDraft, EventKind, EventStatus } from '@/mock/ops-types'
import { useAuthStore } from '@/stores/auth'
import { useOpsStore } from '@/stores/ops'

const route = useRoute()
const router = useRouter()
const store = useOpsStore()
const auth = useAuthStore()
const missing = ref(false)
const saving = ref(false)
const editingId = computed(() => (route.name === 'promotion-edit' ? String(route.params.id ?? '') : ''))
const pageTitle = computed(() => (editingId.value ? '编辑促进活动' : '新建促进活动'))

function createDraft(): EventDraft {
  return {
    title: '',
    kind: '推介会',
    status: '筹备中',
    parkId: auth.user?.parkId || parkOptions[0]?.value || '',
    heldAt: '',
    place: '',
    host: auth.user?.name ?? '',
    guests: '',
    channel: '',
    note: '',
  }
}

const form = reactive(createDraft())
const heldAt = dateModel(
  () => form.heldAt,
  (value) => {
    form.heldAt = value
  },
)

const rules: Record<string, Rule[]> = {
  title: [{ required: true, message: '请填写活动名称', trigger: 'blur' }],
  kind: [{ required: true, message: '请选择类型', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  parkId: [{ required: true, message: '请选择园区', trigger: 'change' }],
  heldAt: [{ required: true, message: '请选择日期', trigger: 'change' }],
  place: [{ required: true, message: '请填写地点', trigger: 'blur' }],
  host: [{ required: true, message: '请填写主持人', trigger: 'blur' }],
  note: [{ required: true, message: '请填写说明', trigger: 'blur' }],
}

function load() {
  missing.value = false
  if (!editingId.value) {
    Object.assign(form, createDraft())
    return
  }
  const current = store.eventById(editingId.value)
  if (!current) {
    missing.value = true
    return
  }
  Object.assign(form, {
    title: current.title,
    kind: current.kind,
    status: current.status,
    parkId: current.parkId,
    heldAt: current.heldAt,
    place: current.place,
    host: current.host,
    guests: current.guests,
    channel: current.channel,
    note: current.note,
  })
}

watch(() => route.fullPath, load, { immediate: true })

function onFinish() {
  saving.value = true
  const saved = store.saveEvent(
    { ...form, kind: form.kind as EventKind, status: form.status as EventStatus },
    editingId.value || undefined,
  )
  saving.value = false
  if (!saved) {
    message.error('没有找到原活动，未能保存')
    return
  }
  message.success(editingId.value ? '活动已更新' : '活动已登记')
  void router.push(`/promotion/${saved.id}`)
}
</script>

<template>
  <section>
    <PageHeader eyebrow="投资促进" :title="pageTitle" subtitle="沙龙、考察和外出招商用同一张表。嘉宾和渠道可以后补。" />
    <MissingBlock v-if="missing" message="没有找到要编辑的活动。" to="/promotion" action="返回投资促进" />
    <div v-else class="block">
      <a-form :model="form" :rules="rules" layout="vertical" @finish="onFinish">
        <div class="form-grid">
          <a-form-item class="span-2" label="活动名称" name="title">
            <a-input v-model:value="form.title" placeholder="例如：光谷医疗器械闭门沙龙" />
          </a-form-item>
          <a-form-item label="类型" name="kind">
            <a-select v-model:value="form.kind" :options="toOptions(eventKinds)" />
          </a-form-item>
          <a-form-item label="状态" name="status">
            <a-select v-model:value="form.status" :options="toOptions(eventStatuses)" />
          </a-form-item>
          <a-form-item label="园区" name="parkId">
            <a-select v-model:value="form.parkId" :options="parkOptions" />
          </a-form-item>
          <a-form-item label="日期" name="heldAt">
            <a-date-picker v-model:value="heldAt" value-format="YYYY-MM-DD" style="width: 100%" placeholder="选择日期" />
          </a-form-item>
          <a-form-item label="地点" name="place">
            <a-input v-model:value="form.place" />
          </a-form-item>
          <a-form-item label="主持" name="host">
            <a-input v-model:value="form.host" />
          </a-form-item>
          <a-form-item label="渠道" name="channel">
            <a-input v-model:value="form.channel" placeholder="例如：政府转介" />
          </a-form-item>
          <a-form-item class="span-2" label="嘉宾" name="guests">
            <a-input v-model:value="form.guests" placeholder="企业或机构，用顿号隔开" />
          </a-form-item>
          <a-form-item class="span-2" label="说明" name="note">
            <a-textarea v-model:value="form.note" :rows="4" />
          </a-form-item>
        </div>
        <div class="form-actions">
          <a-button type="primary" html-type="submit" :loading="saving">保存</a-button>
          <a-button @click="router.push(editingId ? `/promotion/${editingId}` : '/promotion')">取消</a-button>
        </div>
      </a-form>
    </div>
  </section>
</template>
