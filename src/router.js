import VueRouter from "vue-router";
const Home = () => import("./view/Home.vue");
const Error = () => import("./view/Error.vue");
const Welcome = () => import("./view/Welcome.vue");
// views
const Solar = () => import("./view/Solar/Solar.vue");
const DotChart = () => import("./view/DotChart/DotChart.vue");
const TagCanvas = () => import("./view/TagCanvas/TagCanvas.vue");
const Particles = () => import("./view/Particles/index.vue");
const LinkLines = () => import("./view/LinkLines/index.vue");
// const PhotoGallery = () => import("./view/PhotoGallery/index.vue");
const PhotoGallery = () => import("./view/PhotoGallery/useCss.vue");

const VirtualCity = () => import("./view/VirtualCity/index.vue");
const MapGeoJsonChina = () => import("./view/MapGeoJsonChina/index.vue");
const MapSH = () => import("./view/MapSH/index.vue");
const LightDemo = () => import("./view/LightDemo/index.vue");
const OnlineCamera = () => import("./view/OnlineCamera/App.vue");
const ShaderTest =  () => import("./view/ShaderTest/index.vue");

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
        path: "/particles",
        component: Particles,
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
        path: "/OnlineCamera",
        component: OnlineCamera,
      },
      {
        path:"ShaderTest",
        component:ShaderTest,
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
