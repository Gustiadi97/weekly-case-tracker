module.exports = function addWeeklyMeetingItems(html) {
  if (!html || !html.includes('</body>')) throw new Error('Could not find document body for Weekly Meeting items.');
  const runtime = String.raw`
(function(){
  'use strict';
  if(window.__WCT_WEEKLY_MEETING_ITEMS_READY)return;
  window.__WCT_WEEKLY_MEETING_ITEMS_READY=true;
  var DEFAULTS={categories:['Inbound','Outbound','Sorting','Productivity','Service Level','Facility & Safety','People / Manpower','Transportation','Reporting','Other'],divisions:['Hub Operations','Gateway','Last Mile','Transport','Facility','Human Capital','GA','Other']};
  var pointCounter=0;
  function safe(v){return typeof esc==='function'?esc(v==null?'':String(v)):String(v==null?'':v);}
  function canManage(){return typeof isCoordinator==='function'&&isCoordinator();}
  function notify(s){if(typeof toast==='function')toast(s);}
  function opts(){var o=state.caseOptions||{};return {categories:Array.isArray(o.categories)&&o.categories.length?o.categories:DEFAULTS.categories,divisions:Array.isArray(o.divisions)&&o.divisions.length?o.divisions:DEFAULTS.divisions};}
  function hubs(selected){var a=[];(state.cases||[]).forEach(function(x){if(x.hub_code)a.push(String(x.hub_code).toUpperCase());});(state.profiles||[]).forEach(function(x){if(x.hub_code)a.push(String(x.hub_code).toUpperCase());});if(currentUser&&currentUser.hub_code)a.push(String(currentUser.hub_code).toUpperCase());if(selected)a.push(String(selected).toUpperCase());return Array.from(new Set(a.filter(Boolean))).sort();}
  function hubOptions(selected){var v=String(selected||'').toUpperCase();return '<option value="">Pilih HUB</option>'+hubs(v).map(function(x){return '<option value="'+safe(x)+'"'+(v===x?' selected':'')+'>'+safe(x)+'</option>';}).join('')+'<option value="Lintas HUB"'+(v==='Lintas HUB'?' selected':'')+'>Lintas HUB / Beberapa HUB</option>';}
  function listOptions(values,selected){return '<option value="">Pilih</option>'+values.map(function(x){return '<option value="'+safe(x)+'"'+(String(x)===String(selected||'')?' selected':'')+'>'+safe(x)+'</option>';}).join('');}
  function categories(selected){return '<option value="">Pilih kategori</option>'+opts().categories.map(function(x){return '<option value="'+safe(x)+'"'+(x===selected?' selected':'')+'>'+safe(x)+'</option>';}).join('');}
  function divisions(selected){return '<option value="">Pilih divisi</option>'+opts().divisions.map(function(x){return '<option value="'+safe(x)+'"'+(x===selected?' selected':'')+'>'+safe(x)+'</option>';}).join('');}
  function profiles(selected){return '<option value="">Pilih PIC (opsional)</option>'+(state.profiles||[]).filter(function(p){return p.active!==false&&p.deleted!==true&&p.role!=='viewer';}).map(function(p){return '<option value="'+safe(p.id)+'"'+(String(p.id)===String(selected||'')?' selected':'')+'>'+safe(p.full_name||p.login_id||'User')+'</option>';}).join('');}
  function cases(selected){return '<option value="">Pilih Case yang sudah ada</option>'+(state.cases||[]).slice().sort(function(a,b){return String(a.case_code||'').localeCompare(String(b.case_code||''));}).map(function(x){var label=(x.case_code||'Case')+' · '+(x.title||'')+' · '+(x.hub_code||'—')+(x.status==='closed'?' · Closed':'');return '<option value="'+safe(x.id)+'"'+(String(x.id)===String(selected||'')?' selected':'')+'>'+safe(label)+'</option>';}).join('');}
  function findMeeting(id){return (state.meetings||[]).find(function(m){return String(m.id)===String(id);})||null;}
  function findCase(id){return (state.cases||[]).find(function(c){return String(c.id)===String(id);})||null;}
  function pointKey(i,item){return item.client_key||item.id||('new-'+i);}
  function projectFields(item,meeting,key){
    var p=item.project||{},actions=Array.isArray(p.actions)?p.actions:[],ca=p.ca||actions.find(function(a){return a.action_type==='corrective';})||{},pa=p.pa||actions.find(function(a){return a.action_type==='preventive';})||{},caseId=item.case_id||'';
    if(caseId){var c=findCase(caseId);return '<section class="wct-meeting-project-created" data-wct-item-panel="new_case"><div><span class="wct-meeting-type-tag">CASE / PROJECT SUDAH DIBUAT</span><strong>'+safe(c?(c.case_code||'Case')+' · '+c.title:'Case terhubung')+'</strong><small>'+safe(c?((c.hub_code||'—')+' · '+(c.status||'open')):caseId)+'</small></div><button type="button" class="btn btn-sm" data-wct-open-case-id="'+safe(caseId)+'">Buka Case</button><p>Detail project selanjutnya dikelola melalui Case Monitoring.</p></section>';}
    var report=p.reporter||((currentUser&&(currentUser.full_name||currentUser.login_id))||'');
    return '<section class="wct-meeting-project-fields" data-wct-item-panel="new_case"><div class="wct-meeting-subhead"><strong>Data Case / Project baru</strong><span>Wajib dilengkapi agar tercatat di Case Monitoring</span></div><div class="form-grid">'+
      '<div class="field"><label>HUB *</label><input data-wct-project-hub name="project_'+safe(key)+'_hub" value="'+safe(p.hub_code||meeting.hub_code||'')+'" required placeholder="Contoh: MKS" autocapitalize="characters"></div>'+
      '<div class="field"><label>Kategori *</label><select data-wct-project-category name="project_'+safe(key)+'_category" required>'+categories(p.category)+'</select></div>'+
      '<div class="field"><label>Divisi *</label><select data-wct-project-division name="project_'+safe(key)+'_division" required>'+divisions(p.division)+'</select></div>'+
      '<div class="field"><label>Tanggal kejadian *</label><input type="date" data-wct-project-occurred name="project_'+safe(key)+'_occurred" value="'+safe(p.occurred_on||meeting.meeting_date||todayISO())+'" required></div>'+
      '<div class="field"><label>Target penyelesaian awal</label><input type="date" data-wct-project-target name="project_'+safe(key)+'_target" value="'+safe(p.target_date||'')+'"></div>'+
      '<div class="field"><label>Pelapor</label><input data-wct-project-reporter name="project_'+safe(key)+'_reporter" value="'+safe(report)+'"></div>'+
      '<div class="field"><label>Prioritas *</label><select data-wct-project-priority name="project_'+safe(key)+'_priority" required><option value="High"'+(p.priority==='High'?' selected':'')+'>High</option><option value="Medium"'+(!p.priority||p.priority==='Medium'?' selected':'')+'>Medium</option><option value="Low"'+(p.priority==='Low'?' selected':'')+'>Low</option></select></div>'+
      '<div class="field span-2"><label>Problem Identification *</label><textarea data-wct-project-problem name="project_'+safe(key)+'_problem" required placeholder="Jelaskan masalah, kondisi saat ini, dan dampaknya">'+safe(p.problem_identification||item.summary||'')+'</textarea></div></div>'+
      '<div class="wct-meeting-project-action-grid"><div class="wct-meeting-project-action"><strong>Corrective Action awal (opsional)</strong><input data-wct-ca-title name="project_'+safe(key)+'_ca_title" value="'+safe(ca.title||'')+'" placeholder="Tindakan perbaikan langsung"><div class="form-grid"><div class="field"><label>PIC</label><select data-wct-ca-pic name="project_'+safe(key)+'_ca_pic">'+profiles(ca.assigned_to)+'</select></div><div class="field"><label>Target</label><input type="date" data-wct-ca-due name="project_'+safe(key)+'_ca_due" value="'+safe(ca.due_date||'')+'"></div></div></div>'+
      '<div class="wct-meeting-project-action"><strong>Preventive Action awal (opsional)</strong><input data-wct-pa-title name="project_'+safe(key)+'_pa_title" value="'+safe(pa.title||'')+'" placeholder="Tindakan pencegahan"><div class="form-grid"><div class="field"><label>PIC</label><select data-wct-pa-pic name="project_'+safe(key)+'_pa_pic">'+profiles(pa.assigned_to)+'</select></div><div class="field"><label>Target</label><input type="date" data-wct-pa-due name="project_'+safe(key)+'_pa_due" value="'+safe(pa.due_date||'')+'"></div></div></div></div></section>';
  }
  function renderPoint(item,index,meeting){
    item=item||{};var key=pointKey(index,item),kind=item.kind||'discussion';
    var badge=kind==='new_case'?'Case / Project baru':kind==='existing_case'?'Case yang sudah ada':'Pembahasan saja';
    var existing=findCase(item.case_id);
    var panel=projectFields(item,meeting,key);
    if(kind!=='new_case')panel=panel.replace('data-wct-item-panel="new_case"','data-wct-item-panel="new_case" hidden');
    return '<article class="wct-meeting-point" data-wct-meeting-point data-point-key="'+safe(key)+'" data-item-id="'+safe(item.id||'')+'" data-case-id="'+safe(item.case_id||'')+'" data-original-kind="'+safe(kind)+'"><div class="wct-meeting-point-head"><div><span class="wct-meeting-point-number">POIN '+(index+1)+'</span><span class="wct-meeting-type-tag">'+safe(badge)+'</span></div><button type="button" class="wct-meeting-point-remove" data-wct-remove-meeting-point>Hapus</button></div>'+
      '<div class="form-grid"><div class="field"><label>Jenis poin *</label><select data-wct-item-kind name="point_'+safe(key)+'_kind"><option value="discussion"'+(kind==='discussion'?' selected':'')+'>Pembahasan baru</option><option value="existing_case"'+(kind==='existing_case'?' selected':'')+'>Hubungkan Case yang sudah ada</option><option value="new_case"'+(kind==='new_case'?' selected':'')+'>Jadikan Case / Project baru</option></select></div><div class="field"><label>Judul pembahasan *</label><input data-wct-item-title name="point_'+safe(key)+'_title" value="'+safe(item.title||'')+'" required placeholder="Contoh: Kendala proses outbound HUB BJM"></div></div>'+
      '<section class="wct-meeting-existing-case" data-wct-item-panel="existing_case"'+(kind==='existing_case'?'':' hidden')+'><div class="field"><label>Pilih Case terkait *</label><select data-wct-existing-case name="point_'+safe(key)+'_case_id">'+cases(item.case_id)+'</select></div>'+(existing?'<small>Terhubung ke '+safe(existing.case_code||'Case')+' · '+safe(existing.hub_code||'—')+'</small>':'')+'</section>'+panel+
      '<div class="wct-meeting-point-notes"><div class="field"><label>Ringkasan pembahasan</label><textarea data-wct-item-summary name="point_'+safe(key)+'_summary" placeholder="Apa yang dibahas pada poin ini?">'+safe(item.summary||'')+'</textarea></div><div class="field"><label>Keputusan / Arahan</label><textarea data-wct-item-decisions name="point_'+safe(key)+'_decisions" placeholder="Apa keputusan atau arahan yang disepakati?">'+safe(item.decisions||'')+'</textarea></div><div class="field"><label>Next Step / Tindak Lanjut</label><textarea data-wct-item-next-step name="point_'+safe(key)+'_next_step" placeholder="Apa tindak lanjut atau langkah berikutnya?">'+safe(item.next_step||'')+'</textarea></div></div></article>';
  }
  function nextKey(form){var max=-1;form.querySelectorAll('[data-point-key]').forEach(function(c){var m=String(c.dataset.pointKey||'').match(/^new-(\\d+)$/);if(m)max=Math.max(max,Number(m[1]));});pointCounter=Math.max(pointCounter,max+1);return 'new-'+(pointCounter++);}
  function readPoints(form){
    return Array.prototype.map.call(form.querySelectorAll('[data-wct-meeting-point]'),function(card,index){
      function val(selector){var el=card.querySelector(selector);return el?String(el.value||'').trim():'';}
      var kind=val('[data-wct-item-kind]')||'discussion';
      var item={id:card.dataset.itemId||null,client_key:card.dataset.pointKey||('new-'+index),sort_order:index,kind:kind,title:val('[data-wct-item-title]'),summary:val('[data-wct-item-summary]'),decisions:val('[data-wct-item-decisions]'),next_step:val('[data-wct-item-next-step]')};
      if(kind==='existing_case')item.case_id=val('[data-wct-existing-case]')||null;
      if(kind==='new_case'){
        if(card.dataset.caseId)item.case_id=card.dataset.caseId;
        else{
          var ca=val('[data-wct-ca-title]'),pa=val('[data-wct-pa-title]'),actions=[];
          if(ca)actions.push({action_type:'corrective',title:ca,description:'',assigned_to:val('[data-wct-ca-pic]')||null,due_date:val('[data-wct-ca-due]')||null});
          if(pa)actions.push({action_type:'preventive',title:pa,description:'',assigned_to:val('[data-wct-pa-pic]')||null,due_date:val('[data-wct-pa-due]')||null});
          item.project={hub_code:val('[data-wct-project-hub]').toUpperCase(),category:val('[data-wct-project-category]'),division:val('[data-wct-project-division]'),occurred_on:val('[data-wct-project-occurred]'),target_date:val('[data-wct-project-target]')||null,reporter:val('[data-wct-project-reporter]'),priority:val('[data-wct-project-priority]')||'Medium',problem_identification:val('[data-wct-project-problem]'),actions:actions,ca:{title:ca,assigned_to:val('[data-wct-ca-pic]')||null,due_date:val('[data-wct-ca-due]')||null},pa:{title:pa,assigned_to:val('[data-wct-pa-pic]')||null,due_date:val('[data-wct-pa-due]')||null}};
        }
      }
      return item;
    });
  }
  function syncDraft(form){var hidden=form&&form.querySelector('[name="meeting_items_json"]');if(hidden)hidden.value=JSON.stringify(readPoints(form));}
  function renumber(form){form.querySelectorAll('[data-wct-meeting-point]').forEach(function(card,i){var n=card.querySelector('.wct-meeting-point-number');if(n)n.textContent='POIN '+(i+1);});var count=form.querySelector('[data-wct-point-count]');if(count)count.textContent=form.querySelectorAll('[data-wct-meeting-point]').length+' poin';}
  function updatePanel(card){if(!card)return;var k=card.querySelector('[data-wct-item-kind]');var kind=k?k.value:'discussion';var project=card.querySelector('[data-wct-item-panel="new_case"]');if(kind==='new_case'&&project&&project.classList.contains('wct-meeting-project-created')&&!card.dataset.caseId){var form=card.closest('form');var item={title:(card.querySelector('[data-wct-item-title]')||{}).value||'',summary:(card.querySelector('[data-wct-item-summary]')||{}).value||'',client_key:card.dataset.pointKey,project:{}};var meeting={meeting_date:(form&&form.querySelector('[name="meeting_date"]')||{}).value||todayISO(),hub_code:(form&&form.querySelector('[name="hub_code"]')||{}).value||''};project.outerHTML=projectFields(item,meeting,card.dataset.pointKey);project=card.querySelector('[data-wct-item-panel="new_case"]');}card.querySelectorAll('[data-wct-item-panel]').forEach(function(panel){var active=panel.getAttribute('data-wct-item-panel')===kind;panel.hidden=!active;panel.querySelectorAll('input,select,textarea,button').forEach(function(control){control.disabled=!active;});});var badge=card.querySelector('.wct-meeting-type-tag');if(badge)badge.textContent=kind==='new_case'?'Case / Project baru':kind==='existing_case'?'Case yang sudah ada':'Pembahasan saja';}
  function addPoint(form,item){
    item=item||{};if(!item.client_key&&!item.id)item.client_key=nextKey(form);
    var host=form.querySelector('[data-wct-meeting-points]');if(!host)return;
    var idx=host.querySelectorAll('[data-wct-meeting-point]').length;
    host.insertAdjacentHTML('beforeend',renderPoint(item,idx,{meeting_date:(form.querySelector('[name="meeting_date"]')||{}).value||todayISO(),hub_code:(form.querySelector('[name="hub_code"]')||{}).value||''}));
    var card=host.lastElementChild;if(card)updatePanel(card);renumber(form);syncDraft(form);
  }
  function restoreDraft(form){
    if(!form||form.dataset.wctPointsDraftRestored==='1')return;
    form.dataset.wctPointsDraftRestored='1';
    var hidden=form.querySelector('[name="meeting_items_json"]');if(!hidden||!hidden.value)return;
    try{var arr=JSON.parse(hidden.value);if(!Array.isArray(arr)||!arr.length)return;var host=form.querySelector('[data-wct-meeting-points]');host.innerHTML='';arr.forEach(function(item){item.client_key=item.client_key||item.id;addPoint(form,item);});renumber(form);syncDraft(form);}catch(e){console.warn('Weekly Meeting points draft restore failed:',e);}
  }
  function legacyItems(meeting){
    var arr=[];
    if(String(meeting.summary||'').trim()||String(meeting.decisions||'').trim()||String(meeting.next_steps||'').trim())arr.push({kind:'discussion',title:'Catatan meeting sebelumnya',summary:meeting.summary||'',decisions:meeting.decisions||'',next_step:meeting.next_steps||''});
    (meeting.case_ids||[]).forEach(function(id){var c=findCase(id);arr.push({kind:'existing_case',title:c?'Pembahasan '+(c.case_code||'Case')+' · '+c.title:'Pembahasan Case sebelumnya',case_id:String(id)});});
    if(!arr.length)arr.push({kind:'discussion',title:'',summary:'',decisions:'',next_step:''});
    return arr;
  }
  function getItems(meeting){
    return window.wctSupabase.from('wct_meeting_items').select('*').eq('meeting_id',meeting.id).order('sort_order',{ascending:true}).then(function(r){if(r.error)throw r.error;return r.data&&r.data.length?r.data:legacyItems(meeting);});
  }
  function meetingForm(meeting,items,isEdit){
    var date=String(meeting.meeting_date||todayISO()).slice(0,10),id=isEdit?String(meeting.id):'';
    var markup='<div class="modal-head"><div><div class="eyebrow">MEETING MINUTES</div><h2>'+(isEdit?'Edit Hasil Weekly Meeting':'Catat Hasil Weekly Meeting')+'</h2><p class="sub">Setiap poin bisa berupa pembahasan baru, Case lama, atau Case / Project baru.</p></div><button type="button" class="close" onclick="closeModal()">×</button></div>'+
      '<form id="wctMeetingItemsForm" data-wct-meeting-items-form'+(id?' data-wct-meeting-id="'+safe(id)+'"':'')+' onsubmit="return submitMeeting(event)"><div class="modal-body"><div class="form-grid"><div class="field"><label>Tanggal meeting *</label><input type="date" name="meeting_date" value="'+safe(date)+'" required></div><div class="field"><label>Judul meeting *</label><input name="title" value="'+safe(meeting.title||'Weekly Operation Review')+'" required maxlength="160"></div><div class="field"><label>HUB meeting *</label><select name="hub_code" required>'+hubOptions(meeting.hub_code)+'</select></div></div>'+
      '<div class="wct-meeting-points-intro"><div><strong>Poin Pembahasan</strong><p>Tambahkan satu poin untuk setiap Case, project, atau topik.</p></div><span data-wct-point-count>'+items.length+' poin</span></div><div class="wct-meeting-points" data-wct-meeting-points></div><button type="button" class="wct-meeting-add-point" data-wct-add-meeting-point><span>＋</span> Tambah Poin Pembahasan</button><input type="hidden" name="meeting_items_json" value=""><div class="wct-meeting-form-footnote">Case / Project baru akan masuk ke Case Monitoring. Case tersebut tetap tersimpan walaupun catatan meeting dihapus.</div></div><div class="modal-foot"><button type="button" class="btn" onclick="closeModal()">Batal</button><button type="submit" class="btn btn-primary">'+(isEdit?'Simpan Perubahan':'Simpan Hasil Meeting')+'</button></div></form>';
    openModal(markup,true);
    var form=document.querySelector('#modal #wctMeetingItemsForm');
    if(form){
      if(id)form.dataset.wctMeetingId=id;
      (items.length?items:[{kind:'discussion',title:''}]).forEach(function(item){addPoint(form,item);});
      form.addEventListener('input',function(){syncDraft(form);},true);
      form.addEventListener('change',function(){syncDraft(form);},true);
      syncDraft(form);
      window.setTimeout(function(){restoreDraft(form);},100);
    }
  }
  function validate(items){
    if(!items.length){notify('Tambahkan minimal satu poin pembahasan.');return false;}
    for(var i=0;i<items.length;i++){
      var x=items[i];if(!x.title){notify('Judul Poin '+(i+1)+' wajib diisi.');return false;}
      if(x.kind==='existing_case'&&!x.case_id){notify('Pilih Case untuk Poin '+(i+1)+'.');return false;}
      if(x.kind==='new_case'&&!x.case_id){var p=x.project||{};if(!p.hub_code||!p.category||!p.division||!p.occurred_on||!p.problem_identification){notify('Lengkapi data Case / Project baru pada Poin '+(i+1)+'.');return false;}}
    }
    return true;
  }
  function formMeeting(form){var d=new FormData(form);return {title:String(d.get('title')||'').trim(),meeting_date:String(d.get('meeting_date')||''),hub_code:String(d.get('hub_code')||'').trim().toUpperCase()};}
  function setBusy(form,busy){var b=form.querySelector('button[type="submit"]');if(!b)return;if(busy){b.dataset.wctOldLabel=b.textContent;b.disabled=true;b.setAttribute('aria-busy','true');b.textContent='Menyimpan meeting dan poin...';}else{b.disabled=false;b.removeAttribute('aria-busy');b.textContent=b.dataset.wctOldLabel||'Simpan';}}
  function parseMeeting(row,hub,caseIds){var n={};try{n=JSON.parse(row.notes||'{}');}catch(e){}return Object.assign({},row,{hub_code:n.hub_code||hub||'',summary:n.summary||'',decisions:n.decisions||'',next_steps:n.next_steps||'',case_ids:Array.isArray(caseIds)?caseIds:(n.case_ids||[])});}
  async function save(event,id){
    event.preventDefault();var form=event.currentTarget||event.target;id=id||(form&&form.dataset.wctMeetingId)||null;
    if(!canManage()){notify('Hanya Admin atau Koordinator yang dapat mencatat hasil meeting.');return false;}
    var meeting=formMeeting(form),items=readPoints(form);
    if(!meeting.title||!meeting.meeting_date||!meeting.hub_code){notify('Tanggal, judul, dan HUB meeting wajib diisi.');return false;}
    if(!validate(items))return false;
    if(!window.wctSupabase){notify('Koneksi Supabase belum siap.');return false;}
    items=items.map(function(x){var y=Object.assign({},x);delete y.client_key;return y;});
    setBusy(form,true);var committed=false;
    try{
      var r=await window.wctSupabase.rpc('wct_save_meeting_with_items',{p_meeting_id:id||null,p_meeting:meeting,p_items:items});
      if(r.error)throw r.error;var d=r.data||{};if(!d.meeting||!d.meeting.id)throw new Error('Database tidak mengembalikan ID meeting.');
      committed=true;var m=parseMeeting(d.meeting,meeting.hub_code,d.case_ids||[]);
      var pos=(state.meetings||[]).findIndex(function(x){return String(x.id)===String(m.id);});
      if(pos>=0)state.meetings[pos]=Object.assign({},state.meetings[pos],m);else state.meetings.unshift(m);
      state.meetingItems=(state.meetingItems||[]).filter(function(x){return String(x.meeting_id)!==String(m.id);}).concat(d.items||[]);
      try{if(typeof window.refreshData==='function')await window.refreshData();}catch(refreshError){console.warn('Meeting saved but refresh failed:',refreshError);}
      if(window.WCTWeeklyMeetingDraft){if(id&&window.WCTWeeklyMeetingDraft.clearMeeting)window.WCTWeeklyMeetingDraft.clearMeeting(id);else if(window.WCTWeeklyMeetingDraft.clearForm)window.WCTWeeklyMeetingDraft.clearForm(form);}
      closeModal();if(window.renderMeeting)window.renderMeeting();else if(window.renderPage)window.renderPage();
      var n=(d.items||[]).filter(function(x){return x.kind==='new_case';}).length;
      notify('Hasil meeting berhasil disimpan.'+(n?' '+n+' Case / Project baru dibuat.':''));
    }catch(error){console.error('Save Weekly Meeting failed:',error);notify('Gagal menyimpan meeting: '+(error.message||error));if(!committed)setBusy(form,false);}
    return false;
  }
  async function openNew(){if(!canManage()){notify('Hanya Admin atau Koordinator yang dapat mencatat hasil meeting.');return;}meetingForm({meeting_date:todayISO(),title:'Weekly Operation Review',hub_code:currentUser&&currentUser.hub_code||''},[{kind:'discussion',title:''}],false);}
  async function openEdit(id){if(!canManage())return;var m=findMeeting(id);if(!m){notify('Catatan meeting tidak ditemukan.');return;}try{var items=await getItems(m);meetingForm(m,items,true);}catch(e){console.error(e);notify('Gagal memuat poin meeting: '+(e.message||e));}}
  async function view(id){
    var m=findMeeting(id);if(!m)return;
    try{
      var items=await getItems(m);
      var body='<div class="modal-head"><div><div class="eyebrow">MEETING MINUTES</div><h2>'+safe(m.title||'Weekly Meeting')+'</h2></div><button type="button" class="close" onclick="closeModal()">×</button></div><div class="modal-body"><div class="wct-meeting-detail-meta"><span class="pill">'+safe(fmtDate(m.meeting_date))+'</span><span class="pill">HUB: '+safe(m.hub_code||'—')+'</span></div><div class="wct-meeting-detail-points">'+items.map(function(x,i){var c=x.case_id?findCase(x.case_id):null;var type=x.kind==='new_case'?'Case / Project baru':x.kind==='existing_case'?'Case yang sudah ada':'Pembahasan';return '<article class="wct-meeting-detail-point"><div class="wct-meeting-detail-point-head"><span class="wct-meeting-point-number">POIN '+(i+1)+'</span><span class="wct-meeting-type-tag">'+safe(type)+'</span></div><h3>'+safe(x.title||'Tanpa judul')+'</h3>'+(c?'<div class="wct-meeting-linked-case"><strong>'+safe(c.case_code||'Case')+'</strong><span>'+safe(c.hub_code||'—')+' · '+safe(c.status||'open')+'</span><button type="button" class="btn btn-sm" data-wct-open-case-id="'+safe(c.id)+'">Buka Case / Project</button></div>':'')+
      '<div class="wct-meeting-detail-field"><strong>Ringkasan</strong><p>'+safe(x.summary||'—')+'</p></div><div class="wct-meeting-detail-field"><strong>Keputusan / Arahan</strong><p>'+safe(x.decisions||'—')+'</p></div><div class="wct-meeting-detail-field"><strong>Next Step</strong><p>'+safe(x.next_step||'—')+'</p></div></article>';}).join('')+'</div></div><div class="modal-foot"><button type="button" class="btn" data-wct-meeting-close>Tutup</button>'+(canManage()?'<button type="button" class="btn btn-primary" data-wct-meeting-edit="'+safe(m.id)+'">Edit Meeting</button><button type="button" class="btn btn-danger wct-meeting-delete-icon" data-wct-meeting-delete="'+safe(m.id)+'" aria-label="Hapus riwayat meeting">Hapus</button>':'')+'</div>';
      openModal(body,true);
    }catch(e){console.error(e);notify('Gagal membuka detail meeting: '+(e.message||e));}
  }
  function refreshList(){
    document.querySelectorAll('#pageContent .meeting-box .meeting-row').forEach(function(row){
      var b=row.querySelector('button[onclick^="viewMeeting("]');if(!b)return;var match=(b.getAttribute('onclick')||'').match(/viewMeeting\\(['"]([^'"]+)['"]\\)/);if(!match)return;
      var m=findMeeting(match[1]);if(!m)return;var count=(state.meetingItems||[]).filter(function(x){return String(x.meeting_id)===String(m.id);}).length;
      var s=row.querySelector('small');if(s)s.textContent=(fmtDate(m.meeting_date)||m.meeting_date)+' · '+(count?count+' poin pembahasan':((m.case_ids||[]).length?'Case terkait':'Catatan meeting lama'));
    });
  }
  function wrapRender(){if(!window.renderMeeting||window.renderMeeting.__wctItemsWrapped)return;var old=window.renderMeeting;var fn=function(){var r=old.apply(this,arguments);refreshList();return r;};fn.__wctItemsWrapped=true;window.renderMeeting=fn;}
  function wrapRefresh(){if(!window.refreshData||window.refreshData.__wctItemsWrapped)return;var old=window.refreshData;var fn=async function(){var r=await old.apply(this,arguments);try{var q=await window.wctSupabase.from('wct_meeting_items').select('*').order('sort_order',{ascending:true});if(q.error)throw q.error;state.meetingItems=q.data||[];}catch(e){console.warn('Weekly Meeting items load failed:',e);state.meetingItems=[];}return r;};fn.__wctItemsWrapped=true;window.refreshData=fn;}
  document.addEventListener('click',function(e){
    var add=e.target.closest&&e.target.closest('[data-wct-add-meeting-point]');if(add){e.preventDefault();var f=add.closest('form');addPoint(f,{kind:'discussion',title:''});return;}
    var del=e.target.closest&&e.target.closest('[data-wct-remove-meeting-point]');if(del){e.preventDefault();var c=del.closest('[data-wct-meeting-point]'),f2=del.closest('form');if(f2.querySelectorAll('[data-wct-meeting-point]').length<=1){notify('Minimal satu poin pembahasan harus tersedia.');return;}c.remove();renumber(f2);syncDraft(f2);return;}
    var open=e.target.closest&&e.target.closest('[data-wct-open-case-id]');if(open){e.preventDefault();var cid=open.dataset.wctOpenCaseId;closeModal();if(window.openCaseDetail)window.openCaseDetail(cid);}
  });
  document.addEventListener('change',function(e){
    if(e.target.matches&&e.target.matches('[data-wct-item-kind]')){var c=e.target.closest('[data-wct-meeting-point]');if(c){if(c.dataset.lastKind!==e.target.value&&e.target.value==='new_case'&&c.dataset.originalKind!=='new_case')c.dataset.caseId='';c.dataset.lastKind=e.target.value;updatePanel(c);syncDraft(c.closest('form'));}}
  });
  function installHandlers(){
    // Run after older DOMContentLoaded handlers. The previous meeting-draft and UUID
    // compatibility layers also wrap submitMeeting; this structured handler must win.
    window.submitMeeting=save;
    window.submitMeeting.__wctStructuredItems=true;
    window.submitMeeting.__wctSupabaseUuidSave=true;
    window.openMeetingForm=openNew;
    window.openMeetingEditForm=openEdit;
    window.submitMeetingEdit=save;
    window.viewMeeting=view;
    wrapRender();wrapRefresh();
  }
  installHandlers();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installHandlers,{once:true});
  window.WCTWeeklyMeetingItemsReady=true;
})();
`;
  try { new Function(runtime); } catch (error) { throw new Error('Weekly Meeting items runtime syntax check failed: ' + error.message); }
  const style = String.raw`
.wct-meeting-points-intro{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:18px 0 10px}.wct-meeting-points-intro strong{font-size:14px;color:var(--ink)}.wct-meeting-points-intro p{margin:4px 0 0;color:var(--muted);font-size:11px}.wct-meeting-points-intro>span{padding:6px 10px;border-radius:999px;background:#EDF4FF;color:#245BA7;font-size:10px;font-weight:800;white-space:nowrap}
.wct-meeting-points{display:grid;gap:12px}.wct-meeting-point{padding:14px;border:1px solid #DCE5EF;border-radius:14px;background:#FBFCFE}.wct-meeting-point-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}.wct-meeting-point-head>div{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.wct-meeting-point-number{display:inline-flex;align-items:center;padding:5px 8px;border-radius:7px;background:#EAF1FC;color:#285C9F;font-size:9px;font-weight:900;letter-spacing:.06em}.wct-meeting-type-tag{display:inline-flex;align-items:center;padding:5px 8px;border-radius:7px;background:#F0F3F7;color:#5E7188;font-size:9px;font-weight:800}.wct-meeting-point-remove{border:1px solid #E8C9CC;border-radius:8px;background:#FFF6F6;color:#A6424C;padding:6px 9px;font-size:10px;font-weight:800;cursor:pointer}.wct-meeting-point .form-grid{gap:10px}.wct-meeting-point .field{min-width:0}.wct-meeting-point .field label{font-size:10px}.wct-meeting-point .field textarea{min-height:72px}.wct-meeting-point-notes{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:12px}
.wct-meeting-existing-case,.wct-meeting-project-fields,.wct-meeting-project-created{margin-top:12px;padding:12px;border:1px solid #E0E7EF;border-radius:11px;background:#F6F9FC}.wct-meeting-project-created{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.wct-meeting-project-created>div{display:grid;gap:4px;flex:1;min-width:180px}.wct-meeting-project-created strong{font-size:12px;color:var(--ink)}.wct-meeting-project-created small,.wct-meeting-project-created p{margin:0;color:var(--muted);font-size:10px}.wct-meeting-subhead{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-bottom:10px}.wct-meeting-subhead strong{font-size:12px;color:var(--ink)}.wct-meeting-subhead span{font-size:10px;color:var(--muted)}.wct-meeting-project-action-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:12px}.wct-meeting-project-action{padding:10px;border:1px solid #E1E8F0;border-radius:10px;background:#FFF}.wct-meeting-project-action>strong{display:block;margin-bottom:8px;font-size:10px;color:#53677F}.wct-meeting-project-action>.form-grid{margin-top:8px}
.wct-meeting-add-point{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;margin-top:11px;padding:12px;border:1px dashed #98B2D0;border-radius:11px;background:#F7FAFE;color:#285C9F;font-size:11px;font-weight:850;cursor:pointer}.wct-meeting-form-footnote{margin-top:12px;padding:10px 12px;border-radius:9px;background:#FFF8EA;color:#856022;font-size:10px;line-height:1.5}.wct-meeting-detail-meta{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:14px}.wct-meeting-detail-points{display:grid;gap:12px}.wct-meeting-detail-point{padding:14px;border:1px solid #E0E7EF;border-radius:13px;background:#F9FBFD}.wct-meeting-detail-point-head{display:flex;align-items:center;gap:7px;flex-wrap:wrap}.wct-meeting-detail-point h3{margin:10px 0 12px;font-size:14px;color:var(--ink)}.wct-meeting-detail-field{display:grid;grid-template-columns:145px minmax(0,1fr);gap:10px;padding:8px 0;border-top:1px solid #E6ECF2}.wct-meeting-detail-field strong{font-size:10px;color:#5D7289}.wct-meeting-detail-field p{margin:0;font-size:11px;white-space:pre-wrap;overflow-wrap:anywhere;color:#2D3F55;line-height:1.6}.wct-meeting-linked-case{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin:-4px 0 10px;padding:8px 10px;border-radius:9px;background:#EDF4FF}.wct-meeting-linked-case .btn{margin-left:auto}
:root[data-wct-appearance="dark"] .wct-meeting-point,:root[data-wct-appearance="dark"] .wct-meeting-detail-point{background:#1B2937!important;border-color:#405264!important}:root[data-wct-appearance="dark"] .wct-meeting-point-number{background:#2A4057!important;color:#C8DDF7!important}:root[data-wct-appearance="dark"] .wct-meeting-type-tag{background:#303D4A!important;color:#D4DFE9!important}:root[data-wct-appearance="dark"] .wct-meeting-project-fields,:root[data-wct-appearance="dark"] .wct-meeting-project-created,:root[data-wct-appearance="dark"] .wct-meeting-existing-case{background:#202F3E!important;border-color:#405264!important}:root[data-wct-appearance="dark"] .wct-meeting-project-action{background:#1B2937!important;border-color:#405264!important}:root[data-wct-appearance="dark"] .wct-meeting-form-footnote{background:#3B3426!important;color:#F5D69D!important}:root[data-wct-appearance="dark"] .wct-meeting-detail-field{border-color:#3A4A5A!important}:root[data-wct-appearance="dark"] .wct-meeting-detail-field strong{color:#C0CEDB!important}:root[data-wct-appearance="dark"] .wct-meeting-detail-field p{color:#E1E8EF!important}:root[data-wct-appearance="dark"] .wct-meeting-linked-case{background:#2A3E53!important}
@media(max-width:760px){.wct-meeting-point-notes{grid-template-columns:minmax(0,1fr)!important}.wct-meeting-project-action-grid{grid-template-columns:minmax(0,1fr)!important}.wct-meeting-detail-field{grid-template-columns:minmax(0,1fr)!important;gap:4px!important}.wct-meeting-point{padding:11px!important}.wct-meeting-subhead{align-items:flex-start;flex-direction:column;gap:4px}}
`;
  return html.replace('</body>', '<style id="wct-weekly-meeting-items-style">' + style + '</style><script id="wct-weekly-meeting-items-runtime">' + runtime + '</script></body>');
};
