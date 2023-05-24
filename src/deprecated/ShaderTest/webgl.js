function createShader(gl, type, source) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source.trim());
  gl.compileShader(shader);
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

const vertexShader = `
void main(){
  gl_Position=vec4(0.0,0.0,0.0,1.0);
  gl_PointSize=1000.0;
}`;

const fragmentShader = `
#ifdef GL_ES
precision mediump float;
#endif
void main(){
  vec2 st = gl_FragCoord.xy / vec2(800,800) - 0.5;
  float lengthV = length(st);
  float stepV = step(0.3,lengthV);
  gl_FragColor = vec4(stepV,stepV,0,1.0);
}
`;

export default function main() {
  // 获取webgl的上下文
  var canvas = document.getElementById("renderCanvas");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }
  // 设置清空颜色
  gl.clearColor(1, 1, 1, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 初始化着色器（定点着色器和片段着色器）
  // 顶点着色器：就是定义点的位置、大小
  // 片元着色器：定义画出来的物体的材质（颜色、反光度等...）

  // 创建顶点着色器对象
  var _vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShader);

  // 创建片元着色器对象
  var _fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
  // 给片元着色器对象绑定定义代码

  // 创建一个着色器程序
  var glProgram = gl.createProgram();

  // 把前面创建的二个着色器对象添加到着色器程序中（顶点和片段着色器都需要）
  gl.attachShader(glProgram, _vertexShader);
  gl.attachShader(glProgram, _fragmentShader);

  // 把着色器程序链接成一个完整的程序
  gl.linkProgram(glProgram);

  // 使用这个完整的程序
  gl.useProgram(glProgram);

  // 绘制一个点
  gl.drawArrays(gl.POINTS, 0, 1);
}
