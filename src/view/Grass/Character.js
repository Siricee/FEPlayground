/* eslint-disable  */
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// const loader = new GLTFLoader()
// export function Character() {
//     return new Promise((resolve,reject)=>{
//         loader.load('./Grass/fbx/scene.gltf', (object) => {
//             resolve(object)
//         })
//     })
// }
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
const loader = new FBXLoader()
export function Character() {
    return new Promise((resolve, reject) => {
        loader.load('./Grass/zelda.fbx', object => {
            resolve(object)
        })
    })
}