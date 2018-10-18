import { getMainVertexShader } from "./Shaders/mainVert";
import { getMainFragmentShader } from "./Shaders/mainFrag";
import { getLastTranslation } from "../../Translation/TranslationCenter/TranslationCenter";
import getProjectionMatrix from "../../Translation/Projection/Projection";

let fShader;
let vShader;
let shaderProgram;
let modelMx;
let projectionMx;
export function getModelMx(){
  return modelMx;
}
export function getProjectionMx(){
  return projectionMx;
}
export function getShaderProgram() {
  return shaderProgram;
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
      // Try to grab the standard context. If it fails, fallback to experimental.
      let vertexShaderText =  getMainVertexShader();
      let fragmentShaderText = getMainFragmentShader();
      gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      vShader = CreateShader( gl, vertexShaderText, gl.VERTEX_SHADER );
      fShader = CreateShader( gl, fragmentShaderText, gl.FRAGMENT_SHADER );

      //tworze program shaderowy
      shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vShader);
      gl.attachShader(shaderProgram, fShader);

      gl.linkProgram(shaderProgram);
      gl.useProgram(shaderProgram);
      modelMx = gl.getUniformLocation(shaderProgram, "model");
      projectionMx = gl.getUniformLocation(shaderProgram, "projection");
      let mx = getLastTranslation();
      gl.uniformMatrix4fv(modelMx, false, mx);
      mx = getProjectionMatrix(1);
      gl.uniformMatrix4fv(projectionMx, false, mx);
    }
    catch(e) {}
    
    // If we don't have a GL context, give up now
    if (!gl) {
      alert("Unable to initialize WebGL. Your browser may not support it.");
      gl = null;
    }
    
    return gl;
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