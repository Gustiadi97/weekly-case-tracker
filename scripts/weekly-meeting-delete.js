module.exports = function addWeeklyMeetingDelete(html) {
  if (!html || !html.includes('</body>')) throw new Error('Could not find document body for Weekly Meeting delete controls.');
  const runtime = String.raw`(function(){
  'use strict';
  if(window.__WCT_WEEKLY_MEETING_DELETE_READY)return;
  window.__WCT_WEEKLY_MEETING_DELETE_READY=true;
  var activeDetailMeetingId='';

  function canManage(){return typeof isCoordinator==='function'&&isCoordinator();}
  function findMeeting(id){return (state.meetings||[]).find(function(item){return String(item.id)===String(id);})||null;}
  function addIconButton(id,context){
    var button=document.createElement('button');
    button.type='button';button.className='btn btn-sm wct-meeting-delete-icon';
    button.dataset.wctMeetingDelete=String(id);button.title='Hapus riwayat Weekly Meeting';
    button.setAttribute('aria-label','Hapus riwayat Weekly Meeting');
    button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v5M14 11v5"/></svg>';
    if(context)context.appendChild(button);
    return button;
  }
  function decorateHistory(){
    if(!canManage())return;
    document.querySelectorAll('.meeting-box .meeting-row').forEach(function(row){
      var detail=row.querySelector('button[onclick^="viewMeeting("]');
      if(!detail||row.querySelector('[data-wct-meeting-delete]'))return;
      var match=(detail.getAttribute('onclick')||'').match(/viewMeeting\(['"]([^'"]+)['"]\)/);
      if(!match)return;
      detail.parentNode.insertBefore(addIconButton(match[1],null),detail);
    });
  }
  function decorateDetail(){
    if(!canManage()||!activeDetailMeetingId)return;
    var modal=document.getElementById('modal');
    if(!modal)return;
    var footer=modal.querySelector('.modal-foot');
    if(!footer||footer.querySelector('[data-wct-meeting-delete]')||!footer.querySelector('[data-wct-meeting-edit]'))return;
    addIconButton(activeDetailMeetingId,footer);
  }
  function wrapRenderMeeting(){
    if(typeof window.renderMeeting!=='function'||window.renderMeeting.__wctWeeklyDeleteWrapped)return;
    var original=window.renderMeeting;
    var wrapped=function(){var result=original.apply(this,arguments);decorateHistory();return result;};
    wrapped.__wctWeeklyDeleteWrapped=true;window.renderMeeting=wrapped;
  }
  function wrapViewMeeting(){
    if(typeof window.viewMeeting!=='function'||window.viewMeeting.__wctWeeklyDeleteWrapped)return;
    var original=window.viewMeeting;
    var wrapped=function(id){activeDetailMeetingId=String(id||'');var result=original.apply(this,arguments);decorateDetail();return result;};
    wrapped.__wctWeeklyDeleteWrapped=true;window.viewMeeting=wrapped;
  }
  function confirmDelete(meeting){
    return new Promise(function(resolve){
      if(window.__WCTWeeklyDeleteConfirm)window.__WCTWeeklyDeleteConfirm(false);
      var previousFocus=document.activeElement;
      var overlay=document.createElement('div');
      overlay.className='wct-action-delete-overlay wct-weekly-delete-overlay';
      overlay.innerHTML='<div class="wct-action-delete-dialog" role="alertdialog" aria-modal="true" aria-labelledby="wct-weekly-delete-title" aria-describedby="wct-weekly-delete-description" tabindex="-1">'+
        '<div class="wct-action-delete-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.9 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg></div>'+
        '<div class="wct-action-delete-content"><h2 id="wct-weekly-delete-title">Hapus riwayat Weekly Meeting?</h2><p id="wct-weekly-delete-description">Catatan meeting yang akan dihapus:</p><strong class="wct-action-delete-name"></strong><p class="wct-action-delete-warning">Riwayat meeting dan tautan Case terkait akan dihapus. Data Case dan Action yang dibahas tidak ikut terhapus. Tindakan ini tidak dapat dibatalkan.</p></div>'+
        '<div class="wct-action-delete-footer"><button type="button" class="wct-action-delete-cancel" onclick="wctCancelWeeklyMeetingDelete()">Batal</button><button type="button" class="wct-action-delete-confirm" onclick="wctAcceptWeeklyMeetingDelete()"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v5M14 11v5"/></svg>Hapus Riwayat</button></div>'+
        '</div>';
      overlay.querySelector('.wct-action-delete-name').textContent=String(meeting&&meeting.title||'Weekly Meeting');
      var cancelButton=overlay.querySelector('.wct-action-delete-cancel');
      var confirmButton=overlay.querySelector('.wct-action-delete-confirm');
      var finished=false;
      function finish(confirmed){
        if(finished)return;finished=true;
        document.removeEventListener('keydown',onKey,true);overlay.remove();
        if(window.__WCTWeeklyDeleteConfirm===finish)window.__WCTWeeklyDeleteConfirm=null;
        if(previousFocus&&previousFocus.isConnected&&typeof previousFocus.focus==='function'){
          try{previousFocus.focus({preventScroll:true});}catch(ignore){previousFocus.focus();}
        }
        resolve(!!confirmed);
      }
      function onKey(event){
        if(event.key==='Escape'){event.preventDefault();event.stopPropagation();finish(false);return;}
        if(event.key==='Tab'){
          if(event.shiftKey&&document.activeElement===cancelButton){event.preventDefault();confirmButton.focus();}
          else if(!event.shiftKey&&document.activeElement===confirmButton){event.preventDefault();cancelButton.focus();}
        }
      }
      window.__WCTWeeklyDeleteConfirm=finish;
      overlay.addEventListener('click',function(event){if(event.target===overlay)finish(false);});
      document.addEventListener('keydown',onKey,true);document.body.appendChild(overlay);
      requestAnimationFrame(function(){cancelButton.focus();});
    });
  }
  window.wctCancelWeeklyMeetingDelete=function(){if(window.__WCTWeeklyDeleteConfirm)window.__WCTWeeklyDeleteConfirm(false);};
  window.wctAcceptWeeklyMeetingDelete=function(){if(window.__WCTWeeklyDeleteConfirm)window.__WCTWeeklyDeleteConfirm(true);};

  window.deleteMeeting=async function(id,button){
    if(!canManage()){if(typeof toast==='function')toast('Hanya Admin atau Koordinator yang dapat menghapus riwayat Weekly Meeting.');return;}
    var meeting=findMeeting(id);
    if(!meeting){if(typeof toast==='function')toast('Riwayat Weekly Meeting tidak ditemukan.');return;}
    if(button&&button.dataset.wctDeleting==='1')return;
    if(!window.wctSupabase||typeof window.wctSupabase.rpc!=='function'){
      if(typeof toast==='function')toast('Layanan hapus riwayat belum siap. Muat ulang halaman dan coba kembali.');
      return;
    }
    var confirmed=await confirmDelete(meeting);
    if(!confirmed)return;
    var openedFromModal=!!(button&&button.closest&&button.closest('#modal'));
    if(button){button.disabled=true;button.dataset.wctDeleting='1';button.setAttribute('aria-busy','true');}
    try{
      var result=await window.wctSupabase.rpc('wct_delete_meeting',{p_meeting_id:id});
      if(result.error)throw result.error;
      if(result.data&&result.data.ok===false)throw new Error(result.data.message||'Penghapusan riwayat Weekly Meeting gagal.');
      if(window.WCTWeeklyMeetingDraft&&typeof window.WCTWeeklyMeetingDraft.clearMeeting==='function')window.WCTWeeklyMeetingDraft.clearMeeting(id);
      state.meetings=(state.meetings||[]).filter(function(item){return String(item.id)!==String(id);});
      var refreshError=null;
      try{if(typeof refreshData==='function')await refreshData();}catch(error){refreshError=error;console.error('Meeting deleted, but refresh failed:',error);}
      if(openedFromModal&&typeof closeModal==='function')closeModal();
      activeDetailMeetingId='';
      if(typeof window.renderMeeting==='function')window.renderMeeting();
      else if(typeof renderPage==='function')renderPage();
      if(typeof toast==='function')toast(refreshError?'Riwayat Weekly Meeting berhasil dihapus. Daftar belum berhasil dimuat ulang.':'Riwayat Weekly Meeting berhasil dihapus.');
    }catch(error){
      console.error('Delete Weekly Meeting failed:',error);
      if(button){button.disabled=false;delete button.dataset.wctDeleting;button.removeAttribute('aria-busy');}
      if(typeof toast==='function')toast('Gagal menghapus riwayat Weekly Meeting: '+(error.message||error));
    }
  };
  wrapRenderMeeting();wrapViewMeeting();decorateHistory();
  document.addEventListener('click',function(event){
    var remove=event.target.closest&&event.target.closest('[data-wct-meeting-delete]');
    if(remove){event.preventDefault();window.deleteMeeting(remove.dataset.wctMeetingDelete,remove);return;}
  });
  if(!window.__WCTWeeklyDeleteObserver){
    window.__WCTWeeklyDeleteObserver=new MutationObserver(function(){
      decorateHistory();decorateDetail();wrapRenderMeeting();wrapViewMeeting();
    });
    window.__WCTWeeklyDeleteObserver.observe(document.body,{childList:true,subtree:true});
  }
  window.WCTWeeklyMeetingDeleteReady=true;
})();
`;
  try { new Function(runtime); } catch (error) { throw new Error('Weekly Meeting delete runtime syntax check failed: ' + error.message); }
  const style = ".wct-meeting-delete-icon{display:inline-flex!important;align-items:center!important;justify-content:center!important;width:32px!important;min-width:32px!important;height:32px!important;min-height:32px!important;padding:0!important;border:1px solid #EFC9CD!important;border-radius:9px!important;background:#FFF4F4!important;color:#A83D49!important;box-shadow:none!important}.wct-meeting-delete-icon svg{width:14px!important;height:14px!important;fill:none!important;stroke:currentColor!important;stroke-width:1.8!important;stroke-linecap:round!important;stroke-linejoin:round!important}.wct-meeting-delete-icon:hover{background:#FDEBEC!important;border-color:#D98289!important;color:#8F2D39!important}.wct-weekly-delete-overlay{z-index:1000002!important}";
  return html.replace('</body>', '<style id="wct-weekly-meeting-delete-style">' + style + '</style><script id="wct-weekly-meeting-delete-runtime">' + runtime + '</script></body>');
};
