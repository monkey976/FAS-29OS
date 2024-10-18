

<script setup lang="ts">

import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkSphereSource from '@kitware/vtk.js/Filters/Sources/SphereSource';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkCutter from '@kitware/vtk.js/Filters/Core/Cutter';
import vtkPlane from '@kitware/vtk.js/Common/DataModel/Plane';
import vtkPolyData from '@kitware/vtk.js/Common/DataModel/PolyData';

// 创建渲染窗口
const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance();
const renderer = fullScreenRenderer.getRenderer();
const renderWindow = fullScreenRenderer.getRenderWindow();
const interactor = fullScreenRenderer.getInteractor();

// 创建一个球体示例
const sphereSource = vtkSphereSource.newInstance({
  radius: 1.0, 
  phiResolution: 30, 
  thetaResolution: 30
});
sphereSource.update();

// 定义切片类型
const cutter: vtkCutter = vtkCutter.newInstance();
cutter.setInputConnection(sphereSource.getOutputPort());

// 定义平面类型
const plane: vtkPlane = vtkPlane.newInstance();
plane.setOrigin(0, 0, 0);  // 平面初始位置
plane.setNormal(0, 0, 1);  // 法向量为Z轴
cutter.setCutFunction(plane);

// 更新切片
cutter.update();
const slicedPolyData: vtkPolyData = cutter.getOutput();

// 创建 mapper 和 actor
const sliceMapper: vtkMapper = vtkMapper.newInstance();
sliceMapper.setInputData(slicedPolyData);

const sliceActor: vtkActor = vtkActor.newInstance();
sliceActor.setMapper(sliceMapper);
sliceActor.getProperty().setColor(1, 0, 0);  // 红色切片

// 将 actor 添加到渲染器
renderer.addActor(sliceActor);
renderer.resetCamera();

// 定义切片逐步显示函数
let zPosition: number = -1.5;
function animateSlice(): void {
  zPosition += 0.05;  // 每次移动平面
  if (zPosition > 1.5) {
    zPosition = -1.5;  // 循环展示切片
  }
  plane.setOrigin(0, 0, zPosition);  // 更新切片平面位置
  cutter.update();  // 更新切片数据
  renderWindow.render();  // 重新渲染
  requestAnimationFrame(animateSlice);  // 动画循环
}

// 启动逐层切片显示
animateSlice();
</script>

