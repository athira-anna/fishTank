"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import {
  getReleaseLanding,
  RELEASE_ANIM_DURATION,
  RELEASE_FISH_H,
  RELEASE_FISH_W,
  RELEASE_LAND_AT,
} from "@/lib/releaseLanding";
import { playReleaseBlip } from "@/lib/releaseBlip";

interface ReleaseAnimationProps {
  previewUrl: string;
  fishName: string;
  tankWidth: number;
  tankHeight: number;
  onLand: () => void;
  onComplete: () => void;
}

export default function ReleaseAnimation({
  previewUrl,
  fishName,
  tankWidth,
  tankHeight,
  onLand,
  onComplete,
}: ReleaseAnimationProps) {
  const landedRef = useRef(false);
  const landing = getReleaseLanding(tankWidth, tankHeight);
  const startX = tankWidth / 2 - RELEASE_FISH_W / 2;
  const startY = tankHeight * 0.12;
  const peakY = startY - 70;
  const targetX = landing.centerX - RELEASE_FISH_W / 2;
  const targetY = landing.centerY - RELEASE_FISH_H / 2;

  useEffect(() => {
    landedRef.current = false;
    const landMs = RELEASE_ANIM_DURATION * RELEASE_LAND_AT * 1000;
    const landTimer = setTimeout(() => {
      if (!landedRef.current) {
        landedRef.current = true;
        playReleaseBlip();
        onLand();
      }
    }, landMs);

    return () => clearTimeout(landTimer);
  }, [onLand]);

  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
      {/* Backflip → dive → gentle float fade-out */}
      <motion.div
        initial={{ x: startX, y: startY, rotate: 0, scale: 1.15, opacity: 1 }}
        animate={{
          x: [startX, startX, startX - 10, targetX, targetX, targetX],
          y: [startY, peakY, peakY - 20, targetY, targetY + 5, targetY - 2],
          rotate: [0, -180, -360, -8, 0, 0],
          scale: [1.15, 1.25, 1.2, 1, 1, 1],
          opacity: [1, 1, 1, 1, 0.85, 0],
        }}
        transition={{
          duration: RELEASE_ANIM_DURATION,
          times: [0, 0.22, 0.32, 0.73, 0.88, 1],
          ease: ["easeOut", "easeInOut", "easeIn", "easeOut", "easeInOut", "easeOut"],
        }}
        onAnimationComplete={onComplete}
        className="absolute origin-center"
        style={{ width: RELEASE_FISH_W, height: RELEASE_FISH_H }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl}
          alt={fishName}
          className="h-full w-full object-contain drop-shadow-xl"
          draggable={false}
        />
      </motion.div>

      {/* Splash on entry */}
      <motion.div
        initial={{ opacity: 0, scale: 0.2 }}
        animate={{ opacity: [0, 0, 1, 0], scale: [0.2, 0.2, 1.8, 2.4] }}
        transition={{ delay: 1.05, duration: 0.55 }}
        className="absolute rounded-full border-2 border-white/50 bg-white/10"
        style={{
          left: targetX + RELEASE_FISH_W / 2 - 36,
          top: targetY + RELEASE_FISH_H / 2 - 12,
          width: 72,
          height: 28,
        }}
      />

      {/* Droplets */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 0, x: 0 }}
          animate={{
            opacity: [0, 0, 1, 0],
            y: [0, 0, -18 - i * 10, -30 - i * 12],
            x: [(i - 2) * 8, (i - 2) * 8, (i - 2) * 14, (i - 2) * 18],
          }}
          transition={{ delay: 1.05 + i * 0.04, duration: 0.5 }}
          className="absolute h-2 w-2 rounded-full bg-white/70"
          style={{
            left: targetX + RELEASE_FISH_W / 2 + (i - 2) * 10,
            top: targetY + RELEASE_FISH_H / 2,
          }}
        />
      ))}

    </div>
  );
}
