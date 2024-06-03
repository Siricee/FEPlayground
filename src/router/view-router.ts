export const viewRouters = {
  '2D Examples': [
    {
      name: 'MouseCursor',
      path: '/MouseCursor',
      component: () => import('@/views/MouseCursor/index.vue'),
    },
    {
      name: 'TagCanvas',
      path: '/tagcanvas',
      component: () => import('@/views/TagCanvas/TagCanvas.vue'),
    },
    {
      name: 'DotChart',
      path: '/dotchart',
      component: () => import('@/views/DotChart/DotChart.vue'),
    },
    {
      name: 'LinkLines',
      path: '/linklines',
      component: () => import('@/views/LinkLines/index.vue'),
    },
    {
      name: 'PhotoGallery',
      path: '/photogallery',
      component: () => import('@/views/PhotoGallery/index.vue'),
    },
  ],
  'GIS Examples': [
    {
      name: 'VirtualCity',
      path: '/virtualcity',
      component: () => import('@/views/VirtualCity/index.vue'),
    },
    {
      name: 'MapGeoJsonChina',
      path: '/mapgeojsonchina',
      component: () => import('@/views/MapGeoJsonChina/index.vue'),
    },
    {
      name: 'ShangHaiMap',
      path: '/mapShanghai',
      component: () => import('@/views/MapSH/index.vue'),
    },
  ],
  '3D Examples': [
    {
      name: 'Solar',
      path: '/solar',
      component: () => import('@/views/Solar/Solar.vue'),
    },
    {
      name: 'AtomiController',
      path: '/AtomiController',
      component: () => import('@/views/AtomiController/index.vue'),
    },
    {
      name: 'Clouds',
      path: '/Clouds',
      component: () => import('@/views/Clouds/index.vue'),
    },
    {
      name: 'DotChart',
      path: '/dotchart',
      component: () => import('@/views/DotChart/DotChart.vue'),
    },
    {
      name: 'EllipseCurveCamera',
      path: '/EllipseCurveCamera',
      component: () => import('@/views/EllipseCurveCamera/index.vue'),
    },
    {
      name: 'Emoji',
      path: '/Emoji',
      component: () => import('@/views/Emoji/index.vue'),
    },
    {
      name: 'GetHardwareInfo',
      path: '/GetHardwareInfo',
      component: () => import('@/views/GetHardwareInfo/index.vue'),
    },
    {
      name: 'Grass',
      path: '/Grass',
      component: () => import('@/views/Grass/index.vue'),
    },
    {
      name: 'GridGauge',
      path: '/GridGauge',
      component: () => import('@/views/GridGauge/index.vue'),
    },
    {
      name: 'HumanSkin',
      path: '/HumanSkin',
      component: () => import('@/views/HumanSkin/index.vue'),
    },
    {
      name: 'LightDemo',
      path: '/lightdemo',
      component: () => import('@/views/LightDemo/index.vue'),
    },
    {
      name: 'LimitFPS',
      path: '/LimitFPS',
      component: () => import('@/views/LimitFPS/index.vue'),
    },
    {
      name: 'MultiScenesSingleRender',
      path: '/MultiScenesSingleRender',
      component: () => import('@/views/MultiScenesSingleRender/index.vue'),
    },
    {
      name: 'MultiViewsSingleRender',
      path: '/MultiViewsSingleRender',
      component: () => import('@/views/MultiViewsSingleRender/index.vue'),
    },
    {
      name: 'MutiViewTransition',
      path: '/MutiViewTransition',
      component: () => import('@/views/MutiViewTransition/index.vue'),
    },
    {
      name: 'Reflections&VideoTextures',
      path: '/Reflections&VideoTextures',
      component: () => import('@/views/Reflections&VideoTextures/index.vue'),
    },
    {
      name: 'RotateMatrix',
      path: '/RotateMatrix',
      component: () => import('@/views/RotateMatrix/index.vue'),
    },
    {
      name: 'SketchyPencil',
      path: '/SketchyPencil',
      component: () => import('@/views/SketchyPencilEffectShader/index.vue'),
    },
    {
      name: 'SkyDome',
      path: '/SkyDome',
      component: () => import('@/views/SkyDome/index.vue'),
    },
    {
      name: 'StencilBuffer',
      path: '/StencilBuffer',
      component: () => import('@/views/StencilBuffer/index.vue'),
    },
    {
      name: 'StencilClipCapOutline',
      path: '/StencilClipCapOutline',
      component: () => import('@/views/StencilClipCapOutline/index.vue'),
    },
    {
      name: 'ToggleScene',
      path: '/ToggleScene',
      component: () => import('@/views/ToggleScene/index.vue'),
    },
    {
      name: 'ToonShader',
      path: '/ToonShader',
      component: () => import('@/views/ToonShader/index.vue'),
    },
    {
      name: 'ToonShader2',
      path: '/ToonShader2',
      component: () => import('@/views/ToonShader2/index.vue'),
    },
    {
      name: 'TransformController',
      path: '/TransformController',
      component: () => import('@/views/TransformController/index.vue'),
    },
    {
      name: 'TransformSynchronise',
      path: '/TransformSynchronise',
      component: () => import('@/views/TransformSynchronise/index.vue'),
    },
    {
      name: 'TRSMatrix',
      path: '/TRSMatrix',
      component: () => import('@/views/TRSMatrix/index.vue'),
    },
    {
      name: 'UVchecker',
      path: '/UVchecker',
      component: () => import('@/views/UVchecker/index.vue'),
    },
    {
      name: 'GeometryGizmo',
      path: '/GeometryGizmo',
      component: () => import('@/views/GeometryGizmo/index.vue'),
    },
    {
      name: 'CurlPlane',
      path: '/CurlPlane',
      component: () => import('@/views/CurlPlane/index.vue'),
    },
    {
      name: 'FilmGrain',
      path: '/FilmGrain',
      component: () => import('@/views/FilmGrain/index.vue')
    },
    {
      name: 'RevokePattern',
      path: '/RevokePattern',
      component: () => import('@/views/RevokePattern/index.vue')
    },
  ],
}
