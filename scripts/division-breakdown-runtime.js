module.exports = function addDivisionBreakdownRuntime(html) {
  const style = String.raw`<style id="wct-division-breakdown-style">
.wct-division-breakdown-list{display:grid;gap:13px}
.wct-division-breakdown-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(120px,1.15fr) 32px;gap:12px;align-items:center}
.wct-division-breakdown-name{min-width:0;color:#51445e;font-size:11px;font-weight:800;overflow-wrap:anywhere}
.wct-division-breakdown-track{height:9px;overflow:hidden;border-radius:99px;background:#f0edf3}
.wct-division-breakdown-track span{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#FEA500,#F4B942)}
.wct-division-breakdown-count{text-align:right;color:#8A5900;font-size:12px;font-weight:900;font-variant-numeric:tabular-nums}
.wct-division-breakdown-note{margin-top:14px;color:#8c8296;font-size:10px;line-height:1.5}
@media(max-width:680px){.wct-division-breakdown-row{grid-template-columns:minmax(0,1fr) 75px 25px;gap:8px}.wct-division-breakdown-name{font-size:10px}}
</style>`;
  const script = String.raw`<script id="wct-division-breakdown-runtime">
(function(){
  if(window.wctDivisionBreakdownReady)return;
  window.wctDivisionBreakdownReady=true;
  var defaults=['Hub Operations','Gateway','Last Mile','Transport','Facility','Human Capital','GA','Other'];
  var aliases={'facility & safety':'Facility','people & manpower':'Human Capital','people / manpower':'Human Capital','transportation':'Transport'};
  function normalized(value){
    var raw=String(value||'').trim();
    return aliases[raw.toLocaleLowerCase()]||raw;
  }
  function text(tag,className,value){
    var node=document.createElement(tag);
    if(className)node.className=className;
    node.textContent=value==null?'':String(value);
    return node;
  }
  function render(){
    var grid=document.querySelector('.wct-dashboard-columns');
    if(!grid)return;
    var old=grid.querySelector('.wct-division-breakdown');
    if(old)old.remove();
    var cases=Array.isArray(state.cases)?state.cases:[];
    var settings=typeof wctOptions==='function'?wctOptions():{};
    var configured=Array.isArray(settings.divisions)?settings.divisions.slice():defaults.slice();
    var names=[];
    configured.forEach(function(value){var name=normalized(value);if(name&&!names.some(function(v){return v.toLocaleLowerCase()===name.toLocaleLowerCase();}))names.push(name);});
    var counts={};
    names.forEach(function(name){counts[name]=0;});
    cases.forEach(function(item){
      var name=normalized(item.division||'Other')||'Other';
      var existing=names.find(function(v){return v.toLocaleLowerCase()===name.toLocaleLowerCase();});
      if(!existing){names.push(name);counts[name]=0;existing=name;}
      counts[existing]=(counts[existing]||0)+1;
    });
    var maximum=Math.max(1,...names.map(function(name){return counts[name]||0;}));
    var total=cases.length;
    var card=document.createElement('section');
    card.className='card wct-division-breakdown';
    var head=document.createElement('div');
    head.className='card-head';
    var heading=document.createElement('div');
    heading.appendChild(text('h3','',"Breakdown Divisi"));
    heading.appendChild(text('p','',"Jumlah Case berdasarkan divisi operasional"));
    head.appendChild(heading);
    var badge=text('span','pill',total+' Case');
    head.appendChild(badge);
    card.appendChild(head);
    var body=document.createElement('div');
    body.className='card-body wct-division-breakdown-list';
    names.forEach(function(name){
      var count=counts[name]||0;
      var percent=total?Math.round(count/total*100):0;
      var row=document.createElement('div');
      row.className='wct-division-breakdown-row';
      row.appendChild(text('div','wct-division-breakdown-name',name));
      var track=document.createElement('div');
      track.className='wct-division-breakdown-track';
      var bar=document.createElement('span');
      bar.style.width=Math.round(count/maximum*100)+'%';
      track.appendChild(bar);
      row.appendChild(track);
      row.appendChild(text('div','wct-division-breakdown-count',count));
      body.appendChild(row);
    });
    card.appendChild(body);
    card.appendChild(text('p','wct-division-breakdown-note',total?'Persentase dihitung dari seluruh Case, termasuk yang sudah Closed. Nilai divisi lama disatukan ke nama breakdown terbaru.':'Belum ada Case yang tercatat. Breakdown akan terisi otomatis setelah Case dibuat.'));
    grid.appendChild(card);
  }
  var original=window.renderDashboard;
  if(typeof original==='function'){
    window.renderDashboard=function(){
      var result=original.apply(this,arguments);
      try{render();}catch(error){console.error('Division breakdown render failed:',error);}
      return result;
    };
  }else{
    console.warn('Dashboard renderer belum tersedia; Division breakdown tidak dipasang.');
  }
  window.wctRenderDivisionBreakdown=render;
})();
</script>`;
  return html.replace('</body>', style + '\n' + script + '\n</body>');
};
