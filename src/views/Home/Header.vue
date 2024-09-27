<template>
  <div class="flex common-layout justify-between items-center">
    <div>
      <el-icon class="el-icon v-icon cursor-pointer"><Fold /></el-icon>
    </div>

    <div class="flex items-center relative pt-15px">
      <div>
        <el-avatar src="/src/assets/img/userImg.png" />
      </div>
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          {{ userName }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <!-- 个人信息 -->
            <el-dropdown-item @click="viewProfile(userId)">个人信息</el-dropdown-item>
            <!-- 修改密码 -->
            <el-dropdown-item @click="changePassword">修改密码</el-dropdown-item>
            <!-- 退出登录 -->
            <el-dropdown-item @click="logout()">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dialog v-model="dialogVisible" title="个人信息" width="30%" draggable>
        <!-- 用户详细信息展示 -->
        <div class="flex items-center p-4 bg-white rounded-md">
          <!-- 左侧头像 -->
          <div class="w-24 h-24 flex justify-center items-center">
            <el-avatar src="/src/assets/img/userImg.png" size="large" alt="User Avatar" />
          </div>

          <!-- 右侧用户信息 -->
          <div class="w-auot">
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
                  <span class="text-gray-900">上海市虹桥医院</span>
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

        <!-- 底部按钮 -->
        <!-- <template #footer>
          <div class="flex justify-end space-x-4 pt-4">
            <el-button @click="dialogVisible = false">关闭</el-button>
            <el-button type="primary" @click="dialogVisible = false">修改密码</el-button>
          </div>
        </template> -->
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRaw, reactive, watch, computed } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import { ElNotification } from 'element-plus'
import { el } from 'element-plus/es/locales.mjs'
import { getUserId, getUserName } from '@/utils/auth'

const router = useRouter()
const refThis = ref(null)
const dialogVisible = ref(false)

const userId = getUserId()
const userName = getUserName()
const userToken = localStorage.getItem('token')

//实体类（登录）
const myInfo = reactive({
  userName: 'admin',
  phoneNumber: 'admin123',
  email: ''
})

// 处理下拉菜单选项的逻辑
const handleCommand = (command: string) => {
  if (command === 'profile') {
    // 处理查看个人资料的逻辑
    ElMessage.info('跳转到个人资料页面')
  } else if (command === 'logout') {
    // 处理退出登录的逻辑
    ElMessage.success('成功退出登录')
    // 在这里可以执行具体的退出登录操作，比如清除token，跳转到登录页等
  }
}
// 个人信息的处理逻辑
const viewProfile = async () => {
  dialogVisible.value = true
  try {
    const response = await axios.get(
      '/api/account/info',
      {
        params: {
          userId: userId
        }
      },
      { withCredentials: true }
    )

    if (response.code == 200) {
      myInfo.userName = response.data.userName
      myInfo.phoneNumber = response.data.phoneNumber
      myInfo.email = response.data.email
    } else {
      dialogVisible.value = false
      ElNotification({
        title: '查询个人信息错误',
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

// 修改密码的处理逻辑
const changePassword = () => {
  ElMessage.info('跳转到修改密码页面')
}

// 退出登录逻辑
const logout = async () => {
  // 可以在此处处理退出登录的逻辑，比如清除用户会话数据
  try {
    const response = await axios.get(
      '/api/auth/logout/',
      {
        params: {
          userId: userId
        },
        headers: {
          Authorization: `Bearer ${userToken}` // 添加 Authorization 请求头
        }
      },
      { withCredentials: true }
    )

    if (response.code == 200) {
      localStorage.clear()
      router.push('/login')
    } else {
      ElNotification({
        title: '退出登录失败',
        message: response.message,
        type: 'error'
      })
    }
  } catch (error) {
    ElNotification({
      title: '退出登录错误',
      message: error,
      type: 'error'
    })
  }
}
</script>
<style scoped>
/* 添加你的样式 */
.header {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
strong {
  display: inline-block;
  width: 80px; /* 设置一个合适的宽度，确保所有 <strong> 对齐 */
  text-align: right;
  margin-right: 15px;
}
</style>
