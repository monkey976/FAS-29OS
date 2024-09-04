<template>
  <el-row class="min-h-screen">
    <el-table :data="filterTableData" style="width: 100%">
      <el-table-column label="用户名" prop="name" />
      <el-table-column label="性别" prop="sex" />

      <el-table-column label="地址" prop="address" />
      <el-table-column label="创建时间" prop="date" />
      <el-table-column align="right">
        <template #header>
          <el-input v-model="search" size="small" placeholder="请输入用户名" />
        </template>
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
    >
    </el-pagination>
  </el-row>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import { ElNotification } from 'element-plus'
import { el } from 'element-plus/es/locales.mjs'

const router = useRouter()

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(20)

interface User {
  date: string
  name: string
  address: string
}

const search = ref('')
const filterTableData = computed(() =>
  tableData.filter(
    (data) => !search.value || data.name.toLowerCase().includes(search.value.toLowerCase())
  )
)
const handleEdit = (index: number, row: User) => {
  console.log(index, row)
}
const handleDelete = (index: number, row: User) => {
  console.log(index, row)
}

const tableData: User[] = [
  {
    date: '2016-05-03',
    name: 'Tom',
    sex: '男',
    address: '上海市闵行区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-02',
    name: 'John',
    sex: '男',
    address: '上海市浦东区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-04',
    name: 'Morgan',
    sex: '女',
    address: '上海市闵行区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-01',
    name: 'Jessy',
    sex: '女',
    address: '上海市徐汇区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-03',
    name: 'Tom',
    sex: '男',
    address: '上海市闵行区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-02',
    name: 'John',
    sex: '男',
    address: '上海市浦东区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-04',
    name: 'Morgan',
    sex: '女',
    address: '上海市闵行区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-01',
    name: 'Jessy',
    sex: '女',
    address: '上海市徐汇区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-03',
    name: 'Tom',
    sex: '男',
    address: '上海市闵行区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-02',
    name: 'John',
    sex: '男',
    address: '上海市浦东区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-04',
    name: 'Morgan',
    sex: '女',
    address: '上海市闵行区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-01',
    name: 'Jessy',
    sex: '女',
    address: '上海市徐汇区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-03',
    name: 'Tom',
    sex: '男',
    address: '上海市闵行区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-02',
    name: 'John',
    sex: '男',
    address: '上海市浦东区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-04',
    name: 'Morgan',
    sex: '女',
    address: '上海市闵行区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-01',
    name: 'Jessy',
    sex: '女',
    address: '上海市徐汇区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-03',
    name: 'Tom',
    sex: '男',
    address: '上海市闵行区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-02',
    name: 'John',
    sex: '男',
    address: '上海市浦东区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-04',
    name: 'Morgan',
    sex: '女',
    address: '上海市闵行区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-01',
    name: 'Jessy',
    sex: '女',
    address: '上海市徐汇区****街道***路***小区*栋***号'
  }
]

const fetchData = async (page, size) => {
  // 这里替换成你的API请求
  // const res = await yourApi.get('/data', { params: { page, size } })
  tableData.value = tableData
  total.value = 20
}

onMounted(() => {
  fetchData(currentPage.value, pageSize.value)
})

const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  fetchData(currentPage.value, pageSize.value)
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
  fetchData(currentPage.value, pageSize.value)
}
</script>
<style scoped>
/* 添加你的样式 */
</style>
