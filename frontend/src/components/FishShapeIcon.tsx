import {
  DEFAULT_COLORS,
  getFishShape,
  type FishShapeTemplate,
  type FillKey,
} from "@/lib/fishTemplate";

interface FishShapeIconProps {
  shapeId: string;
  width?: number;
  height?: number;
  className?: string;
}

function resolveFill(key: FillKey | "none", colors: Record<FillKey, string>): string {
  if (key === "none") return "transparent";
  return colors[key];
}

function CartoonFace({
  shape,
  sw,
}: {
  shape: FishShapeTemplate;
  sw: number;
}) {
  const outline = DEFAULT_COLORS.outline;
  return (
    <>
      <circle cx={shape.eye.cx} cy={shape.eye.cy} r={shape.eye.r}
        fill={DEFAULT_COLORS.eye} stroke={outline} strokeWidth={sw} />
      <circle cx={shape.pupil.cx} cy={shape.pupil.cy} r={shape.pupil.r} fill={DEFAULT_COLORS.pupil} />
      {shape.eyeHighlight && (
        <circle cx={shape.eyeHighlight.cx} cy={shape.eyeHighlight.cy} r={shape.eyeHighlight.r} fill="#FFFFFF" />
      )}
      {shape.eye2 && shape.pupil2 && (
        <>
          <circle cx={shape.eye2.cx} cy={shape.eye2.cy} r={shape.eye2.r}
            fill={DEFAULT_COLORS.eye} stroke={outline} strokeWidth={sw} />
          <circle cx={shape.pupil2.cx} cy={shape.pupil2.cy} r={shape.pupil2.r} fill={DEFAULT_COLORS.pupil} />
          {shape.highlight2 && (
            <circle cx={shape.highlight2.cx} cy={shape.highlight2.cy} r={shape.highlight2.r} fill="#FFFFFF" />
          )}
        </>
      )}
      {shape.mouth && (
        <path d={shape.mouth} fill="none" stroke={outline} strokeWidth={sw * 0.7}
          strokeLinecap="round" strokeLinejoin="round" />
      )}
    </>
  );
}

export function FishShapeIcon({ shapeId, width, height, className }: FishShapeIconProps) {
  const shape = getFishShape(shapeId);
  const w = width ?? 72;
  const h = height ?? Math.round((shape.height / shape.width) * w);
  const colors = shape.defaultColors;
  const sw = shape.outlineWidth;
  const outline = DEFAULT_COLORS.outline;

  return (
    <svg viewBox={`0 0 ${shape.width} ${shape.height}`} width={w} height={h} className={className} aria-hidden>
      {shape.parts.filter((p) => p.fill !== "none").map((part, i) => (
        <path key={i} d={part.d} fill={resolveFill(part.fill, colors)}
          stroke={outline} strokeWidth={sw} strokeLinejoin="round" opacity={part.opacity ?? 1} />
      ))}
      {shape.circles?.map((c, i) => (
        <circle key={`c-${i}`} cx={c.cx} cy={c.cy} r={c.r}
          fill={resolveFill(c.fill, colors)} stroke={outline} strokeWidth={sw * 0.6} opacity={c.opacity ?? 1} />
      ))}
      {shape.strokes?.map((s, i) => (
        <path key={`s-${i}`} d={s.d} fill="none" stroke={resolveFill(s.color, colors)}
          strokeWidth={s.width} strokeLinecap="round" />
      ))}
      <CartoonFace shape={shape} sw={sw} />
    </svg>
  );
}

export function FishShapePathsSvg({
  shape,
  colors,
}: {
  shape: FishShapeTemplate;
  colors: Record<FillKey, string>;
}) {
  const sw = shape.outlineWidth;
  const outline = DEFAULT_COLORS.outline;
  return (
    <>
      {shape.parts.filter((p) => p.fill !== "none").map((part, i) => (
        <path key={i} d={part.d} fill={resolveFill(part.fill, colors)}
          stroke={outline} strokeWidth={sw} strokeLinejoin="round" opacity={part.opacity ?? 1} />
      ))}
      {shape.circles?.map((c, i) => (
        <circle key={`c-${i}`} cx={c.cx} cy={c.cy} r={c.r}
          fill={resolveFill(c.fill, colors)} stroke={outline} strokeWidth={sw * 0.6} opacity={c.opacity ?? 1} />
      ))}
      {shape.strokes?.map((s, i) => (
        <path key={`s-${i}`} d={s.d} fill="none" stroke={resolveFill(s.color, colors)}
          strokeWidth={s.width} strokeLinecap="round" />
      ))}
      <CartoonFace shape={shape} sw={sw} />
    </>
  );
}
