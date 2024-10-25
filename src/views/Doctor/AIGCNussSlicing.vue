<script setup lang="ts">
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
import initCornerstone from '@/cornerstone/helper/initCornerstone'
import { ElMessage } from 'element-plus'
import { ElButton } from 'element-plus'
import axios from '@/plugins/axios'
import destoryCS from '@/cornerstone/helper/destoryCS'
import { onMounted, ref, onBeforeUnmount, onUpdated } from 'vue'

import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer'
import vtkRenderWindowInteractor from '@kitware/vtk.js/Rendering/Core/RenderWindowInteractor'
import vtkOpenGLRenderWindow from '@kitware/vtk.js/Rendering/OpenGL/RenderWindow'
import '@kitware/vtk.js/Rendering/Profiles/Geometry'
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor'
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper'
import vtkSTLReader from '@kitware/vtk.js/IO/Geometry/STLReader'
import vtkRenderWindow from '@kitware/vtk.js/Rendering/Core/RenderWindow'
import vtkInteractorStyleTrackballCamera from '@kitware/vtk.js/Interaction/Style/InteractorStyleTrackballCamera'
import vtkHttpDataAccessHelper from '@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper'
import vtkPolyData from '@kitware/vtk.js/Common/DataModel/PolyData'
import vtkCutter from '@kitware/vtk.js/Filters/Core/Cutter'
import vtkPlane from '@kitware/vtk.js/Common/DataModel/Plane'
import vtkInteractorStyleManipulator from '@kitware/vtk.js/Interaction/Style/InteractorStyleManipulator'
import vtkMouseCameraTrackballPanManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseCameraTrackballPanManipulator'
import vtkCubeSource from '@kitware/vtk.js/Filters/Sources/CubeSource'
import vtkSphereSource from '@kitware/vtk.js/Filters/Sources/SphereSource'
import type { int } from '@kitware/vtk.js/types'
import vtkTransform from '@kitware/vtk.js/Common/Transform'

const renderingEngineId = 'my_renderingEngine'
const viewportId0 = 'CT_CORONAL_STACK'
const viewportId1 = 'CT_AXIAL'
const viewportId2 = 'CT_SAGITTAL'
const viewportId3 = 'CT_CORONAL'
const volumeId = 'my_volume_id_2'
const groupId = 'groupId'
const type = ref('volume')
const fileImageIds = ref([])
const formData = ref([])
const uploadMessage = ref('')
const isSuccess = ref(false)
const fullWindowVis = ref(false)

onMounted(() => {
  init()

  const createVTKPipeline = (containerId: string, stlPath: string) => {
    const renderWindow = vtkRenderWindow.newInstance()
    const renderer = vtkRenderer.newInstance()
    const openGLRenderWindow = vtkOpenGLRenderWindow.newInstance()
    const interactor = vtkRenderWindowInteractor.newInstance()

    // Configure the container for each rendering window
    openGLRenderWindow.setContainer(document.getElementById(containerId))
    renderWindow.addRenderer(renderer)
    renderWindow.addView(openGLRenderWindow)
    interactor.setView(openGLRenderWindow)
    interactor.initialize()
    const container = document.getElementById(containerId)

    // if (containerId != 'vtkContainer1')
    //   container?.addEventListener('dblclick', () => {
    //     createVTKPipeline('vtkContainer2', stlPath)
    //   })

    interactor.bindEvents(container)

    if (containerId == 'vtkContainer1' || containerId == 'vtkContainer2') {
      container.ondblclick = () => {
        fullWindowVis.value = !fullWindowVis.value
      }
    }

    // create interactor
    const interactorStyle = vtkInteractorStyleManipulator.newInstance()
    interactor.setInteractorStyle(interactorStyle)
    interactor.setInteractorStyle(vtkInteractorStyleTrackballCamera.newInstance())
    renderer.setBackground(0, 0, 0)

    // Read and load the STL file
    const stlReader = vtkSTLReader.newInstance()
    vtkHttpDataAccessHelper.fetchBinary(stlPath).then((arrayBuffer) => {
      stlReader.parseAsArrayBuffer(arrayBuffer)
      const mapper = vtkMapper.newInstance()
      mapper.setInputConnection(stlReader.getOutputPort())
      mapper.setScalarVisibility(false)
      const actor = vtkActor.newInstance()
      actor.setMapper(mapper)
      actor.getProperty().setColor(0.5, 0.7, 1.0)
      renderer.addActor(actor)
      renderer.resetCamera()
      renderWindow.render()
    })
  }

  const createCombinePolydataVTKPipeine = (
    containerId: string,
    stlPath1: string,
    stlPath2: string
  ) => {
    const renderWindow = vtkRenderWindow.newInstance()
    const renderer = vtkRenderer.newInstance()
    const openGLRenderWindow = vtkOpenGLRenderWindow.newInstance()
    const interactor = vtkRenderWindowInteractor.newInstance()

    // Configure the container for each rendering window
    openGLRenderWindow.setContainer(document.getElementById(containerId))
    renderWindow.addRenderer(renderer)
    renderWindow.addView(openGLRenderWindow)
    interactor.setView(openGLRenderWindow)
    interactor.initialize()
    const container = document.getElementById(containerId)
    interactor.bindEvents(container)

    if (containerId == 'vtkContainer1' || containerId == 'vtkContainer2') {
      container.ondblclick = () => {
        fullWindowVis.value = !fullWindowVis.value
      }
    }
    // create interactor
    const interactorStyle = vtkInteractorStyleManipulator.newInstance()
    interactor.setInteractorStyle(interactorStyle)
    interactor.setInteractorStyle(vtkInteractorStyleTrackballCamera.newInstance())

    renderer.setBackground(0, 0, 0)

    // Read and load the STL file
    const stlReader = vtkSTLReader.newInstance()
    vtkHttpDataAccessHelper.fetchBinary(stlPath1).then((arrayBuffer) => {
      stlReader.parseAsArrayBuffer(arrayBuffer)

      const mapper = vtkMapper.newInstance()
      mapper.setInputConnection(stlReader.getOutputPort())
      mapper.setScalarVisibility(false)

      const actor = vtkActor.newInstance()
      actor.setMapper(mapper)
      actor.getProperty().setColor(0.5, 0.7, 1.0)

      renderer.addActor(actor)
      const polyData = stlReader.getOutputData()
      const bounds = polyData.getBounds()
      const x = (bounds[0] + bounds[1]) / 2
      const y = (bounds[2] + bounds[3]) / 2
      const z = (bounds[4] + bounds[5]) / 2
      renderer.getActiveCamera().setPosition(x, y, z)
    })

    const stlReader2 = vtkSTLReader.newInstance()
    vtkHttpDataAccessHelper.fetchBinary(stlPath2).then((arrayBuffer) => {
      stlReader2.parseAsArrayBuffer(arrayBuffer)

      const mapper2 = vtkMapper.newInstance()
      mapper2.setInputConnection(stlReader2.getOutputPort())
      mapper2.setScalarVisibility(false)
      const actor2 = vtkActor.newInstance()
      actor2.setMapper(mapper2)
      actor2.getProperty().setColor(0, 1, 0)
      actor2.setPosition(1, 1, 1)

      renderer.addActor(actor2)
      renderWindow.render()
    })

    renderWindow.render()
    renderer.resetCamera()
    interactor.start()
  }

  createVTKPipeline('vtkContainer1', 'http://localhost:3000/files/Segmentation_Segment_5.stl')
  createCombinePolydataVTKPipeine(
    'vtkContainer2',
    'http://localhost:3000/files/Segmentation_Segment_5.stl',
    'http://localhost:3000/files/Segmentation_1_Segment_10.stl'
  )
  createVTKPipeline('vtkContainer21', 'http://localhost:3000/files/Segmentation_Segment_5.stl')
  createVTKPipeline('vtkContainer22', 'http://localhost:3000/files/Segmentation_1_Segment_10.stl')
  createVTKPipeline('vtkContainer23', 'http://localhost:3000/files/Segmentation_1_Segment_11.stl')
  createVTKPipeline('vtkContainer24', 'http://localhost:3000/files/Segmentation_1_Segment_12.stl')
})

onBeforeUnmount(() => {
  destoryCS(renderingEngineId, groupId)
})

onUpdated(() => {
  renderVolume(fileImageIds.value)
})

function toggleToLargeWindow(smallWindow, largeWindow, largeRenderer) {
            smallWindow.setContainer(null); 
            largeWindow.setContainer(document.getElementById('largeRenderWindow')); // 绑定大窗口
            largeWindow.style.display = 'block'; // 显示大窗口
            largeRenderer.resetCamera(); // 重置相机
            largeWindow.render(); // 渲染大窗口
        }

async function prefetchMetadataInformation(imageIdsToPrefetch) {
  for (let i = 0; i < imageIdsToPrefetch.length; i++) {
    await cornerstoneDICOMImageLoader.wadouri.loadImage(imageIdsToPrefetch[i]).promise
  }
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

  const toolGroup = ToolGroupManager.getToolGroup(groupId)
  toolGroup.addViewport(viewportId1, renderingEngineId)
  toolGroup.addViewport(viewportId2, renderingEngineId)
  toolGroup.addViewport(viewportId3, renderingEngineId)

  const volume = await volumeLoader.createAndCacheVolume(volumeId, { imageIds })
  volume.load()

  await setVolumesForViewports(
    renderingEngine,
    [{ volumeId }],
    [viewportId1, viewportId2, viewportId3]
  )

  activeTools()
  renderingEngine.render()
}

async function loadAndViewImage(imageIds) {
  await prefetchMetadataInformation(imageIds)

  await renderVolume(imageIds)
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
  ;['element1', 'element2', 'element3'].forEach((id) => {
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
}
</script>

<template>
  <div>
    <div class="form">
      <input
        type="file"
        placeholder="点击上传文件夹"
        webkitdirectory
        directory
        @change="handleFolderSelect"
      />
    </div>

    <div id="demo-wrap">
      <div>
        <div v-show="!fullWindowVis" class="container">
          <div id="element1" class="cornerstone-item"></div>

          <div id="element2" class="cornerstone-item"></div>

          <div id="element3" class="cornerstone-item"></div>

          <div id="vtkContainer1" class="cornerstone-item"></div>
        </div>

        <div class="container1" v-show="fullWindowVis">
          <div class="container2">
            <div id="vtkContainer2"></div>
          </div>
          <div class="sidebar">
            <div class="small-window">
              <h2 class="title">病例分割模型</h2>
              <div class="small-vtkRenderWindow" id="vtkContainer21"></div>
            </div>

            <div class="small-window">
              <h2 class="title">病例复原模型</h2>
              <div class="small-vtkRenderWindow" id="vtkContainer22"></div>
            </div>

            <div class="small-window">
              <h2 class="title">AIGC复原模型</h2>
              <div class="small-vtkRenderWindow" id="vtkContainer23"></div>
            </div>

            <div class="small-window">
              <h2 class="title">AIGC NUSS板</h2>
              <div class="small-vtkRenderWindow" id="vtkContainer24"></div>
            </div>

            <div class="small-window">
              <h2 class="title">NUSS板-病例融合</h2>
              <div class="small-vtkRenderWindow" id="vtkContainer25"></div>
            </div>

            <div class="small-window">小窗口1</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-wrap: wrap;
  height: 800px;
  width: 1200px;
}

.cornerstone-item {
  width: 50%;
  height: 50%;
  border: 1px solid white;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  font-size: 24px;
}

.vtk-container {
  display: inline-block;
  margin-top: 20px;
  border: 10px solid #96cdf2;
  border-radius: 10px;
}

.container1 {
  display: flex; /* 设置容器高度为视口高度 */
  width: 1200px;
  height: 800px;
  margin-left: 10px;
  background-color: rgb(27, 24, 24);
}

.small-window {
  border: 2px solid white; /* 小窗口的边框 */
  padding: 10px; /* 内边距 */
  display: flex;
  background-color: black;
  flex-direction: column; /* 垂直排列 */
  align-items: center;
}

.title {
  font-size: 10px;
  color: cyan;
  margin: 0; /* 去除默认外边距 */
  text-align: center;
}

.small-vtkRenderWindow {
  width: 110px; /* 让 vtk 容器宽度占满 */
  height: 100px;
  margin-bottom: 15px; /* 自定义高度 */
  background-color: black; /* 背景色以示区别 */
}

.container2 {
  width: 800px;
  margin-left: 20px;
  background-color: cyan;
}

.main-window {
  flex: 1; /* 主窗口占据更多空间 */
  padding: 0px; /* 增加内边距 */
  height: 800px;
  border: 2px solid #ccc; /* 边框，可选 */
  font-size: 1.5em; /* 增加字体大小 */
}

.sidebar {
  display: flex;
  flex-direction: column; /* 纵向排列小窗口 */
  width: auto; /* 增加右侧栏的宽度 */
  padding: 10px;
  border: 10px;
  background-color: gray;
}
</style>
