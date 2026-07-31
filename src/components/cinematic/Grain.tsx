import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

export default function Grain({ opacity = 0.05 }) {
  const reduce = useReducedMotion();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (reduce) return undefined;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const size = 180;
    canvas.width = size;
    canvas.height = size;

    let raf;
    let frame = 0;

    const draw = () => {
      frame += 1;
      // Redraw every other frame — grain reads as "alive" without doubling
      // the getImageData/putImageData cost every animation frame.
      if (frame % 2 === 0) {
        const imageData = ctx.createImageData(size, size);
        for (let i = 0; i < imageData.data.length; i += 4) {
          const v = Math.random() * 255;
          imageData.data[i] = v;
          imageData.data[i + 1] = v;
          imageData.data[i + 2] = v;
          imageData.data[i + 3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  if (reduce) return null;

  return (
    <canvas
      ref={canvasRef}
      className="grain-canvas"
      style={{ opacity }}
      aria-hidden
    />
  );
}
