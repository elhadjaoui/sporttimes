'use client';

import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { Suspense, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

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

function PitchWireframe() {
  const W = 8;
  const D = 12;

  const lines = useMemo(() => {
    const arr: number[] = [];
    const y = 0.001;
    // Outer rectangle
    arr.push(-W, y, -D, W, y, -D);
    arr.push(W, y, -D, W, y, D);
    arr.push(W, y, D, -W, y, D);
    arr.push(-W, y, D, -W, y, -D);
    // Halfway
    arr.push(-W, y, 0, W, y, 0);
    // Penalty boxes
    arr.push(-3.8, y, -D, -3.8, y, -D + 3.5);
    arr.push(3.8, y, -D, 3.8, y, -D + 3.5);
    arr.push(-3.8, y, -D + 3.5, 3.8, y, -D + 3.5);
    arr.push(-3.8, y, D, -3.8, y, D - 3.5);
    arr.push(3.8, y, D, 3.8, y, D - 3.5);
    arr.push(-3.8, y, D - 3.5, 3.8, y, D - 3.5);
    // 6-yard
    arr.push(-1.8, y, -D, -1.8, y, -D + 1.4);
    arr.push(1.8, y, -D, 1.8, y, -D + 1.4);
    arr.push(-1.8, y, -D + 1.4, 1.8, y, -D + 1.4);
    arr.push(-1.8, y, D, -1.8, y, D - 1.4);
    arr.push(1.8, y, D, 1.8, y, D - 1.4);
    arr.push(-1.8, y, D - 1.4, 1.8, y, D - 1.4);
    return new Float32Array(arr);
  }, []);

  return (
    <group>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[lines, 3]}
            count={lines.length / 3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#F5F5F0" transparent opacity={0.32} />
      </lineSegments>

      {/* Center circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[2.6, 2.66, 96]} />
        <meshBasicMaterial color="#F5F5F0" transparent opacity={0.32} />
      </mesh>

      {/* Center spot */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
        <circleGeometry args={[0.1, 16]} />
        <meshBasicMaterial color="#F5F5F0" opacity={0.5} transparent />
      </mesh>

      {/* Penalty arcs (D) — half-circles with chord exactly on the penalty
          box edge, bulging toward midfield. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, -8.5]}>
        {/* Home end: bulge toward +z */}
        <ringGeometry args={[1.45, 1.5, 48, 1, Math.PI, Math.PI]} />
        <meshBasicMaterial color="#F5F5F0" transparent opacity={0.32} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 8.5]}>
        {/* Away end: bulge toward -z */}
        <ringGeometry args={[1.45, 1.5, 48, 1, 0, Math.PI]} />
        <meshBasicMaterial color="#F5F5F0" transparent opacity={0.32} side={THREE.DoubleSide} />
      </mesh>

      {/* Goals as small wire rectangles outside the ends */}
      <lineSegments position={[0, 0.001, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array([
                -1.6, 0, -D, 1.6, 0, -D,
                -1.6, 0, -D - 0.9, 1.6, 0, -D - 0.9,
                -1.6, 0, -D, -1.6, 0, -D - 0.9,
                1.6, 0, -D, 1.6, 0, -D - 0.9,
                -1.6, 0, D, 1.6, 0, D,
                -1.6, 0, D + 0.9, 1.6, 0, D + 0.9,
                -1.6, 0, D, -1.6, 0, D + 0.9,
                1.6, 0, D, 1.6, 0, D + 0.9,
              ]),
              3,
            ]}
            count={16}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#F5F5F0" transparent opacity={0.4} />
      </lineSegments>
    </group>
  );
}

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

function CameraRig() {
  const mx = useRef(0);
  const my = useRef(0);

  useFrame(({ camera, pointer }) => {
    mx.current += (pointer.x - mx.current) * 0.18;
    my.current += (pointer.y - my.current) * 0.18;

    // Pulled back further so the pitch reads a bit smaller in the canvas.
    const baseX = 0;
    const baseY = 14.5;
    const baseZ = 20;

    camera.position.x = baseX + mx.current * 2;
    camera.position.y = baseY + -my.current * 1;
    camera.position.z = baseZ;
    camera.lookAt(mx.current * 0.8, 0.5 + my.current * 0.4, 0);
  });
  return null;
}


export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false }}
      camera={{ position: [0, 14.5, 20], fov: 38, near: 0.1, far: 200 }}
      className="!absolute inset-0"
      style={{ background: '#050505' }}
    >
      <fog attach="fog" args={['#050505', 22, 60]} />

      <Suspense fallback={null}>
        <BackgroundGrid />
        <PitchWireframe />
        {/* Home team — 8 interactive dots, hover/click */}
        {HOME_FORMATION.map((p, i) => (
          <PlayerDot key={`home-${i}`} pos={p} index={i} />
        ))}
      </Suspense>

      <CameraRig />
    </Canvas>
  );
}
