import { DetectedObject, ObjectDetection } from "@tensorflow-models/coco-ssd";

export function drawOnCanvas(
  mirrored: boolean,
  predictions: DetectedObject[],
  context: CanvasRenderingContext2D | null | undefined
) {
  predictions.forEach((detectedObject: DetectedObject) => {
    const { class: name, bbox, score } = detectedObject;
    const [x, y, width, height] = bbox;

    if (context) {
      context.beginPath();
      context.fillStyle = name === "person" ? "#FF0F0F" : "#00B612";
      context.globalAlpha = 0.4;

      mirrored
        ? context.roundRect(context.canvas.width - x, y, -width, height, 8)
        : context.roundRect(x, y, width, height, 8);

      context.fill();
      context.font = "12px Courier New";
      context.fillStyle = "black";
      context.globalAlpha = 1;

      mirrored
        ? context.fillText(name, context.canvas.width - x - width + 10, y + 20)
        : context.fillText(name, x + 10, y + 20);
    }
  });
}
