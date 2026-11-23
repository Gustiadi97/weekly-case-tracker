module.exports = function applyP3Polish(html) {
  if (!html || !html.includes('</body>')) {
    throw new Error('Could not find document body for P3 UI polish.');
  }

  const css = String.raw`
:root{
  --wct-type-body:14px;
  --wct-type-small:12px;
  --wct-type-label:11px;
  --wct-leading-body:1.55;
  --wct-leading-copy:1.65;
  --wct-space-1:4px;
  --wct-space-2:8px;
  --wct-space-3:12px;
  --wct-space-4:16px;
  --wct-space-5:20px;
  --wct-space-6:24px;
}
body{
  font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif!important;
  font-size:var(--wct-type-body)!important;
  line-height:var(--wct-leading-body)!important;
  text-rendering:optimizeLegibility;
  -webkit-font-smoothing:antialiased;
}
#pageContent{min-width:0}
#pageContent h1,#pageContent h2,#pageContent h3,#pageContent h4,
.modal h1,.modal h2,.modal h3,.modal h4{
  line-height:1.3!important;
  letter-spacing:-.018em;
  text-wrap:pretty;
}
.page-head{gap:var(--wct-space-4)!important;margin-bottom:var(--wct-space-6)!important}
.page-head h1{line-height:1.2!important}
.page-head p,.card-head p,.sub,.wct-muted,.empty{
  line-height:var(--wct-leading-copy)!important;
}
.card,.kpi-card,.stat-card,.metric-card{
  min-width:0;
}
.card-head{gap:var(--wct-space-3)!important}
.card-body{min-width:0}
.grid,.dashboard-grid,.wct-workspace-grid,.wct-member-grid,
.wct-settings-master-grid,.wct-settings-lower,.wct-settings-grid{
  gap:var(--wct-space-4)!important;
}
.toolbar,.wct-case-toolbar,.wct-filterbar{
  gap:var(--wct-space-3)!important;
}
label,.field label{
  line-height:1.4!important;
  letter-spacing:.005em;
}
input:not([type=checkbox]):not([type=radio]),select,textarea{
  font-size:13px!important;
  line-height:1.45!important;
}
input:not([type=checkbox]):not([type=radio]),select{
  min-height:42px!important;
}
textarea{line-height:1.6!important}
.table thead th,.table th{
  line-height:1.35!important;
  letter-spacing:.06em!important;
}
.table tbody td,.table td{
  line-height:1.5!important;
}
.btn,.wct-panel-action,.wct-task-actions button,.wct-password-toggle,
.nav button{
  transition:
    color .16s ease,
    background-color .16s ease,
    border-color .16s ease,
    box-shadow .16s ease,
    transform .16s ease,
    opacity .16s ease!important;
}
.btn:not(:disabled):active,
button:not(:disabled):active,
.wct-panel-action:active{
  transform:translateY(1px) scale(.99)!important;
}
.btn:disabled,button:disabled,[aria-disabled="true"]{
  cursor:not-allowed!important;
}
button:focus-visible,a:focus-visible,
input:focus-visible,select:focus-visible,textarea:focus-visible{
  outline:3px solid rgba(254,165,0,.34)!important;
  outline-offset:2px!important;
}
[aria-busy="true"]{cursor:progress!important}
[role="alert"],.wct-form-error{
  line-height:1.55!important;
}
.wct-form-error{
  border-radius:12px!important;
  padding:12px 14px!important;
}
.wct-settings-feedback{
  border-radius:11px!important;
  padding:10px 13px!important;
  line-height:1.5!important;
}
.toast,.toast-message{
  line-height:1.5!important;
  border-radius:12px!important;
}
@media(max-width:760px){
  .page-head{align-items:flex-start!important;gap:10px!important}
  .page-head h1{font-size:23px!important}
  .card-head{padding:15px 16px 12px!important}
  .card-body{padding:15px 16px 17px!important}
  .table thead th,.table th{padding:11px 12px!important}
  .table tbody td,.table td{padding:11px 12px!important}
  input:not([type=checkbox]):not([type=radio]),select,textarea{
    font-size:16px!important;
  }
}
@media(prefers-reduced-motion:reduce){
  *,*::before,*::after{
    scroll-behavior:auto!important;
    animation-duration:.01ms!important;
    animation-iteration-count:1!important;
    transition-duration:.01ms!important;
  }
}
`;

  return html.replace('</body>', '<style id="wct-p3-ui-polish">' + css + '</style></body>');
};
