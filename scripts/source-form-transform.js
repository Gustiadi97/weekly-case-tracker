module.exports = function applySourceFormTransform(html) {
  const start = html.indexOf('function openCaseForm(){');
  const end = html.indexOf('function openCaseDetail(', start);
  if (start < 0 || end < 0) throw new Error('Could not locate original case form boundaries.');

  const replacement = [
    'function wctSourceOptions(){',
    " const defaults={categories:['Inbound','Outbound','Sorting','Productivity','Service Level','Facility & Safety','People / Manpower','Transportation','Reporting','Other'],divisions:['Hub Operations','Gateway','Last Mile','Facility & Safety','People & Manpower','Transportation','Other']};",
    " return state.caseOptions||defaults;",
    '}',
    'function profileSelect(name){',
    " const people=(state.profiles||[]).filter(p=>p.role!=='viewer'&&p.active!==false&&p.deleted!==true);",
    " return '<select name=\"'+name+'\"><option value=\"\">Pilih PIC</option>'+people.map(p=>'<option value=\"'+p.id+'\">'+esc(p.full_name)+' · '+(roleLabel[p.role]||p.role)+'</option>').join('')+'</select>';",
    '}',
    'function openCaseForm(){',
    " try {",
    "  if(!isCoordinator()){toast('Hanya koordinator atau admin yang dapat membuat case.');return;}",
    "  const opts=wctSourceOptions(),cats=opts.categories||[],divisions=opts.divisions||[],people=(state.profiles||[]).filter(p=>p.active!==false&&p.deleted!==true&&p.role!=='viewer');",
    "  let out='<div class=\"modal-head\"><div><div class=\"eyebrow\">NEW CASE / PICAPA</div><h2>Catat Permasalahan Baru</h2></div><button class=\"close\" onclick=\"closeModal()\">×</button></div>';",
    "  out+='<form id=\"caseForm\" onsubmit=\"submitCase(event)\"><div class=\"modal-body\"><div class=\"form-grid\">';",
    "  out+='<div class=\"field\"><label>HUB *</label><input name=\"hub_code\" required placeholder=\"Contoh: MKS / BPP / MND\" autocapitalize=\"characters\"></div>';",
    "  out+='<div class=\"field\"><label>Kategori *</label><select name=\"category\" required><option value=\"\">Pilih kategori</option>'+cats.map(x=>'<option value=\"'+esc(x)+'\">'+esc(x)+'</option>').join('')+'</select></div>';",
    "  out+='<div class=\"field\"><label>Divisi *</label><select name=\"division\" required><option value=\"\">Pilih divisi</option>'+divisions.map(x=>'<option value=\"'+esc(x)+'\">'+esc(x)+'</option>').join('')+'</select></div>';",
    "  out+='<div class=\"field\"><label>Judul Case *</label><input name=\"title\" required placeholder=\"Ringkas dan jelas\"></div>';",
    "  out+='<div class=\"field span-2\"><label>Prioritas *</label><input type=\"hidden\" name=\"priority\" id=\"selectedCasePriority\" value=\"Medium\"><div class=\"wct-priority-buttons\"><button type=\"button\" data-value=\"High\" class=\"wct-priority-choice high\" aria-pressed=\"false\" onclick=\"window.wctSetPriority(&#39;High&#39;,this);return false;\">High</button><button type=\"button\" data-value=\"Medium\" class=\"wct-priority-choice medium is-selected\" aria-pressed=\"true\" onclick=\"window.wctSetPriority(&#39;Medium&#39;,this);return false;\">Medium</button><button type=\"button\" data-value=\"Low\" class=\"wct-priority-choice low\" aria-pressed=\"false\" onclick=\"window.wctSetPriority(&#39;Low&#39;,this);return false;\">Low</button></div></div>';",
    "  out+='<div class=\"field span-2\"><label>Problem Identification *</label><textarea name=\"problem_identification\" required placeholder=\"Jelaskan apa yang terjadi, kapan, dampak, dan bukti awal.\"></textarea></div>';",
    "  out+='<div class=\"field\"><label>Target penyelesaian awal</label><input type=\"date\" name=\"target_date\"></div>';",
    "  out+='<div class=\"field\"><label>Pelapor (pilih PIC terdaftar atau ketik manual)</label><input name=\"reporter\" list=\"wctReporterList\" value=\"'+esc(currentUser.full_name||currentUser.login_id||'')+'\" placeholder=\"Pilih PIC atau ketik manual\"><datalist id=\"wctReporterList\">'+people.map(p=>'<option value=\"'+esc(p.full_name||p.login_id||'')+'\">').join('')+'</datalist></div>';",
    "  out+='</div><div class=\"section-title\">Corrective Action (opsional)</div><div class=\"form-grid\"><div class=\"field span-2\"><label>Tindakan perbaikan langsung</label><input name=\"ca_title\" placeholder=\"Apa yang dilakukan untuk menyelesaikan masalah saat ini?\"></div><div class=\"field\"><label>PIC Corrective Action</label>'+profileSelect('ca_assigned')+'</div><div class=\"field\"><label>Target Corrective Action</label><input type=\"date\" name=\"ca_due\"></div></div>';",
    "  out+='<div class=\"section-title\">Preventive Action (opsional)</div><div class=\"form-grid\"><div class=\"field span-2\"><label>Tindakan pencegahan</label><input name=\"pa_title\" placeholder=\"Apa yang dilakukan agar masalah tidak terulang?\"></div><div class=\"field\"><label>PIC Preventive Action</label>'+profileSelect('pa_assigned')+'</div><div class=\"field\"><label>Target Preventive Action</label><input type=\"date\" name=\"pa_due\"></div></div></div><div class=\"modal-foot\"><button type=\"button\" class=\"btn\" onclick=\"closeModal()\">Batal</button><button class=\"btn btn-primary\" type=\"submit\">Simpan Case</button></div></form>';",
    "  openModal(out,true);",
    " } catch(err) { console.error('Create Case form error:',err); toast('Form case gagal dibuka: '+(err.message||err)); }",
    '}',
    'function rowWithCode(row){const copy={...row};delete copy.id;return copy;}',
    'async function submitCase(e){',
    " e.preventDefault();const f=new FormData(e.target);",
    " const row={hub_code:String(f.get('hub_code')||'').trim().toUpperCase(),category:String(f.get('category')||'').trim(),division:String(f.get('division')||'').trim(),title:String(f.get('title')||'').trim(),priority:String(f.get('priority')||'Medium'),problem_identification:String(f.get('problem_identification')||'').trim(),reporter:String(f.get('reporter')||currentUser.full_name||currentUser.login_id||'').trim(),status:'open',target_date:f.get('target_date')||null,created_by:currentUser.id,created_at:new Date().toISOString()};",
    " if(!row.hub_code||!row.category||!row.division||!row.title||!row.problem_identification){toast('Lengkapi HUB, kategori, divisi, judul, dan problem identification.');return;}",
    " try{",
    "  const caseRef=fireDb.collection('cases').doc(),counterRef=fireDb.collection('counters').doc('case_sequence');",
    "  const actions=[],ca=String(f.get('ca_title')||'').trim(),pa=String(f.get('pa_title')||'').trim();",
    "  if(ca)actions.push({action_type:'corrective',title:ca,description:'',assigned_to:f.get('ca_assigned')||null,due_date:f.get('ca_due')||null,status:'open',progress:0,created_by:currentUser.id});",
    "  if(pa)actions.push({action_type:'preventive',title:pa,description:'',assigned_to:f.get('pa_assigned')||null,due_date:f.get('pa_due')||null,status:'open',progress:0,created_by:currentUser.id});",
    "  const refs=actions.map(()=>fireDb.collection('actions').doc());let saved;",
    "  await fireDb.runTransaction(async tx=>{const snap=await tx.get(counterRef),next=(snap.exists?Number(snap.data().value||0):0)+1;saved={...row,id:caseRef.id,case_code:'CASE-'+String(next).padStart(3,'0')};tx.set(counterRef,{value:next,updated_at:new Date().toISOString()});tx.set(caseRef,rowWithCode(saved));actions.forEach((a,i)=>tx.set(refs[i],{...a,case_id:caseRef.id}));});",
    "  state.cases.unshift(saved);actions.forEach((a,i)=>state.actions.push({...a,id:refs[i].id,case_id:caseRef.id}));closeModal();toast('Case berhasil dibuat.');renderPage();",
    " }catch(err){console.error('Save case error:',err);toast('Gagal menyimpan case: '+(err.message||err));}",
    '}',
    'try{window.openCaseForm=openCaseForm;window.submitCase=submitCase;}catch(e){}'
  ].join('\n');

  html = html.replace(
    '<div class="field"><label>Area</label><input name="area_name" placeholder="Contoh: Area Sulawesi"></div>',
    '<div class="field"><label>HUB</label><input name="hub_code" placeholder="Contoh: MKS / BPP / MND" autocapitalize="characters"></div>'
  );

  return html.slice(0,start)+replacement+'\n'+html.slice(end);
};
