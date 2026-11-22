module.exports = function addDashboardAndInteractionUpgrades(html) {
  const css = String.raw`
/* Case forms: task-entry layout inspired by HUB WORKSPACE */
#modal.wct-case-workspace-modal{
  width:min(940px,calc(100vw - 32px));
  max-width:940px;
  max-height:min(94vh,900px);
  padding:0;
  overflow:hidden;
  border:1px solid #E1E5EB;
  border-radius:16px;
  background:#fff;
  box-shadow:0 26px 80px rgba(26,35,49,.22);
}
#modal.wct-case-workspace-modal .modal-head{
  display:flex;align-items:flex-start;justify-content:space-between;gap:18px;
  margin:0;padding:22px 25px 17px;
  border-bottom:1px solid #EDF0F4;background:#fff;
}
#modal.wct-case-workspace-modal .modal-head .eyebrow{
  color:#B87900;font-size:9px;font-weight:900;letter-spacing:.13em;
}
#modal.wct-case-workspace-modal .modal-head h2{
  margin:5px 0 4px;color:#202938;font-size:20px;font-weight:850;letter-spacing:-.035em;
}
#modal.wct-case-workspace-modal .modal-head .sub,
#modal.wct-case-workspace-modal .modal-head p{
  margin:0;color:#8992A0;font-size:10px;line-height:1.5;
}
#modal.wct-case-workspace-modal .close{
  display:grid;place-items:center;width:34px;height:34px;min-width:34px;
  border:1px solid #E7EAF0;border-radius:10px;background:#F7F8FA;color:#586171;
  font-size:17px;cursor:pointer;
}
#modal.wct-case-workspace-modal form{
  display:flex;flex-direction:column;min-height:0;max-height:calc(min(94vh,900px) - 76px);
}
#modal.wct-case-workspace-modal .modal-body{
  flex:1 1 auto;min-height:0;overflow:auto;padding:21px 25px 24px;
  background:#fff;
}
#modal.wct-case-workspace-modal .form-grid{
  display:grid;grid-template-columns:repeat(2,minmax(0,1fr));
  align-items:start;gap:15px 17px;
}
#modal.wct-case-workspace-modal .field{
  display:flex;flex-direction:column;gap:7px;min-width:0;
}
#modal.wct-case-workspace-modal .field.span-2{grid-column:1/-1}
#modal.wct-case-workspace-modal .field>label,
#modal.wct-case-workspace-modal .wct-picker-label{
  display:block;margin:0;color:#465164;font-size:10px;font-weight:850;line-height:1.4;
}
#modal.wct-case-workspace-modal .field input:not([type=checkbox]):not([type=range]),
#modal.wct-case-workspace-modal .field select,
#modal.wct-case-workspace-modal .field textarea{
  display:block;width:100%;min-width:0;min-height:40px;box-sizing:border-box;
  padding:10px 12px;border:1px solid #DFE5ED;border-radius:9px;
  background:#FBFCFD!important;color:#263244!important;
  font-family:inherit;font-size:11px;font-weight:500;line-height:1.5;outline:none;box-shadow:none!important;
  transition:border-color .16s,background .16s,box-shadow .16s;
}
#modal.wct-case-workspace-modal .field textarea{min-height:92px;resize:vertical}
#modal.wct-case-workspace-modal .field input:focus,
#modal.wct-case-workspace-modal .field select:focus,
#modal.wct-case-workspace-modal .field textarea:focus{
  border-color:#E9AC35;background:#fff!important;
  box-shadow:0 0 0 3px rgba(233,172,53,.14)!important;
}
#modal.wct-case-workspace-modal .field input::placeholder,
#modal.wct-case-workspace-modal .field textarea::placeholder{color:#A3AAB5}
#modal.wct-case-workspace-modal .field select option{background:#fff;color:#263244}
#modal.wct-case-workspace-modal .field:has([data-wct-picker]){grid-column:1/-1}
#modal.wct-case-workspace-modal .wct-multi-picker{
  display:flex;flex-wrap:wrap;gap:8px;margin-top:1px;
}
#modal.wct-case-workspace-modal .wct-choice-chip{
  display:inline-flex;align-items:center;gap:8px;min-height:36px;
  padding:8px 11px;border:1px solid #E1E6ED;border-radius:9px;
  background:#fff;color:#465164;font-size:10px;font-weight:800;cursor:pointer;
  transition:border-color .15s,background .15s,color .15s;
}
#modal.wct-case-workspace-modal .wct-choice-chip input{
  width:14px!important;height:14px!important;min-height:14px!important;
  margin:0;accent-color:#E6A126;cursor:pointer;
}
#modal.wct-case-workspace-modal .wct-choice-chip:has(input:checked){
  border-color:#E6A126;background:#FFF8E9;color:#805400;
}
#modal.wct-case-workspace-modal .wct-picker-hint{
  display:block;margin-top:1px;color:#929BA9;font-size:9px;
}
#modal.wct-case-workspace-modal .section-title,
#modal.wct-case-workspace-modal .wct-case-editor-section{
  display:flex;align-items:center;gap:9px;margin:23px 0 13px;padding:0 0 9px;
  border-bottom:1px solid #E9EDF2;color:#303A4A;font-size:10px;font-weight:900;
  letter-spacing:.08em;text-transform:uppercase;
}
#modal.wct-case-workspace-modal .section-title:before,
#modal.wct-case-workspace-modal .wct-case-editor-section:before{
  content:"";width:4px;height:15px;border-radius:5px;background:#E9A62D;
}
#modal.wct-case-workspace-modal .wct-case-editor-intro{
  display:flex;align-items:flex-start;gap:10px;margin:0 0 18px;padding:12px 13px;
  border:1px solid #E9EDF2;border-radius:11px;background:#F8FAFC;
}
#modal.wct-case-workspace-modal .wct-case-editor-intro strong{color:#394457;font-size:10px}
#modal.wct-case-workspace-modal .wct-case-editor-intro p{margin:4px 0 0;color:#858E9D;font-size:9px;line-height:1.5}
#modal.wct-case-workspace-modal .wct-priority-buttons{
  display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;
}
#modal.wct-case-workspace-modal .wct-priority-choice{
  min-height:39px;border:1px solid #E2E6ED;border-radius:9px;background:#fff;
  color:#647084;font-size:10px;font-weight:850;cursor:pointer;
}
#modal.wct-case-workspace-modal .wct-priority-choice.is-selected{
  border-color:#E4A22B;background:#FFF7E7;color:#8B5A00;
  box-shadow:0 0 0 2px rgba(228,162,43,.10);
}
#modal.wct-case-workspace-modal .modal-foot,
#modal.wct-case-workspace-modal .wct-flow-form-footer{
  position:relative;display:flex;align-items:center;justify-content:flex-end;gap:9px;
  flex:0 0 auto;margin:0;padding:13px 25px calc(13px + env(safe-area-inset-bottom));
  border-top:1px solid #E9EDF2;background:#fff;
}
#modal.wct-case-workspace-modal .modal-foot .btn,
#modal.wct-case-workspace-modal .wct-flow-form-footer .btn{
  min-height:38px;padding:9px 15px;border-radius:9px;font-size:10px;font-weight:850;
}
#modal.wct-case-workspace-modal .modal-foot .btn-primary,
#modal.wct-case-workspace-modal .wct-flow-form-footer .btn-primary{
  border:1px solid #D99417;background:#E7A329;color:#202938;
  box-shadow:0 3px 8px rgba(199,135,22,.16);
}
#modal.wct-case-workspace-modal .modal-foot .btn:not(.btn-primary),
#modal.wct-case-workspace-modal .wct-flow-form-footer .btn:not(.btn-primary){
  border:1px solid #E0E5EC;background:#fff;color:#626D7E;
}
#modal.wct-case-workspace-modal .wct-flow-form-footer-note{margin-right:auto;color:#929AA6;font-size:9px}
@media(max-width:700px){
  #modal.wct-case-workspace-modal{width:calc(100vw - 14px);max-height:calc(100dvh - 14px);border-radius:14px}
  #modal.wct-case-workspace-modal .modal-head{padding:16px 15px 13px}
  #modal.wct-case-workspace-modal .modal-head h2{font-size:17px}
  #modal.wct-case-workspace-modal form{max-height:calc(100dvh - 94px)}
  #modal.wct-case-workspace-modal .modal-body{padding:15px 14px 19px}
  #modal.wct-case-workspace-modal .form-grid{grid-template-columns:1fr;gap:12px}
  #modal.wct-case-workspace-modal .field.span-2,
  #modal.wct-case-workspace-modal .field:has([data-wct-picker]){grid-column:1}
  #modal.wct-case-workspace-modal .modal-foot,
  #modal.wct-case-workspace-modal .wct-flow-form-footer{padding:11px 14px calc(11px + env(safe-area-inset-bottom))}
  #modal.wct-case-workspace-modal .wct-flow-form-footer-note{display:none}
}

/* HUB WORKSPACE-style right-side progress conversation drawer */
.wct-progress-drawer-backdrop{
  position:fixed;inset:0;z-index:1200;display:flex;justify-content:flex-end;align-items:stretch;
  background:rgba(20,29,42,.42);backdrop-filter:blur(2px);
  animation:wctProgressOverlayIn .18s ease-out both;
}
.wct-progress-drawer{
  display:flex;flex-direction:column;width:min(540px,100vw);height:100dvh;max-height:100dvh;
  min-height:0;margin-left:auto;overflow:hidden;background:#F4F6F8;
  border-left:1px solid #E0E5EB;box-shadow:-18px 0 55px rgba(22,31,45,.18);
  animation:wctProgressDrawerIn .26s cubic-bezier(.2,.85,.25,1) both;
}
.wct-progress-drawer-head{
  display:flex;align-items:center;justify-content:space-between;gap:12px;flex:0 0 auto;
  min-height:82px;padding:14px 18px;background:#252D3A;color:#fff;
  border-bottom:1px solid rgba(255,255,255,.08);
}
.wct-progress-drawer-title{display:flex;align-items:center;gap:11px;min-width:0}
.wct-progress-drawer-mark{
  display:grid;place-items:center;width:39px;height:39px;flex:0 0 39px;border-radius:12px;
  background:#F3C56B;color:#63420B;font-size:12px;font-weight:950;
}
.wct-progress-drawer-title>div:last-child{min-width:0}
.wct-progress-drawer-title .eyebrow{color:#E9C477;font-size:8px;font-weight:900;letter-spacing:.12em}
.wct-progress-drawer-title h2{
  max-width:410px;margin:3px 0 2px;color:#fff;font-size:13px;font-weight:850;
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
.wct-progress-drawer-title p{margin:0;color:#C7CED9;font-size:9px}
.wct-progress-drawer-close{
  display:grid;place-items:center;width:33px;height:33px;flex:0 0 33px;
  border:1px solid rgba(255,255,255,.2);border-radius:50%;background:rgba(255,255,255,.08);
  color:#fff;font-size:19px;cursor:pointer;
}
.wct-progress-drawer-summary{
  display:flex;align-items:center;gap:9px;flex-wrap:wrap;flex:0 0 auto;
  padding:10px 16px;border-bottom:1px solid #E5E9EE;background:#fff;
}
.wct-progress-summary-pill{
  display:inline-flex;align-items:center;gap:5px;padding:5px 9px;border:1px solid #E5E9EE;
  border-radius:999px;background:#F8FAFC;color:#596678;font-size:9px;font-weight:850;
}
.wct-progress-summary-value{margin-left:auto;color:#596678;font-size:9px}
.wct-progress-summary-value b{color:#293445;font-size:12px}
.wct-progress-thread{
  flex:1 1 auto;min-height:0;overflow:auto;overscroll-behavior:contain;
  display:flex;flex-direction:column;gap:12px;padding:16px 14px 18px;
  background-color:#EDF1F4;
  background-image:radial-gradient(rgba(74,90,111,.08) .7px,transparent .7px);
  background-size:13px 13px;
}
.wct-progress-thread-day{display:flex;justify-content:center;margin:0 0 3px}
.wct-progress-thread-day span{
  padding:5px 10px;border:1px solid #DEE4EA;border-radius:999px;
  background:rgba(255,255,255,.9);color:#8791A0;font-size:8px;font-weight:850;letter-spacing:.1em;
}
.wct-progress-message{display:flex;align-items:flex-end;gap:7px;width:min(94%,450px)}
.wct-progress-message.mine{align-self:flex-end;justify-content:flex-end}
.wct-progress-avatar{
  display:grid;place-items:center;width:26px;height:26px;flex:0 0 26px;border:1px solid #DDE3EA;
  border-radius:50%;background:#fff;color:#647184;font-size:8px;font-weight:900;
}
.wct-progress-message.mine .wct-progress-avatar{background:#F7EACD;color:#815A16;border-color:#F0DEBA}
.wct-progress-message-content{display:flex;flex-direction:column;gap:4px;min-width:0;max-width:calc(100% - 34px)}
.wct-progress-message.mine .wct-progress-message-content{align-items:flex-end}
.wct-progress-message-meta{display:flex;align-items:center;gap:8px;padding:0 4px}
.wct-progress-message-meta b{color:#59687D;font-size:8px}
.wct-progress-message-meta time{color:#9AA3AF;font-size:7px}
.wct-progress-bubble{
  padding:9px 11px;border:1px solid #E0E5EB;border-radius:3px 11px 11px 11px;
  background:#fff;box-shadow:0 1px 2px rgba(35,44,59,.04);
}
.wct-progress-message.mine .wct-progress-bubble{
  border-color:#F0DBB0;border-radius:11px 3px 11px 11px;background:#FFF4DE;
}
.wct-progress-bubble p{margin:0;color:#3E495A;font-size:10px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}
.wct-progress-change{
  display:flex;flex-wrap:wrap;gap:5px 10px;margin-top:8px;padding-top:7px;
  border-top:1px solid rgba(110,122,139,.14);
}
.wct-progress-change span{color:#8490A0;font-size:8px}
.wct-progress-change b{color:#67501F}
.wct-progress-edit-history{
  margin-top:7px;color:#A27528;font-size:8px;font-weight:750;
}
.wct-progress-thread-empty{
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;
  min-height:170px;text-align:center;color:#8A95A3;
}
.wct-progress-thread-empty>span{font-size:25px}
.wct-progress-thread-empty b{color:#596678;font-size:11px}
.wct-progress-thread-empty small{max-width:260px;color:#929BA8;font-size:9px;line-height:1.5}
.wct-progress-readonly{
  flex:0 0 auto;padding:14px 16px;border-top:1px solid #E1E6EC;background:#fff;
  color:#7D8795;font-size:10px;
}
.wct-progress-compose{
  display:flex;flex-direction:column;gap:9px;flex:0 0 auto;margin:0;padding:11px 13px calc(12px + env(safe-area-inset-bottom));
  border:0;border-top:1px solid #E1E6EC;border-radius:0;background:#fff;
  box-shadow:0 -5px 18px rgba(35,44,59,.04);
}
.wct-progress-compose-message{
  width:100%;min-height:58px;max-height:145px;resize:vertical;padding:10px 12px;
  border:1px solid #E0E5EB;border-radius:10px;background:#FBFCFD;color:#354154;
  font-family:inherit;font-size:10px;font-weight:500;line-height:1.5;outline:none;
}
.wct-progress-compose-message:focus{border-color:#E5AD43;box-shadow:0 0 0 3px rgba(229,173,67,.13)}
.wct-progress-compose-controls{display:flex;align-items:flex-end;gap:8px}
.wct-progress-compose-controls label{display:flex;flex-direction:column;gap:4px;min-width:0;color:#707C8D;font-size:8px;font-weight:850}
.wct-progress-compose-controls label.status{flex:1.1}
.wct-progress-compose-controls label.progress{flex:.8}
.wct-progress-compose-controls select,
.wct-progress-compose-controls input{
  display:block;width:100%;min-width:0;height:34px;padding:6px 8px;border:1px solid #E0E5EB;
  border-radius:7px;background:#fff;color:#3E4A5D;font-size:9px;outline:none;
}
.wct-progress-compose-controls .wct-progress-counter{margin:0 2px 9px auto;color:#9BA3AE;font-size:8px;white-space:nowrap}
.wct-progress-send{
  display:grid;place-items:center;width:38px;height:38px;flex:0 0 38px;border:0;border-radius:50%;
  background:#E4A32C;color:#242D3A;font-size:17px;font-weight:900;cursor:pointer;
  box-shadow:0 3px 8px rgba(202,143,31,.2);
}
.wct-progress-send:disabled{opacity:.45;cursor:not-allowed}
.wct-progress-extra{border-top:1px solid #EEF0F3;padding-top:8px}
.wct-progress-extra summary{color:#828C9A;font-size:9px;font-weight:800;cursor:pointer}
.wct-progress-extra-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:9px}
.wct-progress-extra-grid label{display:flex;flex-direction:column;gap:4px;color:#788394;font-size:8px;font-weight:800}
.wct-progress-extra-grid textarea{width:100%;min-height:56px;padding:8px;border:1px solid #E0E5EB;border-radius:8px;background:#FBFCFD;color:#354154;font-size:9px;resize:vertical}
.wct-progress-edit-banner{padding:9px 11px;border:1px solid #F0D8A7;border-radius:9px;background:#FFFAF0;color:#896018;font-size:9px;line-height:1.5}
.wct-priority-seven-day{margin:0 0 17px;border:1px solid #E4E8EE;border-radius:15px;background:#fff;overflow:hidden;box-shadow:0 7px 20px rgba(30,40,55,.04)}
.wct-priority-seven-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:15px 17px 13px;border-bottom:1px solid #EDF0F4}
.wct-priority-seven-head h3{margin:3px 0 4px;color:#293445;font-size:13px;font-weight:900;letter-spacing:-.02em}
.wct-priority-seven-head p{margin:0;color:#8B94A2;font-size:9px}
.wct-priority-seven-kicker{color:#B87900;font-size:8px;font-weight:900;letter-spacing:.14em}
.wct-priority-seven-count{padding:6px 9px;border:1px solid #F0DFBB;border-radius:999px;background:#FFFAEF;color:#8F620D;font-size:9px;font-weight:850;white-space:nowrap}
.wct-priority-seven-list{display:grid}


.wct-case-create-next-step{display:flex;flex-direction:column;gap:5px;margin-top:19px;padding:13px 14px;border:1px solid #E9EDF2;border-radius:11px;background:#F8FAFC}
.wct-case-create-step{color:#B87900;font-size:8px;font-weight:900;letter-spacing:.13em}
.wct-case-create-next-step strong{color:#3A4658;font-size:10px}
.wct-case-create-next-step p{margin:0;color:#86909F;font-size:9px;line-height:1.55}
.wct-priority-seven-wrap{width:100%;overflow-x:auto;border-radius:0 0 14px 14px}
.wct-priority-seven-table{min-width:1280px;margin:0;border-collapse:separate;border-spacing:0}
.wct-priority-seven-table thead th{position:sticky;top:0;z-index:1;padding:11px 12px;background:#F8F9FB;color:#6E7888;font-size:9px;font-weight:900;letter-spacing:.035em;white-space:nowrap;border-bottom:1px solid #E8ECF1}
.wct-priority-seven-table tbody td{padding:12px;border-bottom:1px solid #EEF0F4;color:#4B5667;font-size:9px;vertical-align:middle}
.wct-priority-seven-table tbody tr:last-child td{border-bottom:0}
.wct-priority-seven-table tbody tr:hover td{background:#FFFCF5}
.wct-priority-kind{display:inline-flex;padding:5px 7px;border-radius:7px;background:#EEF2F7;color:#596779;font-size:8px;font-weight:900;white-space:nowrap}
.wct-priority-kind.corrective{background:#FCEBEC;color:#A7464B}
.wct-priority-kind.preventive{background:#EDF5EF;color:#3B7A5A}
.wct-priority-kind.case{background:#FFF2D9;color:#93620C}
.wct-priority-table-progress{display:flex;align-items:center;gap:7px;min-width:88px}
.wct-priority-table-progress>div{width:55px;height:6px;border-radius:99px;background:#EDF0F4;overflow:hidden}
.wct-priority-table-progress>div span{display:block;height:100%;border-radius:inherit;background:#D99A2C}
.wct-priority-table-progress b{color:#5E6A7C;font-size:9px}
.wct-priority-row-actions{display:flex;align-items:center;gap:5px;white-space:nowrap}
.wct-priority-row-actions .btn{min-height:27px;padding:5px 8px;font-size:8px}
.wct-priority-seven-empty{padding:25px 16px;text-align:center;color:#8D97A5;font-size:10px}
@media(max-width:700px){.wct-priority-seven-table{min-width:1280px}.wct-priority-seven-head{padding:14px}}
.wct-priority-seven-row{
  display:grid;grid-template-columns:82px minmax(0,1fr) 90px 76px auto;align-items:center;gap:12px;
  padding:11px 16px;border-bottom:1px solid #F0F2F5;
}
.wct-priority-seven-row:last-child{border-bottom:0}
.wct-priority-seven-date{color:#354154;font-size:10px;font-weight:850}
.wct-priority-seven-date small{display:block;margin-top:3px;color:#929BA8;font-size:8px;font-weight:650}
.wct-priority-seven-main{min-width:0}
.wct-priority-seven-main strong{display:block;overflow:hidden;color:#313C4D;font-size:10px;font-weight:850;text-overflow:ellipsis;white-space:nowrap}
.wct-priority-seven-main small{display:block;margin-top:3px;overflow:hidden;color:#8B95A3;font-size:8px;text-overflow:ellipsis;white-space:nowrap}
.wct-priority-seven-tag{justify-self:start;padding:5px 7px;border-radius:7px;background:#F2F4F7;color:#657184;font-size:8px;font-weight:850}
.wct-priority-seven-tag.high{background:#FCEBEC;color:#B5494E}
.wct-priority-seven-tag.medium{background:#FFF3DE;color:#9C6B18}
.wct-priority-seven-tag.low{background:#EAF4EF;color:#397C5D}
.wct-priority-seven-progress{color:#667285;font-size:9px;font-weight:850;text-align:right;white-space:nowrap}
.wct-priority-seven-open{min-height:29px;padding:6px 9px;border:1px solid #E1E6ED;border-radius:8px;background:#fff;color:#526075;font-size:8px;font-weight:850;cursor:pointer}
.wct-priority-seven-open:hover{border-color:#E4B455;background:#FFFAEF;color:#8A5B00}
.wct-priority-seven-empty{padding:22px 15px;text-align:center;color:#8D97A5;font-size:10px}
@keyframes wctProgressOverlayIn{from{opacity:0}to{opacity:1}}
@keyframes wctProgressDrawerIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
@media(max-width:760px){
  .wct-progress-drawer{width:100vw;border-left:0}
  .wct-progress-drawer-head{min-height:72px;padding:12px 13px}
  .wct-progress-drawer-title h2{max-width:calc(100vw - 110px);font-size:12px}
  .wct-progress-drawer-summary{padding:8px 11px;gap:6px}
  .wct-progress-summary-value{margin-left:0}
  .wct-progress-thread{padding:12px 8px 14px;gap:10px}
  .wct-progress-message{width:97%;gap:5px}
  .wct-progress-message-content{max-width:calc(100% - 30px)}
  .wct-progress-compose{padding:9px 9px calc(10px + env(safe-area-inset-bottom))}
  .wct-progress-compose-controls{gap:6px}
  .wct-progress-compose-controls label.status{flex:1}
  .wct-progress-compose-controls label.progress{flex:.75}
  .wct-progress-compose-controls .wct-progress-counter{display:none}
  .wct-progress-extra-grid{grid-template-columns:1fr}
  .wct-priority-seven-row{grid-template-columns:64px minmax(0,1fr) auto;gap:8px;padding:10px 11px}
  .wct-priority-seven-row .wct-priority-seven-tag{display:none}
  .wct-priority-seven-progress{display:none}
}
`;
  const runtime = String.raw`
(function(){
  if(window.__WCT_DASHBOARD_INTERACTION_UPGRADES__)return;
  window.__WCT_DASHBOARD_INTERACTION_UPGRADES__=true;
  var $=function(id){return document.getElementById(id);};
  var esc=function(value){return String(value==null?'':value).replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];});};
  var oldOpenCase=window.openCaseForm,oldEditCase=window.editCaseForm;
  function decorateCaseModal(){
    var modal=$('modal');if(!modal)return;
    modal.classList.add('wct-case-workspace-modal');
    var body=modal.querySelector('.modal-body');if(body)body.classList.add('wct-case-workspace-body');
    var form=modal.querySelector('#caseForm,#wctCaseEditorForm');
    if(form)form.classList.add('wct-case-workspace-form');
  }
  if(typeof oldOpenCase==='function'&&!oldOpenCase.__wctWorkspaceCaseForm){
    var wrappedOpenCase=function(){var result=oldOpenCase.apply(this,arguments);window.setTimeout(decorateCaseModal,65);return result;};
    wrappedOpenCase.__wctWorkspaceCaseForm=true;window.openCaseForm=wrappedOpenCase;
  }
  if(typeof oldEditCase==='function'&&!oldEditCase.__wctWorkspaceCaseForm){
    var wrappedEditCase=function(){var result=oldEditCase.apply(this,arguments);window.setTimeout(decorateCaseModal,85);return result;};
    wrappedEditCase.__wctWorkspaceCaseForm=true;window.editCaseForm=wrappedEditCase;
  }
  function observeCaseModal(){
    var modal=$('modal');if(!modal||modal.dataset.wctCaseModalObserver)return;
    modal.dataset.wctCaseModalObserver='1';
    var refresh=function(){
      var isCase=!!modal.querySelector('#caseForm,#wctCaseEditorForm');
      modal.classList.toggle('wct-case-workspace-modal',isCase);
      var body=modal.querySelector('.modal-body');if(body)body.classList.toggle('wct-case-workspace-body',isCase);
    };
    new MutationObserver(refresh).observe(modal,{childList:true,subtree:true});
    refresh();
  }

  function profileName(id){
    var profiles=(typeof state!=='undefined'&&state.profiles)||[];
    var found=profiles.find(function(person){return String(person.id)===String(id);});
    return found?(found.full_name||found.login_id||'Anggota'):'Belum ditentukan';
  }
  function localDate(value){
    if(!value)return null;
    var parts=String(value).slice(0,10).split('-');
    if(parts.length!==3)return null;
    var date=new Date(Number(parts[0]),Number(parts[1])-1,Number(parts[2]));
    return Number.isNaN(date.getTime())?null:date;
  }
  function dateKey(date){return date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0')+'-'+String(date.getDate()).padStart(2,'0');}
  function dayGap(value,today){
    var date=localDate(value);if(!date)return null;
    return Math.round((date.getTime()-today.getTime())/86400000);
  }
  function priorityRank(value){
    var p=String(value||'Medium').toLowerCase();
    return p==='high'?0:p==='medium'?1:p==='low'?2:3;
  }
  function priorityClass(value){var p=String(value||'Medium').toLowerCase();return p==='high'?'high':p==='low'?'low':'medium';}
  function fmtShortDate(value){
    var date=localDate(value);return date?date.toLocaleDateString('id-ID',{day:'2-digit',month:'short'}):'—';
  }
  function caseCodes(item){
    var values=Array.isArray(item.hub_codes)&&item.hub_codes.length?item.hub_codes:[item.hub_code];
    return values.filter(Boolean).join(', ')||'—';
  }
  function buildPriorityRows(){
    var cases=(typeof state!=='undefined'&&state.cases)||[];
    var actions=(typeof state!=='undefined'&&state.actions)||[];
    var today=new Date();today.setHours(0,0,0,0);
    var rows=[];
    function hubLabel(record){
      return (Array.isArray(record.hub_codes)&&record.hub_codes.length?record.hub_codes:[record.hub_code]).filter(Boolean).join(', ')||'—';
    }
    function divisionLabel(record){
      return (Array.isArray(record.divisions)&&record.divisions.length?record.divisions:[record.division]).filter(Boolean).join(', ')||'—';
    }
    function avgCaseProgress(caseId){
      var related=actions.filter(function(action){return String(action.case_id)===String(caseId);});
      return related.length?Math.round(related.reduce(function(sum,action){return sum+Math.max(0,Math.min(100,Number(action.progress)||0));},0)/related.length):0;
    }
    cases.forEach(function(item){
      if(item.status==='closed'||!item.target_date)return;
      var gap=dayGap(item.target_date,today);
      if(gap===null||gap<0||gap>7)return;
      rows.push({
        id:'case-'+item.id,kind:'Case',title:item.title||item.case_code||'Case',
        caseCode:item.case_code||item.case_number||'CASE',
        caseTitle:item.title||'—',hub:hubLabel(item),division:divisionLabel(item),
        category:item.category||'—',pic:item.reporter||profileName(item.created_by),
        date:item.target_date,gap:gap,priority:item.priority||'Medium',
        status:item.status||'open',progress:avgCaseProgress(item.id),
        caseId:item.id,actionId:''
      });
    });
    actions.forEach(function(action){
      if(action.status==='done'||action.status==='cancelled'||!action.due_date)return;
      var parent=cases.find(function(item){return String(item.id)===String(action.case_id);});
      if(!parent||parent.status==='closed')return;
      var gap=dayGap(action.due_date,today);
      if(gap===null||gap<0||gap>7)return;
      rows.push({
        id:'action-'+action.id,
        kind:action.action_type==='preventive'?'Preventive Action':'Corrective Action',
        title:action.title||'Action',
        caseCode:parent.case_code||parent.case_number||'CASE',
        caseTitle:parent.title||'—',
        hub:hubLabel(parent),division:divisionLabel(parent),category:parent.category||'—',
        pic:profileName(action.assigned_to),
        date:action.due_date,gap:gap,priority:parent.priority||'Medium',
        status:action.status||'open',progress:Math.max(0,Math.min(100,Number(action.progress)||0)),
        caseId:parent.id,actionId:action.id
      });
    });
    return rows.sort(function(a,b){
      return a.gap-b.gap||priorityRank(a.priority)-priorityRank(b.priority)||
        (a.kind==='Case'?-1:1)||String(a.title).localeCompare(String(b.title));
    });
  }
  function progressInline(value){
    var pct=Math.max(0,Math.min(100,Number(value)||0));
    return '<div class="wct-priority-table-progress"><div><span style="width:'+pct+'%"></span></div><b>'+pct+'%</b></div>';
  }
  function renderPrioritySeven(){
    var root=$('pageContent'),kpis=root&&root.querySelector('.wct-workspace-kpis');
    if(!root||!kpis)return;
    var panel=$('wctPrioritySevenDays');
    if(!panel){
      panel=document.createElement('section');
      panel.id='wctPrioritySevenDays';
      panel.className='wct-priority-seven-day';
    }
    if(panel.parentElement!==root||root.lastElementChild!==panel)root.appendChild(panel);
    var rows=buildPriorityRows();
    var html='<header class="wct-priority-seven-head"><div><div class="wct-priority-seven-kicker">UPCOMING DEADLINES</div><h3>PRIORITAS 7 HARI KE DEPAN</h3><p>Daftar Case dan tindakan PICAPA yang memiliki target penyelesaian dalam tujuh hari mendatang.</p></div><span class="wct-priority-seven-count">'+rows.length+' Prioritas</span></header>';
    html+='<div class="table-wrap wct-priority-seven-wrap"><table class="table wct-priority-seven-table"><thead><tr><th>Jenis</th><th>Case / Permasalahan</th><th>HUB</th><th>Divisi</th><th>Kategori</th><th>PIC</th><th>Prioritas</th><th>Progress</th><th>Target</th><th>Status</th><th>Aksi</th></tr></thead><tbody>';
    if(!rows.length){
      html+='<tr><td colspan="11"><div class="wct-priority-seven-empty">Tidak ada Case atau Action aktif dengan target penyelesaian dalam tujuh hari ke depan.</div></td></tr>';
    }else{
      rows.forEach(function(item){
        var dayLabel=item.gap===0?'Hari ini':item.gap===1?'Besok':item.gap+' hari lagi';
        var kindClass=item.kind==='Case'?'case':item.kind==='Preventive Action'?'preventive':'corrective';
        var titleSub=item.kind==='Case'
          ?item.caseCode+' · Target penyelesaian Case'
          :item.caseCode+' · '+item.caseTitle;
        var actionsHtml='<button type="button" class="btn btn-sm" data-wct-priority-open="'+esc(item.caseId)+'">Detail</button>';
        if(item.actionId&&typeof currentUser!=='undefined'&&currentUser.role!=='viewer'){
          actionsHtml+='<button type="button" class="btn btn-sm btn-primary" data-wct-priority-update-action="'+esc(item.actionId)+'">Update</button>';
        }
        html+='<tr>'+
          '<td><span class="wct-priority-kind '+kindClass+'">'+esc(item.kind)+'</span></td>'+
          '<td><div class="case-title">'+esc(item.title)+'</div><div class="sub">'+esc(titleSub)+'</div></td>'+
          '<td><b>'+esc(item.hub)+'</b></td>'+
          '<td>'+esc(item.division)+'</td>'+
          '<td>'+esc(item.category)+'</td>'+
          '<td>'+esc(item.pic||'—')+'</td>'+
          '<td><span class="priority '+priorityClass(item.priority)+'">'+esc(item.priority)+'</span></td>'+
          '<td>'+progressInline(item.progress)+'</td>'+
          '<td><b>'+esc(fmtShortDate(item.date))+'</b><div class="sub">'+dayLabel+'</div></td>'+
          '<td><span class="status '+(item.status==='done'?'s-closed':item.status==='review'?'s-review':item.status==='in_progress'?'s-progress':'s-open')+'">'+esc(progressStatusLabel(item.status))+'</span></td>'+
          '<td><div class="wct-priority-row-actions">'+actionsHtml+'</div></td>'+
        '</tr>';
      });
    }
    html+='</tbody></table></div>';
    panel.innerHTML=html;
  }
  function installPriorityObserver(){
    var root=$('pageContent');if(!root||root.dataset.wctPriorityObserver)return;
    root.dataset.wctPriorityObserver='1';
    var observer=new MutationObserver(function(){
      if(!root.querySelector('.wct-workspace-kpis'))return;
      var panel=$('wctPrioritySevenDays');
      if(!panel||panel.parentElement!==root||root.lastElementChild!==panel)renderPrioritySeven();
    });
    observer.observe(root,{childList:true});
    renderPrioritySeven();
  }

  var oldOpenUpdate=window.openUpdateForm;
  function progressStatusLabel(status){
    return ({open:'Open',in_progress:'On Progress',review:'Need Review',done:'Done'})[status]||status||'Open';
  }
  function timeLabel(value){
    if(!value)return 'Waktu tidak tersedia';
    var date=new Date(value);return Number.isNaN(date.getTime())?'Waktu tidak tersedia':date.toLocaleString('id-ID',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
  }
  function renderProgressHistory(action,logs){
    if(!logs.length)return '<div class="wct-progress-thread-empty"><span>💬</span><b>Belum ada update progress.</b><small>Tulis perkembangan pertama untuk memulai riwayat diskusi Action ini.</small></div>';
    return '<div class="wct-progress-thread-day"><span>RIWAYAT UPDATE</span></div>'+logs.map(function(log){
      var mine=String(log.created_by)===String((typeof currentUser!=='undefined'&&currentUser.id)||'');
      var who=profileName(log.created_by),progressBefore=Number(log.progress_before)||0,progressAfter=Number(log.progress_after)||0;
      var bubble='<div class="wct-progress-bubble"><p>'+esc(log.update_text||'')+'</p><div class="wct-progress-change"><span>Progress <b>'+progressBefore+'% → '+progressAfter+'%</b></span><span>Status <b>'+esc(progressStatusLabel(log.status_after))+'</b></span></div>'+(log.blocker?'<div class="wct-progress-edit-history">Kendala: '+esc(log.blocker)+'</div>':'')+(log.next_step?'<div class="wct-progress-edit-history">Next Step: '+esc(log.next_step)+'</div>':'')+(log.edited_at?'<div class="wct-progress-edit-history">Riwayat ini pernah dikoreksi · '+timeLabel(log.edited_at)+'</div>':'')+'</div>';
      return '<article class="wct-progress-message '+(mine?'mine':'')+'">'+(mine?'':'<span class="wct-progress-avatar">'+esc(String(who).split(/\\s+/).slice(0,2).map(function(part){return part[0]||'';}).join('').toUpperCase())+'</span>')+'<div class="wct-progress-message-content"><div class="wct-progress-message-meta"><b>'+(mine?'Kamu':esc(who))+'</b><time>'+timeLabel(log.created_at)+'</time></div>'+bubble+'</div>'+(mine?'<span class="wct-progress-avatar">'+esc(String(who).split(/\\s+/).slice(0,2).map(function(part){return part[0]||'';}).join('').toUpperCase())+'</span>':'')+'</article>';
    }).join('');
  }
  var progressOriginCaseId='';
  function closeProgressDrawer(silent){
    var drawer=$('wctProgressDrawerBackdrop');if(drawer)drawer.remove();
    document.body.classList.remove('wct-progress-drawer-open');
    var returnCaseId=progressOriginCaseId;progressOriginCaseId='';
    if(!silent&&returnCaseId&&typeof window.openCaseDetail==='function'){
      window.openCaseDetail(returnCaseId);
    }
  }
  window.wctCloseProgressDrawer=function(){closeProgressDrawer(false);};
  window.wctRefreshProgressDrawer=function(actionId){openProgressDrawer(actionId,'');};
  function openProgressDrawer(actionId,logId){
    var actions=(typeof state!=='undefined'&&state.actions)||[];
    var cases=(typeof state!=='undefined'&&state.cases)||[];
    var logs=(typeof state!=='undefined'&&state.logs)||[];
    var action=actions.find(function(item){return String(item.id)===String(actionId);});
    if(!action)return;
    var parent=cases.find(function(item){return String(item.id)===String(action.case_id);});
    if(!parent)return;
    var ordered=logs.filter(function(item){return String(item.action_id)===String(actionId);})
      .sort(function(a,b){return String(a.created_at||'').localeCompare(String(b.created_at||''));}).slice(-60);
    var selected=logId?ordered.find(function(item){return String(item.id)===String(logId);}):null;
    var progress=selected?Number(selected.progress_after)||0:Number(action.progress)||0;
    var status=selected?(selected.status_after||action.status||'in_progress'):(action.status||'in_progress');
    var warning=selected?'<div class="wct-progress-edit-banner">Kamu sedang mengoreksi satu riwayat. Perubahan akan tetap masuk audit trail PICAPA.</div>':'';
    var statusOptions=[['open','Belum Mulai'],['in_progress','Sedang Berjalan'],['review','Perlu Review'],['done','Selesai']];
    var profile=profileName(action.assigned_to),caseCode=parent.case_code||parent.case_number||'CASE';
    var html='<div class="wct-progress-drawer-backdrop" id="wctProgressDrawerBackdrop" role="presentation"><aside class="wct-progress-drawer" role="dialog" aria-modal="true" aria-label="Update progress '+esc(action.title)+'"><header class="wct-progress-drawer-head"><div class="wct-progress-drawer-title"><span class="wct-progress-drawer-mark">↗</span><div><div class="eyebrow">RUANG DISKUSI PICAPA · '+esc(caseCode)+'</div><h2>'+esc(action.title||'Update Action')+'</h2><p>'+esc(profile)+' · '+esc(action.action_type==='preventive'?'Preventive Action':'Corrective Action')+'</p></div></div><button type="button" class="wct-progress-drawer-close" data-wct-close-progress-drawer aria-label="Tutup drawer">×</button></header><div class="wct-progress-drawer-summary"><span class="wct-progress-summary-pill">'+esc(progressStatusLabel(action.status))+'</span><span class="wct-progress-summary-pill">Target '+esc(fmtShortDate(action.due_date))+'</span><span class="wct-progress-summary-value">Progress <b>'+Number(action.progress||0)+'%</b></span></div><div class="wct-progress-thread" id="wctProgressThread">'+renderProgressHistory(action,ordered)+'</div>';
    if((typeof currentUser!=='undefined'&&currentUser.role)==='viewer'){
      html+='<div class="wct-progress-readonly">Akun Viewer hanya dapat membaca. Riwayat update tetap tersedia di sini.</div>';
    }else{
      var selectedText=selected?selected.update_text||'':'';
      var blocker=selected?selected.blocker||'':'',nextStep=selected?selected.next_step||'':'';
      html+='<form class=\"wct-progress-compose\" id=\"wctProgressDrawerForm\" data-wct-action-id=\"'+esc(actionId)+'\" data-wct-log-id=\"'+(selected?esc(selected.id):'')+'\">'+warning+'<textarea class="wct-progress-compose-message" name="update_text" maxlength="5000" required placeholder="Tulis pesan atau perkembangan terbaru…">'+esc(selectedText)+'</textarea><div class="wct-progress-compose-controls"><label class="status">Status<select name="status">'+statusOptions.map(function(option){return '<option value="'+option[0]+'" '+(status===option[0]?'selected':'')+'>'+option[1]+'</option>';}).join('')+'</select></label><label class="progress">Progress (%)<input type="number" name="progress_after" min="0" max="100" step="5" value="'+progress+'" required></label><small class="wct-progress-counter"><span id="wctProgressCharCount">'+selectedText.length+'</span>/5000</small><button type="submit" class="wct-progress-send" aria-label="Kirim update">➤</button></div><details class="wct-progress-extra"><summary>Kendala dan langkah berikutnya (opsional)</summary><div class="wct-progress-extra-grid"><label>Kendala / Blocker<textarea name="blocker">'+esc(blocker)+'</textarea></label><label>Next Step<textarea name="next_step">'+esc(nextStep)+'</textarea></label></div></details></form>';
    }
    closeProgressDrawer(true);
    progressOriginCaseId=String(parent.id);
    document.body.insertAdjacentHTML('beforeend',html);
    document.body.classList.add('wct-progress-drawer-open');
    var thread=$('wctProgressThread');if(thread)thread.scrollTop=thread.scrollHeight;
    var compose=$('wctProgressDrawerForm');
    if(compose){
      var textarea=compose.querySelector('[name="update_text"]'),counter=$('wctProgressCharCount'),progressInput=compose.querySelector('[name="progress_after"]'),statusInput=compose.querySelector('[name="status"]');
      if(textarea&&counter)textarea.addEventListener('input',function(){counter.textContent=String(textarea.value.length);});
      if(statusInput&&progressInput)statusInput.addEventListener('change',function(){if(statusInput.value==='done')progressInput.value='100';});
    }
  }
  if(typeof oldOpenUpdate==='function'&&!oldOpenUpdate.__wctProgressDrawerWrapped){
    var wrappedOpenUpdate=function(actionId,logId){
      if((typeof currentUser!=='undefined'&&currentUser.role)==='viewer'){
        openProgressDrawer(actionId,'');return;
      }
      var modal=$('modal');
      if(typeof window.closeModal==='function')window.closeModal();
      if(modal)modal.innerHTML='';
      oldOpenUpdate.apply(this,arguments);
      var after=modal?modal.innerHTML:'';
      if(!modal||!after.includes('submitProgress'))return;
      if(typeof window.closeModal==='function')window.closeModal();
      openProgressDrawer(actionId,logId);
    };
    wrappedOpenUpdate.__wctProgressDrawerWrapped=true;window.openUpdateForm=wrappedOpenUpdate;
  }
  document.addEventListener('submit',function(event){
    var form=event.target;if(!form||form.id!=='wctProgressDrawerForm')return;
    event.preventDefault();if(typeof window.submitProgress==='function')window.submitProgress(event,form.dataset.wctActionId,form.dataset.wctLogId||'');
  },true);
  document.addEventListener('click',function(event){
    var quickUpdate=event.target.closest&&event.target.closest('[data-wct-priority-update-action]');
    if(quickUpdate){if(typeof window.openUpdateForm==='function')window.openUpdateForm(quickUpdate.dataset.wctPriorityUpdateAction);return;}
    var close=event.target.closest&&event.target.closest('[data-wct-close-progress-drawer]');
    if(close){closeProgressDrawer();return;}
    var backdrop=$('wctProgressDrawerBackdrop');
    if(backdrop&&event.target===backdrop){closeProgressDrawer();return;}
    var priority=event.target.closest&&event.target.closest('[data-wct-priority-open]');
    if(priority){if(typeof window.openCaseDetail==='function')window.openCaseDetail(priority.dataset.wctPriorityOpen);return;}
  },true);
  document.addEventListener('input',function(event){
    var input=event.target;
    if(input&&input.matches('#wctProgressDrawerForm [name="progress_after"]')){
      var status=input.form&&input.form.querySelector('[name="status"]');if(status&&input.value==='100')status.value='done';
    }
  },true);
  document.addEventListener('keydown',function(event){
    if(event.key==='Escape'&&$('wctProgressDrawerBackdrop'))closeProgressDrawer();
  });

  function init(){
    var user=(typeof currentUser!=='undefined'&&currentUser)||null;
    if($('wctNotificationNav'))$('wctNotificationNav').remove();
    observeCaseModal();
    installPriorityObserver();
  }
  window.wctDashboardPriorityRefresh=renderPrioritySeven;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
`;
  const out = html.replace('</body>', '<style id="wct-dashboard-interaction-upgrades-style">' + css + '</style><script id="wct-dashboard-interaction-upgrades">' + runtime + '</script></body>');
  return out;
};