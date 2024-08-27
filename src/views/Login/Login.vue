<
<template>
  <el-row class="min-h-screen bg-indigo-500">
    <el-col :span="14" class="flex items-center justify-center">
      <div class="relative flex mx-auto min-h-100vh w-full">
        <div :class="`flex-1 bg-gray-500 bg-opacity-20 relative p-30px lt-xl:hidden`">
          <!-- logo和项目名称 -->
          <div class="flex items-center relative text-white">
            <img src="../../assets/img/logo.png" alt="" id="logoImg" />
            <span class="text-20px font-bold">FAS-29OS</span>
          </div>
          <!-- 图像区域 -->
          <div class="text-gray-200 text-sm flex items-center justify-center h-[calc(100%-60px)]">
            <div class="text-center">
              <img class="w-350px" src="../../assets/svg/login-box-bg.svg" key="1" alt="" />
              <span class="text-20px font-bold">欢迎使用FAS-29OS</span>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="10" class="bg-light-50 flex items-center justify-center flex-col">
      <!-- 右边区域 -->
      <!-- 传递方法给子组件 -->
      <LoginForm v-if="statusHtml === 'login'" :onChange="changeBtnClick" />
      <RegistryForm v-else-if="statusHtml === 'registry'" :onChange="changeBtnClick" />
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, toRaw, reactive, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import { ElNotification } from 'element-plus'
import { el } from 'element-plus/es/locales.mjs'
import LoginForm from './LoginForm.vue'
import RegistryForm from './RegistryForm.vue'

const router = useRouter()
const refThis = ref(null)
//是登录还是注册
const statusHtml = ref<string>('login')

//切换组件
const changeBtnClick = (type: string) => {
  if (type === 'registry') {
    statusHtml.value = 'registry'
  } else if (type === 'login') {
    statusHtml.value = 'login'
  }
}
</script>
<style scoped>
/* 添加你的样式 */
.logoDiv {
  margin: 3% 0 0 1%;
}
#logoImg {
  width: 48px;
}
.loginBg {
  /* height: calc(100% - 300px); */
  width: 70%;
  margin: 17% 0 17% 30%;
}
.login {
  position: absolute; /*图片平铺开来*/
}
#loginForm {
  align-items: center;
  display: flex;
}
.login-card {
  position: absolute;
  left: 5%;
  top: 0%;
  width: 450px;
}
.login-card {
  position: absolute;
  left: 5%;
  top: 0%;
  width: 450px;
}
#indexHtml {
  height: 100%;
  width: 100%;
}
@media (min-width: 1280px) and (max-width: 1535.9px) {
  .at-xl\:max-w-500px {
    max-width: 500px;
  }
}
</style>
