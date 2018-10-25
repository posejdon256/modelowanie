let vertexShader =  `
attribute vec3 position;

uniform mat4 model;
uniform mat4 projection;

varying vec3 vPos;

void main() {
    
    vPos = vec3((model * vec4(position, 1.0)).rgb);
    gl_Position = vec4(projection * model * vec4(position, 1.0));
  }`;
  export function getMillVertexShader() {
      return vertexShader;
  }