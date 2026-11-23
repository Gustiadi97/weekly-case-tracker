module.exports = function applyP3VisualRedesign(html) {
  if (!html || !html.includes('</body>')) {
    throw new Error('Could not find document body for P3 visual redesign.');
  }

  const css = String.raw`
:root{
  --wct-brand:#F28C18;
  --wct-brand-hover:#DD790B;
  --wct-brand-dark:#A95708;
  --wct-ink:#20242A;
  --wct-muted:#68717D;
  --wct-line:#E4E7EB;
  --wct-canvas:#F4F5F6;
  --wct-surface:#FFFFFF;
  --wct-shadow:0 8px 26px rgba(24,31,40,.055);
  --wct-radius:16px;
  --wct-sidebar:#191C21;
  --wct-sidebar-muted:#A1A8B1;
  --pink:#F28C18;
  --pink-dark:#DD790B;
  --orange:#F28C18;
  --secondary:#F28C18;
  --secondary-dark:#DD790B;
  --accent:#FFE0B8;
  --pink-soft:#FFF4E8;
  --main:#F4F5F6;
  --bg:#F4F5F6;
  --white:#FFFFFF;
  --ink:#20242A;
  --muted:#68717D;
  --line:#E4E7EB;
  --shadow:0 8px 26px rgba(24,31,40,.055);
}

html,body{background:var(--wct-canvas)!important;color:var(--wct-ink)!important}
body{
  font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif!important;
  font-size:14px!important;line-height:1.55!important;
  -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;
  overflow-x:hidden!important;
}
.app,.main,.content,#pageContent{
  min-width:0!important;background:var(--wct-canvas)!important;color:var(--wct-ink)!important;
}
::selection{background:rgba(242,140,24,.22);color:#171A1E}
button,a,input,select,textarea{-webkit-tap-highlight-color:transparent}
button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{
  outline:3px solid rgba(242,140,24,.32)!important;outline-offset:2px!important;
}

/* Main application frame */
.sidebar{
  width:252px!important;background:var(--wct-sidebar)!important;
  border-right:1px solid #282C32!important;
  box-shadow:5px 0 26px rgba(16,19,23,.09)!important;
  color:#F4F5F6!important;
}
.brand{
  min-height:82px!important;padding:19px 19px!important;
  border-bottom:1px solid rgba(255,255,255,.075)!important;
}
.brand strong{color:#FFFFFF!important;font-size:17px!important;font-weight:850!important;letter-spacing:-.035em!important}
.brand small{color:#AAB1BA!important;font-size:10px!important;letter-spacing:.035em!important}
.brand-mark{
  background:linear-gradient(145deg,#FFAA3C 0%,#F18412 100%)!important;
  color:#23170A!important;box-shadow:0 7px 18px rgba(242,140,24,.20)!important;
}
.nav{padding:16px 10px!important}
.nav-label{
  padding:13px 12px 7px!important;color:#7E8792!important;
  font-size:9px!important;letter-spacing:.15em!important;font-weight:900!important;
}
.nav button{
  display:flex!important;align-items:center!important;gap:0!important;
  min-height:43px!important;margin:3px 3px!important;width:calc(100% - 6px)!important;
  padding:9px 12px!important;border:1px solid transparent!important;border-radius:10px!important;
  background:transparent!important;color:#B9C0C9!important;
  font-size:12px!important;font-weight:700!important;text-align:left!important;
  transition:background .16s ease,color .16s ease,border-color .16s ease,transform .16s ease!important;
}
.nav button:hover{
  background:#262B32!important;color:#FFFFFF!important;border-color:#303740!important;
  transform:translateX(2px)!important;
}
.nav button.active{
  background:rgba(242,140,24,.14)!important;color:#FFB45F!important;
  border-color:rgba(242,140,24,.24)!important;
  box-shadow:inset 3px 0 0 #F28C18!important;font-weight:850!important;
}
.nav button.active .wct-nav-icon{color:#FFB45F!important}
.wct-nav-icon{color:#929BA6!important}
.user-chip,.sidebar .user-chip{
  border-top:1px solid rgba(255,255,255,.09)!important;color:#E6E9ED!important;
}
.sidebar .user-chip small,.sidebar .user-chip span{color:#AAB1BA!important}
.avatar{background:#343A43!important;color:#FFB45F!important;border:1px solid #454D57!important}

.topbar{
  position:sticky!important;top:0!important;z-index:100!important;
  min-height:68px!important;height:auto!important;
  padding:0 clamp(18px,2.5vw,34px)!important;
  background:rgba(255,255,255,.94)!important;
  border-bottom:1px solid var(--wct-line)!important;
  box-shadow:0 3px 14px rgba(24,31,40,.035)!important;
  backdrop-filter:blur(16px)!important;
}
.topbar .crumb{color:#7A838E!important;font-size:12px!important}
.topbar .crumb b{color:#242930!important;font-weight:800!important}
.topbar .pill,.topbar .status{font-size:10px!important}
.content{
  width:100%!important;max-width:1680px!important;box-sizing:border-box!important;
  padding:30px clamp(18px,2.6vw,42px) 58px!important;
}
.page-head{
  display:flex!important;align-items:flex-end!important;justify-content:space-between!important;
  gap:20px!important;margin:0 0 25px!important;
}
.page-head h1{
  margin:2px 0 6px!important;color:#1E2329!important;
  font-size:clamp(26px,2.25vw,33px)!important;line-height:1.16!important;
  font-weight:850!important;letter-spacing:-.045em!important;
}
.page-head p{max-width:780px!important;margin:0!important;color:#707985!important;font-size:13px!important;line-height:1.65!important}
.page-head .eyebrow,.eyebrow{
  color:#B8660D!important;font-size:10px!important;font-weight:900!important;
  letter-spacing:.15em!important;text-transform:uppercase!important;
}
.page-head .btn{min-height:42px!important;white-space:nowrap!important}

/* Surface system: clear separation without heavy gradients */
.card,.kpi-card,.stat-card,.metric-card,.wct-panel,
.wct-settings-card,.wct-settings-intro,.wct-settings-option-card{
  min-width:0!important;background:#FFFFFF!important;color:#252A30!important;
  border:1px solid #E2E6EA!important;border-radius:16px!important;
  box-shadow:var(--wct-shadow)!important;
}
.card{overflow:hidden!important}
.card-head,.wct-panel-head{
  display:flex!important;align-items:center!important;justify-content:space-between!important;
  gap:13px!important;padding:17px 20px 15px!important;
  background:#FFFFFF!important;border-bottom:1px solid #EDF0F2!important;
}
.card-head h3,.wct-panel-head h3{
  margin:0!important;color:#242A31!important;font-size:14px!important;
  font-weight:850!important;line-height:1.4!important;letter-spacing:-.015em!important;
}
.card-head p,.card-head .sub,.wct-panel-head p,.sub{
  margin:4px 0 0!important;color:#79828D!important;font-size:11px!important;line-height:1.55!important;
}
.card-body,.wct-panel-body{min-width:0!important;padding:18px 20px 20px!important;background:#FFFFFF!important}
.grid,.dashboard-grid,.wct-workspace-grid,.wct-analytics-grid{gap:16px!important;min-width:0!important}
.wct-workspace-grid{margin-bottom:17px!important}
.wct-workspace-grid.three{gap:16px!important}
.wct-panel{overflow:hidden!important;box-shadow:0 7px 22px rgba(24,31,40,.045)!important}
.wct-panel-head{padding:16px 19px 14px!important}
.wct-panel-body{padding:16px 19px 19px!important}
.wct-panel-action{color:#B6650D!important;font-size:11px!important;font-weight:850!important}
.wct-panel-action:hover{color:#8E4A06!important;text-decoration:underline!important}

/* Dashboard: one clear KPI hierarchy, then analytical sections */
.wct-workspace-kpis,.wct-analytics-kpis{
  display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;
  gap:13px!important;margin:0 0 18px!important;
}
.wct-workspace-kpi{
  position:relative!important;display:flex!important;justify-content:space-between!important;
  align-items:flex-start!important;gap:12px!important;min-width:0!important;min-height:125px!important;
  padding:17px 18px!important;border:1px solid #E3E7EB!important;border-radius:15px!important;
  background:#FFFFFF!important;box-shadow:0 5px 17px rgba(24,31,40,.035)!important;
}
.wct-workspace-kpi:before{
  content:"";position:absolute;left:0;top:16px;bottom:16px;width:3px;
  border-radius:0 4px 4px 0;background:#F28C18!important;
}
.wct-workspace-kpi:first-child{
  background:#FFFFFF!important;border-color:#E3E7EB!important;box-shadow:0 5px 17px rgba(24,31,40,.035)!important;
}
.wct-workspace-kpi:nth-child(2):before{background:#339B75!important}
.wct-workspace-kpi:nth-child(3):before{background:#5684C5!important}
.wct-workspace-kpi:nth-child(4):before{background:#C68B36!important}
.wct-workspace-kpi-label{color:#727C88!important;font-size:11px!important;font-weight:800!important}
.wct-workspace-kpi-value{
  margin-top:12px!important;color:#20262D!important;font-size:33px!important;
  font-weight:900!important;line-height:1!important;letter-spacing:-.04em!important;
  font-variant-numeric:tabular-nums!important;
}
.wct-workspace-kpi-note{margin-top:8px!important;color:#8A939D!important;font-size:10px!important}
.wct-workspace-kpi-icon{
  display:grid!important;place-items:center!important;width:39px!important;height:39px!important;flex:0 0 39px!important;
  border:1px solid #F7D9B7!important;border-radius:11px!important;background:#FFF4E8!important;color:#C36B13!important;
}
.wct-workspace-kpi-icon svg{width:18px!important;height:18px!important}
.wct-workspace-kpi:first-child .wct-workspace-kpi-label,
.wct-workspace-kpi:first-child .wct-workspace-kpi-value,
.wct-workspace-kpi:first-child .wct-workspace-kpi-note{color:#20262D!important}
.wct-workspace-kpi:first-child .wct-workspace-kpi-icon{background:#FFF4E8!important;border-color:#F7D9B7!important;color:#C36B13!important}
.wct-welcome{
  display:flex!important;align-items:center!important;justify-content:space-between!important;gap:18px!important;
  margin:0 0 18px!important;padding:21px 23px!important;
  border:1px solid #F0D4B6!important;border-radius:17px!important;
  background:linear-gradient(110deg,#FFF8F0 0%,#FFF0DF 100%)!important;
  color:#242930!important;box-shadow:0 8px 22px rgba(24,31,40,.04)!important;
}
.wct-welcome h2{color:#242930!important;font-size:24px!important;letter-spacing:-.035em!important}
.wct-welcome p{color:#717A85!important;font-size:12px!important}
.wct-welcome .wct-mini-pill{background:#FFFFFF!important;border-color:#F0D9C3!important;color:#85500F!important}
.wct-mini-pill{
  display:inline-flex!important;align-items:center!important;gap:6px!important;
  padding:7px 10px!important;border:1px solid #E4E8EC!important;border-radius:999px!important;
  background:#F8F9FA!important;color:#69737E!important;font-size:10px!important;font-weight:800!important;
}
.wct-chart-legend{color:#747E89!important}
.wct-chart-label{fill:#7E8994!important}
.wct-chart-gridline{stroke:#E8EBEE!important}
.wct-reminder{border-color:#E9ECEF!important;background:#FAFBFC!important}
.wct-reminder strong{color:#272D34!important}
.wct-reminder small,.wct-reminder-date{color:#7D8792!important}
.wct-reminder-icon{background:#FFF2E3!important;color:#C16A0B!important}
.wct-reminder.is-overdue .wct-reminder-icon{background:#FCEBEC!important;color:#B83E48!important}
.wct-case-table{border-collapse:separate!important;border-spacing:0!important}
.wct-case-table th{
  padding:11px 12px!important;background:#F6F7F8!important;color:#727C87!important;
  border-bottom:1px solid #E6E9EC!important;font-size:10px!important;font-weight:900!important;letter-spacing:.07em!important;
}
.wct-case-table td{padding:13px 12px!important;color:#424A53!important;border-bottom:1px solid #EEF0F2!important;font-size:12px!important}
.wct-case-table tbody tr:hover td{background:#FFFAF4!important}
.wct-case-table .case-main strong{color:#252B32!important;font-size:12px!important;font-weight:850!important}
.wct-case-table .case-main small{color:#818B96!important;font-size:10px!important}
.wct-progress-bar{height:7px!important;border-radius:99px!important;background:#EAEDF0!important;overflow:hidden!important}
.wct-progress-bar span{border-radius:99px!important;background:linear-gradient(90deg,#F28C18,#F6B45F)!important}

/* Case Monitoring: strong toolbar, readable table, obvious actions */
.toolbar,.wct-case-toolbar,.wct-filterbar,.wct-kanban-toolbar{
  display:flex!important;align-items:center!important;flex-wrap:wrap!important;gap:10px!important;
  padding:13px!important;margin-bottom:16px!important;
  border:1px solid #E2E6EA!important;border-radius:14px!important;background:#FFFFFF!important;
  box-shadow:0 4px 15px rgba(24,31,40,.035)!important;
}
.wct-case-toolbar .search{flex:1 1 220px!important}
input:not([type=checkbox]):not([type=radio]),select,textarea{
  color:#252B32!important;background:#FFFFFF!important;border:1px solid #DCE1E6!important;
  border-radius:10px!important;box-shadow:none!important;font:inherit!important;
  transition:border-color .15s ease,box-shadow .15s ease,background .15s ease!important;
}
input:not([type=checkbox]):not([type=radio]),select{min-height:42px!important;padding:9px 12px!important}
textarea{min-height:105px!important;padding:11px 13px!important;line-height:1.6!important}
input::placeholder,textarea::placeholder{color:#9AA2AB!important}
input:focus,select:focus,textarea:focus{
  outline:0!important;border-color:#E89A3A!important;
  box-shadow:0 0 0 3px rgba(242,140,24,.12)!important;
}
label,.field label{display:block!important;color:#515B66!important;font-size:11px!important;font-weight:800!important;line-height:1.45!important}
.field{min-width:0!important}
.form-grid{gap:15px 16px!important}
.section-title,.wct-case-editor-section{
  color:#A65B0D!important;border-bottom-color:#ECEFF1!important;
  font-size:10px!important;font-weight:900!important;letter-spacing:.09em!important;
}
.table-wrap{
  max-width:100%!important;overflow-x:auto!important;overflow-y:auto!important;
  border:1px solid #E2E6EA!important;border-radius:14px!important;background:#FFFFFF!important;
  box-shadow:0 5px 18px rgba(24,31,40,.035)!important;-webkit-overflow-scrolling:touch!important;
}
.table{width:100%!important;border-collapse:separate!important;border-spacing:0!important;background:#FFFFFF!important}
.table thead th,.table th{
  position:sticky!important;top:0!important;z-index:2!important;
  padding:13px 14px!important;background:#F6F7F8!important;color:#68727E!important;
  border-bottom:1px solid #E5E8EB!important;font-size:10px!important;font-weight:900!important;
  letter-spacing:.06em!important;text-transform:uppercase!important;white-space:nowrap!important;
}
.table tbody td,.table td{
  padding:13px 14px!important;background:#FFFFFF!important;color:#434B55!important;
  border-bottom:1px solid #EEF0F2!important;font-size:12px!important;line-height:1.5!important;vertical-align:middle!important;
}
.table tbody tr:nth-child(even) td{background:#FCFCFD!important}
.table tbody tr:hover td{background:#FFF8F0!important}
.table tbody tr:last-child td{border-bottom:0!important}
.table .case-title,.case-title{color:#262C33!important;font-weight:850!important;line-height:1.45!important}
.wct-case-toolbar .filter-reset,.filter-reset{background:#FFF3E6!important;color:#A85A0A!important;border-color:#F1D1B0!important}
.wct-cases-table{background:transparent!important}
.wct-cases-table tbody tr:hover td{background:#FFF8F0!important}
.wct-case-toolbar input,.wct-case-toolbar select{min-height:42px!important}
.wct-filter-chip{
  min-height:36px!important;padding:7px 12px!important;border:1px solid #E0E4E8!important;
  border-radius:999px!important;background:#FFFFFF!important;color:#606A75!important;
  font-size:10px!important;font-weight:800!important;
}
.wct-filter-chip:hover{border-color:#E8B77F!important;background:#FFF9F2!important;color:#9B570E!important}
.wct-filter-chip.active{border-color:#F1C18D!important;background:#FFF2E3!important;color:#A95B0A!important}

/* Buttons and micro-interactions */
.btn{
  display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:7px!important;
  min-height:39px!important;padding:9px 14px!important;border:1px solid #DCE1E6!important;
  border-radius:10px!important;background:#FFFFFF!important;color:#444D57!important;
  font-size:11px!important;font-weight:800!important;line-height:1.2!important;
  box-shadow:0 2px 6px rgba(24,31,40,.035)!important;
  transition:transform .15s ease,border-color .15s ease,background .15s ease,color .15s ease,box-shadow .15s ease!important;
}
.btn:hover{
  transform:translateY(-1px)!important;border-color:#E7B77F!important;
  background:#FFFAF4!important;color:#9A5409!important;box-shadow:0 5px 12px rgba(24,31,40,.07)!important;
}
.btn:active{transform:translateY(0) scale(.99)!important}
.btn:disabled,button:disabled{opacity:.52!important;cursor:not-allowed!important;transform:none!important}
.btn-primary,.wct-settings-button.is-primary{
  background:#F28C18!important;border-color:#E17E0F!important;color:#21170D!important;
  font-weight:900!important;box-shadow:0 5px 13px rgba(224,126,15,.19)!important;
}
.btn-primary:hover,.wct-settings-button.is-primary:hover{
  background:#E37E0D!important;border-color:#D8780B!important;color:#1D160D!important;
}
.btn-orange{background:#FFF0DE!important;border-color:#F2D0AC!important;color:#9E550A!important}
.btn-sm{min-height:33px!important;padding:7px 10px!important;font-size:10px!important}
.wct-panel-action,.wct-task-actions button,.wct-member-card-actions button{
  transition:background .15s ease,border-color .15s ease,color .15s ease,transform .15s ease!important;
}

/* Task board: quiet columns, cards with status markers */
.wct-task-drag-hint{
  margin:-4px 0 14px!important;padding:10px 13px!important;
  border:1px solid #F0DDC6!important;border-radius:10px!important;
  background:#FFF8F0!important;color:#87510F!important;font-size:10px!important;line-height:1.55!important;
}
.wct-kanban{
  gap:13px!important;align-items:start!important;padding:0 0 8px!important;
}
.wct-kanban-col{
  min-width:0!important;padding:11px!important;border:1px solid #E2E6E9!important;
  border-radius:14px!important;background:#ECEFF1!important;
}
.wct-kanban-col.is-over{outline:2px dashed #E7A04C!important;background:#FFF2E4!important}
.wct-kanban-col-head{padding:3px 2px 9px!important;margin-bottom:9px!important}
.wct-kanban-col-head strong{color:#353D46!important;font-size:11px!important;font-weight:900!important}
.wct-kanban-count{min-width:25px!important;height:25px!important;border-radius:8px!important;background:#FFFFFF!important;color:#5E6873!important}
.wct-kanban-cards{gap:9px!important}
.wct-task-card{
  padding:13px!important;border:1px solid #DEE3E7!important;border-radius:12px!important;
  background:#FFFFFF!important;color:#28313A!important;box-shadow:0 3px 10px rgba(24,31,40,.04)!important;
}
.wct-task-card:hover{border-color:#E8B67D!important;box-shadow:0 8px 18px rgba(24,31,40,.08)!important}
.wct-task-card h4{color:#252C33!important;font-size:12px!important;line-height:1.5!important}
.wct-task-case{color:#737E89!important;font-size:10px!important}
.wct-task-type{border-radius:6px!important;background:#FFF1E1!important;color:#A65B0D!important;font-size:9px!important}
.wct-task-type.pa{background:#F0EDF8!important;color:#6B5799!important}
.wct-task-actions button,.wct-member-card-actions button{
  min-height:34px!important;border:1px solid #E0E4E8!important;border-radius:8px!important;
  background:#FFFFFF!important;color:#5C6671!important;font-size:10px!important;font-weight:800!important;
}
.wct-task-actions button.primary,.wct-member-card-actions button.primary{
  border-color:#E17E0F!important;background:#F28C18!important;color:#23180D!important;
}
.wct-task-actions button:hover,.wct-member-card-actions button:hover{border-color:#E6B47B!important;background:#FFF7ED!important;color:#99530B!important}

/* Team directory: simple profile tiles and clearer work metrics */
.wct-member-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:14px!important}
.wct-member-card{
  padding:17px!important;border:1px solid #E2E6EA!important;border-radius:15px!important;
  background:#FFFFFF!important;box-shadow:0 5px 17px rgba(24,31,40,.04)!important;
}
.wct-member-card-top{gap:12px!important}
.wct-member-card .wct-avatar{
  width:44px!important;height:44px!important;flex:0 0 44px!important;
  border:1px solid #F1D6B8!important;border-radius:13px!important;
  background:#FFF2E3!important;color:#B5630E!important;font-weight:900!important;
}
.wct-member-card h3{color:#252C33!important;font-size:13px!important;font-weight:850!important}
.wct-member-card p{color:#77818C!important;font-size:10px!important}
.wct-member-stat{padding:11px!important;border-radius:10px!important;background:#F6F7F8!important}
.wct-member-stat strong{color:#252C33!important;font-size:20px!important}
.wct-member-stat small{color:#7D8792!important;font-size:10px!important}
.wct-member-card .wct-progress-bar{height:7px!important;background:#E9ECEF!important}
.wct-member-card .wct-progress-bar span{background:linear-gradient(90deg,#F28C18,#F6B45F)!important}

/* Calendar and analytics: align all data surfaces to one visual language */
.wct-calendar-layout{gap:16px!important}
.wct-calendar{padding:14px!important;background:#FFFFFF!important}
.wct-calendar-top{border-bottom:1px solid #ECEFF1!important}
.wct-calendar-month strong,.wct-calendar-top strong{color:#252C33!important}
.wct-calendar-month small,.wct-calendar-weekday{color:#818B96!important}
.wct-calendar-top button[data-wct-calendar-move]{
  border-color:#E0E4E8!important;border-radius:9px!important;background:#FFFFFF!important;color:#505B66!important;
}
.wct-calendar-top button[data-wct-calendar-move]:hover{border-color:#E6B47B!important;background:#FFF7ED!important;color:#9E570C!important}
.wct-calendar-top button[data-wct-calendar-today]{border-color:#F1D1B0!important;background:#FFF4E8!important;color:#A65B0D!important}
.wct-calendar-day{
  border-color:#E8EBEE!important;border-radius:10px!important;
  background:#FFFFFF!important;color:#424B55!important;
}
.wct-calendar-day:hover{border-color:#E7B47B!important;background:#FFF9F2!important}
.wct-calendar-day.outside{background:#F8F9FA!important;color:#A8AFB7!important}
.wct-calendar-day.today{border-color:#E9B77C!important;background:#FFF7EE!important}
.wct-calendar-day.today strong{background:#FFE8CE!important;color:#A45A0C!important}
.wct-calendar-day.selected{border-color:#E38A25!important;background:#FFF0DE!important;box-shadow:0 0 0 2px rgba(242,140,24,.10)!important}
.wct-calendar-day.selected strong{background:#F28C18!important;color:#261A0D!important}
.wct-calendar-dots i{background:#F28C18!important}
.wct-calendar-dots i.action{background:#8470B1!important}
.wct-calendar-dots i.meeting{background:#4E9A7D!important}
.wct-calendar-event{
  border-color:#E7EBEE!important;border-radius:10px!important;background:#FFFFFF!important;
}
.wct-calendar-event strong{color:#303840!important}
.wct-calendar-event small{color:#7D8792!important}
.wct-calendar-event .wct-panel-action{background:#FFF3E6!important;color:#A65B0D!important}
.wct-analytics-kpi{
  padding:15px!important;border:1px solid #E3E7EA!important;border-radius:13px!important;background:#FFFFFF!important;
}
.wct-analytics-kpi small{color:#747E89!important;font-size:10px!important}
.wct-analytics-kpi strong{color:#252C33!important;font-size:25px!important}
.wct-analytics-kpi span{color:#88919B!important;font-size:10px!important}

/* Case detail and PICAPA: light work surface, distinct CA and PA grouping */
.wct-case-detail-hero,.wct-glass-hero{
  border:1px solid #F0D4B6!important;border-radius:18px!important;
  background:linear-gradient(110deg,#FFF8F0 0%,#FFF1E1 100%)!important;
  box-shadow:0 8px 22px rgba(24,31,40,.045)!important;
}
.wct-case-detail-hero h2,.wct-case-detail-title,.wct-glass-hero h2{color:#242A31!important}
.wct-case-detail-subtitle,.wct-glass-hero p{color:#6E7883!important}
.wct-case-detail-kicker,.wct-case-detail-tags .wct-case-tag{color:#A65B0D!important}
.wct-case-detail-tags .wct-case-tag,.wct-case-tag{
  border-color:#F0D8BD!important;background:#FFFFFF!important;color:#80511B!important;
}
.wct-case-detail-progress{box-shadow:0 6px 16px rgba(242,140,24,.17)!important}
.wct-case-detail-progress:before{background:#FFFFFF!important}
.wct-case-detail-progress-inner strong{color:#A65B0D!important}
.wct-case-meta-tile{
  border-color:#E6E9EC!important;border-radius:12px!important;background:#FFFFFF!important;
}
.wct-case-meta-tile span{color:#7B8590!important}
.wct-case-meta-tile strong{color:#252C33!important}
.wct-case-section{
  border:1px solid #E3E7EA!important;border-radius:14px!important;
  background:#FFFFFF!important;box-shadow:0 4px 15px rgba(24,31,40,.035)!important;
}
.wct-case-section-head{border-bottom-color:#ECEFF1!important;background:#FFFFFF!important}
.wct-case-section-head h3{color:#292F36!important}
.wct-case-section-head p{color:#77818C!important}
.wct-case-section-body{background:#FFFFFF!important;color:#414A54!important}
.wct-case-problem{
  border-color:#E6E9EC!important;border-radius:11px!important;background:#F7F8F9!important;color:#424B55!important;
}
.wct-case-action{
  border:1px solid #E3E7EA!important;border-radius:13px!important;
  background:#FFFFFF!important;box-shadow:0 4px 13px rgba(24,31,40,.035)!important;
}
.wct-case-action:hover{border-color:#E7B47B!important;box-shadow:0 8px 18px rgba(24,31,40,.07)!important}
.wct-case-action-type{color:#A65B0D!important}
.wct-case-action h4{color:#252C33!important}
.wct-case-action-desc{color:#69747F!important}
.wct-case-action-meta{border-top-color:#ECEFF1!important}
.wct-case-action-meta span{color:#7B8590!important}
.wct-case-action-meta strong{color:#37404A!important}
.wct-case-timeline-card{border-color:#E5E8EB!important;background:#F9FAFB!important}
.wct-case-timeline-title{color:#303840!important}
.wct-case-timeline-text{color:#535D68!important}
.wct-case-timeline-meta{color:#838D97!important}
.wct-case-empty{border-color:#DCE1E5!important;background:#F8F9FA!important}
.wct-case-empty b{color:#353D46!important}
.wct-case-empty span{color:#737E89!important}
.wct-case-action-group-corrective,.wct-case-action-group-preventive{
  background:#FFFFFF!important;border-color:#E2E6EA!important;border-radius:14px!important;
}
.wct-case-action-group-corrective .wct-case-section-head{border-left:3px solid #F28C18!important}
.wct-case-action-group-preventive .wct-case-section-head{border-left:3px solid #6F65A8!important}

/* Forms and settings: white, calm and predictable */
.modal-backdrop{background:rgba(18,22,27,.50)!important;backdrop-filter:blur(4px)!important}
.modal{
  background:#FFFFFF!important;color:#252B32!important;border:1px solid #E3E7EA!important;
  border-radius:18px!important;box-shadow:0 24px 70px rgba(20,25,30,.22)!important;
}
.modal-head{
  background:#FFFFFF!important;border-bottom:1px solid #ECEFF1!important;
}
.modal-head h2{color:#242A31!important}
.modal-head p,.modal-head .sub{color:#737D88!important}
.modal-head .close{background:#F4F5F6!important;color:#535D68!important}
.modal-body{background:#FFFFFF!important;color:#3E4751!important}
.modal-body p,.modal-body small{color:#737D88!important}
.modal-foot{background:#FFFFFF!important;border-top:1px solid #ECEFF1!important}
.modal .section-title,.modal .wct-case-editor-section{color:#A65B0D!important;border-bottom-color:#ECEFF1!important}
.modal .field label,.modal label{color:#515B66!important}
.modal input:not([type=checkbox]):not([type=radio]),.modal select,.modal textarea{
  background:#FFFFFF!important;color:#252B32!important;border-color:#DCE1E6!important;
}
.wct-flow-form-card,.wct-flow-form-top,.wct-flow-form-body{
  border-color:#E3E7EA!important;background:#FFFFFF!important;color:#333C45!important;
}
.wct-flow-form-top h2{color:#242A31!important}
.wct-flow-form-top p{color:#737D88!important}
.wct-flow-form-footer{
  border-color:#E5E8EB!important;background:rgba(255,255,255,.97)!important;
  box-shadow:0 -6px 18px rgba(24,31,40,.07)!important;
}
.wct-flow-context,.wct-flow-help,.wct-progress-range-wrap{
  border-color:#F0D9C0!important;background:#FFF8F0!important;color:#69737E!important;
}
.wct-flow-context-main strong,.wct-flow-help strong{color:#805019!important}
.wct-flow-context-main small{color:#747E89!important}
.wct-flow-context-stat,.wct-progress-range-value{color:#A65B0D!important}
.wct-progress-range-value{background:#FFE8CE!important}
.wct-settings-intro,.wct-settings-card,.wct-settings-option-card{
  border-color:#E2E6EA!important;background:#FFFFFF!important;box-shadow:0 5px 17px rgba(24,31,40,.035)!important;
}
.wct-settings-card-header{background:#F8F9FA!important;border-bottom-color:#ECEFF1!important}
.wct-settings-card-header h2,.wct-setting-option-name,.wct-setting-item-name,
.wct-setting-list-heading strong,.wct-settings-list-label strong{color:#293038!important}
.wct-settings-card-header p,.wct-settings-intro p,.wct-settings-list-label span{color:#77818C!important}
.wct-settings-eyebrow,.wct-settings-card-kicker{color:#B6650D!important}
.wct-setting-option-row,.wct-setting-item{border-color:#E5E8EB!important;background:#FFFFFF!important}
.wct-setting-option-row:hover{border-color:#E7B47B!important;background:#FFFAF4!important}
.wct-settings-note{border-color:#F0DCC5!important;background:#FFF8F0!important;color:#6C7680!important}
.wct-settings-note strong{color:#8F520F!important}

/* Authentication screens */
.login-screen{
  background:radial-gradient(circle at 10% 8%,rgba(242,140,24,.12),transparent 33%),
             radial-gradient(circle at 90% 88%,rgba(242,140,24,.08),transparent 34%),#F4F5F6!important;
}
.login-card{
  border:1px solid #E3E7EA!important;border-radius:20px!important;
  background:#FFFFFF!important;box-shadow:0 24px 64px rgba(24,31,40,.12)!important;
}
.login-card h1{color:#22282E!important}
.login-card>p{color:#737D88!important}
.login-card .brand strong{color:#242A31!important}
.login-card .brand small{color:#78828D!important}
.login-card .login-note{background:#FFF7EE!important;border-color:#F0D8BF!important;color:#855116!important}
.login-card input:not([type=checkbox]):not([type=radio]){
  border-color:#DCE1E6!important;background:#FFFFFF!important;color:#252B32!important;
}
.login-card input:focus{border-color:#E89A3A!important;box-shadow:0 0 0 3px rgba(242,140,24,.12)!important}
.login-card .login-actions .btn-primary{
  background:#F28C18!important;border-color:#E17E0F!important;color:#21170D!important;
  box-shadow:0 6px 17px rgba(224,126,15,.19)!important;
}

/* Notifications, feedback and empty states */
.wct-form-error{border-radius:11px!important;line-height:1.55!important}
.wct-settings-feedback{border-radius:11px!important;line-height:1.55!important}
.empty,.wct-empty,.wct-calendar-empty{color:#737D88!important}
.toast,.toast-message{border-radius:12px!important;line-height:1.5!important}
.wct-notification-panel,.wct-notification-center{
  border:1px solid #E2E6EA!important;border-radius:15px!important;
  background:#FFFFFF!important;color:#252B32!important;box-shadow:0 18px 50px rgba(24,31,40,.14)!important;
}
.wct-notification-panel h3,.wct-notification-center h3{color:#252B32!important}
.wct-notification-panel p,.wct-notification-center p{color:#68727D!important}

/* Case Monitoring filters: compact responsive control row */
#pageContent .toolbar:has(select),
#pageContent .wct-case-toolbar:has(select),
#pageContent .filterbar:has(select),
#pageContent .filters:has(select){
  display:grid!important;
  grid-template-columns:minmax(210px,1.55fr) repeat(4,minmax(135px,1fr)) auto!important;
  align-items:center!important;gap:9px!important;
  padding:12px!important;margin:0 0 16px!important;
  background:#FFFFFF!important;border:1px solid #E2E6EA!important;
  border-radius:14px!important;box-shadow:0 4px 15px rgba(24,31,40,.035)!important;
}
#pageContent .toolbar:has(select)>input[type=search],
#pageContent .toolbar:has(select)>.search,
#pageContent .wct-case-toolbar:has(select)>input[type=search],
#pageContent .wct-case-toolbar:has(select)>.search{
  grid-column:auto!important;min-width:0!important;width:100%!important;
}
#pageContent .toolbar:has(select)>select,
#pageContent .wct-case-toolbar:has(select)>select,
#pageContent .filterbar:has(select)>select,
#pageContent .filters:has(select)>select{
  display:block!important;width:100%!important;min-width:0!important;max-width:100%!important;
  min-height:42px!important;padding:9px 34px 9px 12px!important;
  border:1px solid #DCE1E6!important;border-radius:10px!important;
  background-color:#FFFFFF!important;background-image:none!important;
  color:#39434E!important;font-size:11px!important;font-weight:650!important;
  box-shadow:none!important;
}
#pageContent .toolbar:has(select)>select:focus,
#pageContent .wct-case-toolbar:has(select)>select:focus,
#pageContent .filterbar:has(select)>select:focus,
#pageContent .filters:has(select)>select:focus{
  border-color:#E89A3A!important;box-shadow:0 0 0 3px rgba(242,140,24,.12)!important;
}
#pageContent .toolbar:has(select)>select option,
#pageContent .wct-case-toolbar:has(select)>select option,
#pageContent .filterbar:has(select)>select option,
#pageContent .filters:has(select)>select option{
  background:#FFFFFF!important;color:#29313A!important;
}
#pageContent .toolbar:has(select)>.btn,
#pageContent .toolbar:has(select)>button,
#pageContent .wct-case-toolbar:has(select)>.btn,
#pageContent .wct-case-toolbar:has(select)>button{
  min-height:40px!important;padding:8px 12px!important;white-space:nowrap!important;
  justify-self:stretch!important;
}
#pageContent .toolbar input[type=search],
#pageContent .wct-case-toolbar input[type=search],
#pageContent .filterbar input[type=search],
#pageContent .filters input[type=search]{
  min-width:0!important;width:100%!important;min-height:42px!important;
  background:#FFFFFF!important;color:#29313A!important;border-color:#DCE1E6!important;
}
#pageContent .toolbar:has(select) label,
#pageContent .wct-case-toolbar:has(select) label{
  color:#535E69!important;
}
#pageContent .wct-chart-svg rect[fill="#2864C7"]{fill:#F28C18!important}
#pageContent .wct-chart-svg rect[fill="#9BBBE8"]{fill:#F8BD78!important}
#pageContent .wct-chart-legend i[style*="#2864C7"]{background:#F28C18!important}
#pageContent .wct-chart-legend i[style*="#9BBBE8"]{background:#F8BD78!important}

/* Filter controls adapt at tablet and phone widths */
@media(max-width:1100px){
 #pageContent .toolbar:has(select),
 #pageContent .wct-case-toolbar:has(select),
 #pageContent .filterbar:has(select),
 #pageContent .filters:has(select){
   grid-template-columns:repeat(3,minmax(0,1fr))!important;
 }
}
@media(max-width:850px){
 #pageContent .toolbar:has(select),
 #pageContent .wct-case-toolbar:has(select),
 #pageContent .filterbar:has(select),
 #pageContent .filters:has(select){
   grid-template-columns:repeat(2,minmax(0,1fr))!important;
 }
 #pageContent .toolbar:has(select)>input[type=search],
 #pageContent .toolbar:has(select)>.search,
 #pageContent .wct-case-toolbar:has(select)>input[type=search],
 #pageContent .wct-case-toolbar:has(select)>.search{
   grid-column:1/-1!important;
 }
}
@media(max-width:680px){
 #pageContent .toolbar:has(select),
 #pageContent .wct-case-toolbar:has(select),
 #pageContent .filterbar:has(select),
 #pageContent .filters:has(select){
   grid-template-columns:minmax(0,1fr)!important;
   padding:10px!important;gap:9px!important;
 }
 #pageContent .toolbar:has(select)>input[type=search],
 #pageContent .toolbar:has(select)>.search,
 #pageContent .wct-case-toolbar:has(select)>input[type=search],
 #pageContent .wct-case-toolbar:has(select)>.search{
   grid-column:1!important;
 }
 #pageContent .toolbar:has(select)>.btn,
 #pageContent .toolbar:has(select)>button,
 #pageContent .wct-case-toolbar:has(select)>.btn,
 #pageContent .wct-case-toolbar:has(select)>button{
   width:100%!important;justify-self:stretch!important;
 }
}

/* Responsive layout */
@media(max-width:1100px){
  .content{padding:25px 22px 46px!important}
  .wct-workspace-grid.three{grid-template-columns:minmax(0,1.1fr) minmax(220px,.9fr)!important}
  .wct-workspace-grid.three .wct-gauge-panel{grid-column:1/-1!important}
}
@media(max-width:850px){
  .wct-workspace-grid,.wct-workspace-grid.three,.wct-calendar-layout,.wct-analytics-grid{
    grid-template-columns:minmax(0,1fr)!important;
  }
  .wct-workspace-grid.three .wct-gauge-panel{grid-column:auto!important}
  .wct-workspace-kpis,.wct-analytics-kpis{grid-template-columns:repeat(2,minmax(0,1fr))!important}
}
@media(max-width:680px){
  .topbar{min-height:60px!important;height:60px!important;padding-inline:12px!important}
  .content{padding:18px 13px calc(32px + env(safe-area-inset-bottom))!important}
  .page-head{align-items:flex-start!important;flex-direction:column!important;gap:11px!important;margin-bottom:18px!important}
  .page-head h1{font-size:24px!important}
  .page-head p{font-size:12px!important}
  .page-head .btn,.page-head button{width:100%!important;min-height:43px!important}
  .card,.wct-panel{border-radius:14px!important}
  .card-head,.wct-panel-head{padding:14px 15px 12px!important}
  .card-body,.wct-panel-body{padding:14px 15px 16px!important}
  .wct-workspace-kpis,.wct-analytics-kpis{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:9px!important}
  .wct-workspace-kpi{min-height:104px!important;padding:12px 12px!important}
  .wct-workspace-kpi-value{font-size:27px!important}
  .wct-workspace-kpi-label{font-size:10px!important}
  .wct-workspace-kpi-icon{width:31px!important;height:31px!important;flex-basis:31px!important}
  .wct-welcome{align-items:flex-start!important;flex-direction:column!important;padding:16px!important}
  .wct-welcome h2{font-size:21px!important}
  .toolbar,.wct-case-toolbar,.wct-filterbar,.wct-kanban-toolbar{
    display:grid!important;grid-template-columns:minmax(0,1fr)!important;padding:10px!important;gap:9px!important;
  }
  .wct-case-toolbar .search{grid-column:auto!important}
  .wct-filterbar input,.wct-filterbar select,.wct-kanban-toolbar input{width:100%!important;min-width:0!important}
  .wct-filter-chip{justify-content:center!important}
  .wct-member-grid{grid-template-columns:minmax(0,1fr)!important}
  .wct-member-card{padding:14px!important}
  .wct-calendar-day{min-height:49px!important;padding:5px 4px!important}
  .wct-calendar-grid{gap:3px!important}
  .wct-calendar-main .wct-panel-body{padding:12px!important}
  .wct-calendar-agenda .wct-panel-body{grid-template-columns:minmax(0,1fr)!important}
  .wct-calendar-agenda-section+.wct-calendar-agenda-section{
    margin:13px 0 0!important;padding:13px 0 0!important;border-left:0!important;border-top:1px solid #ECEFF1!important;
  }
  .table-wrap{max-width:100%!important;overflow-x:auto!important}
  .table:not(.wct-cases-table){min-width:700px!important}
  .modal-backdrop{align-items:flex-end!important;justify-content:center!important;padding:0!important}
  .modal,.modal.wide{width:100%!important;max-width:100%!important;max-height:92dvh!important;margin:0!important;border-radius:18px 18px 0 0!important}
  .modal-head{padding:14px 15px!important}
  .modal-body{padding:14px 15px 20px!important}
  .modal-foot{padding:10px 15px calc(10px + env(safe-area-inset-bottom))!important}
}
@media(max-width:390px){
  .wct-workspace-kpi{gap:7px!important}
  .wct-workspace-kpi-icon{display:none!important}
  .wct-workspace-kpi-value{font-size:25px!important}
  .wct-calendar-day{min-height:44px!important}
}
@media(prefers-reduced-motion:reduce){
  *,*::before,*::after{
    scroll-behavior:auto!important;animation-duration:.01ms!important;
    animation-iteration-count:1!important;transition-duration:.01ms!important;
  }
}
`;

  return html.replace('</body>', '<style id="wct-p3-visual-redesign">' + css + '</style></body>');
};
