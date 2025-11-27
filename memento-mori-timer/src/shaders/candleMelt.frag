uniform vec3 uCandleColor; // #d4af37
uniform float uProgress;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
  // Darken wax as it melts (more melted = darker)
  float darkening = 0.5 + uProgress * 0.5;
  vec3 color = uCandleColor * darkening;
  
  gl_FragColor = vec4(color, 1.0);
}
