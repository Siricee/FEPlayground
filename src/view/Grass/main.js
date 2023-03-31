/**
 * https://codesandbox.io/s/3rk1o6
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Grass from './Grass'
import { SkyBox } from './skybox'

export function run(DOM = document.body) {

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  DOM.appendChild(renderer.domElement)

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight
  )

  camera.position.set(-7, 3, 7)
  camera.lookAt(0, 0, 0)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.enablePan = false
  controls.maxPolarAngle = Math.PI / 2.2
  controls.maxDistance = 15

  const scene = new THREE.Scene()

  const grass = new Grass(50, 100000)
  scene.add(grass)

  let skybox = null
  SkyBox().then((_skybox) => {
    skybox = _skybox
    skybox.position.y = -4.5
    scene.add(skybox)
  })

  renderer.setAnimationLoop((time) => {
    grass.update(time)
    if (skybox) skybox.rotation.y += -0.0005 % Math.PI
    controls.update()
    renderer.render(scene, camera)
  })
}