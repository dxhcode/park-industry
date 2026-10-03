<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  hint: string
}>()
</script>

<template>
  <article class="metric-card">
    <span>{{ label }}</span>
    <strong>{{ value }}</strong>
    <em>{{ hint }}</em>
  </article>
</template>

<style scoped>
.metric-card {
  position: relative;
  overflow: hidden;
  padding: 12px 14px 10px;
  border: 1px solid rgba(148, 196, 214, 0.2);
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(20, 40, 60, 0.72), rgba(8, 16, 28, 0.45));
  box-shadow: inset 0 0 18px rgba(45, 212, 191, 0.05);
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 2px;
  background: linear-gradient(#2dd4bf, #38bdf8);
  box-shadow: 0 0 10px rgba(45, 212, 191, 0.8);
}

span,
em {
  color: #93a8bd;
  font-size: 12px;
  font-style: normal;
}

strong {
  display: block;
  margin: 6px 0 4px;
  color: #e9fffb;
  font-size: 26px;
  font-weight: 620;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
  text-shadow: 0 0 16px rgba(45, 212, 191, 0.45);
  animation: glowpulse 3.6s ease-in-out infinite;
}

@keyframes glowpulse {
  0%,
  100% {
    text-shadow: 0 0 12px rgba(45, 212, 191, 0.28);
  }
  50% {
    text-shadow: 0 0 18px rgba(125, 211, 252, 0.7);
  }
}

@media (prefers-reduced-motion: reduce) {
  strong {
    animation: none;
  }
}
</style>
