<template>
  <div class="p-6">
    <el-row gutter="20">
      <!-- 单个卡片 -->
      <el-col :span="12" v-for="(card, index) in cardList" :key="index" class="pb-20px h-400px">
        <el-card shadow="hover" class="card-item dark-card h-full">
          <div class="card-body h-full">
            <div class="flex flex-col justify-between h-full">
              <div>
                <!-- 上侧内容 -->
                <div class="flex justify-between">
                  <div class="text-left">
                    <!-- 左侧内容 -->
                    <span class="text-white font-bold text-[25px]">{{ card.title }}</span>
                  </div>
                  <div class="text-right">
                    <!-- 右侧内容 -->
                    <img :src="card.image" class="w-full h-32 object-contain mb-4" />
                  </div>
                </div>
              </div>
              <div>
                <!-- 下侧内容 -->
                <div v-for="(link, lIndex) in card.links" :key="lIndex">
                  <a :href="link.url" class="text-blue-400 hover:text-blue-500">
                    {{ link.text }} >
                  </a>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const cardList = ref([
  {
    title: '分割重建',
    platforms: [],
    image: '/src/assets/img/dicomUp.png',
    links: [{ text: '新建/导入', url: '/doctor/dicomloader' }]
  },
  {
    title: '辅助诊断和AIGC NUSS板',
    platforms: [],
    image: '/src/assets/img/subsidiary.png',
    links: [
      { text: '标准骨结构导入（数据库3-22岁）', url: '#' },
      { text: 'AIGC正常骨结构导入', url: '#' }
    ]
  },
  {
    title: 'NUSS板设计',
    platforms: [],
    image: '/src/assets/img/NUSSDesign.png',
    links: [
      { text: '标准NUSS产品库（数据库3-22岁）', url: '/3DPreview' },
      { text: '导入AIGC-NUSS板', url: '/3DUpload' },
      { text: '导入本地NUSS模型', url: '/3DUpload' }
    ]
  },
  {
    title: '治疗方案',
    platforms: [],
    image: '/src/assets/img/heal.png',
    links: [{ text: '辅助诊断', url: '#' }]
  }
  // 继续添加其他卡片
])
</script>

<style scoped>
.card-item {
  background-color: #1e1e2d;
  border-radius: 10px;
  padding: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-body {
  margin-top: 12px;
}

.platform-icons img {
  width: 24px;
  height: 24px;
}

.dark-card {
  background-color: #1e1e2d;
  border-radius: 8px;
}

.text-white {
  color: #fff;
}
</style>
