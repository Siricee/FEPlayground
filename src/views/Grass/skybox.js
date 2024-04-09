/* eslint-disable  */
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
const loader = new GLTFLoader()
export function SkyBox() {
    return new Promise((resolve,reject)=>{
        loader.load('./Grass/skybox/scene.gltf', (gltf) => {
            resolve(gltf.scene)
        })
    })
}