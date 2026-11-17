module.exports = function addMeetingEditRuntime(html) {
  if (!html || !html.includes('</body>')) throw new Error('Could not find document body for Weekly Meeting edit runtime.');
  const runtime = String.raw`
(function(){
  'use strict';
  if(window.__WCT_MEETING_EDIT_READY)return;
  window.__WCT_MEETING_EDIT_READY=true;

  function findMeeting(id){
    return (state.meetings||[]).find(function(item){return String(item.id)===String(id);})||null;
  }
  function safe(value){
    return typeof esc==='function'?esc(value==null?'':String(value)):String(value==null?'':value);
  }
  function canEdit(){
    if(typeof isCoordinator==='function'&&isCoordinator())return true;
    if(typeof toast==='function')toast('Hanya koordinator/admin yang dapat mengubah hasil meeting.');
    return false;
  }
  function caseChoices(meeting){
    var selected=Array.isArray(meeting.case_ids)?meeting.case_ids.map(String):[];
    return (state.cases||[]).filter(function(item){
      return item.status!=='closed'||selected.indexOf(String(item.id))>=0;
    }).map(function(item){
      var checked=selected.indexOf(String(item.id))>=0?' checked':'';
      var status=item.status==='closed'?' · Closed':'';
      return '<label class="wct-meeting-edit-case"><input type="checkbox" name="case_ids" value="'+safe(item.id)+'"'+checked+'><span><b>'+safe(item.case_code||'Case')+'</b> · '+safe(item.title||'')+'<small>'+safe(item.hub_code||'—')+status+'</small></span></label>';
    }).join('')||'<div class="empty">Belum ada Case yang dapat dipilih.</div>';
  }

  function openMeetingEditForm(id){
    if(!canEdit())return;
    var meeting=findMeeting(id);
    if(!meeting){if(typeof toast==='function')toast('Catatan meeting tidak ditemukan. Muat ulang halaman.');return;}
    if(typeof closeModal==='function')closeModal();

    var date=String(meeting.meeting_date||'').slice(0,10);
    var form='<div class="modal-head"><div><div class="eyebrow">MEETING MINUTES</div><h2>Edit Hasil Weekly Meeting</h2><p class="sub">Perubahan akan memperbarui catatan meeting yang sama.</p></div><button type="button" class="close" onclick="closeModal()">×</button></div>'+
      '<form id="wctMeetingEditForm" onsubmit="return submitMeetingEdit(event,\''+safe(meeting.id)+'\')">'+
      '<div class="modal-body"><div class="form-grid">'+
      '<div class="field"><label>Tanggal meeting *</label><input type="date" name="meeting_date" value="'+safe(date)+'" required></div>'+
      '<div class="field"><label>Judul meeting *</label><input name="title" value="'+safe(meeting.title||'')+'" required maxlength="160"></div>'+
      '<div class="field span-2"><label>Ringkasan pembahasan</label><textarea name="summary" placeholder="Topik utama yang dibahas...">'+safe(meeting.summary||'')+'</textarea></div>'+
      '<div class="field span-2"><label>Keputusan / arahan meeting</label><textarea name="decisions" placeholder="Keputusan, arahan, dan kesepakatan...">'+safe(meeting.decisions||'')+'</textarea></div>'+
      '<div class="field span-2"><label>Next steps</label><textarea name="next_steps" placeholder="Tindak lanjut sebelum meeting berikutnya...">'+safe(meeting.next_steps||'')+'</textarea></div>'+
      '<div class="field span-2"><label>Case yang dibahas</label><div class="wct-meeting-edit-cases">'+caseChoices(meeting)+'</div></div>'+
      '</div></div>'+
      '<div class="modal-foot"><button type="button" class="btn" data-wct-meeting-edit-cancel>Batal</button><button type="submit" class="btn btn-primary">Simpan Perubahan</button></div>'+
      '</form>';
    if(typeof openModal==='function')openModal(form,true);
  }

  async function submitMeetingEdit(event,id){
    event.preventDefault();
    if(!canEdit())return false;
    var meeting=findMeeting(id),form=event.currentTarget||event.target;
    if(!meeting||!form){if(typeof toast==='function')toast('Catatan meeting tidak ditemukan.');return false;}
    var data=new FormData(form);
    var updated={
      meeting_date:String(data.get('meeting_date')||''),
      title:String(data.get('title')||'').trim(),
      summary:String(data.get('summary')||''),
      decisions:String(data.get('decisions')||''),
      next_steps:String(data.get('next_steps')||''),
      case_ids:data.getAll('case_ids').map(function(value){return String(value);}),
      created_by:meeting.created_by||currentUser.id,
      created_at:meeting.created_at||new Date().toISOString(),
      updated_by:currentUser.id,
      updated_at:new Date().toISOString()
    };
    if(!updated.meeting_date||!updated.title){
      if(typeof toast==='function')toast('Tanggal dan judul meeting wajib diisi.');
      return false;
    }
    try{
      await fireDb.collection('meetings').doc(id).update(updated);
      Object.assign(meeting,updated);
      if(typeof closeModal==='function')closeModal();
      if(typeof renderMeeting==='function')renderMeeting();
      else if(typeof renderPage==='function')renderPage();
      if(typeof toast==='function')toast('Hasil Weekly Meeting berhasil diperbarui.');
    }catch(error){
      if(typeof toast==='function')toast('Gagal memperbarui meeting: '+(error&&error.message?error.message:'Kesalahan tidak diketahui.'));
    }
    return false;
  }

  function viewMeeting(id){
    var meeting=findMeeting(id);
    if(!meeting)return;
    var related=(Array.isArray(meeting.case_ids)?meeting.case_ids:[]).map(function(caseId){
      var item=(state.cases||[]).find(function(candidate){return String(candidate.id)===String(caseId);});
      return item?'<div class="meeting-row"><b>'+safe(item.case_code||'Case')+' · '+safe(item.title||'')+'</b><button type="button" class="btn btn-sm" data-wct-meeting-case="'+safe(item.id)+'">Buka</button></div>':'';
    }).join('')||'Tidak ada case terkait.';
    var footer='<div class="modal-foot"><button type="button" class="btn" data-wct-meeting-close>Tutup</button>'+
      (typeof isCoordinator==='function'&&isCoordinator()?'<button type="button" class="btn btn-primary" data-wct-meeting-edit="'+safe(meeting.id)+'">Edit Meeting</button>':'')+
      '</div>';
    var content='<div class="modal-head"><div><div class="eyebrow">MEETING MINUTES</div><h2>'+safe(meeting.title||'Weekly Meeting')+'</h2></div><button type="button" class="close" onclick="closeModal()">×</button></div>'+
      '<div class="modal-body"><div class="pill">'+safe(typeof fmtDate==='function'?fmtDate(meeting.meeting_date):meeting.meeting_date||'')+'</div>'+
      '<div class="section-title">Ringkasan</div><p style="white-space:pre-wrap;font-size:12px">'+safe(meeting.summary||'—')+'</p>'+
      '<div class="section-title">Keputusan / Arahan</div><p style="white-space:pre-wrap;font-size:12px">'+safe(meeting.decisions||'—')+'</p>'+
      '<div class="section-title">Next Steps</div><p style="white-space:pre-wrap;font-size:12px">'+safe(meeting.next_steps||'—')+'</p>'+
      '<div class="section-title">Case terkait</div>'+related+'</div>'+footer;
    if(typeof openModal==='function')openModal(content,true);
  }

  function addHistoryEditButtons(){
    if(!(typeof isCoordinator==='function'&&isCoordinator()))return;
    document.querySelectorAll('.meeting-box .meeting-row').forEach(function(row){
      var detail=row.querySelector('button[onclick^="viewMeeting("]');
      if(!detail||row.querySelector('[data-wct-meeting-edit]'))return;
      var match=(detail.getAttribute('onclick')||'').match(/viewMeeting\(['"]([^'"]+)['"]\)/);
      if(!match)return;
      var button=document.createElement('button');
      button.type='button';button.className='btn btn-sm';
      button.dataset.wctMeetingEdit=match[1];button.textContent='Edit';
      detail.parentNode.insertBefore(button,detail);
    });
  }

  var originalRenderMeeting=window.renderMeeting;
  if(typeof originalRenderMeeting==='function'&&!originalRenderMeeting.__wctMeetingEditWrapped){
    var wrappedRenderMeeting=function(){
      var result=originalRenderMeeting.apply(this,arguments);
      addHistoryEditButtons();
      return result;
    };
    wrappedRenderMeeting.__wctMeetingEditWrapped=true;
    window.renderMeeting=wrappedRenderMeeting;
  }

  document.addEventListener('click',function(event){
    var edit=event.target.closest&&event.target.closest('[data-wct-meeting-edit]');
    if(edit){event.preventDefault();openMeetingEditForm(edit.dataset.wctMeetingEdit);return;}
    var close=event.target.closest&&event.target.closest('[data-wct-meeting-edit-cancel],[data-wct-meeting-close]');
    if(close){event.preventDefault();if(typeof closeModal==='function')closeModal();return;}
    var openCase=event.target.closest&&event.target.closest('[data-wct-meeting-case]');
    if(openCase){
      event.preventDefault();
      var caseId=openCase.dataset.wctMeetingCase;
      if(typeof closeModal==='function')closeModal();
      if(typeof openCaseDetail==='function')openCaseDetail(caseId);
    }
  });

  window.openMeetingEditForm=openMeetingEditForm;
  window.submitMeetingEdit=submitMeetingEdit;
  window.viewMeeting=viewMeeting;
  window.WCTMeetingEditReady=true;
})();
`;
  const style = '.wct-meeting-edit-cases{display:grid;gap:4px;max-height:190px;overflow:auto;padding:9px;border:1px solid var(--line);border-radius:10px;background:var(--white)}.wct-meeting-edit-case{display:flex!important;align-items:flex-start!important;gap:9px!important;padding:8px!important;border-bottom:1px solid var(--line);border-radius:7px}.wct-meeting-edit-case:last-child{border-bottom:0}.wct-meeting-edit-case input{width:auto!important;min-width:16px;margin-top:2px;accent-color:var(--secondary)}.wct-meeting-edit-case span{display:grid;gap:3px;min-width:0;font-size:11px}.wct-meeting-edit-case b{display:inline;color:var(--ink)}.wct-meeting-edit-case small{color:var(--muted);font-size:9px}';
  return html.replace('</body>', '<style id="wct-meeting-edit-style">' + style + '</style><script id="wct-meeting-edit-runtime">' + runtime + '</script></body>');
};
