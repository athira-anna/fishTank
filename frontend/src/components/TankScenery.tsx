"use client";

import { type ReactNode } from "react";
import { ROCK_FORMATIONS } from "@/lib/tankScenery";

/* ─── Rock components ─── */

function LiveRockBack({ w, h, hasCave, uid }: { w: number; h: number; hasCave?: boolean; uid: string }) {
  return (
    <svg width={w} height={h + 24} viewBox={`0 0 ${w} ${h + 24}`} className="overflow-visible">
      <defs>
        <linearGradient id={`rock-${uid}`} x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#7a8570" />
          <stop offset="50%" stopColor="#55604e" />
          <stop offset="100%" stopColor="#3a4038" />
        </linearGradient>
        <radialGradient id={`rock-hi-${uid}`} cx="35%" cy="20%" r="60%">
          <stop offset="0%" stopColor="#96a38a" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#55604e" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={w * 0.5} cy={h - 2} rx={w * 0.48} ry={h * 0.46} fill={`url(#rock-${uid})`} />
      <ellipse cx={w * 0.5} cy={h - 2} rx={w * 0.48} ry={h * 0.46} fill={`url(#rock-hi-${uid})`} />
      <ellipse cx={w * 0.25} cy={h - 20} rx={w * 0.2} ry={h * 0.24} fill="#5a6354" opacity="0.9" />
      <ellipse cx={w * 0.72} cy={h - 24} rx={w * 0.22} ry={h * 0.22} fill="#525b4c" opacity="0.85" />
      <ellipse cx={w * 0.48} cy={h - 38} rx={w * 0.24} ry={h * 0.16} fill="#6b7560" opacity="0.75" />
      {hasCave && (
        <>
          <ellipse cx={w * 0.5} cy={h * 0.52} rx={w * 0.2} ry={h * 0.17} fill="#0c4a6e" opacity="0.55" />
          <ellipse cx={w * 0.5} cy={h * 0.52} rx={w * 0.15} ry={h * 0.13} fill="#0369a1" opacity="0.4" />
        </>
      )}
    </svg>
  );
}

function LiveRockFront({ w, h, uid }: { w: number; h: number; uid: string }) {
  return (
    <svg width={w} height={h + 24} viewBox={`0 0 ${w} ${h + 24}`} className="overflow-visible">
      <defs>
        <linearGradient id={`rf-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a9580" />
          <stop offset="100%" stopColor="#4a5245" />
        </linearGradient>
      </defs>
      <path
        d={`M ${w * 0.16} ${h * 0.8}
            Q ${w * 0.16} ${h * 0.28}, ${w * 0.5} ${h * 0.18}
            Q ${w * 0.84} ${h * 0.28}, ${w * 0.84} ${h * 0.8}
            L ${w * 0.76} ${h * 0.8}
            Q ${w * 0.76} ${h * 0.38}, ${w * 0.5} ${h * 0.32}
            Q ${w * 0.24} ${h * 0.38}, ${w * 0.24} ${h * 0.8} Z`}
        fill={`url(#rf-${uid})`}
      />
      <path d={`M ${w * 0.1} ${h * 0.92} L ${w * 0.1} ${h * 0.48} Q ${w * 0.08} ${h * 0.35}, ${w * 0.15} ${h * 0.28} L ${w * 0.22} ${h * 0.8} Z`} fill="#4a5245" />
      <path d={`M ${w * 0.9} ${h * 0.92} L ${w * 0.9} ${h * 0.48} Q ${w * 0.92} ${h * 0.35}, ${w * 0.85} ${h * 0.28} L ${w * 0.78} ${h * 0.8} Z`} fill="#4a5245" />
      <ellipse cx={w * 0.5} cy={h * 0.16} rx={w * 0.18} ry={h * 0.1} fill="#6b7560" />
    </svg>
  );
}

function SmallBoulder({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h + 10} viewBox={`0 0 ${w} ${h + 10}`}>
      <ellipse cx={w / 2} cy={h - 2} rx={w / 2 - 2} ry={h / 2} fill="#6b7560" />
      <ellipse cx={w / 2} cy={h - 6} rx={w / 2 - 8} ry={h / 2 - 8} fill="#7a8570" opacity="0.5" />
    </svg>
  );
}

/* ─── Corals & plants ─── */

function StaghornCoral({ flip, large }: { flip?: boolean; large?: boolean }) {
  const s = large ? 1.4 : 1;
  return (
    <svg width={80 * s} height={100 * s} viewBox="0 0 80 100" className="overflow-visible">
      <g transform={flip ? "scale(-1,1) translate(-80,0)" : undefined}>
        <path d="M40 100 L40 55" stroke="#c8c0b0" strokeWidth={3 * s} strokeLinecap="round" />
        {[
          { b: 52, c: 18, d: 38 }, { b: 48, c: 62, d: 32 }, { b: 62, c: 12, d: 52 },
          { b: 58, c: 68, d: 46 }, { b: 42, c: 28, d: 20 },
        ].map(({ b, c, d }, i) => (
          <path key={i}
            d={`M40 ${b} Q${(40 + c) / 2} ${(b + d) / 2 - 10}, ${c} ${d}`}
            fill="none" stroke="#ece8dc" strokeWidth={2.5 * s} strokeLinecap="round" />
        ))}
      </g>
    </svg>
  );
}

function PlateCoral({ flip, large }: { flip?: boolean; large?: boolean }) {
  const s = large ? 1.35 : 1;
  return (
    <svg width={90 * s} height={70 * s} viewBox="0 0 90 70" className="overflow-visible">
      <g transform={flip ? "scale(-1,1) translate(-90,0)" : undefined}>
        <path d="M45 70 L45 38" stroke="#8a8580" strokeWidth={2 * s} />
        <ellipse cx="45" cy="28" rx={38 * s} ry={22 * s} fill="#a8a29e" opacity="0.9" />
        <ellipse cx="45" cy="24" rx={30 * s} ry={16 * s} fill="#c4bdb5" opacity="0.65" />
      </g>
    </svg>
  );
}

function BrainCoral({ flip }: { flip?: boolean }) {
  return (
    <svg width="100" height="70" viewBox="0 0 100 70" className="overflow-visible">
      <g transform={flip ? "scale(-1,1) translate(-100,0)" : undefined}>
        <path d="M15 55 Q25 30, 50 25 Q75 30, 85 55 Q75 48, 50 42 Q25 48, 15 55 Z" fill="#e07a5f" opacity="0.85" />
      </g>
    </svg>
  );
}

function BubbleCoral({ flip }: { flip?: boolean }) {
  return (
    <svg width="80" height="90" viewBox="0 0 80 90" className="overflow-visible">
      <g transform={flip ? "scale(-1,1) translate(-80,0)" : undefined}>
        <path d="M40 90 L40 50" stroke="#8a8580" strokeWidth="2" />
        {[{ cx: 40, cy: 38, r: 18 }, { cx: 22, cy: 48, r: 12 }, { cx: 58, cy: 45, r: 14 }].map(({ cx, cy, r }, i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="#f4a4a4" opacity={0.85 - i * 0.05} />
        ))}
      </g>
    </svg>
  );
}

function SeaFan({ flip, large }: { flip?: boolean; large?: boolean }) {
  const s = large ? 1.5 : 1;
  return (
    <svg width={70 * s} height={90 * s} viewBox="0 0 70 90" className="overflow-visible">
      <g transform={flip ? "scale(-1,1) translate(-70,0)" : undefined} className="sea-fan-sway">
        <path d="M35 90 L35 25" stroke="#5c4a3a" strokeWidth={2 * s} />
        {[18, 28, 38, 48, 58].map((y, i) => (
          <path key={y}
            d={`M35 ${y} Q${35 + (i % 2 ? 22 : -22)} ${y - 6}, ${35 + (i % 2 ? 32 : -32)} ${y + 2}`}
            fill="none" stroke="#6b5344" strokeWidth={1.3 * s} opacity="0.8" />
        ))}
      </g>
    </svg>
  );
}

function TubeSponge({ flip }: { flip?: boolean }) {
  return (
    <svg width="60" height="110" viewBox="0 0 60 110" className="overflow-visible">
      <g transform={flip ? "scale(-1,1) translate(-60,0)" : undefined}>
        {[{ x: 18, h: 70 }, { x: 30, h: 90 }, { x: 42, h: 65 }].map(({ x, h }, i) => (
          <ellipse key={i} cx={x} cy={110 - h / 2} rx={9} ry={h / 2}
            fill={i % 2 ? "#f4a261" : "#e76f51"} opacity={0.85 - i * 0.05} />
        ))}
      </g>
    </svg>
  );
}

function TallKelp({ flip }: { flip?: boolean }) {
  return (
    <svg width="50" height="220" viewBox="0 0 50 220" className="overflow-visible">
      <g transform={flip ? "scale(-1,1) translate(-50,0)" : undefined}>
        <path d="M25 220 C22 170, 28 120, 20 70 C15 40, 22 15, 18 0" fill="none" stroke="#1b5e20" strokeWidth="5" strokeLinecap="round" />
        <path d="M25 220 C28 175, 22 125, 30 75 C35 42, 28 18, 32 2" fill="none" stroke="#2e7d32" strokeWidth="4" strokeLinecap="round" />
        {[30, 55, 80, 105, 130, 155, 180].map((y, i) => (
          <ellipse key={y} cx={18 + (i % 3) * 7} cy={y} rx={10 + (i % 2) * 4} ry={5}
            fill="#43a047" opacity={0.65 + (i % 3) * 0.1}
            transform={`rotate(${i % 2 ? 25 : -25}, ${18 + (i % 3) * 7}, ${y})`} />
        ))}
      </g>
    </svg>
  );
}

function BigSeaweed({ flip }: { flip?: boolean }) {
  return (
    <svg width="70" height="180" viewBox="0 0 70 180" className="overflow-visible">
      <g transform={flip ? "scale(-1,1) translate(-70,0)" : undefined}>
        {[8, 22, 36, 50, 64].map((x, i) => (
          <path key={x}
            d={`M${x} 180 Q${x + (i % 2 ? 12 : -12)} 120, ${x + (i % 2 ? 18 : -18)} 40 Q${x + (i % 2 ? 8 : -8)} 10, ${x + (i % 2 ? 14 : -14)} 0`}
            fill="none" stroke={i % 2 ? "#2e7d32" : "#388e3c"} strokeWidth={3.5 - (i % 2) * 0.5}
            strokeLinecap="round" opacity={0.75 + (i % 3) * 0.05} />
        ))}
      </g>
    </svg>
  );
}

function AnubiasCluster({ flip }: { flip?: boolean }) {
  return (
    <svg width="90" height="100" viewBox="0 0 90 100" className="overflow-visible">
      <g transform={flip ? "scale(-1,1) translate(-90,0)" : undefined}>
        <path d="M45 100 L45 55" stroke="#1b5e20" strokeWidth="3" />
        <path d="M45 55 C20 48, 8 30, 12 12 C16 2, 30 8, 45 18" fill="#2e7d32" opacity="0.9" />
        <path d="M45 55 C70 48, 82 28, 78 10 C74 0, 60 6, 45 16" fill="#388e3c" opacity="0.85" />
        <path d="M45 50 C28 44, 18 32, 20 18" fill="#43a047" opacity="0.8" />
      </g>
    </svg>
  );
}

function ConchShell({ flip }: { flip?: boolean }) {
  return (
    <svg width="36" height="28" viewBox="0 0 36 28">
      <g transform={flip ? "scale(-1,1) translate(-36,0)" : undefined}>
        <path d="M8 20 Q4 14, 8 8 Q14 4, 22 6 Q30 8, 32 14 Q34 20, 28 22 Q20 24, 12 22 Z" fill="#e8e0d4" stroke="#c8c0b4" strokeWidth="0.8" />
      </g>
    </svg>
  );
}

function FloorSeaGrass({ flip }: { flip?: boolean }) {
  return (
    <svg width="40" height="32" viewBox="0 0 40 32">
      <g transform={flip ? "scale(-1,1) translate(-40,0)" : undefined}>
        {[8, 16, 24, 32].map((x, i) => (
          <path key={x} d={`M${x} 32 Q${x + (i % 2 ? 3 : -3)} 18, ${x + (i % 2 ? 5 : -5)} 6`}
            fill="none" stroke="#3d7a45" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        ))}
      </g>
    </svg>
  );
}

/* ─── Layer 2: distant painted silhouettes ─── */

function DistantBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2]" style={{ opacity: 0.15, filter: "blur(8px)" }}>
      <svg width="100%" height="100%" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0">
        {/* Distant rock blobs */}
        <ellipse cx="120" cy="420" rx="90" ry="55" fill="#0a3048" />
        <ellipse cx="280" cy="440" rx="70" ry="40" fill="#0a3048" />
        <ellipse cx="520" cy="430" rx="110" ry="60" fill="#0a3048" />
        <ellipse cx="750" cy="425" rx="85" ry="50" fill="#0a3048" />
        <ellipse cx="900" cy="435" rx="65" ry="38" fill="#0a3048" />
        {/* Seaweed silhouettes */}
        {[60, 140, 350, 480, 620, 820, 940].map((x, i) => (
          <path key={x}
            d={`M${x} 500 Q${x + (i % 2 ? 20 : -20)} 380, ${x + (i % 2 ? 10 : -10)} 260`}
            fill="none" stroke="#0d3d52" strokeWidth={14 + (i % 3) * 4} strokeLinecap="round" />
        ))}
        {[200, 420, 680].map((x, i) => (
          <path key={`t-${x}`}
            d={`M${x} 500 C${x - 15} 400, ${x + 20} 320, ${x} 200`}
            fill="none" stroke="#0a3545" strokeWidth={20 + i * 6} strokeLinecap="round" opacity="0.8" />
        ))}
      </svg>
    </div>
  );
}

/* ─── Ocean floor — sand dune ─── */

function SandFloor() {
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[3]" style={{ height: "18%" }}>
      <svg width="100%" height="100%" viewBox="0 0 1000 100" preserveAspectRatio="none" className="absolute inset-0">
        <defs>
          <linearGradient id="sand-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e5d9b8" />
            <stop offset="100%" stopColor="#c9b898" />
          </linearGradient>
        </defs>
        <path
          d="M0 55 C150 25, 300 45, 450 15 C600 0, 800 40, 1000 25 L1000 100 L0 100 Z"
          fill="url(#sand-grad)"
        />
        <path
          d="M0 65 C200 50, 400 60, 600 45 C800 35, 900 55, 1000 48 L1000 100 L0 100 Z"
          fill="#c9b898"
          opacity="0.55"
        />
        {/* Subtle ripple texture */}
        <path d="M0 58 Q125 52, 250 56 T500 54 T750 57 T1000 53" fill="none" stroke="#b8a888" strokeWidth="0.8" opacity="0.4" />
      </svg>

      {/* Shells on sand */}
      {[
        { left: "12%", scale: 1 }, { left: "35%", scale: 0.85, flip: true },
        { left: "58%", scale: 0.9 }, { left: "78%", scale: 1.1, flip: true },
        { left: "92%", scale: 0.75 },
      ].map((s, i) => (
        <div key={i} className="absolute" style={{
          left: s.left, bottom: "6px",
          transform: `scale(${s.scale})${s.flip ? " scaleX(-1)" : ""}`,
          opacity: 0.85,
        }}>
          <ConchShell flip={s.flip} />
        </div>
      ))}

      {/* Small stones */}
      {[18, 42, 67, 85].map((left, i) => (
        <div key={left} className="absolute rounded-full" style={{
          left: `${left}%`, bottom: `${4 + (i % 3) * 3}px`,
          width: 5 + (i % 4), height: 4 + (i % 3),
          background: i % 2 ? "#a89888" : "#8a8070",
          opacity: 0.6,
          transform: `rotate(${(i * 41) % 360}deg)`,
        }} />
      ))}

      {/* Floor sea grass */}
      {[
        { left: "8%" }, { left: "25%", flip: true }, { left: "48%" },
        { left: "72%", flip: true }, { left: "88%" },
      ].map((g, i) => (
        <div key={i} className="absolute grass-sway" style={{
          left: g.left, bottom: "2px",
          animationDelay: `${i * 0.4}s`,
        }}>
          <FloorSeaGrass flip={g.flip} />
        </div>
      ))}
    </div>
  );
}

/* ─── Layout helper ─── */

interface PlacedProps {
  left: string;
  bottom: string;
  scale?: number;
  flip?: boolean;
  opacity?: number;
  z: number;
  anim?: string;
  delay?: number;
  children: ReactNode;
}

function Placed({
  left, bottom, scale = 1, flip, opacity = 1, z, anim, delay = 0, children,
}: PlacedProps) {
  return (
    <div className="pointer-events-none absolute" style={{ left, bottom, zIndex: z, opacity }}>
      <div className={anim} style={{ animationDelay: `${delay}s` }}>
        <div style={{ transform: `scale(${scale})${flip ? " scaleX(-1)" : ""}` }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─── Layer exports ─── */

/** Distant blurry silhouettes */
export function TankSceneryDistant() {
  return <DistantBackground />;
}

/** Sand dune ocean floor */
export function TankSceneryFloor() {
  return <SandFloor />;
}

/** Midground rocks — reduced underwater contrast */
export function TankSceneryMidRocks() {
  return (
    <>
      {ROCK_FORMATIONS.map((rock) => (
        <div
          key={`mid-rock-${rock.id}`}
          className="pointer-events-none absolute z-[5]"
          style={{
            left: `${rock.leftPct * 100}%`,
            bottom: `${rock.bottomPx}px`,
            opacity: 0.75,
          }}
        >
          {rock.hasCave ? (
            <LiveRockBack w={rock.width} h={rock.height} hasCave uid={rock.id} />
          ) : (
            <SmallBoulder w={rock.width} h={rock.height} />
          )}
        </div>
      ))}
    </>
  );
}

/** Midground corals & sponges */
export function TankSceneryMidCorals() {
  return (
    <>
      <Placed left="10%" bottom="52px" scale={1.4} z={6} anim="plant-sway-slow" delay={0.2} opacity={0.75}>
        <StaghornCoral large />
      </Placed>
      <Placed left="65%" bottom="50px" scale={1.3} flip z={6} anim="plant-sway-slow" delay={0.6} opacity={0.72}>
        <StaghornCoral large flip />
      </Placed>
      <Placed left="28%" bottom="48px" scale={1.2} z={6} anim="plant-sway" opacity={0.7}>
        <BrainCoral />
      </Placed>
      <Placed left="50%" bottom="48px" scale={1.15} flip z={6} anim="plant-sway" delay={0.4} opacity={0.68}>
        <PlateCoral large flip />
      </Placed>
      <Placed left="38%" bottom="115px" scale={1.1} z={6} anim="sea-fan-sway" delay={0.3} opacity={0.65}>
        <SeaFan large />
      </Placed>
      <Placed left="20%" bottom="48px" scale={1.1} z={6} anim="plant-sway-slow" delay={0.5} opacity={0.7}>
        <BubbleCoral />
      </Placed>
      <Placed left="58%" bottom="48px" scale={1.05} flip z={6} anim="plant-sway" delay={0.7} opacity={0.68}>
        <TubeSponge flip />
      </Placed>
    </>
  );
}

/** Foreground plants — overlap fish for depth */
export function TankSceneryFrontPlants() {
  return (
    <>
      <Placed left="-2%" bottom="48px" scale={2.1} z={16} anim="kelp-sway" delay={0.3} opacity={0.92}>
        <TallKelp />
      </Placed>
      <Placed left="90%" bottom="48px" scale={1.95} flip z={16} anim="kelp-sway" delay={0.9} opacity={0.9}>
        <TallKelp flip />
      </Placed>
      <Placed left="5%" bottom="48px" scale={1.35} z={17} anim="grass-sway" delay={0.4} opacity={0.88}>
        <BigSeaweed />
      </Placed>
      <Placed left="80%" bottom="48px" scale={1.3} flip z={17} anim="grass-sway" delay={0.8} opacity={0.86}>
        <BigSeaweed flip />
      </Placed>
      <Placed left="18%" bottom="48px" scale={1.05} z={17} anim="kelp-sway" delay={0.2} opacity={0.82}>
        <TallKelp />
      </Placed>
      <Placed left="72%" bottom="48px" scale={1.0} flip z={17} anim="kelp-sway" delay={0.6} opacity={0.8}>
        <TallKelp flip />
      </Placed>
      <Placed left="42%" bottom="48px" scale={0.95} z={16} anim="plant-sway" opacity={0.75}>
        <AnubiasCluster />
      </Placed>
    </>
  );
}

/** Foreground rock arches */
export function TankSceneryFrontRocks() {
  return (
    <>
      {ROCK_FORMATIONS.filter((r) => r.hasCave).map((rock) => (
        <div
          key={`front-rock-${rock.id}`}
          className="pointer-events-none absolute z-[15]"
          style={{ left: `${rock.leftPct * 100}%`, bottom: `${rock.bottomPx}px`, opacity: 0.88 }}
        >
          <LiveRockFront w={rock.width} h={rock.height} uid={rock.id} />
        </div>
      ))}
    </>
  );
}

/** Glass tank edges */
export function TankGlassFx() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[23]">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-b from-white/45 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-t from-sky-900/25 to-transparent" />
      <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-r from-white/30 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-1.5 bg-gradient-to-l from-white/30 to-transparent" />
    </div>
  );
}

/* Legacy exports — kept for compatibility */
export function TankSceneryBack() {
  return (
    <>
      <TankSceneryDistant />
      <TankSceneryFloor />
    </>
  );
}

export function TankSceneryMid() {
  return (
    <>
      <TankSceneryMidRocks />
      <TankSceneryMidCorals />
    </>
  );
}

export function TankSceneryFront() {
  return (
    <>
      <TankSceneryFrontRocks />
      <TankSceneryFrontPlants />
      <TankGlassFx />
    </>
  );
}

export default function TankScenery() {
  return (
    <>
      <TankSceneryDistant />
      <TankSceneryFloor />
      <TankSceneryMidRocks />
      <TankSceneryMidCorals />
      <TankSceneryFrontRocks />
      <TankSceneryFrontPlants />
      <TankGlassFx />
    </>
  );
}
