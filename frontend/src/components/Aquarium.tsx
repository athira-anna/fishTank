"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import FishCreatorModal, { type ReleasePayload } from "./FishCreatorModal";
import FishModal from "./FishModal";
import FishSprite, { FISH_HEIGHT } from "./FishSprite";
import FishTooltip from "./FishTooltip";
import OceanAmbience from "./OceanAmbience";
import OceanBackground from "./OceanBackground";
import ReleaseAnimation from "./ReleaseAnimation";
import TankBubbles from "./TankBubbles";
import TankParticles from "./TankParticles";
import TankStats from "./TankStats";
import { createFishSim, createReleasedFishSim, stepFishSim, type FishSimState } from "@/lib/fishSimulation";
import { getReleaseLanding } from "@/lib/releaseLanding";
import { createFish } from "@/lib/api";
import type { Fish, SwimmingFish, TankStats as TankStatsType } from "@/types/fish";

interface ReleaseVisual {
  previewUrl: string;
  name: string;
  fishId?: string;
}

interface AquariumProps {
  initialFish: Fish[];
  initialStats: TankStatsType;
  onReleaseComplete?: () => void;
}

function simToDisplay(sim: FishSimState, fish: Fish): SwimmingFish {
  return {
    ...fish,
    x: sim.x,
    y: sim.y,
    direction: sim.direction,
    depth: sim.depth,
    inCave: sim.inCave,
    isHiding: sim.isHiding,
    isSettling: sim.settleTimer > 0,
    phase: sim.phase,
  };
}

function initSimulation(fish: Fish[], tankW: number, tankH: number) {
  return fish.map((f) => createFishSim(f.id, f.speed, tankW, tankH));
}

export default function Aquarium({
  initialFish,
  initialStats,
  onReleaseComplete,
}: AquariumProps) {
  const oceanRef = useRef<HTMLDivElement>(null);
  const fishMetaRef = useRef<Map<string, Fish>>(new Map());
  const simRef = useRef<FishSimState[]>([]);
  const [oceanSize, setOceanSize] = useState({ width: 1000, height: 500 });
  const [fish, setFish] = useState<SwimmingFish[]>([]);
  const [stats, setStats] = useState(initialStats);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedFish, setSelectedFish] = useState<Fish | null>(null);
  const [showCreator, setShowCreator] = useState(false);
  const [releaseVisual, setReleaseVisual] = useState<ReleaseVisual | null>(null);
  const releaseFishRef = useRef<Fish | null>(null);
  const releasePromiseRef = useRef<Promise<Fish> | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const releasePreviewRef = useRef<Map<string, string>>(new Map());
  const releaseAddedRef = useRef(false);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const map = new Map<string, Fish>();
    initialFish.forEach((f) => map.set(f.id, f));
    fishMetaRef.current = map;
    simRef.current = initSimulation(initialFish, oceanSize.width, oceanSize.height);
    setFish(initialFish.map((f, i) => {
      const sim = simRef.current[i];
      return sim ? simToDisplay(sim, f) : { ...f, x: 100, y: 100, direction: "right" as const, depth: 0.5, inCave: false, isHiding: false, isSettling: false, phase: 0 };
    }));
  }, [initialFish]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    function updateSize() {
      if (oceanRef.current) {
        const { width, height } = oceanRef.current.getBoundingClientRect();
        setOceanSize({ width, height });
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    window.addEventListener("orientationchange", updateSize);
    return () => {
      window.removeEventListener("resize", updateSize);
      window.removeEventListener("orientationchange", updateSize);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    function tick() {
      const { width, height } = oceanRef.current?.getBoundingClientRect() ?? oceanSize;
      simRef.current = simRef.current.map((sim) => stepFishSim(sim, width, height));
      setFish(
        simRef.current
          .map((sim) => {
            const meta = fishMetaRef.current.get(sim.id);
            return meta ? simToDisplay(sim, meta) : null;
          })
          .filter(Boolean) as SwimmingFish[]
      );
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [oceanSize]);

  function handleReleaseStart(payload: ReleasePayload) {
    setShowCreator(false);
    setReleaseVisual({ previewUrl: payload.previewUrl, name: payload.name });
    previewUrlRef.current = payload.previewUrl;
    releaseFishRef.current = null;
    releaseAddedRef.current = false;

    releasePromiseRef.current = createFish({
      name: payload.name,
      creatorName: payload.creatorName,
      drawingData: payload.drawingData,
      imageBlob: payload.imageBlob,
    })
      .then((fish) => {
        releaseFishRef.current = fish;
        return fish;
      })
      .catch((e) => {
        setReleaseVisual(null);
        if (previewUrlRef.current) {
          URL.revokeObjectURL(previewUrlRef.current);
          previewUrlRef.current = null;
        }
        alert(e instanceof Error ? e.message : "Failed to save fish");
        throw e;
      });
  }

  const addReleasedFish = useCallback((released: Fish) => {
    if (simRef.current.some((s) => s.id === released.id)) return;

    fishMetaRef.current.set(released.id, released);
    if (previewUrlRef.current) {
      const url = previewUrlRef.current;
      releasePreviewRef.current.set(released.id, url);
      previewUrlRef.current = null;
      setTimeout(() => {
        releasePreviewRef.current.delete(released.id);
        URL.revokeObjectURL(url);
      }, 2800);
    }
    const landing = getReleaseLanding(oceanSize.width, oceanSize.height);
    const sim = createReleasedFishSim(
      released.id,
      released.speed,
      oceanSize.width,
      oceanSize.height,
      landing
    );
    simRef.current = [...simRef.current, sim];
    setFish(
      simRef.current
        .map((s) => {
          const meta = fishMetaRef.current.get(s.id);
          return meta ? simToDisplay(s, meta) : null;
        })
        .filter(Boolean) as SwimmingFish[]
    );
    setStats((s) => ({ total_fish: s.total_fish + 1, total_creators: s.total_creators }));
    onReleaseComplete?.();
  }, [onReleaseComplete, oceanSize.height, oceanSize.width]);

  const tryAddReleasedFish = useCallback(async () => {
    if (releaseAddedRef.current) return;

    let released = releaseFishRef.current;
    if (!released && releasePromiseRef.current) {
      try {
        released = await releasePromiseRef.current;
      } catch {
        return;
      }
    }

    if (!released || releaseAddedRef.current) return;
    releaseAddedRef.current = true;
    addReleasedFish(released);
  }, [addReleasedFish]);

  const handleReleaseLand = useCallback(() => {
    void tryAddReleasedFish();
  }, [tryAddReleasedFish]);

  async function handleReleaseAnimationDone() {
    try {
      await tryAddReleasedFish();
    } finally {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
      setReleaseVisual(null);
      releasePromiseRef.current = null;
      releaseFishRef.current = null;
      releaseAddedRef.current = false;
    }
  }

  function handleLike(updated: Fish) {
    fishMetaRef.current.set(updated.id, updated);
    setFish((prev) => prev.map((f) => (f.id === updated.id ? { ...f, likes: updated.likes } : f)));
    if (selectedFish?.id === updated.id) setSelectedFish(updated);
  }

  const hoveredFish = fish.find((f) => f.id === hoveredId);

  const renderFish = useCallback(
    (f: SwimmingFish) => (
      <FishSprite
        key={f.id}
        fish={f}
        previewUrl={releasePreviewRef.current.get(f.id)}
        onHover={setHoveredId}
        onClick={(id) => {
          const meta = fishMetaRef.current.get(id);
          if (meta) setSelectedFish(meta);
        }}
        isHovered={hoveredId === f.id}
      />
    ),
    [hoveredId]
  );

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-[#0b3e5f]">
      <header
        className="safe-top relative z-20 shrink-0 px-3 pb-2 pt-2 sm:px-6 sm:py-4"
        style={{
          background: "linear-gradient(180deg, rgba(0,30,55,0.55) 0%, transparent 100%)",
        }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-white drop-shadow-md sm:text-2xl">
              🌊 Living Ocean
            </h1>
            <p className="hidden text-sm text-white/70 sm:block">A shared underwater world</p>
          </div>
          <OceanAmbience />
        </div>
        <div className="mt-2 flex items-center justify-between gap-2 sm:mt-3">
          <TankStats stats={stats} />
          <button
            type="button"
            onClick={() => setShowCreator(true)}
            className="hidden rounded-full bg-white/95 px-5 py-2.5 text-sm font-bold text-teal-700 shadow-lg transition hover:bg-white hover:shadow-xl active:scale-95 sm:inline-flex"
          >
            + Add Your Fish
          </button>
        </div>
      </header>

      <div ref={oceanRef} className="relative flex-1 overflow-hidden">
        <OceanBackground />

        <TankParticles />

        <TankBubbles tankWidth={oceanSize.width} tankHeight={oceanSize.height} />

        {fish.map(renderFish)}

        {fish.length === 0 && !releaseVisual && (
          <div className="absolute inset-0 z-[10] flex flex-col items-center justify-center px-6 text-center text-white/55">
            <div className="mb-3 text-5xl sm:mb-4 sm:text-6xl">🐟</div>
            <p className="text-lg font-medium sm:text-xl">The ocean is quiet...</p>
            <p className="mt-2 text-sm">Be the first to release a fish</p>
          </div>
        )}

        {hoveredFish && canHover && (
          <FishTooltip fish={hoveredFish} x={hoveredFish.x} y={hoveredFish.y - FISH_HEIGHT / 2} />
        )}

        {releaseVisual && (
          <ReleaseAnimation
            previewUrl={releaseVisual.previewUrl}
            fishName={releaseVisual.name}
            tankWidth={oceanSize.width}
            tankHeight={oceanSize.height}
            onLand={handleReleaseLand}
            onComplete={handleReleaseAnimationDone}
          />
        )}
      </div>

      <AnimatePresence>
        {selectedFish && (
          <FishModal fish={selectedFish} onClose={() => setSelectedFish(null)} onLike={handleLike} />
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setShowCreator(true)}
        className="safe-bottom fixed bottom-4 left-1/2 z-30 -translate-x-1/2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-teal-700 shadow-xl transition active:scale-95 sm:hidden"
        aria-label="Add your fish"
      >
        + Add Your Fish
      </button>

      <FishCreatorModal
        open={showCreator}
        onClose={() => setShowCreator(false)}
        onRelease={handleReleaseStart}
      />
    </div>
  );
}

export { initSimulation as initSwimmingFish };
