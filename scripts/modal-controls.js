module.exports = function applyModalControls(html) {
  if (!html || !html.includes('</body>')) throw new Error('Could not find document body for modal controls.');
  const runtime = "(function(){\n  'use strict';\n  if(window.__WCT_MODAL_CONTROLS_READY)return;\n  window.__WCT_MODAL_CONTROLS_READY=true;\n\n  function backdrop(){return document.getElementById('modalBackdrop');}\n  function modal(){return document.getElementById('modal');}\n  function normalizedLabel(button){\n    return String(button&&(button.innerText||button.textContent)||'').replace(/\\s+/g,' ').trim().toLowerCase();\n  }\n  function isSimpleCloseHandler(button){\n    var source=String(button.getAttribute('onclick')||'').trim();\n    return /^(?:window\\.)?closeModal\\s*\\(\\s*\\)\\s*;?$/i.test(source);\n  }\n  function isCloseButton(button){\n    var label=normalizedLabel(button);\n    return button.classList.contains('close') ||\n      button.hasAttribute('data-wct-modal-close') ||\n      isSimpleCloseHandler(button) ||\n      /^(batal|cancel|tutup|close|×|✕|x)$/.test(label);\n  }\n  function normalizeButtons(){\n    var layer=backdrop();\n    if(!layer)return;\n    layer.querySelectorAll('button').forEach(function(button){\n      if(isCloseButton(button)){\n        button.type='button';\n        if(button.classList.contains('close')&&!button.hasAttribute('aria-label')){\n          button.setAttribute('aria-label','Tutup dialog');\n        }\n      }\n    });\n  }\n  function closeModalSafely(){\n    var layer=backdrop();\n    if(!layer)return false;\n    layer.classList.remove('show');\n    layer.setAttribute('aria-hidden','true');\n    var dialog=modal();\n    if(dialog)dialog.removeAttribute('aria-busy');\n    return true;\n  }\n  var previousOpen=window.openModal;\n  function openModalSafely(content,wide){\n    var layer=backdrop(),dialog=modal();\n    if(!layer||!dialog){\n      console.error('Modal container tidak ditemukan (#modalBackdrop / #modal).');\n      return false;\n    }\n    if(typeof previousOpen==='function'&&previousOpen!==openModalSafely){\n      previousOpen.call(window,content,!!wide);\n    }else{\n      dialog.className='modal'+(wide?' wide':'');\n      dialog.innerHTML=String(content||'');\n      layer.classList.add('show');\n    }\n    layer.classList.add('show');\n    layer.setAttribute('aria-hidden','false');\n    normalizeButtons();\n    window.requestAnimationFrame(function(){\n      normalizeButtons();\n      if(typeof window.wctApplySingleModalScroll==='function'){\n        try{window.wctApplySingleModalScroll();}catch(error){console.warn('Modal layout adjustment failed:',error);}\n      }\n    });\n    return true;\n  }\n  window.closeModal=closeModalSafely;\n  window.openModal=openModalSafely;\n  window.backdropClose=function(event){\n    var layer=backdrop();\n    if(layer&&event&&event.target===layer)closeModalSafely();\n  };\n\n  function activateCloseControl(event){\n    var layer=backdrop();\n    if(!layer||!layer.classList.contains('show'))return;\n    var button=event.target&&event.target.closest?event.target.closest('#modalBackdrop button, #modal .modal-head .close, #modal button[data-wct-modal-close]'):null;\n    if(!button||!isCloseButton(button))return;\n    event.preventDefault();\n    event.stopImmediatePropagation();\n    closeModalSafely();\n  }\n\n  // Mobile browsers can suppress or delay click on compact modal controls.\n  // Handle touch/pen pointer release first, retaining click for keyboard use.\n  document.addEventListener('pointerup',function(event){\n    if(event.pointerType==='touch'||event.pointerType==='pen')activateCloseControl(event);\n  },{capture:true,passive:false});\n  document.addEventListener('touchend',activateCloseControl,{capture:true,passive:false});\n  document.addEventListener('click',activateCloseControl,true);\n\n  document.addEventListener('keydown',function(event){\n    if(event.key!=='Escape')return;\n    var layer=backdrop();\n    if(layer&&layer.classList.contains('show')){\n      event.preventDefault();\n      closeModalSafely();\n    }\n  },true);\n\n  var layer=backdrop();\n  if(layer){\n    layer.setAttribute('aria-hidden',layer.classList.contains('show')?'false':'true');\n    normalizeButtons();\n    var observer=new MutationObserver(normalizeButtons);\n    observer.observe(layer,{childList:true,subtree:true});\n  }\n  window.WCTModalControlsReady=true;\n})();";
  const css = String.raw`

/* Reliable mobile hit target for modal close control */
#modal{pointer-events:auto!important;touch-action:pan-y!important}
#modal .modal-head{position:relative!important;z-index:20!important}
#modal .modal-head .close,
#modal button[data-wct-modal-close]{
  position:relative!important;z-index:30!important;
  display:grid!important;place-items:center!important;
  width:46px!important;min-width:46px!important;height:46px!important;min-height:46px!important;
  flex:0 0 46px!important;padding:0!important;
  pointer-events:auto!important;touch-action:manipulation!important;
  -webkit-tap-highlight-color:transparent!important;cursor:pointer!important;
}
#modalBackdrop.show #modal .modal-head .close{pointer-events:auto!important}

/* Notifications must stay above the modal backdrop so errors are readable. */
#toast,.toast{
  position:fixed!important;z-index:2147483000!important;
  right:22px!important;bottom:22px!important;
  max-width:min(440px,calc(100vw - 32px))!important;
  pointer-events:none!important;
}
#toast.show,.toast.show{
  display:block!important;visibility:visible!important;opacity:1!important;
  z-index:2147483000!important;
}
.wct-form-error{
  position:relative;z-index:8;display:grid;gap:7px;
  margin:12px 0 14px;padding:13px 15px;
  border:1px solid #E7A4A8;border-left:4px solid #C84D57;
  border-radius:11px;background:#FFF3F3;color:#8E3039;
  box-shadow:0 5px 16px rgba(135,40,48,.08);
}
.wct-form-error strong{font-size:12px;font-weight:900;color:#9A303A}
.wct-form-error pre{
  max-height:150px;overflow:auto;margin:0;padding:9px 10px;
  border-radius:8px;background:#fff;color:#74333A;
  white-space:pre-wrap;overflow-wrap:anywhere;
  font:11px/1.55 ui-monospace,SFMono-Regular,Consolas,monospace;
}
.wct-form-error small{color:#92575B;font-size:10px;line-height:1.5}
@media(max-width:650px){
  #toast,.toast{right:12px!important;bottom:12px!important;max-width:calc(100vw - 24px)!important}
  .wct-form-error{margin:9px 0 11px;padding:11px 12px}
}
`;
  return html.replace('</body>', '<style id="wct-modal-feedback-style">' + css + '</style><script id="wct-modal-controls">' + runtime + '</script></body>');
};
