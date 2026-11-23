module.exports = function applyModalControls(html) {
  if (!html || !html.includes('</body>')) throw new Error('Could not find document body for modal controls.');
  const runtime = "(function(){\n  'use strict';\n  if(window.__WCT_MODAL_CONTROLS_READY)return;\n  window.__WCT_MODAL_CONTROLS_READY=true;\n\n  function backdrop(){return document.getElementById('modalBackdrop');}\n  function modal(){return document.getElementById('modal');}\n  function normalizedLabel(button){\n    return String(button&&(button.innerText||button.textContent)||'').replace(/\\s+/g,' ').trim().toLowerCase();\n  }\n  function isSimpleCloseHandler(button){\n    var source=String(button.getAttribute('onclick')||'').trim();\n    return /^(?:window\\.)?closeModal\\s*\\(\\s*\\)\\s*;?$/i.test(source);\n  }\n  function isCloseButton(button){\n    var label=normalizedLabel(button);\n    return button.classList.contains('close') ||\n      button.hasAttribute('data-wct-modal-close') ||\n      isSimpleCloseHandler(button) ||\n      /^(batal|cancel|tutup|close|×|✕|x)$/.test(label);\n  }\n  function normalizeButtons(){\n    var layer=backdrop();\n    if(!layer)return;\n    layer.querySelectorAll('button').forEach(function(button){\n      if(isCloseButton(button)){\n        button.type='button';\n        if(button.classList.contains('close')&&!button.hasAttribute('aria-label')){\n          button.setAttribute('aria-label','Tutup dialog');\n        }\n      }\n    });\n  }\n  function closeModalSafely(){\n    var layer=backdrop();\n    if(!layer)return false;\n    layer.classList.remove('show');\n    layer.setAttribute('aria-hidden','true');\n    var dialog=modal();\n    if(dialog)dialog.removeAttribute('aria-busy');\n    return true;\n  }\n  var previousOpen=window.openModal;\n  function openModalSafely(content,wide){\n    var layer=backdrop(),dialog=modal();\n    if(!layer||!dialog){\n      console.error('Modal container tidak ditemukan (#modalBackdrop / #modal).');\n      return false;\n    }\n    if(typeof previousOpen==='function'&&previousOpen!==openModalSafely){\n      previousOpen.call(window,content,!!wide);\n    }else{\n      dialog.className='modal'+(wide?' wide':'');\n      dialog.innerHTML=String(content||'');\n      layer.classList.add('show');\n    }\n    layer.classList.add('show');\n    layer.setAttribute('aria-hidden','false');\n    normalizeButtons();\n    window.requestAnimationFrame(function(){\n      normalizeButtons();\n      normalizeCaseCloseButton();\n      if(typeof window.wctApplySingleModalScroll==='function'){\n        try{window.wctApplySingleModalScroll();}catch(error){console.warn('Modal layout adjustment failed:',error);}\n      }\n    });\n    return true;\n  }\n  window.closeModal=closeModalSafely;\n  window.openModal=openModalSafely;\n  window.backdropClose=function(event){\n    var layer=backdrop();\n    if(layer&&event&&event.target===layer)closeModalSafely();\n  };\n\n  function normalizeCaseCloseButton(){\n    var layer=backdrop();\n    if(!layer)return;\n    var close=layer.querySelector('#modal .modal-head .close');\n    if(close){\n      close.setAttribute('data-wct-modal-close','');\n      close.setAttribute('aria-label','Tutup dialog');\n      close.setAttribute('title','Tutup');\n      if(close.tagName==='BUTTON')close.type='button';\n    }\n  }\n\n  function closeTarget(event){\n    var target=event&&event.target;\n    if(target&&target.nodeType!==1)target=target.parentElement;\n    if(!target||!target.closest)return null;\n    var button=target.closest(\n      '#modalBackdrop #modal [data-wct-modal-close],'+\n      '#modalBackdrop #modal .modal-head .close,'+\n      '#modalBackdrop #modal button.close'\n    );\n    if(button)return button;\n    var candidate=target.closest('#modalBackdrop #modal .modal-head button');\n    return candidate&&isCloseButton(candidate)?candidate:null;\n  }\n\n  function handleCloseInteraction(event){\n    var layer=backdrop();\n    if(!layer||!layer.classList.contains('show'))return;\n    var button=closeTarget(event);\n    if(!button||!isCloseButton(button))return;\n    event.preventDefault();\n    event.stopPropagation();\n    if(event.stopImmediatePropagation)event.stopImmediatePropagation();\n    closeModalSafely();\n  }\n\n  // Pointer/touch events cover mobile taps where a synthetic click is missed.\n  document.addEventListener('pointerup',handleCloseInteraction,true);\n  document.addEventListener('touchend',handleCloseInteraction,{capture:true,passive:false});\n  document.addEventListener('click',handleCloseInteraction,true);\n\n  document.addEventListener('keydown',function(event){\n    if(event.key!=='Escape')return;\n    var layer=backdrop();\n    if(layer&&layer.classList.contains('show')){\n      event.preventDefault();\n      closeModalSafely();\n    }\n  },true);\n\n  var layer=backdrop();\n  if(layer){\n    layer.setAttribute('aria-hidden',layer.classList.contains('show')?'false':'true');\n    normalizeButtons();\n    normalizeCaseCloseButton();\n    var observer=new MutationObserver(function(){normalizeButtons();normalizeCaseCloseButton();});\n    observer.observe(layer,{childList:true,subtree:true});\n  }\n  window.WCTModalControlsReady=true;\n})();";
  const css = String.raw`
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
