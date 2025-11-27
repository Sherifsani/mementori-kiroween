import { useRef, useState, useCallback } from "react";
import { useFrame } from "@react-three/fiber";

interface PerformanceMetrics {
  fps: number;
  shouldReduceParticles: boolean;
  shouldDisableVignette: boolean;
}

export const usePerformance = (): PerformanceMetrics => {
  const [shouldReduceParticles, setShouldReduceParticles] = useState(false);
  const [shouldDisableVignette, setShouldDisableVignette] = useState(false);
  const [currentFPS, setCurrentFPS] = useState(60);

  const frameTimesRef = useRef<number[]>([]);
  const lastTimeRef = useRef<number>(performance.now());
  const lowFPSCountRef = useRef<number>(0);

  const checkPerformance = useCallback(() => {
    const frameTimes = frameTimesRef.current;

    if (frameTimes.length === 0) return;

    // Calculate average FPS from last 60 frames
    const avgFrameTime =
      frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
    const fps = 1000 / avgFrameTime;

    setCurrentFPS(Math.round(fps));

    // Check if FPS is below 45
    if (fps < 45) {
      lowFPSCountRef.current++;

      // If FPS has been below 45 for 3 consecutive seconds (approximately 180 frames at 60fps)
      if (lowFPSCountRef.current >= 180) {
        if (!shouldReduceParticles) {
          console.warn(
            "Performance degradation detected. Reducing particle count by 50%"
          );
          setShouldReduceParticles(true);
        }

        // If still struggling after particle reduction, disable vignette
        if (lowFPSCountRef.current >= 360 && !shouldDisableVignette) {
          console.warn(
            "Severe performance degradation. Disabling vignette effect"
          );
          setShouldDisableVignette(true);
        }

        // Log performance metrics
        console.log(`Performance metrics: ${Math.round(fps)} FPS`);
      }
    } else {
      // Reset counter if FPS recovers
      lowFPSCountRef.current = 0;
    }
  }, [shouldReduceParticles, shouldDisableVignette]);

  useFrame(() => {
    const now = performance.now();
    const deltaTime = now - lastTimeRef.current;
    lastTimeRef.current = now;

    // Store frame times (keep last 60 frames)
    frameTimesRef.current.push(deltaTime);
    if (frameTimesRef.current.length > 60) {
      frameTimesRef.current.shift();
    }

    // Check performance every 60 frames
    if (frameTimesRef.current.length === 60) {
      checkPerformance();
    }
  });

  return {
    fps: currentFPS,
    shouldReduceParticles,
    shouldDisableVignette,
  };
};
