<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { demoAccounts, type DemoAccount } from '@/auth/accounts'
import { parks } from '@/mock/parks'
import { useAuthStore } from '@/stores/auth'
import { adminAntdTheme } from '@/theme/antd'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const error = ref('')
const submitting = ref(false)

const form = reactive({
  username: '',
  password: '',
})

const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

function safeRedirect(value: unknown) {
  if (typeof value !== 'string') return '/workbench'
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/login')) return '/workbench'
  return value
}

function applyAccount(account: DemoAccount) {
  form.username = account.username
  form.password = account.password
  error.value = ''
}

function submit() {
  error.value = ''
  submitting.value = true
  const message = auth.login(form.username, form.password)
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
    <main class="login">
      <section class="intro">
        <p class="mark">产</p>
        <h1>产业运营平台</h1>
        <p class="lead">面向园区招商与签约的运营中台。先登录，再进入项目库和合同台账。</p>
        <ul>
          <li v-for="park in parks" :key="park.id">
            <strong>{{ park.shortName }}</strong>
            <span>{{ park.city }} · {{ park.name }}</span>
          </li>
        </ul>
      </section>
      <section class="panel">
        <h2>登录</h2>
        <p class="hint">演示环境，账号只保存在本机浏览器。</p>
        <a-alert v-if="error" class="alert" type="error" :message="error" show-icon />
        <a-form :model="form" :rules="rules" layout="vertical" @finish="submit">
          <a-form-item label="账号" name="username">
            <a-input v-model:value="form.username" size="large" autocomplete="username" placeholder="请输入账号" />
          </a-form-item>
          <a-form-item label="密码" name="password">
            <a-input-password
              v-model:value="form.password"
              size="large"
              autocomplete="current-password"
              placeholder="请输入密码"
            />
          </a-form-item>
          <a-button type="primary" html-type="submit" size="large" block :loading="submitting">进入运营中台</a-button>
        </a-form>
        <div class="demos">
          <p>演示账号，密码均为 demo123</p>
          <button v-for="account in demoAccounts" :key="account.username" type="button" class="demo" @click="applyAccount(account)">
            <strong>{{ account.name }}</strong>
            <span>{{ account.role }} · {{ account.parkName }}</span>
            <em>{{ account.username }}</em>
          </button>
        </div>
      </section>
    </main>
  </a-config-provider>
</template>

<style scoped>
.login {
  display: grid;
  grid-template-columns: minmax(280px, 1.1fr) minmax(320px, 480px);
  min-height: 100vh;
  background: #0e1320;
}

.intro {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 64px 56px;
  color: #f4f7ff;
  background:
    radial-gradient(520px 240px at 0% 0%, rgba(29, 57, 196, 0.45), transparent 60%),
    radial-gradient(420px 220px at 100% 100%, rgba(198, 161, 91, 0.22), transparent 55%),
    linear-gradient(165deg, #141a2a, #0e1320 58%);
}

.mark {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  margin: 0 0 18px;
  border-radius: 14px;
  color: #0e1320;
  font-weight: 700;
  background: linear-gradient(145deg, #f3e6c8, #c6a15b 46%, #1d39c4);
}

h1 {
  margin: 0;
  font-size: 36px;
  letter-spacing: 0.08em;
}

.lead {
  max-width: 460px;
  margin: 12px 0 28px;
  color: rgba(244, 247, 255, 0.72);
  line-height: 1.7;
}

ul {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

li {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-left: 12px;
  border-left: 2px solid rgba(198, 161, 91, 0.8);
}

li span {
  color: rgba(244, 247, 255, 0.62);
  font-size: 13px;
}

.panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 48px 40px;
  background: #f3f5fb;
}

h2 {
  margin: 0;
  font-size: 28px;
}

.hint,
.demos p {
  color: #5c6578;
}

.hint {
  margin: 8px 0 18px;
}

.alert {
  margin-bottom: 16px;
}

.demos {
  margin-top: 28px;
}

.demos p {
  margin: 0 0 10px;
  font-size: 13px;
}

.demo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 8px;
  padding: 10px 12px;
  border: 1px solid rgba(14, 19, 32, 0.1);
  border-radius: 12px;
  background: #fff;
  text-align: left;
  cursor: pointer;
}

.demo strong {
  font-size: 14px;
}

.demo span,
.demo em {
  color: #5c6578;
  font-size: 12px;
  font-style: normal;
}

.demo:hover,
.demo:focus-visible {
  border-color: #1d39c4;
  outline: none;
}

@media (max-width: 860px) {
  .login {
    grid-template-columns: 1fr;
  }

  .intro,
  .panel {
    padding: 32px 20px;
  }

  h1 {
    font-size: 28px;
  }
}
</style>
