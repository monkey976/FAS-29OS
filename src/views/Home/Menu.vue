<template>
  <div>
    <!-- logo和项目名称 -->
    <div class="flex items-center relative text-white p-15px">
      <img src="../../assets/img/logo.png" alt="" id="logoImg" />
      <span class="text-20px font-bold">FAS-29OS</span>
    </div>
    <el-menu
      :default-active="defaultActive"
      active-text-color="#94A3B8"
      class="el-menu el-menu-vertical-demo dark-mode text-white bg-gray-700"
      router
      unique-opened
    >
      <el-menu>
        <template v-for="item in menuList" :key="item.id">
          <!-- 如果 item.children 存在，渲染 el-sub-menu -->
          <el-sub-menu
            v-if="item.children && item.children.length > 0"
            :index="item.id"
            popper-class="dark-mode"
          >
            <template #title>
              <el-icon> <component :is="item.icon" /> </el-icon>
              <span>{{ item.menuName }}</span>
            </template>
            <el-menu-item
              v-for="itemNext in item.children"
              :index="itemNext.routeUrl"
              :key="itemNext.id"
              @click="savePath(itemNext.routeUrl)"
            >
              {{ itemNext.menuName }}
            </el-menu-item>
          </el-sub-menu>

          <!-- 如果 item.children 为空，直接渲染 el-menu-item -->
          <el-menu-item v-else :index="item.routeUrl" @click="savePath(item.routeUrl)">
            <el-icon> <component :is="item.icon" /> </el-icon>
            <span>{{ item.menuName }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, toRaw, reactive, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import { ElNotification } from 'element-plus'
import { el } from 'element-plus/es/locales.mjs'
import { Document, Menu as IconMenu, Location, Setting } from '@element-plus/icons-vue'

const router = useRouter()
const refThis = ref(null)

const isCollapse = ref(false) //菜单打开展示全还是不打开展示图标
const defaultActive = ref(sessionStorage.getItem('path') || '/portal')
const menuList = reactive([
  {
    id: 1,
    menuName: '首页',
    pId: '0',
    type: 'menu',
    icon: 'location',
    routeName: 'portal',
    routeUrl: '/portal',
    children: []
  },
  {
    id: 3,
    menuName: '病患模块',
    pId: '0',
    type: 'menu',
    icon: 'List',
    routeName: '',
    routeUrl: '',
    children: [
      {
        id: 32,
        menuName: '病历管理',
        pId: '3',
        type: 'menu',
        icon: '',
        routeName: 'caseHistory',
        routeUrl: '/caseHistory',
        children: []
      }
    ]
  }
])

//存当前点击的路径
const savePath = (path) => {
  sessionStorage.setItem('path', path)
  defaultActive.value = path
  router.push(path)
}
</script>

<style scoped>
/* 添加你的样式 */

.el-menu {
  /* 目录样式 */
  --el-menu-text-color: var(--left-menu-text-color);
  --el-menu-hover-text-color: var(--left-menu-text-color);
  --el-menu-bg-color: var(--left-menu-bg-color);
  --el-menu-hover-bg-color: rgb(0, 0, 0);
  --el-menu-active-color: var(--left-menu-text-active-color);
  --el-menu-level: 0;
  border-right: none;
}
/* 图片大小设置 */
img {
  max-width: 15%;
}
</style>
