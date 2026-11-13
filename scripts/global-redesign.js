module.exports = function applyGlobalRedesign(html) {
  if (!html || !html.includes('</body>')) throw new Error('Could not find document body for global UI redesign.');
  const css = String.raw`
:root{--wct-brand:#FEA500;--wct-brand-hover:#E99400;--wct-brand-dark:#9A6200;--wct-brand-soft:#FFF2D8;--wct-brand-pale:#FFFAF0;--wct-ink:#292A30;--wct-muted:#746F66;--wct-line:#ECE4D8;--wct-canvas:#FFFBF5;--wct-surface:#fff;--wct-shadow:0 10px 28px rgba(60,42,12,.07);--pink:#FEA500;--pink-dark:#D98B00;--orange:#FEA500;--secondary:#FEA500;--secondary-dark:#D98B00;--accent:#FFE1A6;--pink-soft:#FFF3D9;--main:#FFFBF5;--bg:#FFFBF5;--ink:#292A30;--muted:#746F66;--line:#ECE4D8;--shadow:0 10px 28px rgba(60,42,12,.07);--radius:18px}
html{scroll-behavior:smooth;background:var(--wct-canvas)}
body{color:var(--wct-ink)!important;background:var(--wct-canvas)!important;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif!important;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;overflow-x:hidden}
.app,.main,.content,#pageContent{min-width:0}
.app,.main{background:var(--wct-canvas)!important;color:var(--wct-ink)!important}
::selection{background:rgba(254,165,0,.22);color:#2b271f}
button,a,input,select,textarea{-webkit-tap-highlight-color:transparent}
button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:3px solid rgba(254,165,0,.32)!important;outline-offset:2px!important}
.sidebar{background:#fff!important;border-right:1px solid var(--wct-line)!important;box-shadow:3px 0 22px rgba(49,38,16,.035)!important}
.brand{padding:23px 20px!important}
.brand strong{color:#292a30!important;font-weight:850!important;letter-spacing:-.035em!important}
.brand small{color:#81796d!important}
.brand-mark{background:linear-gradient(145deg,#FEA500 0%,#F7B83D 100%)!important;color:#2b271f!important;box-shadow:0 7px 16px rgba(254,165,0,.23)!important}
.nav-label{color:#a49a89!important;font-size:9px!important;letter-spacing:.14em!important;font-weight:900!important}
.nav button{min-height:42px!important;margin:3px 10px!important;width:calc(100% - 20px)!important;border-radius:12px!important;color:#625d55!important;font-size:12px!important;font-weight:700!important;transition:background .18s ease,color .18s ease,transform .18s ease,box-shadow .18s ease!important}
.nav button:hover{background:#fff6e6!important;color:#825300!important;transform:translateX(2px)}
.nav button.active{background:#FEA500!important;color:#29251d!important;font-weight:900!important;box-shadow:inset 3px 0 0 #8e5b00,0 5px 14px rgba(254,165,0,.17)!important}
.topbar{min-height:66px!important;background:rgba(255,255,255,.94)!important;border-bottom:1px solid var(--wct-line)!important;box-shadow:0 3px 16px rgba(49,38,16,.035)!important;backdrop-filter:blur(16px)!important}
.content{max-width:1660px!important;padding:28px clamp(16px,2.4vw,38px) 54px!important}
.page-head{align-items:center!important;gap:18px!important;margin-bottom:22px!important}
.page-head h1{color:var(--wct-ink)!important;font-size:clamp(23px,2.1vw,30px)!important;font-weight:850!important;letter-spacing:-.045em!important;line-height:1.15!important}
.page-head p{color:var(--wct-muted)!important;line-height:1.6!important}
.eyebrow,.section-title,.wct-case-editor-section{color:var(--wct-brand-dark)!important}
.eyebrow{letter-spacing:.13em!important;font-weight:900!important}
.card,.kpi-card,.stat-card,.metric-card{background:var(--wct-surface)!important;border:1px solid var(--wct-line)!important;border-radius:18px!important;box-shadow:var(--wct-shadow)!important}
.card{overflow:hidden}
.card-head{padding:18px 20px 15px!important;border-bottom:1px solid #f2ede4!important;background:#fffefc!important}
.card-head h3{color:#302f32!important;font-size:14px!important;font-weight:850!important}
.card-head p,.card-head .sub,.sub{color:#827b70!important;line-height:1.55!important}
.card-body{padding:18px 20px 20px!important}
.grid,.dashboard-grid{gap:16px!important;min-width:0}
.kpi-card,.stat-card,.metric-card{min-width:0!important;padding:17px 18px!important;transition:border-color .18s ease,box-shadow .18s ease,transform .18s ease!important}
.kpi-card:hover,.stat-card:hover,.metric-card:hover{border-color:#f2ce8d!important;box-shadow:0 12px 26px rgba(60,42,12,.09)!important;transform:translateY(-2px)}
.toolbar,.wct-case-toolbar{background:#fff!important;border:1px solid var(--wct-line)!important;border-radius:16px!important;box-shadow:0 5px 18px rgba(60,42,12,.045)!important;padding:13px!important;gap:10px!important}
input:not([type=checkbox]):not([type=radio]),select,textarea{color:#302f32!important;background:#fff!important;border:1px solid #e6ded1!important;border-radius:11px!important;box-shadow:none!important;font:inherit!important;transition:border-color .16s ease,box-shadow .16s ease,background .16s ease!important}
input:not([type=checkbox]):not([type=radio]),select{min-height:43px!important;padding:9px 12px!important}
textarea{min-height:104px;padding:12px!important;line-height:1.55!important}
input::placeholder,textarea::placeholder{color:#a49b8e!important}
input:focus,select:focus,textarea:focus{outline:none!important;border-color:#FEA500!important;box-shadow:0 0 0 3px rgba(254,165,0,.16)!important}
label,.field label{color:#5d584f!important;font-size:11px!important;font-weight:800!important}
.field{min-width:0!important}
.form-grid{gap:15px 16px!important}
.section-title{border-bottom-color:#f0e8db!important;font-size:11px!important;font-weight:900!important;letter-spacing:.05em!important}
.btn{min-height:39px!important;padding:9px 14px!important;border:1px solid #e5ddd0!important;border-radius:11px!important;background:#fff!important;color:#4e4a43!important;font-size:12px!important;font-weight:800!important;box-shadow:0 2px 7px rgba(49,38,16,.035)!important;transition:transform .16s ease,box-shadow .16s ease,background .16s ease,border-color .16s ease!important}
.btn:hover{border-color:#e8c47c!important;background:#fffcf6!important;box-shadow:0 6px 15px rgba(49,38,16,.08)!important;transform:translateY(-1px)}
.btn:disabled{opacity:.55!important;cursor:wait!important;transform:none!important}
.btn-primary,.wct-settings-button.is-primary{background:#FEA500!important;border-color:#FEA500!important;color:#29251d!important;font-weight:900!important;box-shadow:0 6px 15px rgba(254,165,0,.22)!important}
.btn-primary:hover,.wct-settings-button.is-primary:hover{background:#e99400!important;border-color:#e99400!important;color:#29251d!important}
.btn-orange{background:#fff0cf!important;border-color:#f4d99f!important;color:#785000!important}
.btn-sm{min-height:33px!important;padding:7px 10px!important;font-size:11px!important}
.table-wrap{max-width:100%!important;overflow-x:auto!important;overflow-y:auto!important;border-radius:0 0 17px 17px!important;-webkit-overflow-scrolling:touch!important}
.table{width:100%!important;border-collapse:separate!important;border-spacing:0!important}
.table thead th,.table th{position:sticky!important;top:0!important;z-index:2!important;padding:13px 14px!important;background:#fff8e9!important;color:#786b55!important;border-bottom:1px solid #ede3d3!important;font-size:10px!important;font-weight:900!important;letter-spacing:.075em!important;text-transform:uppercase!important;white-space:nowrap!important}
.table tbody td,.table td{padding:13px 14px!important;color:#4d4942!important;border-bottom:1px solid #f1ece3!important;font-size:12px!important;vertical-align:middle!important}
.table tbody tr:nth-child(even) td{background:#fffefc!important}
.table tbody tr:hover td{background:#fff8e9!important}
.case-title{color:#302f32!important;font-weight:850!important;line-height:1.45!important}
.filter-reset{background:#fff4de!important;color:#8a5900!important;border-color:#f2d9a5!important}
.empty{color:#877f73!important}
.progress-track,.wct-case-action-track,.wct-division-breakdown-track{background:#f1ece3!important;border-radius:999px!important;overflow:hidden!important}
.progress-track span,.wct-case-action-track span,.wct-division-breakdown-track span{background:linear-gradient(90deg,#FEA500 0%,#D98B00 100%)!important;border-radius:inherit!important}
.priority.high{background:#fff0f0!important;color:#ad3743!important}
.priority.medium{background:#fff6e5!important;color:#8a5a00!important}
.priority.low{background:#edf8ed!important;color:#347341!important}
.status,.pill{border-radius:999px!important;font-weight:850!important}
.login-screen{background:radial-gradient(circle at 12% 8%,rgba(254,165,0,.19),transparent 34%),radial-gradient(circle at 90% 88%,rgba(245,191,89,.18),transparent 32%),#fffbf5!important}
.login-card{border:1px solid #f0e5d4!important;border-radius:22px!important;background:#fff!important;box-shadow:0 24px 70px rgba(60,42,12,.12)!important}
.login-note{background:#fff5df!important;border:1px solid #f1d79f!important;color:#765000!important}
.wct-glass-hero{border:1px solid #f0ddb8!important;border-radius:20px!important;background:linear-gradient(112deg,#fffaf0 0%,#fff1d4 58%,#ffe6b1 100%)!important;box-shadow:0 10px 25px rgba(60,42,12,.055)!important}
.wct-glass-hero h2{color:#302b22!important}
.wct-glass-hero p{color:#756b5d!important}
.wct-case-detail-hero{border-color:#f0ddb8!important;border-radius:20px!important;background:linear-gradient(112deg,#fffaf0 0%,#fff2d8 60%,#ffe9bd 100%)!important;box-shadow:0 10px 25px rgba(60,42,12,.055)!important}
.wct-case-detail-hero:after{background:rgba(254,165,0,.18)!important}
.wct-case-detail-kicker{color:#986100!important}
.wct-case-detail-title{color:#2f2b25!important}
.wct-case-detail-subtitle{color:#756d62!important}
.wct-case-detail-progress{background:conic-gradient(#FEA500 var(--wct-progress),#efe7d9 0)!important;box-shadow:0 8px 22px rgba(254,165,0,.18)!important}
.wct-case-detail-progress:before{background:#fff!important}
.wct-case-detail-progress-inner strong{color:#7a4e00!important}
.wct-case-detail-tags .wct-case-tag,.wct-case-tag{border-color:#f0e2c7!important;background:rgba(255,255,255,.88)!important;color:#635640!important}
.wct-case-meta-tile{border-color:#eee5d6!important;border-radius:14px!important;background:#fff!important}
.wct-case-meta-tile span{color:#8b806f!important}
.wct-case-meta-tile strong{color:#34312c!important}
.wct-case-action{border-color:#ece4d8!important;border-radius:16px!important;background:linear-gradient(180deg,#fff 0%,#fffefb 100%)!important;box-shadow:0 5px 16px rgba(60,42,12,.035)!important}
.wct-case-action:hover{border-color:#e9c87e!important;box-shadow:0 10px 23px rgba(60,42,12,.075)!important}
.wct-case-action-type{color:#986100!important}
.wct-case-action-type i,.wct-case-timeline-dot,.wct-case-editor-intro-mark,.wct-flow-context-icon{background:#fff0cf!important;border-color:#f0d99f!important;color:#8b5900!important}
.wct-case-action h4,.wct-flow-context-main strong{color:#34312c!important}
.wct-case-action-track span{background:linear-gradient(90deg,#FEA500,#D98B00)!important}
.wct-case-action-meta{border-top-color:#f0e8dc!important}
.wct-case-timeline-card{border-color:#ece4d8!important;border-radius:14px!important}
.wct-case-timeline-dot{border:1px solid #f0d99f!important}
.wct-case-editor-section{border-bottom-color:#eee5d6!important}
.wct-case-editor-intro{border-color:#f0e2c7!important;background:linear-gradient(110deg,#fffcf6,#fff3dd)!important}
.wct-case-editor-intro strong{color:#3a3429!important}
.wct-flow-subnav a:hover{background:#fff3d9!important;color:#8a5900!important;border-color:#f0d99f!important}
.wct-flow-form-card{border-color:#ece4d8!important;border-radius:18px!important;box-shadow:0 8px 24px rgba(60,42,12,.055)!important}
.wct-flow-form-top h2{color:#302f32!important}
.wct-flow-form-top p{color:#7c756a!important}
.wct-flow-form-footer{border-color:#eee3d0!important;border-radius:14px!important;background:rgba(255,255,255,.97)!important;box-shadow:0 8px 22px rgba(60,42,12,.10)!important}
.wct-flow-context{border-color:#eee2ce!important;background:#fffaf0!important}
.wct-flow-context-stat{color:#986100!important}
.wct-flow-help{border-color:#eee2ce!important;background:#fffaf0!important}
.wct-flow-help strong{color:#8a5900!important}
.wct-progress-range-wrap{border-color:#eee2ce!important;background:#fffaf0!important}
.wct-progress-range-wrap input{accent-color:#FEA500!important}
.wct-progress-range-value{background:#fff0cf!important;color:#7c4e00!important}
.wct-dashboard-mini-progress b{color:#8a5900!important}
.wct-settings-intro,.wct-settings-card{border-color:#ece4d8!important;background:#fff!important;box-shadow:0 8px 24px rgba(60,42,12,.05)!important}
.wct-settings-intro-icon,.wct-settings-intro-mark,.wct-setting-empty-icon,.wct-settings-empty>span{background:#fff0cf!important;color:#8a5900!important}
.wct-settings-card-kicker,.wct-settings-eyebrow{color:#986100!important}
.wct-settings-count,.wct-settings-counter,.wct-setting-option-index,.wct-setting-number{background:#fff3d9!important;color:#805200!important}
.wct-setting-option-row,.wct-setting-item{border-color:#efe7dc!important;background:#fff!important}
.wct-setting-option-row:hover{border-color:#e9c87e!important;box-shadow:0 4px 13px rgba(60,42,12,.055)!important}
.wct-settings-button.is-primary{background:#FEA500!important;border-color:#FEA500!important;color:#29251d!important}
.wct-settings-note{background:#fffaf0!important;border-color:#efe4d2!important}
.wct-settings-note strong{color:#8a5900!important}
.wct-settings-master-grid,.wct-settings-lower,.wct-settings-grid{gap:16px!important}
.wct-settings-option-card,.wct-settings-card{border-radius:17px!important}
.wct-setting-add-form,.wct-settings-add{border-color:#efe5d4!important;border-radius:13px!important;background:#fffaf2!important}
.wct-setting-list-heading strong,.wct-settings-list-label strong,.wct-setting-option-name,.wct-setting-item-name{color:#514a3d!important}
.wct-setting-empty,.wct-settings-empty{background:#fffcf7!important;border-color:#e8dfd2!important}
.modal-backdrop{background:rgba(35,31,24,.48)!important;backdrop-filter:blur(4px)!important}
.modal{border:1px solid rgba(255,255,255,.82)!important;border-radius:20px!important;box-shadow:0 24px 80px rgba(30,25,16,.24)!important}
.modal-head{border-bottom-color:#eee7dc!important}
.modal-head h2{color:#2f2e2a!important}
.modal-head .close{background:#f7f3ec!important;color:#5a554c!important}
.modal-foot{border-top-color:#eee7dc!important;background:#fff!important}
@media(max-width:960px){
 .content{padding:22px 16px 42px!important}
 .wct-case-meta-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
 .wct-case-detail-hero{gap:14px!important}
 .wct-case-action-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
}
@media(max-width:680px){
 html,body{width:100%;max-width:100%;overflow-x:hidden!important}
 .sidebar{z-index:1200!important;max-width:min(86vw,300px)!important}
 .topbar{min-height:60px!important;height:60px!important;padding-inline:12px!important}
 .content{padding:17px 12px calc(30px + env(safe-area-inset-bottom))!important}
 .page-head{align-items:flex-start!important;flex-direction:column!important;gap:10px!important;margin-bottom:17px!important}
 .page-head h1{font-size:23px!important}
 .page-head .btn{width:100%!important;min-height:44px!important}
 .card{border-radius:15px!important}
 .card-head{padding:15px 15px 12px!important}
 .card-body{padding:14px 15px 16px!important}
 .grid{grid-template-columns:minmax(0,1fr)!important;gap:12px!important}
 .dashboard-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:11px!important}
 .kpi-card,.stat-card,.metric-card{padding:13px 12px!important;border-radius:14px!important}
 .kpi-card{min-height:104px}
 .toolbar,.wct-case-toolbar{grid-template-columns:minmax(0,1fr)!important;padding:10px!important;gap:9px!important}
 .wct-case-toolbar .search{grid-column:auto!important}
 .form-grid{grid-template-columns:minmax(0,1fr)!important;gap:12px!important}
 .field.span-2{grid-column:auto!important}
 .field input,.field select,.field textarea,input:not([type=checkbox]):not([type=radio]),select,textarea{font-size:16px!important}
 .btn{min-height:43px!important}
 .wct-case-detail{gap:12px!important}
 .wct-case-detail-hero{grid-template-columns:minmax(0,1fr)!important;padding:16px!important;border-radius:16px!important}
 .wct-case-detail-progress{width:82px!important;height:82px!important}
 .wct-case-detail-progress-inner strong{font-size:21px!important}
 .wct-case-meta-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}
 .wct-case-meta-tile{padding:11px!important}
 .wct-case-action-grid{grid-template-columns:minmax(0,1fr)!important;gap:10px!important}
 .wct-case-action{padding:13px!important}
 .wct-case-detail-toolbar{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important}
 .wct-case-detail-toolbar .btn{width:100%!important;min-height:42px!important}
 .wct-case-timeline-card{padding:11px!important}
 .wct-flow-form-body{padding:15px 14px!important}
 .wct-flow-form-footer{position:sticky!important;bottom:0!important;display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;margin:0!important;padding:10px 12px calc(10px + env(safe-area-inset-bottom))!important;border-radius:0!important;border-left:0!important;border-right:0!important;box-shadow:0 -5px 18px rgba(60,42,12,.08)!important}
 .wct-flow-form-footer-note{display:none!important}
 .wct-flow-form-footer .btn{width:100%!important;min-height:44px!important}
 .wct-settings-master-grid,.wct-settings-lower,.wct-settings-grid{grid-template-columns:minmax(0,1fr)!important;gap:12px!important}
 .wct-settings-intro{align-items:flex-start!important;padding:14px!important}
 .wct-setting-add-form,.wct-settings-add{padding:11px!important}
 .wct-setting-add-form{align-items:stretch!important;flex-direction:column!important}
 .wct-setting-add-form>.btn,.wct-settings-add-row .wct-settings-button{width:100%!important}
 .wct-setting-option-row,.wct-setting-item{align-items:flex-start!important;flex-direction:column!important}
 .wct-setting-option-actions,.wct-setting-item-actions{width:100%!important;justify-content:flex-end!important}
 .table-wrap{overflow-x:auto!important;max-width:100%!important}
 .table:not(.wct-cases-table){min-width:740px!important}
 .wct-cases-table{min-width:0!important}
 .wct-cases-table tbody tr{border-color:#ece4d8!important;border-radius:14px!important;box-shadow:0 4px 14px rgba(60,42,12,.045)!important}
 .modal-backdrop{align-items:flex-end!important;justify-content:center!important;padding:0!important;overflow:hidden!important}
 .modal-backdrop.show{display:flex!important}
 .modal,.modal.wide{width:100%!important;max-width:100%!important;max-height:92dvh!important;margin:0!important;border-radius:20px 20px 0 0!important;border-bottom:0!important}
 .modal-head{padding:14px 15px!important}
 .modal-body{padding:14px 15px 20px!important;overscroll-behavior:contain!important}
 .modal-foot{padding:11px 15px calc(11px + env(safe-area-inset-bottom))!important}
 .modal-foot .btn{flex:1!important;min-height:44px!important}
}
@media(max-width:370px){
 .dashboard-grid{grid-template-columns:minmax(0,1fr)!important}
 .wct-case-detail-toolbar,.wct-case-meta-grid{grid-template-columns:minmax(0,1fr)!important}
}
@media(prefers-reduced-motion:reduce){
 *,*::before,*::after{scroll-behavior:auto!important;transition-duration:.01ms!important;animation-duration:.01ms!important;animation-iteration-count:1!important}
}

/* Dark navy workspace requested: #0D131B with orange brand accents */
:root{
 --wct-canvas:#0D131B;
 --wct-surface:#151F2B;
 --wct-ink:#E8EDF3;
 --wct-muted:#9AA8B7;
 --wct-line:#283646;
 --wct-shadow:0 12px 30px rgba(0,0,0,.24);
 --main:#0D131B;
 --bg:#0D131B;
 --white:#151F2B;
 --ink:#E8EDF3;
 --muted:#9AA8B7;
 --line:#283646;
 --pink-soft:#202B37;
 --shadow:0 12px 30px rgba(0,0,0,.24);
}
html,body,.app,.main,.content,#pageContent{background:#0D131B!important;color:#E8EDF3!important}
body{color:#E8EDF3!important}
.sidebar{background:#0D131B!important;border-right:1px solid #253242!important;box-shadow:4px 0 22px rgba(0,0,0,.18)!important}
.brand strong,.page-head h1,.card-head h3,.case-title,.wct-case-detail-title,.wct-case-action h4,
.wct-case-meta-tile strong,.wct-flow-form-top h2,.modal-head h2{color:#EDF2F7!important}
.brand small,.page-head p,.card-head p,.card-head .sub,.sub,.wct-case-detail-subtitle,
.wct-case-meta-tile span,.wct-case-action-desc,.wct-flow-form-top p{color:#9AA8B7!important}
.nav-label{color:#718195!important}
.nav button{color:#A9B6C4!important}
.nav button:hover{background:#182635!important;color:#FEA500!important}
.nav button.active{background:#FEA500!important;color:#17202A!important;box-shadow:inset 3px 0 0 #FFE1A6,0 5px 16px rgba(254,165,0,.14)!important}
.topbar{background:rgba(13,19,27,.94)!important;border-bottom:1px solid #253242!important;box-shadow:0 3px 16px rgba(0,0,0,.18)!important}
.crumb{color:#9AA8B7!important}
.crumb b{color:#EDF2F7!important}
.user-chip{border-top-color:#283646!important}
.avatar{background:#243141!important;color:#FEA500!important}
.card,.kpi-card,.stat-card,.metric-card,.wct-case-meta-tile,.wct-case-action,
.wct-case-timeline-card,.wct-flow-form-card,.wct-settings-intro,.wct-settings-card{
 background:#151F2B!important;border-color:#283646!important;color:#E8EDF3!important;
 box-shadow:0 10px 26px rgba(0,0,0,.17)!important;
}
.card-head{background:#172330!important;border-bottom-color:#283646!important}
.card-body{background:transparent!important}
.kpi-card:hover,.stat-card:hover,.metric-card:hover,.wct-case-action:hover{
 border-color:#B77A1A!important;box-shadow:0 12px 28px rgba(0,0,0,.25)!important;
}
.toolbar,.wct-case-toolbar{background:#151F2B!important;border-color:#283646!important;box-shadow:0 8px 22px rgba(0,0,0,.16)!important}
.toolbar input,.toolbar select,.field input,.field select,.field textarea,
input:not([type=checkbox]):not([type=radio]),select,textarea{
 background:#0F1822!important;color:#E8EDF3!important;border-color:#304154!important;
}
input::placeholder,textarea::placeholder{color:#718195!important}
label,.field label{color:#C2CDD8!important}
.section-title,.wct-case-editor-section{color:#FEA500!important;border-bottom-color:#283646!important}
.btn{background:#1A2734!important;border-color:#354558!important;color:#DCE5EE!important;box-shadow:none!important}
.btn:hover{background:#223242!important;border-color:#B77A1A!important;color:#FFF!important}
.btn-primary,.wct-settings-button.is-primary{background:#FEA500!important;border-color:#FEA500!important;color:#17202A!important;box-shadow:0 6px 16px rgba(254,165,0,.16)!important}
.btn-primary:hover,.wct-settings-button.is-primary:hover{background:#E99400!important;border-color:#E99400!important;color:#17202A!important}
.btn-orange{background:#362B1A!important;border-color:#6E511F!important;color:#FFD17C!important}
.btn-ghost{background:transparent!important;color:#DCE5EE!important}
.table-wrap{background:#151F2B!important}
.table thead th,.table th{background:#1B2937!important;color:#AAB8C7!important;border-bottom-color:#304154!important}
.table tbody td,.table td{background:#151F2B!important;color:#D3DCE6!important;border-bottom-color:#283646!important}
.table tbody tr:nth-child(even) td{background:#172330!important}
.table tbody tr:hover td{background:#202F3E!important}
.empty{color:#9AA8B7!important}
.progress-track,.wct-case-action-track,.wct-division-breakdown-track{background:#2A3948!important}
.status,.pill{border:1px solid transparent}
.pill{background:#263544!important;color:#C7D2DE!important}
.pill.live{background:#18382F!important;color:#7DDBB1!important}
.priority.high{background:#3A2027!important;color:#FF9A9A!important}
.priority.medium{background:#3B301E!important;color:#FFD17C!important}
.priority.low{background:#1D382B!important;color:#8BD7A5!important}
.wct-glass-hero,.wct-case-detail-hero{
 background:linear-gradient(112deg,#172330 0%,#1A2836 58%,#202D3A 100%)!important;
 border-color:#354354!important;box-shadow:0 12px 28px rgba(0,0,0,.2)!important;
}
.wct-glass-hero h2,.wct-case-detail-title{color:#F0F4F8!important}
.wct-glass-hero p,.wct-case-detail-subtitle{color:#A9B6C4!important}
.wct-case-detail-hero:after{background:rgba(254,165,0,.12)!important}
.wct-case-detail-progress:before{background:#151F2B!important}
.wct-case-detail-progress-inner strong{color:#FEA500!important}
.wct-case-tag,.wct-case-detail-tags .wct-case-tag{background:#202D3A!important;border-color:#354558!important;color:#C9D4DF!important}
.wct-case-action-type,.wct-case-detail-kicker{color:#FFC15B!important}
.wct-case-action-type i,.wct-case-timeline-dot,.wct-case-editor-intro-mark,.wct-flow-context-icon{
 background:#3A2D19!important;border-color:#76551E!important;color:#FFC15B!important;
}
.wct-case-action-meta,.wct-case-meta-grid{border-color:#283646!important}
.wct-case-timeline-card{background:#172330!important}
.wct-case-editor-intro,.wct-case-flow-intro{
 background:#172330!important;border-color:#354558!important;
}
.wct-case-editor-intro strong,.wct-flow-context-main strong{color:#E8EDF3!important}
.wct-flow-subnav a{background:#172330!important;color:#C5D0DA!important;border-color:#354558!important}
.wct-flow-subnav a:hover{background:#3A2D19!important;color:#FFC15B!important;border-color:#76551E!important}
.wct-flow-form-top,.wct-flow-form-body{background:#151F2B!important}
.wct-flow-form-footer{background:rgba(21,31,43,.97)!important;border-color:#354558!important;box-shadow:0 -6px 22px rgba(0,0,0,.22)!important}
.wct-flow-context,.wct-flow-help,.wct-progress-range-wrap{
 background:#172330!important;border-color:#354558!important;color:#AFBDCA!important;
}
.wct-flow-help strong{color:#FFC15B!important}
.wct-progress-range-value{background:#3A2D19!important;color:#FFD17C!important}
.wct-dashboard-mini-progress b{color:#FFC15B!important}
.wct-settings-intro,.wct-settings-card,.wct-settings-option-card{
 background:#151F2B!important;border-color:#283646!important;color:#E8EDF3!important;
}
.wct-settings-intro strong,.wct-settings-card-header h2,.wct-setting-option-name,
.wct-setting-item-name,.wct-setting-list-heading strong,.wct-settings-list-label strong{
 color:#E8EDF3!important;
}
.wct-settings-intro p,.wct-settings-card-header p,.wct-settings-list-label span{color:#9AA8B7!important}
.wct-settings-card-header{background:#172330!important;border-bottom-color:#283646!important}
.wct-setting-add-form,.wct-settings-add,.wct-setting-edit-form{
 background:#101A24!important;border-color:#304154!important;
}
.wct-setting-option-row,.wct-setting-item{background:#172330!important;border-color:#304154!important}
.wct-setting-option-index,.wct-setting-number,.wct-settings-count,.wct-settings-counter{
 background:#3A2D19!important;color:#FFD17C!important;
}
.wct-setting-empty,.wct-settings-empty{background:#172330!important;border-color:#354558!important}
.wct-settings-note{background:#182635!important;border-color:#354558!important;color:#AAB8C7!important}
.modal-backdrop{background:rgba(0,0,0,.68)!important}
.modal,.modal.wide{background:#151F2B!important;border-color:#354558!important;color:#E8EDF3!important}
.modal-head{background:#172330!important;border-bottom-color:#304154!important}
.modal-head h2{color:#EDF2F7!important}
.modal-body{background:#151F2B!important;color:#DCE5EE!important}
.modal-foot{background:#151F2B!important;border-top-color:#304154!important}
.modal-head .close{background:#263544!important;color:#DCE5EE!important}
.login-screen{background:radial-gradient(circle at 12% 8%,rgba(254,165,0,.12),transparent 34%),radial-gradient(circle at 90% 88%,rgba(50,77,105,.2),transparent 32%),#0D131B!important}
.login-card{background:#151F2B!important;border-color:#354558!important;color:#E8EDF3!important;box-shadow:0 24px 70px rgba(0,0,0,.36)!important}
.login-card h1{color:#EDF2F7!important}
.login-card>p{color:#A9B6C4!important}
.login-note{background:#3A2D19!important;border-color:#76551E!important;color:#FFD17C!important}
.toast{background:#263544!important;color:#F1F5F9!important;border:1px solid #3A4A5B!important}
@media(max-width:680px){
 .topbar{background:rgba(13,19,27,.97)!important}
 .sidebar{background:#0D131B!important}
 .modal,.modal.wide{background:#151F2B!important}
 .modal-head,.modal-body,.modal-foot{background:#151F2B!important}
 .wct-flow-form-footer{background:rgba(21,31,43,.98)!important}
}


/* Readability refinement across every page: larger type and stronger contrast */
body{font-size:14px!important;line-height:1.55!important;color:#E8EDF3!important}
#pageContent{font-size:14px!important;color:#E8EDF3!important}
#pageContent p{color:#B7C3CF!important;line-height:1.6!important}
#pageContent .sub,#pageContent small{color:#B7C3CF!important}
#pageContent .empty{font-size:13px!important;color:#B7C3CF!important}
#pageContent .eyebrow{font-size:11px!important;letter-spacing:.14em!important;color:#FEA500!important;font-weight:900!important}
.page-head h1{font-size:clamp(26px,2.3vw,32px)!important;letter-spacing:-.035em!important}
.page-head p{font-size:14px!important;color:#B7C3CF!important}
.nav-label{font-size:10px!important;color:#91A0B0!important}
.nav button{font-size:13px!important;min-height:44px!important}
.topbar .crumb{font-size:13px!important;color:#AEBBC8!important}
.topbar .crumb b{color:#F1F5F9!important}
.topbar .pill,.topbar .status{font-size:11px!important}
.card-head{padding:19px 21px 16px!important}
.card-head h3{font-size:15px!important;line-height:1.4!important;color:#F0F4F8!important}
.card-head p{font-size:12px!important;color:#B7C3CF!important;line-height:1.55!important}
.card-body{padding:18px 21px 21px!important}
.kpis{gap:14px!important}
.kpis .kpi{min-height:116px!important;padding:19px 20px!important;border:1px solid #2A3949!important;border-radius:17px!important;background:#151F2B!important}
.kpi-top{font-size:13px!important;color:#B8C4D0!important;font-weight:700!important}
.kpi-value{font-size:32px!important;line-height:1.12!important;color:#F4F7FA!important;font-weight:900!important;margin-top:12px!important}
.kpi-note{font-size:12px!important;line-height:1.4!important;color:#AEBBC8!important;margin-top:5px!important}
.kpi-icon{color:#17212B!important}
.toolbar{gap:11px!important}
.toolbar input,.toolbar select,.field input,.field select,.field textarea{font-size:14px!important}
.field label,label{font-size:12px!important;color:#D2DCE5!important}
.btn{font-size:12px!important;font-weight:800!important}
.btn-sm{font-size:11px!important;min-height:35px!important}
.status,.pill{font-size:11px!important;font-weight:850!important}
.table th{font-size:11px!important;color:#B8C4D0!important}
.table td{font-size:13px!important;color:#D7E0E8!important;line-height:1.5!important}

/* Dashboard case list: the old purple titles and 9px captions were too dim */
.wct-dashboard-columns{gap:18px!important;grid-template-columns:minmax(0,1.2fr) minmax(300px,.8fr)!important}
.wct-dashboard-case-row{gap:14px!important;padding:15px 0!important;border-bottom:1px solid #304052!important}
.wct-dashboard-case-row>div:first-child{min-width:0!important;flex:1 1 auto!important}
.wct-dashboard-case-row>div:first-child strong{display:block!important;color:#E8EDF3!important;font-size:13px!important;line-height:1.45!important;font-weight:800!important;overflow-wrap:anywhere!important}
.wct-dashboard-case-row>div:first-child small{display:block!important;margin-top:5px!important;color:#B7C3CF!important;font-size:12px!important;line-height:1.5!important;white-space:normal!important}
.wct-dashboard-case-row>div:last-child{flex:0 0 auto!important;min-width:88px!important}
.wct-dashboard-case-row>div:last-child .status{font-size:11px!important}
.wct-dashboard-case-row .btn{font-size:11px!important;min-height:36px!important;padding:7px 11px!important}
.wct-dashboard-mini-progress{gap:8px!important;margin-top:7px!important}
.wct-dashboard-mini-progress .wct-case-action-track{width:66px!important;height:7px!important}
.wct-dashboard-mini-progress b{font-size:12px!important;color:#FFC15B!important}
.wct-dashboard-case-row:hover{background:rgba(255,255,255,.025)!important}

/* Portfolio progress and status distribution are generated with inline styles */
#pageContent .card-body>div[style*="margin-bottom:16px"]{margin-bottom:20px!important}
#pageContent .card-body>div[style*="margin-bottom:16px"] b{font-size:13px!important;color:#E8EDF3!important;font-weight:800!important}
#pageContent .card-body>div[style*="margin-bottom:16px"] span{font-size:12px!important;color:#B7C3CF!important}
#pageContent .card-body>div[style*="grid-template-columns:100px"]{grid-template-columns:112px minmax(0,1fr) 28px!important;gap:12px!important;margin:14px 0!important;font-size:12px!important;color:#B7C3CF!important}
#pageContent .card-body>div[style*="grid-template-columns:100px"] span{font-size:12px!important;color:#B7C3CF!important}
#pageContent .card-body>div[style*="grid-template-columns:100px"] b{font-size:13px!important;color:#F0F4F8!important}

/* PICAPA detail, Action cards and timeline typography */
.wct-glass-hero{padding:25px 27px!important}
.wct-glass-hero h2{font-size:clamp(23px,2.5vw,30px)!important;color:#F1F5F9!important}
.wct-glass-hero p{font-size:13px!important;line-height:1.65!important;color:#C0CBD6!important}
.wct-case-tag{font-size:11px!important;color:#D9E2EA!important}
.wct-case-detail-kicker{font-size:11px!important;color:#FFC15B!important}
.wct-case-detail-title{font-size:clamp(23px,2.5vw,30px)!important;color:#F1F5F9!important}
.wct-case-detail-subtitle{font-size:13px!important;color:#B7C3CF!important}
.wct-case-meta-tile span{font-size:11px!important;color:#B7C3CF!important}
.wct-case-meta-tile strong{font-size:14px!important;color:#EDF2F7!important}
.wct-case-section-head{border-bottom-color:#304052!important}
.wct-case-section-head h3{font-size:15px!important;color:#EDF2F7!important}
.wct-case-section-head p{font-size:12px!important;color:#B7C3CF!important}
.wct-case-problem{font-size:13px!important;color:#D2DCE5!important;line-height:1.7!important}
.wct-case-action-type{font-size:11px!important;color:#FFC15B!important}
.wct-case-action h4{font-size:15px!important;color:#EDF2F7!important}
.wct-case-action-desc{font-size:12px!important;color:#B7C3CF!important;line-height:1.65!important}
.wct-case-action-progress span{font-size:11px!important;color:#B7C3CF!important}
.wct-case-action-progress strong{font-size:16px!important;color:#FFC15B!important}
.wct-case-action-meta span{font-size:11px!important;color:#AEBBC8!important}
.wct-case-action-meta strong{font-size:12px!important;color:#E4EBF2!important}
.wct-case-timeline-title{font-size:13px!important;color:#EDF2F7!important}
.wct-case-timeline-text{font-size:12px!important;color:#CFD8E1!important;line-height:1.65!important}
.wct-case-timeline-meta{font-size:11px!important;color:#AEBBC8!important}
.wct-case-empty b{font-size:14px!important;color:#EDF2F7!important}
.wct-case-empty span{font-size:12px!important;color:#B7C3CF!important}
.wct-flow-context-main strong{font-size:13px!important;color:#EDF2F7!important}
.wct-flow-context-main small{font-size:11px!important;color:#B7C3CF!important}
.wct-flow-context-stat{font-size:22px!important;color:#FFC15B!important}
.wct-flow-help{font-size:12px!important;color:#C3CFDA!important;line-height:1.65!important}

/* Settings, report cards and supporting text */
.wct-settings-card-header h2{font-size:16px!important;color:#EDF2F7!important}
.wct-settings-card-header p,.wct-settings-intro p{font-size:12px!important;color:#B7C3CF!important}
.wct-settings-eyebrow,.wct-settings-card-kicker{font-size:11px!important;color:#FFC15B!important}
.wct-setting-option-name,.wct-setting-item-name{font-size:13px!important;color:#E8EDF3!important}
.wct-setting-list-heading strong,.wct-settings-list-label strong{font-size:13px!important;color:#EDF2F7!important}
.wct-setting-list-heading span,.wct-settings-list-label span{font-size:11px!important;color:#B7C3CF!important}
.wct-settings-note{font-size:12px!important;color:#C3CFDA!important;line-height:1.65!important}
.login-card h1{color:#EDF2F7!important}
.login-card>p{font-size:13px!important;color:#B7C3CF!important}
.login-note{font-size:12px!important;line-height:1.6!important}
.modal-head h2{font-size:18px!important;color:#EDF2F7!important}
.modal-body{color:#DCE5EE!important}
.modal-body p,.modal-body small{color:#B7C3CF!important}

`;
  return html.replace('</body>', '<style id=\"wct-global-redesign\">' + css + '</style></body>');
};
