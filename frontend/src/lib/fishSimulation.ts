import type { ReleaseLanding } from "./releaseLanding";
import {
  getCaveZones,
  getObstacles,
  getPassageZones,
  getSwimGaps,
  hitsObstacle,
  isBehindRock,
  isInsideCave,
  isInsideRect,
  type CaveZone,
} from "./tankScenery";

export interface FishSimState {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  direction: "left" | "right";
  depth: number;
  depthTarget: number;
  phase: number;
  wanderTimer: number;
  speed: number;
  inCave: boolean;
  isHiding: boolean;
  hideTimer: number;
  targetCaveId: string | null;
  settleTimer: number;
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pickCaveTarget(cave: CaveZone) {
  return {
    x: rand(cave.x + 12, cave.x + cave.width - 12),
    y: rand(cave.y + 10, cave.y + cave.height - 10),
    caveId: cave.id,
  };
}

function pickTarget(
  tankW: number,
  tankH: number,
  caves: CaveZone[],
  preferCave: boolean
) {
  const marginX = 60;
  const marginTop = 70;
  const marginBottom = 110;

  if (preferCave && caves.length > 0) {
    const cave = caves[Math.floor(Math.random() * caves.length)];
    const t = pickCaveTarget(cave);
    return { x: t.x, y: t.y, caveId: t.caveId };
  }

  return {
    x: rand(marginX, tankW - marginX),
    y: rand(marginTop, tankH - marginBottom),
    caveId: null as string | null,
  };
}

function clampToCave(x: number, y: number, cave: CaveZone) {
  return {
    x: Math.max(cave.x + 8, Math.min(cave.x + cave.width - 8, x)),
    y: Math.max(cave.y + 8, Math.min(cave.y + cave.height - 8, y)),
  };
}

export function createFishSim(
  id: string,
  speed: number,
  tankW: number,
  tankH: number
): FishSimState {
  const caves = getCaveZones(tankW, tankH);
  const target = pickTarget(tankW, tankH, caves, false);
  return {
    id,
    x: rand(80, tankW - 80),
    y: rand(90, tankH - 120),
    vx: 0,
    vy: 0,
    targetX: target.x,
    targetY: target.y,
    direction: Math.random() > 0.5 ? "right" : "left",
    depth: rand(0.25, 0.85),
    depthTarget: rand(0.3, 0.9),
    phase: Math.random() * Math.PI * 2,
    wanderTimer: Math.floor(rand(40, 120)),
    speed,
    inCave: false,
    isHiding: false,
    hideTimer: 0,
    targetCaveId: target.caveId,
    settleTimer: 0,
  };
}

export function createReleasedFishSim(
  id: string,
  speed: number,
  tankW: number,
  tankH: number,
  landing: ReleaseLanding
): FishSimState {
  return {
    id,
    x: landing.centerX,
    y: landing.centerY,
    vx: landing.entryVx,
    vy: landing.entryVy,
    targetX: landing.centerX + 55,
    targetY: landing.centerY + 15,
    direction: landing.direction,
    depth: 0.58,
    depthTarget: 0.58,
    phase: Math.random() * Math.PI * 2,
    wanderTimer: 90,
    speed,
    inCave: false,
    isHiding: false,
    hideTimer: 0,
    targetCaveId: null,
    settleTimer: 55,
  };
}

export function stepFishSim(
  sim: FishSimState,
  tankW: number,
  tankH: number
): FishSimState {
  const obstacles = getObstacles(tankW, tankH);
  const caves = getCaveZones(tankW, tankH);
  const passages = getPassageZones(tankW, tankH);
  const gaps = getSwimGaps(tankW, tankH);
  const marginX = 50;
  const marginTop = 60;
  const marginBottom = 100;

  let {
    x, y, vx, vy, targetX, targetY, wanderTimer, depth, depthTarget, phase,
    hideTimer, targetCaveId, settleTimer,
  } = sim;

  const isSettling = settleTimer > 0;
  if (isSettling) settleTimer -= 1;

  const inCaveInterior = isInsideCave(x, y, caves);
  const behindRock = isBehindRock(x, y, caves, passages, gaps);
  const inPassage = passages.some((p) => isInsideRect(x, y, p));

  // Countdown to new wander target
  wanderTimer -= 1;
  const distToTarget = Math.hypot(targetX - x, targetY - y);

  // While settling after release, float gently before full wander
  if (isSettling) {
    if (distToTarget < 28 || wanderTimer <= 0) {
      targetX = x + rand(35, 75);
      targetY = y + rand(-18, 22);
      wanderTimer = Math.floor(rand(70, 110));
    }
  } else if (hideTimer > 0) {
    hideTimer -= 1;
    if (distToTarget < 22 || wanderTimer <= 0) {
      const cave = caves.find((c) => c.id === targetCaveId) ?? caves[0];
      if (cave) {
        const local = pickCaveTarget(cave);
        targetX = local.x;
        targetY = local.y;
        targetCaveId = cave.id;
      }
      wanderTimer = Math.floor(rand(50, 120));
    }
  } else if (wanderTimer <= 0 || distToTarget < 30) {
    const preferCave = false;
    const next = pickTarget(tankW, tankH, caves, preferCave);
    targetX = next.x;
    targetY = next.y;
    targetCaveId = next.caveId;
    wanderTimer = Math.floor(rand(80, 200));
    if (Math.random() < 0.25) {
      depthTarget = rand(0.2, 0.95);
    }
  }

  // Steer toward target with organic noise
  const dx = targetX - x;
  const dy = targetY - y;
  const dist = Math.hypot(dx, dy) || 1;
  let speedMul = 1;
  if (isSettling) {
    const blend = settleTimer / 55;
    speedMul = 0.38 + (1 - blend) * 0.5;
  } else if (inCaveInterior) speedMul = hideTimer > 0 ? 0.35 : 0.55;
  else if (inPassage) speedMul = 0.75;

  const desiredVx = (dx / dist) * sim.speed * speedMul;
  const desiredVy = (dy / dist) * sim.speed * 0.65 * speedMul;

  phase += 0.025 + sim.speed * 0.008;
  let wobbleX = Math.sin(phase * 1.3) * 0.35 * speedMul;
  let wobbleY = Math.cos(phase * 0.9) * 0.45 * speedMul;
  if (isSettling) {
    const blend = settleTimer / 55;
    wobbleX *= 0.55;
    wobbleY *= 0.55;
    vy += Math.sin(phase * 2.4) * 0.1 * blend;
    vx += Math.cos(phase * 1.8) * 0.06 * blend;
  }

  let steer = inCaveInterior ? 0.03 : 0.04;
  if (isSettling) steer = 0.032;
  vx += (desiredVx + wobbleX - vx) * steer;
  vy += (desiredVy + wobbleY - vy) * steer;

  x += vx;
  y += vy;

  // Soft depth drift — deeper when hiding behind rocks
  if (behindRock) {
    depthTarget = Math.min(depthTarget, 0.42);
  }
  depth += (depthTarget - depth) * 0.008;

  // Tank edges — bounce gently
  if (x < marginX) { x = marginX; vx = Math.abs(vx) * 0.6; targetX = rand(marginX + 40, tankW - marginX); }
  if (x > tankW - marginX) { x = tankW - marginX; vx = -Math.abs(vx) * 0.6; targetX = rand(marginX, tankW - marginX - 40); }
  if (y < marginTop) { y = marginTop; vy = Math.abs(vy) * 0.5; targetY = rand(marginTop + 20, tankH - marginBottom); }
  if (y > tankH - marginBottom) { y = tankH - marginBottom; vy = -Math.abs(vy) * 0.5; targetY = rand(marginTop, tankH - marginBottom - 30); }

  // Rock collision — skip when swimming through passages, caves, or gaps
  if (!behindRock && hitsObstacle(x, y, obstacles)) {
    // If heading toward a cave, try to steer through the passage instead of bouncing
    if (targetCaveId) {
      const passage = passages.find((p) => p.caveId === targetCaveId);
      if (passage) {
        targetX = passage.x + passage.width / 2;
        targetY = passage.y + passage.height * 0.55;
        vx *= 0.5;
        vy *= 0.5;
      } else {
        vx = -vx * 0.7 + rand(-0.5, 0.5);
        vy = -vy * 0.7 + rand(-0.4, 0.4);
        x += vx * 2;
        y += vy * 2;
      }
    } else {
      vx = -vx * 0.7 + rand(-0.5, 0.5);
      vy = -vy * 0.7 + rand(-0.4, 0.4);
      x += vx * 2;
      y += vy * 2;
      const escape = pickTarget(tankW, tankH, caves, Math.random() < 0.5);
      targetX = escape.x;
      targetY = escape.y;
      targetCaveId = escape.caveId;
    }
    wanderTimer = Math.floor(rand(30, 80));
  }

  // Entered cave interior — start hiding
  if (inCaveInterior && hideTimer <= 0 && Math.random() < 0.018) {
    hideTimer = Math.floor(rand(90, 220));
    const cave = caves.find((c) => isInsideRect(x, y, c));
    if (cave) {
      targetCaveId = cave.id;
      const tucked = clampToCave(x, y, cave);
      targetX = tucked.x;
      targetY = tucked.y;
    }
  }

  const isHiding = hideTimer > 0 && inCaveInterior;
  const inCave = behindRock;
  const direction: "left" | "right" = vx >= 0 ? "right" : "left";

  return {
    ...sim,
    x,
    y,
    vx,
    vy,
    targetX,
    targetY,
    wanderTimer,
    depth,
    depthTarget,
    phase,
    direction,
    inCave,
    isHiding,
    hideTimer,
    targetCaveId,
    settleTimer,
  };
}
