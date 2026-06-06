"use client";

/** Layer 1 — water gradient, haze, depth, light falloff */
export default function TankWater() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[0]">
      {/* Base water column */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            to bottom,
            #7fd3f7 0%,
            #4ca9d8 30%,
            #1f6b9e 70%,
            #0b3e5f 100%
          )`,
        }}
      />

      {/* Surface haze / light pool */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse 90% 45% at 50% 0%,
            rgba(255,255,255,0.35) 0%,
            rgba(255,255,255,0.08) 40%,
            transparent 70%
          )`,
        }}
      />

      {/* Water depth — darker toward bottom */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            to bottom,
            transparent 0%,
            transparent 35%,
            rgba(0,30,50,0.15) 65%,
            rgba(0,20,40,0.35) 100%
          )`,
        }}
      />

      {/* Light falloff — sides & bottom vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 20%, transparent 40%, rgba(0,40,70,0.12) 100%),
            linear-gradient(to right, rgba(0,30,55,0.2) 0%, transparent 12%, transparent 88%, rgba(0,30,55,0.2) 100%)
          `,
        }}
      />

      {/* Subtle suspended haze */}
      <div className="tank-haze absolute inset-0 opacity-40" />
    </div>
  );
}
