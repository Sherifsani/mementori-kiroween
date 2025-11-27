import { useEffect, useState, useCallback } from "react";

interface UseWebGLContextReturn {
  isContextLost: boolean;
  errorMessage: string | null;
}

export const useWebGLContext = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  onContextLoss?: () => void
): UseWebGLContextReturn => {
  const [isContextLost, setIsContextLost] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleContextLost = useCallback(
    (event: Event) => {
      event.preventDefault();
      console.error("WebGL context lost");
      setIsContextLost(true);
      setErrorMessage("WebGL context lost. Attempting to restore...");

      // Notify parent component (e.g., to pause timer)
      onContextLoss?.();

      // Attempt restoration after 1 second
      setTimeout(() => {
        const canvas = canvasRef.current;
        if (canvas) {
          const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
          if (gl) {
            console.log("Attempting WebGL context restoration...");
          }
        }
      }, 1000);
    },
    [canvasRef, onContextLoss]
  );

  const handleContextRestored = useCallback(() => {
    console.log("WebGL context restored");
    setIsContextLost(false);
    setErrorMessage(null);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);

    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
    };
  }, [canvasRef, handleContextLost, handleContextRestored]);

  return { isContextLost, errorMessage };
};
