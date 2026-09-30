import { createPinia } from 'pinia'
import { createApp } from 'vue'
import Breadcrumb from 'ant-design-vue/es/breadcrumb'
import ConfigProvider from 'ant-design-vue/es/config-provider'
import Layout from 'ant-design-vue/es/layout'
import Menu from 'ant-design-vue/es/menu'
import Tag from 'ant-design-vue/es/tag'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import 'ant-design-vue/dist/reset.css'
import App from './App.vue'
import router from './router'
import './styles/global.css'

dayjs.locale('zh-cn')

createApp(App)
  .use(createPinia())
  .use(router)
  .use(ConfigProvider)
  .use(Layout)
  .use(Menu)
  .use(Breadcrumb)
  .use(Tag)
  .mount('#app')
