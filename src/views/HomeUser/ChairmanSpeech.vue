<template>
  <el-container class="chairman-speech-page px-[15%]">
    <!-- 董事长信息部分 -->
    <el-main class="mb-10">
      <div class="text-center text-white">
        <img class="greeting-photo mx-auto" src="../../assets/img/userlogo.png" alt="董事长照片" />
        <p class="text-lg text-light-600 mt-4">董事长 | 创始人 & CEO</p>
        <p class="text-xl font-semibold italic mt-2">“以创新为动力，与时代同行”</p>
      </div>

      <!-- 致辞内容 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card class="feature-card mb-6 animate-scale-loop mt-10">
            <div class="space-x-4 rounded-full">
              <p class="text-[18px] leading-[2em]">
                <strong>尊敬的各位同仁、合作伙伴和社会各界朋友：</strong>
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;欢迎各位访问我们的网站，并感谢您对我们公司持续的关注和支持。作为一家致力于医疗科技创新的企业，我们以科技创新为驱动力，始终践行“以人为本”的理念，探索医疗领域的前沿技术，不断推动个性化医疗服务的发展。
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我们相信，<strong>精准医疗</strong>和<strong>智能医疗</strong>将是未来医疗行业发展的两大核心趋势。依托<strong>人工智能（AI）</strong>、<strong>3D打印</strong>及<strong>云计算</strong>技术的融合，我们正在打造一个智慧医疗平台，不仅提升医疗服务的效率，更让患者享受定制化的诊疗体验。
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我们的使命不仅仅是提供高效的医疗解决方案，更是希望通过不断创新推动整个医疗行业的变革。我们专注于将<strong>AI医疗影像分析</strong>与<strong>3D打印技术</strong>应用于临床实践，使医生能够在最短的时间内获取患者的个性化模型，助力精准治疗。
                <br />
                未来，我们期望：
                <br />
                &nbsp;&nbsp;&nbsp;1、<strong>降低医疗成本</strong>：通过按需制造减少库存压力，减少传统医疗设备的生产和配送时间。<br />
                &nbsp;&nbsp;&nbsp;2、<strong>支持远程医疗</strong>：通过云端部署和实时数据访问，改善偏远地区的医疗水平，实现医疗资源共享。<br />
                &nbsp;&nbsp;&nbsp;3、<strong>赋能医生与科研</strong>：为医生提供更加直观的诊断工具，同时为医学教育和科研提供强大支持。<br />
                &nbsp;&nbsp;&nbsp;4、<strong>绿色可持续发展</strong>：通过减少浪费和生物材料的精准使用，推动环保理念在医疗行业中的应用。<br />
                <strong>公司核心价值观</strong><br />
                <strong>·&nbsp;&nbsp;&nbsp;创新驱动</strong
                >：持续探索前沿技术，致力于将科学研究转化为临床实践。<br />
                <strong>·&nbsp;&nbsp;&nbsp;诚信合作</strong
                >：建立信任，与合作伙伴和客户共同成长。<br />
                <strong>·&nbsp;&nbsp;&nbsp;关怀患者</strong
                >：将患者的需求放在首位，提供高质量的个性化医疗服务。<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我们将继续秉持“创新、责任、服务”的精神，与各方伙伴携手合作，共同推动医疗科技的进步。未来，我们期待在医疗健康的道路上与您同行，为社会带来更多福祉。
              </p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>

    <!-- 操作按钮 -->
    <el-footer class="text-center">
      <el-button type="primary" @click="downloadSpeech">
        <el-icon><Download /></el-icon> 下载PDF
      </el-button>
      <el-button type="success" @click="shareSpeech" class="ml-4">
        <el-icon><Share /></el-icon>分享
      </el-button>
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
import { ElContainer, ElHeader, ElMain, ElFooter, ElButton } from 'element-plus'

const downloadSpeech = () => {
  // 模拟下载 PDF 文件
  alert('正在下载致辞 PDF 文件...')
}

const shareSpeech = () => {
  // 模拟社交分享
  alert('已分享至社交媒体！')
}
</script>

<style scoped>
.greeting-photo {
  border-radius: 50%;
  width: 150px;
  height: 150px;
  object-fit: cover;
  border: 2px solid #4a90e2;
}
@layer utilities {
  @keyframes scale-loop {
    0%,
    100% {
      transform: scale(1); /* 初始大小 */
    }
    50% {
      transform: scale(2); /* 放大一点 */
    }
  }

  .animate-scale-loop {
    @apply animation-scale-loop infinite duration-1500 ease-in-out;
  }
}
</style>
