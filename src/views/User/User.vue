<template>
  <el-row class="min-h-screen p-8">
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column type="index" label="#" width="50" />
      <el-table-column label="姓名" prop="userFullName">
        <template #header>
          <el-input v-model="search" size="small" placeholder="请输入姓名" @input="handleSearch" />
        </template>
      </el-table-column>
      <el-table-column prop="phoneNumber" label="手机号" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="isActiveValue" label="用户状态">
        <template #default="scope">
          <el-tag :type="scope.row.isActive === true ? 'success' : 'info'">
            {{ scope.row.isActiveValue }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template #header>
          <el-button type="primary" size="small" @click="openAddDialog">添加用户</el-button>
        </template>
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)"
            >禁用</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="mt-4"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      :total="totalRecords"
      layout="total, sizes, prev, pager, next, jumper"
    />
  </el-row>

  <!-- 添加对话框 -->
  <el-dialog v-model="addDialogVisible" title="添加用户">
    <el-form :model="addForm" :rules="rules" label-width="80px">
      <el-input v-model="addForm.id" type="hidden" />
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="addForm.username"
          prefix-icon="UserFilled"
          placeholder="请输入用户名"
          clearable
        />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          prefix-icon="Lock"
          v-model.trim="addForm.password"
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
          v-model="addForm.confirmPassword"
          placeholder="请确认密码"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phoneNumber">
        <el-input
          v-model="addForm.phoneNumber"
          prefix-icon="Phone"
          placeholder="请输入手机号"
          clearable
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="addForm.email"
          prefix-icon="Message"
          placeholder="请输入邮箱"
          clearable
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="addForm.isActive">
          <el-option label="激活" :value="true" />
          <el-option label="禁用" :value="false" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="addDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitAdd">添加</el-button>
    </template>
  </el-dialog>

  <!-- 编辑对话框 -->
  <el-dialog v-model="editDialogVisible" title="编辑用户">
    <el-form :model="editForm" label-width="80px">
      <el-input v-model="editForm.id" type="hidden" />
      <el-form-item label="用户名">
        <el-input v-model="editForm.userFullName" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="editForm.phoneNumber" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="editForm.email" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="editForm.isActive">
          <el-option label="激活" :value="true" />
          <el-option label="禁用" :value="false" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="editDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitEdit">修改</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import axios from '@/plugins/axios'

interface User {
  id: string
  userFullName: string
  password: string
  confirmPassword: string
  phoneNumber: string
  email: string
  isActive: boolean
  isActiveValue: string
}

const loading = ref(false)
const search = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalRecords = ref(0)
const tableData = ref<User[]>([])

const userToken = localStorage.getItem('token')

// 添加用户状态和表单数据
const addDialogVisible = ref(false)
const addForm = ref<Partial<User>>({})

// 编辑用户状态和表单数据
const editDialogVisible = ref(false)
const editForm = ref<Partial<User>>({})

const rules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }],
  phoneNumber: [
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
    { min: 8, message: '密码不能少于8位', trigger: 'blur' },
    {
      pattern: /[A-Za-z]/,
      message: '密码必须包含一个字母',
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: (error?: Error) => void) => {
        if (value !== addForm.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

// 获取数据的方法
const fetchTableData = async () => {
  loading.value = true
  try {
    const response = await axios.post(
      '/api/auth/getUserList',
      {
        pageNumber: currentPage.value,
        pageSize: pageSize.value
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}` // 添加 Authorization 请求头
        },
        withCredentials: true
      }
    )
    tableData.value = response.data // 假设返回的数据格式为 { items: User[], total: number }
    totalRecords.value = response.rowsCount
  } catch (error) {
    console.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  fetchTableData() // 搜索后重新获取数据
}

// 分页大小变化处理
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchTableData()
}

// 页码变化处理
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchTableData()
}

// 初始化数据
onMounted(() => {
  fetchTableData()
})

// 打开添加用户对话框
const openAddDialog = () => {
  addDialogVisible.value = true
  addForm.value = {
    isActive: true,
    isActiveValue: '激活'
  }
}
// 提交修改
const submitAdd = async () => {
  try {
    await axios.post(`/api/auth/createUser`, addForm.value, {
      headers: { Authorization: `Bearer ${userToken}` },
      withCredentials: true
    })
    console.log('用户添加成功')
    addDialogVisible.value = false
    fetchTableData()
  } catch (error) {
    console.error('添加用户失败', error)
  }
}

// 编辑和删除处理
// 编辑用户
const handleEdit = (index: number, row: User) => {
  console.log('Update', index, row.id)
  editForm.value = { ...row }
  editForm.value.userId = row.id
  editDialogVisible.value = true
}
// 提交编辑
const submitEdit = async () => {
  try {
    await axios.post(`/api/auth/updateUser`, editForm.value, {
      headers: { Authorization: `Bearer ${userToken}` },
      withCredentials: true
    })
    console.log('用户编辑成功')
    editDialogVisible.value = false
    fetchTableData()
  } catch (error) {
    console.error('编辑用户失败', error)
  }
}
const handleDelete = (index: number, row: User) => {
  console.log('Delete', index, row.id)
}
</script>

<style scoped>
.el-row {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
</style>
