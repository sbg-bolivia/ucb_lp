"use client";

import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

const MODEL_URL = "/hero/sbg-logo.glb";

useGLTF.preload(MODEL_URL);

function Model({ autoRotate }: { autoRotate: boolean }) {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef = useRef<THREE.Group>(null);

  // Clona, centra y escala el modelo a un tamaño consistente.
  const normalized = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    // Escala nativa inmensa desde el motor 3D para que ocupe todo el espacio sin romper el DOM
    const scale = 7.5 / maxDim;
    clone.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    clone.scale.setScalar(scale);
    clone.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat && "metalness" in mat) {
          mat.envMapIntensity = 1.1;
        }
      }
    });
    return clone;
  }, [scene]);

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;
    if (autoRotate) g.rotation.y += delta * 0.5;
    // Flotación sutil
    g.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.12;
  });

  return (
    <group ref={groupRef}>
      <primitive object={normalized} />
    </group>
  );
}

function StageRings() {
  const ringsRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ringsRef.current) ringsRef.current.rotation.z += delta * 0.15;
  });
  return (
    <group
      ref={ringsRef}
      position={[0, -2.5, 0]}
      rotation={[Math.PI / 2, 0, 0]}
    >
      {[2.1, 2.9, 3.7].map((r, i) => (
        <mesh key={r}>
          <torusGeometry args={[r, 0.012, 16, 96]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#00C8FF" : "#7E2CFF"}
            transparent
            opacity={0.5 - i * 0.12}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

export function ClubHeroModel({ autoRotate = true }: { autoRotate?: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0.2, 7], fov: 40 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.65} />
      <hemisphereLight args={["#bcd4ff", "#1a0b3a", 0.8]} />
      <directionalLight position={[4, 6, 5]} intensity={2.1} color="#ffffff" />
      <pointLight position={[-5, 2, 3]} intensity={60} color="#00C8FF" />
      <pointLight position={[5, -1, 4]} intensity={55} color="#7E2CFF" />
      <pointLight position={[0, 4, -4]} intensity={40} color="#A855F7" />

      <Suspense fallback={null}>
        <Model autoRotate={autoRotate} />
      </Suspense>
      <StageRings />

      <OrbitControls
        makeDefault
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        minPolarAngle={Math.PI / 2.8}
        maxPolarAngle={Math.PI / 1.9}
        rotateSpeed={0.7}
      />
    </Canvas>
  );
}
