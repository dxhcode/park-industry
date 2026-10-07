import { createPinia } from 'pinia'
import { createApp } from 'vue'
import ConfigProvider from 'ant-design-vue/es/config-provider'
import Tag from 'ant-design-vue/es/tag'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import 'ant-design-vue/dist/reset.css'
import App from './App.vue'
import router from './router'
import './styles/global.css'
import './styles/scene.css'

dayjs.locale('zh-cn')

createApp(App).use(createPinia()).use(router).use(ConfigProvider).use(Tag).mount('#app')
