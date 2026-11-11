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
  const html = zlib.gunzipSync(Buffer.from(encoded, 'base64'));
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, html);
  console.log(`Built ${path.relative(root, outputPath)} (${html.length} bytes)`);
} catch (error) {
  console.error('Build failed:', error.message);
  process.exitCode = 1;
}
