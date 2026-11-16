(function(){
'use strict';
if (window.wctSupabaseRuntimeReady) return;
window.wctSupabaseRuntimeReady = true;

if (!window.supabase || typeof window.supabase.createClient !== 'function') {
  console.error('Supabase JS SDK belum termuat.');
  return;
}

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true }
});
window.wctSupabase = sb;

const TABLES = {
  users:'wct_users', team_directory:'wct_team_directory', cases:'wct_cases',
  actions:'wct_actions', progress_logs:'wct_progress_logs',
  progress_log_edits:'wct_progress_log_edits', meetings:'wct_meetings',
  meeting_cases:'wct_meeting_cases', counters:'wct_counters', app_settings:'wct_app_settings'
};
const PK = {
  wct_users:'id', wct_team_directory:'user_id', wct_cases:'id', wct_actions:'id',
  wct_progress_logs:'id', wct_progress_log_edits:'id', wct_meetings:'id',
  wct_meeting_cases:'meeting_id', wct_counters:'counter_key', wct_app_settings:'setting_key'
};
const ALLOWED = {
  wct_users:['id','login_id','employee_id','full_name','area_name','role','active','created_at','created_by','updated_at'],
  wct_team_directory:['user_id','full_name','role','active','deleted','updated_at'],
  wct_cases:['id','case_number','hub_code','category','division','title','problem_identification','occurred_on','target_date','reporter','priority','status','created_by','updated_by','closed_at','closed_by','created_at','updated_at'],
  wct_actions:['id','case_id','action_type','title','description','assigned_to','due_date','status','progress','latest_progress_log_id','created_by','updated_by','created_at','updated_at'],
  wct_progress_logs:['id','case_id','action_id','update_text','progress_before','progress_after','status_after','blocker','next_step','created_by','created_at','edited_by','edited_at','last_edit_audit_id'],
  wct_progress_log_edits:['id','log_id','case_id','action_id','edited_by','created_at','before_data','after_data','latest_update'],
  wct_meetings:['id','title','meeting_date','start_time','end_time','location','notes','status','created_by','created_at','updated_at'],
  wct_meeting_cases:['meeting_id','case_id','discussion_notes','created_at'],
  wct_counters:['counter_key','value','updated_at'],
  wct_app_settings:['setting_key','setting_value','updated_by','updated_at']
};

function cleanRow(table,row){
  const allowed=ALLOWED[table]||[],out={};
  Object.keys(row||{}).forEach(key=>{
    let target=key;
    if(table==='wct_cases'&&key==='case_code')target='case_number';
    if(table==='wct_team_directory'&&key==='id')target='user_id';
    if(table==='wct_counters'&&key==='id')target='counter_key';
    if(table==='wct_app_settings'&&key==='id')target='setting_key';
    if(allowed.includes(target)&&row[key]!==undefined)out[target]=row[key];
  });
  return out;
}
function presentRow(table,row){
  if(!row)return null;
  const out=Object.assign({},row);
  if(table==='wct_cases')out.case_code=row.case_number||'';
  if(table==='wct_team_directory')out.id=row.user_id;
  if(table==='wct_counters')out.id=row.counter_key;
  if(table==='wct_users')out.hub_code=row.area_name||'';
  if(table==='wct_app_settings'){
    const value=row.setting_value&&typeof row.setting_value==='object'?row.setting_value:{};
    return Object.assign({id:row.setting_key,setting_key:row.setting_key},value,{
      updated_by:row.updated_by||value.updated_by||null,
      updated_at:row.updated_at||value.updated_at||null
    });
  }
  if(table==='wct_progress_log_edits'){
    out.before=row.before_data;
    out.after=row.after_data;
  }
  return out;
}
function snapshot(table,row,id){
  const value=row?presentRow(table,row):null;
  return {id:id||(value&&value.id)||'',exists:!!row,data:()=>value?Object.assign({},value):undefined};
}
function rowsSnapshot(table,data){
  const docs=(data||[]).map(row=>snapshot(table,row));
  return {docs,size:docs.length,empty:docs.length===0};
}
function filterField(table,field){
  if(table==='wct_cases'&&field==='case_code')return 'case_number';
  if(table==='wct_team_directory'&&field==='id')return 'user_id';
  if(table==='wct_counters'&&field==='id')return 'counter_key';
  if(table==='wct_app_settings'&&field==='id')return 'setting_key';
  return field;
}
function applyFilter(request,table,item){
  const field=filterField(table,item.field);
  switch(item.op){
    case '==':return request.eq(field,item.value);
    case '!=':return request.neq(field,item.value);
    case '>':return request.gt(field,item.value);
    case '>=':return request.gte(field,item.value);
    case '<':return request.lt(field,item.value);
    case '<=':return request.lte(field,item.value);
    case 'in':return request.in(field,item.value);
    default:throw new Error('Operator filter belum didukung: '+item.op);
  }
}
function collection(name){
  const table=TABLES[name];
  if(!table)throw new Error('Tabel aplikasi tidak dikenal: '+name);
  const query=(filters=[],orders=[],max=null)=>({
    where(field,op,value){return query(filters.concat([{field,op,value}]),orders,max);},
    orderBy(field,direction){return query(filters,orders.concat([{field,direction}]),max);},
    limit(value){return query(filters,orders,Number(value));},
    async get(){
      let request=sb.from(table).select('*');
      filters.forEach(item=>{request=applyFilter(request,table,item);});
      orders.forEach(item=>{request=request.order(filterField(table,item.field),{ascending:item.direction!=='desc'});});
      if(max)request=request.limit(max);
      const result=await request;
      if(result.error)throw result.error;
      return rowsSnapshot(table,result.data);
    },
    doc(id){
      const docId=id||(crypto.randomUUID?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0;return(c==='x'?r:(r&3|8)).toString(16);}));
      const ref={
        id:docId,
        async get(){
          const result=await sb.from(table).select('*').eq(PK[table],docId).maybeSingle();
          if(result.error)throw result.error;
          return snapshot(table,result.data,docId);
        },
        async set(value,options){
          let record;
          if(table==='wct_app_settings'){
            const old=options&&options.merge?await ref.get():null;
            const merged=Object.assign({},old&&old.exists?old.data():{},value||{});
            const settingValue=Object.assign({},merged);
            ['id','setting_key','updated_by','updated_at'].forEach(k=>delete settingValue[k]);
            record={setting_key:docId,setting_value:settingValue,updated_by:merged.updated_by||null,updated_at:new Date().toISOString()};
          }else{
            record=cleanRow(table,Object.assign({},value||{},{
              [PK[table]]:docId
            }));
          }
          const result=await sb.from(table).upsert(record,{onConflict:PK[table]}).select('*').single();
          if(result.error)throw result.error;
          return snapshot(table,result.data,docId);
        },
        async update(value){
          if(table==='wct_app_settings'){
            const old=await ref.get();
            if(!old.exists)throw new Error('Pengaturan tidak ditemukan.');
            return ref.set(Object.assign({},old.data(),value||{}),{merge:true});
          }
          const record=cleanRow(table,value||{});
          const result=await sb.from(table).update(record).eq(PK[table],docId).select('*').maybeSingle();
          if(result.error)throw result.error;
          if(!result.data)throw new Error('Data '+name+' tidak ditemukan atau tidak memiliki izin.');
          return snapshot(table,result.data,docId);
        },
        async delete(){
          const result=await sb.from(table).delete().eq(PK[table],docId);
          if(result.error)throw result.error;
          return true;
        }
      };
      return ref;
    },
    async add(value){
      const record=cleanRow(table,value||{});
      const result=await sb.from(table).insert(record).select('*').single();
      if(result.error)throw result.error;
      return {id:result.data[PK[table]],data:()=>presentRow(table,result.data)};
    }
  });
  return query();
}

const db={
  collection,
  batch(){
    const operations=[];
    return {
      set(ref,value,options){operations.push(()=>ref.set(value,options));return this;},
      update(ref,value){operations.push(()=>ref.update(value));return this;},
      delete(ref){operations.push(()=>ref.delete());return this;},
      async commit(){const results=[];for(const operation of operations)results.push(await operation());return results;}
    };
  },
  async runTransaction(){
    throw new Error('Transaksi Firestore tidak tersedia. Gunakan fungsi PostgreSQL atomik Supabase.');
  }
};

let authUser=null;
auth={
  get currentUser(){return authUser;},
  async signInWithEmailAndPassword(email,password){
    const result=await sb.auth.signInWithPassword({email,password});
    if(result.error)throw result.error;
    authUser=result.data.user?{uid:result.data.user.id,id:result.data.user.id,email:result.data.user.email}:null;
    return {user:authUser};
  },
  async signOut(){authUser=null;const result=await sb.auth.signOut();if(result.error)throw result.error;},
  onAuthStateChanged(callback){
    const result=sb.auth.onAuthStateChange((event,session)=>{
      authUser=session&&session.user?{uid:session.user.id,id:session.user.id,email:session.user.email}:null;
      callback(authUser);
    });
    return result.data.subscription;
  }
};
fireDb=db;
mode='supabase';

function emailForLogin(id){
  return String(id||'').trim().toLowerCase().replace(/\s+/g,'')+'@weeklycasetracker.app';
}
async function getProfile(userId){
  const result=await sb.from('wct_users').select('*').eq('id',userId).maybeSingle();
  if(result.error)throw result.error;
  if(!result.data||result.data.active!==true)return null;
  return Object.assign({id:result.data.id},result.data,{hub_code:result.data.area_name||''});
}
async function loadRuntimeData(){
  const names=['wct_cases','wct_actions','wct_progress_logs','wct_meetings','wct_users','wct_team_directory','wct_progress_log_edits','wct_app_settings','wct_meeting_cases'];
  const results=await Promise.all(names.map(name=>sb.from(name).select('*')));
  results.forEach(result=>{if(result.error)throw result.error;});
  const data=Object.fromEntries(names.map((name,index)=>[name,results[index].data||[]]));
  const profiles=(data.wct_users||[]).map(profile=>Object.assign({id:profile.id},profile,{hub_code:profile.area_name||''}));
  (data.wct_team_directory||[]).forEach(directory=>{
    const profile=profiles.find(item=>item.id===directory.user_id);
    if(profile)Object.assign(profile,{
      deleted:directory.deleted===true,
      active:directory.active===true,
      full_name:directory.full_name||profile.full_name,
      role:directory.role||profile.role
    });
    else profiles.push({
      id:directory.user_id,full_name:directory.full_name,role:directory.role,
      active:directory.active,deleted:directory.deleted,login_id:'',
      area_name:'All Areas',hub_code:'All Areas'
    });
  });
  state={
    cases:(data.wct_cases||[]).map(row=>presentRow('wct_cases',row)).sort((a,b)=>String(b.created_at||'').localeCompare(String(a.created_at||''))),
    actions:(data.wct_actions||[]).map(row=>presentRow('wct_actions',row)),
    logs:(data.wct_progress_logs||[]).map(row=>presentRow('wct_progress_logs',row)).sort((a,b)=>String(b.created_at||'').localeCompare(String(a.created_at||''))),
    meetings:(data.wct_meetings||[]).map(row=>presentRow('wct_meetings',row)).sort((a,b)=>String(b.meeting_date||'').localeCompare(String(a.meeting_date||''))),
    profiles,
    progressLogEdits:(data.wct_progress_log_edits||[]).map(row=>presentRow('wct_progress_log_edits',row)),
    meetingCases:data.wct_meeting_cases||[],
    caseOptions:{categories:[],divisions:[]}
  };
  const settings=(data.wct_app_settings||[]).find(row=>row.setting_key==='case_options');
  if(settings&&settings.setting_value)state.caseOptions=Object.assign({categories:[],divisions:[]},settings.setting_value);
  return state;
}

refreshData=async function(){await loadRuntimeData();};
window.refreshData=refreshData;

window.loginFirebase=async function(){
  const loginId=normalizeLoginId($('loginId').value),password=$('loginPassword').value||'';
  if(!/^[a-z0-9._-]{3,32}$/.test(loginId)){toast('Format ID Login tidak valid.');return;}
  if(!password){toast('Masukkan password.');return;}
  try{
    const result=await sb.auth.signInWithPassword({email:emailForLogin(loginId),password});
    if(result.error)throw result.error;
    const profile=await getProfile(result.data.user.id);
    if(!profile){await sb.auth.signOut();throw new Error('Profil akun tidak aktif atau belum terdaftar. Hubungi Admin.');}
    currentUser=profile;mode='supabase';await refreshData();showApp();
    const badge=$('modePill');if(badge){badge.textContent='● SUPABASE CONNECTED';badge.className='pill live';}
  }catch(error){toast('Login gagal: '+(error.message||'Periksa ID dan password.'));}
};
window.logout=async function(){
  try{await sb.auth.signOut();}catch(error){console.warn(error);}
  currentUser=null;mode='supabase';showLogin();
};
const originalShowApp=window.showApp;
if(typeof originalShowApp==='function'){
  window.showApp=function(){
    originalShowApp();
    const badge=$('modePill');if(badge){badge.textContent='● SUPABASE CONNECTED';badge.className='pill live';}
  };
}

window.submitCase=async function(event){
  event.preventDefault();
  if(!isCoordinator())return;
  const form=new FormData(event.target);
  const row={
    hub_code:String(form.get('hub_code')||'').trim().toUpperCase(),
    category:String(form.get('category')||'').trim(),
    division:String(form.get('division')||'').trim(),
    title:String(form.get('title')||'').trim(),
    priority:String(form.get('priority')||'Medium'),
    problem_identification:String(form.get('problem_identification')||'').trim(),
    reporter:String(form.get('reporter')||currentUser.full_name||currentUser.login_id||'').trim(),
    status:'open',
    occurred_on:String(form.get('occurred_on')||'')||null,
    target_date:String(form.get('target_date')||'')||null
  };
  if(!row.hub_code||!row.category||!row.division||!row.title||!row.problem_identification||!row.occurred_on){
    toast('Lengkapi HUB, kategori, divisi, judul, tanggal kejadian, dan uraian masalah.');return;
  }
  const actions=[];
  [['corrective','ca'],['preventive','pa']].forEach(item=>{
    const title=String(form.get(item[1]+'_title')||'').trim();
    if(title)actions.push({
      action_type:item[0],title,description:'',
      assigned_to:String(form.get(item[1]+'_assigned')||'')||null,
      due_date:String(form.get(item[1]+'_due')||'')||null
    });
  });
  const button=event.submitter||event.target.querySelector('button[type=submit]');
  if(button&&button.disabled)return;
  if(button){button.disabled=true;button.dataset.originalLabel=button.textContent;button.textContent='Menyimpan...';}
  try{
    const result=await sb.rpc('wct_create_case',{p_case:row,p_actions:actions});
    if(result.error)throw result.error;
    await refreshData();closeModal();toast('Case berhasil dibuat.');renderPage();
  }catch(error){
    console.error(error);
    if(button){button.disabled=false;button.textContent=button.dataset.originalLabel||'Simpan Case';}
    toast('Gagal menyimpan Case: '+(error.message||error));
  }
};

window.submitAction=async function(event,caseId,type,actionId){
  event.preventDefault();
  if(!isCoordinator())return;
  const parent=state.cases.find(item=>item.id===caseId);
  if(!parent||parent.status==='closed'){toast('Case sudah masuk arsip.');return;}
  const form=new FormData(event.target);
  const title=String(form.get('title')||'').trim();
  const assigned=String(form.get('assigned_to')||'')||null;
  const due=String(form.get('due_date')||'')||null;
  if(!title||!assigned||!due){toast('Nama Action, PIC, dan target penyelesaian wajib diisi.');return;}
  const fields={
    title,description:String(form.get('description')||'').trim(),
    assigned_to:assigned,due_date:due,updated_by:currentUser.id,
    updated_at:new Date().toISOString()
  };
  try{
    let result;
    if(actionId){
      result=await sb.from('wct_actions').update(fields).eq('id',actionId).eq('case_id',caseId).select('*').maybeSingle();
    }else{
      result=await sb.from('wct_actions').insert(Object.assign({
        case_id:caseId,action_type:type,status:'open',progress:0,created_by:currentUser.id
      },fields)).select('*').single();
    }
    if(result.error)throw result.error;
    if(!result.data)throw new Error('Action tidak ditemukan atau tidak memiliki izin.');
    await refreshData();closeModal();window.openCaseDetail(caseId);toast('Action berhasil disimpan.');
  }catch(error){toast('Gagal menyimpan Action: '+(error.message||error));}
};

window.submitProgress=async function(event,actionId,logId){
  event.preventDefault();
  const action=state.actions.find(item=>item.id===actionId);
  if(!action){toast('Action tidak ditemukan.');return;}
  const parent=state.cases.find(item=>item.id===action.case_id);
  if(!parent||parent.status==='closed'||currentUser?.role==='viewer'){toast('Case arsip atau akun Viewer tidak dapat mengubah progress.');return;}
  const form=new FormData(event.target);
  const progress=Number(form.get('progress_after'));
  const status=String(form.get('status')||'in_progress');
  const updateText=String(form.get('update_text')||'').trim();
  if(!Number.isFinite(progress)||progress<0||progress>100||!updateText||
     !['open','in_progress','review','done'].includes(status)){
    toast('Isi aktivitas dan progress 0–100% dengan status yang valid.');return;
  }
  const args={
    p_update_text:updateText,p_progress_after:progress,p_status_after:status,
    p_blocker:String(form.get('blocker')||'').trim(),
    p_next_step:String(form.get('next_step')||'').trim()
  };
  const button=event.submitter||event.target.querySelector('button[type=submit]');
  if(button&&button.disabled)return;
  if(button){button.disabled=true;button.dataset.originalLabel=button.textContent;button.textContent=logId?'Menyimpan koreksi...':'Menyimpan progress...';}
  try{
    const result=logId
      ?await sb.rpc('wct_edit_progress',Object.assign({p_log_id:logId},args))
      :await sb.rpc('wct_update_progress',Object.assign({p_action_id:actionId},args));
    if(result.error)throw result.error;
    await refreshData();closeModal();window.openCaseDetail(action.case_id);
    toast(logId?'Riwayat progress dikoreksi dan audit tersimpan.':'Progress berhasil diperbarui.');
  }catch(error){
    if(button){button.disabled=false;button.textContent=button.dataset.originalLabel||(logId?'Simpan Koreksi':'Simpan Update');}
    toast('Gagal menyimpan progress: '+(error.message||error));
  }
};

window.saveEditedCase=async function(event){
  event.preventDefault();
  if(!isCoordinator())return;
  const form=new FormData(event.target),id=String(form.get('case_id')||'');
  if(!state.cases.some(item=>item.id===id)){toast('Case tidak ditemukan.');return;}
  const row={
    hub_code:String(form.get('hub_code')||'').trim().toUpperCase(),
    category:String(form.get('category')||'').trim(),
    division:String(form.get('division')||'').trim(),
    title:String(form.get('title')||'').trim(),
    status:String(form.get('status')||'open'),
    priority:String(form.get('priority')||'Medium'),
    problem_identification:String(form.get('problem_identification')||'').trim(),
    occurred_on:String(form.get('occurred_on')||'')||null,
    target_date:String(form.get('target_date')||'')||null,
    reporter:String(form.get('reporter')||'').trim()
  };
  if(!row.hub_code||!row.category||!row.division||!row.title||!row.problem_identification){
    toast('Lengkapi HUB, kategori, divisi, judul, dan uraian masalah.');return;
  }
  const existing=state.actions.filter(item=>item.case_id===id);
  const actions=['corrective','preventive'].map(type=>{
    const old=existing.find(item=>item.action_type===type);
    const prefix=type==='corrective'?'ca':'pa';
    return {
      id:old?old.id:null,action_type:type,
      title:String(form.get(prefix+'_title')||'').trim(),
      assigned_to:String(form.get(prefix+'_assigned')||'')||null,
      due_date:String(form.get(prefix+'_due')||'')||null
    };
  });
  try{
    const result=await sb.rpc('wct_save_case_and_actions',{p_case_id:id,p_case:row,p_actions:actions});
    if(result.error)throw result.error;
    await refreshData();closeModal();toast('Case berhasil diperbarui.');renderCases();
  }catch(error){toast('Gagal memperbarui Case: '+(error.message||error));}
};

window.closeCase=async function(id){
  const record=state.cases.find(item=>item.id===id);
  if(!record||!isCoordinator())return;
  if(record.status==='closed'){toast('Case sudah berada di arsip.');return;}
  const pending=state.actions.filter(item=>item.case_id===id&&(item.status!=='done'||Number(item.progress)!==100));
  let message='Tutup '+(record.case_code||'Case')+'? Pastikan hasil tindakan telah diperiksa.';
  if(pending.length)message+=' Masih ada '+pending.length+' tindakan yang belum 100%.';
  if(!confirm(message))return;
  const now=new Date().toISOString();
  try{
    const result=await sb.from('wct_cases').update({
      status:'closed',closed_at:now,closed_by:currentUser.id,
      updated_by:currentUser.id,updated_at:now
    }).eq('id',id);
    if(result.error)throw result.error;
    await refreshData();closeModal();renderPage();toast('Case berhasil ditutup dan masuk arsip.');
  }catch(error){toast('Gagal menutup Case: '+(error.message||error));}
};

window.changeOwnPassword=async function(event){
  event.preventDefault();
  const form=new FormData(event.target);
  const current=String(form.get('current_password')||'');
  const next=String(form.get('new_password')||'');
  const confirmNext=String(form.get('confirm_password')||'');
  if(next.length<8){toast('Password baru minimal 8 karakter.');return;}
  if(next!==confirmNext){toast('Konfirmasi password baru tidak cocok.');return;}
  try{
    const userResult=await sb.auth.getUser();
    const email=userResult.data&&userResult.data.user&&userResult.data.user.email;
    if(userResult.error||!email)throw new Error('Sesi login tidak ditemukan.');
    const verified=await sb.auth.signInWithPassword({email,password:current});
    if(verified.error)throw new Error('Password saat ini tidak sesuai.');
    const updated=await sb.auth.updateUser({password:next});
    if(updated.error)throw updated.error;
    event.target.reset();toast('Password akun berhasil diperbarui.');
  }catch(error){toast('Gagal mengganti password: '+(error.message||error));}
};

async function callAdminFunction(body){
  const result=await sb.functions.invoke('wct-admin-users',{body});
  if(result.error){
    let message=result.error.message||'Fungsi administrasi belum tersedia.';
    if(result.data&&result.data.error)message=result.data.error;
    throw new Error(message);
  }
  if(result.data&&result.data.error)throw new Error(result.data.error);
  return result.data;
}
window.submitUser=async function(event){
  event.preventDefault();if(!isAdmin())return;
  const form=new FormData(event.target);
  try{
    await callAdminFunction({
      action:'create',loginId:normalizeLoginId(form.get('login_id')),
      fullName:String(form.get('full_name')||'').trim(),
      employeeId:String(form.get('employee_id')||form.get('login_id')||'').trim(),
      role:String(form.get('role')||'member'),
      areaName:String(form.get('area_name')||'All Areas').trim(),
      password:String(form.get('password')||'')
    });
    await refreshData();closeModal();renderUsers();toast('Akun Supabase Auth berhasil dibuat.');
  }catch(error){toast('Gagal membuat akun: '+(error.message||error));}
};
window.submitResetPassword=async function(event,userId){
  event.preventDefault();
  if(!isAdmin())return;
  const form=new FormData(event.target);
  const password=String(form.get('password')||'');
  if(password.length<8||password.length>128){toast('Password baru harus 8–128 karakter.');return;}
  try{
    await callAdminFunction({action:'reset-password',userId,password});
    closeModal();
    toast('Password berhasil di-reset. Sampaikan password baru secara aman kepada pengguna.');
  }catch(error){toast('Gagal reset password: '+(error.message||error));}
};
window.toggleUserActive=async function(userId,active){
  if(!isAdmin())return;
  const user=state.profiles.find(item=>item.id===userId);
  if(!user||userId===currentUser.id)return;
  if(!confirm((active?'Aktifkan':'Nonaktifkan')+' akun '+user.full_name+'?'))return;
  try{
    await callAdminFunction({
      action:'set-active',userId,active,deleted:false,
      fullName:user.full_name,role:user.role
    });
    await refreshData();renderUsers();toast('Status akun berhasil diperbarui.');
  }catch(error){toast('Gagal memperbarui akun: '+(error.message||error));}
};
window.softDeleteUser=async function(userId){
  if(!isAdmin())return;
  const user=state.profiles.find(item=>item.id===userId);
  if(!user||userId===currentUser.id)return;
  if(!confirm('Hapus akses '+user.full_name+'? Pengguna tidak dapat login lagi, profil tetap tersimpan.'))return;
  try{
    await callAdminFunction({
      action:'set-active',userId,active:false,deleted:true,
      fullName:user.full_name,role:user.role
    });
    await refreshData();renderUsers();toast('Akses pengguna berhasil dinonaktifkan.');
  }catch(error){toast('Gagal menghapus akses: '+(error.message||error));}
};
window.restoreUser=async function(userId){
  if(!isAdmin())return;
  const user=state.profiles.find(item=>item.id===userId);
  if(!user||user.deleted!==true)return;
  if(!confirm('Pulihkan akses '+user.full_name+'?'))return;
  try{
    await callAdminFunction({
      action:'set-active',userId,active:true,deleted:false,
      fullName:user.full_name,role:user.role
    });
    await refreshData();renderUsers();toast('Akses pengguna berhasil dipulihkan.');
  }catch(error){toast('Gagal memulihkan pengguna: '+(error.message||error));}
};
window.saveUserProfile=async function(event,userId){
  event.preventDefault();if(!isAdmin())return;
  const form=new FormData(event.target),user=state.profiles.find(item=>item.id===userId);
  if(!user)return;
  try{
    await callAdminFunction({
      action:'update-profile',userId,
      fullName:String(form.get('full_name')||'').trim(),
      role:String(form.get('role')||'member'),
      areaName:String(form.get('hub_code')||form.get('area_name')||user.area_name||'All Areas').trim(),
      active:user.active!==false,
      deleted:user.deleted===true
    });
    await refreshData();closeModal();renderUsers();toast('Profil pengguna berhasil diperbarui.');
  }catch(error){toast('Gagal mengubah profil: '+(error.message||error));}
};

window.saveCaseOptions=async function(next){
  if(!isAdmin())return false;
  const value={
    categories:[...new Set((next.categories||[]).map(item=>String(item).trim()).filter(Boolean))],
    divisions:[...new Set((next.divisions||[]).map(item=>String(item).trim()).filter(Boolean))]
  };
  try{
    const result=await sb.from('wct_app_settings').upsert({
      setting_key:'case_options',setting_value:value,
      updated_by:currentUser.id,updated_at:new Date().toISOString()
    },{onConflict:'setting_key'});
    if(result.error)throw result.error;
    state.caseOptions=value;toast('Pengaturan Kategori dan Divisi berhasil disimpan.');renderSettings();return true;
  }catch(error){toast('Gagal menyimpan pengaturan: '+(error.message||error));return false;}
};

async function restoreSupabaseSession(session){
  if(!session||!session.user){currentUser=null;return;}
  try{
    const profile=await getProfile(session.user.id);
    if(!profile){await sb.auth.signOut();currentUser=null;showLogin();return;}
    currentUser=profile;mode='supabase';await refreshData();showApp();
  }catch(error){
    console.error('Supabase session restore failed:',error);
    currentUser=null;await sb.auth.signOut();showLogin();
    toast('Sesi tidak dapat diverifikasi. Login kembali.');
  }
}
sb.auth.onAuthStateChange((event,session)=>{
  if(event==='INITIAL_SESSION'||event==='SIGNED_IN'||event==='TOKEN_REFRESHED'){
    Promise.resolve().then(()=>restoreSupabaseSession(session));
  }else if(event==='SIGNED_OUT'){currentUser=null;}
});

const loginButton=document.querySelector('#loginScreen .login-actions button');
if(loginButton){loginButton.textContent='Masuk';loginButton.setAttribute('onclick','loginFirebase()');}
const demoButton=document.querySelector('#loginScreen .login-actions button:nth-child(2)');
if(demoButton)demoButton.remove();
const loginHint=$('loginHint');
if(loginHint)loginHint.textContent='Masuk menggunakan ID dan password yang dibuat oleh Admin.';
const badge=$('modePill');
if(badge){badge.textContent='● SUPABASE CONNECTED';badge.className='pill live';}
})();
