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
import vtkTransform from '@kitware/vtk.js/Common/Transform/Transform'

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
const showList1=ref(true)
const showList2=ref(false)

const list1=['Haller: /', 'FI: /', '胸椎间距: /']
const list2=['Haller: /', 'FI: /', '胸椎间距: /']

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

  const renderWindow2 = vtkRenderWindow.newInstance()
  const renderer2 = vtkRenderer.newInstance()
  const openGLRenderWindow2 = vtkOpenGLRenderWindow.newInstance()
  const interactor2 = vtkRenderWindowInteractor.newInstance()
  const interactorStyle2 = vtkInteractorStyleManipulator.newInstance()

  document.getElementById('vtkContainer2').ondblclick = () => {
    fullWindowVis.value = !fullWindowVis.value
  }

  openGLRenderWindow2.setContainer(document.getElementById('vtkContainer2'))
  renderWindow2.addRenderer(renderer2)
  renderWindow2.addView(openGLRenderWindow2)
  interactor2.setView(openGLRenderWindow2)
  interactor2.initialize()
  interactor2.bindEvents(document.getElementById('vtkContainer2'))
  interactor2.setInteractorStyle(interactorStyle2)
  interactor2.setInteractorStyle(vtkInteractorStyleTrackballCamera.newInstance())
  renderer2.setBackground(0, 0, 0)
  const stlReader = vtkSTLReader.newInstance()
  vtkHttpDataAccessHelper
    .fetchBinary('http://localhost:3000/files/Segmentation_Segment_5.stl')
    .then((arrayBuffer) => {
      stlReader.parseAsArrayBuffer(arrayBuffer)
      const mapper = vtkMapper.newInstance()
      mapper.setInputConnection(stlReader.getOutputPort())
      mapper.setScalarVisibility(false)
      const actor = vtkActor.newInstance()
      actor.setMapper(mapper)
      actor.getProperty().setColor(0.5, 0.7, 1.0)
      renderer2.addActor(actor)
      renderer2.resetCamera()
      renderWindow2.render()
    })

  const renderWindow21 = vtkRenderWindow.newInstance()
  const renderer21 = vtkRenderer.newInstance()
  const openGLRenderWindow21 = vtkOpenGLRenderWindow.newInstance()
  const interactor21 = vtkRenderWindowInteractor.newInstance()
  const interactorStyle21 = vtkInteractorStyleManipulator.newInstance()

  openGLRenderWindow21.setContainer(document.getElementById('vtkContainer21'))
  renderWindow21.addRenderer(renderer21)
  renderWindow21.addView(openGLRenderWindow21)
  interactor21.setView(openGLRenderWindow21)
  interactor21.initialize()
  interactor21.bindEvents(document.getElementById('vtkContainer21'))
  interactor21.setInteractorStyle(interactorStyle21)
  interactor21.setInteractorStyle(vtkInteractorStyleTrackballCamera.newInstance())
  renderer21.setBackground(0, 0, 0)
  const stlReader21 = vtkSTLReader.newInstance()
  vtkHttpDataAccessHelper
    .fetchBinary('http://localhost:3000/files/Segmentation_Segment_5.stl')
    .then((arrayBuffer) => {
      stlReader21.parseAsArrayBuffer(arrayBuffer)
      const mapper = vtkMapper.newInstance()
      mapper.setInputConnection(stlReader21.getOutputPort())
      mapper.setScalarVisibility(false)
      const actor = vtkActor.newInstance()
      actor.setMapper(mapper)
      actor.getProperty().setColor(0.5, 0.7, 1.0)
      renderer21.addActor(actor)
      renderer21.resetCamera()
      renderWindow21.render()
    })

  const renderWindow22 = vtkRenderWindow.newInstance()
  const renderer22 = vtkRenderer.newInstance()
  const openGLRenderWindow22 = vtkOpenGLRenderWindow.newInstance()
  const interactor22 = vtkRenderWindowInteractor.newInstance()
  const interactorStyle22 = vtkInteractorStyleManipulator.newInstance()

  openGLRenderWindow22.setContainer(document.getElementById('vtkContainer22'))
  renderWindow22.addRenderer(renderer22)
  renderWindow22.addView(openGLRenderWindow22)
  interactor22.setView(openGLRenderWindow22)
  interactor22.initialize()
  interactor22.bindEvents(document.getElementById('vtkContainer22'))
  interactor22.setInteractorStyle(interactorStyle22)
  interactor22.setInteractorStyle(vtkInteractorStyleTrackballCamera.newInstance())
  renderer22.setBackground(0, 0, 0)
  const stlReader22 = vtkSTLReader.newInstance()
  vtkHttpDataAccessHelper
    .fetchBinary('http://localhost:3000/files/Segmentation_Segment_5.stl')
    .then((arrayBuffer) => {
      stlReader22.parseAsArrayBuffer(arrayBuffer)
      const mapper = vtkMapper.newInstance()
      mapper.setInputConnection(stlReader22.getOutputPort())
      mapper.setScalarVisibility(false)
      const actor = vtkActor.newInstance()
      actor.setMapper(mapper)
      actor.getProperty().setColor(0, 0.7, 0)
      renderer22.addActor(actor)
      renderer22.resetCamera()
      renderWindow22.render()
    })

  const renderWindow23 = vtkRenderWindow.newInstance()
  const renderer23 = vtkRenderer.newInstance()
  const openGLRenderWindow23 = vtkOpenGLRenderWindow.newInstance()
  const interactor23 = vtkRenderWindowInteractor.newInstance()
  const interactorStyle23 = vtkInteractorStyleManipulator.newInstance()

  openGLRenderWindow23.setContainer(document.getElementById('vtkContainer23'))
  renderWindow23.addRenderer(renderer23)
  renderWindow23.addView(openGLRenderWindow23)
  interactor23.setView(openGLRenderWindow23)
  interactor23.initialize()
  interactor23.bindEvents(document.getElementById('vtkContainer23'))
  interactor23.setInteractorStyle(interactorStyle23)
  interactor23.setInteractorStyle(vtkInteractorStyleTrackballCamera.newInstance())
  renderer23.setBackground(0, 0, 0)
  const stlReader23 = vtkSTLReader.newInstance()
  vtkHttpDataAccessHelper
    .fetchBinary('http://localhost:3000/files/Segmentation_Segment_5.stl')
    .then((arrayBuffer) => {
      stlReader23.parseAsArrayBuffer(arrayBuffer)
      const mapper = vtkMapper.newInstance()
      mapper.setInputConnection(stlReader23.getOutputPort())
      mapper.setScalarVisibility(false)
      const actor = vtkActor.newInstance()
      actor.setMapper(mapper)
      actor.getProperty().setColor(0.9, 0.9, 0.8)
      renderer23.addActor(actor)
      renderer23.resetCamera()
      renderWindow23.render()
    })

  const renderWindow24 = vtkRenderWindow.newInstance()
  const renderer24 = vtkRenderer.newInstance()
  const openGLRenderWindow24 = vtkOpenGLRenderWindow.newInstance()
  const interactor24 = vtkRenderWindowInteractor.newInstance()
  const interactorStyle24 = vtkInteractorStyleManipulator.newInstance()

  openGLRenderWindow24.setContainer(document.getElementById('vtkContainer24'))
  renderWindow24.addRenderer(renderer24)
  renderWindow24.addView(openGLRenderWindow24)
  interactor24.setView(openGLRenderWindow24)
  interactor24.initialize()
  interactor24.bindEvents(document.getElementById('vtkContainer24'))
  interactor24.setInteractorStyle(interactorStyle24)
  interactor24.setInteractorStyle(vtkInteractorStyleTrackballCamera.newInstance())
  renderer24.setBackground(0, 0, 0)
  const stlReader24 = vtkSTLReader.newInstance()
  vtkHttpDataAccessHelper
    .fetchBinary('http://localhost:3000/files/Segmentation_Segment_5.stl')
    .then((arrayBuffer) => {
      stlReader24.parseAsArrayBuffer(arrayBuffer)
      const mapper = vtkMapper.newInstance()
      mapper.setInputConnection(stlReader24.getOutputPort())
      mapper.setScalarVisibility(false)
      const actor = vtkActor.newInstance()
      actor.setMapper(mapper)
      actor.getProperty().setColor(0, 1, 0)

      const polydata = stlReader24.getOutputData()
      const bounds = polydata.getBounds()
      const x = (bounds[1] - bounds[0]) / 2
      const y = (bounds[3] - bounds[2]) / 2
      const z = (bounds[5] - bounds[4]) / 2

      const cubeSource = vtkCubeSource.newInstance({
        xLength: 30,
        yLength: 3,
        zLength: 0.5
      })
      const cubeMapper = vtkMapper.newInstance()
      cubeMapper.setInputConnection(cubeSource.getOutputPort())
      const cubeActor = vtkActor.newInstance()
      cubeActor.setMapper(cubeMapper)
      cubeActor.getProperty().setColor(0.754, 0.754, 0.754)

      // renderer24.addActor(actor)
      renderer24.addActor(cubeActor)
      renderer24.resetCamera()
      renderWindow24.render()
    })

  const renderWindow25 = vtkRenderWindow.newInstance()
  const renderer25 = vtkRenderer.newInstance()
  const openGLRenderWindow25 = vtkOpenGLRenderWindow.newInstance()
  const interactor25 = vtkRenderWindowInteractor.newInstance()
  const interactorStyle25 = vtkInteractorStyleManipulator.newInstance()

  openGLRenderWindow25.setContainer(document.getElementById('vtkContainer25'))
  renderWindow25.addRenderer(renderer25)
  renderWindow25.addView(openGLRenderWindow25)
  interactor25.setView(openGLRenderWindow25)
  interactor25.initialize()
  interactor25.bindEvents(document.getElementById('vtkContainer25'))
  interactor25.setInteractorStyle(interactorStyle25)
  interactor25.setInteractorStyle(vtkInteractorStyleTrackballCamera.newInstance())
  renderer25.setBackground(0, 0, 0)
  const stlReader25 = vtkSTLReader.newInstance()
  vtkHttpDataAccessHelper
    .fetchBinary('http://localhost:3000/files/Segmentation_Segment_5.stl')
    .then((arrayBuffer) => {
      stlReader25.parseAsArrayBuffer(arrayBuffer)
      const mapper = vtkMapper.newInstance()
      mapper.setInputConnection(stlReader25.getOutputPort())
      mapper.setScalarVisibility(false)
      const actor = vtkActor.newInstance()
      actor.setMapper(mapper)
      actor.getProperty().setColor(0.9, 0.9, 0.8)

      // NUSS板
      const polydata = stlReader25.getOutputData()
      const bounds = polydata.getBounds()
      const x = (bounds[0] + bounds[1]) / 2
      const y = (bounds[2] + bounds[3]) / 2
      const z = (bounds[4] + bounds[5]) / 2
      const transform = vtkTransform.newInstance()
      const translationMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -x, -y, -z, 1]
      transform.setMatrix(translationMatrix)
      const cubeSource = vtkCubeSource.newInstance({
        xLength: 300,
        yLength: 20,
        zLength: 1
      })
      const cubeMapper = vtkMapper.newInstance()
      cubeMapper.setInputConnection(cubeSource.getOutputPort())
      const cubeActor = vtkActor.newInstance()
      cubeActor.setMapper(cubeMapper)
      cubeActor.getProperty().setColor(0.754, 0.754, 0.754)
      //cubeActor. (transform);
      actor.setUserMatrix(transform.getMatrix())
      renderer25.addActor(actor)
      renderer25.addActor(cubeActor)
      renderer25.resetCamera()
      renderWindow25.render()
    })

  const renderWindow26 = vtkRenderWindow.newInstance()
  const renderer26 = vtkRenderer.newInstance()
  const openGLRenderWindow26 = vtkOpenGLRenderWindow.newInstance()
  const interactor26 = vtkRenderWindowInteractor.newInstance()
  const interactorStyle26 = vtkInteractorStyleManipulator.newInstance()

  openGLRenderWindow26.setContainer(document.getElementById('vtkContainer26'))
  renderWindow26.addRenderer(renderer26)
  renderWindow26.addView(openGLRenderWindow26)
  interactor26.setView(openGLRenderWindow26)
  interactor26.initialize()
  interactor26.bindEvents(document.getElementById('vtkContainer26'))
  interactor26.setInteractorStyle(interactorStyle26)
  interactor26.setInteractorStyle(vtkInteractorStyleTrackballCamera.newInstance())
  renderer26.setBackground(0, 0, 0)
  const cubeSource26 = vtkCubeSource.newInstance({
    xLength: 30,
    yLength: 3,
    zLength: 0.5
  })
  const cubeMapper26 = vtkMapper.newInstance()
  cubeMapper26.setInputConnection(cubeSource26.getOutputPort())
  const cubeActor26 = vtkActor.newInstance()
  cubeActor26.setMapper(cubeMapper26)
  cubeActor26.getProperty().setColor(0.5, 0.5, 0.5)

  renderer26.addActor(cubeActor26)
  renderer26.resetCamera()
  renderWindow26.render()

  const container21 = document.getElementById('vtkContainer21')
  container21?.addEventListener('dblclick', () => {
    openGLRenderWindow2.setContainer(null)
    openGLRenderWindow2.setContainer(document.getElementById('vtkContainer21'))
    openGLRenderWindow21.setContainer(document.getElementById('vtkContainer2'))

    openGLRenderWindow22.setContainer(document.getElementById('vtkContainer22'))
    openGLRenderWindow23.setContainer(document.getElementById('vtkContainer23'))
    openGLRenderWindow24.setContainer(document.getElementById('vtkContainer24'))
    openGLRenderWindow25.setContainer(document.getElementById('vtkContainer25'))
    openGLRenderWindow26.setContainer(document.getElementById('vtkContainer26'))


    interactor2.setView(openGLRenderWindow21)
    interactor21.setView(openGLRenderWindow2)

    interactor22.setView(openGLRenderWindow22)
    interactor23.setView(openGLRenderWindow23)
    interactor24.setView(openGLRenderWindow24)
    interactor25.setView(openGLRenderWindow25)
    interactor26.setView(openGLRenderWindow26)
  })

  const container22 = document.getElementById('vtkContainer22')
  container22?.addEventListener('dblclick', () => {
    openGLRenderWindow2.setContainer(null)
    openGLRenderWindow2.setContainer(document.getElementById('vtkContainer22'))
    openGLRenderWindow22.setContainer(document.getElementById('vtkContainer2'))

    openGLRenderWindow21.setContainer(document.getElementById('vtkContainer21'))
    openGLRenderWindow23.setContainer(document.getElementById('vtkContainer23'))
    openGLRenderWindow24.setContainer(document.getElementById('vtkContainer24'))
    openGLRenderWindow25.setContainer(document.getElementById('vtkContainer25'))
    openGLRenderWindow26.setContainer(document.getElementById('vtkContainer26'))


    interactor2.setView(openGLRenderWindow22)
    interactor22.setView(openGLRenderWindow2)

    interactor21.setView(openGLRenderWindow21)
    interactor23.setView(openGLRenderWindow23)
    interactor24.setView(openGLRenderWindow24)
    interactor25.setView(openGLRenderWindow25)
    interactor26.setView(openGLRenderWindow26)
  })

  const container23 = document.getElementById('vtkContainer23')
  container23?.addEventListener('dblclick', () => {
    openGLRenderWindow2.setContainer(null)
    openGLRenderWindow23.setContainer(document.getElementById('vtkContainer2'))
    openGLRenderWindow2.setContainer(document.getElementById('vtkContainer23'))

    openGLRenderWindow21.setContainer(document.getElementById('vtkContainer21'))
    openGLRenderWindow22.setContainer(document.getElementById('vtkContainer22'))
    openGLRenderWindow24.setContainer(document.getElementById('vtkContainer24'))
    openGLRenderWindow25.setContainer(document.getElementById('vtkContainer25'))
    openGLRenderWindow26.setContainer(document.getElementById('vtkContainer26'))

    interactor2.setView(openGLRenderWindow23)
    interactor23.setView(openGLRenderWindow2)

    interactor21.setView(openGLRenderWindow21)
    interactor22.setView(openGLRenderWindow22)
    interactor24.setView(openGLRenderWindow24)
    interactor25.setView(openGLRenderWindow25)
    interactor26.setView(openGLRenderWindow26)
  })

  const container24 = document.getElementById('vtkContainer24')
  container24?.addEventListener('dblclick', () => {
    openGLRenderWindow2.setContainer(null)
    openGLRenderWindow2.setContainer(document.getElementById('vtkContainer24'))
    openGLRenderWindow24.setContainer(document.getElementById('vtkContainer2'))

    openGLRenderWindow21.setContainer(document.getElementById('vtkContainer21'))
    openGLRenderWindow22.setContainer(document.getElementById('vtkContainer22'))
    openGLRenderWindow23.setContainer(document.getElementById('vtkContainer23'))
    openGLRenderWindow25.setContainer(document.getElementById('vtkContainer25'))
    openGLRenderWindow26.setContainer(document.getElementById('vtkContainer26'))

    interactor2.setView(openGLRenderWindow24)
    interactor24.setView(openGLRenderWindow2)

    interactor21.setView(openGLRenderWindow21)
    interactor22.setView(openGLRenderWindow22)
    interactor23.setView(openGLRenderWindow23)
    interactor25.setView(openGLRenderWindow25)
    interactor26.setView(openGLRenderWindow26)
  })

  const container25 = document.getElementById('vtkContainer25')
  container25?.addEventListener('dblclick', () => {
    openGLRenderWindow2.setContainer(null)
    openGLRenderWindow25.setContainer(document.getElementById('vtkContainer2'))
    openGLRenderWindow2.setContainer(document.getElementById('vtkContainer25'))

    openGLRenderWindow21.setContainer(document.getElementById('vtkContainer21'))
    openGLRenderWindow22.setContainer(document.getElementById('vtkContainer22'))
    openGLRenderWindow23.setContainer(document.getElementById('vtkContainer23'))
    openGLRenderWindow24.setContainer(document.getElementById('vtkContainer24'))
    openGLRenderWindow26.setContainer(document.getElementById('vtkContainer26'))

    interactor2.setView(openGLRenderWindow25)
    interactor25.setView(openGLRenderWindow2)

    interactor21.setView(openGLRenderWindow21)
    interactor22.setView(openGLRenderWindow22)
    interactor23.setView(openGLRenderWindow23)
    interactor24.setView(openGLRenderWindow24)
    interactor26.setView(openGLRenderWindow26)
  })

  const container26 = document.getElementById('vtkContainer26')
  container26?.addEventListener('dblclick', () => {
    openGLRenderWindow2.setContainer(null)
    openGLRenderWindow26.setContainer(document.getElementById('vtkContainer2'))
    openGLRenderWindow2.setContainer(document.getElementById('vtkContainer26'))

    openGLRenderWindow21.setContainer(document.getElementById('vtkContainer21'))
    openGLRenderWindow22.setContainer(document.getElementById('vtkContainer22'))
    openGLRenderWindow23.setContainer(document.getElementById('vtkContainer23'))
    openGLRenderWindow24.setContainer(document.getElementById('vtkContainer24'))
    openGLRenderWindow25.setContainer(document.getElementById('vtkContainer25'))

    interactor2.setView(openGLRenderWindow26)
    interactor26.setView(openGLRenderWindow2)

    interactor21.setView(openGLRenderWindow21)
    interactor22.setView(openGLRenderWindow22)
    interactor23.setView(openGLRenderWindow23)
    interactor24.setView(openGLRenderWindow24)
    interactor25.setView(openGLRenderWindow25)
  })
})

onBeforeUnmount(() => {
  destoryCS(renderingEngineId, groupId)
})

onUpdated(() => {
  renderVolume(fileImageIds.value)
})

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

function toggleList1(){
  showList1.value=true
  showList2.value=false
}

function toggleList2(){
  showList1.value=false
  showList2.value=true
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

            <div class="small-window">
              <h2 class="title">NUSS板原型</h2>
              <div class="small-vtkRenderWindow" id="vtkContainer26"></div>
            </div>
          </div>

          <div>
    <button @click="toggleList1"> AIGC指数</button>
    <!-- <button @click="toggleList2">测量指数</button> -->
    <div v-show="showList1">
      <ul>
        <li v-for="item in list1" :key="item">{{ item }}</li>
      </ul>
    </div>
    <div v-show="showList2">
      <ul>
        <li v-for="item in list2" :key="item">{{ item }}</li>
      </ul>
    </div>
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
  background-color: white(110, 50, 50);
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
  width: 100px; /* 让 vtk 容器宽度占满 */
  height: 80px;
  margin-bottom: 10px; /* 自定义高度 */
  background-color: black; /* 背景色以示区别 */
}

.container2 {
  width: 800px;
  height: 750px;
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
