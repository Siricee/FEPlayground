import * as THREE from 'three'

const toonVertexShader = `
attribute vec3 position;
      attribute vec3 normal;
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      uniform mat4 normalMatrix;
      uniform float u_inflate;
      uniform bool u_isEdge;
      varying vec3 vNormal;

      void main() {
        vNormal = (normalMatrix * vec4(normal, 0.0)).xyz;
        vec3 p = position;
        if (u_isEdge == true) {
          p += normal * u_inflate;
        }
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
`
const toonFragmentShader = `
precision mediump float;

      uniform vec3 u_lightDirection;
      uniform vec3 u_globalColor;
      uniform float u_gradient;
      uniform bool u_isEdge;
      varying vec3 vNormal;

      void main() {
        vec3 light = normalize(u_lightDirection);
        vec3 normal = normalize(vNormal);

        if (u_isEdge == true) {
          vec3 rgb = vec3(0.0);
          gl_FragColor = vec4(rgb, 1.0);
        }

        if (u_isEdge == false) {
          // 法線の向きとベクトルの内積の結果から拡散光の計算する
          // 単位化された内積の結果は、-1.0 ~ 1.0になるので、
          // (-1.0 ~ 1.0) * 0.5 + 0.5 == (0.0 ~ 1.0) の範囲に代わる
          float luminance = dot(light, normal) * 0.5 + 0.5;

          // 情報の解像度を落とす
          // floor(0.4 * 3.0) / 3.0 = 0.333
          // floor(0.5 * 3.0) / 3.0 = 0.333
          // floor(0.6 * 3.0) / 3.0 = 0.333
          // floor(0.7 * 3.0) / 3.0 = 0.666
          // 一定の範囲内では計算結果が同じになり、つまり解像度が落ちた状態になる          
          luminance = floor(luminance * u_gradient) / u_gradient;
          vec3 rgb = vec3(u_globalColor * luminance);
          gl_FragColor = vec4(rgb, 1.0);
        }
      }
`

export class ToonShaderMaterial extends THREE.RawShaderMaterial {
  constructor() {
    super({
      vertexShader: toonVertexShader,
      fragmentShader: toonFragmentShader,
      wireframe: false,
      transparent: true,
      uniforms: {
        u_time: { type: 'f', value: 0.0 },
        u_resolution: { type: 'v3', value: new THREE.Vector2() },
        u_mouse: { type: 'v2', value: new THREE.Vector2() },
        u_lightDirection: { type: 'v3', value: new THREE.Vector3(1.0, 1.0, 1.0) },
        u_globalColor: { type: 'v3', value: new THREE.Vector3() },
        u_gradient: { type: 'f', value: 3.0 }, // グラデーション（解像度)
        u_inflate: { type: 'f', value: 10.0 }, // エッジラインの太さ
        u_isEdge: { type: 'i', value: false },
      },
      // flatShading: true,
      side: THREE.DoubleSide,
    })
    this.uniforms.u_globalColor.value = new THREE.Vector3(0.5, 1.0, 1.0)
    this.uniforms.u_resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight)
  }
}