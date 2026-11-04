// Ortak çizim yardımcıları (tüm bölümler kullanır).
// Çizim fonksiyonları global `c` (CanvasRenderingContext2D) üzerine çizer; motor bunu ayarlar.
let c = null;
const PI = Math.PI, TAU = Math.PI * 2;
const OL = '#140c08'; // kontur rengi
const cl = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ss = (a, b, v) => { const t = cl((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const ease = t => (t = cl(t, 0, 1), t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
// Yumuşak 1B gürültü (-1..1): titreme, nefes, kamera salınımı için
const noise1 = t => { const i = Math.floor(t), f = t - i, u = f * f * (3 - 2 * f); return lerp(hash(i), hash(i + 1), u) * 2 - 1; };

function fillStroke(f, s = OL, lw = 6) {
  if (f) { c.fillStyle = f; c.fill(); }
  if (s && lw) { c.lineWidth = lw; c.strokeStyle = s; c.stroke(); }
}
function poly(p, f, s, lw) {
  c.beginPath(); c.moveTo(p[0], p[1]);
  for (let i = 2; i < p.length; i += 2) c.lineTo(p[i], p[i + 1]);
  c.closePath(); fillStroke(f, s, lw);
}
// Noktalardan geçen yumuşak kapalı şekil (Catmull-Rom → Bezier)
function smoothPath(p, closed = true, k = 1) {
  const n = p.length / 2, P = i => {
    if (closed) i = (i + n) % n; else i = cl(i, 0, n - 1);
    return [p[i * 2], p[i * 2 + 1]];
  };
  c.moveTo(p[0], p[1]);
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    c.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6 * k, p1[1] + (p2[1] - p0[1]) / 6 * k,
      p2[0] - (p3[0] - p1[0]) / 6 * k, p2[1] - (p3[1] - p1[1]) / 6 * k, p2[0], p2[1]);
  }
  if (closed) c.closePath();
}
function blob(p, f, s, lw, k) { c.beginPath(); smoothPath(p, true, k); fillStroke(f, s, lw); }
function curve(p, s = OL, lw = 6) { c.beginPath(); smoothPath(p, false); c.lineWidth = lw; c.strokeStyle = s; c.stroke(); }
function line(x1, y1, x2, y2, s = OL, lw = 6) { c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.lineWidth = lw; c.strokeStyle = s; c.stroke(); }
function ell(x, y, rx, ry, f, s, lw, r = 0) { c.beginPath(); c.ellipse(x, y, Math.max(.01, rx), Math.max(.01, ry), r, 0, TAU); fillStroke(f, s, lw); }
function rr(x, y, w, h, r, f, s, lw) { c.beginPath(); c.roundRect(x, y, w, h, r); fillStroke(f, s, lw); }
// Kalın yuvarlak uçlu çizgi (kol/bacak): önce kontur, sonra dolgu
function capsule(pts, w, f, lw = 6) {
  c.beginPath(); c.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) c.lineTo(pts[i], pts[i + 1]);
  c.lineWidth = w + lw * 2; c.strokeStyle = OL; c.stroke();
  c.lineWidth = w; c.strokeStyle = f; c.stroke();
}
function lg(x0, y0, x1, y1, stops) { const g = c.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, col]) => g.addColorStop(o, col)); return g; }
function rg(x, y, r0, r1, stops, x1 = x, y1 = y) { const g = c.createRadialGradient(x, y, r0, x1, y1, r1); stops.forEach(([o, col]) => g.addColorStop(o, col)); return g; }
function glow(x, y, r, col, a = 1) { // ışık hâlesi (toplamalı)
  c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = a;
  c.fillStyle = rg(x, y, 0, r, [[0, col], [1, 'rgba(0,0,0,0)']]); c.fillRect(x - r, y - r, r * 2, r * 2); c.restore();
}
// İki kemikli IK: omuz (sx,sy) → bilek hedefi (tx,ty). side: -1 sol kol, +1 sağ kol.
// İki çözümden dirseği dışarıda/aşağıda olanı seçer (kol yüzün önünden geçmez).
function ik(sx, sy, tx, ty, l1, l2, side) {
  let dx = tx - sx, dy = ty - sy, d = Math.hypot(dx, dy);
  const md = l1 + l2 - .01; if (d > md) { tx = sx + dx / d * md; ty = sy + dy / d * md; dx = tx - sx; dy = ty - sy; d = md; }
  d = Math.max(d, Math.abs(l1 - l2) + .01);
  const a = Math.acos(cl((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1)), b0 = Math.atan2(dy, dx);
  let best = null;
  for (const bend of [1, -1]) {
    const ex = sx + Math.cos(b0 + a * bend) * l1, ey = sy + Math.sin(b0 + a * bend) * l1, sc = side * (ex - sx) + .6 * (ey - sy);
    if (!best || sc > best.sc) best = { ex, ey, wx: tx, wy: ty, sc };
  }
  return best;
}
// Tekrarlanan dokular (bir kez üretilir)
function makeTile(w, h, fn) { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; fn(cv.getContext('2d'), w, h); return cv; }
const TEX = {};
function initTextures() {
  let seed = 1; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  TEX.tweed = makeTile(48, 48, (g, w, h) => { // tüvit kumaş: çapraz lifler
    for (let i = 0; i < 260; i++) {
      const x = rnd() * w, y = rnd() * h, l = 3 + rnd() * 5, d = rnd() < .5 ? 1 : -1;
      g.strokeStyle = rnd() < .5 ? 'rgba(0,0,0,.35)' : 'rgba(255,230,190,.22)'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + l * d, y + l); g.stroke();
    }
  });
  TEX.knit = makeTile(16, 20, (g, w, h) => { // örgü atkı
    g.strokeStyle = 'rgba(90,50,0,.35)'; g.lineWidth = 2;
    for (let x = 0; x <= w; x += 8) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 4, h / 2); g.lineTo(x, h); g.stroke(); }
  });
  TEX.feather = makeTile(40, 30, (g, w, h) => { // tüy
    g.strokeStyle = 'rgba(30,15,5,.28)'; g.lineWidth = 1.6;
    for (let y = 4; y < h + 10; y += 10) for (let x = (y / 10 % 2) * 10; x < w + 10; x += 20) {
      g.beginPath(); g.moveTo(x - 6, y - 4); g.quadraticCurveTo(x, y + 3, x + 6, y - 4); g.stroke();
    }
  });
  TEX.fur = makeTile(40, 40, (g, w, h) => { // kürk
    for (let i = 0; i < 120; i++) {
      const x = rnd() * w, y = rnd() * h; g.strokeStyle = rnd() < .6 ? 'rgba(40,50,60,.25)' : 'rgba(255,255,255,.18)'; g.lineWidth = 1.2;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rnd() - .5) * 3, y + 4 + rnd() * 3); g.stroke();
    }
  });
  TEX.grain = [0, 1, 2, 3].map(() => makeTile(256, 256, (g, w, h) => { // film greni
    const im = g.createImageData(w, h);
    for (let i = 0; i < im.data.length; i += 4) { const v = rnd() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
    g.putImageData(im, 0, 0);
  }));
}
// Geçerli yolu dokuyla doldur (yol çizildikten sonra çağır)
function texFill(tex, alpha = 1, scale = 1) {
  const pat = c.createPattern(TEX[tex], 'repeat'); pat.setTransform(new DOMMatrix().scale(scale));
  c.save(); c.globalAlpha *= alpha; c.fillStyle = pat; c.fill(); c.restore();
}
