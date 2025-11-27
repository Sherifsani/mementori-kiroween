export default function SkullModel() {
  const boneColor = "#e8e0d5";
  const socketColor = "#0a0a0a";

  return (
    <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
      {/* Main skull - rounded square shape */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.2, 1.2, 0.8]} />
        <meshStandardMaterial
          color={boneColor}
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>

      {/* Round the top corners */}
      <mesh position={[-0.5, 0.8, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={boneColor}
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>
      <mesh position={[0.5, 0.8, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={boneColor}
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>

      {/* Round the side corners */}
      <mesh position={[-0.5, 0.3, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial
          color={boneColor}
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>
      <mesh position={[0.5, 0.3, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial
          color={boneColor}
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>

      {/* Eye sockets - large ovals */}
      <group>
        {/* Left eye */}
        <mesh position={[-0.3, 0.45, 0.35]} scale={[1, 1.3, 0.6]}>
          <sphereGeometry args={[0.2, 20, 20]} />
          <meshStandardMaterial color={socketColor} />
        </mesh>
        {/* Right eye */}
        <mesh position={[0.3, 0.45, 0.35]} scale={[1, 1.3, 0.6]}>
          <sphereGeometry args={[0.2, 20, 20]} />
          <meshStandardMaterial color={socketColor} />
        </mesh>
      </group>

      {/* Nasal cavity - heart/spade shape (upside down) */}
      <group position={[0, 0.15, 0.38]}>
        {/* Two rounded parts at top */}
        <mesh position={[-0.08, 0.08, 0]} scale={[0.8, 1, 0.6]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={socketColor} />
        </mesh>
        <mesh position={[0.08, 0.08, 0]} scale={[0.8, 1, 0.6]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={socketColor} />
        </mesh>
        {/* Triangle pointing down */}
        <mesh position={[0, -0.05, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.12, 0.2, 3]} />
          <meshStandardMaterial color={socketColor} />
        </mesh>
      </group>

      {/* Lower jaw base - rounded rectangle */}
      <mesh position={[0, -0.35, 0.15]}>
        <boxGeometry args={[1.1, 0.5, 0.6]} />
        <meshStandardMaterial
          color={boneColor}
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>

      {/* Round bottom corners of jaw */}
      <mesh position={[-0.5, -0.35, 0.15]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color={boneColor}
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>
      <mesh position={[0.5, -0.35, 0.15]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color={boneColor}
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>

      {/* Teeth gaps - vertical rectangles */}
      <group position={[0, -0.15, 0.42]}>
        {/* 5 tooth gaps */}
        {[-0.3, -0.15, 0, 0.15, 0.3].map((x, i) => (
          <mesh key={`gap-${i}`} position={[x, 0, 0]}>
            <boxGeometry args={[0.12, 0.35, 0.1]} />
            <meshStandardMaterial color={socketColor} />
          </mesh>
        ))}
      </group>

      {/* Smooth out the back */}
      <mesh position={[0, 0.3, -0.35]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial
          color={boneColor}
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>
    </group>
  );
}
