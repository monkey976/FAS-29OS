<template>
  <div>
    <!-- logo和项目名称 -->
    <div class="flex items-center relative pt-15px">
      <img src="../../assets/img/logo.png" alt="" id="logoImg" />
      <span class="text-20px font-bold">FAS-29OS</span>
    </div>
    <el-menu :default-active="defaultActive" class="el-menu-demo" mode="horizontal">
      <template v-for="item in menuList" :key="item.id">
        <el-sub-menu v-if="item.children.length > 0" :index="item.id.toString()">
          <template #title>
            <el-icon> <component :is="item.icon" /> </el-icon>
            <span>{{ item.menuName }}</span>
          </template>
          <el-menu-item
            :index="item.id"
            v-for="itemChildren in item.children"
            :key="itemChildren.id"
            >{{ itemChildren.menuName }}
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item v-else :index="item.routeUrl" :key="item.id">
          {{ item.menuName }}
        </el-menu-item>
      </template>
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
const defaultActive = ref(sessionStorage.getItem('path') || '/portaluser')
const menuList = reactive([
  {
    id: 1,
    menuName: '首页',
    pId: '0',
    type: 'menu',
    icon: 'location',
    routeName: 'portaluser',
    routeUrl: '/portaluser',
    children: []
  },
  {
    id: 2,
    menuName: '新闻中心',
    pId: '0',
    type: 'menu',
    icon: 'location',
    routeName: 'portaluser',
    routeUrl: '/portaluser',
    children: []
  },
  {
    id: 3,
    menuName: '公司介绍',
    pId: '0',
    type: 'menu',
    icon: 'location',
    routeName: 'portaluser',
    routeUrl: '/portaluser',
    children: []
  },
  {
    id: 4,
    menuName: '产品服务',
    pId: '0',
    type: 'menu',
    icon: 'location',
    routeName: 'portaluser',
    routeUrl: '/portaluser',
    children: []
  },
  {
    id: 5,
    menuName: '联系我们',
    pId: '0',
    type: 'menu',
    icon: 'location',
    routeName: 'portaluser',
    routeUrl: '/portaluser',
    children: []
  }
])

//存当前点击的路径
const savePath = (path) => {
  sessionStorage.setItem('path', path)
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
  --el-menu-hover-bg-color: rgb(168, 168, 168);
  --el-menu-active-color: var(--left-menu-text-active-color);
  --el-menu-level: 0;
  border-right: none;
}
/* 图片大小设置 */
img {
  max-width: 15%;
}
#logoImg {
  width: 50px;
}
</style>
