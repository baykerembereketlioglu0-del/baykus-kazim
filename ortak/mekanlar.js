// Diyalog mekânları: Kâzım ile Demir'in konuştuğu yerler. story.js'te satıra ya da bölüme place: 'iskele' | 'cati' | 'sokak'
// Karakterler y≈985'te durur (Kâzım x 235, Demir x 490). bg(t) arka planı, fg(t) karakterlerin önündekileri çizer.
const PLACES = {};

// ---------- İSKELE: gece, deniz, ay yansıması, karşı kıyı, geçen vapur ----------
PLACES.iskele = {
  rain: false,
  bg(t) {
    c.fillStyle = lg(0, -300, 0, 640, [[0, '#060a18'], [1, '#1a2240']]); c.fillRect(-500, -500, 1720, 1200);
    for (let i = 0; i < 90; i++) ell(-200 + hash(i) * 1120, -250 + hash(i + 3) * 700, 1.4, 1.4, `rgba(255,255,240,${.25 + .6 * hash(i + 5) * (.6 + .4 * Math.sin(t * 2 + i))})`, null);
    ell(560, 170, 48, 48, '#efe9d4', null); addLight(560, 170, 260, 'rgba(210,220,255,.25)');
    // karşı kıyı: tepeler, kubbeler, ışıklar
    blob([-500, 640, -300, 560, -100, 590, 100, 545, 300, 580, 500, 540, 760, 575, 1220, 560, 1220, 660, -500, 660], '#0c1020', null);
    for (const [x, r] of [[60, 34], [120, 22], [420, 40], [470, 24]]) { ell(x, 590, r, r * .9, '#0c1020', null); line(x, 590 - r, x, 560 - r, '#0c1020', 4); }
    for (const x of [20, 98, 380, 512]) { rr(x - 5, 470, 10, 120, 3, '#0c1020', null); poly([x - 7, 470, x + 7, 470, x, 440], '#0c1020', null); }
    for (let i = 0; i < 70; i++) ell(-300 + hash(i * 3) * 1300, 600 + hash(i + 7) * 50, 2, 2, `rgba(255,200,120,${.4 + .5 * hash(i)})`, null);
    // deniz
    c.fillStyle = lg(0, 640, 0, 900, [[0, '#0b1430'], [1, '#05080f']]); c.fillRect(-500, 640, 1720, 300);
    c.save(); c.globalCompositeOperation = 'lighter';
    for (let k = 0; k < 16; k++) { const y = 650 + k * 14, w = 30 + k * 6, wob = noise1(t * 1.5 + k) * 10; c.fillStyle = `rgba(230,230,210,${.32 * (1 - k / 16)})`; c.fillRect(560 - w / 2 + wob, y, w, 4); }
    for (let i = 0; i < 40; i++) { const y = 660 + hash(i) * 200, x = ((hash(i + 2) * 1400 + t * 20) % 1400) - 300; c.fillStyle = 'rgba(255,200,120,.12)'; c.fillRect(x, y, 30 + hash(i) * 40, 2); }
    c.restore();
    // vapur
    const vx = ((t * 18) % 1400) - 300;
    c.save(); c.translate(vx, 700);
    poly([-150, 0, 150, 0, 130, 36, -130, 36], '#1a1c22', OL, 4); rr(-110, -40, 220, 40, 6, '#e8e2d2', OL, 4); rr(-60, -72, 120, 32, 6, '#e8e2d2', OL, 4); rr(10, -112, 24, 40, 3, '#1a1c22', OL, 3);
    for (let i = 0; i < 8; i++) rr(-100 + i * 26, -30, 14, 14, 2, 'rgba(255,200,110,.95)', null);
    for (let i = 0; i < 4; i++) rr(-48 + i * 26, -64, 14, 14, 2, 'rgba(255,200,110,.95)', null);
    c.save(); c.globalAlpha = .35; for (let i = 0; i < 4; i++) { const p = (t * .3 + i * .25) % 1; ell(22 - p * 60, -120 - p * 120, 12 + p * 30, 10 + p * 24, 'rgba(180,180,190,.5)', null); } c.restore();
    c.restore(); addLight(vx, 680, 220, 'rgba(255,190,110,.25)');
    // korkuluk (karakterlerin arkasında) + iskele zemini
    c.fillStyle = lg(0, 860, 0, 1400, [[0, '#4a3624'], [1, '#2a1c12']]); c.fillRect(-500, 860, 1720, 700);
    for (let y = 870; y < 1400; y += 34) line(-500, y, 1220, y, 'rgba(0,0,0,.35)', 2);
    for (let x = -500; x < 1220; x += 140) line(x, 870, x - 30, 1400, 'rgba(0,0,0,.2)', 2);
    rr(-500, 770, 1720, 14, 4, '#3a2a1c', OL, 4); rr(-500, 820, 1720, 10, 4, '#3a2a1c', OL, 3);
    for (let x = -480; x < 1220; x += 90) rr(x, 770, 14, 96, 3, '#3a2a1c', OL, 3);
    // iskele lambası
    rr(632, 380, 14, 490, 4, '#1a1612', OL, 4); poly([618, 380, 660, 380, 652, 340, 626, 340], '#1a1612', OL, 4); ell(639, 386, 12, 6, '#ffe2a6', null);
    addLight(639, 390, 360, 'rgba(255,190,100,.42)');
    c.save(); c.globalCompositeOperation = 'lighter'; ell(560, 990, 260, 40, rg(560, 990, 0, 260, [[0, 'rgba(255,190,100,.2)'], [1, 'rgba(0,0,0,0)']]), null); c.restore();
  },
  fg(t) { // martılar
    for (let i = 0; i < 3; i++) { const x = ((t * 40 + i * 300) % 1100) - 200, y = 300 + i * 50 + Math.sin(t * 2 + i) * 10, w = Math.sin(t * 8 + i) * 8;
      curve([x - 22, y - w, x - 10, y - 4, x, y], 'rgba(230,230,235,.8)', 3); curve([x, y, x + 10, y - 4, x + 22, y - w], 'rgba(230,230,235,.8)', 3); }
  },
};

// ---------- ÇATI: şafakta şehir manzarası ----------
PLACES.cati = {
  rain: false,
  bg(t) {
    c.fillStyle = lg(0, -300, 0, 820, [[0, '#2a3a6a'], [.45, '#c86a5a'], [.75, '#f2a65a'], [1, '#ffd890']]); c.fillRect(-500, -500, 1720, 1400);
    ell(380, 700, 110, 110, 'rgba(255,236,190,.95)', null); addLight(380, 700, 700, 'rgba(255,190,110,.5)');
    for (let i = 0; i < 6; i++) ell(-100 + i * 180 + Math.sin(t * .1 + i) * 20, 160 + hash(i) * 200, 120, 22, 'rgba(255,200,170,.25)', null);
    // şehir silüeti
    for (let i = 0; i < 16; i++) { const x = -300 + i * 90, h = 150 + hash(i) * 260, w = 70 + hash(i + 3) * 40; rr(x, 820 - h, w, h, 2, `rgba(${60 + hash(i) * 30 | 0},${40 + hash(i) * 20 | 0},${60},.92)`, null);
      for (let j = 0; j < 6; j++) if (hash(i * 9 + j) > .6) rr(x + 10 + (j % 2) * 26, 820 - h + 20 + Math.floor(j / 2) * 40, 12, 16, 1, 'rgba(255,210,140,.6)', null); }
    for (const [x, r] of [[170, 46], [610, 36]]) { ell(x, 690, r, r * .85, 'rgba(70,46,60,.95)', null); rr(x - 4, 640 - r, 8, 30, 2, 'rgba(70,46,60,.95)', null); }
    // kuşlar
    for (let i = 0; i < 5; i++) { const x = ((t * 30 + i * 140) % 900) - 100, y = 260 + i * 30 + Math.sin(t + i) * 8, w = Math.sin(t * 6 + i) * 5; curve([x - 14, y - w, x - 6, y - 3, x, y], '#3a2a30', 3); curve([x, y, x + 6, y - 3, x + 14, y - w], '#3a2a30', 3); }
    // çatı: korkuluk duvarı, baca, su deposu, çamaşır ipi
    c.fillStyle = lg(0, 860, 0, 1400, [[0, '#7a5a4a'], [1, '#3a2a22']]); c.fillRect(-500, 860, 1720, 700);
    for (let y = 880; y < 1400; y += 40) line(-500, y, 1220, y, 'rgba(0,0,0,.25)', 2);
    rr(-500, 800, 1720, 64, 4, '#8a6a58', OL, 5); for (let x = -480; x < 1220; x += 60) line(x, 800, x, 864, 'rgba(0,0,0,.2)', 2);
    rr(-40, 600, 80, 210, 4, '#6a4a3a', OL, 5); rr(-50, 590, 100, 20, 3, '#5a3a2a', OL, 4);
    c.save(); c.globalAlpha = .3; for (let i = 0; i < 3; i++) { const p = (t * .3 + i * .33) % 1; ell(0 + Math.sin(p * 6) * 10, 580 - p * 140, 14 + p * 20, 10 + p * 16, 'rgba(230,220,220,.6)', null); } c.restore();
    rr(600, 560, 140, 150, 10, '#9aa0a8', OL, 5); for (const x of [612, 718]) rr(x, 700, 10, 110, 2, '#5a5a60', OL, 3);
    c.beginPath(); c.moveTo(60, 640); c.quadraticCurveTo(330, 700, 600, 640); c.lineWidth = 2; c.strokeStyle = '#2a2020'; c.stroke();
    for (const [x, col] of [[170, '#c8402a'], [260, '#e8dcc0'], [440, '#3a5a8a']]) { const y = 640 + Math.sin(x / 270 * PI) * 46 * .8; c.save(); c.translate(x, y); c.rotate(Math.sin(t * 1.5 + x) * .06); rr(-24, 0, 48, 60, 4, col, OL, 3); c.restore(); }
  },
};
PLACES.sokak = null; // varsayılan: drawStreet (yağmurlu kıraathane sokağı)
