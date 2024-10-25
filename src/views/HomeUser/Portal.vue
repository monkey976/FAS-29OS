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
                  <a
                    :href="link.url"
                    class="text-blue-400 hover:text-blue-500"
                    @click="navigate(link.url)"
                  >
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
import corporation from '@/assets/img/corporation.png'
import newImg from '@/assets/img/new.png'
import NUSSImg from '@/assets/img/NUSSImg.png'
import NUSSDesign from '@/assets/img/NUSSDesign.png'
import connection from '@/assets/img/connection.png'

const cardList = ref([
  {
    title: '公司介绍',
    platforms: [],
    image: corporation,
    body: '',
    links: [
      { text: '公司介绍', url: '/Company' },
      { text: '董事长致辞', url: '/ChairmanSpeech' }
    ]
  },
  {
    title: '产品服务',
    platforms: [],
    image: NUSSDesign,
    images: NUSSImg,
    body: '',
    links: [
      { text: '产品介绍', url: '/ProductIntro' },
      { text: '服务介绍', url: '/Service' },
      { text: '医生AI诊疗入口', url: '/portal' }
    ]
  },
  {
    title: '新闻中心',
    platforms: [],
    image: newImg,
    body: '',
    links: [
      { text: '专题分析', url: '/TopicAnalysis' },
      { text: '新闻报道', url: '/NewsPage' }
    ]
  },
  {
    title: '联系我们',
    platforms: [],
    image: connection,
    body: '',
    links: [
      { text: '联系我们', url: '/ContactUs' },
      { text: '地图导航', url: '#' },
      { text: '地址、电话和邮件地址', url: '#' }
    ]
  }
  // 继续添加其他卡片
])
const defaultActive = ref(sessionStorage.getItem('path') || '/homeuser')
//存当前点击的路径
const navigate = (path) => {
  sessionStorage.setItem('path', path)
  defaultActive.value = path
  router.push(path)
}
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
