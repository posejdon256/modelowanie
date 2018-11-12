import { getMainVertexShader } from "./Shaders/mainVert";
import { getMainFragmentShader } from "./Shaders/mainFrag";
import { getMillVertexShader } from "./Shaders/millVert";
import { getMillFragmentShader } from "./Shaders/millFrag";
import { getGLCtx } from "../../Draw/Draw";
import { getLineVertexShader } from "./Shaders/lineVert";
import { getLineFragmentShader } from "./Shaders/lineFrag";

let fShader;
let vShader;
let texture;

let millVSShader;
let millFSShader;

let lineVSShader;
let lineFSShader;

let shaderProgram;
let shaderProgramMill;
let shaderProgramLine;

let modelMx;
let modelMxMill;
let projectionMx;
let projectionMxMill;

let modelMxLine;
let projectionMxLine;

let vertexBufferMaterial;
let indexBufferMaterial;
let normalBufferMaterial;

let vertexBufferMill;
let indexBufferMill;
let normalBufferMill;

let vertexBufferLine;
let indexBufferLine;

export function getTexture() {
  return texture;
}
export function getIndexBuffer() {
  return indexBufferMaterial;
}
export function getVertexBuffer() {
  return vertexBufferMaterial;
}
export function getNormalBuffer() {
  return normalBufferMaterial;
}
export function getIndexBufferMill() {
  return indexBufferMill;
}
export function getVertexBufferMill() {
  return vertexBufferMill;
}
export function getNormalBufferMill() {
  return normalBufferMill;
}
export function getIndexBufferLine() {
  return indexBufferLine;
}
export function getVertexBufferLine() {
  return vertexBufferLine;
}
export function getModelMx(){
  return modelMx;
}
export function getModelMxMill(){
  return modelMxMill;
}
export function getModelMxLine(){
  return modelMxLine;
}
export function getProjectionMxMill() {
  return projectionMxMill;
}
export function getProjectionMxLine() {
  return projectionMxLine;
}
export function getProjectionMx(){
  return projectionMx;
}
export function getShaderProgram() {
  return shaderProgram;
}
export function getShaderMill() {
  return shaderProgramMill;
}
export function getShaderLine() {
  return shaderProgramLine;
}
export function getFragmentShader() {
  return fShader;
}
export function getVertexShader() {
  return vShader;
}
export function initWebGL(canvas) {
    let gl = null;
    
    try {

      //Pobieranie kontekstu
      gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      gl.viewportWidth = canvas.width;
      gl.viewportHeight = canvas.height;

      initShaders(gl);

      gl.useProgram(shaderProgram);
      modelMx = gl.getUniformLocation(shaderProgram, "model");
      projectionMx = gl.getUniformLocation(shaderProgram, "projection");
      
      gl.useProgram(shaderProgramMill);
      modelMxMill = gl.getUniformLocation(shaderProgramMill, "model");
      projectionMxMill = gl.getUniformLocation(shaderProgramMill, "projection");

      gl.useProgram(shaderProgramLine);
      modelMxLine = gl.getUniformLocation(shaderProgramLine, "model");
      projectionMxLine = gl.getUniformLocation(shaderProgramLine, "projection");

      initBuffers(gl);
      initTexture(gl);
    }
    catch(e) {}
    
    // If we don't have a GL context, give up now
    if (!gl) {
      alert("Unable to initialize WebGL. Your browser may not support it.");
      gl = null;
    }
    
    return gl;
  }
  function initShaders(gl) {
    // Try to grab the standard context. If it fails, fallback to experimental.
    //Pobieranie shaderów jako tekstu
    let vertexShaderText =  getMainVertexShader();
    let fragmentShaderText = getMainFragmentShader();
    let vertexMillShaderText = getMillVertexShader();
    let fragmentMillShaderText = getMillFragmentShader();
    let vertexLineShaderText = getLineVertexShader();
    let fragmentLineShaderText = getLineFragmentShader();

    vShader = CreateShader( gl, vertexShaderText, gl.VERTEX_SHADER );
    fShader = CreateShader( gl, fragmentShaderText, gl.FRAGMENT_SHADER );

    millVSShader = CreateShader( gl, vertexMillShaderText, gl.VERTEX_SHADER );
    millFSShader = CreateShader( gl, fragmentMillShaderText, gl.FRAGMENT_SHADER );

    lineVSShader = CreateShader( gl, vertexLineShaderText, gl.VERTEX_SHADER );
    lineFSShader = CreateShader( gl, fragmentLineShaderText, gl.FRAGMENT_SHADER );

    //tworze program shaderowy
    shaderProgram = gl.createProgram();
    shaderProgramMill = gl.createProgram();
    shaderProgramLine = gl.createProgram();

    gl.attachShader(shaderProgram, vShader);
    gl.attachShader(shaderProgram, fShader);

    gl.attachShader(shaderProgramMill, millVSShader);
    gl.attachShader(shaderProgramMill, millFSShader);

    gl.attachShader(shaderProgramLine, lineVSShader);
    gl.attachShader(shaderProgramLine, lineFSShader);

    gl.linkProgram(shaderProgramLine);
    gl.linkProgram(shaderProgram);
    gl.linkProgram(shaderProgramMill);
  }
  function initBuffers(gl) {
      //init buffers
      vertexBufferMaterial = gl.createBuffer();
      indexBufferMaterial = gl.createBuffer();
      normalBufferMaterial = gl.createBuffer();

      vertexBufferMill = gl.createBuffer();
      indexBufferMill = gl.createBuffer();
      normalBufferMill = gl.createBuffer();

      vertexBufferLine = gl.createBuffer();
      indexBufferLine = gl.createBuffer();
  }
  export  function CreateShader(gl, source, type) {
  
    // Compiles either a shader of type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
  
    var shader = gl.createShader( type );
    gl.shaderSource( shader, source );
    gl.compileShader( shader );

    if ( !gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) {
    
      var info = gl.getShaderInfoLog( shader );
      throw "Could not compile WebGL program. \n\n" + info;
    }

    return shader
  }
  function initTexture(gl) {
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
     
    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                  new Uint8Array([0, 0, 255, 255]));
    const image = new Image();
    image.onload = function() {
      handleLoadedTexture(image);
    }
    image.src = "./wood.png";
  }
  function handleLoadedTexture(image) {
    const gl = getGLCtx();
     gl.bindTexture(gl.TEXTURE_2D, texture);
     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
  if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
    // Yes, it's a power of 2. Generate mips.
    gl.generateMipmap(gl.TEXTURE_2D);
  } else {
    // No, it's not a power of 2. Turn off mips and set wrapping to clamp to edge
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
 }
  }
  function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
  }