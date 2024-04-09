
import * as THREE from 'three'
import { Pass, FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass'


function createPipeline(renderer, scene, camera) {

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
        uniform sampler2D uNormals;
        uniform sampler2D uTexture;
        
        uniform vec2 uResolution;
        
        
        varying vec2 vUv;
        
        // The MIT License
        // Copyright © 2013 Inigo Quilez
        // Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
        // https://www.youtube.com/c/InigoQuilez
        // https://iquilezles.org
        vec2 grad( ivec2 z )  // replace this anything that returns a random vector
        {
            // 2D to 1D  (feel free to replace by some other)
            int n = z.x+z.y*11111;
        
            // Hugo Elias hash (feel free to replace by another one)
            n = (n<<13)^n;
            n = (n*(n*n*15731+789221)+1376312589)>>16;
        
            // Perlin style vectors
            n &= 7;
            vec2 gr = vec2(n&1,n>>1)*2.0-1.0;
            return ( n>=6 ) ? vec2(0.0,gr.x) : 
                   ( n>=4 ) ? vec2(gr.x,0.0) :
                                      gr;                            
        }
        
        float noise( in vec2 p ) {
            ivec2 i = ivec2(floor( p ));
             vec2 f =       fract( p );
            
            vec2 u = f*f*(3.0-2.0*f); // feel free to replace by a quintic smoothstep instead
        
            return mix( mix( dot( grad( i+ivec2(0,0) ), f-vec2(0.0,0.0) ), 
                             dot( grad( i+ivec2(1,0) ), f-vec2(1.0,0.0) ), u.x),
                        mix( dot( grad( i+ivec2(0,1) ), f-vec2(0.0,1.0) ), 
                             dot( grad( i+ivec2(1,1) ), f-vec2(1.0,1.0) ), u.x), u.y);
        }
        
        float valueAtPoint(sampler2D image, vec2 coord, vec2 texel, vec2 point) {
            vec3 luma = vec3(0.299, 0.587, 0.114);
        
            return dot(texture2D(image, coord + texel * point).xyz, luma);
        }
        
        float diffuseValue(int x, int y) {
            float cutoff = 40.0;
            float offset =  0.5 / cutoff;
            float noiseValue = clamp(texture(uTexture, vUv).r, 0.0, cutoff) / cutoff - offset;
        
            return valueAtPoint(tDiffuse, vUv + noiseValue, vec2(1.0 / uResolution.x, 1.0 / uResolution.y), vec2(x, y)) * 0.6;
        }
        
        float normalValue(int x, int y) {
            float cutoff = 50.0;
            float offset = 0.5 / cutoff;
            float noiseValue = clamp(texture(uTexture, vUv).r, 0.0, cutoff) / cutoff - offset;
        
            return valueAtPoint(uNormals, vUv + noiseValue, vec2(1.0 / uResolution.x, 1.0 / uResolution.y), vec2(x, y)) * 0.3;
        }
        
        float getValue(int x, int y) {
            float noiseValue = noise(gl_FragCoord.xy);
            noiseValue = noiseValue * 2.0 - 1.0;
            noiseValue *= 10.0;
        
            return diffuseValue(x, y) + normalValue(x, y) * noiseValue;
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


    let [width, height] = [renderer.domElement.clientWidth, renderer.domElement.clientHeight]
    const normalBuffer = new THREE.WebGLRenderTarget(width, height)

    normalBuffer.texture.format = THREE.RGBAFormat
    normalBuffer.texture.type = THREE.HalfFloatType
    normalBuffer.texture.minFilter = THREE.NearestFilter
    normalBuffer.texture.magFilter = THREE.NearestFilter
    normalBuffer.texture.generateMipmaps = false
    normalBuffer.stencilBuffer = false
    PencilLinesPass.normalBuffer = normalBuffer

    PencilLinesPass.normalMaterial = new THREE.MeshNormalMaterial()

    PencilLinesPass.material.uniforms.uResolution.value = new THREE.Vector2(width, height)
    // PencilLinesPass.material.uniforms.uTexture = { value: null }
    const loader = new THREE.TextureLoader()
    loader.load('./SketchyPencilEffectShader/noise.png', (texture) => {
        PencilLinesPass.material.uniforms.uTexture.value = texture
    })


    PencilLinesPass.render = (renderer,
        writeBuffer,
        readBuffer) => {

        renderer.setRenderTarget(PencilLinesPass.normalBuffer)
        const overrideMaterialValue = scene.overrideMaterial

        scene.overrideMaterial = PencilLinesPass.normalMaterial
        renderer.render(scene, camera)
        scene.overrideMaterial = overrideMaterialValue

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
    return PencilLinesPass
}
const custompass = (renderer, scene, camera) => createPipeline(renderer, scene, camera)
export { custompass }