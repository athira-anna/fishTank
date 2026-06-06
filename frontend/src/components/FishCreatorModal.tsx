"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { FishShapeIcon } from "./FishShapeIcon";
import type { FishDesignerHandle } from "./FishDesigner";
import { FISH_SHAPES } from "@/lib/fishTemplate";
import { validateFishName } from "@/lib/utils";

const FishDesigner = dynamic(() => import("./FishDesigner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-400">
      Loading canvas...
    </div>
  ),
});

export interface ReleasePayload {
  name: string;
  creatorName: string;
  drawingData: string;
  imageBlob: Blob;
  previewUrl: string;
}

interface FishCreatorModalProps {
  open: boolean;
  onClose: () => void;
  onRelease: (payload: ReleasePayload) => void;
}

export default function FishCreatorModal({ open, onClose, onRelease }: FishCreatorModalProps) {
  const designerRef = useRef<FishDesignerHandle>(null);
  const [shapeId, setShapeId] = useState(FISH_SHAPES[0].id);
  const [name, setName] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  function handleClose() {
    setError(null);
    onClose();
  }

  function handleRelease() {
    const nameError = validateFishName(name);
    if (nameError) {
      setError(nameError);
      return;
    }

    const exporter = designerRef.current?.exportDrawing;
    if (!exporter) {
      setError("Canvas not ready — please wait a moment");
      return;
    }

    const { blob, drawingData } = exporter();
    const previewUrl = URL.createObjectURL(blob);

    onRelease({
      name: name.trim(),
      creatorName: creatorName.trim() || "Anonymous",
      drawingData,
      imageBlob: blob,
      previewUrl,
    });

    setName("");
    setCreatorName("");
    setShapeId(FISH_SHAPES[0].id);
    setError(null);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Design Your Fish</h2>
            <p className="text-xs text-slate-500">Pick a shape, color it, and release!</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Choose a shape
          </p>
          <div className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {FISH_SHAPES.map((shape) => (
              <button
                key={shape.id}
                type="button"
                onClick={() => setShapeId(shape.id)}
                className={`flex flex-col items-center gap-1 rounded-xl border-2 px-1.5 py-2 transition ${
                  shapeId === shape.id
                    ? "border-blue-500 bg-blue-50 shadow-sm"
                    : "border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white"
                }`}
              >
                <FishShapeIcon shapeId={shape.id} width={52} height={44} />
                <span className="text-[10px] font-medium text-slate-600">{shape.name}</span>
              </button>
            ))}
          </div>

          <FishDesigner ref={designerRef} shapeId={shapeId} />

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-600">
                Fish Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(null); }}
                placeholder="e.g. Bubbles"
                maxLength={20}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">
                Your Name <span className="text-slate-400">(optional)</span>
              </label>
              <input
                type="text"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                placeholder="Anonymous"
                maxLength={50}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {error && (
            <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={handleRelease}
            disabled={!name.trim()}
            className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 py-3 text-sm font-bold text-white shadow-md transition hover:from-blue-600 hover:to-cyan-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            🐟 Release Fish into the Ocean
          </button>
        </div>
      </div>
    </div>
  );
}
