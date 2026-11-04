// Karakterler: Baykuş Kâzım ve Kurt Demir.
// Yerel koordinat: (0,0) iki ayağın arası yer seviyesi, yukarı negatif y. Baykuş ~1000 birim, kurt ~880 birim boyunda.
// p (poz) nesnesi: { t, talk, lid, brow, slant, low, mouth, lookX, lookY, blink, tilt, nod, L:{x,y,hand}, R:{x,y,hand}, lantern }

// Ekrandaki ışık kaynakları (motor en sonda toplamalı hâle olarak çizer)
let LIGHTS = [];
function addLight(x, y, r, col, a) {
  const m = c.getTransform(), q = m.transformPoint(new DOMPoint(x, y)), s = Math.hypot(m.a, m.b);
  LIGHTS.push({ x: q.x, y: q.y, r: r * s, col, a });
}

// İfadeler: lid=göz kapağı (0 açık, 1 kapalı), brow=kaş eğimi (+ kızgın/ciddi, - endişeli), mouth=gülümseme
const MOODS = {
  kazim: {
    calm: { lid: .40, brow: .14, slant: .10, low: .04 },
    stern: { lid: .50, brow: .38, slant: .32, low: .06 },
    warm: { lid: .30, brow: -.06, slant: -.06, low: .22 },
    sad: { lid: .46, brow: -.22, slant: -.18, low: .08 },
    surprised: { lid: .08, brow: -.28, slant: 0, low: 0 },
  },
  demir: {
    calm: { lid: .06, brow: 0, mouth: 8 },
    worry: { lid: .06, brow: -.34, mouth: -3 },
    sad: { lid: .24, brow: -.46, mouth: -11, lookY: .45 },
    hope: { lid: 0, brow: -.1, mouth: 16 },
    happy: { lid: .12, brow: -.06, mouth: 22 },
    surprised: { lid: -.06, brow: -.2, mouth: 0 },
  },
};

// ---------------- LAMBA (Kâzım'ın feneri) ----------------
function drawLantern(x, y, light, t, sc = 1) {
  c.save(); c.translate(x, y); c.scale(sc, sc);
  const sway = Math.sin(t * 1.7) * .05; c.rotate(sway);
  const fl = light * (.88 + .12 * noise1(t * 9)), IRON = '#1c1714';
  c.lineWidth = 6; c.strokeStyle = OL; c.beginPath(); c.arc(0, 4, 20, PI * 1.05, PI * 1.95); c.stroke(); // tutma halkası
  c.lineWidth = 3; c.strokeStyle = '#4a3f36'; c.stroke();
  poly([-16, 0, 16, 0, 46, 34, -46, 34], IRON, OL, 5);                  // tepe kapağı
  rr(-8, -8, 16, 12, 3, IRON, OL, 4);
  // cam gövde
  c.beginPath(); c.roundRect(-36, 34, 72, 108, 6);
  c.fillStyle = lg(0, 34, 0, 142, [[0, `rgba(255,${180 + 50 * fl | 0},90,${.25 + .7 * fl})`], [.6, `rgba(255,150,40,${.2 + .75 * fl})`], [1, `rgba(150,60,10,${.3 + .5 * fl})`]]);
  c.fill(); c.lineWidth = 5; c.strokeStyle = OL; c.stroke();
  // alev
  if (light > .02) {
    const fh = 34 * fl + 4, w = 11 * Math.min(1, fl + .3);
    c.save(); c.globalAlpha = cl(light * 1.4, 0, 1);
    blob([0, 108 - fh, w, 98, w * .7, 110, 0, 114, -w * .7, 110, -w, 98], '#fff3c4', null);
    blob([0, 104 - fh * .5, w * .5, 102, 0, 110, -w * .5, 102], '#ffffff', null); c.restore();
  }
  rr(-4, 112, 8, 16, 2, '#e8dcc0', OL, 3);                                // fitil
  for (const bx of [-18, 0, 18]) line(bx, 36, bx, 140, IRON, 5);          // kafes çubukları
  line(-36, 88, 36, 88, IRON, 4);
  poly([-46, 142, 46, 142, 38, 166, -38, 166], IRON, OL, 5);              // taban
  c.globalAlpha = .5; line(-28, 44, -28, 130, 'rgba(255,255,255,.5)', 3); c.globalAlpha = 1; // cam parlaması
  c.restore();
  addLight(x, y + 90 * sc, 520 * sc, `rgba(255,170,70,${.55 * fl})`, 1);
  addLight(x, y + 90 * sc, 110 * sc, `rgba(255,220,150,${.6 * fl})`, 1);
}

// ---------------- BAYKUŞ KÂZIM ----------------
const OWL = { SL: [-156, -612], SR: [156, -612], l1: 168, l2: 156, head: -852 };
const OWL_C = { jacket: '#6a4931', jacketD: '#46301f', vest: '#6d1d25', shirt: '#efe6d4', tie: '#8a1d24', gold: '#d9a441', head: '#7c583a', disc: '#ddcaa6', hand: '#2a201b', trouser: '#2b2019' };

function owlHand(x, y, ang, type, sc = 1) {
  c.save(); c.translate(x, y); c.rotate(ang - PI / 2); c.scale(sc, sc);
  const H = OWL_C.hand, F = '#2c1f17';
  if (type === 'point') {
    capsule([-8, 22, -8, 84], 17, H, 5);                    // işaret parmağı
    ell(0, 24, 27, 26, H, OL, 5);
    curve([12, 14, 22, 28, 14, 42], F, 4); curve([-6, 40, 10, 44, 20, 36], F, 4);
    capsule([20, 10, 30, 30], 13, H, 4);                    // başparmak
  } else if (type === 'palm') {
    for (const [a, l] of [[-.55, 46], [-.18, 54], [.18, 54], [.55, 46]]) {
      const ex = Math.sin(a) * l, ey = 22 + Math.cos(a) * l; capsule([Math.sin(a) * 14, 22, ex, ey], 15, H, 5);
    }
    ell(0, 24, 30, 27, H, OL, 5); capsule([-26, 14, -40, 4], 13, H, 4);
  } else if (type === 'fist') {
    ell(0, 20, 26, 24, H, OL, 5); for (const k of [-10, 0, 10]) curve([k - 4, 32, k, 40, k + 4, 32], F, 3);
  } else { // relax
    for (const k of [-12, 0, 12]) capsule([k, 26, k * 1.2, 52], 14, H, 5);
    ell(0, 22, 26, 25, H, OL, 5);
  }
  c.restore();
}

function owlArm(side, tgt, p) {
  const S = side < 0 ? OWL.SL : OWL.SR, j = ik(S[0], S[1], tgt.x, tgt.y, OWL.l1, OWL.l2, side);
  const fa = Math.atan2(j.wy - j.ey, j.wx - j.ex);
  const cx = j.wx - Math.cos(fa) * 16, cy = j.wy - Math.sin(fa) * 16;
  capsule([S[0], S[1], j.ex, j.ey, cx, cy], 64, OWL_C.jacket, 6);
  c.save(); c.globalAlpha = .35; c.beginPath(); c.moveTo(S[0] + side * 14, S[1]); c.lineTo(j.ex + side * 14, j.ey); c.lineTo(cx + side * 10, cy);
  c.lineWidth = 18; c.strokeStyle = OWL_C.jacketD; c.stroke(); c.restore();        // kol gölgesi
  capsule([cx, cy, j.wx, j.wy], 46, OWL_C.shirt, 5);                                // gömlek manşeti
  ell(cx, cy, 6, 6, OWL_C.gold, OL, 2);                                            // kol düğmesi
  owlHand(j.wx, j.wy, fa, tgt.hand);
  return j;
}

function drawOwl(p) {
  const t = p.t, br = Math.sin(t * 2.0) * 1;
  ell(0, 0, 200, 22, 'rgba(0,0,0,.5)', null);
  // bacaklar + ayakkabı
  for (const s of [-1, 1]) {
    poly([s * 24, -300, s * 98, -300, s * 90, -46, s * 32, -46], OWL_C.trouser, OL, 6);
    line(s * 62, -280, s * 61, -60, 'rgba(0,0,0,.4)', 3);
    blob([s * 26, -54, s * 98, -58, s * 140, -28, s * 134, -2, s * 26, -2], '#1d1310', OL, 6);
    ell(s * 104, -36, 16, 6, 'rgba(255,255,255,.18)', null, 0, s * .3);
  }
  c.save(); c.translate(0, -300); c.scale(1, 1 + br * .006); c.translate(0, 300);
  // ceket gövdesi
  const J = [-80, -672, -150, -642, -180, -590, -166, -470, -150, -380, -162, -268, -80, -252, 0, -260, 80, -252, 162, -268, 150, -380, 166, -470, 180, -590, 150, -642, 80, -672];
  c.beginPath(); smoothPath(J); c.fillStyle = lg(-180, 0, 180, 0, [[0, '#46301f'], [.3, OWL_C.jacket], [.7, OWL_C.jacket], [1, '#46301f']]); c.fill();
  texFill('tweed', 1); c.lineWidth = 6; c.strokeStyle = OL; c.stroke();
  // yelek (V yakadan ve alt etekten görünen)
  poly([-80, -670, 80, -670, 3, -428, 44, -258, -44, -258, -3, -428], lg(0, -670, 0, -260, [[0, '#7c2129'], [1, '#4a1117']]), OL, 5);
  // gömlek + kravat
  c.save(); c.beginPath(); c.moveTo(-50, -670); c.lineTo(50, -670); c.lineTo(0, -500); c.closePath(); c.fillStyle = OWL_C.shirt; c.fill(); c.clip();
  c.beginPath(); c.moveTo(-12, -640); c.lineTo(12, -640); c.lineTo(26, -520); c.lineTo(0, -490); c.lineTo(-26, -520); c.closePath();
  c.fillStyle = OWL_C.tie; c.fill(); c.save(); c.clip(); c.strokeStyle = OWL_C.gold; c.lineWidth = 6;
  for (let k = -700; k < -460; k += 26) { c.beginPath(); c.moveTo(-40, k); c.lineTo(40, k + 40); c.stroke(); }
  c.restore(); c.lineWidth = 4; c.strokeStyle = OL; c.stroke(); c.restore();
  poly([-50, -670, 50, -670, 0, -500], null, OL, 4);
  poly([-14, -656, 14, -656, 11, -632, -11, -632], '#701820', OL, 4);                    // kravat düğümü
  for (const s of [-1, 1]) poly([s * 54, -676, s * 6, -652, s * 36, -616], OWL_C.shirt, OL, 4); // yaka uçları
  for (const y of [-470, -446]) ell(0, y, 6, 6, OWL_C.gold, OL, 2);                       // yelek düğmeleri
  curve([8, -340, 30, -320, 22, -300], OWL_C.gold, 3);                                    // saat zinciri
  // ceket yakaları (klapa)
  for (const s of [-1, 1]) {
    c.beginPath(); c.moveTo(s * 80, -672); c.lineTo(s * 128, -640); c.lineTo(s * 136, -566); c.lineTo(s * 112, -556);
    c.lineTo(s * 120, -540); c.lineTo(s * 2, -428); c.closePath();
    c.fillStyle = '#5a3d29'; c.fill(); texFill('tweed', .8); c.lineWidth = 5; c.strokeStyle = OL; c.stroke();
    c.save(); c.setLineDash([7, 7]); curve([s * 118, -628, s * 124, -572, s * 20, -448], 'rgba(217,164,65,.55)', 2.5); c.restore();
  }
  ell(-108, -604, 8, 8, OWL_C.gold, OL, 3);                                               // yaka iğnesi
  poly([84, -566, 132, -566, 128, -556, 88, -556], OL, null);                              // göğüs cebi
  poly([92, -566, 104, -588, 112, -570, 122, -590, 128, -566], '#d9a441', OL, 3);           // mendil
  for (const s of [-1, 1]) rr(s > 0 ? 66 : -142, -340, 76, 14, 3, OWL_C.jacketD, OL, 4);   // yan cepler
  ell(0, -428, 10, 10, '#2e1c12', OL, 3);
  c.restore();
  // kollar (sol: fener, sağ: jest)
  const jl = owlArm(-1, p.L, p);
  if (p.L.hand === 'fist' && p.lantern != null) drawLantern(jl.wx, jl.wy + 22, p.lantern, t);
  const armUp = p.R.y < -560;
  if (!armUp) owlArm(1, p.R, p);
  // KAFA
  c.save(); c.translate(0, OWL.head + br * 2 + (p.nod || 0) * 14); c.rotate(p.tilt || 0);
  for (const s of [-1, 1]) {                                                               // kulak tüyleri
    blob([s * 62, -150, s * 120, -210, s * 168, -270, s * 214, -350, s * 206, -258, s * 226, -230, s * 196, -150, s * 150, -110], '#5c3f29', OL, 6);
    curve([s * 140, -170, s * 182, -250, s * 200, -300], '#3c2819', 4);
  }
  const HP = [0, -182, 130, -170, 214, -104, 240, 6, 208, 118, 112, 184, 0, 196, -112, 184, -208, 118, -240, 6, -214, -104, -130, -170];
  c.beginPath(); smoothPath(HP); c.fillStyle = rg(0, -70, 20, 260, [[0, '#8d6643'], [1, '#5c3f29']]); c.fill();
  texFill('feather', 1); c.lineWidth = 6; c.strokeStyle = OL; c.stroke();
  for (let i = -2; i <= 2; i++) curve([i * 34 - 10, -150 + Math.abs(i) * 8, i * 34, -138 + Math.abs(i) * 8, i * 34 + 10, -150 + Math.abs(i) * 8], '#4a3020', 4);
  // yüz diskleri (halkalı tüy deseni)
  for (const s of [-1, 1]) {
    const dx = s * 100; ell(dx, -2, 106, 104, rg(dx, -2, 30, 106, [[0, '#ecdcbb'], [1, '#c8b08a']]), null);
    c.lineWidth = 2; c.strokeStyle = 'rgba(120,90,55,.55)';
    for (let r = 68; r < 104; r += 8) { c.beginPath(); c.arc(dx, -2, r, 0, TAU); c.stroke(); }
    c.save(); c.globalAlpha = .4; for (let a = 0; a < TAU; a += .26) line(dx + Math.cos(a) * 66, -2 + Math.sin(a) * 66, dx + Math.cos(a) * 102, -2 + Math.sin(a) * 102, 'rgba(110,80,50,.6)', 1.5); c.restore();
    ell(dx, -2, 106, 104, null, '#3e2817', 6);
  }
  blob([-34, -126, 34, -126, 24, -30, 0, 26, -24, -30], '#7a5638', null);                // burun sırtı
  // gözler
  const lid = cl((p.lid || 0) + (p.blink || 0) * (1 - (p.lid || 0)), 0, 1);
  for (const s of [-1, 1]) {
    const ex = s * 100, ey = 0, R0 = 60, px = ex + (p.lookX || 0) * 16, py = ey + (p.lookY || 0) * 12;
    ell(ex, ey, R0, R0, rg(ex - 14, ey - 14, 4, R0, [[0, '#ffe58a'], [.55, '#f7a51e'], [1, '#c05a0b']]), null);
    c.save(); c.globalAlpha = .35; for (let a = 0; a < TAU; a += .3) line(ex + Math.cos(a) * 30, ey + Math.sin(a) * 30, ex + Math.cos(a) * 56, ey + Math.sin(a) * 56, '#a04a08', 2); c.restore();
    ell(px, py, 25, 26, '#100805', null);
    ell(px - 11, py - 13, 10, 10, '#fff', null); ell(px + 12, py + 12, 4.5, 4.5, 'rgba(255,255,255,.9)', null);
    // kapaklar
    c.save(); c.beginPath(); c.arc(ex, ey, R0 + 1, 0, TAU); c.clip();
    const base = -R0 + 2 * R0 * lid, sl = (p.slant || 0) * 26, yIn = base + sl, yOut = base - sl;
    const xi = ex - s * (R0 + 4), xo = ex + s * (R0 + 4);
    c.beginPath(); c.moveTo(xi, ey - R0 - 10); c.lineTo(xo, ey - R0 - 10); c.lineTo(xo, ey + yOut); c.quadraticCurveTo(ex, ey + (yIn + yOut) / 2 + 12, xi, ey + yIn); c.closePath();
    c.fillStyle = '#8b6745'; c.fill(); c.lineWidth = 7; c.strokeStyle = OL;
    c.beginPath(); c.moveTo(xo, ey + yOut); c.quadraticCurveTo(ex, ey + (yIn + yOut) / 2 + 12, xi, ey + yIn); c.stroke();
    const lo = (p.low || 0) * R0 * 2; if (lo > 1) {
      c.beginPath(); c.moveTo(ex - R0, ey + R0 + 4); c.lineTo(ex - R0, ey + R0 - lo); c.quadraticCurveTo(ex, ey + R0 - lo - 10, ex + R0, ey + R0 - lo); c.lineTo(ex + R0, ey + R0 + 4);
      c.fillStyle = '#d7c19c'; c.fill(); c.lineWidth = 4; c.stroke();
    }
    c.restore();
    ell(ex, ey, R0, R0, null, OL, 6);
    // kaş (kalın tüy kaş)
    const b = p.brow || 0, iy = -84 + b * 46, oy = -104 - b * 18;
    blob([s * 18, iy, s * 80, (iy + oy) / 2 - 16, s * 176, oy - 6, s * 186, oy + 10, s * 90, (iy + oy) / 2 + 14, s * 22, iy + 22], '#4a2f1d', OL, 4, .8);
  }
  // gaga
  const tk = p.talk || 0;
  if (tk > .03) blob([-18, 60, 18, 60, 10, 78 + tk * 22, 0, 84 + tk * 26, -10, 78 + tk * 22], '#22191a', OL, 4);
  blob([-26, 22, 0, 10, 26, 22, 14, 66, 0, 92, -14, 66], lg(0, 10, 0, 90, [[0, '#4b4140'], [1, '#191212']]), OL, 5);
  curve([-8, 26, -10, 50, -4, 70], 'rgba(255,255,255,.25)', 3);
  for (const s of [-1, 1]) for (let k = 0; k < 3; k++) curve([s * (70 + k * 30) - 8, 130 + k * 6, s * (70 + k * 30), 140 + k * 6, s * (70 + k * 30) + 8, 130 + k * 6], '#4a3020', 3);
  c.restore();
  if (armUp) owlArm(1, p.R, p);
}
// Fenerin dünyadaki yeri (kamera hesabı için, çizmeden)
function owlLanternPos(p) { const j = ik(OWL.SL[0], OWL.SL[1], p.L.x, p.L.y, OWL.l1, OWL.l2, -1); return [j.wx, j.wy + 22 + 90]; }

// ---------------- KURT DEMİR ----------------
const WOLF = { SL: [-126, -548], SR: [126, -548], l1: 148, l2: 138, head: -728 };
const WOLF_C = { fur: '#959fab', furD: '#6f7986', white: '#f2f0eb', jacket: '#7d1f2a', sleeve: '#ece5d7', scarf: '#e0a234', jeans: '#2c3f63', paw: '#8e98a4' };

function wolfPaw(x, y, ang, type) {
  c.save(); c.translate(x, y); c.rotate(ang - PI / 2);
  if (type === 'open') {
    for (const a of [-.6, -.2, .2, .6]) capsule([0, 20, Math.sin(a) * 36, 20 + Math.cos(a) * 36], 16, WOLF_C.paw, 5);
    ell(0, 22, 27, 25, WOLF_C.paw, OL, 5); ell(0, 26, 13, 11, '#59616c', null);
    for (const a of [-.6, -.2, .2, .6]) ell(Math.sin(a) * 36, 20 + Math.cos(a) * 36, 5, 5, '#59616c', null);
  } else {
    ell(0, 22, 26, 27, WOLF_C.paw, OL, 5);
    for (const k of [-11, 0, 11]) curve([k - 4, 36, k, 46, k + 4, 36], '#4b525c', 3);
  }
  c.restore();
}
function wolfArm(side, tgt) {
  const S = side < 0 ? WOLF.SL : WOLF.SR, j = ik(S[0], S[1], tgt.x, tgt.y, WOLF.l1, WOLF.l2, side);
  const fa = Math.atan2(j.wy - j.ey, j.wx - j.ex), at = k => [lerp(j.ex, j.wx, k), lerp(j.ey, j.wy, k)];
  const cf = at(.84);
  capsule([S[0], S[1], j.ex, j.ey, cf[0], cf[1]], 58, WOLF_C.sleeve, 6);
  for (const k of [.5, .62]) { const a = at(k), b = at(k + .05); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.lineWidth = 56; c.strokeStyle = WOLF_C.jacket; c.stroke(); }
  capsule([cf[0], cf[1], j.wx, j.wy], 48, '#6a1822', 5);
  wolfPaw(j.wx, j.wy, fa, tgt.hand);
  return j;
}
function drawWolf(p) {
  const t = p.t, br = Math.sin(t * 2.2 + 1);
  ell(0, 0, 175, 20, 'rgba(0,0,0,.5)', null);
  // kuyruk
  c.save(); c.translate(100, -290); c.rotate(Math.sin(t * 1.4) * .07);
  blob([0, -10, 80, 10, 135, 90, 125, 190, 95, 236, 92, 160, 60, 90, -10, 40], lg(0, 0, 120, 230, [[0, WOLF_C.furD], [.75, WOLF_C.fur], [1, '#eef0f2']]), OL, 6);
  c.restore();
  for (const s of [-1, 1]) {
    poly([s * 20, -292, s * 90, -292, s * 84, -50, s * 28, -50], WOLF_C.jeans, OL, 6);
    rr(s > 0 ? 26 : -86, -78, 60, 22, 4, '#3f5784', OL, 4);
    blob([s * 20, -56, s * 92, -58, s * 128, -26, s * 124, -2, s * 20, -2], '#d9772b', OL, 6);
    rr(s > 0 ? 18 : -128, -18, 110, 16, 6, '#f1ede4', OL, 4);
    for (const k of [0, 1, 2]) line(s * (44 + k * 14), -52 + k * 2, s * (52 + k * 14), -40 + k * 2, '#f1ede4', 3);
  }
  c.save(); c.translate(0, -290); c.scale(1, 1 + br * .006); c.translate(0, 290);
  const J = [-56, -592, -128, -566, -150, -520, -140, -400, -128, -300, -134, -262, 0, -258, 134, -262, 128, -300, 140, -400, 150, -520, 128, -566, 56, -592];
  c.beginPath(); smoothPath(J); c.fillStyle = lg(-150, 0, 150, 0, [[0, '#5a1520'], [.3, WOLF_C.jacket], [.7, WOLF_C.jacket], [1, '#5a1520']]); c.fill();
  c.save(); c.clip(); c.fillStyle = '#ece4d3'; c.fillRect(-160, -296, 320, 40); c.fillStyle = WOLF_C.jacket; c.fillRect(-160, -286, 320, 6); c.fillRect(-160, -274, 320, 6); c.restore();
  c.beginPath(); smoothPath(J); c.lineWidth = 6; c.strokeStyle = OL; c.stroke();
  poly([-42, -594, 42, -594, 36, -258, -36, -258], lg(0, -590, 0, -260, [[0, '#24314f'], [1, '#18213a']]), OL, 5);
  for (const s of [-1, 1]) for (const y of [-530, -470, -410, -350]) ell(s * 50, y, 5, 5, '#e9e3d6', OL, 2);
  c.save(); c.font = '900 64px Georgia,serif'; c.textAlign = 'center'; c.lineWidth = 8; c.strokeStyle = OL; c.lineJoin = 'round';
  c.strokeText('D', 92, -440); c.fillStyle = '#e8bf5c'; c.fillText('D', 92, -440); c.restore();
  // atkı
  c.beginPath(); smoothPath([-108, -612, 0, -630, 108, -612, 114, -566, 0, -548, -114, -566]); c.fillStyle = WOLF_C.scarf; c.fill(); texFill('knit', 1); c.lineWidth = 6; c.strokeStyle = OL; c.stroke();
  for (const [pts, ln] of [[[-58, -572, -16, -572, -12, -408, -54, -404], -404], [[-4, -566, 36, -568, 52, -462, 14, -456], -456]]) {
    c.beginPath(); c.moveTo(pts[0], pts[1]); for (let i = 2; i < 8; i += 2) c.lineTo(pts[i], pts[i + 1]); c.closePath();
    c.fillStyle = WOLF_C.scarf; c.fill(); texFill('knit', 1);
    c.save(); c.clip(); c.fillStyle = '#c47a1a'; for (let y = -540; y < -400; y += 34) c.fillRect(-80, y, 160, 9); c.restore();
    c.lineWidth = 5; c.strokeStyle = OL; c.stroke();
    for (let k = 0; k < 5; k++) { const fx = lerp(pts[6], pts[4], k / 4); line(fx, ln - 2 + (k % 2) * 3, fx, ln + 14, '#c47a1a', 4); }
  }
  c.restore();
  wolfArm(-1, p.L); wolfArm(1, p.R);
  // KAFA
  c.save(); c.translate(0, WOLF.head + br * 2 + (p.nod || 0) * 14); c.rotate(p.tilt || 0);
  const tw = hash(Math.floor(t / 2.7)) > .7 ? Math.sin(cl((t % 2.7) / .3, 0, 1) * PI) * .12 : 0; // kulak seğirmesi
  for (const s of [-1, 1]) {
    c.save(); c.translate(s * 120, -110); c.rotate(s * (s > 0 ? tw : 0)); c.translate(-s * 120, 110);
    blob([s * 46, -112, s * 112, -246, s * 168, -326, s * 206, -180, s * 196, -52], lg(0, -320, 0, -60, [[0, WOLF_C.furD], [1, WOLF_C.fur]]), OL, 6, .7);
    blob([s * 82, -118, s * 150, -262, s * 178, -118], '#e2a6aa', null, 0, .7);
    for (const k of [0, 1, 2]) line(s * (110 + k * 16), -110, s * (126 + k * 14), -150 - k * 8, '#f4f1ec', 3);
    c.restore();
  }
  const HP = [0, -168, 112, -152, 176, -92, 196, 0, 228, 54, 190, 72, 212, 110, 152, 124, 92, 160, 0, 172, -92, 160, -152, 124, -212, 110, -190, 72, -228, 54, -196, 0, -176, -92, -112, -152];
  c.beginPath(); smoothPath(HP, true, .85); c.fillStyle = rg(0, -60, 20, 240, [[0, '#a8b1bb'], [1, WOLF_C.furD]]); c.fill(); texFill('fur', 1);
  c.save(); c.clip();
  blob([-232, 70, -160, 6, -110, -44, -58, -58, -24, -22, 0, 8, 24, -22, 58, -58, 110, -44, 160, 6, 232, 70, 150, 130, 80, 176, 0, 190, -80, 176, -150, 130], WOLF_C.white, null, 0, .9);
  blob([-24, -170, 24, -170, 28, -44, 14, 34, -14, 34, -28, -44], '#8d97a3', null);
  c.restore();
  c.beginPath(); smoothPath(HP, true, .85); c.lineWidth = 6; c.strokeStyle = OL; c.stroke();
  for (const s of [-1, 1]) curve([s * 30, -150, s * 44, -128, s * 40, -110], '#5d6774', 4);
  for (const s of [-1, 1]) ell(s * 122, 66, 26, 13, 'rgba(232,140,150,.38)', null);
  // gözler
  const lid = cl((p.lid || 0) + (p.blink || 0) * (1 - (p.lid || 0)), -.1, 1);
  for (const s of [-1, 1]) {
    const ex = s * 70, ey = -24, px = ex + (p.lookX || 0) * 11, py = ey + 4 + (p.lookY || 0) * 10, RX = 44, RY = 48;
    ell(ex, ey, RX, RY, '#ffffff', null);
    c.save(); c.beginPath(); c.ellipse(ex, ey, RX, RY, 0, 0, TAU); c.clip();
    ell(px, py, 31, 34, rg(px - 8, py - 10, 3, 34, [[0, '#f0be66'], [.7, '#b26f2a'], [1, '#6e3f16']]), null);
    ell(px, py + 2, 16, 18, '#120a06', null);
    ell(px - 11, py - 12, 10, 10, '#fff', null); ell(px + 10, py + 13, 5, 5, '#fff', null);
    const ly = ey - RY + 2 * RY * Math.max(0, lid), sa = (p.brow || 0) * 14 * s;
    if (lid > 0) {
      c.beginPath(); c.moveTo(ex - RX - 4, ey - RY - 6); c.lineTo(ex + RX + 4, ey - RY - 6); c.lineTo(ex + RX + 4, ly + sa); c.quadraticCurveTo(ex, ly + 8, ex - RX - 4, ly - sa); c.closePath();
      c.fillStyle = '#a2abb6'; c.fill(); c.lineWidth = 6; c.strokeStyle = OL;
      c.beginPath(); c.moveTo(ex + RX + 4, ly + sa); c.quadraticCurveTo(ex, ly + 8, ex - RX - 4, ly - sa); c.stroke();
    }
    c.restore();
    ell(ex, ey, RX, RY, null, OL, 5);
    const b = p.brow || 0;
    curve([s * 28, -96 + b * 40, s * 70, -110 + b * 12, s * 112, -100 - b * 14], '#4c5562', 10);
  }
  // gözlük
  c.save(); c.globalAlpha = .1; ell(-70, -24, 60, 60, '#cfe8ff', null); ell(70, -24, 60, 60, '#cfe8ff', null); c.restore();
  for (const s of [-1, 1]) {
    ell(s * 70, -24, 60, 60, null, '#1f1c1a', 7);
    c.save(); c.globalAlpha = .4; c.lineWidth = 5; c.strokeStyle = '#fff'; c.beginPath(); c.arc(s * 70, -24, 48, PI * 1.1, PI * 1.45); c.stroke(); c.restore();
    line(s * 130, -30, s * 194, -46, '#1f1c1a', 6);
  }
  c.beginPath(); c.moveTo(-12, -28); c.quadraticCurveTo(0, -40, 12, -28); c.lineWidth = 6; c.strokeStyle = '#1f1c1a'; c.stroke();
  // burun, ağız
  blob([-26, 52, 26, 52, 18, 76, 0, 86, -18, 76], lg(0, 50, 0, 86, [[0, '#2a2624'], [1, '#0d0b0a']]), OL, 4);
  ell(-8, 60, 8, 4, 'rgba(255,255,255,.55)', null);
  line(0, 86, 0, 100, OL, 5);
  const tk = p.talk || 0, m = p.mouth || 0;
  if (tk > .05) {
    blob([-24, 102, 0, 98 - m * .2, 24, 102, 16, 110 + tk * 22, 0, 114 + tk * 24, -16, 110 + tk * 22], '#5a1a22', OL, 5);
    c.save(); c.beginPath(); smoothPath([-24, 102, 0, 98, 24, 102, 16, 110 + tk * 22, 0, 114 + tk * 24, -16, 110 + tk * 22]); c.clip(); ell(0, 118 + tk * 22, 16, 10, '#d46a78', null); c.restore();
  } else {
    c.beginPath(); c.moveTo(-34, 100 - m * .3); c.quadraticCurveTo(-17, 100 + m, 0, 100); c.quadraticCurveTo(17, 100 + m, 34, 100 - m * .3);
    c.lineWidth = 5; c.strokeStyle = OL; c.stroke();
  }
  for (const s of [-1, 1]) for (const [dx, dy] of [[34, 72], [44, 84], [30, 88]]) ell(s * dx, dy, 3, 3, '#7c8590', null);
  c.restore();
}
