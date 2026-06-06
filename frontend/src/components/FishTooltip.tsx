"use client";

import { motion } from "framer-motion";
import { formatAge } from "@/lib/utils";
import type { Fish } from "@/types/fish";

interface FishTooltipProps {
  fish: Fish;
  x: number;
  y: number;
}

export default function FishTooltip({ fish, x, y }: FishTooltipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="pointer-events-none absolute z-30 rounded-lg bg-white/95 px-3 py-2 text-sm shadow-lg backdrop-blur-sm"
      style={{ left: x, top: y - 48, transform: "translateX(-50%)" }}
    >
      <div className="font-semibold text-slate-800">{fish.name}</div>
      <div className="text-xs text-slate-500">Created {formatAge(fish.created_at)}</div>
    </motion.div>
  );
}
