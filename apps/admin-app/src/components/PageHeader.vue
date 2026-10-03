<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  eyebrow?: string
}>()
</script>

<template>
  <header class="page-header">
    <div class="main">
      <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
      <h1>{{ title }}</h1>
      <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.extra" class="extra">
      <slot name="extra" />
    </div>
  </header>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  padding: 4px 0 16px;
}

.main {
  min-width: 0;
  padding-left: 14px;
  border-left: 3px solid var(--park-color-highlight);
}

.eyebrow {
  margin: 0 0 6px;
  color: var(--park-color-primary);
  font-size: 12px;
  letter-spacing: 0.16em;
}

h1 {
  margin: 0;
  font-size: 28px;
  line-height: 1.2;
  font-weight: 700;
}

.subtitle {
  max-width: 680px;
  margin: 8px 0 0;
  color: var(--park-color-text-secondary);
  font-size: 14px;
  line-height: 1.7;
}

.extra {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

@media (max-width: 860px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  h1 {
    font-size: 24px;
  }
}
</style>
