let fragmentShader  = `
precision mediump float;
  
void main() {
    gl_FragColor = vec4(240.0, 115.0, 0.0, 1.0);
}`;
export function getMillFragmentShader() {
  return fragmentShader;
}