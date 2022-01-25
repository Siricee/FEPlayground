import AMapLoader from "@amap/amap-jsapi-loader";

let _AMap; // 导出AMap对象供后面使用。
// TODO 其实这个对象是有问题的，loadMap 必须先调用一次之后才能调到 AMap
/**
 * 创建地图
 * @param {String} DOMid a HTML DOM Element is required as container.
 */
const loadMap = async (DOMid = ()=>{throw Error('a DOM container is required for function loadMap.')}) => {
  let map;
  await AMapLoader.load({
    key: "cb768eeffae8027bb2c28a96fcda1cad", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "1.4.15", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [
      "AMap.Autocomplete",
      "AMap.PlaceSearch",
      "AMap.GltfLoader",
      "Map3D",
      "DistrictSearch",
    ], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then((AMap) => {
      _AMap = AMap;
      map = new AMap.Map(DOMid, {
        viewMode: "3D",
        pitch: 65.59312320916906,
        zoom: 18,
        features: ["bg"],
        center: [121.490111, 31.227899],
        mapStyle: "amap://styles/c6660b43a6192769a281eeb0a76be94c",
        showIndoorMap: false,
      });
    })
    .catch((e) => {
      console.log(e);
    });
  return map;
};

export { loadMap, _AMap as AMap };
