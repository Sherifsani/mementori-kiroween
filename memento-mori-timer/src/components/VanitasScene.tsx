import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { useRef, useEffect } from "react";
import SkullModel from "./SkullModel";
import CandleModel from "./CandleModel";
import FlameParticles from "./FlameParticles";
import { useWebGLContext } from "../hooks/useWebGLContext";
import { usePerformance } from "../hooks/usePerformance";

interface VanitasSceneProps {
  progress: number; // 0-1, from timer
  corruptionLevel: number;
  onContextLoss?: () => void;
  onPerformanceChange?: (metrics: {
    shouldReduceParticles: boolean;
    shouldDisableVignette: boolean;
  }) => void;
}

function SceneContent({
  progress,
  onPerformanceChange,
}: {
  progress: number;
  onPerformanceChange?: (metrics: {
    shouldReduceParticles: boolean;
    shouldDisableVignette: boolean;
  }) => void;
}) {
  const { shouldReduceParticles, shouldDisableVignette } = usePerformance();

  // Notify parent of performance changes
  useEffect(() => {
    onPerformanceChange?.({ shouldReduceParticles, shouldDisableVignette });
  }, [shouldReduceParticles, shouldDisableVignette, onPerformanceChange]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1.5, 4]} fov={50} />

      <ambientLight intensity={0.4} />

      {/* Key light from front-left */}
      <directionalLight position={[-2, 3, 3]} intensity={0.8} color="#e1e1e1" />

      {/* Point light above candle for flame illumination */}
      <pointLight
        position={[0, 2.2, 0]}
        intensity={2.0}
        color="#d4af37"
        distance={6}
      />

      {/* Rim light from behind for depth */}
      <pointLight
        position={[0, 1, -3]}
        intensity={0.5}
        color="#8a0b0b"
        distance={8}
      />

      {/* 3D Models */}
      <SkullModel />
      <CandleModel progress={progress} />
      <FlameParticles
        progress={progress}
        reduceParticles={shouldReduceParticles}
      />
    </>
  );
}

export default function VanitasScene({
  progress,
  onContextLoss,
  onPerformanceChange,
}: VanitasSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isContextLost, errorMessage } = useWebGLContext(
    canvasRef,
    onContextLoss
  );

  return (
    <>
      <Canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "#050505",
        }}
      >
        <SceneContent
          progress={progress}
          onPerformanceChange={onPerformanceChange}
        />
      </Canvas>

      {/* Error overlay for WebGL context loss */}
      {isContextLost && errorMessage && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(5, 5, 5, 0.95)",
            color: "#e1e1e1",
            fontSize: "24px",
            fontFamily: "monospace",
            zIndex: 1000,
            textAlign: "center",
            padding: "20px",
          }}
        >
          <div>
            <div style={{ marginBottom: "10px" }}>{errorMessage}</div>
            <div style={{ fontSize: "16px", opacity: 0.7 }}>
              The timer has been paused automatically.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
