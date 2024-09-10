<template>
  <div class="common-layout">
    <el-container>
      <el-header class="h-auto"><Header /></el-header>
      <el-main class="py-0 px-50px h-[calc(100vh-var(--header-height))]">
        <RouterView />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, toRaw, reactive, watch, computed } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import { ElNotification } from 'element-plus'
import { el } from 'element-plus/es/locales.mjs'
import Menu from './Menu.vue'
import Header from './Header.vue'

const router = useRouter()
const refThis = ref(null)
</script>
<style scoped>
/* 添加你的样式 */
</style>
