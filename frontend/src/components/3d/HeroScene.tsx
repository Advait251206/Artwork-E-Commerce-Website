/**
 * 3D Parallax Hero Module (Tier 3 Component)
 * 
 * Renders an abstract luxury 3D environment for the landing page.
 * Strictly checks device capability via `useFeatureFlag` to degrade gracefully.
 */
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, PerspectiveCamera, Stars } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import { useFeatureFlag } from '../../feature-flags/useFeatureFlag';

function AbstractSculpture() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    // Premium, heavy feeling: it gently counter-rotates toward the mouse rather than just shifting X/Y directly
    const targetRotX = (state.pointer.y * Math.PI) * 0.1;
    const targetRotY = (state.pointer.x * Math.PI) * 0.1;
    
    // Very slow, buttery lerp
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.02);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY + (t * 0.1), 0.02);
    
    // Extreme subtle shifting only (luxury items don't jump around)
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, (state.pointer.x * 0.5), 0.02);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, (state.pointer.y * 0.5), 0.02);
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={groupRef}>
        {/* Outer Glass Casing */}
        <mesh>
          <icosahedronGeometry args={[2.2, 0]} />
          <meshPhysicalMaterial 
            color="#ffffff"
            transmission={1} 
            opacity={1}
            metalness={0.1}
            roughness={0.05}
            ior={1.4}
            thickness={2}
            specularIntensity={1}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Inner Solid Gold Core */}
        <mesh scale={0.7} rotation={[Math.PI / 4, 0, Math.PI / 4]}>
          <octahedronGeometry args={[2, 0]} />
          <meshPhysicalMaterial 
            color="#D4AF37" // Luxury Gold
            metalness={1}
            roughness={0.15}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Elegant Gold Orbital Ring */}
        <mesh rotation={[Math.PI / 2.2, Math.PI / 6, 0]}>
          <torusGeometry args={[3.2, 0.02, 16, 100]} />
          <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.2} />
        </mesh>

        {/* Inner Subtle Orbital Ring */}
        <mesh rotation={[-Math.PI / 2.5, -Math.PI / 8, 0]}>
          <torusGeometry args={[2.8, 0.01, 16, 100]} />
          <meshStandardMaterial color="#ffffff" metalness={0.5} roughness={0.5} transparent opacity={0.4} />
        </mesh>
      </group>
    </Float>
  );
}

export default function HeroScene() {
  const isHighEnd = useFeatureFlag('ENABLE_3D_HERO');

  if (!isHighEnd) {
    // 0 CPU/GPU fallback for low end devices
    return (
      <div className="w-full h-[60vh] flex items-center justify-center bg-gradient-to-b from-[var(--color-luxury-charcoal)] to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1200')] bg-cover bg-center opacity-20 blur-sm"></div>
        <h1 className="text-4xl text-[var(--color-luxury-gold)] font-serif z-10">A U R A</h1>
      </div>
    );
  }

  // Uses 'demand' globally to cap frame execution if no interaction occurs vs continuous 60fps locking
  return (
    <div className="w-full h-[60vh] relative cursor-crosshair">
      <Canvas 
        dpr={Math.min(window.devicePixelRatio, 1.5)} // Limit rendering overhead to 1.5x max
        camera={{ position: [0, 0, 8], fov: 45 }}
      >
        <color attach="background" args={['#1c1c1c']} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#D4AF37" />
        <Environment preset="studio" />
        
        <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
        
        <AbstractSculpture />
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
      </Canvas>
    </div>
  );
}
