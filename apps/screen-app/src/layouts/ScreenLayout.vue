<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import theme from 'ant-design-vue/es/theme'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import Ticker from '@/components/Ticker.vue'
import { scenes } from '@/config/scenes'
import { parks } from '@/mock/ledger'
import { adminHref } from '@/nav/adminLink'
import { useSceneData } from '@/composables/useSceneData'
import { useCockpitStore } from '@/stores/cockpit'
import { useLedgerStore } from '@/stores/ledger'

const cockpit = useCockpitStore()
const ledger = useLedgerStore()
const sceneData = useSceneData()
const route = useRoute()

const themeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#2dd4bf',
    colorInfo: '#38bdf8',
    colorBgBase: '#070b12',
    borderRadius: 10,
    fontFamily:
      '"PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif',
  },
}

const iso = computed(() => cockpit.now.toISOString())
const backHref = computed(() => adminHref(route.query.from))
const sceneQuery = computed(() => {
  const from = route.query.from
  if (typeof from !== 'string') return {}
  if (!from.startsWith('/') || from.startsWith('//') || from.includes('://') || from.includes('?')) return {}
  return { from }
})

onMounted(() => {
  cockpit.startClock()
})

onUnmounted(() => {
  cockpit.stopClock()
})
</script>

<template>
  <a-config-provider :locale="zhCN" :theme="themeConfig">
    <div class="cockpit">
      <div class="atmosphere" aria-hidden="true">
        <div class="grid" />
        <div class="orb orb-a" />
        <div class="orb orb-b" />
        <div class="scan" />
      </div>

      <header class="topbar">
        <div class="side">
          <span class="pulse"><i />链路正常</span>
          <time :datetime="iso">{{ cockpit.clockText }}</time>
        </div>
        <div class="title-wrap">
          <span class="wing" />
          <div class="titles">
            <p>园区产业运营</p>
            <h1>{{ cockpit.headline }} · 产业驾驶舱</h1>
          </div>
          <span class="wing wing-right" />
        </div>
        <div class="side side-end">
          <a class="back" :href="backHref">返回中台</a>
        </div>
      </header>

      <Ticker :items="sceneData.tickerItems" />

      <div class="workspace">
        <nav class="scenes" aria-label="场景导航">
          <router-link
            v-for="(scene, index) in scenes"
            :key="scene.path"
            :to="{ path: scene.path, query: sceneQuery }"
            class="scene"
          >
            <em>{{ String(index + 1).padStart(2, '0') }}</em>
            <span>{{ scene.title }}</span>
          </router-link>
          <p class="nav-label">范围</p>
          <button type="button" class="scene park" :class="{ on: cockpit.parkId === 'all' }" @click="cockpit.showAll">
            <em>00</em>
            <span>三园合计</span>
          </button>
          <button
            v-for="park in parks"
            :key="park.id"
            type="button"
            class="scene park"
            :class="{ on: cockpit.parkId === park.id }"
            @click="cockpit.setPark(park.id)"
          >
            <em :style="{ color: park.color }">●</em>
            <span>{{ park.shortName }}</span>
          </button>
        </nav>
        <main class="stage">
          <router-view v-slot="{ Component, route: current }">
            <transition name="scene" mode="out-in">
              <component :is="Component" :key="current.path" />
            </transition>
          </router-view>
        </main>
      </div>

      <footer class="statusbar">
        <span>产业运营平台</span>
        <span>{{ ledger.label }}</span>
        <span>电话与金额均为虚构</span>
      </footer>
    </div>
  </a-config-provider>
</template>

<style scoped>
.cockpit {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  color: #e7f3ff;
  background: #070b12;
}

.atmosphere {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.grid {
  position: absolute;
  inset: -20%;
  background-image:
    linear-gradient(rgba(94, 234, 212, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(94, 234, 212, 0.07) 1px, transparent 1px);
  background-size: 52px 52px;
  mask-image: radial-gradient(ellipse at center, #000 35%, transparent 78%);
  animation: drift 28s linear infinite;
}

.orb {
  position: absolute;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  filter: blur(30px);
  opacity: 0.45;
}

.orb-a {
  top: -140px;
  left: -80px;
  background: radial-gradient(circle, rgba(45, 212, 191, 0.55), transparent 68%);
  animation: float 16s ease-in-out infinite;
}

.orb-b {
  right: -120px;
  bottom: -160px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.42), transparent 70%);
  animation: float 18s ease-in-out infinite reverse;
}

.scan {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent, rgba(125, 211, 252, 0.05), transparent);
  transform: translateY(-100%);
  animation: scan 9s linear infinite;
}

.topbar,
.workspace,
.statusbar {
  position: relative;
  z-index: 1;
}

.topbar {
  display: grid;
  grid-template-columns: minmax(180px, 1fr) auto minmax(180px, 1fr);
  align-items: center;
  gap: 12px;
  min-height: 84px;
  padding: 14px 22px 8px;
}

.side {
  display: flex;
  align-items: center;
  gap: 14px;
  color: #9fb4c9;
  font-variant-numeric: tabular-nums;
  font-size: 13px;
}

.side-end {
  justify-content: flex-end;
}

.pulse {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #d8fff6;
}

.pulse i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2dd4bf;
  box-shadow: 0 0 12px #2dd4bf;
  animation: blink 1.8s ease-in-out infinite;
}

.title-wrap {
  display: flex;
  align-items: center;
  gap: 16px;
}

.titles {
  text-align: center;
}

.titles p {
  margin: 0 0 4px;
  color: #8ec9c2;
  font-size: 12px;
  letter-spacing: 0.28em;
}

.titles h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 650;
  letter-spacing: 0.08em;
  text-shadow: 0 0 18px rgba(45, 212, 191, 0.35);
}

.wing {
  width: 72px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #2dd4bf);
  box-shadow: 0 0 10px rgba(45, 212, 191, 0.7);
}

.wing-right {
  transform: scaleX(-1);
}

.workspace {
  display: grid;
  grid-template-columns: 212px minmax(0, 1fr);
  flex: 1;
  gap: 16px;
  min-height: 0;
  padding: 8px 18px 12px;
}

.scenes {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
  overflow: auto;
}

.nav-label {
  margin: 6px 2px 0;
  color: #7f93a8;
  font-size: 11px;
  letter-spacing: 0.18em;
}

.back {
  padding: 6px 12px;
  border: 1px solid rgba(45, 212, 191, 0.55);
  border-radius: 999px;
  color: #d8fff6;
  text-decoration: none;
  background: rgba(45, 212, 191, 0.08);
  box-shadow: inset 0 0 12px rgba(45, 212, 191, 0.12);
}

.back:hover {
  border-color: #2dd4bf;
}

.back:focus-visible {
  outline: 2px solid #2dd4bf;
  outline-offset: 2px;
}

.scene {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 12px;
  border: 1px solid rgba(148, 196, 214, 0.18);
  border-radius: 14px;
  color: #d5e6f5;
  text-decoration: none;
  background: rgba(12, 22, 36, 0.55);
  backdrop-filter: blur(12px);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.03);
  transition:
    border-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.scene em {
  color: #7dd3fc;
  font-style: normal;
  font-variant-numeric: tabular-nums;
  font-size: 12px;
}

button.scene {
  width: 100%;
  color: #d5e6f5;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.scene:hover {
  border-color: rgba(45, 212, 191, 0.45);
  transform: translateX(3px);
}

.scene.on {
  border-color: rgba(243, 215, 166, 0.85);
  color: #fff8ea;
  background: linear-gradient(90deg, rgba(243, 215, 166, 0.2), rgba(12, 22, 36, 0.45));
  box-shadow:
    0 0 18px rgba(243, 215, 166, 0.14),
    inset 0 0 0 1px rgba(243, 215, 166, 0.25);
}

.scene.router-link-active {
  border-color: rgba(45, 212, 191, 0.8);
  color: #f4fffd;
  background: linear-gradient(90deg, rgba(45, 212, 191, 0.22), rgba(12, 22, 36, 0.4));
  box-shadow:
    0 0 22px rgba(45, 212, 191, 0.18),
    inset 0 0 0 1px rgba(45, 212, 191, 0.25);
}

.scene:focus-visible {
  outline: 2px solid #2dd4bf;
  outline-offset: 2px;
}

.stage {
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.scene-enter-active,
.scene-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.scene-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.scene-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.statusbar {
  display: flex;
  gap: 22px;
  padding: 8px 22px 12px;
  color: #7f93a8;
  font-size: 12px;
  letter-spacing: 0.08em;
}

@keyframes drift {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(52px);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(24px, 18px, 0);
  }
}

@keyframes scan {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(100%);
  }
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}

@media (max-width: 1100px) {
  .topbar {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .side,
  .side-end {
    justify-content: center;
  }

  .titles h1 {
    font-size: 22px;
  }

  .workspace {
    grid-template-columns: 1fr;
    grid-template-rows: auto minmax(0, 1fr);
  }

  .scenes {
    flex-direction: row;
    overflow-x: auto;
  }

  .scene {
    flex: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .grid,
  .orb,
  .scan,
  .pulse i {
    animation: none;
  }

  .scene-enter-active,
  .scene-leave-active {
    transition: none;
  }

  .scene-enter-from,
  .scene-leave-to {
    transform: none;
  }
}
</style>
