<template>
  <div class="container mx-auto p-4 bg-white shadow-lg mt-[50px]">
    <section class="mt-4">
      <h2 class="text-xl font-semibold text-gray-700">服务概述</h2>
      <p class="text-gray-600">
        我们通过
        <span class="bg-blue-100 text-blue-800 p-1 rounded">先进的医疗科技</span>
        与
        <span class="bg-blue-100 text-blue-800 p-1 rounded">3D打印技术</span>
        ，为客户提供一系列高效、个性化的医疗服务，涵盖诊断、治疗、教育等多个领域，旨在帮助医疗机构和医生提供卓越的医疗服务。
      </p>
    </section>

    <section class="mt-4">
      <h2 class="text-xl font-semibold text-gray-700">服务类别</h2>

      <div class="mt-2">
        <h3 class="text-lg font-semibold text-gray-600">1. 医疗影像处理与智能重建服务</h3>
        <ul class="list-disc list-inside">
          <li>影像分割：基于AI的自动分割工具，加快病灶分析和标注流程。</li>
          <li>3D重建与模型输出：支持CT、MRI数据的精确重建，为手术规划提供支持。</li>
        </ul>
      </div>

      <div class="mt-2">
        <h3 class="text-lg font-semibold text-gray-600">2. 3D打印与模型定制服务</h3>
        <ul class="list-disc list-inside">
          <li>手术导板定制：根据患者数据设计导板，提高手术精准度。</li>
          <li>个性化植入物：快速生产适配患者解剖结构的植入物，提高治疗效果。</li>
          <li>模型库：提供多种医疗器械模板，快速生成标准模型。</li>
        </ul>
      </div>

      <div class="mt-2">
        <h3 class="text-lg font-semibold text-gray-600">3. 远程打印与任务管理服务</h3>
        <ul class="list-disc list-inside">
          <li>远程打印任务调度：支持医生远程下单，并实时监控打印任务。</li>
          <li>急救与偏远地区支持：为紧急医疗需求提供快速响应方案。</li>
          <li>动态生产管理：优化生产计划，减少传统医疗设备的库存压力。</li>
        </ul>
      </div>

      <div class="mt-2">
        <h3 class="text-lg font-semibold text-gray-600">4. 医学教育与科研支持</h3>
        <ul class="list-disc list-inside">
          <li>人体模型打印：支持医学教学用的模型打印，助力创新教育。</li>
          <li>科研材料支持：推动新型生物材料与器械在再生医学中的应用。</li>
          <li>培训与技术支持：提供医生与学生培训，助力技术应用落地。</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Service'
}
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
