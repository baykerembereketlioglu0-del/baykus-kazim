// Ara sahneler: seslendirme sürerken arkada dönen "film" sahneleri.
// Her sahne: SCENES[ad](S)  S = { t: genel zaman, lt: sahne yerel zamanı, pt: plan yerel zamanı, pd: plan süresi,
//                                 k: plan ilerlemesi 0..1, phase: satırdaki faz adı, talk: { kazim, demir } }
// Dünya koordinatı 720x1280; `c` zaten 1080x1920 tuvale ölçeklenmiş gelir.
const SCENES = {};
const SIL = '#120b07';

// ---------- ortak parçalar ----------
// Hayvan siluetleri (sana gülenler): kulak tipi, eğilme, gülme, işaret etme
function silhouette(x, y, s, o = {}) {
  c.save(); c.translate(x, y); c.scale(s * (o.flip ? -1 : 1), s);
  const col = o.col || SIL, rim = o.rim ?? .45;
  const shape = (fn) => { c.save(); c.lineWidth = 6; c.strokeStyle = `rgba(255,185,105,${rim})`; fn(); c.stroke(); c.fillStyle = col; c.fill(); c.restore(); };
  c.rotate(o.lean || 0);
  shape(() => { c.beginPath(); smoothPath([-130, 40, -128, -140, -90, -228, 0, -250, 90, -228, 128, -140, 130, 40]); });
  if (o.point) { // işaret eden kol
    const a = o.point; c.save(); c.translate(-80, -170); c.rotate(-PI / 2 - .25 + (1 - a) * 1.2);
    shape(() => { c.beginPath(); c.roundRect(-20, 0, 40, 170 * a + 40, 20); });
    shape(() => { c.beginPath(); c.ellipse(0, 190 * a + 40, 26, 24, 0, 0, TAU); });
    shape(() => { c.beginPath(); c.roundRect(-7, 190 * a + 50, 14, 46, 7); });
    c.restore();
  }
  c.translate(0, -305 + (o.bob || 0)); c.rotate(o.tilt || 0);
  const ty = o.type || 'fox';
  for (const sd of [-1, 1]) {
    if (ty === 'bear') shape(() => { c.beginPath(); c.ellipse(sd * 62, -66, 30, 30, 0, 0, TAU); });
    else if (ty === 'rabbit') shape(() => { c.beginPath(); c.ellipse(sd * 30, -130, 20, 70, sd * .15, 0, TAU); });
    else { const h = ty === 'cat' ? 70 : 110; shape(() => { c.beginPath(); c.moveTo(sd * 30, -60); c.lineTo(sd * 76, -60 - h); c.lineTo(sd * 92, -30); c.closePath(); }); }
  }
  shape(() => { c.beginPath(); c.ellipse(0, 0, 92, 84, 0, 0, TAU); });
  if (ty === 'fox' || ty === 'dog') shape(() => { c.beginPath(); c.ellipse(o.flip ? 0 : 0, 40, 46, 34, 0, 0, TAU); });
  if (o.eyes !== false) for (const sd of [-1, 1]) {
    c.save(); c.globalAlpha = .85; c.fillStyle = '#f0c98a';
    c.beginPath(); c.ellipse(sd * 34, -8 + (o.laugh ? 4 : 0), 13, o.laugh ? 3 : 6, sd * (o.laugh ? -.25 : .15), 0, TAU); c.fill(); c.restore();
  }
  if (o.laugh) { c.fillStyle = '#e9dcc5'; c.beginPath(); c.moveTo(-34, 34); c.quadraticCurveTo(0, 34 + 46 * o.laugh, 34, 34); c.closePath(); c.fill(); }
  c.restore();
}
// Deri defter: open 0 (kapalı) .. 1 (açık), glow: sayfa ışığı
function notebook(x, y, s, open, glow, dust = 0, t = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  ell(0, 96, 240, 26, 'rgba(0,0,0,.45)', null);
  if (open > .02) { // sayfalar
    const o = ease(open), pw = 190;
    c.save(); c.scale(1, 1);
    for (const sd of [-1, 1]) {
      c.beginPath(); c.moveTo(0, -120); c.quadraticCurveTo(sd * pw * .5, -136, sd * pw, -126); c.lineTo(sd * pw, 100); c.quadraticCurveTo(sd * pw * .5, 90, 0, 104); c.closePath();
      if (sd < 0 || o > .5) { c.fillStyle = '#efe2c4'; c.fill(); c.lineWidth = 5; c.strokeStyle = OL; c.stroke(); }
    }
    if (o > .5) { // dükkân çizimi (hayal)
      c.save(); c.globalAlpha = ss(.5, 1, o) * .85; c.strokeStyle = '#6b4a2a'; c.lineWidth = 3;
      c.strokeRect(30, -70, 130, 110); c.beginPath(); c.moveTo(22, -70); c.lineTo(95, -112); c.lineTo(168, -70); c.stroke();
      c.strokeRect(80, -5, 32, 45); c.strokeRect(40, -45, 30, 26); c.strokeRect(122, -45, 30, 26);
      c.font = '600 18px Caveat,cursive'; c.fillStyle = '#6b4a2a'; c.fillText('Benim dükkânım', 40, 76);
      for (let k = 0; k < 6; k++) line(-168, -80 + k * 30, -30, -80 + k * 30, 'rgba(107,74,42,.45)', 2);
      c.font = '600 20px Caveat,cursive'; c.fillText('Hayallerim:', -165, -92); c.restore();
    }
    line(0, -120, 0, 104, 'rgba(0,0,0,.35)', 4);
    // kapak dönüyor
    const cw = pw * Math.cos(o * PI);
    c.beginPath(); c.moveTo(0, -128); c.lineTo(cw, -128); c.lineTo(cw, 108); c.lineTo(0, 108); c.closePath();
    c.fillStyle = Math.cos(o * PI) > 0 ? '#5a2f1c' : '#7a4a2c'; c.fill(); c.lineWidth = 5; c.strokeStyle = OL; c.stroke();
    c.restore();
  } else {
    rr(-10, -130, 200, 240, 10, '#5a2f1c', OL, 6); rr(-10, -130, 26, 240, 6, '#47240f', OL, 4);
    c.save(); c.font = '700 22px Cinzel,Georgia,serif'; c.textAlign = 'center'; c.fillStyle = `rgba(217,164,65,${.85 - dust * .5})`; c.fillText('HAYALLERİM', 100, -30); c.restore();
    rr(70, -12, 60, 3, 1, `rgba(217,164,65,${.6 - dust * .4})`, null);
    if (dust > 0) { c.save(); c.globalAlpha = dust * .5; c.fillStyle = '#9c8f80'; for (let i = 0; i < 90; i++) ell(-5 + hash(i) * 190, -125 + hash(i + 7) * 230, 2.2, 2.2, '#9c8f80', null); c.restore(); }
  }
  if (glow > 0) addLight(open > .02 ? 0 : 90, -20, 420 * glow, `rgba(255,200,110,${.55 * glow})`);
  c.restore();
}
function dustMotes(t, n, x0, y0, w, h, a = .5, col = '255,220,170') {
  for (let i = 0; i < n; i++) {
    const x = x0 + ((hash(i) * w + noise1(t * .2 + i) * 40 + t * 6 * (hash(i + 3) - .5)) % w + w) % w, y = y0 + ((hash(i + 9) * h - t * 10 * hash(i + 2)) % h + h) % h;
    ell(x, y, 1.5 + hash(i + 5) * 2, 1.5 + hash(i + 5) * 2, `rgba(${col},${a * (.4 + .6 * hash(i + 1)) * (.6 + .4 * Math.sin(t * 2 + i))})`, null);
  }
}
function cam(cx, cy, z) { c.translate(W2 / 2, H2 / 2); c.scale(z, z); c.translate(-cx, -cy); }
const W2 = 720, H2 = 1280;
// Basit dal/kök ağacı (deterministik)
function makeBranches(seed, x, y, ang, len, depth, spread, out = [], t0 = 0, jit = .5) {
  const r = n => hash(seed * 31 + n);
  const ex = x + Math.cos(ang) * len, ey = y + Math.sin(ang) * len;
  out.push({ x, y, ex, ey, w: depth * 2.2 + 1.5, t0, t1: t0 + 1 });
  if (depth > 0) {
    const n = depth > 3 ? 2 : 2 + (r(1) > .5 ? 1 : 0);
    for (let i = 0; i < n; i++) makeBranches(seed * 7 + i + 1, ex, ey, ang + (i - (n - 1) / 2) * spread + (r(i + 4) - .5) * jit, len * (.68 + r(i + 8) * .2), depth - 1, spread, out, t0 + 1, jit);
  }
  return out;
}
function drawBranches(br, grow, maxT, col, wScale = 1, wig = 0) {
  c.lineCap = 'round';
  for (const b of br) {
    const k = cl(grow * maxT - b.t0, 0, 1); if (k <= 0) continue;
    const ex = lerp(b.x, b.ex, k), ey = lerp(b.y, b.ey, k), nx = -(b.ey - b.y), ny = b.ex - b.x, w = (hash(b.x + b.y) - .5) * wig;
    c.beginPath(); c.moveTo(b.x, b.y); c.quadraticCurveTo((b.x + ex) / 2 + nx * w * k, (b.y + ey) / 2 + ny * w * k, ex, ey);
    c.lineWidth = b.w * wScale; c.strokeStyle = col; c.stroke();
  }
}
// Arka plan: kıraathane içi (anı sahnesi)
function cafeInterior(t) {
  c.fillStyle = lg(0, 0, 0, 1280, [[0, '#24160d'], [1, '#160d07']]); c.fillRect(-300, -300, 1320, 1900);
  for (let x = -300; x < 1020; x += 60) line(x, -300, x, 1600, 'rgba(0,0,0,.25)', 3);         // ahşap lambri
  rr(-300, 600, 1320, 18, 0, '#3a2414', OL, 4);
  rr(120, 160, 480, 330, 6, '#2c1a10', OL, 8);                                              // pencere
  c.fillStyle = lg(0, 170, 0, 480, [[0, '#0d1420'], [1, '#1a2231']]); c.fillRect(132, 172, 456, 306);
  for (let i = 0; i < 14; i++) rr(150 + (i % 7) * 62, 300 + Math.floor(i / 7) * 60 + hash(i) * 30, 18, 24, 2, `rgba(240,180,90,${.35 + .4 * hash(i + 2)})`, null);
  c.save(); c.beginPath(); c.rect(132, 172, 456, 306); c.clip(); c.strokeStyle = 'rgba(200,210,230,.25)'; c.lineWidth = 1.5;
  for (let i = 0; i < 40; i++) { const yy = ((hash(i) * 330 + t * 500) % 330) + 160, xx = 140 + hash(i + 4) * 450; c.beginPath(); c.moveTo(xx, yy); c.lineTo(xx - 3, yy + 18); c.stroke(); } c.restore();
  line(360, 172, 360, 478, '#2c1a10', 8); line(132, 325, 588, 325, '#2c1a10', 8);
  // asılı lamba
  line(360, -300, 360, 250, '#0d0806', 4);
  poly([300, 250, 420, 250, 390, 222, 330, 222], '#2a1a10', OL, 5);
  ell(360, 256, 22, 10, '#ffe3a6', null);
  c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = lg(0, 250, 0, 900, [[0, 'rgba(255,200,120,.30)'], [1, 'rgba(255,200,120,0)']]);
  c.beginPath(); c.moveTo(320, 256); c.lineTo(400, 256); c.lineTo(720, 900); c.lineTo(0, 900); c.closePath(); c.fill(); c.restore();
  addLight(360, 262, 420, 'rgba(255,180,90,.40)');
}
function cafeTable() {
  c.beginPath(); c.moveTo(-40, 860); c.lineTo(760, 860); c.lineTo(760, 1600); c.lineTo(-40, 1600); c.closePath(); c.fillStyle = '#1c110a'; c.fill();
  rr(-40, 830, 800, 46, 8, lg(0, 830, 0, 876, [[0, '#6a4128'], [1, '#3e2414']]), OL, 6);
  for (let i = 0; i < 6; i++) line(-40 + i * 160 + 30, 838, -40 + i * 160 + 110, 838, 'rgba(255,220,170,.12)', 2);
  // çay bardakları
  for (const tx of [470, 610]) { poly([tx - 16, 790, tx + 16, 790, tx + 11, 830, tx - 11, 830], 'rgba(150,30,25,.85)', OL, 4); ell(tx, 832, 26, 6, '#c9c2b5', OL, 3); }
}

// ---------- 1) ANI: masada hayalini anlatan Demir ----------
SCENES.masa = S => {
  const ph = S.phase || 'goster', k = S.k, t = S.t;
  let cx = 330, cy = 700, z = 1.12 + .06 * k;
  if (ph === 'gul') { cx = 380; cy = 690; z = 1.05 + .04 * k; }
  if (ph === 'isaret') { cx = lerp(420, 520, ease(k)); cy = 640; z = lerp(1.25, 1.55, ease(k)); }
  cam(cx, cy, z);
  cafeInterior(t);
  // siluetler (sağda oturan "dostlar")
  const laugh = ph === 'gul' ? .5 + .5 * Math.abs(Math.sin(t * 7)) : ph === 'isaret' ? .3 : 0;
  const types = [['fox', 470, .58], ['bear', 590, .62], ['cat', 700, .55]];
  types.forEach(([ty, x, s], i) => {
    const bob = laugh ? -Math.abs(Math.sin(t * 7 + i)) * 14 : Math.sin(t * 1.5 + i) * 3;
    silhouette(x, 880, s, { type: ty, flip: true, laugh: ph === 'gul' ? laugh : 0, bob, tilt: laugh ? -.15 * Math.abs(Math.sin(t * 7 + i)) : 0,
      point: ph === 'isaret' && i === 0 ? ease(S.pt / .6) : 0, lean: ph === 'isaret' && i === 0 ? -.08 : 0 });
  });
  if (ph === 'gul') { c.save(); for (let i = 0; i < 4; i++) { const p = (S.pt * .6 + i * .27) % 1; c.globalAlpha = (1 - p) * .8; c.font = 'italic 900 34px Inter,Arial'; c.fillStyle = '#e9c98f'; c.fillText('HA', 470 + i * 70 + Math.sin(i * 9) * 20, 560 - p * 160); } c.restore(); }
  // Demir (masanın arkasında)
  const happy = ph === 'goster', show = ph === 'goster' ? 1 : ph === 'gul' ? 1 - ease(S.pt / 1.5) : 0;
  const p = Object.assign({}, MOODS.demir[happy ? 'happy' : 'sad'], { t, talk: S.talk.demir, lookX: happy ? .2 : .35, lookY: happy ? 0 : .5, blink: (t % 3.3 < .15) ? 1 : 0, tilt: happy ? .04 : -.05,
    L: { x: lerp(-148, -95, show), y: lerp(-272, -470, show), hand: 'relax' }, R: { x: lerp(148, 95, show), y: lerp(-272, -470, show), hand: 'relax' } });
  c.save(); c.translate(230, 1060); c.scale(.66, .66); drawWolf(p); c.restore();
  cafeTable();
  if (show > .02) notebook(230, 1060 - .66 * lerp(380, 470, show), .62, 1, show * .9);
  else notebook(170, 818, .32, 0, 0);
};

// ---------- 2) Tozlanan defter ----------
SCENES.tozlu = S => {
  const t = S.t; cam(360, 700, 1.05 + .12 * S.k);
  c.fillStyle = '#0b0807'; c.fillRect(-200, -200, 1120, 1700);
  rr(380, 120, 300, 380, 4, '#1a1410', OL, 8); c.fillStyle = '#0e1622'; c.fillRect(392, 132, 276, 356); // pencere
  ell(560, 240, 34, 34, '#e7e2cf', null); addLight(560, 240, 160, 'rgba(200,210,230,.25)');
  line(530, 132, 530, 488, '#1a1410', 8); line(392, 310, 668, 310, '#1a1410', 8);
  c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = lg(560, 200, 260, 900, [[0, 'rgba(170,190,220,.22)'], [1, 'rgba(170,190,220,0)']]);
  c.beginPath(); c.moveTo(400, 140); c.lineTo(670, 300); c.lineTo(420, 1000); c.lineTo(60, 900); c.closePath(); c.fill(); c.restore();
  rr(-200, 860, 1120, 600, 0, '#21160f', null); rr(-200, 840, 1120, 30, 4, '#3a2618', OL, 6);   // masa
  for (let i = 0; i < 5; i++) line(-150 + i * 200, 900, -60 + i * 200, 900, 'rgba(255,255,255,.05)', 3);
  // eriyip sönmüş mum
  rr(560, 740, 40, 104, 6, '#d8cdb7', OL, 5); line(580, 740, 580, 724, OL, 3);
  c.save(); c.globalAlpha = .4 + .2 * Math.sin(t); curve([580, 720, 572, 690, 586, 660, 576, 620], 'rgba(200,200,200,.4)', 3); c.restore();
  // örümcek ağı
  c.save(); c.globalAlpha = .35; for (let i = 0; i < 6; i++) line(-120, 600, -120 + Math.cos(i * .28) * 260, 600 + Math.sin(i * .28) * 260, '#cfc6b8', 1.5);
  for (let r = 60; r < 260; r += 50) { c.beginPath(); c.arc(-120, 600, r, 0, PI / 2 * .95); c.lineWidth = 1.2; c.strokeStyle = '#cfc6b8'; c.stroke(); } c.restore();
  notebook(260, 790, .9, 0, 0, 1);
  dustMotes(t, 70, 60, 200, 600, 700, .55, '210,220,235');
};

// ---------- 3) Yanlış ele verilen hayal ışığı ----------
SCENES.isik = S => {
  const t = S.t, k = S.k; cam(360, 640, 1.08 + .1 * k);
  c.fillStyle = rg(360, 620, 40, 900, [[0, '#1c120b'], [1, '#050302']]); c.fillRect(-200, -200, 1120, 1700);
  const reach = ease(cl((k - .12) / .28, 0, 1)), give = ease(cl((k - .3) / .2, 0, 1)), close = ease(cl((k - .52) / .18, 0, 1)), die = ss(.62, .86, k), lv = 1 - die;
  const hx = lerp(900, 470, reach), hy = lerp(560, 600, reach);
  const ox = lerp(300, hx - 10, give), oy = lerp(720, hy + 10, give) + Math.sin(t * 2) * 5 * (1 - close);
  // Demir'in avuç açmış patileri
  const px0 = lerp(300, 270, give), py0 = 800 + give * 50;
  for (const sd of [-1, 1]) {
    capsule([px0 + sd * 150, 1420, px0 + sd * 70, py0 + 40], 100, WOLF_C.sleeve, 6);
    capsule([px0 + sd * 84, py0 + 70, px0 + sd * 74, py0 + 50], 104, '#6a1822', 5);
    c.save(); c.translate(px0 + sd * 50, py0); c.rotate(sd * .35);
    ell(0, 0, 70, 50, WOLF_C.paw, OL, 6); ell(sd * -6, -6, 30, 20, '#b98d93', null);
    for (const f of [-1, 0, 1]) ell(sd * 40 + f * 18 * sd, -36 + Math.abs(f) * 8, 11, 9, '#b98d93', null);
    c.restore();
  }
  const orb = () => {
    if (lv <= .01) return;
    glow(ox, oy, 280 * lv, `rgba(255,190,90,${.7 * lv})`);
    ell(ox, oy, 34 * (1 - close * .5), 34 * (1 - close * .5), `rgba(255,236,190,${lv})`, null);
    for (let i = 0; i < 10; i++) { const a = t * 1.5 + i * .63, r = (50 + 14 * Math.sin(t * 3 + i)) * (1 - close * .6); ell(ox + Math.cos(a) * r, oy + Math.sin(a) * r * .7, 3, 3, `rgba(255,230,170,${lv * .8})`, null); }
  };
  const rim = 'rgba(255,170,90,.4)';
  if (reach <= 0) orb();
  else {
    // karanlık el: kol + avuç, sonra küre, sonra üstüne kapanan parmaklar
    c.save(); c.translate(hx, hy);
    c.beginPath(); c.moveTo(320, 140); c.lineTo(40, 10); c.lineWidth = 128; c.strokeStyle = rim; c.stroke(); c.lineWidth = 120; c.strokeStyle = SIL; c.stroke();
    ell(0, 0, 84, 72, SIL, rim, 5); c.restore();
    orb();
    c.save(); c.translate(hx, hy);
    for (let i = 0; i < 4; i++) {
      const a = PI + (i - 1.5) * .42, L1 = 100, b = a + close * 1.9 * (1 - i * .06);
      const x1 = Math.cos(a) * 54, y1 = Math.sin(a) * 50, x2 = x1 + Math.cos(b - .2) * L1, y2 = y1 + Math.sin(b - .2) * L1 * .8;
      c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.lineWidth = 36; c.strokeStyle = rim; c.stroke(); c.lineWidth = 30; c.strokeStyle = SIL; c.stroke();
    }
    c.restore();
    if (close > .1 && lv > .01) for (let i = 0; i < 7; i++) { c.save(); c.globalAlpha = lv * close * .8; c.globalCompositeOperation = 'lighter'; const a = -PI / 2 + (i - 3) * .35; line(ox, oy, ox + Math.cos(a) * 170 * lv, oy + Math.sin(a) * 150 * lv, 'rgba(255,210,140,.5)', 5); c.restore(); }
  }
  if (die > .2) { c.save(); c.globalAlpha = ss(.62, .8, k) * (1 - ss(.92, 1, k) * .5); for (let i = 0; i < 3; i++) curve([hx - 10 + i * 10, hy - 30, hx - 20 + Math.sin(t * 2 + i) * 30, hy - 130, hx + Math.sin(t * 2.4 + i) * 40, hy - 230, hx - 10, hy - 330 - S.pt * 20], 'rgba(170,160,150,.35)', 6); c.restore(); }
};

// ---------- 4) Tohum ve kökler / eşelenen toprak ----------
const ROOTS = [];
[[PI / 2, 62, 6, 0], [PI / 2 + .55, 52, 5, .3], [PI / 2 - .55, 52, 5, .3], [PI / 2 + 1.1, 44, 5, .7], [PI / 2 - 1.1, 44, 5, .7], [PI / 2 + .25, 40, 4, 1.2], [PI / 2 - .3, 40, 4, 1.4]]
  .forEach(([a, l, d, t0], i) => makeBranches(5 + i * 11, 360, 782, a, l, d, .62, ROOTS, t0));
ROOTS.forEach(b => b.w = b.w * .55);
SCENES.tohum = S => {
  const t = S.t, dig = S.phase === 'esele', k = S.k;
  cam(360, dig ? 640 : lerp(740, 650, ease(k)), dig ? 1.05 : lerp(1.45, 1.05, ease(k)));
  c.fillStyle = lg(0, 0, 0, 520, [[0, '#0a0f1a'], [1, '#1c1a22']]); c.fillRect(-300, -300, 1320, 820); // gece göğü
  for (let i = 0; i < 40; i++) ell(hash(i) * 720, hash(i + 3) * 400, 1.5, 1.5, `rgba(255,255,240,${.3 + .5 * hash(i + 5) * (.6 + .4 * Math.sin(t * 2 + i))})`, null);
  c.fillStyle = lg(0, 520, 0, 1300, [[0, '#3b2717'], [.4, '#2a1b10'], [1, '#140c07']]); c.fillRect(-300, 520, 1320, 1100);
  for (const [y, a] of [[620, .25], [760, .18], [930, .22], [1080, .15]]) { c.beginPath(); c.moveTo(-300, y); for (let x = -300; x < 1020; x += 40) c.lineTo(x, y + Math.sin(x * .05) * 8); c.lineWidth = 3; c.strokeStyle = `rgba(0,0,0,${a})`; c.stroke(); }
  for (let i = 0; i < 70; i++) ell(-250 + hash(i) * 1200, 560 + hash(i + 1) * 700, 5 + hash(i + 2) * 12, 4 + hash(i + 2) * 8, `rgba(${hash(i + 3) > .5 ? '90,70,50' : '20,12,8'},.6)`, null, 0, hash(i) * 3);
  for (let x = -280; x < 1020; x += 22) curve([x, 524, x + 4, 504 - hash(x) * 14, x + 10, 498 - hash(x + 1) * 18], '#2c3a1f', 4); // çimen
  rr(-300, 516, 1320, 10, 0, '#2c3a1f', null);
  let grow = dig ? lerp(1, .25, ease(k * 1.4)) : ease(cl(k * 1.05, 0, 1)), sprout = dig ? 0 : ss(.45, 1, k);
  // kökler
  c.save(); if (dig) c.globalAlpha = 1 - .6 * ss(.3, .9, k); drawBranches(ROOTS, grow, 7.5, 'rgba(60,40,20,.6)', 1.9, .5); drawBranches(ROOTS, grow, 7.5, '#e2cfa4', 1, .5); c.restore();
  // filiz (toprak altında yukarı)
  if (sprout > 0) { const top = lerp(760, 540, sprout); curve([360, 760, 352, lerp(760, top, .5), 360, top], '#8fbf52', 7); if (sprout > .7) { ell(348, top + 4, 16 * ss(.7, 1, sprout), 8, '#9fd060', OL, 3, -.5); ell(372, top + 4, 16 * ss(.7, 1, sprout), 8, '#9fd060', OL, 3, .5); } }
  // tohum
  const sy = dig ? lerp(770, 600, ss(.35, .8, k)) : 770;
  c.save(); c.translate(360, sy); c.rotate(dig ? k * 2 : 0); ell(0, 0, 34, 24, lg(0, -24, 0, 24, [[0, '#d99a52'], [1, '#7a4a20']]), OL, 5); curve([-14, -4, 0, -10, 14, -4], 'rgba(255,230,180,.6)', 3); c.restore();
  addLight(360, sy, dig ? 160 * (1 - k) : 200 + 60 * grow, `rgba(255,200,110,${dig ? .35 * (1 - k) : .4})`);
  if (dig) { // eşeleyen karanlık pençe + savrulan toprak
    const cyc = (S.pt * 1.6) % 1, hy = lerp(300, 640 + ss(.4, .8, k) * 60, Math.sin(cyc * PI)), hx = 380 + Math.sin(S.pt * 1.6 * TAU) * 30;
    ell(360, 560, 120 + 120 * ss(0, .6, k), 50 + 70 * ss(0, .6, k), '#120b07', null);
    c.save(); c.translate(hx, hy); capsule([60, -500, 0, -60], 110, SIL, 0); ell(0, 0, 80, 64, SIL, 'rgba(255,170,90,.3)', 5);
    for (let i = 0; i < 4; i++) { capsule([-45 + i * 30, 30, -60 + i * 40, 110], 22, SIL, 0); poly([-70 + i * 40, 104, -50 + i * 40, 104, -60 + i * 40, 140], '#2a1e16', null); } c.restore();
    for (let i = 0; i < 16; i++) { const p = (S.pt * 1.6 + hash(i)) % 1; ell(360 + (hash(i + 4) - .5) * 400 * p, 560 - Math.sin(p * PI) * 260, 8, 6, '#3b2717', null); }
  }
};

// ---------- 5) Filizin üstünden geçen ayaklar ----------
SCENES.ezme = S => {
  const t = S.t, k = S.k; cam(360, 700, 1.05);
  c.fillStyle = lg(0, 0, 0, 900, [[0, '#120d0a'], [1, '#2a2019']]); c.fillRect(-300, -300, 1320, 1300);
  c.save(); c.filter = 'blur(14px)'; for (let i = 0; i < 9; i++) rr(-100 + i * 110, 160 + hash(i) * 120, 60, 110, 3, `rgba(240,170,80,${.12 + .22 * hash(i + 3)})`, null); c.restore(); // uzak pencereler bulanık
  c.fillStyle = '#1b1410'; c.fillRect(-300, 900, 1320, 600);
  for (let r = 0; r < 8; r++) for (let x = -300 + (r % 2) * 40; x < 1020; x += 80) ell(x, 930 + r * 34, 36, 12, null, 'rgba(80,60,45,.4)', 2);
  c.save(); c.globalCompositeOperation = 'lighter'; ell(360, 935, 260, 30, rg(360, 935, 0, 260, [[0, 'rgba(255,190,100,.25)'], [1, 'rgba(0,0,0,0)']]), null); c.restore();
  // filiz
  const crush = ss(.5, .56, k), sx = 360, sy = 920;
  c.save(); c.translate(sx, sy); c.rotate(crush * 1.25); c.scale(1, 1 - crush * .5);
  curve([0, 0, -4, -40, 0, -80], '#8fbf52', 7); ell(-18, -84, 20, 10, '#9fd060', OL, 3, -.5); ell(18, -84, 20, 10, '#9fd060', OL, 3, .5); c.restore();
  addLight(sx, sy - 70, 150 * (1 - crush * .7), `rgba(190,255,140,${.3 * (1 - crush * .7)})`);
  // yürüyen bacaklar (kalabalık)
  const walkers = [[.0, 1.0, 1], [.28, .95, 0], [.5, 1.05, 1], [.7, .9, 0]];
  walkers.forEach(([st, sc, kind], i) => {
    const p = (k - st) / .55; if (p < -.1 || p > 1.2) return;
    const base = lerp(1100, -380, p), ph = p * 9;
    for (const leg of [0, 1]) {
      const sw = Math.sin(ph + leg * PI), fx = base + sw * 70 * sc + (leg ? 40 : -20), lift = Math.max(0, Math.cos(ph + leg * PI)) * 40;
      const footY = 928 - lift;
      const hipX = base + (leg ? 30 : -10);
      c.beginPath(); c.moveTo(hipX, 120); c.lineTo(fx, footY - 50 * sc); c.lineWidth = 96 * sc; c.strokeStyle = 'rgba(255,180,100,.4)'; c.stroke();
      c.lineWidth = 88 * sc; c.strokeStyle = kind ? '#2a2420' : '#2b1f18'; c.stroke();
      c.lineWidth = 92 * sc; c.beginPath(); c.moveTo(fx + (hipX - fx) * .12, footY - 50 * sc - 40); c.lineTo(fx, footY - 50 * sc); c.strokeStyle = kind ? '#3a332d' : '#40302a'; c.stroke();
      blob([fx - 70 * sc, footY, fx - 66 * sc, footY - 60 * sc, fx + 40 * sc, footY - 56 * sc, fx + 60 * sc, footY - 10 * sc, fx + 40 * sc, footY + 4], '#0d0907', 'rgba(255,180,100,.3)', 4);
    }
  });
  drawRain(t, 720, 1280, 1, .8);
};

// ---------- 6) Gece çalışma montajı (zaman akıyor) ----------
SCENES.calis = S => {
  const t = S.t, k = S.k; cam(360, 660, 1.08 + .08 * k);
  const day = (k * 3) % 1, sun = Math.sin(day * PI);           // gün döngüsü penceresi
  c.fillStyle = '#1a120c'; c.fillRect(-300, -300, 1320, 1900);
  rr(430, 140, 260, 320, 4, '#2c1a10', OL, 8);
  c.fillStyle = lg(0, 150, 0, 450, [[0, `rgb(${lerp(14, 120, sun) | 0},${lerp(20, 150, sun) | 0},${lerp(34, 190, sun) | 0})`], [1, `rgb(${lerp(26, 220, sun) | 0},${lerp(30, 170, sun) | 0},${lerp(44, 120, sun) | 0})`]]); c.fillRect(442, 152, 236, 296);
  const ax = 442 + day * 236; ell(ax, 300 - sun * 110, 22, 22, sun > .5 ? '#ffe9a0' : '#e7e2cf', null);
  line(560, 152, 560, 448, '#2c1a10', 8); line(442, 300, 678, 300, '#2c1a10', 8);
  // duvar saati (hızlı dönen ibreler)
  ell(200, 260, 70, 70, '#e8dcc2', OL, 6); for (let i = 0; i < 12; i++) line(200 + Math.cos(i / 12 * TAU) * 56, 260 + Math.sin(i / 12 * TAU) * 56, 200 + Math.cos(i / 12 * TAU) * 64, 260 + Math.sin(i / 12 * TAU) * 64, OL, 3);
  const hA = k * TAU * 6, mA = k * TAU * 72; line(200, 260, 200 + Math.sin(hA) * 34, 260 - Math.cos(hA) * 34, OL, 7); line(200, 260, 200 + Math.sin(mA) * 52, 260 - Math.cos(mA) * 52, OL, 4);
  // takvim yaprakları
  rr(90, 400, 120, 130, 4, '#efe6d4', OL, 5); rr(90, 400, 120, 30, 4, '#8a1d24', OL, 5);
  c.save(); c.font = '900 56px Georgia,serif'; c.textAlign = 'center'; c.fillStyle = OL; c.fillText(String(1 + Math.floor(k * 29)), 150, 505); c.restore();
  // Demir masada yazıyor (kafa öne eğik)
  const wr = Math.sin(t * 14) * 8;
  const p = Object.assign({}, MOODS.demir.calm, { t, talk: 0, lookX: .2, lookY: .9, blink: 0, tilt: .08 + Math.sin(t * 1.2) * .02, nod: .5,
    L: { x: -70, y: -360, hand: 'relax' }, R: { x: 60 + wr, y: -360, hand: 'relax' } });
  c.save(); c.translate(300, 1050); c.scale(.7, .7); drawWolf(p); c.restore();
  // masa + lamba
  rr(-300, 840, 1320, 40, 6, '#4a2e1b', OL, 6); c.fillStyle = '#1c110a'; c.fillRect(-300, 880, 1320, 700);
  poly([520, 840, 560, 840, 548, 700, 532, 700], '#222', OL, 4); poly([480, 700, 600, 700, 575, 650, 505, 650], '#2b5a3a', OL, 5);
  addLight(540, 720, 420, `rgba(255,200,110,${.45 - sun * .2})`);
  const pile = Math.floor(k * 14); for (let i = 0; i < pile; i++) rr(580 + (hash(i) - .5) * 14, 826 - i * 7, 110, 9, 2, '#efe6d4', OL, 2);
  rr(200, 826, 190, 14, 2, '#efe6d4', OL, 3);
  c.save(); c.translate(300 + 60 * .7 + wr * .7, 800); c.rotate(.5); rr(-4, -50, 8, 56, 3, '#d9a441', OL, 3); c.restore();
  for (const sd of [-1, 1]) ell(300 + sd * 45 + (sd > 0 ? wr * .7 : 0), 812, 24, 18, WOLF_C.paw, OL, 4);
};

SCENES.insa = S => {
  const t = S.t, k = S.k, rows = 16, built = ease(cl(k / .75, 0, 1)) * rows;
  cam(360, lerp(820, 600, ease(cl((k - .4) / .6, 0, 1))), lerp(1.25, 1.0, ease(k)));
  c.fillStyle = lg(0, -200, 0, 1000, [[0, '#0b0e18'], [1, '#22180f']]); c.fillRect(-300, -300, 1320, 1900);
  for (let i = 0; i < 30; i++) ell(hash(i) * 720, hash(i + 2) * 300 - 100, 1.5, 1.5, 'rgba(255,255,240,.5)', null);
  c.fillStyle = '#2a2019'; c.fillRect(-300, 940, 1320, 700); rr(-300, 936, 1320, 12, 0, '#4a3a2c', OL, 4); rr(-300, 1010, 1320, 16, 0, '#3a2d22', OL, 3);
  const bx = 150, bw = 420, bh = 34;
  for (let r = 0; r < Math.ceil(built); r++) {
    const y = 940 - (r + 1) * bh, part = cl(built - r, 0, 1), n = 6;
    for (let i = 0; i < n * part; i++) { const off = r % 2 ? 35 : 0, x = bx + off + i * 70 - (r % 2 ? 35 : 0); if (x + 70 > bx + bw + 1 || x < bx - 1) continue;
      const drop = r === Math.floor(built) ? (1 - (built * n - r * n - i)) * 0 : 0;
      rr(x + 2, y + 2 + drop, 66, bh - 4, 3, `rgb(${120 + hash(r * 9 + i) * 30 | 0},${58 + hash(r + i) * 20 | 0},${40})`, OL, 3); }
  }
  if (built >= rows - .01) { // tamamlanınca: tabela + vitrin ışığı
    const on = ss(.78, .88, k);
    rr(bx + 40, 940 - 200, bw - 80, 160, 4, `rgba(240,170,80,${.2 + .75 * on})`, OL, 6);
    rr(bx - 20, 940 - rows * bh - 70, bw + 40, 70, 6, '#3d2516', OL, 6);
    c.save(); c.font = '700 34px Cinzel,Georgia,serif'; c.textAlign = 'center'; c.fillStyle = `rgba(242,196,100,${on})`; c.shadowColor = 'rgba(255,170,60,.8)'; c.shadowBlur = 20 * on; c.fillText("DEMİR'İN DÜKKÂNI", bx + bw / 2, 940 - rows * bh - 24); c.restore();
    addLight(bx + bw / 2, 940 - 120, 400 * on, `rgba(255,170,70,${.4 * on})`);
  }
  // ilk tuğlayı koyan pati (başta)
  if (k < .2) { const a = 1 - ss(.12, .2, k); c.save(); c.globalAlpha = a; ell(bx + 36, 880 - Math.sin(cl(k / .12, 0, 1) * PI) * 30, 34, 28, WOLF_C.paw, OL, 5); c.restore(); }
  // önden geçen / sonra durup bakan siluetler
  const look = ss(.8, .95, k);
  [[-60, 'fox'], [90, 'cat'], [600, 'bear'], [760, 'rabbit']].forEach(([x0, ty], i) => {
    const walk = (1 - look), x = x0 + walk * Math.sin(k * 3 + i) * 0 + (1 - look) * (i % 2 ? -1 : 1) * 160 * (k - .5);
    silhouette(x, 1300, .72, { type: ty, flip: i % 2 === 1, tilt: -look * .35, bob: walk * Math.abs(Math.sin(t * 6 + i)) * -8, eyes: look > .3, rim: .35 });
  });
};

// ---------- 8) Sessizce büyüyen ağaç ----------
const TREE = makeBranches(21, 360, 960, -PI / 2, 150, 6, .5, [], 0, .18);
SCENES.agac = S => {
  const t = S.t, k = S.k, g = ease(cl(k * 1.1, 0, 1));
  cam(360, lerp(860, 620, g), lerp(1.6, 1.0, g));
  c.fillStyle = lg(0, -300, 0, 1000, [[0, '#070a14'], [1, '#1a1a26']]); c.fillRect(-300, -300, 1320, 1900);
  for (let i = 0; i < 90; i++) ell(-200 + hash(i) * 1120, -250 + hash(i + 3) * 950, 1.6, 1.6, `rgba(255,255,240,${.25 + .6 * hash(i + 5) * (.6 + .4 * Math.sin(t * 2 + i))})`, null);
  const mx = lerp(80, 640, k); ell(mx, 160 - Math.sin(k * PI) * 60, 44, 44, '#ece6d2', null); addLight(mx, 160 - Math.sin(k * PI) * 60, 260, 'rgba(200,210,240,.25)');
  blob([-300, 1000, -100, 960, 200, 940, 360, 935, 520, 940, 820, 960, 1020, 1000, 1020, 1600, -300, 1600], '#141a12', null);
  drawBranches(TREE, g, 7, '#2a1c12', 2.4);
  for (const b of TREE) { const kk = cl(g * 7 - b.t0, 0, 1); if (b.t0 >= 4 && kk > .6) for (let j = 0; j < 4; j++) { const lx = b.ex + (hash(b.ex + j) - .5) * 60, ly = b.ey + (hash(b.ey + j) - .5) * 50; ell(lx, ly, 22 * ss(.6, 1, kk), 18 * ss(.6, 1, kk), `rgb(${46 + hash(j + b.ex) * 30 | 0},${88 + hash(j) * 40 | 0},${44})`, null); } }
  for (let i = 0; i < 18; i++) { const fx = 360 + Math.sin(t * .5 + i * 2.1) * 300, fy = 700 + Math.cos(t * .4 + i * 1.3) * 220, a = .5 + .5 * Math.sin(t * 3 + i); ell(fx, fy, 3, 3, `rgba(230,255,150,${a * g})`, null); addLight(fx, fy, 30, `rgba(220,255,140,${.25 * a * g})`); }
};

// ---------- 9) Defter yeniden açılıyor ----------
SCENES.acilis = S => {
  const t = S.t, k = S.k, o = ease(cl((k - .15) / .45, 0, 1));
  cam(360, 700, 1.25 - .15 * k);
  c.fillStyle = '#0b0807'; c.fillRect(-300, -300, 1320, 1900);
  rr(-300, 840, 1320, 700, 0, '#21160f', null); rr(-300, 820, 1320, 30, 4, '#3a2618', OL, 6);
  if (o > .3) { c.save(); c.globalCompositeOperation = 'lighter'; for (let i = 0; i < 9; i++) { const a = -PI / 2 + (i - 4) * .18 + Math.sin(t + i) * .02; c.fillStyle = `rgba(255,210,130,${.08 * o})`; c.beginPath(); c.moveTo(360, 740); c.lineTo(360 + Math.cos(a - .05) * 900, 740 + Math.sin(a - .05) * 900); c.lineTo(360 + Math.cos(a + .05) * 900, 740 + Math.sin(a + .05) * 900); c.closePath(); c.fill(); } c.restore(); }
  notebook(o > .01 ? 360 : 270, 770, 1.15, o, o * 1.2, 1 - ss(.1, .4, k));
  // savrulan toz
  for (let i = 0; i < 40; i++) { const p = cl((k - .15) * 2 + hash(i) * .3, 0, 1); if (p <= 0 || p >= 1) continue; ell(360 + (hash(i + 1) - .5) * 300 + (hash(i + 2) - .5) * 400 * p, 760 - p * 300 * hash(i + 3), 2.5, 2.5, `rgba(255,220,170,${(1 - p) * .8})`, null); }
  for (const sd of [-1, 1]) { const px = 360 + sd * lerp(150, 250, o), py = 860; ell(px, py, 46, 38, WOLF_C.paw, OL, 5); capsule([px + sd * 40, 1200, px + sd * 10, 900], 70, WOLF_C.sleeve, 6); }
  dustMotes(t, 40, 100, 300, 520, 500, .5 * o);
};

// ---------- 10) Dükkân açıldı, gülenler susuyor ----------
SCENES.dukkan = S => {
  const t = S.t, k = S.k; cam(lerp(330, 360, k), lerp(700, 680, k), lerp(1.18, 1.08, k));
  drawStreet(t, { lamp: 1, sign: "DEMİR'İN DÜKKÂNI" });
  const p = Object.assign({}, MOODS.demir.happy, { t, talk: 0, lookX: .4, lookY: .1, blink: (t % 3 < .14) ? 1 : 0, tilt: .02, L: { x: -148, y: -272, hand: 'relax' }, R: { x: 34, y: -492, hand: 'relax' } });
  c.save(); c.translate(300, 985); c.scale(.56, .56); drawWolf(p); c.restore();
  drawSplashes(t);
  // önde, sırtı dönük siluetler: biri başını eğip uzaklaşır
  [[110, 'fox', 0], [560, 'cat', 1], [700, 'bear', 0]].forEach(([x, ty, leave], i) => {
    const go = leave ? ss(.45, 1, k) : 0;
    silhouette(x + go * 300, 1330, 1.05, { type: ty, eyes: false, tilt: leave ? .25 * ss(.3, .5, k) : -.05, rim: .3, bob: go ? -Math.abs(Math.sin(t * 6)) * 8 : 0 });
  });
  drawRain(t, 720, 1280, 1, .7);
};

// ---------- 11) KAPANIŞ: Kâzım'ın Defteri ----------
SCENES.kapanis = S => {
  const t = S.t, lt = S.lt, Q = S.quote || '';
  c.fillStyle = '#050302'; c.fillRect(-100, -100, 920, 1480);
  const lamp = ss(0, .9, lt), page = ss(.9, 1.8, lt);
  // sayfa
  if (page > 0) {
    c.save(); c.globalAlpha = page; c.translate(360, 660); c.rotate(-.025); c.scale(.96 + .04 * page, .96 + .04 * page);
    blob([-290, -380, 0, -392, 290, -378, 300, 0, 286, 400, 0, 412, -294, 398, -300, 0], lg(0, -400, 0, 400, [[0, '#efe0bd'], [1, '#dcc79c']]), '#5a3a20', 5, .4);
    c.save(); c.globalAlpha *= .25; for (let i = 0; i < 9; i++) ell((hash(i) - .5) * 480, (hash(i + 2) - .5) * 700, 30 + hash(i + 4) * 60, 20 + hash(i + 5) * 40, '#b38a55', null); c.restore();
    for (let y = -250; y < 330; y += 58) line(-240, y, 240, y, 'rgba(120,90,60,.22)', 2);
    line(-200, -380, -200, 400, 'rgba(170,60,50,.25)', 2);
    c.save(); c.font = '700 22px Cinzel,Georgia,serif'; c.fillStyle = 'rgba(90,58,32,.8)'; c.textAlign = 'center'; c.letterSpacing = '6px'; c.fillText("KÂZIM'IN DEFTERİ", 0, -300); c.restore();
    // el yazısıyla ders (harf harf yazılır)
    const words = Q.split(' '), lines = []; let cur = '';
    c.font = '700 64px Caveat,cursive';
    for (const w of words) { const tt = cur ? cur + ' ' + w : w; if (c.measureText(tt).width > 470) { lines.push(cur); cur = w; } else cur = tt; } if (cur) lines.push(cur);
    const total = Q.length, shown = Math.floor(total * ss(1.6, 1.6 + total * .055, lt));
    let n = 0, penX = 0, penY = 0;
    lines.forEach((ln, i) => {
      const y = -150 + i * 78 - (lines.length - 1) * 20, part = ln.slice(0, cl(shown - n, 0, ln.length)); n += ln.length + 1;
      c.textAlign = 'center'; c.fillStyle = '#2a1608'; const fw = c.measureText(ln).width; c.textAlign = 'left';
      c.fillText(part, -fw / 2, y); if (part.length && part.length <= ln.length) { penX = -fw / 2 + c.measureText(part).width; penY = y; }
    });
    // tüy kalem
    if (shown < total && shown > 0) { c.save(); c.translate(penX + 6, penY - 6); c.rotate(-.7 + Math.sin(t * 20) * .05);
      blob([0, 0, 8, -60, 30, -170, 12, -200, -14, -150, -6, -60], '#f4efe6', OL, 3); line(0, 0, 14, -190, '#8a7a66', 2); c.restore(); }
    // mühür
    const sealT = 1.6 + total * .055 + .3, sk = ss(sealT, sealT + .25, lt);
    if (sk > 0) {
      const sc = 1 + 1.2 * (1 - sk); c.save(); c.translate(170, 250); c.scale(sc, sc); c.globalAlpha *= sk;
      blob([-70, -10, -60, -58, -10, -76, 50, -64, 76, -10, 62, 54, 8, 76, -50, 62], '#8a1a1e', null);
      ell(0, 0, 52, 52, '#a8252a', '#6e1215', 4);
      for (const s2 of [-1, 1]) { ell(s2 * 17, -6, 13, 13, '#7a1418', null); poly([s2 * 10, -30, s2 * 30, -50, s2 * 30, -22], '#7a1418', null); }
      poly([-6, 8, 6, 8, 0, 18], '#7a1418', null); c.restore();
    }
    const fin = ss(sealT + .3, sealT + .9, lt);
    c.save(); c.globalAlpha *= fin; c.textAlign = 'center';
    c.font = '600 26px Inter,Arial,sans-serif'; c.fillStyle = '#5a3a20'; c.fillText('@baykus.kazim', -40, 300);
    c.font = 'italic 600 24px Georgia,serif'; c.fillText('İzle, öğren ve sessizce yüksel…', -40, 340); c.restore();
    c.restore();
  }
  // fener (yukarıda asılı, sayfayı aydınlatır)
  c.save(); c.globalAlpha = lamp; drawLantern(360, 30 + Math.sin(t * 1.2) * 6, lamp, t, 1.25); c.restore();
  c.save(); c.globalCompositeOperation = 'multiply'; c.fillStyle = rg(360, 200, 100, 1100, [[0, 'rgba(255,255,255,1)'], [.6, 'rgba(120,90,60,1)'], [1, 'rgba(10,6,3,1)']]); c.fillRect(-100, -100, 920, 1480); c.restore();
};
