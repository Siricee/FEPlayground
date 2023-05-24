/* eslint-disable no-unused-vars */
let gl;

const vertexShader = `
#version 300 es
in vec3 position;
in vec4 color;
out vec4 fcolor;

void main()
{
    gl_Position = vec4(position, 1) ;
    fcolor = color;
}
`;
const fragmentShader = `
#version 300 es
        precision mediump float;
        in vec4 fcolor;
        out vec4 finalColor;
        void main()
        {
            finalColor = fcolor;
        }
`;

function start() {
  console.log("I started");
  var canvas = document.getElementById("renderCanvas");
  gl = canvas.getContext("webgl2");

  var triangleVertices = [1.0, -1.0, 0.0, 0.0, 1.0, 0.0, -1.0, -1.0, 0.0];

  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(triangleVertices),
    gl.STATIC_DRAW
  );

  var triangleColors = [
    1.0,
    0.0,
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    0.0,
    1.0,
    1.0,
  ];

  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(triangleColors),
    gl.STATIC_DRAW
  );

  let _vertexShader = loadShader(vertexShader, gl.VERTEX_SHADER);
  let _fragmentshader = loadShader(fragmentShader, gl.FRAGMENT_SHADER);
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, _vertexShader);
  gl.attachShader(shaderProgram, _fragmentshader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Could not link shaders");
  }

  gl.useProgram(shaderProgram);

  var vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  var positionLocation = gl.getAttribLocation(shaderProgram, "position");
  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  //void gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

  var colorLocation = gl.getAttribLocation(shaderProgram, "color");
  gl.enableVertexAttribArray(colorLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  //void gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
  gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);

  requestAnimationFrame(runRenderLoop);

  function runRenderLoop() {
    gl.clearColor(1, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(shaderProgram);
    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    requestAnimationFrame(runRenderLoop);
  }
}

function loadShader(source, type) {
  console.log(gl);
  const shader = gl.createShader(type);
  if (shader === null) {
    console.log("unable to create shader");
    return null;
  }
  gl.shaderSource(shader, source.trim()); // 版本声明的代码必须严格在第一行,为防止vs/fs出错需要trim()。
  gl.compileShader(shader);

  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    gl.getShaderInfoLog(shader);
    console.log("Failed to compile shader");
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default start; 


// use example
/*
<script>
import start from './webgl2'
export default {
    mounted(){
        start();
    }
}
</script>
*/

