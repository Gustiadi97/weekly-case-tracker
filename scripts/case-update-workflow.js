module.exports = function applyCaseUpdateWorkflow(html) {
  if (!html || !html.includes('</body>')) throw new Error('Could not find document body for Case Update workflow.');

  const openTag = '<script id="wct-picapa-workflow">';
  const closeTag = '</script>';
  const scriptStart = html.indexOf(openTag);
  const scriptEnd = scriptStart >= 0 ? html.indexOf(closeTag, scriptStart + openTag.length) : -1;
  if (scriptStart < 0 || scriptEnd < 0) throw new Error('PICAPA workflow script not found for Case Update integration.');

  let workflow = html.slice(scriptStart + openTag.length, scriptEnd);
  const timelineStart = workflow.indexOf('var timeline=logs.map(function(log){');
  const meetingsStart = workflow.indexOf('var meetings=state.meetings.filter(function(m){', timelineStart);
  if (timelineStart < 0 || meetingsStart < 0) throw new Error('Case history section markers were not found.');

  const caseHistory = String.raw`var caseUpdates=(state.caseUpdates||[]).filter(function(item){return item.case_id===id;}).slice().sort(function(a,b){return String(b.created_at||'').localeCompare(String(a.created_at||''));});
  var canWriteCaseUpdate=c.status!=='closed'&&currentUser?.role!=='viewer'&&(isCoordinator()||acts.some(function(item){return canUpdateAction(item);}));
  var updateRows=caseUpdates.map(function(item){
    var canEdit=isCoordinator()||item.created_by===currentUser.id;
    var edit=canEdit&&c.status!=='closed'?'<button type="button" class="btn btn-sm" onclick="openCaseUpdateForm(\''+id+'\',\''+item.id+'\')">Edit</button>':'';
    var edited=item.edited_at?'<small class="wct-case-update-edited">Diedit '+time(item.edited_at)+'</small>':'';
    return '<article class="wct-case-update-item"><div class="wct-case-update-top"><div><strong>'+safe(item.author_name||owner(item.created_by)||'Pengguna')+'</strong><small>'+time(item.created_at)+'</small></div><div>'+edit+'</div></div><p>'+safe(item.update_text||'')+'</p>'+(item.blocker?'<div class="wct-case-update-extra"><b>Kendala</b><span>'+safe(item.blocker)+'</span></div>':'')+(item.next_step?'<div class="wct-case-update-extra"><b>Langkah berikutnya</b><span>'+safe(item.next_step)+'</span></div>':'')+edited+'</article>';
  }).join('');
  var addCaseUpdate=canWriteCaseUpdate?'<button type="button" class="btn btn-primary" onclick="openCaseUpdateForm(\''+id+'\')">＋ Tambah Update</button>':'';
  var history='<section class="wct-case-section wct-case-update-section"><div class="wct-case-section-head"><div><h3>Update Case</h3><p>Kronologi perkembangan umum Case, terpisah dari progres Corrective dan Preventive Action.</p></div><div class="wct-case-update-tools"><span class="wct-case-tag">'+caseUpdates.length+' Update</span>'+addCaseUpdate+'</div></div><div class="wct-case-section-body">'+(updateRows?'<div class="wct-case-update-list">'+updateRows+'</div>':'<div class="wct-case-empty"><b>Belum ada Update Case</b><span>Catat hasil koordinasi, perkembangan penanganan, kendala umum, atau informasi terbaru Case di sini.</span></div>')+'</div></section>';
  `;
  workflow = workflow.slice(0, timelineStart) + caseHistory + workflow.slice(meetingsStart);

  const injected = String.raw`
  window.openCaseUpdateForm=function(caseId,updateId){
    var parent=state.cases.find(function(item){return item.id===caseId;});
    if(!parent){toast('Case tidak ditemukan.');return;}
    if(parent.status==='closed'){toast('Case sudah ditutup. Update bersifat read-only.');return;}
    if(currentUser?.role==='viewer'){toast('Akun Viewer hanya dapat membaca.');return;}
    var actions=state.actions.filter(function(item){return item.case_id===caseId;});
    var allowed=isCoordinator()||actions.some(function(item){return canUpdateAction(item);});
    if(!allowed){toast('Hanya Koordinator/Admin atau PIC yang ditugaskan pada Case ini yang dapat menambahkan Update.');return;}
    var existing=updateId?(state.caseUpdates||[]).find(function(item){return item.id===updateId;}):null;
    if(updateId&&!existing){toast('Update Case tidak ditemukan.');return;}
    if(existing&&!isCoordinator()&&existing.created_by!==currentUser.id){toast('Kamu hanya dapat mengedit Update Case milik sendiri.');return;}
    var html='<div class="modal-head"><div><div class="eyebrow">CASE WORKSPACE / UPDATE</div><h2>'+(existing?'Edit Update Case':'Tambah Update Case')+'</h2><p class="sub">'+safe(parent.case_code||parent.case_number||'CASE')+' · '+safe(parent.title)+'</p></div><button type="button" class="close" onclick="closeModal()">×</button></div>'+
      '<form id="wctCaseUpdateForm" onsubmit="submitCaseUpdate(event,\''+caseId+'\',\''+(existing?existing.id:'')+'\')"><div class="modal-body"><div class="wct-case-update-form-note">Gunakan bagian ini untuk perkembangan Case secara keseluruhan. Progres CA/PA dicatat terpisah melalui pengaturan persentase.</div><div class="form-grid"><div class="field span-2"><label>Perkembangan / informasi terbaru *</label><textarea name="update_text" required maxlength="5000" placeholder="Contoh: Vendor sudah dihubungi, jadwal perbaikan disepakati, dan tindak lanjut dilakukan besok.">'+safe(existing?existing.update_text:'')+'</textarea></div><div class="field span-2"><label>Kendala umum (opsional)</label><textarea name="blocker" maxlength="2000" placeholder="Tuliskan kendala yang memengaruhi penanganan Case.">'+safe(existing?existing.blocker:'')+'</textarea></div><div class="field span-2"><label>Langkah berikutnya (opsional)</label><textarea name="next_step" maxlength="2000" placeholder="Apa tindak lanjut berikutnya untuk Case ini?">'+safe(existing?existing.next_step:'')+'</textarea></div></div></div><div class="modal-foot"><button type="button" class="btn" onclick="closeModal()">Batal</button><button type="submit" class="btn btn-primary">'+(existing?'Simpan Perubahan':'Simpan Update')+'</button></div></form>';
    openModal(html,true);
    var modal=$('modal');if(modal)modal.classList.add('wct-case-side-drawer','wct-case-update-drawer');
  };

  window.submitCaseUpdate=async function(event,caseId,updateId){
    event.preventDefault();
    var parent=state.cases.find(function(item){return item.id===caseId;});
    if(!parent||parent.status==='closed'){toast('Case sudah ditutup. Update tidak dapat disimpan.');return;}
    if(currentUser?.role==='viewer')return;
    var form=event.currentTarget||event.target;
    var data=new FormData(form);
    var textValue=String(data.get('update_text')||'').trim();
    if(!textValue){toast('Isi perkembangan Case terlebih dahulu.');return;}
    var actions=state.actions.filter(function(item){return item.case_id===caseId;});
    var allowed=isCoordinator()||actions.some(function(item){return canUpdateAction(item);});
    if(!allowed){toast('Kamu tidak memiliki izin untuk memperbarui Case ini.');return;}
    var existing=updateId?(state.caseUpdates||[]).find(function(item){return item.id===updateId;}):null;
    if(existing&&!isCoordinator()&&existing.created_by!==currentUser.id){toast('Kamu hanya dapat mengedit Update Case milik sendiri.');return;}
    var client=window.wctSupabase;
    if(!client){toast('Koneksi database belum siap. Muat ulang halaman dan coba kembali.');return;}
    var button=form.querySelector('button[type="submit"]');
    var label=button?button.textContent:'Simpan Update';
    if(button){button.disabled=true;button.textContent='Menyimpan...';}
    var now=new Date().toISOString();
    try{
      var payload={
        case_id:caseId,
        update_text:textValue,
        blocker:String(data.get('blocker')||'').trim(),
        next_step:String(data.get('next_step')||'').trim()
      };
      var result;
      if(existing){
        result=await client.from('wct_case_updates').update(Object.assign(payload,{edited_by:currentUser.id,edited_at:now})).eq('id',existing.id).select('*').single();
      }else{
        payload.created_by=currentUser.id;
        payload.author_name=String(currentUser.full_name||currentUser.login_id||'Pengguna');
        result=await client.from('wct_case_updates').insert(payload).select('*').single();
      }
      if(result.error)throw result.error;
      if(typeof window.refreshData==='function')await window.refreshData();
      closeModal();
      if(typeof window.openCaseDetail==='function')window.openCaseDetail(caseId);
      toast(existing?'Update Case berhasil diperbarui.':'Update Case berhasil disimpan.');
    }catch(error){
      console.error('Case Update save failed:',error);
      toast('Gagal menyimpan Update Case: '+(error.message||error));
      if(button){button.disabled=false;button.textContent=label;}
    }
  };

  window.openActionProgressForm=function(actionId){
    var action=state.actions.find(function(item){return item.id===actionId;});
    if(!action){toast('Action tidak ditemukan.');return;}
    var parent=state.cases.find(function(item){return item.id===action.case_id;});
    if(!parent||parent.status==='closed'){toast('Case sudah ditutup. Progres Action bersifat read-only.');return;}
    if(currentUser?.role==='viewer'){toast('Akun Viewer hanya dapat membaca.');return;}
    if(!isCoordinator()&&String(action.assigned_to)!==String(currentUser.id)){
      toast('Hanya PIC yang ditugaskan, Koordinator, atau Admin yang dapat mengubah progres Action ini.');return;
    }
    var progress=Math.max(0,Math.min(100,Number(action.progress)||0));
    var status=action.status||'open';
    var html='<div class="modal-head"><div><div class="eyebrow">PICAPA / '+(action.action_type==='corrective'?'CORRECTIVE ACTION':'PREVENTIVE ACTION')+'</div><h2>Atur Progres Tindakan</h2><p class="sub">'+safe(action.title)+'</p></div><button type="button" class="close" onclick="closeModal()">×</button></div>'+
      '<form id="wctActionProgressForm" onsubmit="submitActionProgress(event,\''+actionId+'\')"><div class="modal-body"><div class="wct-action-progress-quick-note">Perubahan ini hanya memperbarui persentase dan status CA/PA. Catatan perkembangan umum Case ditulis pada bagian <b>Update Case</b>.</div><div class="form-grid"><div class="field span-2"><label>Progress terbaru</label><div class="wct-action-progress-quick-control"><input type="range" name="progress" min="0" max="100" step="5" value="'+progress+'" oninput="wctActionProgressChanged(this)"><output id="wctActionProgressValue">'+progress+'%</output></div></div><div class="field span-2"><label>Status tindakan</label><select name="status"><option value="open" '+(status==='open'?'selected':'')+'>Open</option><option value="in_progress" '+(status==='in_progress'?'selected':'')+'>On Progress</option><option value="review" '+(status==='review'?'selected':'')+'>Need Review</option><option value="done" '+(status==='done'?'selected':'')+'>Done</option></select></div><div class="field span-2"><small class="wct-action-progress-hint">Gunakan 100% jika tindakan sudah selesai. Status Done hanya dapat disimpan pada progress 100%.</small></div></div></div><div class="modal-foot"><button type="button" class="btn" onclick="closeModal()">Batal</button><button type="submit" class="btn btn-primary">Simpan Progres</button></div></form>';
    openModal(html,true);
    var modal=$('modal');if(modal)modal.classList.add('wct-case-side-drawer','wct-action-progress-drawer');
  };

  window.wctActionProgressChanged=function(input){
    var output=document.getElementById('wctActionProgressValue');
    if(output)output.textContent=String(input&&input.value||0)+'%';
  };

  window.submitActionProgress=async function(event,actionId){
    event.preventDefault();
    var action=state.actions.find(function(item){return item.id===actionId;});
    if(!action){toast('Action tidak ditemukan.');return;}
    var parent=state.cases.find(function(item){return item.id===action.case_id;});
    if(!parent||parent.status==='closed'||currentUser?.role==='viewer'){toast('Case arsip atau akun Viewer tidak dapat mengubah progres.');return;}
    if(!isCoordinator()&&String(action.assigned_to)!==String(currentUser.id)){toast('Hanya PIC yang ditugaskan, Koordinator, atau Admin yang dapat mengubah progres Action ini.');return;}
    var form=event.currentTarget||event.target;
    var data=new FormData(form);
    var progress=Number(data.get('progress'));
    var status=String(data.get('status')||'open');
    if(!Number.isFinite(progress)||progress<0||progress>100||!['open','in_progress','review','done'].includes(status)){
      toast('Progress atau status tindakan tidak valid.');return;
    }
    if(status==='done'&&progress!==100){toast('Status Done hanya dapat disimpan pada progress 100%.');return;}
    var client=window.wctSupabase;
    if(!client){toast('Koneksi database belum siap.');return;}
    var button=form.querySelector('button[type="submit"]');
    var label=button?button.textContent:'Simpan Progres';
    if(button){button.disabled=true;button.textContent='Menyimpan...';}
    try{
      var result=await client.rpc('wct_set_action_progress',{
        p_action_id:actionId,p_progress_after:progress,p_status_after:status
      });
      if(result.error)throw result.error;
      if(typeof window.refreshData==='function')await window.refreshData();
      closeModal();
      if(typeof window.openCaseDetail==='function')window.openCaseDetail(action.case_id);
      toast('Progres tindakan berhasil diperbarui.');
    }catch(error){
      console.error('Quick Action progress failed:',error);
      toast('Gagal memperbarui progres: '+(error.message||error));
      if(button){button.disabled=false;button.textContent=label;}
    }
  };
  `;

  const closeAt = workflow.lastIndexOf('})();');
  if (closeAt < 0) throw new Error('PICAPA workflow closure not found.');
  workflow = workflow.slice(0, closeAt) + injected + '\n' + workflow.slice(closeAt);

  const redesigned = html.slice(0, scriptStart + openTag.length) + workflow + html.slice(scriptEnd);

  // The Case list action is an Update entry point, not a separate Detail workflow.
  const withUpdatedLabels = redesigned.replace(/<button\b[^>]*>[\s\S]*?<\/button>/gi, function(button){
    if (!/data-wct-open-case|openCaseDetail/.test(button)) return button;
    return button.replace(/\bDetail\b/g, 'Update');
  });

  const css = String.raw`
.wct-case-update-section .wct-case-section-head{align-items:center!important}
.wct-case-update-tools{display:flex!important;align-items:center!important;gap:9px!important;flex-wrap:wrap!important}
.wct-case-update-list{display:grid!important;gap:10px!important}
.wct-case-update-item{padding:14px 15px!important;border:1px solid #E3E7EA!important;border-radius:12px!important;background:#FFFFFF!important}
.wct-case-update-top{display:flex!important;justify-content:space-between!important;align-items:flex-start!important;gap:12px!important}
.wct-case-update-top>div:first-child{display:grid!important;gap:3px!important}
.wct-case-update-top strong{color:#29313A!important;font-size:12px!important;font-weight:850!important}
.wct-case-update-top small,.wct-case-update-edited{color:#89939E!important;font-size:10px!important}
.wct-case-update-item>p{margin:10px 0 0!important;color:#46515C!important;font-size:12px!important;line-height:1.65!important;white-space:pre-wrap!important;overflow-wrap:anywhere!important}
.wct-case-update-extra{display:grid!important;gap:3px!important;margin-top:9px!important;padding:9px 11px!important;border:1px solid #ECEFF2!important;border-radius:9px!important;background:#F8F9FA!important}
.wct-case-update-extra b{color:#A65B0D!important;font-size:9px!important;text-transform:uppercase!important;letter-spacing:.06em!important}
.wct-case-update-extra span{color:#58636E!important;font-size:11px!important;line-height:1.5!important;white-space:pre-wrap!important}
.wct-case-update-edited{display:block!important;margin-top:9px!important}
.wct-case-update-form-note,.wct-action-progress-quick-note{
  margin:0 0 15px!important;padding:11px 13px!important;border:1px solid #F0D9C0!important;
  border-radius:10px!important;background:#FFF8F0!important;color:#74501F!important;
  font-size:11px!important;line-height:1.6!important
}
.wct-action-progress-quick-control{display:grid!important;grid-template-columns:minmax(0,1fr) 58px!important;align-items:center!important;gap:13px!important}
.wct-action-progress-quick-control input[type=range]{width:100%!important;min-width:0!important;accent-color:#F28C18!important}
.wct-action-progress-quick-control output{display:inline-grid!important;place-items:center!important;min-height:42px!important;border:1px solid #F0D7BA!important;border-radius:10px!important;background:#FFF4E8!important;color:#A65B0D!important;font-size:18px!important;font-weight:900!important}
.wct-action-progress-hint{color:#7A8490!important;font-size:10px!important;line-height:1.55!important}
@media(max-width:680px){
 .wct-case-update-section .wct-case-section-head{align-items:flex-start!important;flex-direction:column!important}
 .wct-case-update-tools{width:100%!important;justify-content:space-between!important}
 .wct-case-update-tools .btn{min-height:40px!important}
 .wct-case-update-item{padding:12px!important}
 .wct-case-update-top{align-items:center!important}
 .wct-action-progress-quick-control{grid-template-columns:minmax(0,1fr) 54px!important;gap:9px!important}
}
`;

  return withUpdatedLabels.replace('</body>', '<style id="wct-case-update-workflow-style">' + css + '</style></body>');
};
