<script setup lang="ts">
defineProps<{
  title: string
  note?: string
}>()
</script>

<template>
  <section class="glow">
    <header>
      <h3>{{ title }}</h3>
      <span v-if="note">{{ note }}</span>
    </header>
    <div class="body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.glow {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  padding: 14px 14px 12px;
  border: 1px solid rgba(125, 211, 252, 0.28);
  border-radius: 16px;
  background:
    linear-gradient(180deg, rgba(18, 36, 54, 0.72), rgba(7, 14, 24, 0.62)),
    rgba(5, 10, 18, 0.45);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.04),
    0 16px 40px rgba(0, 0, 0, 0.22),
    0 0 24px rgba(45, 212, 191, 0.08);
  backdrop-filter: blur(16px);
  overflow: hidden;
}

.glow::after {
  content: '';
  position: absolute;
  top: 0;
  right: 18px;
  left: 18px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(45, 212, 191, 0.85), transparent);
  box-shadow: 0 0 12px rgba(45, 212, 191, 0.65);
}

header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

h3 {
  margin: 0;
  color: #e7f6ff;
  font-size: 15px;
  font-weight: 620;
  letter-spacing: 0.08em;
}

header span {
  color: #8ea6bb;
  font-size: 12px;
}

.body {
  flex: 1;
  min-height: 0;
}
</style>
