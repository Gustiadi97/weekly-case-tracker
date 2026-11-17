module.exports = function applyAppearanceMode(html) {
  if (!html || !html.includes('</body>')) throw new Error('Could not find document body for appearance mode.');
  const css = String.raw`
:root[data-wct-appearance="dark"]{
  color-scheme:dark;
  --wct-brand:#FEA500;--wct-brand-hover:#E99400;--wct-brand-dark:#FEA500;
  --wct-brand-soft:#34291A;--wct-brand-pale:#241E16;
  --wct-ink:#E8EDF3;--wct-muted:#A4B1BF;--wct-line:#2B3A4B;
  --wct-canvas:#0D131B;--wct-surface:#151F2B;
  --pink:#FEA500;--pink-dark:#D98B00;--orange:#FEA500;
  --secondary:#FEA500;--secondary-dark:#D98B00;--accent:#FEA500;
  --pink-soft:#202B37;--main:#0D131B;--bg:#0D131B;--white:#151F2B;
  --ink:#E8EDF3;--muted:#A4B1BF;--line:#2B3A4B;
}
:root[data-wct-appearance="dark"] body,
:root[data-wct-appearance="dark"] .app,
:root[data-wct-appearance="dark"] .main,
:root[data-wct-appearance="dark"] .content,
:root[data-wct-appearance="dark"] #pageContent,
:root[data-wct-appearance="dark"] .main-content{
  background:#0D131B!important;color:#E8EDF3!important;
}
:root[data-wct-appearance="dark"] .sidebar{
  background:#0B121A!important;border-right:1px solid #263545!important;
  box-shadow:4px 0 22px rgba(0,0,0,.2)!important;
}
:root[data-wct-appearance="dark"] .brand strong,
:root[data-wct-appearance="dark"] .page-head h1,
:root[data-wct-appearance="dark"] .card-head h2,
:root[data-wct-appearance="dark"] .card-head h3,
:root[data-wct-appearance="dark"] .case-title,
:root[data-wct-appearance="dark"] .wct-case-detail-title,
:root[data-wct-appearance="dark"] .wct-case-action h4,
:root[data-wct-appearance="dark"] .wct-case-meta-tile strong,
:root[data-wct-appearance="dark"] .wct-panel-head h2,
:root[data-wct-appearance="dark"] .wct-panel-head h3,
:root[data-wct-appearance="dark"] .wct-settings-card-header h2,
:root[data-wct-appearance="dark"] .wct-settings-intro strong,
:root[data-wct-appearance="dark"] .wct-setting-item-name,
:root[data-wct-appearance="dark"] .wct-contributor strong{
  color:#E8EDF3!important;
}
:root[data-wct-appearance="dark"] .brand small,
:root[data-wct-appearance="dark"] .page-head p,
:root[data-wct-appearance="dark"] .card-head p,
:root[data-wct-appearance="dark"] .card-head .sub,
:root[data-wct-appearance="dark"] .sub,
:root[data-wct-appearance="dark"] .wct-case-detail-subtitle,
:root[data-wct-appearance="dark"] .wct-case-meta-tile span,
:root[data-wct-appearance="dark"] .wct-case-action-desc,
:root[data-wct-appearance="dark"] .wct-flow-form-top p,
:root[data-wct-appearance="dark"] .wct-settings-card-header p,
:root[data-wct-appearance="dark"] .wct-settings-intro p,
:root[data-wct-appearance="dark"] .wct-contributor small,
:root[data-wct-appearance="dark"] .wct-empty{
  color:#A4B1BF!important;
}
:root[data-wct-appearance="dark"] .nav-label{color:#8393A4!important}
:root[data-wct-appearance="dark"] .nav button,
:root[data-wct-appearance="dark"] .nav a{color:#B8C3CE!important}
:root[data-wct-appearance="dark"] .nav button:hover,
:root[data-wct-appearance="dark"] .nav a:hover{
  background:#1A2735!important;color:#FEA500!important;
}
:root[data-wct-appearance="dark"] .nav button.active,
:root[data-wct-appearance="dark"] .nav a.active{
  background:#FEA500!important;border-color:#FEA500!important;color:#17202A!important;
  box-shadow:inset 3px 0 0 #FFD18A,0 5px 16px rgba(254,165,0,.13)!important;
}
:root[data-wct-appearance="dark"] .topbar{
  background:rgba(13,19,27,.96)!important;border-bottom:1px solid #263545!important;
  box-shadow:0 3px 16px rgba(0,0,0,.2)!important;
}
:root[data-wct-appearance="dark"] .crumb{color:#A4B1BF!important}
:root[data-wct-appearance="dark"] .crumb b{color:#EDF2F7!important}
:root[data-wct-appearance="dark"] .user-chip{border-top-color:#2B3A4B!important}
:root[data-wct-appearance="dark"] .avatar{background:#263545!important;color:#FEA500!important}

/* Panels, cards and workspace content */
:root[data-wct-appearance="dark"] .card,
:root[data-wct-appearance="dark"] .kpi-card,
:root[data-wct-appearance="dark"] .stat-card,
:root[data-wct-appearance="dark"] .metric-card,
:root[data-wct-appearance="dark"] .wct-panel,
:root[data-wct-appearance="dark"] .wct-workspace-kpi,
:root[data-wct-appearance="dark"] .wct-analytics-kpi,
:root[data-wct-appearance="dark"] .wct-calendar,
:root[data-wct-appearance="dark"] .wct-calendar-main,
:root[data-wct-appearance="dark"] .wct-calendar-agenda,
:root[data-wct-appearance="dark"] .wct-member-card,
:root[data-wct-appearance="dark"] .wct-settings-card,
:root[data-wct-appearance="dark"] .wct-settings-option-card,
:root[data-wct-appearance="dark"] .wct-pref-card,
:root[data-wct-appearance="dark"] .wct-case-section,
:root[data-wct-appearance="dark"] .wct-case-action,
:root[data-wct-appearance="dark"] .wct-case-timeline-card,
:root[data-wct-appearance="dark"] .wct-case-meta-tile,
:root[data-wct-appearance="dark"] .wct-flow-form-card,
:root[data-wct-appearance="dark"] .wct-workspace-export{
  background:#151F2B!important;border-color:#2B3A4B!important;color:#DCE5EE!important;
  box-shadow:0 8px 24px rgba(0,0,0,.16)!important;
}
:root[data-wct-appearance="dark"] .wct-panel-head,
:root[data-wct-appearance="dark"] .wct-settings-card-header,
:root[data-wct-appearance="dark"] .wct-case-section-head,
:root[data-wct-appearance="dark"] .card-head{
  background:#151F2B!important;border-color:#2B3A4B!important;
}
:root[data-wct-appearance="dark"] .wct-panel-body,
:root[data-wct-appearance="dark"] .wct-settings-card-body,
:root[data-wct-appearance="dark"] .wct-case-section-body,
:root[data-wct-appearance="dark"] .wct-case-action-grid{
  background:transparent!important;color:#DCE5EE!important;
}
:root[data-wct-appearance="dark"] .wct-dashboard-case-row,
:root[data-wct-appearance="dark"] .wct-contributor,
:root[data-wct-appearance="dark"] .wct-case-action-meta,
:root[data-wct-appearance="dark"] .wct-case-section-head{border-color:#2B3A4B!important}
:root[data-wct-appearance="dark"] .wct-dashboard-case-row strong,
:root[data-wct-appearance="dark"] .wct-case-action-meta strong,
:root[data-wct-appearance="dark"] .wct-case-section-head h3,
:root[data-wct-appearance="dark"] .wct-case-timeline-title,
:root[data-wct-appearance="dark"] .wct-case-problem{color:#E1E8EF!important}
:root[data-wct-appearance="dark"] .wct-dashboard-case-row small,
:root[data-wct-appearance="dark"] .wct-case-action-meta span,
:root[data-wct-appearance="dark"] .wct-case-section-head p,
:root[data-wct-appearance="dark"] .wct-case-timeline-text,
:root[data-wct-appearance="dark"] .wct-case-timeline-meta{color:#9EADBC!important}
:root[data-wct-appearance="dark"] .wct-case-action-track,
:root[data-wct-appearance="dark"] .progress-track,
:root[data-wct-appearance="dark"] .wct-progress-bar{background:#2B3A4B!important}
:root[data-wct-appearance="dark"] .wct-case-action-track span,
:root[data-wct-appearance="dark"] .progress-track span,
:root[data-wct-appearance="dark"] .wct-progress-bar span{background:#FEA500!important}
:root[data-wct-appearance="dark"] .wct-case-tag,
:root[data-wct-appearance="dark"] .wct-page-badge,
:root[data-wct-appearance="dark"] .wct-setting-number{
  border-color:#37495B!important;background:#202C39!important;color:#DCE5EE!important;
}
:root[data-wct-appearance="dark"] .wct-case-empty,
:root[data-wct-appearance="dark"] .wct-setting-empty,
:root[data-wct-appearance="dark"] .wct-settings-note,
:root[data-wct-appearance="dark"] .wct-settings-add{
  border-color:#344556!important;background:#111B26!important;color:#AEBAC6!important;
}
:root[data-wct-appearance="dark"] .wct-case-empty b,
:root[data-wct-appearance="dark"] .wct-setting-empty b,
:root[data-wct-appearance="dark"] .wct-setting-empty strong,
:root[data-wct-appearance="dark"] .wct-setting-list-heading strong{color:#E0E7EE!important}

/* Form controls and data tables */
:root[data-wct-appearance="dark"] input:not([type="checkbox"]):not([type="radio"]):not([type="range"]),
:root[data-wct-appearance="dark"] select,
:root[data-wct-appearance="dark"] textarea{
  border-color:#3A4B5D!important;background:#101A25!important;color:#E8EDF3!important;color-scheme:dark;
}
:root[data-wct-appearance="dark"] input::placeholder,
:root[data-wct-appearance="dark"] textarea::placeholder{color:#8292A3!important;opacity:1!important}
:root[data-wct-appearance="dark"] select option{background:#151F2B!important;color:#E8EDF3!important}
:root[data-wct-appearance="dark"] label,
:root[data-wct-appearance="dark"] .field label{color:#BDCAD6!important}
:root[data-wct-appearance="dark"] input:disabled{background:#202B37!important;color:#98A7B6!important;opacity:1!important}
:root[data-wct-appearance="dark"] .table,
:root[data-wct-appearance="dark"] table{color:#DCE5EE!important}
:root[data-wct-appearance="dark"] .table thead th,
:root[data-wct-appearance="dark"] table thead th{
  background:#1B2836!important;color:#9DAEBE!important;border-color:#2B3A4B!important;
}
:root[data-wct-appearance="dark"] .table tbody td,
:root[data-wct-appearance="dark"] table tbody td{color:#D2DCE6!important;border-color:#2B3A4B!important}
:root[data-wct-appearance="dark"] .table tbody tr:hover td,
:root[data-wct-appearance="dark"] table tbody tr:hover td{background:#1A2734!important}
:root[data-wct-appearance="dark"] .wct-cases-table tbody tr{background:#151F2B!important;border-color:#2B3A4B!important}
:root[data-wct-appearance="dark"] .wct-workspace-export{color:#F2B64A!important;border-color:#594521!important}
:root[data-wct-appearance="dark"] .wct-workspace-export:hover{background:#202B37!important}

/* Orange secondary accent in dark mode */
:root[data-wct-appearance="dark"] .btn-primary,
:root[data-wct-appearance="dark"] .btn-orange,
:root[data-wct-appearance="dark"] .wct-settings-button.is-primary{
  border-color:#FEA500!important;background:#FEA500!important;color:#17202A!important;
  box-shadow:0 5px 14px rgba(254,165,0,.15)!important;
}
:root[data-wct-appearance="dark"] .btn-primary:hover,
:root[data-wct-appearance="dark"] .btn-orange:hover,
:root[data-wct-appearance="dark"] .wct-settings-button.is-primary:hover{
  border-color:#F4B13D!important;background:#F4B13D!important;color:#17202A!important;
}
:root[data-wct-appearance="dark"] .btn:not(.btn-primary):not(.btn-orange),
:root[data-wct-appearance="dark"] .wct-settings-button:not(.is-primary):not(.is-danger){
  border-color:#3A4B5D!important;background:#202B37!important;color:#DCE5EE!important;
}
:root[data-wct-appearance="dark"] .wct-settings-button.is-danger,
:root[data-wct-appearance="dark"] .wct-danger-btn{background:#352126!important;border-color:#684047!important;color:#FFC2C5!important}
:root[data-wct-appearance="dark"] .wct-kicker,
:root[data-wct-appearance="dark"] .eyebrow,
:root[data-wct-appearance="dark"] .wct-panel-action,
:root[data-wct-appearance="dark"] .wct-page-icon{color:#FEA500!important}
:root[data-wct-appearance="dark"] .wct-gauge{
  background:conic-gradient(#FEA500 var(--wct-gauge-value,0%),#2B3A4B 0)!important;
}
:root[data-wct-appearance="dark"] .wct-donut:before{background:#151F2B!important}
:root[data-wct-appearance="dark"] .wct-donut-legend>div,
:root[data-wct-appearance="dark"] .wct-donut-legend b{color:#C4D0DC!important}
:root[data-wct-appearance="dark"] .wct-heat-cell{background:#243342!important}
:root[data-wct-appearance="dark"] .wct-heat-cell.l1{background:#54401F!important}
:root[data-wct-appearance="dark"] .wct-heat-cell.l2{background:#95651D!important}
:root[data-wct-appearance="dark"] .wct-heat-cell.l3{background:#D18B19!important}
:root[data-wct-appearance="dark"] .wct-heat-cell.l4{background:#FEA500!important}

/* Dialogs and PICAPA forms follow the selected appearance */
:root[data-wct-appearance="dark"] .modal,
:root[data-wct-appearance="dark"] #modal{
  border-color:#344556!important;background:#151F2B!important;color:#E8EDF3!important;
  box-shadow:0 26px 80px rgba(0,0,0,.42)!important;
}
:root[data-wct-appearance="dark"] .modal-head,
:root[data-wct-appearance="dark"] .modal-foot{
  border-color:#2B3A4B!important;background:#151F2B!important;color:#E8EDF3!important;
}
:root[data-wct-appearance="dark"] .modal-head h2{color:#F0F4F8!important}
:root[data-wct-appearance="dark"] .modal-head .sub{color:#A4B1BF!important}
:root[data-wct-appearance="dark"] .modal-body{background:#101A25!important;color:#DCE5EE!important}
:root[data-wct-appearance="dark"] .modal-backdrop{background:rgba(3,8,14,.72)!important}
:root[data-wct-appearance="dark"] #modal.wct-modal-action,
:root[data-wct-appearance="dark"] #modal:has(#wctActionForm),
:root[data-wct-appearance="dark"] #modal.wct-modal-progress,
:root[data-wct-appearance="dark"] #modal.wct-case-detail-modal{
  background:#151F2B!important;color:#E8EDF3!important;border-color:#344556!important;
}
:root[data-wct-appearance="dark"] #modal.wct-modal-action>.modal-head,
:root[data-wct-appearance="dark"] #modal:has(#wctActionForm)>.modal-head,
:root[data-wct-appearance="dark"] #modal.wct-modal-progress>.modal-head,
:root[data-wct-appearance="dark"] #modal.wct-case-detail-modal>.modal-head{
  background:#151F2B!important;border-color:#2B3A4B!important;
}
:root[data-wct-appearance="dark"] #modal.wct-modal-action>.modal-head h2,
:root[data-wct-appearance="dark"] #modal:has(#wctActionForm)>.modal-head h2,
:root[data-wct-appearance="dark"] #modal.wct-modal-progress>.modal-head h2,
:root[data-wct-appearance="dark"] #modal.wct-case-detail-modal>.modal-head h2{color:#F0F4F8!important}
:root[data-wct-appearance="dark"] #modal.wct-modal-action>.modal-body,
:root[data-wct-appearance="dark"] #modal:has(#wctActionForm)>.modal-body,
:root[data-wct-appearance="dark"] #modal.wct-modal-progress>.modal-body,
:root[data-wct-appearance="dark"] #modal.wct-case-detail-modal>.modal-body{
  background:#101A25!important;color:#DCE5EE!important;
}
:root[data-wct-appearance="dark"] #modal.wct-modal-action .wct-flow-context,
:root[data-wct-appearance="dark"] #modal:has(#wctActionForm) .wct-flow-context,
:root[data-wct-appearance="dark"] #modal.wct-modal-progress .wct-flow-context{
  border-color:#34485D!important;background:#1A2938!important;color:#C3D0DD!important;
}
:root[data-wct-appearance="dark"] #modal.wct-modal-action .wct-flow-context-main strong,
:root[data-wct-appearance="dark"] #modal:has(#wctActionForm) .wct-flow-context-main strong{color:#E5EDF5!important}
:root[data-wct-appearance="dark"] #modal.wct-modal-action .wct-flow-context-main small,
:root[data-wct-appearance="dark"] #modal:has(#wctActionForm) .wct-flow-context-main small{color:#A5B4C3!important}
:root[data-wct-appearance="dark"] #modal.wct-modal-action .section-title,
:root[data-wct-appearance="dark"] #modal:has(#wctActionForm) .section-title{
  border-color:#344556!important;color:#FEA500!important;
}
:root[data-wct-appearance="dark"] #modal.wct-modal-action .field label,
:root[data-wct-appearance="dark"] #modal:has(#wctActionForm) .field label,
:root[data-wct-appearance="dark"] #modal.wct-modal-progress .field label{color:#C0CCD8!important}
:root[data-wct-appearance="dark"] #modal.wct-modal-action .field input,
:root[data-wct-appearance="dark"] #modal.wct-modal-action .field select,
:root[data-wct-appearance="dark"] #modal.wct-modal-action .field textarea,
:root[data-wct-appearance="dark"] #modal:has(#wctActionForm) .field input,
:root[data-wct-appearance="dark"] #modal:has(#wctActionForm) .field select,
:root[data-wct-appearance="dark"] #modal:has(#wctActionForm) .field textarea{
  border-color:#3A4D60!important;background:#0C1621!important;color:#EDF2F7!important;
}
:root[data-wct-appearance="dark"] #modal.wct-modal-action .wct-flow-help,
:root[data-wct-appearance="dark"] #modal:has(#wctActionForm) .wct-flow-help{
  border-color:#36495C!important;background:#1B2A39!important;color:#B9C7D5!important;
}
:root[data-wct-appearance="dark"] #modal.wct-modal-action .wct-flow-form-footer,
:root[data-wct-appearance="dark"] #modal:has(#wctActionForm) .wct-flow-form-footer,
:root[data-wct-appearance="dark"] #modal.wct-modal-progress .wct-flow-form-footer{
  border-color:#344556!important;background:rgba(21,31,43,.98)!important;
}
:root[data-wct-appearance="dark"] #modal.wct-modal-action .wct-flow-form-footer .btn:not(.btn-primary),
:root[data-wct-appearance="dark"] #modal:has(#wctActionForm) .wct-flow-form-footer .btn:not(.btn-primary){
  border-color:#3A4D60!important;background:#202B37!important;color:#E0E8F0!important;
}
:root[data-wct-appearance="dark"] #modal.wct-modal-action .wct-flow-form-footer .btn-primary,
:root[data-wct-appearance="dark"] #modal:has(#wctActionForm) .wct-flow-form-footer .btn-primary{
  border-color:#FEA500!important;background:#FEA500!important;color:#17202A!important;
}
:root[data-wct-appearance="dark"] #modal.wct-modal-progress .wct-flow-form-top,
:root[data-wct-appearance="dark"] #modal.wct-modal-progress #wctProgressForm,
:root[data-wct-appearance="dark"] #modal.wct-modal-progress .wct-flow-form-body{
  border-color:#344556!important;background:#151F2B!important;color:#E0E8F0!important;
}
:root[data-wct-appearance="dark"] #modal.wct-modal-progress .wct-progress-range-wrap{
  border-color:#344556!important;background:#1A2938!important;
}
:root[data-wct-appearance="dark"] #modal.wct-modal-progress .wct-progress-range-value{
  background:#3A2C17!important;color:#FEA500!important;
}
:root[data-wct-appearance="dark"] .wct-case-detail-hero,
:root[data-wct-appearance="dark"] .wct-case-meta-tile,
:root[data-wct-appearance="dark"] .wct-case-section,
:root[data-wct-appearance="dark"] .wct-case-action,
:root[data-wct-appearance="dark"] .wct-case-timeline-card{
  border-color:#344556!important;background:#151F2B!important;color:#DCE5EE!important;
}
:root[data-wct-appearance="dark"] .wct-case-detail-title,
:root[data-wct-appearance="dark"] .wct-case-section-head h3,
:root[data-wct-appearance="dark"] .wct-case-action h4,
:root[data-wct-appearance="dark"] .wct-case-timeline-title{color:#E8EDF3!important}

/* Persistent appearance switch in the top bar */
.wct-appearance-toggle{
  display:inline-flex!important;align-items:center!important;justify-content:center!important;
  gap:8px!important;min-height:38px!important;margin-left:12px!important;padding:8px 12px!important;
  flex:0 0 auto!important;border:1px solid #D9E2EC!important;border-radius:11px!important;
  background:#FFFFFF!important;color:#344D67!important;font-family:inherit!important;
  font-size:11px!important;font-weight:800!important;line-height:1!important;
  letter-spacing:.01em!important;cursor:pointer!important;white-space:nowrap!important;
  box-shadow:0 2px 7px rgba(20,40,65,.055)!important;touch-action:manipulation!important;
}
.wct-appearance-toggle:hover{background:#F4F7FB!important;border-color:#B8C8D9!important}
.wct-appearance-toggle .wct-appearance-icon{display:grid;place-items:center;width:18px;height:18px;flex:0 0 18px}
.wct-appearance-toggle svg{display:block;width:17px;height:17px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
:root[data-wct-appearance="dark"] .wct-appearance-toggle{
  border-color:#465667!important;background:#1C2936!important;color:#F1B54A!important;
  box-shadow:0 2px 9px rgba(0,0,0,.2)!important;
}
:root[data-wct-appearance="dark"] .wct-appearance-toggle:hover{background:#263545!important;border-color:#63778A!important}
@media(max-width:650px){
  .wct-appearance-toggle{min-width:40px!important;width:40px!important;height:40px!important;padding:0!important;margin-left:7px!important}
  .wct-appearance-toggle .wct-appearance-label{display:none!important}
}
`;
  const runtime = String.raw`
(function(){
  'use strict';
  if(window.__WCT_APPEARANCE_MODE_READY)return;
  window.__WCT_APPEARANCE_MODE_READY=true;
  var storageKey='wctAppearanceMode';
  var buttonId='wct-appearance-toggle';
  function readMode(){
    try{return localStorage.getItem(storageKey)==='dark'?'dark':'light';}
    catch(ignore){return 'light';}
  }
  function iconMarkup(mode){
    return mode==='dark'
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"></path></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.7 8.7 0 1 0 20.5 14.2Z"></path></svg>';
  }
  function updateButton(mode){
    var button=document.getElementById(buttonId);
    if(!button)return;
    var label=mode==='dark'?'Mode terang':'Mode gelap';
    button.innerHTML='<span class="wct-appearance-icon">'+iconMarkup(mode)+'</span><span class="wct-appearance-label">'+label+'</span>';
    button.setAttribute('aria-label',label);
    button.setAttribute('title',label);
    button.setAttribute('aria-pressed',mode==='dark'?'true':'false');
  }
  function applyMode(mode,persist){
    mode=mode==='dark'?'dark':'light';
    document.documentElement.setAttribute('data-wct-appearance',mode);
    if(document.body)document.body.setAttribute('data-wct-appearance',mode);
    if(persist!==false){
      try{localStorage.setItem(storageKey,mode);}catch(ignore){}
    }
    updateButton(mode);
    window.wctAppearanceMode=mode;
    return mode;
  }
  function mountButton(){
    var topbar=document.querySelector('.topbar');
    if(!topbar)return;
    var button=document.getElementById(buttonId);
    if(button&&button.parentElement!==topbar){button.remove();button=null;}
    if(!button){
      button=document.createElement('button');
      button.type='button';
      button.id=buttonId;
      button.className='wct-appearance-toggle';
      button.addEventListener('click',function(){
        var current=document.documentElement.getAttribute('data-wct-appearance')||'light';
        applyMode(current==='dark'?'light':'dark',true);
      });
      var account=topbar.querySelector('.user-chip,.topbar-user,.account-menu,.profile-menu,[data-user-menu]');
      if(account)topbar.insertBefore(button,account);
      else topbar.appendChild(button);
    }
    updateButton(document.documentElement.getAttribute('data-wct-appearance')||'light');
  }
  function init(){
    applyMode(readMode(),false);
    mountButton();
    if(document.body&&!window.__WCT_APPEARANCE_OBSERVER__){
      window.__WCT_APPEARANCE_OBSERVER__=new MutationObserver(function(){
        if(!document.getElementById(buttonId))mountButton();
      });
      window.__WCT_APPEARANCE_OBSERVER__.observe(document.body,{childList:true,subtree:true});
    }
    window.wctSetAppearanceMode=function(mode){return applyMode(mode,true);};
    window.WCTAppearanceModeReady=true;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
`;
  return html.replace('</body>', '<style id="wct-appearance-mode-style">' + css + '</style><script id="wct-appearance-mode">' + runtime + '</script></body>');
};
