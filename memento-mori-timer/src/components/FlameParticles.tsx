import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FlameParticlesProps {
  progress: number; // 0-1 from timer
  reduceParticles?: boolean;
}

export default function FlameParticles({
  progress,
  reduceParticles = false,
}: FlameParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const particleCount = reduceParticles ? 38 : 75; // 50% reduction when needed

  // Create particle positions and shader material
  const { positions, shaderMaterial } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);

    // Position particles in cone shape above candle
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.15;
      const height = Math.random() * 0.8;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    // Custom shader for particle animation
    const vertexShader = `
      uniform float uTime;
      uniform float uIntensity;
      
      attribute float aOffset;
      
      varying float vAlpha;
      
      // Simplex noise function (simplified)
      float noise(vec3 p) {
        return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
      }
      
      void main() {
        vec3 pos = position;
        
        // Vertical movement with noise
        float noiseValue = noise(vec3(position.x * 2.0, position.z * 2.0, uTime * 0.5));
        pos.y += noiseValue * 0.3 * uIntensity;
        
        // Slight horizontal drift
        pos.x += sin(uTime + position.y * 3.0) * 0.05 * uIntensity;
        pos.z += cos(uTime + position.y * 3.0) * 0.05 * uIntensity;
        
        // Calculate alpha based on height and intensity
        vAlpha = (1.0 - position.y / 0.8) * uIntensity;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        // Size based on distance and intensity
        gl_PointSize = (30.0 / -mvPosition.z) * uIntensity;
      }
    `;

    const fragmentShader = `
      uniform vec3 uColor;
      varying float vAlpha;
      
      void main() {
        // Circular particle shape
        vec2 center = gl_PointCoord - vec2(0.5);
        float dist = length(center);
        
        if (dist > 0.5) discard;
        
        // Soft edges
        float alpha = (1.0 - dist * 2.0) * vAlpha;
        
        gl_FragColor = vec4(uColor, alpha);
      }
    `;

    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: 1.0 - progress },
        uColor: { value: new THREE.Color("#d4af37") },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    return { positions, shaderMaterial };
  }, [particleCount]);

  // Update uniforms on each frame
  useFrame((state) => {
    if (pointsRef.current) {
      const material = pointsRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;
      material.uniforms.uIntensity.value = 1.0 - progress;
    }
  });

  return (
    <points ref={pointsRef} position={[0, 2, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <primitive object={shaderMaterial} attach="material" />
    </points>
  );
}
