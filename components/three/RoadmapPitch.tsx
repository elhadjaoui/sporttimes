'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import PitchWireframe from './PitchWireframe';

/**
 * RoadmapPitch — the Hero's 3D pitch reused as a backdrop for the roadmap.
 * Sized + framed so the pitch occupies ~80% of the board width with the
 * inclined-tactics-board look.
 */
export default function RoadmapPitch() {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 22, 50], fov: 58, near: 0.1, far: 200 }}
      className="!absolute inset-0"
      style={{
        background: 'transparent',
        pointerEvents: 'none',
        opacity: 0.85,
      }}
    >
      <fog attach="fog" args={['#050505', 40, 140]} />
      <Suspense fallback={null}>
        <group rotation={[Math.PI / 11, 0, 0]}>
          <group rotation={[0, Math.PI / 2, 0]}>
            <group scale={[3.3, 3.3, 3.3]}>
              <PitchWireframe />
            </group>
          </group>
        </group>
      </Suspense>
    </Canvas>
  );
}
