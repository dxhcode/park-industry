<script setup lang="ts">
defineProps<{
  title: string
  description: string
  primary: string
  secondary?: string
}>()

const emit = defineEmits<{
  primaryClick: []
  secondaryClick: []
}>()
</script>

<template>
  <div class="empty-state">
    <p class="mark" aria-hidden="true">空</p>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <div class="actions">
      <a-button type="primary" @click="emit('primaryClick')">{{ primary }}</a-button>
      <a-button v-if="secondary" @click="emit('secondaryClick')">{{ secondary }}</a-button>
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  padding: 28px 12px 36px;
  text-align: center;
  animation: empty-rise 0.28s ease;
}

.mark {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  margin: 0 auto 10px;
  border: 1px dashed rgba(198, 161, 91, 0.85);
  border-radius: 12px;
  color: #8a6d32;
  background: #f8f1e3;
  font-size: 14px;
  font-weight: 700;
}

h3 {
  margin: 0;
  font-size: 16px;
}

p {
  max-width: 420px;
  margin: 8px auto 0;
  color: var(--park-color-text-secondary);
  line-height: 1.7;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: 14px;
}

@keyframes empty-rise {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .empty-state {
    animation: none;
  }
}
</style>
