'use client';

import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { Suspense, useMemo, useRef, useState, type ReactNode } from 'react';
import * as THREE from 'three';
import PitchWireframe from './PitchWireframe';
import { scrollState } from '@/lib/scrollState';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// 8v8 layout. 2-3-2 formation per side. GK + 2 DEF + 3 MID + 2 FWD = 8.
// Pitch coords: x = -8..+8 (width), z = -12..+12 (depth).

// HOME — attacking +z, GK at -D side.
const HOME_FORMATION: Array<[number, number]> = [
  [0, -10],                              // GK
  [-3.8, -6], [3.8, -6],                 // DEF
  [-4.8, -1.5], [0, -2], [4.8, -1.5],    // MID
  [-3.2, 5], [3.2, 5],                   // FWD
];

// AWAY — attacking -z, mirrored across halfway.
const AWAY_FORMATION: Array<[number, number]> = [
  [0, 10],                               // GK
  [3.8, 6], [-3.8, 6],                   // DEF
  [4.8, 1.5], [0, 2], [-4.8, 1.5],       // MID
  [3.2, -5], [-3.2, -5],                 // FWD
];

function PlayerDot({
  pos,
  index,
}: {
  pos: [number, number];
  index: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const ringMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const coreMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const rippleRef = useRef<THREE.Mesh>(null);
  const seed = useMemo(() => index * 1.21, [index]);

  const [hovered, setHovered] = useState(false);
  // Click ripple progress 0..1 (advances each frame after click; -1 means idle)
  const ripple = useRef(-1);

  useFrame(({ clock, invalidate }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;

    // Idle breathing + hover-grow
    const breath = 0.95 + Math.sin(t * 0.7 + seed) * 0.05;
    const targetScale = hovered ? 1.45 : breath;
    const cur = groupRef.current.scale.x;
    const next = cur + (targetScale - cur) * 0.18;
    groupRef.current.scale.set(next, next, next);

    // Hover lime tween
    const lime = new THREE.Color('#F5F5F0').lerp(
      new THREE.Color('#D4FF3A'),
      hovered ? 0.85 : 0
    );
    if (ringMatRef.current) ringMatRef.current.color.copy(lime);
    if (coreMatRef.current) coreMatRef.current.color.copy(lime);

    // Halo opacity
    if (haloRef.current) {
      const m = haloRef.current.material as THREE.MeshBasicMaterial;
      m.opacity = hovered ? 0.28 + 0.1 * Math.sin(t * 5) : 0.1;
    }

    // Click ripple progress (~600ms)
    if (ripple.current >= 0 && rippleRef.current) {
      ripple.current = Math.min(1, ripple.current + 1 / 36);
      const p = ripple.current;
      const s = 1 + p * 4;
      rippleRef.current.scale.set(s, s, s);
      const m = rippleRef.current.material as THREE.MeshBasicMaterial;
      m.opacity = (1 - p) * 0.8;
      if (p >= 1) ripple.current = -1;
      invalidate?.();
    }
  });

  const handleOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.documentElement.classList.add('cursor-3d-hover');
  };
  const handleOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(false);
    document.documentElement.classList.remove('cursor-3d-hover');
  };
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    ripple.current = 0;
  };

  return (
    <group
      ref={groupRef}
      position={[pos[0], 0.01, pos[1]]}
      onPointerOver={handleOver}
      onPointerOut={handleOut}
      onClick={handleClick}
    >
      {/* Click ripple — sits underneath everything */}
      <mesh ref={rippleRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0005, 0]}>
        <ringGeometry args={[0.42, 0.5, 48]} />
        <meshBasicMaterial color="#D4FF3A" transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Soft glow halo */}
      <mesh ref={haloRef} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.7, 32]} />
        <meshBasicMaterial color="#F5F5F0" transparent opacity={0.1} depthWrite={false} />
      </mesh>

      {/* Outline ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[0.4, 0.45, 48]} />
        <meshBasicMaterial ref={ringMatRef} color="#F5F5F0" />
      </mesh>

      {/* Solid core dot */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <circleGeometry args={[0.36, 32]} />
        <meshBasicMaterial ref={coreMatRef} color="#F5F5F0" />
      </mesh>

      {/* Slightly larger invisible hit-target so dots are easy to grab */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]} visible={false}>
        <circleGeometry args={[0.85, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}

function AwayDot({ pos, index }: { pos: [number, number]; index: number }) {
  // Dimmer, smaller, non-interactive opposing-team dot.
  const ref = useRef<THREE.Group>(null);
  const seed = useMemo(() => index * 0.83, [index]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const b = 0.92 + Math.sin(clock.elapsedTime * 0.6 + seed) * 0.04;
    ref.current.scale.set(b, b, b);
  });

  return (
    <group ref={ref} position={[pos[0], 0.01, pos[1]]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[0.3, 0.34, 36]} />
        <meshBasicMaterial color="#7A7A72" transparent opacity={0.55} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <circleGeometry args={[0.27, 28]} />
        <meshBasicMaterial color="#3A3A33" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}


function BackgroundGrid() {
  // A faint grid floor extending beyond the pitch. Adds depth to the void
  // without adding "stuff".
  const lines = useMemo(() => {
    const arr: number[] = [];
    const size = 60;
    const step = 4;
    for (let i = -size; i <= size; i += step) {
      arr.push(-size, 0, i, size, 0, i);
      arr.push(i, 0, -size, i, 0, size);
    }
    return new Float32Array(arr);
  }, []);
  return (
    <lineSegments position={[0, -0.001, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[lines, 3]}
          count={lines.length / 3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#F5F5F0" transparent opacity={0.04} />
    </lineSegments>
  );
}

function TiltScene({ children }: { children: ReactNode }) {
  // Cursor-driven tilt, ON TOP of a base tilt that interpolates with
  // hero scroll — the pitch levels out (15° → 3°) as the camera descends.
  const groupRef = useRef<THREE.Group>(null);
  const rx = useRef(0);
  const rz = useRef(0);

  useFrame(({ pointer }) => {
    const p = scrollState.heroProgress; // 0..1

    // Base tilt eases from an elevated aerial tilt (~15°) to a grounded
    // near-flat look (~3°) as we scroll through the hero.
    const baseTiltX = lerp(15 * (Math.PI / 180), 3 * (Math.PI / 180), p);

    const targetX = baseTiltX + -pointer.y * 0.07;
    const targetZ = -pointer.x * 0.07;
    rx.current += (targetX - rx.current) * 0.08;
    rz.current += (targetZ - rz.current) * 0.08;
    if (groupRef.current) {
      groupRef.current.rotation.x = rx.current;
      groupRef.current.rotation.z = rz.current;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

function ScrollCamera() {
  // Scroll-scrubbed camera: aerial (high, far, wide-ish) → player-eye
  // (low, close, telephoto). FOV crunches for a broadcast-zoom feel.
  // Cursor parallax adds a small independent offset on top.
  const mx = useRef(0);
  const my = useRef(0);

  useFrame(({ camera, pointer }) => {
    const p = scrollState.heroProgress;
    const persp = camera as THREE.PerspectiveCamera;

    mx.current += (pointer.x - mx.current) * 0.18;
    my.current += (pointer.y - my.current) * 0.18;

    const baseY = lerp(14.5, 4.5, p);
    const baseZ = lerp(20, 8.5, p);
    const baseFOV = lerp(38, 24, p);

    persp.position.x = mx.current * 2;
    persp.position.y = baseY + -my.current * 1;
    persp.position.z = baseZ;

    if (Math.abs(persp.fov - baseFOV) > 0.01) {
      persp.fov = baseFOV;
      persp.updateProjectionMatrix();
    }

    // Keep looking at a point on the pitch near the forward half so the
    // descent feels like flying into the action, not into the turf.
    persp.lookAt(mx.current * 0.8, lerp(0.6, 1.2, p), lerp(0, 1.5, p));
  });

  return null;
}


export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 14.5, 20], fov: 38, near: 0.1, far: 200 }}
      className="!absolute inset-0"
      style={{ background: 'transparent' }}
    >
      <fog attach="fog" args={['#050505', 22, 60]} />

      <Suspense fallback={null}>
        <TiltScene>
          <BackgroundGrid />
          <PitchWireframe />
          {/* Home team — 8 interactive dots, hover/click */}
          {HOME_FORMATION.map((p, i) => (
            <PlayerDot key={`home-${i}`} pos={p} index={i} />
          ))}
        </TiltScene>
      </Suspense>

      <ScrollCamera />
    </Canvas>
  );
}
