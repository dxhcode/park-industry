<script setup lang="ts">
import { useRouter } from 'vue-router'

defineProps<{
  message: string
  to: string
  action: string
}>()

const router = useRouter()
</script>

<template>
  <div class="missing">
    <p>{{ message }}</p>
    <a-button type="primary" @click="router.push(to)">{{ action }}</a-button>
  </div>
</template>
