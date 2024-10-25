<template>
  <div class="flex common-layout justify-between items-center border-b-2">
    <div>
      <el-icon class="el-icon v-icon cursor-pointer"><Fold /></el-icon>
    </div>

    <div class="flex items-center relative pt-15px">
      <div>
        <el-avatar :src="filterPath" />
      </div>
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          {{ userName }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="viewProfile(userId)">个人信息</el-dropdown-item>
            <el-dropdown-item @click="dialogVisibleEdit = true">修改个人信息</el-dropdown-item>
            <el-dropdown-item @click="logout()">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dialog v-model="dialogVisible" title="个人信息" width="35%" draggable>
        <!-- 用户详细信息展示 -->
        <div class="flex items-center p-4 bg-white rounded-md">
          <!-- 左侧头像 -->
          <div class="w-24 h-24 flex justify-center items-center">
            <el-avatar :src="filterPath" size="large" alt="用户头像" />
          </div>

          <!-- 右侧用户信息 -->
          <div class="w-auto">
            <div class="space-y-4 text-gray-700 p-6 rounded-lg">
              <el-col :span="24">
                <p class="text-lg">
                  <strong>用户名:</strong>
                  <span class="text-gray-900">{{ myInfo.userName }}</span>
                </p>
              </el-col>
              <el-col :span="24">
                <p class="text-lg">
                  <strong>电话号码:</strong>
                  <span class="text-gray-900">{{ myInfo.phoneNumber }}</span>
                </p>
              </el-col>
              <el-col :span="24">
                <p class="text-lg">
                  <strong>邮箱:</strong>
                  <span class="text-gray-900">{{ myInfo.email }}</span>
                </p>
              </el-col>
              <el-col :span="24">
                <p class="text-lg">
                  <strong>所属医院:</strong>
                  <span class="text-gray-900">上海市虹桥医院1</span>
                </p>
              </el-col>
              <el-col :span="24">
                <p class="text-lg">
                  <strong>所属科室:</strong>
                  <span class="text-gray-900">外科</span>
                </p>
              </el-col>
            </div>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-end space-x-4 pt-4">
            <el-button type="primary" @click="dialogVisibleEdit = true">修改个人信息</el-button>
          </div>
        </template>
      </el-dialog>

      <el-dialog v-model="dialogVisibleEdit" title="编辑个人信息" width="40%" draggable>
        <el-form :model="myInfo" :rules="rules" label-width="100px">
          <el-form-item label="头像">
            <el-upload
              :http-request="changeProfilePhoto"
              :show-file-list="false"
              :before-upload="handleBeforeUpload"
            >
              <el-avatar :src="filterPath" size="large" class="cursor-pointer" />
            </el-upload>
          </el-form-item>

          <el-form-item label="原密码" prop="currentPassword">
            <el-input type="password" v-model="myInfo.currentPassword" />
          </el-form-item>

          <el-form-item label="新密码" prop="newPassword">
            <el-input type="password" v-model="myInfo.newPassword" />
          </el-form-item>

          <el-form-item label="确认新密码" prop="confirmPassword">
            <el-input type="password" v-model="myInfo.confirmPassword" />
          </el-form-item>
        </el-form>

        <template #footer>
          <div class="flex justify-end space-x-4 pt-4">
            <el-button @click="dialogVisibleEdit = false">取消</el-button>
            <el-button type="primary" @click="submitProfile">保存</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import { ElNotification, ElMessage } from 'element-plus'
import { getUserId, getUserName } from '@/utils/auth'
import { FILTER_PATH_USER } from '../../utils/constant'
import userMyImg from '@/assets/img/userMyImg.png'

const router = useRouter()
const dialogVisible = ref(false)
const dialogVisibleEdit = ref(false)

const userId = getUserId()
const userName = getUserName()
const userToken = localStorage.getItem('token')
const userImg = localStorage.getItem('userImg') || '' // 默认头像

// 使用响应式变量，判断是否为空
const filterPath = computed(() => {
  if (userImg == undefined || userImg == null || userImg == '' || userImg == 'undefined') {
    return userMyImg
  } else {
    return ref(`${FILTER_PATH_USER}${userImg}`)
  }
})
// 存储用户信息
const myInfo = reactive({
  userId: '',
  userName: 'admin',
  phoneNumber: 'admin123',
  email: '',
  profilePhoto: '',
  hospital: '上海市虹桥医院1',
  department: '外科',
  currentPassword: '',
  newPassword: ''
})

// 表单验证规则
const rules = reactive({
  currentPassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, message: '密码不能少于8位', trigger: 'blur' },
    { pattern: /[A-Za-z]/, message: '密码必须包含一个字母', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: (error?: Error) => void) => {
        if (value === myInfo.currentPassword) {
          callback(new Error('原密码和旧密码相同'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    { required: true, message: '请输入确认新密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: (error?: Error) => void) => {
        if (value !== myInfo.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

// 上传头像并处理响应
const changeProfilePhoto = async (request) => {
  const formData = new FormData()
  formData.append('userId', userId)
  formData.append('photo', request.file)

  try {
    const response = await axios.post('/api/account/changeProfilePhoto', formData, {
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'multipart/form-data' // 设置正确的 Content-Type
      },
      withCredentials: true
    })

    if (response.code === 200) {
      dialogVisibleEdit.value = false
      await viewProfile() // 重新加载个人信息
      ElMessage.success('头像上传成功')
    } else {
      ElNotification({
        title: '上传失败',
        message: response.msg,
        type: 'error'
      })
    }
  } catch (error) {
    ElNotification({
      title: '上传错误',
      message: error.message || '上传失败',
      type: 'error'
    })
  }
}

// 查看个人信息
const viewProfile = async () => {
  dialogVisible.value = true
  try {
    const response = await axios.post(
      '/api/account/getAccountInfo',
      { userId: userId },
      { headers: { Authorization: `Bearer ${userToken}` }, withCredentials: true }
    )

    if (response.code === 200) {
      localStorage.setItem('userImg', response.data.profilePhoto)
      filterPath.value = `${FILTER_PATH_USER}${response.data.profilePhoto}` // 更新头像路径
      Object.assign(myInfo, response.data)
    } else {
      dialogVisible.value = false
      ElNotification({
        title: '查询个人信息失败',
        message: response.message,
        type: 'error'
      })
    }
  } catch (error) {
    dialogVisible.value = false
    ElNotification({
      title: '查询个人信息错误',
      message: error,
      type: 'error'
    })
  }
}

// 提交修改的个人信息
const submitProfile = async () => {
  try {
    const response = await axios.post('/api/account/changePassword', myInfo, {
      headers: { Authorization: `Bearer ${userToken}` },
      withCredentials: true
    })

    if (response.code === 200) {
      ElNotification({
        title: '修改成功',
        message: '修改密码后需重新登录系统',
        type: 'success'
      })
      localStorage.clear()
      router.push('/login')
      dialogVisible.value = false
    } else {
      ElNotification({
        title: '修改失败',
        message: response.msg,
        type: 'error'
      })
    }
  } catch (error) {
    ElNotification({
      title: '修改个人信息错误',
      message: error,
      type: 'error'
    })
  }
}

// 文件上传前的处理
const handleBeforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('上传头像只能是图片文件')
  }
  return isImage // 返回布尔值以确定是否上传
}

// 登出处理
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  router.push('/login')
}
viewProfile(userId)
dialogVisible.value = false
</script>

<style scoped>
.common-layout {
  height: 64px;
}
</style>
