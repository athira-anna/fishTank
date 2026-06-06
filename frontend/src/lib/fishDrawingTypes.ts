import type { FillKey } from "./fishTemplate";

export interface StoredDrawLine {
  tool: "pencil" | "eraser" | "fill";
  color: string;
  points: number[];
  strokeWidth: number;
}

export interface StoredDrawingData {
  shapeId: string;
  lines: StoredDrawLine[];
  colors: Record<FillKey, string>;
}

export function parseDrawingData(raw: string | null): StoredDrawingData | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<StoredDrawingData>;
    if (!parsed.shapeId || !parsed.colors) return null;
    return {
      shapeId: parsed.shapeId,
      lines: Array.isArray(parsed.lines) ? parsed.lines : [],
      colors: parsed.colors as Record<FillKey, string>,
    };
  } catch {
    return null;
  }
}
