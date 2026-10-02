<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import MissingBlock from '@/components/MissingBlock.vue'
import PageHeader from '@/components/PageHeader.vue'
import StatusTag from '@/components/StatusTag.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { confirmRemove } from '@/feedback/confirmRemove'
import { formatArea } from '@/mock/helpers'
import { parkName } from '@/mock/parks'
import { useOpsStore } from '@/stores/ops'
import { usePipelineStore } from '@/stores/pipeline'

const route = useRoute()
const router = useRouter()
const ops = useOpsStore()
const pipeline = usePipelineStore()
const enterpriseId = computed(() => String(route.params.id ?? ''))
const enterprise = computed(() => ops.enterpriseById(enterpriseId.value))
const projects = computed(() => pipeline.projects.filter((item) => item.enterpriseName === enterprise.value?.name))
const rooms = computed(() => ops.spaces.filter((item) => item.tenant === enterprise.value?.name))
const claims = computed(() => ops.policies.filter((item) => item.enterpriseName === enterprise.value?.name))

usePageTitle(() => enterprise.value?.name ?? '')

function remove() {
  const current = enterprise.value
  if (!current) return
  confirmRemove(current.name, () => {
    ops.removeEnterprise(current.id)
    message.success('已从本机移除')
    void router.push('/enterprises')
  })
}
</script>

<template>
  <section>
    <MissingBlock v-if="!enterprise" message="没有找到这家企业。" to="/enterprises" action="返回企业档案" />
    <template v-else>
      <PageHeader eyebrow="企业档案" :title="enterprise.name" :subtitle="enterprise.intro">
        <template #extra>
          <a-button @click="router.push('/enterprises')">返回列表</a-button>
          <a-button danger @click="remove">删除</a-button>
          <a-button type="primary" @click="router.push(`/enterprises/${enterprise.id}/edit`)">编辑</a-button>
        </template>
      </PageHeader>
      <div class="block">
        <a-descriptions bordered :column="2" size="middle">
          <a-descriptions-item label="编号">{{ enterprise.code }}</a-descriptions-item>
          <a-descriptions-item label="状态"><StatusTag :value="enterprise.status" /></a-descriptions-item>
          <a-descriptions-item label="产业">{{ enterprise.industry }}</a-descriptions-item>
          <a-descriptions-item label="园区">{{ parkName(enterprise.parkId) }}</a-descriptions-item>
          <a-descriptions-item label="用房面积">{{ formatArea(enterprise.areaSqm) }}</a-descriptions-item>
          <a-descriptions-item label="入驻日期">{{ enterprise.settledAt || '尚未入驻' }}</a-descriptions-item>
          <a-descriptions-item label="位置">{{ enterprise.location || '—' }}</a-descriptions-item>
          <a-descriptions-item label="联系人">{{ enterprise.contact }} · {{ enterprise.phone }}</a-descriptions-item>
        </a-descriptions>
      </div>
      <div class="block">
        <h2>招商项目</h2>
        <p v-if="projects.length === 0" class="prose">项目库里还没有同名企业。</p>
        <ul v-else class="related">
          <li v-for="item in projects" :key="item.id">
            <router-link :to="`/investment/projects/${item.id}`">{{ item.code }} {{ item.name }}</router-link>
            <StatusTag :value="item.stage" />
          </li>
        </ul>
        <h2>占用空间</h2>
        <p v-if="rooms.length === 0" class="prose">空间台账里还没有把这家企业写成承租方。</p>
        <ul v-else class="related">
          <li v-for="item in rooms" :key="item.id">
            <router-link :to="`/space/${item.id}`">{{ item.name }}</router-link>
            <StatusTag :value="item.status" />
          </li>
        </ul>
        <h2>政策兑现</h2>
        <p v-if="claims.length === 0" class="prose">还没有以这家企业申报的兑现。</p>
        <ul v-else class="related">
          <li v-for="item in claims" :key="item.id">
            <router-link :to="`/policy/${item.id}`">{{ item.code }} {{ item.title }}</router-link>
            <StatusTag :value="item.status" />
          </li>
        </ul>
      </div>
    </template>
  </section>
</template>
