<template>
  <div class="px-[4%]">
    <div class="flex justify-between items-center">
      <el-pagination
        class="mt-[2%]"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="data.length"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
      />
      <el-button type="primary" icon="Upload" text />
    </div>

    <el-row :gutter="20">
      <el-col class="h-180px" :span="24" v-for="item in paginatedData" :key="item.id">
        <el-名称 class="h-full" shadow="never">
          <div class="flex">
            <div class="w-[20%]">
              <img class="py-[10%] px-[5%]" src="/src/assets/img/model1.png" />
            </div>
            <div class="ml-[1%] w-[79%] pt-[2%]">
              <div class="flex justify-between items-center">
                <h3 class="text-blue-500 truncate cursor-pointer">{{ item.hosName }}</h3>
                <el-button type="primary" icon="Download" />
              </div>
              <p class="truncate line-clamp-2">{{ item.dataDescription }}</p>
              <span class="flex justify-between items-center">
                <p>总下载：{{ item.popularity }}次</p>
                <p>{{ item.uploadDate }}</p>
              </span>
            </div>
          </div>
        </el-名称>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import { ElNotification } from 'element-plus'
import { el } from 'element-plus/es/locales.mjs'

const router = useRouter()

const currentPage = ref(1)
const pageSize = ref(10) // 每页显示的卡片数量

// 定义数据类型
type DataList = {
  id: number
  hosName: string
  dataDescription: string
  picture: {
    url: string
    pictureName: string
    format: string
  }
  popularity: number | null
  uploadDate: string
}

// 获取数据
const data = ref<DataList[]>([])
const fetchData = async () => {
  const response = await axios.get(
    '/3d_model/pages',
    {
      params: {
        pageNumber: currentPage.value,
        pageSize: pageSize.value
      }
    },
    { withCredentials: true }
  )

  data.value = response.items
}

//重新加载数据
fetchData()

// 计算属性
const paginatedData = computed(() => data.value)
//切换页面
const handlePageChange = (page: number) => {
  currentPage.value = page
}

//每页展示条数该变
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
}
// console.log(data.value)
</script>
<style scoped>
/* 添加你的样式 */
</style>
