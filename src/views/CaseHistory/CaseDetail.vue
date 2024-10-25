<template>
    <div class="case-details bg-white mt-[20px]">
      <el-header class="header">
        <h2>病例详情</h2>
      </el-header>
  
      <el-card v-if="caseDetails" class="box-card">
        <div class="text item">
          <span>数据编号: </span><strong>{{ caseDetails.dataCode}}</strong>
        </div>
        <div class="text item">
          <span>医院: </span><strong>{{ caseDetails.hosName }}</strong>
        </div>
        <div class="text item">
          <span>科室: </span><strong>{{ caseDetails.departName }}</strong>
        </div>
        <div class="text item">
          <span>患者ID: </span><strong>{{ caseDetails.patientId }}</strong>
        </div>
        <div class="text item">
          <span>姓名: </span><strong>{{ caseDetails.patientName }}</strong>
        </div>
        <div class="text item">
          <span>出生日期: </span><strong>{{ caseDetails.patientBirthDateTime}}</strong>
        </div>
        <div class="text item">
          <span>性别: </span><strong>{{ caseDetails.PatientGender }}</strong>
        </div>
        <div class="text item">
          <span>年龄: </span><strong>{{ caseDetails.PatientAge }}</strong>
        </div>
        <div class="text item">
          <span>体重: </span><strong>{{ caseDetails.PatientWeight }}</strong>
        </div>
        <div class="text item">
          <span>AccessionNumber: </span><strong>{{ caseDetails.AccessionNumber }}</strong>
        </div>
        <div class="text item">
          <span>StudyID: </span><strong>{{ caseDetails.StudyID }}</strong>
        </div>
        <div class="text item">
          <span>StudyInstanceUID: </span><strong>{{ caseDetails.StudyInstanceUID }}</strong>
        </div>
        <div class="text item">
          <span>StudyDateTime: </span><strong>{{ caseDetails.StudyDateTime }}</strong>
        </div>
        <div class="text item">
          <span>ModalitiesInStudy: </span><strong>{{ caseDetails.ModalitiesInStudy }}</strong>
        </div>
        <div class="text item">
          <span>BodyPartExamined: </span><strong>{{ caseDetails.BodyPartExamined }}</strong>
        </div>
        <div class="text item">
          <span>StudyDescription: </span><strong>{{ caseDetails.StudyDescription }}</strong>
        </div>
        <div class="text item">
          <span>SeriesNumber: </span><strong>{{ caseDetails.SeriesNumber }}</strong>
        </div>
        <div class="text item">
          <span>SeriesInstanceUID: </span><strong>{{ caseDetails.SeriesInstanceUID }}</strong>
        </div>
        <div class="text item">
          <span>Modality: </span><strong>{{ caseDetails.Modality }}</strong>
        </div>
        <div class="text item">
          <span>SeriesDateTime: </span><strong>{{ caseDetails.SeriesDateTime }}</strong>
        </div>
        <div class="text item">
          <span>UploadDateTime: </span><strong>{{ caseDetails.UploadDateTime }}</strong>
        </div>
        <div class="text item">
          <span>UploadUser: </span><strong>{{ caseDetails.UploadUser }}</strong>
        </div>
      </el-card>
  
      <el-button @click="goBack" type="primary" class="mt-4">返回列表</el-button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import axios from '@/plugins/axios'
  
  const route = useRoute()
  const router = useRouter()
  const caseDetails = ref(null)
  const userToken = localStorage.getItem('token')
  
  const fetchCaseDetails = async () => {
    const caseId = route.params.caseId
    try {
      const response = await axios.post(
        '/api/Case/GetCaseDetails',
        { caseId },
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          },
          withCredentials: true
        }
      )
  
      if (response.isSuccess) {
        caseDetails.value = response.data
      } else {
        console.error('Error fetching case details:', response.msg)
      }
    } catch (error) {
      console.error('请求错误', error)
    }
  }
  
  const goBack = () => {
    router.push('/caseHistoryManager') // 假设返回列表页面的路由为 '/cases'
  }
  
  onMounted(fetchCaseDetails)
  </script>
  
  <style scoped>
  .case-details {
    padding: 20px;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .item {
    margin-bottom: 10px;
  }
  </style>
  