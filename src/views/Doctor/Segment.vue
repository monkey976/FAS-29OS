<script setup>
import {
  cache,
  Enums as csEnums,
  getRenderingEngine,
  RenderingEngine,
  setVolumesForViewports,
  volumeLoader
} from "@cornerstonejs/core";
import {
  addTool,
  Enums as cstEnums,
  PanTool,
  StackScrollMouseWheelTool,
  ToolGroupManager,
  ZoomTool
} from "@cornerstonejs/tools";
import cornerstoneDICOMImageLoader from "@cornerstonejs/dicom-image-loader";
import initCornerstone from "@/cornerstone/helper/initCornerstone";
import { ElMessage } from "element-plus";
import { ElButton} from "element-plus";
import axios from '@/plugins/axios'
import destoryCS from "@/cornerstone/helper/destoryCS";
import {onMounted,ref,onBeforeUnmount,onUpdated} from "vue"

const renderingEngineId = "my_renderingEngine";
const viewportId0 = "CT_CORONAL_STACK";
const viewportId1 = "CT_AXIAL";
const viewportId2 = "CT_SAGITTAL";
const viewportId3 = "CT_CORONAL";
const volumeId = "my_volume_id_2";
const groupId = "groupId";
const type = ref("stack");
const fileImageIds = ref([]);
const formData=ref([]);
const uploadMessage=ref('');
const isSuccess=ref(false);
//const saveDicomToServerResponseData=ref();

const handleSaveDicomToServer = async () => {
  try {
    const response = await axios.post(
      'api/v1/DicomAccess/SaveDicomToServer',formData,
      {
        headers:{
          'Content-Type':'multipart/form-data',
        },
      });
  } catch (error) {
    console.error('发生异常', error)
  }
}

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  destoryCS(renderingEngineId, groupId);
});

onUpdated(() => {
  if (type.value === "stack") {
    renderStack(fileImageIds.value);
  } else {
    renderVolume(fileImageIds.value);
  }
});

async function prefetchMetadataInformation(imageIdsToPrefetch) {
  for (let i = 0; i < imageIdsToPrefetch.length; i++) {
    await cornerstoneDICOMImageLoader.wadouri.loadImage(imageIdsToPrefetch[i])
      .promise;
  }
}

async function renderStack(imageIds) {
  if (imageIds?.length === 0) {
    return;
  }
  
  const renderingEngine = getRenderingEngine(renderingEngineId);
  const viewportInput = {
    viewportId: viewportId0,
    type: csEnums.ViewportType.STACK,
    element: document.querySelector("#element0")
  };
  renderingEngine.enableElement(viewportInput);
  
  const toolGroup = ToolGroupManager.getToolGroup(groupId);
  toolGroup.addViewport(viewportId0, renderingEngineId);
  
  const viewport = renderingEngine.getViewport(viewportId0);
  viewport.sWidth=400;
  viewport.sHeight=400;

  await viewport.setStack(imageIds);
  
  activeTools();
  viewport.render();
}

async function renderVolume(imageIds) {
  if (imageIds?.length === 0) {
    return;
  }
  
  if (imageIds.length < 5) {
    ElMessage.error("请至少选择5张dicom图片进行MPR展示");
    return;
  }
  
  // 在缓存中删除上一次加载的影像
  if (cache.getVolume(volumeId)) {
    cache.removeVolumeLoadObject(volumeId);
  }
  
  const renderingEngine = getRenderingEngine(renderingEngineId);

  const viewportInputArray = [
    {
      viewportId: viewportId1,
      type: csEnums.ViewportType.ORTHOGRAPHIC,
      element: document.querySelector("#element1"),
      defaultOptions: {
        orientation: csEnums.OrientationAxis.AXIAL
      }
    },
    {
      viewportId: viewportId2,
      type: csEnums.ViewportType.ORTHOGRAPHIC,
      element: document.querySelector("#element2"),
      defaultOptions: {
        orientation: csEnums.OrientationAxis.SAGITTAL
      }
    },
    {
      viewportId: viewportId3,
      type: csEnums.ViewportType.ORTHOGRAPHIC,
      element: document.querySelector("#element3"),
      defaultOptions: {
        orientation: csEnums.OrientationAxis.CORONAL
      }
    }
  ];
  renderingEngine.setViewports(viewportInputArray);
  renderingEngine.sWidth=600;
  renderingEngine.sHeight=600;
  const toolGroup = ToolGroupManager.getToolGroup(groupId);
  toolGroup.addViewport(viewportId1, renderingEngineId);
  toolGroup.addViewport(viewportId2, renderingEngineId);
  toolGroup.addViewport(viewportId3, renderingEngineId);
  
  const volume = await volumeLoader.createAndCacheVolume(volumeId, {
    imageIds
  });
  volume.load();
  
  await setVolumesForViewports(
    renderingEngine,
    [
      {
        volumeId
      }
    ],
    [viewportId1, viewportId2, viewportId3]
  );
  
  activeTools();
  renderingEngine.render();
}

async function loadAndViewImage(imageIds) {
  await prefetchMetadataInformation(imageIds);
  
  if (type.value === "stack") {
    await renderStack(imageIds);
  } else {
    await renderVolume(imageIds);
  }
}

async function init() {
  await initCornerstone();
  
  // 准备一个渲染引擎 => renderingEngine
  new RenderingEngine(renderingEngineId);

  addTools();
}

function addTools() {
  // step1: 全局添加工具
  addTool(StackScrollMouseWheelTool);
  addTool(PanTool);
  addTool(ZoomTool);
  
  // step2：为工具组添加工具
  const toolGroup = ToolGroupManager.createToolGroup(groupId);
  toolGroup.addTool(StackScrollMouseWheelTool.toolName);
  toolGroup.addTool(PanTool.toolName);
  toolGroup.addTool(ZoomTool.toolName);
  
  // step4：禁用默认菜单
  ["element0", "element1", "element2", "element3"].forEach(id => {
    const dom = document.querySelector(`#${id}`);
    dom.oncontextmenu = () => false;
  });
}

function activeTools() {
  const toolGroup = ToolGroupManager.getToolGroup(groupId);
  toolGroup.setToolActive(StackScrollMouseWheelTool.toolName, {
    bindings: [{
      mouseButton: cstEnums.MouseBindings.Auxiliary
    }]
  });
  toolGroup.setToolActive(PanTool.toolName, {
    bindings: [{
      mouseButton: cstEnums.MouseBindings.Primary
    }]
  });
  toolGroup.setToolActive(ZoomTool.toolName, {
    bindings: [{
      mouseButton: cstEnums.MouseBindings.Secondary
    }]
  });
  
}

//上传文件
function handleChange(evt) {
  // 阻止事件冒泡
  evt.stopPropagation();
  evt.preventDefault();
  
  cache.purgeCache();

  const files = evt.target.files;
  const i=0;
  for(let i=0;i<files.length;i++)
  {
      formData.value.push({"key":i+1,"value":files[i]});
  }
  
  const imageIds = [];
  Array.from(files).forEach(file => {
    const imageId = cornerstoneDICOMImageLoader.wadouri.fileManager.add(file);
    imageIds.push(imageId);
  });
  
  fileImageIds.value = imageIds;
  loadAndViewImage(imageIds);
}

//上传文件夹
function handleFolderSelect(event){
  event.stopPropagation();
  event.preventDefault();
  
  cache.purgeCache();

  const files=event.target.files;
  if(!files.length) return;

  const imageIds = [];
  Array.from(files).forEach(file => {
    const imageId = cornerstoneDICOMImageLoader.wadouri.fileManager.add(file);
    imageIds.push(imageId);
  });
  
  fileImageIds.value = imageIds;
  loadAndViewImage(imageIds);
}
</script>

<template>
  <div>
    <h3>DICOM(CT/MRI)上传和预览</h3>
    <div class="form">
      <label for="">点击上传文件：</label>
      <input
        type="file"
        multiple
        @change="handleChange"
      >

      <label >点击上传文件夹: </label>
      <input type="file" webkitdirectory directory @change="handleFolderSelect" />
    </div>
    <div class="btn-wrap">
      <el-radio-group
        v-model="type"
        size="large"
      >
        <el-radio
          label="单层"
          value="stack"
        />
        <el-radio
          label="MPR"
          value="volume"
        />
      </el-radio-group>
    </div>
    <div id="demo-wrap">
      <div v-show="type === 'stack'">
        <div
          id="element0"
          class="cornerstone-item"
        />
      </div>
      
      <div v-show="type === 'volume'">
        <div
          id="element1"
          class="cornerstone-item"
        />
        <div
          id="element2"
          class="cornerstone-item"
        />
        <div
          id="element3"
          class="cornerstone-item"
        />
      </div>
    </div>

    <div class="file-upload">
      <el-button round color="#626aef" class="w-[100%]" :disabled="!formData" type="primary" @click="handleSaveDicomToServer()">
        将Dicom上传至服务器
      </el-button>

      <p v-if="uploadMessage" :class="{success:isSuccess,error:!isSuccess}">{{uploadMessage}}</p>
    </div>

  </div>
</template>

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
  border: 2px solid #96CDF2;
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
  color: #96CDF2;
}

.el-radio__input.is-checked .el-radio__inner {
  border-color: #96CDF2;
  background-color: #96CDF2;
}
</style>

<style scoped>
.file-upload {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.success {
  color: green;
}
.error {
  color: red;
}
</style>
