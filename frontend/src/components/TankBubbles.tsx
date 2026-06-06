"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getBubbleSources } from "@/lib/tankScenery";

interface Bubble {
  id: number;
  left: number;
  bottom: number;
  size: number;
  duration: number;
  wobble: number;
  delay: number;
}

interface TankBubblesProps {
  tankWidth: number;
  tankHeight: number;
}

const LOOPING_BUBBLE_COUNT = 24;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function TankBubbles({ tankWidth, tankHeight }: TankBubblesProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const idRef = useRef(0);
  const sourcesRef = useRef<{ x: number; y: number; kind: "gravel" | "cave" }[]>([]);

  const loopingBubbles = useMemo(() => {
    const rand = mulberry32(31);
    return Array.from({ length: LOOPING_BUBBLE_COUNT }, (_, i) => ({
      id: i,
      left: rand() * 100,
      size: 3 + rand() * 8,
      duration: 6 + rand() * 10,
      delay: rand() * -18,
      wobble: (rand() - 0.5) * 45,
      bottom: rand() * 25,
    }));
  }, []);

  useEffect(() => {
    sourcesRef.current = getBubbleSources(tankWidth, tankHeight);
  }, [tankWidth, tankHeight]);

  useEffect(() => {
    function addBubble(source: { x: number; y: number; kind: "gravel" | "cave" }, jitter = 0) {
      const id = ++idRef.current;
      const isCave = source.kind === "cave";
      const b: Bubble = {
        id,
        left: source.x + rand(-22, 22) + jitter,
        bottom: tankHeight - source.y + rand(-8, 6),
        size: isCave ? rand(2, 6) : rand(4, 11),
        duration: rand(4, 9),
        wobble: rand(-35, 35),
        delay: rand(0, 0.2),
      };
      setBubbles((prev) => [...prev.slice(-35), b]);
      setTimeout(
        () => setBubbles((prev) => prev.filter((x) => x.id !== id)),
        (b.duration + b.delay) * 1000 + 400
      );
    }

    function spawnSingle() {
      const sources = sourcesRef.current;
      if (!sources.length) return;
      addBubble(sources[Math.floor(Math.random() * sources.length)]);
    }

    function spawnBurst() {
      const sources = sourcesRef.current;
      if (!sources.length) return;
      const source = sources[Math.floor(Math.random() * sources.length)];
      const count = Math.floor(rand(4, 9));
      for (let i = 0; i < count; i++) {
        setTimeout(() => addBubble(source, i * 8), i * 75);
      }
    }

    const first = setTimeout(spawnSingle, 400);
    const tick = setInterval(() => {
      const roll = Math.random();
      if (roll < 0.18) spawnBurst();
      else if (roll < 0.62) spawnSingle();
    }, 1600 + Math.random() * 2000);

    return () => {
      clearTimeout(first);
      clearInterval(tick);
    };
  }, [tankHeight, tankWidth]);

  return (
    <>
      {/* Continuous looping bubbles over the reef */}
      {loopingBubbles.map((b) => (
        <div
          key={`loop-${b.id}`}
          className="tank-bubble-loop pointer-events-none absolute z-[11] rounded-full"
          style={{
            left: `${b.left}%`,
            bottom: `${b.bottom}%`,
            width: b.size,
            height: b.size,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
            "--wobble": `${b.wobble}px`,
            "--rise": `${tankHeight}px`,
          } as React.CSSProperties}
        />
      ))}

      {/* Dynamic spawned bubbles */}
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="tank-bubble pointer-events-none absolute z-[12] rounded-full"
          style={{
            left: b.left,
            bottom: b.bottom,
            width: b.size,
            height: b.size,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
            "--wobble": `${b.wobble}px`,
            "--rise": `${tankHeight * 0.95}px`,
          } as React.CSSProperties}
        />
      ))}
    </>
  );
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}
