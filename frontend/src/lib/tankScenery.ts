export interface Obstacle {
  id: string;
  x: number;
  y: number;
  rx: number;
  ry: number;
}

export interface CaveZone {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Swim-through corridor at a rock arch opening */
export interface PassageZone {
  id: string;
  caveId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Gap between rock stacks — fish can pass behind mid-ground rocks */
export interface SwimGap {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RockFormationSpec {
  id: string;
  leftPct: number;
  bottomPx: number;
  width: number;
  height: number;
  hasCave?: boolean;
}

export const ROCK_FORMATIONS: RockFormationSpec[] = [
  { id: "left-reef", leftPct: 0.0, bottomPx: 38, width: 180, height: 130, hasCave: true },
  { id: "left-boulder", leftPct: 0.14, bottomPx: 40, width: 90, height: 55 },
  { id: "center-stack", leftPct: 0.32, bottomPx: 34, width: 200, height: 145, hasCave: true },
  { id: "mid-rock", leftPct: 0.52, bottomPx: 42, width: 70, height: 45 },
  { id: "right-reef", leftPct: 0.62, bottomPx: 36, width: 170, height: 120, hasCave: true },
  { id: "right-arch", leftPct: 0.78, bottomPx: 40, width: 140, height: 100, hasCave: true },
  { id: "pebble-a", leftPct: 0.24, bottomPx: 44, width: 55, height: 32 },
  { id: "pebble-b", leftPct: 0.48, bottomPx: 46, width: 45, height: 28 },
  { id: "pebble-c", leftPct: 0.88, bottomPx: 44, width: 60, height: 35 },
];

function rockFloor(tankH: number) {
  return tankH - 52;
}

/** Open ocean — no synthetic rock collision zones */
export function getObstacles(_tankW: number, _tankH: number): Obstacle[] {
  return [];
}

export function getPassageZones(_tankW: number, _tankH: number): PassageZone[] {
  return [];
}

export function getCaveZones(_tankW: number, _tankH: number): CaveZone[] {
  return [];
}

export function getSwimGaps(_tankW: number, _tankH: number): SwimGap[] {
  return [];
}

export function isInsideRect(
  x: number,
  y: number,
  rect: { x: number; y: number; width: number; height: number }
): boolean {
  return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
}

export function isInsideCave(x: number, y: number, caves: CaveZone[]): boolean {
  return caves.some((c) => isInsideRect(x, y, c));
}

export function isInPassage(x: number, y: number, passages: PassageZone[]): boolean {
  return passages.some((p) => isInsideRect(x, y, p));
}

export function isInSwimGap(x: number, y: number, gaps: SwimGap[]): boolean {
  return gaps.some((g) => isInsideRect(x, y, g));
}

export function isBehindRock(
  x: number,
  y: number,
  caves: CaveZone[],
  passages: PassageZone[],
  gaps: SwimGap[]
): boolean {
  return isInsideCave(x, y, caves) || isInPassage(x, y, passages) || isInSwimGap(x, y, gaps);
}

export function hitsObstacle(x: number, y: number, obstacles: Obstacle[]): boolean {
  return obstacles.some((o) => {
    const dx = (x - o.x) / o.rx;
    const dy = (y - o.y) / o.ry;
    return dx * dx + dy * dy < 1;
  });
}

/** Gravel-bed spots where bubbles occasionally rise */
export function getBubbleSources(tankW: number, tankH: number): { x: number; y: number; kind: "gravel" | "cave" }[] {
  const sources: { x: number; y: number; kind: "gravel" | "cave" }[] = [];
  for (let i = 0; i < 18; i++) {
    sources.push({
      x: tankW * (0.05 + (i * 0.055) % 0.9),
      y: tankH * (0.55 + (i % 7) * 0.05),
      kind: "gravel",
    });
  }
  for (let i = 0; i < 6; i++) {
    sources.push({
      x: tankW * (0.15 + i * 0.14),
      y: tankH * 0.72,
      kind: "cave",
    });
  }
  return sources;
}

export function computeFishZIndex(
  depth: number,
  y: number,
  inCave: boolean,
  hovered: boolean
): number {
  if (hovered) return 30;
  if (inCave) return 6 + Math.round(depth * 2);
  return 10 + Math.round(depth * 8) + Math.round(y / 80);
}

export function depthStyle(depth: number, inCave = false, isHiding = false) {
  const scale = 0.55 + depth * 0.55;
  let opacity = 0.55 + depth * 0.45;
  let blur = depth < 0.35 ? (0.35 - depth) * 2.5 : 0;
  if (inCave) {
    opacity *= 0.72;
    blur += 0.6;
  }
  if (isHiding) {
    opacity *= 0.82;
    blur += 0.4;
  }
  return { scale, opacity, blur };
}
