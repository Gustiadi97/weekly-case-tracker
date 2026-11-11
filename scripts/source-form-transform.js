module.exports = function applySourceFormTransform(html) {
  const start = html.indexOf('function openCaseForm(){');
  const end = html.indexOf('function openCaseDetail(', start);
  if (start < 0 || end < 0) {
    throw new Error('Could not locate original case form boundaries.');
  }

  const replacement = [
    'function openCaseForm(){',
    " if(!isCoordinator()){toast('Hanya koordinator atau admin yang dapat membuat case.');return;}",
    " const opts=state.caseOptions||{categories:['Inbound','Outbound','Sorting','Productivity','Service Level','Facility & Safety','People / Manpower','Transportation','Reporting','Other'],divisions:['Hub Operations','Gateway','Last Mile','Facility & Safety','People & Manpower','Transportation','Other']};",
    " const cats=opts.categories||[],divisions=opts.divisions||[],people=(state.profiles||[]).filter(p=>p.active!==false&&p.deleted!==true&&p.role!=='viewer');",
    " let out='<div class=\"modal-head\"><div><div class=\"eyebrow\">NEW CASE / PICAPA</div><h2>Catat Permasalahan Baru</h2></div><button class=\"close\" onclick=\"closeModal()\">×</button></div>';",
    " out+='<form id=\"caseForm\" onsubmit=\"submitCase(event)\"><div class=\"modal-body\"><div class=\"form-grid\">';",
    " out+='<div class=\"field\"><label>HUB *</label><input name=\"hub_code\" required placeholder=\"Contoh: MKS / BPP / MND\" autocapitalize=\"characters\"></div>';",
    " out+='<div class=\"field\"><label>Kategori *</label><select name=\"category\" required><option value=\"\">Pilih kategori</option>'+cats.map(x=>'<option value=\"'+esc(x)+'\">'+esc(x)+'</option>').join('')+'</select></div>';",
    " out+='<div class=\"field\"><label>Divisi *</label><select name=\"division\" required><option value=\"\">Pilih divisi</option>'+divisions.map(x=>'<option value=\"'+esc(x)+'\">'+esc(x)+'</option>').join('')+'</select></div>';",
    " out+='<div class=\"field\"><label>Judul Case *</label><input name=\"title\" required placeholder=\"Ringkas dan jelas\"></div>';",
    " out+='<div class=\"field span-2\"><label>Prioritas *</label><div class=\"wct-priority-buttons\"><label class=\"wct-priority high\"><input type=\"radio\" name=\"priority\" value=\"High\"><span>High</span></label><label class=\"wct-priority medium\"><input type=\"radio\" name=\"priority\" value=\"Medium\" checked><span>Medium</span></label><label class=\"wct-priority low\"><input type=\"radio\" name=\"priority\" value=\"Low\"><span>Low</span></label></div></div>';",
    " out+='<div class=\"field span-2\"><label>Problem Identification *</label><textarea name=\"problem_identification\" required placeholder=\"Jelaskan apa yang terjadi, kapan, dampak, dan bukti awal.\"></textarea></div>';",
    " out+='<div class=\"field\"><label>Target penyelesaian awal</label><input type=\"date\" name=\"target_date\"></div>';",
    " out+='<div class=\"field\"><label>Pelapor (pilih PIC terdaftar atau ketik manual)</label><input name=\"reporter\" list=\"wctReporterList\" value=\"'+esc(currentUser.full_name||currentUser.login_id||'')+'\" placeholder=\"Pilih nama PIC atau ketik manual\"><datalist id=\"wctReporterList\">'+people.map(p=>'<option value=\"'+esc(p.full_name||p.login_id||'')+'\">').join('')+'</datalist></div>';",
    " out+='</div><div class=\"section-title\">Corrective Action (opsional)</div><div class=\"form-grid\"><div class=\"field span-2\"><label>Tindakan perbaikan langsung</label><input name=\"ca_title\" placeholder=\"Apa yang dilakukan untuk menyelesaikan masalah saat ini?\"></div><div class=\"field\"><label>PIC Corrective Action</label>'+profileSelect('ca_assigned')+'</div><div class=\"field\"><label>Target Corrective Action</label><input type=\"date\" name=\"ca_due\"></div></div>';",
    " out+='<div class=\"section-title\">Preventive Action (opsional)</div><div class=\"form-grid\"><div class=\"field span-2\"><label>Tindakan pencegahan</label><input name=\"pa_title\" placeholder=\"Apa yang dilakukan agar masalah tidak terulang?\"></div><div class=\"field\"><label>PIC Preventive Action</label>'+profileSelect('pa_assigned')+'</div><div class=\"field\"><label>Target Preventive Action</label><input type=\"date\" name=\"pa_due\"></div></div></div><div class=\"modal-foot\"><button type=\"button\" class=\"btn\" onclick=\"closeModal()\">Batal</button><button class=\"btn btn-primary\" type=\"submit\">Simpan Case</button></div></form>';",
    " openModal(out,true);",
    '}'
  ].join('\n');

  return html.slice(0, start) + replacement + '\n' + html.slice(end);
};
