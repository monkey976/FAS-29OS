<template>
  <div>
    <!-- 输入框和按钮部分，置顶显示 -->
    <div class="input-controls">
      <label for="modelIdInput">Enter Model ID:</label>
      <input id="modelIdInput" type="text" v-model="modelId" />
      <button @click="loadFile">Load Model</button>
    </div>

    <!-- 渲染模型的容器 -->
    <div ref="vtkContainer" class="vtk-container" />

    <!-- 控制模型显示方式 -->
    <table class="controls">
      <tbody>
        <tr>
          <td>
            <select
              style="width: 100%"
              :value="representation"
              @change="setRepresentation($event.target.value)"
            >
              <option value="0">Points</option>
              <option value="1">Wireframe</option>
              <option value="2">Surface</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import '@kitware/vtk.js/Rendering/Profiles/Geometry';
import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkSTLReader from '@kitware/vtk.js/IO/Geometry/STLReader';
import vtkOBJReader from '@kitware/vtk.js/IO/Misc/OBJReader';

export default {
  name: 'TDModlePreview',

  setup() {
    const vtkContainer = ref(null);
    const context = ref(null);
    const modelId = ref('');
    const representation = ref(2);

    function setRepresentation(rep) {
      representation.value = Number(rep);
    }

    function loadFile() {
      if (!modelId.value) {
        alert('Please enter a valid model ID');
        return;
      }
      const apiUrl = `https://192.168.32.60:7105/3d_model/preview/${modelId.value}`;

      fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          const fileUrl = "https://192.168.32.60:7105" + data.data.filePath;
          fetch(fileUrl)
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.arrayBuffer();
            })
            .then(arrayBuffer => {
              let vtkReader;
              const extension = fileUrl.split('.').pop().toLowerCase();

              if (extension === 'stl') {
                vtkReader = vtkSTLReader.newInstance();
              } else if (extension === 'obj') {
                vtkReader = vtkOBJReader.newInstance();
              } else {
                alert('Unsupported file format');
                return;
              }

              vtkReader.parseAsArrayBuffer(arrayBuffer);
              const polyData = vtkReader.getOutputData();
              if (context.value) {
                const { mapper, renderWindow, renderer } = context.value;
                mapper.setInputData(polyData);
                renderer.resetCamera();
                renderWindow.render();
              }
            })
            .catch(error => {
              console.error('Error loading file:', error);
            });
        })
        .catch(error => {
          console.error('Error fetching file path:', error);
        });
    }

    onMounted(() => {
      if (!context.value) {
        const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
          rootContainer: vtkContainer.value,
        });

        const mapper = vtkMapper.newInstance();
        const actor = vtkActor.newInstance();
        actor.setMapper(mapper);

        const renderer = fullScreenRenderer.getRenderer();
        const renderWindow = fullScreenRenderer.getRenderWindow();

        renderer.addActor(actor);
        renderer.resetCamera();
        renderWindow.render();

        context.value = {
          fullScreenRenderer,
          renderWindow,
          renderer,
          mapper,
          actor,
        };
      }
    });

    onBeforeUnmount(() => {
      if (context.value) {
        const { fullScreenRenderer, actor, mapper } = context.value;
        actor.delete();
        mapper.delete();
        fullScreenRenderer.delete();
        context.value = null;
      }
    });

    return {
      vtkContainer,
      setRepresentation,
      representation,
      loadFile,
      modelId,
    };
  }
}
</script>

<style scoped>
/* 让输入框部分固定在页面顶部 */
.input-controls {
  position: fixed;
  top: 10px;
  left: 10px;
  background-color: white;
  padding: 10px;
  z-index: 1000; /* 确保在所有元素上方 */
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* 渲染模型的容器 */
.vtk-container {
  width: 100%;
  height: 100vh;
}

/* 控制模型显示方式的控件 */
.controls {
  position: fixed;
  top: 100px;
  left: 10px;
  padding: 12px;
  z-index: 1000;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
</style>
