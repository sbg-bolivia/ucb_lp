"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Ráfagas breves de partículas solo al mover el cursor (no permanente).
 * Pensado para el hero: no opaca el resto de la página.
 */
const MAX_PARTICLES = 100;
const LINK_DISTANCE = 100;
const LINK_DISTANCE_SQ = LINK_DISTANCE * LINK_DISTANCE;
const MAX_LINKS = MAX_PARTICLES * 2;
const LIFETIME = 1.1;
const FRICTION = 0.9;
const BURST_MS = 700;
const FADE_MS = 900;
const MIN_MOVE_PX = 6;

const COLOR_A = new THREE.Color("#FF9900");
const COLOR_B = new THREE.Color("#64748B");
const COLOR_C = new THREE.Color("#232F3E");

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
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
    g.addColorStop(0.35, "rgba(255,255,255,0.5)");
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

    const mobile = window.matchMedia("(max-width: 767px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mobile.matches || reduced.matches) return;

    let width = Math.max(1, container.clientWidth);
    let height = Math.max(1, container.clientHeight);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.setSize(width, height);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.opacity = "0";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      0,
      width,
      0,
      height,
      -1000,
      1000
    );
    camera.position.z = 10;

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
      size: 10,
      map: sprite,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: false,
    });
    const points = new THREE.Points(pointsGeom, pointsMat);
    scene.add(points);

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
    scene.add(links);

    const particles: Particle[] = [];
    let colorTick = 0;

    const pointer = {
      x: width / 2,
      y: height / 2,
      prevX: width / 2,
      prevY: height / 2,
    };
    let lastSpawn = 0;
    let lastMoveAt = 0;
    let globalFade = 0;

    const isDarkMode = () =>
      document.documentElement.classList.contains("dark");

    const burstStrength = () => {
      const elapsed = performance.now() - lastMoveAt;
      if (elapsed > BURST_MS + FADE_MS) return 0;
      if (elapsed <= BURST_MS) return 1;
      return 1 - (elapsed - BURST_MS) / FADE_MS;
    };

    const spawn = (x: number, y: number, count: number) => {
      for (let i = 0; i < count; i++) {
        if (particles.length >= MAX_PARTICLES) particles.shift();
        const t = count > 1 ? i / (count - 1) : 1;
        const px = pointer.prevX + (x - pointer.prevX) * t;
        const py = pointer.prevY + (y - pointer.prevY) * t;
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 5;
        colorTick += 0.07;
        const mix = (Math.sin(colorTick) + 1) / 2;
        const color = COLOR_A.clone()
          .lerp(COLOR_B, mix)
          .lerp(COLOR_C, Math.random() * 0.35);
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
        clock.getDelta();
        raf = requestAnimationFrame(animate);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = e.clientX - rect.left;
      const ny = e.clientY - rect.top;
      const dist = Math.hypot(nx - pointer.x, ny - pointer.y);
      pointer.prevX = pointer.x;
      pointer.prevY = pointer.y;
      pointer.x = nx;
      pointer.y = ny;
      if (dist >= MIN_MOVE_PX) {
        lastMoveAt = performance.now();
        kick();
      }
    };

    container.addEventListener("pointermove", onPointerMove, {
      passive: true,
    });

    const applySize = () => {
      width = Math.max(1, container.clientWidth);
      height = Math.max(1, container.clientHeight);
      camera.right = width;
      camera.bottom = height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    const resizeObserver = new ResizeObserver(applySize);
    resizeObserver.observe(container);

    function animate() {
      const dt = Math.min(clock.getDelta(), 0.05);
      const now = performance.now();
      const strength = burstStrength();
      globalFade = strength;

      const dist = Math.hypot(
        pointer.x - pointer.prevX,
        pointer.y - pointer.prevY
      );
      if (strength > 0.05 && dist >= MIN_MOVE_PX && now - lastSpawn > 40) {
        const count = Math.min(3, 1 + Math.floor(dist / 28));
        spawn(pointer.x, pointer.y, count);
        pointer.prevX = pointer.x;
        pointer.prevY = pointer.y;
        lastSpawn = now;
      }

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

        const fade = p.life ** 0.85 * 0.5 * globalFade;
        const boost = isDarkMode() ? 0.9 : 1.1;
        colors[idx] = p.color.r * fade * boost;
        colors[idx + 1] = p.color.g * fade * boost;
        colors[idx + 2] = p.color.b * fade * boost;

        particles[n++] = p;
      }
      particles.length = n;

      pointsGeom.setDrawRange(0, n);
      (pointsGeom.attributes.position as THREE.BufferAttribute).needsUpdate =
        true;
      (pointsGeom.attributes.color as THREE.BufferAttribute).needsUpdate = true;

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
          const linkFade =
            (1 - dSq / LINK_DISTANCE_SQ) *
            Math.min(pa.life, pb.life) *
            0.28 *
            globalFade;
          const o = li * 6;
          linkPositions[o] = pa.x;
          linkPositions[o + 1] = pa.y;
          linkPositions[o + 2] = 0;
          linkPositions[o + 3] = pb.x;
          linkPositions[o + 4] = pb.y;
          linkPositions[o + 5] = 0;
          linkColors[o] = pa.color.r * linkFade;
          linkColors[o + 1] = pa.color.g * linkFade;
          linkColors[o + 2] = pa.color.b * linkFade;
          linkColors[o + 3] = pb.color.r * linkFade;
          linkColors[o + 4] = pb.color.g * linkFade;
          linkColors[o + 5] = pb.color.b * linkFade;
          li++;
          made++;
        }
      }
      linksGeom.setDrawRange(0, li * 2);
      (linksGeom.attributes.position as THREE.BufferAttribute).needsUpdate =
        true;
      (linksGeom.attributes.color as THREE.BufferAttribute).needsUpdate = true;

      const layerOpacity =
        globalFade * (isDarkMode() ? 0.38 : 0.28) * (n > 0 ? 1 : 0);
      renderer.domElement.style.opacity = String(layerOpacity);

      renderer.render(scene, camera);

      if (n === 0 && strength <= 0.01) {
        idle = true;
        renderer.domElement.style.opacity = "0";
        return;
      }
      raf = requestAnimationFrame(animate);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      container.removeEventListener("pointermove", onPointerMove);
      resizeObserver.disconnect();
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
