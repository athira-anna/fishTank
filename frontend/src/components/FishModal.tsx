"use client";

import { motion } from "framer-motion";
import { likeFish } from "@/lib/api";
import { formatAge } from "@/lib/utils";
import { useState } from "react";
import type { Fish } from "@/types/fish";

interface FishModalProps {
  fish: Fish;
  onClose: () => void;
  onLike?: (fish: Fish) => void;
}

export default function FishModal({ fish, onClose, onLike }: FishModalProps) {
  const [likes, setLikes] = useState(fish.likes);
  const [liking, setLiking] = useState(false);

  async function handleLike() {
    if (liking) return;
    setLiking(true);
    try {
      const updated = await likeFish(fish.id);
      setLikes(updated.likes);
      onLike?.(updated);
    } catch {
      // ignore
    } finally {
      setLiking(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="safe-bottom w-full max-w-sm rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold text-slate-800">{fish.name}</h2>
        </div>

        <dl className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <dt className="text-slate-500">Created by</dt>
            <dd className="font-medium text-slate-800">{fish.creator_name}</dd>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <dt className="text-slate-500">Age</dt>
            <dd className="font-medium text-slate-800">{formatAge(fish.created_at)}</dd>
          </div>
          <div className="flex justify-between pb-2">
            <dt className="text-slate-500">Likes</dt>
            <dd className="font-medium text-slate-800">{likes}</dd>
          </div>
        </dl>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleLike}
            disabled={liking}
            className="flex-1 rounded-xl bg-rose-100 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-200 disabled:opacity-50"
          >
            ❤️ Like
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-slate-100 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
