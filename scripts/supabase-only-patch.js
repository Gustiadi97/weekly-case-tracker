module.exports = function applySupabaseOnlyPatch(html) {
  const supabaseUrl = 'https://ktqgtutzgivxjwtdqcbw.supabase.co';
  const publishableKey = 'sb_publishable_Zl8Cwoc7QdIGi_qg-U1ayg_yrWlPX0U';

  html = html.replace(/<script\b[^>]*src=["'][^"']*(?:firebase|gstatic\.com\/firebase)[^"']*["'][^>]*>\s*<\/script>\s*/gi, '');

  const oldBootstrap = /\/\/ Firebase Web App config[\s\S]*?let state=\{cases:\[\],actions:\[\],logs:\[\],meetings:\[\],profiles:\[\]\};/;
  if (!oldBootstrap.test(html)) throw new Error('Supabase migration could not locate the old backend bootstrap block.');

  html = html.replace(oldBootstrap, [
    'const SUPABASE_URL = ' + JSON.stringify(supabaseUrl) + ';',
    'const SUPABASE_PUBLISHABLE_KEY = ' + JSON.stringify(publishableKey) + ';',
    'let auth={onAuthStateChanged:function(){return {unsubscribe:function(){}};},signOut:function(){return Promise.resolve();}}, fireDb=null, cloudFunctions=null;',
    "let mode='supabase', currentUser=null, currentPage='dashboard';",
    'let state={cases:[],actions:[],logs:[],meetings:[],profiles:[],meetingCases:[]};'
  ].join('\n'));

  html = html.replace(/mode\s*===\s*['"]firebase['"]/g, "mode==='supabase'");
  html = html.replace(/mode\s*!==\s*['"]firebase['"]/g, "mode!=='supabase'");
  html = html.replace(/mode\s*=\s*['"]demo['"]/g, "mode='supabase'");
  html = html.replace(/FIREBASE CONNECTED|FIREBASE DATABASE|Firebase Authentication|Cloud Firestore|Firebase Project/g, value => value.replace(/FIREBASE|Firebase/g, 'SUPABASE'));
  html = html.replace(/Firebase/g, 'Supabase').replace(/FIREBASE/g, 'SUPABASE');
  html = html.replace(/Cloud Firestore/gi, 'Supabase PostgreSQL')
    .replace(/Cloud Functions/gi, 'Supabase Edge Functions')
    .replace(/firebase\\.json/gi, 'README Supabase')
    .replace(/firestore\\.rules/gi, 'Row Level Security (RLS)')
    .replace(/Firestore/gi, 'Supabase');
  html = html.replace(/minimal 6 karakter/gi, 'minimal 8 karakter').replace(/minlength="6"/g, 'minlength="8"');

  html = html.replace('</head>', '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>\n</head>');
  html = html.replace('</body>', '<script src="/supabase-runtime.js"></script>\n</body>');
  return html;
};
