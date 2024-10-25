<script setup>
import {
  volumeLoader,
  RenderingEngine,
  Enums as csEnums,
  setVolumesForViewports,
  CONSTANTS, getRenderingEngine,
  cache
} from "@cornerstonejs/core";
import initCornerstone from "@/cornerstone/helper/initCornerstone";
import destoryCS from "@/cornerstone/helper/destoryCS";
import useLoading from "@/hooks/useLoading";
import get3DTestImageId from "@/cornerstone/helper/get3DTestImageId";
import cornerstoneDICOMImageLoader from "@cornerstonejs/dicom-image-loader";


import {
  addTool,
  Enums as cstEnums,
  ToolGroupManager,
  TrackballRotateTool
} from "@cornerstonejs/tools";
import {onMounted,ref,onBeforeUnmount,onUpdated} from "vue"
import axios from 'axios'
const volumeName = "CT_VOLUME_ID";
const volumeLoaderScheme = "cornerstoneStreamingImageVolume";
const volumeId = `${volumeLoaderScheme}:${volumeName}`;

const renderingEngineId = "my_renderingEngine";
let volumeIns = null;
const toolGroupId = "toolGroupId";
const viewportId = "3Dvp";
const presetOptions = CONSTANTS.VIEWPORT_PRESETS.map(item => item.name);
const preset = ref("CT-Bone");
const rotate = ref(0);
const invert = ref(false);
const fileImageIds = ref([]);

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  destoryCS(renderingEngineId);
});

onUpdated(()=>
{

});

const { loading } = useLoading();

async function init() {
  await initCornerstone();
  addTools();

  const imageIds = await get3DTestImageId();

 // const responseData = await axios.get("http://localhost:3000/files");
  //const imageIds = responseData.data.map(
  //(item) => `wadouri:http://localhost:3000/files/${item}`);

  await renderVolume(imageIds);
}

// 设置当前激活的工具 
function activeTools(){
    const toolGroup = ToolGroupManager.getToolGroup(toolGroupId);
  toolGroup.setToolActive(TrackballRotateTool.toolName, {
    bindings: [
      {
        mouseButton: cstEnums.MouseBindings.Primary
      }
    ]
  });
}

function addTools() {
  //  顶层API全局添加
  addTool(TrackballRotateTool);
  
  // 创建工具组，在工具组添加
  const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
  toolGroup.addTool(TrackballRotateTool.toolName);
  
  toolGroup.addViewport(viewportId, renderingEngineId);
}

function handleChange(type, value) {
  const viewport = getRenderingEngine(renderingEngineId).getViewport(viewportId);
  viewport.setProperties({
    [type]: value
  });
  viewport.render();
}

// 上传文件夹
function handleFolderSelect(event){
  event.stopPropagation();
  event.preventDefault();
  cache.purgeCache();

  const files=event.target.files;
  if(!files.length) return;

  const imageIds = [];  // 用于存储文件URL的数组
  Array.from(files).forEach(file => {
  const fileUrl = URL.createObjectURL(file); // 获取文件的 URL
  const fil= fileUrl.replace('blob:','wadouri:');
  imageIds.push(fil);  // 将 URL 存入数组
  });


  // const imageIds = [];
  // Array.from(files).forEach(file => {
  //   const imageId = cornerstoneDICOMImageLoader.wadouri.fileManager.add(file);
  //   imageIds.push(imageId);
  // });
  
  fileImageIds.value = imageIds;
  loadAndViewImage(imageIds);
}

// 加载并且查看Image
async function loadAndViewImage(imageIds) {
 // await prefetchMetadataInformation(imageIds);
  await renderVolume(imageIds);
}

// 预取元数据信息
async function prefetchMetadataInformation(imageIdsToPrefetch) {
  for (let i = 0; i < imageIdsToPrefetch.length; i++) {
    await cornerstoneDICOMImageLoader.wadouri.loadImage(imageIdsToPrefetch[i])
      .promise;
  }
}

// 根据ImageIds渲染volume
async function renderVolume(imageIds){
  if (imageIds?.length === 0) {
    return;
  }

  if (cache.getVolume(volumeId)) {
    cache.removeVolumeLoadObject(volumeId);
  }

  const renderingEngine = new RenderingEngine(renderingEngineId);
  const volume = await volumeLoader.createAndCacheVolume(volumeId, {imageIds});
  volumeIns = volume;
  const viewportInputArray = [
    {
      viewportId: viewportId,
      type: csEnums.ViewportType.VOLUME_3D,
      element: document.querySelector("#element1"),
      defaultOptions: {
        orientation: csEnums.OrientationAxis.CORONAL,
        background: CONSTANTS.BACKGROUND_COLORS.slicer3D
      }
    }
  ];
  renderingEngine.setViewports(viewportInputArray);
  renderingEngine.sWidth=600;
  renderingEngine.sHeight=600;

  await volume.load();
  await setVolumesForViewports(renderingEngine, [{ volumeId }], [viewportId]);
  
  const viewport = renderingEngine.getViewport(viewportId);
  viewport.setProperties({
    preset: preset.value,
  });
  viewport.render();
  activeTools();
}

</script>

<template>
  <div>
    <h3>3D Rendering</h3>
    <div class="form">
      <div class="form-item">
        <label >点击上传文件: </label>
        <input type="file" webkitdirectory directory @change="handleFolderSelect" />

      </div>
      <div class="form-item">
        <label class="label">preset：</label>
        <el-select
          v-model="preset"
          placeholder="Select"
          size="large"
          style="width: 300px"
          @change="(value) => handleChange('preset',value)"
        >
          <el-option
            v-for="item in presetOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </div>
      <div class="form-item">
        <label class="label">Rotate：  </label>
        <el-slider
          v-model="rotate"
          :min="0"
          :max="360"
          @input="(value) => handleChange('rotation',value)"
        />
      </div>
      <div class="form-item">
        <label class="label">颜色反转：</label>
        <el-radio-group
          v-model="invert"
          @change="(value) => handleChange('invert',value)"
        >
          <el-radio :value="false">
            false
          </el-radio>
          <el-radio :value="true">
            true
          </el-radio>
        </el-radio-group>
      </div>
    </div>
    <div id="demo-wrap">
      <div
        id="element1"
        v-loading="loading"
        class="cornerstone-item"
        element-loading-text="Loading..."
        element-loading-background="rgba(6, 28, 73, 0.2)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.form {
  display: flex;
  margin-top: 20px;
  
  .form-item {
    display: flex;
    align-items: center;
    vertical-align: middle;
    margin-right: 30px;
    min-width: 300px;
    
    .label {
      width: max-content;
      min-width: max-content;
      text-align: right;
    }
  }
}

.cornerstone-item {
  display: inline-block;
  width: 500px;
  height: 500px;
  margin-top: 20px;
  margin-right: 20px;
  padding: 20px;
  border: 10px solid #ea359c;
  border-radius: 10px;
}
</style>
