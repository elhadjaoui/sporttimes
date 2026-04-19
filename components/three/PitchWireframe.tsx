'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

// Shared wireframe football pitch — outer rect, halfway line, both penalty
// boxes, 6-yard boxes, penalty arcs, center circle + spot, penalty spots,
// and goals. Used by Hero, Problem, and any other section that needs the
// persistent pitch anchor.

export default function PitchWireframe({
  opacity = 0.32,
}: {
  opacity?: number;
}) {
  const W = 8;
  const D = 12;

  const lines = useMemo(() => {
    const arr: number[] = [];
    const y = 0.012;
    // Outer
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
        <lineBasicMaterial color="#F5F5F0" transparent opacity={opacity} />
      </lineSegments>

      {/* Center circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.013, 0]}>
        <ringGeometry args={[2.6, 2.66, 96]} />
        <meshBasicMaterial color="#F5F5F0" transparent opacity={opacity} />
      </mesh>

      {/* Center spot */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.014, 0]}>
        <circleGeometry args={[0.1, 16]} />
        <meshBasicMaterial color="#F5F5F0" opacity={opacity * 1.5} transparent />
      </mesh>

      {/* Penalty arcs — half-circles attached to the penalty box edge */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.013, -8.5]}>
        <ringGeometry args={[1.45, 1.5, 48, 1, Math.PI, Math.PI]} />
        <meshBasicMaterial color="#F5F5F0" transparent opacity={opacity} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.013, 8.5]}>
        <ringGeometry args={[1.45, 1.5, 48, 1, 0, Math.PI]} />
        <meshBasicMaterial color="#F5F5F0" transparent opacity={opacity} side={THREE.DoubleSide} />
      </mesh>

      {/* Penalty spots */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.014, -8.8]}>
        <circleGeometry args={[0.1, 12]} />
        <meshBasicMaterial color="#F5F5F0" opacity={opacity * 1.5} transparent />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.014, 8.8]}>
        <circleGeometry args={[0.1, 12]} />
        <meshBasicMaterial color="#F5F5F0" opacity={opacity * 1.5} transparent />
      </mesh>

      {/* Goals */}
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
        <lineBasicMaterial color="#F5F5F0" transparent opacity={opacity * 1.25} />
      </lineSegments>
    </group>
  );
}
