import { getMainVertexShader } from "./Shaders/mainVert";
import { getMainFragmentShader } from "./Shaders/mainFrag";
import { getMillVertexShader } from "./Shaders/millVert";
import { getMillFragmentShader } from "./Shaders/millFrag";

let fShader;
let vShader;

let millVSShader;
let millFSShader;

let shaderProgram;
let shaderProgramMill;

let modelMx;
let modelMxMill;
let projectionMx;
let projectionMxMill;

let vertexBufferMaterial;
let indexBufferMaterial;
let normalBufferMaterial;

let vertexBufferMill;
let indexBufferMill;
let normalBufferMill;

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
export function getModelMx(){
  return modelMx;
}
export function getModelMxMill(){
  return modelMxMill;
}
export function getProjectionMxMill() {
  return projectionMxMill;
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
      initBuffers(gl);
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

    vShader = CreateShader( gl, vertexShaderText, gl.VERTEX_SHADER );
    fShader = CreateShader( gl, fragmentShaderText, gl.FRAGMENT_SHADER );

    millVSShader = CreateShader( gl, vertexMillShaderText, gl.VERTEX_SHADER );
    millFSShader = CreateShader( gl, fragmentMillShaderText, gl.FRAGMENT_SHADER );

    //tworze program shaderowy
    shaderProgram = gl.createProgram();
    shaderProgramMill = gl.createProgram();

    gl.attachShader(shaderProgram, vShader);
    gl.attachShader(shaderProgram, fShader);

    gl.attachShader(shaderProgramMill, millVSShader);
    gl.attachShader(shaderProgramMill, millFSShader);

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