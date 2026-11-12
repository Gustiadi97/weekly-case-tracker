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
  html = html.replace('<meta name="theme-color" content="#c91d78" />', '<meta name="theme-color" content="#FEA500" />');
  html = html.replace(
    ':root{--pink:#FEA500;--pink-dark:#D98B00;--orange:#FEA500;--ink:#282A31;--muted:#746F65;--line:#EAE2D4;--bg:#FFFAF2;--white:#fff;--green:#16845b;--red:#d84b4b;--amber:#A96A00;--blue:#3977c3;--shadow:0 10px 30px rgba(54,42,20,.08);--radius:18px}',
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
  html = require('./admin-settings-runtime')(html);
  html = require('./picapa-workflow')(html);
  html = require('./case-edit-runtime')(html);
  html = require('./division-breakdown-runtime')(html);
  html = require('./global-redesign')(html);

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
    ['case editor list action', 'data-wct-case-edit-id'],
    ['direct Case editor click handler', 'id="wct-case-edit-runtime"'],
    ['unified Firestore Case save handler', 'window.saveEditedCase=async function(event,explicitForm)'],
    ['Case detail Edit returns through the shared PICAPA editor', 'window.wctPicapaFlow.editReturnToDetail=!!returnToDetail;'],
    ['Division dashboard breakdown', 'id="wct-division-breakdown-runtime"'],
    ['mobile case card layout', 'wct-case-mobile-cards'],
    ['Canonical Division names in form fallbacks', "divisions:['Hub Operations','Gateway','Last Mile','Transport','Facility','Human Capital','GA','Other']"],
    ['Division options v3 fallback normalization', 'const schemaVersion = Number(saved.division_schema_version || 0)'],
    ['Dashboard Division breakdown cards', 'wct-division-breakdown-list'],
    ['Dashboard Division breakdown runtime', 'id="wct-division-breakdown-runtime"'],
    ['Case Edit uses one Firestore save handler', 'window.saveEditedCase=async function(event,explicitForm)'],
    ['Case Edit uses a direct data action', 'data-wct-case-edit-id'],
    ['Case Edit runtime loaded last', 'id="wct-case-edit-runtime"'],
    ['design refresh stylesheet', 'id="wct-design-refresh"'],
    ['global orange UI/UX layer', 'id="wct-global-redesign"'],
    ['admin settings renderer', 'window.wctRenderAdminSettings=open'],

    ['direct Admin Settings action handler', 'window.wctAdminSettingAction=function(action,kind,index)'],
    ['direct Admin Settings form submit handler', 'window.wctAdminSettingsSubmit=function(event,form)'],
    ['Edit button uses explicit global action', 'wctAdminSettingAction(this.dataset.settingsAction,this.dataset.kind,this.dataset.index)'],
    ['Settings forms use explicit submit handler', 'wctAdminSettingsSubmit(event,this)'],
    ['Eight-item operational Division breakdown', "const DEFAULT_DIVISIONS=['Hub Operations','Gateway','Last Mile','Transport','Facility','Human Capital','GA','Other']"],
    ['Division schema v3 migration', 'division_schema_version:3'],
    ['read-time Division v3 normalization', 'const schemaVersion = Number(saved.division_schema_version || 0)'],
    ['One-time Division migration version', 'division_schema_version:3'],
    ['Admin settings sync Case form choices after save', 'state.caseOptions={categories:clean.categories.slice(),divisions:clean.divisions.slice()}'],
    ['Active Case options updated after settings changes', 'state.caseOptions={categories:categories.slice(),divisions:divisions.slice()}'],

    ['admin categories and divisions section', 'wct-settings-grid'],
    ['category/division add form handler', 'data-settings-form="add"'],
    ['category/division edit and delete controls', 'data-settings-action'],
    ['category/division save to Firestore', "collection('app_settings').doc('case_options').set"],
    ['admin settings option editor', 'async function doEdit(form)'],
    ['saved categories loaded from Firestore', 'Array.isArray(saved.categories)?saved.categories.slice()'],
    ['user profile editor', 'function editUserProfile'],
    ['HUB profile field', 'name="hub_code"'],
    ['standalone Admin settings runtime', 'id="wct-admin-settings-runtime"'],
    ['Admin settings page replacement', 'window.renderSettings=open'],
    ['Firestore category/division storage', "collection('app_settings').doc('case_options')"],
    ['settings CRUD delegated handler', 'data-settings-action'],
    ['settings add/edit forms', 'data-settings-form'],
    ['PICAPA workflow runtime', 'id="wct-picapa-workflow"'],
    ['PICAPA editor has a self-contained Case options reader', 'function workflowCaseOptions()'],
    ['PICAPA fallback page renderer prevents script startup failure', 'var wctOriginalFlowShell=function(content)'],
    ['Edit Case uses supported modal renderer', 'openModal(html,true)'],
    ['Edit Case status field defined before render', 'var status='],
    ['Edit Case PIC list sourced from active profiles', 'var reporters=(state.profiles||[])'],
    ['Edit Case reporter PIC datalist', 'wctEditReporterList'],
    ['case event date input', 'name="occurred_on"'],
    ['source Case form event date input', 'data-wct-case-event-date'],
    ['source Case form event date persists to Firestore', "occurred_on:String(f.get('occurred_on')||'')||null"],
    ['list-row Edit Case click interception', 'editCaseFormFromButton\\s*\\(\\s*this\\s*\\)'],
    ['list-row Edit Case handler override', 'window.editCaseFormFromButton=function(button)'],
    ['Edit Case submit capture listener', "form.id!=='wctCaseEditorForm'"],
    ['case occurred date persisted', 'occurred_on:String(f.get(\'occurred_on\')||\'\')||null'],
    ['detail workspace override', 'window.openCaseDetail=async function(id)'],
    ['action editor override', 'window.openActionForm=function(caseId,type,actionId)'],
    ['action save override', 'window.submitAction=async function(event,caseId,type,actionId)'],
    ['progress editor override', 'window.openUpdateForm=function(actionId,logId)'],
    ['progress save and edit override', 'window.submitProgress=async function(event,actionId,logId)'],
    ['progress edit audit collection', 'progress_log_edits'],
    ['refreshed operations dashboard', 'wct-glass-hero'],
    ['event date shown in detail', 'Tanggal Kejadian'],
    ['automatic recorded date shown', 'Tanggal Dicatat'],
    ['dedicated Case edit form', 'id="wctCaseEditorForm"'],
    ['dedicated Case edit save handler', 'window.saveEditedCase=async function(event,explicitForm)'],
    ['Case edit keeps action plans separate', 'Yang sedang diedit: informasi utama Case'],
    ['Case editor mobile modal layout', 'openModal(html,true)'],
    ['Case edit updates only the selected Case document', "fireDb.collection('cases').doc(caseId).update(changes)"],
    ['Case edit save success feedback', 'Perubahan Case berhasil disimpan.'],
    ['desktop and mobile legacy modal interceptor', 'wctDispatchWorkflowClick'],
    ['route old detail clicks into full-page view', 'window.openCaseDetail(detail[1])'],
    ['route Edit Case clicks into full-page editor', "window.editCaseForm(edit[1],edit[2]==='true')"],
    ['route Edit Action clicks into full-page editor', "window.openActionForm(action[1],action[2],action[3]||'')"],
    ['route Update Progress clicks into full-page form', "window.openUpdateForm(progress[1],progress[2]||'')"],
    ['close legacy modal before rendering full page', 'wctCloseLegacyModal();'],
    ['desktop Action cards overflow visible', '.wct-case-detail-page .wct-case-action{overflow:visible!important'],
    ['desktop Action buttons remain visible', '.wct-case-detail-page .wct-case-action-buttons .btn{display:inline-flex!important'],
    ['PICAPA full-page scrolling workspace', 'wct-flow-page'],
    ['Case detail quick navigation', 'wct-flow-subnav'],
    ['Case list return navigation', 'wctReturnToCaseList'],
    ['Action full-page form', 'id="wctActionForm"'],
    ['Progress full-page form', 'id="wctProgressForm"'],
    ['Action edit retains selected Action ID', 'openActionForm=function(caseId,type,actionId)'],
    ['Progress edit retains selected log ID', 'openUpdateForm=function(actionId,logId)'],
    ['Case and Action forms have sticky save footer', 'wct-flow-form-footer'],
    ['Action buttons accessible in full page', 'wct-case-action-buttons'],
    ['Mobile Case workspace grid', '.wct-case-detail-page .wct-case-meta-grid']
  ];
  const missingUiChecks = uiChecks.filter(([name, marker]) => !html.includes(marker)).map(([name]) => name);
  if (missingUiChecks.length) {
    throw new Error('UI regression check failed: ' + missingUiChecks.join(', '));
  }
  // Parse every inline JavaScript block after all source transforms have been applied.
  // This catches syntax regressions that module-level checks cannot see once scripts are
  // concatenated and injected into the generated HTML.
  const inlineScriptPattern = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let inlineScriptMatch;
  let inlineScriptCount = 0;
  let inlineScriptIndex = 0;
  while ((inlineScriptMatch = inlineScriptPattern.exec(html)) !== null) {
    inlineScriptIndex += 1;
    const attributes = inlineScriptMatch[1] || '';
    const source = inlineScriptMatch[2] || '';
    if (/\bsrc\s*=/.test(attributes) || !source.trim()) continue;
    const typeMatch = attributes.match(/\btype\s*=\s*["']([^"']+)["']/i);
    const scriptType = typeMatch ? typeMatch[1].toLowerCase() : 'text/javascript';
    if (!['text/javascript', 'application/javascript'].includes(scriptType)) continue;
    try {
      new Function(source);
      inlineScriptCount += 1;
    } catch (error) {
      const idMatch = attributes.match(/\bid\s*=\s*["']([^"']+)["']/i);
      const label = idMatch ? ' #' + idMatch[1] : ' inline script #' + inlineScriptIndex + ' (' + source.length + ' chars; starts: ' + source.trim().slice(0, 90).replace(/\s+/g, ' ') + '; ends: ' + source.trim().slice(-180).replace(/\s+/g, ' ') + ')';
      throw new Error('Generated JavaScript syntax check failed in' + label + ': ' + error.message);
    }
  }
  if (inlineScriptCount === 0) throw new Error('Generated JavaScript syntax check found no inline scripts.');

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
  if (/\.modal-backdrop\{[^}]*display\s*:\s*flex\s*!important/i.test(html)) {
    throw new Error('UI regression check failed: a hidden modal backdrop is being forced visible.');
  }
  if (/onclick=\"[^\"]*wctSelectPriority/.test(html) || /onclick=\"[^\"]*wctSetPriority/.test(html)) {
    throw new Error('UI regression check failed: priority still uses fragile inline handlers.');
  }
  if (!html.includes('window.wctPriorityRuntimeReady = true;')) {
    throw new Error('UI regression check failed: standalone priority runtime is missing.');
  }
  if (!html.includes('window.wctPicapaWorkflowReady=true;')) {
    throw new Error('UI regression check failed: PICAPA workflow runtime is missing.');
  }

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, html);
  console.log('Built ' + path.relative(root, outputPath) + ' (' + html.length + ' bytes)');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exitCode = 1;
}
