module.exports = function applyPicapaModalPolish(html) {
  if (!html || !html.includes('</body>')) throw new Error('Could not find document body for PICAPA modal polish.');
  const css = String.raw`

/* Update Progress uses the dedicated wctProgressForm / flow-shell structure. */
#modal:has(#wctProgressForm),
#modal.wct-modal-progress{
  background:#FFFFFF!important;color:#172B46!important;
}
#modal:has(#wctProgressForm) .modal-body.wct-flow-modal-body,
#modal.wct-modal-progress .modal-body.wct-flow-modal-body{
  display:block!important;
  background:#F4F7FB!important;
  color:#243B57!important;
  padding:18px 20px 22px!important;
}
#modal:has(#wctProgressForm) .wct-flow-form-top,
#modal.wct-modal-progress .wct-flow-form-top{
  padding:17px 19px!important;
  border:1px solid #DFE7F1!important;
  border-bottom:1px solid #E7EDF5!important;
  border-radius:14px 14px 0 0!important;
  background:#FFFFFF!important;
}
#modal:has(#wctProgressForm) .wct-flow-form-top h2,
#modal.wct-modal-progress .wct-flow-form-top h2{
  margin:0!important;color:#173B68!important;
  font-size:15px!important;font-weight:900!important;letter-spacing:-.02em!important;
}
#modal:has(#wctProgressForm) .wct-flow-form-top p,
#modal.wct-modal-progress .wct-flow-form-top p{
  margin:5px 0 0!important;color:#71849A!important;
  font-size:10px!important;line-height:1.6!important;
}
#modal:has(#wctProgressForm) #wctProgressForm,
#modal.wct-modal-progress #wctProgressForm{
  display:block!important;overflow:visible!important;min-height:0!important;
  padding:0!important;margin:0!important;border:1px solid #DFE7F1!important;
  border-top:0!important;border-radius:0 0 14px 14px!important;
  background:#FFFFFF!important;color:#263A54!important;
}
#modal:has(#wctProgressForm) .wct-flow-form-body,
#modal.wct-modal-progress .wct-flow-form-body{
  padding:18px 19px 20px!important;
  background:#FFFFFF!important;color:#263A54!important;
}
#modal:has(#wctProgressForm) .wct-flow-context,
#modal.wct-modal-progress .wct-flow-context{
  display:flex!important;align-items:center!important;gap:12px!important;
  margin:0 0 18px!important;padding:13px 15px!important;
  border:1px solid #D9E6F5!important;border-radius:12px!important;
  background:linear-gradient(110deg,#F0F6FE 0%,#F8FBFF 100%)!important;
}
#modal:has(#wctProgressForm) .wct-flow-context-icon,
#modal.wct-modal-progress .wct-flow-context-icon{
  display:grid!important;place-items:center!important;width:36px!important;height:36px!important;
  flex:0 0 36px!important;border-radius:10px!important;
  background:#DDEBFC!important;color:#245E9F!important;font-size:12px!important;font-weight:900!important;
}
#modal:has(#wctProgressForm) .wct-flow-context-main strong,
#modal.wct-modal-progress .wct-flow-context-main strong{
  color:#1C3554!important;font-size:12px!important;font-weight:900!important;
}
#modal:has(#wctProgressForm) .wct-flow-context-main small,
#modal.wct-modal-progress .wct-flow-context-main small{
  color:#70839A!important;font-size:10px!important;line-height:1.5!important;
}
#modal:has(#wctProgressForm) .wct-flow-context-stat,
#modal.wct-modal-progress .wct-flow-context-stat{
  color:#2864C7!important;font-size:20px!important;font-weight:950!important;
}
#modal:has(#wctProgressForm) .section-title,
#modal.wct-modal-progress .section-title{
  margin:17px 0 13px!important;padding:0 0 9px!important;
  border-bottom:1px solid #E7EDF5!important;
  background:transparent!important;color:#2864C7!important;
  font-size:10px!important;font-weight:900!important;letter-spacing:.1em!important;
  text-transform:uppercase!important;
}
#modal:has(#wctProgressForm) #wctProgressForm .form-grid,
#modal.wct-modal-progress #wctProgressForm .form-grid{
  display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;
  align-items:start!important;gap:15px 16px!important;
  background:#FFFFFF!important;
}
#modal:has(#wctProgressForm) #wctProgressForm .field,
#modal.wct-modal-progress #wctProgressForm .field{
  min-width:0!important;margin:0!important;background:transparent!important;
}
#modal:has(#wctProgressForm) #wctProgressForm .field label,
#modal.wct-modal-progress #wctProgressForm .field label{
  display:block!important;margin:0 0 7px!important;
  color:#405873!important;font-size:11px!important;font-weight:850!important;
}
#modal:has(#wctProgressForm) #wctProgressForm .field input:not([type=range]):not([type=checkbox]),
#modal:has(#wctProgressForm) #wctProgressForm .field select,
#modal:has(#wctProgressForm) #wctProgressForm .field textarea,
#modal.wct-modal-progress #wctProgressForm .field input:not([type=range]):not([type=checkbox]),
#modal.wct-modal-progress #wctProgressForm .field select,
#modal.wct-modal-progress #wctProgressForm .field textarea{
  display:block!important;width:100%!important;max-width:100%!important;min-height:44px!important;
  box-sizing:border-box!important;padding:11px 13px!important;
  border:1px solid #D7E1ED!important;border-radius:10px!important;
  background:#FFFFFF!important;color:#1C3554!important;
  font-family:inherit!important;font-size:12px!important;font-weight:500!important;line-height:1.55!important;
  box-shadow:0 1px 2px rgba(25,49,79,.025)!important;
}
#modal:has(#wctProgressForm) #wctProgressForm .field textarea,
#modal.wct-modal-progress #wctProgressForm .field textarea{
  min-height:94px!important;resize:vertical!important;
}
#modal:has(#wctProgressForm) #wctProgressForm .field input:disabled,
#modal.wct-modal-progress #wctProgressForm .field input:disabled{
  background:#EFF4FA!important;color:#657990!important;opacity:1!important;
}
#modal:has(#wctProgressForm) #wctProgressForm .field input::placeholder,
#modal:has(#wctProgressForm) #wctProgressForm .field textarea::placeholder,
#modal.wct-modal-progress #wctProgressForm .field input::placeholder,
#modal.wct-modal-progress #wctProgressForm .field textarea::placeholder{
  color:#93A3B6!important;opacity:1!important;
}
#modal:has(#wctProgressForm) #wctProgressForm .wct-progress-range-wrap,
#modal.wct-modal-progress #wctProgressForm .wct-progress-range-wrap{
  display:grid!important;grid-template-columns:minmax(0,1fr) 68px!important;gap:13px!important;
  align-items:center!important;padding:12px 14px!important;
  border:1px solid #DCE6F2!important;border-radius:12px!important;
  background:#F8FAFD!important;
}
#modal:has(#wctProgressForm) #wctProgressForm .wct-progress-range-wrap input,
#modal.wct-modal-progress #wctProgressForm .wct-progress-range-wrap input{
  width:100%!important;min-height:28px!important;accent-color:#2864C7!important;
}
#modal:has(#wctProgressForm) #wctProgressForm .wct-progress-range-value,
#modal.wct-modal-progress #wctProgressForm .wct-progress-range-value{
  display:grid!important;place-items:center!important;min-height:38px!important;
  border-radius:9px!important;background:#EAF2FD!important;color:#245B9C!important;
  font-size:15px!important;font-weight:900!important;
}
#modal:has(#wctProgressForm) #wctProgressForm .sub,
#modal.wct-modal-progress #wctProgressForm .sub{
  color:#8193A8!important;font-size:9px!important;line-height:1.5!important;
}
#modal:has(#wctProgressForm) .wct-progress-edit-warning,
#modal.wct-modal-progress .wct-progress-edit-warning{
  margin:0 19px 14px!important;padding:11px 13px!important;
  border:1px solid #F0DCA9!important;border-radius:10px!important;
  background:#FFFAED!important;color:#87611D!important;
}
#modal:has(#wctProgressForm) .wct-flow-form-footer,
#modal.wct-modal-progress .wct-flow-form-footer{
  position:sticky!important;bottom:0!important;z-index:8!important;
  display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:9px!important;
  margin:0!important;padding:12px 18px!important;
  border-top:1px solid #E4EAF2!important;border-radius:0 0 13px 13px!important;
  background:rgba(255,255,255,.97)!important;
  box-shadow:0 -5px 16px rgba(25,49,79,.055)!important;backdrop-filter:blur(10px)!important;
}
#modal:has(#wctProgressForm) .wct-flow-form-footer-note,
#modal.wct-modal-progress .wct-flow-form-footer-note{margin-right:auto!important;color:#8595A8!important;font-size:9px!important}
#modal:has(#wctProgressForm) .wct-flow-form-footer .btn,
#modal.wct-modal-progress .wct-flow-form-footer .btn{
  display:inline-flex!important;align-items:center!important;justify-content:center!important;
  min-height:42px!important;padding:9px 15px!important;border-radius:10px!important;font-size:11px!important;font-weight:850!important;
}
#modal:has(#wctProgressForm) .wct-flow-form-footer .btn-primary,
#modal.wct-modal-progress .wct-flow-form-footer .btn-primary{
  background:#2864C7!important;border-color:#2864C7!important;color:#FFFFFF!important;
  box-shadow:0 5px 13px rgba(40,100,199,.17)!important;
}
#modal:has(#wctProgressForm) .wct-flow-form-footer .btn:not(.btn-primary),
#modal.wct-modal-progress .wct-flow-form-footer .btn:not(.btn-primary){
  border:1px solid #D6E1ED!important;background:#FFFFFF!important;color:#38516F!important;
}
@media(max-width:760px){
  #modal:has(#wctProgressForm) .modal-body.wct-flow-modal-body,
  #modal.wct-modal-progress .modal-body.wct-flow-modal-body{padding:12px!important}
  #modal:has(#wctProgressForm) .wct-flow-form-top,
  #modal.wct-modal-progress .wct-flow-form-top{padding:14px!important}
  #modal:has(#wctProgressForm) .wct-flow-form-body,
  #modal.wct-modal-progress .wct-flow-form-body{padding:14px!important}
  #modal:has(#wctProgressForm) #wctProgressForm .form-grid,
  #modal.wct-modal-progress #wctProgressForm .form-grid{grid-template-columns:minmax(0,1fr)!important;gap:13px!important}
  #modal:has(#wctProgressForm) #wctProgressForm .field.span-2,
  #modal.wct-modal-progress #wctProgressForm .field.span-2{grid-column:1!important}
  #modal:has(#wctProgressForm) .wct-flow-form-footer,
  #modal.wct-modal-progress .wct-flow-form-footer{
    justify-content:stretch!important;padding:10px 12px calc(10px + env(safe-area-inset-bottom))!important;
    gap:8px!important;
  }
  #modal:has(#wctProgressForm) .wct-flow-form-footer .btn,
  #modal.wct-modal-progress .wct-flow-form-footer .btn{flex:1!important;min-width:0!important;padding:9px 9px!important}
  #modal:has(#wctProgressForm) .wct-flow-form-footer-note,
  #modal.wct-modal-progress .wct-flow-form-footer-note{display:none!important}
}


/* Edit Action: explicitly style its actual form markup and keep all controls tappable. */
#modal:has(form[onsubmit*="submitAction"]){
  background:#F4F7FB!important;color:#172B46!important;
  border:1px solid #D7E1ED!important;box-shadow:0 26px 80px rgba(12,35,64,.24)!important;
}
#modal:has(form[onsubmit*="submitAction"])>.modal-head{
  position:relative!important;z-index:12!important;display:flex!important;align-items:center!important;
  justify-content:space-between!important;gap:12px!important;padding:18px 21px!important;
  border-bottom:1px solid #E4EAF2!important;background:#FFFFFF!important;
}
#modal:has(form[onsubmit*="submitAction"])>.modal-head h2{
  color:#173B68!important;font-size:18px!important;font-weight:900!important;letter-spacing:-.02em!important;
}
#modal:has(form[onsubmit*="submitAction"])>.modal-head .eyebrow{color:#2864C7!important}
#modal:has(form[onsubmit*="submitAction"])>.modal-head .sub{color:#75869B!important;font-size:11px!important}
#modal:has(form[onsubmit*="submitAction"])>.modal-head .close{
  position:relative!important;z-index:30!important;pointer-events:auto!important;touch-action:manipulation!important;
  display:grid!important;place-items:center!important;width:46px!important;min-width:46px!important;
  height:46px!important;min-height:46px!important;flex:0 0 46px!important;
  padding:0!important;border:1px solid #DCE6F2!important;border-radius:11px!important;
  background:#F3F7FC!important;color:#355271!important;
}
#modal:has(form[onsubmit*="submitAction"])>form{
  display:flex!important;flex:1 1 auto!important;flex-direction:column!important;min-height:0!important;
  overflow:hidden!important;margin:0!important;background:#F4F7FB!important;
}
#modal:has(form[onsubmit*="submitAction"])>form>.modal-body{
  flex:1 1 auto!important;min-height:0!important;overflow-y:auto!important;overflow-x:hidden!important;
  padding:18px 20px 20px!important;background:#F4F7FB!important;color:#263A54!important;
  -webkit-overflow-scrolling:touch!important;overscroll-behavior-y:contain!important;
}
#modal:has(form[onsubmit*="submitAction"]) .wct-picapa-form-intro{
  display:flex!important;align-items:center!important;gap:12px!important;margin:0 0 17px!important;
  padding:13px 15px!important;border:1px solid #D9E6F5!important;border-radius:12px!important;
  background:linear-gradient(110deg,#EFF5FD 0%,#FFFFFF 100%)!important;color:#526B87!important;
}
#modal:has(form[onsubmit*="submitAction"]) .wct-picapa-form-intro i{
  display:grid!important;place-items:center!important;width:36px!important;height:36px!important;
  flex:0 0 36px!important;border-radius:10px!important;background:#DDEBFC!important;
  color:#245E9F!important;font-size:11px!important;font-style:normal!important;font-weight:900!important;
}
#modal:has(form[onsubmit*="submitAction"]) .wct-picapa-form-intro p{
  margin:0!important;color:#526B87!important;font-size:11px!important;line-height:1.6!important;
}
#modal:has(form[onsubmit*="submitAction"]) .section-title{
  color:#2864C7!important;border-bottom-color:#E2E9F2!important;
  font-size:10px!important;font-weight:900!important;letter-spacing:.1em!important;
}
#modal:has(form[onsubmit*="submitAction"]) .form-grid{
  display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;
  align-items:start!important;gap:15px 16px!important;padding:0!important;margin:0!important;
  background:transparent!important;color:#263A54!important;
}
#modal:has(form[onsubmit*="submitAction"]) .field{
  display:block!important;min-width:0!important;margin:0!important;padding:0!important;
  background:transparent!important;color:#263A54!important;
}
#modal:has(form[onsubmit*="submitAction"]) .field.span-2{grid-column:1/-1!important}
#modal:has(form[onsubmit*="submitAction"]) .field label{
  display:block!important;margin:0 0 7px!important;color:#405873!important;
  font-size:11px!important;font-weight:850!important;letter-spacing:.005em!important;
}
#modal:has(form[onsubmit*="submitAction"]) .field input,
#modal:has(form[onsubmit*="submitAction"]) .field select,
#modal:has(form[onsubmit*="submitAction"]) .field textarea{
  display:block!important;width:100%!important;max-width:100%!important;min-height:44px!important;
  box-sizing:border-box!important;padding:11px 13px!important;border:1px solid #D7E1ED!important;
  border-radius:10px!important;background:#FFFFFF!important;color:#1C3554!important;
  font-family:inherit!important;font-size:12px!important;font-weight:500!important;line-height:1.55!important;
  box-shadow:0 1px 2px rgba(25,49,79,.025)!important;
}
#modal:has(form[onsubmit*="submitAction"]) .field textarea{min-height:105px!important;resize:vertical!important}
#modal:has(form[onsubmit*="submitAction"]) .field input:focus,
#modal:has(form[onsubmit*="submitAction"]) .field select:focus,
#modal:has(form[onsubmit*="submitAction"]) .field textarea:focus{
  outline:none!important;border-color:#6F9DD7!important;box-shadow:0 0 0 3px rgba(40,100,199,.12)!important;
}
#modal:has(form[onsubmit*="submitAction"]) .field input::placeholder,
#modal:has(form[onsubmit*="submitAction"]) .field textarea::placeholder{color:#93A3B6!important;opacity:1!important}
#modal:has(form[onsubmit*="submitAction"])>form>.modal-foot{
  position:relative!important;z-index:12!important;display:flex!important;flex:0 0 auto!important;
  align-items:center!important;justify-content:flex-end!important;gap:9px!important;
  margin:0!important;padding:13px 18px!important;border-top:1px solid #E2E9F2!important;
  background:#FFFFFF!important;box-shadow:0 -5px 16px rgba(25,49,79,.05)!important;
}
#modal:has(form[onsubmit*="submitAction"]) .modal-foot .btn{
  position:relative!important;z-index:15!important;pointer-events:auto!important;touch-action:manipulation!important;
  display:inline-flex!important;align-items:center!important;justify-content:center!important;
  min-width:94px!important;min-height:44px!important;padding:10px 15px!important;
  border-radius:10px!important;font-size:11px!important;font-weight:850!important;
}
#modal:has(form[onsubmit*="submitAction"]) .modal-foot .btn-primary{
  border:1px solid #2864C7!important;background:#2864C7!important;color:#FFFFFF!important;
  box-shadow:0 5px 13px rgba(40,100,199,.17)!important;
}
#modal:has(form[onsubmit*="submitAction"]) .modal-foot .btn:not(.btn-primary){
  border:1px solid #D6E1ED!important;background:#FFFFFF!important;color:#38516F!important;
}
@media(max-width:760px){
  #modal:has(form[onsubmit*="submitAction"])>.modal-head{padding:13px 14px!important}
  #modal:has(form[onsubmit*="submitAction"])>form>.modal-body{padding:14px!important}
  #modal:has(form[onsubmit*="submitAction"]) .form-grid{grid-template-columns:minmax(0,1fr)!important;gap:13px!important}
  #modal:has(form[onsubmit*="submitAction"]) .field.span-2{grid-column:1!important}
  #modal:has(form[onsubmit*="submitAction"])>form>.modal-foot{
    justify-content:stretch!important;padding:10px 12px calc(10px + env(safe-area-inset-bottom))!important;
  }
  #modal:has(form[onsubmit*="submitAction"]) .modal-foot .btn{flex:1 1 0!important;min-width:0!important}
}

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
  display:flex!important;flex:1 1 auto!important;flex-direction:column!important;align-items:stretch!important;
  gap:14px!important;width:100%!important;box-sizing:border-box!important;
  min-height:0!important;height:auto!important;max-height:none!important;
  overflow-x:hidden!important;overflow-y:auto!important;
  overscroll-behavior:contain!important;-webkit-overflow-scrolling:touch!important;
  touch-action:pan-y!important;padding:18px 20px 22px!important;
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

/* Clean Action editor layout: one clear light surface, consistent contrast and spacing. */
#modal.wct-modal-action,
#modal:has(#wctActionForm){
  width:min(790px,calc(100vw - 40px))!important;
  max-width:790px!important;
  max-height:min(86vh,800px)!important;
  display:flex!important;flex-direction:column!important;min-height:0!important;
  overflow:hidden!important;border:1px solid #DCE5F0!important;border-radius:18px!important;
  background:#FFFFFF!important;color:#20364F!important;
  box-shadow:0 24px 68px rgba(16,38,66,.22)!important;
}
#modal.wct-modal-action>.modal-head,
#modal:has(#wctActionForm)>.modal-head{
  flex:0 0 auto!important;padding:18px 22px!important;
  border-bottom:1px solid #E8EDF4!important;background:#FFFFFF!important;
}
#modal.wct-modal-action>.modal-head h2,
#modal:has(#wctActionForm)>.modal-head h2{
  margin:0!important;color:#173B68!important;font-size:19px!important;
  font-weight:900!important;letter-spacing:-.025em!important;
}
#modal.wct-modal-action>.modal-head .sub,
#modal:has(#wctActionForm)>.modal-head .sub{
  margin:5px 0 0!important;color:#71839A!important;font-size:11px!important;
  line-height:1.55!important;
}
#modal.wct-modal-action>.modal-head .close,
#modal:has(#wctActionForm)>.modal-head .close{
  width:42px!important;height:42px!important;min-width:42px!important;
  border:1px solid #DCE5F0!important;border-radius:11px!important;
  background:#F5F8FC!important;color:#45617F!important;
}
#modal.wct-modal-action>.modal-body.wct-flow-modal-body,
#modal:has(#wctActionForm)>.modal-body.wct-flow-modal-body{
  display:flex!important;flex:1 1 auto!important;flex-direction:column!important;
  min-height:0!important;overflow-y:auto!important;overflow-x:hidden!important;
  gap:0!important;padding:18px 22px 0!important;
  background:#F5F8FC!important;color:#263A54!important;
  -webkit-overflow-scrolling:touch!important;overscroll-behavior-y:contain!important;
}
/* The outer modal title already identifies the screen; avoid a second large title. */
#modal.wct-modal-action .wct-flow-form-top,
#modal:has(#wctActionForm) .wct-flow-form-top{display:none!important}
#modal.wct-modal-action #wctActionForm,
#modal:has(#wctActionForm) #wctActionForm{
  display:flex!important;flex:1 0 auto!important;flex-direction:column!important;
  min-height:0!important;width:100%!important;margin:0!important;padding:0!important;
  border:0!important;border-radius:0!important;overflow:visible!important;
  background:transparent!important;color:#263A54!important;
}
#modal.wct-modal-action .wct-flow-form-body,
#modal:has(#wctActionForm) .wct-flow-form-body{
  display:block!important;flex:1 0 auto!important;min-height:0!important;
  padding:0 0 18px!important;background:transparent!important;color:#263A54!important;
}
#modal.wct-modal-action .wct-flow-context,
#modal:has(#wctActionForm) .wct-flow-context{
  display:flex!important;align-items:center!important;gap:12px!important;
  margin:0 0 18px!important;padding:13px 15px!important;
  border:1px solid #DCE6F2!important;border-radius:13px!important;
  background:linear-gradient(110deg,#FFFFFF 0%,#F0F6FE 100%)!important;
  color:#526B87!important;box-shadow:0 3px 10px rgba(24,58,99,.035)!important;
}
#modal.wct-modal-action .wct-flow-context-icon,
#modal:has(#wctActionForm) .wct-flow-context-icon{
  display:grid!important;place-items:center!important;width:36px!important;height:36px!important;
  flex:0 0 36px!important;border-radius:10px!important;
  background:#E5EFFD!important;color:#245E9F!important;font-size:11px!important;font-weight:900!important;
}
#modal.wct-modal-action .wct-flow-context-main,
#modal:has(#wctActionForm) .wct-flow-context-main{min-width:0!important;display:grid!important;gap:4px!important}
#modal.wct-modal-action .wct-flow-context-main strong,
#modal:has(#wctActionForm) .wct-flow-context-main strong{
  color:#1D3A5C!important;font-size:12px!important;font-weight:850!important;line-height:1.45!important;
}
#modal.wct-modal-action .wct-flow-context-main small,
#modal:has(#wctActionForm) .wct-flow-context-main small{
  color:#71849B!important;font-size:10px!important;line-height:1.5!important;
}
#modal.wct-modal-action .section-title,
#modal:has(#wctActionForm) .section-title{
  margin:0 0 14px!important;padding:0 0 9px!important;
  border-bottom:1px solid #E0E8F1!important;background:transparent!important;
  color:#2864C7!important;font-size:10px!important;font-weight:900!important;
  letter-spacing:.09em!important;text-transform:uppercase!important;
}
#modal.wct-modal-action .form-grid,
#modal:has(#wctActionForm) .form-grid{
  display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;
  align-items:start!important;gap:16px 18px!important;
  margin:0!important;padding:0!important;background:transparent!important;color:#263A54!important;
}
#modal.wct-modal-action .field,
#modal:has(#wctActionForm) .field{
  display:block!important;min-width:0!important;margin:0!important;padding:0!important;
  background:transparent!important;color:#263A54!important;
}
#modal.wct-modal-action .field.span-2,
#modal:has(#wctActionForm) .field.span-2{grid-column:1/-1!important}
#modal.wct-modal-action .field label,
#modal:has(#wctActionForm) .field label{
  display:block!important;margin:0 0 7px!important;color:#425A75!important;
  font-size:11px!important;font-weight:800!important;line-height:1.4!important;
}
#modal.wct-modal-action .field input,
#modal.wct-modal-action .field select,
#modal.wct-modal-action .field textarea,
#modal:has(#wctActionForm) .field input,
#modal:has(#wctActionForm) .field select,
#modal:has(#wctActionForm) .field textarea{
  display:block!important;width:100%!important;max-width:100%!important;min-width:0!important;
  min-height:46px!important;box-sizing:border-box!important;padding:11px 13px!important;
  border:1px solid #D5DFEA!important;border-radius:10px!important;
  background:#FFFFFF!important;color:#1C3554!important;
  font-family:inherit!important;font-size:12px!important;font-weight:500!important;line-height:1.55!important;
  box-shadow:0 1px 2px rgba(25,49,79,.025)!important;
}
#modal.wct-modal-action .field textarea,
#modal:has(#wctActionForm) .field textarea{
  min-height:112px!important;resize:vertical!important;line-height:1.6!important;
}
#modal.wct-modal-action .field input:focus,
#modal.wct-modal-action .field select:focus,
#modal.wct-modal-action .field textarea:focus,
#modal:has(#wctActionForm) .field input:focus,
#modal:has(#wctActionForm) .field select:focus,
#modal:has(#wctActionForm) .field textarea:focus{
  outline:none!important;border-color:#77A4D7!important;
  box-shadow:0 0 0 3px rgba(40,100,199,.11)!important;
}
#modal.wct-modal-action .field input::placeholder,
#modal.wct-modal-action .field textarea::placeholder,
#modal:has(#wctActionForm) .field input::placeholder,
#modal:has(#wctActionForm) .field textarea::placeholder{color:#91A0B2!important;opacity:1!important}
#modal.wct-modal-action .wct-flow-help,
#modal:has(#wctActionForm) .wct-flow-help{
  margin:17px 0 0!important;padding:11px 13px!important;
  border:1px solid #DCE7F4!important;border-radius:11px!important;
  background:#EFF5FC!important;color:#526B87!important;
  font-size:10px!important;line-height:1.6!important;
}
#modal.wct-modal-action .wct-flow-help strong,
#modal:has(#wctActionForm) .wct-flow-help strong{color:#245B9C!important;font-weight:850!important}
#modal.wct-modal-action .wct-flow-form-footer,
#modal:has(#wctActionForm) .wct-flow-form-footer{
  position:sticky!important;bottom:0!important;z-index:12!important;
  display:flex!important;flex:0 0 auto!important;align-items:center!important;
  justify-content:flex-end!important;gap:10px!important;
  margin:0 -22px!important;padding:13px 22px!important;
  border-top:1px solid #E2E9F2!important;background:rgba(255,255,255,.98)!important;
  box-shadow:0 -5px 16px rgba(25,49,79,.045)!important;
}
#modal.wct-modal-action .wct-flow-form-footer-note,
#modal:has(#wctActionForm) .wct-flow-form-footer-note{
  margin-right:auto!important;color:#8392A5!important;font-size:10px!important;line-height:1.4!important;
}
#modal.wct-modal-action .wct-flow-form-footer .btn,
#modal:has(#wctActionForm) .wct-flow-form-footer .btn{
  display:inline-flex!important;align-items:center!important;justify-content:center!important;
  min-width:112px!important;min-height:44px!important;padding:10px 16px!important;
  border:1px solid #D7E1ED!important;border-radius:10px!important;
  background:#FFFFFF!important;color:#38516F!important;
  font-size:11px!important;font-weight:850!important;
}
#modal.wct-modal-action .wct-flow-form-footer .btn-primary,
#modal:has(#wctActionForm) .wct-flow-form-footer .btn-primary{
  border-color:#2864C7!important;background:#2864C7!important;color:#FFFFFF!important;
  box-shadow:0 5px 13px rgba(40,100,199,.16)!important;
}
@media(max-width:760px){
  #modal.wct-modal-action,
  #modal:has(#wctActionForm){
    width:calc(100vw - 16px)!important;max-width:calc(100vw - 16px)!important;
    max-height:calc(100dvh - 16px)!important;border-radius:15px!important;
  }
  #modal.wct-modal-action>.modal-head,
  #modal:has(#wctActionForm)>.modal-head{padding:14px 15px!important}
  #modal.wct-modal-action>.modal-body.wct-flow-modal-body,
  #modal:has(#wctActionForm)>.modal-body.wct-flow-modal-body{padding:13px 13px 0!important}
  #modal.wct-modal-action .form-grid,
  #modal:has(#wctActionForm) .form-grid{grid-template-columns:minmax(0,1fr)!important;gap:13px!important}
  #modal.wct-modal-action .field.span-2,
  #modal:has(#wctActionForm) .field.span-2{grid-column:1!important}
  #modal.wct-modal-action .wct-flow-form-footer,
  #modal:has(#wctActionForm) .wct-flow-form-footer{
    margin:0 -13px!important;padding:10px 12px calc(10px + env(safe-area-inset-bottom))!important;
    gap:8px!important;justify-content:stretch!important;
  }
  #modal.wct-modal-action .wct-flow-form-footer-note,
  #modal:has(#wctActionForm) .wct-flow-form-footer-note{display:none!important}
  #modal.wct-modal-action .wct-flow-form-footer .btn,
  #modal:has(#wctActionForm) .wct-flow-form-footer .btn{flex:1 1 0!important;min-width:0!important;padding:9px 10px!important}
}
@media(max-width:390px){
  #modal.wct-modal-action>.modal-head h2,
  #modal:has(#wctActionForm)>.modal-head h2{font-size:16px!important}
}

`;
  const detailLayoutCss = String.raw`
/* Case Detail modal: one column scroll container with naturally sized sections. */
#modal.wct-case-detail-modal{
  display:flex!important;flex-direction:column!important;align-items:stretch!important;
  width:min(1080px,calc(100vw - 32px))!important;max-width:1080px!important;
  max-height:calc(100dvh - 32px)!important;min-height:0!important;height:auto!important;
  overflow:hidden!important;
}
#modal.wct-case-detail-modal>.modal-head,
#modal.wct-case-detail-modal>.modal-foot{flex:0 0 auto!important}
#modal.wct-case-detail-modal .wct-case-detail-toolbar{flex:0 0 auto!important}
#modal.wct-case-detail-modal .wct-case-detail-hero{
  display:grid!important;grid-template-columns:minmax(0,1fr) 104px!important;
  align-items:center!important;gap:16px!important;flex:0 0 auto!important;
  width:100%!important;box-sizing:border-box!important;
  min-height:160px!important;height:auto!important;max-height:none!important;
  padding:20px!important;overflow:hidden!important;
}
#modal.wct-case-detail-modal .wct-case-detail-hero>div:first-child{
  display:block!important;position:relative!important;z-index:1!important;
  min-width:0!important;height:auto!important;overflow:visible!important;
}
#modal.wct-case-detail-modal .wct-case-detail-kicker,
#modal.wct-case-detail-modal .wct-case-detail-title,
#modal.wct-case-detail-modal .wct-case-detail-subtitle{
  display:block!important;visibility:visible!important;opacity:1!important;
}
#modal.wct-case-detail-modal .wct-case-detail-title{
  margin:8px 0 7px!important;font-size:clamp(19px,2.4vw,26px)!important;
  line-height:1.2!important;overflow-wrap:anywhere!important;
}
#modal.wct-case-detail-modal .wct-case-detail-tags{
  display:flex!important;visibility:visible!important;flex-wrap:wrap!important;
  gap:7px!important;margin-top:12px!important;
}
#modal.wct-case-detail-modal .wct-case-detail-progress{
  display:grid!important;flex:0 0 104px!important;width:104px!important;height:104px!important;
}
#modal.wct-case-detail-modal .wct-case-meta-grid,
#modal.wct-case-detail-modal .wct-case-section{flex:0 0 auto!important}
@media(max-width:760px){
  #modal.wct-case-detail-modal{
    width:calc(100vw - 16px)!important;max-width:calc(100vw - 16px)!important;
    max-height:calc(100dvh - 16px)!important;border-radius:15px!important;
  }
  #modal.wct-case-detail-modal .modal-body.wct-case-detail{padding:13px!important;gap:11px!important}
  #modal.wct-case-detail-modal .wct-case-detail-hero{
    grid-template-columns:minmax(0,1fr)!important;min-height:0!important;
    padding:16px!important;gap:13px!important;
  }
  #modal.wct-case-detail-modal .wct-case-detail-progress{
    width:78px!important;height:78px!important;flex-basis:78px!important;
    justify-self:start!important;
  }
  #modal.wct-case-detail-modal .wct-case-meta-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
}
  #modal.wct-case-detail-modal .wct-action-tables{
    display:grid!important;grid-template-columns:minmax(0,1fr)!important;
    gap:12px!important;width:100%!important;min-width:0!important;
  }
  #modal.wct-case-detail-modal .wct-action-table-group{
    min-width:0!important;overflow:hidden!important;
    border:1px solid #DFE7F1!important;border-radius:13px!important;
    background:#FFFFFF!important;box-shadow:0 4px 13px rgba(25,49,79,.035)!important;
  }
  #modal.wct-case-detail-modal .wct-action-table-heading{
    display:flex!important;align-items:center!important;gap:10px!important;
    padding:11px 13px!important;border-bottom:1px solid #E7EDF5!important;
    background:linear-gradient(110deg,#FFFFFF 0%,#F6F9FD 100%)!important;
  }
  #modal.wct-case-detail-modal .wct-action-table-heading>span{
    display:grid!important;place-items:center!important;width:29px!important;height:29px!important;
    flex:0 0 29px!important;border-radius:9px!important;
    background:#EAF2FD!important;color:#2864C7!important;font-size:10px!important;font-weight:900!important;
  }
  #modal.wct-case-detail-modal .wct-action-table-heading h4{
    margin:0!important;color:#1C3554!important;font-size:12px!important;font-weight:900!important;
  }
  #modal.wct-case-detail-modal .wct-action-table-heading p{
    margin:3px 0 0!important;color:#7B8EA5!important;font-size:9px!important;
  }
  #modal.wct-case-detail-modal .wct-action-table-scroll{
    width:100%!important;max-width:100%!important;overflow-x:auto!important;overflow-y:hidden!important;
    overscroll-behavior-x:contain!important;-webkit-overflow-scrolling:touch!important;
  }
  #modal.wct-case-detail-modal .wct-action-table{
    width:100%!important;min-width:730px!important;border-collapse:separate!important;border-spacing:0!important;
    table-layout:auto!important;background:#FFFFFF!important;
  }
  #modal.wct-case-detail-modal .wct-action-table th{
    padding:9px 11px!important;border-bottom:1px solid #E7EDF5!important;
    background:#F5F8FC!important;color:#6D829B!important;text-align:left!important;
    white-space:nowrap!important;font-size:9px!important;font-weight:900!important;
    letter-spacing:.045em!important;text-transform:uppercase!important;
  }
  #modal.wct-case-detail-modal .wct-action-table td{
    padding:10px 11px!important;border-bottom:1px solid #EDF1F6!important;
    background:#FFFFFF!important;color:#405873!important;vertical-align:middle!important;
    font-size:10px!important;
  }
  #modal.wct-case-detail-modal .wct-action-table tbody tr:last-child td{border-bottom:0!important}
  #modal.wct-case-detail-modal .wct-action-table-main{min-width:245px!important;max-width:350px!important}
  #modal.wct-case-detail-modal .wct-action-table-main strong{
    display:block!important;color:#1C3554!important;font-size:10px!important;font-weight:900!important;line-height:1.5!important;
    overflow-wrap:anywhere!important;
  }
  #modal.wct-case-detail-modal .wct-action-table-main small{
    display:-webkit-box!important;margin-top:3px!important;color:#73869D!important;
    font-size:9px!important;line-height:1.45!important;white-space:normal!important;
    -webkit-line-clamp:2!important;-webkit-box-orient:vertical!important;overflow:hidden!important;
  }
  #modal.wct-case-detail-modal .wct-action-table-person{min-width:105px!important;white-space:normal!important;font-weight:750!important}
  #modal.wct-case-detail-modal .wct-action-table-date{min-width:95px!important;white-space:nowrap!important}
  #modal.wct-case-detail-modal .wct-action-table-progress{display:grid!important;gap:4px!important;min-width:105px!important}
  #modal.wct-case-detail-modal .wct-action-table-progress>b{color:#245B9C!important;font-size:10px!important;font-weight:900!important}
  #modal.wct-case-detail-modal .wct-action-table-progress .wct-case-action-track{height:5px!important;background:#E7EEF7!important}
  #modal.wct-case-detail-modal .wct-action-table-progress .wct-case-action-track span{background:linear-gradient(90deg,#2864C7,#79A5DD)!important}
  #modal.wct-case-detail-modal .wct-action-table-progress>small{display:block!important;line-height:1!important}
  #modal.wct-case-detail-modal .wct-action-table-progress .status{display:inline-flex!important;margin:0!important;padding:3px 6px!important;font-size:8px!important}
  #modal.wct-case-detail-modal .wct-action-table-buttons{
    display:flex!important;align-items:center!important;gap:6px!important;min-width:118px!important;
  }
  #modal.wct-case-detail-modal .wct-action-table-buttons .wct-action-icon-btn{
    display:inline-flex!important;flex:0 0 31px!important;align-items:center!important;justify-content:center!important;
    width:31px!important;min-width:31px!important;height:31px!important;min-height:31px!important;
    padding:0!important;border-radius:8px!important;white-space:nowrap!important;
    box-shadow:none!important;transition:transform .15s ease,background .15s ease,border-color .15s ease!important;
  }
  #modal.wct-case-detail-modal .wct-action-table-buttons .wct-action-icon-btn:hover{
    transform:translateY(-1px)!important;
  }
  #modal.wct-case-detail-modal .wct-action-table-buttons .wct-action-icon-btn svg{
    display:block!important;width:14px!important;height:14px!important;fill:none!important;
    stroke:currentColor!important;stroke-width:1.8!important;stroke-linecap:round!important;stroke-linejoin:round!important;
  }
  #modal.wct-case-detail-modal .wct-action-table-buttons .wct-action-row-edit{
    border:1px solid #D6E1ED!important;background:#FFFFFF!important;color:#38516F!important;
  }
  #modal.wct-case-detail-modal .wct-action-table-buttons .wct-action-row-update{
    border:1px solid #2864C7!important;background:#2864C7!important;color:#FFFFFF!important;
  }
  #modal.wct-case-detail-modal .wct-action-table-buttons .wct-action-row-delete{
    border:1px solid #F0C7CA!important;background:#FFF5F5!important;color:#B13E49!important;
  }
  #modal.wct-case-detail-modal .wct-action-table-buttons .wct-action-row-delete:hover{
    border-color:#D98289!important;background:#FDEBEC!important;color:#9D2E3A!important;
  }
  #modal.wct-case-detail-modal .wct-action-table-buttons .wct-action-icon-btn:disabled{
    opacity:.55!important;cursor:wait!important;transform:none!important;
  }
  #modal.wct-case-detail-modal .wct-action-table-empty{
    padding:15px 12px!important;color:#8797AA!important;text-align:center!important;font-size:10px!important;
  }
  @media(max-width:760px){
    #modal.wct-case-detail-modal .wct-action-tables{gap:10px!important}
    #modal.wct-case-detail-modal .wct-action-table-heading{padding:10px 11px!important}
    #modal.wct-case-detail-modal .wct-action-table th{padding:8px 9px!important}
    #modal.wct-case-detail-modal .wct-action-table td{padding:9px!important}
  }

/* In-app confirmation dialog for destructive Action deletion. */
.wct-action-delete-overlay{
  position:fixed!important;inset:0!important;z-index:1000000!important;
  display:grid!important;place-items:center!important;padding:18px!important;
  background:rgba(13,25,40,.58)!important;backdrop-filter:blur(7px)!important;
  -webkit-backdrop-filter:blur(7px)!important;
  animation:wctActionDeleteFade .16s ease-out both!important;
}
.wct-action-delete-dialog{
  display:grid!important;grid-template-columns:48px minmax(0,1fr)!important;column-gap:14px!important;row-gap:18px!important;
  width:min(470px,calc(100vw - 28px))!important;max-width:470px!important;
  box-sizing:border-box!important;padding:22px!important;
  border:1px solid #E1E8F0!important;border-radius:18px!important;
  background:#FFFFFF!important;color:#1D3552!important;
  box-shadow:0 24px 80px rgba(7,22,41,.27)!important;
  animation:wctActionDeleteEnter .19s ease-out both!important;
}
.wct-action-delete-icon{
  display:grid!important;place-items:center!important;width:46px!important;height:46px!important;
  border:1px solid #F3D0D2!important;border-radius:14px!important;
  background:#FFF1F1!important;color:#B13E49!important;
}
.wct-action-delete-icon svg{display:block!important;width:23px!important;height:23px!important;fill:none!important;stroke:currentColor!important;stroke-width:1.8!important;stroke-linecap:round!important;stroke-linejoin:round!important}
.wct-action-delete-content{min-width:0!important}
.wct-action-delete-content h2{margin:1px 0 7px!important;color:#1C3554!important;font-size:17px!important;font-weight:900!important;line-height:1.3!important}
.wct-action-delete-content>p:not(.wct-action-delete-warning){margin:0 0 8px!important;color:#71839A!important;font-size:11px!important;line-height:1.55!important}
.wct-action-delete-name{
  display:block!important;padding:10px 11px!important;border:1px solid #E6ECF3!important;border-radius:10px!important;
  background:#F7F9FC!important;color:#294361!important;font-size:11px!important;font-weight:850!important;
  line-height:1.5!important;overflow-wrap:anywhere!important;
}
.wct-action-delete-warning{
  grid-column:1/-1!important;margin:11px 0 0!important;padding:10px 11px!important;
  border:1px solid #F2DFB9!important;border-radius:10px!important;
  background:#FFFAF0!important;color:#86601B!important;font-size:10px!important;line-height:1.55!important;
}
.wct-action-delete-footer{
  grid-column:1/-1!important;display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:8px!important;
}
.wct-action-delete-footer button{
  display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:7px!important;
  min-height:40px!important;padding:9px 14px!important;border:1px solid #D8E2ED!important;border-radius:10px!important;
  background:#FFFFFF!important;color:#38516F!important;font-size:11px!important;font-weight:850!important;
  cursor:pointer!important;transition:background .15s ease,border-color .15s ease,transform .15s ease!important;
}
.wct-action-delete-footer button:hover{transform:translateY(-1px)!important}
.wct-action-delete-footer .wct-action-delete-confirm{
  border-color:#B63E49!important;background:#B63E49!important;color:#FFFFFF!important;
  box-shadow:0 5px 13px rgba(182,62,73,.16)!important;
}
.wct-action-delete-footer .wct-action-delete-confirm:hover{border-color:#9D2E3A!important;background:#9D2E3A!important}
.wct-action-delete-footer .wct-action-delete-confirm svg{
  width:14px!important;height:14px!important;fill:none!important;stroke:currentColor!important;
  stroke-width:1.8!important;stroke-linecap:round!important;stroke-linejoin:round!important;
}
.wct-action-delete-footer button:focus-visible{outline:3px solid rgba(40,100,199,.28)!important;outline-offset:2px!important}
@keyframes wctActionDeleteFade{from{opacity:0}to{opacity:1}}
@keyframes wctActionDeleteEnter{from{opacity:0;transform:translateY(7px) scale(.985)}to{opacity:1;transform:translateY(0) scale(1)}}
@media(max-width:480px){
  .wct-action-delete-overlay{padding:12px!important}
  .wct-action-delete-dialog{grid-template-columns:40px minmax(0,1fr)!important;column-gap:11px!important;width:calc(100vw - 24px)!important;padding:17px!important;border-radius:15px!important}
  .wct-action-delete-icon{width:40px!important;height:40px!important;border-radius:12px!important}
  .wct-action-delete-content h2{font-size:15px!important}
  .wct-action-delete-footer{gap:7px!important}
  .wct-action-delete-footer button{flex:1 1 0!important;min-width:0!important;padding:9px 10px!important}
}
[data-wct-appearance="dark"] .wct-action-delete-dialog{
  border-color:#35485A!important;background:#172330!important;color:#E8EDF3!important;
}
[data-wct-appearance="dark"] .wct-action-delete-content h2{color:#F1F5F9!important}
[data-wct-appearance="dark"] .wct-action-delete-content>p:not(.wct-action-delete-warning){color:#AEBBC8!important}
[data-wct-appearance="dark"] .wct-action-delete-name{border-color:#35485A!important;background:#1B2A39!important;color:#E8EDF3!important}
[data-wct-appearance="dark"] .wct-action-delete-warning{border-color:#72531F!important;background:#302719!important;color:#FFE0A3!important}
[data-wct-appearance="dark"] .wct-action-delete-footer .wct-action-delete-cancel{border-color:#405367!important;background:#1B2A39!important;color:#E8EDF3!important}
@media(prefers-reduced-motion:reduce){
  .wct-action-delete-overlay,.wct-action-delete-dialog{animation:none!important}
  .wct-action-delete-footer button{transition:none!important}
}

`;
  const runtime = String.raw`
(function(){
  if(window.__WCT_PICAPA_MODAL_POLISH__)return;
  window.__WCT_PICAPA_MODAL_POLISH__=true;
  function classify(){
    var modal=document.getElementById('modal');
    if(!modal)return;
    var progress=modal.querySelector('#wctProgressForm')||modal.querySelector('form[onsubmit*="submitProgress"]');
    var action=modal.querySelector('form[onsubmit*="submitAction"]');
    modal.classList.toggle('wct-modal-progress',!!progress);
    modal.classList.toggle('wct-modal-action',!progress&&!!action);
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
  return html.replace('</body>', '<style id="wct-picapa-modal-polish-style">' + css + detailLayoutCss + '</style><script id="wct-picapa-modal-polish">' + runtime + '</script></body>');
};
