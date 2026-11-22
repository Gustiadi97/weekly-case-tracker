module.exports = function addOperationalUpgrades(html) {
  const css = String.raw`
.wct-multi-picker{display:flex;flex-wrap:wrap;gap:8px;margin-top:7px}
.wct-choice-chip{display:inline-flex;align-items:center;gap:8px;min-height:38px;padding:8px 12px;border:1px solid #E2E5EB;border-radius:10px;background:#fff;color:#454B59;font-size:11px;font-weight:750;cursor:pointer}
.wct-choice-chip input{width:15px!important;height:15px!important;min-height:15px!important;margin:0;accent-color:#FEA500}
.wct-choice-chip:has(input:checked){border-color:#FEA500;background:#FFF7E8;color:#805300}
.wct-picker-hint{display:block;margin-top:7px;color:#89909D;font-size:10px}
.wct-productivity{margin:16px 0 18px;border:1px solid #E5E8EF;border-radius:17px;background:#fff;box-shadow:0 7px 22px rgba(36,42,55,.045);overflow:visible}
.wct-productivity-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:17px 19px 14px;border-bottom:1px solid #EEF0F4}
.wct-productivity-head h3{margin:3px 0 4px;color:#242B38;font-size:15px;font-weight:850}
.wct-productivity-head p{margin:0;color:#818895;font-size:11px;line-height:1.5}
.wct-productivity-kicker{color:#D58A00;font-size:9px;font-weight:900;letter-spacing:.13em;text-transform:uppercase}
.wct-productivity-filters{display:flex;align-items:center;justify-content:flex-end;gap:8px;flex-wrap:wrap}
.wct-prod-filter{position:relative}.wct-prod-filter summary{display:inline-flex;align-items:center;gap:8px;min-height:36px;padding:8px 11px;border:1px solid #E4E7ED;border-radius:9px;background:#fff;color:#565D6B;font-size:10px;font-weight:800;cursor:pointer;list-style:none}
.wct-prod-filter summary::-webkit-details-marker{display:none}.wct-prod-filter[open] summary{border-color:#E6B65D;background:#FFFAF0;color:#8A5900}
.wct-prod-filter-menu{position:absolute;top:42px;right:0;z-index:30;min-width:210px;max-height:260px;overflow:auto;padding:9px;border:1px solid #E7E9EF;border-radius:12px;background:#fff;box-shadow:0 14px 35px rgba(27,35,48,.15)}
.wct-prod-filter-option{display:flex;align-items:center;gap:9px;padding:8px;border-radius:8px;color:#525A68;font-size:11px;cursor:pointer}.wct-prod-filter-option:hover{background:#FFF8E9}.wct-prod-filter-option input{accent-color:#FEA500}
.wct-productivity-body{padding:15px 18px 18px}.wct-prod-kpis{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin-bottom:14px}
.wct-prod-kpi{min-width:0;padding:13px 14px;border:1px solid #EAECF1;border-radius:12px;background:#FCFCFD}
.wct-prod-kpi small{display:block;color:#818895;font-size:10px;font-weight:750}.wct-prod-kpi strong{display:block;margin:7px 0 3px;color:#242B38;font-size:25px;font-weight:900;letter-spacing:-.04em}.wct-prod-kpi span{color:#9298A3;font-size:9px}
.wct-prod-kpi.is-accent{border-color:#F4D79E;background:#FFFAF1}.wct-prod-kpi.is-accent strong{color:#9B6500}
.wct-prod-grid{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(260px,.85fr);gap:13px}.wct-prod-panel{min-width:0;padding:14px;border:1px solid #EAECF1;border-radius:13px;background:#fff}
.wct-prod-panel-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}.wct-prod-panel-head b{color:#303746;font-size:11px;font-weight:850}.wct-prod-panel-head small{color:#9298A3;font-size:9px}
.wct-prod-bars{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));align-items:end;gap:9px;min-height:132px;padding-top:9px}
.wct-prod-day{display:grid;grid-template-rows:1fr auto;align-items:end;gap:7px;min-width:0;text-align:center}.wct-prod-bar-track{display:flex;align-items:flex-end;justify-content:center;height:96px;border-radius:7px;background:#F4F5F7;overflow:hidden}
.wct-prod-bar{width:65%;min-height:2px;border-radius:7px 7px 2px 2px;background:linear-gradient(180deg,#FFC85A,#E8A222)}.wct-prod-day small{color:#89909D;font-size:9px}.wct-prod-day b{display:block;color:#555D6B;font-size:9px}
.wct-prod-top-pic{display:grid;gap:8px}.wct-prod-person{display:grid;grid-template-columns:24px minmax(0,1fr) auto;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid #F0F1F4}.wct-prod-person:last-child{border-bottom:0}
.wct-prod-rank{display:grid;place-items:center;width:23px;height:23px;border-radius:7px;background:#FFF4DC;color:#9B680A;font-size:9px;font-weight:900}
.wct-prod-person strong{display:block;overflow:hidden;color:#394151;font-size:10px;text-overflow:ellipsis;white-space:nowrap}.wct-prod-person small{display:block;margin-top:3px;color:#9298A3;font-size:9px}.wct-prod-person em{color:#8A5D00;font-size:10px;font-style:normal;font-weight:850}
.wct-prod-empty{display:grid;place-items:center;min-height:80px;color:#9298A3;font-size:10px;text-align:center}
.wct-notification-anchor{position:relative;display:inline-flex}
.wct-notification-bell{position:relative;display:inline-grid;place-items:center;width:38px;height:38px;border:1px solid #E6E8ED;border-radius:11px;background:#fff;color:#4B5260;cursor:pointer}
.wct-notification-bell:hover,.wct-notification-bell.is-open{border-color:#F1C46E;background:#FFFAF1;color:#9D6800}.wct-notification-bell svg{width:18px;height:18px}
.wct-notification-count{position:absolute;top:-5px;right:-5px;display:none;min-width:17px;height:17px;padding:0 4px;border:2px solid #fff;border-radius:999px;background:#D84E53;color:#fff;font-size:8px;font-weight:900;line-height:13px;text-align:center}
.wct-notification-count.has-unread{display:block}
.wct-notification-popover{position:absolute;top:46px;right:0;z-index:80;width:min(360px,calc(100vw - 28px));max-height:470px;overflow:auto;border:1px solid #E7E9EF;border-radius:15px;background:#fff;box-shadow:0 20px 55px rgba(23,30,42,.18)}
.wct-notification-popover[hidden]{display:none}.wct-notification-popover-head{display:flex;align-items:center;justify-content:space-between;gap:9px;padding:14px 15px;border-bottom:1px solid #EEF0F4}
.wct-notification-popover-head b{display:block;color:#252B37;font-size:12px}.wct-notification-popover-head small{display:block;margin-top:3px;color:#8B919C;font-size:9px}
.wct-notification-popover-head button,.wct-notification-page-actions button{border:0;background:transparent;color:#966400;font-size:10px;font-weight:850;cursor:pointer}
.wct-notification-list{display:grid}.wct-notification-row{display:grid;grid-template-columns:30px minmax(0,1fr) 7px;gap:10px;align-items:start;padding:12px 14px;border-bottom:1px solid #F0F1F4;background:#fff;cursor:pointer}
.wct-notification-row:hover{background:#FFFCF5}.wct-notification-row.is-unread{background:#FFFAF0}
.wct-notification-symbol{display:grid;place-items:center;width:29px;height:29px;border-radius:9px;background:#F1F3F6;color:#687181;font-size:12px;font-weight:900}
.wct-notification-row.is-unread .wct-notification-symbol{background:#FFF0CE;color:#996300}
.wct-notification-copy strong{display:block;color:#303746;font-size:10px;font-weight:850;line-height:1.4}.wct-notification-copy p{margin:4px 0;color:#737B89;font-size:9px;line-height:1.5}.wct-notification-copy small{color:#9AA0AA;font-size:8px}
.wct-notification-unread-dot{width:7px;height:7px;margin-top:5px;border-radius:50%;background:#E6A52B}.wct-notification-empty{padding:28px 16px;color:#8B919C;font-size:10px;text-align:center}
.wct-notification-page{display:grid;gap:14px}.wct-notification-page-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:13px 15px;border:1px solid #E7E9EF;border-radius:13px;background:#fff}
.wct-notification-page-toolbar>div{display:flex;align-items:center;gap:7px;flex-wrap:wrap}.wct-notification-tab{min-height:33px;padding:7px 11px;border:1px solid #E4E7ED;border-radius:9px;background:#fff;color:#636B79;font-size:10px;font-weight:800;cursor:pointer}
.wct-notification-tab.active{border-color:#F0CB83;background:#FFFAF1;color:#936000}.wct-notification-page-actions{display:flex;gap:10px;align-items:center}
.wct-notification-page-card{border:1px solid #E7E9EF;border-radius:14px;background:#fff;overflow:hidden}.wct-notification-page-card .wct-notification-row{grid-template-columns:38px minmax(0,1fr) auto;padding:15px 17px}
.wct-notification-page-card .wct-notification-symbol{width:36px;height:36px;border-radius:10px;font-size:14px}.wct-notification-open{padding:6px 9px;border:1px solid #E5E8ED;border-radius:8px;background:#fff;color:#596272;font-size:9px;font-weight:800;cursor:pointer}
.wct-notification-open:hover{border-color:#EFC979;color:#8B5D00}
.wct-notification-nav-item{position:relative}.wct-notification-nav-count{margin-left:auto;padding:2px 6px;border-radius:999px;background:#FBE8E8;color:#B83C43;font-size:9px;font-weight:900}
@media(max-width:900px){.wct-prod-kpis{grid-template-columns:repeat(3,minmax(0,1fr))}.wct-prod-grid{grid-template-columns:minmax(0,1fr)}}
@media(max-width:650px){.wct-productivity-head{display:block;padding:14px}.wct-productivity-filters{justify-content:flex-start;margin-top:12px}.wct-productivity-body{padding:12px}.wct-prod-kpis{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.wct-prod-kpi{padding:11px}.wct-prod-kpi strong{font-size:23px}.wct-prod-bars{gap:5px}.wct-prod-panel{padding:12px}.wct-notification-page-card .wct-notification-row{grid-template-columns:32px minmax(0,1fr);padding:12px}.wct-notification-open{grid-column:2;justify-self:start}.wct-notification-page-toolbar{align-items:flex-start}.wct-notification-page-actions{width:100%;justify-content:flex-end}}
`;
  const runtime = String.raw`
(function(){
  if(window.__WCT_OPERATIONAL_UPGRADES__)return;
  window.__WCT_OPERATIONAL_UPGRADES__=true;
  var $=function(id){return document.getElementById(id);};
  var esc=function(value){return String(value==null?'':value).replace(/[&<>"]/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch];});};
  var db=function(){return window.wctSupabase||null;};
  var current=function(){try{return currentUser||{};}catch(e){return window.currentUser||{};}};
  var stateData=function(){try{return state||{};}catch(e){return {};}};
  var optionData=function(){var s=stateData().caseOptions||{};return {
    hubs:Array.isArray(s.hubs)&&s.hubs.length?s.hubs:['MKS','BPP','BJM','MND','PLK'],
    divisions:Array.isArray(s.divisions)&&s.divisions.length?s.divisions:['Hub Operations','Gateway','Last Mile','Transport','Facility','Human Capital','GA','Other']
  };};
  var listFor=function(item,key,fallback){var values=item&&Array.isArray(item[key])?item[key]:[];if(values.length)return values;var value=item&&item[fallback];return value?[value]:[];};
  var originalOpenCase=window.openCaseForm,originalEditCase=window.editCaseForm;
  function pickerMarkup(label,name,items,selected,kind){
    var chosen=Array.isArray(selected)?selected:[];
    return '<label>'+label+'</label><div class="wct-multi-picker" data-wct-picker="'+name+'">'+items.map(function(item){
      var value=String(item),checked=chosen.indexOf(value)>=0;
      return '<label class="wct-choice-chip"><input type="checkbox" name="'+name+'" value="'+esc(value)+'" '+(checked?'checked':'')+'><span>'+esc(value)+'</span></label>';
    }).join('')+'</div><small class="wct-picker-hint">Pilih satu atau lebih '+kind+'.</small>';
  }
  function replaceField(form,selector,label,name,items,selected,kind){
    var input=form&&form.querySelector(selector);if(!input)return;
    var field=input.closest('.field')||input.parentElement;if(!field)return;
    field.innerHTML=pickerMarkup(label,name,items,selected,kind);
  }
  function upgradeCaseForm(form,record){
    if(!form||form.dataset.wctMultiPickerReady==='1')return;
    form.dataset.wctMultiPickerReady='1';
    var opts=optionData(),edit=!!record;
    replaceField(form,'[name="hub_code"]','HUB Operasional *','hub_codes',opts.hubs,edit?listFor(record,'hub_codes','hub_code'):[],'HUB');
    replaceField(form,'[name="division"]','Divisi Penanggung Jawab *','divisions',opts.divisions,edit?listFor(record,'divisions','division'):[],'Divisi');
  }
  if(typeof originalOpenCase==='function')window.openCaseForm=function(){var result=originalOpenCase.apply(this,arguments);window.setTimeout(function(){upgradeCaseForm($('caseForm'),null);},35);return result;};
  if(typeof originalEditCase==='function')window.editCaseForm=function(id,returnToDetail){var result=originalEditCase.apply(this,arguments);window.setTimeout(function(){var record=(stateData().cases||[]).find(function(item){return String(item.id)===String(id);});upgradeCaseForm($('wctCaseEditorForm'),record||{});},35);return result;};

  var notifications=[],notificationFilter='all',notificationChannel=null,notificationUserId=null,notificationLoading=false;
  var bellMarkup='<button type="button" id="wctNotificationBell" data-wct-notification-bell class="wct-notification-bell" aria-label="Buka Notification Center" aria-expanded="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg><span id="wctNotificationCount" class="wct-notification-count">0</span></button><div id="wctNotificationPopover" class="wct-notification-popover" hidden></div>';
  function notificationIcon(kind){return ({case_created:'C',case_updated:'C',action_assigned:'A',action_updated:'A',progress_updated:'↗',meeting_created:'M',meeting_updated:'M'})[kind]||'•';}
  function relativeTime(value){
    if(!value)return 'Baru saja';var date=new Date(value),diff=Math.max(0,Date.now()-date.getTime()),minutes=Math.floor(diff/60000);
    if(minutes<1)return 'Baru saja';if(minutes<60)return minutes+' menit lalu';var hours=Math.floor(minutes/60);if(hours<24)return hours+' jam lalu';
    var days=Math.floor(hours/24);if(days<7)return days+' hari lalu';return date.toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'});
  }
  function unreadCount(){return notifications.filter(function(item){return !item.read_at;}).length;}
  function renderNotificationItems(items,compact){
    if(!items.length)return '<div class="wct-notification-empty">Belum ada notifikasi.</div>';
    return items.map(function(item){var unread=!item.read_at;return '<div class="wct-notification-row '+(unread?'is-unread':'')+'" data-wct-notification-open="'+esc(item.id)+'" role="button" tabindex="0"><span class="wct-notification-symbol">'+notificationIcon(item.kind)+'</span><div class="wct-notification-copy"><strong>'+esc(item.title)+'</strong><p>'+esc(item.body||'')+'</p><small>'+relativeTime(item.created_at)+'</small></div><span class="wct-notification-unread-dot" '+(unread?'':'style="visibility:hidden"')+'></span>'+(compact?'':'<button type="button" class="wct-notification-open" data-wct-notification-open="'+esc(item.id)+'">Buka</button>')+'</div>';}).join('');
  }
  function updateBell(){
    var count=unreadCount(),badge=$('wctNotificationCount'),nav=$('wctNotificationNavCount');
    if(badge){badge.textContent=count>99?'99+':String(count);badge.classList.toggle('has-unread',count>0);}
    if(nav){nav.textContent=count>99?'99+':String(count);nav.hidden=count===0;}
  }
  function renderPopover(){
    var pop=$('wctNotificationPopover');if(!pop)return;var unread=unreadCount();
    pop.innerHTML='<div class="wct-notification-popover-head"><div><b>Notification Center</b><small>'+unread+' belum dibaca</small></div><button type="button" data-wct-notification-page-open>Lihat semua</button></div>'+renderNotificationItems(notifications.slice(0,6),true);
    updateBell();
  }
  async function loadNotifications(){
    var client=db(),user=current();if(!client||!user.id||notificationLoading)return;notificationLoading=true;
    try{var result=await client.from('wct_notifications').select('*').eq('user_id',user.id).order('created_at',{ascending:false}).limit(100);if(result.error)throw result.error;notifications=result.data||[];renderPopover();if(window.wctOperationalRoute==='notifications')renderNotificationPage();}
    catch(error){console.warn('Notification Center load failed:',error);}finally{notificationLoading=false;}
  }
  async function markNotificationRead(id){
    var client=db(),user=current();if(!client||!user.id)return;
    var item=notifications.find(function(row){return String(row.id)===String(id);});if(!item||item.read_at)return;
    var stamp=new Date().toISOString(),result=await client.from('wct_notifications').update({read_at:stamp}).eq('id',id).eq('user_id',user.id);
    if(result.error){console.warn('Mark notification read failed:',result.error);return;}
    item.read_at=stamp;renderPopover();if(window.wctOperationalRoute==='notifications')renderNotificationPage();
  }
  async function markAllRead(){
    var client=db(),user=current();if(!client||!user.id)return;
    var stamp=new Date().toISOString(),result=await client.from('wct_notifications').update({read_at:stamp}).eq('user_id',user.id).is('read_at',null);
    if(result.error){if(window.toast)window.toast('Gagal menandai notifikasi: '+(result.error.message||result.error));return;}
    notifications.forEach(function(row){if(!row.read_at)row.read_at=stamp;});renderPopover();if(window.wctOperationalRoute==='notifications')renderNotificationPage();
  }
  function setNotificationNavActive(){
    document.querySelectorAll('.sidebar .nav button,.sidebar .nav a').forEach(function(button){button.classList.toggle('active',button.id==='wctNotificationNav');});
  }
  function renderNotificationPage(){
    var root=$('pageContent');if(!root)return;var unread=unreadCount(),items=notificationFilter==='unread'?notifications.filter(function(item){return !item.read_at;}):notifications;
    var intro='<div class="page-head"><div><div class="eyebrow">WORKSPACE / INBOX</div><h1>Notification Center</h1><p>Notifikasi Case, penugasan Action, update progres, dan Weekly Meeting.</p></div></div>';
    var toolbar='<div class="wct-notification-page-toolbar"><div><button type="button" class="wct-notification-tab '+(notificationFilter==='all'?'active':'')+'" data-wct-notification-filter="all">Semua ('+notifications.length+')</button><button type="button" class="wct-notification-tab '+(notificationFilter==='unread'?'active':'')+'" data-wct-notification-filter="unread">Belum dibaca ('+unread+')</button></div><div class="wct-notification-page-actions"><button type="button" data-wct-notification-mark-all '+(unread?'':'disabled')+'>Tandai semua dibaca</button></div></div>';
    root.innerHTML=intro+'<div class="wct-notification-page">'+toolbar+'<section class="wct-notification-page-card">'+renderNotificationItems(items,false)+'</section></div>';setNotificationNavActive();
  }
  function openNotificationPage(){
    window.wctOperationalRoute='notifications';var pop=$('wctNotificationPopover'),bell=$('wctNotificationBell');
    if(pop)pop.hidden=true;if(bell){bell.classList.remove('is-open');bell.setAttribute('aria-expanded','false');}
    var crumb=$('crumb');if(crumb)crumb.textContent='Notification Center';renderNotificationPage();
  }
  async function openNotification(id){
    var item=notifications.find(function(row){return String(row.id)===String(id);});if(!item)return;await markNotificationRead(id);
    if(item.case_id&&typeof window.openCaseDetail==='function'){window.openCaseDetail(item.case_id);return;}
    if(item.meeting_id&&typeof window.navigate==='function'){window.wctOperationalRoute=null;window.navigate('meeting');return;}
    openNotificationPage();
  }
  function addNotificationNav(){
    var nav=document.querySelector('.sidebar .nav');if(!nav||$('wctNotificationNav'))return;
    var dash=Array.from(nav.querySelectorAll('button')).find(function(item){return /dashboard/i.test(item.textContent||'');});
    var button=document.createElement('button');button.type='button';button.id='wctNotificationNav';button.dataset.wctNotificationPage='true';button.className='wct-notification-nav-item';
    button.innerHTML='<span class="ico">♧</span><span>Notification Center</span><b id="wctNotificationNavCount" class="wct-notification-nav-count" hidden></b>';
    if(dash&&dash.parentNode===nav)dash.insertAdjacentElement('afterend',button);else nav.appendChild(button);
  }
  function ensureBell(){
    var actions=document.querySelector('.topbar .top-actions');if(!actions||$('wctNotificationBell'))return;
    var holder=document.createElement('div');holder.className='wct-notification-anchor';holder.innerHTML=bellMarkup;actions.insertBefore(holder,actions.firstChild);
  }
  function startRealtime(){
    var client=db(),user=current();if(!client||!user.id)return;if(notificationChannel&&notificationUserId===user.id)return;
    if(notificationChannel){client.removeChannel(notificationChannel);notificationChannel=null;}notificationUserId=user.id;
    notificationChannel=client.channel('wct-notifications-'+user.id).on('postgres_changes',{event:'*',schema:'public',table:'wct_notifications',filter:'user_id=eq.'+user.id},function(){void loadNotifications();}).subscribe();
  }
  function startNotifications(){
    var user=current();if(!user.id||!db())return;addNotificationNav();ensureBell();startRealtime();void loadNotifications();
  }
  function installNotificationUi(){
    addNotificationNav();ensureBell();var originalShow=window.showApp;
    if(typeof originalShow==='function'&&!originalShow.__wctNotificationsWrapped){
      var wrapped=function(){var result=originalShow.apply(this,arguments);startNotifications();return result;};wrapped.__wctNotificationsWrapped=true;window.showApp=wrapped;
    }
    if(current().id)startNotifications();
  }
  window.wctNotifications={start:startNotifications,refresh:loadNotifications,markAllRead:markAllRead,openPage:openNotificationPage};

  var productivityFilter={hubs:[],divisions:[]};
  function caseHubs(record){return listFor(record,'hub_codes','hub_code').map(function(value){return String(value).toUpperCase();});}
  function caseDivisions(record){return listFor(record,'divisions','division').map(String);}
  function matchesSelection(values,selected){return !selected.length||selected.some(function(value){return values.indexOf(value)>=0;});}
  function productivityRecords(){
    var data=stateData(),cases=data.cases||[],actions=data.actions||[],logs=data.logs||[];
    var filtered=cases.filter(function(record){return matchesSelection(caseHubs(record),productivityFilter.hubs)&&matchesSelection(caseDivisions(record),productivityFilter.divisions);});
    var ids=filtered.map(function(record){return String(record.id);});
    return {cases:filtered,actions:actions.filter(function(action){return ids.indexOf(String(action.case_id))>=0;}),logs:logs.filter(function(log){return ids.indexOf(String(log.case_id))>=0;})};
  }
  function filterMarkup(label,key,options,selected,isOpen){
    var count=selected.length,summary=label+(count?' · '+count+' dipilih':' · Semua');
    var html='<details class="wct-prod-filter" '+(isOpen?'open':'')+'><summary>'+esc(summary)+' ▾</summary><div class="wct-prod-filter-menu"><label class="wct-prod-filter-option"><input type="checkbox" data-wct-prod-filter="'+key+'" data-value="__all__" '+(!count?'checked':'')+'>Semua '+label+'</label>';
    html+=options.map(function(value){return '<label class="wct-prod-filter-option"><input type="checkbox" data-wct-prod-filter="'+key+'" data-value="'+esc(value)+'" '+(selected.indexOf(value)>=0?'checked':'')+'> '+esc(value)+'</label>';}).join('');
    return html+'</div></details>';
  }
  function renderProductivity(){
    var host=$('wct-productivity-dashboard');if(!host)return;
    var openMenu=host.querySelector('.wct-prod-filter[open]'),openKey=openMenu&&openMenu.querySelector('[data-wct-prod-filter]')?openMenu.querySelector('[data-wct-prod-filter]').dataset.wctProdFilter:'';
    var opts=optionData(),data=productivityRecords(),actions=data.actions,logs=data.logs;
    var today=new Date();today.setHours(0,0,0,0);var iso=function(date){return date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0')+'-'+String(date.getDate()).padStart(2,'0');},todayKey=iso(today);
    var done=actions.filter(function(a){return a.status==='done'||Number(a.progress)>=100;});
    var running=actions.filter(function(a){return a.status==='in_progress'||a.status==='review';});
    var overdue=actions.filter(function(a){return a.status!=='done'&&a.due_date&&String(a.due_date).slice(0,10)<todayKey;});
    var avg=actions.length?Math.round(actions.reduce(function(sum,a){return sum+(a.status==='done'?100:Math.max(0,Math.min(100,Number(a.progress)||0)));},0)/actions.length):0;
    var kpis=[['Total Action',actions.length,'Seluruh Action PICAPA',''],['Completed',done.length,'Action selesai',''],['On Progress',running.length,'Sedang dikerjakan',''],['Overdue',overdue.length,'Melewati target',''],['Avg. Progress',avg+'%','Rata-rata progres','accent']];
    var kpiHtml=kpis.map(function(item,index){return '<div class="wct-prod-kpi '+(index===4?'is-accent':'')+'"><small>'+item[0]+'</small><strong>'+item[1]+'</strong><span>'+item[2]+'</span></div>';}).join('');
    var daily=[];for(var i=6;i>=0;i--){var date=new Date(today);date.setDate(today.getDate()-i);var key=iso(date),count=logs.filter(function(log){return String(log.created_at||'').slice(0,10)===key;}).length;daily.push({label:date.toLocaleDateString('id-ID',{weekday:'short'}),count:count});}
    var max=Math.max(1,...daily.map(function(item){return item.count;}));
    var chart=daily.map(function(item){var height=Math.max(3,Math.round(item.count/max*90));return '<div class="wct-prod-day"><div class="wct-prod-bar-track"><div class="wct-prod-bar" style="height:'+height+'%"></div></div><div><b>'+item.count+'</b><small>'+item.label+'</small></div></div>';}).join('');
    var people=(stateData().profiles||[]).filter(function(person){return person.active!==false&&person.deleted!==true;}).map(function(person){var mine=actions.filter(function(action){return String(action.assigned_to)===String(person.id);}),completed=mine.filter(function(action){return action.status==='done'||Number(action.progress)>=100;}).length;return {name:person.full_name||person.login_id||'PIC',count:mine.length,completed:completed};}).filter(function(person){return person.count>0;}).sort(function(a,b){return b.completed-a.completed||b.count-a.count;}).slice(0,5);
    var top=people.length?people.map(function(person,index){return '<div class="wct-prod-person"><span class="wct-prod-rank">'+(index+1)+'</span><div><strong>'+esc(person.name)+'</strong><small>'+person.count+' Action · '+person.completed+' selesai</small></div><em>'+Math.round(person.count?person.completed/person.count*100:0)+'%</em></div>';}).join(''):'<div class="wct-prod-empty">Belum ada penugasan PIC.</div>';
    host.innerHTML='<div class="wct-productivity-head"><div><div class="wct-productivity-kicker">PRODUCTIVITY OVERVIEW</div><h3>Dashboard Produktivitas</h3><p>Monitoring beban tindakan, penyelesaian, dan aktivitas PICAPA.</p></div><div class="wct-productivity-filters">'+filterMarkup('HUB','hubs',opts.hubs,productivityFilter.hubs,openKey==='hubs')+filterMarkup('Divisi','divisions',opts.divisions,productivityFilter.divisions,openKey==='divisions')+'</div></div><div class="wct-productivity-body"><div class="wct-prod-kpis">'+kpiHtml+'</div><div class="wct-prod-grid"><section class="wct-prod-panel"><div class="wct-prod-panel-head"><b>Aktivitas Progress Update</b><small>7 hari terakhir · '+logs.length+' update</small></div><div class="wct-prod-bars">'+chart+'</div></section><section class="wct-prod-panel"><div class="wct-prod-panel-head"><b>Top PIC · Completion Rate</b><small>'+people.length+' PIC aktif</small></div><div class="wct-prod-top-pic">'+top+'</div></section></div></div>';
  }
  function ensureProductivity(){
    var root=$('pageContent');if(!root)return;var kpis=root.querySelector('.wct-workspace-kpis');if(!kpis)return;
    var panel=$('wct-productivity-dashboard');if(!panel){panel=document.createElement('section');panel.id='wct-productivity-dashboard';panel.className='wct-productivity';kpis.insertAdjacentElement('afterend',panel);}renderProductivity();
  }
  function observeDashboard(){
    var root=$('pageContent');if(!root||root.dataset.wctProductivityObserver)return;root.dataset.wctProductivityObserver='1';
    var observer=new MutationObserver(function(){ensureProductivity();});observer.observe(root,{childList:true});ensureProductivity();
  }

  document.addEventListener('change',function(event){
    var target=event.target;if(target&&target.matches('[data-wct-prod-filter]')){
      var key=target.dataset.wctProdFilter,value=target.dataset.value;if(key!=='hubs'&&key!=='divisions')return;
      if(value==='__all__'){productivityFilter[key]=[];}else if(target.checked){if(productivityFilter[key].indexOf(value)<0)productivityFilter[key].push(value);}else{productivityFilter[key]=productivityFilter[key].filter(function(item){return item!==value;});}
      renderProductivity();return;
    }
  },true);
  document.addEventListener('click',function(event){
    var bell=event.target.closest&&event.target.closest('#wctNotificationBell');
    if(bell){var pop=$('wctNotificationPopover'),open=pop&&pop.hidden===false;if(pop)pop.hidden=open;bell.classList.toggle('is-open',!open);bell.setAttribute('aria-expanded',String(!open));if(!open)renderPopover();return;}
    var pageButton=event.target.closest&&event.target.closest('#wctNotificationNav,[data-wct-notification-page-open]');
    if(pageButton){event.preventDefault();event.stopImmediatePropagation();openNotificationPage();return;}
    var markAll=event.target.closest&&event.target.closest('[data-wct-notification-mark-all]');
    if(markAll){event.preventDefault();void markAllRead();return;}
    var filter=event.target.closest&&event.target.closest('[data-wct-notification-filter]');
    if(filter){notificationFilter=filter.dataset.wctNotificationFilter;renderNotificationPage();return;}
    var open=event.target.closest&&event.target.closest('[data-wct-notification-open]');
    if(open){event.preventDefault();void openNotification(open.dataset.wctNotificationOpen);return;}
    var pop=$('wctNotificationPopover'),bellNode=$('wctNotificationBell');
    if(pop&&!pop.hidden&&!event.target.closest('#wctNotificationPopover')&&!event.target.closest('#wctNotificationBell')){pop.hidden=true;if(bellNode){bellNode.classList.remove('is-open');bellNode.setAttribute('aria-expanded','false');}}
  },true);
  document.addEventListener('keydown',function(event){if(event.key==='Escape'){var pop=$('wctNotificationPopover'),bell=$('wctNotificationBell');if(pop)pop.hidden=true;if(bell){bell.classList.remove('is-open');bell.setAttribute('aria-expanded','false');}}var row=event.target.closest&&event.target.closest('[data-wct-notification-open]');if(row&&(event.key==='Enter'||event.key===' ')){event.preventDefault();void openNotification(row.dataset.wctNotificationOpen);}});
  function init(){
    installNotificationUi();observeDashboard();if(current().id)startNotifications();
  }
  window.wctOperationalRefresh=function(){startNotifications();ensureProductivity();};
  init();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
})();
`;
  const out = html.replace('</body>', '<style id="wct-operational-upgrades-style">' + css + '</style><script id="wct-operational-upgrades">' + runtime + '</script></body>');
  return out;
};