"use client";

const RAYS = [
  { left: "8%", rotate: 12, width: 100, opacity: 0.14 },
  { left: "22%", rotate: 8, width: 140, opacity: 0.18 },
  { left: "42%", rotate: -4, width: 120, opacity: 0.12 },
  { left: "58%", rotate: 6, width: 130, opacity: 0.16 },
  { left: "74%", rotate: 14, width: 110, opacity: 0.13 },
  { left: "88%", rotate: 10, width: 90, opacity: 0.1 },
];

export default function TankLightRays() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[21] overflow-hidden">
      {RAYS.map((ray, i) => (
        <div
          key={i}
          className="sun-ray absolute"
          style={{
            left: ray.left,
            width: ray.width,
            opacity: ray.opacity,
            transform: `rotate(${ray.rotate}deg)`,
            animationDelay: `${i * 0.8}s`,
          }}
        />
      ))}
    </div>
  );
}
