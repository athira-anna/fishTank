"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "ocean-sound-enabled";
/** Pixabay / Freesound aquarium ambience (Legnalegna55) */
const OCEAN_AUDIO_SRC = "/sounds/ocean-ambience.mp3?v=aquarium-6891";
const TARGET_VOLUME = 0.14;
const FADE_MS = 2200;

export default function OceanAmbience() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "true") setEnabled(true);
    } catch {
      /* private browsing */
    }

    const audio = new Audio(OCEAN_AUDIO_SRC);
    audio.loop = true;
    audio.volume = 0;
    audio.preload = "auto";
    audio.onerror = () => setEnabled(false);
    audioRef.current = audio;
    setReady(true);

    return () => {
      if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  const fadeTo = useCallback((target: number, onDone?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeRef.current) cancelAnimationFrame(fadeRef.current);

    const start = audio.volume;
    const startTime = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / FADE_MS);
      const eased = t * t * (3 - 2 * t);
      audio.volume = start + (target - start) * eased;
      if (t < 1) {
        fadeRef.current = requestAnimationFrame(tick);
      } else {
        fadeRef.current = null;
        onDone?.();
      }
    };
    fadeRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !ready) return;

    if (enabled) {
      audio.play().catch(() => setEnabled(false));
      fadeTo(TARGET_VOLUME);
    } else {
      fadeTo(0, () => audio.pause());
    }

    try {
      localStorage.setItem(STORAGE_KEY, String(enabled));
    } catch {
      /* ignore */
    }
  }, [enabled, ready, fadeTo]);

  const toggle = useCallback(() => setEnabled((v) => !v), []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={enabled ? "Mute ocean ambience" : "Play mild ocean ambience"}
      title={enabled ? "Mute ocean sounds" : "Play ocean sounds"}
      className={`touch-target flex shrink-0 items-center justify-center transition ${
        enabled ? "text-white hover:text-white/90" : "text-white/60 hover:text-white/90"
      }`}
    >
      {enabled ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
        </svg>
      )}
    </button>
  );
}
