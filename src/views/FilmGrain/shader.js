export const vertexShader = `
        varying vec2 vUv;
        void main(){
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
`

export const fragmentShader = `
        uniform float amount;
        uniform float depth;
        uniform sampler2D tDiffuse;
        varying vec2 vUv;

        float random( vec2 p ){
            vec2 K1 = vec2( 23.14069263277926, 2.665144142690255 );
            return fract( cos( dot(p,K1)) * 12345.6789);
        }

        void main(){
            vec4 color = texture2D(tDiffuse,vUv);
            vec2 uvRandom = vUv;
            uvRandom.y *= random(vec2(uvRandom.y,amount));
            color.rgb += random(uvRandom)*depth;
            gl_FragColor = vec4(color);
        }
`