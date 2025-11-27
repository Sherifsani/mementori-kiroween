export default function SkullModel() {
  const pumpkinColor = "#ff8c1a";
  const pumpkinDark = "#d97706";
  const stemColor = "#6b4423";
  const glowColor = "#ffaa00";

  return (
    <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
      {/* Main pumpkin body - sphere */}
      <mesh position={[0, 0.2, 0]} scale={[1, 0.85, 1]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial
          color={pumpkinColor}
          roughness={0.6}
          metalness={0.0}
        />
      </mesh>

      {/* Pumpkin ridges - vertical segments */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.sin(angle) * 0.65;
        const z = Math.cos(angle) * 0.65;
        return (
          <mesh
            key={`ridge-${i}`}
            position={[x, 0.2, z]}
            rotation={[0, -angle, 0]}
            scale={[0.08, 0.7, 0.3]}
          >
            <sphereGeometry args={[1, 8, 16]} />
            <meshStandardMaterial
              color={pumpkinDark}
              roughness={0.7}
              metalness={0.0}
            />
          </mesh>
        );
      })}

      {/* Stem on top */}
      <group position={[0, 0.8, 0]} rotation={[0.1, 0, 0.05]}>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 0.3, 8]} />
          <meshStandardMaterial
            color={stemColor}
            roughness={0.9}
            metalness={0.0}
          />
        </mesh>
        {/* Stem ridges */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.09, 0.13, 0.28, 8]} />
          <meshStandardMaterial
            color="#5a3a1f"
            roughness={0.95}
            metalness={0.0}
          />
        </mesh>
      </group>

      {/* Left eye - triangle */}
      <group position={[-0.25, 0.35, 0.55]}>
        <mesh rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.15, 0.2, 3]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        {/* Inner glow */}
        <pointLight
          position={[0, 0, 0.1]}
          color={glowColor}
          intensity={0.5}
          distance={1}
        />
      </group>

      {/* Right eye - triangle */}
      <group position={[0.25, 0.35, 0.55]}>
        <mesh rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.15, 0.2, 3]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        {/* Inner glow */}
        <pointLight
          position={[0, 0, 0.1]}
          color={glowColor}
          intensity={0.5}
          distance={1}
        />
      </group>

      {/* Nose - small triangle */}
      <group position={[0, 0.15, 0.6]}>
        <mesh rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.08, 0.12, 3]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        {/* Inner glow */}
        <pointLight
          position={[0, 0, 0.1]}
          color={glowColor}
          intensity={0.3}
          distance={0.8}
        />
      </group>

      {/* Mouth - curved smile with teeth */}
      <group position={[0, -0.05, 0.5]}>
        {/* Main mouth opening - curved shape made with boxes */}
        {/* Left curve */}
        <mesh position={[-0.25, -0.05, 0.05]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.15, 0.12, 0.15]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[-0.35, -0.12, 0.02]} rotation={[0, 0, -0.5]}>
          <boxGeometry args={[0.12, 0.1, 0.12]} />
          <meshStandardMaterial color="#000000" />
        </mesh>

        {/* Center */}
        <mesh position={[0, -0.02, 0.08]}>
          <boxGeometry args={[0.35, 0.12, 0.15]} />
          <meshStandardMaterial color="#000000" />
        </mesh>

        {/* Right curve */}
        <mesh position={[0.25, -0.05, 0.05]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.15, 0.12, 0.15]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0.35, -0.12, 0.02]} rotation={[0, 0, 0.5]}>
          <boxGeometry args={[0.12, 0.1, 0.12]} />
          <meshStandardMaterial color="#000000" />
        </mesh>

        {/* Teeth - small rectangles at top of mouth */}
        {[-0.15, -0.05, 0.05, 0.15].map((x, i) => (
          <mesh key={`tooth-${i}`} position={[x, 0.03, 0.08]}>
            <boxGeometry args={[0.08, 0.08, 0.1]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        ))}

        {/* Inner glow for mouth */}
        <pointLight
          position={[0, -0.05, 0.15]}
          color={glowColor}
          intensity={0.8}
          distance={1.5}
        />
      </group>

      {/* Bottom indent */}
      <mesh position={[0, -0.5, 0]} scale={[0.3, 0.2, 0.3]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial
          color={pumpkinDark}
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>
    </group>
  );
}
