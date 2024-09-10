<template>
  <div class="px-[4%]">
    <div class="flex justify-between items-center">
      <el-pagination
        class="mt-[2%]"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalRecords"
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
            <div class="w-[165px]">
              <img class="py-[10%] px-[5%]" :src="filterPath + item.pathAndName" />
            </div>
            <div class="ml-[1%] w-[79%] pt-[2%]">
              <div class="flex justify-between items-center">
                <h3 class="text-blue-500 truncate cursor-pointer" @click="gotoDetial(item.id)">
                  111{{ item.title === '' ? '无标题' : item.title }}
                </h3>
                <el-button type="primary" icon="Download" />
              </div>
              <p class="truncate line-clamp-2">{{ item.dataDescription }}</p>
              <span class="flex justify-between items-center">
                <p>总下载：{{ item.download }}次</p>
                <p>影像部位：{{ item.dataType }}</p>
                <p>上传人：{{ item.uploadName }}</p>
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
import { FILTER_PATH } from '../../utils/constant'
const router = useRouter()

const currentPage = ref(1)
const pageSize = ref(10) // 每页显示的卡片数量
const filterPath = FILTER_PATH

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
const totalRecords = ref(0)

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
  totalRecords.value = response.totalRecords
}

//重新加载数据
fetchData()

// 计算属性
const paginatedData = computed(() => data.value)
//切换页面
const handlePageChange = (page: number) => {
  currentPage.value = page
  //重新加载数据
  fetchData()
}

//每页展示条数该变
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1
  //重新加载数据
  fetchData()
}

//点击跳转详情页面
const gotoDetial = async (id) => {
  // 通过 query 参数传递 id
  router.push({ path: '/3Dmodel/detail', query: { dataId: id } })
}
</script>
<style scoped>
/* 添加你的样式 */
</style>
