import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { generateDustField } from "../../webgl/dustField";

export default function DustField({ count = 220, seed = 7 }) {
  const meshRef = useRef(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(
    () => generateDustField(count, seed),
    [count, seed]
  );
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
      dummy.scale.setScalar(p.size);
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
      <circleGeometry args={[1, 8]} />
      <meshBasicMaterial
        color="#f0d78c"
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
