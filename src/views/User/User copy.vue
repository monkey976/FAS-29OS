<template>
  <el-row class="min-h-screen">
    <el-table :data="paginatedData" style="width: 100%">
      <el-table-column label="用户名" prop="name">
        <template #header>
          <el-input
            v-model="search"
            size="small"
            placeholder="请输入用户名"
            @input="handleSearch"
          />
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="sex" :filters="sexFilters" :filter-method="filterSex">
        <template #default="scope">
          {{ scope.row.sex }}
        </template>
      </el-table-column>
      <el-table-column label="地址" prop="address" />
      <el-table-column label="创建时间" prop="date" />
      <el-table-column align="right">
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
    />
  </el-row>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(20)
const search = ref('')
const selectedSex = ref('')

interface User {
  date: string
  name: string
  sex: string
  address: string
}

const tableData: User[] = [
  {
    date: '2016-05-03',
    name: '范丞丞',
    sex: '男',
    address: '上海市闵行区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-02',
    name: '李明',
    sex: '男',
    address: '上海市浦东新区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-04',
    name: '张伟',
    sex: '男',
    address: '上海市徐汇区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-01',
    name: '王芳',
    sex: '女',
    address: '上海市静安区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-05',
    name: '赵强',
    sex: '男',
    address: '上海市长宁区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-06',
    name: '周杰',
    sex: '男',
    address: '上海市宝山区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-07',
    name: '吴敏',
    sex: '女',
    address: '上海市南汇区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-08',
    name: '郑宇',
    sex: '男',
    address: '上海市虹口区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-09',
    name: '陈丽',
    sex: '女',
    address: '上海市普陀区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-10',
    name: '杨帆',
    sex: '男',
    address: '上海市杨浦区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-11',
    name: '徐静',
    sex: '女',
    address: '上海市奉贤区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-12',
    name: '高飞',
    sex: '男',
    address: '上海市青浦区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-13',
    name: '林娜',
    sex: '女',
    address: '上海市松江区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-14',
    name: '罗杰',
    sex: '男',
    address: '上海市嘉定区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-15',
    name: '何婉',
    sex: '女',
    address: '上海市金山区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-16',
    name: '苏宇',
    sex: '男',
    address: '上海市崇明区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-17',
    name: '张超',
    sex: '男',
    address: '上海市闵行区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-18',
    name: '刘莉',
    sex: '女',
    address: '上海市浦东新区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-19',
    name: '王强',
    sex: '男',
    address: '上海市徐汇区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-20',
    name: '杜丽',
    sex: '女',
    address: '上海市静安区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-21',
    name: '孙伟',
    sex: '男',
    address: '上海市长宁区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-22',
    name: '蒋飞',
    sex: '男',
    address: '上海市宝山区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-23',
    name: '蔡琳',
    sex: '女',
    address: '上海市南汇区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-24',
    name: '范伟',
    sex: '男',
    address: '上海市虹口区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-25',
    name: '施娜',
    sex: '女',
    address: '上海市普陀区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-26',
    name: '陈飞',
    sex: '男',
    address: '上海市杨浦区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-27',
    name: '唐红',
    sex: '女',
    address: '上海市奉贤区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-28',
    name: '谢强',
    sex: '男',
    address: '上海市青浦区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-29',
    name: '杨帆',
    sex: '男',
    address: '上海市松江区****街道***路***小区*栋***号'
  },
  {
    date: '2016-05-30',
    name: '江雪',
    sex: '女',
    address: '上海市嘉定区****街道***路***小区*栋***号'
  }
]

// 性别筛选选项
const sexFilters = [
  { text: '男', value: '男' },
  { text: '女', value: '女' }
]

// 筛选方法
const filterSex = (value: string, row: User) => {
  return selectedSex.value ? row.sex === value : true
}

// 分页和搜索
const paginatedData = computed(() => {
  const filteredData = tableData
    .filter((item) => item.name.toLowerCase().includes(search.value.toLowerCase()))
    .filter((item) => {
      return selectedSex.value ? item.sex === selectedSex.value : true
    })

  total.value = filteredData.length // 更新总条数
  return filteredData.slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  )
})

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1 // 重置到第一页
}

// 编辑和删除处理
const handleEdit = (index: number, row: User) => {
  console.log('Edit', index, row)
}
const handleDelete = (index: number, row: User) => {
  console.log('Delete', index, row)
}

const handleSizeChange = (newSize: number) => {
  pageSize.value = newSize
  currentPage.value = 1 // 重置到第一页
}

const handleCurrentChange = (newPage: number) => {
  currentPage.value = newPage
}
</script>

<style scoped>
/* 添加你的样式 */
</style>
