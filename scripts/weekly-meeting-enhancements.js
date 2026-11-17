module.exports = function addWeeklyMeetingEnhancements(html) {
  if (!html || !html.includes('</body>')) throw new Error('Could not find document body for Weekly Meeting enhancements.');
  const runtime = String.raw`
(function(){
  'use strict';
  if(window.__WCT_WEEKLY_MEETING_ENHANCEMENTS_READY)return;
  window.__WCT_WEEKLY_MEETING_ENHANCEMENTS_READY=true;

  var PREFIX='wctWeeklyMeetingDraft:v1:';
  var SAVE_DELAY=250;
  var timer=null;
  var currentForm=null;
  var currentKey='';

  function safe(value){
    return typeof esc==='function'?esc(value==null?'':String(value)):String(value==null?'':value);
  }
  function userId(){
    try{if(typeof currentUser!=='undefined'&&currentUser&&currentUser.id)return String(currentUser.id);}catch(ignore){}
    return 'anonymous';
  }
  function knownHubs(selected){
    var list=[];
    try{
      (state.cases||[]).forEach(function(item){if(item.hub_code)list.push(String(item.hub_code).trim().toUpperCase());});
      (state.profiles||[]).forEach(function(item){if(item.hub_code)list.push(String(item.hub_code).trim().toUpperCase());});
      (state.teamDirectory||[]).forEach(function(item){if(item.hub_code)list.push(String(item.hub_code).trim().toUpperCase());});
      if(currentUser&&currentUser.hub_code)list.push(String(currentUser.hub_code).trim().toUpperCase());
    }catch(ignore){}
    var value=String(selected||'');
    if(value&&value!=='Lintas HUB')list.push(value.toUpperCase());
    return Array.from(new Set(list.filter(Boolean))).sort();
  }
  function hubOptions(selected){
    var value=String(selected||'');
    return '<option value="">Pilih HUB</option>'+
      knownHubs(value).map(function(hub){
        return '<option value="'+safe(hub)+'"'+(hub===value?' selected':'')+'>'+safe(hub)+'</option>';
      }).join('')+
      '<option value="Lintas HUB"'+(value==='Lintas HUB'?' selected':'')+'>Lintas HUB / Beberapa HUB</option>';
  }
  function activeMeetingForm(){
    var modal=document.getElementById('modal');
    if(!modal)return null;
    var forms=modal.querySelectorAll('form');
    for(var i=0;i<forms.length;i++){
      var form=forms[i];
      if(form.querySelector('[name="meeting_date"]')&&form.querySelector('[name="title"]'))return form;
    }
    return null;
  }
  function addHubField(form){
    if(!form)return;
    var existing=form.querySelector('[name="hub_code"]');
    if(existing){
      existing.required=true;
      return;
    }
    var grid=form.querySelector('.form-grid');
    if(!grid)return;
    var title=form.querySelector('[name="title"]');
    var titleField=title&&title.closest('.field');
    var field=document.createElement('div');
    field.className='field wct-weekly-meeting-hub-field';
    field.innerHTML='<label>HUB *</label><select name="hub_code" required>'+hubOptions('')+'</select><small class="wct-meeting-field-help">Pilih satu HUB atau Lintas HUB untuk meeting gabungan.</small>';
    if(titleField&&titleField.parentNode===grid)titleField.insertAdjacentElement('afterend',field);
    else grid.insertBefore(field,grid.firstChild);
  }
  function meetingKey(form){
    var id=form&&form.dataset?form.dataset.wctMeetingId:'';
    return PREFIX+userId()+':'+(id?'edit:'+id:'new');
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
      }else if(el.tagName==='SELECT'&&el.multiple){
        values[el.name]=Array.prototype.filter.call(el.options,function(option){return option.selected;}).map(function(option){return String(option.value);});
      }else{
        values[el.name]=String(el.value==null?'':el.value);
      }
    });
    return values;
  }
  function hasUserContent(values){
    return Object.keys(values).some(function(key){
      var value=values[key];
      if(Array.isArray(value))return value.length>0;
      var text=String(value||'').trim();
      if(!text)return false;
      if(key==='meeting_date')return false;
      if(key==='title'&&text==='Weekly Operation Review')return false;
      return true;
    });
  }
  function timeText(value){
    var date=new Date(value||Date.now());
    if(isNaN(date.getTime()))date=new Date();
    return date.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'});
  }
  function notice(form,message){
    var body=form.querySelector('.modal-body')||form;
    var node=body.querySelector('.wct-weekly-meeting-draft-notice');
    if(!node){
      node=document.createElement('div');
      node.className='wct-weekly-meeting-draft-notice';
      node.setAttribute('role','status');
      body.insertBefore(node,body.querySelector('.form-grid')||body.firstChild);
    }
    node.innerHTML='<span class="wct-meeting-draft-indicator"></span><span class="wct-meeting-draft-message"></span><button type="button" data-wct-meeting-draft-clear>Hapus draft</button>';
    node.querySelector('.wct-meeting-draft-message').textContent=message;
  }
  function setNoticeSaved(form,updatedAt){
    notice(form,'Draft tersimpan otomatis · terakhir '+timeText(updatedAt));
  }
  function restoreValues(form,values){
    Array.prototype.forEach.call(form.querySelectorAll('[name]'),function(el){
      if(!Object.prototype.hasOwnProperty.call(values,el.name))return;
      var saved=values[el.name],type=String(el.type||'').toLowerCase();
      if(type==='checkbox'||type==='radio'){
        el.checked=Array.isArray(saved)&&saved.indexOf(String(el.value))>=0;
      }else if(el.tagName==='SELECT'&&el.multiple){
        var selected=Array.isArray(saved)?saved.map(String):[];
        Array.prototype.forEach.call(el.options,function(option){option.selected=selected.indexOf(String(option.value))>=0;});
      }else{
        el.value=Array.isArray(saved)?String(saved[0]||''):String(saved==null?'':saved);
      }
    });
  }
  function clearByKey(key,form){
    try{localStorage.removeItem(key);}catch(ignore){}
    if(form){
      var node=form.querySelector('.wct-weekly-meeting-draft-notice');
      if(node)node.remove();
    }
    if(currentKey===key){currentKey='';currentForm=null;}
  }
  function saveNow(form){
    if(!form)return;
    var values=collect(form),key=meetingKey(form);
    currentKey=key;currentForm=form;
    if(!hasUserContent(values)){
      try{localStorage.removeItem(key);}catch(ignore){}
      return;
    }
    var updatedAt=new Date().toISOString();
    try{
      localStorage.setItem(key,JSON.stringify({version:1,updatedAt:updatedAt,values:values}));
      setNoticeSaved(form,updatedAt);
    }catch(error){
      notice(form,'Draft tidak dapat disimpan di browser ini. Jangan tutup form sebelum menyimpan meeting.');
    }
  }
  function scheduleSave(form){
    if(timer)clearTimeout(timer);
    timer=setTimeout(function(){timer=null;saveNow(form);},SAVE_DELAY);
  }
  function attach(form){
    if(!form||form.dataset.wctMeetingDraftAttached==='1')return;
    addHubField(form);
    form.dataset.wctMeetingDraftAttached='1';
    currentForm=form;currentKey=meetingKey(form);
    var saved=null;
    try{
      var raw=localStorage.getItem(currentKey);
      if(raw){
        var draft=JSON.parse(raw);
        var age=Date.now()-new Date(draft.updatedAt||0).getTime();
        if(draft&&draft.version===1&&draft.values&&age>=0&&age<30*86400000)saved=draft;
        else localStorage.removeItem(currentKey);
      }
    }catch(ignore){}
    if(saved){
      restoreValues(form,saved.values);
      setNoticeSaved(form,saved.updatedAt);
    }
    form.addEventListener('input',function(){scheduleSave(form);},true);
    form.addEventListener('change',function(){scheduleSave(form);},true);
  }
  function flush(){
    if(timer){clearTimeout(timer);timer=null;}
    if(currentForm)saveNow(currentForm);
  }
  function clearForForm(form){
    if(!form)return;
    clearByKey(meetingKey(form),form);
  }
  function clearForMeeting(id){
    clearByKey(PREFIX+userId()+':edit:'+String(id),'');
  }
  function scan(){
    var form=activeMeetingForm();
    if(form&&form!==currentForm)attach(form);
    else if(form&&form.dataset.wctMeetingDraftAttached!=='1')attach(form);
    else if(!form&&currentForm){
      flush();
      currentForm=null;
      currentKey='';
    }
  }
  function decorateMeetingHistory(){
    if(!(typeof state!=='undefined'&&state&&Array.isArray(state.meetings)))return;
    document.querySelectorAll('.meeting-box .meeting-row').forEach(function(row){
      var detail=row.querySelector('button[onclick^="viewMeeting("]');
      if(!detail)return;
      var match=(detail.getAttribute('onclick')||'').match(/viewMeeting\(['"]([^'"]+)['"]\)/);
      if(!match)return;
      var meeting=state.meetings.find(function(item){return String(item.id)===String(match[1]);});
      if(!meeting||row.querySelector('[data-wct-meeting-hub-label]'))return;
      var label=document.createElement('small');
      label.dataset.wctMeetingHubLabel='1';
      label.className='wct-meeting-hub-label';
      label.textContent='HUB: '+(meeting.hub_code||'Belum ditentukan');
      var content=row.querySelector('div');
      if(content){
        var firstSmall=content.querySelector('small');
        if(firstSmall)firstSmall.insertAdjacentElement('afterend',label);
        else content.appendChild(label);
      }
    });
  }
  function wrapMeetingRender(){
    if(typeof window.renderMeeting!=='function'||window.renderMeeting.__wctHubWrapped)return;
    var original=window.renderMeeting;
    var wrapped=function(){
      var result=original.apply(this,arguments);
      decorateMeetingHistory();
      return result;
    };
    wrapped.__wctHubWrapped=true;
    window.renderMeeting=wrapped;
  }
  function wrapOpenForms(){
    if(typeof window.openMeetingForm==='function'&&!window.openMeetingForm.__wctDraftWrapped){
      var originalNew=window.openMeetingForm;
      var wrappedNew=function(){
        var result=originalNew.apply(this,arguments);
        setTimeout(scan,0);
        return result;
      };
      wrappedNew.__wctDraftWrapped=true;
      window.openMeetingForm=wrappedNew;
    }
    if(typeof window.openMeetingEditForm==='function'&&!window.openMeetingEditForm.__wctDraftWrapped){
      var originalEdit=window.openMeetingEditForm;
      var wrappedEdit=function(id){
        var result=originalEdit.apply(this,arguments);
        setTimeout(function(){
          var form=activeMeetingForm();
          if(form){form.dataset.wctMeetingId=String(id);attach(form);}
        },0);
        return result;
      };
      wrappedEdit.__wctDraftWrapped=true;
      window.openMeetingEditForm=wrappedEdit;
    }
  }
  async function submitNewMeeting(event){
    event.preventDefault();
    var form=event.currentTarget||event.target;
    if(typeof isCoordinator==='function'&&!isCoordinator()){
      if(typeof toast==='function')toast('Hanya koordinator/admin yang dapat mencatat hasil meeting.');
      return false;
    }
    var data=new FormData(form);
    var meeting={
      meeting_date:String(data.get('meeting_date')||''),
      title:String(data.get('title')||'').trim(),
      hub_code:String(data.get('hub_code')||''),
      summary:String(data.get('summary')||''),
      decisions:String(data.get('decisions')||''),
      next_steps:String(data.get('next_steps')||''),
      case_ids:data.getAll('case_ids').map(function(value){return String(value);}),
      created_by:currentUser.id,
      created_at:new Date().toISOString()
    };
    if(!meeting.meeting_date||!meeting.title||!meeting.hub_code){
      if(typeof toast==='function')toast('Tanggal, judul, dan HUB wajib diisi.');
      return false;
    }
    try{
      if(mode==='firebase'){
        var ref=await fireDb.collection('meetings').add(meeting);
        meeting.id=ref.id;
      }else{
        meeting.id='m-'+uid();
      }
      state.meetings.unshift(meeting);
      if(mode!=='firebase'&&typeof saveDemo==='function')saveDemo();
      clearForForm(form);
      if(typeof closeModal==='function')closeModal();
      if(typeof renderMeeting==='function')renderMeeting();
      else if(typeof renderPage==='function')renderPage();
      if(typeof toast==='function')toast('Hasil meeting berhasil disimpan.');
    }catch(error){
      if(typeof toast==='function')toast('Gagal menyimpan meeting: '+(error&&error.message?error.message:'Kesalahan tidak diketahui.'));
    }
    return false;
  }

  function start(){
    wrapOpenForms();
    wrapMeetingRender();
    if(typeof window.submitMeeting==='function')window.submitMeeting=submitNewMeeting;
    scan();
    var modal=document.getElementById('modal');
    if(modal&&!window.__WCT_WEEKLY_MEETING_OBSERVER){
      window.__WCT_WEEKLY_MEETING_OBSERVER=new MutationObserver(function(){scan();});
      window.__WCT_WEEKLY_MEETING_OBSERVER.observe(modal,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});
    }
    document.addEventListener('click',function(event){
      var target=event.target;
      if(!target||!target.closest)return;
      var close=target.closest('#modal .close,#modal [onclick*="closeModal"],#modal [data-wct-meeting-edit-cancel],#modal [data-wct-meeting-close]');
      if(close)flush();
      var clear=target.closest('[data-wct-meeting-draft-clear]');
      if(clear){
        event.preventDefault();
        var form=activeMeetingForm();
        if(form)clearForForm(form);
      }
    },true);
    document.addEventListener('keydown',function(event){if(event.key==='Escape')flush();},true);
    window.addEventListener('pagehide',flush);
    window.addEventListener('beforeunload',flush);
    window.WCTWeeklyMeetingDraft={
      clearForm:clearForForm,
      clearMeeting:clearForMeeting,
      flush:flush
    };
    window.WCTWeeklyMeetingEnhancementsReady=true;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
`;
  try { new Function(runtime); } catch (error) { throw new Error('Weekly Meeting enhancements syntax check failed: ' + error.message); }
  const style = '.wct-weekly-meeting-draft-notice{display:flex;align-items:center;gap:9px;margin:0 0 14px;padding:10px 12px;border:1px solid #D7E6F4;border-radius:10px;background:#EFF6FD;color:#355779;font-size:11px;line-height:1.4}.wct-meeting-draft-indicator{width:8px;height:8px;flex:0 0 8px;border-radius:50%;background:#26986B;box-shadow:0 0 0 3px rgba(38,152,107,.12)}.wct-meeting-draft-message{flex:1;min-width:0}.wct-weekly-meeting-draft-notice button{border:0;background:transparent;color:#6C7F94;font:700 10px inherit;text-decoration:underline;cursor:pointer;padding:5px}.wct-meeting-field-help{display:block;margin-top:5px;color:var(--muted);font-size:10px}.wct-meeting-hub-label{display:inline-flex;margin-top:5px;padding:3px 7px;border-radius:6px;background:#FFF2D9;color:#8A5700;font-size:9px;font-weight:800}:root[data-wct-appearance="dark"] .wct-weekly-meeting-draft-notice{border-color:#3B5165;background:#1A2A39;color:#D5E3F0}:root[data-wct-appearance="dark"] .wct-weekly-meeting-draft-notice button{color:#E7B65B}:root[data-wct-appearance="dark"] .wct-meeting-hub-label{background:#3A2C18;color:#FFD28A}@media(max-width:600px){.wct-weekly-meeting-draft-notice{align-items:flex-start;flex-wrap:wrap}.wct-weekly-meeting-draft-notice button{margin-left:auto}}';
  return html.replace('</body>', '<style id="wct-weekly-meeting-enhancements-style">' + style + '</style><script id="wct-weekly-meeting-enhancements-runtime">' + runtime + '</script></body>');
};
