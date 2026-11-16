module.exports = function applyIconSystem(html) {
  if (!html || !html.includes('</body>')) throw new Error('Could not find document body for icon system.');

  const css = String.raw`
/* Consistent thin-line icon language, matched to the navy / blue workspace */
.wct-nav-icon,.wct-action-icon,.wct-heading-icon,.wct-page-icon,.wct-kpi-svg{
  display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;
  color:currentColor;vertical-align:middle;pointer-events:none
}
.wct-nav-icon{width:19px;height:19px;margin-right:10px;opacity:.94}
.wct-nav-icon svg{width:18px;height:18px}
.nav button{display:flex!important;align-items:center!important;text-align:left!important;gap:0!important}
.nav button .wct-nav-icon{color:inherit}
.nav button.active .wct-nav-icon{color:#fff!important}
.wct-action-icon{width:16px;height:16px}
.wct-action-icon svg{width:15px;height:15px}
#pageContent button,.modal-backdrop button,.login-card button{align-items:center}
#pageContent button .wct-action-icon,.modal-backdrop button .wct-action-icon{margin-right:1px}
.wct-heading-icon,.wct-page-icon{
 width:29px;height:29px;border-radius:9px;margin-right:9px;
 background:#EAF2FF;border:1px solid #D9E7FA;color:#2864C7
}
.wct-heading-icon svg,.wct-page-icon svg{width:16px;height:16px}
.page-head h1{display:flex!important;align-items:center!important;gap:0!important}
.wct-page-icon{width:33px;height:33px;border-radius:10px;margin-right:11px}
.kpis .kpi-icon{display:inline-flex!important;align-items:center!important;justify-content:center!important}
.kpis .kpi-icon .wct-kpi-svg svg{width:19px;height:19px}
.kpis .kpi:first-child .kpi-icon .wct-kpi-svg{color:#fff!important}
.card-head h3 .wct-heading-icon,.card-head h4 .wct-heading-icon{vertical-align:middle}
.wct-icon-only{display:inline-flex!important;align-items:center!important;justify-content:center!important}
.wct-icon-only .wct-action-icon{margin:0!important}
@media(max-width:760px){
 .wct-nav-icon{width:20px;height:20px;margin-right:11px}
 .wct-heading-icon{width:27px;height:27px}
 .wct-page-icon{width:30px;height:30px}
}
`;

  const js = String.raw`
(function(){
  if (window.__WCT_ICON_SYSTEM__) return;
  window.__WCT_ICON_SYSTEM__ = true;
  var svgNS = 'http://www.w3.org/2000/svg';
  var paths = {
    dashboard:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    cases:'<path d="M8 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3"/><rect x="8" y="2" width="8" height="4" rx="1.5"/><path d="M8 11h8M8 15h8M8 19h4"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>',
    chart:'<path d="M3 3v18h18"/><path d="m7 14 4-4 3 3 6-7"/><path d="M16 6h4v4"/>',
    settings:'<circle cx="12" cy="12" r="3.5"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.1 2.1-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-3v-.2a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-2.1-2.1.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H5v-3h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2.1-2.1.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V5h3v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 2.1 2.1-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v3h-.2a1.7 1.7 0 0 0-1.6 1Z"/>',
    users:'<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    filePlus:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M12 18v-6M9 15h6"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    save:'<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
    edit:'<path d="m15 5 4 4M4 20l4.5-.9L19 8.6a2.12 2.12 0 0 0-3-3L5.5 16.1 4 20Z"/>',
    trash:'<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v5M14 11v5"/>',
    eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    filter:'<path d="M4 5h16l-6.3 7.2v5.1l-3.4 1.8v-6.9Z"/>',
    reset:'<path d="M3 11a9 9 0 1 1 2.6 6.4"/><path d="M3 4v7h7"/>',
    search:'<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/>',
    download:'<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 19v2h16v-2"/>',
    printer:'<path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v7H6z"/>',
    close:'<path d="m18 6-12 12M6 6l12 12"/>',
    progress:'<path d="M3 17l6-6 4 4 8-9"/><path d="M15 6h6v6"/>',
    userCheck:'<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="m16 11 2 2 4-4"/>',
    archive:'<path d="M3 4h18v4H3zM5 8v12h14V8M10 12h4"/>',
    refresh:'<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.5 9A7 7 0 0 1 18 6l2 6M4 12l2 6a7 7 0 0 0 12.5-3"/>',
    lock:'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
    alert:'<path d="M10.3 3.9 2.6 17.2A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
    activity:'<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    pie:'<path d="M11 3a9 9 0 1 0 10 10h-9V3Z"/><path d="M15 3.5A9 9 0 0 1 20.5 9H15Z"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    flag:'<path d="M5 21V4M5 4c5-4 9 4 14 0v11c-5 4-9-4-14 0"/>',
    check:'<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/>',
    folder:'<path d="M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
    list:'<path d="M9 6h12M9 12h12M9 18h12"/><path d="M4 6h.01M4 12h.01M4 18h.01"/>'
  };

  function svg(key, cls){
    var node=document.createElementNS(svgNS,'svg');
    node.setAttribute('viewBox','0 0 24 24');
    node.setAttribute('fill','none');
    node.setAttribute('stroke','currentColor');
    node.setAttribute('stroke-width','1.8');
    node.setAttribute('stroke-linecap','round');
    node.setAttribute('stroke-linejoin','round');
    node.setAttribute('aria-hidden','true');
    node.setAttribute('focusable','false');
    node.setAttribute('class',cls||'');
    node.innerHTML=paths[key]||paths.activity;
    return node;
  }
  function wrapIcon(key, cls){
    var span=document.createElement('span');
    span.className=cls;
    span.setAttribute('aria-hidden','true');
    span.appendChild(svg(key,''));
    return span;
  }
  function textOf(el){
    return String((el.getAttribute&&((el.getAttribute('aria-label')||el.getAttribute('title')))||'')+' '+(el.innerText||el.textContent||'')).replace(/\s+/g,' ').trim().toLowerCase();
  }
  function removeLeadingGlyph(el){
    Array.prototype.forEach.call(el.childNodes,function(node){
      if(node.nodeType===3){
        node.nodeValue=node.nodeValue.replace(/^\s*(?:[＋+×✕↻▦▤▥◴◷▧▨⚙📊📅📋👥🔎🗂️])\s*/u,' ');
      }
    });
  }
  function iconHost(el, key, cls){
    var old=el.querySelector(':scope > svg,:scope > i,:scope > .nav-icon,:scope > .icon,:scope > [class*="icon"]');
    if(old){
      if(old.tagName&&old.tagName.toLowerCase()==='svg') old.replaceWith(wrapIcon(key,cls));
      else {old.textContent='';old.className=cls;old.appendChild(svg(key,''));}
      return;
    }
    var first=el.firstElementChild;
    if(first&&first.textContent.trim().length<=2&&!first.querySelector('input,button')){
      first.replaceWith(wrapIcon(key,cls));
    }else{
      removeLeadingGlyph(el);
      el.insertBefore(wrapIcon(key,cls),el.firstChild);
    }
  }
  function navKey(s){
    if(/dashboard|overview/.test(s))return 'dashboard';
    if(/case monitoring|case register|cases|permasalahan/.test(s))return 'cases';
    if(/weekly meeting|meeting|rapat/.test(s))return 'calendar';
    if(/reports|archive|laporan|arsip/.test(s))return 'chart';
    if(/user management|anggota|pengguna|team/.test(s))return 'users';
    if(/pengaturan|settings|preferences/.test(s))return 'settings';
    return null;
  }
  function actionKey(s,el){
    if(el.classList.contains('close')||/^(×|✕|close|tutup)$/.test(s))return 'close';
    if(/simpan|save|submit|buat akun/.test(s))return 'save';
    if(/create new case|new case|catat permasalahan|buat case|tambah case/.test(s))return 'filePlus';
    if(/edit|ubah/.test(s))return 'edit';
    if(/hapus|delete|remove/.test(s))return 'trash';
    if(/detail|lihat|view|preview/.test(s))return 'eye';
    if(/filter|saring/.test(s))return 'filter';
    if(/reset|bersihkan|clear/.test(s))return 'reset';
    if(/search|cari/.test(s))return 'search';
    if(/export|unduh|download/.test(s))return 'download';
    if(/print|cetak/.test(s))return 'printer';
    if(/progress|update|perbarui/.test(s))return 'progress';
    if(/assign|tetapkan pic|penanggung jawab/.test(s))return 'userCheck';
    if(/meeting|rapat|agenda/.test(s))return 'calendar';
    if(/archive|arsip/.test(s))return 'archive';
    if(/refresh|muat ulang/.test(s))return 'refresh';
    if(/password|kata sandi/.test(s))return 'lock';
    if(/pengguna|anggota|user/.test(s))return 'users';
    if(/tambah|add|buat|new|plus|\+\s/.test(s))return 'plus';
    if(/batal|cancel|kembali|back/.test(s))return 'close';
    return null;
  }
  function headingKey(s){
    if(/perlu perhatian|overdue|attention/.test(s))return 'alert';
    if(/progress portfolio|achievement|analytics|analisis/.test(s))return 'chart';
    if(/update terbaru|aktivitas|activity|riwayat/.test(s))return 'activity';
    if(/distribusi status|status distribution/.test(s))return 'pie';
    if(/daftar permasalahan|case register|case monitoring/.test(s))return 'cases';
    if(/weekly meeting|daftar meeting|jadwal meeting/.test(s))return 'calendar';
    if(/daftar pengguna|user management|team/.test(s))return 'users';
    if(/laporan|archive|arsip/.test(s))return 'folder';
    return null;
  }
  function pageKey(s){
    if(/dashboard|overview/.test(s))return 'dashboard';
    if(/case monitoring|case register/.test(s))return 'cases';
    if(/weekly meeting|meeting/.test(s))return 'calendar';
    if(/reports|archive|laporan|arsip/.test(s))return 'chart';
    if(/pengaturan|settings/.test(s))return 'settings';
    if(/user management|anggota|pengguna/.test(s))return 'users';
    return null;
  }
  function decorate(){
    document.querySelectorAll('.nav button,.sidebar nav a,.sidebar .nav a').forEach(function(el){
      var key=navKey(textOf(el));
      if(!key||el.dataset.wctNavIcon==='1')return;
      iconHost(el,key,'wct-nav-icon');
      el.dataset.wctNavIcon='1';
    });

    document.querySelectorAll('#pageContent button,.modal-backdrop button,.login-card button').forEach(function(el){
      if(el.dataset.wctActionIcon==='1'||el.classList.contains('wct-priority-choice'))return;
      var key=actionKey(textOf(el),el);
      if(!key)return;
      iconHost(el,key,'wct-action-icon');
      el.dataset.wctActionIcon='1';
      if(!textOf(el)||textOf(el)==='×'||textOf(el)==='✕')el.classList.add('wct-icon-only');
    });

    document.querySelectorAll('.card-head h3,.card-head h4,.wct-settings-card-header h2').forEach(function(el){
      if(el.dataset.wctHeadingIcon==='1')return;
      var key=headingKey(textOf(el));
      if(!key)return;
      iconHost(el,key,'wct-heading-icon');
      el.dataset.wctHeadingIcon='1';
    });

    document.querySelectorAll('.page-head h1').forEach(function(el){
      if(el.dataset.wctPageIcon==='1')return;
      var key=pageKey(textOf(el));
      if(!key)return;
      iconHost(el,key,'wct-page-icon');
      el.dataset.wctPageIcon='1';
    });

    document.querySelectorAll('.kpis .kpi').forEach(function(el){
      var holder=el.querySelector('.kpi-icon');
      if(!holder||holder.dataset.wctKpiIcon==='1')return;
      var s=textOf(el);
      var key=/overdue|terlambat|melewati/.test(s)?'flag':
        /closed|selesai|ditutup/.test(s)?'check':
        /open|menunggu|aktif/.test(s)?'clock':
        /action|tindakan/.test(s)?'list':'cases';
      holder.textContent='';
      holder.appendChild(wrapIcon(key,'wct-kpi-svg'));
      holder.dataset.wctKpiIcon='1';
    });
  }

  var queued=false;
  function schedule(){
    if(queued)return;
    queued=true;
    window.requestAnimationFrame(function(){queued=false;decorate();});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
  else schedule();
  if(document.body){
    var observer=new MutationObserver(schedule);
    observer.observe(document.body,{childList:true,subtree:true});
  }
  window.WCTIconSystemReady=true;
})();
`;

  const out = html.replace('</body>',
    '<style id="wct-icon-system-style">' + css + '</style>\n' +
    '<script id="wct-icon-system">' + js + '</script>\n</body>');
  return out;
};
