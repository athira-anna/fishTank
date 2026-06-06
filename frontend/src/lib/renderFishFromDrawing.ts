import Konva from "konva";
import type { StoredDrawingData } from "./fishDrawingTypes";
import { DEFAULT_COLORS, getFishShape, type FillKey } from "./fishTemplate";

function dataUrlToBlob(dataUrl: string): Blob {
  const byteString = atob(dataUrl.split(",")[1]);
  const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

/** Re-render a fish PNG from stored drawing_data (same output as the designer export). */
export function renderFishFromDrawing(data: StoredDrawingData): Blob {
  const shape = getFishShape(data.shapeId);
  const colors = data.colors;
  const outline = DEFAULT_COLORS.outline;
  const sw = shape.outlineWidth;

  const container = document.createElement("div");
  const stage = new Konva.Stage({
    container,
    width: shape.width,
    height: shape.height,
  });
  const layer = new Konva.Layer();
  stage.add(layer);

  for (const part of shape.parts.filter((p) => p.fill !== "none")) {
    layer.add(
      new Konva.Path({
        data: part.d,
        fill: colors[part.fill as FillKey],
        stroke: outline,
        strokeWidth: sw,
        lineJoin: "round",
        opacity: part.opacity ?? 1,
      })
    );
  }

  for (const c of shape.circles ?? []) {
    layer.add(
      new Konva.Circle({
        x: c.cx,
        y: c.cy,
        radius: c.r,
        fill: colors[c.fill],
        stroke: outline,
        strokeWidth: sw * 0.6,
        opacity: c.opacity ?? 1,
      })
    );
  }

  for (const s of shape.strokes ?? []) {
    layer.add(
      new Konva.Path({
        data: s.d,
        stroke: colors[s.color],
        strokeWidth: s.width,
        lineCap: "round",
      })
    );
  }

  layer.add(
    new Konva.Circle({
      x: shape.eye.cx,
      y: shape.eye.cy,
      radius: shape.eye.r,
      fill: DEFAULT_COLORS.eye,
      stroke: outline,
      strokeWidth: sw,
    })
  );
  layer.add(
    new Konva.Circle({
      x: shape.pupil.cx,
      y: shape.pupil.cy,
      radius: shape.pupil.r,
      fill: DEFAULT_COLORS.pupil,
    })
  );

  if (shape.eyeHighlight) {
    layer.add(
      new Konva.Circle({
        x: shape.eyeHighlight.cx,
        y: shape.eyeHighlight.cy,
        radius: shape.eyeHighlight.r,
        fill: "#FFFFFF",
      })
    );
  }

  if (shape.eye2 && shape.pupil2) {
    layer.add(
      new Konva.Circle({
        x: shape.eye2.cx,
        y: shape.eye2.cy,
        radius: shape.eye2.r,
        fill: DEFAULT_COLORS.eye,
        stroke: outline,
        strokeWidth: sw,
      })
    );
    layer.add(
      new Konva.Circle({
        x: shape.pupil2.cx,
        y: shape.pupil2.cy,
        radius: shape.pupil2.r,
        fill: DEFAULT_COLORS.pupil,
      })
    );
    if (shape.highlight2) {
      layer.add(
        new Konva.Circle({
          x: shape.highlight2.cx,
          y: shape.highlight2.cy,
          radius: shape.highlight2.r,
          fill: "#FFFFFF",
        })
      );
    }
  }

  if (shape.mouth) {
    layer.add(
      new Konva.Path({
        data: shape.mouth,
        stroke: outline,
        strokeWidth: sw * 0.7,
        lineCap: "round",
      })
    );
  }

  for (const line of data.lines) {
    layer.add(
      new Konva.Line({
        points: line.points,
        stroke: line.color,
        strokeWidth: line.strokeWidth,
        tension: 0.5,
        lineCap: "round",
        lineJoin: "round",
        globalCompositeOperation:
          line.tool === "eraser" ? "destination-out" : "source-over",
      })
    );
  }

  layer.draw();
  const dataUrl = stage.toDataURL({ pixelRatio: 2 });
  stage.destroy();
  container.remove();

  return dataUrlToBlob(dataUrl);
}
