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

  // Firebase backend transform intentionally removed; Supabase is the only runtime backend.
  html = require('./source-form-transform')(html);
  html = require('./ui-enhancements')(html);
  html = require('./design-refresh')(html);
  html = require('./priority-runtime')(html);
  html = require('./admin-settings-runtime')(html);
  html = require('./picapa-workflow')(html);
  html = require('./case-edit-runtime')(html);
  html = require('./division-breakdown-runtime')(html);
  html = require('./global-redesign')(html);
  html = require('./supabase-only-patch')(html);
  html = require('./icon-system')(html);
  html = require('./workspace-modules')(html);
  html = require('./modal-controls')(html);
  html = require('./picapa-modal-polish')(html);
  html = require('./appearance-mode')(html);
  html = require('./meeting-edit')(html);
  html = require('./weekly-meeting-enhancements')(html);
  html = require('./case-draft-autosave')(html);
  html = require('./saving-state')(html);
  html = require('./weekly-meeting-delete')(html);
  html = require('./weekly-meeting-items')(html);
  html = require('./action-crud-override')(html);
  html = require('./ui-consistency')(html);




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
    ['Unified SVG icon system', 'id="wct-icon-system"'],
    ['Icon observer ready marker', 'window.WCTIconSystemReady=true;'],
    ['Tasks, Team, Calendar and Analytics modules', 'id="wct-workspace-modules"'],
    ['Reliable X / Cancel / Close modal controls', 'id="wct-modal-controls"'],
    ['PICAPA modal visual polish stylesheet', 'id="wct-picapa-modal-polish-style"'],
    ['PICAPA modal runtime classifier', 'id="wct-picapa-modal-polish"'],
    ['Global appearance mode stylesheet', 'id="wct-appearance-mode-style"'],
    ['Global appearance mode toggle runtime', 'id="wct-appearance-mode"'],
    ['Dark mode KPI values use readable foreground contrast', 'color:#F4F7FA!important'],
    ['Dark mode Case table cells use dark surfaces', 'background:#151F2B!important;color:#DCE5EE!important'],
    ['Dark mode Tasks board columns are covered', '.wct-kanban-col'],
    ['Dark mode Calendar dates are covered', '.wct-calendar-day'],
    ['Dark mode empty states are covered', '.empty-state'],
    ['Appearance mode preference is persisted', 'wctAppearanceMode'],
    ['Dark mode secondary brand colour is orange', '--secondary:#FEA500'],
    ['Weekly Meeting edit form runtime', 'id="wct-meeting-edit-runtime"'],
    ['Weekly Meeting history has an edit action', 'data-wct-meeting-edit'],
    ['Weekly Meeting updates the existing record', "fireDb.collection('meetings').doc(id).update(updated)"],
    ['Weekly Meeting preserves original creator and creation time', 'created_at:meeting.created_at||new Date().toISOString()'],
    ['Weekly Meeting draft autosave runtime', 'id="wct-weekly-meeting-enhancements-runtime"'],
    ['Weekly Meeting draft persistence is user-scoped', 'wctWeeklyMeetingDraft:v1:'],
    ['Weekly Meeting form restores saved values', 'function restoreValues(form,values)'],
    ['Weekly Meeting HUB selection is included in new meeting saves', "hub_code:String(data.get('hub_code')||'')"],
    ['Case draft autosave runtime', 'id="wct-case-draft-runtime"'],
    ['Animated database save feedback runtime', 'id="wct-saving-state-runtime"'],
    ['Animated save spinner and progress indicator', 'wct-save-progress-track'],
    ['Case draft status indicator', 'wct-case-draft-notice'],
    ['Case draft restores data after reopening', 'function restore(form,draft)'],
    ['Case draft is scoped to the signed-in user', 'wctCaseDraft:v1:'],
    ['Case draft has explicit post-save cleanup', 'window.WCTCaseDraft={'],
    ['Case draft cleanup cancels pending autosave timer', 'if(saveTimer){clearTimeout(saveTimer);saveTimer=null;}'],
    ['Weekly Meeting draft cleanup cancels pending autosave timer', 'if(timer){clearTimeout(timer);timer=null;}'],
    ['Deferred database save handlers are wrapped after page load', "window.addEventListener('load',function()"],
    ['Weekly Meeting edit save has a loading handler', 'submitMeetingEdit'],
    ['Case draft clears only after a new Case is detected', 'verifySaved(before,0)'],
    ['Update Progress modal styling', '#modal.wct-modal-progress .modal-body'],
    ['Preventive and Corrective Action modal styling', '#modal.wct-modal-action .modal-body'],
    ['Edit Action direct form layout', '#modal:has(form[onsubmit*="submitAction"])>form'],
    ['Edit Action readable input surface', '#modal:has(form[onsubmit*="submitAction"]) .field input'],
    ['Edit Action mobile one-column layout', '#modal:has(form[onsubmit*="submitAction"]) .form-grid{grid-template-columns:minmax(0,1fr)!important;gap:13px!important}'],
    ['Case Detail modal styling', '#modal.wct-case-detail-modal .modal-body.wct-case-detail'],
    ['Corrective and Preventive Action have separate table groups', 'wct-action-table-group'],
    ['Corrective Action table is rendered', "actionTable('corrective','Corrective Action','CA')"],
    ['Preventive Action table is rendered', "actionTable('preventive','Preventive Action','PA')"],
    ['Action table preserves Edit Action control', 'wct-action-row-edit'],
    ['Action table preserves Update Progress control', 'wct-action-row-update'],
    ['Action table adds a delete icon for coordinators', 'wct-action-row-delete'],
    ['Action deletion calls the secured Supabase RPC', "window.wctSupabase.rpc('wct_delete_action',{p_action_id:actionId})"],
    ['Action delete has accessible tooltip and label', 'aria-label'],
    ['Action delete confirmation awaits the custom in-app dialog', 'await window.wctConfirmDeleteAction(action.title)'],
    ['Action delete refreshes Case detail after success', "window.openCaseDetail(action.case_id)"],
    ['Action table supports compact horizontal scrolling on small screens', 'wct-action-table-scroll'],
    ['Action table controls are compact icon-only buttons', 'wct-action-icon-btn'],
    ['Delete icon uses a dedicated danger style', 'wct-action-row-delete:hover'],
    ['Action deletion uses the branded in-app modal overlay', '.wct-action-delete-overlay'],
    ['Action deletion confirmation is accessible as an alert dialog', 'aria-modal'],
    ['Action deletion confirmation has dedicated Cancel and Confirm buttons', 'wct-action-delete-confirm'],
    ['Action deletion confirmation supports dark appearance', '[data-wct-appearance'],
    ['Weekly Meeting history delete runtime is included', 'id="wct-weekly-meeting-delete-runtime"'],
    ['Structured Weekly Meeting points runtime is included', 'id="wct-weekly-meeting-items-runtime"'],
    ['Weekly Meeting supports multiple discussion points', 'data-wct-add-meeting-point'],
    ['Weekly Meeting add-point control has a direct audited handler', 'onclick="return wctAddMeetingPoint(this)"'],
    ['Weekly Meeting point can become a Case or Project', 'new_case'],
    ['Weekly Meeting detail renders each point independently', 'wct-meeting-detail-point'],
    ['Weekly Meeting edit uses a unique structured action route', 'data-wct-structured-edit'],
    ['Weekly Meeting submit uses a synchronous preventDefault wrapper', 'onsubmit="return wctSubmitMeeting(event)"'],
    ['Async Weekly Meeting saves cannot trigger native form navigation', 'window.wctSubmitMeeting=function(event)'],
    ['Weekly Meeting protects against stale asynchronous edit loads', 'editLoadVersion'],
    ['Weekly Meeting saves points through role-checked RPC', 'wct_save_meeting_with_items'],
    ['Weekly Meeting delete RPC handler is exposed', 'window.deleteMeeting=async function(id,button)'],
    ['Weekly Meeting delete popup uses app controls, not browser confirm', 'wctCancelWeeklyMeetingDelete()'],
    ['Action CRUD final override is included', 'id="wct-action-crud-runtime"'],
    ['Action CRUD final handler uses secure RPC', 'wct_save_action'],
    ['Action CRUD requires Admin/Coordinator', 'window.submitAction=submitActionSecure'],
    ['Dark mode uses readable form control palette', '#1B2937!important;color:#F0F4F8!important'],
    ['Dark mode Case Detail hero avoids white background', '#modal.wct-case-detail-modal .wct-case-detail-hero'],
    ['Dark mode Weekly checklist case names use bright text', '#modal #wctMeetingEditForm .wct-meeting-edit-case b'],
    ['Weekly Meeting history has an in-app confirmation dialog', 'wct-weekly-delete-title'],
    ['Weekly Meeting history delete invokes secured RPC', 'wct_delete_meeting'],
    ['Weekly Meeting history has icon-only delete control', 'wct-meeting-delete-icon'],
    ['Weekly Meeting detail has a delete action control', 'data-wct-meeting-delete'],
    ['Weekly Meeting delete confirmation has Cancel and Confirm handlers', 'wctAcceptWeeklyMeetingDelete()'],
    ['Final UI consistency stylesheet is loaded', 'id="wct-ui-consistency-style"'],
    ['Final UI layer sets a softer charcoal dark canvas', '--wct-ui-canvas:#17212D'],
    ['Dark mode Weekly Meeting checklist text remains readable', '#modal #wctMeetingEditForm .wct-meeting-edit-case b'],
    ['Dark mode Case Detail sections use dark surfaces', '#modal.wct-case-detail-modal .wct-case-section'],
    ['Dark mode Case Action tables use dark surfaces', '#modal.wct-case-detail-modal .wct-action-table-group'],
    ['Light mode modal fields keep white surfaces', 'background:#FFFFFF!important;color:#20344B!important'],
    ['Dark mode modal fields keep readable foreground contrast', 'background:#1B2937!important;color:#F0F4F8!important'],

    ['Case Monitoring progress uses the average of related Actions', 'function wctCaseActionProgress(caseId)'],
    ['Case Monitoring progress displays the calculated Action average', 'wctCaseActionProgress(c.id)'],
    ['Completed Actions count as 100 percent progress', "String(action.status||'').toLowerCase()==='done'"],
    ['Case Detail progress uses the same related Action calculation', 'actionProgressValue(action)'],
    ['Case Detail modal has a single vertical scroll body', 'overflow-x:hidden!important;overflow-y:auto!important;'],
    ['Case Detail hero keeps its title and progress ring visible', 'min-height:160px!important;'],

    ['Visible error feedback above modal backdrop', 'id="wct-modal-feedback-style"'],
    ['Inline Case form error styling', '.wct-form-error{'],
    ['Modal close handles pointer, touch and click', "document.addEventListener('pointerup',activateCloseControl,true)"],
    ['Modal controls normalise cancel buttons to type button', "button.type='button'"],
    ['Modal close clears temporary inline backdrop styles', 'resetMobileModalLayout();'],
    ['Modal close removes inline flex from mobile backdrop', "removeInlineProperties(layer,'position inset height max-height box-sizing display"],
    ['Modal close handles touchend and composed path', 'event.composedPath'],
    ['Escape key closes open modal', "if(event.key!=='Escape')return;"],
    ['Kanban four workflow columns', "var cols=[['open','To Do'],['in_progress','In Progress'],['review','In Review'],['done','Done']]"],
    ['Reference dashboard KPI cards', 'wct-workspace-kpis'],
    ['No Time Tracker module', 'Project Progress'],
    ['Admin Case settings renderer', 'window.wctRenderAdminSettings=open;'],
    ['Admin Settings click routing restored', 'window.wctRenderAdminSettings();'],
    ['Admin Settings refreshes current user profile', 'currentProfile=await getCurrentProfile();'],
    ['Admin Settings prevents duplicate render requests', 'let openingPromise=null;'],
    ['Strict workspace active navigation', 'function setWorkspaceBreadcrumb(label)'],
    ['Login form refinement', 'id="wct-login-form-refresh"'],
    ['Navy-blue navigation icon style', '.wct-nav-icon svg{width:18px;height:18px}'],
    ['global orange UI/UX layer', 'id="wct-global-redesign"'],
    ['admin settings renderer', 'window.wctRenderAdminSettings=open'],
    ['self-service password settings form', 'data-account-password'],
    ['all roles receive the password settings card', 'root.innerHTML=\'<div class="page-head"><div><div class="eyebrow">PENGATURAN AKUN'],
    ['Case detail renders before audit query resolves', 'renderDetail(id,[]);'],
    ['Case edit audit query runs asynchronously', 'void (async function(){'],
    ['redesigned KPI cards', '.kpis .kpi:nth-child(4)'],
    ['mobile KPI layout', '.kpis .kpi{min-height:122px'],
    ['Case Detail modal uses a single scrollable body', '.modal.wct-case-detail-modal>.modal-body.wct-case-detail{'],
    ['Case Detail sections use dark surfaces', '.modal.wct-case-detail-modal .wct-case-section{'],
    ['Case Detail Action buttons remain visible and clickable', '.modal.wct-case-detail-modal .wct-case-action-buttons .btn,'],
    ['Case Detail modal mobile breakpoint', '@media(max-width:760px){'],
    ['Case Detail modal mobile selector', '.modal.wct-case-detail-modal{'],
    ['mobile Dashboard panels stack into one column', '#pageContent .wct-dashboard-columns,'],
    ['mobile Dashboard case rows keep horizontal text flow', '.wct-dashboard-case-row>div:first-child strong{'],
    ['mobile Case list cards use dark surfaces', '#pageContent .wct-cases-table tbody tr{'],
    ['mobile Case list rows remove white cell backgrounds', '#pageContent .wct-cases-table tbody td{'],
    ['mobile Case list action row remains visible', '#pageContent .wct-cases-table tbody td:nth-child(9){'],




    ['direct Admin Settings action handler', 'window.wctAdminSettingAction=function(action,kind,index)'],
    ['direct Admin Settings form submit handler', 'window.wctAdminSettingsSubmit=function(event,form)'],
    ['Edit button uses explicit global action', 'wctAdminSettingAction(this.dataset.settingsAction,this.dataset.kind,this.dataset.index)'],
    ['Settings forms use explicit submit handler', 'wctAdminSettingsSubmit(event,this)'],
    ['Eight-item operational Division breakdown', "const DEFAULT_DIVISIONS=['Hub Operations','Gateway','Last Mile','Transport','Facility','Human Capital','GA','Other']"],
    ['Supabase category and division options loader', "client.from('wct_app_settings').select('setting_value')"],
    ['Admin settings sync Case form choices after save', 'state.caseOptions={categories:clean.categories.slice(),divisions:clean.divisions.slice()}'],
    ['Active Case options updated after settings changes', 'state.caseOptions={categories:categories.slice(),divisions:divisions.slice()}'],

    ['admin categories and divisions section', 'wct-settings-grid'],
    ['category/division add form handler', 'data-settings-form="add"'],
    ['category/division edit and delete controls', 'data-settings-action'],
    ['category/division save to Supabase', "window.saveCaseOptions(clean)"],
    ['admin settings option editor', 'async function doEdit(form)'],
    ['saved categories loaded from Firestore', 'Array.isArray(saved.categories)?saved.categories.slice()'],
    ['user profile editor', 'function editUserProfile'],
    ['HUB profile field', 'name="hub_code"'],
    ['standalone Admin settings runtime', 'id="wct-admin-settings-runtime"'],
    ['Admin settings page replacement', 'window.renderSettings=open'],
    ['Supabase category/division storage', "wct_app_settings"],
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
    ['fast Case detail renderer', 'window.openCaseDetail=function(id)'],
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
    ['route old detail clicks into responsive Case detail', 'window.openCaseDetail(detail[1])'],
    ['route Edit Case clicks into full-page editor', "window.editCaseForm(edit[1],edit[2]==='true')"],
    ['route Edit Action clicks into full-page editor', "window.openActionForm(action[1],action[2],action[3]||'')"],
    ['route Update Progress clicks into full-page form', "window.openUpdateForm(progress[1],progress[2]||'')"],
    ['close legacy modal before rendering Case detail or form', 'wctCloseLegacyModal();'],
    ['desktop Action cards overflow visible', '.wct-case-detail-page .wct-case-action{overflow:visible!important'],
    ['desktop Action buttons remain visible', '.wct-case-detail-page .wct-case-action-buttons .btn{display:inline-flex!important'],
    ['PICAPA full-page scrolling workspace', 'wct-flow-page'],
    ['Case detail quick navigation', 'wct-flow-subnav'],
    ['Case list return navigation', 'wctReturnToCaseList'],
    ['Case list return helper is defined', 'function flowShowList()'],
    ['Action and Progress forms have a modal shell', 'function flowFormShell(caseId,title,subtitle,formHtml)'],
    ['Edit Case cancel handler is defined', 'window.wctCancelCaseEdit=function()'],
    ['Edit Case cancel has delegated click support', 'data-wct-case-edit-cancel'],
    ['Case detail first paints from local state', 'renderDetail(id,[]);'],
    ['Case detail audit query runs after first paint', "progress_log_edits').where('case_id','==',id).get()"],
    ['Action mutations do not refetch all Firestore collections', 'closeModal();window.openCaseDetail(caseId);'],
    ['Progress mutations do not refetch all Firestore collections', 'closeModal();window.openCaseDetail(a.case_id);'],

    ['Action full-page form', 'id="wctActionForm"'],
    ['Progress full-page form', 'id="wctProgressForm"'],
    ['Action edit retains selected Action ID', 'openActionForm=function(caseId,type,actionId)'],
    ['Progress edit retains selected log ID', 'openUpdateForm=function(actionId,logId)'],
    ['Case and Action forms have sticky save footer', 'wct-flow-form-footer'],
    ['Action buttons accessible in full page', 'wct-case-action-buttons'],
    ['Mobile Case workspace grid', '.wct-case-detail-page .wct-case-meta-grid']
  ];
  const picapaWorkflowSource = fs.readFileSync(path.join(__dirname, 'picapa-workflow.js'), 'utf8');
  if (picapaWorkflowSource.includes('window.confirm(')) {
    throw new Error('UI regression check failed: Action deletion still uses the native browser confirmation popup.');
  }
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

  if (!html.includes('.modal.wct-case-detail-modal .wct-case-section{')) {
    throw new Error('UI regression check failed: Case Detail modal dark section override is missing.');
  }
  if (!html.includes('.modal.wct-case-detail-modal .wct-case-action-buttons .btn')) {
    throw new Error('UI regression check failed: Case Detail modal action button visibility override is missing.');
  }
  if (!html.includes('.modal.wct-case-detail-modal>.modal-body.wct-case-detail')) {
    throw new Error('UI regression check failed: Case Detail modal single-scroll layout is missing.');
  }

  if (!html.includes('#pageContent .wct-dashboard-columns,') || !html.includes('grid-template-columns:minmax(0,1fr)!important')) {
    throw new Error('UI regression check failed: Mobile Dashboard single-column layout is missing.');
  }
  if (!html.includes('#pageContent .wct-cases-table tbody tr{') || !html.includes('background:#151F2B!important;box-shadow:0 8px 22px')) {
    throw new Error('UI regression check failed: Mobile Case cards are not using dark surfaces.');
  }
  if (html.includes('window.openCaseDetail=async function(id)')) {
    throw new Error('UI regression check failed: Case detail still waits for audit history before rendering.');
  }
  if (html.includes('flowShowList();') && !html.includes('function flowShowList()')) {
    throw new Error('UI regression check failed: Case editor cancel points to an undefined list renderer.');
  }
  if (html.includes('flowFormShell(') && !html.includes('function flowFormShell(')) {
    throw new Error('UI regression check failed: Action/Progress forms point to an undefined modal shell.');
  }
  if (html.includes('flowRenderDetail(') || html.includes('flowCaptureFilters(') && !html.includes('function flowCaptureFilters()')) {
    throw new Error('UI regression check failed: PICAPA workflow contains unresolved flow helper references.');
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


  // Audit every inline handler and delegated button contract before publishing.
  const globalHandlerNames = new Set();
  for (const match of html.matchAll(/\b(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/g)) {
    globalHandlerNames.add(match[1]);
  }
  for (const match of html.matchAll(/\bwindow\.([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:function\b|(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>)/g)) {
    globalHandlerNames.add(match[1]);
  }
  const allowedNativeHandlers = new Set([
    'preventDefault','stopPropagation','stopImmediatePropagation',
    'setTimeout','clearTimeout','requestAnimationFrame','alert','confirm'
  ]);
  const inlineHandlerAttributes = [...html.matchAll(/\bon(?:click|submit|change|input|keydown|pointerdown)\s*=\s*"([^"]*)"/gi)];
  const unresolvedHandlers = new Set();
  for (const attribute of inlineHandlerAttributes) {
    const source = attribute[1] || '';
    const calls = [];
    for (const match of source.matchAll(/(?:^|[^\w.$])([A-Za-z_$][\w$]*)\s*\(/g)) calls.push(match[1]);
    for (const match of source.matchAll(/\bwindow\.([A-Za-z_$][\w$]*)\s*\(/g)) calls.push(match[1]);
    for (const name of calls) {
      if (!globalHandlerNames.has(name) && !allowedNativeHandlers.has(name)) unresolvedHandlers.add(name);
    }
  }
  if (unresolvedHandlers.size) {
    throw new Error('Button contract audit failed: unresolved inline handler(s): ' + [...unresolvedHandlers].sort().join(', '));
  }

  const delegatedContracts = [
    ['priority buttons', 'button.wct-priority-choice', 'window.wctPriorityRuntimeReady = true;'],
    ['Case Edit buttons', '[data-wct-case-edit-id]', 'closest(\'[data-wct-case-edit-id]\')'],
    ['Case editor Cancel button', '[data-wct-case-edit-cancel]', 'closest(\'[data-wct-case-edit-cancel]\')'],
    ['Admin option Edit/Delete buttons', '[data-wct-option-action]', 'closest(\'[data-wct-option-action]\')'],
    ['Admin settings action buttons', '[data-settings-action]', 'closest(\'[data-settings-action]\')'],
    ['Admin settings forms', '[data-settings-form]', "form.matches(\'[data-settings-form]\')"],
    ['Account password form', '[data-account-password]', "form.matches(\'[data-account-password]\')"],
    ['Case option forms', '[data-wct-option-form]', "form.matches(\'[data-wct-option-form]\')"],
    ['Progress slider input', '[data-wct-progress-slider]', "closest(\'[data-wct-progress-slider]\')"],

    ['Workspace module navigation', '[data-wct-workspace-page]', "closest('[data-wct-workspace-page]')"],
    ['Dashboard case open', '[data-wct-open-case]', "closest('[data-wct-open-case]')"],
    ['Dashboard create case', '[data-wct-create-case]', "closest('[data-wct-create-case]')"],
    ['Dashboard native case navigation', '[data-wct-open-native]', "closest('[data-wct-open-native]')"],
    ['Dashboard team navigation', '[data-wct-go]', "closest('[data-wct-go]')"],
    ['Task progress action', '[data-wct-progress-action]', "closest('[data-wct-progress-action]')"],
    ['Task creation workflow', '[data-wct-new-action]', "closest('[data-wct-new-action]')"],
    ['Task filter controls', '[data-wct-task-filter]', "closest('[data-wct-task-filter]')"],
    ['Task PIC filter reset', '[data-wct-clear-assignee]', "closest('[data-wct-clear-assignee]')"],
    ['Calendar date navigation', '[data-wct-calendar-move]', "closest('[data-wct-calendar-move]')"],
    ['Calendar Today control', '[data-wct-calendar-today]', "closest('[data-wct-calendar-today]')"],
    ['Calendar day selection', '[data-wct-calendar-date]', "closest('[data-wct-calendar-date]')"],
    ['Calendar action open', '[data-wct-open-action]', "closest('[data-wct-open-action]')"],
    ['Team workload navigation', '[data-wct-member-tasks]', "closest('[data-wct-member-tasks]')"],
    ['Team profile action', '[data-wct-member-detail]', "closest('[data-wct-member-detail]')"],
    ['Team invite action', '[data-wct-invite-member]', "closest('[data-wct-invite-member]')"],
    ['Team message composer', '[data-wct-member-message]', "closest('[data-wct-member-message]')"],
    ['Team message copy action', '[data-wct-copy-message]', "closest('[data-wct-copy-message]')"],
    ['New Action type selector', '[data-wct-new-action-kind]', "closest('[data-wct-new-action-kind]')"],
    ['Analytics CSV export', '[data-wct-analytics-export]', "closest('[data-wct-analytics-export]')"],
    ['Analytics period controls', '[data-wct-analytics-range]', "closest('[data-wct-analytics-range]')"]
  ];
  const missingDelegatedContracts = delegatedContracts
    .filter(([label, marker, listener]) => html.includes(marker) && !html.includes(listener))
    .map(([label]) => label);
  if (missingDelegatedContracts.length) {
    throw new Error('Button contract audit failed: missing delegated listener(s): ' + missingDelegatedContracts.join(', '));
  }

  // Non-submit buttons without onclick must be covered by a documented delegated control.
  const delegatedButtonAttributes = [
    'data-value','data-wct-case-edit-id','data-wct-option-action',
    'data-wct-workspace-page','data-wct-open-case','data-wct-create-case','data-wct-open-native',
    'data-wct-go','data-wct-progress-action','data-wct-new-action','data-wct-task-filter',
    'data-wct-clear-assignee','data-wct-calendar-move','data-wct-calendar-today','data-wct-calendar-date',
    'data-wct-member-tasks','data-wct-member-detail','data-wct-new-action-kind','data-wct-analytics-export',
    'data-wct-analytics-range','data-wct-theme'
  ];
  const buttonTokens = /<\/?form\b[^>]*>|<button\b[^>]*>/gi;
  let activeFormDepth = 0;
  const unhandledButtons = [];
  for (const match of html.matchAll(buttonTokens)) {
    const tag = match[0];
    if (/^<\/form/i.test(tag)) {
      activeFormDepth = Math.max(0, activeFormDepth - 1);
      continue;
    }
    if (/^<form\b/i.test(tag)) {
      activeFormDepth += 1;
      continue;
    }
    const attributes = tag.slice(7, -1);
    if (/\bonclick\s*=/.test(attributes)) continue;
    const typeMatch = attributes.match(/\btype\s*=\s*["']([^"']+)["']/i);
    const type = typeMatch ? typeMatch[1].toLowerCase() : '';
    if (type === 'button') {
      if (/\bdisabled\b/i.test(attributes)) continue;
      const delegated = delegatedButtonAttributes.some((name) => new RegExp('\\b' + name + '(?:\\s|=|>)').test(attributes))
        || /\bdata-[a-z0-9-]+/i.test(attributes);
      if (!delegated) unhandledButtons.push(tag.slice(0, 220));
      continue;
    }
    if (type === 'submit' || !type) {
      if (/\bdisabled\b/i.test(attributes)) continue;
      const delegatedData = /\bdata-[a-z0-9-]+/i.test(attributes);
      if (activeFormDepth === 0 && !delegatedData) unhandledButtons.push(tag.slice(0, 220));
    }
  }
  if (unhandledButtons.length) {
    throw new Error('Button contract audit failed: button without click, delegated, or form-submit route: ' + unhandledButtons.join(' | '));
  }

  const openCaseInterceptorCount = (html.match(/closest\(\'\[onclick\*="openCaseForm"\]\'\)/g) || []).length;
  if (openCaseInterceptorCount !== 1) {
    throw new Error('Button contract audit failed: expected exactly one Create Case click interceptor, found ' + openCaseInterceptorCount + '.');
  }
  const delayedSettingsNavigationCount = (html.match(/label\.includes\(\'pengaturan\'\)/g) || []).length;
  if (delayedSettingsNavigationCount !== 1) {
    throw new Error('Button contract audit failed: settings navigation has duplicate/missing delayed handlers (' + delayedSettingsNavigationCount + ').');
  }
  const auditedButtonCount = [...html.matchAll(/<button\b/gi)].length;
  if (auditedButtonCount < 100) {
    throw new Error('Button audit failed: expected at least 100 application buttons to be inspected; found ' + auditedButtonCount + '.');
  }
  if (!html.includes('id="wct-modal-controls"') || !html.includes('window.closeModal=closeModalSafely;')) {
    throw new Error('Button audit failed: modal close/cancel controller is missing.');
  }
  console.log('Button audit passed: ' + auditedButtonCount + ' button elements scanned; ' + inlineHandlerAttributes.length + ' inline event handlers; ' + globalHandlerNames.size + ' named functions; all registered delegated routes verified.');

  const supabaseRuntimePath = path.join(__dirname, 'supabase-runtime.js');
  const supabaseRuntime = fs.readFileSync(supabaseRuntimePath, 'utf8');
  try { new Function(supabaseRuntime); } catch (error) {
    throw new Error('Supabase runtime syntax check failed: ' + error.message);
  }
  const requiredSupabaseRuntime = [
    ['current-password verification', 'sb.auth.signInWithPassword({email,password:current})'],
    ['password update', 'sb.auth.updateUser({password:next})'],
    ['WCT settings storage', "sb.from('wct_app_settings').upsert"],
    ['Structured Case save error details', 'function wctCaseErrorDetails(error)'],
    ['Inline Case form error feedback', 'function wctShowCaseFormError(form,error)'],
    ['Case save success separated from refresh failure', 'Case berhasil disimpan, tetapi daftar belum berhasil diperbarui.'],
    ['New user form resets after confirmed database save', 'formElement.reset()'],
    ['Case draft is cleared immediately after confirmed database save', 'window.WCTCaseDraft.clear()'],
    ['Case save uses Supabase atomic RPC', "sb.rpc('wct_create_case',{p_case:row,p_actions:actions})"],
    ['Action create and edit use Admin/Coordinator RPC', 'wct_save_action'],

    ['Weekly Meeting HUB is encoded in existing notes payload', "hub_code:String(row.hub_code||'')"],
    ['Weekly Meeting HUB is restored from notes payload', "out.hub_code=String(notes.hub_code||'')"]
  ];
  const actionDeleteMigrationPath = path.join(root, 'supabase/migrations/20261119_wct_delete_action.sql');
  const actionDeleteMigration = fs.readFileSync(actionDeleteMigrationPath, 'utf8');
  const requiredActionDeleteSql = [
    ['active Admin/Coordinator role check', "v_role not in ('admin','coordinator')"],
    ['closed Case protection', "where id = v_action.case_id and status = 'closed'"],
    ['progress audit cleanup', 'delete from public.wct_progress_log_edits'],
    ['progress history cleanup', 'delete from public.wct_progress_logs'],
    ['Action deletion', 'delete from public.wct_actions'],
    ['authenticated RPC grant', 'to authenticated']
  ];
  const missingActionDeleteSql = requiredActionDeleteSql.filter(([, marker]) => !actionDeleteMigration.includes(marker)).map(([name]) => name);
  if (missingActionDeleteSql.length) {
    throw new Error('Action delete SQL migration contract check failed: ' + missingActionDeleteSql.join(', '));
  }
  const adminCoordinatorCrudMigrationPath = path.join(root, 'supabase/migrations/20261120_wct_admin_coordinator_crud.sql');
  const adminCoordinatorCrudMigration = fs.readFileSync(adminCoordinatorCrudMigrationPath, 'utf8');
  const requiredAdminCoordinatorCrudSql = [
    ['role-checked Action create/edit RPC', 'create or replace function public.wct_save_action('],
    ['role-checked Action delete RPC', 'create or replace function public.wct_delete_action('],
    ['role-checked Weekly Meeting delete RPC', 'create or replace function public.wct_delete_meeting('],
    ['all management RPCs restricted to active Admin/Coordinator', "v_role not in ('admin','coordinator')"],
    ['Weekly Meeting history deletion', 'delete from public.wct_meetings'],
    ['Action history cleanup', 'delete from public.wct_progress_logs'],
    ['Action audit cleanup', 'delete from public.wct_progress_log_edits'],
    ['authenticated CRUD RPC grants', 'grant execute on function public.wct_save_action(uuid,uuid,jsonb) to authenticated'],
    ['direct Action table writes are revoked', 'revoke insert, update, delete on table public.wct_actions from anon, authenticated']
  ];
  const missingAdminCoordinatorCrudSql = requiredAdminCoordinatorCrudSql
    .filter(([, marker]) => !adminCoordinatorCrudMigration.includes(marker))
    .map(([name]) => name);
  if (missingAdminCoordinatorCrudSql.length) {
    throw new Error('Admin/Coordinator CRUD migration contract check failed: ' + missingAdminCoordinatorCrudSql.join(', '));
  }
  const missingSupabaseRuntime = requiredSupabaseRuntime.filter(([, marker]) => !supabaseRuntime.includes(marker)).map(([name]) => name);
  if (missingSupabaseRuntime.length) {
    throw new Error('Supabase runtime contract check failed: ' + missingSupabaseRuntime.join(', '));
  }
  const meetingItemsMigrationPath = path.join(root, 'supabase/migrations/20261119_wct_meeting_items.sql');
  const meetingItemsMigration = fs.readFileSync(meetingItemsMigrationPath, 'utf8');
  const requiredMeetingItemsSql = [
    ['structured Weekly Meeting points table', 'create table if not exists public.wct_meeting_items'],
    ['active-user read policy for meeting points', 'wct_meeting_items_read_active'],
    ['role-checked transactional meeting and project save RPC', 'create or replace function public.wct_save_meeting_with_items'],
    ['new Project Case creation through the standard Case workflow', 'public.wct_create_case(v_case_payload, v_actions)'],
    ['authenticated users restricted to the secure save RPC', 'grant execute on function public.wct_save_meeting_with_items(uuid,jsonb,jsonb) to authenticated']
  ];
  const missingMeetingItemsSql = requiredMeetingItemsSql
    .filter(([, marker]) => !meetingItemsMigration.includes(marker))
    .map(([name]) => name);
  if (missingMeetingItemsSql.length) {
    throw new Error('Weekly Meeting items migration contract check failed: ' + missingMeetingItemsSql.join(', '));
  }
  const firebaseResidue = {
    firebaseScript: /<script[^>]+src=["'][^"']*firebase/i.test(html),
    firebaseConfig: /FIREBASE_CONFIG/.test(html),
    firebaseInitialize: /firebase\.initializeApp/.test(html),
    firebaseFirestore: /firebase\.firestore\(/.test(html)
  };
  if (Object.values(firebaseResidue).some(Boolean)) {
    const residueIndex = html.indexOf('firebase.firestore(');
    const residueExcerpt = residueIndex >= 0 ? html.slice(Math.max(0, residueIndex - 180), residueIndex + 260).replace(/\\s+/g, ' ') : '';
    throw new Error('Firebase SDK/configuration reference remains in generated app: ' + JSON.stringify(firebaseResidue) + ' excerpt=' + residueExcerpt);
  }

  fs.mkdirSync(outputDir, { recursive: true });
  fs.copyFileSync(supabaseRuntimePath, path.join(outputDir, 'supabase-runtime.js'));
  fs.writeFileSync(outputPath, html);
  console.log('Built ' + path.relative(root, outputPath) + ' (' + html.length + ' bytes)');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exitCode = 1;
}
