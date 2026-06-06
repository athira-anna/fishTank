"use client";

import { getImageUrl } from "@/lib/api";
import { computeFishZIndex, depthStyle } from "@/lib/tankScenery";
import type { SwimmingFish } from "@/types/fish";

interface FishSpriteProps {
  fish: SwimmingFish;
  previewUrl?: string;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
  isHovered: boolean;
}

const FISH_WIDTH = 80;
const FISH_HEIGHT = 48;

export default function FishSprite({
  fish,
  previewUrl,
  onHover,
  onClick,
  isHovered,
}: FishSpriteProps) {
  const imageUrl = previewUrl ?? getImageUrl(fish.image_url);
  const flip = fish.direction === "left";
  const { scale, opacity, blur } = depthStyle(fish.depth, fish.inCave, fish.isHiding);
  const zIndex = computeFishZIndex(fish.depth, fish.y, fish.inCave, isHovered);
  const displayOpacity = fish.isSettling ? Math.max(opacity, 0.92) : opacity;
  const w = FISH_WIDTH * scale;
  const h = FISH_HEIGHT * scale;
  const hitPad = 14;
  const left = fish.x - (w + hitPad * 2) / 2;
  const top = fish.y - (h + hitPad * 2) / 2;

  return (
    <div
      className="absolute flex cursor-pointer touch-manipulation select-none items-center justify-center"
      style={{
        left,
        top,
        width: w + hitPad * 2,
        height: h + hitPad * 2,
        zIndex: fish.isSettling ? 38 : zIndex,
        transition: fish.isSettling
          ? "left 0.14s linear, top 0.14s linear, opacity 0.35s ease-out"
          : undefined,
      }}
      onMouseEnter={() => onHover(fish.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(fish.id)}
    >
      <div
        className="relative"
        style={{ width: w, height: h }}
      >
      {/* Underwater shadow */}
      <div
        className="pointer-events-none absolute left-1/2"
        style={{
          top: h * 0.55,
          width: w * 0.75,
          height: h * 0.35,
          transform: "translateX(-50%) translateY(20px)",
          background: "radial-gradient(ellipse, rgba(0,30,50,0.35) 0%, transparent 70%)",
          opacity: 0.15,
          filter: "blur(8px)",
        }}
      />

      <div
        style={{
          width: "100%",
          height: "100%",
          transform: flip ? "scaleX(-1)" : "scaleX(1)",
          opacity: displayOpacity,
          filter: [
            blur > 0 ? `blur(${blur}px)` : "",
            fish.inCave ? "brightness(0.88)" : "",
            isHovered ? "drop-shadow(0 0 10px rgba(255,255,255,0.7))" : "",
          ].filter(Boolean).join(" ") || undefined,
          transition: "filter 0.35s, opacity 0.45s",
        }}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={fish.name}
            className="h-full w-full object-contain"
            draggable={false}
            style={{
              opacity: fish.isHiding ? 0.75 : 1,
              transition: "opacity 0.4s",
            }}
          />
        ) : (
          <DefaultFishSvg depth={fish.depth} inCave={fish.inCave} />
        )}
      </div>

      {fish.depth > 0.5 && !fish.isHiding && !fish.isSettling && (
        <div
          className="absolute left-1/2 top-full mt-0.5 max-w-[120px] truncate whitespace-nowrap text-xs font-medium text-white/70 drop-shadow-sm sm:max-w-none"
          style={{
            fontSize: `${10 + fish.depth * 4}px`,
            transform: "translateX(-50%)",
          }}
        >
          {fish.name}
        </div>
      )}
      </div>
    </div>
  );
}

function DefaultFishSvg({ depth, inCave }: { depth: number; inCave: boolean }) {
  const hue = (depth * 60 + 0) | 0;
  const body = `hsl(${hue + 350}, 75%, ${50 + depth * 15 - (inCave ? 8 : 0)}%)`;
  const tail = `hsl(${hue + 350}, 70%, ${42 + depth * 12 - (inCave ? 8 : 0)}%)`;
  return (
    <svg viewBox="0 0 80 48" className="h-full w-full">
      <ellipse cx="40" cy="24" rx="30" ry="16" fill={body} />
      <polygon points="10,24 0,14 0,34" fill={tail} />
      <circle cx="58" cy="20" r="5" fill="white" opacity={0.7 + depth * 0.3} />
      <circle cx="59" cy="20" r="2.5" fill="#1a1a2e" />
    </svg>
  );
}

export { FISH_HEIGHT, FISH_WIDTH };
