module.exports = function applySupabaseOnlyPatch(html) {
  const supabaseUrl = 'https://ktqgtutzgivxjwtdqcbw.supabase.co';
  const publishableKey = 'sb_publishable_Zl8Cwoc7QdIGi_qg-U1ayg_yrWlPX0U';

  html = html.replace(/<script\b[^>]*src=["'][^"']*(?:firebase|gstatic\.com\/firebase)[^"']*["'][^>]*>\s*<\/script>\s*/gi, '');

  const oldBootstrap = /\/\/ Firebase Web App config[\s\S]*?let state=\{cases:\[\],actions:\[\],logs:\[\],meetings:\[\],profiles:\[\]\};/;
  if (!oldBootstrap.test(html)) throw new Error('Supabase migration could not locate the old backend bootstrap block.');

  html = html.replace(oldBootstrap, [
    'const SUPABASE_URL = ' + JSON.stringify(supabaseUrl) + ';',
    'const SUPABASE_PUBLISHABLE_KEY = ' + JSON.stringify(publishableKey) + ';',
    'let auth={onAuthStateChanged:function(){return {unsubscribe:function(){}};},signOut:function(){return Promise.resolve();}}, fireDb=null, legacyAdminApiDisabled={httpsCallable:function(){return function(){return Promise.reject(new Error(\'Backend Firebase sudah dinonaktifkan. Gunakan Supabase.\'));};}};',
    "let mode='supabase', currentUser=null, currentPage='dashboard';",
    'let state={cases:[],actions:[],logs:[],meetings:[],profiles:[],meetingCases:[]};'
  ].join('\n'));

  const replaceRange = (source, startMarker, endMarker, replacement) => {
    const start = source.indexOf(startMarker);
    const end = source.indexOf(endMarker, start < 0 ? 0 : start + startMarker.length);
    if (start < 0 || end < 0) return source;
    return source.slice(0, start) + replacement + source.slice(end);
  };

  // Remove the old login/bootstrap implementation. The Supabase runtime installs
  // the real ID/password login and first Admin is already provisioned in Auth.
  html = replaceRange(
    html,
    'async function loginSupabase(){',
    'async function logout(){',
    "async function loginSupabase(){ toast('Gunakan login Supabase dengan ID dan password.'); }\n" +
    "function openBootstrapForm(){ toast('Admin pertama sudah terdaftar melalui Supabase Auth.'); }\n" +
    "async function completeFirstAdmin(event){ if(event)event.preventDefault(); toast('Aktivasi Admin pertama sudah selesai melalui Supabase Auth.'); }\n"
  );
  html = replaceRange(
    html,
    'async function logout(){',
    'async function refreshData(){',
    "async function logout(){ if(auth&&auth.signOut)await auth.signOut(); currentUser=null; mode='supabase'; showLogin(); }\n"
  );

  // The source template still carries a separate one-time Firebase bootstrap
  // block. The Supabase Admin account is already provisioned; remove that code.
  html = replaceRange(
    html,
    'function openBootstrapForm(loginId){',
    'async function refreshData(){',
    "function openBootstrapForm(){ toast('Admin pertama sudah terdaftar melalui Supabase Auth.'); }\n" +
    "async function completeFirstAdmin(event){ if(event)event.preventDefault(); toast('Aktivasi Admin pertama sudah selesai melalui Supabase Auth.'); }\n" +
    "async function logout(){ if(auth&&auth.signOut)await auth.signOut(); currentUser=null; mode='supabase'; showLogin(); }\n"
  );

  // The enhanced template has a second loginSupabase declaration in another
  // inline script. Replace it up to the bootstrap helper boundary as well.
  html = replaceRange(
    html,
    'async function loginSupabase(){',
    'function openBootstrapForm',
    "async function loginSupabase(){ toast('Gunakan login ID dan password melalui Supabase.'); }\n"
  );

  // Remove any duplicated legacy session listener regardless of script ordering.
  html = html.replace(
    /\\/\\/ Restore session if a Supabase user is already signed in\\.[\\s\\S]*?\\/\\/ Optional quick preview URL: index\\.html\\?demo=1/g,
    '// Supabase session restoration is handled by /supabase-runtime.js.'
  );

  // Session restore is handled only by the Supabase runtime, never by Firebase tokens.
  // Replace legacy Cloud Function calls with a disabled compatibility stub.
  // User administration is reimplemented by the Supabase Edge Function runtime.
  html = html.replace(/\bcloudFunctions\b/g, 'legacyAdminApiDisabled');

  const restoreStart = html.indexOf('// Restore session if a Supabase user is already signed in.');
  const restoreEnd = html.indexOf('// Optional quick preview URL: index.html?demo=1', restoreStart);
  if (restoreStart >= 0 && restoreEnd >= 0) {
    html = html.slice(0, restoreStart) + '// Supabase session restoration is handled by /supabase-runtime.js.\n' + html.slice(restoreEnd);
  }

  // The old password handler used Firebase reauthentication. Supabase runtime owns this action.
  const passwordStart = html.indexOf('async function changeOwnPassword(event){');
  const passwordEnd = html.indexOf('function renderSettings(){', passwordStart);
  if (passwordStart >= 0 && passwordEnd > passwordStart) {
    html = html.slice(0, passwordStart) +
      "async function changeOwnPassword(event){ if(event)event.preventDefault(); toast('Penggantian password ditangani oleh Supabase Auth.'); }\n" +
      html.slice(passwordEnd);
  }

  html = html.replace(/mode\s*===\s*['"]firebase['"]/g, "mode==='supabase'");
  html = html.replace(/mode\s*!==\s*['"]firebase['"]/g, "mode!=='supabase'");
  html = html.replace(/mode\s*=\s*['"]firebase['"]/g, "mode='supabase'");
  html = html.replace(/mode\s*=\s*['"]demo['"]/g, "mode='supabase'");
  html = html.replace(/FIREBASE CONNECTED|FIREBASE DATABASE|Firebase Authentication|Cloud Firestore|Firebase Project/g, value => value.replace(/FIREBASE|Firebase/g, 'SUPABASE'));
  html = html.replace(/Firebase/g, 'Supabase').replace(/FIREBASE/g, 'SUPABASE');
  html = html.replace(/Cloud Firestore/gi, 'Supabase PostgreSQL')
    .replace(/Cloud Functions/gi, 'Supabase Edge Functions')
    .replace(/firebase\.json/gi, 'README Supabase')
    .replace(/firestore\.rules/gi, 'Row Level Security (RLS)')
    .replace(/Firestore/gi, 'Supabase')
    .replace(/Supabase\.rules/gi, 'Row Level Security (RLS)');
  html = html.replace(/minimal 6 karakter/gi, 'minimal 8 karakter').replace(/minlength="6"/g, 'minlength="8"');

  html = html.replace('</head>', '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>\n</head>');
  html = html.replace('</body>', '<script src="/supabase-runtime.js"></script>\n</body>');
  const staleBackend = html.match(/firebase|firestore|cloud functions|cloudfunctions|firebase\\.json|supabase\\.rules/i);
  if (staleBackend) {
    const index = html.toLowerCase().indexOf(staleBackend[0].toLowerCase());
    throw new Error('Old backend reference remains in generated app: ' + html.slice(Math.max(0,index-100), index+180).replace(/\\s+/g,' '));
  }
  return html;
};
