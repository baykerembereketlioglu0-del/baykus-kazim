// "Ekip": Demir'e gülen üçlü. Tilki (elebaşı), Ayı (en çok gülen), Kedi (umursamaz).
// Yerel koordinat kurtla aynı: (0,0) ayak arası, omuz y≈-548, kafa merkezi y≈-728.
// p: { t, laugh 0..1, point 0..1 (Tilki işaret eder), tilt, lookX, lookY, bob, seated, back (arkadan görünüş), L/R kol hedefi, walk }
const GANG = {
  tilki: { sw: 128, jacket: '#5b6a39', jacketD: '#3c4824', trim: '#c9652a', sleeve: '#5b6a39', paw: '#2f1c12', pants: '#7a6a4a', shoe: '#efe9dc', sole: '#c9c2b2', fur: '#d9742b', furD: '#a9521b' },
  ayi: { sw: 162, jacket: '#6b6e75', jacketD: '#4b4e55', trim: '#55585f', sleeve: '#6b6e75', paw: '#6a4529', pants: '#56595f', shoe: '#1c1c20', sole: '#e6e2da', fur: '#7d5434', furD: '#5a3a22' },
  kedi: { sw: 120, jacket: '#26262c', jacketD: '#141418', trim: '#5b3a73', sleeve: '#26262c', paw: '#4a4d57', pants: '#1f2028', shoe: '#3a281c', sole: '#22160e', fur: '#525663', furD: '#363944' },
};

function gangArm(G, side, tgt, sw) {
  const S = [side * sw * .95, -548], j = ik(S[0], S[1], tgt.x, tgt.y, 150, 140, side);
  const fa = Math.atan2(j.wy - j.ey, j.wx - j.ex);
  capsule([S[0], S[1], j.ex, j.ey, j.wx - Math.cos(fa) * 14, j.wy - Math.sin(fa) * 14], G === GANG.ayi ? 70 : 58, G.sleeve, 6);
  capsule([j.wx - Math.cos(fa) * 26, j.wy - Math.sin(fa) * 26, j.wx - Math.cos(fa) * 10, j.wy - Math.sin(fa) * 10], G === GANG.ayi ? 66 : 54, G.trim, 5);
  c.save(); c.translate(j.wx, j.wy); c.rotate(fa - PI / 2);
  if (tgt.hand === 'point') { capsule([-6, 20, -6, 78], 17, G.paw, 5); ell(0, 22, 26, 24, G.paw, OL, 5); capsule([18, 10, 28, 30], 13, G.paw, 4); }
  else { ell(0, 22, 27, 26, G.paw, OL, 5); for (const k of [-11, 0, 11]) curve([k - 4, 36, k, 45, k + 4, 36], 'rgba(0,0,0,.45)', 3); }
  c.restore();
}

function gangBody(kind, p) {
  const G = GANG[kind], sw = G.sw, t = p.t;
  if (!p.seated) {
    ell(0, 0, sw + 40, 20, 'rgba(0,0,0,.45)', null);
    for (const s of [-1, 1]) {
      const sw2 = p.walk ? Math.sin(t * 7 + (s > 0 ? PI : 0)) * 14 : 0;
      poly([s * 20, -292, s * (sw * .7), -292, s * (sw * .66) + sw2, -50, s * 26 + sw2, -50], G.pants, OL, 6);
      blob([s * 18 + sw2, -56, s * (sw * .7) + sw2, -58, s * (sw * .7 + 36) + sw2, -24, s * (sw * .7 + 32) + sw2, -2, s * 18 + sw2, -2], G.shoe, OL, 6);
      rr(Math.min(s * 16, s * (sw * .7 + 34)) + sw2, -14, Math.abs(s * (sw * .7 + 34) - s * 16), 12, 5, G.sole, OL, 3);
    }
  }
  c.save(); c.translate(0, p.bob || 0);
  const J = [-sw * .44, -592, -sw, -566, -sw * 1.14, -520, -sw * 1.06, -400, -sw * .98, -300, -sw, -262, 0, -258, sw, -262, sw * .98, -300, sw * 1.06, -400, sw * 1.14, -520, sw, -566, sw * .44, -592];
  const arms = () => { gangArm(G, -1, p.L || { x: -sw - 20, y: -272, hand: 'relax' }, sw); gangArm(G, 1, p.R || { x: sw + 20, y: -272, hand: 'relax' }, sw); };
  if (p.back) arms();
  c.beginPath(); smoothPath(J); c.fillStyle = lg(-sw * 1.2, 0, sw * 1.2, 0, [[0, G.jacketD], [.3, G.jacket], [.7, G.jacket], [1, G.jacketD]]); c.fill(); c.lineWidth = 6; c.strokeStyle = OL; c.stroke();
  if (!p.back) {
    if (kind === 'tilki') { // bomber ceket: beyaz tişört, altın zincir, turuncu yaka ve bel
      poly([-40, -594, 40, -594, 30, -258, -30, -258], '#ece6da', OL, 5);
      c.save(); c.beginPath(); smoothPath(J); c.clip(); c.fillStyle = G.trim; c.fillRect(-200, -290, 400, 34); c.restore();
      for (let i = 0; i < 5; i++) line(-150 + i * 75, -288, -150 + i * 75, -258, 'rgba(0,0,0,.25)', 2);
      c.beginPath(); c.moveTo(-34, -585); c.quadraticCurveTo(0, -500, 34, -585); c.lineWidth = 5; c.strokeStyle = '#e3b54a'; c.stroke(); ell(0, -522, 9, 11, '#e3b54a', OL, 3);
      rr(70, -470, 40, 14, 3, G.jacketD, OL, 3);
    } else if (kind === 'ayi') { // kapüşonlu: ipler + kanguru cebi
      blob([-110, -600, 0, -625, 110, -600, 90, -560, -90, -560], G.jacketD, OL, 5);
      for (const s of [-1, 1]) { line(s * 24, -575, s * 28, -470, '#e6e2da', 5); ell(s * 28, -466, 6, 8, '#e6e2da', OL, 2); }
      c.beginPath(); c.moveTo(-90, -380); c.lineTo(90, -380); c.lineTo(110, -300); c.lineTo(-110, -300); c.closePath(); c.fillStyle = G.jacketD; c.fill(); c.lineWidth = 5; c.strokeStyle = OL; c.stroke();
    } else { // deri ceket + mor balıkçı yaka + fermuar
      rr(-46, -612, 92, 40, 14, G.trim, OL, 5);
      poly([-38, -580, 38, -580, 24, -258, -24, -258], '#3c2a4c', OL, 4);
      for (const s of [-1, 1]) poly([s * 40, -584, s * 110, -560, s * 70, -470, s * 30, -520], '#33333b', OL, 5);
      line(60, -440, 70, -300, '#b9b9c2', 3); c.save(); c.globalAlpha = .25; line(-80, -520, -60, -330, '#fff', 6); c.restore();
    }
    arms();
  }
  c.save(); c.translate(0, -728 + (p.nod || 0) * 10); c.rotate(p.tilt || 0);
  (p.back ? gangHeadBack : GANG_HEADS[kind])(kind, p);
  c.restore();
  c.restore();
}

// ---------- kafalar ----------
function laughEyes(ex, ey, s, w = 34) { c.beginPath(); c.moveTo(ex - w, ey + 6); c.quadraticCurveTo(ex, ey - 22, ex + w, ey + 6); c.lineWidth = 8; c.strokeStyle = OL; c.stroke(); }
function laughMouth(y, w, h, teeth = true) {
  blob([-w, y, 0, y + 4, w, y, w * .7, y + h * .7, 0, y + h, -w * .7, y + h * .7], '#5a1a22', OL, 5);
  if (teeth) { c.save(); c.beginPath(); smoothPath([-w, y, 0, y + 4, w, y, w * .7, y + h * .7, 0, y + h, -w * .7, y + h * .7]); c.clip(); rr(-w, y - 4, w * 2, h * .28, 3, '#f4f0e6', null); ell(0, y + h, w * .5, h * .35, '#d46a78', null); c.restore(); }
}
const GANG_HEADS = {
  tilki(kind, p) {
    const G = GANG.tilki, L = p.laugh || 0;
    for (const s of [-1, 1]) {
      c.save(); c.beginPath(); smoothPath([s * 50, -110, s * 118, -260, s * 150, -330, s * 196, -170, s * 190, -70], true, .6); c.fillStyle = G.fur; c.fill(); c.clip();
      c.fillStyle = '#2b1a10'; c.fillRect(s > 0 ? 100 : -220, -340, 120, 110); blob([s * 90, -110, s * 145, -280, s * 172, -110], '#f1e1c6', null, 0, .6); c.restore();
      c.beginPath(); smoothPath([s * 50, -110, s * 118, -260, s * 150, -330, s * 196, -170, s * 190, -70], true, .6); c.lineWidth = 6; c.strokeStyle = OL; c.stroke();
    }
    const HP = [0, -165, 112, -150, 180, -80, 200, 10, 240, 60, 180, 70, 130, 120, 60, 150, 0, 160, -60, 150, -130, 120, -180, 70, -240, 60, -200, 10, -180, -80, -112, -150];
    c.beginPath(); smoothPath(HP, true, .8); c.fillStyle = rg(0, -60, 20, 240, [[0, '#e8873a'], [1, G.furD]]); c.fill(); texFill('fur', .8);
    c.save(); c.clip(); blob([-250, 50, -150, 10, -70, 40, 0, 70, 70, 40, 150, 10, 250, 50, 150, 130, 60, 175, 0, 180, -60, 175, -150, 130], '#f4ead8', null, 0, .8); c.restore();
    c.beginPath(); smoothPath(HP, true, .8); c.lineWidth = 6; c.strokeStyle = OL; c.stroke();
    for (const s of [-1, 1]) {
      const ex = s * 72, ey = -22;
      if (L > .3) laughEyes(ex, ey, s, 32);
      else {
        c.save(); c.beginPath(); c.ellipse(ex, ey, 40, 22, s * -.12, 0, TAU); c.fillStyle = '#fff6dd'; c.fill(); c.clip();
        ell(ex + (p.lookX || 0) * 12, ey + 2, 18, 20, '#e3a12a', null); ell(ex + (p.lookX || 0) * 12, ey + 2, 5, 15, '#120a06', null); ell(ex + (p.lookX || 0) * 12 - 6, ey - 6, 4, 4, '#fff', null);
        c.fillStyle = G.furD; c.beginPath(); c.moveTo(ex - 50, ey - 30); c.lineTo(ex + 50, ey - 30); c.lineTo(ex + 50, ey - 4 - s * 8); c.lineTo(ex - 50, ey - 4 + s * 8); c.closePath(); c.fill(); c.restore();
        c.beginPath(); c.ellipse(ex, ey, 40, 22, s * -.12, 0, TAU); c.lineWidth = 5; c.strokeStyle = OL; c.stroke();
        line(ex - 44, ey - 4 + s * 8, ex + 44, ey - 4 - s * 8, OL, 6);
      }
      curve([s * 30, -64 - (s > 0 ? 16 : 0), s * 75, -78 - (s > 0 ? 22 : 0), s * 118, -66], '#3a1e0e', 9); // biri havada kaş (kibirli)
    }
    blob([-20, 84, 20, 84, 14, 100, 0, 106, -14, 100], '#120a06', OL, 3); ell(-5, 89, 5, 3, 'rgba(255,255,255,.6)', null);
    if (L > .05) laughMouth(118, 46, 30 + 20 * L);
    else { c.beginPath(); c.moveTo(-34, 124); c.quadraticCurveTo(0, 132, 40, 112); c.lineWidth = 5; c.strokeStyle = OL; c.stroke(); curve([36, 110, 44, 104], OL, 4); }
  },
  ayi(kind, p) {
    const G = GANG.ayi, L = p.laugh || 0;
    for (const s of [-1, 1]) { ell(s * 150, -120, 52, 50, G.fur, OL, 6); ell(s * 150, -116, 28, 26, '#c49a6c', null); }
    c.beginPath(); c.ellipse(0, 0, 215, 190, 0, 0, TAU); c.fillStyle = rg(0, -60, 20, 240, [[0, '#916442'], [1, G.furD]]); c.fill(); texFill('fur', .7); c.lineWidth = 6; c.strokeStyle = OL; c.stroke();
    // bere
    c.save(); c.beginPath(); c.ellipse(0, 0, 215, 190, 0, 0, TAU); c.clip();
    c.fillStyle = '#9e3b2c'; c.fillRect(-230, -220, 460, 140); c.fillStyle = 'rgba(0,0,0,.18)'; for (let x = -220; x < 230; x += 18) c.fillRect(x, -220, 7, 140);
    c.fillStyle = '#7d2c21'; c.fillRect(-230, -104, 460, 34); c.restore();
    line(-200, -104, 200, -104, OL, 5); line(-205, -70, 205, -70, OL, 5);
    ell(0, -205, 26, 22, '#d9cbb5', OL, 4);
    ell(0, 74, 96, 70, '#c9a074', OL, 5);
    for (const s of [-1, 1]) { const ex = s * 76, ey = -10; if (L > .3) laughEyes(ex, ey, s, 22); else { ell(ex, ey, 14, 16, '#120a06', null); ell(ex - 4, ey - 6, 5, 5, '#fff', null); } }
    for (const s of [-1, 1]) ell(s * 130, 54, 26, 14, 'rgba(230,120,110,.35)', null);
    blob([-34, 30, 34, 30, 24, 54, 0, 62, -24, 54], '#120a06', OL, 3); ell(-8, 38, 8, 4, 'rgba(255,255,255,.55)', null);
    if (L > .05) laughMouth(84, 58, 40 + 30 * L); else curve([-30, 96, 0, 106, 30, 96], OL, 5);
  },
  kedi(kind, p) {
    const G = GANG.kedi, L = p.laugh || 0;
    for (const s of [-1, 1]) { blob([s * 40, -120, s * 110, -265, s * 190, -90], G.fur, OL, 6, .5); blob([s * 72, -126, s * 112, -225, s * 160, -110], '#c98f99', null, 0, .5); }
    ell(150, -150, 7, 7, null, '#e3b54a', 4);
    const HP = [0, -160, 120, -145, 190, -60, 205, 20, 240, 55, 190, 80, 140, 130, 0, 165, -140, 130, -190, 80, -240, 55, -205, 20, -190, -60, -120, -145];
    c.beginPath(); smoothPath(HP, true, .8); c.fillStyle = rg(0, -60, 20, 240, [[0, '#626774'], [1, G.furD]]); c.fill(); texFill('fur', .7); c.lineWidth = 6; c.strokeStyle = OL; c.stroke();
    for (const s of [-1, 1]) curve([s * 20, -150, s * 30, -110, s * 22, -80], '#2c2f38', 6);
    ell(0, 82, 80, 56, '#9aa0ad', null);
    for (const s of [-1, 1]) {
      const ex = s * 74, ey = -18;
      if (L > .3) laughEyes(ex, ey, s, 30);
      else {
        c.save(); c.beginPath(); c.ellipse(ex, ey, 40, 30, 0, 0, TAU); c.fillStyle = '#c6e05a'; c.fill(); c.clip();
        ell(ex + (p.lookX || 0) * 10, ey, 6, 24, '#120a06', null); ell(ex - 12, ey - 10, 5, 5, '#fff', null);
        c.fillStyle = G.furD; c.fillRect(ex - 45, ey - 40, 90, 34); c.restore();
        c.beginPath(); c.ellipse(ex, ey, 40, 30, 0, 0, TAU); c.lineWidth = 5; c.strokeStyle = OL; c.stroke(); line(ex - 42, ey - 6, ex + 42, ey - 6, OL, 7);
      }
    }
    poly([-16, 60, 16, 60, 0, 76], '#d98a96', OL, 3);
    for (const s of [-1, 1]) for (const k of [0, 1, 2]) line(s * 60, 88 + k * 12, s * 190, 78 + k * 22, 'rgba(240,240,240,.7)', 2);
    if (L > .05) laughMouth(96, 34, 22 + 16 * L, true);
    else { c.beginPath(); c.moveTo(-28, 98); c.quadraticCurveTo(-10, 106, 0, 96); c.quadraticCurveTo(14, 100, 30, 90); c.lineWidth = 5; c.strokeStyle = OL; c.stroke(); }
  },
};
function gangHeadBack(kind, p) {
  const G = GANG[kind];
  if (kind === 'ayi') { for (const s of [-1, 1]) ell(s * 150, -120, 52, 50, G.fur, OL, 6); ell(0, 0, 215, 190, G.furD, OL, 6); c.save(); c.beginPath(); c.ellipse(0, 0, 215, 190, 0, 0, TAU); c.clip(); c.fillStyle = '#9e3b2c'; c.fillRect(-230, -220, 460, 140); c.restore(); ell(0, -205, 26, 22, '#d9cbb5', OL, 4); return; }
  const tall = kind === 'tilki';
  for (const s of [-1, 1]) blob([s * 50, -110, s * 118, -260, s * (tall ? 150 : 110), tall ? -330 : -265, s * 196, -170, s * 190, -70], G.furD, OL, 6, .6);
  c.beginPath(); smoothPath([0, -165, 120, -150, 190, -60, 210, 40, 150, 130, 0, 165, -150, 130, -210, 40, -190, -60, -120, -150], true, .8);
  c.fillStyle = rg(0, -40, 20, 240, [[0, G.fur], [1, G.furD]]); c.fill(); texFill('fur', .7); c.lineWidth = 6; c.strokeStyle = OL; c.stroke();
}
// Ekipten birinin pençesi (isik ve tohum sahneleri): kol yönü ang (radyan), kapanma 0..1
function gangClaw(kind, x, y, ang, close, sc = 1) {
  const G = GANG[kind];
  c.save(); c.translate(x, y); c.rotate(ang); c.scale(sc, sc);
  capsule([0, 0, 520, 0], 118, G.sleeve, 7);                 // kol
  capsule([30, 0, 70, 0], 124, G.trim, 6);                     // manşet
  ell(-30, 0, 86, 74, G.paw, OL, 6);                          // avuç
  ell(-40, 6, 40, 30, '#5a3a28', null);
  for (let i = 0; i < 4; i++) {
    const a = PI + (i - 1.5) * .42, b = a + close * 1.9 * (1 - i * .06) * (i < 2 ? 1 : -1) * 0 + close * 1.7;
    const x1 = -30 + Math.cos(a) * 62, y1 = Math.sin(a) * 56, x2 = x1 + Math.cos(b) * 70, y2 = y1 + Math.sin(b) * 60;
    capsule([x1, y1, x2, y2], 34, G.paw, 6);
    const ca = Math.atan2(y2 - y1, x2 - x1); poly([x2 + Math.cos(ca + 1.3) * 12, y2 + Math.sin(ca + 1.3) * 12, x2 + Math.cos(ca) * 34, y2 + Math.sin(ca) * 34, x2 + Math.cos(ca - 1.3) * 12, y2 + Math.sin(ca - 1.3) * 12], '#e9dcc2', OL, 3);
  }
  c.restore();
}
