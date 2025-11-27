export default function SkullModel() {
  return (
    <mesh position={[0, 0, 0]}>
      {/* Using sphere as placeholder for skull geometry */}
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshStandardMaterial color="#e1e1e1" roughness={0.3} metalness={0.1} />
    </mesh>
  );
}
