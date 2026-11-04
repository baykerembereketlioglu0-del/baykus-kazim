// Bölüm kapağını (bölüm/kapak.html) 1080x1920 JPG/PNG olarak kaydeder.
// Kullanım: node ortak/kapak.js <bölüm-klasörü> [çıktı.jpg]
const { chromium } = require('playwright'), path = require('path'), fs = require('fs');
const dir = path.resolve(process.argv[2]), out = path.resolve(process.argv[3] || path.join(dir, path.basename(dir) + '_kapak.jpg'));
(async () => {
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 540, height: 960 } });
  p.on('pageerror', e => console.error('Sayfa hatası:', e.message));
  await p.goto('file://' + path.join(dir, 'kapak.html')); await p.waitForFunction(() => window.READY === true, null, { timeout: 60000 });
  const d = await p.evaluate(() => document.getElementById('c').toDataURL('image/png'));
  const png = out.replace(/\.jpe?g$/i, '.png'); fs.writeFileSync(png, Buffer.from(d.split(',')[1], 'base64'));
  if (/\.jpe?g$/i.test(out)) { require('child_process').execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', png, '-q:v', '2', out]); fs.unlinkSync(png); }
  await b.close(); console.log('Hazır:', out);
})();
