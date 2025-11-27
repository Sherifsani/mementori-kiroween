interface VignetteOverlayProps {
  intensity: number; // 0-1
  shouldRender: boolean;
}

export const VignetteOverlay = ({
  intensity,
  shouldRender,
}: VignetteOverlayProps) => {
  if (!shouldRender) {
    return null;
  }

  // Calculate opacity based on intensity
  const opacity = Math.min(1, intensity);

  return (
    <div
      className="pointer-events-none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: `radial-gradient(circle at center, transparent 0%, transparent 30%, rgba(0, 0, 0, ${opacity}) 100%)`,
        zIndex: 10,
      }}
      aria-hidden="true"
    />
  );
};
