import VueRouter from "vue-router";
const Home = () => import("./view/Home.vue");
const Error = () => import("./view/Error.vue");
const Welcome = () => import("./view/Welcome.vue");
// views
const Solar = () => import("./view/Solar/Solar.vue");
const DotChart = () => import("./view/DotChart/DotChart.vue");
const TagCanvas = () => import("./view/TagCanvas/TagCanvas.vue");
const LinkLines = () => import("./view/LinkLines/index.vue");
const PhotoGallery = () => import("./view/PhotoGallery/index.vue");

const VirtualCity = () => import("./view/VirtualCity/index.vue");
const MapGeoJsonChina = () => import("./view/MapGeoJsonChina/index.vue");
const MapSH = () => import("./view/MapSH/index.vue");
const LightDemo = () => import("./view/LightDemo/index.vue");
const MouseCursor = () => import("./view/MouseCursor/index.vue");
const SketchyPencilEffectShader = () => import("./view/SketchyPencilEffectShader/index.vue");
const Grass = () => import("./view/Grass/index.vue")
const StencilBuffer = () => import("./view/StencilBuffer/index.vue")
const GridGauge = () => import("./view/GridGauge/index.vue")
const SkyDome = () => import("./view/SkyDome/index.vue")
const TRSMatrix = () => import("./view/TRSMatrix/index.vue");
const MutiViewTransition = () => import("./view/MutiViewTransition/index.vue")
const RotateMatrix = () => import('./view/RotateMatrix/index.vue')
const Clouds = () => import('./view/Clouds/index.vue')
const TestModule = () => import('./view/TestModule/index.vue')
const ReflectionsVideoTextures = () => import('./view/Reflections&VideoTextures/index.vue')
const LimitFPS = () => import('./view/LimitFPS/index.vue')
const ToonShader = () => import('./view/ToonShader/index.vue')
const Emoji = ()=> import('./view/Emoji/index.vue')

const routes = [
  {
    path: "/",
    component: Home,
    children: [
      {
        path: "/",
        component: Welcome,
      },
      {
        path: "/home",
        redirect: "/",
      },
      {
        path: "/solar",
        component: Solar,
      },
      {
        path: "/dotchart",
        component: DotChart,
      },
      {
        path: "/tagcanvas",
        component: TagCanvas,
      },
      {
        path: "/linklines",
        component: LinkLines,
      },
      {
        path: "/photogallery",
        component: PhotoGallery,
      },
      {
        path: "/virtualcity",
        component: VirtualCity,
      },
      {
        path: "/mapgeojsonchina",
        component: MapGeoJsonChina,
      },
      {
        path: "/mapShanghai",
        component: MapSH,
      },
      {
        path: "/lightdemo",
        component: LightDemo,
      },
      {
        path: "/MouseCursor",
        component: MouseCursor,
      },
      {
        path: '/SketchyPencil',
        component: SketchyPencilEffectShader,
      },
      {
        path: '/Grass',
        component: Grass,
      },
      {
        path: "/StencilBuffer",
        component: StencilBuffer,
      },
      {
        path: "/GridGauge",
        component: GridGauge
      },
      {
        path: "/SkyDome",
        component: SkyDome
      },
      {
        path: "/Clouds",
        component: Clouds
      },
      {
        path: "/Reflections&VideoTextures",
        component: ReflectionsVideoTextures
      },
      {
        path: "/TRSMatrix",
        component: TRSMatrix,
      },
      {
        path: "/MutiViewTransition",
        component: MutiViewTransition,
      },
      {
        path: "/RotateMatrix",
        component: RotateMatrix
      },
      {
        path: '/LimitFPS',
        component: LimitFPS,
      }, 
      {
        path: "/ToonShader",
        component: ToonShader
      },
      {
        path: "/Emoji",
        component: Emoji
      },
      {
        path: '/TestModule',
        component: TestModule,
      }, 
    ],
  },
  {
    path: "*",
    component: Error,
  },
];
const router = new VueRouter({ routes });
export default router;
