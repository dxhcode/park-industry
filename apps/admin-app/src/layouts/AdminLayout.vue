<script setup lang="ts">
import { computed, h, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import type { MenuProps } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { adminMenus } from '@/config/menus'
import { useShellStore } from '@/stores/shell'

const shell = useShellStore()
const route = useRoute()
const router = useRouter()
const openKeys = ref<string[]>([])

const theme = {
  token: {
    colorPrimary: '#0f766e',
    colorInfo: '#0e7490',
    colorLink: '#0f766e',
    borderRadius: 8,
    fontFamily:
      '"PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif',
  },
}

const selectedKeys = computed(() => [route.path])
const title = computed(() => route.meta.title ?? '产业运营平台')
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
  () => route.path,
  (path) => {
    const parent = adminMenus.find((item) => item.children?.some((child) => child.path === path))
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

function goHome() {
  void router.push('/workbench')
}
</script>

<template>
  <a-config-provider :locale="zhCN" :theme="theme">
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
            <span>运营中台</span>
          </div>
          <a-tag color="gold">原型</a-tag>
          <span class="operator">园区运营</span>
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
  background: #f4f7f8;
}

.sider {
  background: linear-gradient(180deg, #101e30 0%, #09131f 100%) !important;
  border-right: 1px solid rgba(255, 255, 255, 0.04);
  box-shadow: 10px 0 32px rgba(7, 17, 31, 0.16);
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
  border-bottom: 1px solid rgba(232, 196, 138, 0.28);
  background: transparent;
  color: #f4f8fb;
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
  color: #06221e;
  font-weight: 700;
  background: linear-gradient(145deg, #99f6e4, #14b8a6 46%, #e8c48a);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.35),
    0 8px 18px rgba(20, 184, 166, 0.28);
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
  color: #93a4b8;
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
  background: linear-gradient(90deg, rgba(45, 212, 191, 0.24), rgba(45, 212, 191, 0.05)) !important;
  color: #f3fffc !important;
}

.menu-wrap :deep(.ant-menu-item-selected::after) {
  border-inline-end: 3px solid #2dd4bf !important;
}

.header {
  position: sticky;
  top: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 14px;
  height: 64px;
  padding: 0 20px !important;
  line-height: 1.4;
  background: rgba(255, 255, 255, 0.92) !important;
  backdrop-filter: blur(14px);
  border-bottom: 1px solid #e5eeee;
}

.header::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #0f766e, #2dd4bf 42%, #e8c48a);
}

.collapse {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid #d9e4e3;
  border-radius: 8px;
  background: #fff;
  color: #0f766e;
  cursor: pointer;
}

.collapse:focus-visible,
.brand:focus-visible {
  outline: 2px solid #0f766e;
  outline-offset: 2px;
}

.spacer {
  flex: 1;
}

.park {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  line-height: 1.2;
}

.park strong {
  font-size: 13px;
}

.park span,
.operator {
  color: #6b7c8a;
  font-size: 12px;
}

.operator {
  padding-left: 10px;
  border-left: 1px solid #d7e1e4;
}

.content {
  padding: 20px 24px 32px;
}

@media (max-width: 860px) {
  .park,
  .operator {
    display: none;
  }

  .content {
    padding: 16px;
  }
}
</style>
