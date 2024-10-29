<template>
  <div class="container mx-auto p-4 bg-white shadow-lg mt-[50px]">
    <section class="mt-4">
      <h2 class="text-xl font-semibold text-gray-700">产品概述</h2>
      <p class="text-gray-600">
        我们的系统集成了
        <span class="bg-blue-100 text-blue-800 p-1 rounded"
          >3D打印、医疗影像处理、AI分割与重建</span
        >
        等先进技术，为医疗机构和医生提供一站式解决方案。它支持从患者影像数据到医疗器械打印的完整流程，大幅提升诊断与治疗的效率和精准度。
      </p>
    </section>

    <section class="mt-4">
      <h2 class="text-xl font-semibold text-gray-700">产品功能亮点</h2>

      <div class="mt-2">
        <h3 class="text-lg font-semibold text-gray-600">1. 智能医疗影像处理与AI分割</h3>
        <ul class="list-disc list-inside">
          <li>支持导入CT、MRI、DICOM等医疗影像格式。</li>
          <li>使用AI算法进行自动分割和3D重建，加快影像分析流程。</li>
        </ul>
      </div>

      <div class="mt-2">
        <h3 class="text-lg font-semibold text-gray-600">2. 个性化模型设计与3D打印支持</h3>
        <ul class="list-disc list-inside">
          <li>提供3D模型在线编辑功能，医生可自定义模型尺寸和形态。</li>
          <li>一键导出STL文件，快速对接3D打印设备，实现“即需即制”。</li>
        </ul>
      </div>

      <div class="mt-2">
        <h3 class="text-lg font-semibold text-gray-600">3. 任务管理与实时监控</h3>
        <ul class="list-disc list-inside">
          <li>集成任务管理模块，追踪打印进度、设备状态与生产效率。</li>
          <li>支持远程管理，医生可随时查看生产状态。</li>
        </ul>
      </div>

      <div class="mt-2">
        <h3 class="text-lg font-semibold text-gray-600">4. 库存管理优化</h3>
        <ul class="list-disc list-inside">
          <li>根据使用历史数据，预测材料需求，减少库存压力与存储空间浪费。</li>
          <li>动态管理设备与耗材，确保生产资源的高效利用。</li>
        </ul>
      </div>

      <div class="mt-2">
        <h3 class="text-lg font-semibold text-gray-600">5. 急救与偏远地区支持</h3>
        <ul class="list-disc list-inside">
          <li>提供远程定制化打印解决方案，快速应对急救和偏远地区需求。</li>
          <li>减少长途运输时间，提高医疗物资的响应速度。</li>
        </ul>
      </div>
    </section>

    <section class="mt-4">
      <h2 class="text-xl font-semibold text-gray-700">产品应用场景</h2>
      <ul class="list-disc list-inside">
        <li>手术模拟与规划：医生可打印病灶模型进行术前规划，提升手术效率。</li>
        <li>个性化医疗器械：为患者设计植入物和辅助器具，提升治疗效果与舒适度。</li>
        <li>医学教育与科研：打印人体模型用于教学与科研，推动生物材料在医疗领域的应用。</li>
        <li>急救物资支持：在突发情况下快速生产急救器具，助力偏远地区医疗服务。</li>
      </ul>
    </section>

    <section class="mt-4">
      <h2 class="text-xl font-semibold text-gray-700">技术架构与集成</h2>
      <ul class="list-disc list-inside">
        <li>前端：Vue 3 + Element Plus</li>
        <li>后端：Node.js / ASP.NET Core</li>
        <li>数据库：MySQL / PostgreSQL</li>
        <li>3D展示：Three.js</li>
        <li>人工智能：TensorFlow.js / PyTorch</li>
        <li>打印平台集成：OctoPrint</li>
      </ul>
    </section>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Product'
}
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
