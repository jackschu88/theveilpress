import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getShaftTexture } from "../../webgl/textures";

// Very wide, low-opacity washes. Discrete narrow planes stack into a
// phone-shaped column of hard vertical "lines" behind the hero — the bug
// the user screenshot called out. Prefer a soft atmospheric wash.
const SHAFTS = [
  { x: -2.8, rot: 0.22, scaleX: 4.2, scaleY: 12, speed: 0.01, opacity: 0.45 },
  { x: 0.2, rot: -0.08, scaleX: 5.0, scaleY: 13, speed: 0.008, opacity: 0.55 },
  { x: 3.0, rot: 0.16, scaleX: 4.0, scaleY: 11.5, speed: 0.011, opacity: 0.4 },
];

export default function LightShafts({ intensity = 1 }) {
  const group = useRef(null);
  const texture = useMemo(() => getShaftTexture(), []);

  const materials = useMemo(
    () =>
      SHAFTS.map(
        (s) =>
          new THREE.MeshBasicMaterial({
            map: texture,
            color: new THREE.Color("#e8c988"),
            transparent: true,
            opacity: 0.09 * intensity * s.opacity,
            depthWrite: false,
            depthTest: false,
            blending: THREE.AdditiveBlending,
            toneMapped: false,
            side: THREE.DoubleSide,
          })
      ),
    [intensity, texture]
  );

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.children.forEach((mesh, i) => {
      // Tiny drift only — larger oscillation made shaft edges "crawl" and
      // read as animated hard lines.
      mesh.rotation.z = SHAFTS[i].rot + Math.sin(t * SHAFTS[i].speed) * 0.008;
    });
  });

  return (
    <group ref={group} position={[0, 0.4, -5]}>
      {SHAFTS.map((s, i) => (
        <mesh
          key={i}
          position={[s.x, 0, i * -0.15]}
          rotation={[0, 0, s.rot]}
          scale={[s.scaleX, s.scaleY, 1]}
          material={materials[i]}
        >
          {/* Unit plane; scale handles size so UVs stay 0–1 with soft border */}
          <planeGeometry args={[1, 1, 1, 1]} />
        </mesh>
      ))}
    </group>
  );
}
