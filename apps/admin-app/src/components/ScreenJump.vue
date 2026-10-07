<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { screenHref } from '@/nav/screenLink'

const props = withDefaults(
  defineProps<{
    scene: string
    tone?: 'light' | 'dark'
  }>(),
  { tone: 'light' },
)

const route = useRoute()
const href = computed(() => screenHref(props.scene, route.path))
</script>

<template>
  <a class="screen-jump" :class="tone" :href="href"><slot /></a>
</template>

<style scoped>
.screen-jump {
  display: inline-flex;
  align-items: center;
  height: 32px;
  padding: 0 12px;
  border-radius: 8px;
  font-size: 13px;
  text-decoration: none;
  white-space: nowrap;
}

.screen-jump.light {
  border: 1px solid rgba(198, 161, 91, 0.9);
  color: #6d5420;
  background: #fff;
}

.screen-jump.dark {
  border: 1px solid rgba(198, 161, 91, 0.7);
  color: #f3e6c8;
  background: transparent;
}

.screen-jump.light:hover {
  color: #0e1320;
  border-color: #0e1320;
}

.screen-jump.dark:hover {
  color: #fff;
  border-color: #e8c48a;
}

.screen-jump:focus-visible {
  outline: 2px solid #c6a15b;
  outline-offset: 2px;
}
</style>
