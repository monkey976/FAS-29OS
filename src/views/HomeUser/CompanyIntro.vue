<template>
  <el-container class="company-intro px-[15%]">
    <!-- 标题部分 -->
    <el-header class="text-center font-bold text-white"></el-header>

    <!-- 公司简介 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="feature-card m-[20px]">
          <div class="space-x-4">
            <p class="mb-4">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我们是一家致力于推动<strong>个性化AI医疗解决方案</strong>的高科技企业，通过整合<strong>3D打印、医疗影像处理、智能分割与重建</strong>等技术，赋能医疗机构和医生，提升诊断和治疗的效率与精准性。
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在传统医疗器械生产和配送周期长、库存管理复杂的背景下，我们的系统利用<strong>3D打印技术</strong>实现“即需即制”，减少了等待时间和库存成本。医疗机构因此无需大量存储各种规格的传统器械，大大降低了储存空间和管理压力。
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;通过我们的医技交互系统，医生可以基于患者需求，快速生产定制化的医疗器械和模型，避免了大规模生产和分发的浪费。该系统在急救和偏远地区的应用尤为重要，能够减少长途运输需求，迅速提供急需物资。
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;随着3D打印技术在医疗领域的普及，我们为客户提供的服务涵盖了手术模拟、模型打印、个性化植入物设计等多个场景。通过CT、MRI数据重建的模型能够辅助医生进行手术规划，并提升手术室效率，减少传统模型制作时间。
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我们的解决方案不仅致力于临床应用，同时也为医学教育与科研提供了实践平台。研究人员和学生可以利用3D打印深入理解人体结构和病理过程，实现创新教学。通过减少材料浪费，我们的技术还助力于<strong>降低医疗设备成本</strong>，并推动<strong>生物材料</strong>在再生医学中的应用。
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;未来，我们将继续专注于科技与医学的深度融合，通过推动精准医疗和智慧医院建设，为医疗机构和患者提供创新、高效的解决方案。我们的目标是成为医疗领域中<strong>个性化诊疗与3D打印技术</strong>的引领者，推动医疗服务向更高水平发展。
            </p>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 核心功能展示 -->
    <el-main>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="feature-card mb-6">
            <div class="flex items-center space-x-4">
              <div class="flex-1">
                <h2 class="text-xl font-bold mb-2">远程与实时访问</h2>
                <p>
                  基于Web的解决方案支持医生与医疗技术人员在任何设备上实时访问系统，无需安装软件，方便远程诊断与治疗规划。
                </p>
              </div>
              <img class="feature-image" src="@/assets/img/Company.png" alt="远程访问" />
            </div>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card class="feature-card mb-6">
            <div class="flex items-center space-x-4">
              <div class="flex-1">
                <h2 class="text-xl font-bold mb-2">DICOM 数据导入</h2>
                <p>
                  直接导入DICOM文件，支持与CT、MRI设备及PACS系统的无缝对接，确保数据兼容性和高效性。
                </p>
              </div>
              <img class="feature-image" src="@/assets/img/upload.png" alt="DICOM数据导入" />
            </div>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card class="feature-card mb-6">
            <div class="flex items-center space-x-4">
              <div class="flex-1">
                <h2 class="text-xl font-bold mb-2">人工智能分割与重建</h2>
                <p>
                  通过AI算法自动检测和分割骨骼或组织，相比传统手动分割更快速、精准，尤其适用于复杂解剖结构。
                </p>
              </div>
              <img class="feature-image" src="@/assets/img/AI.png" alt="AI分割" />
            </div>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card class="feature-card mb-6">
            <div class="flex items-center space-x-4">
              <div class="flex-1">
                <h2 class="text-xl font-bold mb-2">AIGC 骨植入物设计</h2>
                <p>
                  使用AIGC技术生成与患者解剖结构匹配的个性化骨植入物设计模型，实现个性化定制，并满足手术需求。
                </p>
              </div>
              <img class="feature-image" src="@/assets/img/bone.png" alt="AIGC骨植入物设计" />
            </div>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card class="feature-card mb-6">
            <div class="flex items-center space-x-4">
              <div class="flex-1">
                <h2 class="text-xl font-bold mb-2">3D 分割、重建与打印</h2>
                <p>
                  系统支持导出STL等格式文件与3D打印设备无缝连接，助力医生进行手术模拟和植入物制作。
                </p>
              </div>
              <img class="feature-image" src="@/assets/img/3DPrint.png" alt="3D打印" />
            </div>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card class="feature-card mb-6">
            <div class="flex items-center space-x-4">
              <div class="flex-1">
                <h2 class="text-xl font-bold mb-2">云端部署与数据安全</h2>
                <p>
                  系统支持云端部署，保障数据安全性与隐私，为医疗机构提供稳定、高效的跨平台支持。
                </p>
              </div>
              <img
                class="feature-image"
                src="@/assets/img/CloudSecurity.png"
                alt="云端与数据安全"
              />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ElContainer, ElHeader, ElMain, ElRow, ElCol, ElCard } from 'element-plus'
</script>

<style scoped>
/* 核心功能卡片 */
.feature-card {
  @apply bg-white rounded-lg shadow-lg p-6 transition-transform hover:-translate-y-2;
}

/* 图片样式 */
.feature-image {
  @apply w-36 h-36 object-cover rounded-lg;
}
.feature-card:hover {
  transform: translateY(-5px);
}
</style>
