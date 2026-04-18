'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';

// 4-3-3 formation positions on a normalized pitch (centered on origin)
// Pitch is 16w x 24d (z = depth toward camera)
const FORMATION: Array<[number, number, 'gk' | 'def' | 'mid' | 'fwd']> = [
  [0, -10, 'gk'],
  [-6, -6, 'def'],
  [-2, -6, 'def'],
  [2, -6, 'def'],
  [6, -6, 'def'],
  [-5, -1, 'mid'],
  [0, -1, 'mid'],
  [5, -1, 'mid'],
  [-5, 5, 'fwd'],
  // [0, 6, 'fwd'], // The empty/glowing slot
  [5, 5, 'fwd'],
];

const GLOW_SLOT: [number, number] = [0, 6];

function PitchLines() {
  // White pitch outlines, dim — drawn as line segments above the pitch plane
  const lines = useMemo(() => {
    const arr: number[] = [];
    const W = 8; // half-width
    const D = 12; // half-depth
    // Outer rectangle
    arr.push(-W, 0.01, -D, W, 0.01, -D);
    arr.push(W, 0.01, -D, W, 0.01, D);
    arr.push(W, 0.01, D, -W, 0.01, D);
    arr.push(-W, 0.01, D, -W, 0.01, -D);
    // Halfway line
    arr.push(-W, 0.01, 0, W, 0.01, 0);
    // Penalty boxes (top and bottom)
    arr.push(-3.5, 0.01, -D, 3.5, 0.01, -D);
    arr.push(-3.5, 0.01, -D, -3.5, 0.01, -D + 3);
    arr.push(3.5, 0.01, -D, 3.5, 0.01, -D + 3);
    arr.push(-3.5, 0.01, -D + 3, 3.5, 0.01, -D + 3);
    arr.push(-3.5, 0.01, D, 3.5, 0.01, D);
    arr.push(-3.5, 0.01, D, -3.5, 0.01, D - 3);
    arr.push(3.5, 0.01, D, 3.5, 0.01, D - 3);
    arr.push(-3.5, 0.01, D - 3, 3.5, 0.01, D - 3);
    return new Float32Array(arr);
  }, []);

  return (
    <>
      {/* Center circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.011, 0]}>
        <ringGeometry args={[2.5, 2.55, 64]} />
        <meshBasicMaterial color="#F5F5F0" transparent opacity={0.18} />
      </mesh>

      {/* Center spot */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <circleGeometry args={[0.1, 16]} />
        <meshBasicMaterial color="#F5F5F0" opacity={0.4} transparent />
      </mesh>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[lines, 3]}
            count={lines.length / 3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#F5F5F0" transparent opacity={0.18} />
      </lineSegments>
    </>
  );
}

function Player({
  pos,
  role,
}: {
  pos: [number, number];
  role: 'gk' | 'def' | 'mid' | 'fwd';
}) {
  // Low-poly silhouette: a stretched capsule + a sphere head
  const ref = useRef<THREE.Group>(null);
  const seed = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    // Subtle bob
    ref.current.position.y = 0.5 + Math.sin(clock.elapsedTime * 0.8 + seed) * 0.05;
  });

  const tint =
    role === 'gk' ? '#9aa39c' : role === 'fwd' ? '#dadbcf' : '#b8bcaf';

  return (
    <group ref={ref} position={[pos[0], 0.5, pos[1]]}>
      {/* Body */}
      <mesh castShadow>
        <capsuleGeometry args={[0.32, 0.7, 4, 8]} />
        <meshStandardMaterial color={tint} roughness={0.85} metalness={0.05} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.22, 12, 10]} />
        <meshStandardMaterial color={tint} roughness={0.8} />
      </mesh>
      {/* Soft floor disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.49, 0]}>
        <circleGeometry args={[0.5, 24]} />
        <meshBasicMaterial color="#000" transparent opacity={0.45} />
      </mesh>
    </group>
  );
}

function GlowingSlot({ pos }: { pos: [number, number] }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    // Pulse every 1.2s
    const pulse = 0.5 + 0.5 * Math.sin((t / 1.2) * Math.PI * 2);
    if (ringRef.current) {
      const s = 1 + pulse * 0.25;
      ringRef.current.scale.set(s, s, s);
      const m = ringRef.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.55 + pulse * 0.4;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 1.6 + pulse * 2.4;
    }
  });

  return (
    <group position={[pos[0], 0.02, pos[1]]}>
      <pointLight
        ref={lightRef}
        color="#D4FF3A"
        intensity={2}
        distance={6}
        decay={2}
        position={[0, 1.2, 0]}
      />
      {/* Outer pulse ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.65, 48]} />
        <meshBasicMaterial color="#D4FF3A" transparent opacity={0.7} />
      </mesh>
      {/* Inner solid disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <circleGeometry args={[0.4, 32]} />
        <meshBasicMaterial color="#D4FF3A" transparent opacity={0.18} />
      </mesh>
      {/* Empty slot silhouette dashed circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[0.36, 0.39, 48]} />
        <meshBasicMaterial color="#D4FF3A" transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function Pitch() {
  return (
    <group>
      {/* Ground plane — dark warm green */}
      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
      >
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#0A1A10" roughness={1} metalness={0} />
      </mesh>

      {/* Subtle pitch tint plate (slightly elevated) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[18, 26]} />
        <meshStandardMaterial color="#0F2E1A" roughness={1} />
      </mesh>

      <PitchLines />

      {FORMATION.map((p, i) => (
        <Player key={i} pos={[p[0], p[1]]} role={p[2]} />
      ))}

      <GlowingSlot pos={GLOW_SLOT} />
    </group>
  );
}

function CameraRig() {
  useFrame(({ camera, clock }) => {
    const t = clock.elapsedTime;
    // 25s cycle: dolly in/out + 5° lateral orbit
    const cycle = (t % 25) / 25; // 0..1
    const angle = Math.sin(cycle * Math.PI * 2) * (5 * Math.PI) / 180;
    const radius = 22;
    const dolly = 1 + Math.sin(cycle * Math.PI * 2) * 0.06;

    camera.position.x = Math.sin(angle) * radius;
    camera.position.z = Math.cos(angle) * radius * dolly;
    camera.position.y = 8;
    camera.lookAt(0, 0.5, 0);
  });
  return null;
}

export default function HeroScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 8, 22], fov: 32, near: 0.1, far: 200 }}
      className="!absolute inset-0"
    >
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 18, 60]} />

      {/* Ambient + key + rim */}
      <ambientLight intensity={0.25} color="#fff5e0" />
      <directionalLight
        position={[8, 18, 6]}
        intensity={0.7}
        color="#fff8e8"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight
        position={[-12, 10, -8]}
        intensity={0.35}
        color="#a8b8a0"
      />

      <Suspense fallback={null}>
        <Pitch />
      </Suspense>

      <CameraRig />
    </Canvas>
  );
}
