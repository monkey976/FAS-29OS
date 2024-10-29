<template>
  <div class="news-page">
    <!-- 新闻列表 -->
    <el-row :gutter="20">
      <el-col v-for="item in newsList" :key="item.id" :span="12">
        <el-card class="news-card" shadow="hover">
          <div class="news-title">{{ item.title }}</div>
          <div class="news-summary">{{ item.summary }}</div>
          <el-button type="text" @click="openDetail(item)">查看详情</el-button>
        </el-card>
      </el-col>
    </el-row>

    <!-- 分页组件 -->
    <el-pagination
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :total="totalRecords"
      layout="prev, pager, next"
      @current-change="fetchNews"
    />

    <!-- 新闻详情弹窗 -->
    <el-dialog v-model="isDialogVisible" title="新闻详情" width="50%">
      <div v-if="selectedNews">
        <h2>{{ selectedNews.title }}</h2>
        <p>{{ selectedNews.content }}</p>
      </div>
      <template #footer>
        <el-button @click="isDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 定义新闻数据结构
interface News {
  id: number
  title: string
  summary: string
  content: string
}

// 状态变量
const newsList = ref<News[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalRecords = ref(0)

const selectedNews = ref<News | null>(null)
const isDialogVisible = ref(false)

// 模拟获取新闻数据的 API 调用
const fetchNews = async (page: number) => {
  // 模拟的新闻数据
  const mockData = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    title: `新闻标题 ${i + 1}`,
    summary: `这是新闻 ${i + 1} 的摘要内容……`,
    content: `这是新闻 ${i + 1} 的完整内容，详细描述了事件的经过和影响。`
  }))

  // 计算分页后的数据
  const start = (page - 1) * pageSize.value
  const end = start + pageSize.value
  newsList.value = mockData.slice(start, end)
  totalRecords.value = mockData.length
}

// 打开详情弹窗
const openDetail = (news: News) => {
  selectedNews.value = news
  isDialogVisible.value = true
}

// 页面加载时获取初始新闻数据
onMounted(() => {
  fetchNews(currentPage.value)
})
</script>

<style scoped>
.news-page {
  padding: 20px;
}

.news-card {
  margin: 10px;
}

.news-title {
  font-weight: bold;
  font-size: 1.2em;
}

.news-summary {
  margin: 5px 0;
  color: #666;
}
</style>
