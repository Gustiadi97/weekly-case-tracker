module.exports = function addNotificationSystem(html) {
  if (!html || !html.includes('</body>')) throw new Error('Could not find body for notification system.');
  const css = String.raw\`
.wct-dynamic-island-host{position:fixed!important;top:max(14px,env(safe-area-inset-top))!important;left:50%!important;z-index:1000002!important;width:min(420px,calc(100vw - 28px))!important;display:flex!important;justify-content:center!important;pointer-events:none!important;transform:translate(-50%,-16px)!important;opacity:0!important;visibility:hidden!important;transition:transform .38s cubic-bezier(.2,.85,.25,1),opacity .22s ease,visibility .22s ease!important}
.wct-dynamic-island-host.is-visible{opacity:1!important;visibility:visible!important;transform:translate(-50%,0)!important}
.wct-dynamic-island{position:relative!important;display:flex!important;align-items:center!important;gap:11px!important;width:156px!important;min-height:54px!important;max-width:100%!important;box-sizing:border-box!important;padding:8px 13px!important;border:1px solid rgba(255,255,255,.09)!important;border-radius:28px!important;background:linear-gradient(145deg,#17191D,#08090B)!important;color:#F8FAFC!important;box-shadow:0 13px 38px rgba(5,9,15,.28),inset 0 1px 0 rgba(255,255,255,.08)!important;overflow:hidden!important;pointer-events:auto!important;cursor:pointer!important;transition:width .42s cubic-bezier(.18,.86,.25,1),min-height .32s ease,border-radius .32s ease,box-shadow .32s ease!important}
.wct-dynamic-island-host.is-visible .wct-dynamic-island.is-expanded{width:100%!important;min-height:72px!important;border-radius:23px!important;box-shadow:0 18px 48px rgba(5,9,15,.32),inset 0 1px 0 rgba(255,255,255,.09)!important}
.wct-di-icon{position:relative!important;display:grid!important;place-items:center!important;flex:0 0 34px!important;width:34px!important;height:34px!important;border-radius:50%!important;background:rgba(255,255,255,.10)!important;color:#E8EEF7!important;font-size:16px!important;font-weight:900!important}
.wct-di-icon:after{content:"";position:absolute;inset:-3px;border:1px solid currentColor;border-radius:50%;opacity:.2}
.wct-dynamic-island[data-kind="success"] .wct-di-icon{background:rgba(45,196,125,.18)!important;color:#53E09A!important}
.wct-dynamic-island[data-kind="error"] .wct-di-icon{background:rgba(255,91,91,.17)!important;color:#FF7777!important}
.wct-dynamic-island[data-kind="warning"] .wct-di-icon{background:rgba(255,181,55,.17)!important;color:#FFC15A!important}
.wct-dynamic-island[data-kind="info"] .wct-di-icon{background:rgba(92,160,255,.17)!important;color:#83B9FF!important}
.wct-di-copy{display:flex!important;flex:1 1 auto!important;min-width:0!important;flex-direction:column!important;gap:3px!important;opacity:0!important;transform:translateX(-5px)!important;transition:opacity .2s ease .12s,transform .25s ease .08s!important}
.wct-dynamic-island-host.is-visible .wct-dynamic-island.is-expanded .wct-di-copy{opacity:1!important;transform:translateX(0)!important}
.wct-di-title{display:block!important;color:#AEB9C8!important;font-size:8px!important;font-weight:900!important;letter-spacing:.12em!important;line-height:1.1!important;text-transform:uppercase!important}
.wct-di-message{display:block!important;max-width:100%!important;color:#F8FAFC!important;font-size:11px!important;font-weight:650!important;line-height:1.35!important;overflow-wrap:anywhere!important}
.wct-di-close{display:grid!important;place-items:center!important;flex:0 0 25px!important;width:25px!important;height:25px!important;padding:0!important;border:0!important;border-radius:50%!important;background:rgba(255,255,255,.09)!important;color:#D4DCE7!important;font-size:15px!important;line-height:1!important;cursor:pointer!important;opacity:0!important;transition:opacity .18s ease,background .18s ease!important}
.wct-dynamic-island-host.is-visible .wct-dynamic-island.is-expanded .wct-di-close{opacity:1!important}
.wct-di-close:hover{background:rgba(255,255,255,.18)!important}
.wct-di-progress{position:absolute!important;left:0!important;right:0!important;bottom:0!important;height:2px!important;background:rgba(255,255,255,.08)!important;overflow:hidden!important}
.wct-di-progress:after{content:"";display:block;width:100%;height:100%;background:var(--wct-di-accent,#83B9FF)!important;transform:scaleX(1);transform-origin:left center}
.wct-dynamic-island-host.is-visible .wct-di-progress:after{animation:wctDynamicIslandTimer var(--wct-di-duration,3800ms) linear forwards}
.wct-dynamic-island[data-kind="success"]{--wct-di-accent:#53E09A}
.wct-dynamic-island[data-kind="error"]{--wct-di-accent:#FF7777}
.wct-dynamic-island[data-kind="warning"]{--wct-di-accent:#FFC15A}
.wct-dynamic-island[data-kind="info"]{--wct-di-accent:#83B9FF}
@keyframes wctDynamicIslandTimer{to{transform:scaleX(0)}}
.wct-system-dialog-backdrop{position:fixed!important;inset:0!important;z-index:1000005!important;display:grid!important;place-items:center!important;padding:20px!important;box-sizing:border-box!important;background:rgba(10,16,25,.42)!important;backdrop-filter:blur(8px)!important;-webkit-backdrop-filter:blur(8px)!important;opacity:0!important;visibility:hidden!important;transition:opacity .2s ease,visibility .2s ease!important}
.wct-system-dialog-backdrop.is-open{opacity:1!important;visibility:visible!important}
.wct-system-dialog{width:min(440px,100%)!important;box-sizing:border-box!important;padding:23px!important;border:1px solid #E3EAF2!important;border-radius:21px!important;background:rgba(255,255,255,.98)!important;color:#203147!important;box-shadow:0 28px 90px rgba(12,24,42,.28)!important;transform:translateY(12px) scale(.98)!important;transition:transform .24s cubic-bezier(.2,.8,.2,1)!important}
.wct-system-dialog-backdrop.is-open .wct-system-dialog{transform:translateY(0) scale(1)!important}
.wct-system-dialog-icon{display:grid!important;place-items:center!important;width:42px!important;height:42px!important;margin-bottom:14px!important;border-radius:14px!important;background:#FFF2E3!important;color:#D97706!important;font-size:20px!important;font-weight:950!important}
.wct-system-dialog.is-danger .wct-system-dialog-icon{background:#FFF0F0!important;color:#D54646!important}
.wct-system-dialog h2{margin:0 0 8px!important;color:#18283C!important;font-size:17px!important;font-weight:900!important;letter-spacing:-.02em!important}
.wct-system-dialog p{margin:0!important;color:#607188!important;font-size:12px!important;line-height:1.7!important;white-space:pre-line!important;overflow-wrap:anywhere!important}
.wct-system-dialog-actions{display:flex!important;justify-content:flex-end!important;gap:9px!important;margin-top:23px!important}
.wct-system-dialog-actions button{min-height:40px!important;padding:0 15px!important;border:1px solid #D8E1EC!important;border-radius:11px!important;background:#F8FAFC!important;color:#42556D!important;font-size:11px!important;font-weight:850!important;cursor:pointer!important;transition:transform .16s ease,background .16s ease!important}
.wct-system-dialog-actions button:hover{transform:translateY(-1px)!important;background:#EEF3F8!important}
.wct-system-dialog-actions .wct-dialog-confirm{border-color:#E88916!important;background:#F28C18!important;color:#fff!important;box-shadow:0 5px 14px rgba(215,124,19,.18)!important}
.wct-system-dialog-actions .wct-dialog-confirm:hover{background:#DE780E!important}
.wct-system-dialog.is-danger .wct-system-dialog-actions .wct-dialog-confirm{border-color:#C94343!important;background:#D94D4D!important;box-shadow:0 5px 14px rgba(217,77,77,.18)!important}
.wct-system-dialog.is-danger .wct-system-dialog-actions .wct-dialog-confirm:hover{background:#BE3838!important}
body.wct-system-dialog-open{overflow:hidden!important}
@media(max-width:560px){.wct-dynamic-island-host{top:max(9px,env(safe-area-inset-top))!important;width:calc(100vw - 22px)!important}.wct-dynamic-island-host.is-visible .wct-dynamic-island.is-expanded{min-height:68px!important;border-radius:21px!important}.wct-di-message{font-size:10px!important}.wct-system-dialog-backdrop{padding:14px!important}.wct-system-dialog{padding:20px!important;border-radius:18px!important}}
@media(prefers-reduced-motion:reduce){.wct-dynamic-island-host,.wct-dynamic-island,.wct-di-copy,.wct-system-dialog-backdrop,.wct-system-dialog{transition:none!important}.wct-dynamic-island-host.is-visible .wct-di-progress:after{animation:none!important;transform:scaleX(0)!important}}
\`;
  const runtime = String.raw\`
(function(){
  'use strict';
  if(window.__WCT_NOTIFICATION_SYSTEM__)return;
  window.__WCT_NOTIFICATION_SYSTEM__=true;
  var islandTimer=null,confirmQueue=Promise.resolve(),dialogSequence=0;
  function classify(message,options){
    options=options||{};if(options.type)return options.type;
    var s=String(message||'').toLowerCase();
    if(/gagal|error|ditolak|tidak berhasil|belum berhasil|tidak dapat|tidak ditemukan/.test(s))return 'error';
    if(/peringatan|perhatian|belum 100|akan dihapus|nonaktifkan|risiko/.test(s))return 'warning';
    if(/berhasil|tersimpan|dikirim|dihapus|diperbarui|dibuat|dipulihkan|selesai/.test(s))return 'success';
    return 'info';
  }
  var iconMap={success:'✓',error:'!',warning:'!',info:'i'},titleMap={success:'Berhasil',error:'Terjadi Kesalahan',warning:'Perhatian',info:'Informasi'};
  function ensureIsland(){
    var host=document.getElementById('wctDynamicIslandHost');if(host)return host;
    host=document.createElement('div');host.id='wctDynamicIslandHost';host.className='wct-dynamic-island-host';
    host.innerHTML='<div id="wctDynamicIsland" class="wct-dynamic-island is-expanded" data-kind="info" role="status" aria-live="polite" aria-atomic="true"><span class="wct-di-icon" id="wctDynamicIslandIcon">i</span><span class="wct-di-copy"><span class="wct-di-title" id="wctDynamicIslandTitle">Informasi</span><span class="wct-di-message" id="wctDynamicIslandMessage"></span></span><button type="button" class="wct-di-close" id="wctDynamicIslandClose" aria-label="Tutup notifikasi">×</button><span class="wct-di-progress"></span></div>';
    document.body.appendChild(host);
    var pill=host.querySelector('#wctDynamicIsland');
    pill.addEventListener('click',function(event){if(event.target&&event.target.closest('#wctDynamicIslandClose'))return;pill.classList.toggle('is-expanded');});
    host.querySelector('#wctDynamicIslandClose').addEventListener('click',function(event){event.stopPropagation();hideIsland();});
    return host;
  }
  function hideIsland(){var host=document.getElementById('wctDynamicIslandHost');if(host)host.classList.remove('is-visible');if(islandTimer){clearTimeout(islandTimer);islandTimer=null;}}
  function notify(message,options){
    options=typeof options==='string'?{type:options}:(options||{});
    var text=String(message==null?'':message).trim();if(!text)return;
    var kind=classify(text,options),duration=Number(options.duration)||((kind==='error'||kind==='warning')?5200:3800);
    var host=ensureIsland(),pill=host.querySelector('#wctDynamicIsland');
    pill.dataset.kind=kind;pill.style.setProperty('--wct-di-duration',duration+'ms');
    host.querySelector('#wctDynamicIslandIcon').textContent=iconMap[kind]||'i';
    host.querySelector('#wctDynamicIslandTitle').textContent=String(options.title||titleMap[kind]||'Informasi');
    host.querySelector('#wctDynamicIslandMessage').textContent=text;
    pill.classList.remove('is-expanded');host.classList.remove('is-visible');void pill.offsetWidth;
    host.classList.add('is-visible');requestAnimationFrame(function(){pill.classList.add('is-expanded');});
    if(islandTimer)clearTimeout(islandTimer);islandTimer=setTimeout(hideIsland,duration);
  }
  window.wctNotify=notify;window.toast=notify;window.safeToast=notify;
  function showConfirm(message,options){
    return new Promise(function(resolve){
      options=options||{};var previous=document.activeElement,seq=++dialogSequence,done=false;
      var text=String(message==null?'Lanjutkan tindakan ini?':message),lower=text.toLowerCase();
      var danger=options.danger===true||/hapus permanen|hapus case|hapus user|hapus akses|hapus kategori|hapus divisi|hapus .*dari daftar|delete permanently/.test(lower);
      var title=options.title||(danger?'Konfirmasi Penghapusan':'Konfirmasi Tindakan');
      var confirmText=options.confirmText||(danger?'Ya, Hapus Permanen':'Ya, Lanjutkan'),cancelText=options.cancelText||'Batal';
      var shade=document.createElement('div');shade.className='wct-system-dialog-backdrop';
      shade.innerHTML='<section class="wct-system-dialog '+(danger?'is-danger':'')+'" role="alertdialog" aria-modal="true" aria-labelledby="wctDialogTitle'+seq+'" aria-describedby="wctDialogMessage'+seq+'"><div class="wct-system-dialog-icon" aria-hidden="true">'+(danger?'!':'?')+'</div><h2 id="wctDialogTitle'+seq+'"></h2><p id="wctDialogMessage'+seq+'"></p><div class="wct-system-dialog-actions"><button type="button" class="wct-dialog-cancel"></button><button type="button" class="wct-dialog-confirm"></button></div></section>';
      var cancel=shade.querySelector('.wct-dialog-cancel'),yes=shade.querySelector('.wct-dialog-confirm');
      shade.querySelector('h2').textContent=title;shade.querySelector('p').textContent=text;cancel.textContent=cancelText;yes.textContent=confirmText;
      function finish(value){
        if(done)return;done=true;document.removeEventListener('keydown',onKey,true);
        document.body.classList.remove('wct-system-dialog-open');shade.classList.remove('is-open');
        setTimeout(function(){shade.remove();if(previous&&previous.focus)previous.focus();},210);resolve(value);
      }
      function onKey(event){
        if(event.key==='Escape'){event.preventDefault();finish(false);}
        if(event.key==='Enter'&&shade.isConnected){event.preventDefault();finish(true);}
        if(event.key==='Tab'){if(event.shiftKey&&document.activeElement===cancel){event.preventDefault();yes.focus();}else if(!event.shiftKey&&document.activeElement===yes){event.preventDefault();cancel.focus();}}
      }
      cancel.addEventListener('click',function(){finish(false);});yes.addEventListener('click',function(){finish(true);});
      shade.addEventListener('click',function(event){if(event.target===shade)finish(false);});
      document.addEventListener('keydown',onKey,true);document.body.appendChild(shade);document.body.classList.add('wct-system-dialog-open');
      requestAnimationFrame(function(){shade.classList.add('is-open');cancel.focus();});
    });
  }
  window.wctConfirm=function(message,options){
    return new Promise(function(resolve){
      confirmQueue=confirmQueue.then(function(){return showConfirm(message,options).then(resolve);}).catch(function(error){console.error('System confirmation failed:',error);resolve(false);});
    });
  };
  window.wctAlert=function(message,options){options=options||{};notify(message,{type:options.type||'info',title:options.title||'Informasi',duration:options.duration||5200});};
})();
\`;
  return html.replace('</body>', '<style id="wct-notification-system-style">' + css + '</style><script id="wct-notification-system-runtime">' + runtime + '</script></body>');
};
