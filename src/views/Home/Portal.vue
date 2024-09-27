<template>
  <el-row class="h-full px-[15%]">
    <el-col :span="24" class="h-1/3 mb-[1.5%]">
      <div class="block text-center w-full h-full">
        <span class="demonstration">产品展示</span>
        <el-carousel class="h-full" id="portalDiv">
          <el-carousel-item
            v-for="item in 4"
            :key="item"
            class="h-full"
            :style="{ height: '100%' }"
          >
            <img src="/src/assets/img/model1.png" class="w-full" />
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-col>
    <div class="contents">
      <el-card
        shadow="hover"
        v-for="index in CoreFunctionData"
        :key="index.id"
        :id="index.id"
        :class="
          index.id % 2 == 0 ? 'box-card w-[49.5%] mt-[1%]' : 'box-card w-[49.5%] mt-[1%] mr-[1%]'
        "
      >
        <template #header>
          <div class="card-header">
            <span class="titleStyle">{{ index.title }}</span>
            <el-button class="button" text>进入</el-button>
          </div>
        </template>
        <img :src="index.srcUrl" class="image h-300px w-full" />
      </el-card>
    </div>
  </el-row>
</template>

<script setup lang="ts">
import { ref, toRaw, reactive, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import { ElNotification } from 'element-plus'
import { el } from 'element-plus/es/locales.mjs'
import '/src/assets/css/global.css'

const router = useRouter()
const currentDate = ref(new Date())

const CoreFunctionData = reactive([
  {
    id: 1,
    title: '3D医学影像分割重建',
    srcUrl: '/src/assets/img/3Dmodel.png'
  },
  {
    id: 2,
    title: '辅助诊断和AIGC NUSS板',
    srcUrl: '/src/assets/img/subsidiary.png'
  },
  {
    id: 3,
    title: '辅助治疗',
    srcUrl: '/src/assets/img/heal.png'
  },
  {
    id: 4,
    title: 'NUSS板设计',
    srcUrl: '/src/assets/img/NUSS.png'
  }
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
</style>
