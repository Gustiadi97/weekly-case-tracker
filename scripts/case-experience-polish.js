module.exports = function applyCaseExperiencePolish(html) {
  if (!html || !html.includes('</body>')) throw new Error('Could not find document body for Case experience polish.');

  const css = String.raw`
/* ------------------------------------------------------------------
   Case detail: readable, contained, light cards and stable spacing.
------------------------------------------------------------------- */
#modal.wct-case-side-drawer.wct-case-detail-modal{
  width:min(1080px,92vw)!important;max-width:1080px!important;
  background:#F4F7FB!important;border-color:#DCE4ED!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal>.modal-head{
  padding:18px 24px!important;background:#FFFFFF!important;border-bottom:1px solid #E4EAF1!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal>.modal-head h2{
  color:#25364B!important;font-size:18px!important;font-weight:900!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal>.modal-head .eyebrow{
  color:#B87900!important;font-size:9px!important;font-weight:950!important;letter-spacing:.13em!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal>.modal-head p,
#modal.wct-case-side-drawer.wct-case-detail-modal>.modal-head .sub{
  color:#8190A2!important;font-size:10px!important;line-height:1.55!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal>.modal-body.wct-case-detail{
  display:grid!important;grid-auto-rows:max-content!important;gap:14px!important;
  width:100%!important;min-width:0!important;min-height:0!important;max-height:none!important;
  box-sizing:border-box!important;overflow-x:hidden!important;overflow-y:auto!important;
  padding:18px 22px 24px!important;background:#F3F6FA!important;color:#33465C!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-detail-toolbar{
  display:flex!important;align-items:center!important;justify-content:flex-end!important;
  flex-wrap:wrap!important;gap:8px!important;margin:0!important;padding:0 0 2px!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-detail-toolbar .btn{
  min-height:39px!important;padding:9px 14px!important;border-radius:9px!important;
  font-size:10px!important;font-weight:900!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-detail-hero{
  display:grid!important;grid-template-columns:minmax(0,1fr) 112px!important;
  align-items:center!important;gap:18px!important;min-width:0!important;min-height:132px!important;
  box-sizing:border-box!important;margin:0!important;padding:20px 22px!important;
  overflow:hidden!important;border:1px solid #E6D8B9!important;border-radius:16px!important;
  background:linear-gradient(115deg,#FFFFFF 0%,#FFFAF0 100%)!important;
  box-shadow:0 5px 16px rgba(31,47,67,.045)!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-detail-hero>div:first-child{min-width:0!important}
#modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-detail-kicker{
  display:flex!important;align-items:center!important;gap:8px!important;flex-wrap:wrap!important;
  color:#94630F!important;font-size:9px!important;font-weight:950!important;letter-spacing:.08em!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-detail-title{
  display:block!important;max-width:100%!important;margin:10px 0 6px!important;
  color:#29394D!important;font-size:20px!important;font-weight:900!important;line-height:1.35!important;
  letter-spacing:-.025em!important;white-space:normal!important;overflow-wrap:anywhere!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-detail-subtitle{
  display:block!important;max-width:100%!important;margin:0!important;color:#748398!important;
  font-size:10px!important;line-height:1.6!important;overflow-wrap:anywhere!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-detail-tags{
  display:flex!important;align-items:center!important;flex-wrap:wrap!important;gap:6px!important;margin-top:11px!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-detail-tags .wct-case-tag{
  padding:6px 9px!important;border:1px solid #E8E1D4!important;border-radius:8px!important;
  background:#FFFFFF!important;color:#687587!important;font-size:9px!important;font-weight:800!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-detail-progress{
  width:102px!important;height:102px!important;justify-self:end!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-detail-progress-inner{
  display:flex!important;align-items:center!important;justify-content:center!important;
  flex-direction:column!important;gap:2px!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-detail-progress-inner strong{
  color:#83580A!important;font-size:21px!important;font-weight:950!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-detail-progress-inner small{
  color:#8B806D!important;font-size:8px!important;font-weight:800!important;text-align:center!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-meta-grid{
  display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;
  gap:9px!important;width:100%!important;margin:0!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-meta-tile{
  display:flex!important;flex-direction:column!important;justify-content:center!important;gap:7px!important;
  min-width:0!important;min-height:76px!important;box-sizing:border-box!important;
  padding:13px 14px!important;border:1px solid #E1E7EF!important;border-radius:12px!important;
  background:#FFFFFF!important;box-shadow:0 3px 10px rgba(30,48,70,.025)!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-meta-tile span{
  color:#8793A3!important;font-size:8px!important;font-weight:900!important;letter-spacing:.09em!important;
  text-transform:uppercase!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-meta-tile strong{
  display:block!important;min-width:0!important;color:#2E4057!important;font-size:11px!important;
  font-weight:900!important;line-height:1.45!important;white-space:normal!important;overflow-wrap:anywhere!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-section{
  display:block!important;min-width:0!important;width:100%!important;max-width:100%!important;
  margin:0!important;overflow:hidden!important;box-sizing:border-box!important;
  border:1px solid #DFE6EE!important;border-radius:14px!important;background:#FFFFFF!important;
  box-shadow:0 4px 13px rgba(30,48,70,.035)!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-section-head{
  display:flex!important;align-items:center!important;justify-content:space-between!important;
  flex-wrap:wrap!important;gap:10px!important;min-height:0!important;box-sizing:border-box!important;
  padding:14px 17px!important;border:0!important;border-bottom:1px solid #E9EEF3!important;
  background:#FFFFFF!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-section-head h3{
  margin:0!important;color:#2D4057!important;font-size:12px!important;font-weight:950!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-section-head p{
  margin:4px 0 0!important;color:#8794A4!important;font-size:9px!important;line-height:1.5!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-section-body{
  display:block!important;width:100%!important;min-width:0!important;max-width:100%!important;
  height:auto!important;max-height:none!important;min-height:0!important;overflow:visible!important;
  box-sizing:border-box!important;padding:15px 17px 17px!important;
  background:#FFFFFF!important;color:#3E5067!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-problem{
  display:block!important;width:100%!important;max-width:100%!important;min-width:0!important;
  min-height:70px!important;box-sizing:border-box!important;margin:0!important;padding:15px 16px!important;
  border:1px solid #E6EBF1!important;border-radius:11px!important;background:#F7F9FC!important;
  color:#40536A!important;font-size:11px!important;font-weight:550!important;line-height:1.75!important;
  white-space:pre-wrap!important;overflow-wrap:anywhere!important;word-break:break-word!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal .wct-action-table-wrap{
  display:block!important;width:100%!important;max-width:100%!important;min-width:0!important;
  box-sizing:border-box!important;overflow-x:auto!important;overflow-y:hidden!important;
  background:#FFFFFF!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal .wct-action-table{
  width:100%!important;min-width:700px!important;background:#FFFFFF!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-timeline{
  display:grid!important;gap:11px!important;width:100%!important;min-width:0!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-timeline-card{
  min-width:0!important;box-sizing:border-box!important;padding:14px 15px!important;
  border:1px solid #E4EAF1!important;border-radius:12px!important;background:#F9FBFD!important;
  color:#42556B!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-timeline-title{
  color:#2C4057!important;font-size:11px!important;font-weight:900!important;line-height:1.5!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-timeline-text{
  margin:9px 0 0!important;color:#596A7E!important;font-size:10px!important;line-height:1.7!important;
  white-space:pre-wrap!important;overflow-wrap:anywhere!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-timeline-meta{
  color:#8794A4!important;font-size:9px!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-empty{
  padding:17px!important;border:1px dashed #DCE4ED!important;border-radius:11px!important;
  background:#F8FAFC!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-empty b{color:#344A63!important;font-size:11px!important}
#modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-empty span{color:#8290A1!important;font-size:10px!important;line-height:1.6!important}
#modal.wct-case-side-drawer.wct-case-detail-modal>.modal-foot{
  display:flex!important;justify-content:flex-end!important;align-items:center!important;
  flex:0 0 auto!important;padding:10px 18px calc(10px + env(safe-area-inset-bottom))!important;
  border-top:1px solid #E1E8F0!important;background:#FFFFFF!important;
}
#modal.wct-case-side-drawer.wct-case-detail-modal>.modal-foot .btn{
  min-height:38px!important;padding:8px 15px!important;border-radius:9px!important;
  border:1px solid #E0E6EE!important;background:#FFFFFF!important;color:#586A7E!important;
  font-size:10px!important;font-weight:900!important;
}

/* ------------------------------------------------------------------
   Action editor: consistent light canvas, high-contrast form fields.
   The Action form stays a centered modal and does not inherit the
   Case detail side-drawer or the global dark Action surfaces.
------------------------------------------------------------------- */
#modal.wct-action-form-modal{
  display:flex!important;flex-direction:column!important;align-items:stretch!important;
  width:min(900px,calc(100vw - 48px))!important;max-width:900px!important;
  height:min(86dvh,820px)!important;max-height:calc(100dvh - 36px)!important;min-height:0!important;
  margin:auto!important;padding:0!important;overflow:hidden!important;
  border:1px solid #DCE5EF!important;border-radius:18px!important;
  background:#FFFFFF!important;color:#2E4057!important;
  box-shadow:0 26px 80px rgba(17,34,55,.22)!important;
}
#modal.wct-action-form-modal>.modal-head{
  position:relative!important;z-index:5!important;display:flex!important;align-items:flex-start!important;
  justify-content:space-between!important;gap:16px!important;flex:0 0 auto!important;
  margin:0!important;padding:19px 24px!important;border-bottom:1px solid #E7EDF4!important;
  background:#FFFFFF!important;
}
#modal.wct-action-form-modal>.modal-head .eyebrow{
  color:#B87900!important;font-size:9px!important;font-weight:950!important;letter-spacing:.13em!important;
}
#modal.wct-action-form-modal>.modal-head h2{
  margin:5px 0 4px!important;color:#293B51!important;font-size:18px!important;font-weight:900!important;
}
#modal.wct-action-form-modal>.modal-head p,
#modal.wct-action-form-modal>.modal-head .sub{
  margin:0!important;color:#8190A2!important;font-size:10px!important;line-height:1.55!important;
}
#modal.wct-action-form-modal>.modal-head .close{
  display:grid!important;place-items:center!important;width:37px!important;height:37px!important;
  border:1px solid #DFE6EE!important;border-radius:10px!important;background:#F7F9FB!important;color:#52657B!important;
}
#modal.wct-action-form-modal>.modal-body,
#modal.wct-action-form-modal>.modal-body.wct-flow-modal-body{
  display:block!important;flex:1 1 auto!important;min-height:0!important;max-height:none!important;
  overflow-y:auto!important;overflow-x:hidden!important;overscroll-behavior:contain!important;
  -webkit-overflow-scrolling:touch!important;box-sizing:border-box!important;
  padding:20px 22px 24px!important;background:#F4F7FB!important;color:#344A62!important;
}
#modal.wct-action-form-modal .wct-flow-form-top{
  display:block!important;box-sizing:border-box!important;margin:0!important;padding:16px 19px!important;
  border:1px solid #DFE7EF!important;border-bottom:0!important;border-radius:13px 13px 0 0!important;
  background:#FFFFFF!important;color:#334960!important;
}
#modal.wct-action-form-modal .wct-flow-form-top h2{
  margin:0!important;color:#2C4058!important;font-size:14px!important;font-weight:950!important;
}
#modal.wct-action-form-modal .wct-flow-form-top p{
  margin:5px 0 0!important;color:#8190A2!important;font-size:10px!important;line-height:1.6!important;
}
#modal.wct-action-form-modal form,
#modal.wct-action-form-modal form#wctActionForm{
  display:flex!important;flex-direction:column!important;min-width:0!important;
  margin:0!important;border:1px solid #DFE7EF!important;border-radius:0 0 13px 13px!important;
  background:#FFFFFF!important;color:#344A62!important;overflow:visible!important;
}
#modal.wct-action-form-modal .wct-flow-form-body{
  display:block!important;min-width:0!important;box-sizing:border-box!important;
  padding:19px 19px 21px!important;background:#FFFFFF!important;color:#344A62!important;
}
#modal.wct-action-form-modal .wct-flow-context{
  display:flex!important;align-items:center!important;gap:12px!important;
  margin:0 0 18px!important;padding:13px 15px!important;
  border:1px solid #DFE8F1!important;border-radius:11px!important;
  background:linear-gradient(110deg,#F4F8FC 0%,#FFFFFF 100%)!important;color:#344A62!important;
}
#modal.wct-action-form-modal .wct-flow-context-icon{
  display:grid!important;place-items:center!important;width:36px!important;height:36px!important;
  flex:0 0 36px!important;border-radius:10px!important;background:#EAF1F8!important;
  color:#345F8B!important;font-size:11px!important;font-weight:950!important;
}
#modal.wct-action-form-modal .wct-flow-context-main{min-width:0!important;flex:1!important}
#modal.wct-action-form-modal .wct-flow-context-main strong{
  display:block!important;color:#2F435A!important;font-size:12px!important;font-weight:950!important;
}
#modal.wct-action-form-modal .wct-flow-context-main small{
  display:block!important;margin-top:4px!important;color:#8291A3!important;font-size:9px!important;line-height:1.55!important;
}
#modal.wct-action-form-modal .section-title{
  margin:17px 0 13px!important;padding:0 0 9px!important;border-bottom:1px solid #E7EDF3!important;
  background:transparent!important;color:#6B7F96!important;font-size:10px!important;
  font-weight:950!important;letter-spacing:.1em!important;text-transform:uppercase!important;
}
#modal.wct-action-form-modal .form-grid{
  display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;
  align-items:start!important;gap:16px 18px!important;background:#FFFFFF!important;
}
#modal.wct-action-form-modal .field{
  display:flex!important;flex-direction:column!important;gap:7px!important;
  min-width:0!important;margin:0!important;padding:0!important;background:transparent!important;
}
#modal.wct-action-form-modal .field.span-2{grid-column:1/-1!important}
#modal.wct-action-form-modal .field label{
  display:block!important;margin:0!important;color:#42566E!important;
  font-size:10px!important;font-weight:900!important;line-height:1.5!important;
}
#modal.wct-action-form-modal .field input:not([type=range]):not([type=checkbox]),
#modal.wct-action-form-modal .field select,
#modal.wct-action-form-modal .field textarea{
  display:block!important;width:100%!important;max-width:100%!important;min-width:0!important;
  min-height:45px!important;box-sizing:border-box!important;padding:11px 13px!important;
  border:1px solid #D9E2EC!important;border-radius:10px!important;background:#FFFFFF!important;
  color:#2E425A!important;font-family:inherit!important;font-size:11px!important;font-weight:550!important;
  line-height:1.55!important;box-shadow:0 1px 2px rgba(20,40,64,.025)!important;outline:none!important;
}
#modal.wct-action-form-modal .field textarea{min-height:112px!important;resize:vertical!important;line-height:1.7!important}
#modal.wct-action-form-modal .field input:focus,
#modal.wct-action-form-modal .field select:focus,
#modal.wct-action-form-modal .field textarea:focus{
  border-color:#DFA12C!important;box-shadow:0 0 0 3px rgba(223,161,44,.13)!important;
}
#modal.wct-action-form-modal .field input::placeholder,
#modal.wct-action-form-modal .field textarea::placeholder{color:#98A5B4!important;opacity:1!important}
#modal.wct-action-form-modal .wct-flow-help{
  margin:16px 19px 18px!important;padding:12px 14px!important;
  border:1px solid #E4EAF1!important;border-radius:10px!important;
  background:#F7F9FC!important;color:#718196!important;font-size:10px!important;line-height:1.6!important;
}
#modal.wct-action-form-modal .wct-flow-help strong{color:#425F7E!important}
#modal.wct-action-form-modal .wct-flow-form-footer{
  position:sticky!important;bottom:0!important;z-index:8!important;
  display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:9px!important;
  flex:0 0 auto!important;margin:0!important;padding:12px 18px!important;
  border-top:1px solid #E4EAF1!important;border-radius:0 0 13px 13px!important;
  background:rgba(255,255,255,.98)!important;box-shadow:0 -5px 15px rgba(24,44,67,.045)!important;
}
#modal.wct-action-form-modal .wct-flow-form-footer-note{
  margin-right:auto!important;color:#8794A4!important;font-size:9px!important;
}
#modal.wct-action-form-modal .wct-flow-form-footer .btn{
  display:inline-flex!important;align-items:center!important;justify-content:center!important;
  min-height:40px!important;padding:9px 15px!important;border-radius:9px!important;
  font-size:10px!important;font-weight:900!important;
}
#modal.wct-action-form-modal .wct-flow-form-footer .btn-primary{
  border:1px solid #D6951C!important;background:#E7A329!important;color:#293548!important;
  box-shadow:0 3px 9px rgba(199,135,22,.15)!important;
}
#modal.wct-action-form-modal .wct-flow-form-footer .btn:not(.btn-primary){
  border:1px solid #DDE5ED!important;background:#FFFFFF!important;color:#5D6E81!important;
}
@media(max-width:760px){
  #modal.wct-case-side-drawer.wct-case-detail-modal{width:100vw!important;max-width:100vw!important}
  #modal.wct-case-side-drawer.wct-case-detail-modal>.modal-head{padding:14px 15px!important}
  #modal.wct-case-side-drawer.wct-case-detail-modal>.modal-body.wct-case-detail{gap:10px!important;padding:12px 11px 18px!important}
  #modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-detail-hero{
    grid-template-columns:minmax(0,1fr) 78px!important;gap:10px!important;padding:14px!important;
  }
  #modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-detail-title{font-size:16px!important}
  #modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-detail-progress{width:72px!important;height:72px!important}
  #modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-detail-progress-inner strong{font-size:16px!important}
  #modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-meta-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:7px!important}
  #modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-meta-tile{min-height:68px!important;padding:10px!important}
  #modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-section-head{padding:12px!important}
  #modal.wct-case-side-drawer.wct-case-detail-modal .wct-case-section-body{padding:11px!important}
  #modal.wct-action-form-modal{
    width:calc(100vw - 16px)!important;max-width:calc(100vw - 16px)!important;
    height:calc(100dvh - 16px)!important;max-height:calc(100dvh - 16px)!important;border-radius:14px!important;
  }
  #modal.wct-action-form-modal>.modal-head{padding:14px 15px!important}
  #modal.wct-action-form-modal>.modal-head h2{font-size:16px!important}
  #modal.wct-action-form-modal>.modal-body,
  #modal.wct-action-form-modal>.modal-body.wct-flow-modal-body{padding:12px!important}
  #modal.wct-action-form-modal .wct-flow-form-top{padding:13px!important}
  #modal.wct-action-form-modal .wct-flow-form-body{padding:13px!important}
  #modal.wct-action-form-modal .form-grid{grid-template-columns:minmax(0,1fr)!important;gap:13px!important}
  #modal.wct-action-form-modal .field.span-2{grid-column:1!important}
  #modal.wct-action-form-modal .wct-flow-form-footer{gap:7px!important;padding:10px 11px calc(10px + env(safe-area-inset-bottom))!important}
  #modal.wct-action-form-modal .wct-flow-form-footer-note{display:none!important}
  #modal.wct-action-form-modal .wct-flow-form-footer .btn{flex:1!important;min-width:0!important;padding:8px 9px!important}
}
@media(min-width:761px) and (max-width:1000px){
  #modal.wct-case-side-drawer.wct-case-detail-modal{width:94vw!important;max-width:94vw!important}
}
`;

  const runtime = String.raw`
(function(){
  'use strict';
  if(window.__WCT_CASE_EXPERIENCE_POLISH__)return;
  window.__WCT_CASE_EXPERIENCE_POLISH__=true;
  var modal=document.getElementById('modal');
  if(!modal)return;

  function normalize(){
    var detail=modal.querySelector('.wct-case-detail');
    var actionForm=modal.querySelector('#wctActionForm,form[onsubmit*="submitAction"]');
    if(detail){
      modal.classList.add('wct-case-detail-modal','wct-case-side-drawer');
      modal.classList.remove('wct-action-form-modal');
      return;
    }
    if(actionForm){
      modal.classList.add('wct-action-form-modal');
      modal.classList.remove('wct-case-side-drawer','wct-case-action-drawer','wct-case-edit-drawer');
      actionForm.classList.add('wct-action-form');
      return;
    }
    modal.classList.remove('wct-action-form-modal');
  }
  var queued=false;
  function schedule(){
    if(queued)return;
    queued=true;
    window.setTimeout(function(){queued=false;normalize();},35);
  }
  new MutationObserver(schedule).observe(modal,{childList:true,subtree:true});
  normalize();
  window.addEventListener('resize',schedule,{passive:true});
  window.addEventListener('orientationchange',schedule,{passive:true});
  window.WCTCaseExperiencePolishReady=true;
})();
`;

  return html.replace('</body>', '<style id="wct-case-experience-polish-style">' + css + '</style><script id="wct-case-experience-polish">' + runtime + '</script></body>');
};
