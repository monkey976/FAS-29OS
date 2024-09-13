<template>
  <el-row class="h-full px-[25%]">
    <el-col :span="24" class="h-1/4 mb-[1.5%]">
      <div class="block text-center w-full h-full">
        <span class="text-white">产品展示</span>
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
    <el-col :span="24" class="h-[55%] flex">
      <el-col :span="20">
        <div class="contents w-full">
          <div style="display: ruby">
            <el-card
              shadow="hover"
              v-for="index in CoreFunctionData"
              :key="index.id"
              :id="index.id"
              :class="
                index.id % 2 == 0
                  ? 'box-card w-[49%] mt-[1%] h-[49.5%]'
                  : 'box-card w-[49%] mt-[1%] h-[49.5%] mr-[1%]'
              "
            >
              <template #header>
                <div class="card-header">
                  <span class="titleStyle truncate">{{ index.title }}</span>
                  <el-button class="button" text>进入</el-button>
                </div>
              </template>
              <img :src="index.srcUrl" class="image h-195px w-full" />
            </el-card>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="h-[49.55%]">
          <el-card shadow="hover" class="box-card w-full h-full mt-[4%]">
            <template #header>
              <div class="card-header">
                <span class="titleStyle">产品介绍</span>
              </div>
            </template>
            <p>这是一段简单的产品介绍</p>
          </el-card>
        </div>
        <div class="h-[49.55%]">
          <el-card shadow="hover" class="box-card w-full h-full mt-[11%]">
            <template #header>
              <div class="card-header">
                <span class="titleStyle">核心功能介绍</span>
              </div>
            </template>
            <p>这是一段简单的核心功能介绍</p>
          </el-card>
        </div>
      </el-col>
    </el-col>
    <el-col :span="24">
      <el-carousel :interval="4000" type="card" height="200px">
        <el-carousel-item v-for="item in 6" :key="item">
          <h3 text="2xl" justify="center">{{ item }}</h3>
        </el-carousel-item>
      </el-carousel>
    </el-col>
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
    title: '辅助诊断',
    srcUrl: '/src/assets/img/subsidiary.png'
  },
  {
    id: 3,
    title: '辅助治疗',
    srcUrl: '/src/assets/img/heal.png'
  },
  {
    id: 4,
    title: 'NUSS板模型',
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
