<script setup lang="ts">
const props = defineProps<{ value: string }>()

const colors: Record<string, string> = {
  线索: 'default',
  初洽: 'processing',
  尽调: 'cyan',
  谈判: 'gold',
  签约: 'purple',
  落地: 'green',
  搁置: 'default',
  起草中: 'default',
  待签署: 'gold',
  已生效: 'green',
  履行中: 'blue',
  已终止: 'red',
  新线索: 'blue',
  跟进中: 'gold',
  已转化: 'green',
  无效: 'default',
  待进行: 'blue',
  待纪要: 'gold',
  已完成: 'green',
  正常履约: 'green',
  即将到期: 'gold',
  逾期: 'red',
  来园接待: 'blue',
  外出拜访: 'purple',
  投资协议: 'geekblue',
  租赁合同: 'cyan',
  补充协议: 'gold',
}
</script>

<template>
  <a-tag :color="colors[props.value] ?? 'default'">{{ props.value || '—' }}</a-tag>
</template>
