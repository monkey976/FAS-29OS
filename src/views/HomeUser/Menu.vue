<template>
  <div>
    <!-- logo和项目名称 -->
    <div class="flex common-layout justify-between items-center">
      <div>
        <div class="flex items-center relative pt-15px">
          <img src="../../assets/img/logo.png" alt="" id="logoImg" />
          <span class="text-20px font-bold">FAS-29OS</span>
        </div>
      </div>
      <div>
        <div class="flex items-center relative pt-15px">
          <div>
            <el-avatar src="/src/assets/img/userImg.png" />
          </div>
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              wushaomin
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
          <el-dialog v-model="dialogVisible" title="个人信息" width="25%" draggable>
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
          </el-dialog>
        </div>
      </div>
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

const dialogVisible = ref(false)
// 用户名数据，可以从后端获取
const userName = ref('wushaomin')
const userId = 18
const userToken = 'wushaomin'

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

//实体类（登录）
const myInfo = reactive({
  userName: 'admin',
  phoneNumber: 'admin123',
  email: ''
})

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
.header-content {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.el-avatar {
  margin-right: 10px;
}

.el-dropdown-link {
  cursor: pointer;
}
</style>
