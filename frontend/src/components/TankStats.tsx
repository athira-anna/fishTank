"use client";

import type { TankStats as TankStatsType } from "@/types/fish";

interface TankStatsProps {
  stats: TankStatsType;
}

export default function TankStats({ stats }: TankStatsProps) {
  return (
    <div className="flex items-center gap-3 text-white sm:gap-6">
      <div className="text-center">
        <div className="text-lg font-bold tabular-nums drop-shadow-sm sm:text-2xl">
          {stats.total_fish}
        </div>
        <div className="text-[10px] uppercase tracking-wider text-white/60 sm:text-xs">
          Fish
        </div>
      </div>
      <div className="h-8 w-px bg-white/25 sm:h-10" />
      <div className="text-center">
        <div className="text-lg font-bold tabular-nums drop-shadow-sm sm:text-2xl">
          {stats.total_creators}
        </div>
        <div className="text-[10px] uppercase tracking-wider text-white/60 sm:text-xs">
          Creators
        </div>
      </div>
    </div>
  );
}
