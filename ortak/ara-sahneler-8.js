// Ara sahneler (8): "Son El" (kumar). Kıraathanenin arka odası, yeşil çuha, kartlar, fişler, olta metaforu, dükkân tezgâhı.
// ara-sahneler-5/6/7.js'ten SONRA yüklenir (demirPose, kf, scrText, BASEX burada kullanılır).

// ---------- kart çizimleri (yazı tipine bağlı kalmasın diye takımlar şekil olarak çizilir) ----------
function suitShape(s, x, y, size, col) {
  c.save(); c.translate(x, y); const k = size / 32; c.scale(k, k); c.fillStyle = col; c.beginPath();
  const heart = (flip) => { for (let i = 0; i <= 40; i++) { const a = i / 40 * TAU, hx = 16 * Math.sin(a) ** 3, hy = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)); const yy = flip ? -hy : hy; i ? c.lineTo(hx, yy) : c.moveTo(hx, yy); } };
  if (s === 'h') { heart(false); c.fill(); }
  else if (s === 'd') { c.moveTo(0, -18); c.lineTo(13, 0); c.lineTo(0, 18); c.lineTo(-13, 0); c.closePath(); c.fill(); }
  else if (s === 's') { heart(true); c.fill(); c.beginPath(); c.moveTo(0, 6); c.lineTo(7, 20); c.lineTo(-7, 20); c.closePath(); c.fill(); }
  else { for (const [cx, cy] of [[0, -9], [-9, 4], [9, 4]]) { c.moveTo(cx + 8, cy); c.arc(cx, cy, 8, 0, TAU); } c.fill(); c.beginPath(); c.moveTo(0, 2); c.lineTo(6, 18); c.lineTo(-6, 18); c.closePath(); c.fill(); }
  c.restore();
}
// Oyun kartı: merkez (x,y), açı rot, ölçek sc; face = ['A','s'] (yüzü açık) ya da null (sırtı)
function playCard(x, y, rot, sc, face) {
  const W = 120, H = 168;
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(sc, sc);
  rr(-W / 2 + 3, -H / 2 + 5, W, H, 12, 'rgba(0,0,0,.35)', null);                       // gölge
  rr(-W / 2, -H / 2, W, H, 12, face ? '#fbf8f0' : '#f3ece0', OL, 4);
  if (!face) {                                                                          // sırt: bordo, elmas desen
    rr(-W / 2 + 9, -H / 2 + 9, W - 18, H - 18, 7, '#8a1c22', null);
    c.save(); c.beginPath(); c.roundRect(-W / 2 + 9, -H / 2 + 9, W - 18, H - 18, 7); c.clip(); c.strokeStyle = 'rgba(255,220,180,.35)'; c.lineWidth = 2;
    for (let d = -200; d < 200; d += 16) { c.beginPath(); c.moveTo(d, -100); c.lineTo(d + 200, 100); c.moveTo(d, 100); c.lineTo(d + 200, -100); c.stroke(); } c.restore();
  } else {
    const [r, s] = face, red = s === 'h' || s === 'd', col = red ? '#c8302a' : '#1a1614';
    c.font = '800 30px Georgia,serif'; c.fillStyle = col; c.textAlign = 'center';
    c.fillText(r, -W / 2 + 20, -H / 2 + 34); suitShape(s, -W / 2 + 20, -H / 2 + 54, 16, col);
    c.save(); c.rotate(PI); c.fillText(r, -W / 2 + 20, -H / 2 + 34); suitShape(s, -W / 2 + 20, -H / 2 + 54, 16, col); c.restore();
    suitShape(s, 0, 4, r === 'A' ? 64 : 44, col);
  }
  c.restore();
}
function chipStack(x, y, n, col, sc = 1) {
  for (let i = 0; i < n; i++) { const yy = y - i * 7 * sc; ell(x, yy + 4 * sc, 28 * sc, 10 * sc, 'rgba(0,0,0,.35)', null); ell(x, yy, 28 * sc, 10 * sc, col, OL, 3); ell(x, yy, 18 * sc, 6 * sc, null, 'rgba(255,255,255,.6)', 2); }
}
// Dükkân kavanozu: içinde para (oran 0..1)
function moneyJar(x, y, fill, sc = 1) {
  c.save(); c.translate(x, y); c.scale(sc, sc);
  rr(-46, -120, 92, 120, 18, 'rgba(210,235,245,.28)', OL, 4);
  if (fill > 0) { const h = 100 * fill; c.save(); c.beginPath(); c.roundRect(-40, -114, 80, 108, 14); c.clip(); for (let i = 0; i < 8; i++) rr(-38 + (i % 2) * 6, -8 - h + i * (h / 8), 76, h / 7, 3, i % 2 ? '#5a8a4a' : '#7aa860', null); c.restore(); }
  rr(-38, -136, 76, 20, 6, '#6a4128', OL, 3);
  rr(-40, -70, 80, 26, 4, '#efe2c4', OL, 2); c.font = '700 15px Inter,Arial'; c.fillStyle = '#3a2410'; c.textAlign = 'center'; c.fillText('DÜKKÂN', 0, -52);
  c.save(); c.globalAlpha = .4; line(-30, -110, -30, -16, '#fff', 5); c.restore();
  c.restore();
}

// ---------- arka oda + kart masası ----------
function backRoom(t, o = {}) {
  c.fillStyle = lg(0, -300, 0, 1300, [[0, '#0d0b08'], [1, '#1c1510']]); c.fillRect(-1000, -300, 2720, 1900);
  c.save(); c.globalAlpha = .22; for (let x = -1008; x < 1720; x += 44) { c.fillStyle = (x / 44) % 2 ? '#1f2a1c' : '#2c3a26'; c.fillRect(x, -300, 22, 1300); } c.restore();   // eskimiş yeşil duvar kâğıdı
  rr(-1000, 560, 2720, 18, 0, '#2a1d14', null);                                                                                                // lambri
  c.fillStyle = 'rgba(30,20,14,.85)'; c.fillRect(-1000, 578, 2720, 500);
  // kapı (sağda): o.door 0 kapalı … 1 açık (sabah ışığı)
  const DX = o.doorX ?? 560, DY = 520, DW = 150, DH = 400, op = o.door || 0;
  rr(DX - 16, DY - 16, DW + 32, DH + 16, 4, '#2a1a10', OL, 5);
  if (op > 0) { c.fillStyle = lg(0, DY, 0, DY + DH, [[0, '#fff3d0'], [1, '#f2c47a']]); c.fillRect(DX, DY, DW, DH); addLight(DX + DW / 2, DY + DH / 2, 420 * op, `rgba(255,220,160,${.5 * op})`); }
  poly([DX + DW * op, DY, DX + DW, DY, DX + DW, DY + DH, DX + DW * op, DY + DH], '#3a2618', OL, 4);
  if (op < .9) ell(DX + DW * op + 18, DY + DH * .55, 7, 7, '#c9a04a', OL, 2);
  // sarkan lamba + ışık konisi
  const LX = o.lampX ?? 360, sw = Math.sin(t * .9) * 4;
  line(LX, -300, LX + sw, 300, '#0a0806', 4);
  poly([LX + sw - 70, 360, LX + sw + 70, 360, LX + sw + 30, 300, LX + sw - 30, 300], '#1f3a2c', OL, 4);
  ell(LX + sw, 362, 34, 9, '#fff2c8', null);
  c.save(); c.globalCompositeOperation = 'lighter'; poly([LX + sw - 60, 362, LX + sw + 60, 362, LX + 420, 1100, LX - 420, 1100], 'rgba(255,214,140,.07)', null); c.restore();
  addLight(LX + sw, 380, 420, 'rgba(255,200,120,.35)');
  // sigara dumanı
  c.save(); for (let i = 0; i < 9; i++) { const p = (t * .05 + hash(i)) % 1, x = -100 + hash(i + 3) * 900 + Math.sin(t * .3 + i) * 40, y = 820 - p * 700; c.globalAlpha = .07 * Math.sin(p * PI); ell(x, y, 120 + p * 120, 40 + p * 40, '#d8d0c4', null); } c.restore();
}
function cardTable(x = 360, y = 930, rx = 360) {
  rr(x - rx, y, rx * 2, 700, 10, lg(0, y, 0, y + 400, [[0, '#3a2414'], [1, '#1a0f08']]), OL, 6);                 // önden masa gövdesi
  for (let i = -3; i <= 3; i++) line(x + i * rx / 3.5, y + 40, x + i * rx / 3.5, y + 600, 'rgba(0,0,0,.3)', 3);
  ell(x, y, rx, rx * .27, '#4a2c18', OL, 6);                                                                    // ahşap kenar
  ell(x, y - 2, rx * .92, rx * .24, rg(x, y - 20, 20, rx, [[0, '#2f7a4a'], [1, '#174a2a']]), null);             // yeşil çuha
  c.save(); c.globalAlpha = .12; ell(x, y - 2, rx * .92, rx * .24, null, '#e8e0c8', 2); c.restore();
}

// ---------- masa düzeni (kıraathane usulü): Tilki solda, Demir sağda, masanın arkasında. Kartlar ELDE yelpaze;
// sırası gelen kartını ortadaki yığına açık atar. Masada kâğıt para. Kollar eklem çözümüyle; masaya uzanan kol çuhanın üstünde çizilir.
const MASA = { TX: 280, DX: 470, Y: 1085, SC: .58, EDGE: 842 };
const toL = (X0, x, y) => ({ x: (x - X0) / MASA.SC, y: (y - MASA.Y) / MASA.SC });   // dünya → karakter yerel
const PILE = [398, 898], POT = [440, 930];                                         // ortadaki kart yığını ve para
const FAN = { demir: { L: [452, 832], R: [512, 828], c: [482, 812] }, tilki: { L: [266, 832], R: [326, 828], c: [296, 812] } };
// Kâğıt para destesi (₺): n adet, hafif dağınık
function cashPile(x, y, n, sc = 1) {
  for (let i = 0; i < n; i++) { const r = (hash(i * 3 + x) - .5) * .3, yy = y - i * 3.2 * sc;
    c.save(); c.translate(x + (hash(i + x) - .5) * 8 * sc, yy); c.rotate(r); c.scale(sc, sc);
    rr(-38, -18, 76, 36, 3, i % 3 === 2 ? '#c96a7a' : '#5f9a6a', OL, 2.5); rr(-32, -12, 64, 24, 2, null, 'rgba(255,255,255,.35)', 1.5); ell(0, 0, 9, 9, 'rgba(255,255,255,.3)', null); c.restore(); }
}
// Elde tutulan kart yelpazesi (arkası bize dönük)
function cardFan(cx, cy, n, sc = .42, spread = .17) {
  for (let j = 0; j < n; j++) { const a = (j - (n - 1) / 2) * spread; playCard(cx + Math.sin(a) * 70 * sc * 2, cy - Math.cos(a) * 26 * sc * 2 + 26 * sc * 2, a, sc, null); }
}
// Atılan kart: elden (x0,y0) yığına (PILE) uçar; f 0..1; açık yüzüyle düşer
function flyCard(x0, y0, f, face, rot0 = 0, rot1 = 0, dx = 0, dy = 0) {
  const e = ease(f), x = lerp(x0, PILE[0] + dx, e), y = lerp(y0, PILE[1] + dy, e) - Math.sin(f * PI) * 40;
  playCard(x, y, lerp(rot0, rot1, e) + Math.sin(f * PI) * .6, lerp(.44, .42, e), f > .45 ? face : null);
}
function masaKur(t, o) {
  backRoom(t);
  const F = o.fans || {};
  // kol hedefleri: yelpaze tutan patiler göğüs/masa kenarı hizasında; o.demirL/o.tilkiR verilirse (atış/çekiş) onlar
  const DLt = o.demirL || (F.demir ? Object.assign(toL(MASA.DX, ...FAN.demir.L), { hand: 'relax' }) : { x: -148, y: -272, hand: 'relax' });
  const DRt = o.demirR || (F.demir ? Object.assign(toL(MASA.DX, ...FAN.demir.R), { hand: 'relax' }) : { x: 148, y: -272, hand: 'relax' });
  const TLt = F.tilki ? Object.assign(toL(MASA.TX, ...FAN.tilki.L), { hand: 'relax' }) : { x: -150, y: -300, hand: 'relax' };
  const TRt = o.tilkiR || (F.tilki ? Object.assign(toL(MASA.TX, ...FAN.tilki.R), { hand: 'relax' }) : { x: 150, y: -300, hand: 'relax' });
  c.save(); c.beginPath(); c.rect(-1000, -300, 2720, MASA.EDGE + 300); c.clip();
  if (o.crowd !== false) {
    c.save(); c.translate(80, 1010); c.scale(.45, .45); gangBody('ayi', { t, laugh: o.ayi || 0, lookX: .5, tilt: Math.sin(t * 6) * .03 * (o.ayi || 0) }); c.restore();
    c.save(); c.translate(655, 1000); c.scale(.42, .42); gangBody('kedi', { t, laugh: o.kedi || 0, lookX: -.5, tilt: -.04 }); c.restore();
  }
  c.save(); c.translate(MASA.TX, MASA.Y); c.scale(MASA.SC, MASA.SC); gangBody('tilki', { t, laugh: o.tl ?? .25, lookX: o.tlook ?? .6, lookY: .2, tilt: .04, L: TLt, R: TRt }); c.restore();
  c.save(); c.translate(MASA.DX, MASA.Y); c.scale(MASA.SC, MASA.SC); drawWolf(Object.assign({}, o.demir, { L: DLt, R: DRt })); c.restore();
  c.restore();
  cardTable();
  if (o.items) o.items();
  // masaya uzanan kollar çuhanın üstünde
  const onTable = tg => tg.y > (MASA.EDGE - MASA.Y) / MASA.SC + 8;
  // yalnızca bilerek masaya uzatılan kollar (atış/çekiş) yeniden çizilir; boştaki kollar masanın arkasında kalır
  if (o.tilkiR && onTable(TRt)) { c.save(); c.translate(MASA.TX, MASA.Y); c.scale(MASA.SC, MASA.SC); gangArm(GANG.tilki, 1, TRt, GANG.tilki.sw); c.restore(); }
  if (o.demirL && onTable(DLt)) { c.save(); c.translate(MASA.DX, MASA.Y); c.scale(MASA.SC, MASA.SC); wolfArm(-1, DLt); c.restore(); }
  if (o.demirR && onTable(DRt)) { c.save(); c.translate(MASA.DX, MASA.Y); c.scale(MASA.SC, MASA.SC); wolfArm(1, DRt); c.restore(); }
  // eldeki yelpazeler (patiler kartları önden kavrar)
  if (F.tilki) { cardFan(...FAN.tilki.c, F.tilki); for (const [k2, pt] of [['L', TLt], ['R', TRt]]) if (!onTable(pt) && !(k2 === 'R' && o.tilkiR)) { const w = FAN.tilki[k2]; ell(w[0], w[1] - 4, 15, 13, GANG.tilki.paw, OL, 3); } }
  if (F.demir) { cardFan(...FAN.demir.c, F.demir); for (const [k2, pt] of [['L', DLt], ['R', DRt]]) if (!onTable(pt) && !(k2 === 'L' && o.demirL) && !(k2 === 'R' && o.demirR)) { const w = FAN.demir[k2]; ell(w[0], w[1] - 4, 15, 13, WOLF_C.paw, OL, 3); } }
  if (o.over) o.over();
}
// atış kolu: ph 0..1 (gidiş-dönüş), elden yığına
const throwArm = (X0, from, ph, hand = 'relax') => Object.assign(toL(X0, lerp(from[0], PILE[0] + 10, Math.sin(ph * PI)), lerp(from[1], PILE[1] + 6, Math.sin(ph * PI))), { hand });

// ---------- 0) AÇILIŞ (sessiz): gece 01:20, arka oda. Demir dükkân parasını masaya koyar; Tilki kartları dağıtır, Demir elini toplar ----------
SCENES.kart_acilis = S => {
  const t = S.t, lt = S.lt;
  cam(lerp(360, 380, ss(0, 7, lt)), lerp(820, 860, ss(0, 7, lt)), lerp(1.0, 1.28, ease(ss(0, 7, lt))));
  // 1) Demir kavanozu sağ patisiyle masaya bırakır (0.8–2.2)
  const JAR = [592, 940], lift = ease(ss(.8, 1.7, lt)), back = ss(1.9, 2.4, lt);
  const jarPos = [lerp(560, JAR[0], lift), lerp(925, JAR[1], lift) - Math.sin(lift * PI) * 40];
  const demirR = lt > .7 && back < 1 ? Object.assign(toL(MASA.DX, lerp(jarPos[0], 512, back), lerp(jarPos[1] - 70, 828, back)), { hand: 'relax' }) : null;
  // 2) Tilki elindeki desteden Demir'e 5 kart atar (2.5–4.3); 3) Demir kartları toplayıp yelpaze yapar (4.6–5.3)
  const deal = [2.5, 2.86, 3.22, 3.58, 3.94], picked = ss(4.6, 5.3, lt), dealing = lt > 2.4 && lt < 4.4;
  const flick = dealing ? Math.max(0, Math.sin(((lt - 2.5) % .36) / .36 * PI)) : 0;
  const tilkiR = dealing ? Object.assign(toL(MASA.TX, lerp(326, 352, flick), lerp(828, 846, flick)), { hand: 'relax' }) : null;
  masaKur(t, { demirR, tilkiR, tl: .3, ayi: 0, kedi: 0, fans: { tilki: lt < 2.4 ? 0 : 0, demir: picked > .5 ? 5 : 0 },
    demir: demirPose('calm', { t, talk: 0, lookX: lt < 2.4 ? .3 : -.4, lookY: .4, blink: (lt % 3.9 < .14) ? 1 : 0, mouth: 4 }),
    items: () => {
      cashPile(286, 938, 6, .8); cashPile(540, 936, 5, .8);
      moneyJar(jarPos[0], jarPos[1], 1, .62);
      deal.forEach((d0, i) => { const f = ease(ss(d0, d0 + .3, lt)); if (lt > d0 && picked < .5) playCard(lerp(340, 470 + (i - 2) * 6, f) + (picked > 0 ? (482 - 470) * picked : 0), lerp(832, 905 - i * 2, f) - Math.sin(f * PI) * 26 - picked * 80, lerp(-.5, (i - 2) * .05, f), .42, null); });
    },
    over: () => { if (lt < 4.4) { playCard(330, 822, -.15, .44, null); playCard(333, 819, -.12, .44, null); ell(326, 824, 15, 13, GANG.tilki.paw, OL, 3); } } }); // Tilki'nin destesi
  letterbox(1, 150);
  typeText('GECE 01:20 · ARKA ODA', ss(.4, 2.0, lt), 40, 1222, '600 22px Cinzel,Georgia,serif', 'rgba(236,224,200,.9)');
};

// ---------- 1) MASA: 'kazan' ilk el (Demir'in kartı büyük, para ona gelir); 'kaybet' her elde Tilki üstüne daha büyüğünü atar ----------
SCENES.masa = S => {
  const t = S.t, k = S.k, lose = S.phase === 'kaybet';
  cam(lerp(360, 370, k), lerp(820, 800, k), lerp(1.12, 1.2, ease(k)));
  let demirL = null, tilkiR = null, pile = [], potTo = 0, drain = 0, mood, win = 0;
  if (!lose) { // Tilki önce atar, Demir büyük kartla keser, para Demir'e
    const tTh = ss(.08, .26, k), dTh = ss(.3, .48, k); win = ss(.52, .72, k);
    if (tTh > 0 && tTh < 1) tilkiR = throwArm(MASA.TX, FAN.tilki.R, tTh);
    if (dTh > 0 && dTh < 1) demirL = throwArm(MASA.DX, FAN.demir.L, dTh);
    if (win > 0 && win < 1) demirL = Object.assign(toL(MASA.DX, lerp(POT[0] + 10, 520, win), lerp(POT[1], 930, win)), { hand: 'relax' });
    pile = [[tTh, FAN.tilki.c, ['K', 'c'], -.2, .1, -14, 0], [dTh, FAN.demir.c, ['A', 'h'], .2, -.12, 14, 6]];
    mood = win > .5 ? 'happy' : (dTh > .5 ? 'hope' : 'calm');
  } else { // 2.4 sn'lik eller: Demir atar → Tilki üstüne büyüğünü atar → Tilki parayı çeker
    drain = ss(.05, .9, k); const cyc = (S.pt % 2.4) / 2.4, n = Math.floor(S.pt / 2.4);
    const dTh = ss(.04, .26, cyc), tTh = ss(.32, .54, cyc), pull = ss(.6, .92, cyc);
    if (dTh > 0 && dTh < 1) demirL = throwArm(MASA.DX, FAN.demir.L, dTh);
    if (tTh > 0 && tTh < 1) tilkiR = throwArm(MASA.TX, FAN.tilki.R, tTh);
    if (pull > 0 && pull < 1) tilkiR = Object.assign(toL(MASA.TX, lerp(POT[0] - 6, 330, pull), lerp(POT[1], 934, pull)), { hand: 'grab' });
    const dc = [['7', 'd'], ['9', 'c'], ['5', 'h'], ['8', 's']][n % 4], tc = [['K', 's'], ['A', 'd'], ['Q', 'h'], ['A', 's']][n % 4];
    pile = [[dTh, FAN.demir.c, dc, .2, -.1, 12, 4], [tTh, FAN.tilki.c, tc, -.2, .15, -10, -2]];
    potTo = pull; mood = drain > .5 ? 'sad' : 'worry';
  }
  masaKur(t, { demirL, tilkiR, fans: { tilki: 5, demir: 5 }, tl: lose ? .3 + .2 * Math.abs(Math.sin(t * 4)) : .25 + win * .2,
    ayi: lose ? .55 + .3 * Math.abs(Math.sin(t * 6)) : win * (.5 + .3 * Math.abs(Math.sin(t * 7))), kedi: lose ? .25 : win * .6,
    demir: demirPose(mood, { t, talk: S.talk.demir, lookX: -.45, lookY: .55, blink: (t % 3.7 < .14) ? 1 : 0, tilt: lose ? .06 * drain : -.04 * win, mouth: lose ? lerp(0, -12, drain) : lerp(6, 24, win) }),
    items: () => {
      cashPile(lerp(286, 286, 0), 938, lose ? Math.round(lerp(5, 14, drain)) : 5, .8);                                  // Tilki'nin parası
      cashPile(540, 936, lose ? Math.max(1, Math.round(lerp(6, 1, drain))) : Math.round(lerp(4, 9, win)), .8);           // Demir'in parası
      const px = lose ? lerp(POT[0], 300, potTo) : lerp(POT[0], 530, win), py = lose ? lerp(POT[1], 936, potTo) : lerp(POT[1], 930, win);
      if (lose ? potTo < .98 : win < .98) cashPile(px, py, 4, .75);                                                     // ortadaki bahis
      moneyJar(600, 968, lose ? 1 - drain : 1, .58);
      for (const [f, fr, face, r0, r1, dx, dy] of pile) if (f > 0) flyCard(fr[0], fr[1], f, face, r0, r1, dx, dy);
    } });
};

// ---------- 2) OLTA (metafor): karanlık suda parlayan bir fiş yem; küçük balık ısırır, olta çekilir ----------
SCENES.olta = S => {
  const t = S.t, k = S.k;
  cam(360, 640, 1.05);
  c.fillStyle = lg(0, -300, 0, 1300, [[0, '#0b2238'], [.5, '#06121f'], [1, '#020509']]); c.fillRect(-1000, -300, 2720, 1900);
  c.save(); c.globalCompositeOperation = 'lighter'; for (let i = 0; i < 5; i++) { const x = 100 + i * 140 + Math.sin(t * .4 + i) * 30; poly([x - 20, -300, x + 20, -300, x + 160, 1300, x + 60, 1300], 'rgba(120,180,230,.05)', null); } c.restore();
  for (let i = 0; i < 40; i++) { const x = (hash(i) * 900) - 90, y = ((hash(i + 3) * 1500 - t * 20 * (1 + hash(i))) % 1500 + 1500) % 1500 - 100; ell(x, y, 2, 2, 'rgba(180,220,255,.25)', null); }
  const yank = ease(ss(.6, .85, k)), sway = Math.sin(t * 1.3) * 10 * (1 - yank);
  const hx = 380 + sway, hy = lerp(600, -260, yank);
  line(380, -400, hx, hy - 60, 'rgba(230,230,230,.7)', 2);
  // kanca
  c.save(); c.translate(hx, hy); c.lineCap = 'round';
  c.beginPath(); c.moveTo(0, -60); c.lineTo(0, 10); c.quadraticCurveTo(0, 40, -24, 36); c.quadraticCurveTo(-40, 32, -36, 12); c.lineWidth = 6; c.strokeStyle = OL; c.stroke(); c.lineWidth = 3; c.strokeStyle = '#c8ccd2'; c.stroke();
  poly([-36, 12, -44, 26, -30, 20], '#c8ccd2', OL, 2); c.restore();
  // yem: parlayan altın fiş
  const bit = k > .52;
  if (!bit || yank < .02) { const by = hy + 30; ell(hx - 12, by, 24, 24, rg(hx - 18, by - 8, 2, 26, [[0, '#fff1b0'], [1, '#d9a441']]), OL, 3); ell(hx - 12, by, 14, 14, null, 'rgba(120,80,20,.6)', 2); addLight(hx - 12, by, 170, `rgba(255,210,110,${.45 + .1 * Math.sin(t * 5)})`); }
  // balık: soldan gelir, yeme yaklaşır, ısırır, oltayla çekilir
  const come = ease(ss(.05, .5, k)), fx = bit ? hx - 50 : lerp(-180, hx - 64, come), fy = bit ? hy + 34 : 640 + Math.sin(t * 2) * 12, wig = Math.sin(t * (bit ? 22 : 9)) * (bit ? .3 : .15);
  c.save(); c.translate(fx, fy); c.rotate(bit ? -.9 * yank - .2 : 0);
  c.save(); c.translate(-62, 0); c.rotate(wig); poly([0, 0, -50, -34, -42, 0, -50, 34], '#5d7a96', OL, 4); c.restore();
  ell(0, 0, 70, 38, lg(0, -38, 0, 38, [[0, '#8fb0c8'], [1, '#4a6a86']]), OL, 5);
  poly([-10, -34, 20, -54, 26, -30], '#5d7a96', OL, 3);
  ell(36, -8, 9, 9, '#fff', OL, 2); ell(38, -8, 4, 5, '#120a06', null);
  if (bit) curve([60, 6, 68, 10, 62, 14], OL, 3); else curve([62, 4, 70, 8, 62, 12], OL, 3);
  c.restore();
  if (bit) for (let i = 0; i < 10; i++) { const p = ((t * 1.5 + hash(i)) % 1); ell(fx + (hash(i + 2) - .5) * 80, fy + 40 - p * 160, 4 + p * 4, 4 + p * 4, null, 'rgba(200,230,255,.5)', 2); } // çırpınma kabarcıkları
  c.save(); c.globalCompositeOperation = 'lighter'; ell(360, 640, 520, 520, rg(360, 640, 100, 520, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0)']]), null); c.restore();
};

// ---------- 3) BİR EL DAHA: masaya yakın; her elde Demir atar, Tilki üstüne büyüğünü atar, parayı çeker. 3 el, sayaç azalır ----------
SCENES.bir_el_daha = S => {
  const t = S.t, per = S.pd / 3, i = Math.min(2, Math.floor(S.pt / per)), ph = cl((S.pt - i * per) / per, 0, 1);
  cam(380, 860, 1.5);
  const dTh = ss(.04, .26, ph), tTh = ss(.32, .54, ph), pull = ss(.62, .9, ph);
  const money = [12000, 6000, 1500, 0], cur = pull > .5 ? money[i + 1] : money[i];
  let demirL = null, tilkiR = null;
  if (dTh > 0 && dTh < 1) demirL = throwArm(MASA.DX, FAN.demir.L, dTh);
  if (tTh > 0 && tTh < 1) tilkiR = throwArm(MASA.TX, FAN.tilki.R, tTh);
  if (pull > 0 && pull < 1) tilkiR = Object.assign(toL(MASA.TX, lerp(POT[0] - 6, 330, pull), lerp(POT[1], 934, pull)), { hand: 'grab' });
  masaKur(t, { demirL, tilkiR, fans: { tilki: 5, demir: 5 - i }, tl: .35 + .25 * pull, ayi: .5, kedi: .2,
    demir: demirPose(i < 2 ? 'worry' : 'sad', { t, talk: 0, lookX: -.3, lookY: .65, blink: 0, tilt: .04 + i * .03, mouth: -4 - i * 4 }),
    items: () => {
      cashPile(286, 938, 6 + i * 3, .8); cashPile(540, 936, 3 - i, .8);
      if (pull < .98) cashPile(lerp(POT[0], 300, pull), lerp(POT[1], 936, pull), 4 - i, .75);
      moneyJar(600, 968, [.66, .33, .08][i] * (1 - .5 * pull), .58);
      const dc = [['7', 'c'], ['3', 'd'], ['2', 's']][i], tc = [['A', 's'], ['K', 'h'], ['Q', 'd']][i];
      if (dTh > 0) flyCard(...FAN.demir.c, dTh, dc, .2, -.1, 12, 4);
      if (tTh > 0) flyCard(...FAN.tilki.c, tTh, tc, -.2, .15, -10, -2);
    },
    over: () => { // para sayacı (kırmızı dijital), masanın önünde
      const sx = 255, sy = 1000, txt = '₺ ' + cur.toLocaleString('tr');
      rr(sx, sy, 250, 62, 10, '#121418', OL, 4); c.font = '700 36px "Courier New",monospace'; c.fillStyle = cur === 0 ? '#ff3a2a' : '#ff6a5a'; c.textAlign = 'center'; c.fillText(txt, sx + 125, sy + 44);
      if (pull > .5 && pull < 1) { c.save(); c.globalAlpha = 1 - pull; c.font = '800 30px Inter,Arial'; c.fillStyle = '#ff5a4a'; c.fillText('−' + (money[i] - money[i + 1]).toLocaleString('tr'), sx + 125, sy + 100 + 26 * pull); c.restore(); }
    } });
};

// ---------- 4) KARTLARIN: Demir elindeki kartlara bakar; sonra hepsini kapalı olarak Tilki'nin önüne fırlatır, Tilki toplar ----------
SCENES.kart_el = S => {
  const t = S.t, k = S.k;
  cam(390, 860, 1.42);
  const look = ss(0, .25, k), toss = ss(.4, .58, k), take = ss(.68, .9, k);
  const tossArm = toss > 0 && toss < 1 ? Object.assign(toL(MASA.DX, lerp(FAN.demir.L[0], 352, Math.sin(toss * PI * .5)), lerp(FAN.demir.L[1], 906, Math.sin(toss * PI * .5))), { hand: 'open' }) : null;
  const tilkiR = take > 0 && take < 1 ? Object.assign(toL(MASA.TX, lerp(330, 344, Math.sin(take * PI)), lerp(828, 908, Math.sin(take * PI))), { hand: 'grab' }) : null;
  masaKur(t, { demirL: tossArm, tilkiR, fans: { tilki: 5, demir: toss > .05 ? 0 : 5 }, tl: .35 + .3 * take, ayi: .35, kedi: .1,
    demir: demirPose('sad', { t, talk: 0, lookX: lerp(.05, -.35, toss), lookY: lerp(.85, .5, toss), blink: (t % 4 < .14) ? 1 : 0, tilt: .06, mouth: -8, nod: look * .4 * (1 - toss) }),
    items: () => {
      cashPile(286, 938, 15, .8); moneyJar(600, 968, 0, .58);
      if (toss > .05) { // fırlatılan kartlar: yelpazeden Tilki'nin önüne savrulur, kapalı
        for (let j = 0; j < 5; j++) { const f = ease(cl((toss - j * .04) / .9, 0, 1)), g = take; playCard(lerp(482 + (j - 2) * 14, 340 + (j - 2) * 16, f) - g * 30, lerp(812, 900 + (hash(j) - .5) * 20, f) - Math.sin(f * PI) * 50 + g * 20, lerp((j - 2) * .17, (hash(j + 3) - .5) * 1.2, f), .42, null); }
      }
    } });
};

// ---------- 5) TEZGÂH: sabah, Demir'in dükkânı. Demir tezgâhta tahta zımparalıyor; ışık, talaş ----------
SCENES.tezgah = S => {
  const t = S.t, k = S.k;
  cam(lerp(370, 360, k), lerp(820, 800, k), lerp(1.18, 1.26, ease(k)));
  c.fillStyle = lg(0, -300, 0, 1300, [[0, '#e8d6b4'], [1, '#a88a62']]); c.fillRect(-1000, -300, 2720, 1900);
  // pencere + sabah ışığı
  rr(40, 220, 260, 330, 6, '#5a3a22', OL, 7); c.fillStyle = lg(0, 230, 0, 540, [[0, '#ffe7b0'], [1, '#ffd08a']]); c.fillRect(52, 232, 236, 306); line(170, 232, 170, 538, '#5a3a22', 6); line(52, 385, 288, 385, '#5a3a22', 6);
  c.save(); c.globalCompositeOperation = 'lighter'; poly([60, 240, 290, 240, 760, 1100, 250, 1100], 'rgba(255,220,150,.16)', null); c.restore();
  // raflar ve aletler
  rr(420, 300, 280, 16, 3, '#6a4128', OL, 4); rr(420, 440, 280, 16, 3, '#6a4128', OL, 4);
  for (let i = 0; i < 5; i++) rr(432 + i * 52, 252 - (i % 2) * 14, 36, 48 + (i % 2) * 14, 4, ['#8a5a2a', '#2f4a3a', '#a86a3a', '#5a3a22', '#3a5a7a'][i], OL, 3);
  line(440, 400, 470, 340, '#4a3020', 8); rr(458, 330, 30, 20, 3, '#8a8a90', OL, 3); line(560, 410, 600, 370, '#6a4a2a', 6); ell(604, 366, 10, 6, '#8a8a90', OL, 2);
  // tabela
  line(250, 90, 250, 130, '#3a2410', 4); line(470, 90, 470, 130, '#3a2410', 4); rr(220, 130, 280, 70, 8, '#6a4128', OL, 5);
  c.save(); c.font = '700 26px Cinzel,Georgia,serif'; c.textAlign = 'center'; c.fillStyle = '#f2d590'; c.fillText("DEMİR'İN DÜKKÂNI", 360, 176); c.restore();
  // Demir tezgâhın arkasında, sağ patisiyle zımparalar
  const sand = Math.sin(t * 6), X0 = 380, Y0 = 1130, SC = .62;
  c.save(); c.beginPath(); c.rect(-1000, -300, 2720, 1212); c.clip();
  const pd = demirPose('hope', { t, talk: 0, lookX: .1, lookY: .55, blink: (t % 4 < .14) ? 1 : 0, tilt: .04, mouth: 14, lid: .1,
    L: { x: -120, y: -380, hand: 'relax' }, R: { x: 60 + sand * 60, y: -390, hand: 'relax' } });
  c.save(); c.translate(X0, Y0); c.scale(SC, SC); drawWolf(pd); c.restore();
  c.restore();
  // tezgâh
  rr(-1000, 900, 2720, 34, 4, lg(0, 900, 0, 934, [[0, '#a86a3a'], [1, '#7a4a24']]), OL, 6); c.fillStyle = '#5a3418'; c.fillRect(-1000, 934, 2720, 900);
  for (let x = -1000; x < 1720; x += 120) line(x, 940, x, 1500, 'rgba(0,0,0,.25)', 3);
  rr(250, 876, 280, 26, 4, '#d9a86a', OL, 4); for (let i = 0; i < 4; i++) line(270 + i * 66, 882, 300 + i * 66, 896, 'rgba(120,70,30,.4)', 2);  // tahta
  // talaşlar
  for (let i = 0; i < 14; i++) { const p = (t * .7 + hash(i)) % 1; c.save(); c.globalAlpha = 1 - p; ell(400 + sand * 40 + (hash(i + 1) - .5) * 120, 870 - Math.sin(p * PI) * 60 + p * 30, 6, 3, '#e8c08a', null, hash(i) * 3); c.restore(); }
  dustMotes(t, 26, 60, 200, 600, 700, .5);
};

// ---------- 6) ÇIKIŞ: Demir masadan kalkar, sabah ışığı vuran kapıya yürür. Tilki şaşkın bakar, kartlar masada kalır ----------
SCENES.cikis = S => {
  const t = S.t, k = S.k, walk = ss(.05, .8, k), fade = ss(.78, .92, k), open = ss(0, .15, k);
  cam(lerp(360, 420, ease(k)), lerp(800, 760, k), lerp(1.12, 1.25, ease(k)));
  backRoom(t, { door: open, doorX: 520, lampX: 220 });
  c.save(); c.beginPath(); c.rect(-1000, -300, 2720, 1225); c.clip();
  c.save(); c.translate(120, 1080); c.scale(.55, .55); gangBody('tilki', { t, laugh: 0, lookX: .8, lookY: .1, tilt: -.06, L: { x: -150, y: -300, hand: 'relax' }, R: { x: 160, y: -340, hand: 'relax' } }); c.restore();
  c.restore();
  cardTable(150, 930, 300);
  [[110, -.2, ['2', 'c']], [150, .05, ['7', 'd']], [190, .25, null]].forEach(([x, r, f]) => playCard(x, 945, r, .48, f));
  chipStack(240, 930, 8, '#c8302a', .8);
  // Demir arkadan, kapıya yürür (küçülerek), ışıkta kaybolur
  if (fade < 1) { const dx = lerp(430, 595, walk), dy = lerp(1340, 905, walk), ds = lerp(.66, .3, walk);
    c.save(); c.globalAlpha = 1 - fade; c.translate(dx, dy); c.scale(ds, ds); drawWolfBack({ t, walk: walk > 0 && walk < 1 ? 1 : 0, tilt: Math.sin(t * 3.5) * .02 }); c.restore(); }
  c.save(); c.globalCompositeOperation = 'lighter'; poly([520, 920, 670, 920, 900, 1400, 300, 1400], `rgba(255,220,160,${.12 * open})`, null); c.restore(); // kapıdan yere düşen ışık
};

// kapanış çizimi: oyun kartı (maça as) ve masadan geri çekilmiş sandalye
function cardSketch(k, x, y, s = 1) {
  c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = '#3a2410'; c.lineWidth = 4; c.lineCap = 'round'; c.lineJoin = 'round';
  const seg = (a, b, pts) => { const kk = cl((k - a) / (b - a), 0, 1); if (kk <= 0) return; c.beginPath(); c.moveTo(pts[0], pts[1]); const n = pts.length / 2 - 1, m = kk * n; for (let i = 1; i <= Math.ceil(m); i++) { const f = Math.min(1, m - (i - 1)); c.lineTo(lerp(pts[i * 2 - 2], pts[i * 2], f), lerp(pts[i * 2 - 1], pts[i * 2 + 1], f)); } c.stroke(); };
  seg(0, .35, [-34, -56, 34, -56, 34, 56, -34, 56, -34, -56]);                                   // kart
  const S2 = []; for (let i = 0; i <= 24; i++) { const a = i / 24 * TAU; S2.push(16 * Math.sin(a) ** 3 * .9, (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) * .9 - 6); }
  seg(.35, .6, S2); seg(.58, .66, [0, 2, 6, 18, -6, 18, 0, 2]);                                   // maça
  seg(.66, .82, [60, 56, 60, -10, 100, -10]); seg(.8, .95, [60, 20, 100, 20, 100, 56]);          // geri çekilmiş sandalye
  c.restore();
}
