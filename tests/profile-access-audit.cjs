const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const root = path.resolve(__dirname, '..');
const sourceDir = path.join(root, 'source');
const parts = fs.readdirSync(sourceDir).filter((name) => /^app\.part\d+$/.test(name)).sort();
if (!parts.length) throw new Error('Compressed app source parts were not found.');
const encoded = parts.map((name) => fs.readFileSync(path.join(sourceDir, name), 'utf8')).join('').replace(/\s+/g, '');
const html = zlib.gunzipSync(Buffer.from(encoded, 'base64')).toString('utf8');

const terms = [
  'async function refreshData',
  'function refreshData',
  'function renderUsers',
  'function isAdmin',
  'state.profiles',
  "collection('users')",
  "collection('users').doc("
];
const seen = new Set();
for (const term of terms) {
  let from = 0;
  let count = 0;
  while (count < 3) {
    const index = html.indexOf(term, from);
    if (index < 0) break;
    from = index + term.length;
    const start = Math.max(0, index - 320);
    const end = Math.min(html.length, index + 1150);
    const key = start + ':' + end;
    if (!seen.has(key)) {
      seen.add(key);
      const snippet = html.slice(start, end).replace(/\r/g, '').replace(/\n{3,}/g, '\n\n');
      console.log('\n--- MATCH: ' + term + ' @ ' + index + ' ---\n' + snippet);
    }
    count++;
  }
}
console.log('\nAUDIT_SOURCE_LENGTH=' + html.length);
