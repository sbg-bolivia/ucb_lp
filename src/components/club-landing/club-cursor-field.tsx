"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Campo de partículas enlazadas que reacciona al cursor (three.js / WebGL).
 * Inspirado en el experimento "VFX Linked Particles" de three.js, implementado
 * en WebGL clásico para máxima compatibilidad.
 *
 * Se renderiza como una capa a pantalla completa relativa a su contenedor
 * (`fixed inset-0`). El cursor deja un rastro sutil de puntos enlazados.
 *
 * Rendimiento:
 *  - Compactación de partículas "en sitio" (sin asignar arrays por frame).
 *  - Pausa el bucle de animación en reposo (sin movimiento ni partículas
 *    vivas) y lo reanuda al mover el cursor.
 *  - pixelRatio limitado y `low-power`.
 */
const MAX_PARTICLES = 240;
const LINK_DISTANCE = 130; // px
const LINK_DISTANCE_SQ = LINK_DISTANCE * LINK_DISTANCE;
const MAX_LINKS = MAX_PARTICLES * 2;
const LIFETIME = 1.8; // s
const FRICTION = 0.93;

const COLOR_A = new THREE.Color("#00C8FF");
const COLOR_B = new THREE.Color("#7E2CFF");
const COLOR_C = new THREE.Color("#A855F7");

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 1 -> 0
  color: THREE.Color;
};

function makeSpriteTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.25, "rgba(255,255,255,0.8)");
    g.addColorStop(0.5, "rgba(255,255,255,0.22)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export function ClubCursorField({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = Math.max(1, container.clientWidth);
    let height = Math.max(1, container.clientHeight);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(width, height);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    // Cámara ortográfica en píxeles del contenedor (y hacia abajo, como el DOM).
    const camera = new THREE.OrthographicCamera(
      0,
      width,
      0,
      height,
      -1000,
      1000
    );
    camera.position.z = 10;

    // --- Partículas (puntos) ---
    const positions = new Float32Array(MAX_PARTICLES * 3);
    const colors = new Float32Array(MAX_PARTICLES * 3);
    const pointsGeom = new THREE.BufferGeometry();
    pointsGeom.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    pointsGeom.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const sprite = makeSpriteTexture();
    const pointsMat = new THREE.PointsMaterial({
      size: 13,
      map: sprite,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: false,
    });
    const points = new THREE.Points(pointsGeom, pointsMat);
    points.frustumCulled = false;
    scene.add(points);

    // --- Enlaces (segmentos de línea) ---
    const linkPositions = new Float32Array(MAX_LINKS * 2 * 3);
    const linkColors = new Float32Array(MAX_LINKS * 2 * 3);
    const linksGeom = new THREE.BufferGeometry();
    linksGeom.setAttribute(
      "position",
      new THREE.BufferAttribute(linkPositions, 3)
    );
    linksGeom.setAttribute("color", new THREE.BufferAttribute(linkColors, 3));
    const linksMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
    const links = new THREE.LineSegments(linksGeom, linksMat);
    links.frustumCulled = false;
    scene.add(links);

    const particles: Particle[] = [];
    let colorTick = 0;

    const pointer = {
      x: width / 2,
      y: height / 2,
      prevX: width / 2,
      prevY: height / 2,
    };
    let hasMoved = false;
    let lastSpawn = 0;

    const spawn = (x: number, y: number, count: number) => {
      for (let i = 0; i < count; i++) {
        if (particles.length >= MAX_PARTICLES) particles.shift();
        const t = count > 1 ? i / (count - 1) : 1;
        const px = pointer.prevX + (x - pointer.prevX) * t;
        const py = pointer.prevY + (y - pointer.prevY) * t;
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 7;
        colorTick += 0.07;
        const mix = (Math.sin(colorTick) + 1) / 2;
        const color = COLOR_A.clone()
          .lerp(COLOR_B, mix)
          .lerp(COLOR_C, Math.random() * 0.4);
        particles.push({
          x: px,
          y: py,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          color,
        });
      }
    };

    const clock = new THREE.Clock();
    let raf = 0;
    let idle = true;

    const kick = () => {
      if (idle) {
        idle = false;
        clock.getDelta(); // descarta el delta acumulado durante el reposo
        raf = requestAnimationFrame(animate);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.prevX = pointer.x;
      pointer.prevY = pointer.y;
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      hasMoved = true;
      kick();
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const applySize = () => {
      width = Math.max(1, container.clientWidth);
      height = Math.max(1, container.clientHeight);
      camera.right = width;
      camera.bottom = height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
    };
    const resizeObserver = new ResizeObserver(applySize);
    resizeObserver.observe(container);

    function animate() {
      const dt = Math.min(clock.getDelta(), 0.05);

      const now = performance.now();
      const dist = Math.hypot(
        pointer.x - pointer.prevX,
        pointer.y - pointer.prevY
      );
      if (hasMoved && now - lastSpawn > 16) {
        const count = Math.min(7, 2 + Math.floor(dist / 14));
        spawn(pointer.x, pointer.y, count);
        pointer.prevX = pointer.x;
        pointer.prevY = pointer.y;
        lastSpawn = now;
        hasMoved = false;
      }

      // Actualiza y compacta las partículas vivas en sitio (sin allocations).
      let n = 0;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!p) continue;
        p.life -= dt / LIFETIME;
        if (p.life <= 0) continue;
        p.vx *= FRICTION;
        p.vy *= FRICTION;
        p.x += p.vx;
        p.y += p.vy;

        const idx = n * 3;
        positions[idx] = p.x;
        positions[idx + 1] = p.y;
        positions[idx + 2] = 0;

        // El brillo (color) actúa como alfa con blending aditivo.
        const fade = p.life ** 0.9 * 0.8;
        colors[idx] = p.color.r * fade;
        colors[idx + 1] = p.color.g * fade;
        colors[idx + 2] = p.color.b * fade;

        particles[n++] = p;
      }
      particles.length = n;

      pointsGeom.setDrawRange(0, n);
      (pointsGeom.attributes.position as THREE.BufferAttribute).needsUpdate =
        true;
      (pointsGeom.attributes.color as THREE.BufferAttribute).needsUpdate = true;

      // Enlaces entre partículas cercanas
      let li = 0;
      for (let a = 0; a < n && li < MAX_LINKS; a++) {
        const pa = particles[a];
        if (!pa) continue;
        let made = 0;
        for (let b = a + 1; b < n && li < MAX_LINKS; b++) {
          if (made >= 2) break;
          const pb = particles[b];
          if (!pb) continue;
          const dx = pa.x - pb.x;
          const dy = pa.y - pb.y;
          const dSq = dx * dx + dy * dy;
          if (dSq > LINK_DISTANCE_SQ) continue;
          const strength =
            (1 - dSq / LINK_DISTANCE_SQ) * Math.min(pa.life, pb.life) * 0.5;
          const o = li * 6;
          linkPositions[o] = pa.x;
          linkPositions[o + 1] = pa.y;
          linkPositions[o + 2] = 0;
          linkPositions[o + 3] = pb.x;
          linkPositions[o + 4] = pb.y;
          linkPositions[o + 5] = 0;
          linkColors[o] = pa.color.r * strength;
          linkColors[o + 1] = pa.color.g * strength;
          linkColors[o + 2] = pa.color.b * strength;
          linkColors[o + 3] = pb.color.r * strength;
          linkColors[o + 4] = pb.color.g * strength;
          linkColors[o + 5] = pb.color.b * strength;
          li++;
          made++;
        }
      }
      linksGeom.setDrawRange(0, li * 2);
      (linksGeom.attributes.position as THREE.BufferAttribute).needsUpdate =
        true;
      (linksGeom.attributes.color as THREE.BufferAttribute).needsUpdate = true;

      renderer.render(scene, camera);

      // Si no queda nada vivo ni hay movimiento, entra en reposo (ahorra GPU).
      if (n === 0 && !hasMoved) {
        idle = true;
        return; // no se reprograma rAF; `kick()` lo reanuda al mover el cursor
      }
      raf = requestAnimationFrame(animate);
    }

    const onVisibility = () => {
      if (document.visibilityState === "visible") kick();
      else if (raf) {
        cancelAnimationFrame(raf);
        idle = true;
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Render inicial (limpio) + arranque del bucle.
    kick();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      idle = true;
      window.removeEventListener("pointermove", onPointerMove);
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      sprite.dispose();
      pointsGeom.dispose();
      pointsMat.dispose();
      linksGeom.dispose();
      linksMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className={className} aria-hidden />;
}
