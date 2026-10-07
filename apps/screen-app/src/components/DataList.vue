<script setup lang="ts">
import type { ListRow } from '@/composables/useSceneData'
import { tone } from '@/mock/format'

defineProps<{
  rows: ListRow[]
  empty?: string
}>()
</script>

<template>
  <p v-if="!rows.length" class="empty">{{ empty || '这个范围里还没有记录' }}</p>
  <ul v-else>
    <li v-for="row in rows" :key="row.id">
      <a v-if="row.href" class="hit" :href="row.href">
        <span>
          <strong>{{ row.title }}</strong>
          <span>{{ row.meta }}</span>
        </span>
        <em :style="{ color: tone(row.tone || row.value) }">{{ row.value }}</em>
      </a>
      <div v-else class="hit">
        <span>
          <strong>{{ row.title }}</strong>
          <span>{{ row.meta }}</span>
        </span>
        <em :style="{ color: tone(row.tone || row.value) }">{{ row.value }}</em>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.empty {
  margin: 8px 0;
  color: #93a8bd;
}

ul {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 100%;
  margin: 0;
  padding: 0;
  overflow: auto;
  list-style: none;
}

li {
  border-radius: 10px;
}

.hit {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 10px;
  border: 1px solid rgba(148, 196, 214, 0.12);
  border-radius: 10px;
  color: inherit;
  text-decoration: none;
  background: rgba(8, 16, 28, 0.35);
}

a.hit:hover,
a.hit:focus-visible {
  border-color: rgba(45, 212, 191, 0.65);
  background: rgba(45, 212, 191, 0.08);
  outline: none;
}

.hit > span {
  min-width: 0;
}

strong {
  display: block;
  color: #e7f3ff;
  font-size: 13px;
  font-weight: 620;
}

span {
  color: #8ea6bb;
  font-size: 12px;
}

em {
  flex: none;
  font-style: normal;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}
</style>
