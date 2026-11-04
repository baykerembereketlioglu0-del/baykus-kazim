// Prosedürel fon müziği + yağmur/gök gürültüsü (harici servis gerekmez).
// Kullanım: node muzik.js <süre_sn> <müzik.wav> <yağmur.wav> [tohum]
// Müzik: La minör (Am–F–Dm–E), 66 BPM; yumuşak pad, bas ve kutu-piyano arpejleri.
const fs = require('fs');
const SR = 44100;

function writeWav(file, L, R) {
  const n = L.length, buf = Buffer.alloc(44 + n * 4);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28);
  buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(n * 4, 40);
  let peak = 1e-9; for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
  const g = .89 / peak;
  for (let i = 0; i < n; i++) { buf.writeInt16LE(Math.round(L[i] * g * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(R[i] * g * 32767), 46 + i * 4); }
  fs.writeFileSync(file, buf);
}
function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

function music(dur, seed = 7) {
  const N = Math.ceil(dur * SR), L = new Float32Array(N), R = new Float32Array(N), rnd = rng(seed);
  const hz = m => 440 * Math.pow(2, (m - 69) / 12), TAU = Math.PI * 2;
  const add = (start, len, fn, pan = 0) => {
    const s0 = Math.floor(start * SR), n = Math.min(Math.floor(len * SR), N - s0); if (n <= 0) return;
    const gl = Math.cos((pan + 1) * Math.PI / 4), gr = Math.sin((pan + 1) * Math.PI / 4);
    for (let i = 0; i < n; i++) { const v = fn(i / SR); L[s0 + i] += v * gl; R[s0 + i] += v * gr; }
  };
  const beat = 60 / 66, bar = beat * 4;
  const prog = [[57, 60, 64], [53, 57, 60], [50, 53, 57], [52, 56, 59]], roots = [45, 41, 38, 40];
  for (let b = 0; b * bar < dur; b++) {
    const ch = prog[b % 4], t0 = b * bar;
    for (const [k, m] of ch.entries()) for (const det of [-1, 1]) { // pad: iki hafif akortsuz ses
      const f = hz(m) * (1 + det * .0035), len = bar + 1.4, ph = rnd() * TAU;
      add(t0, len, t => {
        const env = Math.min(1, t / 1.3) * Math.min(1, (len - t) / 1.2);
        let v = 0; for (let h = 1; h <= 5; h++) v += Math.sin(TAU * f * h * t + ph * h) / Math.pow(h, 1.6);
        return v * env * .035 * (1 + .15 * Math.sin(TAU * .2 * t + k));
      }, det * .45);
    }
    for (const bt of [0, 2]) { // bas
      const f = hz(roots[b % 4]);
      add(t0 + bt * beat, 2.2, t => Math.min(1, t / .015) * Math.exp(-t * 1.6) * (Math.sin(TAU * f * t) + .35 * Math.sin(TAU * 2 * f * t)) * .16);
    }
    if (t0 < 2.5) continue; // giriş sakin
    const arp = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[1] + 24, ch[2] + 12, ch[0] + 24, ch[1] + 12, ch[2] + 12];
    arp.forEach((m, i) => { // kutu-piyano arpeji
      if ((b % 2 === 1 && i % 4 === 3) || rnd() < .12) return;
      const f = hz(m), vel = (i % 4 === 0 ? 1 : .7) * (.85 + rnd() * .3);
      add(t0 + i * beat / 2 + (rnd() - .5) * .012, 3, t => {
        const e = Math.min(1, t / .004) * Math.exp(-t * 2.6);
        return (Math.sin(TAU * f * t) * .6 + Math.sin(TAU * 2 * f * t) * .22 * Math.exp(-t * 3) + Math.sin(TAU * 3.01 * f * t) * .08 * Math.exp(-t * 5)) * e * vel * .1;
      }, i % 2 ? .3 : -.3);
    });
  }
  const fade = i => Math.min(1, i / (SR * 2.5)) * Math.min(1, (N - i) / (SR * 3));
  for (let i = 0; i < N; i++) { const f = fade(i); L[i] *= f; R[i] *= f; }
  return [L, R];
}

function rain(dur, seed = 3) {
  const N = Math.ceil(dur * SR), out = [new Float32Array(N), new Float32Array(N)];
  out.forEach((ch, ci) => {
    const r = rng(seed + ci * 101); let b0 = 0, b1 = 0, b2 = 0, hp = 0, prev = 0, brown = 0, drop = 0, dropF = 0, dropPh = 0;
    for (let i = 0; i < N; i++) {
      const w = r() * 2 - 1;
      b0 = .99765 * b0 + w * .099046; b1 = .963 * b1 + w * .2965164; b2 = .57 * b2 + w * 1.0526913;
      const pink = (b0 + b1 + b2 + w * .1848) * .2;
      hp = .985 * (hp + pink - prev); prev = pink;                      // ~100 Hz yüksek geçiren
      let v = hp * .5;
      if (r() < 1 / 900) { drop = .25 + r() * .5; dropF = 1800 + r() * 3500; }  // tek tek damlalar
      if (drop > .001) { dropPh += dropF / SR; v += Math.sin(dropPh * Math.PI * 2) * drop * .12; drop *= .9965; }
      const t = i / SR;                                                  // uzak gök gürültüsü
      brown = .997 * brown + w * .03;
      const th = (t > .3 && t < 5) ? Math.min(1, (t - .3) / .4) * Math.exp(-(t - .7) * .9) : 0;
      v += brown * th * 1.6;
      ch[i] = v * Math.min(1, t / 1.2) * Math.min(1, (dur - t) / 2.5);
    }
  });
  return out;
}

if (require.main === module) {
  const [dur, mOut, rOut, seed] = process.argv.slice(2);
  writeWav(mOut, ...music(+dur, +(seed || 7)));
  writeWav(rOut, ...rain(+dur));
  console.log('Müzik ve yağmur sesi hazır.');
}
module.exports = { music, rain, writeWav };
