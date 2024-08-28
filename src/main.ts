import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import * as ELIconModules from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import axios from '@/plugins/axios'

const app = createApp(App)

//  统一注册el-icon图标
for (let iconName in ELIconModules) {
  app.component(iconName, ELIconModules[iconName])
}

app.use(createPinia())

app.use(ElementPlus)
app.use(ELIconModules)
app.use(router)

import 'virtual:windi.css'

app.provide('$axios', axios)
app.mount('#app')

// 全局挂载 axios
app.config.globalProperties.$axios = axios //配置axios的全局引用
