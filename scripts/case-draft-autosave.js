module.exports = function addCaseDraftAutosave(html) {
  if (!html || !html.includes('</body>')) throw new Error('Could not find document body for Case draft autosave runtime.');
  const runtime = String.raw`
(function(){
  'use strict';
  if(window.__WCT_CASE_DRAFT_READY)return;
  window.__WCT_CASE_DRAFT_READY=true;

  var STORAGE_PREFIX='wctCaseDraft:v1:';
  var SAVE_DELAY=220;
  var saveTimer=null;
  var currentForm=null;
  var currentDraftKey='';

  function userKey(){
    var id='anonymous';
    try{
      if(typeof currentUser!=='undefined'&&currentUser&&currentUser.id)id=String(currentUser.id);
    }catch(ignore){}
    return STORAGE_PREFIX+id;
  }
  function modalForm(){
    var modal=document.getElementById('modal');
    if(!modal)return null;
    var form=modal.querySelector('form');
    if(!form)return null;
    if(!form.querySelector('[name="hub_code"]'))return null;
    if(form.querySelector('[name="case_id"]'))return null;
    return form;
  }
  function collect(form){
    var values={};
    Array.prototype.forEach.call(form.querySelectorAll('[name]'),function(el){
      if(el.disabled||!el.name)return;
      var type=String(el.type||'').toLowerCase();
      if(type==='submit'||type==='button'||type==='reset'||el.tagName==='BUTTON')return;
      if(type==='checkbox'||type==='radio'){
        if(!Object.prototype.hasOwnProperty.call(values,el.name))values[el.name]=[];
        if(el.checked)values[el.name].push(String(el.value));
        return;
      }
      if(el.tagName==='SELECT'&&el.multiple){
        values[el.name]=Array.prototype.filter.call(el.options,function(option){return option.selected;}).map(function(option){return String(option.value);});
      }else{
        values[el.name]=String(el.value==null?'':el.value);
      }
    });
    return values;
  }
  function hasContent(values){
    return Object.keys(values).some(function(name){
      var value=values[name];
      if(Array.isArray(value))return value.length>0;
      return String(value||'').trim()!=='';
    });
  }
  function stamp(value){
    var date=new Date(value||Date.now());
    if(isNaN(date.getTime()))date=new Date();
    return date.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'});
  }
  function ensureNotice(form,text){
    var body=form.querySelector('.modal-body')||form;
    var notice=body.querySelector('.wct-case-draft-notice');
    if(!notice){
      notice=document.createElement('div');
      notice.className='wct-case-draft-notice';
      notice.setAttribute('role','status');
      var grid=body.querySelector('.form-grid');
      body.insertBefore(notice,grid||body.firstChild);
    }
    notice.innerHTML='<span class="wct-case-draft-dot"></span><span class="wct-case-draft-message"></span><button type="button" class="wct-case-draft-clear" data-wct-case-draft-clear>Hapus draft</button>';
    var message=notice.querySelector('.wct-case-draft-message');
    if(message)message.textContent=text;
  }
  function showNotice(form,time){
    ensureNotice(form,'Draft tersimpan otomatis · terakhir '+stamp(time));
  }
  function clearStoredDraft(key,form){
    // Cancel a pending debounce first; otherwise it could recreate the draft
    // milliseconds after a confirmed database save removed it.
    if(saveTimer){clearTimeout(saveTimer);saveTimer=null;}
    try{localStorage.removeItem(key||currentDraftKey||userKey());}catch(ignore){}
    if(form){
      var notice=form.querySelector('.wct-case-draft-notice');
      if(notice)notice.remove();
    }
    currentDraftKey='';
    currentForm=null;
  }
  function clearCurrentDraft(){
    var form=currentForm||modalForm();
    var key=currentDraftKey||userKey();
    clearStoredDraft(key,form);
  }
  window.WCTCaseDraft={
    clear:clearCurrentDraft,
    clearForm:function(form){clearStoredDraft(userKey(),form||modalForm());}
  };
  function restorePriority(form){
    var field=form.querySelector('[name="priority"]');
    if(!field)return;
    var value=String(field.value||'Medium');
    form.querySelectorAll('.wct-priority-choice').forEach(function(button){
      var selected=String(button.dataset.value||'')===value;
      button.classList.toggle('is-selected',selected);
      button.setAttribute('aria-pressed',selected?'true':'false');
    });
  }
  function restore(form,draft){
    var values=draft&&draft.values||{};
    Array.prototype.forEach.call(form.querySelectorAll('[name]'),function(el){
      if(!Object.prototype.hasOwnProperty.call(values,el.name))return;
      var type=String(el.type||'').toLowerCase(),saved=values[el.name];
      if(type==='checkbox'||type==='radio'){
        el.checked=Array.isArray(saved)&&saved.indexOf(String(el.value))>=0;
      }else if(el.tagName==='SELECT'&&el.multiple){
        var selected=Array.isArray(saved)?saved.map(String):[];
        Array.prototype.forEach.call(el.options,function(option){option.selected=selected.indexOf(String(option.value))>=0;});
      }else{
        el.value=Array.isArray(saved)?String(saved[0]||''):String(saved==null?'':saved);
      }
    });
    restorePriority(form);
    showNotice(form,draft.updatedAt);
  }
  function saveNow(form){
    if(!form)return;
    var values=collect(form);
    var key=userKey();
    currentDraftKey=key;
    currentForm=form;
    if(!hasContent(values)){
      try{localStorage.removeItem(key);}catch(ignore){}
      return;
    }
    var now=new Date().toISOString();
    var payload={version:1,updatedAt:now,values:values};
    try{
      localStorage.setItem(key,JSON.stringify(payload));
      showNotice(form,now);
    }catch(error){
      ensureNotice(form,'Draft tidak dapat disimpan di browser ini. Jangan tutup form sebelum menyimpan Case.');
    }
  }
  function scheduleSave(form){
    if(saveTimer)clearTimeout(saveTimer);
    saveTimer=setTimeout(function(){saveTimer=null;saveNow(form);},SAVE_DELAY);
  }
  function attach(form){
    if(!form||form.dataset.wctDraftAttached==='1')return;
    form.dataset.wctDraftAttached='1';
    var key=userKey(),saved=null;
    currentDraftKey=key;currentForm=form;
    try{
      var raw=localStorage.getItem(key);
      if(raw){
        var draft=JSON.parse(raw);
        var age=Date.now()-new Date(draft.updatedAt||0).getTime();
        if(draft&&draft.version===1&&draft.values&&age>=0&&age<30*86400000)saved=draft;
        else localStorage.removeItem(key);
      }
    }catch(ignore){}
    if(saved)restore(form,saved);
    form.addEventListener('input',function(){scheduleSave(form);},true);
    form.addEventListener('change',function(){scheduleSave(form);},true);
    form.addEventListener('click',function(event){
      if(event.target&&event.target.closest&&event.target.closest('.wct-priority-choice'))scheduleSave(form);
    },true);
  }

  function caseIds(){
    var list=[];
    try{
      if(typeof state!=='undefined'&&state&&Array.isArray(state.cases))list=state.cases.map(function(item){return String(item.id);});
    }catch(ignore){}
    return list;
  }
  function verifySaved(beforeIds,attempt){
    var after=caseIds();
    var hasNew=after.some(function(id){return beforeIds.indexOf(id)<0;});
    if(hasNew){
      clearStoredDraft(userKey(),currentForm);
      return;
    }
    if(attempt<80)setTimeout(function(){verifySaved(beforeIds,attempt+1);},150);
  }
  document.addEventListener('submit',function(event){
    var form=event.target;
    if(!form||!form.querySelector||!form.querySelector('[name="hub_code"]')||form.querySelector('[name="case_id"]'))return;
    var before=caseIds();
    setTimeout(function(){verifySaved(before,0);},180);
  },true);
  document.addEventListener('click',function(event){
    var clear=event.target&&event.target.closest&&event.target.closest('[data-wct-case-draft-clear]');
    if(!clear)return;
    event.preventDefault();
    var form=modalForm();
    var key=userKey();
    try{localStorage.removeItem(key);}catch(ignore){}
    if(form){
      var notice=form.querySelector('.wct-case-draft-notice');
      if(notice)notice.remove();
      form.dataset.wctDraftAttached='1';
    }
    currentDraftKey='';
  },true);

  function scan(){
    var form=modalForm();
    if(form&&form!==currentForm)attach(form);
    else if(form&&form.dataset.wctDraftAttached!=='1')attach(form);
    else if(!form&&currentForm&&saveTimer){
      clearTimeout(saveTimer);saveTimer=null;
      saveNow(currentForm);
    }
  }
  function start(){
    scan();
    var modal=document.getElementById('modal');
    var target=modal||document.body;
    if(target&&!window.__WCT_CASE_DRAFT_OBSERVER){
      window.__WCT_CASE_DRAFT_OBSERVER=new MutationObserver(function(){scan();});
      window.__WCT_CASE_DRAFT_OBSERVER.observe(target,{childList:true,subtree:true,attributes:true,attributeFilter:['style','class']});
    }
    if(typeof window.openCaseForm==='function'&&!window.openCaseForm.__wctDraftWrapped){
      var original=window.openCaseForm;
      var wrapped=function(){
        var result=original.apply(this,arguments);
        setTimeout(scan,0);
        return result;
      };
      wrapped.__wctDraftWrapped=true;
      window.openCaseForm=wrapped;
    }
  }
  window.addEventListener('pagehide',function(){
    var form=modalForm();
    if(form)saveNow(form);
  });
  window.addEventListener('beforeunload',function(){
    var form=modalForm();
    if(form)saveNow(form);
  });
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
  window.WCTCaseDraftReady=true;
})();
`;
  try { new Function(runtime); } catch (error) { throw new Error('Case draft autosave runtime syntax check failed: ' + error.message); }
  const style = '.wct-case-draft-notice{display:flex;align-items:center;gap:9px;margin:0 0 15px;padding:10px 12px;border:1px solid #D7E6F4;border-radius:10px;background:#EFF6FD;color:#355779;font-size:11px;line-height:1.4}.wct-case-draft-dot{width:8px;height:8px;flex:0 0 8px;border-radius:50%;background:#26986B;box-shadow:0 0 0 3px rgba(38,152,107,.12)}.wct-case-draft-message{min-width:0;flex:1}.wct-case-draft-clear{border:0;background:transparent;color:#6C7F94;font:700 10px inherit;text-decoration:underline;cursor:pointer;padding:5px}.wct-case-draft-clear:hover{color:#B45309}:root[data-wct-appearance="dark"] .wct-case-draft-notice{border-color:#3B5165;background:#1A2A39;color:#D5E3F0}:root[data-wct-appearance="dark"] .wct-case-draft-clear{color:#E7B65B}@media(max-width:600px){.wct-case-draft-notice{align-items:flex-start;flex-wrap:wrap}.wct-case-draft-clear{margin-left:auto}}';
  return html.replace('</body>', '<style id="wct-case-draft-style">' + style + '</style><script id="wct-case-draft-runtime">' + runtime + '</script></body>');
};
