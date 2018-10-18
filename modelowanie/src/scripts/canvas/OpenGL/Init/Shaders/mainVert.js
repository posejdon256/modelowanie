let vertexShader =  `
attribute vec3 position;
attribute vec4 color;

uniform mat4 model;
uniform mat4 projection;
//do fragment shadera
varying vec4 vColor;

void main() {
    
    //Pass the color down to the fragment shader
    vColor = color;
    
    // Multiply the 
    gl_Position =  projection * model * vec4(position, 1.0);
  }`;
  export function getMainVertexShader() {
      return vertexShader;
  }