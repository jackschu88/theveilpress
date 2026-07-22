// Deterministic PRNG (mulberry32) so a given seed always produces the same
// field — lets tests assert exact output and keeps particle layout stable
// across re-renders without needing to store it in state.
function mulberry32(seed) {
  let t = seed;
  return function () {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateDustField(count, seed = 1) {
  const rand = mulberry32(seed);
  const particles = new Array(count);

  for (let i = 0; i < count; i += 1) {
    const depth = rand(); // 0 = near camera, 1 = far background
    particles[i] = {
      x: (rand() - 0.5) * 12,
      y: (rand() - 0.5) * 7,
      z: -depth * 8,
      size: 0.02 + (1 - depth) * 0.05,
      speed: 0.02 + (1 - depth) * 0.06,
      parallax: 1 - depth * 0.8,
    };
  }

  return particles;
}
