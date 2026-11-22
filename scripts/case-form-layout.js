module.exports = function applyCaseFormLayout(html) {
  if (!html || !html.includes('</body>')) throw new Error('Could not find document body for Case form layout.');

  const css = String.raw`
/* Shared layout for Create Case and Edit Case. */
#modalBackdrop.show:has(#modal.wct-case-workspace-modal){
  display:flex!important;align-items:center!important;justify-content:center!important;
  padding:18px!important;background:rgba(18,31,48,.42)!important;
  backdrop-filter:blur(4px)!important;overflow:hidden!important;
}
#modal.wct-case-workspace-modal{
  display:flex!important;flex-direction:column!important;align-items:stretch!important;
  width:min(1060px,calc(100vw - 48px))!important;max-width:1060px!important;
  height:min(90dvh,900px)!important;max-height:calc(100dvh - 36px)!important;min-height:0!important;
  margin:auto!important;padding:0!important;overflow:hidden!important;
  border:1px solid #DCE4ED!important;border-radius:20px!important;
  background:#fff!important;color:#26364A!important;
  box-shadow:0 28px 90px rgba(14,29,48,.24)!important;
  animation:wctCaseFormEnter .2s ease-out both!important;
}
#modal.wct-case-workspace-modal>.modal-head{
  position:relative!important;z-index:5!important;display:flex!important;align-items:flex-start!important;
  justify-content:space-between!important;gap:18px!important;flex:0 0 auto!important;
  margin:0!important;padding:23px 30px 19px!important;
  border-bottom:1px solid #E9EEF4!important;background:#fff!important;
}
#modal.wct-case-workspace-modal>.modal-head .eyebrow{
  color:#B87900!important;font-size:9px!important;font-weight:950!important;letter-spacing:.14em!important;
}
#modal.wct-case-workspace-modal>.modal-head h2{
  margin:6px 0 5px!important;color:#243449!important;font-size:22px!important;
  line-height:1.25!important;font-weight:900!important;letter-spacing:-.035em!important;
}
#modal.wct-case-workspace-modal>.modal-head p,
#modal.wct-case-workspace-modal>.modal-head .sub{
  max-width:760px!important;margin:0!important;color:#7E8B9D!important;
  font-size:11px!important;line-height:1.6!important;
}
#modal.wct-case-workspace-modal>.modal-head .close{
  display:grid!important;place-items:center!important;width:38px!important;height:38px!important;
  min-width:38px!important;border:1px solid #E1E7EF!important;border-radius:11px!important;
  background:#F8FAFC!important;color:#526174!important;font-size:17px!important;
}
#modal.wct-case-workspace-modal>form.wct-case-form-unified{
  display:flex!important;flex:1 1 auto!important;flex-direction:column!important;
  min-width:0!important;min-height:0!important;max-height:none!important;overflow:hidden!important;
}
#modal.wct-case-workspace-modal .modal-body.wct-case-form-body{
  display:block!important;flex:1 1 auto!important;min-width:0!important;min-height:0!important;
  max-height:none!important;overflow-y:auto!important;overflow-x:hidden!important;
  overscroll-behavior:contain!important;-webkit-overflow-scrolling:touch!important;
  padding:24px 30px 28px!important;background:#F7F9FC!important;color:#304158!important;
}
#modal.wct-case-workspace-modal .wct-case-editor-intro{
  display:flex!important;align-items:flex-start!important;gap:13px!important;
  margin:0 0 23px!important;padding:15px 17px!important;
  border:1px solid #E5EAF1!important;border-radius:13px!important;
  background:linear-gradient(110deg,#fff 0%,#F9FBFD 100%)!important;
}
#modal.wct-case-workspace-modal .wct-case-editor-intro-mark{
  display:grid!important;place-items:center!important;width:34px!important;height:34px!important;
  flex:0 0 34px!important;border-radius:10px!important;background:#FFF3D8!important;
  color:#A86D08!important;font-size:15px!important;
}
#modal.wct-case-workspace-modal .wct-case-editor-intro strong{
  display:block!important;color:#304158!important;font-size:12px!important;font-weight:900!important;
}
#modal.wct-case-workspace-modal .wct-case-editor-intro p{
  margin:4px 0 0!important;color:#78879A!important;font-size:10px!important;line-height:1.65!important;
}
#modal.wct-case-workspace-modal .wct-case-form-layout{display:grid!important;gap:23px!important;width:100%!important;max-width:none!important}
#modal.wct-case-workspace-modal .wct-case-form-section{
  min-width:0!important;padding:0 0 22px!important;border-bottom:1px solid #E5EAF0!important;
}
#modal.wct-case-workspace-modal .wct-case-form-section:last-child{padding-bottom:0!important;border-bottom:0!important}
#modal.wct-case-workspace-modal .wct-case-form-section-head{
  display:flex!important;align-items:flex-start!important;gap:11px!important;margin:0 0 16px!important;
}
#modal.wct-case-workspace-modal .wct-case-form-section-index{
  display:grid!important;place-items:center!important;width:27px!important;height:27px!important;
  flex:0 0 27px!important;border-radius:8px!important;background:#FFF4DF!important;
  color:#99630B!important;font-size:10px!important;font-weight:950!important;
}
#modal.wct-case-workspace-modal .wct-case-form-section-copy{min-width:0!important}
#modal.wct-case-workspace-modal .wct-case-form-section-title{
  display:block!important;margin:0!important;color:#34465C!important;
  font-size:12px!important;font-weight:950!important;letter-spacing:.055em!important;
}
#modal.wct-case-workspace-modal .wct-case-form-section-description{
  display:block!important;margin:4px 0 0!important;color:#8995A5!important;
  font-size:10px!important;line-height:1.55!important;
}
#modal.wct-case-workspace-modal .wct-case-form-grid{
  display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;
  align-items:start!important;gap:18px 22px!important;width:100%!important;max-width:none!important;
}
#modal.wct-case-workspace-modal .wct-case-form-grid>.field,
#modal.wct-case-workspace-modal .wct-case-form-grid>.field.span-2{
  display:flex!important;flex-direction:column!important;align-items:stretch!important;
  gap:8px!important;min-width:0!important;width:100%!important;max-width:none!important;
  margin:0!important;padding:0!important;background:transparent!important;
}
#modal.wct-case-workspace-modal .wct-case-form-grid>.field.wct-case-form-wide,
#modal.wct-case-workspace-modal .wct-case-form-grid>.field.span-2{
  grid-column:1/-1!important;
}
#modal.wct-case-workspace-modal .wct-case-form-grid .field>label{
  display:block!important;margin:0!important;color:#40536B!important;
  font-size:11px!important;font-weight:900!important;line-height:1.45!important;
}
#modal.wct-case-workspace-modal .wct-case-form-grid .field input:not([type=checkbox]):not([type=range]),
#modal.wct-case-workspace-modal .wct-case-form-grid .field select,
#modal.wct-case-workspace-modal .wct-case-form-grid .field textarea{
  display:block!important;width:100%!important;max-width:100%!important;min-width:0!important;
  min-height:46px!important;box-sizing:border-box!important;padding:11px 14px!important;
  border:1px solid #D9E2EC!important;border-radius:11px!important;background:#fff!important;
  color:#293B52!important;font-family:inherit!important;font-size:12px!important;font-weight:550!important;
  line-height:1.5!important;outline:none!important;box-shadow:0 1px 2px rgba(22,42,66,.025)!important;
  transition:border-color .16s,box-shadow .16s,background .16s!important;
}
#modal.wct-case-workspace-modal .wct-case-form-grid .field textarea{
  min-height:158px!important;resize:vertical!important;line-height:1.7!important;
}
#modal.wct-case-workspace-modal .wct-case-form-grid .field:has([name="title"]) input[name="title"]{
  min-height:56px!important;padding:14px 16px!important;font-size:14px!important;font-weight:750!important;letter-spacing:-.01em!important;
  background:#FFFFFF!important;border-color:#CBD7E4!important;
}
#modal.wct-case-workspace-modal .wct-case-form-grid .field input:focus,
#modal.wct-case-workspace-modal .wct-case-form-grid .field select:focus,
#modal.wct-case-workspace-modal .wct-case-form-grid .field textarea:focus{
  border-color:#DFA12C!important;background:#fff!important;
  box-shadow:0 0 0 3px rgba(223,161,44,.14)!important;
}
#modal.wct-case-workspace-modal .wct-case-form-grid .field input::placeholder,
#modal.wct-case-workspace-modal .wct-case-form-grid .field textarea::placeholder{color:#A0AAB8!important;opacity:1!important}
#modal.wct-case-workspace-modal .wct-case-form-grid .wct-multi-picker{
  display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;
  align-items:stretch!important;gap:8px!important;width:100%!important;margin:1px 0 0!important;
}
/* Dropdown multi-select for HUB and Division. Checkbox values remain native form controls. */
#modal.wct-case-workspace-modal .wct-case-form-grid .wct-multi-select{
  position:relative!important;display:block!important;width:100%!important;margin:0!important;
}
#modal.wct-case-workspace-modal .wct-multi-select-trigger{
  display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important;
  width:100%!important;min-height:48px!important;box-sizing:border-box!important;padding:11px 14px!important;
  border:1px solid #D9E2EC!important;border-radius:11px!important;background:#FFFFFF!important;
  color:#455970!important;font-family:inherit!important;font-size:12px!important;font-weight:750!important;
  text-align:left!important;cursor:pointer!important;box-shadow:0 1px 2px rgba(22,42,66,.025)!important;
}
#modal.wct-case-workspace-modal .wct-multi-select-trigger:hover,
#modal.wct-case-workspace-modal .wct-multi-select.is-open .wct-multi-select-trigger{
  border-color:#DFA12C!important;background:#FFFEFB!important;box-shadow:0 0 0 3px rgba(223,161,44,.10)!important;
}
#modal.wct-case-workspace-modal .wct-multi-select-trigger-label{
  display:block!important;min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;
  white-space:nowrap!important;color:#51647A!important;
}
#modal.wct-case-workspace-modal .wct-multi-select-trigger-label.is-placeholder{color:#96A2B1!important;font-weight:600!important}
#modal.wct-case-workspace-modal .wct-multi-select-chevron{
  flex:0 0 auto!important;color:#8290A1!important;font-size:13px!important;transition:transform .16s!important;
}
#modal.wct-case-workspace-modal .wct-multi-select.is-open .wct-multi-select-chevron{transform:rotate(180deg)!important}
#modal.wct-case-workspace-modal .wct-multi-select-panel{
  position:absolute!important;top:calc(100% + 7px)!important;left:0!important;right:0!important;z-index:60!important;
  display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:7px!important;
  max-height:245px!important;overflow:auto!important;overscroll-behavior:contain!important;
  box-sizing:border-box!important;padding:11px!important;border:1px solid #DFE6EE!important;
  border-radius:12px!important;background:#FFFFFF!important;box-shadow:0 16px 34px rgba(28,45,65,.16)!important;
}
#modal.wct-case-workspace-modal .wct-multi-select-panel[hidden]{display:none!important}
#modal.wct-case-workspace-modal .wct-multi-select-panel .wct-choice-chip{
  display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:9px!important;
  min-width:0!important;width:100%!important;min-height:40px!important;box-sizing:border-box!important;
  padding:9px 11px!important;border:1px solid #E1E7EE!important;border-radius:9px!important;
  background:#FBFCFE!important;color:#53647A!important;font-size:10px!important;font-weight:800!important;
}
#modal.wct-case-workspace-modal .wct-multi-select-panel .wct-choice-chip:has(input:checked){
  border-color:#E0A12C!important;background:#FFF7E6!important;color:#805500!important;
  box-shadow:inset 3px 0 0 #E0A12C!important;
}
#modal.wct-case-workspace-modal .wct-picker-hint{margin-top:6px!important}

/* Category remains a single-choice button group, not a multi-select dropdown. */
#modal.wct-case-workspace-modal .wct-category-native{
  position:absolute!important;width:1px!important;height:1px!important;min-height:1px!important;
  padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;
  white-space:nowrap!important;border:0!important;opacity:0!important;pointer-events:none!important;
}
#modal.wct-case-workspace-modal .wct-category-buttons{
  display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:8px!important;width:100%!important;
}
#modal.wct-case-workspace-modal .wct-category-choice{
  display:flex!important;align-items:center!important;justify-content:center!important;
  min-width:0!important;min-height:40px!important;padding:9px 10px!important;box-sizing:border-box!important;
  border:1px solid #DDE5ED!important;border-radius:10px!important;background:#FFFFFF!important;
  color:#596A7F!important;font-size:10px!important;font-weight:850!important;line-height:1.35!important;
  text-align:center!important;cursor:pointer!important;transition:all .15s!important;
}
#modal.wct-case-workspace-modal .wct-category-choice:hover{border-color:#E5BD72!important;background:#FFFCF5!important}
#modal.wct-case-workspace-modal .wct-category-choice.is-selected{
  border-color:#E0A12C!important;background:#FFF5DF!important;color:#895B0A!important;
  box-shadow:inset 0 0 0 1px rgba(224,161,44,.10)!important;
}
#modal.wct-case-workspace-modal .wct-case-form-grid .field:has([name="title"]) input[name="title"]{
  min-height:58px!important;padding:14px 16px!important;font-size:14px!important;font-weight:750!important;
}
@media(max-width:760px){
  #modal.wct-case-workspace-modal .wct-multi-select-panel{grid-template-columns:minmax(0,1fr)!important;max-height:220px!important}
  #modal.wct-case-workspace-modal .wct-category-buttons{grid-template-columns:repeat(2,minmax(0,1fr))!important}
}
#modal.wct-case-workspace-modal .wct-case-form-grid .wct-choice-chip{
  display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:10px!important;
  width:100%!important;min-height:43px!important;box-sizing:border-box!important;padding:10px 13px!important;
  border:1px solid #DDE5ED!important;border-radius:10px!important;background:#FBFCFE!important;
  color:#4D5D72!important;font-size:11px!important;font-weight:850!important;cursor:pointer!important;
  transition:border-color .16s,background .16s,color .16s,box-shadow .16s!important;
}
#modal.wct-case-workspace-modal .wct-case-form-grid .wct-choice-chip input{
  width:15px!important;height:15px!important;min-height:15px!important;margin:0!important;
  accent-color:#D9951F!important;cursor:pointer!important;
}
#modal.wct-case-workspace-modal .wct-case-form-grid .wct-choice-chip:has(input:checked){
  border-color:#E0A12C!important;background:#FFF8E9!important;color:#805500!important;
  box-shadow:inset 3px 0 0 #E0A12C,0 0 0 2px rgba(224,161,44,.07)!important;
}
#modal.wct-case-workspace-modal .wct-picker-hint{
  display:block!important;margin:0!important;color:#8895A6!important;font-size:10px!important;line-height:1.5!important;
}
#modal.wct-case-workspace-modal .wct-priority-buttons{
  display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;
  gap:10px!important;width:100%!important;max-width:760px!important;margin:0!important;
}
#modal.wct-case-workspace-modal .wct-priority-choice{
  display:flex!important;align-items:center!important;justify-content:center!important;
  min-height:46px!important;padding:10px 14px!important;border:1px solid #DFE5EC!important;
  border-radius:11px!important;background:#fff!important;color:#657286!important;
  font-size:12px!important;font-weight:900!important;cursor:pointer!important;
}
#modal.wct-case-workspace-modal .wct-priority-choice.high.is-selected{border-color:#DE7278!important;background:#FFF0F0!important;color:#A83D46!important;box-shadow:0 0 0 2px rgba(222,114,120,.1)!important}
#modal.wct-case-workspace-modal .wct-priority-choice.medium.is-selected{border-color:#E1A63B!important;background:#FFF7E7!important;color:#93600B!important;box-shadow:0 0 0 2px rgba(225,166,59,.1)!important}
#modal.wct-case-workspace-modal .wct-priority-choice.low.is-selected{border-color:#68A88B!important;background:#EFF8F2!important;color:#367454!important;box-shadow:0 0 0 2px rgba(104,168,139,.1)!important}
#modal.wct-case-workspace-modal .wct-case-create-next-step{
  display:flex!important;flex-direction:column!important;gap:6px!important;margin:23px 0 0!important;
  padding:15px 17px!important;border:1px solid #E9E3D6!important;border-left:4px solid #DFA12C!important;
  border-radius:12px!important;background:#FFFCF5!important;
}
#modal.wct-case-workspace-modal .wct-case-create-step{color:#A97013!important;font-size:9px!important;font-weight:950!important;letter-spacing:.13em!important}
#modal.wct-case-workspace-modal .wct-case-create-next-step strong{color:#3D4A5B!important;font-size:11px!important;font-weight:900!important}
#modal.wct-case-workspace-modal .wct-case-create-next-step p{margin:0!important;color:#7F8B9A!important;font-size:10px!important;line-height:1.6!important}
#modal.wct-case-workspace-modal .modal-foot,
#modal.wct-case-workspace-modal .wct-flow-form-footer{
  position:relative!important;z-index:8!important;display:flex!important;align-items:center!important;
  justify-content:flex-end!important;gap:10px!important;flex:0 0 auto!important;
  margin:0!important;padding:15px 30px calc(15px + env(safe-area-inset-bottom))!important;
  border-top:1px solid #E5EBF1!important;background:rgba(255,255,255,.98)!important;
  box-shadow:0 -6px 18px rgba(24,43,65,.045)!important;
}
#modal.wct-case-workspace-modal .wct-flow-form-footer-note{
  margin-right:auto!important;color:#8190A2!important;font-size:10px!important;line-height:1.5!important;
}
#modal.wct-case-workspace-modal .modal-foot .btn,
#modal.wct-case-workspace-modal .wct-flow-form-footer .btn{
  display:inline-flex!important;align-items:center!important;justify-content:center!important;
  min-height:44px!important;padding:10px 19px!important;border-radius:10px!important;
  font-size:11px!important;font-weight:900!important;
}
#modal.wct-case-workspace-modal .modal-foot .btn-primary,
#modal.wct-case-workspace-modal .wct-flow-form-footer .btn-primary{
  border:1px solid #D6951C!important;background:#E7A329!important;color:#293548!important;
  box-shadow:0 4px 10px rgba(199,135,22,.17)!important;
}
#modal.wct-case-workspace-modal .modal-foot .btn:not(.btn-primary),
#modal.wct-case-workspace-modal .wct-flow-form-footer .btn:not(.btn-primary){
  border:1px solid #DEE5EC!important;background:#fff!important;color:#5E6C7D!important;
}
#modal.wct-case-workspace-modal .modal-foot .btn:hover,
#modal.wct-case-workspace-modal .wct-flow-form-footer .btn:hover{transform:translateY(-1px)!important}
@keyframes wctCaseFormEnter{from{opacity:0;transform:translateY(8px) scale(.992)}to{opacity:1;transform:translateY(0) scale(1)}}
@media(max-width:760px){
  #modalBackdrop.show:has(#modal.wct-case-workspace-modal){align-items:center!important;padding:8px!important}
  #modal.wct-case-workspace-modal{
    width:calc(100vw - 16px)!important;max-width:calc(100vw - 16px)!important;
    height:calc(100dvh - 16px)!important;max-height:calc(100dvh - 16px)!important;
    border-radius:15px!important;
  }
  #modal.wct-case-workspace-modal>.modal-head{gap:10px!important;padding:16px 16px 14px!important}
  #modal.wct-case-workspace-modal>.modal-head h2{font-size:18px!important}
  #modal.wct-case-workspace-modal>.modal-head p,
  #modal.wct-case-workspace-modal>.modal-head .sub{font-size:10px!important}
  #modal.wct-case-workspace-modal .modal-body.wct-case-form-body{padding:16px 15px 20px!important}
  #modal.wct-case-workspace-modal .wct-case-form-layout{gap:19px!important}
  #modal.wct-case-workspace-modal .wct-case-form-section{padding-bottom:18px!important}
  #modal.wct-case-workspace-modal .wct-case-form-section-head{margin-bottom:13px!important}
  #modal.wct-case-workspace-modal .wct-case-form-grid{grid-template-columns:minmax(0,1fr)!important;gap:14px!important}
  #modal.wct-case-workspace-modal .wct-case-form-grid .wct-multi-picker{grid-template-columns:minmax(0,1fr)!important;gap:7px!important}
  #modal.wct-case-workspace-modal .wct-case-form-grid>.field,
  #modal.wct-case-workspace-modal .wct-case-form-grid>.field.span-2{grid-column:1!important}
  #modal.wct-case-workspace-modal .wct-case-form-grid .field input:not([type=checkbox]):not([type=range]),
  #modal.wct-case-workspace-modal .wct-case-form-grid .field select{min-height:44px!important}
  #modal.wct-case-workspace-modal .wct-case-form-grid .field textarea{min-height:128px!important}
  #modal.wct-case-workspace-modal .wct-priority-buttons{max-width:none!important;gap:7px!important}
  #modal.wct-case-workspace-modal .modal-foot,
  #modal.wct-case-workspace-modal .wct-flow-form-footer{
    gap:8px!important;padding:11px 13px calc(11px + env(safe-area-inset-bottom))!important;
  }
  #modal.wct-case-workspace-modal .wct-flow-form-footer-note{display:none!important}
  #modal.wct-case-workspace-modal .modal-foot .btn,
  #modal.wct-case-workspace-modal .wct-flow-form-footer .btn{flex:1 1 0!important;min-width:0!important;padding:9px 10px!important}
  #modal.wct-case-workspace-modal .wct-case-editor-intro{padding:12px!important;margin-bottom:18px!important}
}
@media(min-width:761px) and (max-width:1100px){
  #modal.wct-case-workspace-modal{width:calc(100vw - 36px)!important;max-width:none!important}
  #modal.wct-case-workspace-modal .modal-body.wct-case-form-body{padding:20px 22px 24px!important}
}
`;

  const runtime = String.raw`
(function(){
  'use strict';
  if(window.__WCT_CASE_FORM_LAYOUT__)return;
  window.__WCT_CASE_FORM_LAYOUT__=true;

  var modal=document.getElementById('modal');
  if(!modal)return;

  function fieldFor(form,selectors){
    for(var i=0;i<selectors.length;i++){
      var input=form.querySelector(selectors[i]);
      if(input){
        var field=input.closest('.field');
        if(field)return field;
      }
    }
    return null;
  }
  function addSection(layout,index,title,description,fields,used){
    var present=fields.filter(function(field){return !!field&&!used.has(field);});
    if(!present.length)return;
    var section=document.createElement('section');
    section.className='wct-case-form-section';
    var head=document.createElement('div');
    head.className='wct-case-form-section-head';
    var number=document.createElement('span');
    number.className='wct-case-form-section-index';
    number.textContent=String(index).padStart(2,'0');
    var copy=document.createElement('div');
    copy.className='wct-case-form-section-copy';
    var heading=document.createElement('strong');
    heading.className='wct-case-form-section-title';
    heading.textContent=title;
    var note=document.createElement('span');
    note.className='wct-case-form-section-description';
    note.textContent=description;
    copy.appendChild(heading);
    copy.appendChild(note);
    head.appendChild(number);
    head.appendChild(copy);
    var grid=document.createElement('div');
    grid.className='wct-case-form-grid';
    present.forEach(function(field){
      used.add(field);
      field.classList.add('wct-case-form-field');
      if(field.dataset.wctCaseWide==='true')field.classList.add('wct-case-form-wide');
      grid.appendChild(field);
    });
    section.appendChild(head);
    section.appendChild(grid);
    layout.appendChild(section);
  }
  function structureForm(form){
    if(!form||form.dataset.wctCaseLayoutApplied==='1')return;
    var body=form.querySelector('.modal-body');
    var sourceGrid=body&&body.querySelector('.form-grid');
    if(!body||!sourceGrid)return;

    var hubs=fieldFor(form,['[name="hub_codes"]','[name="hub_code"]']);
    var divisions=fieldFor(form,['[name="divisions"]','[name="division"]']);
    var category=fieldFor(form,['[name="category"]']);
    var title=fieldFor(form,['[name="title"]']);
    var priority=fieldFor(form,['.wct-priority-buttons','[name="priority"]']);
    var problem=fieldFor(form,['[name="problem_identification"]']);
    var occurred=fieldFor(form,['[name="occurred_on"]']);
    var target=fieldFor(form,['[name="target_date"]']);
    var reporter=fieldFor(form,['[name="reporter"]']);
    var status=fieldFor(form,['[name="status"]']);

    if(priority)priority.dataset.wctCaseWide='true';
    if(problem)problem.dataset.wctCaseWide='true';
    if(title)title.dataset.wctCaseWide='true';
    if(category)category.dataset.wctCaseWide='true';

    var fields=Array.from(sourceGrid.children).filter(function(node){return node.classList&&node.classList.contains('field');});
    var used=new Set();
    var layout=document.createElement('div');
    layout.className='wct-case-form-layout';
    sourceGrid.parentNode.insertBefore(layout,sourceGrid);

    addSection(layout,1,'LINGKUP OPERASIONAL','Pilih satu atau beberapa HUB dan divisi yang terlibat, lalu tentukan prioritas.',[hubs,divisions,priority],used);
    addSection(layout,2,'IDENTIFIKASI & PRIORITAS','Pilih kategori permasalahan, berikan judul yang jelas, lalu uraikan detail masalah.',[category,title,problem],used);
    addSection(layout,3,'KRONOLOGI & PELAPORAN','Catat tanggal kejadian, target awal penyelesaian, dan pihak yang melaporkan.',[occurred,target,reporter,status],used);

    var leftovers=fields.filter(function(field){return !used.has(field);});
    if(leftovers.length)addSection(layout,4,'INFORMASI TAMBAHAN','Lengkapi informasi pendukung yang tersedia.',leftovers,used);
    sourceGrid.remove();

    var oldSection=body.querySelector('.wct-case-editor-section');
    if(oldSection)oldSection.remove();
    form.dataset.wctCaseLayoutApplied='1';
  }
  function updateMultiSummary(select){
    if(!select)return;
    var field=select.closest('.field'),picker=field&&field.querySelector('.wct-multi-select');
    var label=picker&&picker.querySelector('.wct-multi-select-trigger-label');
    if(!label)return;
    var selected=Array.from(select.querySelectorAll('input[type="checkbox"]:checked')).map(function(input){return input.value;});
    var noun=select.getAttribute('data-wct-picker')==='hub_codes'?'HUB':'Divisi';
    if(!selected.length){
      label.textContent='Pilih '+(noun==='HUB'?'HUB':'Divisi');
      label.classList.add('is-placeholder');
    }else{
      label.textContent=selected.length<=2?selected.join(', '):selected.slice(0,2).join(', ')+' +'+(selected.length-2)+' lainnya';
      label.classList.remove('is-placeholder');
    }
  }
  function decorateMultiSelects(form){
    form.querySelectorAll('.wct-multi-picker').forEach(function(picker){
      if(picker.dataset.wctDropdownReady==='1')return;
      picker.dataset.wctDropdownReady='1';
      picker.classList.remove('wct-multi-picker');
      picker.classList.add('wct-multi-select');
      var field=picker.closest('.field'),fieldLabel=field&&field.querySelector(':scope > label');
      var noun=picker.getAttribute('data-wct-picker')==='hub_codes'?'HUB':'Divisi';
      var trigger=document.createElement('button');
      trigger.type='button';
      trigger.className='wct-multi-select-trigger';
      trigger.setAttribute('aria-expanded','false');
      trigger.innerHTML='<span class="wct-multi-select-trigger-label is-placeholder">Pilih '+noun+'</span><span class="wct-multi-select-chevron" aria-hidden="true">⌄</span>';
      var panel=document.createElement('div');
      panel.className='wct-multi-select-panel';
      panel.hidden=true;
      while(picker.firstChild)panel.appendChild(picker.firstChild);
      picker.appendChild(trigger);
      picker.appendChild(panel);
      var inputName=picker.getAttribute('data-wct-picker');
      updateMultiSummary(picker);
    });
  }
  function decorateCategory(form){
    var select=form.querySelector('select[name="category"]');
    if(!select)return;
    var field=select.closest('.field');
    if(!field||field.dataset.wctCategoryButtons==='1')return;
    field.dataset.wctCategoryButtons='1';
    var wrap=document.createElement('div');
    wrap.className='wct-category-buttons';
    Array.from(select.options).forEach(function(option){
      if(!option.value)return;
      var button=document.createElement('button');
      button.type='button';
      button.className='wct-category-choice';
      button.textContent=option.textContent.trim();
      button.dataset.value=option.value;
      button.setAttribute('aria-pressed',select.value===option.value?'true':'false');
      if(select.value===option.value)button.classList.add('is-selected');
      wrap.appendChild(button);
    });
    select.classList.add('wct-category-native');
    select.removeAttribute('required');
    select.insertAdjacentElement('afterend',wrap);
  }
  function closeMultiSelects(except){
    modal.querySelectorAll('.wct-multi-select.is-open').forEach(function(picker){
      if(except&&picker===except)return;
      picker.classList.remove('is-open');
      var panel=picker.querySelector('.wct-multi-select-panel');
      var trigger=picker.querySelector('.wct-multi-select-trigger');
      if(panel)panel.hidden=true;
      if(trigger)trigger.setAttribute('aria-expanded','false');
    });
  }
  modal.addEventListener('click',function(event){
    var trigger=event.target.closest&&event.target.closest('.wct-multi-select-trigger');
    if(trigger){
      var picker=trigger.closest('.wct-multi-select');
      var opening=!picker.classList.contains('is-open');
      closeMultiSelects(picker);
      picker.classList.toggle('is-open',opening);
      var panel=picker.querySelector('.wct-multi-select-panel');
      if(panel)panel.hidden=!opening;
      trigger.setAttribute('aria-expanded',opening?'true':'false');
      return;
    }
    var category=event.target.closest&&event.target.closest('.wct-category-choice');
    if(category){
      var form=category.closest('form'),select=form&&form.querySelector('select[name="category"]');
      if(select){
        select.value=category.dataset.value||'';
        select.dispatchEvent(new Event('change',{bubbles:true}));
        var field=category.closest('.field');
        field.querySelectorAll('.wct-category-choice').forEach(function(button){
          var active=button===category;
          button.classList.toggle('is-selected',active);
          button.setAttribute('aria-pressed',active?'true':'false');
        });
      }
      return;
    }
    if(!event.target.closest('.wct-multi-select'))closeMultiSelects();
  });
  modal.addEventListener('change',function(event){
    var input=event.target;
    if(input.matches&&input.matches('.wct-multi-select-panel input[type="checkbox"]')){
      updateMultiSummary(input.closest('.wct-multi-select'));
    }
  });
  modal.addEventListener('keydown',function(event){
    if(event.key==='Escape')closeMultiSelects();
  });
  document.addEventListener('click',function(event){
    if(!modal.contains(event.target))closeMultiSelects();
  });
  function normalize(){
    var active=modal.querySelector('#caseForm,#wctCaseEditorForm');
    if(!active){
      modal.classList.remove('wct-case-workspace-modal','wct-case-edit-drawer');
      closeMultiSelects();
      return;
    }
    modal.classList.add('wct-case-workspace-modal');
    modal.classList.remove('wct-case-side-drawer','wct-case-edit-drawer');
    active.classList.add('wct-case-form-unified');
    var body=active.querySelector('.modal-body');
    if(body)body.classList.add('wct-case-form-body');
    structureForm(active);
    decorateMultiSelects(active);
    decorateCategory(active);
    active.querySelectorAll('.wct-multi-select').forEach(updateMultiSummary);
  }
  var scheduled=false;
  function schedule(){
    if(scheduled)return;
    scheduled=true;
    window.setTimeout(function(){scheduled=false;normalize();},110);
  }
  new MutationObserver(schedule).observe(modal,{childList:true,subtree:true});
  normalize();
  window.addEventListener('resize',schedule,{passive:true});
  window.addEventListener('orientationchange',schedule,{passive:true});
  window.WCTCaseFormLayoutReady=true;
})();
`;

  return html.replace('</body>', '<style id="wct-case-form-layout-style">' + css + '</style><script id="wct-case-form-layout">' + runtime + '</script></body>');
};
