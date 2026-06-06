"use client";

import { Suspense, useEffect, useState } from "react";
import Aquarium from "@/components/Aquarium";
import { fetchFish } from "@/lib/api";
import type { Fish, TankStats } from "@/types/fish";

function TankPage() {
  const [initialFish, setInitialFish] = useState<Fish[]>([]);
  const [initialStats, setInitialStats] = useState<TankStats>({
    total_fish: 0,
    total_creators: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchFish();
        setInitialFish(data.fish);
        setInitialStats(data.stats);
      } catch {
        setError("Could not connect to the ocean. Is the backend running?");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-gradient-to-b from-sky-900 to-blue-600">
        <div className="text-center text-white">
          <div className="mb-4 text-5xl animate-bounce">🐠</div>
          <p className="text-lg font-medium">Diving into the ocean...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-b from-sky-900 to-blue-600 p-6">
        <div className="max-w-md rounded-2xl bg-white/10 p-8 text-center text-white backdrop-blur-sm">
          <div className="mb-4 text-5xl">😢</div>
          <p className="text-lg font-medium">{error}</p>
          <p className="mt-2 text-sm text-white/60">
            Run <code className="rounded bg-white/10 px-1">docker compose up -d</code> and{" "}
            <code className="rounded bg-white/10 px-1">uvicorn app.main:app --reload</code>
          </p>
        </div>
      </div>
    );
  }

  return <Aquarium initialFish={initialFish} initialStats={initialStats} />;
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex h-dvh items-center justify-center bg-gradient-to-b from-sky-900 to-blue-600">
          <div className="text-white text-lg">Loading...</div>
        </div>
      }
    >
      <TankPage />
    </Suspense>
  );
}
