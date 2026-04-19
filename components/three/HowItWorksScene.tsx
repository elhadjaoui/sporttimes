'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';
import PitchWireframe from './PitchWireframe';
import { scrollState } from '@/lib/scrollState';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
// Smoothstep between edges — 0 outside [e0,e1], 1 in between, eased
const band = (v: number, e0: number, e1: number) => {
  if (e1 === e0) return 0;
  const t = clamp01((v - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

// 8-player positions for the full-lineup beat
const FORMATION: Array<[number, number]> = [
  [0, -10],
  [-3.8, -6], [3.8, -6],
  [-4.8, -1.5], [0, -2], [4.8, -1.5],
  [-3.2, 5], [3.2, 5],
];
// Which slot is "the empty one" in beat 3
const EMPTY_SLOT_INDEX = 4;

// === Camera ====================================================================

function FlightCamera() {
  // Camera cuts through three cinematic beats as howProgress 0→1:
  //   0.00–0.33  AERIAL.  High and far — whole pitch tiny in frame (beat A)
  //   0.33–0.66  MIDFIELD. Dollied down, formation fills screen (beat B)
  //   0.66–1.00  SLOT.    Pushed into the empty forward slot (beat C)
  useFrame(({ camera }) => {
    const p = scrollState.howProgress;
    const persp = camera as THREE.PerspectiveCamera;

    // Cross-beat positions
    // Beat A — aerial
    const Ay = 22, Az = 0, Afov = 34;
    // Beat B — midfield overview
    const By = 11, Bz = 14, Bfov = 30;
    // Beat C — slot zoom (camera in the air just in front of the slot)
    const Cy = 2.2, Cz = 10, Cfov = 18;

    let y: number, z: number, fov: number;

    if (p < 0.33) {
      const t = clamp01(p / 0.33);
      const e = t * t * (3 - 2 * t);
      y = lerp(Ay, By, e);
      z = lerp(Az, Bz, e);
      fov = lerp(Afov, Bfov, e);
    } else if (p < 0.66) {
      const t = clamp01((p - 0.33) / 0.33);
      const e = t * t * (3 - 2 * t);
      y = lerp(By, Cy, e);
      z = lerp(Bz, Cz, e);
      fov = lerp(Bfov, Cfov, e);
    } else {
      const t = clamp01((p - 0.66) / 0.34);
      const e = t * t * (3 - 2 * t);
      // Hold close on the slot but push a little closer
      y = lerp(Cy, 1.6, e);
      z = lerp(Cz, 8.4, e);
      fov = lerp(Cfov, 16, e);
    }

    persp.position.set(0, y, z);
    persp.fov = fov;
    persp.updateProjectionMatrix();

    // Look target: aerial centres the pitch, later beats aim at the empty
    // forward slot so it becomes the focal subject.
    const [sx, sz] = FORMATION[EMPTY_SLOT_INDEX];
    const tx = lerp(0, sx, Math.max(0, (p - 0.33) / 0.67));
    const tz = lerp(0, sz, Math.max(0, (p - 0.33) / 0.67));
    persp.lookAt(tx, 0.4, tz);
  });

  return null;
}

// === Falling dots =============================================================

function FallingDot({
  pos,
  index,
  glow,
}: {
  pos: [number, number];
  index: number;
  glow?: boolean;
}) {
  // Dots rain down from above and seat themselves in formation. Each dot's
  // "land time" is staggered across beat B. After landing, the dot idles
  // with a subtle breath.
  const ref = useRef<THREE.Group>(null);

  // Distribute landings between howProgress ~0.32 and ~0.62
  const landStart = 0.32 + index * 0.035;
  const landEnd = landStart + 0.05;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const p = scrollState.howProgress;
    const landT = clamp01((p - landStart) / (landEnd - landStart));
    // Overshoot ease (back.out)
    const back = (t: number) => {
      const c = 1.70158;
      const tt = t - 1;
      return 1 + tt * tt * ((c + 1) * tt + c);
    };
    const y = lerp(18, 0.01, back(landT));

    ref.current.position.set(pos[0], y, pos[1]);

    // Idle breath once landed
    const t = clock.elapsedTime;
    const breath = landT > 0.98 ? 0.95 + Math.sin(t * 0.7 + index) * 0.05 : 1;
    ref.current.scale.set(breath, breath, breath);

    // For the glow slot, dim out to create the "empty" slot effect during beat C
    if (glow) {
      const fadeOut = band(p, 0.62, 0.72);
      ref.current.visible = fadeOut < 0.5;
    }
  });

  return (
    <group ref={ref} position={[pos[0], 18, pos[1]]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.7, 32]} />
        <meshBasicMaterial color="#F5F5F0" transparent opacity={0.1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[0.4, 0.45, 48]} />
        <meshBasicMaterial color="#F5F5F0" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <circleGeometry args={[0.36, 32]} />
        <meshBasicMaterial color="#F5F5F0" />
      </mesh>
    </group>
  );
}

// === Glowing empty slot (appears in beat C) ===================================

function GlowSlot() {
  const ringRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const fillRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const playerRef = useRef<THREE.Group>(null);
  const matInner = useRef<THREE.MeshBasicMaterial>(null);
  const matOuter = useRef<THREE.MeshBasicMaterial>(null);
  const matFill = useRef<THREE.MeshBasicMaterial>(null);
  const matPlayer = useRef<THREE.MeshBasicMaterial>(null);

  const [sx, sz] = FORMATION[EMPTY_SLOT_INDEX];

  useFrame(({ clock }) => {
    const p = scrollState.howProgress;
    const t = clock.elapsedTime;

    // Fade the lime ring IN from beat B→C
    const show = band(p, 0.58, 0.72);
    // Player silhouette appears near the end of beat C
    const playerShow = band(p, 0.86, 0.98);

    const pulse = 0.5 + 0.5 * Math.sin((t / 1.2) * Math.PI * 2);
    if (outerRef.current) {
      const s = 1 + pulse * 0.8 * show;
      outerRef.current.scale.set(s, s, s);
      if (matOuter.current) {
        matOuter.current.opacity = (0.7 - pulse * 0.6) * show;
      }
    }
    if (ringRef.current && matInner.current) {
      matInner.current.opacity = show;
      const s = 1 + pulse * 0.1 * show;
      ringRef.current.scale.set(s, s, s);
    }
    if (fillRef.current && matFill.current) {
      matFill.current.opacity = 0.3 * show;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 2.4 * show + pulse * 2 * show;
    }

    if (playerRef.current && matPlayer.current) {
      matPlayer.current.opacity = playerShow;
      const s = 0.8 + playerShow * 0.2;
      playerRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={[sx, 0.01, sz]}>
      <pointLight
        ref={lightRef}
        color="#D4FF3A"
        intensity={0}
        distance={10}
        decay={2}
        position={[0, 2, 0]}
      />
      {/* Outer pulsing ring */}
      <mesh
        ref={outerRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.001, 0]}
      >
        <ringGeometry args={[0.55, 0.7, 64]} />
        <meshBasicMaterial
          ref={matOuter}
          color="#D4FF3A"
          transparent
          opacity={0}
        />
      </mesh>
      {/* Inner solid ring outline */}
      <mesh
        ref={ringRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.002, 0]}
      >
        <ringGeometry args={[0.4, 0.47, 48]} />
        <meshBasicMaterial ref={matInner} color="#D4FF3A" transparent opacity={0} />
      </mesh>
      {/* Inner filled disc */}
      <mesh
        ref={fillRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.003, 0]}
      >
        <circleGeometry args={[0.4, 32]} />
        <meshBasicMaterial ref={matFill} color="#D4FF3A" transparent opacity={0} />
      </mesh>

      {/* Materializing player silhouette (capsule + head) */}
      <group ref={playerRef} position={[0, 0.5, 0]} scale={0.8}>
        <mesh>
          <capsuleGeometry args={[0.32, 0.7, 6, 12]} />
          <meshBasicMaterial
            ref={matPlayer}
            color="#F5F5F0"
            transparent
            opacity={0}
          />
        </mesh>
        <mesh position={[0, 0.85, 0]}>
          <sphereGeometry args={[0.22, 14, 12]} />
          <meshBasicMaterial color="#F5F5F0" transparent opacity={0} />
        </mesh>
      </group>
    </group>
  );
}

// === Community card (floats above the pitch during beat A) ===================

function CommunityOrbit() {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const p = scrollState.howProgress;
    const show = 1 - band(p, 0.15, 0.35);
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.position.y = 9 + Math.sin(t * 0.6) * 0.4;
    ref.current.rotation.y = Math.sin(t * 0.4) * 0.25;
    ref.current.visible = show > 0.02;
    (ref.current.children as THREE.Mesh[]).forEach((c) => {
      if (c.material && (c.material as THREE.Material & { opacity: number }).opacity !== undefined) {
        (c.material as THREE.Material & { opacity: number }).opacity = (c.material as THREE.Material & { opacity: number }).opacity * 0 + show;
      }
    });
  });

  // Stacked rounded rectangles to suggest "community cards"
  return (
    <group ref={ref} position={[0, 9, 0]}>
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[i * 0.5 - 0.5, 0, -i * 0.3]}
          rotation={[0, -0.2 + i * 0.15, 0]}
        >
          <planeGeometry args={[3, 1.8]} />
          <meshBasicMaterial
            color={i === 1 ? '#D4FF3A' : '#F5F5F0'}
            transparent
            opacity={i === 1 ? 0.85 : 0.55}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// === BackgroundTint ============================================================

function BackgroundTint() {
  // Drives the Canvas background + fog color through the 3 beats.
  const colorA = useMemo(() => new THREE.Color('#050505'), []);
  const colorB = useMemo(() => new THREE.Color('#041016'), []);
  const colorC = useMemo(() => new THREE.Color('#0a1208'), []);
  const out = useMemo(() => new THREE.Color(), []);

  useFrame(({ scene }) => {
    const p = scrollState.howProgress;
    if (p < 0.5) {
      out.copy(colorA).lerp(colorB, clamp01(p / 0.5));
    } else {
      out.copy(colorB).lerp(colorC, clamp01((p - 0.5) / 0.5));
    }
    if (scene.background instanceof THREE.Color) {
      scene.background.copy(out);
    } else {
      scene.background = out.clone();
    }
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.color.copy(out);
    }
  });
  return null;
}

// === Background grid ===========================================================

function BackgroundGrid() {
  const lines = useMemo(() => {
    const arr: number[] = [];
    const size = 80;
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

// === Exported scene ============================================================

export default function HowItWorksScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false }}
      camera={{ position: [0, 22, 0], fov: 34, near: 0.1, far: 200 }}
      className="!absolute inset-0"
      style={{ background: '#050505' }}
    >
      <fog attach="fog" args={['#050505', 25, 80]} />
      <BackgroundTint />

      <Suspense fallback={null}>
        <BackgroundGrid />
        <PitchWireframe opacity={0.35} />
        {FORMATION.map((p, i) => (
          <FallingDot
            key={i}
            pos={p}
            index={i}
            glow={i === EMPTY_SLOT_INDEX}
          />
        ))}
        <GlowSlot />
        <CommunityOrbit />
      </Suspense>

      <FlightCamera />
    </Canvas>
  );
}
