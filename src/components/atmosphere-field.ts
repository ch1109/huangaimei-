interface AtmosphereFrame {
  width: number; height: number; time: number; scroll: number;
  pointerX: number; pointerY: number; hover: number;
  lightX: number; lightY: number; compact: boolean;
}

// Independently seeded, slowly evolving positions with continuous acceleration.
function drift(time: number, seed: number, span: number) {
  const position = time / span + seed * 7.13;
  const cell = Math.floor(position);
  const f = position - cell;
  const ease = f * f * f * (f * (f * 6 - 15) + 10);
  const hash = (n: number) => {
    const x = Math.sin(n * 127.1 + seed * 311.7) * 43758.5453;
    return (x - Math.floor(x)) * 2 - 1;
  };
  return hash(cell) * (1 - ease) + hash(cell + 1) * ease;
}

interface Mist {
  x: number; y: number; radiusX: number; radiusY: number;
  travelX: number; travelY: number;
  color: readonly [number, number, number]; strength: number; seed: number;
}

// Keep the bodies of the clouds inside the visible margins, rather than showing
// only their nearly uniform tails. Overlapping lavender cores reveal the travel.
const mists: readonly Mist[] = [
  { x: .07, y: .55, radiusX: .40, radiusY: .60, travelX: .10, travelY: .40, color: [110, 54, 175], strength: .90, seed: 2 },
  { x: .94, y: .45, radiusX: .43, radiusY: .58, travelX: .10, travelY: .40, color: [97, 84, 198], strength: .88, seed: 5 },
  { x: .94, y: .62, radiusX: .29, radiusY: .38, travelX: .08, travelY: .28, color: [190, 158, 232], strength: .60, seed: 9 },
  { x: .68, y: 1.01, radiusX: .55, radiusY: .40, travelX: .30, travelY: .12, color: [137, 83, 195], strength: .65, seed: 14 },
  { x: .30, y: .01, radiusX: .50, radiusY: .38, travelX: .30, travelY: .10, color: [112, 97, 201], strength: .60, seed: 21 },
  { x: .06, y: .26, radiusX: .28, radiusY: .38, travelX: .08, travelY: .25, color: [175, 132, 217], strength: .55, seed: 27 },
];

const brushes = new WeakMap<CanvasRenderingContext2D, Map<string, HTMLCanvasElement>>();

// Bake the soft falloff once per tint. Enlarging these small textures produces
// blurred-looking fog without full-screen filters or directional light bands.
function fogBrush(ctx: CanvasRenderingContext2D, color: Mist['color']) {
  let cache = brushes.get(ctx);
  if (!cache) { cache = new Map(); brushes.set(ctx, cache); }
  const key = color.join(',');
  const existing = cache.get(key);
  if (existing) return existing;
  const atlas = ctx.canvas.ownerDocument.createElement('canvas');
  atlas.width = 256; atlas.height = 256;
  const brush = atlas.getContext('2d');
  if (!brush) return null;
  const gradient = brush.createRadialGradient(128, 128, 0, 128, 128, 128);
  for (let index = 0; index <= 32; index++) {
    const radius = index / 32;
    // Both intensity and slope reach zero at the boundary: no visible discs.
    const alpha = Math.exp(-radius * radius * 2) * Math.pow(1 - radius * radius, 2);
    gradient.addColorStop(radius, `rgba(${key},${alpha})`);
  }
  brush.fillStyle = gradient;
  brush.fillRect(0, 0, 256, 256);
  cache.set(key, atlas);
  return atlas;
}

export function paintAtmosphere(ctx: CanvasRenderingContext2D, frame: AtmosphereFrame) {
  const { width: w, height: h, time: t, scroll, pointerX, pointerY, compact } = frame;
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#050407';
  ctx.fillRect(0, 0, w, h);
  // Screen blending merges the brighter fog without clipped neon intersections.
  ctx.globalCompositeOperation = 'screen';
  ctx.imageSmoothingEnabled = true;
  const depth = 1 - Math.exp(-Math.max(0, scroll) * .35);
  const brightness = (compact ? .85 : 1) * (1 - depth * .12);
  // Visible cloud travel is intentionally faster than the gentle illumination
  // cycle: the fog moves clearly without flashing or brightening the center.
  const flow = t * 3.2;

  for (const mist of mists) {
    const brush = fogBrush(ctx, mist.color);
    if (!brush) continue;
    const { seed } = mist;
    // Continuous orbital drift avoids the long near-still intervals of eased
    // noise alone. Independent phases keep the edges moving within a few seconds.
    const horizontal = Math.sin(flow * (.105 + seed * .0009) + seed * .83) * .76 + drift(flow, seed, 11) * .24;
    const vertical = Math.cos(flow * (.135 + seed * .0007) + seed * .61) * .76 + drift(flow, seed + 3, 14) * .24;
    const expansion = Math.sin(flow * .17 + seed * .7) * .7 + drift(flow, seed + 8, 18) * .3;
    const breath = .87 + Math.sin(t * Math.PI * 2 / (17 + seed * .12) + seed * .9) * .13;
    const x = (mist.x + horizontal * mist.travelX + pointerX * .22) * w;
    const y = (mist.y + vertical * mist.travelY + pointerY * .2 - Math.tanh(scroll * .15) * .018) * h;
    const radiusX = mist.radiusX * (1 + expansion * .16) * w;
    const radiusY = mist.radiusY * (1 - expansion * .13) * h;
    const illumination = mist.strength * breath * brightness;
    ctx.globalAlpha = illumination * .76;
    ctx.drawImage(brush, x - radiusX, y - radiusY, radiusX * 2, radiusY * 2);

    // An offset, softer lobe breaks the ellipse into an irregular cloud. Each
    // volume deforms independently rather than pulsing as one bright overlay.
    ctx.globalAlpha = illumination * .82;
    const offsetX = (Math.sin(flow * .16 + seed) * .65 + drift(flow, seed + 13, 13) * .35) * radiusX * .45;
    const offsetY = (Math.cos(flow * .12 + seed) * .65 + drift(flow, seed + 17, 17) * .35) * radiusY * .5;
    ctx.drawImage(brush, x + offsetX - radiusX * .6, y + offsetY - radiusY * .625, radiusX * 1.2, radiusY * 1.25);
  }

  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
}
