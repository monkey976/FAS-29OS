<template>
  <div class="patient-list bg-white mt-[20px]">
    <el-header class="header">
      <h2>患者信息列表</h2>
    </el-header>

    <div class="filter-bar">
      <el-input
        v-model="patientId"
        placeholder="患者ID"
        class="filter-input"
        suffix-icon="el-icon-search"
      />
      <el-input
        v-model="patientName"
        placeholder="患者姓名"
        class="filter-input"
        suffix-icon="el-icon-search"
      />
      <el-input
        v-model="studyInstanceUID"
        placeholder="检查实例号"
        class="filter-input"
        suffix-icon="el-icon-search"
      />
      <el-input
        v-model="seriesInstanceUID"
        placeholder="序列实例号"
        class="filter-input"
        suffix-icon="el-icon-search"
      />
      <el-button type="primary" @click="getCasePages">查询</el-button>
    </div>

    <el-table :data="casePages" style="width: 100%">
      <el-table-column prop="patientId" width="240" show-overflow-tooltip label="患者ID" />
      <el-table-column prop="patientName" label="姓名" />
      <el-table-column
        prop="studyInstanceUID"
        width="240"
        show-overflow-tooltip
        label="检查实例号"
      />
      <el-table-column
        prop="seriesInstanceUID"
        width="240"
        show-overflow-tooltip
        label="序列实例号"
      />
      <el-table-column prop="patientGender" label="性别" />
      <el-table-column prop="patientGender" label="年龄" />
      <el-table-column prop="uploadDateTime" label="上传时间" />
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button @click="GetCaseDetails(scope.row.id)" type="text">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :total="totalRecords"
      @current-change="handlePageChange"
      layout="total, prev, pager, next, sizes"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import axios from '@/plugins/axios'
import { useRouter } from 'vue-router' // 导入 useRouter
import { ApiResponse } from '@/types/ApiResponse'

const loading = ref(false)

const casePages = ref([])
const totalRecords = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const dataCode = ref('')
const patientId = ref('')
const studyInstanceUID = ref('')
const seriesInstanceUID = ref('')

const router = useRouter() // 使用 useRouter

const userToken = localStorage.getItem('token')

// 获取患者信息
const getCasePages = async () => {
  try {
    const response = await axios.post<ApiResponse<[]>>(
      '/api/Case/GetCasePages',
      {
        pageNumber: currentPage.value,
        pageSize: pageSize.value,
        dataCode: dataCode.value,
        patientId: patientId.value,
        StudyInstanceUID: studyInstanceUID.value,
        seriesInstanceUID: seriesInstanceUID.value
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}` // 添加 Authorization 请求头
        },
        withCredentials: true
      }
    )

    // const data = response as ApiResponse<[]>;

    if (response.isSuccess) {
      casePages.value = response.data // 假设返回的数据格式为 { items: User[], total: number }
      totalRecords.value = response.rowsCount
    }
  } catch (error) {
    console.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 查看详情
const GetCaseDetails = async (caseId) => {
  router.push({ name: 'CaseDetails', params: { caseId } })
}

// 切换页面
const handlePageChange = (page: number) => {
  currentPage.value = page
  getCasePages() // 重新获取数据
}

// 初始化获取数据
getCasePages()
</script>

<style scoped>
.patient-list {
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.filter-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.filter-input {
  margin-right: 10px;
}
</style>
