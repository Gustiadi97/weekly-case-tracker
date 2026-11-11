const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const root = path.resolve(__dirname, '..');
const sourceDir = path.join(root, 'source');
const outputDir = path.join(root, 'public');
const outputPath = path.join(outputDir, 'index.html');

try {
  const parts = fs.readdirSync(sourceDir)
    .filter((name) => /^app\.part\d+$/.test(name))
    .sort();
  if (parts.length === 0) throw new Error('Compressed app source parts were not found.');
  const encoded = parts.map((name) => fs.readFileSync(path.join(sourceDir, name), 'utf8')).join('').replace(/\s+/g, '');
  let html = zlib.gunzipSync(Buffer.from(encoded, 'base64')).toString('utf8');

  // Fix the missing DOM helper used by all inline navigation and action handlers.
  const scriptMarker = '<script>\n// Firebase Web App config';
  if (!html.includes('const $ = (id) => document.getElementById(id);')) {
    if (!html.includes(scriptMarker)) throw new Error('Could not locate the main application script marker.');
    html = html.replace(scriptMarker, '<script>\nconst $ = (id) => document.getElementById(id);\n// Firebase Web App config');
  }

  // Remove demo mode and its seeded sample records: this app always uses Firebase.
  html = html.replace('<button class="btn" onclick="enterDemo()">Lihat preview dengan data demo</button>', '');
  html = html.replace(/function demoSeed\(\)\{[\s\S]*?function toast\(/, 'function toast(');
  html = html.replace(/function enterDemo\(\)\{loadDemo\}\s*/, '');
  html = html.replace(/function enterDemo\(\)\{loadDemo\(\)\}\s*/, '');
  html = html.replace(/let mode='demo'/, "let mode='firebase'");
  html = html.replace(/mode='demo'/g, "mode='firebase'");
  html = html.replace(/if \(new URLSearchParams\(location\.search\)\.get\('demo'\) === '1'\) loadDemo\(\);/g, '');
  html = html.replace('class="pill demo">● DEMO MODE', 'class="pill live">● FIREBASE DATABASE');
  html = html.replace('class="pill demo">● DEMO MODE</span>', 'class="pill live">● FIREBASE DATABASE</span>');
  html = html.replace('Imam (Demo)', 'Pengguna');

  // Apply the requested 60 / 30 / 10 colour system.
  html = html.replace('<meta name="theme-color" content="#c91d78" />', '<meta name="theme-color" content="#5B2A86" />');
  html = html.replace(
    ':root{--pink:#c91d78;--pink-dark:#a91562;--orange:#f28a2e;--ink:#242633;--muted:#777b89;--line:#ececf1;--bg:#f6f6f9;--white:#fff;--green:#16845b;--red:#d84b4b;--amber:#c77b14;--blue:#3977c3;--shadow:0 10px 30px rgba(32,25,48,.07);--radius:17px}',
    ':root{--pink:#5B2A86;--pink-dark:#452064;--orange:#B8F23A;--main:#F6B6CF;--secondary:#5B2A86;--accent:#B8F23A;--ink:#321B43;--muted:#6D5878;--line:#E7A5C2;--bg:#F6B6CF;--white:#FFF8FB;--green:#3F7D42;--red:#A72D4D;--amber:#75510B;--blue:#4B3672;--shadow:0 10px 30px rgba(91,42,134,.12);--radius:17px}'
  );
  html = html.replace('.sidebar{position:fixed;inset:0 auto 0 0;width:252px;background:#fff;', '.sidebar{position:fixed;inset:0 auto 0 0;width:252px;background:var(--main);');
  html = html.replace('.topbar{height:72px;background:#ffffffdb;', '.topbar{height:72px;background:#F6B6CFed;');
  html = html.replace('.card{background:white;border:1px solid var(--line);', '.card{background:#FFF8FB;border:1px solid var(--line);');
  html = html.replace('.btn-primary{background:var(--pink);color:white;border-color:var(--pink);box-shadow:0 5px 12px #c91d7824}', '.btn-primary{background:var(--secondary);color:#fff;border-color:var(--secondary);box-shadow:0 5px 12px #5B2A8624}');
  html = html.replace('.btn-orange{background:var(--orange);border-color:var(--orange);color:#fff}', '.btn-orange{background:var(--accent);border-color:var(--accent);color:#321B43}');
  html = html.replace('.nav button.active{background:#fff0f7;color:var(--pink);box-shadow:inset 3px 0 0 var(--pink)}', '.nav button.active{background:var(--secondary);color:#fff;box-shadow:inset 3px 0 0 var(--accent)}');
  html = html.replace('.nav button:hover{background:#faf2f7;color:var(--pink)}', '.nav button:hover{background:#EAA5C2;color:var(--secondary)}');
  html = html.replace('.brand-mark{width:40px;height:40px;border-radius:13px;background:linear-gradient(140deg,var(--pink),var(--orange));', '.brand-mark{width:40px;height:40px;border-radius:13px;background:var(--secondary);');
  html = html.replace('.login-screen{min-height:100vh;display:grid;place-items:center;padding:20px;background:radial-gradient(circle at 15% 10%,#fde8f2,transparent 35%),radial-gradient(circle at 90% 90%,#fff0df,transparent 35%),#f8f7fa}', '.login-screen{min-height:100vh;display:grid;place-items:center;padding:20px;background:radial-gradient(circle at 15% 10%,#FCE1EB,transparent 35%),radial-gradient(circle at 90% 90%,#DDBCEB,transparent 35%),var(--main)}');
  html = html.replace('.login-card{width:min(440px,100%);background:#fff;', '.login-card{width:min(440px,100%);background:#FFF8FB;');
  html = html.replace('.login-note{background:#fff7ec;border:1px solid #f8e4c9;border-radius:11px;padding:11px;color:#8d5b21;', '.login-note{background:#EEF9D5;border:1px solid #B8F23A;border-radius:11px;padding:11px;color:#452064;');

  // Replace manual bootstrap secret form with a one-time fixed Admin ID setup.
  html = html.replace(
    '<p style="font-size:12px;color:var(--muted)">Akun ini belum memiliki profil. Gunakan formulir ini hanya untuk mengaktifkan Admin pertama dengan kode bootstrap yang disetel saat pemasangan Firebase.</p>',
    '<p style="font-size:12px;color:var(--muted)">Aktivasi satu kali untuk Admin utama. Akun Admin ditetapkan berdasarkan ID yang sudah didaftarkan.</p>'
  );
  html = html.replace(
    '<div class="field span-2"><label>Kode aktivasi Admin *</label><input name="setup_code" type="password" required autocomplete="off" placeholder="Kode bootstrap rahasia"></div>',
    ''
  );
  html = html.replace(
    ",setupCode:String(f.get('setup_code'))",
    ''
  );

  html = require('./firebase-only-patch')(html);
  html = require('./source-form-transform')(html);
  html = require('./ui-enhancements')(html);
  html = require('./design-refresh')(html);
  html = require('./priority-runtime')(html);

  // Guard against shipping the known UI regressions again.
  const uiChecks = [
    ['priority button markup', 'class="wct-priority-choice high"'],
    ['priority value field', 'name="priority"'],
    ['separate priority controller script', 'id="wct-priority-runtime"'],
    ['priority pointer and click handlers', 'document.addEventListener("pointerdown"'],
    ['mobile modal scroll handler', 'function wctApplySingleModalScroll()'],
    ['mobile modal touch fallback', 'wctTouchScrollBody.scrollTop+=delta'],
    ['case editor form', 'function editCaseForm(id)'],
    ['case editor save handler', 'async function saveEditedCase(event)'],
    ['case editor list action', 'onclick="editCaseFormFromButton(this)"'],
    ['mobile case card layout', 'wct-case-mobile-cards'],
    ['design refresh stylesheet', 'id="wct-design-refresh"'],
    ['admin settings option editor', 'function saveEditedCaseOption'],
    ['user profile editor', 'function editUserProfile'],
    ['HUB profile field', 'name="hub_code"']
  ];
  const missingUiChecks = uiChecks.filter(([name, marker]) => !html.includes(marker)).map(([name]) => name);
  if (missingUiChecks.length) {
    throw new Error('UI regression check failed: ' + missingUiChecks.join(', '));
  }
  if (html.includes('type="radio" name="priority"')) {
    throw new Error('UI regression check failed: legacy priority radio markup is still present.');
  }
  if (html.includes('function wctForceMobileModalScroll')) {
    throw new Error('UI regression check failed: obsolete mobile modal scroll handler is still present.');
  }
  if (html.includes('onclick="window.wctSetPriority(&#39;High&#39;,this)') || html.includes('onclick="window.wctSelectPriority(this)')) {
    throw new Error('UI regression check failed: priority still depends on inline JavaScript handlers.');
  }
  if (html.includes('renderUsers,openUserForm,editUserProfile')) {
    throw new Error('UI regression check failed: unsafe openUserForm reference still present.');
  }

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, html);
  console.log('Built ' + path.relative(root, outputPath) + ' (' + html.length + ' bytes)');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exitCode = 1;
}
