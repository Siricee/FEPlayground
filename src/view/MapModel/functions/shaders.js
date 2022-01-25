export const vertexShader = `
precision highp float;
#define ambientRatio 0.5
#define diffuseRatio 0.4
#define specularRatio 0.1

attribute vec2 faceUv;
uniform vec4 u_color;
varying vec2 v_texCoord;
varying vec4 v_color;
varying float v_lightWeight;


void main() {

    mat4 matModelViewProjection = projectionMatrix * modelViewMatrix;

    v_texCoord = faceUv;

    if(normal == vec3(0.,0.,1.)){
        v_color = u_color;
        gl_Position =  matModelViewProjection  * vec4(position, 1.0);
        return;
    }

    vec3 worldPos = vec3(vec4(position,1.0) * modelMatrix);
    vec3 worldNormal = vec3(vec4(normal,1.0) * modelMatrix); // N 
    // //cal light weight  光亮度的权重
    vec3 viewDir = normalize(cameraPosition - worldPos);     // V
    // 光照的方向， 前上方    Ild = k*I*(N·L)   
    vec3 lightDir = normalize(vec3(0.,-10.,1.));             // L
    vec3 halfDir = normalize(viewDir+lightDir);
    // //lambert
    float lambert = dot(worldNormal, lightDir);
      //specular  //反射
    float specular = pow(max(0.0, dot(worldNormal, halfDir)), 32.0);
      //sum to light weight  （lambert + 环境光）  Idiff = Iad + Ild = k*Ia + k*Il*（N·L）
    float lightWeight = ambientRatio + diffuseRatio * lambert + specularRatio * specular;
    v_texCoord = faceUv;
    v_lightWeight = lightWeight;

    // 根据光照方向，调整光线明暗    

    
    // v_lightWeight =  pow( 0.0 + 1.0 * abs(dot(worldNormal, worldPos)), 2.0);

    v_color =vec4(u_color.rgb*v_lightWeight , u_color.w); 

    gl_Position =  matModelViewProjection * vec4(position, 1.0);
}    
`;
export const fragmentShader = `
precision highp float;
uniform float u_opacity;
uniform vec4 u_baseColor;
uniform vec4 u_color;
uniform vec4 u_brightColor;
uniform vec4 u_windowColor;

uniform float u_zoom;
uniform float u_time;
uniform float u_near;
uniform float u_far;
varying vec2 v_texCoord;
varying vec4 v_color;
varying float v_lightWeight;


vec3 getWindowColor(float n, float hot, vec3 brightColor, vec3 darkColor) {
    float s = step(hot, n);
    vec3 color = mix(brightColor,vec3(1.0,1.0,1.0),n);
    return mix(darkColor, color, s);
}

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

float LinearizeDepth() 
{
    float z = gl_FragCoord.z * 2.0 - 1.0;  
    return (2.0 * u_near * u_far) / (u_far + u_near - z * (u_far - u_near));	
}

vec3 fog(vec3 color, vec3 fogColor, float depth){
    float fogFactor=clamp(depth,0.0,1.0);
    vec3 output_color=mix(fogColor,color,fogFactor);
    return output_color;
}

float sdRect(vec2 p, vec2 sz) {  
  vec2 d = abs(p) - sz;
  float outside = length(max(d, 0.));
  float inside = min(max(d.x, d.y), 0.);
  return outside + inside;
}


void main() {
    if(v_color.w == 0.0) {
      discard;
      return;
    }
    vec3 baseColor = u_color.xyz;
    vec3 brightColor = u_brightColor.xyz;
    vec3 windowColor = u_windowColor.xyz;
    float targetColId = 5.;
    float depth = 1.0 - LinearizeDepth() / u_far * u_zoom;   // 深度，调节明暗，远的颜色暗，近的颜色亮
    vec3 fogColor = vec3(23.0/255.0,31.0/255.0,51.0/255.0); 


    if(v_texCoord.x < 0.) { //顶部颜色
      vec3 foggedColor = fog(baseColor.xyz + vec3(0.12*0.9,0.2*0.9,0.3*0.9),fogColor,depth);
      gl_FragColor = vec4( foggedColor, v_color.w * u_opacity);
    }else { // 侧面颜色

      if (u_zoom < 14.0){
        gl_FragColor = v_color;
        return;
      }

      if (v_texCoord.x < 0.01 || v_texCoord.x > 0.99 || v_texCoord.y < 0.01 ){
        gl_FragColor = vec4(1.0,0.7,0.25,.5);   
        return;  
      }



      vec2 st = v_texCoord; 
      vec2 UvScale = v_texCoord;
      vec2 tStep = vec2(0.05,0.125);
      vec2 tStart = vec2(tStep.x * 0.25,tStep.y * 0.25);
      vec2 tEnd = vec2(tStep.x * 0.75,tStep.y * 0.75);


      float u = mod(UvScale.x, tStep.x);
      float v = mod(UvScale.y, tStep.y);
      float ux = floor(UvScale.x/tStep.x);
      float uy = floor(UvScale.y/tStep.y);
      float n = random(vec2(ux,uy));
      float lightP = u_time;
      float head = 1.0- step(0.005,st.y);
      /*step3*/
      // 将窗户颜色和墙面颜色区别开来
      float sU = step(tStart.x, u) - step(tEnd.x, u);
      float sV = step(tStart.y, v) - step(tEnd.y, v);
      vec2 windowSize = vec2(abs(tEnd.x-tStart.x),abs(tEnd.y-tStart.y));
      float dist = sdRect(vec2(u,v), windowSize);
      float s = sU * sV;
  
      float curColId = ux; // floor(UvScale.x / tStep.x);
      float sCol = step(targetColId - 0.2, curColId) - step(targetColId + 0.2, curColId);
      
      float mLightP = mod(lightP, 2.);
      float sRow = step(mLightP - 0.2, st.y) - step(mLightP, st.y);
      if(ux == targetColId){
          n =0.;
      }
    // float hot = min(1.0, abs (sin(u_time/6.0) ) );
    // float hot = smoothstep(1.0,0.0,timeP);
      //hot = clamp(hot,0.2,0.8);
      vec3 color = mix(baseColor, getWindowColor(n,u_time, brightColor,windowColor), s);
      
      float sFinal = s * sCol * sRow;
      color += mix(baseColor, brightColor, sFinal*n);

      if(head ==1.0) { // 顶部亮线
          color = brightColor;
      }
      color = color * v_lightWeight;

      vec3 foggedColor = fog(color,fogColor,depth);
        
      gl_FragColor = vec4(foggedColor,1.0);         
    }

}   
`;
