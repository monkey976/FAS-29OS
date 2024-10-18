<template>
    <div class="vtk-container" id="vtkContainer"></div>

    <div class="vtk-container" id="vtkContainer2"></div>
  </template>
  
  <script lang="ts">
  import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer';
  import vtkRenderWindowInteractor from '@kitware/vtk.js/Rendering/Core/RenderWindowInteractor';
  import vtkOpenGLRenderWindow from '@kitware/vtk.js/Rendering/OpenGL/RenderWindow';
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import '@kitware/vtk.js/Rendering/Profiles/Geometry'
  import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor'
  import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper'
  import vtkSTLReader from '@kitware/vtk.js/IO/Geometry/STLReader'
  import vtkRenderWindow  from '@kitware/vtk.js/Rendering/Core/RenderWindow'
  import vtkInteractorStyleTrackballCamera from '@kitware/vtk.js/Interaction/Style/InteractorStyleTrackballCamera';
  
  export default{
    name: 'NussFusion',
  
    setup() {
      onMounted(() => {
        // 创建渲染窗口和渲染器
        const renderWindow = vtkRenderWindow.newInstance();
        const renderer = vtkRenderer.newInstance();
        const openGLRenderWindow = vtkOpenGLRenderWindow.newInstance();
        const interactor = vtkRenderWindowInteractor.newInstance();
  
        // 将渲染器与窗口相连
        renderWindow.addRenderer(renderer);
        openGLRenderWindow.setContainer(document.getElementById('vtkContainer'));
        renderWindow.addView(openGLRenderWindow);
        interactor.setView(openGLRenderWindow);
        interactor.initialize();
        interactor.bindEvents(document.getElementById('vtkContainer'));

         // 设置交互风格为 TrackballCamera，支持旋转、缩放和平移
        interactor.setInteractorStyle(vtkInteractorStyleTrackballCamera.newInstance());
  
        // 设置渲染器的背景颜色
        renderer.setBackground(0.1, 0.2, 0.4);
  
        // 读取 STL 文件
        const stlReader = vtkSTLReader.newInstance();
  

        const apiUrl = `https://192.168.32.59:7105/3d_model/preview/${2}`;

        fetch(apiUrl).then((response) => {
            if (!response.ok) {
                 throw new Error('Network response was not ok')
                 }
            return response.json()
         })
        .then((data) => {
          const fileUrl = 'https://192.168.32.59:7105' + data.data.filePath
                 fetch(fileUrl).then((response) => {
                     if (!response.ok) {
                          throw new Error('Network response was not ok')
                        }
                          return response.arrayBuffer()
                  })
                 .then((arrayBuffer) => {
                  stlReader.parseAsArrayBuffer(arrayBuffer);
  
        // 将 STL 数据连接到 Mapper
         const mapper = vtkMapper.newInstance();
         mapper.setInputConnection(stlReader.getOutputPort());

        // 创建 Actor 并设置 Mapper
        const actor = vtkActor.newInstance();
        actor.setMapper(mapper);

        // 将 Actor 添加到渲染器中
         renderer.addActor(actor);

        // 渲染窗口并重置相机
        renderer.resetCamera();
         renderWindow.render();
            })
              .catch((error) => {
              console.error('Error loading file:', error)
              })
        })
              .catch((error) => {
            console.error('Error fetching file path:', error)
        })
      });
    }
  };
  </script>
  
  <style scoped>
  .vtk-container {
    width: 100%;
    height: 100vh;
    border: 1px solid #ccc;
  }
  </style>
  