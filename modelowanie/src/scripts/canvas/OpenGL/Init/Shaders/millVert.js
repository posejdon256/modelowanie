let vertexShader =  `
attribute vec3 position;

uniform mat4 model;
uniform mat4 projection;

void main() {
    
    // Multiply the 
    gl_Position =  vec4(projection * model * vec4(position, 1.0));
  }`;
  export function getMillVertexShader() {
      return vertexShader;
  }