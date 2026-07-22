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
  dustTexture.wrapS = THREE.ClampToEdgeWrapping;
  dustTexture.wrapT = THREE.ClampToEdgeWrapping;
  dustTexture.minFilter = THREE.LinearFilter;
  dustTexture.magFilter = THREE.LinearFilter;
  dustTexture.generateMipmaps = false;
  dustTexture.needsUpdate = true;
  return dustTexture;
}

let shaftTexture = null;

/**
 * Soft volumetric light-shaft map.
 *
 * Prior versions used a linear horizontal gradient that still left a hard
 * silhouette once additively blended on a plane mesh — the plane edges
 * read as vertical "lines" framing a phone-shaped column behind the hero.
 *
 * This version paints a true gaussian falloff in pixel space so every edge
 * (left/right and top/bottom) reaches exact zero alpha, with a multi-pixel
 * transparent border so bilinear sampling never samples a hard cut.
 */
export function getShaftTexture() {
  if (shaftTexture) return shaftTexture;

  const w = 128;
  const h = 512;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(w, h);
  const data = img.data;

  const cx = (w - 1) / 2;
  // Horizontal sigma: ~18% of width — wide soft beam, not a knife edge.
  const sigmaX = w * 0.18;
  // Vertical envelope peaks mid-shaft and dies well before the mesh edge.
  const sigmaY = h * 0.28;
  const cy = (h - 1) / 2;

  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const dx = (x - cx) / sigmaX;
      const dy = (y - cy) / sigmaY;
      // Product of two gaussians → soft oval wash, zero at borders.
      let a = Math.exp(-0.5 * (dx * dx + dy * dy));

      // Hard-zero a 3px border so plane edges never show a cut line.
      const border = 3;
      if (x < border || x >= w - border || y < border || y >= h - border) {
        a = 0;
      } else {
        // Smoothstep the border zone so the clamp isn't a step itself.
        const bx = Math.min(x, w - 1 - x) / border;
        const by = Math.min(y, h - 1 - y) / border;
        const edge = Math.min(1, bx, by);
        a *= edge * edge * (3 - 2 * edge);
      }

      // Keep peak modest — additive blending of 3 shafts will stack.
      a = Math.min(1, a * 0.85);

      const i = (y * w + x) * 4;
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = Math.round(a * 255);
    }
  }

  ctx.putImageData(img, 0, 0);

  shaftTexture = new THREE.CanvasTexture(canvas);
  shaftTexture.wrapS = THREE.ClampToEdgeWrapping;
  shaftTexture.wrapT = THREE.ClampToEdgeWrapping;
  shaftTexture.minFilter = THREE.LinearFilter;
  shaftTexture.magFilter = THREE.LinearFilter;
  shaftTexture.generateMipmaps = false;
  shaftTexture.needsUpdate = true;
  return shaftTexture;
}
