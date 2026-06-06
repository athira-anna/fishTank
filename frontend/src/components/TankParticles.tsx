"use client";

import { useMemo } from "react";

const PARTICLE_COUNT = 320;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function TankParticles() {
  const particles = useMemo(() => {
    const rand = mulberry32(42);
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      x: rand() * 100,
      y: rand() * 100,
      size: 1 + rand() * 2.5,
      speed: 12 + rand() * 28,
      delay: rand() * -20,
      drift: (rand() - 0.5) * 30,
      opacity: 0.08 + rand() * 0.18,
    }));
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-[8] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="tank-particle absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            background: "rgba(255,255,255,0.2)",
            animationDuration: `${p.speed}s`,
            animationDelay: `${p.delay}s`,
            "--drift": `${p.drift}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
