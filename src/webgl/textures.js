import * as THREE from "three";

// Canvas-generated procedural textures for the WebGL hero scene. Both are
// memoized module-singletons — cheap to build once, reused across every
// DustField/LightShafts instance (Home/SquareMile/Books all mount HeroScene).
// Flat geometry + flat opacity reads as a hard-edged cutout; a soft alpha
// gradient is what makes a shape read as "glow" instead of "sticker."

let dustTexture = null;

export function getDustTexture() {
  if (dustTexture) return dustTexture;

  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.35, "rgba(255,255,255,0.65)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  dustTexture = new THREE.CanvasTexture(canvas);
  return dustTexture;
}

let shaftTexture = null;

export function getShaftTexture() {
  if (shaftTexture) return shaftTexture;

  const w = 64;
  const h = 256;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");

  // Horizontal falloff — a wide, gently-curved wash instead of a sharp
  // triangular peak. A knife-edge peak (single stop at full opacity) reads
  // as a hard line once additively blended with neighboring shafts; a
  // broad, lower-opacity plateau with gaussian-like shoulders reads as
  // soft light instead.
  const hGrad = ctx.createLinearGradient(0, 0, w, 0);
  hGrad.addColorStop(0, "rgba(255,255,255,0)");
  hGrad.addColorStop(0.3, "rgba(255,255,255,0.55)");
  hGrad.addColorStop(0.5, "rgba(255,255,255,0.75)");
  hGrad.addColorStop(0.7, "rgba(255,255,255,0.55)");
  hGrad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = hGrad;
  ctx.fillRect(0, 0, w, h);

  // Vertical falloff, multiplied in via destination-in so the top/bottom
  // ends taper instead of ending in a straight cut line.
  ctx.globalCompositeOperation = "destination-in";
  const vGrad = ctx.createLinearGradient(0, 0, 0, h);
  vGrad.addColorStop(0, "rgba(255,255,255,0)");
  vGrad.addColorStop(0.25, "rgba(255,255,255,1)");
  vGrad.addColorStop(0.75, "rgba(255,255,255,1)");
  vGrad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = vGrad;
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "source-over";

  shaftTexture = new THREE.CanvasTexture(canvas);
  return shaftTexture;
}
