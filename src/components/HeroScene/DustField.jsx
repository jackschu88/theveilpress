import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { generateDustField } from "../../webgl/dustField";
import { getDustTexture } from "../../webgl/textures";

// Scales generateDustField's world-unit sizes down for rendering. Keeping
// this separate from the generator (rather than changing its output) means
// dustField.test.js's exact-value assertions stay valid — this is a
// render-only adjustment, not a data change.
const RENDER_SCALE = 0.4;

export default function DustField({ count = 220, seed = 7 }) {
  const meshRef = useRef(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(
    () => generateDustField(count, seed),
    [count, seed]
  );
  const texture = useMemo(() => getDustTexture(), []);
  const { pointer } = useThree();

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < particles.length; i += 1) {
      const p = particles[i];
      const drift = Math.sin(t * p.speed + i) * 0.15;
      dummy.position.set(
        p.x + pointer.x * p.parallax * 0.6,
        p.y + drift + pointer.y * p.parallax * 0.4,
        p.z
      );
      dummy.scale.setScalar(p.size * RENDER_SCALE);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, particles.length]}
    >
      <circleGeometry args={[1, 16]} />
      <meshBasicMaterial
        map={texture}
        color="#f6e2ab"
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
