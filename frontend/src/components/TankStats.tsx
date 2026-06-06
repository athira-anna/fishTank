"use client";

import type { TankStats as TankStatsType } from "@/types/fish";

interface TankStatsProps {
  stats: TankStatsType;
}

export default function TankStats({ stats }: TankStatsProps) {
  return (
    <div className="flex gap-6 text-white">
      <div className="text-center">
        <div className="text-2xl font-bold tabular-nums drop-shadow-sm">{stats.total_fish}</div>
        <div className="text-xs uppercase tracking-wider text-white/60">
          Fish in ocean
        </div>
      </div>
      <div className="h-10 w-px bg-white/25" />
      <div className="text-center">
        <div className="text-2xl font-bold tabular-nums drop-shadow-sm">{stats.total_creators}</div>
        <div className="text-xs uppercase tracking-wider text-white/60">
          Creators
        </div>
      </div>
    </div>
  );
}
