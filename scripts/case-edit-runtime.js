module.exports = function addReliableCaseEditRuntime(html) {
  const script = String.raw`<script id="wct-case-edit-runtime">
(function(){
  if(window.wctCaseEditRuntimeReady)return;
  window.wctCaseEditRuntimeReady=true;

  function tell(message){if(typeof toast==='function')toast(message);else console.warn(message);}
  function canEdit(){return typeof isCoordinator==='function'&&isCoordinator();}

  // One stable route for Edit buttons in both Case Monitoring and Case Detail.
  document.addEventListener('click',function(event){
    var button=event.target&&event.target.closest?event.target.closest('[data-wct-case-edit-id]'):null;
    if(!button)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    var id=button.getAttribute('data-wct-case-edit-id')||'';
    var backToDetail=button.getAttribute('data-wct-return-detail')==='true';
    if(!id){tell('ID Case tidak ditemukan pada tombol Edit.');return;}
    if(!canEdit()){tell('Hanya Admin atau Koordinator yang dapat mengubah Case.');return;}
    if(typeof window.editCaseForm!=='function'){tell('Form Edit Case belum termuat. Muat ulang halaman.');return;}
    try{window.editCaseForm(id,backToDetail);}
    catch(error){console.error('Open Case editor failed:',error);tell('Form Edit Case gagal dibuka: '+(error.message||error));}
  },true);

  // Single save handler used by the existing capture-phase form listener and the form itself.
  window.saveEditedCase=async function(event,explicitForm){
    if(event&&event.preventDefault)event.preventDefault();
    if(!canEdit()){tell('Akses edit Case tidak tersedia untuk akun ini.');return false;}
    var form=explicitForm||(event&&event.target);
    if(!form||form.id!=='wctCaseEditorForm'){tell('Form Edit Case tidak terbaca. Tutup form lalu buka kembali.');return false;}

    var values=new FormData(form);
    var caseId=String(values.get('case_id')||(window.wctPicapaFlow&&window.wctPicapaFlow.caseId)||'').trim();
    var current=(state.cases||[]).find(function(item){return item.id===caseId;});
    if(!current){tell('Case tidak ditemukan. Muat ulang daftar Case lalu coba lagi.');return false;}

    var changes={
      hub_code:String(values.get('hub_code')||'').trim().toUpperCase(),
      category:String(values.get('category')||'').trim(),
      division:String(values.get('division')||'').trim(),
      title:String(values.get('title')||'').trim(),
      problem_identification:String(values.get('problem_identification')||'').trim(),
      occurred_on:String(values.get('occurred_on')||'').trim()||null,
      target_date:String(values.get('target_date')||'').trim()||null,
      reporter:String(values.get('reporter')||'').trim(),
      priority:String(values.get('priority')||'').trim(),
      status:String(values.get('status')||current.status||'open').trim(),
      updated_at:new Date().toISOString(),
      updated_by:currentUser&&currentUser.id?currentUser.id:null
    };

    if(!changes.hub_code||!changes.category||!changes.division||!changes.title||!changes.problem_identification){
      tell('Lengkapi HUB, kategori, divisi, judul, dan uraian masalah.');return false;
    }
    if(['High','Medium','Low'].indexOf(changes.priority)<0){tell('Pilih prioritas Case.');return false;}
    if(['open','in_progress','review','closed'].indexOf(changes.status)<0){tell('Status Case tidak valid.');return false;}
    if(current.status==='closed'&&changes.status!=='closed'){tell('Case yang sudah Closed tidak dapat dibuka kembali dari Edit Case.');return false;}

    var submit=form.querySelector('button[type="submit"]');
    if(submit&&submit.disabled)return false;
    if(submit){submit.disabled=true;submit.dataset.originalLabel=submit.textContent;submit.textContent='Menyimpan perubahan...';}

    try{
      if(mode!=='firebase'||!fireDb)throw new Error('Koneksi Firebase belum siap. Muat ulang halaman lalu coba kembali.');
      await fireDb.collection('cases').doc(caseId).update(changes);
      Object.assign(current,changes);

      // The database update is authoritative. A failed refresh must not undo a successful save.
      try{await refreshData();}catch(refreshError){console.warn('Case tersimpan, refresh data gagal:',refreshError);}
      tell('Perubahan Case berhasil disimpan.');

      var flow=window.wctPicapaFlow||{};
      if(flow.editReturnToDetail&&typeof window.openCaseDetail==='function'){
        await window.openCaseDetail(caseId);
      }else if(typeof window.wctReturnToCaseList==='function'){
        window.wctReturnToCaseList();
      }else if(typeof renderCases==='function'){
        renderCases();
      }
      return true;
    }catch(error){
      console.error('Save Case edit failed:',error);
      if(submit){submit.disabled=false;submit.textContent=submit.dataset.originalLabel||'Simpan Perubahan';}
      var reason=error&&error.code==='permission-denied'
        ?'Firestore menolak perubahan. Pastikan akun memiliki role Admin atau Koordinator.'
        :(error.message||String(error));
      tell('Gagal menyimpan Case: '+reason);
      return false;
    }
  };

})();
</script>`;
  return html.replace('</body>', script + '\n</body>');
};
