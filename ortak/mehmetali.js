// Mehmet Ali: Demir'in babası. Yaşlı kurt; kır tüyler, gür beyaz kaşlar ve bıyık, yarım ay okuma gözlüğü,
// kasket, örgü hırka + ekose gömlek, elinde tespih. Yerel koordinat kurtla aynı (omuz ≈ -540, kafa ≈ -715).
// p: { t, talk, lid, brow, mouth, lookX, lookY, blink, tilt, nod, L, R, seated, sleep (0..1), tespih, back }
const MA_C = { fur: '#b3b8be', furD: '#868c94', white: '#f4f2ee', cardigan: '#6e5a3a', cardiganD: '#4f402a', shirt: '#d9cdb4', check: '#8a5a3a', pants: '#4a3b2e', paw: '#a3a9b1', cap: '#5a4636' };
MOODS.mehmetali = {
  calm: { lid: .3, brow: .05, mouth: 6 }, warm: { lid: .38, brow: -.1, mouth: 14 }, sad: { lid: .42, brow: -.35, mouth: -6 },
  worry: { lid: .25, brow: -.3, mouth: -2 }, happy: { lid: .45, brow: -.15, mouth: 20 }, surprised: { lid: .05, brow: -.25, mouth: 4 },
};
function maArm(side, tgt) {
  const S = [side * 124, -540], j = ik(S[0], S[1], tgt.x, tgt.y, 146, 136, side), fa = Math.atan2(j.wy - j.ey, j.wx - j.ex);
  capsule([S[0], S[1], j.ex, j.ey, j.wx - Math.cos(fa) * 12, j.wy - Math.sin(fa) * 12], 62, MA_C.cardigan, 6);
  c.save(); c.globalAlpha = .25; c.beginPath(); c.moveTo(S[0], S[1]); c.lineTo(j.ex, j.ey); c.lineTo(j.wx, j.wy); c.lineWidth = 40; c.setLineDash([4, 6]); c.strokeStyle = '#2a2014'; c.stroke(); c.restore();
  c.save(); c.translate(j.wx - Math.cos(fa) * 12, j.wy - Math.sin(fa) * 12); c.rotate(fa); rr(-6, -30, 16, 60, 6, MA_C.cardiganD, OL, 4); c.restore();
  c.save(); c.translate(j.wx, j.wy); c.rotate(fa - PI / 2);
  ell(0, 22, 27, 26, MA_C.paw, OL, 5); for (const k of [-11, 0, 11]) curve([k - 4, 36, k, 45, k + 4, 36], 'rgba(60,64,70,.6)', 3);
  c.restore();
  return j;
}
function drawMehmetAli(p) {
  const t = p.t, br = Math.sin(t * 1.8 + 2), sl = p.sleep || 0;
  if (!p.seated) {
    ell(0, 0, 175, 20, 'rgba(0,0,0,.45)', null);
    for (const s of [-1, 1]) {
      poly([s * 22, -292, s * 92, -292, s * 86, -48, s * 30, -48], MA_C.pants, OL, 6); line(s * 58, -280, s * 58, -60, 'rgba(0,0,0,.3)', 3);
      blob([s * 22, -54, s * 94, -56, s * 124, -24, s * 120, -2, s * 22, -2], '#3a2a1e', OL, 6);
    }
  }
  c.save(); c.translate(0, -290); c.scale(1, 1 + br * .006); c.translate(0, 290);
  // gövde: ekose gömlek + açık örgü hırka
  const J = [-60, -586, -126, -560, -150, -512, -144, -400, -132, -300, -138, -262, 0, -256, 138, -262, 132, -300, 144, -400, 150, -512, 126, -560, 60, -586];
  c.beginPath(); smoothPath(J); c.fillStyle = lg(-150, 0, 150, 0, [[0, MA_C.cardiganD], [.3, MA_C.cardigan], [.7, MA_C.cardigan], [1, MA_C.cardiganD]]); c.fill();
  c.save(); c.clip(); c.globalAlpha = .25; for (let y = -590; y < -250; y += 14) for (let x = -160; x < 160; x += 12) curve([x, y, x + 6, y + 8, x + 12, y], '#2a2014', 2); c.restore(); // örgü dokusu
  c.lineWidth = 6; c.strokeStyle = OL; c.stroke();
  c.save(); c.beginPath(); c.moveTo(-52, -588); c.lineTo(52, -588); c.lineTo(40, -258); c.lineTo(-40, -258); c.closePath(); c.fillStyle = MA_C.shirt; c.fill(); c.clip();
  c.globalAlpha = .55; for (let x = -60; x < 60; x += 22) { c.fillStyle = MA_C.check; c.fillRect(x, -600, 7, 360); } for (let y = -590; y < -250; y += 22) c.fillRect(-60, y, 120, 7); c.restore();
  poly([-52, -588, 52, -588, 40, -258, -40, -258], null, OL, 4);
  for (const s of [-1, 1]) { poly([s * 48, -592, s * 6, -566, s * 34, -540], MA_C.shirt, OL, 4); poly([s * 52, -588, s * 96, -540, s * 60, -300, s * 40, -258, s * 44, -560], MA_C.cardiganD, OL, 4); }
  for (const y of [-500, -440, -380, -320]) ell(-52, y, 7, 7, '#d9c7a4', OL, 2);
  c.restore();
  const jl = p.noArms ? null : maArm(-1, p.L || { x: -140, y: -272 }), jr = p.noArms ? { wx: 140, wy: -272 } : maArm(1, p.R || { x: 140, y: -272 });
  if (p.tespih) { // tespih: sağ elden sarkan boncuklar
    for (let i = 0; i < 11; i++) { const a = i / 10, sw = Math.sin(t * 2) * 6; ell(jr.wx - 8 + Math.sin(a * PI) * 18 + sw * a, jr.wy + 30 + a * 70, 6, 6, '#7a2a1e', OL, 2); }
    rr(jr.wx - 6 + Math.sin(t * 2) * 6, jr.wy + 104, 10, 22, 3, '#d9a441', OL, 2);
  }
  // KAFA
  c.save(); c.translate(0, -712 + (p.nod || 0) * 14 + sl * 26); c.rotate((p.tilt || 0) + sl * .22);
  for (const s of [-1, 1]) { blob([s * 50, -108, s * 112, -230, s * 160, -300, s * 200, -170, s * 192, -52], lg(0, -300, 0, -60, [[0, MA_C.furD], [1, MA_C.fur]]), OL, 6, .7);
    blob([s * 84, -116, s * 146, -246, s * 172, -116], '#d8b0b2', null, 0, .7); }
  const HP = [0, -164, 112, -150, 176, -90, 196, 0, 224, 56, 186, 74, 206, 112, 150, 126, 90, 160, 0, 170, -90, 160, -150, 126, -206, 112, -186, 74, -224, 56, -196, 0, -176, -90, -112, -150];
  c.beginPath(); smoothPath(HP, true, .85); c.fillStyle = rg(0, -60, 20, 240, [[0, '#c4c8cd'], [1, MA_C.furD]]); c.fill(); texFill('fur', 1);
  c.save(); c.clip(); blob([-232, 70, -160, 6, -110, -40, -60, -54, -24, -20, 0, 8, 24, -20, 60, -54, 110, -40, 160, 6, 232, 70, 150, 130, 80, 176, 0, 190, -80, 176, -150, 130], MA_C.white, null, 0, .9); c.restore();
  c.beginPath(); smoothPath(HP, true, .85); c.lineWidth = 6; c.strokeStyle = OL; c.stroke();
  // kasket (kulakların arasında)
  blob([-150, -96, -120, -168, 0, -192, 120, -168, 150, -96, 90, -108, 0, -112, -90, -108], lg(0, -190, 0, -96, [[0, '#6e5844'], [1, MA_C.cap]]), OL, 6, .8);
  c.save(); c.beginPath(); smoothPath([-150, -96, -120, -168, 0, -192, 120, -168, 150, -96, 90, -108, 0, -112, -90, -108], true, .8); c.clip(); texFill('tweed', 1); c.restore();
  blob([-150, -100, 0, -116, 150, -100, 160, -78, 0, -88, -160, -78], '#4a3a2c', OL, 5); // siperlik
  ell(0, -186, 8, 6, '#3a2a1e', OL, 3);
  // gözler: kırışık, ağır kapaklı; uykuda kapalı
  const lid = cl((p.lid ?? .3) + (p.blink || 0) * (1 - (p.lid ?? .3)) + sl, 0, 1);
  for (const s of [-1, 1]) {
    const ex = s * 68, ey = -18, px = ex + (p.lookX || 0) * 9, py = ey + 3 + (p.lookY || 0) * 8;
    ell(ex, ey, 34, 30, '#fbfaf6', null);
    c.save(); c.beginPath(); c.ellipse(ex, ey, 34, 30, 0, 0, TAU); c.clip();
    ell(px, py, 22, 24, rg(px - 6, py - 8, 2, 24, [[0, '#d6a25a'], [1, '#7a4a1f']]), null); ell(px, py + 1, 11, 13, '#120a06', null); ell(px - 8, py - 9, 6, 6, '#fff', null);
    const ly = ey - 30 + 60 * lid; c.fillStyle = '#b8bdc3'; c.fillRect(ex - 40, ey - 40, 80, ly - (ey - 40));
    c.restore();
    c.beginPath(); c.moveTo(ex - 36, ey - 30 + 60 * lid); c.quadraticCurveTo(ex, ey - 26 + 60 * lid + 6, ex + 36, ey - 30 + 60 * lid); c.lineWidth = 6; c.strokeStyle = OL; c.stroke();
    ell(ex, ey, 34, 30, null, OL, 4);
    for (const k of [0, 1]) curve([ex - s * 6 - 20, ey + 34 + k * 9, ex - s * 6, ey + 40 + k * 9, ex - s * 6 + 20, ey + 34 + k * 9], 'rgba(90,96,104,.6)', 2.5); // göz altı kırışıkları
    curve([ex + s * 40, ey - 4, ex + s * 52, ey + 2], 'rgba(90,96,104,.6)', 2.5);
    // gür beyaz kaşlar
    const b = p.brow || 0;
    blob([s * 24, -64 + b * 34, s * 70, -82 + b * 10, s * 118, -74 - b * 12, s * 120, -58 - b * 10, s * 70, -64 + b * 8, s * 26, -48 + b * 30], '#f1efea', OL, 4, .7);
  }
  // yarım ay okuma gözlüğü (burnun üstünde, aşağıda)
  for (const s of [-1, 1]) { c.beginPath(); c.moveTo(s * 112, 6); c.quadraticCurveTo(s * 112, 44, s * 68, 44); c.quadraticCurveTo(s * 28, 44, s * 26, 6); c.lineTo(s * 112, 6); c.lineWidth = 5; c.strokeStyle = '#3a2a1e'; c.stroke();
    c.save(); c.globalAlpha = .12; c.fillStyle = '#cfe8ff'; c.fill(); c.restore(); line(s * 112, 8, s * 190, -14, '#3a2a1e', 4); }
  curve([-26, 10, 0, 2, 26, 10], '#3a2a1e', 5);
  // burun, bıyık, ağız
  blob([-26, 52, 26, 52, 18, 74, 0, 82, -18, 74], lg(0, 50, 0, 82, [[0, '#2a2624'], [1, '#0d0b0a']]), OL, 4); ell(-8, 59, 7, 3, 'rgba(255,255,255,.5)', null);
  const tk = p.talk || 0, m = p.mouth || 0;
  if (tk > .05) blob([-22, 104, 0, 100, 22, 104, 14, 112 + tk * 18, 0, 116 + tk * 20, -14, 112 + tk * 18], '#5a1a22', OL, 4);
  else { c.beginPath(); c.moveTo(-30, 106 - m * .3); c.quadraticCurveTo(0, 106 + m, 30, 106 - m * .3); c.lineWidth = 5; c.strokeStyle = OL; c.stroke(); }
  for (const s of [-1, 1]) blob([s * 2, 82, s * 30, 78, s * 60, 88, s * 78, 108, s * 64, 120, s * 40, 112, s * 18, 104, s * 2, 100], lg(0, 78, 0, 120, [[0, '#fbfaf7'], [1, '#d9d6d0']]), OL, 3.5, .9); // gür bıyık
  for (const s of [-1, 1]) ell(s * 118, 68, 22, 11, 'rgba(230,140,150,.28)', null);
  if (sl > .5) { c.save(); c.globalAlpha = (sl - .5) * 2; c.font = 'italic 900 40px Inter,Arial'; c.fillStyle = '#e9dcc5'; c.fillText('z', 150, -160 - Math.sin(t * 2) * 10); c.font = 'italic 900 28px Inter,Arial'; c.fillText('z', 190, -210 - Math.sin(t * 2 + 1) * 10); c.restore(); }
  c.restore();
}
