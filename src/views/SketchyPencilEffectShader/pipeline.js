
import * as THREE from 'three'
import { Pass, FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass'

const material = new THREE.ShaderMaterial({
    uniforms: {
        // we'll keep the naming convention here since the CopyShader
        // also used a tDiffuse texture for the currently rendered scene.
        tDiffuse: { value: null },
        // we'll pass in the canvas size here later
        uResolution: {
            value: new THREE.Vector2(1, 1)
        }
    },
    vertexShader: `varying vec2 vUv;

    void main() {
    
        vUv = uv;
    
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`,
    fragmentShader: `uniform sampler2D tDiffuse;
    uniform vec2 uResolution;
    
    varying vec2 vUv;
    
    float valueAtPoint(sampler2D image, vec2 coord, vec2 texel, vec2 point) {
        vec3 luma = vec3(0.299, 0.587, 0.114);
    
        return dot(texture2D(image, coord + texel * point).xyz, luma);
    }
    
    float diffuseValue(int x, int y) {
        return valueAtPoint(tDiffuse, vUv, vec2(1.0 / uResolution.x, 1.0 / uResolution.y), vec2(x, y)) * 0.6;
    }
    
    float getValue(int x, int y) {
        return diffuseValue(x, y);
    }
    
    
    float combinedSobelValue() {
        // kernel definition (in glsl matrices are filled in column-major order)
        const mat3 Gx = mat3(-1, -2, -1, 0, 0, 0, 1, 2, 1);// x direction kernel
        const mat3 Gy = mat3(-1, 0, 1, -2, 0, 2, -1, 0, 1);// y direction kernel
    
        // fetch the 3x3 neighbourhood of a fragment
    
        // first column
        float tx0y0 = getValue(-1, -1);
        float tx0y1 = getValue(-1, 0);
        float tx0y2 = getValue(-1, 1);
    
        // second column
        float tx1y0 = getValue(0, -1);
        float tx1y1 = getValue(0, 0);
        float tx1y2 = getValue(0, 1);
    
        // third column
        float tx2y0 = getValue(1, -1);
        float tx2y1 = getValue(1, 0);
        float tx2y2 = getValue(1, 1);
    
        // gradient value in x direction
        float valueGx = Gx[0][0] * tx0y0 + Gx[1][0] * tx1y0 + Gx[2][0] * tx2y0 +
        Gx[0][1] * tx0y1 + Gx[1][1] * tx1y1 + Gx[2][1] * tx2y1 +
        Gx[0][2] * tx0y2 + Gx[1][2] * tx1y2 + Gx[2][2] * tx2y2;
    
        // gradient value in y direction
        float valueGy = Gy[0][0] * tx0y0 + Gy[1][0] * tx1y0 + Gy[2][0] * tx2y0 +
        Gy[0][1] * tx0y1 + Gy[1][1] * tx1y1 + Gy[2][1] * tx2y1 +
        Gy[0][2] * tx0y2 + Gy[1][2] * tx1y2 + Gy[2][2] * tx2y2;
    
        // magnitude of the total gradient
        float G = (valueGx * valueGx) + (valueGy * valueGy);
        return clamp(G, 0.0, 1.0);
    }
    
    void main() {
        float sobelValue = combinedSobelValue();
        sobelValue = smoothstep(0.01, 0.03, sobelValue);
    
        vec4 lineColor = vec4(0.32, 0.12, 0.2, 1.0);
    
        if (sobelValue > 0.1) {
            gl_FragColor = lineColor;
        } else {
            gl_FragColor = vec4(1.0);
        }
    }
    `
})

const fsQuad = new FullScreenQuad(material)

const PencilLinesPass = new Pass()
PencilLinesPass.material = material
PencilLinesPass.fsQuad = fsQuad
PencilLinesPass.render = (renderer,
    writeBuffer,
    readBuffer) => {
    PencilLinesPass.material.uniforms.uResolution.value = new THREE.Vector2(renderer.domElement.clientWidth, renderer.domElement.clientHeight)
    PencilLinesPass.material.uniforms['tDiffuse'].value = readBuffer.texture
    if (PencilLinesPass.renderToScreen) {
        renderer.setRenderTarget(null)
        fsQuad.render(renderer)
    } else {
        renderer.setRenderTarget(writeBuffer)
        if (PencilLinesPass.clear) renderer.clear()
        fsQuad.render(renderer)
    }
}
const custompass = PencilLinesPass
export { custompass }