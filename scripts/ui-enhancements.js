module.exports = function applyUiEnhancements(html) {
  const js = `
const WCT_DEFAULT_CATEGORIES = ['Inbound','Outbound','Sorting','Productivity','Service Level','Facility & Safety','People / Manpower','Transportation','Reporting','Other'];
const WCT_DEFAULT_DIVISIONS = ['Hub Operations','Gateway','Last Mile','Facility & Safety','People & Manpower','Transportation','Other'];
const WCT_ORIGINAL_REFRESH_DATA = refreshData;
refreshData = async function() {
  await WCT_ORIGINAL_REFRESH_DATA();
  try {
    const snap = await fireDb.collection('app_settings').doc('case_options').get();
    const saved = snap.exists ? snap.data() : {};
    state.caseOptions = {
      categories: Array.isArray(saved.categories) && saved.categories.length ? saved.categories : WCT_DEFAULT_CATEGORIES.slice(),
      divisions: Array.isArray(saved.divisions) && saved.divisions.length ? saved.divisions : WCT_DEFAULT_DIVISIONS.slice()
    };
  } catch (err) {
    console.warn('Case options unavailable; using defaults:', err);
    state.caseOptions = {categories:WCT_DEFAULT_CATEGORIES.slice(),divisions:WCT_DEFAULT_DIVISIONS.slice()};
  }
};
function wctOptions(){return state.caseOptions||{categories:WCT_DEFAULT_CATEGORIES.slice(),divisions:WCT_DEFAULT_DIVISIONS.slice()};}
function profileSelect(name){
  const people=state.profiles.filter(p=>p.role!=='viewer'&&p.active!==false&&p.deleted!==true);
  return '<select name="'+name+'"><option value="">Pilih PIC</option>'+people.map(p=>'<option value="'+p.id+'">'+esc(p.full_name)+' · '+(roleLabel[p.role]||p.role)+'</option>').join('')+'</select>';
}
function renderCases(){
  const activeId=document.activeElement&&document.activeElement.id||'';
  const cursor=activeId==='caseSearch'&&document.activeElement.selectionStart!=null?document.activeElement.selectionStart:null;
  const q=(($('caseSearch')&&$('caseSearch').value)||'').toLowerCase(),hub=($('hubFilter')&&$('hubFilter').value)||'',st=($('statusFilter')&&$('statusFilter').value)||'',cat=($('categoryFilter')&&$('categoryFilter').value)||'',division=($('divisionFilter')&&$('divisionFilter').value)||'';
  const opt=wctOptions(),cats=[...new Set(opt.categories.concat(state.cases.map(c=>c.category).filter(Boolean)))].sort(),divisions=[...new Set(opt.divisions.concat(state.cases.map(c=>c.division).filter(Boolean)))].sort(),hubs=[...new Set(state.cases.map(c=>c.hub_code).filter(Boolean))].sort();
  const arr=state.cases.filter(c=>(!q||[c.case_code,c.title,c.hub_code,c.division,c.category,c.reporter,c.problem_identification].join(' ').toLowerCase().includes(q))&&(!hub||c.hub_code===hub)&&(!st||caseStatus(c)===st)&&(!cat||c.category===cat)&&(!division||c.division===division));
  let out=pageHead('CASE REGISTER','Case Monitoring','Daftar case lintas HUB. Buka detail untuk melihat PICAPA dan seluruh riwayat progres.',isCoordinator()?'<button class="btn btn-primary" onclick="openCaseForm()">＋ Create New Case</button>':'');
  out+='<div class="toolbar wct-case-toolbar"><input class="search" id="caseSearch" placeholder="Cari ID, judul, HUB, divisi, atau masalah..." value="'+esc(q)+'" oninput="renderCases()">';
  out+='<select class="filter" id="hubFilter" onchange="renderCases()"><option value="">Semua HUB</option>'+hubs.map(x=>'<option value="'+esc(x)+'" '+(x===hub?'selected':'')+'>'+esc(x)+'</option>').join('')+'</select>';
  out+='<select class="filter" id="statusFilter" onchange="renderCases()"><option value="">Semua Status</option>'+[['open','Open'],['in_progress','On Progress'],['review','Need Review'],['overdue','Overdue'],['closed','Closed']].map(x=>'<option value="'+x[0]+'" '+(st===x[0]?'selected':'')+'>'+x[1]+'</option>').join('')+'</select>';
  out+='<select class="filter" id="categoryFilter" onchange="renderCases()"><option value="">Semua Kategori</option>'+cats.map(x=>'<option value="'+esc(x)+'" '+(x===cat?'selected':'')+'>'+esc(x)+'</option>').join('')+'</select>';
  out+='<select class="filter" id="divisionFilter" onchange="renderCases()"><option value="">Semua Divisi</option>'+divisions.map(x=>'<option value="'+esc(x)+'" '+(x===division?'selected':'')+'>'+esc(x)+'</option>').join('')+'</select><button class="btn btn-sm filter-reset" type="button" onclick="resetCaseFilters()">Reset filter</button></div>';
  out+='<section class="card"><div class="card-head"><div><h3>Daftar Permasalahan</h3><p>'+arr.length+' case ditampilkan</p></div><span class="pill">Lintas HUB</span></div><div class="table-wrap"><table class="table"><thead><tr><th>Case / Problem</th><th>HUB</th><th>Divisi</th><th>Kategori</th><th>Prioritas</th><th>Progress</th><th>Target</th><th>Status</th><th></th></tr></thead><tbody>';
  out+=arr.map(c=>'<tr><td><div class="case-title">'+esc(c.case_code)+' · '+esc(c.title)+'</div><div class="sub">Pelapor: '+esc(c.reporter||ownerName(c.created_by)||'—')+' · '+fmtDate((c.created_at||'').slice(0,10))+'</div></td><td><b>'+esc(c.hub_code||'—')+'</b></td><td>'+esc(c.division||'—')+'</td><td>'+esc(c.category||'—')+'</td><td><span class="priority '+String(c.priority||'').toLowerCase()+'">'+esc(c.priority||'—')+'</span></td><td><div class="progress-wrap"><div class="progress-track"><span style="width:'+caseProgress(c.id)+'%"></span></div><b>'+caseProgress(c.id)+'%</b></div></td><td>'+fmtDate(c.target_date)+'</td><td>'+statusBadge(caseStatus(c))+'</td><td><div class="wct-row-actions"><button class="btn btn-sm" onclick="openCaseDetail(\''+c.id+'\')">Detail</button>'+(isCoordinator()?'<button class="btn btn-sm btn-primary" data-case-id="'+esc(c.id)+'" onclick="editCaseFormFromButton(this)">Edit</button>':'')+'</div></td></tr>').join('')||'<tr><td colspan="9"><div class="empty"><b>Belum ada case yang cocok.</b>Ubah filter atau buat case baru.</div></td></tr>';
  out+='</tbody></table></div></section>';
  $('pageContent').innerHTML=out;
  if(['caseSearch','hubFilter','statusFilter','categoryFilter','divisionFilter'].includes(activeId)){const el=$(activeId);if(el){el.focus();if(activeId==='caseSearch'&&cursor!==null)el.setSelectionRange(cursor,cursor);}}
}
function selectCasePriority(value){
 const options=['High','Medium','Low'];if(!options.includes(value))return;
 const field=$('selectedCasePriority');if(field)field.value=value;
 document.querySelectorAll('.wct-priority-choice').forEach(btn=>{
  const active=btn.textContent.trim()===value;
  btn.classList.toggle('is-selected',active);
  btn.setAttribute('aria-pressed',active?'true':'false');
 });
}
function wctHandlePriorityClick(event){
 const button=event.target&&event.target.closest?event.target.closest('.wct-priority-choice'):null;
 if(!button)return;
 event.preventDefault();
 const value=(button.dataset.value||button.textContent||'').trim();
 if(!['High','Medium','Low'].includes(value))return;
 const field=document.getElementById('selectedCasePriority');
 if(field)field.value=value;
 document.querySelectorAll('.wct-priority-choice').forEach(item=>{
  const selected=(item.dataset.value||item.textContent||'').trim()===value;
  item.classList.toggle('is-selected',selected);
  item.setAttribute('aria-pressed',selected?'true':'false');
 });
}
document.addEventListener('click',wctHandlePriorityClick,true);
function resetCaseFilters(){['caseSearch','hubFilter','statusFilter','categoryFilter','divisionFilter'].forEach(id=>{const el=$(id);if(el)el.value='';});renderCases();}
function openCaseForm(){
  if(!isCoordinator()){toast('Hanya koordinator atau admin yang dapat membuat case.');return;}
  const opt=wctOptions(),cats=opt.categories,divisions=opt.divisions;
  let out='<div class="modal-head"><div><div class="eyebrow">NEW CASE / PICAPA</div><h2>Catat Permasalahan Baru</h2></div><button class="close" onclick="closeModal()">×</button></div><form id="caseForm" onsubmit="submitCase(event)"><div class="modal-body"><div class="form-grid">';
  out+='<div class="field"><label>HUB *</label><input name="hub_code" required placeholder="Contoh: MKS / BPP / MND" autocapitalize="characters"></div>';
  out+='<div class="field"><label>Kategori *</label><select name="category" required><option value="">Pilih kategori</option>'+cats.map(x=>'<option value="'+esc(x)+'">'+esc(x)+'</option>').join('')+'</select></div>';
  out+='<div class="field"><label>Divisi *</label><select name="division" required><option value="">Pilih divisi</option>'+divisions.map(x=>'<option value="'+esc(x)+'">'+esc(x)+'</option>').join('')+'</select></div>';
  out+='<div class="field"><label>Judul Case *</label><input name="title" required placeholder="Ringkas dan jelas"></div>';
  out+='<div class="field span-2"><label>Prioritas *</label><input type="hidden" name="priority" id="selectedCasePriority" value="Medium"><div class="wct-priority-buttons"><button type="button" data-value="High" class="wct-priority-choice high" aria-pressed="false" onclick="window.wctSelectPriority(this);return false;">High</button><button type="button" data-value="Medium" class="wct-priority-choice medium is-selected" aria-pressed="true" onclick="window.wctSelectPriority(this);return false;">Medium</button><button type="button" data-value="Low" class="wct-priority-choice low" aria-pressed="false" onclick="window.wctSelectPriority(this);return false;">Low</button></div></div>';
  out+='<div class="field span-2"><label>Problem Identification *</label><textarea name="problem_identification" required placeholder="Jelaskan apa yang terjadi, kapan, dampak, dan bukti awal."></textarea></div>';
  out+='<div class="field"><label>Target penyelesaian awal</label><input type="date" name="target_date"></div><div class="field"><label>Pelapor</label><input name="reporter" value="'+esc(currentUser.full_name||currentUser.login_id||'')+'" placeholder="Nama pelapor"></div>';
  out+='</div><div class="section-title">Corrective Action (opsional)</div><div class="form-grid"><div class="field span-2"><label>Tindakan perbaikan langsung</label><input name="ca_title" placeholder="Apa yang dilakukan untuk menyelesaikan masalah saat ini?"></div><div class="field"><label>PIC Corrective Action</label>'+profileSelect('ca_assigned')+'</div><div class="field"><label>Target Corrective Action</label><input type="date" name="ca_due"></div></div>';
  out+='<div class="section-title">Preventive Action (opsional)</div><div class="form-grid"><div class="field span-2"><label>Tindakan pencegahan</label><input name="pa_title" placeholder="Apa yang dilakukan agar masalah tidak terulang?"></div><div class="field"><label>PIC Preventive Action</label>'+profileSelect('pa_assigned')+'</div><div class="field"><label>Target Preventive Action</label><input type="date" name="pa_due"></div></div></div><div class="modal-foot"><button type="button" class="btn" onclick="closeModal()">Batal</button><button class="btn btn-primary" type="submit">Simpan Case</button></div></form>';
  openModal(out,true);
}
function editCaseFormFromButton(button){
 const id=button&&button.dataset?button.dataset.caseId:'';
 if(id)editCaseForm(id);
}
function editCaseForm(id){
 if(!isCoordinator()){toast('Hanya Admin atau Koordinator yang dapat mengubah case.');return;}
 const c=state.cases.find(x=>x.id===id);if(!c){toast('Case tidak ditemukan.');return;}
 const opts=wctOptions();
 const cats=[...new Set([...(opts.categories||[]),c.category].filter(Boolean))];
 const divisions=[...new Set([...(opts.divisions||[]),c.division].filter(Boolean))];
 const actions=state.actions.filter(a=>a.case_id===id);
 const ca=actions.find(a=>a.action_type==='corrective')||null;
 const pa=actions.find(a=>a.action_type==='preventive')||null;
 const people=(state.profiles||[]).filter(p=>p.active!==false&&p.deleted!==true&&p.role!=='viewer');
 const selectPic=function(name,selected){
  return '<select name="'+name+'"><option value="">Belum ditentukan</option>'+people.map(p=>'<option value="'+esc(p.id)+'" '+(selected===p.id?'selected':'')+'>'+esc(p.full_name||p.login_id)+'</option>').join('')+'</select>';
 };
 let out='<div class="modal-head"><div><div class="eyebrow">CASE EDITOR · '+esc(c.case_code||'')+'</div><h2>Edit Case</h2><p class="sub">Perubahan akan disimpan ke database.</p></div><button class="close" type="button" onclick="closeModal()">×</button></div>';
 out+='<form id="editCaseForm" onsubmit="saveEditedCase(event)"><input type="hidden" name="case_id" value="'+esc(id)+'"><div class="modal-body"><div class="form-grid">';
 out+='<div class="field"><label>HUB *</label><input name="hub_code" required value="'+esc(c.hub_code||'')+'" placeholder="MKS / BPP / MND"></div>';
 out+='<div class="field"><label>Kategori *</label><select name="category" required>'+cats.map(x=>'<option value="'+esc(x)+'" '+(x===c.category?'selected':'')+'>'+esc(x)+'</option>').join('')+'</select></div>';
 out+='<div class="field"><label>Divisi *</label><select name="division" required>'+divisions.map(x=>'<option value="'+esc(x)+'" '+(x===c.division?'selected':'')+'>'+esc(x)+'</option>').join('')+'</select></div>';
 out+='<div class="field"><label>Judul Case *</label><input name="title" required value="'+esc(c.title||'')+'"></div>';
 const currentStatus=['open','in_progress','review','closed'].includes(c.status)?c.status:'open';
 out+='<div class="field"><label>Status *</label><select name="status"><option value="open" '+(currentStatus==='open'?'selected':'')+'>Open</option><option value="in_progress" '+(currentStatus==='in_progress'?'selected':'')+'>On Progress</option><option value="review" '+(currentStatus==='review'?'selected':'')+'>Need Review</option><option value="closed" '+(currentStatus==='closed'?'selected':'')+'>Closed</option></select></div>';
 const priority=['High','Medium','Low'].includes(c.priority)?c.priority:'Medium';
 out+='<div class="field"><label>Prioritas *</label><input type="hidden" name="priority" value="'+priority+'"><div class="wct-priority-buttons">'+['High','Medium','Low'].map(v=>'<button type="button" data-value="'+v+'" class="wct-priority-choice '+v.toLowerCase()+(priority===v?' is-selected':'')+'" aria-pressed="'+(priority===v?'true':'false')+'" onclick="window.wctSelectPriority(this);return false;">'+v+'</button>').join('')+'</div></div>';
 out+='<div class="field span-2"><label>Problem Identification *</label><textarea name="problem_identification" required>'+esc(c.problem_identification||'')+'</textarea></div>';
 out+='<div class="field"><label>Target penyelesaian awal</label><input type="date" name="target_date" value="'+esc(c.target_date||'')+'"></div>';
 out+='<div class="field"><label>Pelapor</label><input name="reporter" value="'+esc(c.reporter||'')+'"></div>';
 out+='</div><div class="section-title">Corrective Action</div><div class="form-grid">';
 out+='<div class="field span-2"><label>Tindakan perbaikan langsung</label><input name="ca_title" value="'+esc(ca&&ca.title||'')+'" placeholder="Tindakan perbaikan"></div><div class="field"><label>PIC Corrective Action</label>'+selectPic('ca_assigned',ca&&ca.assigned_to)+'</div><div class="field"><label>Target Corrective Action</label><input type="date" name="ca_due" value="'+esc(ca&&ca.due_date||'')+'"></div>';
 out+='</div><div class="section-title">Preventive Action</div><div class="form-grid">';
 out+='<div class="field span-2"><label>Tindakan pencegahan</label><input name="pa_title" value="'+esc(pa&&pa.title||'')+'" placeholder="Tindakan pencegahan"></div><div class="field"><label>PIC Preventive Action</label>'+selectPic('pa_assigned',pa&&pa.assigned_to)+'</div><div class="field"><label>Target Preventive Action</label><input type="date" name="pa_due" value="'+esc(pa&&pa.due_date||'')+'"></div>';
 out+='</div></div><div class="modal-foot"><button type="button" class="btn" onclick="closeModal()">Batal</button><button class="btn btn-primary" type="submit">Simpan Perubahan</button></div></form>';
 openModal(out);
}
async function saveEditedCase(event){
 event.preventDefault();if(!isCoordinator())return;
 const form=event.target,values=new FormData(form),id=String(values.get('case_id')||'');
 const c=state.cases.find(x=>x.id===id);if(!c){toast('Case tidak ditemukan.');return;}
 const changes={
  hub_code:String(values.get('hub_code')||'').trim().toUpperCase(),
  category:String(values.get('category')||'').trim(),
  division:String(values.get('division')||'').trim(),
  title:String(values.get('title')||'').trim(),
  status:String(values.get('status')||'open'),
  priority:String(values.get('priority')||'Medium'),
  problem_identification:String(values.get('problem_identification')||'').trim(),
  target_date:String(values.get('target_date')||'')||null,
  reporter:String(values.get('reporter')||'').trim(),
  updated_at:new Date().toISOString(),
  updated_by:currentUser.id
 };
 if(!changes.hub_code||!changes.category||!changes.division||!changes.title||!changes.problem_identification){toast('Lengkapi HUB, kategori, divisi, judul, dan uraian masalah.');return;}
 if(!['High','Medium','Low'].includes(changes.priority)){toast('Pilih prioritas case.');return;}
 const button=event.submitter||form.querySelector('button[type="submit"]');if(button&&button.disabled)return;
 if(button){button.disabled=true;button.dataset.originalLabel=button.textContent;button.textContent='Menyimpan perubahan...';}
 try{
  const batch=fireDb.batch(),caseRef=fireDb.collection('cases').doc(id);
  batch.update(caseRef,changes);
  const existing=state.actions.filter(a=>a.case_id===id);
  const specs=[
   {type:'corrective',title:String(values.get('ca_title')||'').trim(),assigned:String(values.get('ca_assigned')||'')||null,due:String(values.get('ca_due')||'')||null,old:existing.find(a=>a.action_type==='corrective')},
   {type:'preventive',title:String(values.get('pa_title')||'').trim(),assigned:String(values.get('pa_assigned')||'')||null,due:String(values.get('pa_due')||'')||null,old:existing.find(a=>a.action_type==='preventive')}
  ];
  specs.forEach(spec=>{
   if(spec.old){
    batch.update(fireDb.collection('actions').doc(spec.old.id),{title:spec.title,assigned_to:spec.assigned,due_date:spec.due,updated_at:new Date().toISOString()});
   }else if(spec.title){
    const ref=fireDb.collection('actions').doc();
    batch.set(ref,{case_id:id,action_type:spec.type,title:spec.title,description:'',assigned_to:spec.assigned,due_date:spec.due,status:'open',progress:0,created_by:currentUser.id,created_at:new Date().toISOString()});
   }
  });
  await batch.commit();
  await refreshData();closeModal();toast('Case berhasil diperbarui.');renderCases();
 }catch(err){
  if(button){button.disabled=false;button.textContent=button.dataset.originalLabel||'Simpan Perubahan';}
  console.error('Edit case failed:',err);toast('Gagal memperbarui case: '+(err.message||err));
 }
}

async function submitCase(e){
  e.preventDefault();const f=new FormData(e.target);
  const row={hub_code:String(f.get('hub_code')||'').trim().toUpperCase(),category:String(f.get('category')||'').trim(),division:String(f.get('division')||'').trim(),title:String(f.get('title')||'').trim(),priority:String(f.get('priority')||'Medium'),problem_identification:String(f.get('problem_identification')||'').trim(),reporter:String(f.get('reporter')||currentUser.full_name||currentUser.login_id||'').trim(),status:'open',target_date:f.get('target_date')||null,created_by:currentUser.id,created_at:new Date().toISOString()};
  if(!row.hub_code||!row.category||!row.division||!row.title||!row.problem_identification){toast('Lengkapi HUB, kategori, divisi, judul, dan problem identification.');return;}
  const submitButton=e.submitter||e.target.querySelector('button[type="submit"]');
  if(submitButton&&submitButton.disabled)return;
  if(submitButton){submitButton.disabled=true;submitButton.dataset.originalLabel=submitButton.textContent;submitButton.textContent='Menyimpan...';}
  try{
    const caseRef=fireDb.collection('cases').doc(),counterRef=fireDb.collection('counters').doc('case_sequence');
    const actions=[],ca=String(f.get('ca_title')||'').trim(),pa=String(f.get('pa_title')||'').trim();
    if(ca)actions.push({action_type:'corrective',title:ca,description:'',assigned_to:f.get('ca_assigned')||null,due_date:f.get('ca_due')||null,status:'open',progress:0,created_by:currentUser.id});
    if(pa)actions.push({action_type:'preventive',title:pa,description:'',assigned_to:f.get('pa_assigned')||null,due_date:f.get('pa_due')||null,status:'open',progress:0,created_by:currentUser.id});
    const refs=actions.map(()=>fireDb.collection('actions').doc());let saved;
    await fireDb.runTransaction(async tx=>{const snap=await tx.get(counterRef),next=(snap.exists?Number(snap.data().value||0):0)+1;saved={...row,id:caseRef.id,case_code:'CASE-'+String(next).padStart(3,'0')};tx.set(counterRef,{value:next,updated_at:new Date().toISOString()});tx.set(caseRef,saved);actions.forEach((a,i)=>tx.set(refs[i],{...a,case_id:caseRef.id}));});
    state.cases.unshift(saved);actions.forEach((a,i)=>state.actions.push({...a,id:refs[i].id,case_id:caseRef.id}));closeModal();toast('Case berhasil dibuat.');renderPage();
  }catch(err){if(submitButton){submitButton.disabled=false;submitButton.textContent=submitButton.dataset.originalLabel||'Simpan Case';}toast('Gagal menyimpan case: '+(err.message||err));}
}
async function saveCaseOptions(next){
  if(!isAdmin()){toast('Hanya Admin yang dapat mengubah kategori dan divisi.');return;}
  const clean={categories:[...new Set((next.categories||[]).map(x=>String(x).trim()).filter(Boolean))],divisions:[...new Set((next.divisions||[]).map(x=>String(x).trim()).filter(Boolean))]};
  try{await fireDb.collection('app_settings').doc('case_options').set({...clean,updated_at:new Date().toISOString(),updated_by:currentUser.id},{merge:true});state.caseOptions=clean;toast('Pengaturan kategori dan divisi disimpan.');renderSettings();}
  catch(err){toast('Gagal menyimpan pengaturan: '+err.message);}
}
function addCaseOption(event,kind){event.preventDefault();const input=$('new-'+kind),value=String(input&&input.value||'').trim();if(!value){toast('Masukkan nama terlebih dahulu.');return;}const next={categories:wctOptions().categories.slice(),divisions:wctOptions().divisions.slice()};if(!next[kind]){toast('Jenis pengaturan tidak dikenali.');return;}if(next[kind].some(item=>item.toLowerCase()===value.toLowerCase())){toast('Nama tersebut sudah ada.');if(input){input.select();}return;}next[kind].push(value);saveCaseOptions(next);}
function editCaseOption(kind,index){
 if(!isAdmin())return;
 const next={categories:wctOptions().categories.slice(),divisions:wctOptions().divisions.slice()};
 if(!next[kind]||typeof next[kind][index]!=='string')return;
 const current=next[kind][index],title=kind==='categories'?'Kategori':'Divisi';
 const html='<div class="modal-head"><div><div class="eyebrow">PENGATURAN CASE</div><h2>Edit '+title+'</h2></div><button class="close" type="button" onclick="closeModal()">×</button></div>'+
 '<form onsubmit="saveEditedCaseOption(event,\''+kind+'\','+index+')"><div class="modal-body"><div class="field"><label>Nama '+title+' *</label><input name="option_name" required maxlength="60" value="'+esc(current)+'" autofocus></div></div><div class="modal-foot"><button type="button" class="btn" onclick="closeModal()">Batal</button><button class="btn btn-primary" type="submit">Simpan Perubahan</button></div></form>';
 openModal(html);
}
async function saveEditedCaseOption(event,kind,index){
 event.preventDefault();if(!isAdmin())return;
 const value=String(new FormData(event.target).get('option_name')||'').trim();
 if(!value){toast('Nama tidak boleh kosong.');return;}
 const next={categories:wctOptions().categories.slice(),divisions:wctOptions().divisions.slice()};
 if(!next[kind]||typeof next[kind][index]!=='string')return;
 if(next[kind].some((item,i)=>i!==index&&item.toLowerCase()===value.toLowerCase())){toast('Nama tersebut sudah digunakan.');return;}
 next[kind][index]=value;closeModal();await saveCaseOptions(next);
}
function deleteCaseOption(kind,index){if(!isAdmin())return;const next={categories:wctOptions().categories.slice(),divisions:wctOptions().divisions.slice()},value=next[kind][index];if(!confirm('Hapus '+(kind==='categories'?'kategori ':'divisi ')+value+' dari pilihan baru? Case lama tetap menyimpan nilai sebelumnya.'))return;next[kind].splice(index,1);saveCaseOptions(next);}
function renderUsers(){
 if(!isAdmin()){$('pageContent').innerHTML=pageHead('ACCESS CONTROL','Manajemen Pengguna','Menu ini khusus Admin.');return;}
 const rows=state.profiles.slice().sort((a,b)=>(a.full_name||'').localeCompare(b.full_name||''));
 const activeCount=rows.filter(u=>u.deleted!==true&&u.active!==false).length;
 $('pageContent').innerHTML=pageHead('ACCESS CONTROL','Manajemen Pengguna','Kelola profil, role, HUB, dan status akses pengguna.','<button class="btn btn-primary" onclick="openUserForm()">＋ Buat Pengguna</button>')+
 '<section class="card"><div class="card-head"><div><h3>Daftar Akun</h3><p>'+activeCount+' akun aktif · '+rows.length+' total akun</p></div><span class="pill">Firebase Authentication</span></div><div class="table-wrap"><table class="table"><thead><tr><th>Nama</th><th>ID Login</th><th>HUB</th><th>Role</th><th>Status</th><th>Aksi</th></tr></thead><tbody>'+
 (rows.map(u=>'<tr class="'+(u.deleted===true?'wct-user-deleted':'')+'"><td><b>'+esc(u.full_name)+'</b></td><td>'+esc(u.login_id||u.employee_id||'—')+'</td><td>'+esc(u.hub_code||'—')+'</td><td>'+esc(roleLabel[u.role]||u.role)+'</td><td>'+(u.deleted===true?'<span class="status s-overdue">Dihapus</span>':u.active===false?'<span class="status s-overdue">Nonaktif</span>':'<span class="status s-closed">Aktif</span>')+'</td><td><div style="display:flex;gap:5px;flex-wrap:wrap">'+
 (u.id===currentUser.id?'<span class="sub">Akun Anda</span>':u.deleted===true?'<button class="btn btn-sm" onclick="restoreUser(\''+u.id+'\')">Pulihkan</button>':'<button class="btn btn-sm" onclick="editUserProfile(\''+u.id+'\')">Edit</button><button class="btn btn-sm" onclick="toggleUserActive(\''+u.id+'\','+(u.active===false?'true':'false')+')">'+(u.active===false?'Aktifkan':'Nonaktifkan')+'</button><button class="btn btn-sm" onclick="softDeleteUser(\''+u.id+'\')">Hapus akses</button>')+
 '</div></td></tr>').join('')||'<tr><td colspan="6"><div class="empty">Belum ada akun tim.</div></td></tr>')+'</tbody></table></div><div class="card-body"><p class="sub">Hapus akses menonaktifkan profil login. Akun Firebase Authentication tidak dihapus oleh browser; akun yang dihapus dapat dipulihkan dari sini.</p></div></section>';
}
async function restoreUser(uid){
 if(!isAdmin())return;const u=state.profiles.find(x=>x.id===uid&&x.deleted===true);if(!u)return;
 if(!confirm('Pulihkan akses '+u.full_name+'? Pengguna dapat login kembali.'))return;
 try{await fireDb.collection('users').doc(uid).update({active:true,deleted:false,restored_at:new Date().toISOString(),updated_at:new Date().toISOString()});await refreshData();renderUsers();toast('Akses pengguna berhasil dipulihkan.');}
 catch(err){toast('Gagal memulihkan pengguna: '+err.message);}
}
function editUserProfile(uid){
  if(!isAdmin())return;const u=state.profiles.find(x=>x.id===uid&&x.deleted!==true);if(!u)return;
  let out='<div class="modal-head"><div><div class="eyebrow">EDIT USER</div><h2>Edit Profil Pengguna</h2></div><button class="close" onclick="closeModal()">×</button></div>';
  out+='<form onsubmit="saveUserProfile(event,\''+uid+'\')"><div class="modal-body"><div class="form-grid"><div class="field span-2"><label>Nama lengkap *</label><input name="full_name" required minlength="2" value="'+esc(u.full_name||'')+'"></div><div class="field"><label>ID Login (tidak dapat diubah)</label><input value="'+esc(u.login_id||u.employee_id||'')+'" disabled></div><div class="field"><label>HUB</label><input name="hub_code" value="'+esc(u.hub_code||'')+'"></div><div class="field span-2"><label>Role *</label><select name="role"><option value="admin" '+(u.role==='admin'?'selected':'')+'>Admin</option><option value="coordinator" '+(u.role==='coordinator'?'selected':'')+'>Koordinator</option><option value="member" '+(u.role==='member'?'selected':'')+'>Anggota / PIC</option><option value="viewer" '+(u.role==='viewer'?'selected':'')+'>Management / Viewer</option></select></div></div><p class="sub">Login ID tidak diubah karena terhubung ke Firebase Authentication.</p></div><div class="modal-foot"><button type="button" class="btn" onclick="closeModal()">Batal</button><button class="btn btn-primary">Simpan Perubahan</button></div></form>';
  openModal(out);
}
async function saveUserProfile(event,uid){
  event.preventDefault();if(!isAdmin())return;const f=new FormData(event.target);const u=state.profiles.find(x=>x.id===uid);if(!u)return;
  const changes={full_name:String(f.get('full_name')||'').trim(),hub_code:String(f.get('hub_code')||'').trim().toUpperCase(),role:String(f.get('role')||'member'),updated_at:new Date().toISOString()};
  try{await fireDb.collection('users').doc(uid).update(changes);if(currentUser.id===uid)currentUser={...currentUser,...changes};await refreshData();closeModal();renderUsers();toast('Profil pengguna berhasil diperbarui.');if(currentUser.id===uid)showApp();}
  catch(err){toast('Gagal mengubah profil: '+err.message);}
}
async function softDeleteUser(uid){
  if(!isAdmin())return;const u=state.profiles.find(x=>x.id===uid);if(!u||uid===currentUser.id)return;
  if(!confirm('Hapus akses '+u.full_name+'? Profil disembunyikan dan login diblokir. Akun Authentication tetap tercatat.'))return;
  try{await fireDb.collection('users').doc(uid).update({active:false,deleted:true,deleted_at:new Date().toISOString(),updated_at:new Date().toISOString()});await refreshData();renderUsers();toast('Akses pengguna dihapus.');}
  catch(err){toast('Gagal menghapus akses: '+err.message);}
}
async function changeOwnPassword(event){
  event.preventDefault();const f=new FormData(event.target),current=String(f.get('current_password')||''),next=String(f.get('new_password')||''),confirmNext=String(f.get('confirm_password')||'');
  if(next.length<6){toast('Password Firebase minimal 6 karakter.');return;}if(next!==confirmNext){toast('Konfirmasi password baru tidak cocok.');return;}
  try{const user=auth.currentUser;if(!user||!user.email)throw new Error('Sesi login tidak ditemukan.');const cred=firebase.auth.EmailAuthProvider.credential(user.email,current);await user.reauthenticateWithCredential(cred);await user.updatePassword(next);event.target.reset();toast('Password akun berhasil diperbarui.');}
  catch(err){toast('Gagal mengganti password: '+(err.code==='auth/requires-recent-login'?'Silakan login ulang, lalu coba lagi.':(err.message||err)));}
}
function renderSettings(){
  const opts=wctOptions();
  function optionCard(kind,title,items){
    let s='<section class="card"><div class="card-head"><div><h3>'+title+'</h3><p>Tambahkan, ubah, atau hapus pilihan untuk form case baru.</p></div></div><div class="card-body"><form class="wct-add-option" onsubmit="addCaseOption(event,\''+kind+'\')"><input id="new-'+kind+'" placeholder="Nama '+title.toLowerCase()+' baru" required><button class="btn btn-primary">＋ Tambah</button></form><div class="wct-option-list">';
    s+=(items.map((x,i)=>'<div class="wct-option-row"><span>'+esc(x)+'</span><div><button class="btn btn-sm" type="button" onclick="editCaseOption(\''+kind+'\','+i+')">Edit</button> <button class="btn btn-sm" type="button" onclick="deleteCaseOption(\''+kind+'\','+i+')">Hapus</button></div></div>').join('')||'<div class="empty">Belum ada pilihan.</div>');
    return s+'</div></div></section>';
  }
  let passwordCard='<section class="card"><div class="card-head"><div><h3>Keamanan Akun</h3><p>Ganti password akun yang sedang digunakan.</p></div></div><div class="card-body"><form class="form-grid" onsubmit="changeOwnPassword(event)"><div class="field span-2"><label>Password saat ini</label><input name="current_password" type="password" required autocomplete="current-password"></div><div class="field"><label>Password baru (minimal 6 karakter)</label><input name="new_password" type="password" required minlength="6" autocomplete="new-password"></div><div class="field"><label>Ulangi password baru</label><input name="confirm_password" type="password" required minlength="6" autocomplete="new-password"></div><div class="span-2"><button class="btn btn-primary">Simpan Password Baru</button></div></form><p class="sub">Password pengguna lain tidak dapat diubah dari browser tanpa backend tepercaya.</p></div></section>';
  let out=pageHead('SYSTEM SETTINGS','Pengaturan','Kelola pilihan case dan keamanan akun.');
  out+='<div class="grid dashboard-grid"><section class="card"><div class="card-head"><div><h3>Koneksi Database</h3><p>Status penyimpanan aplikasi</p></div><span class="pill live">FIREBASE CONNECTED</span></div><div class="card-body"><div class="meeting-row"><div><strong>Firebase Project</strong><small>weekly-case-tracker</small></div></div><div class="meeting-row"><div><strong>Database</strong><small>Cloud Firestore</small></div></div><div class="meeting-row"><div><strong>Login</strong><small>ID Pengguna + Password</small></div></div></div></section>'+passwordCard+'</div>';
  if(isAdmin())out+='<div class="grid dashboard-grid" style="margin-top:15px">'+optionCard('categories','Kategori',opts.categories)+optionCard('divisions','Divisi',opts.divisions)+'</div>';
  $('pageContent').innerHTML=out;
}
Object.assign(window,{renderCases,resetCaseFilters,openCaseForm,submitCase,editCaseForm,editCaseFormFromButton,saveEditedCase,selectCasePriority,renderSettings,renderUsers,openUserForm,editUserProfile,saveUserProfile,softDeleteUser,restoreUser,changeOwnPassword,addCaseOption,editCaseOption,saveEditedCaseOption,deleteCaseOption});
window.wctSetPriority=window.wctSetPriority;
document.addEventListener('click',function(event){
  const button=event.target&&event.target.closest?event.target.closest('[onclick*="openCaseForm"]'):null;
  if(!button)return;
  event.preventDefault();
  event.stopImmediatePropagation();
  try{
    if(typeof window.openCaseForm!=='function')throw new Error('Handler Create Case belum termuat.');
    window.openCaseForm();
  }catch(error){
    console.error('Create Case click failed:',error);
    if(typeof toast==='function')toast('Create Case gagal dibuka: '+(error.message||error));
  }
},true);

document.addEventListener('click',function(event){
 const nav=event.target&&event.target.closest?event.target.closest('button,a'):null;if(!nav)return;
 const label=(nav.innerText||nav.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
 if(label.includes('pengaturan'))setTimeout(()=>{if(window.renderSettings)window.renderSettings();},180);
 if(label.includes('manajemen pengguna'))setTimeout(()=>{if(window.renderUsers)window.renderUsers();},180);
},true);

document.documentElement.dataset.wctUiEnhancement='reviewed-mobile-modal-v3';
window.wctSetPriority=function(value,button){
 const allowed=['High','Medium','Low'];if(!allowed.includes(value))return false;
 const form=button&&button.closest?button.closest('form'):document.getElementById('caseForm');
 const field=form&&form.querySelector('input[name="priority"]');if(!field)return false;
 field.value=value;
 const buttons=form.querySelectorAll('.wct-priority-choice');
 buttons.forEach(item=>{const selected=(item.dataset.value||item.textContent||'').trim()===value;item.classList.toggle('is-selected',selected);item.setAttribute('aria-pressed',selected?'true':'false');});
 return true;
};
window.wctSelectPriority=function(button){
 if(!button)return false;
 const form=button.closest('form');if(!form)return false;
 const field=form.querySelector('input[name="priority"]');if(!field)return false;
 const value=button.dataset.value||button.textContent.trim();
 if(!['High','Medium','Low'].includes(value))return false;
 field.value=value;
 form.querySelectorAll('.wct-priority-choice').forEach(item=>{
  const active=item===button;item.classList.toggle('is-selected',active);item.setAttribute('aria-pressed',active?'true':'false');
 });
 return true;
};
window.selectCasePriority=function(value){return window.wctSetPriority(value,null);};
document.addEventListener('click',function(event){
 const button=event.target&&event.target.closest?event.target.closest('.wct-priority-choice'):null;
 if(!button)return;
 event.preventDefault();window.wctSetPriority(button.dataset.value||button.textContent.trim(),button);
},true);
function wctGetVisibleModalPanel(){
 const head=[...document.querySelectorAll('.modal-head')].find(el=>el.getClientRects().length);
 if(!head)return null;
 let node=head.parentElement;
 while(node&&node!==document.body){
  if(node.querySelector&&node.querySelector('.modal-body')&&node.querySelector('.modal-foot'))return node;
  node=node.parentElement;
 }
 return null;
}
function wctApplySingleModalScroll(){
 if(!window.matchMedia||!window.matchMedia('(max-width: 680px)').matches)return;
 const panel=wctGetVisibleModalPanel();if(!panel)return;
 const head=panel.querySelector('.modal-head');
 const body=panel.querySelector('.modal-body');
 const form=body&&body.closest('form');
 const foot=panel.querySelector('.modal-foot');
 const overlay=panel.parentElement;
 const set=(el,styles)=>{if(!el)return;Object.entries(styles).forEach(([key,value])=>el.style.setProperty(key,value,'important'));};

 // Keep title and action footer in place; only the long form body scrolls.
 set(panel,{'display':'flex','flex-direction':'column','box-sizing':'border-box','width':'calc(100vw - 16px)','max-width':'none','height':'auto','max-height':'calc(100dvh - 16px)','min-height':'0','overflow':'hidden','position':'relative','margin':'0 auto','border-radius':'16px'});
 set(head,{'flex':'0 0 auto','position':'sticky','top':'0','z-index':'6','background':'#fff'});
 set(form,{'display':'flex','flex-direction':'column','flex':'1 1 auto','height':'auto','max-height':'none','min-height':'0','overflow':'hidden'});
 set(body,{'display':'block','flex':'1 1 auto','height':'auto','max-height':'none','min-height':'0','overflow-x':'hidden','overflow-y':'auto','-webkit-overflow-scrolling':'touch','overscroll-behavior-y':'contain','touch-action':'pan-y','padding-bottom':'24px'});
 set(foot,{'flex':'0 0 auto','position':'sticky','bottom':'0','z-index':'6','background':'#fff','padding-bottom':'max(12px, env(safe-area-inset-bottom))'});
 set(overlay,{'position':'fixed','inset':'0','height':'100dvh','max-height':'100dvh','box-sizing':'border-box','display':'flex','align-items':'flex-start','justify-content':'center','overflow':'hidden','touch-action':'pan-y','padding':'max(8px, env(safe-area-inset-top)) 8px max(8px, env(safe-area-inset-bottom))'});
}
const wctOriginalOpenModalReviewed=openModal;
openModal=function(){
 const result=wctOriginalOpenModalReviewed.apply(this,arguments);
 requestAnimationFrame(wctApplySingleModalScroll);
 setTimeout(wctApplySingleModalScroll,80);
 setTimeout(wctApplySingleModalScroll,220);
 return result;
};
window.addEventListener('resize',wctApplySingleModalScroll,{passive:true});
window.addEventListener('orientationchange',()=>setTimeout(wctApplySingleModalScroll,160),{passive:true});
let wctTouchScrollBody=null,wctTouchLastY=0,wctTouchStartY=0;
document.addEventListener('touchstart',function(event){
 const target=event.target;
 if(!target||!target.closest)return;
 const body=target.closest('.modal-body');
 if(!body){wctTouchScrollBody=null;return;}
 wctApplySingleModalScroll();
 wctTouchScrollBody=body;
 if(event.touches&&event.touches[0])wctTouchLastY=wctTouchStartY=event.touches[0].clientY;
},{passive:true,capture:true});
document.addEventListener('touchmove',function(event){
 if(!wctTouchScrollBody||!event.touches||!event.touches[0])return;
 const y=event.touches[0].clientY,delta=wctTouchLastY-y;
 wctTouchLastY=y;
 if(Math.abs(y-wctTouchStartY)<4)return;
 wctTouchStartY=y;
 wctTouchScrollBody.scrollTop+=delta;
 if(event.cancelable)event.preventDefault();
},{passive:false,capture:true});
if(typeof MutationObserver!=='undefined'){
 const wctModalLayoutObserver=new MutationObserver(()=>requestAnimationFrame(wctApplySingleModalScroll));
 wctModalLayoutObserver.observe(document.body,{childList:true,subtree:true});
}
document.addEventListener('click',function(event){
 const button=event.target&&event.target.closest?event.target.closest('[onclick*="openCaseForm"]'):null;if(!button)return;
 event.preventDefault();event.stopImmediatePropagation();
 try{if(typeof window.openCaseForm!=='function')throw new Error('Fungsi form belum termuat.');window.openCaseForm();}
 catch(error){console.error('Create Case failed:',error);if(typeof toast==='function')toast('Form case gagal dibuka: '+(error.message||error));}
},true);
document.addEventListener('click',function(event){
 const nav=event.target&&event.target.closest?event.target.closest('button,a'):null;if(!nav)return;
 const label=(nav.innerText||nav.textContent||'').replace(/\\s+/g,' ').trim().toLowerCase();
 if(label.includes('pengaturan'))setTimeout(()=>{if(window.renderSettings)window.renderSettings();},180);
 if(label.includes('manajemen pengguna'))setTimeout(()=>{if(window.renderUsers)window.renderUsers();},180);
},true);
document.head.insertAdjacentHTML('beforeend','<style id="wct-case-form-users">.wct-priority-buttons{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:10px!important;width:100%!important;max-width:520px!important;margin:8px 0 12px!important}button.wct-priority-choice{appearance:none!important;-webkit-appearance:none!important;display:flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important;position:relative!important;z-index:2!important;pointer-events:auto!important;width:100%!important;min-height:48px!important;margin:0!important;padding:10px 14px!important;border:1px solid #e5dfeb!important;border-radius:12px!important;background:#fff!important;color:#5f536d!important;font:700 13px/1.2 Arial,sans-serif!important;box-shadow:0 2px 7px rgba(45,33,64,.05)!important;cursor:pointer!important;touch-action:manipulation!important}button.wct-priority-choice.high.is-selected{background:#fff0f0!important;border:2px solid #d34c58!important;color:#a92f3b!important;box-shadow:0 0 0 3px rgba(211,76,88,.10)!important}button.wct-priority-choice.medium.is-selected{background:#fff7e8!important;border:2px solid #d89b35!important;color:#885508!important;box-shadow:0 0 0 3px rgba(216,155,53,.11)!important}button.wct-priority-choice.low.is-selected{background:#eff9ee!important;border:2px solid #62a96d!important;color:#286b37!important;box-shadow:0 0 0 3px rgba(98,169,109,.11)!important}.wct-add-option{display:flex;gap:8px;margin-bottom:12px}.wct-add-option input{flex:1;min-width:0;border:1px solid #e6e1eb;border-radius:10px;padding:10px 12px}.wct-option-list{display:grid;gap:7px}.wct-option-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 12px;border:1px solid #eeeaf2;border-radius:11px;background:#fff}.wct-option-row>span{font-weight:650}.wct-case-toolbar{display:grid;grid-template-columns:minmax(220px,2fr) repeat(4,minmax(125px,1fr)) auto;gap:9px;align-items:center;padding:14px;border:1px solid #eeeaf2;border-radius:15px;background:#fff;box-shadow:0 5px 18px rgba(45,33,64,.035)}.wct-case-toolbar input,.wct-case-toolbar select{width:100%;min-width:0;height:42px;border:1px solid #e6e1eb;border-radius:10px;padding:9px 11px;background:#fff}.wct-case-toolbar .filter-reset{height:42px;white-space:nowrap}@media(max-width:1100px){.wct-case-toolbar{grid-template-columns:repeat(2,minmax(0,1fr))}.wct-case-toolbar .search{grid-column:1/-1}}@media(max-width:680px){.wct-case-toolbar{grid-template-columns:1fr;padding:11px}.wct-case-toolbar .search{grid-column:auto}.wct-case-toolbar .filter-reset{width:100%}.wct-priority-buttons{gap:8px!important}.wct-priority-buttons button.wct-priority-choice{min-height:46px!important;padding:9px 6px!important;font-size:12px!important}.wct-add-option{flex-direction:column}.wct-option-row{align-items:flex-start}.wct-option-row>div{display:flex;gap:5px}}@media(max-width:680px){.modal-backdrop{display:flex!important;align-items:flex-start!important;justify-content:center!important;overflow:hidden!important;touch-action:pan-y!important}.modal{overscroll-behavior-y:contain!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-y!important}.modal-head{position:sticky!important;top:0!important;z-index:5!important;background:#fff!important}.modal-body{overflow:visible!important;max-height:none!important;min-height:0!important}.modal-foot{position:static!important}}</style>');;
`;
  html = html.replace('name="password" type="password" required minlength="8" autocomplete="new-password"', 'name="password" type="password" required minlength="6" autocomplete="new-password"');
  const priorityAndModalCss = "<style id=\"wct-priority-and-modal-layout\">.wct-priority-buttons{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:10px!important;width:100%!important;max-width:520px!important;margin:8px 0 12px!important}.wct-priority-buttons .wct-priority-choice{appearance:none!important;-webkit-appearance:none!important;display:flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important;width:100%!important;min-height:48px!important;margin:0!important;padding:10px 14px!important;border:1px solid #e5dfeb!important;border-radius:12px!important;background:#fff!important;color:#5f536d!important;font:700 13px/1.2 Arial,sans-serif!important;box-shadow:0 2px 7px rgba(45,33,64,.05)!important;cursor:pointer!important;pointer-events:auto!important;position:relative!important;z-index:4!important;user-select:none!important;-webkit-tap-highlight-color:transparent!important;touch-action:manipulation!important}.wct-priority-buttons .wct-priority-choice.high.is-selected{background:#fff0f0!important;border:2px solid #d34c58!important;color:#a92f3b!important;box-shadow:0 0 0 3px rgba(211,76,88,.10)!important}.wct-priority-buttons .wct-priority-choice.medium.is-selected{background:#fff7e8!important;border:2px solid #d89b35!important;color:#885508!important;box-shadow:0 0 0 3px rgba(216,155,53,.11)!important}.wct-priority-buttons .wct-priority-choice.low.is-selected{background:#eff9ee!important;border:2px solid #62a96d!important;color:#286b37!important;box-shadow:0 0 0 3px rgba(98,169,109,.11)!important}.wct-priority-buttons .wct-priority-choice:focus-visible{outline:3px solid rgba(91,42,134,.22)!important;outline-offset:2px!important}@media(max-width:680px){.modal-head{position:sticky!important;top:0!important;z-index:8!important;background:#fff!important}.modal-body{height:auto!important;max-height:none!important;min-height:0!important;overflow:visible!important}.modal-foot{position:sticky!important;bottom:0!important;z-index:8!important;background:#fff!important}.wct-priority-buttons{gap:8px!important}.wct-priority-buttons .wct-priority-choice{min-height:46px!important;padding:9px 6px!important;font-size:12px!important}}</style>";
  html = html.replace('</head>', priorityAndModalCss + '\n</head>');
  return html.replace('</body>', '<script>\n' + js + '\n</script>\n</body>');
};
