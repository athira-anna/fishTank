export const RELEASE_FISH_W = 88;
export const RELEASE_FISH_H = 56;

/** Total release animation including float tail (seconds) */
export const RELEASE_ANIM_DURATION = 1.75;

/** When swimming fish appears — start of float overlap (0–1) */
export const RELEASE_LAND_AT = 0.73;

export interface ReleaseLanding {
  centerX: number;
  centerY: number;
  direction: "left" | "right";
  entryVx: number;
  entryVy: number;
}

export function getReleaseLanding(tankW: number, tankH: number): ReleaseLanding {
  const left = tankW * 0.52 - RELEASE_FISH_W / 2;
  const top = tankH * 0.42;
  return {
    centerX: left + RELEASE_FISH_W / 2,
    centerY: top + RELEASE_FISH_H / 2,
    direction: "right",
    entryVx: 1.6,
    entryVy: 0.35,
  };
}
