import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import vertexShader from "../shaders/candleMelt.vert?raw";
import fragmentShader from "../shaders/candleMelt.frag?raw";

interface CandleModelProps {
  progress: number; // 0-1 from timer
}

export default function CandleModel({ progress }: CandleModelProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Create shader material with uniforms
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uProgress: { value: progress },
        uTime: { value: 0 },
        uCandleColor: { value: new THREE.Color("#d4af37") },
      },
      vertexShader,
      fragmentShader,
    });
  }, []);

  // Update uniforms on each frame
  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uProgress.value = progress;
      material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 1, 0]}>
      <cylinderGeometry args={[0.2, 0.2, 2, 32]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  );
}
