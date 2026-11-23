module.exports = function applyP1WorkflowRuntime(html) {
  if (!html || !html.includes('</body>')) throw new Error('Could not find document body for P1 workflow runtime.');

  const css = String.raw`
.wct-task-drag-hint{margin:-7px 0 13px;padding:9px 12px;border:1px solid #E3EAF3;border-radius:10px;background:#F8FAFD;color:#73839A;font-size:10px;line-height:1.5}
.wct-task-card.is-draggable{cursor:grab}
.wct-task-card.is-draggable:active{cursor:grabbing}
.wct-task-card:not(.is-draggable){cursor:default}
.wct-status-history-section{margin-top:14px}
.wct-p1-status-history{display:grid;gap:9px}
.wct-p1-status-history-row{display:grid;grid-template-columns:18px minmax(0,1fr) auto;gap:10px;align-items:start;padding:10px 0;border-bottom:1px solid #EEF1F5}
.wct-p1-status-history-row:last-child{border-bottom:0}
.wct-p1-status-history-mark{width:9px;height:9px;margin:4px auto 0;border-radius:50%;background:#2864C7;box-shadow:0 0 0 4px #EAF2FF}
.wct-p1-status-history-main{min-width:0}
.wct-p1-status-history-main strong{display:block;color:#243B59;font-size:11px;font-weight:850}
.wct-p1-status-history-main small{display:block;margin-top:4px;color:#74849A;font-size:10px;line-height:1.45}
.wct-p1-status-history-time{color:#78879A;font-size:9px;font-weight:750;white-space:nowrap}
.wct-p1-meeting-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}
.wct-p1-meeting-item{padding:13px 14px;border:1px solid #E5EAF1;border-radius:12px;background:#fff;margin-top:10px}
.wct-p1-meeting-item h4{margin:0 0 6px;color:#223954;font-size:12px;font-weight:850}
.wct-p1-meeting-item p{margin:5px 0;color:#586A80;font-size:11px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}
.wct-p1-meeting-item small{display:block;color:#8190A2;font-size:10px;line-height:1.5}
.wct-p1-meeting-case-list{max-height:190px;overflow:auto;padding:9px;border:1px solid #E1E7EF;border-radius:11px;background:#FBFCFE}
.wct-p1-meeting-case-option{display:flex;align-items:flex-start;gap:9px;padding:8px 7px;border-bottom:1px solid #EEF1F5;color:#405570;font-size:11px;line-height:1.45}
.wct-p1-meeting-case-option:last-child{border-bottom:0}
.wct-p1-meeting-case-option input{width:15px;height:15px;flex:0 0 15px;margin:1px 0 0;accent-color:#2864C7}
.wct-p1-meeting-empty{padding:13px;border:1px dashed #DCE4EE;border-radius:10px;background:#FAFCFF;color:#7B899A;font-size:11px;text-align:center}
@media(max-width:640px){
 .wct-p1-status-history-row{grid-template-columns:16px minmax(0,1fr)}
 .wct-p1-status-history-time{grid-column:2;white-space:normal}
}
`;

  const runtime = String.raw`
(function(){
  if(window.WCTP1WorkflowReady)return;
  window.WCTP1WorkflowReady=true;

  function escP1(value){
    return String(value==null?'':value).replace(/[&<>"']/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
  }
  function db(){return window.wctSupabase||null;}
  function isLead(){
    try{return !!currentUser&&['admin','coordinator'].indexOf(String(currentUser.role||'').toLowerCase())>=0&&currentUser.active!==false;}
    catch(ignore){return false;}
  }
  function statusText(value){
    return ({open:'To Do',in_progress:'In Progress',review:'In Review',done:'Done'})[value]||String(value||'—');
  }
  function personText(id){
    var list=(typeof state!=='undefined'&&state&&state.profiles)||[];
    var item=list.find(function(p){return String(p.id)===String(id);});
    return item?(item.full_name||item.login_id||'Pengguna'):'Pengguna';
  }
  function meetingHubs(){
    var values=[];
    var options=(typeof state!=='undefined'&&state&&state.caseOptions)||{};
    if(Array.isArray(options.hubs))values=values.concat(options.hubs);
    ((typeof state!=='undefined'&&state&&state.cases)||[]).forEach(function(c){
      var list=Array.isArray(c.hub_codes)&&c.hub_codes.length?c.hub_codes:[c.hub_code];
      list.forEach(function(v){if(v)values.push(String(v).toUpperCase());});
    });
    var profile=typeof currentUser!=='undefined'&&currentUser?currentUser:{};
    if(profile.hub_code)values.push(String(profile.hub_code).toUpperCase());
    if(profile.area_name)values.push(String(profile.area_name).toUpperCase());
    values=Array.from(new Set(values.map(function(v){return String(v||'').trim().toUpperCase();}).filter(Boolean)));
    return values.length?values:['MKS','BPP','BJM','MND','PLK'];
  }

  window.openMeetingForm=function(){
    if(!isLead()){toast('Hanya Admin atau Koordinator aktif yang dapat mencatat Weekly Meeting.');return;}
    var cases=((typeof state!=='undefined'&&state&&state.cases)||[]).filter(function(c){return c.status!=='closed';});
    var hubs=meetingHubs();
    var profile=typeof currentUser!=='undefined'&&currentUser?currentUser:{};
    var preferred=String(profile.hub_code||profile.area_name||'').toUpperCase();
    if(preferred==='MAKASSAR')preferred='MKS';
    var selectedHub=hubs.indexOf(preferred)>=0?preferred:hubs[0];
    var hubOptions=hubs.map(function(h){return '<option value="'+escP1(h)+'" '+(h===selectedHub?'selected':'')+'>'+escP1(h)+'</option>';}).join('');
    var caseOptions=cases.length?cases.map(function(c){
      var hubsForCase=Array.isArray(c.hub_codes)&&c.hub_codes.length?c.hub_codes:[c.hub_code];
      return '<label class="wct-p1-meeting-case-option"><input type="checkbox" name="case_ids" value="'+escP1(c.id)+'"><span><b>'+escP1(c.case_code||'CASE')+'</b> · '+escP1(c.title)+'<br><small>'+escP1(hubsForCase.filter(Boolean).join(', ')||'—')+' · '+escP1(c.priority||'Medium')+'</small></span></label>';
    }).join(''):'<div class="wct-p1-meeting-empty">Tidak ada Case aktif untuk ditautkan.</div>';
    var html='<div class="modal-head"><div><div class="eyebrow">MEETING MINUTES · PICAPA</div><h2>Catat Hasil Weekly Meeting</h2><p class="sub">Simpan ringkasan, keputusan, Next Step, dan Case yang dibahas sebagai poin Meeting.</p></div><button class="close" type="button" onclick="closeModal()">×</button></div>'+
      '<form id="wctP1MeetingForm" onsubmit="submitMeeting(event)"><div class="modal-body"><div class="form-grid">'+
      '<div class="field"><label>Tanggal Meeting *</label><input type="date" name="meeting_date" value="'+escP1(typeof todayISO==='function'?todayISO():'')+'" required></div>'+
      '<div class="field"><label>HUB Operasional *</label><select name="hub_code" required>'+hubOptions+'</select></div>'+
      '<div class="field span-2"><label>Judul Meeting *</label><input name="title" value="Weekly Operation Review" maxlength="180" required></div>'+
      '<div class="field span-2"><label>Ringkasan Pembahasan</label><textarea name="summary" rows="4" placeholder="Topik utama, kondisi, dan fakta yang dibahas..."></textarea></div>'+
      '<div class="field span-2"><label>Keputusan / Arahan Meeting</label><textarea name="decisions" rows="4" placeholder="Keputusan, arahan, dan kesepakatan..."></textarea></div>'+
      '<div class="field span-2"><label>Next Step / Tindak Lanjut</label><textarea name="next_steps" rows="4" placeholder="Tindakan berikutnya, hasil yang diharapkan, dan tenggat..."></textarea></div>'+
      '<div class="field span-2"><label>Case yang Dibahas</label><div class="wct-p1-meeting-case-list">'+caseOptions+'</div><small class="sub">Pilih satu atau beberapa Case. Setiap Case akan disimpan sebagai item Meeting yang terhubung.</small></div>'+
      '</div></div><div class="modal-foot"><button type="button" class="btn" onclick="closeModal()">Batal</button><button type="submit" class="btn btn-primary">Simpan Meeting</button></div></form>';
    openModal(html,true);
  };

  window.submitMeeting=async function(event){
    event.preventDefault();
    if(!isLead()){toast('Hanya Admin atau Koordinator aktif yang dapat menyimpan Weekly Meeting.');return;}
    var form=event.currentTarget&&event.currentTarget.tagName==='FORM'?event.currentTarget:event.target;
    var data=new FormData(form);
    var title=String(data.get('title')||'').trim();
    var meetingDate=String(data.get('meeting_date')||'');
    var hubCode=String(data.get('hub_code')||'').trim().toUpperCase();
    if(!title||!meetingDate||!hubCode){toast('Judul, tanggal, dan HUB Meeting wajib diisi.');return;}
    var summary=String(data.get('summary')||'').trim();
    var decisions=String(data.get('decisions')||'').trim();
    var nextSteps=String(data.get('next_steps')||'').trim();
    var selectedIds=data.getAll('case_ids').map(String);
    var currentCases=((typeof state!=='undefined'&&state&&state.cases)||[]).filter(function(c){return selectedIds.indexOf(String(c.id))>=0;});
    var items=[{
      kind:'discussion',
      title:'Ringkasan pembahasan',
      summary:summary,
      decisions:decisions,
      next_step:nextSteps
    }];
    currentCases.forEach(function(c){
      items.push({
        kind:'existing_case',
        title:String(c.case_code||'CASE')+' · '+String(c.title||''),
        summary:'Case ditautkan sebagai materi pembahasan Weekly Meeting.',
        decisions:'',
        next_step:'',
        case_id:c.id
      });
    });
    var client=db();
    if(!client){toast('Koneksi Supabase belum tersedia.');return;}
    var submit=form.querySelector('button[type="submit"]');
    if(submit&&submit.disabled)return;
    if(submit){submit.disabled=true;submit.dataset.label=submit.textContent;submit.textContent='Menyimpan...';}
    try{
      var result=await client.rpc('wct_save_meeting_with_items',{
        p_meeting_id:null,
        p_meeting:{title:title,meeting_date:meetingDate,hub_code:hubCode},
        p_items:items
      });
      if(result.error)throw result.error;
      var meetingId=result.data&&result.data.meeting&&result.data.meeting.id;
      if(typeof refreshData==='function')await refreshData();
      closeModal();
      if(typeof renderPage==='function')renderPage();
      toast('Hasil Weekly Meeting berhasil disimpan.');
      if(meetingId&&typeof window.viewMeeting==='function')await window.viewMeeting(meetingId);
    }catch(error){
      console.error('Save Weekly Meeting failed:',error);
      if(submit){submit.disabled=false;submit.textContent=submit.dataset.label||'Simpan Meeting';}
      toast('Gagal menyimpan Meeting: '+(error&&error.message||error));
    }
  };

  window.viewMeeting=async function(meetingId){
    var meetings=(typeof state!=='undefined'&&state&&state.meetings)||[];
    var meeting=meetings.find(function(m){return String(m.id)===String(meetingId);});
    if(!meeting){toast('Riwayat Meeting tidak ditemukan.');return;}
    openModal('<div class="modal-head"><div><div class="eyebrow">MEETING MINUTES</div><h2>'+escP1(meeting.title)+'</h2></div><button type="button" class="close" onclick="closeModal()">×</button></div><div class="modal-body">Memuat poin pembahasan...</div>',true);
    var items=[];
    var client=db();
    if(client){
      try{
        var result=await client.from('wct_meeting_items').select('*').eq('meeting_id',meeting.id).order('sort_order',{ascending:true});
        if(result.error)throw result.error;
        items=result.data||[];
      }catch(error){
        console.warn('Meeting items could not be loaded:',error);
      }
    }
    var hub='';
    try{
      var notePayload=typeof meeting.notes==='string'?JSON.parse(meeting.notes):meeting.notes;
      hub=String(notePayload&&notePayload.hub_code||meeting.hub_code||'');
    }catch(ignore){hub=String(meeting.hub_code||'');}
    var body='<div class="wct-mini-pill">'+escP1(typeof fmtDate==='function'?fmtDate(meeting.meeting_date):meeting.meeting_date)+'</div>'+
      (hub?'<div class="wct-mini-pill" style="margin:7px 0 13px">HUB '+escP1(hub)+'</div>':'');
    if(items.length){
      body+=items.map(function(item){
        var linked=item.case_id?((typeof state!=='undefined'&&state&&state.cases)||[]).find(function(c){return String(c.id)===String(item.case_id);}):null;
        var html='<article class="wct-p1-meeting-item"><h4>'+escP1(item.title||'Poin pembahasan')+'</h4>';
        if(item.kind==='existing_case'){
          html+='<small>Case terkait: '+escP1(linked?((linked.case_code||'CASE')+' · '+linked.title):'Case tidak tersedia')+'</small>';
          if(linked)html+='<button type="button" class="btn btn-sm" style="margin-top:8px" onclick="closeModal();openCaseDetail(\''+escP1(linked.id)+'\')">Buka Case</button>';
        }
        if(item.summary)html+='<p><b>Ringkasan</b><br>'+escP1(item.summary)+'</p>';
        if(item.decisions)html+='<p><b>Keputusan</b><br>'+escP1(item.decisions)+'</p>';
        if(item.next_step)html+='<p><b>Next Step</b><br>'+escP1(item.next_step)+'</p>';
        html+='</article>';
        return html;
      }).join('');
    }else{
      body+='<article class="wct-p1-meeting-item"><h4>Ringkasan Pembahasan</h4><p>'+escP1(meeting.summary||'—')+'</p><p><b>Keputusan / Arahan</b><br>'+escP1(meeting.decisions||'—')+'</p><p><b>Next Steps</b><br>'+escP1(meeting.next_steps||'—')+'</p></article>';
      var ids=Array.isArray(meeting.case_ids)?meeting.case_ids:[];
      var related=ids.map(function(id){return ((typeof state!=='undefined'&&state&&state.cases)||[]).find(function(c){return String(c.id)===String(id);});}).filter(Boolean);
      if(related.length)body+='<article class="wct-p1-meeting-item"><h4>Case terkait</h4>'+related.map(function(c){return '<p>'+escP1(c.case_code||'CASE')+' · '+escP1(c.title)+'</p><button type="button" class="btn btn-sm" onclick="closeModal();openCaseDetail(\''+escP1(c.id)+'\')">Buka Case</button>';}).join('')+'</article>';
    }
    var html='<div class="modal-head"><div><div class="eyebrow">MEETING MINUTES</div><h2>'+escP1(meeting.title)+'</h2><p class="sub">Dokumentasi pembahasan dan tindak lanjut.</p></div><button type="button" class="close" onclick="closeModal()">×</button></div><div class="modal-body">'+body+'</div><div class="modal-foot"><button type="button" class="btn" onclick="closeModal()">Tutup</button></div>';
    openModal(html,true);
  };

  function statusHistoryMarkup(rows){
    var body=document.querySelector('#modal .modal-body');
    if(!body)return;
    var existing=body.querySelector('.wct-status-history-section');
    if(existing)existing.remove();
    if(!rows.length)return;
    var section=document.createElement('section');
    section.className='wct-case-section wct-status-history-section';
    var html='<div class="wct-case-section-head"><div><h3>Riwayat Perubahan Status Action</h3><p>Perpindahan kolom Kanban dan perubahan status melalui Update Progress</p></div><span class="wct-mini-pill">'+rows.length+' riwayat</span></div><div class="wct-case-section-body"><div class="wct-p1-status-history">';
    rows.forEach(function(row){
      var action=((typeof state!=='undefined'&&state&&state.actions)||[]).find(function(a){return String(a.id)===String(row.action_id);});
      var before=row.from_status?statusText(row.from_status):'Action dibuat';
      var after=statusText(row.to_status);
      html+='<div class="wct-p1-status-history-row"><span class="wct-p1-status-history-mark"></span><div class="wct-p1-status-history-main"><strong>'+(action?escP1(action.title):'Action')+' · '+escP1(before)+' → '+escP1(after)+'</strong><small>'+escP1(personText(row.changed_by))+' · '+escP1(row.source||'Perubahan status')+'</small></div><time class="wct-p1-status-history-time">'+escP1(typeof fmtDateTime==='function'?fmtDateTime(row.changed_at):row.changed_at)+'</time></div>';
    });
    html+='</div></div>';
    section.innerHTML=html;
    body.appendChild(section);
  }

  function installStatusHistoryDetail(){
    var original=window.openCaseDetail;
    if(typeof original!=='function'||original.__wctP1Wrapped)return;
    var wrapped=function(caseId){
      var result=original.apply(this,arguments);
      var client=db();
      if(!client)return result;
      Promise.resolve().then(async function(){
        try{
          var query=await client.from('wct_action_status_history').select('*').eq('case_id',caseId).order('changed_at',{ascending:false}).limit(40);
          var modal=document.getElementById('modal');
          if(query.error)throw query.error;
          if(!modal||String(modal.dataset.caseId||'')!==String(caseId))return;
          statusHistoryMarkup(query.data||[]);
        }catch(error){
          console.warn('Action status history could not be loaded:',error);
        }
      });
      return result;
    };
    wrapped.__wctP1Wrapped=true;
    window.openCaseDetail=wrapped;
  }
  installStatusHistoryDetail();
})();
`;

  return html.replace('</body>',
    '<style id="wct-p1-workflow-style">' + css + '</style>' +
    '<script id="wct-p1-workflow-runtime">' + runtime + '</script></body>');
};
