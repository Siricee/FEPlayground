## 简述

高德地图上添加一层 three，将模型放在 three 图层上并保持地图和 three 层相对位置不变。

## 调用过程

```
initMap => initLayer 这两步有先后，initMap 返回后 initLayer 才可以开始。
=> Threejs 场景初始化（Scene、Camera）
=> map 绑定 OnMapCameraChanged 事件
=> loadBuildingModels 模型loader
    => appendBuildingsToScene 加载模型，着色、分组、添加到Three场景
=> OnRenderThreeJs 渲染 Three 场景
```
