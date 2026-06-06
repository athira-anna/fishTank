export type FillKey = "body" | "tail" | "fin" | "belly" | "stripe" | "spot";

export interface FishPart {
  d: string;
  fill: FillKey | "none";
  opacity?: number;
}

export interface FishCircle {
  cx: number;
  cy: number;
  r: number;
  fill: FillKey;
  opacity?: number;
}

/** Thick cartoon tentacle / antenna strokes */
export interface FishStroke {
  d: string;
  color: FillKey;
  width: number;
}

export interface FishShapeTemplate {
  id: string;
  name: string;
  emoji: string;
  width: number;
  height: number;
  outlineWidth: number;
  parts: FishPart[];
  circles?: FishCircle[];
  strokes?: FishStroke[];
  eye: { cx: number; cy: number; r: number };
  pupil: { cx: number; cy: number; r: number };
  eyeHighlight?: { cx: number; cy: number; r: number };
  eye2?: { cx: number; cy: number; r: number };
  pupil2?: { cx: number; cy: number; r: number };
  highlight2?: { cx: number; cy: number; r: number };
  mouth?: string;
  defaultColors: {
    body: string;
    tail: string;
    fin: string;
    belly: string;
    stripe: string;
    spot: string;
  };
}

export const FISH_SHAPES: FishShapeTemplate[] = [
  {
    id: "angelfish",
    name: "Angelfish",
    emoji: "🐠",
    width: 280,
    height: 200,
    outlineWidth: 3.5,
    defaultColors: {
      body: "#FFD54F", tail: "#42A5F5", fin: "#42A5F5",
      belly: "#FFEE58", stripe: "#212121", spot: "#FFEB3B",
    },
    parts: [
      { d: "M 55 100 L 18 65 L 18 135 Z", fill: "tail" },
      { d: "M 55 100 L 245 52 L 245 148 Z", fill: "body" },
      { d: "M 95 58 L 108 142 L 98 142 L 85 58 Z", fill: "stripe" },
      { d: "M 128 54 L 141 146 L 131 146 L 118 54 Z", fill: "stripe" },
      { d: "M 161 52 L 174 148 L 164 148 L 151 52 Z", fill: "stripe" },
      { d: "M 115 148 L 145 175 L 130 148 Z", fill: "fin" },
    ],
    eye: { cx: 210, cy: 92, r: 18 },
    pupil: { cx: 216, cy: 92, r: 8 },
    eyeHighlight: { cx: 204, cy: 86, r: 5 },
    mouth: "M 228 108 Q 238 118, 228 122",
  },
  {
    id: "goldfish",
    name: "Goldfish",
    emoji: "🐟",
    width: 300,
    height: 200,
    outlineWidth: 3.5,
    defaultColors: {
      body: "#FF9800", tail: "#E53935", fin: "#E53935",
      belly: "#FFB74D", stripe: "#FFFFFF", spot: "#FFEB3B",
    },
    parts: [
      { d: "M 72 100 C 25 55, 8 70, 8 100 C 8 130, 25 145, 72 100 Z", fill: "tail" },
      { d: "M 72 100 C 72 42, 130 28, 185 38 C 235 47, 265 68, 265 100 C 265 132, 235 153, 185 162 C 130 172, 72 158, 72 100 Z", fill: "body" },
      { d: "M 105 162 C 150 175, 210 168, 240 145 C 200 172, 140 178, 105 162 Z", fill: "belly", opacity: 0.55 },
      { d: "M 118 28 L 128 8 L 138 28 L 148 5 L 158 28 L 168 10 L 178 30 L 188 18 L 195 32 L 120 35 Z", fill: "fin" },
      { d: "M 145 155 L 162 178 L 148 158 Z", fill: "fin" },
    ],
    eye: { cx: 215, cy: 82, r: 22 },
    pupil: { cx: 222, cy: 82, r: 10 },
    eyeHighlight: { cx: 208, cy: 74, r: 6 },
    mouth: "M 240 108 Q 252 118, 240 124",
  },
  {
    id: "spotted",
    name: "Spotted",
    emoji: "🐡",
    width: 280,
    height: 180,
    outlineWidth: 3.5,
    defaultColors: {
      body: "#4DD0E1", tail: "#EF5350", fin: "#EF5350",
      belly: "#F48FB1", stripe: "#FFEB3B", spot: "#FFEB3B",
    },
    parts: [
      { d: "M 52 90 L 20 65 L 20 90 L 20 115 L 52 90 Z", fill: "tail" },
      { d: "M 52 90 C 52 45, 110 32, 170 42 C 220 50, 250 65, 250 90 C 250 115, 220 130, 170 138 C 110 146, 52 135, 52 90 Z", fill: "body" },
      { d: "M 130 42 L 145 28 L 140 45 Z", fill: "fin" },
      { d: "M 135 138 L 150 158 L 140 140 Z", fill: "fin" },
    ],
    circles: [
      { cx: 120, cy: 72, r: 14, fill: "spot" },
      { cx: 165, cy: 88, r: 12, fill: "spot" },
      { cx: 145, cy: 110, r: 10, fill: "belly" },
      { cx: 195, cy: 78, r: 11, fill: "belly" },
      { cx: 100, cy: 98, r: 9, fill: "spot" },
    ],
    eye: { cx: 215, cy: 78, r: 20 },
    pupil: { cx: 222, cy: 78, r: 9 },
    eyeHighlight: { cx: 208, cy: 70, r: 5 },
    mouth: "M 232 98 Q 244 108, 232 112",
  },
  {
    id: "bluetang",
    name: "Blue Tang",
    emoji: "🐬",
    width: 280,
    height: 180,
    outlineWidth: 3.5,
    defaultColors: {
      body: "#1565C0", tail: "#1565C0", fin: "#FDD835",
      belly: "#42A5F5", stripe: "#64B5F6", spot: "#FFFFFF",
    },
    parts: [
      { d: "M 50 90 C 20 65, 10 75, 10 90 C 10 105, 20 115, 50 90 Z", fill: "tail" },
      { d: "M 50 90 C 50 40, 115 28, 175 38 C 225 46, 255 62, 255 90 C 255 118, 225 134, 175 142 C 115 152, 50 140, 50 90 Z", fill: "body" },
      { d: "M 95 45 Q 140 35, 185 42 Q 140 50, 95 45 Z", fill: "stripe", opacity: 0.55 },
      { d: "M 100 118 Q 155 128, 200 115 Q 155 122, 100 118 Z", fill: "stripe", opacity: 0.45 },
      { d: "M 115 28 L 175 18 L 168 42 L 122 45 Z", fill: "fin" },
      { d: "M 155 95 L 178 115 L 158 100 Z", fill: "fin" },
    ],
    eye: { cx: 210, cy: 75, r: 19 },
    pupil: { cx: 217, cy: 75, r: 8 },
    eyeHighlight: { cx: 203, cy: 68, r: 5 },
    mouth: "M 235 95 Q 246 102, 235 106",
  },
  {
    id: "clownfish",
    name: "Clownfish",
    emoji: "🤡",
    width: 280,
    height: 160,
    outlineWidth: 3.5,
    defaultColors: {
      body: "#FF6D00", tail: "#E65100", fin: "#FF9100",
      belly: "#FFAB40", stripe: "#FFFFFF", spot: "#FFEB3B",
    },
    parts: [
      { d: "M 48 80 C 22 58, 8 62, 8 80 C 8 98, 22 102, 48 80 Z", fill: "tail" },
      { d: "M 48 80 C 48 42, 100 30, 155 38 C 210 46, 248 58, 248 80 C 248 102, 210 114, 155 122 C 100 130, 48 118, 48 80 Z", fill: "body" },
      { d: "M 95 35 L 108 125 L 98 125 L 85 35 Z", fill: "stripe" },
      { d: "M 138 32 L 151 128 L 141 128 L 128 32 Z", fill: "stripe" },
      { d: "M 178 38 L 191 122 L 181 122 L 168 38 Z", fill: "stripe" },
      { d: "M 108 125 L 125 148 L 115 125 Z", fill: "fin" },
      { d: "M 108 35 L 125 15 L 115 35 Z", fill: "fin" },
    ],
    eye: { cx: 215, cy: 68, r: 18 },
    pupil: { cx: 221, cy: 68, r: 8 },
    eyeHighlight: { cx: 209, cy: 61, r: 5 },
    mouth: "M 230 88 Q 242 96, 230 100",
  },
  {
    id: "crab",
    name: "Crab",
    emoji: "🦀",
    width: 260,
    height: 200,
    outlineWidth: 3.5,
    defaultColors: {
      body: "#E53935", tail: "#C62828", fin: "#EF5350",
      belly: "#FF7043", stripe: "#FFFFFF", spot: "#FFEB3B",
    },
    parts: [
      { d: "M 130 115 C 130 75, 175 65, 210 80 C 235 90, 240 115, 235 140 C 225 165, 195 175, 160 172 C 125 169, 130 145, 130 115 Z", fill: "body" },
      { d: "M 175 65 L 195 25 L 210 45 L 195 70 Z", fill: "fin" },
      { d: "M 195 70 L 230 35 L 245 55 L 215 85 Z", fill: "fin" },
      { d: "M 140 155 L 125 175 L 115 165 L 130 148 Z", fill: "tail" },
      { d: "M 155 162 L 148 182 L 138 175 L 148 158 Z", fill: "tail" },
      { d: "M 170 165 L 165 188 L 155 182 L 162 162 Z", fill: "tail" },
      { d: "M 188 162 L 192 185 L 182 188 L 178 165 Z", fill: "tail" },
      { d: "M 205 155 L 215 178 L 205 182 L 195 160 Z", fill: "tail" },
      { d: "M 218 148 L 232 168 L 222 172 L 210 152 Z", fill: "tail" },
    ],
    circles: [
      { cx: 178, cy: 32, r: 11, fill: "stripe" },
      { cx: 218, cy: 28, r: 11, fill: "stripe" },
    ],
    strokes: [
      { d: "M 178 42 L 178 52", color: "body", width: 5 },
      { d: "M 218 38 L 218 48", color: "body", width: 5 },
    ],
    eye: { cx: 178, cy: 32, r: 9 },
    pupil: { cx: 180, cy: 32, r: 4 },
    eyeHighlight: { cx: 175, cy: 29, r: 2.5 },
    eye2: { cx: 218, cy: 28, r: 9 },
    pupil2: { cx: 220, cy: 28, r: 4 },
    highlight2: { cx: 215, cy: 25, r: 2.5 },
    mouth: "M 215 108 Q 225 115, 215 118",
  },
  {
    id: "starfish",
    name: "Starfish",
    emoji: "⭐",
    width: 200,
    height: 200,
    outlineWidth: 3.5,
    defaultColors: {
      body: "#FF7043", tail: "#FF7043", fin: "#FF7043",
      belly: "#FFAB91", stripe: "#FFFFFF", spot: "#FFEB3B",
    },
    parts: [
      { d: "M 100 175 L 118 128 L 168 128 L 128 98 L 145 48 L 100 78 L 55 48 L 72 98 L 32 128 L 82 128 Z", fill: "body" },
    ],
    circles: [
      { cx: 72, cy: 108, r: 8, fill: "spot" },
      { cx: 128, cy: 108, r: 8, fill: "spot" },
      { cx: 88, cy: 128, r: 7, fill: "spot" },
      { cx: 112, cy: 128, r: 7, fill: "spot" },
      { cx: 100, cy: 95, r: 6, fill: "spot" },
    ],
    eye: { cx: 82, cy: 98, r: 14 },
    pupil: { cx: 85, cy: 98, r: 6 },
    eyeHighlight: { cx: 78, cy: 93, r: 3.5 },
    eye2: { cx: 118, cy: 98, r: 14 },
    pupil2: { cx: 121, cy: 98, r: 6 },
    highlight2: { cx: 114, cy: 93, r: 3.5 },
    mouth: "M 88 118 Q 100 128, 112 118",
  },
  {
    id: "seahorse",
    name: "Seahorse",
    emoji: "🐚",
    width: 160,
    height: 260,
    outlineWidth: 3.5,
    defaultColors: {
      body: "#FF9800", tail: "#F57C00", fin: "#FDD835",
      belly: "#FFE082", stripe: "#FFEB3B", spot: "#FFFFFF",
    },
    parts: [
      { d: "M 80 235 C 55 220, 45 195, 50 170 C 55 145, 68 130, 72 115 C 76 100, 72 85, 68 72 C 64 58, 62 45, 68 35 C 74 25, 86 22, 96 28 C 106 34, 110 48, 108 62 C 106 76, 98 88, 95 102 C 92 116, 95 130, 100 145 C 105 160, 112 175, 118 190 C 124 205, 128 220, 120 235 C 112 248, 95 248, 80 235 Z", fill: "body" },
      { d: "M 78 130 Q 95 135, 78 140 Q 61 135, 78 130 Z", fill: "stripe", opacity: 0.85 },
      { d: "M 78 155 Q 95 160, 78 165 Q 61 160, 78 155 Z", fill: "stripe", opacity: 0.85 },
      { d: "M 78 180 Q 95 185, 78 190 Q 61 185, 78 180 Z", fill: "stripe", opacity: 0.85 },
      { d: "M 78 205 Q 95 210, 78 215 Q 61 210, 78 205 Z", fill: "stripe", opacity: 0.85 },
      { d: "M 108 55 L 135 48 L 125 62 L 108 58 Z", fill: "fin" },
    ],
    eye: { cx: 92, cy: 42, r: 14 },
    pupil: { cx: 96, cy: 42, r: 6 },
    eyeHighlight: { cx: 88, cy: 37, r: 4 },
    mouth: "M 108 52 Q 118 58, 108 60",
  },
  {
    id: "turtle",
    name: "Turtle",
    emoji: "🐢",
    width: 300,
    height: 180,
    outlineWidth: 3.5,
    defaultColors: {
      body: "#66BB6A", tail: "#43A047", fin: "#81C784",
      belly: "#A5D6A7", stripe: "#FFE082", spot: "#FFFFFF",
    },
    parts: [
      { d: "M 245 95 C 260 88, 268 95, 262 105 C 255 112, 242 108, 245 95 Z", fill: "body" },
      { d: "M 248 95 L 278 88 L 278 102 L 248 108 Z", fill: "body" },
      { d: "M 55 105 C 55 55, 120 40, 185 48 C 230 54, 245 70, 245 95 C 245 120, 230 136, 185 142 C 120 150, 55 135, 55 105 Z", fill: "body" },
      { d: "M 90 65 L 105 80 L 90 95 L 75 80 Z", fill: "stripe", opacity: 0.85 },
      { d: "M 130 58 L 145 73 L 130 88 L 115 73 Z", fill: "stripe", opacity: 0.85 },
      { d: "M 170 58 L 185 73 L 170 88 L 155 73 Z", fill: "stripe", opacity: 0.85 },
      { d: "M 110 95 L 125 110 L 110 125 L 95 110 Z", fill: "stripe", opacity: 0.85 },
      { d: "M 150 95 L 165 110 L 150 125 L 135 110 Z", fill: "stripe", opacity: 0.85 },
      { d: "M 190 88 L 205 103 L 190 118 L 175 103 Z", fill: "stripe", opacity: 0.85 },
      { d: "M 30 115 L 55 105 L 48 125 L 25 128 Z", fill: "fin" },
      { d: "M 55 142 L 80 135 L 72 152 L 48 155 Z", fill: "fin" },
      { d: "M 195 138 L 220 132 L 212 150 L 188 152 Z", fill: "fin" },
      { d: "M 218 108 L 242 102 L 235 118 L 212 122 Z", fill: "fin" },
    ],
    eye: { cx: 262, cy: 92, r: 10 },
    pupil: { cx: 265, cy: 92, r: 4.5 },
    eyeHighlight: { cx: 259, cy: 88, r: 2.5 },
    mouth: "M 272 100 Q 278 104, 272 106",
  },
  {
    id: "octopus",
    name: "Octopus",
    emoji: "🐙",
    width: 260,
    height: 220,
    outlineWidth: 3.5,
    defaultColors: {
      body: "#F48FB1", tail: "#EC407A", fin: "#F48FB1",
      belly: "#F8BBD9", stripe: "#FFFFFF", spot: "#FFEB3B",
    },
    parts: [
      { d: "M 175 55 C 175 25, 215 15, 235 40 C 250 60, 245 90, 220 105 C 200 118, 170 110, 160 90 C 150 70, 155 45, 175 55 Z", fill: "body" },
      { d: "M 130 100 C 95 125, 65 155, 42 195 C 38 205, 35 215, 32 218 L 48 218 C 55 200, 68 175, 85 150 C 100 128, 118 112, 135 105 Z", fill: "tail" },
      { d: "M 140 105 C 118 135, 102 165, 92 195 C 88 208, 86 218, 85 220 L 98 220 C 102 205, 108 178, 118 152 C 128 128, 138 115, 145 108 Z", fill: "tail" },
      { d: "M 155 108 C 148 140, 145 168, 148 195 C 150 208, 152 218, 155 220 L 168 218 C 165 200, 162 172, 162 145 C 162 125, 158 115, 155 108 Z", fill: "tail" },
      { d: "M 175 108 C 188 138, 200 165, 210 192 C 215 205, 220 215, 225 218 L 238 215 C 230 195, 218 168, 205 142 C 192 120, 182 110, 175 108 Z", fill: "tail" },
      { d: "M 195 105 C 215 128, 235 155, 248 185 C 252 198, 255 210, 256 218 L 242 218 C 235 200, 225 175, 212 150 C 200 128, 188 112, 180 105 Z", fill: "tail" },
      { d: "M 210 100 C 232 118, 248 142, 255 168 C 258 182, 260 198, 258 210 L 245 208 C 240 188, 232 165, 220 142 C 208 120, 198 108, 190 102 Z", fill: "tail" },
    ],
    eye: { cx: 195, cy: 58, r: 16 },
    pupil: { cx: 200, cy: 58, r: 7 },
    eyeHighlight: { cx: 190, cy: 52, r: 4.5 },
    eye2: { cx: 228, cy: 62, r: 16 },
    pupil2: { cx: 233, cy: 62, r: 7 },
    highlight2: { cx: 223, cy: 56, r: 4.5 },
    mouth: "M 205 82 Q 215 90, 205 92",
  },
];

export const DEFAULT_SHAPE = FISH_SHAPES[0];

export function getFishShape(id: string): FishShapeTemplate {
  return FISH_SHAPES.find((s) => s.id === id) ?? DEFAULT_SHAPE;
}

export const FISH_TEMPLATE = FISH_SHAPES[0];

export const DEFAULT_COLORS = {
  body: "#FFD54F",
  tail: "#42A5F5",
  fin: "#42A5F5",
  belly: "#FFEE58",
  stripe: "#212121",
  spot: "#FFEB3B",
  eye: "#FFFFFF",
  pupil: "#1a1a1a",
  outline: "#2D2D2D",
};

export const PRESET_COLORS = [
  "#FFD54F", "#FF9800", "#FF7043", "#EF5350",
  "#42A5F5", "#1565C0", "#66BB6A", "#F48FB1",
  "#FFEB3B", "#FDD835", "#FFFFFF", "#212121",
  "#4DD0E1", "#AB47BC", "#E53935", "#37474F",
];

export function getDefaultColorsForShape(shapeId: string) {
  return getFishShape(shapeId).defaultColors;
}
