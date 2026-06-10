"use client";

import { AppLoadingSpinner } from "@/components/ui/app-loading-spinner";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Cloud } from "lucide-react";
import {
  Component,
  type ErrorInfo,
  type ReactNode,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";

const MODEL_URL = "/hero/sbg-logo.glb";

class ModelErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("ClubHeroModel: no se pudo cargar el GLB", error, info);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function ModelLoadingFallback() {
  return (
    <div className="flex h-full min-h-[200px] items-center justify-center">
      <AppLoadingSpinner label="Cargando modelo 3D…" />
    </div>
  );
}

function ModelUnavailableFallback() {
  return (
    <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-2 text-center">
      <Cloud className="h-14 w-14 text-[#7E2CFF]/40" />
      <p className="max-w-[220px] text-xs text-zinc-400">
        Vista 3D no disponible en este dispositivo
      </p>
    </div>
  );
}

function Model({
  autoRotate,
  interactingRef,
  onReady,
}: {
  autoRotate: boolean;
  interactingRef: React.RefObject<boolean>;
  onReady?: () => void;
}) {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  const normalized = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = 7 / maxDim;
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
    if (autoRotate && !interactingRef.current) g.rotation.y += delta * 0.35;
    g.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.05;
  });

  return (
    <group ref={groupRef}>
      <primitive object={normalized} />
    </group>
  );
}

function StageRings({ compact }: { compact?: boolean }) {
  const ringsRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ringsRef.current) ringsRef.current.rotation.z += delta * 0.12;
  });
  const radii = compact ? [1.35, 1.75] : [1.55, 2.05, 2.55];
  return (
    <group
      ref={ringsRef}
      position={[0, -0.82, 0]}
      rotation={[Math.PI / 2, 0, 0]}
    >
      {radii.map((r, i) => (
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

function SceneLights({ lightMode }: { lightMode: "light" | "dark" }) {
  const isLight = lightMode === "light";
  return (
    <>
      <ambientLight intensity={isLight ? 0.85 : 0.65} />
      <hemisphereLight
        args={[
          isLight ? "#e8f4ff" : "#bcd4ff",
          isLight ? "#c4b5fd" : "#1a0b3a",
          isLight ? 1.1 : 0.8,
        ]}
      />
      <directionalLight
        position={[4, 6, 5]}
        intensity={isLight ? 2.6 : 2.1}
        color="#ffffff"
      />
      <pointLight
        position={[-5, 2, 3]}
        intensity={isLight ? 45 : 60}
        color="#00C8FF"
      />
      <pointLight
        position={[5, -1, 4]}
        intensity={isLight ? 40 : 55}
        color="#7E2CFF"
      />
      <pointLight
        position={[0, 4, -4]}
        intensity={isLight ? 30 : 40}
        color="#A855F7"
      />
    </>
  );
}

function CanvasBackground() {
  const { scene } = useThree();
  useEffect(() => {
    scene.background = null;
  }, [scene]);
  return null;
}

export type ClubHeroModelProps = {
  autoRotate?: boolean;
  lightMode?: "light" | "dark";
  variant?: "hero" | "ambient";
  onInteractingChange?: (interacting: boolean) => void;
};

export function ClubHeroModel({
  autoRotate = true,
  lightMode = "dark",
  variant = "hero",
  onInteractingChange,
}: ClubHeroModelProps) {
  const interactingRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const isAmbient = variant === "ambient";

  useEffect(() => {
    useGLTF.preload(MODEL_URL);
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const setInteracting = (value: boolean) => {
    interactingRef.current = value;
    onInteractingChange?.(value);
  };

  const handleModelReady = useCallback(() => setModelReady(true), []);

  return (
    <ModelErrorBoundary fallback={<ModelUnavailableFallback />}>
      <div className="relative h-full w-full">
        {!modelReady ? (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <ModelLoadingFallback />
          </div>
        ) : null}
        <Canvas
          camera={{
            position: isAmbient
              ? [0, 0.02, isMobile ? 10.5 : 9.4]
              : [0, 0.02, isMobile ? 9.2 : 8.1],
            fov: isAmbient ? (isMobile ? 34 : 30) : isMobile ? 36 : 32,
          }}
          dpr={isMobile ? 1 : isAmbient ? [1, 1.5] : [1, 1.75]}
          gl={{
            antialias: !isMobile,
            alpha: true,
            powerPreference: isMobile ? "default" : "high-performance",
          }}
          style={{ width: "100%", height: "100%", touchAction: "none" }}
        >
          <CanvasBackground />
          <SceneLights lightMode={lightMode} />

          <Suspense fallback={null}>
            <Model
              autoRotate={autoRotate}
              interactingRef={interactingRef}
              onReady={handleModelReady}
            />
          </Suspense>
          <StageRings compact={isMobile || isAmbient} />

          <OrbitControls
            makeDefault
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            minPolarAngle={Math.PI / 3.2}
            maxPolarAngle={Math.PI / 1.75}
            rotateSpeed={0.85}
            onStart={() => setInteracting(true)}
            onEnd={() => setInteracting(false)}
          />
        </Canvas>
      </div>
    </ModelErrorBoundary>
  );
}
