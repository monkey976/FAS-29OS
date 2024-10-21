<template>
  <div class="analysis-page">
    <div class="module card bg-white mx-[10%]" v-for="(item, index) in modules" :key="index">
      <div class="chart" :ref="setChartRef"></div>
      <div class="description">{{ item.description }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const modules = [
  {
    description:
      '人工智能分割与重建：近年来，AI 技术在医学影像领域得到了广泛应用，特别是在 CT 和 MRI 图像的分割与重建方面。AI 使得医生能够更快、更准确地识别病灶，提高了诊断的效率。',
    data: [150, 200, 250, 300, 350, 400, 450],
    type: 'bar'
  },
  {
    description:
      '云端部署与数据安全：云计算在医疗行业的应用日益增加，但数据安全性仍然是主要关注点。采用加密技术和多重身份验证，可以有效提升数据安全性。',
    data: [75, 85, 95, 100, 120, 130, 140],
    type: 'line'
  },
  {
    description:
      '个性化诊疗与3D打印技术：个性化医疗正在改变传统治疗方式，3D 打印技术使得医疗器械和植入物的定制化成为可能，极大提高了患者的治疗效果。',
    data: [40, 30, 50, 20, 60],
    type: 'pie'
  }
]

const charts = ref([])

const setChartRef = (el) => {
  if (el) {
    charts.value.push(el)
  }
}

const initChart = (index) => {
  const chart = echarts.init(charts.value[index])
  let option

  if (modules[index].type === 'bar') {
    option = {
      title: {
        text: `人工智能分割与重建 - 分割效率`
      },
      tooltip: {},
      xAxis: {
        data: ['第一周', '第二周', '第三周', '第四周', '第五周', '第六周', '第七周']
      },
      yAxis: {},
      series: [
        {
          name: '分割效率',
          type: 'bar',
          data: modules[index].data
        }
      ]
    }
  } else if (modules[index].type === 'line') {
    option = {
      title: {
        text: `云端部署与数据安全 - 安全性指数`
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月']
      },
      yAxis: {},
      series: [
        {
          name: '安全性指数',
          type: 'line',
          data: modules[index].data
        }
      ]
    }
  } else if (modules[index].type === 'pie') {
    option = {
      title: {
        text: `个性化诊疗与3D打印技术 - 患者需求`,
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: '需求分布',
          type: 'pie',
          radius: '50%',
          data: [
            { value: modules[index].data[0], name: '个性化器械' },
            { value: modules[index].data[1], name: '个性化植入物' },
            { value: modules[index].data[2], name: '定制化药物' },
            { value: modules[index].data[3], name: '患者反馈' },
            { value: modules[index].data[4], name: '其他需求' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
  }

  chart.setOption(option)
}

onMounted(async () => {
  await nextTick()
  modules.forEach((_, index) => {
    initChart(index)
  })
})
</script>

<style>
.analysis-page {
  display: flex;
  flex-direction: column;
}

.module {
  display: flex;
  margin: 20px 0;
}

.card {
  display: flex;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.chart {
  width: 50%;
  height: 400px;
}

.description {
  width: 50%;
  padding: 20px;
}
</style>
