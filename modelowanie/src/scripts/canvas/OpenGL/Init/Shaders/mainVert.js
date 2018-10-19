let vertexShader =  `
attribute vec3 position;
attribute vec3 normal;

uniform mat4 model;
uniform mat4 projection;
//do fragment shadera
varying vec3 vNormal;
varying vec3 vPos;

void main() {
    
    //Pass the color down to the fragment shader
    vNormal = normal;
    vPos = vec3((model * vec4(position, 1.0)).rgb);
    
    // Multiply the 
    gl_Position =  vec4(projection * model * vec4(position, 1.0));
  }`;
  export function getMainVertexShader() {
      return vertexShader;
  }