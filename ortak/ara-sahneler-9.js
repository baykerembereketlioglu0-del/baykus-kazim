// Ara sahneler (9): "Gölge" (dostluk). Yağmurlu çay bahçesi, boş sandalyeler, anı sofrası, güneşle kaybolan gölge,
// fısıltı zinciri, grup sohbeti ("Görüldü"), karanlıkta yanan fener, son sofra (Kâzım oturur).
// ara-sahneler-2..8.js'ten SONRA yüklenir (blurredStreet, phoneFrame, bubble, pawFinger, demirPose, kf, scrText, letterbox, typeText).

// ---------- yardımcılar ----------
// Satırdaki kelimenin başlangıç zamanı (seslendirme zamanlamasıyla senkron); nth: kaçıncı geçiş
function wAt(line, word, nth = 0, def) {
  if (!line || !line.words) return def ?? 0; let n = 0;
  for (const w of line.words) if (w[0].toLocaleLowerCase('tr').replace(/[^a-zçğıöşüâîû]/g, '').startsWith(word)) { if (n++ === nth) return w[1]; }
  return def ?? line.start;
}
const blinkAt = (t, seed) => { const per = 2.6 + hash(seed) * 1.6, ph = (t + seed) % per; return ph < .16 ? Math.sin(ph / .16 * PI) : 0; };
function rainScr(t, layer, a) { c.save(); c.setTransform(BASEX, 0, 0, BASEX, 0, 0); drawRain(t, SW, SH, layer, a); c.restore(); }
function hexRgb(h) { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function mixCol(a, b, k) { const A = hexRgb(a), B = hexRgb(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], cl(k, 0, 1)))).join(',')})`; }
function mix3(a, b, d, k) { return k < .5 ? mixCol(a, b, k * 2) : mixCol(b, d, k * 2 - 1); }
// Herhangi bir karakteri çiz (yerel koordinatta)
function drawWho(kind, p) { if (kind === 'demir') drawWolf(p); else if (kind === 'kazim') drawOwl(p); else gangBody(kind, p); }
// Kolu yeniden çiz (masanın / yüzün önünde kalması gereken kol)
function armOver(kind, side, tgt, p) { if (kind === 'demir') return wolfArm(side, tgt); if (kind === 'kazim') return owlArm(side, tgt, p); const G = GANG[kind]; gangArm(G, side, tgt, G.sw); return ik(side * G.sw * .95, -548, tgt.x, tgt.y, 150, 140, side); }
function armJoint(kind, side, tgt) {
  if (kind === 'demir') { const S = side < 0 ? WOLF.SL : WOLF.SR; return ik(S[0], S[1], tgt.x, tgt.y, WOLF.l1, WOLF.l2, side); }
  if (kind === 'kazim') { const S = side < 0 ? OWL.SL : OWL.SR; return ik(S[0], S[1], tgt.x, tgt.y, OWL.l1, OWL.l2, side, tgt.hand === 'palm'); }
  const G = GANG[kind]; return ik(side * G.sw * .95, -548, tgt.x, tgt.y, 150, 140, side);
}
function gangPose(kind, extra) { return Object.assign({ t: 0, laugh: 0, lookX: 0, lookY: 0, tilt: 0, nod: 0 }, extra); }
function kazimPose(mood, extra) { return Object.assign({}, MOODS.kazim[mood], { lookX: 0, lookY: 0, blink: 0, tilt: 0, nod: 0, talk: 0, R: { x: 186, y: -300, hand: 'relax' }, L: { x: -215, y: -310, hand: 'fist' }, lantern: 1 }, extra); }

// ---------- eşyalar ----------
// İnce belli çay bardağı (tabağıyla); (x,y) tabağın ortası. fill: çay seviyesi, steam: buhar
function teaGlass(x, y, sc, fill = .85, steam = 0, t = 0, tip = 0) {
  c.save(); c.translate(x, y); c.rotate(tip); c.scale(sc, sc);
  ell(0, 0, 36, 9, '#e6dfd2', OL, 3); ell(0, -2, 22, 4, 'rgba(0,0,0,.12)', null);
  const G = [-15, -4, 15, -4, 20, -22, 11, -40, 21, -62, 22, -72, -22, -72, -21, -62, -11, -40, -20, -22];
  if (fill > 0) { c.save(); c.beginPath(); smoothPath(G, true, .6); c.clip(); const top = lerp(-6, -66, fill); c.fillStyle = lg(0, top, 0, -4, [[0, '#d0521e'], [1, '#7a1e08']]); c.fillRect(-30, top, 60, 80); ell(0, top, 21, 4, 'rgba(255,200,150,.45)', null); c.restore(); }
  c.beginPath(); smoothPath(G, true, .6); c.fillStyle = 'rgba(255,245,230,.16)'; c.fill(); c.lineWidth = 3; c.strokeStyle = OL; c.stroke();
  line(-14, -64, -9, -46, 'rgba(255,255,255,.55)', 2.5);
  c.restore();
  if (steam > 0) for (let i = 0; i < 3; i++) { const p = (t * .45 + i / 3) % 1, bx = x + (i - 1) * 7 * sc; c.save(); c.globalAlpha = steam * .4 * Math.sin(p * PI); curve([bx, y - (78 + p * 50) * sc, bx + Math.sin(t * 2 + i) * 9 * sc, y - (98 + p * 50) * sc, bx - Math.sin(t * 2.3 + i) * 6 * sc, y - (120 + p * 50) * sc], 'rgba(255,255,255,.9)', 3); c.restore(); }
}
// Bistro sandalye (önden); (x,y) ayakların yer çizgisi
function bistroChair(x, y, sc, col = '#33403a', rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(sc, sc);
  const bar = (x1, y1, x2, y2, w) => { line(x1, y1, x2, y2, OL, w + 6); line(x1, y1, x2, y2, col, w); };
  for (const s of [-1, 1]) { bar(s * 70, -178, s * 84, 0, 9); bar(s * 48, -178, s * 38, -8, 7); }
  rr(-92, -192, 184, 22, 9, col, OL, 5);
  for (const s of [-1, 1]) bar(s * 76, -192, s * 82, -330, 9);
  c.beginPath(); c.moveTo(-86, -318); c.quadraticCurveTo(0, -362, 86, -318); c.lineWidth = 22; c.strokeStyle = OL; c.stroke(); c.lineWidth = 15; c.strokeStyle = col; c.stroke();
  for (const k of [-38, 0, 38]) bar(k, -198, k, -334 - (38 - Math.abs(k)) * .35, 5);
  c.restore();
}
// Küçük yuvarlak bahçe masası (arka planda)
function bistroTable(x, y, sc, glasses = 0, t = 0) {
  c.save(); c.translate(x, y); c.scale(sc, sc);
  line(0, -210, 0, -10, OL, 16); line(0, -210, 0, -10, '#33403a', 9); line(-62, 0, 62, 0, OL, 14); line(-62, 0, 62, 0, '#33403a', 8);
  ell(0, -214, 112, 24, '#5d4c3c', OL, 5); ell(0, -218, 104, 18, '#6f5c49', null);
  for (let i = 0; i < glasses; i++) teaGlass(-36 + i * 52, -222, .8, .25, 0, t);
  c.restore();
}
// Ampul dizisi (sarkan kablo); on: yanan oranı, flick: titreyen ampul sırası
function stringLights(t, x0, y0, x1, y1, sag, n, on, o = {}) {
  const P = u => [lerp(x0, x1, u), lerp(y0, y1, u) + sag * 4 * u * (1 - u)];
  c.beginPath(); for (let i = 0; i <= 40; i++) { const [x, y] = P(i / 40); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.lineWidth = 3; c.strokeStyle = '#0c0a08'; c.stroke();
  for (let i = 0; i < n; i++) {
    const [x, y] = P((i + .5) / n); let lit = hash(i * 7.31 + x0 * .01) < on ? 1 : 0;
    if (i === o.flick) lit = hash(Math.floor(t * 9)) > .3 ? 1 : .1;
    const sw = Math.sin(t * 1.3 + i) * 1.5;
    line(x, y, x + sw, y + 10, '#0c0a08', 3);
    ell(x + sw, y + 21, 8, 11, lit ? `rgba(255,${o.mem ? 220 : 205},${o.mem ? 150 : 120},${.6 + .4 * lit})` : '#2e2924', OL, 2);
    if (lit) addLight(x + sw, y + 21, 80 * lit, `rgba(255,190,110,${.32 * lit})`);
  }
}
// Bayrak dizisi (anı sahnesi: kutlama)
function bunting(t, x0, y0, x1, y1, sag, n) {
  const P = u => [lerp(x0, x1, u), lerp(y0, y1, u) + sag * 4 * u * (1 - u)];
  c.beginPath(); for (let i = 0; i <= 30; i++) { const [x, y] = P(i / 30); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.lineWidth = 2.5; c.strokeStyle = '#3a2a1c'; c.stroke();
  const cols = ['#c8302a', '#e8c25a', '#2f7a5a', '#f2ece0'];
  for (let i = 0; i < n; i++) { const [xa, ya] = P(i / n + .01), [xb, yb] = P((i + 1) / n - .01), sw = Math.sin(t * 2 + i) * 4; poly([xa, ya, xb, yb, (xa + xb) / 2 + sw, (ya + yb) / 2 + 42], cols[i % 4], OL, 2.5); }
}
function bricks(x0, y0, x1, y1, c1, c2, bh = 26, bw = 56) {
  c.fillStyle = lg(0, y0, 0, y1, [[0, c1], [1, c2]]); c.fillRect(x0, y0, x1 - x0, y1 - y0);
  c.lineWidth = 1.6; c.strokeStyle = 'rgba(0,0,0,.42)'; c.beginPath();
  for (let r = 0, y = y0; y < y1; y += bh, r++) { c.moveTo(x0, y); c.lineTo(x1, y); for (let x = x0 + (r % 2) * bw / 2; x < x1; x += bw) { c.moveTo(x, y); c.lineTo(x, y + bh); } }
  c.stroke();
  for (let i = 0; i < 120; i++) { const bx = x0 + Math.floor(hash(i + x0) * (x1 - x0) / bw) * bw, by = y0 + Math.floor(hash(i + 9) * (y1 - y0) / bh) * bh; c.fillStyle = `rgba(${hash(i + 3) > .5 ? '120,70,40' : '0,0,0'},.13)`; c.fillRect(bx + 1, by + 1, bw - 2, bh - 2); }
}

// ---------- ÇAY BAHÇESİ (gece, yağmur) ----------
// o: { base (zemin çizgisi), bulbs (yanan oran), mem (anı: altın akşam), tables: [[x,y,sc,bardak]] }
function cayBahcesi(t, o = {}) {
  const B = o.base ?? 830, mem = !!o.mem;
  c.fillStyle = lg(0, -400, 0, B, mem ? [[0, '#2c2440'], [.55, '#8a4a3a'], [1, '#e09a5a']] : [[0, '#04060c'], [1, '#161219']]); c.fillRect(-1000, -400, 2720, B + 400);
  if (mem) { ell(120, B - 240, 90, 90, 'rgba(255,214,150,.9)', null); addLight(120, B - 240, 520, 'rgba(255,170,90,.35)'); }
  // uzak şehir siluetleri (kubbe, minare, evler)
  const far = mem ? '#4a2e34' : '#0b0c12';
  for (let i = 0; i < 14; i++) { const x = -500 + i * 140, h = 120 + hash(i + 2) * 160; rr(x, B - 170 - h, 120, h + 10, 4, far, null);
    if (!mem) for (let k = 0; k < 4; k++) if (hash(i * 9 + k) > .7) rr(x + 16 + (k % 2) * 50, B - 150 - h + 30 + Math.floor(k / 2) * 50, 18, 24, 2, 'rgba(255,190,110,.55)', null); }
  ell(250, B - 300, 70, 62, far, null); rr(246, B - 380, 8, 30, 2, far, null); rr(380, B - 470, 16, 300, 3, far, null); poly([376, B - 470, 400, B - 470, 388, B - 520], far, null);
  // bahçe duvarı (taş)
  const wall = mem ? ['#8a6a52', '#5e4636'] : ['#2a221d', '#1a1512'];
  bricks(-1000, B - 175, 1720, B, wall[0], wall[1], 34, 70);
  rr(-1000, B - 186, 2720, 16, 4, mem ? '#a4846a' : '#3a2f28', OL, 4);
  for (let i = 0; i < 18; i++) { const x = -600 + hash(i) * 1900; blob([x - 40, B - 186, x, B - 196, x + 46, B - 186, x + 30, B - 120 - hash(i + 4) * 50, x - 26, B - 140], mem ? '#4a6a3a' : '#16241a', OL, 3); } // sarmaşık
  // çay ocağı (sağda): ahşap kulübe, ışıklı pencere, semaver
  const KX = 500;
  poly([KX - 30, 300, KX + 360, 300, KX + 330, 250, KX, 250], mem ? '#6a2a22' : '#3a1a16', OL, 5);
  rr(KX, 300, 330, B - 300, 4, lg(0, 300, 0, B, [[0, mem ? '#7a5034' : '#3a2617'], [1, mem ? '#5a3a24' : '#22160d']]), OL, 6);
  for (let x = KX + 30; x < KX + 330; x += 30) line(x, 304, x, B - 4, 'rgba(0,0,0,.28)', 2);
  rr(KX + 30, 400, 230, 190, 6, '#2a1a10', OL, 5);
  c.fillStyle = lg(0, 410, 0, 580, [[0, '#ffe2a0'], [1, '#e48a3a']]); c.fillRect(KX + 42, 412, 206, 166);
  rr(KX + 120, 470, 60, 90, 14, '#8a5a2a', OL, 3); rr(KX + 136, 450, 28, 24, 6, '#8a5a2a', OL, 3); ell(KX + 150, 446, 10, 6, '#5a3a1a', OL, 2); // semaver
  for (let i = 0; i < 5; i++) teaGlass(KX + 64 + i * 38 - (i > 1 ? -60 : 0) * 0, 572, .5, .7, 0, t);
  line(KX + 145, 412, KX + 145, 578, '#2a1a10', 5); line(KX + 42, 495, KX + 248, 495, '#2a1a10', 4);
  addLight(KX + 145, 495, 380, 'rgba(255,170,80,.42)');
  rr(KX + 20, 320, 290, 56, 6, '#24160e', OL, 4);
  c.save(); c.font = '700 28px Cinzel,Georgia,serif'; c.textAlign = 'center'; c.letterSpacing = '5px'; c.fillStyle = '#f0c46a'; c.shadowColor = 'rgba(255,170,60,.7)'; c.shadowBlur = 14; c.fillText('ÇAY OCAĞI', KX + 167, 358); c.restore();
  // çınar ağacı (solda): gövde + taç
  blob([-120, B, -60, B - 300, -76, 200, -40, 40, 40, 30, 20, 200, 10, B - 300, 60, B], mem ? '#5a4030' : '#1f1812', OL, 6);
  for (let i = 0; i < 7; i++) curve([-60 + i * 16, B - 20, -50 + i * 14, B - 220, -40 + i * 10, 120], 'rgba(0,0,0,.2)', 3);
  const leaf = mem ? ['#4a6a34', '#5e8040'] : ['#0e1a12', '#15241a'];
  for (let i = 0; i < 9; i++) { const x = -300 + i * 90, y = -120 + hash(i) * 120 + Math.sin(t * .7 + i) * 4; ell(x, y, 150, 110, leaf[i % 2], OL, 4); }
  // ampuller + (anıda) bayraklar
  stringLights(t, -260, 150, 980, 190, 110, 24, o.bulbs ?? .3, { flick: o.flick, mem });
  if (mem) bunting(t, -100, 230, 860, 240, 80, 14);
  // zemin: ıslak taş
  c.fillStyle = lg(0, B, 0, 1500, mem ? [[0, '#9a7a5a'], [1, '#5a4434']] : [[0, '#29221d'], [1, '#100d0b']]); c.fillRect(-1000, B, 2720, 900);
  c.save(); c.strokeStyle = 'rgba(0,0,0,.28)'; c.lineWidth = 2; for (let y = B + 22, g = 22; y < 1500; g *= 1.18, y += g) { c.beginPath(); c.moveTo(-1000, y); c.lineTo(1720, y); c.stroke(); }
  for (let i = -12; i <= 12; i++) { c.beginPath(); c.moveTo(360 + i * 40, B); c.lineTo(360 + i * 160, 1500); c.stroke(); } c.restore();
  if (!mem) { // ıslak zeminde ışık yansımaları
    c.save(); c.globalCompositeOperation = 'lighter';
    for (const [x, w, a] of [[KX + 145, 110, .2], [100, 40, .1], [300, 30, .08], [760, 40, .08]]) { c.fillStyle = lg(0, B, 0, B + 340, [[0, `rgba(255,170,80,${a})`], [1, 'rgba(255,170,80,0)']]); for (let k = 0; k < 6; k++) c.fillRect(x - w / 2 + noise1(t * 2 + k + x) * 6, B + k * 50, w, 40); }
    c.restore();
  }
  for (const tb of (o.tables || [])) bistroTable(tb[0], tb[1], tb[2], tb[3] || 0, t);
}

// Diyalog mekânı: çay bahçesi (karakterler önde, boş masalar arkada)
PLACES.cay_bahcesi = {
  rain: true,
  bg(t) {
    cayBahcesi(t, { base: 840, bulbs: .3, flick: 9, tables: [[-150, 900, .58, 2], [96, 880, .5, 1], [690, 890, .55, 2], [960, 900, .6, 0]] });
    bistroChair(40, 905, .5, '#33403a', -.08); bistroChair(150, 900, .48, '#33403a', .1); bistroChair(745, 910, .52, '#33403a', .06);
  },
  fg(t) { for (let i = 0; i < 14; i++) { const p = (t * 2.2 + hash(i)) % 1, x = -100 + hash(i + 4) * 920, y = 1000 + hash(i + 6) * 300; c.save(); c.globalAlpha = (1 - p) * .5; ell(x, y, 6 + p * 16, 2 + p * 5, null, 'rgba(200,210,230,.6)', 1.5); c.restore(); } }, // su sıçramaları
};

// ---------- SOFRA: uzun masa, Demir ortada. 'acilis' | 'bos' | 'son' (Kâzım oturur); anı için SCENES.sofra_dolu ----------
const SF = { Y: 1085, SC: .58, TB: 878, TF: 932, X0: -60, X1: 780 };
const SEAT = { L: 105, M: 360, R: 615 };
function sofraMasa(t, o = {}) {
  const { TB, TF, X0, X1 } = SF, N = 28;
  // masa örtüsü (kareli), üst yüzey hafif perspektifli
  c.beginPath(); c.moveTo(X0 + 40, TB); c.lineTo(X1 - 40, TB); c.lineTo(X1, TF); c.lineTo(X0, TF); c.closePath(); c.fillStyle = '#efe6d6'; c.fill();
  c.save(); c.clip(); c.fillStyle = o.mem ? 'rgba(190,50,40,.85)' : 'rgba(150,40,36,.8)';
  for (let r = 0; r < 3; r++) for (let q = 0; q < N; q++) { if ((r + q) % 2) continue;
    const bx = u => lerp(X0 + 40, X1 - 40, u), fx = u => lerp(X0, X1, u), at = (u, f) => lerp(bx(u), fx(u), f), f0 = r / 3, f1 = (r + 1) / 3;
    c.beginPath(); c.moveTo(at(q / N, f0), lerp(TB, TF, f0)); c.lineTo(at((q + 1) / N, f0), lerp(TB, TF, f0)); c.lineTo(at((q + 1) / N, f1), lerp(TB, TF, f1)); c.lineTo(at(q / N, f1), lerp(TB, TF, f1)); c.fill(); }
  c.restore();
  c.beginPath(); c.moveTo(X0 + 40, TB); c.lineTo(X1 - 40, TB); c.lineTo(X1, TF); c.lineTo(X0, TF); c.closePath(); c.lineWidth = 5; c.strokeStyle = OL; c.stroke();
  // önden sarkan örtü (dalgalı alt kenar)
  const DH = 80; c.beginPath(); c.moveTo(X0, TF); c.lineTo(X1, TF); c.lineTo(X1, TF + DH);
  for (let x = X1; x > X0; x -= 60) c.quadraticCurveTo(x - 30, TF + DH + 14, x - 60, TF + DH);
  c.closePath(); c.fillStyle = '#e8ddcb'; c.fill();
  c.save(); c.clip(); c.fillStyle = o.mem ? 'rgba(190,50,40,.85)' : 'rgba(150,40,36,.8)';
  for (let r = 0; r < 3; r++) for (let x = X0 + (r % 2) * 30; x < X1; x += 60) c.fillRect(x, TF + r * 30, 30, 30);
  c.fillStyle = lg(0, TF, 0, TF + DH + 16, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.35)']]); c.fillRect(X0, TF, X1 - X0, DH + 20);
  for (let x = X0 + 30; x < X1; x += 120) { c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(x, TF, 14, DH + 16); }
  c.restore();
  c.beginPath(); c.moveTo(X1, TF + DH); for (let x = X1; x > X0; x -= 60) c.quadraticCurveTo(x - 30, TF + DH + 14, x - 60, TF + DH); c.lineWidth = 5; c.strokeStyle = OL; c.stroke();
  line(X0, TF, X1, TF, OL, 5);
  // masa ayakları (örtünün altından)
  for (const x of [40, 680]) { rr(x - 14, TF + DH, 28, 500, 4, '#2a1a10', OL, 5); }
  if (!o.mem) { // ıslak örtü: soğuk ton + damlalar
    c.save(); c.globalCompositeOperation = 'multiply'; c.fillStyle = 'rgba(120,130,170,.55)'; c.beginPath(); c.moveTo(X0 + 40, TB); c.lineTo(X1 - 40, TB); c.lineTo(X1, TF + DH + 14); c.lineTo(X0, TF + DH + 14); c.closePath(); c.fill(); c.restore();
    for (let i = 0; i < 18; i++) { const p = (t * 1.7 + hash(i)) % 1, x = hash(i + 3) * 720, y = lerp(TB + 4, TF - 4, hash(i + 5)); if (p < .25) { c.save(); c.globalAlpha = 1 - p * 4; ell(x, y, 4 + p * 30, 1 + p * 7, null, 'rgba(210,220,240,.7)', 1.5); c.restore(); } }
  }
}
// Masa arkasındaki karakter: önce gövde (masanın üstünde kalan kısım), sonra masa, sonra masaya uzanan kollar
function seated(list, t, o) {
  c.save(); c.beginPath(); c.rect(-1000, -400, 2720, SF.TF + 6 + 400); c.clip();
  for (const s of list) { if (s.chair !== false) bistroChair(s.x, 1040, .72, '#33403a', s.chairRot || 0); if (!s.kind) continue;
    c.save(); c.translate(s.x, SF.Y + (s.dy || 0)); c.scale(s.sc, s.sc); drawWho(s.kind, s.p); c.restore(); }
  c.restore();
  sofraMasa(t, o);
  if (o.items) o.items();
  // masadaki / masaya inen kollar örtünün önünde (yalnızca masa hizasının altındaki kısım yeniden çizilir)
  c.save(); c.beginPath(); c.rect(-1000, SF.TB - 6, 2720, 900); c.clip();
  for (const s of list) if (s.kind) for (const side of [-1, 1]) { const tg = side < 0 ? s.p.L : s.p.R; if (!tg) continue; const wy = SF.Y + (s.dy || 0) + tg.y * s.sc; if (wy > SF.TB - 20) { c.save(); c.translate(s.x, SF.Y + (s.dy || 0)); c.scale(s.sc, s.sc); armOver(s.kind, side, tg, s.p); c.restore(); } }
  c.restore();
  if (o.over) o.over();
}
// Masa yerel hedefi: dünya (x,y) → karakter yereli
const toSeat = (X, sc, x, y, hand = 'relax') => ({ x: (x - X) / sc, y: (y - SF.Y) / sc, hand });

// Şimdiki zaman: yağmur, Demir yalnız, iki sandalye boş, soğumuş bardaklar
function sofraBos(t, lt, o = {}) {
  cayBahcesi(t, { base: 840, bulbs: .22, flick: 11, tables: [[-190, 900, .55, 1], [905, 905, .58, 2]] });
  const M = SEAT.M, sc = SF.SC, look = o.look ?? .8;
  const pd = demirPose('sad', { t, talk: 0, lookX: o.lookX ?? .05, lookY: look, blink: blinkAt(t, 3.7), lid: .3, tilt: .05 + Math.sin(t * .6) * .01, mouth: -9, nod: o.nod || 0,
    L: toSeat(M, sc, 318, 912), R: toSeat(M, sc, 402, 912) });
  seated([{ x: SEAT.L, chairRot: -.06 }, { x: M, kind: 'demir', sc, p: pd }, { x: SEAT.R, chairRot: .08 }], t, {
    items: () => { teaGlass(M, 906, .62, .3, 0, t); teaGlass(SEAT.L + 30, 898, .56, .2, 0, t); teaGlass(SEAT.R - 20, 896, .56, .15, 0, t, .0); rr(SEAT.R + 40, 884, 50, 14, 3, '#efe6d6', OL, 2); } });
}
SCENES.sofra = S => {
  const t = S.t, lt = S.lt, k = S.k;
  if (S.phase === 'son') return sofraSon(S);
  if (S.phase === 'acilis') {
    // sinematik açılış: ampullerden aşağı süzülen kamera, masada tek başına Demir; başlık
    const [cy, z] = kf(lt, [[0, 330, 1.5], [2.6, 760, 1.18], [6, 790, 1.24]]);
    cam(lerp(300, 360, ss(0, 2.6, lt)), cy, z);
    sofraBos(t, lt, { look: .85 });
    rainScr(t, 1, 1);
    letterbox(1, 150);
    typeText('GECE 23:40 · ÇAY BAHÇESİ', ss(.5, 2.0, lt), 40, 1222, '600 22px Cinzel,Georgia,serif', 'rgba(236,224,200,.9)');
    const ta = ss(2.3, 3.0, lt) * (1 - ss(4.5, 5.0, lt));
    scrText('BAYKUŞ KÂZIM · 10. BÖLÜM', 360, 250, '600 20px Cinzel,Georgia,serif', 'rgba(236,224,200,.9)', ta, 6);
    scrText('GÖLGE', 360, 350, '700 96px Cinzel,Georgia,serif', '#f2d08a', ta, 22, 'rgba(255,190,90,.8)');
    c.save(); c.setTransform(BASEX, 0, 0, BASEX, 0, 0); c.globalAlpha = ta; line(360 - 140 * ta, 384, 360 + 140 * ta, 384, 'rgba(242,208,138,.8)', 2); c.restore();
    return;
  }
  cam(lerp(360, 360, k), lerp(790, 770, k), lerp(1.2, 1.32, ease(k)));
  sofraBos(t, lt);
  rainScr(t, 1, .9);
};
// ANI: altın akşam, masa dolu; Tilki ve Demir bardak kaldırır, Ayı kahkahayla masaya vurur
SCENES.sofra_dolu = S => {
  const t = S.t, k = S.k, sc = SF.SC;
  cam(352, lerp(780, 770, k), lerp(1.0, 1.06, ease(k)));
  cayBahcesi(t, { base: 840, mem: true, bulbs: 1, tables: [[-190, 900, .55, 2], [905, 905, .58, 2]] });
  const lift = .5 + .5 * Math.sin(t * 2.4), slap = Math.abs(Math.sin(t * 5.5));
  const tR = { x: 150 + 6 * lift, y: -742 - 16 * lift, hand: 'relax' }, dR = { x: 150, y: -748 - 14 * Math.sin(t * 2.4 + 1), hand: 'relax' };
  const pt = gangPose('tilki', { t, laugh: .6 + .3 * lift, lookX: .6, lookY: .1, tilt: .05, L: toSeat(SEAT.L, .55, 96, 912), R: tR });
  const pa = gangPose('ayi', { t, laugh: .95, lookX: -.5, tilt: -.06 + Math.sin(t * 9) * .03, bob: -slap * 6, L: toSeat(SEAT.R, .52, 548, 912), R: toSeat(SEAT.R, .52, 640, lerp(905, 845, slap)) });
  const pd = demirPose('happy', { t, talk: .25 + .25 * Math.abs(Math.sin(t * 9)), lookX: -.35, lookY: -.05, blink: 0, lid: .28, tilt: -.04, mouth: 24, L: toSeat(SEAT.M, sc, 318, 912), R: dR });
  const glassAt = (X, s, kind, tg) => { const j = armJoint(kind, 1, tg); return [X + j.wx * s, SF.Y + j.wy * s, Math.atan2(j.wy - j.ey, j.wx - j.ex)]; };
  seated([{ x: SEAT.L, kind: 'tilki', sc: .55, p: pt }, { x: SEAT.M, kind: 'demir', sc, p: pd }, { x: SEAT.R, kind: 'ayi', sc: .52, p: pa }], t, { mem: true,
    items: () => { teaGlass(SEAT.L + 8, 904, .56, .8, .8, t); teaGlass(SEAT.R - 10, 904, .56, .85, .8, t);
      for (const [x, y] of [[250, 902], [470, 904]]) { ell(x, y, 46, 12, '#f2ece0', OL, 3); for (let i = 0; i < 3; i++) { ell(x - 20 + i * 20, y - 8 - (i % 2) * 6, 17, 8, '#c98a3a', OL, 3); ell(x - 20 + i * 20, y - 8 - (i % 2) * 6, 7, 3, '#7a4a1a', null); } } }, // simit tabakları
    over: () => { // kaldırılan bardaklar patide (pati bardağın önünde)
      for (const [X, s, kind, tg] of [[SEAT.L, .55, 'tilki', tR], [SEAT.M, sc, 'demir', dR]]) { const [x, y] = glassAt(X, s, kind, tg); teaGlass(x, y + 26, .56, .75, .6, t);
        c.save(); c.translate(X, SF.Y); c.scale(s, s); const j = armJoint(kind, 1, tg), fa = Math.atan2(j.wy - j.ey, j.wx - j.ex);
        if (kind === 'demir') wolfPaw(j.wx, j.wy, fa, 'relax'); else { c.save(); c.translate(j.wx, j.wy); c.rotate(fa - PI / 2); ell(0, 22, 27, 26, GANG.tilki.paw, OL, 5); c.restore(); } c.restore(); }
    } });
  // konfeti
  for (let i = 0; i < 26; i++) { const p = (t * .25 + hash(i)) % 1, x = hash(i + 2) * 760 - 20 + Math.sin(t * 2 + i) * 20, y = 120 + p * 900; c.save(); c.translate(x, y); c.rotate(t * 3 + i); rr(-5, -3, 10, 6, 1, ['#e8c25a', '#c8302a', '#f2ece0', '#5aa07a'][i % 4], null); c.restore(); }
  dustMotes(t, 26, 0, 200, 720, 700, .5);
};
// SON: Kâzım boş sandalyeye oturmuş, fener masada; iki bardak çay buğulanıyor
function sofraSon(S) {
  const t = S.t, k = S.k, sc = SF.SC, KS = .5;
  cam(lerp(250, 236, k), lerp(770, 790, k), lerp(1.28, 1.38, ease(k)));
  cayBahcesi(t, { base: 840, bulbs: .3, flick: 11, tables: [[-190, 900, .55, 1], [905, 905, .58, 2]] });
  const KX = 100, pk = kazimPose('warm', { t, talk: S.talk.kazim, lookX: .5, lookY: .2, blink: blinkAt(t, 1.3), tilt: -.03, L: toSeat(KX, KS, 60, 914), R: toSeat(KX, KS, 142, 914), lantern: null });
  const pd = demirPose('hope', { t, talk: 0, lookX: -.55, lookY: .15, blink: blinkAt(t, 3.7), lid: .1, tilt: -.05, mouth: 14, L: toSeat(SEAT.M, sc, 318, 912), R: toSeat(SEAT.M, sc, 402, 912) });
  seated([{ x: KX, kind: 'kazim', sc: KS, p: pk, dy: 6 }, { x: SEAT.M, kind: 'demir', sc, p: pd }, { x: SEAT.R, chairRot: .08 }], t, {
    items: () => { teaGlass(KX + 2, 908, .58, .85, 1, t); teaGlass(SEAT.M, 908, .6, .85, 1, t); teaGlass(SEAT.R - 20, 896, .56, .15, 0, t); },
    over: () => { drawLantern(232, 880 - 166 * .52, 1, t, .52); } });
  rainScr(t, 1, .7);
}

// ---------- GÖLGE: güneşte Demir'in yanında yürüyen gölge; karanlık çökünce kaybolur ----------
let SHCV = null;
function castShadow(drawFn, X, Y, sc, shear, squash, alpha) {
  if (alpha <= .01) return;
  const W = c.canvas.width, H = c.canvas.height;
  if (!SHCV || SHCV.width !== W || SHCV.height !== H) { SHCV = document.createElement('canvas'); SHCV.width = W; SHCV.height = H; }
  const g = SHCV.getContext('2d'), m = c.getTransform(), prev = c, nL = LIGHTS.length;
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.clearRect(0, 0, W, H);
  g.setTransform(m); g.translate(X, Y); g.transform(1, 0, shear, squash, 0, 0); g.scale(sc, sc); g.lineJoin = 'round'; g.lineCap = 'round';
  c = g; drawFn(); c = prev; LIGHTS.length = nL;
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = `rgba(14,10,18,${alpha})`; g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'source-over';
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(SHCV, 0, 0); c.restore();
}
SCENES.golge = S => {
  const t = S.t, k = S.k, L = S.line;
  const tAma = wAt(L, 'ama', 0, L.start + (L.end - L.start) * .5), tKay = wAt(L, 'kaybolur', 0, L.end - .6);
  const d = ss(tAma - .2, tKay, t), gone = ss(tKay - .5, tKay + .4, t);
  cam(360, lerp(800, 780, k), lerp(1.02, 1.12, ease(k)));
  const HZ = 760;
  c.fillStyle = lg(0, -300, 0, HZ, [[0, mix3('#5d9fd6', '#2e2450', '#03040a', d)], [1, mix3('#f5dfae', '#f0874a', '#0b1020', d)]]); c.fillRect(-1000, -400, 2720, HZ + 400);
  if (d > .6) for (let i = 0; i < 60; i++) ell(-200 + hash(i) * 1120, -250 + hash(i + 3) * 900, 1.3, 1.3, `rgba(255,255,240,${(d - .6) * 1.5 * (.3 + .6 * hash(i + 5))})`, null);
  // güneş: sağ üstten ufka iner
  const sy = lerp(220, HZ + 90, ease(ss(tAma - .6, tKay - .3, t))), sx = lerp(600, 640, d);
  if (sy < HZ + 80) { ell(sx, sy, 70, 70, mixCol('#fff4c8', '#ff7a3a', d * 1.6), null); addLight(sx, sy, 600, `rgba(255,${200 - 80 * d | 0},120,${.5 * (1 - d)})`); }
  // ufuk: şehir
  const bc = mix3('#a8957e', '#5a2e3a', '#06070b', d);
  for (let i = 0; i < 12; i++) { const x = -420 + i * 140, h = 90 + hash(i + 11) * 150; rr(x, HZ - h, 124, h + 4, 3, bc, null); }
  ell(260, HZ - 150, 64, 56, bc, null); rr(410, HZ - 300, 16, 300, 3, bc, null); poly([406, HZ - 300, 430, HZ - 300, 418, HZ - 350], bc, null);
  // meydan zemini (taş, perspektif)
  c.fillStyle = lg(0, HZ, 0, 1500, [[0, mix3('#cdb592', '#8a5a4a', '#0e0f14', d)], [1, mix3('#a88a64', '#4a2e2a', '#06070a', d)]]); c.fillRect(-1000, HZ, 2720, 900);
  c.save(); c.strokeStyle = `rgba(0,0,0,${.22 - .12 * d})`; c.lineWidth = 2; for (let y = HZ + 16, g = 16; y < 1500; g *= 1.2, y += g) { c.beginPath(); c.moveTo(-1000, y); c.lineTo(1720, y); c.stroke(); }
  for (let i = -14; i <= 14; i++) { c.beginPath(); c.moveTo(360 + i * 30, HZ); c.lineTo(360 + i * 170, 1500); c.stroke(); } c.restore();
  // Demir ve gölgesi
  const X = 360, Y = 1090, sc = .66;
  const pd = demirPose(d < .45 ? 'calm' : 'worry', { t, talk: 0, lookX: lerp(.2, -.55, ss(tAma, tKay, t)), lookY: lerp(.05, .75, ss(tAma, tKay, t)), blink: blinkAt(t, 3.7), tilt: lerp(-.02, .06, d), mouth: lerp(10, -6, d), lid: lerp(.04, .18, d) });
  castShadow(() => drawWolf(pd), X, Y, sc, lerp(.5, 1.5, d), -lerp(.42, .8, d), .6 * (1 - gone));
  c.save(); c.translate(X, Y); c.scale(sc, sc); drawWolf(pd); c.restore();
  // ışık: gün ısısı → gece soğukluğu
  c.save(); c.globalCompositeOperation = 'multiply'; c.fillStyle = `rgba(${lerp(255, 60, d) | 0},${lerp(240, 70, d) | 0},${lerp(225, 120, d) | 0},1)`; c.fillRect(-1000, -400, 2720, 2000); c.restore();
  if (gone > 0) { c.save(); c.globalAlpha = gone * .55; c.fillStyle = rg(X, 700, 200, 900, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,1)']]); c.fillRect(-1000, -400, 2720, 2000); c.restore(); }
};

// ---------- FISILTI: arka sokak; konuşan (solda) dinleyene (sağda) fısıldar ----------
function alleyBg(t) {
  c.fillStyle = '#07070a'; c.fillRect(-1000, -400, 2720, 2000);
  bricks(-1000, -300, 1720, 930, '#1d1820', '#2d221e');
  // yırtık afişler
  for (const [x, y, w, h, col, r] of [[40, 380, 150, 200, '#c9b48a', -.05], [210, 420, 120, 160, '#8a3a2a', .04], [560, 360, 140, 190, '#4a6a7a', .03]]) { c.save(); c.translate(x + w / 2, y + h / 2); c.rotate(r); rr(-w / 2, -h / 2, w, h, 2, col, OL, 3); c.globalAlpha = .35; rr(-w / 2 + 12, -h / 2 + 14, w - 24, 16, 2, '#000', null); rr(-w / 2 + 12, -h / 2 + 40, w - 40, 10, 2, '#000', null); c.restore(); }
  rr(650, -300, 26, 1240, 6, '#2a2a30', OL, 4); for (let y = -200; y < 900; y += 160) rr(644, y, 38, 14, 4, '#33333a', OL, 3); // yağmur borusu
  // duvar lambası
  rr(330, 210, 60, 18, 4, '#1a1a1a', OL, 4); poly([320, 228, 400, 228, 384, 262, 336, 262], '#262620', OL, 4); ell(360, 264, 22, 6, '#ffe3a4', null);
  c.save(); c.globalCompositeOperation = 'lighter'; poly([336, 262, 384, 262, 620, 1100, 100, 1100], 'rgba(255,214,150,.08)', null); c.restore();
  addLight(360, 280, 520, 'rgba(255,200,120,.38)');
  c.fillStyle = lg(0, 930, 0, 1500, [[0, '#1c1a1e'], [1, '#0a090b']]); c.fillRect(-1000, 930, 2720, 900);
  c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = lg(0, 930, 0, 1300, [[0, 'rgba(255,200,120,.14)'], [1, 'rgba(255,200,120,0)']]); for (let k = 0; k < 7; k++) c.fillRect(320 + noise1(t * 2 + k) * 8, 940 + k * 46, 80, 34); c.restore();
}
function laughPose(kind, base, lf, t) {
  if (kind === 'demir') return Object.assign(base, { mouth: lerp(base.mouth ?? 0, 24, lf), talk: lf * (.3 + .3 * Math.abs(Math.sin(t * 11))), lid: lerp(base.lid ?? 0, .35, lf) });
  return Object.assign(base, { laugh: Math.max(base.laugh || 0, lf), bob: -Math.abs(Math.sin(t * 10)) * 6 * lf, tilt: (base.tilt || 0) + Math.sin(t * 9) * .03 * lf });
}
// o: { spk, lis, wh 0..1 fısıltı, laugh 0..1, point 0..1, bg: [kind, x, y, sc, mood], extra: [kind,x,sc,pose] }
function whisperScene(t, o) {
  alleyBg(t);
  const SX = 195, LX = 525, Y = 1170, SC = .6, wh = o.wh || 0, lf = o.laugh || 0, pt = o.point || 0;
  if (o.bg) { const [kind, x, y, s, mood] = o.bg; c.save(); c.translate(x, y); c.scale(s, s);
    drawWho(kind, kind === 'demir' ? demirPose(mood || 'sad', { t, talk: 0, lookX: .5, lookY: .3, blink: blinkAt(t, 5), lid: .25, tilt: .06 }) : gangPose(kind, { t, lookX: -.4 }));
    c.restore(); c.save(); c.globalAlpha = .35; c.fillStyle = '#0a0812'; c.fillRect(x - 200 * s, y - 1100 * s, 400 * s, 1120 * s); c.restore(); }
  if (o.extra) { const [kind, x, s, pp] = o.extra; c.save(); c.translate(x, Y - 20); c.rotate(-.05); c.scale(s, s); drawWho(kind, pp); c.restore(); }
  // dinleyen (sağ): konuşana doğru eğilir, kulağını verir
  const lisPose = o.lis === 'demir'
    ? demirPose(o.lisMood || 'surprised', { t, talk: 0, lookX: -.6, lookY: .1, blink: blinkAt(t, 3.7), tilt: -.14 * wh, mouth: 4 })
    : gangPose(o.lis, { t, lookX: -.6, lookY: .1, tilt: -.14 * wh });
  laughPose(o.lis, lisPose, lf, t);
  c.save(); c.translate(LX, Y); c.rotate(-.04 * wh); c.scale(SC, SC); drawWho(o.lis, lisPose); c.restore();
  // konuşan (sol): eğilir, sağ patisini ağzının yanına siper eder; işaret ederken sol kol geriyi gösterir
  const R = { x: 150, y: -290, hand: 'relax' }, Lt = { x: lerp(-150, -380, ease(pt)), y: lerp(-290, -615, ease(pt)), hand: pt > .4 ? 'point' : 'relax' };
  const spkPose = o.spk === 'demir'
    ? demirPose('calm', { t, talk: wh > .5 ? .25 * Math.abs(Math.sin(t * 13)) : 0, lookX: .6, lookY: .15, blink: 0, tilt: .12 * wh, mouth: 6, lid: .1, L: { x: -148, y: -272, hand: 'relax' }, R, hideR: true })
    : gangPose(o.spk, { t, lookX: .7, lookY: .15, tilt: .12 * wh, L: Lt, R, hideR: true });
  laughPose(o.spk, spkPose, lf * .8, t);
  c.save(); c.translate(SX, Y); c.rotate(.07 * wh); c.scale(SC, SC); drawWho(o.spk, spkPose);
  whisperArm(o.spk, ease(wh)); if (pt > 0 && o.spk !== 'demir') armOver(o.spk, -1, Lt, spkPose);
  c.restore();
  // fısıltı halkaları
  if (wh > .3 && lf < .5) { const a = ss(.3, .8, wh) * (1 - lf * 2), mx = SX + 120, my = Y - 650 * SC, ex = LX - 130, ey = Y - 790 * SC;
    for (let i = 0; i < 3; i++) { const u = (t * 1.4 + i / 3) % 1, x = lerp(mx, ex, u), y = lerp(my, ey, u) - Math.sin(u * PI) * 20; c.save(); c.globalAlpha = a * Math.sin(u * PI); c.beginPath(); c.arc(x, y, 12 + u * 10, -.8, .8); c.lineWidth = 4; c.strokeStyle = '#f2e6c8'; c.stroke(); c.restore(); }
    c.save(); c.globalAlpha = a * .85; c.font = 'italic 700 26px Georgia,serif'; c.textAlign = 'center'; c.fillStyle = '#f2e6c8'; c.fillText('psst…', (mx + ex) / 2, Math.min(my, ey) - 40 + Math.sin(t * 3) * 4); c.restore(); }
}
// Fısıltı kolu: dirsek yanda aşağıda, ön kol dik; pati ağzın yanında siper (avuç dinleyene dönük). k: 0 kol aşağıda … 1 ağızda
function whisperArm(kind, k) {
  const wolf = kind === 'demir', G = wolf ? null : GANG[kind];
  const S = wolf ? WOLF.SR : [G.sw * .95, -548], l1 = wolf ? WOLF.l1 : 150, l2 = wolf ? WOLF.l2 : 140;
  // boşta: eklem çözümüyle sarkan kol; fısıltıda: dirsek omzun altında hafif dışarıda, bilek ağız hizasının altında (ön kol bize doğru kısalır)
  const rest = wolf ? [148, -272] : [G.sw + 20, -272], r = ik(S[0], S[1], rest[0], rest[1], l1, l2, 1);
  const E1 = [S[0] + 38, S[1] + 96], W1 = [S[0] - 8, S[1] - 50];
  const j = { ex: lerp(r.ex, E1[0], k), ey: lerp(r.ey, E1[1], k), wx: lerp(r.wx, W1[0], k), wy: lerp(r.wy, W1[1], k) }, fa = Math.atan2(j.wy - j.ey, j.wx - j.ex);
  const sleeve = wolf ? WOLF_C.sleeve : G.sleeve, cuff = wolf ? WOLF_C.cuff : G.trim, paw = wolf ? WOLF_C.paw : G.paw, w = wolf ? 58 : (kind === 'ayi' ? 70 : 58);
  const cf = [lerp(j.ex, j.wx, .84), lerp(j.ey, j.wy, .84)];
  capsule([S[0], S[1], j.ex, j.ey, cf[0], cf[1]], w, sleeve, 6);
  if (wolf) for (const q of [.5, .62]) { const a = [lerp(j.ex, j.wx, q), lerp(j.ey, j.wy, q)], b = [lerp(j.ex, j.wx, q + .05), lerp(j.ey, j.wy, q + .05)]; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.lineWidth = 56; c.strokeStyle = WOLF_C.jacket; c.stroke(); }
  capsule([cf[0], cf[1], j.wx, j.wy], w - 10, cuff, 5);
  c.save(); c.translate(j.wx, j.wy); c.rotate(fa - PI / 2);
  if (k > .55) { // siper pati: avuç + üstte kıvrık üç parmak (dinleyene doğru), başparmak yüz tarafında
    ell(0, 26, 24, 30, paw, OL, 5);
    for (const [fx, fy] of [[-10, 54], [3, 58], [15, 52]]) ell(fx + 4, fy, 9, 12, paw, OL, 4);
    capsule([-20, 22, -28, 40], 12, paw, 4);
  } else { ell(0, 22, 26, 26, paw, OL, 5); for (const q of [-11, 0, 11]) curve([q - 4, 36, q, 45, q + 4, 36], 'rgba(0,0,0,.45)', 3); }
  c.restore();
}
SCENES.fisilti = S => {
  const t = S.t, L = S.line, lt = S.lt;
  if (S.phase === 'zincir') return fisiltiZincir(S);
  // 'sir': önce Demir sırrını Tilki'ye fısıldar; "Şimdi"de Tilki Ayı'ya taşır, Kedi de kulak kabartır; "geldi bana"da hepsi güler, Tilki Demir'i gösterir
  const tSimdi = wAt(L, 'şimdi', 0, L.start + (L.end - L.start) * .5), tGeldi = wAt(L, 'geldi', 0, L.end - 1);
  const B = t >= tSimdi;
  cam(360, 800, lerp(1.0, 1.06, ss(0, 4, B ? t - tSimdi : lt)));
  if (!B) whisperScene(t, { spk: 'demir', lis: 'tilki', wh: ss(.1, .6, lt) });
  else {
    const lf = ss(tGeldi, tGeldi + .3, t), ked = ss(tSimdi + .5, tSimdi + 1.2, t);
    whisperScene(t, { spk: 'tilki', lis: 'ayi', wh: ss(tSimdi + .05, tSimdi + .45, t) * (1 - lf), laugh: lf, point: ss(tGeldi + .1, tGeldi + .5, t),
      bg: ['demir', 70, 905, .26, 'sad'], extra: ['kedi', lerp(780, 650, ease(ked)), .5, gangPose('kedi', { t, lookX: -.7, tilt: -.1, laugh: lf })] });
    const fl = 1 - ss(0, .18, t - tSimdi); if (fl > 0) scrFade(fl * .8, '255,255,255');
  }
};
// "Şşş": dirsek aşağıda, ön kol dik, işaret parmağı dudakta (up 0..1: koldan kalkış)
function shhArm(kind, up) {
  const G = GANG[kind], S = [G.sw * .95, -548], tx = lerp(150, 26, up), ty = lerp(-290, -548, up), j = ik(S[0], S[1], tx, ty, 150, 140, 1, true);
  const fa = Math.atan2(j.wy - j.ey, j.wx - j.ex);
  capsule([S[0], S[1], j.ex, j.ey, j.wx - Math.cos(fa) * 14, j.wy - Math.sin(fa) * 14], 58, G.sleeve, 6);
  capsule([j.wx - Math.cos(fa) * 26, j.wy - Math.sin(fa) * 26, j.wx - Math.cos(fa) * 10, j.wy - Math.sin(fa) * 10], 54, G.trim, 5);
  c.save(); c.translate(j.wx, j.wy); c.rotate(fa - PI / 2);
  if (up > .6) { capsule([2, 30, 2, 96], 17, G.paw, 5); ell(0, 24, 27, 25, G.paw, OL, 5); capsule([-20, 14, -26, 34], 13, G.paw, 4); }
  else { ell(0, 22, 27, 26, G.paw, OL, 5); }
  c.restore();
}
// İkiye bölünmüş ekran: üstte Tilki Demir'e Ayı'yı çekiştirir, altta Ayı'ya Demir'i anlatır. "Sır"da Tilki yakın planda "şşş" yapar
function fisiltiZincir(S) {
  const t = S.t, L = S.line, lt = S.lt;
  const tB = wAt(L, 'başkasına', 0, L.start + 1.6), tSir = wAt(L, 'sır', 0, L.start + (L.end - L.start) * .55);
  const out = ss(tSir - .15, tSir + .3, t);
  c.fillStyle = '#000'; c.fillRect(-1000, -400, 2720, 2000);
  if (out < 1) {
    const panel = (py, slide, o, label) => {
      c.save(); c.translate(slide * 720, 0); c.beginPath(); c.rect(0, py, 720, 640); c.clip();
      c.translate(360, py + 320); c.scale(.98, .98); c.translate(-360, -735); whisperScene(t, o); c.restore();
      scrText(label, 360 + slide * 720, py + (py ? 64 : 140), '700 26px Cinzel,Georgia,serif', '#f2d08a', 1 - Math.abs(slide), 6, 'rgba(0,0,0,.9)');
    };
    const top = ease(ss(0, .35, lt)), bot = ease(ss(tB - .1, tB + .3, t));
    panel(0, (top - 1) - out, { spk: 'tilki', lis: 'demir', lisMood: 'happy', wh: ss(.2, .6, lt) * (1 - ss(tB - .6, tB - .2, t)), laugh: ss(tB - .6, tB - .2, t), point: ss(tB - .8, tB - .4, t), bg: ['ayi', 60, 930, .27] }, 'SANA, ONU…');
    if (bot > 0) panel(640, (1 - bot) + out, { spk: 'tilki', lis: 'ayi', wh: ss(tB + .2, tB + .6, t) * (1 - ss(tSir - .9, tSir - .5, t)), laugh: ss(tSir - .9, tSir - .5, t), point: ss(tSir - 1, tSir - .6, t), bg: ['demir', 60, 920, .27, 'sad'] }, 'ONA, SENİ…');
    c.save(); c.globalAlpha = (1 - out) * bot; line(0, 640, 720, 640, '#d9a441', 4); c.restore();
  }
  if (out > 0) { // Tilki yakın plan: parmağı dudağında, sinsi bakış
    c.save(); c.globalAlpha = out; const z = lerp(1.0, 1.06, ss(tSir, tSir + 4, t)); cam(360, 640, z);
    alleyBg(t); const up = ease(ss(tSir + .1, tSir + .6, t)), p = gangPose('tilki', { t, lookX: .25, lookY: -.1, tilt: -.06, laugh: 0, L: { x: -150, y: -300, hand: 'relax' }, hideR: true });
    c.translate(360, 1330); c.scale(1.05, 1.05); gangBody('tilki', p); shhArm('tilki', up); c.restore();
  }
}

// ---------- GRUP SOHBETİ: herkese "Geliyorum!" diyen Demir; 3 ay sonra kendi mesajı görüldüde kalır ----------
function grupHeader(w, status, typing) {
  c.fillStyle = UI.head; c.fillRect(0, 0, w, 130);
  c.fillStyle = UI.text; c.font = '600 30px Inter,Arial'; c.fillText('‹', 20, 92);
  ell(80, 82, 28, 28, '#3a4250', null); c.font = `28px ${EMOJI}`; c.textAlign = 'center'; c.fillText('🔥', 80, 92); c.textAlign = 'left';
  c.fillStyle = UI.text; c.font = '700 26px Inter,Arial'; c.fillText('EKİP', 124, 76);
  c.fillStyle = typing ? '#5fd08f' : UI.dim; c.font = '500 18px Inter,Arial'; c.fillText(status, 124, 102);
}
SCENES.grup = S => {
  const t = S.t, L = S.line, k = S.k, s0 = S.t - S.pt;
  const tSplit = wAt(L, 'ama', 0, L.start + (L.end - L.start) * .55), tSend = wAt(L, 'kimseyi', 0, L.end - 1.2), tSeen = wAt(L, 'bulamadım', 0, L.end - .6);
  const d0 = L.end + .25, d1 = L.end + 1.35;
  const span = Math.max(1.5, tSplit - s0 - .25), u = x => s0 + .1 + x / 2.5 * span;
  const early = [
    { at: u(0), who: 'Tilki', col: '#ff9a5a', text: 'Demir, taşınıyorum! Yardım lazım 📦' },
    { at: u(.55), me: true, text: 'Geliyorum! 🏃', ty: [u(.2), u(.5)] },
    { at: u(.85), who: 'Ayı', col: '#c9a074', text: 'Araba yolda kaldı, itecek biri? 🚗' },
    { at: u(1.4), me: true, text: '5 dakikaya oradayım!', ty: [u(1.05), u(1.35)] },
    { at: u(1.7), who: 'Kedi', col: '#b48ae0', text: 'Kimde 200 lira var? 💸' },
    { at: u(2.25), me: true, text: 'Gönderdim kardeşim 👍', ty: [u(1.9), u(2.2)] },
  ];
  const lateMsg = { at: tSend, me: true, text: 'Arkadaşlar, bugün çok kötüyüm. Biri gelebilir mi? 🙏', ty: [tSplit + .35, tSend - .12], late: true };
  const after = t >= tSplit, items = after ? [lateMsg] : early;
  // yazma çubuğundaki metin
  let shown = '', typingNow = false, sending = false;
  for (const m of [...early, lateMsg]) if (m.ty && t >= m.ty[0] && t < m.at) { const f = cl((t - m.ty[0]) / (m.ty[1] - m.ty[0]), 0, 1); shown = m.text.slice(0, Math.ceil(m.text.length * f)); typingNow = f < 1; sending = f >= 1; }
  if (LAND) cam(360, 610, .76); else cam(360, 640, 1.06 + .04 * k);
  blurredStreet(t);
  const tilt = Math.sin(t * .8) * .012, PX = 160, PY = 230, KB = 540, IY = KB - 84, AV = IY - 150;
  const ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'], keyAt = (r, i) => { const n = ROWS[r].length, kw = 36, x0 = (400 - n * kw) / 2 + (r === 2 ? -20 : 0); return [x0 + i * kw + kw / 2, KB + 22 + r * 54 + 20]; };
  let tip = null;
  if (typingNow) { const n = Math.floor(t * 9), r = Math.floor(hash(n) * 3), kk = keyAt(r, Math.floor(hash(n * 3 + 1) * ROWS[r].length)); tip = [kk[0], kk[1] + 4 - Math.abs(Math.sin(t * 28)) * 6]; }
  else if (sending) tip = [400 - 46, IY + 34];
  c.save(); c.translate(360, 620); c.rotate(tilt); c.translate(-360, -620);
  capsule([-90, 1470, 150, 1090], 150, WOLF_C.sleeve, 7); capsule([132, 1112, 168, 1060], 138, '#6a1822', 6); ell(215, 990, 104, 84, WOLF_C.paw, OL, 6);
  phoneFrame(360, 620, 400, 780, (w, h) => {
    const dotsA = ss(d0, d0 + .15, t) * (1 - ss(d1 - .15, d1, t));
    grupHeader(w, dotsA > .5 ? 'Tilki yazıyor…' : 'Tilki, Ayı, Kedi, Sen', dotsA > .5);
    // mesajlar: en yenisi yazma çubuğunun üstüne gelecek şekilde kaydırılır
    c.save(); c.beginPath(); c.rect(0, 132, w, IY - 134); c.clip();
    c.font = `500 23px Inter,Arial,${EMOJI}`;
    const hOf = m => (m.me ? 0 : 26) + wrapText(m.text, w * .6).length * 30 + 30 + 14;
    const vis = items.filter(m => t >= m.at);
    let total = (after ? 70 : 0) + vis.reduce((a, m) => a + hOf(m), 0) + (after && t >= tSeen ? 30 : 0) + (dotsA > 0 ? 60 : 0);
    const last = vis[vis.length - 1], prevTotal = last ? total - hOf(last) : total, sk = last ? ss(last.at, last.at + .25, t) : 1;
    const off = Math.max(0, lerp(prevTotal, total, sk) - (IY - 150));
    c.translate(0, 150 - off); let y = 0;
    if (after) { const pa = ss(tSplit, tSplit + .3, t); c.save(); c.globalAlpha = pa; rr(w / 2 - 80, y + 6, 160, 38, 19, '#26303a', null); c.fillStyle = '#c9d3dd'; c.font = '700 17px Inter,Arial'; c.textAlign = 'center'; c.fillText('3 AY SONRA', w / 2, y + 31); c.restore(); y += 70; }
    for (const m of vis) {
      const a = ss(m.at, m.at + .2, t);
      if (!m.me) { c.save(); c.globalAlpha = cl(a * 2, 0, 1); c.font = '700 17px Inter,Arial'; c.fillStyle = m.col; c.textAlign = 'left'; c.fillText(m.who, 26, y + 18); c.restore(); y += 26; }
      y = bubble(w, y, m.text, !!m.me, m.late ? '23:47' : '14:0' + (2 + early.indexOf(m)), a, m.late && t < tSeen ? 1 : 2);
      if (m.late && t >= tSeen) { c.save(); c.globalAlpha = ss(tSeen, tSeen + .3, t); c.font = '500 16px Inter,Arial'; c.fillStyle = UI.dim; c.textAlign = 'right'; c.fillText('Görüldü · Tilki, Ayı, Kedi', w - 22, y + 6); c.restore(); y += 30; }
    }
    if (dotsA > 0) typingDots(w, y, t, dotsA);
    c.restore();
    // yazma çubuğu + klavye
    rr(14, IY, w - 96, 64, 32, '#1e252e', null);
    c.font = `500 21px Inter,Arial,${EMOJI}`; c.fillStyle = shown ? UI.text : UI.dim; c.textAlign = 'left';
    let txt = shown || 'Mesaj yaz'; while (c.measureText(txt).width > w - 140 && txt.length > 4) txt = '…' + txt.slice(2);
    c.fillText(txt, 36, IY + 40);
    ell(w - 46, IY + 32, 30, 30, shown ? UI.me : '#2a3038', null); c.fillStyle = '#fff'; c.font = '700 26px Inter,Arial'; c.textAlign = 'center'; c.fillText('➤', w - 44, IY + 42);
    c.fillStyle = '#1a1f26'; c.fillRect(0, KB, w, h - KB); c.font = '600 17px Inter,Arial';
    ROWS.forEach((row, r) => { for (let q = 0; q < row.length; q++) { const [kx, ky] = keyAt(r, q), on = tip && typingNow && Math.abs(tip[0] - kx) < 10 && Math.abs(tip[1] - ky) < 14; rr(kx - 16, ky - 22, 32, 44, 7, on ? '#4a5563' : '#2c333d', null); c.fillStyle = '#d8dee6'; c.fillText(row[q], kx, ky + 6); } });
    rr(90, KB + 22 + 3 * 54, 220, 40, 7, '#2c333d', null); c.font = '600 15px Inter,Arial'; c.fillStyle = '#8d98a5'; c.fillText('boşluk', 200, KB + 22 + 3 * 54 + 26); c.textAlign = 'left';
    const dim = ss(d1, d1 + .8, t) * .55; if (dim > 0) { c.fillStyle = `rgba(0,0,0,${dim})`; c.fillRect(0, 0, w, h); }
  });
  for (const fy of [880, 935, 990]) rr(552, fy - 16, 36, 32, 16, WOLF_C.paw, OL, 4);
  c.save(); c.translate(168, 1010); c.rotate(-.8); rr(-16, -50, 32, 74, 16, WOLF_C.paw, OL, 4.5); c.restore();
  const rest = [470, 1150], tw = tip ? [PX + tip[0], PY + tip[1]] : rest;
  capsule([860, 1480, tw[0] + 120, tw[1] + 250], 130, WOLF_C.sleeve, 7); capsule([tw[0] + 108, tw[1] + 226, tw[0] + 88, tw[1] + 186], 132, '#6a1822', 6);
  pawFinger(tw[0], tw[1], -.42, WOLF_C.paw, 1.1);
  c.restore();
  const ay = ss(tSplit - .05, tSplit + .3, t) * (1 - ss(tSplit + 1.8, tSplit + 2.3, t));
  scrText('3 AY SONRA', 360, 178, '700 30px Cinzel,Georgia,serif', '#f2d08a', ay, 8, 'rgba(0,0,0,.9)');
};

// ---------- FENER OL: karanlıkta Demir'in elindeki fener yanar; ışık sokağı geri getirir ----------
SCENES.fener_ol = S => {
  const t = S.t, L = S.line, k = S.k;
  const tIg = wAt(L, 'fener', 1, L.start + (L.end - L.start) * .7), lit = ss(tIg, tIg + .7, t), up = ease(ss(tIg - .3, tIg + .6, t));
  cam(360, lerp(800, 770, k), lerp(1.14, 1.26, ease(k)));
  // sahne: ıslak taş sokak, tuğla duvar, kapı
  bricks(-1000, -300, 1720, 900, '#2a1f1a', '#3a2a20');
  rr(500, 430, 170, 470, 6, '#3a2418', OL, 5); rr(518, 450, 134, 180, 4, '#2a1a10', OL, 3); ell(640, 700, 7, 7, '#c9a04a', OL, 2);
  rr(60, 380, 180, 150, 4, '#1a1410', OL, 5); line(150, 380, 150, 530, '#3a2a20', 5); line(60, 455, 240, 455, '#3a2a20', 5);
  c.fillStyle = lg(0, 900, 0, 1500, [[0, '#2e2620'], [1, '#14100d']]); c.fillRect(-1000, 900, 2720, 900);
  c.save(); c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 2; for (let y = 920, g = 20; y < 1500; g *= 1.2, y += g) { c.beginPath(); c.moveTo(-1000, y); c.lineTo(1720, y); c.stroke(); } c.restore();
  // Demir, sağ patisinde fener
  const X = 360, Y = 1150, sc = .66, R = { x: lerp(150, 168, up), y: lerp(-268, -300, up), hand: 'relax' };
  const pd = demirPose(lit > .5 ? 'hope' : 'sad', { t, talk: 0, lookX: lerp(.45, .15, lit), lookY: lerp(.55, -.05, lit), blink: blinkAt(t, 3.7), lid: lerp(.25, 0, lit), tilt: lerp(.06, -.02, lit), mouth: lerp(-6, 12, lit), R });
  c.save(); c.translate(X, Y); c.scale(sc, sc); drawWolf(pd);
  const j = armJoint('demir', 1, R), fa = Math.atan2(j.wy - j.ey, j.wx - j.ex);
  drawLantern(j.wx, j.wy + 14, lit, t, .95); wolfPaw(j.wx, j.wy, fa, 'relax');
  const LXw = X + j.wx * sc, LYw = Y + (j.wy + 14 + 90 * .95) * sc;
  c.restore();
  // karanlık: fener yanınca ışık çemberi büyür
  const r1 = lerp(60, 760, ease(lit)), dark = lerp(.97, .9, lit);
  c.fillStyle = rg(LXw, LYw, r1 * .15, r1, [[0, 'rgba(0,0,0,0)'], [.55, `rgba(4,4,10,${dark * .45})`], [1, `rgba(3,3,8,${dark})`]]); c.fillRect(-1000, -400, 2720, 2000);
  if (lit < .3) { c.save(); c.globalAlpha = (1 - lit / .3) * .25; c.globalCompositeOperation = 'lighter'; ell(X - 60, Y - 520, 120, 240, rg(X - 60, Y - 520, 0, 240, [[0, 'rgba(120,150,220,.35)'], [1, 'rgba(0,0,0,0)']]), null); c.restore(); } // soğuk ay ışığı
  if (lit > 0) { c.save(); c.globalCompositeOperation = 'lighter'; ell(LXw, 1165, 220 * lit, 26 * lit, rg(LXw, 1165, 0, 220, [[0, `rgba(255,180,90,${.35 * lit})`], [1, 'rgba(0,0,0,0)']]), null); c.restore(); }
  if (t > tIg - .25 && t < tIg + .15) { const sp = 1 - Math.abs(t - tIg + .05) / .2; addLight(LXw, LYw - 20, 90 * sp, `rgba(255,240,200,${.9 * sp})`); }
  dustMotes(t, Math.round(26 * lit), LXw - 260, LYw - 420, 520, 600, .55 * lit);
  rainScr(t, 1, .8);
};

// kapanış çizimi: fener (halka, kapak, cam, alev) ve ışık çizgileri
function lanternSketch(k, x, y, s = 1) {
  c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = '#3a2410'; c.lineWidth = 4; c.lineCap = 'round'; c.lineJoin = 'round';
  const seg = (a, b, pts) => { const kk = cl((k - a) / (b - a), 0, 1); if (kk <= 0) return; c.beginPath(); c.moveTo(pts[0], pts[1]); const n = pts.length / 2 - 1, m = kk * n; for (let i = 1; i <= Math.ceil(m); i++) { const f = Math.min(1, m - (i - 1)); c.lineTo(lerp(pts[i * 2 - 2], pts[i * 2], f), lerp(pts[i * 2 - 1], pts[i * 2 + 1], f)); } c.stroke(); };
  const ring = []; for (let i = 0; i <= 12; i++) { const a = PI + i / 12 * PI; ring.push(Math.cos(a) * 16, -62 + Math.sin(a) * 16); }
  seg(0, .12, ring);
  seg(.1, .3, [-14, -62, 14, -62, 34, -40, -34, -40, -14, -62]);           // kapak
  seg(.28, .55, [-26, -40, -26, 34, 26, 34, 26, -40]);                       // cam
  seg(.55, .68, [-34, 34, 34, 34, 28, 50, -28, 50, -34, 34]);                // taban
  seg(.66, .8, [0, 14, 8, 2, 4, -14, 0, -22, -4, -14, -8, 2, 0, 14]);       // alev
  for (const [a, i] of [[-2.4, 0], [-1.57, 1], [-.74, 2], [3.14, 3], [0, 4]]) seg(.8 + i * .035, .86 + i * .035, [Math.cos(a) * 56, -6 + Math.sin(a) * 56, Math.cos(a) * 80, -6 + Math.sin(a) * 80]);
  c.restore();
}
