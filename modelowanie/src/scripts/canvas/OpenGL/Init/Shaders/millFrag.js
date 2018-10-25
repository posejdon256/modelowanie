let fragmentShader  = `
precision mediump float;
varying vec3 vNormal;
varying vec3 vPos;
  
void main() {
  //gl_FragColor = vec4(240.0, 115.0, 0.0, 1.0);
  vec3 ambient = vec3(50.0 / 255.0, 50.0 / 255.0, 50.0 / 255.0);
  vec3 diffuse = vec3(240.0 / 255.0, 200.0 / 255.0, 200.0 / 255.0);
  float ambientSaturation = 0.5;
  float diffSaturation = 0.7;
  vec3 light = vec3(0.0, -10.0, 0.0);
  vec3 fromLight = normalize(light - vPos);
  float diff = max(dot(vNormal, fromLight), 0.0);

  vec3 Ia = ambient * ambientSaturation;
  vec3 Id = diffuse * diff;
  gl_FragColor = vec4(Ia + Id, 1);
}`;
export function getMillFragmentShader() {
  return fragmentShader;
}