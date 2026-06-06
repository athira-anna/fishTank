import type { Fish, FishListResponse } from "@/types/fish";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function getImageUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}

export async function fetchFish(): Promise<FishListResponse> {
  const res = await fetch(`${API_BASE}/fish`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch fish");
  return res.json();
}

export async function fetchFishById(id: string): Promise<Fish> {
  const res = await fetch(`${API_BASE}/fish/${id}`);
  if (!res.ok) throw new Error("Fish not found");
  return res.json();
}

export async function createFish(data: {
  name: string;
  creatorName: string;
  drawingData: string;
  imageBlob: Blob;
}): Promise<Fish> {
  const form = new FormData();
  form.append("name", data.name);
  form.append("creator_name", data.creatorName);
  form.append("drawing_data", data.drawingData);
  form.append("image", data.imageBlob, "fish.png");

  const res = await fetch(`${API_BASE}/fish`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to create fish" }));
    throw new Error(err.detail || "Failed to create fish");
  }
  return res.json();
}

export async function likeFish(id: string): Promise<Fish> {
  const res = await fetch(`${API_BASE}/fish/${id}/like`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to like fish");
  return res.json();
}

/** Re-upload a PNG recreated from drawing_data and update image_url in the DB. */
export async function restoreFishImage(id: string, imageBlob: Blob): Promise<Fish> {
  const form = new FormData();
  form.append("image", imageBlob, "fish.png");

  const res = await fetch(`${API_BASE}/fish/${id}/restore-image`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to restore fish image" }));
    throw new Error(err.detail || "Failed to restore fish image");
  }
  return res.json();
}
