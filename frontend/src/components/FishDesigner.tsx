"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Stage, Layer, Line, Group, Path, Circle } from "react-konva";
import type Konva from "konva";
import {
  DEFAULT_COLORS,
  getDefaultColorsForShape,
  getFishShape,
  PRESET_COLORS,
  type FillKey,
} from "@/lib/fishTemplate";

type Tool = "pencil" | "eraser" | "fill";

export interface FishDesignerHandle {
  exportDrawing: () => { blob: Blob; drawingData: string };
}

interface FishDesignerProps {
  shapeId: string;
}

interface DrawLine {
  tool: Tool;
  color: string;
  points: number[];
  strokeWidth: number;
}

type ColorState = Record<FillKey, string>;

const CANVAS_MAX_W = 480;

function FishShapePathsKonva({
  shapeId,
  colors,
}: {
  shapeId: string;
  colors: ColorState;
}) {
  const shape = getFishShape(shapeId);
  const outline = DEFAULT_COLORS.outline;
  const sw = shape.outlineWidth;

  return (
    <>
      {shape.parts.filter((p) => p.fill !== "none").map((part, i) => (
        <Path
          key={i}
          data={part.d}
          fill={colors[part.fill as FillKey]}
          stroke={outline}
          strokeWidth={sw}
          lineJoin="round"
          opacity={part.opacity ?? 1}
        />
      ))}
      {shape.circles?.map((c, i) => (
        <Circle
          key={`c-${i}`}
          x={c.cx}
          y={c.cy}
          radius={c.r}
          fill={colors[c.fill]}
          stroke={outline}
          strokeWidth={sw * 0.6}
          opacity={c.opacity ?? 1}
        />
      ))}
      {shape.strokes?.map((s, i) => (
        <Path
          key={`s-${i}`}
          data={s.d}
          stroke={colors[s.color]}
          strokeWidth={s.width}
          lineCap="round"
        />
      ))}
      <Circle {...shape.eye} fill={DEFAULT_COLORS.eye} stroke={outline} strokeWidth={sw} />
      <Circle {...shape.pupil} fill={DEFAULT_COLORS.pupil} />
      {shape.eyeHighlight && (
        <Circle {...shape.eyeHighlight} fill="#FFFFFF" />
      )}
      {shape.eye2 && shape.pupil2 && (
        <>
          <Circle {...shape.eye2} fill={DEFAULT_COLORS.eye} stroke={outline} strokeWidth={sw} />
          <Circle {...shape.pupil2} fill={DEFAULT_COLORS.pupil} />
          {shape.highlight2 && <Circle {...shape.highlight2} fill="#FFFFFF" />}
        </>
      )}
      {shape.mouth && (
        <Path data={shape.mouth} stroke={outline} strokeWidth={sw * 0.7} lineCap="round" />
      )}
    </>
  );
}

const FishDesigner = forwardRef<FishDesignerHandle, FishDesignerProps>(
  function FishDesigner({ shapeId }, ref) {
    const stageRef = useRef<Konva.Stage>(null);
    const shape = getFishShape(shapeId);
    const scale = Math.min(1, CANVAS_MAX_W / shape.width);
    const stageW = Math.round(shape.width * scale);
    const stageH = Math.round(shape.height * scale);

    const [tool, setTool] = useState<Tool>("pencil");
    const [color, setColor] = useState("#FF6B4A");
    const [fillTarget, setFillTarget] = useState<FillKey>("body");
    const [colors, setColors] = useState<ColorState>(() => getDefaultColorsForShape(shapeId));
    const [lines, setLines] = useState<DrawLine[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [history, setHistory] = useState<DrawLine[][]>([[]]);

    useEffect(() => {
      const defaults = getDefaultColorsForShape(shapeId);
      setColors(defaults);
      setColor(defaults.body);
      setFillTarget("body");
      setLines([]);
      setHistory([[]]);
    }, [shapeId]);

    const exportDrawing = useCallback(() => {
      const stage = stageRef.current;
      if (!stage) throw new Error("Canvas not ready");

      const dataUrl = stage.toDataURL({ pixelRatio: 2 });
      const drawingData = JSON.stringify({ shapeId, lines, colors });

      const byteString = atob(dataUrl.split(",")[1]);
      const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return { blob: new Blob([ab], { type: mimeString }), drawingData };
    }, [shapeId, lines, colors]);

    useImperativeHandle(ref, () => ({ exportDrawing }), [exportDrawing]);

    function handleMouseDown(e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) {
      if (tool === "fill") return;
      setIsDrawing(true);
      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) return;
      setLines((prev) => [
        ...prev,
        {
          tool,
          color: tool === "eraser" ? "#ffffff" : color,
          points: [pos.x / scale, pos.y / scale],
          strokeWidth: tool === "eraser" ? 14 : 3.5,
        },
      ]);
    }

    function handleMouseMove(e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) {
      if (!isDrawing || tool === "fill") return;
      const point = e.target.getStage()?.getPointerPosition();
      if (!point) return;
      setLines((prev) => {
        const last = prev[prev.length - 1];
        if (!last) return prev;
        return [
          ...prev.slice(0, -1),
          { ...last, points: [...last.points, point.x / scale, point.y / scale] },
        ];
      });
    }

    function handleMouseUp() {
      if (isDrawing) setHistory((h) => [...h, lines]);
      setIsDrawing(false);
    }

    function handleUndo() {
      if (history.length <= 1) return;
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setLines(newHistory[newHistory.length - 1] || []);
    }

    function handleClear() {
      setLines([]);
      setHistory([[]]);
      setColors(getDefaultColorsForShape(shapeId));
    }

    const fillTargets: { key: FillKey; label: string }[] = [
      { key: "body", label: "Body" },
      { key: "tail", label: "Tail" },
      { key: "fin", label: "Fins" },
      { key: "belly", label: "Belly" },
      ...(shape.parts.some((p) => p.fill === "stripe") || shape.circles?.some((c) => c.fill === "stripe")
        ? [{ key: "stripe" as FillKey, label: "Stripes" }]
        : []),
      ...(shape.circles?.some((c) => c.fill === "spot") || shape.parts.some((p) => p.fill === "spot")
        ? [{ key: "spot" as FillKey, label: "Spots" }]
        : []),
    ];

    return (
      <div className="rounded-xl bg-slate-50 p-3">
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: "pencil" as Tool, label: "Pencil", icon: "✏️" },
              { id: "eraser" as Tool, label: "Eraser", icon: "🧹" },
              { id: "fill" as Tool, label: "Fill", icon: "🪣" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTool(t.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                tool === t.id ? "bg-blue-500 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
          <div className="mx-0.5 h-5 w-px bg-slate-200" />
          <button type="button" onClick={handleUndo} disabled={history.length <= 1}
            className="rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40">
            ↩ Undo
          </button>
          <button type="button" onClick={handleClear}
            className="rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100">
            🗑 Reset
          </button>
        </div>

        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          {PRESET_COLORS.slice(0, 12).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setColor(c);
                if (tool === "fill") setColors((prev) => ({ ...prev, [fillTarget]: c }));
              }}
              className={`h-6 w-6 rounded-full border-2 transition hover:scale-110 ${
                color === c ? "border-blue-500 scale-110" : "border-white shadow-sm"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
            className="h-6 w-6 cursor-pointer rounded border-0" title="Custom color" />
        </div>

        {tool === "fill" && (
          <div className="mb-2 flex flex-wrap items-center gap-2 rounded-lg bg-blue-50 px-2 py-1.5 text-xs">
            <span className="font-medium text-blue-600">Fill part:</span>
            {fillTargets.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setFillTarget(key);
                  setColors((prev) => ({ ...prev, [key]: color }));
                }}
                className={`flex items-center gap-1 rounded px-2 py-0.5 shadow-sm transition ${
                  fillTarget === key ? "bg-blue-500 text-white" : "bg-white text-slate-600"
                }`}
              >
                <span className="h-3 w-3 rounded-full border border-white/50"
                  style={{ backgroundColor: colors[key] }} />
                {label}
              </button>
            ))}
          </div>
        )}

        <div className="flex justify-center overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-b from-sky-100 to-sky-200 p-3">
          <Stage
            ref={stageRef}
            width={stageW}
            height={stageH}
            scaleX={scale}
            scaleY={scale}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
          >
            <Layer>
              <Group>
                <FishShapePathsKonva shapeId={shapeId} colors={colors} />
              </Group>
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={line.color}
                  strokeWidth={line.strokeWidth}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation={
                    line.tool === "eraser" ? "destination-out" : "source-over"
                  }
                />
              ))}
            </Layer>
          </Stage>
        </div>
      </div>
    );
  }
);

export default FishDesigner;
