<template>
  <div class="common-layout">
    <el-icon class="el-icon v-icon cursor-pointer"><Fold /></el-icon>
    <Menu />
  </div>
</template>

<script setup lang="ts">
import { ref, toRaw, reactive, watch, computed } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import { ElNotification } from 'element-plus'
import { el } from 'element-plus/es/locales.mjs'
import Menu from './Menu.vue'

const router = useRouter()
const refThis = ref(null)
</script>
<style scoped>
/* 添加你的样式 */
</style>
