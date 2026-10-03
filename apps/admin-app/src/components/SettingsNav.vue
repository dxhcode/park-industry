<script setup lang="ts">
const links = [
  { to: '/settings/orgs', label: '组织架构' },
  { to: '/settings/dicts', label: '数据字典' },
  { to: '/settings/roles', label: '角色权限' },
]
</script>

<template>
  <nav class="settings-nav" aria-label="系统设置">
    <router-link v-for="link in links" :key="link.to" :to="link.to">{{ link.label }}</router-link>
  </nav>
</template>

<style scoped>
.settings-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0 0 14px;
}

.settings-nav a {
  padding: 6px 12px;
  border: 1px solid var(--park-color-border);
  border-radius: 999px;
  color: var(--park-color-text-secondary);
  text-decoration: none;
  background: #fff;
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease,
}

.settings-nav a.router-link-active {
  color: #0e1320;
  border-color: rgba(198, 161, 91, 0.85);
  background: #f8f1e3;
}
</style>
