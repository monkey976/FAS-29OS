<
<template>
  <el-row class="min-h-screen bg-indigo-500 w-[100%]">
    <el-col :span="24" class="bg-light-50 flex items-center justify-center flex-col">
      <h2 class="font-bold text-3xl text-gray-800">注册</h2>
      <div class="flex items-center justify-center my-5 text-gray-300 space-x-2">
        <span class="h-[1px] w-16 bg-gray-200"></span>
        <span>注册新用户</span>
        <span class="h-[1px] w-16 bg-gray-200"></span>
      </div>
      <!-- 注册区域 -->
      <el-form :model="registryForm" class="w-[50%]">
        <el-form-item>
          <el-input
            prefix-icon="UserFilled"
            v-model.trim="registryForm.username"
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
            v-model.trim="registryForm.password"
            maxlength="16"
            placeholder="请输入密码"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item class="w-[100%]">
          <el-button
            round
            color="#626aef"
            class="w-[100%]"
            type="primary"
            @click="registryBtnClick()"
            >注册</el-button
          >
        </el-form-item>
        <el-form-item class="w-[100%]">
          <el-button round class="w-[100%]" type="info" @click="loginBtnClick('login')"
            >已有账户</el-button
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

//实体类（注册）
const registryForm = reactive({
  username: 'newuser',
  password: '123',
  verifyCode: ''
})
//是登录还是注册
const statusHtml = ref<string>('login')

// 从父组件接收方法
const props = defineProps<{ onChange: (type: string) => void }>()

// 调用父组件传递的方法
const loginBtnClick = (type: string) => {
  props.onChange(type)
}

//注册按钮事件
const registryBtnClick = async () => {
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
      '/Account/CheckLogin/' + registryForm.username + '/' + registryForm.password,
      { withCredentials: true }
    )
    if (response) {
      router.push('/home')
    } else {
      ElNotification({
        title: '注册错误',
        message: '用户名重复',
        type: 'error'
      })
    }
    console.log('注册成功:', response.data)
  } catch (error) {
    console.error('注册失败:', error)
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
