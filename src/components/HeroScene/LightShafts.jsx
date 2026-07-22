import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getShaftTexture } from "../../webgl/textures";

const SHAFTS = [
  { x: -2.2, rot: 0.35, scale: 1.1, speed: 0.05 },
  { x: 0.4, rot: -0.15, scale: 1.4, speed: 0.035 },
  { x: 2.6, rot: 0.5, scale: 0.9, speed: 0.06 },
];

export default function LightShafts({ intensity = 1 }) {
  const group = useRef(null);
  const texture = useMemo(() => getShaftTexture(), []);

  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: texture,
        color: "#e8c988",
        transparent: true,
        opacity: 0.16 * intensity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [intensity, texture]
  );

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.children.forEach((mesh, i) => {
      mesh.rotation.z = SHAFTS[i].rot + Math.sin(t * SHAFTS[i].speed) * 0.05;
    });
  });

  return (
    <group ref={group} position={[0, 1, -4]}>
      {SHAFTS.map((s, i) => (
        <mesh
          key={i}
          position={[s.x, 0, 0]}
          rotation={[0, 0, s.rot]}
          scale={s.scale}
          material={material}
        >
          <planeGeometry args={[0.9, 9]} />
        </mesh>
      ))}
    </group>
  );
}
