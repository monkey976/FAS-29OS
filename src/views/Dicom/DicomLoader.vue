<template>
  <div class="dicom-upload-container">
    <h3 class="title">DICOM (CT/MRI) 上传和预览</h3>

    <div class="w-1/2 mx-auto flex justify-center gap-4 text-center bg-slate-900 text-white p-4">
      <diV>
        <input type="file" class="file-input" multiple @change="handleChange" />
        <!-- <a-upload
          v-model:file-list="fileList"
          name="avatar"
          list-type="picture-card"
          class="avatar-uploader"
          :show-upload-list="false"
          @change="handleChange"
          multiple
        >
          <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
          <div v-else>
            <loading-outlined v-if="loading"></loading-outlined>
            <plus-outlined v-else></plus-outlined>
            <div class="ant-upload-text">点击或拖拽文件到此处上传</div>
          </div>
        </a-upload>
        <el-upload
          class="upload-demo"
          drag
          :on-change="handleChange"
          multiple
          :auto-upload="false"
          :show-file-list="false"
          :on-exceed="handleExceed"
        >
          <el-icon class="el-icon--upload"><Plus /></el-icon>
          <div class="el-upload__text">点击或拖拽文件到此处上传</div>
          <div class="el-upload__text">支持Dicom文件</div> -->
        <!-- <template #tip>
          <div class="el-upload__tip">jpg/png files with a size less than 500kb</div>
        </template> -->
        <!-- </el-upload> -->
      </diV>

      <diV>
        <input
          type="file"
          class="file-input"
          webkitdirectory
          directory
          @change="handleFolderSelect"
        />
        <!-- <a-upload
          v-model:file-list="fileList"
          name="avatar"
          list-type="picture-card"
          class="avatar-uploader"
          :show-upload-list="false"
          @change="handleFolderSelect"
          directory
        >
          <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
          <div v-else>
            <loading-outlined v-if="loading"></loading-outlined>
            <plus-outlined v-else></plus-outlined>
            <div class="ant-upload-text">点击或拖拽文件夹到此处上传</div>
          </div>
        </a-upload>
        <el-upload
          class="upload-demo"
          drag
          :on-change="handleFolderSelect"
          :auto-upload="false"
          :show-file-list="false"
          webkitdirectory
        >
          <el-icon class="el-icon--upload"><Plus /></el-icon>
          <div class="el-upload__text">点击或拖拽文件夹到此处上传</div>
          <div class="el-upload__text">支持文件夹内为Dicom文件</div> -->
        <!-- <template #tip>
          <div class="el-upload__tip">jpg/png files with a size less than 500kb</div>
        </template> -->
        <!-- </el-upload> -->
      </diV>
    </div>
    <div class="file-upload">
      <el-button
        round
        class="upload-button"
        :disabled="!formData"
        type="primary"
        @click="handleSaveDicomToServer()"
      >
        将 Dicom 上传至服务器
      </el-button>

      <p
        v-if="uploadMessage"
        :class="{ success: isSuccess, error: !isSuccess }"
        class="upload-message"
      >
        {{ uploadMessage }}
      </p>
    </div>
    <div class="btn-wrap">
      <el-radio-group v-model="type" size="large" class="radio-group">
        <el-radio label="单层" value="stack" class="radio-item" />
        <el-radio label="MPR" value="volume" class="radio-item" />
      </el-radio-group>
    </div>

    <div id="demo-wrap" class="demo-wrap">
      <div v-show="type === 'stack'">
        <div id="element0" class="cornerstone-item stack-view"></div>
      </div>

      <div v-show="type === 'volume'" class="volume-view">
        <div id="element1" class="cornerstone-item"></div>
        <div id="element2" class="cornerstone-item"></div>
      </div>
      <div v-show="type === 'volume'" class="volume-view">
        <div id="element3" class="cornerstone-item"></div>
        <div id="element4" class="cornerstone-item"></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  cache,
  Enums as csEnums,
  getRenderingEngine,
  RenderingEngine,
  setVolumesForViewports,
  volumeLoader
} from '@cornerstonejs/core'
import {
  addTool,
  Enums as cstEnums,
  PanTool,
  StackScrollMouseWheelTool,
  ToolGroupManager,
  ZoomTool
} from '@cornerstonejs/tools'
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader'
import { ElMessage } from 'element-plus'
import { ElButton, ElUpload } from 'element-plus'
import axios from '@/plugins/axios'
import destoryCS from '@/cornerstone/helper/destoryCS'
import initCornerstone from '@/cornerstone/helper/initCornerstone'
import { onMounted, ref, onBeforeUnmount, onUpdated } from 'vue'

const renderingEngineId = 'my_renderingEngine'
const viewportId0 = 'CT_CORONAL_STACK'
const viewportId1 = 'CT_AXIAL'
const viewportId2 = 'CT_SAGITTAL'
const viewportId3 = 'CT_CORONAL'
const volumeId = 'my_volume_id_2'
const groupId = 'groupId'
const type = ref('stack')
const fileImageIds = ref([])
const formData = ref([])
const uploadMessage = ref('')
const isSuccess = ref(false)

const handleFileChange = (event) => {
  const files = event.target.files
  if (files) {
    uploadMessage.value = '' // 清除之前的提示信息
  }
}

const handleSaveDicomToServer = async () => {
  try {
    const response = await axios.post('api/v1/DicomAccess/SaveDicomToServer', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  } catch (error) {
    //uploadMessage.value='上传过程中出现错误，请稍后重试';
    console.error('发生异常', error)
  }
}

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  destoryCS(renderingEngineId, groupId)
})

onUpdated(() => {
  if (type.value === 'stack') {
    renderStack(fileImageIds.value)
  } else {
    renderVolume(fileImageIds.value)
  }
})

async function prefetchMetadataInformation(imageIdsToPrefetch) {
  for (let i = 0; i < imageIdsToPrefetch.length; i++) {
    await cornerstoneDICOMImageLoader.wadouri.loadImage(imageIdsToPrefetch[i]).promise
  }
}

async function renderStack(imageIds) {
  if (imageIds?.length === 0) {
    return
  }

  const renderingEngine = getRenderingEngine(renderingEngineId)
  const viewportInput = {
    viewportId: viewportId0,
    type: csEnums.ViewportType.STACK,
    element: document.querySelector('#element0')
  }
  renderingEngine.enableElement(viewportInput)

  const toolGroup = ToolGroupManager.getToolGroup(groupId)
  toolGroup.addViewport(viewportId0, renderingEngineId)

  const viewport = renderingEngine.getViewport(viewportId0)
  viewport.sWidth = 400
  viewport.sHeight = 400

  await viewport.setStack(imageIds)

  activeTools()
  viewport.render()
}

async function renderVolume(imageIds) {
  if (imageIds?.length === 0) {
    return
  }

  if (imageIds.length < 5) {
    ElMessage.error('请至少选择5张dicom图片进行MPR展示')
    return
  }

  // 在缓存中删除上一次加载的影像
  if (cache.getVolume(volumeId)) {
    cache.removeVolumeLoadObject(volumeId)
  }

  const renderingEngine = getRenderingEngine(renderingEngineId)

  const viewportInputArray = [
    {
      viewportId: viewportId1,
      type: csEnums.ViewportType.ORTHOGRAPHIC,
      element: document.querySelector('#element1'),
      defaultOptions: {
        orientation: csEnums.OrientationAxis.AXIAL
      }
    },
    {
      viewportId: viewportId2,
      type: csEnums.ViewportType.ORTHOGRAPHIC,
      element: document.querySelector('#element2'),
      defaultOptions: {
        orientation: csEnums.OrientationAxis.SAGITTAL
      }
    },
    {
      viewportId: viewportId3,
      type: csEnums.ViewportType.ORTHOGRAPHIC,
      element: document.querySelector('#element3'),
      defaultOptions: {
        orientation: csEnums.OrientationAxis.CORONAL
      }
    }
  ]
  renderingEngine.setViewports(viewportInputArray)
  renderingEngine.sWidth = 600
  renderingEngine.sHeight = 600

  const toolGroup = ToolGroupManager.getToolGroup(groupId)
  toolGroup.addViewport(viewportId1, renderingEngineId)
  toolGroup.addViewport(viewportId2, renderingEngineId)
  toolGroup.addViewport(viewportId3, renderingEngineId)

  const volume = await volumeLoader.createAndCacheVolume(volumeId, {
    imageIds
  })
  volume.load()

  await setVolumesForViewports(
    renderingEngine,
    [
      {
        volumeId
      }
    ],
    [viewportId1, viewportId2, viewportId3]
  )

  activeTools()
  renderingEngine.render()
}

async function loadAndViewImage(imageIds) {
  await prefetchMetadataInformation(imageIds)

  if (type.value === 'stack') {
    await renderStack(imageIds)
  } else {
    await renderVolume(imageIds)
  }
}

async function init() {
  await initCornerstone()

  // 准备一个渲染引擎 => renderingEngine
  new RenderingEngine(renderingEngineId)

  addTools()
}

function addTools() {
  // step1: 全局添加工具
  addTool(StackScrollMouseWheelTool)
  addTool(PanTool)
  addTool(ZoomTool)

  // step2：为工具组添加工具
  const toolGroup = ToolGroupManager.createToolGroup(groupId)
  toolGroup.addTool(StackScrollMouseWheelTool.toolName)
  toolGroup.addTool(PanTool.toolName)
  toolGroup.addTool(ZoomTool.toolName)

  // step4：禁用默认菜单
  ;['element0', 'element1', 'element2', 'element3'].forEach((id) => {
    const dom = document.querySelector(`#${id}`)
    dom.oncontextmenu = () => false
  })
}

function activeTools() {
  const toolGroup = ToolGroupManager.getToolGroup(groupId)
  toolGroup.setToolActive(StackScrollMouseWheelTool.toolName, {
    bindings: [
      {
        mouseButton: cstEnums.MouseBindings.Auxiliary
      }
    ]
  })
  toolGroup.setToolActive(PanTool.toolName, {
    bindings: [
      {
        mouseButton: cstEnums.MouseBindings.Primary
      }
    ]
  })
  toolGroup.setToolActive(ZoomTool.toolName, {
    bindings: [
      {
        mouseButton: cstEnums.MouseBindings.Secondary
      }
    ]
  })
}

//上传文件
function handleChange(evt) {
  // // 阻止事件冒泡
  evt.stopPropagation()
  evt.preventDefault()
  cache.purgeCache()
  const files = evt.target.files
  const i = 0
  for (let i = 0; i < files.length; i++) {
    formData.value.push({ key: i + 1, value: files[i] })
  }
  const imageIds = []
  Array.from(files).forEach((file) => {
    const imageId = cornerstoneDICOMImageLoader.wadouri.fileManager.add(file)
    imageIds.push(imageId)
  })
  fileImageIds.value = imageIds
  loadAndViewImage(imageIds)
  // 修改后----------------------------------------------------
  // 直接从 event.raw 获取文件对象
  // const file = event.raw
  // console.log('Selected File:', file) // 输出文件信息
  // // 清除之前的缓存
  // cache.purgeCache()
  // const imageIds = []
  // const imageId = cornerstoneDICOMImageLoader.wadouri.fileManager.add(file)
  // imageIds.push(imageId)
  // fileImageIds.value = imageIds
  // // // 在每次添加文件后检查是否是最后一个文件
  // // checkIfAllFilesLoaded(event)
  // loadAndViewImage(imageIds) // 加载并显示影像
}
// 检查是否所有文件都已经加载完毕
const checkIfAllFilesLoaded = (files) => {
  if (fileImageIds.value.length === files.length) {
    loadAndViewImage(fileImageIds.value) // 加载并显示影像
  }
}

// 处理文件超出限制
const handleExceed = (files) => {
  console.log('文件超过限制，忽略多余的文件')
}
//上传文件夹
function handleFolderSelect(event) {
  event.stopPropagation()
  event.preventDefault()

  cache.purgeCache()

  const files = event.target.files
  if (!files.length) return

  const imageIds = []
  Array.from(files).forEach((file) => {
    const imageId = cornerstoneDICOMImageLoader.wadouri.fileManager.add(file)
    imageIds.push(imageId)
  })

  fileImageIds.value = imageIds
  loadAndViewImage(imageIds)

  // // 修改后----------------------------------------------------
  // // 直接从 event.raw 获取文件对象
  // const file = event.raw
  // console.log('Selected File:', file) // 输出文件信息

  // // 清除之前的缓存
  // cache.purgeCache()

  // const imageIds = []
  // const imageId = cornerstoneDICOMImageLoader.wadouri.fileManager.add(file)
  // imageIds.push(imageId)

  // fileImageIds.value = imageIds
  // // // 在每次添加文件后检查是否是最后一个文件
  // // checkIfAllFilesLoaded(event)

  // loadAndViewImage(imageIds) // 加载并显示影像
}
</script>

<style scoped lang="scss">
h3 {
  margin-bottom: 20px;
}

input {
  cursor: pointer;
}

.btn-wrap {
  margin-top: 10px;
}

.cornerstone-item {
  display: inline-block;
  width: 500px;
  height: 500px;
  margin-top: 20px;
  margin-right: 20px;
  margin-left: 0px;
  padding: 20px;
  border: 2px solid #96cdf2;
  border-radius: 10px;
}

#tip {
  margin-top: 20px;
  font-size: 14px;

  p {
    line-height: 30px;
    color: #eee;
  }
}
</style>

<style>
.el-radio__input.is-checked + .el-radio__label {
  color: #96cdf2;
}

.el-radio__input.is-checked .el-radio__inner {
  border-color: #96cdf2;
  background-color: #96cdf2;
}
.dicom-upload-container {
  height: 100%;
  padding: 20px;
  border-radius: 15px;
  /* box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); 保持轻微阴影 */
  color: #333;
}

.title {
  text-align: center;
  font-size: 24px;
  color: #60a5fa;
  margin-bottom: 20px;
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.label {
  font-size: 16px;
  margin-bottom: 10px;
  color: #333;
}

.file-input {
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  border: 2px solid #60a5fa;
  cursor: pointer;
}

.btn-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.radio-group {
  display: flex;
  gap: 20px;
}

.radio-item {
  color: #60a5fa;
}

#demo-wrap {
  display: grid;
  justify-content: center;
  gap: 10px;
}

.cornerstone-item {
  width: 200px;
  height: 200px;
  border: 2px solid #60a5fa;
  border-radius: 15px;
  transition:
    transform 0.3s ease-in-out,
    box-shadow 0.3s;
}

.cornerstone-item:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(255, 206, 61, 0.3);
}

.file-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.upload-button {
  background-color: #60a5fa !important;
  color: #fff !important;
  font-size: 16px;
  width: 100%;
  transition: background-color 0.3s ease;
}

.upload-button:hover {
  background-color: #60a5fa !important;
}

.upload-message {
  margin-top: 10px;
  font-size: 16px;
}

.success {
  color: #4caf50;
}

.error {
  color: #f44336;
}
.file-upload {
  max-width: 400px;
  margin: auto;
  padding: 20px;
}
.success {
  color: green;
}
.error {
  color: red;
}
</style>
