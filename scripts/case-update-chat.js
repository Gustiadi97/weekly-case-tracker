module.exports = function applyCaseUpdateChat(html) {
  if (!html || !html.includes('</body>')) throw new Error('Could not find body for Case Update chat enhancement.');
  const runtime = String.raw`
(function(){
  if(window.__WCT_CASE_UPDATE_CHAT__)return;
  window.__WCT_CASE_UPDATE_CHAT__=true;

  function getState(){
    try{return state;}catch(error){return window.state||{};}
  }
  function getCurrentUser(){
    try{return currentUser||{};}catch(error){return window.currentUser||{};}
  }
  function getActions(caseId){
    return (getState().actions||[]).filter(function(item){return String(item.case_id)===String(caseId);});
  }
  function canWrite(caseId){
    var user=getCurrentUser(),parent=(getState().cases||[]).find(function(item){return String(item.id)===String(caseId);});
    if(!parent||parent.status==='closed'||user.role==='viewer')return false;
    try{
      if(typeof isCoordinator==='function'&&isCoordinator())return true;
      return getActions(caseId).some(function(item){return typeof canUpdateAction==='function'&&canUpdateAction(item);});
    }catch(error){return false;}
  }
  function initials(value){
    return String(value||'Pengguna').trim().split(/\s+/).slice(0,2).map(function(part){return part.charAt(0);}).join('').toUpperCase()||'U';
  }
  function createComposer(caseId){
    var form=document.createElement('form');
    form.className='wct-chat-composer';
    form.id='wctCaseUpdateComposer';
    form.dataset.caseId=caseId;
    form.innerHTML=
      '<input type="hidden" name="update_id" value="">'+
      '<div class="wct-chat-compose-main"><textarea name="update_text" required maxlength="5000" rows="2" placeholder="Tulis pesan untuk grup Case ini..."></textarea><button type="submit" class="wct-chat-send" data-wct-chat-control aria-label="Kirim Update" title="Kirim Update"><span class="wct-chat-send-icon" aria-hidden="true">➤</span><span class="wct-chat-send-text">Kirim</span></button></div>'+
      '<details class="wct-chat-extra-fields"><summary>Tambahkan kendala / langkah berikutnya (opsional)</summary><div class="wct-chat-extra-grid"><label>Kendala<textarea name="blocker" maxlength="2000" rows="2" placeholder="Kendala yang dihadapi..."></textarea></label><label>Langkah berikutnya<textarea name="next_step" maxlength="2000" rows="2" placeholder="Tindak lanjut berikutnya..."></textarea></label></div></details>'+
      '<div class="wct-chat-compose-footer"><button type="button" class="wct-chat-cancel-edit" data-wct-chat-control hidden>Batal edit</button><small>Update ini terlihat oleh anggota yang memiliki akses ke Case.</small></div>';
    form.addEventListener('submit',function(event){void window.submitCaseUpdate(event,caseId);});
    form.querySelector('.wct-chat-cancel-edit').addEventListener('click',function(){window.cancelCaseUpdateEdit(caseId);});
    return form;
  }
  function decorateCaseChat(section){
    if(!section||section.dataset.wctChatReady==='true')return;
    var caseId=section.dataset.caseId;
    if(!caseId)return;
    var body=section.querySelector('.wct-case-section-body');
    if(!body)return;
    var oldList=body.querySelector('.wct-case-update-list');
    var oldEmpty=body.querySelector('.wct-case-empty');
    var shell=document.createElement('div');shell.className='wct-case-chat-shell';
    var feed=document.createElement('div');feed.className='wct-chat-feed';
    var messages=oldList?Array.from(oldList.querySelectorAll('.wct-case-update-item')):[];
    var lastDay='';
    messages.forEach(function(message){
      var created=message.dataset.createdAt||'';
      var dayKey=created.slice(0,10);
      var date=new Date(created);
      var label=isNaN(date.getTime())?dayKey:date.toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
      if(dayKey&&dayKey!==lastDay){
        var divider=document.createElement('div');divider.className='wct-chat-day';
        var span=document.createElement('span');span.textContent=label;divider.appendChild(span);feed.appendChild(divider);
      }
      lastDay=dayKey;
      var author=message.querySelector('.wct-case-update-top strong');
      var authorName=author?author.textContent:'Pengguna';
      var mine=String(message.dataset.authorId||'')===String(getCurrentUser().id||'');
      var row=document.createElement('div');row.className='wct-chat-row '+(mine?'is-mine':'is-other');
      var avatar=document.createElement('div');avatar.className='wct-chat-avatar';avatar.textContent=initials(authorName);
      message.classList.add('wct-chat-bubble');
      message.classList.remove('wct-case-update-item');
      row.appendChild(avatar);row.appendChild(message);feed.appendChild(row);
    });
    if(oldList)oldList.remove();
    if(oldEmpty){
      var empty=document.createElement('div');empty.className='wct-chat-empty';
      empty.innerHTML='<span>💬</span><b>Belum ada pesan</b><small>Mulai percakapan dengan menulis perkembangan Case di bawah ini.</small>';
      feed.appendChild(empty);oldEmpty.remove();
    }
    shell.appendChild(feed);
    if(canWrite(caseId))shell.appendChild(createComposer(caseId));
    body.replaceChildren(shell);
    section.dataset.wctChatReady='true';
  }

  function addDeleteCaseButton(modal){
    if(!modal||modal.querySelector('.wct-delete-case-button'))return;
    var toolbar=modal.querySelector('.wct-case-detail-toolbar');
    var caseId=modal.dataset.caseId;
    if(!toolbar||!caseId)return;
    var user=getCurrentUser();
    if(user.role!=='admin'&&user.role!=='coordinator')return;
    var button=document.createElement('button');
    button.type='button';button.className='btn wct-delete-case-button';button.textContent='Hapus Case';
    button.addEventListener('click',function(){void window.deleteCasePermanently(caseId);});
    toolbar.appendChild(button);
  }

  function addCaseListDeleteButtons(){
    var user=getCurrentUser();
    if(user.role!=='admin'&&user.role!=='coordinator')return;
    document.querySelectorAll('.wct-cases-table tbody tr').forEach(function(row){
      if(row.querySelector('.wct-case-list-delete'))return;
      var edit=row.querySelector('button[onclick*="editCaseFormFromButton"],button[onclick*="editCaseForm("],[data-wct-case-edit-id]');
      if(!edit)return;
      var caseId=String(edit.dataset.caseId||edit.getAttribute('data-case-id')||edit.dataset.wctCaseEditId||row.dataset.caseId||'');
      if(!caseId){
        var source=String(edit.getAttribute('onclick')||'');
        var start=source.indexOf('editCaseForm(');
        if(start>=0){
          var args=source.slice(start+'editCaseForm('.length).trim();
          var quote=args.charAt(0);
          if(quote==="'"||quote==='"'){
            var end=args.indexOf(quote,1);
            if(end>1)caseId=args.slice(1,end);
          }
        }
      }
      if(!caseId)return;
      var cell=edit.closest('td')||edit.parentElement;
      if(!cell)return;
      var button=document.createElement('button');
      button.type='button';
      button.className='btn btn-sm wct-case-list-delete';
      button.textContent='Hapus';
      button.title='Hapus permanen Case dan seluruh tindakan terkait';
      button.setAttribute('aria-label','Hapus Case '+caseId);
      button.dataset.caseId=caseId;
      button.addEventListener('click',function(event){
        event.preventDefault();event.stopPropagation();
        if(typeof window.deleteCasePermanently==='function')void window.deleteCasePermanently(caseId);
        else if(window.toast)window.toast('Fitur hapus Case belum siap. Muat ulang halaman.');
      });
      edit.insertAdjacentElement('afterend',button);
    });
  }

  function enhance(){
    document.querySelectorAll('#modal .wct-case-update-section').forEach(decorateCaseChat);
    addDeleteCaseButton(document.getElementById('modal'));
    addCaseListDeleteButtons();
  }
  if(typeof MutationObserver!=='undefined'){
    var observer=new MutationObserver(enhance);
    observer.observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhance,{once:true});else enhance();

  window.openCaseUpdateForm=function(caseId,updateId){
    var form=document.getElementById('wctCaseUpdateComposer');
    if(!form||String(form.dataset.caseId)!==String(caseId)){return;}
    var existing=updateId?(getState().caseUpdates||[]).find(function(item){return String(item.id)===String(updateId)&&String(item.case_id)===String(caseId);}):null;
    if(updateId&&!existing){if(window.toast)window.toast('Pesan Update tidak ditemukan.');return;}
    var user=getCurrentUser();
    if(existing&&!((user.role==='admin'||user.role==='coordinator')||String(existing.created_by)===String(user.id))){
      if(window.toast)window.toast('Kamu hanya dapat mengedit pesan milik sendiri.');return;
    }
    form.elements.update_id.value=existing?existing.id:'';
    form.elements.update_text.value=existing?existing.update_text:'';
    form.elements.blocker.value=existing?existing.blocker||'':'';
    form.elements.next_step.value=existing?existing.next_step||'':'';
    var cancel=form.querySelector('.wct-chat-cancel-edit');
    if(cancel)cancel.hidden=!existing;
    var send=form.querySelector('.wct-chat-send-text');
    if(send)send.textContent=existing?'Simpan':'Kirim';
    var textarea=form.elements.update_text;
    if(textarea){form.scrollIntoView({behavior:'smooth',block:'center'});textarea.focus();}
  };

  window.cancelCaseUpdateEdit=function(caseId){
    var form=document.getElementById('wctCaseUpdateComposer');
    if(!form||String(form.dataset.caseId)!==String(caseId))return;
    form.reset();form.elements.update_id.value='';
    var cancel=form.querySelector('.wct-chat-cancel-edit');if(cancel)cancel.hidden=true;
    var send=form.querySelector('.wct-chat-send-text');if(send)send.textContent='Kirim';
  };

  window.submitCaseUpdate=async function(event,caseId){
    event.preventDefault();
    var form=event.currentTarget||event.target;
    if(!form||String(form.dataset.caseId)!==String(caseId))return;
    var stateNow=getState(),user=getCurrentUser();
    var parent=(stateNow.cases||[]).find(function(item){return String(item.id)===String(caseId);});
    if(!parent||parent.status==='closed'||user.role==='viewer'){if(window.toast)window.toast('Case tidak dapat diperbarui.');return;}
    if(!canWrite(caseId)){if(window.toast)window.toast('Kamu tidak memiliki izin untuk menulis Update Case ini.');return;}
    var data=new FormData(form),updateId=String(data.get('update_id')||'');
    var text=String(data.get('update_text')||'').trim();
    if(!text){if(window.toast)window.toast('Tulis pesan Update Case terlebih dahulu.');return;}
    var existing=updateId?(stateNow.caseUpdates||[]).find(function(item){return String(item.id)===updateId;}):null;
    if(updateId&&!existing){if(window.toast)window.toast('Pesan Update tidak ditemukan.');return;}
    if(existing&&!((user.role==='admin'||user.role==='coordinator')||String(existing.created_by)===String(user.id))){
      if(window.toast)window.toast('Kamu hanya dapat mengedit pesan milik sendiri.');return;
    }
    var db=window.wctSupabase;
    if(!db){if(window.toast)window.toast('Koneksi database belum siap.');return;}
    var button=form.querySelector('button[type="submit"]'),sendText=button&&button.querySelector('.wct-chat-send-text');
    if(button){button.disabled=true;if(sendText)sendText.textContent=existing?'Menyimpan...':'Mengirim...';}
    var now=new Date().toISOString();
    try{
      var payload={case_id:caseId,update_text:text,blocker:String(data.get('blocker')||'').trim(),next_step:String(data.get('next_step')||'').trim()};
      var result;
      if(existing){
        result=await db.from('wct_case_updates').update(Object.assign(payload,{edited_by:user.id,edited_at:now})).eq('id',existing.id).select('*').single();
      }else{
        payload.created_by=user.id;
        payload.author_name=String(user.full_name||user.login_id||'Pengguna');
        result=await db.from('wct_case_updates').insert(payload).select('*').single();
      }
      if(result.error)throw result.error;
      if(typeof window.refreshData==='function')await window.refreshData();
      if(typeof window.openCaseDetail==='function')window.openCaseDetail(caseId);
      if(window.toast)window.toast(existing?'Pesan Update Case berhasil diedit.':'Update Case berhasil dikirim ke grup.');
    }catch(error){
      console.error('Case chat update failed:',error);
      if(window.toast)window.toast('Gagal mengirim Update Case: '+(error.message||error));
      if(button){button.disabled=false;if(sendText)sendText.textContent=existing?'Simpan':'Kirim';}
    }
  };

  window.deleteCasePermanently=async function(caseId){
    var user=getCurrentUser();
    if(user.role!=='admin'&&user.role!=='coordinator'){if(window.toast)window.toast('Hanya Admin atau Koordinator yang dapat menghapus Case.');return;}
    var stateNow=getState(),current=(stateNow.cases||[]).find(function(item){return String(item.id)===String(caseId);});
    if(!current){if(window.toast)window.toast('Case tidak ditemukan atau sudah dihapus.');return;}
    var actionCount=(stateNow.actions||[]).filter(function(item){return String(item.case_id)===String(caseId);}).length;
    var updateCount=(stateNow.caseUpdates||[]).filter(function(item){return String(item.case_id)===String(caseId);}).length;
    var code=String(current.case_code||current.case_number||'CASE');
    if(!await window.wctConfirm('Anda akan menghapus permanen '+code+' — '+current.title+'.\\n\\nTindakan CA/PA: '+actionCount+'\\nPesan Update Case: '+updateCount+'\\n\\nRiwayat progress dan audit terkait ikut dihapus. Catatan Weekly Meeting tetap disimpan dan tautan Case dilepas. Tindakan ini tidak dapat dibatalkan.',{title:'Hapus Case Permanen',confirmText:'Hapus Permanen',danger:true}))return;
    var db=window.wctSupabase;
    if(!db){if(window.toast)window.toast('Koneksi database belum siap.');return;}
    try{
      var result=await db.rpc('wct_delete_case',{p_case_id:caseId});
      if(result.error)throw result.error;
      if(!result.data||result.data.ok!==true)throw new Error('Database belum mengonfirmasi penghapusan Case.');
      if(typeof window.refreshData==='function')await window.refreshData();
      if(typeof window.closeModal==='function')window.closeModal();
      if(typeof window.renderPage==='function')window.renderPage();
      if(window.toast)window.toast('Case '+code+' berhasil dihapus permanen.');
    }catch(error){
      console.error('Permanent Case deletion failed:',error);
      if(window.toast)window.toast('Gagal menghapus Case: '+(error.message||error));
    }
  };
})();
`;

  const css = String.raw`
.wct-case-update-section .wct-case-section-head{align-items:center!important}
.wct-case-update-tools{display:flex!important;align-items:center!important;gap:9px!important;flex-wrap:wrap!important}
.wct-case-chat-shell{overflow:hidden!important;border:1px solid #D6DCCF!important;border-radius:15px!important;background:#EDEDE3!important}
.wct-chat-feed{display:flex!important;flex-direction:column!important;gap:9px!important;max-height:min(58vh,620px)!important;min-height:190px!important;overflow-y:auto!important;overscroll-behavior:contain!important;padding:15px!important;background-color:#EDEDE3!important;background-image:radial-gradient(rgba(110,124,94,.075) .7px,transparent .7px)!important;background-size:14px 14px!important}
.wct-chat-day{display:flex!important;justify-content:center!important;margin:6px 0 8px!important}
.wct-chat-day span{padding:5px 11px!important;border:1px solid #E2E5DA!important;border-radius:8px!important;background:#F8F8F0!important;color:#74806F!important;font-size:9px!important;font-weight:750!important;box-shadow:0 1px 1px rgba(0,0,0,.04)!important}
.wct-chat-row{display:flex!important;align-items:flex-end!important;gap:7px!important;width:fit-content!important;max-width:min(88%,620px)!important}
.wct-chat-row.is-mine{align-self:flex-end!important;flex-direction:row-reverse!important}
.wct-chat-row.is-other{align-self:flex-start!important}
.wct-chat-avatar{display:grid!important;place-items:center!important;width:29px!important;height:29px!important;flex:0 0 29px!important;border-radius:50%!important;background:#E0C7A9!important;color:#6F563E!important;font-size:9px!important;font-weight:900!important;box-shadow:0 1px 2px rgba(0,0,0,.09)!important}
.wct-chat-bubble{position:relative!important;min-width:100px!important;max-width:100%!important;padding:9px 11px 7px!important;border-radius:12px 12px 12px 3px!important;background:#FFFFFF!important;color:#303A35!important;box-shadow:0 1px 1px rgba(30,40,30,.10)!important}
.wct-chat-row.is-mine .wct-chat-bubble{border-radius:12px 12px 3px 12px!important;background:#DDF7C8!important}
.wct-chat-bubble .wct-case-update-top{display:flex!important;justify-content:space-between!important;gap:10px!important;align-items:flex-start!important;margin:0 0 6px!important}
.wct-chat-bubble .wct-case-update-top>div:first-child{display:grid!important;gap:2px!important}
.wct-chat-bubble .wct-case-update-top strong{color:#16816D!important;font-size:10px!important;font-weight:900!important}
.wct-chat-row.is-mine .wct-case-update-top strong{color:#637C3D!important}
.wct-chat-bubble .wct-case-update-top small{color:#8A938B!important;font-size:8px!important}
.wct-chat-bubble>p{margin:0!important;color:#2F3833!important;font-size:11px!important;line-height:1.55!important;white-space:pre-wrap!important;overflow-wrap:anywhere!important}
.wct-chat-bubble .wct-case-update-extra{display:grid!important;gap:2px!important;margin-top:7px!important;padding:7px 9px!important;border-left:3px solid #D89A4B!important;border-radius:5px!important;background:rgba(245,239,220,.75)!important}
.wct-chat-bubble .wct-case-update-extra b{color:#95631F!important;font-size:8px!important;text-transform:uppercase!important}
.wct-chat-bubble .wct-case-update-extra span{color:#5C6258!important;font-size:10px!important;line-height:1.45!important}
.wct-chat-bubble .wct-case-update-edited{color:#89938B!important;font-size:8px!important}
.wct-chat-bubble .wct-case-update-top .btn{min-height:23px!important;padding:3px 6px!important;border-radius:6px!important;font-size:8px!important}
.wct-chat-empty{display:grid!important;justify-items:center!important;gap:5px!important;align-content:center!important;min-height:180px!important;color:#7E8878!important;text-align:center!important}
.wct-chat-empty>span{font-size:26px!important}
.wct-chat-empty b{color:#596653!important;font-size:11px!important}
.wct-chat-empty small{font-size:9px!important}
.wct-chat-composer{display:grid!important;gap:8px!important;padding:11px!important;border-top:1px solid #D9DECF!important;background:#F8F8F2!important}
.wct-chat-compose-main{display:flex!important;align-items:flex-end!important;gap:9px!important}
.wct-chat-compose-main textarea{flex:1!important;min-width:0!important;min-height:50px!important;max-height:150px!important;resize:vertical!important;padding:11px 13px!important;border:1px solid #DDE2D6!important;border-radius:14px!important;background:#FFFFFF!important;color:#354039!important;font-size:12px!important;line-height:1.45!important;box-shadow:none!important}
.wct-chat-send{display:flex!important;align-items:center!important;justify-content:center!important;gap:7px!important;flex:0 0 auto!important;min-width:86px!important;height:44px!important;padding:0 13px!important;border:0!important;border-radius:12px!important;background:#F28C18!important;color:#FFFFFF!important;font-size:11px!important;font-weight:850!important;cursor:pointer!important;box-shadow:0 3px 8px rgba(183,110,20,.18)!important;transform:none!important;white-space:nowrap!important}.wct-chat-send-icon{font-size:15px!important;line-height:1!important;transform:rotate(-12deg)!important}.wct-chat-send:disabled{opacity:.65!important;cursor:wait!important;box-shadow:none!important}
.wct-chat-extra-fields{padding:0 2px!important;color:#687462!important}
.wct-chat-extra-fields summary{display:inline-flex!important;align-items:center!important;width:fit-content!important;padding:5px 9px!important;border:1px solid #EADCC8!important;border-radius:999px!important;background:#FFF9F1!important;color:#8A6841!important;font-size:9px!important;font-weight:800!important;cursor:pointer!important;outline:none!important;list-style:none!important}.wct-chat-extra-fields summary::-webkit-details-marker{display:none!important}.wct-chat-extra-fields summary:focus,.wct-chat-extra-fields summary:focus-visible{outline:none!important;box-shadow:0 0 0 2px rgba(242,140,24,.16)!important}.wct-chat-extra-fields summary:hover{background:#FFF1DF!important;border-color:#E8C79E!important}
.wct-chat-extra-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:9px!important;margin-top:8px!important}
.wct-chat-extra-grid label{display:grid!important;gap:4px!important;color:#7B8576!important;font-size:9px!important;font-weight:800!important}
.wct-chat-extra-grid textarea{width:100%!important;min-height:55px!important;padding:8px!important;border:1px solid #DDE2D6!important;border-radius:8px!important;background:#FFFFFF!important;color:#39443B!important;font-size:10px!important;resize:vertical!important}
.wct-chat-compose-footer{display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:10px!important;min-height:22px!important}
.wct-chat-compose-footer small{color:#899184!important;font-size:8px!important}

.wct-chat-cancel-edit{border:0!important;background:transparent!important;color:#9B6034!important;font-size:9px!important;font-weight:800!important}
.wct-chat-cancel-edit[hidden]{display:none!important}
.wct-case-update-form-note,.wct-action-progress-quick-note{margin:0 0 15px!important;padding:11px 13px!important;border:1px solid #F0D9C0!important;border-radius:10px!important;background:#FFF8F0!important;color:#74501F!important;font-size:11px!important;line-height:1.6!important}
.wct-action-progress-quick-control{display:grid!important;grid-template-columns:minmax(0,1fr) 58px!important;align-items:center!important;gap:13px!important}
.wct-action-progress-quick-control input[type=range]{width:100%!important;min-width:0!important;accent-color:#F28C18!important}
.wct-action-progress-quick-control output{display:inline-grid!important;place-items:center!important;min-height:42px!important;border:1px solid #F0D7BA!important;border-radius:10px!important;background:#FFF4E8!important;color:#A65B0D!important;font-size:18px!important;font-weight:900!important}
.wct-action-progress-hint{color:#7A8490!important;font-size:10px!important;line-height:1.55!important}
.wct-delete-case-button,.wct-case-list-delete{border-color:#F0C7C7!important;background:#FFF4F4!important;color:#B74141!important}.wct-case-list-delete{margin-left:6px!important;min-height:30px!important;padding:5px 9px!important;font-size:9px!important;font-weight:850!important}.wct-delete-case-button:hover,.wct-case-list-delete:hover{background:#FDEAEA!important;border-color:#E5AAAA!important;color:#A63232!important}
.wct-delete-case-button:hover{background:#FDEAEA!important;border-color:#E5AAAA!important}
@media(max-width:680px){
 .wct-case-update-section .wct-case-section-head{align-items:flex-start!important;flex-direction:column!important}
 .wct-case-update-tools{width:100%!important;justify-content:space-between!important}
 .wct-chat-feed{max-height:52vh!important;min-height:160px!important;padding:10px 8px!important}
 .wct-chat-row{max-width:94%!important;gap:5px!important}
 .wct-chat-avatar{width:25px!important;height:25px!important;flex-basis:25px!important;font-size:8px!important}
 .wct-chat-bubble{min-width:90px!important;padding:8px 9px 6px!important}
 .wct-chat-bubble>p{font-size:10px!important}
 .wct-chat-extra-grid{grid-template-columns:minmax(0,1fr)!important}
 .wct-chat-composer{padding:9px!important}
 .wct-chat-compose-main textarea{font-size:16px!important;min-height:48px!important}.wct-chat-send{min-width:72px!important;height:42px!important;padding:0 10px!important;font-size:10px!important}
 .wct-chat-compose-footer small{max-width:50%!important}
 .wct-action-progress-quick-control{grid-template-columns:minmax(0,1fr) 54px!important;gap:9px!important}
}
`;

  return html.replace('</body>', '<style id="wct-case-update-chat-style">' + css + '</style><script id="wct-case-update-chat-runtime">' + runtime + '</script></body>');
};
