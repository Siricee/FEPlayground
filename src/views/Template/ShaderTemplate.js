export const material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
        texture1:
        {
            type: 't',
            value: new THREE.TextureLoader().load(
                /*  imageURL  */ 'https://images.unsplash.com/photo-1712324014968-018a63a4d0e8?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            )
        }
    },
    vertexShader: `
            varying vec2 vUv;

            void main() {
                vUv = uv;

                gl_Position =   projectionMatrix * 
                                modelViewMatrix * 
                                vec4(position,1.0);
            }
        `,
    fragmentShader: `
            uniform sampler2D texture1;

            varying vec2 vUv;

            void main() {
                gl_FragColor = texture2D(texture1, vUv);
            }
        `,
})