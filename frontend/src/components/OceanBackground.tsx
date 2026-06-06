"use client";

import { useMemo } from "react";

const AMBIENT_BUBBLE_COUNT = 36;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Animated ocean reef backdrop with gentle sway, caustics, and ambient bubbles.
 * Replace frontend/public/ocean-reef-background.jpg with your own image anytime.
 */
export default function OceanBackground() {
  const ambientBubbles = useMemo(() => {
    const rand = mulberry32(77);
    return Array.from({ length: AMBIENT_BUBBLE_COUNT }, (_, i) => ({
      id: i,
      left: rand() * 100,
      size: 2 + rand() * 6,
      duration: 8 + rand() * 14,
      delay: rand() * -20,
      drift: (rand() - 0.5) * 50,
      bottom: rand() * 35,
    }));
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-[0] overflow-hidden">
      {/* Reef image — gentle underwater sway */}
      <div className="ocean-reef-sway absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/ocean-reef-background.jpg"
          alt=""
          className="h-full w-full object-cover object-center"
          style={{ transform: "scale(1.07)" }}
          draggable={false}
        />
      </div>

      {/* Foreground reef parallax — bottom portion sways a bit more (plant illusion) */}
      <div
        className="ocean-reef-foreground-sway absolute inset-x-0 bottom-0 overflow-hidden"
        style={{
          height: "55%",
          WebkitMaskImage: "linear-gradient(to top, black 40%, transparent 100%)",
          maskImage: "linear-gradient(to top, black 40%, transparent 100%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/ocean-reef-background.jpg"
          alt=""
          className="absolute bottom-0 left-0 h-[180%] w-full object-cover object-bottom opacity-[0.35]"
          style={{ transform: "scale(1.08)" }}
          draggable={false}
        />
      </div>

      {/* Caustics — light rippling over reef */}
      <div className="ocean-caustics absolute inset-0 opacity-50" />

      {/* Water shimmer */}
      <div className="ocean-water-shimmer absolute inset-0" />

      {/* Ambient rising bubbles (always animating) */}
      {ambientBubbles.map((b) => (
        <div
          key={b.id}
          className="ocean-ambient-bubble absolute rounded-full"
          style={{
            left: `${b.left}%`,
            bottom: `${b.bottom}%`,
            width: b.size,
            height: b.size,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
            "--bubble-drift": `${b.drift}px`,
          } as React.CSSProperties}
        />
      ))}

      {/* Depth gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(255,255,255,0.05) 0%,
            transparent 22%,
            rgba(0,40,70,0.1) 60%,
            rgba(0,25,50,0.25) 100%
          )`,
        }}
      />

      {/* Surface light */}
      <div
        className="ocean-surface-light absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse 80% 40% at 50% 0%,
            rgba(255,255,255,0.18) 0%,
            transparent 65%
          )`,
        }}
      />
    </div>
  );
}
