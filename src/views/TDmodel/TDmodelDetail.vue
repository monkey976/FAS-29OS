<template>
  <el-row :gutter="20">
    <el-col class="h-180px" :span="24">
      <el-card class="h-full" shadow="never">
        <div class="flex">
          <div class="w-[165px]">
            <!-- :src="filterPath + data.pathAndName" -->
            <img
              class="py-[10%] px-[5%]"
              src="https://192.168.32.60:7105//Source/Domic/picture/wsm.png"
            />
          </div>
          <div class="ml-[1%] w-[79%] pt-[2%]">
            <div class="flex justify-between items-center">
              <h3 class="text-blue-500 truncate cursor-pointer">Evan的胸片</h3>
              <!-- {{ data.hosName }} -->
              <el-button type="primary" icon="Download" />
            </div>
            <p class="truncate line-clamp-2">这是描述…………………………</p>
            <!-- {{ data.dataDescription }} -->
            <span class="flex justify-between items-center">
              <p>总下载：10次</p>
              <p>2024-09-10</p>
            </span>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from '@/plugins/axios'
import { ElNotification } from 'element-plus'
import { el } from 'element-plus/es/locales.mjs'

const router = useRouter()
const route = useRoute() //获取上一个页面带来的参数
type FileInfo = {
  id: number
  dataId: number
  fileName: string
  path: string
  format: string
  type: string
  uploadDate: string
  description: string
  deleteStatus: number
  createTime: string
  updateTime: string
}

type DataList = {
  id: number
  dataCode: string | null
  hosId: number
  hosName: string
  deptId: number
  deptName: string
  patientId: number
  patientName: string
  dataStatus: string | null
  uploadId: number | null
  uploadName: string | null
  uploadDate: string
  dataType: string | null
  dataTypeName: string | null
  dataDescription: string | null
  picture: {
    url: string
    pictureName: string
    format: string
  } | null
  pathAndName: string | null
  filels: FileInfo[]
  privacy: number | null
  download: number
}
// 获取数据
const data = ref<DataList[]>([])

const gotoDetial = async () => {
  const responseDetial = await axios.get(
    '/3d_model/detail',
    {
      params: {
        dataId: route.query.dataId
      }
    },
    { withCredentials: true }
  )
  data.value = responseDetial
}
gotoDetial()
</script>
<style scoped>
/* 添加你的样式 */
</style>
