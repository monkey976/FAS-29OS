<template>
  <div class="patient-list bg-white mt-[20px]">
    <el-header class="header">
      <h2>患者信息列表</h2>
      <el-button type="primary" @click="addPatient">添加新患者</el-button>
    </el-header>

    <el-input
      v-model="searchQuery"
      placeholder="搜索患者姓名或ID"
      class="search-bar"
      suffix-icon="el-icon-search"
      @input="handleSearch"
    />

    <el-table :data="filteredPatients" style="width: 100%">
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="age" label="年龄" />
      <el-table-column prop="gender" label="性别" />
      <el-table-column prop="phone" label="联系方式" />
      <el-table-column prop="visitDate" label="就诊日期" />
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button @click="viewPatient(scope.row.id)" type="text">查看</el-button>
          <el-button @click="editPatient(scope.row.id)" type="text">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :total="totalPatients"
      @current-change="handlePageChange"
      layout="total, prev, pager, next, sizes"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const patients = ref([
  { id: 1, name: '张三', age: 28, gender: '男', phone: '12345678901', visitDate: '2024-10-01' },
  { id: 2, name: '李四', age: 34, gender: '女', phone: '12345678902', visitDate: '2024-10-02' }
  // ...更多患者信息
])
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const totalPatients = computed(() => {
  return patients.value.length
})

const filteredPatients = computed(() => {
  return patients.value.filter(
    (patient) =>
      patient.name.includes(searchQuery.value) || String(patient.id).includes(searchQuery.value)
  )
})

const addPatient = () => {
  // 添加新患者逻辑
}

const viewPatient = (id: number) => {
  // 查看患者信息逻辑
}

const editPatient = (id: number) => {
  // 编辑患者信息逻辑
}

const deletePatient = (id: number) => {
  // 删除患者逻辑
}

const handleSearch = () => {
  currentPage.value = 1 // 搜索时重置到第一页
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}
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
.search-bar {
  margin: 20px 0;
}
.text-danger {
  color: red;
}
</style>
