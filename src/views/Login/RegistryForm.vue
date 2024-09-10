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
      <el-form
        :model="registryForm"
        :rules="rules"
        label-position="right"
        label-width="100px"
        class="w-[50%]"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            prefix-icon="UserFilled"
            v-model.trim="registryForm.username"
            maxlength="32"
            placeholder="请输入账号"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
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
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            type="password"
            prefix-icon="Lock"
            v-model="registryForm.confirmPassword"
            placeholder="请确认密码"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="registryForm.phone"
            prefix-icon="Phone"
            placeholder="请输入邮箱"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="registryForm.sex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="registryForm.email"
            prefix-icon="Message"
            placeholder="请输入邮箱"
            clearable
          ></el-input>
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
  username: '',
  password: '',
  confirmPassword: '',
  phone: '',
  sex: 0,
  email: ''
})
//是登录还是注册
const statusHtml = ref<string>('login')

// 从父组件接收方法
const props = defineProps<{ onChange: (type: string) => void }>()

// 调用父组件传递的方法
const loginBtnClick = (type: string) => {
  props.onChange(type)
}

const rules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: (error?: Error) => void) => {
        const phoneRegex = /^1[3-9]\d{9}$/ // 中国大陆手机号验证规则
        if (!phoneRegex.test(value)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: (error?: Error) => void) => {
        if (value !== registryForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

//注册按钮事件
const registryBtnClick = async () => {
  try {
    const response = await axios.get(
      '/Account/CheckRegistry/',
      {
        params: {
          username: registryForm.username,
          password: registryForm.password,
          confirmPassword: registryForm.confirmPassword,
          phone: registryForm.phone,
          sex: registryForm.sex,
          email: registryForm.email
        }
      },
      { withCredentials: true }
    )

    if (response.code == 200) {
      router.push('/login')
    } else {
      ElNotification({
        title: '注册错误',
        message: response.message,
        type: 'error'
      })
    }
  } catch (error) {
    ElNotification({
      title: '注册错误',
      message: error,
      type: 'error'
    })
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
