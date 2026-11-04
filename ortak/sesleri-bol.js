// ElevenLabs sitesinden indirilen iki ses dosyasını (her karakterin tüm replikleri tek dosyada) cümlelere böler.
// Kullanım: node ortak/sesleri-bol.js <bölüm-klasörü> --kazim marcus.mp3 --demir yakup.mp3 [--esik -38] [--bosluk .45]
// Çıktı (bölüm klasörüne): ses/<who>_NN.wav, ses.mp3 (sahneye dizilmiş seslendirme), timeline.js (zamanlama + ağız hareketi)
// Bölme: dosyadaki en uzun N-1 sessizlik, N satırın arasındaki boşluk kabul edilir (metinlerdeki boş satırlar).
const fs = require('fs'), path = require('path');
const { execFileSync } = require('child_process');

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const EP_DIR = path.resolve(args[0]);
const EP = require(path.join(EP_DIR, 'story.js')), STORY = EP.story;
const SRC = { kazim: opt('kazim'), demir: opt('demir') };
const TH = opt('esik', '-38'), GAP = +opt('bosluk', .45), RATE = 50, SR = 16000;
const OUT = path.join(EP_DIR, 'ses'); fs.mkdirSync(OUT, { recursive: true });

const ff = a => execFileSync('ffmpeg', ['-hide_banner', '-nostats', ...a], { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 28 });
const dur = f => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());
function silences(f) {
  let log = ''; try { log = execFileSync('ffmpeg', ['-hide_banner', '-nostats', '-i', f, '-af', `silencedetect=noise=${TH}dB:d=0.18`, '-f', 'null', '-'], { stdio: ['ignore', 'pipe', 'pipe'] }).toString(); } catch (e) { log = String(e.stderr || ''); }
  if (!log.includes('silence_')) log = execFileSync('sh', ['-c', `ffmpeg -hide_banner -nostats -i "${f}" -af silencedetect=noise=${TH}dB:d=0.18 -f null - 2>&1`]).toString();
  const out = []; let s = null;
  for (const m of log.matchAll(/silence_(start|end): ([\d.]+)/g)) { if (m[1] === 'start') s = +m[2]; else if (s !== null) { out.push([s, +m[2]]); s = null; } }
  if (s !== null) out.push([s, dur(f)]);
  return out;
}
function pcm(f, a, b) { // mono 16 kHz float örnekleri
  const raw = ff(['-ss', String(a), '-to', String(b), '-i', f, '-ac', '1', '-ar', String(SR), '-f', 's16le', '-']);
  const n = raw.length / 2, x = new Float32Array(n); for (let i = 0; i < n; i++) x[i] = raw.readInt16LE(i * 2) / 32768; return x;
}

const timeline = [], parts = {};
for (const who of ['kazim', 'demir']) {
  const lines = STORY.map((l, i) => [l, i]).filter(([l]) => l.who === who); if (!lines.length) continue;
  if (!SRC[who]) { console.error(`--${who} dosyası verilmedi`); process.exit(1); }
  const f = path.resolve(SRC[who]), D = dur(f), sil = silences(f);
  const lead = sil.length && sil[0][0] < .05 ? sil[0][1] : 0, tail = sil.length && sil[sil.length - 1][1] > D - .05 ? sil[sil.length - 1][0] : D;
  const inner = sil.filter(([a, b]) => a > lead + .05 && b < tail - .05);
  const need = lines.length - 1;
  if (inner.length < need) { console.error(`${who}: ${lines.length} replik bekleniyordu ama yalnızca ${inner.length + 1} parça bulundu. --esik değerini artırmayı dene (ör. -32).`); process.exit(1); }
  // Kesim noktaları: her parçanın süresi, satırın harf sayısıyla orantılı olmalı (dinamik programlama).
  // Paragraf arası ile cümle içi duraklama benzer uzunlukta olabildiği için yalnızca "en uzun sessizlik" yetmez.
  const chars = lines.map(([l]) => l.text.replace(/[^\p{L}\p{N}]/gu, '').length + 4), tc = chars.reduce((x, y) => x + y, 0);
  const span = tail - lead, exp = chars.map(n => n / tc * span), C = inner.length;
  const segCost = (a0, b0, j) => { const d = Math.max(.05, b0 - a0); return Math.log(d / exp[j]) ** 2; };
  const bonus = g => -.6 * Math.min(g, 1.2); // uzun sessizlikte kesmeyi biraz tercih et
  const dp = Array.from({ length: need }, () => new Array(C).fill(Infinity)), from = Array.from({ length: need }, () => new Array(C).fill(-1));
  for (let c = 0; c < C; c++) dp[0][c] = segCost(lead, inner[c][0], 0) + bonus(inner[c][1] - inner[c][0]);
  for (let j = 1; j < need; j++) for (let c = j; c < C; c++) for (let q = j - 1; q < c; q++) {
    const v = dp[j - 1][q] + segCost(inner[q][1], inner[c][0], j) + bonus(inner[c][1] - inner[c][0]);
    if (v < dp[j][c]) { dp[j][c] = v; from[j][c] = q; }
  }
  let best = -1, bv = Infinity;
  for (let c = need - 1; c < C; c++) { const v = (need ? dp[need - 1][c] : 0) + segCost(inner[c][1], tail, need); if (v < bv) { bv = v; best = c; } }
  const idxs = []; for (let j = need - 1, c = best; j >= 0; c = from[j][c], j--) idxs.unshift(c);
  const cuts = need ? idxs.map(c => inner[c]) : [];
  const segs = []; let a = lead;
  for (const [s, e] of cuts) { segs.push([a, s]); a = e; } segs.push([a, tail]);
  console.log(`${who}: ${path.basename(f)} → ${segs.length} parça (en kısa ara ${(Math.min(...cuts.map(([s, e]) => e - s)) || 0).toFixed(2)} sn)`);
  segs.forEach(([s, e], j) => {
    const [l, i] = lines[j], s0 = Math.max(0, s - .04), e0 = Math.min(D, e + .08), wav = path.join(OUT, `${who}_${String(j + 1).padStart(2, '0')}.wav`);
    ff(['-y', '-ss', String(s0), '-to', String(e0), '-i', f, '-ac', '1', '-ar', '44100', wav]);
    // ağız hareketi zarfı (RMS, 50 Hz)
    const x = pcm(f, s0, e0), win = SR / RATE, env = [];
    for (let k = 0; k + win <= x.length; k += win) { let q = 0; for (let m = 0; m < win; m++) q += x[k + m] * x[k + m]; env.push(Math.sqrt(q / win)); }
    parts[i] = { wav, len: e0 - s0, env, x };
    console.log(`  ${String(i + 1).padStart(2)}. ${(e0 - s0).toFixed(2)} sn  ${l.text}`);
  });
}
// zarfları karakter bazında normalleştir
for (const who of ['kazim', 'demir']) {
  const all = Object.entries(parts).filter(([i]) => STORY[i].who === who).flatMap(([, p]) => p.env).sort((a, b) => a - b);
  const ref = all[Math.floor(all.length * .95)] || 1;
  for (const [i, p] of Object.entries(parts)) if (STORY[i].who === who) p.env = p.env.map((v, k, arr) => { const sm = (v + (arr[k - 1] ?? v) + (arr[k + 1] ?? v)) / 3; return +Math.min(1, Math.max(0, (sm / ref - .08) / .92)).toFixed(3); });
}
// sahneye diz: satır satır, araya boşluk
let t = EP.intro ?? .5; const ins = [];
STORY.forEach((l, i) => {
  const p = parts[i], start = t, end = t + p.len;
  // kelime zamanları: konuşulan kısımları (zarf > eşik) harf sayısına göre paylaştır
  const ws = l.text.split(/\s+/), voiced = p.env.map(v => v > .12), vt = voiced.reduce((a, b) => a + b, 0) || 1;
  const weights = ws.map(w => w.replace(/[^\p{L}\p{N}]/gu, '').length + 1), wt = weights.reduce((a, b) => a + b, 0);
  const words = []; let acc = 0, k = 0, cnt = 0;
  const timeOfVoiced = target => { while (k < voiced.length && cnt < target) { if (voiced[k]) cnt++; k++; } return k / RATE; };
  ws.forEach((w, j) => { const a = timeOfVoiced(acc / wt * vt); acc += weights[j]; const b = timeOfVoiced(acc / wt * vt); words.push([w, +(start + a).toFixed(3), +(start + Math.max(b, a + .12)).toFixed(3)]); });
  timeline.push({ start: +start.toFixed(3), end: +end.toFixed(3), words, env: p.env, envRate: RATE });
  ins.push({ f: p.wav, ms: Math.round(start * 1000) });
  t = end + (l.pause ?? GAP);
});
const a = ['-y']; ins.forEach(x => a.push('-i', x.f));
const fc = ins.map((x, i) => `[${i}:a]adelay=${x.ms}:all=1[a${i}]`).join(';') + ';' + ins.map((_, i) => `[a${i}]`).join('') + `amix=inputs=${ins.length}:normalize=0[out]`;
ff([...a, '-filter_complex', fc, '-map', '[out]', '-b:a', '256k', path.join(EP_DIR, 'ses.mp3')]);
fs.writeFileSync(path.join(EP_DIR, 'timeline.js'), 'window.TIMELINE=' + JSON.stringify({ lines: timeline }) + ';');
console.log(`Hazır: ses.mp3 + timeline.js (konuşma ${t.toFixed(1)} sn + kapanış). Şimdi: node ortak/kaydet.js ${path.basename(EP_DIR)}`);
