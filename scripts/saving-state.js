module.exports = function addSavingState(html) {
  if (!html || !html.includes('</body>')) throw new Error('Could not find document body for saving-state runtime.');

  const runtime = String.raw\`
(function(){
  'use strict';
  if(window.__WCT_SAVING_STATE_READY)return;
  window.__WCT_SAVING_STATE_READY=true;

  var labels={
    submitUser:'Sedang membuat akun pengguna di database…',
    submitResetPassword:'Sedang memperbarui password…',
    saveUserProfile:'Sedang menyimpan perubahan profil…',
    submitCase:'Sedang menyimpan Case dan Action ke database…',
    saveEditedCase:'Sedang memperbarui Case…',
    submitAction:'Sedang menyimpan Action…',
    submitProgress:'Sedang menyimpan progres…',
    submitMeeting:'Sedang menyimpan hasil Weekly Meeting…',
    saveMeetingEdit:'Sedang memperbarui Weekly Meeting…',
    changeOwnPassword:'Sedang memperbarui password akun…'
  };

  function resolveForm(args){
    var first=args&&args[0];
    if(!first)return null;
    var candidate=first.currentTarget||first.target||first;
    return candidate&&candidate.tagName==='FORM'?candidate:null;
  }
  function resolveButton(args,form){
    var first=args&&args[0];
    var button=first&&first.submitter;
    if(!button&&form)button=form.querySelector('button[type="submit"],button:not([type])');
    if(!button&&document.activeElement&&document.activeElement.tagName==='BUTTON')button=document.activeElement;
    return button||null;
  }
  function addStatus(form,message){
    if(!form)return null;
    var existing=form.querySelector(':scope > .wct-save-status');
    if(existing)return existing;
    var status=document.createElement('div');
    status.className='wct-save-status';
    status.setAttribute('role','status');
    status.setAttribute('aria-live','polite');
    status.innerHTML='<span class="wct-save-spinner" aria-hidden="true"></span><span class="wct-save-status-copy"><strong></strong><small>Mohon tunggu dan jangan tekan tombol simpan lagi.</small><span class="wct-save-progress-track"><i></i></span></span>';
    status.querySelector('strong').textContent=message;
    var body=form.querySelector('.modal-body')||form;
    var anchor=body.querySelector('.form-grid')||body.firstChild;
    if(anchor)body.insertBefore(status,anchor);else body.appendChild(status);
    return status;
  }
  function finish(form,button,snapshot){
    if(form){
      delete form.dataset.wctSaveLocked;
      var status=form.querySelector(':scope > .wct-save-status');
      if(!status)status=form.querySelector('.wct-save-status');
      if(status)status.remove();
      form.removeAttribute('aria-busy');
    }
    if(button){
      if(snapshot!=null)button.innerHTML=snapshot;
      button.disabled=false;
      button.removeAttribute('aria-busy');
      button.classList.remove('wct-save-button');
      delete button.dataset.wctSaving;
    }
  }
  function wrap(name){
    var original=window[name];
    if(typeof original!=='function'||original.__wctSavingWrapped)return;
    var wrapped=function(){
      var args=Array.prototype.slice.call(arguments);
      var form=resolveForm(args);
      var button=resolveButton(args,form);
      var first=args[0];
      if((form&&form.dataset.wctSaveLocked==='1')||(button&&button.dataset.wctSaving==='1')){
        if(first&&typeof first.preventDefault==='function')first.preventDefault();
        return false;
      }
      var snapshot=button?button.innerHTML:null;
      if(form)form.dataset.wctSaveLocked='1';
      if(button)button.dataset.wctSaving='1';

      var result;
      try{
        result=original.apply(this,args);
      }catch(error){
        finish(form,button,snapshot);
        throw error;
      }

      var message=labels[name]||'Sedang menyimpan data ke database…';
      if(form){
        form.setAttribute('aria-busy','true');
        addStatus(form,message);
      }
      if(button){
        button.disabled=true;
        button.classList.add('wct-save-button');
        button.setAttribute('aria-busy','true');
        button.innerHTML='<span class="wct-save-spinner" aria-hidden="true"></span><span>Menyimpan…</span>';
      }

      if(result&&typeof result.then==='function'){
        return Promise.resolve(result).finally(function(){finish(form,button,snapshot);});
      }
      finish(form,button,snapshot);
      return result;
    };
    wrapped.__wctSavingWrapped=true;
    wrapped.__wctOriginal=original;
    window[name]=wrapped;
  }

  [
    'submitUser','submitResetPassword','saveUserProfile',
    'submitCase','saveEditedCase','submitAction','submitProgress',
    'submitMeeting','saveMeetingEdit','changeOwnPassword'
  ].forEach(wrap);

  window.WCTSavingState={
    isSaving:function(form){return !!(form&&form.dataset.wctSaveLocked==='1');}
  };
  window.WCTSavingStateReady=true;
})();
\`;

  try { new Function(runtime); } catch (error) {
    throw new Error('Saving-state runtime syntax check failed: ' + error.message);
  }

  const style = [
    '.wct-save-status{display:flex;align-items:center;gap:12px;margin:0 0 16px;padding:13px 15px;border:1px solid #F3C46C;border-radius:13px;background:linear-gradient(110deg,#FFF8E9,#FFFDF7);color:#68420A;box-shadow:0 5px 18px rgba(169,106,0,.08)}',
    '.wct-save-status-copy{display:flex;flex:1;min-width:0;flex-direction:column;gap:3px}',
    '.wct-save-status-copy strong{font-size:12px;font-weight:800;line-height:1.4}',
    '.wct-save-status-copy small{font-size:10px;color:#8A6A32;line-height:1.4}',
    '.wct-save-spinner{display:inline-block;width:19px;height:19px;flex:0 0 19px;border:2.5px solid rgba(169,106,0,.2);border-top-color:#FEA500;border-right-color:#FEA500;border-radius:50%;animation:wctSaveSpin .75s linear infinite}',
    '.wct-save-progress-track{height:3px;overflow:hidden;margin-top:5px;border-radius:9px;background:rgba(169,106,0,.13)}',
    '.wct-save-progress-track i{display:block;width:36%;height:100%;border-radius:9px;background:linear-gradient(90deg,#FEA500,#B8F23A);animation:wctSaveProgress 1.25s ease-in-out infinite}',
    '.wct-save-button{display:inline-flex!important;align-items:center;justify-content:center;gap:8px;opacity:.88;cursor:wait!important;pointer-events:none!important}',
    '.wct-save-button .wct-save-spinner{width:14px;height:14px;flex-basis:14px;border-width:2px}',
    '.wct-save-button[disabled]{filter:saturate(.82)}',
    '@keyframes wctSaveSpin{to{transform:rotate(360deg)}}',
    '@keyframes wctSaveProgress{0%{transform:translateX(-115%)}100%{transform:translateX(300%)}}',
    ':root[data-wct-appearance="dark"] .wct-save-status{border-color:#72531F;background:linear-gradient(110deg,#302719,#28251E);color:#FFE0A3}',
    ':root[data-wct-appearance="dark"] .wct-save-status-copy small{color:#D1B783}',
    ':root[data-wct-appearance="dark"] .wct-save-spinner{border-color:rgba(254,165,0,.2);border-top-color:#FEA500;border-right-color:#FEA500}',
    '@media(prefers-reduced-motion:reduce){.wct-save-spinner,.wct-save-progress-track i{animation-duration:2.5s}}',
    '@media(max-width:600px){.wct-save-status{align-items:flex-start;padding:12px}.wct-save-status-copy strong{font-size:11px}}'
  ].join('');

  return html.replace('</body>', '<style id="wct-saving-state-style">' + style + '</style><script id="wct-saving-state-runtime">' + runtime + '</script></body>');
};
