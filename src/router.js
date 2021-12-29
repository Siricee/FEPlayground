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
const PhotoGallery = () => import("./view/PhotoGallery/index.vue");

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
    ],
  },
  {
    path: "*",
    component: Error,
  },
];
const router = new VueRouter({ routes });
export default router;
