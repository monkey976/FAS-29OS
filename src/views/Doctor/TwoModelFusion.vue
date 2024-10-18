<template>
    <div class="container">
      <div class="vtk-container" id="vtkContainer1">病例分割</div>
      <div class="vtk-container" id="vtkContainer2">NUSS板</div>
      <div class="vtk-container" id="vtkContainer3">病例+拟合窗口</div>
      <!-- <div class="vtk-container" id="vtkContainer4">NUSS板切片</div> -->
    </div>
  </template>
  
  <script lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue'

  import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer';
  import vtkRenderWindowInteractor from '@kitware/vtk.js/Rendering/Core/RenderWindowInteractor';
  import vtkOpenGLRenderWindow from '@kitware/vtk.js/Rendering/OpenGL/RenderWindow';
  import '@kitware/vtk.js/Rendering/Profiles/Geometry'
  import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor'
  import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper'
  import vtkSTLReader from '@kitware/vtk.js/IO/Geometry/STLReader'
  import vtkRenderWindow  from '@kitware/vtk.js/Rendering/Core/RenderWindow'
  import vtkInteractorStyleTrackballCamera from '@kitware/vtk.js/Interaction/Style/InteractorStyleTrackballCamera';
  import vtkHttpDataAccessHelper from '@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper';
  import vtkPolyData from '@kitware/vtk.js/Common/DataModel/PolyData';
  import vtkCutter from '@kitware/vtk.js/Filters/Core/Cutter';
  import vtkPlane from '@kitware/vtk.js/Common/DataModel/Plane';
  import vtkInteractorStyleManipulator from '@kitware/vtk.js/Interaction/Style/InteractorStyleManipulator';
  import vtkMouseCameraTrackballPanManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseCameraTrackballPanManipulator';
  import vtkCubeSource from '@kitware/vtk.js/Filters/Sources/CubeSource';
  import vtkSphereSource from '@kitware/vtk.js/Filters/Sources/SphereSource';
  import type { int } from '@kitware/vtk.js/types';
  
  export default {
    name: 'TwoModelFusion',
    
    setup() {
      onMounted(() => {
        // Function to create a rendering pipeline and load STL
        const createVTKPipeline = (containerId: string, stlPath: string,opacityValue:int) => {
          const renderWindow = vtkRenderWindow.newInstance();
          const renderer = vtkRenderer.newInstance();
          const openGLRenderWindow = vtkOpenGLRenderWindow.newInstance();
          const interactor = vtkRenderWindowInteractor.newInstance();
  
          // Configure the container for each rendering window
          openGLRenderWindow.setContainer(document.getElementById(containerId));
          renderWindow.addRenderer(renderer);
          renderWindow.addView(openGLRenderWindow);
          interactor.setView(openGLRenderWindow);
          interactor.initialize();
          interactor.bindEvents(document.getElementById(containerId));

           // 创建自定义交互样式
          const interactorStyle = vtkInteractorStyleManipulator.newInstance();
          const rightButtonPan = vtkMouseCameraTrackballPanManipulator.newInstance({
            button: 2,  // 2 表示鼠标右键
            });
          interactorStyle.addMouseManipulator(rightButtonPan);
          interactor.setInteractorStyle(interactorStyle);
          interactor.setInteractorStyle(vtkInteractorStyleTrackballCamera.newInstance());
        
          renderer.setBackground(0, 0, 0);
  
          // Read and load the STL file
          const stlReader = vtkSTLReader.newInstance();
  
          vtkHttpDataAccessHelper.fetchBinary(stlPath).then((arrayBuffer) => {
            stlReader.parseAsArrayBuffer(arrayBuffer);
          const polyData = stlReader.getOutputData();
          const bounds = polyData.getBounds(); 
          const cubeSource = vtkCubeSource.newInstance();
          cubeSource.setBounds(bounds); // 设置包围盒的坐标
          cubeSource.update();

          const cubeMapper = vtkMapper.newInstance();
          cubeMapper.setInputConnection(cubeSource.getOutputPort());
          const cubeActor = vtkActor.newInstance();
          cubeActor.setMapper(cubeMapper);
          cubeActor.getProperty().setColor(0.75, 0.75, 0.75); 
          cubeActor.getProperty().setOpacity(opacityValue); 
          const mapper = vtkMapper.newInstance();
          mapper.setInputConnection(stlReader.getOutputPort());
          const actor = vtkActor.newInstance();
          actor.setMapper(mapper);
          actor.getProperty().setColor(0,0,1);
            // Add actor to the renderer
            renderer.addActor(actor);
            renderer.addActor(cubeActor);

            // Reset camera and render the scene
            renderer.resetCamera();
            renderWindow.render();
          });
        };

        const createVTKCombinePipeline = (containerId: string, stlPath: string,stlPath2:string) => {
          const renderWindow = vtkRenderWindow.newInstance();
          const renderer = vtkRenderer.newInstance();
          const openGLRenderWindow = vtkOpenGLRenderWindow.newInstance();
          const interactor = vtkRenderWindowInteractor.newInstance();
  
          // Configure the container for each rendering window
          openGLRenderWindow.setContainer(document.getElementById(containerId));
          renderWindow.addRenderer(renderer);
          renderWindow.addView(openGLRenderWindow);
          interactor.setView(openGLRenderWindow);
          interactor.initialize();
          interactor.bindEvents(document.getElementById(containerId));
  
          // Set the interaction style for rotating, zooming, etc.
          interactor.setInteractorStyle(vtkInteractorStyleTrackballCamera.newInstance());
  
          
          // Set background color
          renderer.setBackground(0,0,0);
  
          // Read and load the STL file
          const stlReader = vtkSTLReader.newInstance();
          const stlReader2 = vtkSTLReader.newInstance();
  
          vtkHttpDataAccessHelper.fetchBinary(stlPath).then((arrayBuffer) => {
            stlReader.parseAsArrayBuffer(arrayBuffer);
          });

          vtkHttpDataAccessHelper.fetchBinary(stlPath2).then((arrayBuffer) => {
            stlReader2.parseAsArrayBuffer(arrayBuffer);
          });

           // Create a mapper and an actor for the STL
           const mapper = vtkMapper.newInstance();
            mapper.setInputConnection(stlReader.getOutputPort());
            const actor = vtkActor.newInstance();
            actor.setMapper(mapper);
            
           const mapper2 = vtkMapper.newInstance();
            mapper2.setInputConnection(stlReader2.getOutputPort());
            const actor2 = vtkActor.newInstance();
            actor2.setMapper(mapper2);
            actor2.setVisibility(true);
            // Add actor to the renderer
            renderer.addActor(actor);
            renderer.addActor(actor2);
  
            // Reset camera and render the scene
            renderer.resetCamera();
            renderer.getActiveCamera().zoom(2);
            
            
            renderWindow.render();
        };

        // const createVTKSlicingPipeline = (containerId: string, stlPath: string) => {
        //   const renderWindow = vtkRenderWindow.newInstance();
        //   const renderer = vtkRenderer.newInstance();
        //   const openGLRenderWindow = vtkOpenGLRenderWindow.newInstance();
        //   const interactor = vtkRenderWindowInteractor.newInstance();
  
        //   // Configure the container for each rendering window
        //   openGLRenderWindow.setContainer(document.getElementById(containerId));
        //   renderWindow.addRenderer(renderer);
        //   renderWindow.addView(openGLRenderWindow);
        //   interactor.setView(openGLRenderWindow);
        //   interactor.initialize();
        //   interactor.bindEvents(document.getElementById(containerId));

        //    // 创建自定义交互样式
        //   const interactorStyle = vtkInteractorStyleManipulator.newInstance();
        //   const rightButtonPan = vtkMouseCameraTrackballPanManipulator.newInstance({
        //     button: 2,  // 2 表示鼠标右键
        //     });
        //   interactorStyle.addMouseManipulator(rightButtonPan);
        //   interactor.setInteractorStyle(interactorStyle);
        //   interactor.setInteractorStyle(vtkInteractorStyleTrackballCamera.newInstance());
        
        //   renderer.setBackground(0, 0, 0);
  
        //   // Read and load the STL file
        //   const stlReader = vtkSTLReader.newInstance();
  
        //   vtkHttpDataAccessHelper.fetchBinary(stlPath).then((arrayBuffer) => {
        //     stlReader.parseAsArrayBuffer(arrayBuffer);

        //   const sphereSource = vtkSphereSource.newInstance({
        //      radius: 1.0,
        //      phiResolution: 30,
        //      thetaResolution: 30,
        //   });

        //  // const polyData = sphereSource.getOutputData();
        //   const polyData = stlReader.getOutputData();
        //   //polyData.setOrigin(0,0,0);
        //   const cutter= vtkCutter.newInstance();
        //   cutter.setInputData(polyData);

        //   const plane= vtkPlane.newInstance();
        //   plane.setOrigin(0, 0, 0);  // 平面初始位置
        //   plane.setNormal(0, 0, 1);  // 法向量为Z轴
        //   cutter.setCutFunction(plane);

        //   cutter.update();

        //   const sliceMapper = vtkMapper.newInstance();
        //   sliceMapper.setInputConnection(cutter.getOutputPort());

        //   const sliceActor = vtkActor.newInstance();
        //   sliceActor.setMapper(sliceMapper);
        //   sliceActor.getProperty().setColor(1, 0, 0);  // 红色切片
    
        //   //renderer.addActor(actor);
        //   renderer.addActor(sliceActor);

        //   // Reset camera and render the scene
        //   renderer.resetCamera();
        //   renderWindow.render();
        //   });
        // };

        createVTKPipeline('vtkContainer1', 'http://localhost:3000/files/Segmentation_Segment_4.stl',0);
        createVTKPipeline('vtkContainer2', 'http://localhost:3000/files/Segmentation_Segment_5.stl',0.3);
        createVTKCombinePipeline('vtkContainer3', 'http://localhost:3000/files/Segmentation_Segment_5.stl','http://localhost:3000/files/Segmentation_Segment_4.stl');
        
      });
    },
  };
  </script>
  
  <style scoped>
  .container {
    display: flex;
    justify-content: space-around;
  }
  
  .vtk-container {
    width: 48%;
    height: 50vh;
    border: 1px solid #ccc;
  }
  </style>
  