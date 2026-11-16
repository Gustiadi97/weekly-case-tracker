module.exports = function applyPicapaModalPolish(html) {
  if (!html || !html.includes('</body>')) throw new Error('Could not find document body for PICAPA modal polish.');
  const css = String.raw`
/* PICAPA modal polish: local light surfaces over the app's navy workspace theme */
#modal.wct-modal-progress,
#modal.wct-modal-action,
#modal.wct-case-detail-modal{
  --wct-modal-ink:#172B46;
  --wct-modal-muted:#657A93;
  --wct-modal-line:#DFE7F1;
  --wct-modal-surface:#FFFFFF;
  --wct-modal-canvas:#F4F7FB;
  background:#FFFFFF!important;
  color:#172B46!important;
  border:1px solid #D7E1ED!important;
  box-shadow:0 26px 80px rgba(12,35,64,.24)!important;
}
#modal.wct-modal-progress .modal-head,
#modal.wct-modal-action .modal-head,
#modal.wct-case-detail-modal .modal-head{
  flex:0 0 auto!important;
  padding:19px 22px!important;
  border-bottom:1px solid #E7EDF5!important;
  background:#FFFFFF!important;
}
#modal.wct-modal-progress .modal-head h2,
#modal.wct-modal-action .modal-head h2,
#modal.wct-case-detail-modal .modal-head h2{
  color:#173B68!important;font-size:19px!important;font-weight:900!important;letter-spacing:-.025em!important;
}
#modal.wct-modal-progress .modal-head .eyebrow,
#modal.wct-modal-action .modal-head .eyebrow,
#modal.wct-case-detail-modal .modal-head .eyebrow{
  color:#2864C7!important;
}
#modal.wct-modal-progress .modal-head .sub,
#modal.wct-modal-action .modal-head .sub,
#modal.wct-case-detail-modal .modal-head .sub{
  color:#75869B!important;font-size:11px!important;
}
#modal.wct-modal-progress .modal-head .close,
#modal.wct-modal-action .modal-head .close,
#modal.wct-case-detail-modal .modal-head .close{
  display:grid!important;place-items:center!important;width:38px!important;height:38px!important;
  border:1px solid #DFE7F1!important;border-radius:11px!important;
  background:#F4F7FB!important;color:#38516F!important;
}
#modal.wct-modal-progress .modal-body,
#modal.wct-modal-action .modal-body,
#modal.wct-case-detail-modal .modal-body{
  background:#F5F8FC!important;
  color:#263A54!important;
  padding:20px 22px 24px!important;
}
#modal.wct-modal-progress .modal-foot,
#modal.wct-modal-action .modal-foot,
#modal.wct-case-detail-modal .modal-foot{
  flex:0 0 auto!important;
  display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:9px!important;
  padding:13px 20px!important;border-top:1px solid #E1E8F1!important;
  background:#FFFFFF!important;
}
#modal.wct-modal-progress .modal-body .card,
#modal.wct-modal-action .modal-body .card{
  overflow:hidden!important;border:1px solid #E1E8F1!important;border-radius:15px!important;
  background:#FFFFFF!important;box-shadow:0 5px 16px rgba(25,49,79,.045)!important;
}
#modal.wct-modal-progress .modal-body .card-head,
#modal.wct-modal-action .modal-body .card-head{
  padding:16px 18px!important;border-bottom:1px solid #E8EEF5!important;background:#FFFFFF!important;
}
#modal.wct-modal-progress .modal-body .card-head h3,
#modal.wct-modal-action .modal-body .card-head h3,
#modal.wct-modal-progress .modal-body .card-head h4,
#modal.wct-modal-action .modal-body .card-head h4{
  color:#1C3554!important;font-size:14px!important;font-weight:900!important;
}
#modal.wct-modal-progress .modal-body .card-head p,
#modal.wct-modal-action .modal-body .card-head p,
#modal.wct-modal-progress .modal-body .card-head .sub,
#modal.wct-modal-action .modal-body .card-head .sub{
  color:#70839A!important;font-size:11px!important;line-height:1.55!important;
}
#modal.wct-modal-progress .modal-body .card-body,
#modal.wct-modal-action .modal-body .card-body{
  padding:16px 18px!important;background:#FFFFFF!important;color:#30465F!important;
}
#modal.wct-modal-progress .wct-picapa-form-intro,
#modal.wct-modal-action .wct-picapa-form-intro{
  align-items:center!important;margin:0 0 18px!important;padding:13px 15px!important;
  border:1px solid #DCE8F7!important;border-radius:12px!important;
  background:linear-gradient(110deg,#F0F6FE 0%,#F8FBFF 100%)!important;
}
#modal.wct-modal-progress .wct-picapa-form-intro i,
#modal.wct-modal-action .wct-picapa-form-intro i{
  display:grid!important;place-items:center!important;width:34px!important;height:34px!important;flex:0 0 34px!important;
  border-radius:10px!important;background:#DCEBFC!important;color:#245E9F!important;font-size:11px!important;
}
#modal.wct-modal-progress .wct-picapa-form-intro p,
#modal.wct-modal-action .wct-picapa-form-intro p{
  color:#526B87!important;font-size:11px!important;line-height:1.6!important;
}
#modal.wct-modal-progress .form-grid,
#modal.wct-modal-action .form-grid{
  display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;
  gap:15px 16px!important;align-items:start!important;
}
#modal.wct-modal-progress .field,
#modal.wct-modal-action .field{min-width:0!important;margin:0!important}
#modal.wct-modal-progress .field.span-2,
#modal.wct-modal-action .field.span-2{grid-column:1/-1!important}
#modal.wct-modal-progress .field label,
#modal.wct-modal-action .field label{
  display:block!important;margin:0 0 7px!important;color:#425A75!important;
  font-size:11px!important;font-weight:850!important;letter-spacing:.005em!important;
}
#modal.wct-modal-progress .field input:not([type=range]):not([type=checkbox]),
#modal.wct-modal-progress .field select,
#modal.wct-modal-progress .field textarea,
#modal.wct-modal-action .field input:not([type=range]):not([type=checkbox]),
#modal.wct-modal-action .field select,
#modal.wct-modal-action .field textarea{
  display:block!important;width:100%!important;max-width:100%!important;min-height:44px!important;
  box-sizing:border-box!important;padding:11px 13px!important;
  border:1px solid #D7E1ED!important;border-radius:10px!important;
  background:#FFFFFF!important;color:#1C3554!important;
  font-family:inherit!important;font-size:12px!important;font-weight:500!important;line-height:1.5!important;
  box-shadow:0 1px 2px rgba(25,49,79,.025)!important;
}
#modal.wct-modal-progress .field textarea,
#modal.wct-modal-action .field textarea{
  min-height:94px!important;resize:vertical!important;line-height:1.6!important;
}
#modal.wct-modal-progress .field input:focus,
#modal.wct-modal-progress .field select:focus,
#modal.wct-modal-progress .field textarea:focus,
#modal.wct-modal-action .field input:focus,
#modal.wct-modal-action .field select:focus,
#modal.wct-modal-action .field textarea:focus{
  outline:none!important;border-color:#6F9DD7!important;
  box-shadow:0 0 0 3px rgba(40,100,199,.12)!important;
}
#modal.wct-modal-progress .field input:disabled,
#modal.wct-modal-action .field input:disabled{
  background:#F0F4F9!important;color:#63758B!important;opacity:1!important;
}
#modal.wct-modal-progress .field input::placeholder,
#modal.wct-modal-progress .field textarea::placeholder,
#modal.wct-modal-action .field input::placeholder,
#modal.wct-modal-action .field textarea::placeholder{color:#94A3B5!important;opacity:1!important}
#modal.wct-modal-progress .wct-progress-range-wrap{
  grid-template-columns:minmax(0,1fr) 68px!important;gap:14px!important;padding:13px 15px!important;
  border:1px solid #DCE6F2!important;border-radius:12px!important;background:#FFFFFF!important;
}
#modal.wct-modal-progress .wct-progress-range-wrap input{accent-color:#2864C7!important;min-height:30px!important}
#modal.wct-modal-progress .wct-progress-range-value{
  min-height:38px!important;border-radius:9px!important;background:#EAF2FD!important;
  color:#245B9C!important;font-size:15px!important;
}
#modal.wct-modal-progress .wct-progress-edit-warning{
  margin:0 0 15px!important;padding:12px 14px!important;
  border:1px solid #F0DCA9!important;border-radius:10px!important;
  background:#FFFAED!important;color:#87611D!important;font-size:10px!important;
}
#modal.wct-modal-progress .modal-foot .btn,
#modal.wct-modal-action .modal-foot .btn,
#modal.wct-case-detail-modal .modal-foot .btn{
  min-height:42px!important;padding:9px 15px!important;border-radius:10px!important;font-weight:850!important;
}
#modal.wct-modal-progress .modal-foot .btn-primary,
#modal.wct-modal-action .modal-foot .btn-primary{
  background:#2864C7!important;border-color:#2864C7!important;color:#FFFFFF!important;
  box-shadow:0 5px 13px rgba(40,100,199,.17)!important;
}
#modal.wct-modal-progress .modal-foot .btn:not(.btn-primary),
#modal.wct-modal-action .modal-foot .btn:not(.btn-primary),
#modal.wct-case-detail-modal .modal-foot .btn:not(.btn-primary){
  border:1px solid #D6E1ED!important;background:#FFFFFF!important;color:#38516F!important;
}
#modal.wct-case-detail-modal{
  background:#F4F7FB!important;overflow:hidden!important;
}
#modal.wct-case-detail-modal .modal-body.wct-case-detail{
  display:grid!important;gap:14px!important;padding:18px 20px 22px!important;
  background:#F4F7FB!important;color:#243B57!important;
}
#modal.wct-case-detail-modal .wct-case-detail-toolbar{
  justify-content:flex-end!important;gap:8px!important;
}
#modal.wct-case-detail-modal .wct-case-detail-hero{
  border:1px solid #DCE6F2!important;border-radius:16px!important;
  background:linear-gradient(112deg,#FFFFFF 0%,#F1F6FD 65%,#E9F1FC 100%)!important;
  box-shadow:0 7px 18px rgba(24,58,99,.05)!important;
}
#modal.wct-case-detail-modal .wct-case-detail-hero:after{
  background:rgba(40,100,199,.07)!important;
}
#modal.wct-case-detail-modal .wct-case-detail-kicker{color:#2864C7!important}
#modal.wct-case-detail-modal .wct-case-detail-title{color:#173B68!important}
#modal.wct-case-detail-modal .wct-case-detail-subtitle{color:#617792!important}
#modal.wct-case-detail-modal .wct-case-tag{
  border-color:#DCE6F2!important;background:#FFFFFF!important;color:#49627F!important;
}
#modal.wct-case-detail-modal .wct-case-detail-progress{
  background:conic-gradient(#2864C7 var(--wct-progress),#DCE6F2 0)!important;
  box-shadow:0 7px 18px rgba(40,100,199,.12)!important;
}
#modal.wct-case-detail-modal .wct-case-detail-progress:before{background:#FFFFFF!important}
#modal.wct-case-detail-modal .wct-case-detail-progress-inner strong{color:#173B68!important}
#modal.wct-case-detail-modal .wct-case-detail-progress-inner small{color:#70839A!important}
#modal.wct-case-detail-modal .wct-case-meta-tile,
#modal.wct-case-detail-modal .wct-case-section,
#modal.wct-case-detail-modal .wct-case-action,
#modal.wct-case-detail-modal .wct-case-timeline-card{
  border-color:#E0E8F1!important;background:#FFFFFF!important;
  box-shadow:0 4px 13px rgba(25,49,79,.035)!important;
}
#modal.wct-case-detail-modal .wct-case-meta-tile span,
#modal.wct-case-detail-modal .wct-case-action-meta span,
#modal.wct-case-detail-modal .wct-case-section-head p{color:#7588A0!important}
#modal.wct-case-detail-modal .wct-case-meta-tile strong,
#modal.wct-case-detail-modal .wct-case-section-head h3,
#modal.wct-case-detail-modal .wct-case-action h4,
#modal.wct-case-detail-modal .wct-case-timeline-title{color:#1C3554!important}
#modal.wct-case-detail-modal .wct-case-section-head{
  border-bottom-color:#E8EEF5!important;background:#FFFFFF!important;
}
#modal.wct-case-detail-modal .wct-case-section-body{background:#FFFFFF!important}
#modal.wct-case-detail-modal .wct-case-problem,
#modal.wct-case-detail-modal .wct-case-timeline-text{color:#405873!important}
#modal.wct-case-detail-modal .wct-case-action-desc{color:#687E98!important}
#modal.wct-case-detail-modal .wct-case-action-progress span{color:#647B95!important}
#modal.wct-case-detail-modal .wct-case-action-progress strong{color:#245B9C!important}
#modal.wct-case-detail-modal .wct-case-action-track{background:#E7EEF7!important}
#modal.wct-case-detail-modal .wct-case-action-track span{background:linear-gradient(90deg,#2864C7,#79A5DD)!important}
#modal.wct-case-detail-modal .wct-case-action-meta{border-top-color:#E8EEF5!important}
#modal.wct-case-detail-modal .wct-case-action-meta strong{color:#405873!important}
#modal.wct-case-detail-modal .wct-case-empty{
  border-color:#D9E4F0!important;background:#F8FAFD!important;
}
#modal.wct-case-detail-modal .wct-case-empty b{color:#38516F!important}
#modal.wct-case-detail-modal .wct-case-empty span{color:#7A8EA5!important}
#modal.wct-case-detail-modal .wct-case-timeline-meta{color:#8294A9!important}
#modal.wct-case-detail-modal .wct-case-timeline-dot{border-color:#D8E5F4!important;background:#EAF2FD!important;color:#2864C7!important}
#modal.wct-case-detail-modal .wct-case-timeline-item:not(:last-child):before{background:#DCE6F1!important}
#modal.wct-case-detail-modal .wct-case-edited-note{color:#386AA6!important}
@media(max-width:760px){
  #modal.wct-modal-progress .modal-head,
  #modal.wct-modal-action .modal-head,
  #modal.wct-case-detail-modal .modal-head{padding:14px 15px!important}
  #modal.wct-modal-progress .modal-body,
  #modal.wct-modal-action .modal-body,
  #modal.wct-case-detail-modal .modal-body{padding:14px 14px 20px!important}
  #modal.wct-modal-progress .form-grid,
  #modal.wct-modal-action .form-grid{grid-template-columns:minmax(0,1fr)!important;gap:13px!important}
  #modal.wct-modal-progress .field.span-2,
  #modal.wct-modal-action .field.span-2{grid-column:1!important}
  #modal.wct-modal-progress .modal-foot,
  #modal.wct-modal-action .modal-foot,
  #modal.wct-case-detail-modal .modal-foot{
    justify-content:stretch!important;padding:10px 12px calc(10px + env(safe-area-inset-bottom))!important;
  }
  #modal.wct-modal-progress .modal-foot .btn,
  #modal.wct-modal-action .modal-foot .btn{flex:1!important;min-width:0!important}
  #modal.wct-case-detail-modal .modal-body.wct-case-detail{padding:13px!important;gap:11px!important}
  #modal.wct-case-detail-modal .wct-case-detail-hero{grid-template-columns:minmax(0,1fr)!important;padding:16px!important}
  #modal.wct-case-detail-modal .wct-case-meta-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
}
@media(max-width:390px){
  #modal.wct-modal-progress .modal-head h2,
  #modal.wct-modal-action .modal-head h2,
  #modal.wct-case-detail-modal .modal-head h2{font-size:16px!important}
  #modal.wct-case-detail-modal .wct-case-meta-grid{grid-template-columns:minmax(0,1fr)!important}
}
`;
  const runtime = String.raw`
(function(){
  if(window.__WCT_PICAPA_MODAL_POLISH__)return;
  window.__WCT_PICAPA_MODAL_POLISH__=true;
  function classify(){
    var modal=document.getElementById('modal');
    if(!modal)return;
    modal.classList.remove('wct-modal-progress','wct-modal-action');
    var progress=modal.querySelector('form[onsubmit*="submitProgress"]');
    var action=modal.querySelector('form[onsubmit*="submitAction"]');
    if(progress)modal.classList.add('wct-modal-progress');
    else if(action)modal.classList.add('wct-modal-action');
    if(modal.querySelector('.wct-case-detail'))modal.classList.add('wct-case-detail-modal');
  }
  function init(){
    var modal=document.getElementById('modal');
    if(!modal)return;
    classify();
    var observer=new MutationObserver(function(){classify();});
    observer.observe(modal,{childList:true,subtree:true});
    window.WCTPicapaModalPolishReady=true;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
`;
  return html.replace('</body>', '<style id="wct-picapa-modal-polish-style">' + css + '</style><script id="wct-picapa-modal-polish">' + runtime + '</script></body>');
};
