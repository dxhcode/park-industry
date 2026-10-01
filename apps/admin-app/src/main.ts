import { createPinia } from 'pinia'
import { createApp } from 'vue'
import Alert from 'ant-design-vue/es/alert'
import Breadcrumb from 'ant-design-vue/es/breadcrumb'
import Button from 'ant-design-vue/es/button'
import ConfigProvider from 'ant-design-vue/es/config-provider'
import DatePicker from 'ant-design-vue/es/date-picker'
import Descriptions from 'ant-design-vue/es/descriptions'
import Form from 'ant-design-vue/es/form'
import Input from 'ant-design-vue/es/input'
import InputNumber from 'ant-design-vue/es/input-number'
import Layout from 'ant-design-vue/es/layout'
import Menu from 'ant-design-vue/es/menu'
import Select from 'ant-design-vue/es/select'
import Table from 'ant-design-vue/es/table'
import Tag from 'ant-design-vue/es/tag'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import 'ant-design-vue/dist/reset.css'
import App from './App.vue'
import router from './router'
import './styles/global.css'
import './styles/pipeline.css'

dayjs.locale('zh-cn')

createApp(App)
  .use(createPinia())
  .use(router)
  .use(ConfigProvider)
  .use(Layout)
  .use(Menu)
  .use(Breadcrumb)
  .use(Tag)
  .use(Button)
  .use(Form)
  .use(Input)
  .use(InputNumber)
  .use(Select)
  .use(DatePicker)
  .use(Table)
  .use(Descriptions)
  .use(Alert)
  .mount('#app')
