let fragmentShader  = `
precision mediump float;
varying vec3 vNormal;
varying vec3 vPos;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
  
void main() {
  vec3 ambient = vec3(50.0 / 255.0, 50.0 / 255.0, 50.0 / 255.0);
  vec3 diffuse = vec3(255.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0);
  float ambientSaturation = 1.0;
  float diffSaturation = 0.7;
  vec3 light = vec3(0.0, -10.0, 0.0);
  vec3 fromLight = normalize(light - vPos);
  float diff = max(dot(vNormal, fromLight), 0.0);

  vec3 Ia = ambient * ambientSaturation;
  vec3 Id = diffuse * diff;
  gl_FragColor = texture2D(uSampler, ((vTextureCoord )  + (0.75, 0.75))/ 1.5) * 0.5 +  vec4(Ia + Id, 1) * 0.5;
 // gl_FragColor = vec4(Ia + Id, 1) ;
}`;
export function getMainFragmentShader() {
  return fragmentShader;
}