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
      <Cloud className="h-14 w-14 text-[var(--aws-orange)]/40" />
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
    const scale = 6.5 / maxDim;
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
  const radii = compact ? [1.2, 1.55] : [1.4, 1.85, 2.25];
  return (
    <group
      ref={ringsRef}
      position={[0, -0.72, 0]}
      rotation={[Math.PI / 2, 0, 0]}
    >
      {radii.map((r, i) => (
        <mesh key={r}>
          <torusGeometry args={[r, 0.01, 12, compact ? 48 : 64]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#FF9900" : "#64748B"}
            transparent
            opacity={0.45 - i * 0.1}
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
          isLight ? "#e8f4ff" : "#94a3b8",
          isLight ? "#cbd5e1" : "#0f172a",
          isLight ? 1.1 : 0.75,
        ]}
      />
      <directionalLight
        position={[4, 6, 5]}
        intensity={isLight ? 2.6 : 2.1}
        color="#ffffff"
      />
      <pointLight
        position={[-5, 2, 3]}
        intensity={isLight ? 35 : 45}
        color="#FF9900"
      />
      <pointLight
        position={[5, -1, 4]}
        intensity={isLight ? 30 : 40}
        color="#94A3B8"
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

let preloadStarted = false;

/** Precarga diferida del GLB (~11 MB) — llamar solo cuando el hero entra en viewport. */
export function preloadHeroModel() {
  if (preloadStarted || typeof window === "undefined") return;
  preloadStarted = true;
  useGLTF.preload(MODEL_URL);
}

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
              ? [0, 0.05, isMobile ? 11.2 : 10.2]
              : [0, 0.05, isMobile ? 9.8 : 8.6],
            fov: isAmbient ? (isMobile ? 32 : 28) : isMobile ? 34 : 30,
          }}
          dpr={isMobile ? 1 : [1, 1.15]}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: "low-power",
          }}
          performance={{ min: 0.5, max: 1 }}
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
