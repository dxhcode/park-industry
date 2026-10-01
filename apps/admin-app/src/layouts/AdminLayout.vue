<script setup lang="ts">
import { computed, h, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import { Modal, message } from 'ant-design-vue'
import type { MenuProps } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { adminMenus } from '@/config/menus'
import { useAuthStore } from '@/stores/auth'
import { usePipelineStore } from '@/stores/pipeline'
import { useShellStore } from '@/stores/shell'
import { adminAntdTheme } from '@/theme/antd'

const shell = useShellStore()
const auth = useAuthStore()
const pipeline = usePipelineStore()
const route = useRoute()
const router = useRouter()
const openKeys = ref<string[]>([])

const menuPaths = adminMenus.flatMap((menu) =>
  menu.children ? menu.children.map((child) => child.path) : menu.path ? [menu.path] : [],
)

const selectedKeys = computed(() => {
  const path = route.path
  if (menuPaths.includes(path)) return [path]
  const parent = menuPaths
    .filter((item) => path.startsWith(`${item}/`))
    .sort((a, b) => b.length - a.length)[0]
  return [parent ?? path]
})

const title = computed(() => shell.pageTitle || route.meta.title || '产业运营平台')
const group = computed(() => route.meta.group ?? '')

const items = computed<MenuProps['items']>(() =>
  adminMenus.map((menu) => {
    if (menu.children) {
      return {
        key: menu.key,
        icon: () => h(menu.icon),
        label: menu.title,
        children: menu.children.map((child) => ({
          key: child.path,
          label: child.title,
        })),
      }
    }
    return {
      key: menu.path ?? menu.key,
      icon: () => h(menu.icon),
      label: menu.title,
    }
  }),
)

watch(
  () => auth.user?.parkName,
  (name) => {
    if (name) shell.parkName = name
  },
  { immediate: true },
)

watch(
  () => route.path,
  (path) => {
    const parent = adminMenus.find((item) =>
      item.children?.some((child) => path === child.path || path.startsWith(`${child.path}/`)),
    )
    if (!parent || shell.collapsed) return
    if (!openKeys.value.includes(parent.key)) {
      openKeys.value = [...openKeys.value, parent.key]
    }
  },
  { immediate: true },
)

const onMenuClick: MenuProps['onClick'] = (info) => {
  const key = String(info.key)
  if (key.startsWith('/')) {
    void router.push(key)
  }
}

onMounted(() => {
  if (window.matchMedia('(max-width: 860px)').matches) shell.collapsed = true
})

function goHome() {
  void router.push('/workbench')
}

function logout() {
  auth.logout()
  shell.pageTitle = ''
  void router.replace('/login')
}

function resetData() {
  Modal.confirm({
    title: '恢复示例数据？',
    content: '本机对招商项目、线索、拜访、合同和履约的修改会被示例数据覆盖。登录状态保留。',
    okText: '恢复',
    cancelText: '取消',
    onOk() {
      pipeline.reset()
      message.success('已恢复示例数据')
    },
  })
}
</script>

<template>
  <a-config-provider :locale="zhCN" :theme="adminAntdTheme">
    <a-layout class="shell">
      <a-layout-sider
        class="sider"
        :collapsed="shell.collapsed"
        :trigger="null"
        collapsible
        theme="dark"
        :width="232"
        :collapsed-width="72"
      >
        <button class="brand" type="button" @click="goHome">
          <span class="brand-mark">产</span>
          <span v-if="!shell.collapsed" class="brand-text">
            <strong>产业运营平台</strong>
            <small>{{ shell.parkName }}</small>
          </span>
        </button>
        <div class="menu-wrap">
          <a-menu
            v-model:open-keys="openKeys"
            :selected-keys="selectedKeys"
            mode="inline"
            theme="dark"
            :items="items"
            @click="onMenuClick"
          />
        </div>
      </a-layout-sider>
      <a-layout>
        <a-layout-header class="header">
          <button class="collapse" type="button" aria-label="折叠菜单" @click="shell.toggleCollapsed">
            <MenuUnfoldOutlined v-if="shell.collapsed" />
            <MenuFoldOutlined v-else />
          </button>
          <a-breadcrumb>
            <a-breadcrumb-item>产业运营</a-breadcrumb-item>
            <a-breadcrumb-item v-if="group && group !== title">{{ group }}</a-breadcrumb-item>
            <a-breadcrumb-item>{{ title }}</a-breadcrumb-item>
          </a-breadcrumb>
          <div class="spacer" />
          <div class="park">
            <strong>{{ shell.parkName }}</strong>
            <span>{{ auth.user?.role }}</span>
          </div>
          <a-tag color="gold">原型</a-tag>
          <div class="who">
            <strong>{{ auth.user?.name }}</strong>
            <span>{{ auth.user?.title }}</span>
          </div>
          <button class="text-btn" type="button" @click="resetData">恢复示例</button>
          <button class="logout" type="button" @click="logout">退出登录</button>
        </a-layout-header>
        <a-layout-content class="content">
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-config-provider>
</template>

<style scoped>
.shell {
  min-height: 100vh;
  background: var(--park-color-bg);
}

.sider {
  background: linear-gradient(180deg, #1a2236 0%, #0e1320 100%) !important;
  border-right: 1px solid rgba(198, 161, 91, 0.18);
  box-shadow: 10px 0 32px rgba(8, 10, 20, 0.28);
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: auto;
}

.sider :deep(.ant-layout-sider-children) {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 72px;
  padding: 0 16px;
  border: 0;
  border-bottom: 1px solid rgba(198, 161, 91, 0.35);
  background: transparent;
  color: #f4f7ff;
  text-align: left;
  cursor: pointer;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  flex: none;
  border-radius: 10px;
  color: #0e1320;
  font-weight: 700;
  background: linear-gradient(145deg, #f3e6c8, #c6a15b 42%, #1d39c4);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.35), 0 8px 18px rgba(29, 57, 196, 0.35);
}

.brand-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.brand-text strong {
  font-size: 15px;
  letter-spacing: 0.06em;
}

.brand-text small {
  margin-top: 2px;
  color: #b7c0d4;
  font-size: 12px;
}

.menu-wrap {
  flex: 1;
  padding: 12px 10px 24px;
}

.menu-wrap :deep(.ant-menu) {
  background: transparent;
  border-inline-end: 0 !important;
}

.menu-wrap :deep(.ant-menu-item),
.menu-wrap :deep(.ant-menu-submenu-title) {
  width: 100%;
  margin-inline: 0;
  border-radius: 8px;
}

.menu-wrap :deep(.ant-menu-item-selected) {
  background: linear-gradient(90deg, rgba(47, 84, 235, 0.42), rgba(198, 161, 91, 0.16)) !important;
  color: #f4f7ff !important;
}

.menu-wrap :deep(.ant-menu-item-selected::after) {
  border-inline-end: 3px solid #c6a15b !important;
}

.header {
  position: sticky;
  top: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 64px;
  padding: 0 20px !important;
  line-height: 1.4;
  color: var(--park-header-text);
  background: #0e1320 !important;
  border-bottom: 1px solid rgba(198, 161, 91, 0.28);
}

.header::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1d39c4, #c6a15b 70%, #f3e6c8);
}

.header :deep(.ant-breadcrumb),
.header :deep(.ant-breadcrumb a),
.header :deep(.ant-breadcrumb-link),
.header :deep(.ant-breadcrumb-separator) {
  color: rgba(244, 247, 255, 0.62);
}

.header :deep(.ant-breadcrumb li:last-child),
.header :deep(.ant-breadcrumb li:last-child .ant-breadcrumb-link) {
  color: #f4f7ff;
}

.collapse,
.text-btn,
.logout {
  border-radius: 8px;
  cursor: pointer;
}

.collapse {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: transparent;
  color: #f4f7ff;
}

.collapse:focus-visible,
.brand:focus-visible,
.text-btn:focus-visible,
.logout:focus-visible {
  outline: 2px solid #c6a15b;
  outline-offset: 2px;
}

.spacer {
  flex: 1;
}

.park,
.who {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  line-height: 1.2;
}

.park strong,
.who strong {
  color: #f4f7ff;
  font-size: 13px;
}

.park span,
.who span {
  color: #b7c0d4;
  font-size: 12px;
}

.who {
  padding-left: 10px;
  border-left: 1px solid rgba(255, 255, 255, 0.12);
}

.text-btn,
.logout {
  height: 32px;
  padding: 0 12px;
  background: transparent;
  font: inherit;
  font-size: 13px;
}

.text-btn {
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: #d5dced;
}

.logout {
  border: 1px solid rgba(198, 161, 91, 0.7);
  color: #f3e6c8;
}

.content {
  padding: 20px 24px 32px;
}

@media (max-width: 860px) {
  .sider {
    position: fixed !important;
    z-index: 40;
    left: 0;
    top: 0;
  }

  .shell {
    padding-left: 72px;
  }

  .park,
  .who,
  .text-btn {
    display: none;
  }

  .content {
    padding: 16px;
  }
}
</style>
