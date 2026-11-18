module.exports = function addActionCrudOverride(html) {
  if (!html || !html.includes('</body>')) throw new Error('Could not find document body for Action CRUD override.');
  const runtime = String.raw`(function(){
  'use strict';
  if(window.__WCT_ACTION_CRUD_OVERRIDE_READY)return;
  window.__WCT_ACTION_CRUD_OVERRIDE_READY=true;

  async function submitActionSecure(event,caseId,type,actionId){
    event.preventDefault();
    if(typeof isCoordinator!=='function'||!isCoordinator()){
      if(typeof toast==='function')toast('Hanya Admin atau Koordinator yang dapat mengelola Action.');
      return false;
    }
    var parent=(state.cases||[]).find(function(item){return String(item.id)===String(caseId);});
    if(!parent||parent.status==='closed'){
      if(typeof toast==='function')toast('Case sudah masuk arsip. Action tidak dapat diubah.');
      return false;
    }
    if(['corrective','preventive'].indexOf(type)<0){
      if(typeof toast==='function')toast('Jenis Action tidak valid.');
      return false;
    }
    var formElement=event.currentTarget||event.target;
    var form=new FormData(formElement);
    var payload={
      action_type:type,
      title:String(form.get('title')||'').trim(),
      description:String(form.get('description')||'').trim(),
      assigned_to:String(form.get('assigned_to')||'')||null,
      due_date:String(form.get('due_date')||'')||null
    };
    if(!payload.title||!payload.assigned_to||!payload.due_date){
      if(typeof toast==='function')toast('Nama Action, PIC, dan target penyelesaian wajib diisi.');
      return false;
    }
    if(!window.wctSupabase||typeof window.wctSupabase.rpc!=='function'){
      if(typeof toast==='function')toast('Layanan database belum siap. Muat ulang halaman dan coba kembali.');
      return false;
    }
    var button=event.submitter||(formElement&&formElement.querySelector('button[type="submit"]'));
    if(button&&button.disabled)return false;
    var oldLabel=button?button.textContent:'';
    if(button){button.disabled=true;button.setAttribute('aria-busy','true');button.textContent=actionId?'Menyimpan perubahan...':'Menyimpan Action...';}
    try{
      var result=await window.wctSupabase.rpc('wct_save_action',{
        p_action_id:actionId||null,p_case_id:caseId,p_action:payload
      });
      if(result.error)throw result.error;
      if(!result.data)throw new Error('Action tidak ditemukan atau tidak memiliki izin.');
      await refreshData();
      if(typeof closeModal==='function')closeModal();
      if(typeof window.openCaseDetail==='function')window.openCaseDetail(caseId);
      if(typeof toast==='function')toast(actionId?'Action berhasil diperbarui.':'Action berhasil ditambahkan.');
      return false;
    }catch(error){
      console.error('Save Action failed:',error);
      if(typeof toast==='function')toast('Gagal menyimpan Action: '+(error.message||error));
      return false;
    }finally{
      if(button){
        button.disabled=false;button.removeAttribute('aria-busy');
        button.textContent=oldLabel|| (actionId?'Simpan Perubahan':'Simpan Action');
      }
    }
  }

  function install(){
    window.submitAction=submitActionSecure;
    window.WCTActionCrudReady=true;
  }
  // Supabase's runtime and the legacy PICAPA script are loaded earlier.
  // Re-apply after DOMContentLoaded so this secured handler wins in final order.
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
  window.addEventListener('load',function(){install();},{once:true});
})();
`;
  try { new Function(runtime); } catch (error) { throw new Error('Action CRUD override syntax check failed: ' + error.message); }
  return html.replace('</body>', '<script id="wct-action-crud-runtime">' + runtime + '</script></body>');
};
