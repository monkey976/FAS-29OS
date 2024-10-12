<template>
  <div class="w-[80%] mx-auto flex justify-center gap-4 bg-slate-900 text-white p-4">
    <el-row gutter="20">
      <!-- 单个卡片 -->
      <el-col :span="12" v-for="(card, index) in cardList" :key="index" class="pb-20px h-325px">
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
                  <div class="text-right" v-if="card.images == undefined">
                    <!-- 右侧内容 -->
                    <img :src="card.image" class="w-full h-32 object-contain mb-4" />
                  </div>
                  <div class="text-right flex" v-else>
                    <!-- 右侧内容 -->
                    <img :src="card.image" class="w-full h-32 object-contain mb-4" />
                    <img :src="card.images" class="w-full h-32 object-contain mb-4" />
                  </div>
                </div>
              </div>
              <div>
                <div style="position: absolute; width: 390px; top: 74px">
                  <span class="text-white" style="font-size: 15px"
                    >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ card.body }}</span
                  >
                </div>
                <!-- 下侧内容 -->
                <div
                  v-for="(link, lIndex) in card.links"
                  :key="lIndex"
                  :class="lIndex == 0 ? 'mt-[55px]' : ''"
                >
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
    title: '公司介绍',
    platforms: [],
    image: '/src/assets/img/corporation.png',
    body: '我们提供基于Web的医疗影像解决方案，支持跨平台远程访问，实现实时诊断与治疗规划。系统兼容DICOM标准，确保与CT、MRI等设备及PACS系统无缝集成。通过AI算法，系统可自动精准分割复杂解剖结构，提高分析效率。基于AIGC技术，我们为患者提供个性化骨植入物设计，支持3D打印，助力术前模拟与术中应用。云端部署确保数据安全与高效交互，满足现代医疗需求。',
    links: [
      { text: '公司介绍', url: '#' },
      { text: '公司治理', url: '#' }
    ]
  },
  {
    title: '产品服务',
    platforms: [],
    image: '/src/assets/img/NUSSDesign.png',
    images: '/src/assets/img/NUSSImg.png',
    body: '',
    links: [
      { text: '产品介绍', url: '#' },
      { text: '服务介绍', url: '#' },
      { text: '医生AI诊疗入口', url: '/portal' }
    ]
  },
  {
    title: '新闻中心',
    platforms: [],
    image: '/src/assets/img/new.png',
    body: '',
    links: [{ text: '查看新闻', url: '/3DPreview' }]
  },
  {
    title: '联系我们',
    platforms: [],
    image: '/src/assets/img/connection.png',
    body: '',
    links: [{ text: '联系我们', url: '#' }]
  }
  // 继续添加其他卡片
])
</script>
<style scoped>
/* 添加你的样式 */
.demonstration {
  color: var(--el-text-color-secondary);
}
.titleStyle {
  font-size: 28px;
  font-weight: bold;
}
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  /* line-height: 150px; */
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.image {
  width: 60%;
}
.card-item {
  background-color: #1e1e2d;
  border-radius: 10px;
  padding: 16px;
}
</style>
