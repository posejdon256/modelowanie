let fragmentShader  = `
precision mediump float;
varying vec4 vColor;
  
void main() {
    gl_FragColor = vec4(255.0, 255.0, 255.0, 1.0);
}`;
export function getMainFragmentShader() {
  return fragmentShader;
}