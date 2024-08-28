<
<template>
  <el-row class="min-h-screen bg-indigo-500 w-[100%]">
    <el-col :span="24" class="bg-light-50 flex items-center justify-center flex-col">
      <h2 class="font-bold text-3xl text-gray-800">登录</h2>
      <div class="flex items-center justify-center my-5 text-gray-300 space-x-2">
        <span class="h-[1px] w-16 bg-gray-200"></span>
        <span>账号密码登录</span>
        <span class="h-[1px] w-16 bg-gray-200"></span>
      </div>
      <!-- 登录区域 -->
      <el-form :model="loginForm" class="w-[50%]">
        <el-form-item>
          <el-input
            prefix-icon="UserFilled"
            v-model.trim="loginForm.username"
            maxlength="32"
            placeholder="请输入账号"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            type="password"
            prefix-icon="Lock"
            v-model.trim="loginForm.password"
            maxlength="16"
            placeholder="请输入密码"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item class="w-[100%]">
          <el-button round color="#626aef" class="w-[100%]" type="primary" @click="loginBtnClick()"
            >登 录</el-button
          >
        </el-form-item>
        <el-form-item class="w-[100%]">
          <el-button round class="w-[100%]" type="info" @click="registryBtnClick('registry')"
            >注 册</el-button
          >
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import { ElNotification } from 'element-plus'
import { el } from 'element-plus/es/locales.mjs'

const router = useRouter()
const refThis = ref(null)
//实体类（登录）
const loginForm = reactive({
  username: 'admin',
  password: 'admin123',
  verifyCode: ''
})
//是登录还是注册
const statusHtml = ref<string>('login')

// 从父组件接收方法
const props = defineProps<{ onChange: (type: string) => void }>()

// 调用父组件传递的方法
const registryBtnClick = (type: string) => {
  props.onChange(type)
}

//登录按钮事件
const loginBtnClick = async () => {
  try {
    //post
    // const response = await axios.post('/Account/CheckLogin', {
    //   username: loginForm.username,
    //   password: loginForm.password
    // })
    //get
    // const response = await axios.get('/Account/CheckLogin', {
    //   params: {
    //     aUsername: loginForm.username,
    //     aPassword: loginForm.password
    //   }
    // })
    const response = await axios.get(
      '/Account/CheckLogin/' + loginForm.username + '/' + loginForm.password,
      { withCredentials: true }
    )
    if (response) {
      router.push('/home')
    } else {
      ElNotification({
        title: '登录错误',
        message: '用户名密码错误',
        type: 'error'
      })
    }
    console.log('登录成功:', response.data)
  } catch (error) {
    console.error('登录失败:', error)
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
