
<template>
    <div>
      <button @click="callApi">调用接口</button>
      <p v-if="result !== null">结果: {{ result }}</p>
    </div>
  </template>

<script setup lang="ts">
import { ref, reactive, defineProps, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import { setTokenTime } from '@/utils/auth'
import { ElNotification } from 'element-plus'
  
  const result = ref(null); // 用于存储返回结果

      const callApi = async () => {
        try {
          const response = await axios.get('/api/v1/PE/LoadSegment',
          { withCredentials: true });
          result.value = response.data; // 假设返回的布尔值在响应的 data 中
        
        } catch (error) {
          console.error('请求失败:', error);
        }
      };
  
  </script>
  
  <style scoped>
  /* 添加样式（可选） */
  </style>