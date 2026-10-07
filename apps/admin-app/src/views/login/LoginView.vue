<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { LoginPage } from '@park/components'
import type { LoginPayload } from '@park/components'
import { adminAntdTheme } from '@park/theme'
import { demoAccounts, type DemoAccount } from '@/auth/accounts'
import { parks } from '@/mock/parks'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const error = ref('')
const submitting = ref(false)
const pickedUser = ref('')
const pickedPassword = ref('')

function safeRedirect(value: unknown) {
  if (typeof value !== 'string') return '/workbench'
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/login')) return '/workbench'
  return value
}

function applyAccount(account: DemoAccount) {
  pickedUser.value = account.username
  pickedPassword.value = account.password
  error.value = ''
}

function onSubmit(payload: LoginPayload) {
  error.value = ''
  submitting.value = true
  const message = auth.login(payload.username, payload.password)
  submitting.value = false
  if (message) {
    error.value = message
    return
  }
  void router.replace(safeRedirect(route.query.redirect))
}
</script>

<template>
  <a-config-provider :locale="zhCN" :theme="adminAntdTheme">
    <LoginPage
      brand="产业运营平台"
      brand-subtitle="INDUSTRY"
      headline="面向园区招商与签约"
      description="先登录，再进入项目库和合同台账。三个演示账号密码都是 demo123。"
      title="登录"
      subtitle="演示环境，账号只保存在本机浏览器。"
      submit-text="进入运营中台"
      :loading="submitting"
      :error-message="error"
      :initial-username="pickedUser"
      :initial-password="pickedPassword"
      @submit="onSubmit"
    >
      <template #points>
        <li v-for="park in parks" :key="park.id">{{ park.shortName }} · {{ park.city }} · {{ park.name }}</li>
      </template>
      <template #hint>
        <p class="demo-label">演示账号，密码均为 demo123。点一下填入账号。</p>
        <button v-for="account in demoAccounts" :key="account.username" type="button" class="demo" @click="applyAccount(account)">
          <strong>{{ account.name }}</strong>
          <span>{{ account.role }} · {{ account.parkName }}</span>
          <em>{{ account.username }}</em>
        </button>
      </template>
    </LoginPage>
  </a-config-provider>
</template>

<style scoped>
.demo-label {
  margin: 0 0 10px;
  color: var(--park-color-text-secondary);
  font-size: 13px;
}

.demo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 8px;
  padding: 10px 12px;
  border: 1px solid var(--park-color-border);
  border-radius: 12px;
  background: var(--park-color-surface);
  text-align: left;
  cursor: pointer;
}

.demo strong {
  color: var(--park-color-text);
  font-size: 14px;
}

.demo span,
.demo em {
  color: var(--park-color-text-secondary);
  font-size: 12px;
  font-style: normal;
}

.demo:hover,
.demo:focus-visible {
  border-color: var(--park-color-primary);
  outline: none;
}
</style>
