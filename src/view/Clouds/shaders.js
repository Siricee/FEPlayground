export const vertexShader = /* glsl */ `
varying vec2 vUv; 
void main() {  
    vUv = uv;
    #ifdef USE_INSTANCING
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4( position, 1.0 );
    #else
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
    #endif
}
`

export const fragmentShader = /* glsl */ `
    uniform sampler2D map;

    uniform vec3 fogColor;
    uniform float fogNear;
    uniform float fogFar;

    varying vec2 vUv;

    void main() {

        float depth = gl_FragCoord.z / gl_FragCoord.w;
        float fogFactor = smoothstep( fogNear, fogFar, depth );

        gl_FragColor = texture2D( map, vUv );
        gl_FragColor.w *= pow( gl_FragCoord.z, 20.0 );
        gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );

    }
`
