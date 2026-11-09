// Ara sahneler (5): "Peron" bölümü: istasyon, tren, Ela, veda, raylar, kahkaha, atkı, sabah treni.
// Ela: kar beyazı dişi kurt, lavanta palto, kırmızı bere ve kırmızı atkı. drawWolf'u renk paletini değiştirerek kullanır.
const ELA_C = { fur: '#e9e6ee', furD: '#bdb8c8', white: '#fbfaf8', jacket: '#8a7aa8', jacketD: '#64557f', sleeve: '#8a7aa8', cuff: '#64557f', band: '#8a7aa8',
  scarf: '#c8302a', scarfD: '#8e1c18', shirt: '#efe6da', shirtD: '#d8cdbd', jeans: '#3a3448', paw: '#d6d2dc', headL: '#f6f4f8', stripe: '#dcd8e4',
  lid: '#dcd8e4', brow: '#8a8494', mark: '#b0aabb', dot: '#fbfaf8', shoe: '#7a2a2a', eye: ['#a6dccf', '#3f8a7c', '#1e4a42'], plainSleeve: true };
function withPalette(pal, fn) { const old = {}; for (const k in pal) { old[k] = WOLF_C[k]; WOLF_C[k] = pal[k]; } try { fn(); } finally { for (const k in pal) { if (old[k] === undefined) delete WOLF_C[k]; else WOLF_C[k] = old[k]; } } }
function drawEla(p) { withPalette(ELA_C, () => drawWolf(Object.assign({ noLetter: true, noGlasses: true, lashes: true, beret: '#c8302a' }, p))); }
const SCARF = '#c8302a', SCARF_D = '#8e1c18';

// Kırmızı atkı: düz kumaş şerit (rüzgârda kıvrılır: yer yer daralıp genişler), enine çizgili, saçaklı uçlu
function ribbonScarf(pts, w, t = 0, twist = 1) {
  const n = pts.length / 2, Lp = [], Rp = [];
  for (let i = 0; i < n; i++) {
    const a = Math.atan2(pts[Math.min(n - 1, i + 1) * 2 + 1] - pts[Math.max(0, i - 1) * 2 + 1], pts[Math.min(n - 1, i + 1) * 2] - pts[Math.max(0, i - 1) * 2]);
    const wi = w / 2 * lerp(1, .35 + .65 * Math.abs(Math.cos(t * 3 + i * .9)), twist), nx = -Math.sin(a), ny = Math.cos(a);
    Lp.push([pts[i * 2] + nx * wi, pts[i * 2 + 1] + ny * wi]); Rp.push([pts[i * 2] - nx * wi, pts[i * 2 + 1] - ny * wi]);
  }
  const poly2 = [...Lp, ...Rp.slice().reverse()].flat();
  c.beginPath(); smoothPath(poly2, true, .6); c.fillStyle = SCARF; c.fill(); texFill('knit', .8);
  c.save(); c.clip(); for (let i = 1; i < n; i += 2) { c.beginPath(); c.moveTo(Lp[i][0], Lp[i][1]); c.lineTo(Rp[i][0], Rp[i][1]); c.lineWidth = w * .22; c.strokeStyle = SCARF_D; c.stroke(); } c.restore();
  c.beginPath(); smoothPath(poly2, true, .6); c.lineWidth = 5; c.strokeStyle = OL; c.stroke();
  const e = n - 1, ea = Math.atan2(pts[e * 2 + 1] - pts[e * 2 - 1], pts[e * 2] - pts[e * 2 - 2]);
  for (let k = 0; k <= 4; k++) { const fx = lerp(Lp[e][0], Rp[e][0], k / 4), fy = lerp(Lp[e][1], Rp[e][1], k / 4); line(fx, fy, fx + Math.cos(ea) * 16, fy + Math.sin(ea) * 16, SCARF, 5); }
}
function redScarf(pts, w = 34) { ribbonScarf(pts, w, 0, 0); }
// Rüzgârda dalgalanan atkı (baş noktası x,y; yön ang; uzunluk len)
function windScarf(x, y, ang, len, t, amp = 18, w = 48) {
  const pts = [], n = 8;
  for (let i = 0; i <= n; i++) { const d = i / n * len, wv = Math.sin(t * 8 - i * 1.0) * amp * (i / n); pts.push(x + Math.cos(ang) * d - Math.sin(ang) * wv, y + Math.sin(ang) * d + Math.cos(ang) * wv); }
  ribbonScarf(pts, w, t, 1);
}

// ---------- İstasyon: perona karşıdan bakış (raylar karakterlerin arkasında) ----------
const ST_PAL = {
  night: { sky: ['#05080f', '#141c30'], far: '#0c111e', plat: '#2c2c30', floor: ['#34302e', '#1c1916'], roof: '#14171c', pillar: '#1f3a34', lamp: 1 },
  dawn: { sky: ['#2a3a6a', '#f2a65a'], far: '#4a3446', plat: '#6a5a58', floor: ['#7a6a60', '#3a2e28'], roof: '#2a2426', pillar: '#2f4a40', lamp: .25 },
  day: { sky: ['#8fb8d8', '#e8eef0'], far: '#8a96a4', plat: '#a8a49c', floor: ['#b8b2a6', '#8a8478'], roof: '#4a4a50', pillar: '#3f6a5c', lamp: 0 },
};
function stationClock(x, y, min, r = 46) {
  line(x, -60, x, y - r, '#1a1a1e', 6);
  ell(x, y, r + 8, r + 8, '#1c1c20', OL, 6); ell(x, y, r, r, '#f4efe2', OL, 3);
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; line(x + Math.cos(a) * r * .78, y + Math.sin(a) * r * .78, x + Math.cos(a) * r * .9, y + Math.sin(a) * r * .9, OL, i % 3 ? 2 : 4); }
  const hA = (min % 720) / 720 * TAU, mA = (min % 60) / 60 * TAU;
  line(x, y, x + Math.sin(hA) * r * .5, y - Math.cos(hA) * r * .5, OL, 6); line(x, y, x + Math.sin(mA) * r * .8, y - Math.cos(mA) * r * .8, OL, 3.5);
  line(x, y, x + Math.sin(mA * 60) * r * .82, y - Math.cos(mA * 60) * r * .82, '#c8302a', 2); ell(x, y, 5, 5, '#c8302a', null);
}
function drawStation(t, o = {}) {
  const P = ST_PAL[o.pal || 'night'], night = (o.pal || 'night') === 'night';
  c.fillStyle = lg(0, -300, 0, 700, [[0, P.sky[0]], [1, P.sky[1]]]); c.fillRect(-500, -500, 1720, 1300);
  if (night) for (let i = 0; i < 60; i++) ell(-200 + hash(i) * 1120, -100 + hash(i + 3) * 500, 1.3, 1.3, `rgba(255,255,240,${.2 + .4 * hash(i + 5)})`, null);
  if (o.pal === 'dawn') { ell(470, 600, 90, 90, 'rgba(255,236,190,.95)', null); addLight(470, 600, 620, 'rgba(255,190,110,.5)'); }
  // uzak şehir + karşı peron
  for (let i = 0; i < 18; i++) { const x = -400 + i * 90, h = 120 + hash(i + 40) * 200; rr(x, 640 - h, 74 + hash(i) * 30, h, 2, P.far, null);
    if (night || o.pal === 'dawn') for (let j = 0; j < 5; j++) if (hash(i * 7 + j) > .55) rr(x + 12 + (j % 2) * 28, 660 - h + Math.floor(j / 2) * 40, 12, 16, 1, `rgba(255,205,130,${night ? .7 : .35})`, null); }
  rr(-500, 628, 1720, 44, 2, P.plat, OL, 4); rr(-500, 628, 1720, 8, 2, 'rgba(255,255,255,.12)', null);
  for (const x of [-120, 250, 620, 990]) { rr(x - 6, 430, 12, 200, 3, '#1a1a1e', OL, 3); rr(x - 26, 420, 52, 14, 4, '#1a1a1e', OL, 3); if (P.lamp) { ell(x, 438, 18, 6, '#ffe2a6', null); addLight(x, 445, 180, `rgba(255,200,120,${.35 * P.lamp})`); } }
  // ray yatağı
  c.fillStyle = lg(0, 672, 0, 840, [[0, '#24201c'], [1, '#14110e']]); c.fillRect(-500, 672, 1720, 168);
  for (let x = -500; x < 1220; x += 56) rr(x, 770, 34, 16, 2, '#3a2e24', null);
  for (const y of [760, 796]) { rr(-500, y, 1720, 9, 2, '#6a6e74', null); line(-500, y + 2, 1220, y + 2, 'rgba(255,255,255,.35)', 2); }
  if (o.train) o.train();
  // yakın peron
  rr(-500, 832, 1720, 34, 2, '#55524c', OL, 5);
  rr(-500, 866, 1720, 14, 0, '#e8c040', OL, 3); for (let x = -500; x < 1220; x += 18) ell(x, 873, 3, 3, 'rgba(0,0,0,.3)', null);
  c.fillStyle = lg(0, 880, 0, 1500, [[0, P.floor[0]], [1, P.floor[1]]]); c.fillRect(-500, 880, 1720, 900);
  for (let y = 920; y < 1500; y += 60) line(-500, y, 1220, y, 'rgba(0,0,0,.22)', 2);
  for (let x = -500; x < 1220; x += 120) line(x, 880, x - 40, 1500, 'rgba(0,0,0,.15)', 2);
  if (night) { c.save(); c.globalCompositeOperation = 'lighter'; for (const x of [90, 420]) c.fillStyle = lg(0, 900, 0, 1400, [[0, 'rgba(255,190,110,.16)'], [1, 'rgba(0,0,0,0)']]), c.fillRect(x - 30, 900, 60, 500); c.restore(); }
  // saçak, kolonlar, tabela, saat, lambalar
  c.fillStyle = P.roof; c.fillRect(-500, -500, 1720, 560); rr(-500, 40, 1720, 44, 0, P.roof, OL, 5);
  for (let x = -480; x < 1220; x += 80) poly([x, 84, x + 40, 84, x + 20, 104], P.roof, OL, 3);
  for (const x of [20, 700]) { rr(x - 16, 84, 32, 790, 4, P.pillar, OL, 5); rr(x - 24, 84, 48, 22, 4, P.pillar, OL, 4); rr(x - 24, 852, 48, 20, 4, P.pillar, OL, 4); }
  for (const x of [190, 330]) line(x, 84, x, 180, '#1a1a1e', 4); rr(170, 180, 180, 54, 6, '#1d3c6e', OL, 5); c.save(); c.font = '700 26px Inter,Arial'; c.fillStyle = '#fff'; c.textAlign = 'center'; c.fillText('PERON 3', 260, 217); c.restore();
  stationClock(560, 200, o.min ?? 1427);
  for (const x of [90, 420]) { line(x, 84, x, 300, '#1a1a1e', 3); poly([x - 30, 300, x + 30, 300, x + 16, 280, x - 16, 280], '#1a1a1e', OL, 3); ell(x, 302, 20, 7, '#ffe8b8', null); if (P.lamp) addLight(x, 320, 380, `rgba(255,195,110,${.42 * P.lamp})`); }
}

// Tren: x0 sol ucu (burun), sağa doğru vagonlar. doors: 0 kapalı .. 1 açık. who(cx, doorX) kapı içinde çizilecek karakter
const CAR = 740;
function drawTrain(x0, o = {}) {
  const cars = o.cars ?? 3, doors = o.doors || 0, lit = o.lit ?? 1, day = o.day;
  for (let n = 0; n < cars; n++) {
    const x = x0 + n * CAR; if (x > 1300 || x + CAR < -600) continue;
    rr(x + 6, 460, CAR - 12, 340, 18, lg(0, 460, 0, 800, [[0, '#3a5478'], [.6, '#24364f'], [1, '#18243a']]), OL, 6);
    rr(x + 20, 446, CAR - 40, 22, 8, '#5a6a80', OL, 4);
    rr(x + 6, 700, CAR - 12, 22, 0, '#c8302a', null); rr(x + 6, 728, CAR - 12, 6, 0, '#e8e2d2', null);
    for (const wx of [40, 310, 580]) { // pencereler
      const win = (wx === 310) ? 0 : 1; if (!win) continue;
      rr(x + wx, 510, 130, 120, 10, lit ? (day ? '#cfe0ec' : '#ffd89a') : '#2a3240', OL, 4);
      rr(x + wx + 8, 590, 50, 40, 6, 'rgba(60,40,30,.5)', null); rr(x + wx + 70, 590, 50, 40, 6, 'rgba(60,40,30,.5)', null);
      c.save(); c.globalAlpha = .35; line(x + wx + 20, 520, x + wx + 60, 600, '#fff', 4); c.restore();
      if (lit && !day) addLight(x + wx + 65, 570, 120, 'rgba(255,200,120,.22)');
    }
    // kapılar (ortada çift kanat)
    const dx = x + 230, dw = 210, open = doors * 96;
    rr(dx, 490, dw, 290, 6, lit ? (day ? '#d8e4ea' : '#ffdca0') : '#2a3240', OL, 5);                          // kapı boşluğu (iç)
    if (open > 4) { line(dx + dw / 2, 500, dx + dw / 2, 776, '#d8a830', 7); rr(dx + 4, 740, dw - 8, 36, 2, 'rgba(80,60,40,.35)', null); }
    if (o.who && n === (o.whoCar ?? 0)) o.who(dx + dw / 2, 776);
    for (const s of [-1, 1]) {
      const px = s < 0 ? dx - open : dx + dw / 2 + open;
      c.save(); c.beginPath(); c.rect(dx - 100, 480, dw + 200, 310); c.clip();
      rr(px, 490, dw / 2, 290, 4, '#2c4262', OL, 5); rr(px + 18, 512, dw / 2 - 36, 110, 6, lit ? (day ? '#cfe0ec' : '#ffd89a') : '#2a3240', OL, 3);
      rr(px, 700, dw / 2, 22, 0, '#c8302a', null);
      c.restore();
    }
    if (open > 4 && lit && !day) addLight(dx + dw / 2, 640, 260, `rgba(255,205,130,${.35 * doors})`);
    // boji + tekerler
    for (const bx of [110, CAR - 150]) { rr(x + bx - 70, 790, 180, 22, 4, '#121418', OL, 4); for (const k of [-36, 76]) { ell(x + bx + k, 812, 24, 24, '#2a2c30', OL, 4); ell(x + bx + k, 812, 8, 8, '#6a6e74', null); } }
    if (n > 0) rr(x - 14, 600, 28, 140, 4, '#121418', OL, 4); // körük
  }
  if (o.nose !== false) { // ön burun (soldaki ilk vagon)
    blob([x0 + 20, 462, x0 - 60, 500, x0 - 110, 640, x0 - 110, 790, x0 + 20, 798], lg(0, 460, 0, 800, [[0, '#3a5478'], [1, '#18243a']]), OL, 6, .6);
    blob([x0 + 10, 492, x0 - 50, 520, x0 - 84, 610, x0 + 10, 612], lit ? '#9ab0c8' : '#2a3240', OL, 4, .6);
    rr(x0 - 112, 700, 130, 22, 0, '#c8302a', null);
    ell(x0 - 92, 742, 12, 10, '#fff6d8', OL, 3); if (o.lights !== false) addLight(x0 - 92, 742, 220, 'rgba(255,240,200,.5)');
  }
}

function screenRain(t, layer, a) { c.save(); c.setTransform(BASEX, 0, 0, BASEX, 0, 0); drawRain(t, 720, 1280, layer, a); c.restore(); }
// Diyalog mekânları (mekanlar.js'ten SONRA yüklenir)
PLACES.istasyon = { rain: true, bg(t) { drawStation(t, { pal: 'night', min: 1428 + Math.floor(t / 60) }); } };
PLACES.istasyon_safak = { rain: false, bg(t) { drawStation(t, { pal: 'dawn', min: 362 + Math.floor(t / 60) }); } };

// Kurtu (önden) bir el pozuyla çizer; ekstra: atkıyı iki patiyle tutar
function demirPose(mood, extra) { return Object.assign({}, MOODS.demir[mood], { blink: 0, L: { x: -148, y: -272, hand: 'relax' }, R: { x: 148, y: -272, hand: 'relax' } }, extra); }

// ---------- 0) SİNEMATİK AÇILIŞ: gece 23:47, son tren gelir, kimse inmez ----------
SCENES.istasyon_acilis = S => {
  const t = S.t, lt = S.lt, arrive = ease(cl((lt - .6) / 3.2, 0, 1)), doors = ss(3.9, 4.6, lt), drop = ss(5.2, 6.2, lt);
  cam(lerp(400, 430, ss(0, 7, lt)), lerp(700, 760, ss(0, 7, lt)), lerp(1.12, 1.32, ss(0, 7, lt)));
  const tx = lerp(1250, -500, arrive);
  drawStation(t, { pal: 'night', min: 1427, train: () => drawTrain(tx, { cars: 3, doors, whoCar: 1 }) });
  screenRain(t, 0, .7);
  // Demir peron kenarında, iki patisiyle kırmızı atkıyı tutuyor; tren gelince umutla kapıya bakar, sonra başı düşer
  const look = ss(3.6, 4.4, lt) * (1 - drop);
  const p = demirPose(look > .5 ? 'surprised' : 'sad', { t, talk: 0, lookX: lerp(-.2, .7, look), lookY: lerp(.5, -.1, look) + drop * .7, tilt: lerp(.02, -.06, look) + drop * .08,
    blink: (lt % 3.7 < .14) ? 1 : 0, nod: drop * .5, L: { x: -30, y: -430, hand: 'relax' }, R: { x: 30, y: -426, hand: 'relax' } });
  c.save(); c.translate(470, 1240); c.scale(.6, .6); drawWolf(p);
  const sw = Math.sin(t * 1.8) * 6;
  redScarf([-30, -420, -40 + sw * .5, -360, -36 + sw, -290, -42 + sw * 1.3, -210], 52); redScarf([30, -416, 38 + sw * .5, -360, 32 + sw * 1.1, -300, 36 + sw * 1.2, -250], 52);
  c.restore();
  screenRain(t, 1, .8);
  letterbox(1, 150);
  typeText('GECE 23:47 · SON TREN', ss(.5, 2.3, lt), 40, 1222, '600 22px Cinzel,Georgia,serif', 'rgba(200,215,240,.85)');
};

// ---------- 1) BOŞ TREN: kapılar açılır, kimse yok (kalp atışı) ----------
SCENES.tren_bos = S => {
  const t = S.t, lt = S.lt, k = S.k, doors = ss(.2, 1.4, lt), beat = Math.max(0, Math.sin(lt * 7.5)) ** 8 * (1 - ss(2.2, 3.2, lt)) * ss(1.2, 1.6, lt);
  cam(lerp(560, 580, k), 640, lerp(1.7, 1.85, k) * (1 + beat * .02));
  drawStation(t, { pal: 'night', min: 1428, train: () => drawTrain(-500 + 0, { cars: 3, doors, whoCar: 1 }) });
  // içerideki tutamaklar sallanıyor
  const og = doors * 96; if (og > 2) { c.save(); c.beginPath(); c.rect(575 - og, 494, og * 2, 282); c.clip(); line(440, 506, 700, 506, '#8a8a90', 5); // yalnızca açılan kapı aralığında
  for (let i = 0; i < 4; i++) { const hx = 500 + i * 46, sw = Math.sin(t * 2 + i) * .12; c.save(); c.translate(hx, 500); c.rotate(sw); line(0, 0, 0, 40, '#8a8a90', 3); ell(0, 50, 10, 10, null, '#e8e2d2', 4); c.restore(); }
  c.restore(); }
  screenRain(t, 0, .6);
  // ön planda Demir'in sırtı (sol altta)
  c.save(); c.translate(400, 1290); c.scale(.62, .62); drawWolfBack({ t, walk: 0, tilt: -.02 }); c.restore();
  if (beat > .01) { c.save(); c.setTransform(BASEX, 0, 0, BASEX, 0, 0); c.fillStyle = rg(360, 640, 200, 800, [[0, 'rgba(0,0,0,0)'], [1, `rgba(120,0,0,${.35 * beat})`]]); c.fillRect(0, 0, 720, 1280); c.restore(); }
  screenRain(t, 1, .7);
};

// ---------- 2) VEDA (anı): gündüz, Ela trenin kapısında; geri bakar, kapılar kapanır, tren gider ----------
SCENES.veda = S => {
  const t = S.t, k = S.k, close = ss(.55, .7, k), go = ease(cl((k - .72) / .28, 0, 1));
  cam(lerp(560, 470, ease(k)), lerp(640, 700, ease(k)), lerp(2.0, 1.25, ease(k)));
  const tx = -500 - go * 1800;
  drawStation(t, { pal: 'day', min: 1020, train: () => drawTrain(tx, { cars: 3, doors: 1 - close, day: true, lights: false, whoCar: 1, who: (cx, fy) => {
    const pe = Object.assign({}, MOODS.demir.sad, { t, talk: 0, lookX: -.6, lookY: .3, blink: (t % 3.3 < .14) ? 1 : 0, tilt: .06, L: { x: -148, y: -272, hand: 'relax' }, R: { x: 148, y: -272, hand: 'relax' } });
    c.save(); c.beginPath(); c.rect(cx - 105, 490, 210, 290); c.clip(); c.translate(cx, fy); c.scale(.27, .27); drawEla(pe); c.restore();
  } }) });
  // ön planda Demir (arkadan), hafifçe öne uzanır
  c.save(); c.translate(400 + go * 40, 1270); c.scale(.66, .66); drawWolfBack({ t, walk: go * .3, tilt: -.03 - go * .04 }); c.restore();
  // rüzgârda uçuşan yapraklar
  for (let i = 0; i < 8; i++) { const x = ((t * 60 + i * 120) % 900) - 100, y = 300 + hash(i) * 500 + Math.sin(t * 2 + i) * 30; c.save(); c.translate(x, y); c.rotate(t * 2 + i); ell(0, 0, 10, 5, '#d98a3a', OL, 2); c.restore(); }
};

// ---------- 3) RAYLAR: peronda, perspektif; giden trenin kırmızı stop lambaları uzaklaşır ----------
SCENES.raylar = S => {
  const t = S.t, k = S.k, VX = 470, VY = 560, VT = 520, E = 300;                 // kaçış noktası (zemin VY, saçak VT)
  cam(360, 640, lerp(1.0, 1.06, k));
  const F = u => [VX + (E - VX) * u, VY + 940 * u], R = u => [VX + (E - VX) * u, VT - 840 * u]; // peron kenarı (zemin / saçak) derinlik u'da
  // gökyüzü + uzak şehir (sağda, rayların üstünde)
  c.fillStyle = lg(0, -300, 0, VY, [[0, '#05080f'], [1, '#1c2440']]); c.fillRect(-300, -300, 1320, VY + 300);
  for (let i = 0; i < 60; i++) ell(300 + hash(i) * 720, -100 + hash(i + 3) * 600, 1.3, 1.3, `rgba(255,255,240,${.25 + .5 * hash(i + 5)})`, null);
  for (let i = 0; i < 10; i++) { const x = 330 + i * 70, h = 30 + hash(i + 20) * 80; rr(x, VY - h, 60, h, 2, '#0a0e1a', null); for (let j = 0; j < 3; j++) if (hash(i * 5 + j) > .5) rr(x + 8 + j * 16, VY - h + 12, 7, 9, 1, 'rgba(255,200,120,.6)', null); }
  // ray yatağı (sağ)
  poly([VX, VY, 1100, VY + 30, 1100, 1500, E, 1500], '#1c1a18', null);
  for (let i = 1; i < 40; i++) { const u = 1 / (1 + (40 - i) * .35), y = VY + 940 * u, xl = VX + (E + 120 - VX) * u, xr = VX + (E + 460 - VX) * u; rr(xl - 20 * u, y, xr - xl + 40 * u, Math.max(1, 26 * u), 2, '#3a2e24', null); }
  for (const bx of [E + 120, E + 460]) { c.beginPath(); c.moveTo(VX, VY); c.lineTo(bx, 1500); c.lineWidth = 12; c.strokeStyle = '#6a6e74'; c.stroke(); c.lineWidth = 3; c.strokeStyle = 'rgba(255,255,255,.35)'; c.stroke(); }
  for (const bx of [E + 720, E + 1040]) { c.beginPath(); c.moveTo(VX, VY); c.lineTo(bx, 1500); c.lineWidth = 10; c.strokeStyle = '#4a4e54'; c.stroke(); }
  // uzaklaşan tren (ray ortasında, arkası bize dönük)
  const z = lerp(1.5, 60, Math.pow(cl(k * 1.15, 0, 1), 1.6)), u = 1 / z, cx = VX + (E + 290 - VX) * u, by = VY + 940 * u, sc = u * .78;
  if (sc > .012) {
    c.save(); c.translate(cx, by); c.scale(sc, sc);
    rr(-300, -620, 600, 600, 30, '#24364f', OL, 8); rr(-250, -560, 500, 220, 16, '#ffd89a', OL, 6); rr(-300, -240, 600, 30, 0, '#c8302a', null);
    for (const s of [-1, 1]) ell(s * 220, -140, 30, 30, '#ff2a1a', OL, 5);
    c.restore();
    for (const s of [-1, 1]) addLight(cx + s * 220 * sc, by - 140 * sc, Math.max(30, 300 * sc), 'rgba(255,40,20,.6)');
  } else for (const s of [-1, 1]) { ell(cx + s * 3, by - 3, 2, 2, '#ff3a2a', null); addLight(cx + s * 3, by - 3, 30, 'rgba(255,40,20,.6)'); }
  // peron: duvar, zemin, kenar yüzü, sarı çizgi
  poly([VX, VT, -300, 200, -300, 840, VX, VY], '#2a2420', null);                                             // istasyon duvarı
  for (let i = 1; i < 9; i++) { const uu = 1 / (1 + i * .55), x = VX + (-300 - VX) * uu * 1.0; line(x, VT + (200 - VT) * uu, x, VY + (840 - VY) * uu, 'rgba(0,0,0,.35)', 3); } // duvar derzleri
  for (const [i, col] of [[2, '#8a3a2a'], [4, '#2a4a6a']]) { const u1 = 1 / (1 + i * .55), u2 = 1 / (1 + (i + .6) * .55), x1 = VX + (-300 - VX) * u1, x2 = VX + (-300 - VX) * u2;
    poly([x1, lerp(VT, 200, u1) + 60 * u1, x2, lerp(VT, 200, u2) + 60 * u2, x2, lerp(VY, 840, u2) - 160 * u2, x1, lerp(VY, 840, u1) - 160 * u1], col, OL, 3); } // afişler
  const fl = F(1);
  poly([VX, VY, -300, 840, -300, 1500, fl[0], fl[1]], lg(0, VY, 0, 1500, [[0, '#2a2622'], [1, '#3a342e']]), null);   // peron zemini
  for (let i = 1; i < 14; i++) { const uu = 1 / (1 + i * .45), a = F(uu); line(a[0], a[1], -300, VY + (840 - VY) * uu * 1.0 + 280 * uu, 'rgba(0,0,0,.2)', 2); } // fayans çizgileri
  poly([VX, VY, fl[0], fl[1], fl[0] + 80, 1500], '#55524c', null);                                          // peron kenar yüzü
  c.beginPath(); c.moveTo(VX - 4, VY); c.lineTo(fl[0] - 70, 1500); c.lineWidth = 16; c.strokeStyle = '#e8c040'; c.stroke();
  c.save(); c.globalCompositeOperation = 'lighter'; for (let i = 1; i < 7; i++) { const uu = 1 / (1 + i * .9), p = F(uu); ell(p[0] - 90 * uu, p[1] + 20 * uu, 120 * uu, 30 * uu, 'rgba(255,190,110,.18)', null); } c.restore(); // ıslak zeminde lamba yansımaları
  // saçak (tavan) + kolonlar + lambalar
  const rl = R(1);
  poly([VX, VT, rl[0], rl[1], -300, -300, -300, 200], '#14171c', null);
  c.beginPath(); c.moveTo(VX, VT); c.lineTo(rl[0], rl[1]); c.lineWidth = 22; c.strokeStyle = '#1e2228'; c.stroke();
  for (let i = 9; i >= 1; i--) {
    const uu = 1 / (1 + i * .7), b = F(uu), r = R(uu), w = 46 * uu, x = b[0] - 60 * uu;
    rr(x - w / 2, r[1], w, b[1] - r[1], 4 * uu, '#1f3a34', OL, Math.max(1, 5 * uu));                       // kolon
    const ly = r[1] + 70 * uu; line(x + 120 * uu, r[1], x + 120 * uu, ly, '#111', Math.max(1, 3 * uu));
    ell(x + 120 * uu, ly, 26 * uu, 9 * uu, '#ffe8b8', null); addLight(x + 120 * uu, ly + 10 * uu, 260 * uu, 'rgba(255,195,110,.4)');
  }
  // Demir peronda (arkadan), sarı çizginin gerisinde durur
  c.save(); c.translate(120, 1330); c.scale(.6, .6); drawWolfBack({ t, walk: 0, tilt: .03 }); c.restore();
  screenRain(t, 1, .7);
};

// ---------- 4) KAHKAHA: gündüz, babasıyla çay içip gülen Demir ----------
SCENES.gulus = S => {
  const t = S.t, k = S.k, lt = S.lt;
  cam(lerp(370, 380, k), 780, lerp(1.12, 1.2, ease(k)));
  evIci(t, { min: 900, lamp: 0 });
  // pencereden gün ışığı
  c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = lg(0, 0, 400, 900, [[0, 'rgba(255,220,150,.28)'], [1, 'rgba(0,0,0,0)']]); poly([80, -200, 360, -200, 760, 1100, 300, 1100], c.fillStyle, null); c.restore();
  const laugh = t => .35 + .45 * Math.abs(Math.sin(t * 9)), bob = Math.abs(Math.sin(t * 9)) * 8;
  // ikisi masanın arkasında; bacaklar uzun masa örtüsünün arkasında kalır (örtünün altında görünmez)
  c.save(); c.beginPath(); c.rect(-300, -300, 1320, 1290); c.clip();
  const pm = Object.assign({}, MOODS.mehmetali.happy, { t, talk: laugh(t + .3), lid: .6, lookX: .7, lookY: 0, blink: 0, tilt: .08 + Math.sin(t * 4) * .03, L: { x: -100, y: -400, hand: 'relax' }, R: { x: 100, y: -400, hand: 'relax' } });
  c.save(); c.translate(222, 1065 - bob * .5); c.scale(.6, .6); drawMehmetAli(pm); c.restore();
  const pd = Object.assign({}, MOODS.demir.happy, { t, talk: laugh(t), lid: .55, mouth: 24, lookX: -.7, lookY: 0, blink: 0, tilt: -.12 + Math.sin(t * 4.5) * .04, nod: Math.sin(t * 9) * .3,
    L: { x: -96, y: -420, hand: 'relax' }, R: { x: 96, y: -420, hand: 'relax' } });
  c.save(); c.translate(490, 1070 - bob); c.scale(.58, .58); drawWolf(pd); c.restore();
  c.restore();
  evMasa(t, { food: true, hot: 1, teapot: false });
  dustMotes(t, 30, 100, 200, 520, 700, .5);
};

// ---------- 5) ATKI: şafakta, Demir kırmızı atkıyı rüzgâra bırakır ----------
SCENES.atki = S => {
  const t = S.t, k = S.k, lt = S.lt, rel = ss(.3, .4, k), fly = cl((k - .32) / .68, 0, 1);
  cam(lerp(420, 460, ease(k)), lerp(720, 600, ease(fly)), lerp(1.45, 1.2, ease(k)));
  drawStation(t, { pal: 'dawn', min: 368 });
  const X0 = 400, Y0 = 1240, SC = .62, arm = { x: lerp(150, 215, ss(.05, .3, k)), y: lerp(-300, -560, ss(.05, .3, k)), hand: rel > .5 ? 'open' : 'relax' };
  const p = demirPose('hope', { t, talk: 0, lid: lerp(.1, .3, fly), lookX: .7, lookY: lerp(.2, -.6, fly), tilt: -.05, blink: (lt % 3.9 < .14) ? 1 : 0, mouth: lerp(4, 14, fly), R: arm });
  c.save(); c.translate(X0, Y0); c.scale(SC, SC); drawWolf(p); c.restore();
  const hx = X0 + arm.x * SC + 18, hy = Y0 + arm.y * SC - 10;
  if (rel < .5) windScarf(hx, hy, -.1 + Math.sin(t * 3) * .1, 230, t, 16);
  else { // uçup giden atkı: kıvrılarak sağ üste, güneşe doğru
    const e = ease(fly), fx = lerp(hx, 900, e) + Math.sin(fly * 9) * 40, fy = lerp(hy, 120, e) - Math.sin(fly * PI) * 120, s = lerp(1, .35, e);
    c.save(); c.translate(fx, fy); c.scale(s, s); c.rotate(Math.sin(t * 2) * .25); windScarf(0, 0, 2.5, 230, t, 24); c.restore();
  }
  for (let i = 0; i < 12; i++) { const x = ((t * 140 + i * 90) % 1000) - 150, y = 200 + hash(i) * 700; line(x, y, x + 60, y - 6, 'rgba(255,240,220,.25)', 2); } // rüzgâr çizgileri
};

// ---------- 6) SABAH TRENİ: Demir yeni yola biner; Kâzım uzaktan izler ----------
SCENES.sabah_treni = S => {
  const t = S.t, k = S.k, lt = S.lt, walk = ss(0, .55, k), inside = ss(.5, .6, k), close = ss(.62, .72, k), go = ease(cl((k - .74) / .26, 0, 1));
  cam(lerp(420, 380, ease(k)), lerp(760, 700, ease(k)), lerp(1.3, 1.12, ease(k)));
  const tx = -745 - go * 1400;
  drawStation(t, { pal: 'dawn', min: 375, train: () => drawTrain(tx, { cars: 3, doors: 1 - close, lit: 1, whoCar: 1, who: (cx, fy) => {
    if (inside > .01 && close < .99) { c.save(); c.globalAlpha = inside; c.translate(cx, fy); c.scale(.27, .27); drawWolf(demirPose('hope', { t, talk: 0, lookX: .4, lookY: .1, mouth: 18, R: { x: 205, y: -620, hand: 'open' } })); c.restore(); }
  } }) });
  // Kâzım sağda, feneri elinde izliyor
  const pk = Object.assign({}, MOODS.kazim.warm, { t, talk: S.talk.kazim, lookX: -.6, lookY: .1, blink: (t % 3.1 < .14) ? 1 : 0, tilt: .04, R: { x: 186, y: -300, hand: 'relax' }, L: { x: -215, y: -310, hand: 'fist' }, lantern: .6 });
  c.save(); c.translate(610, 1180); c.scale(.5, .5); drawOwl(pk); c.restore();
  // Demir arkadan kapıya yürür (küçülerek), sonra içeri girer
  if (inside < 1) {
    const dx = lerp(300, 330, walk), dy = lerp(1320, 880, walk), ds = lerp(.62, .3, walk);
    c.save(); c.globalAlpha = 1 - inside; c.translate(dx, dy); c.scale(ds, ds); drawWolfBack({ t, walk: walk < 1 ? 1 : 0, tilt: Math.sin(t * 3.5) * .02 }); c.restore();
  }
};

// kapanış çizimi: dikişli (iyileşmiş) kırık kalp
function heartSketch(k, x, y, s = 1) {
  c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = '#3a2410'; c.lineWidth = 4; c.lineCap = 'round'; c.lineJoin = 'round';
  const seg = (a, b, pts) => { const kk = cl((k - a) / (b - a), 0, 1); if (kk <= 0) return; c.beginPath(); c.moveTo(pts[0], pts[1]); const n = pts.length / 2 - 1, m = kk * n; for (let i = 1; i <= Math.ceil(m); i++) { const f = Math.min(1, m - (i - 1)); c.lineTo(lerp(pts[i * 2 - 2], pts[i * 2], f), lerp(pts[i * 2 - 1], pts[i * 2 + 1], f)); } c.stroke(); };
  const H = []; for (let i = 0; i <= 32; i++) { const a = i / 32 * TAU, hx = 16 * Math.sin(a) ** 3, hy = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)); H.push(hx * 3.6, hy * 3.6 - 6); }
  seg(0, .5, H);
  seg(.45, .7, [0, -36, -10, -16, 8, 0, -8, 18, 6, 36, 0, 52]);                         // çatlak
  for (let i = 0; i < 3; i++) seg(.7 + i * .09, .78 + i * .09, [-14, -14 + i * 22, 14, -8 + i * 22]); // dikişler
  c.restore();
}
