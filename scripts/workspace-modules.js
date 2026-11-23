module.exports = function applyWorkspaceModules(html) {
  if (!html || !html.includes('</body>')) throw new Error('Could not find document body for workspace modules.');

  const css = String.raw`
:root{--wct-workspace-accent:#2864C7;--wct-workspace-navy:#173B68;--wct-workspace-bg:#F4F7FB;--wct-workspace-line:#E4EAF2}
.wct-page-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin:0 0 20px}
.wct-page-head h1{display:flex;align-items:center;gap:10px;margin:4px 0 6px;color:#172B46;font-size:clamp(24px,2vw,30px);font-weight:850;letter-spacing:-.04em}
.wct-page-head p{margin:0;color:#718198;font-size:13px;line-height:1.55}
.wct-kicker{color:#2864C7;font-size:10px;font-weight:900;letter-spacing:.14em;text-transform:uppercase}
.wct-welcome{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:17px;padding:20px 22px;border:1px solid #1C4A7F;border-radius:17px;background:linear-gradient(115deg,#173B68 0%,#214F86 58%,#2864C7 100%);color:#fff;box-shadow:0 10px 24px rgba(23,59,104,.13)}
.wct-welcome h2{margin:5px 0 6px;color:#fff;font-size:clamp(20px,2.1vw,27px);font-weight:850;letter-spacing:-.035em}
.wct-welcome p{margin:0;color:#D7E5F7;font-size:12px;line-height:1.6}
.wct-welcome-meta{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}
.wct-mini-pill{display:inline-flex;align-items:center;gap:6px;padding:7px 10px;border:1px solid #DCE7F4;border-radius:999px;background:#F4F8FD;color:#49617D;font-size:10px;font-weight:800;white-space:nowrap}
.wct-welcome .wct-mini-pill{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.24);color:#fff}
.wct-workspace-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-bottom:17px}
.wct-workspace-kpi{position:relative;display:flex;justify-content:space-between;align-items:flex-start;gap:12px;min-width:0;min-height:116px;padding:17px 18px;border:1px solid #E3EAF3;border-radius:15px;background:#fff;box-shadow:0 6px 18px rgba(25,49,79,.045);overflow:hidden}
.wct-workspace-kpi:first-child{background:linear-gradient(135deg,#173B68 0%,#2864C7 100%);border-color:#173B68;box-shadow:0 9px 20px rgba(23,59,104,.16)}
.wct-workspace-kpi:nth-child(2){border-top:3px solid #42A987}.wct-workspace-kpi:nth-child(3){border-top:3px solid #4B8CE2}.wct-workspace-kpi:nth-child(4){border-top:3px solid #E3A44B}
.wct-workspace-kpi-label{color:#72839A;font-size:12px;font-weight:750}
.wct-workspace-kpi-value{margin-top:11px;color:#172B46;font-size:31px;font-weight:900;line-height:1}
.wct-workspace-kpi-note{margin-top:7px;color:#8391A4;font-size:10px}
.wct-workspace-kpi-icon{display:grid;place-items:center;width:39px;height:39px;flex:0 0 39px;border:1px solid #D8E6FC;border-radius:11px;background:#EAF2FF;color:#2864C7}
.wct-workspace-kpi-icon svg{width:19px;height:19px}
.wct-workspace-kpi:first-child .wct-workspace-kpi-label,.wct-workspace-kpi:first-child .wct-workspace-kpi-value,.wct-workspace-kpi:first-child .wct-workspace-kpi-note{color:#fff}
.wct-workspace-kpi:first-child .wct-workspace-kpi-icon{background:rgba(255,255,255,.15);border-color:rgba(255,255,255,.22);color:#fff}
.wct-workspace-grid{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(280px,.85fr);gap:16px;margin-bottom:16px}
.wct-workspace-grid.three{grid-template-columns:minmax(0,1.35fr) minmax(220px,.85fr) minmax(220px,.85fr)}
.wct-panel{min-width:0;border:1px solid #E3EAF3;border-radius:16px;background:#fff;box-shadow:0 7px 22px rgba(25,49,79,.045);overflow:hidden}
.wct-panel-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 18px 13px;border-bottom:1px solid #EDF1F6}
.wct-panel-head h3{display:flex;align-items:center;gap:8px;margin:0;color:#1B2B42;font-size:13px;font-weight:850}
.wct-panel-head p{margin:4px 0 0;color:#7B8BA0;font-size:10px;line-height:1.45}
.wct-panel-body{padding:15px 18px 17px;min-width:0}
.wct-panel-action{border:0;background:transparent;color:#2864C7;font-size:10px;font-weight:850;cursor:pointer;white-space:nowrap}
.wct-panel-action:hover{text-decoration:underline}
.wct-chart-legend{display:flex;align-items:center;gap:13px;flex-wrap:wrap;color:#718198;font-size:10px}
.wct-chart-legend span{display:inline-flex;align-items:center;gap:6px}
.wct-chart-legend i{display:inline-block;width:8px;height:8px;border-radius:50%;background:#2864C7}
.wct-chart-svg{display:block;width:100%;height:auto;min-height:175px;overflow:visible}
.wct-chart-label{fill:#8492A5;font-size:10px;font-family:inherit}
.wct-chart-gridline{stroke:#EAF0F6;stroke-width:1}
.wct-reminder-list,.wct-activity-list{display:grid;gap:9px}
.wct-reminder{display:grid;grid-template-columns:34px minmax(0,1fr) auto;align-items:center;gap:10px;padding:9px 10px;border:1px solid #E9EEF5;border-radius:12px;background:#FCFDFE}
.wct-reminder-icon{display:grid;place-items:center;width:32px;height:32px;border-radius:9px;background:#EAF2FF;color:#2864C7}
.wct-reminder-icon svg{width:16px;height:16px}
.wct-reminder.is-overdue .wct-reminder-icon{background:#FDEBEC;color:#B84550}
.wct-reminder strong{display:block;overflow:hidden;color:#263A54;font-size:11px;font-weight:800;text-overflow:ellipsis;white-space:nowrap}
.wct-reminder small{display:block;margin-top:3px;color:#8290A4;font-size:9px}
.wct-reminder-date{color:#718198;font-size:9px;font-weight:800;text-align:right;white-space:nowrap}
.wct-case-table{width:100%;border-collapse:collapse}
.wct-case-table th{padding:9px 10px;background:#F5F8FC;color:#718198;font-size:9px;font-weight:900;letter-spacing:.08em;text-align:left;text-transform:uppercase;white-space:nowrap}
.wct-case-table td{padding:11px 10px;border-bottom:1px solid #EDF1F6;color:#40536D;font-size:10px;vertical-align:middle}
.wct-case-table tr:last-child td{border-bottom:0}
.wct-case-table .case-main{min-width:150px}
.wct-case-table .case-main strong{display:block;color:#1B2B42;font-size:11px;line-height:1.4}
.wct-case-table .case-main small{display:block;margin-top:3px;color:#8794A6;font-size:9px}
.wct-progress-bar{width:100%;height:7px;border-radius:999px;background:#E9EFF7;overflow:hidden}
.wct-progress-bar span{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#2864C7,#69A0EA)}
.wct-progress-inline{display:flex;align-items:center;gap:7px;min-width:85px}
.wct-progress-inline b{color:#365F9D;font-size:10px}
.wct-status{display:inline-flex;align-items:center;gap:5px;padding:5px 8px;border-radius:999px;background:#F0F4F9;color:#64758A;font-size:9px;font-weight:850;white-space:nowrap}
.wct-status.open{background:#FFF4E2;color:#A36A16}.wct-status.in_progress{background:#EAF2FF;color:#2864C7}.wct-status.review{background:#F1ECFA;color:#7954AB}.wct-status.closed,.wct-status.done{background:#EAF7F0;color:#26815B}.wct-status.overdue{background:#FDEBEC;color:#B84550}
.wct-member-list{display:grid;gap:10px}
.wct-member{display:flex;align-items:center;gap:10px;min-width:0;padding:9px 0;border-bottom:1px solid #EEF2F7}
.wct-member:last-child{border-bottom:0}
.wct-avatar{display:grid;place-items:center;width:34px;height:34px;flex:0 0 34px;border-radius:50%;background:#EAF2FF;color:#2864C7;font-size:11px;font-weight:900}
.wct-member-main{flex:1;min-width:0}
.wct-member-main strong{display:block;overflow:hidden;color:#263A54;font-size:11px;text-overflow:ellipsis;white-space:nowrap}
.wct-member-main small{display:block;margin-top:3px;color:#8794A6;font-size:9px}
.wct-member-load{min-width:62px;text-align:right}
.wct-member-load b{display:block;color:#365F9D;font-size:11px}
.wct-member-load small{color:#8794A6;font-size:9px}
.wct-gauge-wrap{display:grid;justify-items:center;gap:12px;padding:9px 0}
.wct-gauge{display:grid;place-items:center;width:144px;height:144px;border-radius:50%;background:conic-gradient(#2864C7 var(--wct-gauge-value,0%),#E7EEF7 0);position:relative}
.wct-gauge:before{content:"";position:absolute;inset:12px;border-radius:50%;background:#fff}
.wct-gauge-center{position:relative;z-index:1;text-align:center}
.wct-gauge-center strong{display:block;color:#173B68;font-size:29px;font-weight:900}
.wct-gauge-center small{color:#8290A4;font-size:9px}
.wct-gauge-legend{display:grid;width:100%;gap:8px}
.wct-gauge-legend div{display:flex;justify-content:space-between;gap:10px;color:#718198;font-size:10px}
.wct-gauge-legend b{color:#263A54}
.wct-kanban-toolbar,.wct-filterbar{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-bottom:15px;padding:12px;border:1px solid #E3EAF3;border-radius:14px;background:#fff}
.wct-filterbar input,.wct-filterbar select,.wct-kanban-toolbar input,.wct-kanban-toolbar select{min-width:135px;max-width:100%;min-height:38px;padding:8px 10px;border:1px solid #DCE4EF;border-radius:9px;background:#fff;color:#34465E;font:inherit;font-size:11px}
.wct-filter-chip{display:inline-flex;align-items:center;gap:6px;min-height:34px;padding:7px 11px;border:1px solid #DFE7F1;border-radius:999px;background:#fff;color:#607189;font-size:10px;font-weight:800;cursor:pointer}
.wct-filter-chip.active{border-color:#C6D8F2;background:#EAF2FF;color:#24599D}
.wct-kanban{display:grid;grid-template-columns:repeat(4,minmax(230px,1fr));gap:13px;align-items:start;overflow-x:auto;padding-bottom:8px}
.wct-kanban-col{min-width:0;padding:11px;border:1px solid #E4EAF2;border-radius:14px;background:#EEF3F9}
.wct-kanban-col.is-over{outline:2px dashed #78A5DF;outline-offset:-4px;background:#E7F0FC}
.wct-kanban-col-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px;padding:2px 2px 5px}
.wct-kanban-col-head strong{display:flex;align-items:center;gap:7px;color:#30465F;font-size:11px;font-weight:900}
.wct-kanban-count{display:grid;place-items:center;min-width:23px;height:23px;padding:0 6px;border-radius:8px;background:#fff;color:#6B7E95;font-size:10px;font-weight:900}
.wct-kanban-cards{display:grid;gap:9px;min-height:70px}
.wct-task-card{padding:12px;border:1px solid #E2E9F2;border-radius:12px;background:#fff;box-shadow:0 3px 10px rgba(25,49,79,.035);cursor:grab;transition:transform .14s ease,border-color .14s ease,box-shadow .14s ease}
.wct-task-card:active{cursor:grabbing}.wct-task-card:hover{transform:translateY(-1px);border-color:#C9D9ED;box-shadow:0 7px 18px rgba(25,49,79,.07)}
.wct-task-card-top{display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:8px}
.wct-task-type{padding:4px 7px;border-radius:6px;background:#EAF2FF;color:#2864C7;font-size:8px;font-weight:900}
.wct-task-type.pa{background:#F1ECFA;color:#7954AB}
.wct-task-card h4{margin:0 0 7px;color:#203750;font-size:11px;line-height:1.45;font-weight:850;overflow-wrap:anywhere}
.wct-task-case{color:#8090A4;font-size:9px}
.wct-task-card-footer{display:flex;align-items:center;justify-content:space-between;gap:7px;margin-top:10px;padding-top:9px;border-top:1px solid #EEF2F6}
.wct-task-card-footer small{color:#8492A5;font-size:9px}
.wct-task-actions{display:flex;gap:6px;margin-top:10px}
.wct-task-actions button{flex:1;min-height:31px;padding:6px 7px;border:1px solid #DFE7F1;border-radius:8px;background:#fff;color:#365B8B;font-size:9px;font-weight:800;cursor:pointer}
.wct-task-actions button.primary{background:#2864C7;border-color:#2864C7;color:#fff}
.wct-member-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
.wct-member-card{padding:15px;border:1px solid #E3EAF3;border-radius:15px;background:#fff;box-shadow:0 6px 18px rgba(25,49,79,.04)}
.wct-member-card-top{display:flex;align-items:center;gap:10px}
.wct-member-card .wct-avatar{width:42px;height:42px;flex-basis:42px;font-size:13px}
.wct-member-card h3{margin:0;color:#1B2B42;font-size:12px;font-weight:850}
.wct-member-card p{margin:4px 0 0;color:#7B8BA0;font-size:10px}
.wct-member-stats{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:14px 0}
.wct-member-stat{padding:9px;border-radius:10px;background:#F5F8FC}
.wct-member-stat strong{display:block;color:#1B2B42;font-size:18px;font-weight:900}
.wct-member-stat small{color:#8492A5;font-size:9px}
.wct-member-card .wct-progress-bar{margin:8px 0 11px}
.wct-member-card-actions{display:flex;gap:7px}
.wct-member-card-actions button{flex:1;min-height:34px;border:1px solid #DCE4EF;border-radius:9px;background:#fff;color:#365B8B;font-size:10px;font-weight:800;cursor:pointer}
.wct-member-card-actions button.primary{background:#2864C7;border-color:#2864C7;color:#fff}
.wct-calendar-layout{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(250px,.8fr);gap:16px}
.wct-calendar{padding:14px}
.wct-calendar-top{display:flex;align-items:center;justify-content:space-between;gap:9px;margin-bottom:12px}
.wct-calendar-top strong{color:#1B2B42;font-size:14px;font-weight:850}
.wct-calendar-top button{width:33px;height:33px;border:1px solid #DFE7F1;border-radius:9px;background:#fff;color:#365B8B;font-size:16px;cursor:pointer}
.wct-calendar-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px}
.wct-calendar-weekday{padding:7px 2px;color:#8290A4;font-size:9px;font-weight:900;text-align:center;text-transform:uppercase}
.wct-calendar-day{position:relative;min-height:74px;padding:7px 6px;border:1px solid #EDF1F6;border-radius:9px;background:#fff;color:#34465E;text-align:left;cursor:pointer}
.wct-calendar-day:hover{border-color:#BFD2EC;background:#F7FAFE}
.wct-calendar-day.outside{background:#F8FAFC;color:#B0BBC9}
.wct-calendar-day.today{border-color:#6E9DDA;background:#F1F6FD}
.wct-calendar-day.selected{outline:2px solid #2864C7;border-color:#2864C7;background:#EEF4FD}
.wct-calendar-day strong{font-size:10px;font-weight:850}
.wct-calendar-dots{display:flex;gap:3px;flex-wrap:wrap;margin-top:8px}
.wct-calendar-dots i{width:6px;height:6px;border-radius:50%;background:#2864C7}
.wct-calendar-dots i.action{background:#8B70C1}.wct-calendar-dots i.meeting{background:#E1A34E}
.wct-calendar-side-list{display:grid;gap:9px}
.wct-calendar-event{display:flex;align-items:flex-start;gap:9px;padding:10px;border:1px solid #E8EDF4;border-radius:11px;background:#FCFDFE}
.wct-calendar-event-dot{width:9px;height:9px;flex:0 0 9px;margin-top:4px;border-radius:50%;background:#2864C7}
.wct-calendar-event-dot.action{background:#8B70C1}.wct-calendar-event-dot.meeting{background:#E1A34E}
.wct-calendar-event strong{display:block;color:#263A54;font-size:10px;line-height:1.4}
.wct-calendar-event small{display:block;margin-top:3px;color:#8290A4;font-size:9px}
.wct-analytics-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:16px}
.wct-analytics-kpi{padding:14px;border:1px solid #E3EAF3;border-radius:14px;background:#fff}
.wct-analytics-kpi small{display:block;color:#718198;font-size:10px;font-weight:750}
.wct-analytics-kpi strong{display:block;margin:8px 0 4px;color:#173B68;font-size:24px;font-weight:900}
.wct-analytics-kpi span{color:#8A98A9;font-size:9px}
.wct-analytics-grid{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(260px,.85fr);gap:15px;margin-bottom:15px}
.wct-heatmap{display:grid;grid-template-columns:repeat(20,minmax(0,1fr));gap:4px}
.wct-donut-layout{display:grid;grid-template-columns:145px minmax(0,1fr);align-items:center;gap:14px}
.wct-donut{position:relative;display:grid;place-items:center;width:136px;height:136px;border-radius:50%}
.wct-donut:before{content:"";position:absolute;inset:13px;border-radius:50%;background:#fff}
.wct-donut>div{position:relative;z-index:1;text-align:center}
.wct-donut strong{display:block;color:#173B68;font-size:25px;font-weight:900}
.wct-donut small{display:block;color:#8290A4;font-size:9px}
.wct-donut-legend{display:grid;gap:8px;min-width:0}
.wct-donut-legend>div{display:flex;align-items:center;justify-content:space-between;gap:8px;color:#718198;font-size:10px}
.wct-donut-legend span{display:flex;align-items:center;gap:7px;min-width:0}
.wct-donut-legend span i{width:9px;height:9px;flex:0 0 9px;border-radius:3px}
.wct-donut-legend b{color:#30465F;font-size:10px;white-space:nowrap}

.wct-heat-cell{aspect-ratio:1;border-radius:3px;background:#EFF3F8}
.wct-heat-cell.l1{background:#D9E7F9}.wct-heat-cell.l2{background:#A8C8F0}.wct-heat-cell.l3{background:#6F9EDD}.wct-heat-cell.l4{background:#2864C7}
.wct-contributor{display:grid;grid-template-columns:26px minmax(0,1fr) auto;align-items:center;gap:8px;padding:9px 0;border-bottom:1px solid #EDF1F6}
.wct-contributor:last-child{border-bottom:0}
.wct-contributor-rank{color:#8A98A9;font-size:10px;font-weight:900}
.wct-contributor strong{display:block;color:#263A54;font-size:10px}
.wct-contributor small{display:block;margin-top:3px;color:#8794A6;font-size:9px}
.wct-contributor b{color:#2864C7;font-size:11px}
.wct-empty{display:grid;place-items:center;min-height:100px;padding:18px;color:#8794A6;font-size:11px;text-align:center}
.wct-pref-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:16px}
.wct-pref-card{padding:16px;border:1px solid #E3EAF3;border-radius:15px;background:#fff}
.wct-pref-card h3{margin:0 0 5px;color:#1B2B42;font-size:13px}
.wct-pref-card p{margin:0 0 12px;color:#7B8BA0;font-size:10px;line-height:1.5}
.wct-theme-options{display:flex;gap:9px;flex-wrap:wrap}
.wct-theme-choice{display:flex;align-items:center;gap:7px;padding:8px 10px;border:1px solid #DFE7F1;border-radius:999px;background:#fff;color:#52657D;font-size:10px;font-weight:800;cursor:pointer}
.wct-theme-choice.active{border-color:#9DBCE5;background:#F1F6FD;color:#24599D}
.wct-theme-swatch{width:13px;height:13px;border-radius:50%;background:var(--swatch)}
.wct-pref-toggle{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 0;border-top:1px solid #EDF1F6;color:#52657D;font-size:10px}
.wct-pref-toggle input{accent-color:#2864C7}
.wct-workspace-export{display:inline-flex;align-items:center;gap:7px;padding:8px 11px;border:1px solid #DCE4EF;border-radius:9px;background:#fff;color:#365B8B;font-size:10px;font-weight:850;cursor:pointer}
.wct-workspace-export:hover{background:#F3F7FD}
@media(max-width:1100px){.wct-member-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.wct-workspace-grid.three{grid-template-columns:minmax(0,1.2fr) minmax(220px,.8fr)}.wct-workspace-grid.three .wct-gauge-panel{grid-column:1/-1}}
@media(max-width:850px){.wct-workspace-grid,.wct-workspace-grid.three,.wct-calendar-layout,.wct-analytics-grid{grid-template-columns:minmax(0,1fr)}.wct-workspace-grid.three .wct-gauge-panel{grid-column:auto}.wct-workspace-kpis,.wct-analytics-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:650px){.wct-page-head{flex-direction:column;align-items:stretch}.wct-page-head .btn,.wct-page-head button{width:100%}.wct-welcome{align-items:flex-start;flex-direction:column;padding:17px}.wct-welcome-meta{justify-content:flex-start}.wct-workspace-kpis{gap:9px}.wct-workspace-kpi{min-height:104px;padding:12px 11px}.wct-workspace-kpi-value{font-size:27px}.wct-workspace-kpi-label{font-size:10px}.wct-workspace-kpi-icon{width:32px;height:32px;flex-basis:32px}.wct-analytics-kpis{gap:8px}.wct-analytics-kpi{padding:11px}.wct-analytics-kpi strong{font-size:21px}.wct-member-grid{grid-template-columns:minmax(0,1fr)}.wct-calendar-day{min-height:52px;padding:5px 4px}.wct-calendar-grid{gap:3px}.wct-calendar{padding:9px}.wct-panel-head{padding:14px}.wct-panel-body{padding:13px}.wct-case-table{min-width:600px}.wct-pref-grid{grid-template-columns:minmax(0,1fr)}}
@media(max-width:390px){.wct-workspace-kpi{gap:7px}.wct-workspace-kpi-icon{display:none}.wct-workspace-kpi-value{font-size:25px}.wct-calendar-day{min-height:46px}.wct-calendar-dots i{width:5px;height:5px}}


/* Calendar page: balanced layout, readable month controls and compact agenda */
.wct-calendar-layout{
  grid-template-columns:minmax(0,1.68fr) minmax(300px,.9fr)!important;
  align-items:start!important;
  gap:18px!important;
}
.wct-calendar-main,.wct-calendar-agenda{min-width:0;align-self:start}
.wct-calendar-main{overflow:hidden}
.wct-calendar-main .wct-panel-body{padding:20px 22px!important}
.wct-calendar-top{
  display:grid!important;
  grid-template-columns:38px minmax(0,1fr) auto!important;
  align-items:center!important;
  gap:12px!important;
  min-height:54px;
  margin:0 0 13px!important;
  padding:0 0 13px!important;
  border-bottom:1px solid #EAF0F7;
}
.wct-calendar-month{display:flex;flex-direction:column;align-items:center;gap:3px;min-width:0}
.wct-calendar-month strong{color:#173B68;font-size:15px;font-weight:900;letter-spacing:-.02em}
.wct-calendar-month small{color:#8A9AAF;font-size:9px;font-weight:700}
.wct-calendar-nav{display:flex;align-items:center;justify-content:flex-end;gap:7px}
.wct-calendar-top button[data-wct-calendar-move]{
  display:grid;place-items:center;width:36px!important;min-width:36px;height:36px!important;
  border:1px solid #DDE7F3;border-radius:10px;background:#fff;color:#315D93;
  font-size:17px;font-weight:800;cursor:pointer;transition:background .16s,border-color .16s,transform .16s;
}
.wct-calendar-top button[data-wct-calendar-move]:hover{background:#F1F6FD;border-color:#B7CBE5;transform:translateY(-1px)}
.wct-calendar-top button[data-wct-calendar-today]{
  display:inline-flex;align-items:center;justify-content:center;width:auto!important;min-width:62px;
  height:36px!important;padding:0 12px!important;border:1px solid #D8E5F5;border-radius:10px;
  background:#F2F7FE;color:#285B98;font-size:10px;font-weight:850;white-space:nowrap;cursor:pointer;
}
.wct-calendar-top button[data-wct-calendar-today]:hover{background:#E7F0FC;border-color:#B7CBE5}
.wct-calendar-grid{gap:7px!important}
.wct-calendar-weekday{padding:8px 2px 10px!important;color:#8797AB!important;font-size:9px!important;letter-spacing:.06em}
.wct-calendar-day{
  display:flex;flex-direction:column;align-items:flex-start;gap:9px;
  min-height:72px!important;padding:9px 9px!important;
  border:1px solid #E8EEF6!important;border-radius:11px!important;
  background:linear-gradient(180deg,#FFFFFF 0%,#FCFDFE 100%)!important;
  color:#263F5D!important;transition:border-color .16s,background .16s,box-shadow .16s,transform .16s;
}
.wct-calendar-day:hover{border-color:#B9CDE8!important;background:#F6F9FE!important;box-shadow:0 4px 12px rgba(39,83,135,.07);transform:translateY(-1px)}
.wct-calendar-day strong{display:grid;place-items:center;width:24px;height:24px;border-radius:8px;color:#294564;font-size:10px;font-weight:900}
.wct-calendar-day.outside{background:#F7F9FC!important;border-color:#EDF1F6!important;cursor:default}
.wct-calendar-day.outside strong{color:#AEBBCB}
.wct-calendar-day.today{border-color:#A9C4E8!important;background:#F2F7FE!important}
.wct-calendar-day.today strong{background:#E0ECFC;color:#245B9C}
.wct-calendar-day.selected{outline:0!important;border:1.5px solid #2864C7!important;background:#EDF4FE!important;box-shadow:0 0 0 2px rgba(40,100,199,.10)!important}
.wct-calendar-day.selected strong{background:#2864C7;color:#fff}
.wct-calendar-dots{display:flex;align-items:center;gap:4px;min-height:7px;margin-top:0!important;padding-left:2px}
.wct-calendar-dots i{width:6px;height:6px;border-radius:50%;box-shadow:0 0 0 2px rgba(40,100,199,.08)}
.wct-calendar-dots i.action{box-shadow:0 0 0 2px rgba(139,112,193,.10)}
.wct-calendar-dots i.meeting{box-shadow:0 0 0 2px rgba(225,163,78,.12)}
.wct-calendar-legend{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:15px;padding-top:13px;border-top:1px solid #EDF1F6}
.wct-calendar-legend .wct-chart-legend{margin:0!important}
.wct-calendar-legend-note{color:#92A0B1;font-size:9px}
.wct-calendar-agenda .wct-panel-head{padding:17px 18px!important}
.wct-calendar-agenda .wct-panel-head h3{font-size:12px!important}
.wct-calendar-agenda .wct-panel-head p{margin-top:5px!important;font-size:9px!important}
.wct-calendar-agenda .wct-panel-body{display:grid;gap:0;padding:14px 17px 16px!important}
.wct-calendar-agenda-section{min-width:0}
.wct-calendar-agenda-section+.wct-calendar-agenda-section{margin-top:15px;padding-top:14px;border-top:1px solid #EAF0F6}
.wct-calendar-agenda-section-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px}
.wct-calendar-agenda-section-head strong{color:#24405F;font-size:11px;font-weight:850}
.wct-calendar-agenda-section-head span{color:#8A9AAF;font-size:9px;font-weight:750}
.wct-calendar-empty{
  display:flex;align-items:center;gap:11px;min-height:76px;padding:13px;
  border:1px dashed #DDE6F1;border-radius:12px;background:#FAFCFF;
}
.wct-calendar-empty-icon{display:grid;place-items:center;flex:0 0 34px;width:34px;height:34px;border-radius:10px;background:#EDF4FE;color:#4C7DB9}
.wct-calendar-empty-icon svg{width:16px;height:16px}
.wct-calendar-empty-copy{min-width:0}
.wct-calendar-empty-copy strong{display:block;color:#506781;font-size:10px;font-weight:800}
.wct-calendar-empty-copy small{display:block;margin-top:4px;color:#91A0B2;font-size:9px;line-height:1.45}
.wct-calendar-side-list{gap:7px!important}
.wct-calendar-event{align-items:center!important;gap:9px!important;padding:10px 11px!important;border:1px solid #E8EEF5!important;border-radius:11px!important;background:#fff!important;transition:border-color .15s,box-shadow .15s}
.wct-calendar-event:hover{border-color:#C8D8EB!important;box-shadow:0 3px 10px rgba(25,57,94,.05)}
.wct-calendar-event-dot{margin-top:0!important}
.wct-calendar-event strong{font-size:10px!important;color:#28415F!important}
.wct-calendar-event small{font-size:9px!important;line-height:1.4}
.wct-calendar-event .wct-panel-action{flex:0 0 auto;padding:6px 9px;border-radius:8px;background:#F1F6FD;font-size:9px;font-weight:850}
@media(max-width:1100px){
  .wct-calendar-layout{grid-template-columns:minmax(0,1.45fr) minmax(270px,.9fr)!important;gap:14px!important}
  .wct-calendar-main .wct-panel-body{padding:17px!important}
  .wct-calendar-day{min-height:66px!important}
}
@media(max-width:850px){
  .wct-calendar-layout{grid-template-columns:minmax(0,1fr)!important}
  .wct-calendar-agenda{width:100%}
  .wct-calendar-agenda .wct-panel-body{grid-template-columns:repeat(2,minmax(0,1fr));gap:0}
  .wct-calendar-agenda-section+.wct-calendar-agenda-section{margin:0 0 0 14px;padding:0 0 0 14px;border-top:0;border-left:1px solid #EAF0F6}
}
@media(max-width:650px){
  .wct-calendar-main .wct-panel-body{padding:13px!important}
  .wct-calendar-top{grid-template-columns:34px minmax(0,1fr) auto!important;gap:6px!important;min-height:48px}
  .wct-calendar-month strong{font-size:13px}
  .wct-calendar-month small{font-size:8px}
  .wct-calendar-top button[data-wct-calendar-move]{width:32px!important;min-width:32px;height:32px!important}
  .wct-calendar-top button[data-wct-calendar-today]{min-width:54px;height:32px!important;padding:0 8px!important;font-size:9px}
  .wct-calendar-grid{gap:4px!important}
  .wct-calendar-weekday{padding:6px 1px 8px!important;font-size:8px!important}
  .wct-calendar-day{min-height:57px!important;padding:6px 5px!important;gap:6px;border-radius:9px!important}
  .wct-calendar-day strong{width:21px;height:21px;font-size:9px}
  .wct-calendar-dots{gap:3px}
  .wct-calendar-dots i{width:5px;height:5px}
  .wct-calendar-agenda .wct-panel-body{grid-template-columns:minmax(0,1fr);gap:0}
  .wct-calendar-agenda-section+.wct-calendar-agenda-section{margin:13px 0 0;padding:13px 0 0;border-left:0;border-top:1px solid #EAF0F6}
}
@media(max-width:390px){
  .wct-calendar-top{grid-template-columns:30px minmax(0,1fr) auto!important;gap:5px!important}
  .wct-calendar-top button[data-wct-calendar-move]{width:29px!important;min-width:29px;height:30px!important}
  .wct-calendar-top button[data-wct-calendar-today]{min-width:49px;padding:0 6px!important;font-size:8px}
  .wct-calendar-grid{gap:3px!important}
  .wct-calendar-day{min-height:48px!important;padding:5px 3px!important;gap:5px}
  .wct-calendar-dots{gap:2px}
}

`;

  const runtime = String.raw`
(function(){
  if(window.__WCT_WORKSPACE_MODULES__)return;
  window.__WCT_WORKSPACE_MODULES__=true;

  var $=function(id){return document.getElementById(id);};
  var esc=function(value){return String(value==null?'':value).replace(/[&<>"']/g,function(ch){return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]);});};
  var cases=function(){return (state&&state.cases)||[];};
  var actions=function(){return (state&&state.actions)||[];};
  var logs=function(){return (state&&state.logs)||[];};
  var meetings=function(){return (state&&state.meetings)||[];};
  var profiles=function(){return (state&&state.profiles)||[];};
  var me=function(){try{return currentUser||{};}catch(e){return window.currentUser||{};}};
  var person=function(id){return profiles().find(function(p){return String(p.id)===String(id);})||null;};
  var personName=function(id){var p=person(id);return p?(p.full_name||p.login_id||'Anggota'):'Belum ditentukan';};
  var caseBy=function(id){return cases().find(function(c){return String(c.id)===String(id);})||null;};
  var actionsForCase=function(id){return actions().filter(function(a){return String(a.case_id)===String(id);});};
  var pctAction=function(a){return Math.max(0,Math.min(100,Number(a&&a.progress)||0));};
  var pctCase=function(id){var aa=actionsForCase(id);return aa.length?Math.round(aa.reduce(function(n,a){return n+pctAction(a);},0)/aa.length):0;};
  var statusLabel=function(s){return ({open:'To Do',in_progress:'In Progress',review:'In Review',done:'Done',closed:'Closed',overdue:'Overdue'})[s]||String(s||'Pending');};
  var statusClass=function(s){return ['open','in_progress','review','done','closed','overdue'].indexOf(s)>=0?s:'open';};
  var dateObj=function(value){if(!value)return null;var s=String(value).slice(0,10),p=s.split('-');if(p.length!==3)return null;var d=new Date(Number(p[0]),Number(p[1])-1,Number(p[2]));return isNaN(d.getTime())?null:d;};
  var isoDay=function(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
  var today=new Date();today.setHours(0,0,0,0);
  var todayKey=isoDay(today);
  var fmtDate=function(value){var d=dateObj(value);return d?d.toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'}):'—';};
  var fmtDateTime=function(value){if(!value)return '—';var d=new Date(value);return isNaN(d.getTime())?fmtDate(value):d.toLocaleString('id-ID',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});};
  var diffDays=function(date){var d=dateObj(date);return d?Math.round((d.getTime()-today.getTime())/86400000):9999;};
  var icon=function(name){var p={
    dashboard:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    chart:'<path d="M3 3v18h18"/><path d="m7 14 4-4 3 3 6-7"/>',case:'<path d="M5 4h14v16H5zM8 9h8M8 13h8M8 17h5"/>',
    team:'<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.8M16 3.2a4 4 0 0 1 0 7.6"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    progress:'<path d="M3 17l6-6 4 4 8-9"/><path d="M15 6h6v6"/>'
  };return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(p[name]||p.chart)+'</svg>';};
  var panel=function(title,subtitle,body,action,cls){return '<section class="wct-panel '+(cls||'')+'"><div class="wct-panel-head"><div><h3>'+title+'</h3><p>'+subtitle+'</p></div>'+(action||'')+'</div><div class="wct-panel-body">'+body+'</div></section>';};
  var head=function(kicker,title,desc,actionsHtml){return '<div class="wct-page-head"><div><div class="wct-kicker">'+kicker+'</div><h1>'+title+'</h1><p>'+desc+'</p></div>'+(actionsHtml||'')+'</div>';};
  var badge=function(s){return '<span class="wct-status '+statusClass(s)+'">'+esc(statusLabel(s))+'</span>';};
  var caseDeadline=function(c){return c.target_date||c.occurred_on||'';};
  var allActiveActions=function(){return actions().filter(function(a){var c=caseBy(a.case_id);return c&&c.status!=='closed'&&a.status!=='done';});};
  var reminders=function(){
    var out=[];
    cases().forEach(function(c){if(c.status!=='closed'&&c.target_date)out.push({kind:'case',id:c.id,case_id:c.id,title:c.case_code+' · '+c.title,detail:'Case · '+(c.hub_code||'—'),date:c.target_date,status:'open'});});
    actions().forEach(function(a){var c=caseBy(a.case_id);if(c&&c.status!=='closed'&&a.status!=='done'&&a.due_date)out.push({kind:'action',id:a.id,case_id:c.id,title:a.title,detail:(a.action_type==='corrective'?'Corrective':'Preventive')+' · '+(c.case_code||''),date:a.due_date,status:a.status});});
    return out.sort(function(a,b){return String(a.date).localeCompare(String(b.date));});
  };
  var chartBars=function(){
    var days=[];for(var i=6;i>=0;i--){var d=new Date(today);d.setDate(today.getDate()-i);days.push({date:isoDay(d),label:d.toLocaleDateString('id-ID',{weekday:'short'}),cases:0,updates:0});}
    cases().forEach(function(c){var k=String(c.created_at||'').slice(0,10),d=days.find(function(x){return x.date===k;});if(d)d.cases++;});
    logs().forEach(function(l){var k=String(l.created_at||'').slice(0,10),d=days.find(function(x){return x.date===k;});if(d)d.updates++;});
    var max=Math.max(1,...days.map(function(x){return Math.max(x.cases,x.updates);}));
    var bars=days.map(function(d,i){var x=52+i*82,h1=(d.cases/max)*112,h2=(d.updates/max)*112;return '<g><rect x="'+x+'" y="'+(143-h1)+'" width="22" height="'+Math.max(2,h1)+'" rx="5" fill="#F28C18" opacity=".95"><title>'+d.label+': '+d.cases+' Case</title></rect><rect x="'+(x+25)+'" y="'+(143-h2)+'" width="22" height="'+Math.max(2,h2)+'" rx="5" fill="#F8BD78"><title>'+d.label+': '+d.updates+' Update</title></rect><text x="'+(x+23)+'" y="166" text-anchor="middle" class="wct-chart-label">'+esc(d.label)+'</text></g>';}).join('');
    var grid=[0,1,2,3].map(function(i){var y=143-i*37.3;return '<line x1="38" y1="'+y+'" x2="642" y2="'+y+'" class="wct-chart-gridline"/><text x="27" y="'+(y+3)+'" text-anchor="end" class="wct-chart-label">'+Math.round(max*i/3)+'</text>';}).join('');
    return '<svg class="wct-chart-svg" viewBox="0 0 660 180" role="img" aria-label="Aktivitas Case dan Progress Update selama tujuh hari">'+grid+bars+'</svg>';
  };
  var reminderHtml=function(items,limit){
    if(!items.length)return '<div class="wct-empty">Tidak ada deadline Case atau Action yang perlu diperhatikan.</div>';
    return '<div class="wct-reminder-list">'+items.slice(0,limit||5).map(function(r){var delta=diffDays(r.date),over=delta<0;return '<div class="wct-reminder '+(over?'is-overdue':'')+'"><span class="wct-reminder-icon">'+icon(over?'bell':'calendar')+'</span><div><strong>'+esc(r.title)+'</strong><small>'+esc(r.detail)+(over?' · Terlambat':delta===0?' · Hari ini':'')+'</small></div><span class="wct-reminder-date">'+(over?Math.abs(delta)+' hari lewat':delta===0?'Hari ini':delta+' hari lagi')+'</span></div>';}).join('')+'</div>';
  };
  var teamRows=function(limit){
    var people=profiles().filter(function(p){return p.active!==false&&p.deleted!==true;}).map(function(p){var mine=actions().filter(function(a){return String(a.assigned_to)===String(p.id);}),open=mine.filter(function(a){return a.status!=='done';}).length,done=mine.filter(function(a){return a.status==='done';}).length;return {p:p,total:mine.length,open:open,done:done};}).sort(function(a,b){return b.open-a.open||b.done-a.done;}).slice(0,limit||4);
    if(!people.length)return '<div class="wct-empty">Belum ada anggota tim aktif.</div>';
    return '<div class="wct-member-list">'+people.map(function(x){var initials=String(x.p.full_name||x.p.login_id||'U').split(/\s+/).slice(0,2).map(function(v){return v[0]||'';}).join('').toUpperCase();return '<div class="wct-member"><span class="wct-avatar">'+esc(initials)+'</span><div class="wct-member-main"><strong>'+esc(x.p.full_name||x.p.login_id||'Anggota')+'</strong><small>'+esc(x.p.role||'Member')+'</small></div><div class="wct-member-load"><b>'+x.open+' Open</b><small>'+x.done+' Selesai</small></div></div>';}).join('')+'</div>';
  };
  var gaugeHtml=function(){
    var aa=actions(),avg=aa.length?Math.round(aa.reduce(function(n,a){return n+pctAction(a);},0)/aa.length):0,ca=aa.filter(function(a){return a.action_type==='corrective';}),pa=aa.filter(function(a){return a.action_type==='preventive';});
    var avgOf=function(list){return list.length?Math.round(list.reduce(function(n,a){return n+pctAction(a);},0)/list.length):0;};
    return '<div class="wct-gauge-wrap"><div class="wct-gauge" style="--wct-gauge-value:'+avg+'%"><div class="wct-gauge-center"><strong>'+avg+'%</strong><small>Rata-rata PICAPA</small></div></div><div class="wct-gauge-legend"><div><span>Corrective Action</span><b>'+avgOf(ca)+'%</b></div><div><span>Preventive Action</span><b>'+avgOf(pa)+'%</b></div><div><span>Total Action</span><b>'+aa.length+'</b></div></div></div>';
  };
  function renderDashboard(){
    var cs=cases(),aa=actions(),closed=cs.filter(function(c){return c.status==='closed';}),running=cs.filter(function(c){return c.status==='in_progress';}),pending=cs.filter(function(c){return c.status==='open'||c.status==='review';});
    var name=me().full_name||me().login_id||'Pengguna',attention=reminders(),recent=cs.slice().sort(function(a,b){return String(b.created_at||'').localeCompare(String(a.created_at||''));}).slice(0,5);
    var overdue=attention.filter(function(r){return diffDays(r.date)<0;}).length;
    var totalProgress=aa.length?Math.round(aa.reduce(function(n,a){return n+pctAction(a);},0)/aa.length):0;
    var actionBar=function(label,count,color){var pct=aa.length?Math.round(count/aa.length*100):0;return '<div style="margin:10px 0"><div style="display:flex;justify-content:space-between;gap:8px;margin-bottom:6px;color:#718198;font-size:10px"><b>'+label+'</b><span>'+count+' · '+pct+'%</span></div><div class="wct-progress-bar"><span style="width:'+pct+'%;background:'+color+'"></span></div></div>';};
    var kpis='<div class="wct-workspace-kpis">'+[
      ['Total Case',cs.length,'Seluruh periode','dashboard'],
      ['Closed Case',closed.length,'Sudah diselesaikan','check'],
      ['Running Case',running.length,'Sedang ditangani','progress'],
      ['Pending Case',pending.length,'Menunggu tindak lanjut','calendar']
    ].map(function(x){return '<div class="wct-workspace-kpi"><div><div class="wct-workspace-kpi-label">'+x[0]+'</div><div class="wct-workspace-kpi-value">'+x[1]+'</div><div class="wct-workspace-kpi-note">'+x[2]+'</div></div><span class="wct-workspace-kpi-icon">'+icon(x[3])+'</span></div>';}).join('')+'</div>';
    var listBody=recent.length?'<div style="overflow:auto"><table class="wct-case-table"><thead><tr><th>Case</th><th>HUB</th><th>Progress</th><th>Status</th><th>Target</th><th></th></tr></thead><tbody>'+recent.map(function(c){return '<tr><td><div class="case-main"><strong>'+esc(c.case_code||'CASE')+' · '+esc(c.title)+'</strong><small>'+esc(c.category||'—')+' · '+esc((Array.isArray(c.divisions)&&c.divisions.length?c.divisions:[c.division]).filter(Boolean).join(', ')||'—')+'</small></div></td><td>'+esc((Array.isArray(c.hub_codes)&&c.hub_codes.length?c.hub_codes:[c.hub_code]).filter(Boolean).join(', ')||'—')+'</td><td><div class="wct-progress-inline"><div class="wct-progress-bar"><span style="width:'+pctCase(c.id)+'%"></span></div><b>'+pctCase(c.id)+'%</b></div></td><td>'+badge(c.status)+'</td><td>'+fmtDate(caseDeadline(c))+'</td><td><button class="wct-panel-action" data-wct-open-case="'+esc(c.id)+'">Update</button></td></tr>';}).join('')+'</tbody></table></div>':'<div class="wct-empty">Belum ada Case. Buat Case pertama untuk mulai memantau PICAPA.</div>';
    var progressBody=actionBar('Corrective Action',aa.filter(function(a){return a.action_type==='corrective'&&a.status==='done';}).length,'#2864C7')+actionBar('Preventive Action',aa.filter(function(a){return a.action_type==='preventive'&&a.status==='done';}).length,'#7D69B2')+'<div style="margin-top:13px;padding-top:11px;border-top:1px solid #EDF1F6;color:#718198;font-size:10px">Rata-rata progress seluruh tindakan: <b style="color:#173B68">'+totalProgress+'%</b></div>';
    var html=head('WORKSPACE / OVERVIEW','Dashboard','Ringkasan Case, tanggung jawab PIC, deadline, dan progres PICAPA.',(isCoordinatorSafe()?'<button class="btn btn-primary" type="button" data-wct-create-case>'+icon('case')+' Create New Case</button>':''));
    html+=kpis;
    html+='<div class="wct-workspace-grid">'+
      panel('Project Analytics','Aktivitas Case dan Progress Update · 7 hari terakhir','<div class="wct-chart-legend"><span><i style="background:#F28C18"></i>Case dibuat</span><span><i style="background:#F8BD78"></i>Progress Update</span></div>'+chartBars(),'<span class="wct-mini-pill">'+cs.length+' Case</span>')+
      panel('Reminders','Deadline Case dan Action yang perlu diperhatikan',reminderHtml(attention,5),'<span class="wct-mini-pill">'+overdue+' Terlambat</span>')+
    '</div>';
    html+='<div class="wct-workspace-grid three">'+
      panel('Project List','Case terbaru dan status penyelesaiannya',listBody,'<button class="wct-panel-action" data-wct-open-native="cases">Lihat semua</button>')+
      panel('Team Collaboration','Ringkasan beban tindakan anggota tim',teamRows(4),'<button class="wct-panel-action" data-wct-go="team">Lihat tim</button>')+
      panel('Project Progress','Ringkasan progres seluruh tindakan PICAPA',gaugeHtml(),'<span class="wct-mini-pill">'+aa.length+' Action</span>','wct-gauge-panel')+
    '</div>';
    var root=$('pageContent');if(root)root.innerHTML=html;
  }
  window.renderDashboard=renderDashboard;

  var activeTaskFilter='all',taskSearch='',teamSearch='',teamRole='all',calendarCursor=new Date(today.getFullYear(),today.getMonth(),1),calendarSelected=todayKey,analyticsRange=30,teamAssignee='';
  var renderWorkspacePage;
  function taskStatusList(s){return s==='open'?'open':(['in_progress','review','done'].indexOf(s)>=0?s:'open');}
  function taskRecords(){
    return actions().map(function(a){var c=caseBy(a.case_id);return {a:a,c:c};}).filter(function(x){return x.c;});
  }
  function taskCard(x){
    var a=x.a,c=x.c,p=person(a.assigned_to),myId=String(me().id||''),priority=String(c.priority||'Medium').toLowerCase();
    var canDrag=isCoordinatorSafe();
    var task= '<article class="wct-task-card'+(canDrag?' is-draggable':'')+'" draggable="'+(canDrag?'true':'false')+'" data-wct-drag-action="'+esc(a.id)+'"'+(canDrag?' title="Seret untuk memindahkan status"':' title="Status dikelola Admin/Koordinator; PIC dapat memakai Update Progress"')+'><div class="wct-task-card-top"><span class="wct-task-type '+(a.action_type==='preventive'?'pa':'')+'">'+(a.action_type==='preventive'?'PREVENTIVE':'CORRECTIVE')+'</span>'+badge(a.status||'open')+'</div>'+
      '<h4>'+esc(a.title)+'</h4><div class="wct-task-case">'+esc(c.case_code||'CASE')+' · '+esc((Array.isArray(c.hub_codes)&&c.hub_codes.length?c.hub_codes:[c.hub_code]).filter(Boolean).join(', ')||'—')+' · Priority '+esc(c.priority||'Medium')+'</div>'+
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:10px"><span style="color:#718198;font-size:9px">PIC: '+esc(p?p.full_name||p.login_id:'Belum ditentukan')+'</span><span style="color:'+(diffDays(a.due_date)<0&&a.status!=='done'?'#B84550':'#718198')+';font-size:9px;font-weight:800">'+fmtDate(a.due_date)+'</span></div>'+
      '<div style="margin-top:9px"><div class="wct-progress-inline"><div class="wct-progress-bar"><span style="width:'+pctAction(a)+'%"></span></div><b>'+pctAction(a)+'%</b></div></div>'+
      '<div class="wct-task-actions"><button type="button" data-wct-open-case="'+esc(c.id)+'">Case</button><button type="button" class="primary" data-wct-progress-action="'+esc(a.id)+'">Atur Progres</button></div></article>';
    return task;
  }
  function renderTasks(){
    var records=taskRecords().filter(function(x){if(x.c.status==='closed')return false;var f=activeTaskFilter;if(f==='mine'&&String(x.a.assigned_to)!==String(me().id))return false;if(f==='high'&&String(x.c.priority||'').toLowerCase()!=='high')return false;if(f==='due'&&(diffDays(x.a.due_date)>7||diffDays(x.a.due_date)<0))return false;if(teamAssignee&&String(x.a.assigned_to)!==String(teamAssignee))return false;var q=taskSearch.trim().toLowerCase();return !q||[x.a.title,x.c.case_code,x.c.title,x.c.hub_code,personName(x.a.assigned_to)].join(' ').toLowerCase().includes(q);});
    var cols=[['open','To Do'],['in_progress','In Progress'],['review','In Review'],['done','Done']];
    var html=head('WORKSPACE / TASKS','Tasks','Papan kerja PICAPA untuk mengelola tindakan perbaikan dan pencegahan.',(isCoordinatorSafe()?'<button class="btn btn-primary" type="button" data-wct-new-action="corrective">+ Tambah Action</button>':''));
    html+='<div class="wct-kanban-toolbar"><input type="search" placeholder="Cari Action, Case, HUB, atau PIC..." data-wct-task-search value="'+esc(taskSearch)+'"><button class="wct-filter-chip '+(activeTaskFilter==='all'?'active':'')+'" data-wct-task-filter="all">All Tasks</button><button class="wct-filter-chip '+(activeTaskFilter==='mine'?'active':'')+'" data-wct-task-filter="mine">My Tasks</button><button class="wct-filter-chip '+(activeTaskFilter==='high'?'active':'')+'" data-wct-task-filter="high">High Priority</button><button class="wct-filter-chip '+(activeTaskFilter==='due'?'active':'')+'" data-wct-task-filter="due">Due This Week</button>'+(teamAssignee?'<button class="wct-filter-chip active" data-wct-clear-assignee>Filter PIC: '+esc(personName(teamAssignee))+' ×</button>':'')+'</div>';
    html+='<div class="wct-task-drag-hint">'+(isCoordinatorSafe()?'Seret kartu ke kolom tujuan untuk mengubah status. Action hanya dapat dipindahkan ke Done jika progress sudah 100%.':'Status papan dikelola Admin/Koordinator. PIC dapat mencatat perubahan status melalui Update Progress.')+'</div>';
    html+='<div class="wct-kanban">'+cols.map(function(col){var arr=records.filter(function(x){return taskStatusList(x.a.status)===col[0];});return '<section class="wct-kanban-col" data-wct-drop-status="'+col[0]+'"><div class="wct-kanban-col-head"><strong>'+col[1]+'</strong><span class="wct-kanban-count">'+arr.length+'</span></div><div class="wct-kanban-cards">'+(arr.length?arr.map(taskCard).join(''):'<div class="wct-empty">Belum ada Action</div>')+'</div></section>';}).join('')+'</div>';
    var root=$('pageContent');if(root)root.innerHTML=html;
  }
  function renderTeam(){
    var people=profiles().filter(function(p){return p.active!==false&&p.deleted!==true;}).filter(function(p){var q=teamSearch.toLowerCase();return (!q||[p.full_name,p.login_id,p.role,p.area_name,p.hub_code].join(' ').toLowerCase().includes(q))&&(teamRole==='all'||p.role===teamRole);});
    var roles=Array.from(new Set(profiles().map(function(p){return p.role;}).filter(Boolean)));
    var html=head('WORKSPACE / TEAM','Team','Pantau distribusi pekerjaan, PIC aktif, dan penyelesaian tindakan.',isAdminSafe()?'<button class="btn btn-primary" type="button" data-wct-invite-member>＋ Invite Member</button>':'');
    html+='<div class="wct-filterbar"><input type="search" placeholder="Cari nama anggota atau HUB..." data-wct-team-search value="'+esc(teamSearch)+'"><select data-wct-team-role><option value="all">All Roles</option>'+roles.map(function(r){return '<option value="'+esc(r)+'" '+(r===teamRole?'selected':'')+'>'+esc(r)+'</option>';}).join('')+'</select><span class="wct-mini-pill">'+people.length+' Anggota Aktif</span></div>';
    html+='<div class="wct-member-grid">'+(people.length?people.map(function(p){var mine=actions().filter(function(a){return String(a.assigned_to)===String(p.id);}),open=mine.filter(function(a){return a.status!=='done';}).length,done=mine.filter(function(a){return a.status==='done';}).length,avg=mine.length?Math.round(mine.reduce(function(n,a){return n+pctAction(a);},0)/mine.length):0,initial=String(p.full_name||p.login_id||'U').split(/\s+/).slice(0,2).map(function(x){return x[0]||'';}).join('').toUpperCase();return '<article class="wct-member-card"><div class="wct-member-card-top"><span class="wct-avatar">'+esc(initial)+'</span><div><h3>'+esc(p.full_name||p.login_id||'Anggota')+'</h3><p>'+esc(p.role||'Member')+(p.hub_code?' · '+esc(p.hub_code):'')+'</p></div></div><div class="wct-member-stats"><div class="wct-member-stat"><strong>'+open+'</strong><small>Open Actions</small></div><div class="wct-member-stat"><strong>'+done+'</strong><small>Completed</small></div></div><div style="display:flex;justify-content:space-between;gap:8px;color:#718198;font-size:9px"><span>Workload progress</span><b>'+avg+'%</b></div><div class="wct-progress-bar"><span style="width:'+avg+'%"></span></div><div class="wct-member-card-actions"><button type="button" data-wct-member-tasks="'+esc(p.id)+'">View Tasks</button><button type="button" data-wct-member-message="'+esc(p.id)+'">Message</button><button type="button" class="primary" data-wct-member-detail="'+esc(p.id)+'">Profile</button></div></article>';}).join(''):'<div class="wct-empty">Tidak ada anggota sesuai filter.</div>')+'</div>';
    var root=$('pageContent');if(root)root.innerHTML=html;
  }
  function eventList(){
    var out=[];
    cases().forEach(function(c){if(c.target_date)out.push({date:String(c.target_date).slice(0,10),kind:'case',title:(c.case_code||'Case')+' · '+c.title,detail:'Deadline Case · '+(c.hub_code||'—'),caseId:c.id,status:c.status});});
    actions().forEach(function(a){if(a.due_date){var c=caseBy(a.case_id);out.push({date:String(a.due_date).slice(0,10),kind:'action',title:a.title,detail:(a.action_type==='corrective'?'Corrective':'Preventive')+' · '+(c?c.case_code:'Case'),actionId:a.id,caseId:a.case_id,status:a.status});}});
    meetings().forEach(function(m){if(m.meeting_date)out.push({date:String(m.meeting_date).slice(0,10),kind:'meeting',title:m.title||'Weekly Meeting',detail:[m.start_time,m.location].filter(Boolean).join(' · ')||'Meeting',meetingId:m.id,status:m.status});});
    return out.filter(function(e){return !!e.date;});
  }
  function renderCalendar(){
    var y=calendarCursor.getFullYear(),m=calendarCursor.getMonth(),
      first=new Date(y,m,1),weekStart=getWeekStart(),
      offset=weekStart==='Sunday'?first.getDay():(first.getDay()+6)%7,
      days=new Date(y,m+1,0).getDate(),events=eventList(),
      monthKey=String(y)+'-'+String(m+1).padStart(2,'0'),
      monthEvents=events.filter(function(e){return String(e.date).slice(0,7)===monthKey;}),
      selected=events.filter(function(e){return e.date===calendarSelected;}),
      upcoming=events.filter(function(e){return e.date>=todayKey;}).sort(function(a,b){return a.date.localeCompare(b.date);}).slice(0,5);
    var cells='';
    for(var i=0;i<offset;i++){
      var prev=new Date(y,m,0);
      cells+='<button class="wct-calendar-day outside" type="button" disabled aria-hidden="true"><strong>'+Math.max(1,prev.getDate()-offset+i+1)+'</strong></button>';
    }
    for(var d=1;d<=days;d++){
      var dt=new Date(y,m,d),key=isoDay(dt),
        ev=events.filter(function(e){return e.date===key;}),
        classes='wct-calendar-day'+(key===todayKey?' today':'')+(key===calendarSelected?' selected':'')+(ev.length?' has-events':''),
        aria=dt.toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
      cells+='<button class="'+classes+'" type="button" data-wct-calendar-date="'+key+'" aria-label="'+esc('Pilih '+aria+(ev.length?', '+ev.length+' agenda':''))+'" title="'+esc(aria+(ev.length?' · '+ev.length+' agenda':''))+'"><strong>'+d+'</strong><span class="wct-calendar-dots">'+ev.slice(0,5).map(function(e){return '<i class="'+e.kind+'"></i>';}).join('')+'</span></button>';
    }
    var rem=(7-(offset+days)%7)%7;
    for(var j=1;j<=rem;j++)cells+='<button class="wct-calendar-day outside" type="button" disabled aria-hidden="true"><strong>'+j+'</strong></button>';

    var eventCards=function(list){
      return '<div class="wct-calendar-side-list">'+list.map(function(e){
        var action=e.actionId?'<button type="button" class="wct-panel-action" data-wct-open-action="'+esc(e.actionId)+'">Buka</button>':
          e.caseId?'<button type="button" class="wct-panel-action" data-wct-open-case="'+esc(e.caseId)+'">Buka</button>':'';
        return '<div class="wct-calendar-event"><i class="wct-calendar-event-dot '+e.kind+'"></i><div style="min-width:0;flex:1"><strong>'+esc(e.title)+'</strong><small>'+fmtDate(e.date)+' · '+esc(e.detail)+'</small></div>'+action+'</div>';
      }).join('')+'</div>';
    };
    var emptyState=function(kind,title,description){
      return '<div class="wct-calendar-empty"><span class="wct-calendar-empty-icon">'+icon(kind)+'</span><div class="wct-calendar-empty-copy"><strong>'+title+'</strong><small>'+description+'</small></div></div>';
    };
    var agendaBody=
      '<div class="wct-calendar-agenda-section"><div class="wct-calendar-agenda-section-head"><strong>Agenda pada tanggal dipilih</strong><span>'+selected.length+' Agenda</span></div>'+
      (selected.length?eventCards(selected):emptyState('calendar','Belum ada agenda','Pilih tanggal lain atau tambahkan Case, Action, maupun Weekly Meeting.'))+
      '</div>'+
      '<div class="wct-calendar-agenda-section"><div class="wct-calendar-agenda-section-head"><strong>Coming Up</strong><span>'+upcoming.length+' Agenda</span></div>'+
      (upcoming.length?eventCards(upcoming):emptyState('bell','Belum ada agenda mendatang','Jadwal Case, Action, dan meeting berikutnya akan muncul di sini.'))+
      '</div>';

    var html=head('WORKSPACE / CALENDAR','Calendar','Kalender jadwal Case, target Corrective/Preventive Action, dan Weekly Meeting.');
    html+='<div class="wct-calendar-layout">'+
      '<section class="wct-panel wct-calendar-main"><div class="wct-panel-body">'+
      '<div class="wct-calendar-top">'+
      '<button type="button" data-wct-calendar-move="-1" aria-label="Bulan sebelumnya" title="Bulan sebelumnya">‹</button>'+
      '<div class="wct-calendar-month"><strong>'+calendarCursor.toLocaleDateString('id-ID',{month:'long',year:'numeric'})+'</strong><small>'+monthEvents.length+' agenda pada bulan ini</small></div>'+
      '<div class="wct-calendar-nav"><button type="button" data-wct-calendar-today>Today</button><button type="button" data-wct-calendar-move="1" aria-label="Bulan berikutnya" title="Bulan berikutnya">›</button></div>'+
      '</div>'+
      '<div class="wct-calendar-grid">'+
      (weekStart==='Sunday'?['Min','Sen','Sel','Rab','Kam','Jum','Sab']:['Sen','Sel','Rab','Kam','Jum','Sab','Min']).map(function(x){return '<div class="wct-calendar-weekday">'+x+'</div>';}).join('')+
      cells+'</div>'+
      '<div class="wct-calendar-legend"><div class="wct-chart-legend"><span><i style="background:#2864C7"></i>Case</span><span><i style="background:#8B70C1"></i>Action</span><span><i style="background:#E1A34E"></i>Meeting</span></div><span class="wct-calendar-legend-note">Pilih tanggal untuk melihat agenda</span></div>'+
      '</div></section>'+
      panel('Agenda Harian',fmtDate(calendarSelected),agendaBody,'<span class="wct-mini-pill">'+selected.length+' Hari Ini</span>','wct-calendar-agenda')+
      '</div>';
    var root=$('pageContent');if(root)root.innerHTML=html;
  }
  function analyticsDay(value){
    if(!value)return '';
    var parsed=new Date(value);
    return isNaN(parsed.getTime())?String(value).slice(0,10):isoDay(parsed);
  }
  function rangeLogs(){
    var since=new Date(today);since.setDate(since.getDate()-analyticsRange+1);var key=isoDay(since);
    return logs().filter(function(l){var d=analyticsDay(l.created_at);return d>=key&&d<=todayKey;});
  }
  function renderAnalytics(){
    var periodStart=new Date(today);periodStart.setDate(today.getDate()-analyticsRange+1);
    var startKey=isoDay(periodStart),endKey=todayKey;
    var ll=rangeLogs();
    // Completion KPIs use the actual completion timestamp and the selected period.
    var done=actions().filter(function(a){
      var completed=analyticsDay(a.completed_at);
      return a.status==='done'&&completed>=startKey&&completed<=endKey;
    });
    var eligibleDone=done.filter(function(a){var parent=caseBy(a.case_id);return !!(a.due_date||parent&&parent.target_date);});
    var onTime=eligibleDone.filter(function(a){
      var parent=caseBy(a.case_id),target=String(a.due_date||parent&&parent.target_date||'').slice(0,10);
      return analyticsDay(a.completed_at)<=target;
    });
    var rate=eligibleDone.length?Math.round(onTime.length/eligibleDone.length*100):0;
    var avg=done.length?Math.round(done.reduce(function(n,a){
      var created=new Date(a.created_at||today),completed=new Date(a.completed_at||a.created_at||today);
      return n+Math.max(0,(completed-created)/86400000);
    },0)/done.length*10)/10:0;
    var contributors=profiles().map(function(p){var n=ll.filter(function(l){return String(l.created_by)===String(p.id);}).length;return {p:p,n:n};}).filter(function(x){return x.n>0;}).sort(function(a,b){return b.n-a.n;});
    var contributors=profiles().map(function(p){var n=ll.filter(function(l){return String(l.created_by)===String(p.id);}).length;return {p:p,n:n};}).filter(function(x){return x.n>0;}).sort(function(a,b){return b.n-a.n;});
    var periodStart=new Date(today);periodStart.setDate(today.getDate()-analyticsRange+1);
    var previousStart=new Date(periodStart);previousStart.setDate(periodStart.getDate()-analyticsRange);
    var prevKey=isoDay(previousStart),startKey=isoDay(periodStart);
    var prevLogs=logs().filter(function(l){var d=analyticsDay(l.created_at);return d>=prevKey&&d<startKey;});
    var daily=[],currentValues=[],previousValues=[];
    for(var i=analyticsRange-1;i>=0;i--){
      var day=new Date(today);day.setDate(today.getDate()-i);
      var key=isoDay(day),prevDay=new Date(day);prevDay.setDate(day.getDate()-analyticsRange);var prevDayKey=isoDay(prevDay);
      var currentCount=ll.filter(function(l){return analyticsDay(l.created_at)===key;}).length;
      var previousCount=prevLogs.filter(function(l){return analyticsDay(l.created_at)===prevDayKey;}).length;
      daily.push({key:key,label:day.toLocaleDateString('id-ID',{day:'2-digit',month:'short'}),n:currentCount,previous:previousCount});
      currentValues.push(currentCount);previousValues.push(previousCount);
    }
    var moving=currentValues.map(function(v,i){var from=Math.max(0,i-6),sum=0,count=0;for(var j=from;j<=i;j++){sum+=currentValues[j];count++;}return count?sum/count:0;});
    var max=Math.max(1,...currentValues,...previousValues,...moving);
    var xAt=function(i){return 30+(analyticsRange<=1?0:i*580/(analyticsRange-1));};
    var yAt=function(v){return 126-(v/max*94);};
    var pathOf=function(values){return values.map(function(v,i){return xAt(i)+','+yAt(v);}).join(' ');};
    var ticks=[],step=Math.max(1,Math.ceil(analyticsRange/7));
    for(var t=0;t<daily.length;t+=step){ticks.push('<text x="'+xAt(t)+'" y="151" text-anchor="middle" class="wct-chart-label">'+esc(daily[t].label)+'</text>');}
    if(ticks.length&&daily.length>1&&((daily.length-1)%step)!==0)ticks.push('<text x="'+xAt(daily.length-1)+'" y="151" text-anchor="middle" class="wct-chart-label">'+esc(daily[daily.length-1].label)+'</text>');
    var grid=[0,1,2,3].map(function(i){var yy=126-i*31.3;return '<line x1="25" y1="'+yy+'" x2="615" y2="'+yy+'" class="wct-chart-gridline"/><text x="17" y="'+(yy+3)+'" text-anchor="end" class="wct-chart-label">'+Math.round(max*i/3)+'</text>';}).join('');
    var throughput='<div class="wct-chart-legend" style="margin-bottom:8px"><span><i style="background:#2864C7"></i>Periode ini</span><span><i style="background:#AEB9C8"></i>Periode sebelumnya</span><span><i style="background:#7FA5D8"></i>Moving average 7 hari</span></div><svg class="wct-chart-svg" viewBox="0 0 640 162">'+grid+
      '<polyline points="'+pathOf(previousValues)+'" fill="none" stroke="#AEB9C8" stroke-width="2.2" stroke-dasharray="5 5" stroke-linecap="round" stroke-linejoin="round"/>'+
      '<polyline points="'+pathOf(moving)+'" fill="none" stroke="#7FA5D8" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>'+
      '<polyline points="'+pathOf(currentValues)+'" fill="none" stroke="#2864C7" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>'+
      daily.map(function(x,i){return '<circle cx="'+xAt(i)+'" cy="'+yAt(x.n)+'" r="'+(analyticsRange>30?'1.7':'3')+'" fill="#2864C7"><title>'+x.label+': '+x.n+' update</title></circle>';}).join('')+ticks.join('')+'</svg>';
    var heatCounts={};
    logs().forEach(function(l){var k=analyticsDay(l.created_at);if(k)heatCounts[k]=(heatCounts[k]||0)+1;});
    var heat=Array.from({length:140},function(_,i){var d=new Date(today);d.setDate(today.getDate()-(139-i));var k=isoDay(d),n=heatCounts[k]||0,level=n===0?'':n===1?'l1':n<=3?'l2':n<=6?'l3':'l4';return '<i class="wct-heat-cell '+level+'" title="'+k+': '+n+' update"></i>';}).join('');
    var hubCounts={};cases().forEach(function(c){
      var selected=Array.isArray(c.hub_codes)&&c.hub_codes.length?c.hub_codes:[c.hub_code||'Lainnya'];
      Array.from(new Set(selected.map(function(v){return String(v||'').trim()||'Lainnya';}))).forEach(function(k){hubCounts[k]=(hubCounts[k]||0)+1;});
    });
    var colors=['#2864C7','#7D69B2','#47A5A0','#E3A44B','#7DA5D7','#A6B7CC'];
    var hubRows=Object.keys(hubCounts).sort(function(a,b){return hubCounts[b]-hubCounts[a];}).slice(0,6);
    var totalHub=hubRows.reduce(function(n,h){return n+hubCounts[h];},0);
    var offset=0,segments=hubRows.map(function(h,i){var start=offset,part=totalHub?hubCounts[h]/totalHub*100:0;offset+=part;return colors[i%colors.length]+' '+start.toFixed(1)+'% '+offset.toFixed(1)+'%';});
    var donutStyle=segments.length?'conic-gradient('+segments.join(',')+')':'conic-gradient(#E8EEF5 0% 100%)';
    var donut='<div class="wct-donut-layout"><div class="wct-donut" style="background:'+donutStyle+'"><div><strong>'+cases().length+'</strong><small>Total Case</small></div></div><div class="wct-donut-legend">'+(hubRows.length?hubRows.map(function(h,i){var share=totalHub?Math.round(hubCounts[h]/totalHub*100):0;return '<div><span><i style="background:'+colors[i%colors.length]+'"></i>'+esc(h)+'</span><b>'+hubCounts[h]+' · '+share+'%</b></div>';}).join(''):'<div class="wct-empty">Belum ada Case.</div>')+'</div></div>';
    var html=head('WORKSPACE / ANALYTICS','Analytics','Analisis penyelesaian tindakan, ketepatan deadline, aktivitas, dan kontribusi PIC.','<div style="display:flex;gap:7px;flex-wrap:wrap"><button type="button" class="wct-workspace-export" data-wct-analytics-export>Export CSV</button></div>');
    html+='<div class="wct-filterbar">'+[7,30,90].map(function(n){return '<button type="button" class="wct-filter-chip '+(analyticsRange===n?'active':'')+'" data-wct-analytics-range="'+n+'">'+n+'D</button>';}).join('')+'<span class="wct-mini-pill">Periode '+analyticsRange+' hari</span></div>';
    html+='<div class="wct-analytics-kpis"><div class="wct-analytics-kpi"><small>Tasks Completed</small><strong>'+done.length+'</strong><span>Action berstatus selesai</span></div><div class="wct-analytics-kpi"><small>Progress Updates</small><strong>'+ll.length+'</strong><span>Catatan update pada periode</span></div><div class="wct-analytics-kpi"><small>On-time Delivery</small><strong>'+rate+'%</strong><span>'+onTime.length+' dari '+eligibleDone.length+' Action dengan target</span></div><div class="wct-analytics-kpi"><small>Avg. Cycle Time</small><strong>'+avg+'</strong><span>Hari dari dibuat hingga selesai</span></div></div>';
    html+='<div class="wct-analytics-grid">'+panel('Throughput','Jumlah Progress Update per hari · periode berjalan dibanding periode sebelumnya',throughput,'<span class="wct-mini-pill">'+ll.length+' Update</span>')+panel('Case Distribution by HUB','Distribusi Case berdasarkan HUB · pengganti Time by Project',donut,'<span class="wct-mini-pill">'+hubRows.length+' HUB</span>')+'</div>';
    html+='<div class="wct-analytics-grid">'+panel('Activity','Heatmap aktivitas Progress Update · 20 minggu terakhir','<div class="wct-heatmap">'+heat+'</div><div class="wct-chart-legend" style="justify-content:flex-end;margin-top:10px"><span>Less</span>'+['#EFF3F8','#D9E7F9','#A8C8F0','#6F9EDD','#2864C7'].map(function(c){return '<i style="background:'+c+'"></i>';}).join('')+'<span>More</span></div>')+panel('Top Contributors','Anggota dengan jumlah update terbanyak',contributors.length?'<div>'+contributors.slice(0,6).map(function(x,i){return '<div class="wct-contributor"><span class="wct-contributor-rank">#'+(i+1)+'</span><div><strong>'+esc(x.p.full_name||x.p.login_id||'Anggota')+'</strong><small>'+esc(x.p.role||'Member')+'</small></div><b>'+x.n+'</b></div>';}).join('')+'</div>':'<div class="wct-empty">Belum ada aktivitas pada periode ini.</div>')+'</div>';
    var root=$('pageContent');if(root)root.innerHTML=html;
  }
  function isAdminSafe(){try{return String(me().role||'').toLowerCase()==='admin';}catch(e){return false;}}
  function isCoordinatorSafe(){try{return typeof isCoordinator==='function'?isCoordinator():['admin','coordinator'].indexOf(String(me().role||''))>=0;}catch(e){return ['admin','coordinator'].indexOf(String(me().role||''))>=0;}}
  renderWorkspacePage=function(page){if(page==='tasks')renderTasks();else if(page==='team')renderTeam();else if(page==='calendar')renderCalendar();else if(page==='analytics')renderAnalytics();else renderDashboard();};

  function addNav(){
    var nav=document.querySelector('.sidebar .nav')||document.querySelector('.sidebar nav')||document.querySelector('.sidebar');
    if(!nav)return false;
    if(nav.querySelector('[data-wct-workspace-page="tasks"]'))return true;
    var dashboard=Array.from(nav.querySelectorAll('button')).find(function(b){return /dashboard/i.test(b.textContent||'');});
    var group=document.createElement('div');group.className='nav-label wct-workspace-nav-label';group.textContent='WORK MANAGEMENT';
    var wrap=document.createElement('div');wrap.className='wct-workspace-nav';
    [['tasks','Tasks','list'],['team','Team','team'],['calendar','Calendar','calendar'],['analytics','Analytics','chart']].forEach(function(x){var b=document.createElement('button');b.type='button';b.className='wct-workspace-nav-button';b.dataset.wctWorkspacePage=x[0];b.innerHTML='<span class="wct-nav-icon">'+icon(x[2])+'</span><span>'+x[1]+'</span>';wrap.appendChild(b);});
    if(dashboard&&dashboard.parentNode===nav){dashboard.parentNode.insertBefore(group,dashboard.nextSibling);group.after(wrap);}
    else{nav.appendChild(group);nav.appendChild(wrap);}
    return true;
  }
  var preferredNavButton=null;
  var navSyncBusy=false;
  function enforceOneActiveNav(){
    if(navSyncBusy||!preferredNavButton)return;
    navSyncBusy=true;
    document.querySelectorAll('.sidebar button,.sidebar a').forEach(function(button){
      var shouldBeActive=button===preferredNavButton;
      var isActive=button.classList.contains('active');
      if(shouldBeActive!==isActive)button.classList.toggle('active',shouldBeActive);
    });
    navSyncBusy=false;
  }
  function setActiveNav(page, nativeButton){
    var custom=Array.from(document.querySelectorAll('[data-wct-workspace-page]')).find(function(button){return button.dataset.wctWorkspacePage===page;});
    var labels={
      dashboard:/^dashboard\b/i,
      cases:/case monitoring/i,
      meeting:/weekly meeting/i,
      weeklymeeting:/weekly meeting/i,
      reports:/reports\s*&?\s*archive|reports|archive/i,
      settings:/pengaturan|settings/i,
      users:/manajemen pengguna|user management/i
    };
    var matcher=labels[page];
    var nativeTarget=nativeButton||Array.from(document.querySelectorAll('.sidebar button')).find(function(button){return matcher&&matcher.test((button.textContent||'').trim());});
    preferredNavButton=nativeTarget||custom||null;
    enforceOneActiveNav();
  }
  function installNavigationSync(){
    if(window.__wctNavigationSyncInstalled)return;
    window.__wctNavigationSyncInstalled=true;
    var sidebar=document.querySelector('#sidebar')||document.querySelector('.sidebar');
    if(sidebar){
      var observer=new MutationObserver(function(){enforceOneActiveNav();});
      observer.observe(sidebar,{subtree:true,attributes:true,attributeFilter:['class']});
      var initial=sidebar.querySelector('button.active,a.active');
      if(initial){preferredNavButton=initial;enforceOneActiveNav();}
    }
    if(typeof window.navigate==='function'&&!window.navigate.__wctNavigationWrapped){
      var originalNavigate=window.navigate;
      var wrappedNavigate=function(page){
        window.wctWorkspaceRoute=null;
        var result=originalNavigate.apply(this,arguments);
        setActiveNav(page==='meeting'?'meeting':page);
        var labels={dashboard:'Dashboard',cases:'Case Monitoring',meeting:'Weekly Meeting',reports:'Reports & Archive',settings:'Pengaturan',users:'Manajemen Pengguna'};
        setWorkspaceBreadcrumb(labels[page]||page);
        return result;
      };
      wrappedNavigate.__wctNavigationWrapped=true;
      window.navigate=wrappedNavigate;
    }
  }
  function closeMobileSidebar(){
    var isMobile=window.matchMedia
      ? window.matchMedia('(max-width: 760px)').matches
      : window.innerWidth<=760;
    if(!isMobile)return;
    var sidebar=document.getElementById('sidebar')||document.querySelector('.sidebar');
    if(sidebar)sidebar.classList.remove('open');
  }
  function setWorkspaceBreadcrumb(label){
    var crumb=document.getElementById('crumb')||document.querySelector('.topbar .crumb')||document.querySelector('.crumb');
    if(!crumb)return;
    var safeLabel=String(label||'Dashboard').replace(/[&<>"']/g,function(ch){return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]);});
    crumb.textContent=safeLabel;
  }
  function go(page){
    window.wctWorkspaceRoute=page;
    try{currentPage=page;}catch(ignore){}
    window.scrollTo({top:0,behavior:'smooth'});
    setActiveNav(page);
    setWorkspaceBreadcrumb(({tasks:'Tasks',team:'Team',calendar:'Calendar',analytics:'Analytics',dashboard:'Dashboard'})[page]||page);
    renderWorkspacePage(page);
    closeMobileSidebar();
  }
  window.wctWorkspaceNavigate=go;
  var originalRenderPage=window.renderPage;
  if(typeof originalRenderPage==='function'&&!originalRenderPage.__wctWorkspaceWrapped){
    var wrapped=function(){if(window.wctWorkspaceRoute){renderWorkspacePage(window.wctWorkspaceRoute);return;}return originalRenderPage.apply(this,arguments);};
    wrapped.__wctWorkspaceWrapped=true;window.renderPage=wrapped;
  }

  function applyTheme(theme){
    var themes={Forest:'#2F806B',Ocean:'#2864C7',Plum:'#7651A6',Ember:'#D9773D'};
    var color=themes[theme]||themes.Ocean;
    var style=$('wct-user-theme');if(!style){style=document.createElement('style');style.id='wct-user-theme';document.head.appendChild(style);}
    style.textContent=':root{--wct-workspace-accent:'+color+'} .nav button.active,.btn-primary,.wct-workspace-kpi:first-child,.wct-gauge{--theme-accent:'+color+'} .nav button.active,.btn-primary{background:'+color+'!important;border-color:'+color+'!important} .wct-kicker,.eyebrow,.wct-panel-action{color:'+color+'!important} .wct-progress-bar span{background:linear-gradient(90deg,'+color+',#8CB4E5)!important} .wct-gauge{background:conic-gradient('+color+' var(--wct-gauge-value,0%),#E7EEF7 0)!important} .wct-page-icon{color:'+color+'!important}';
    try{localStorage.setItem('wctAppearanceTheme',theme);}catch(e){}
  }
  function savedTheme(){try{return localStorage.getItem('wctAppearanceTheme')||'Ocean';}catch(e){return 'Ocean';}}
  function savedPrefs(){try{return JSON.parse(localStorage.getItem('wctNotificationPrefs')||'{}');}catch(e){return {};}}
  function getWeekStart(){return savedPrefs().weekStart==='Sunday'?'Sunday':'Monday';}
  function savePrefs(key,value){var prefs=savedPrefs();prefs[key]=!!value;try{localStorage.setItem('wctNotificationPrefs',JSON.stringify(prefs));}catch(e){}}
  function addSettingsPanel(){
    var existing=$('wct-workspace-preferences');
    if(existing)existing.remove();
  }
  var settingsObserver=new MutationObserver(function(){addNav();if(!window.wctWorkspaceRoute)addSettingsPanel();});
  function init(){
    addNav();installNavigationSync();applyTheme(savedTheme());addSettingsPanel();
    if($('pageContent'))settingsObserver.observe($('pageContent'),{childList:true,subtree:true});
  }

  document.addEventListener('click',function(event){
    // Close the mobile drawer for every sidebar route, regardless of which
    // module owns the page navigation (native menu or workspace module).
    var sidebarItem=event.target.closest&&event.target.closest('.sidebar .nav button,.sidebar .nav a,.sidebar [data-wct-workspace-page]');
    if(sidebarItem)closeMobileSidebar();

    var nav=event.target.closest&&event.target.closest('[data-wct-workspace-page]');
    if(nav){event.preventDefault();event.stopImmediatePropagation();go(nav.dataset.wctWorkspacePage);return;}
    var native=event.target.closest&&event.target.closest('.sidebar .nav button');
    if(native&&!native.hasAttribute('data-wct-workspace-page')){
      window.wctWorkspaceRoute=null;
      var nativeLabel=(native.textContent||'').trim();
      setActiveNav('native',native);
      setWorkspaceBreadcrumb(nativeLabel);
      if(/pengaturan|settings/i.test(nativeLabel)){
        window.setTimeout(function(){
          if(typeof window.wctRenderAdminSettings==='function'){
            window.wctRenderAdminSettings();
          }
        },140);
      }
    }
    var t=event.target.closest&&event.target.closest('[data-wct-task-filter]');if(t){activeTaskFilter=t.dataset.wctTaskFilter;renderTasks();return;}
    if(event.target.closest&&event.target.closest('[data-wct-clear-assignee]')){teamAssignee='';renderTasks();return;}
    var openCase=event.target.closest&&event.target.closest('[data-wct-open-case]');if(openCase){if(window.openCaseDetail)window.openCaseDetail(openCase.dataset.wctOpenCase);return;}
    var progress=event.target.closest&&event.target.closest('[data-wct-progress-action]');if(progress){if(window.openActionProgressForm)window.openActionProgressForm(progress.dataset.wctProgressAction);return;}
    var move=event.target.closest&&event.target.closest('[data-wct-calendar-move]');if(move){calendarCursor.setMonth(calendarCursor.getMonth()+Number(move.dataset.wctCalendarMove));renderCalendar();return;}
    if(event.target.closest&&event.target.closest('[data-wct-calendar-today]')){calendarCursor=new Date(today.getFullYear(),today.getMonth(),1);calendarSelected=todayKey;renderCalendar();return;}
    var day=event.target.closest&&event.target.closest('[data-wct-calendar-date]');if(day){calendarSelected=day.dataset.wctCalendarDate;renderCalendar();return;}
    var mine=event.target.closest&&event.target.closest('[data-wct-member-tasks]');if(mine){teamAssignee=mine.dataset.wctMemberTasks;activeTaskFilter='all';go('tasks');return;}
    var profile=event.target.closest&&event.target.closest('[data-wct-member-detail]');if(profile){var p=person(profile.dataset.wctMemberDetail);if(p&&window.openModal)window.openModal('<div class="modal-head"><div><div class="eyebrow">TEAM PROFILE</div><h2>'+esc(p.full_name||p.login_id||'Anggota')+'</h2></div><button class="close" type="button" onclick="closeModal()">×</button></div><div class="modal-body"><div class="wct-member-stats"><div class="wct-member-stat"><strong>'+esc(p.role||'—')+'</strong><small>Role</small></div><div class="wct-member-stat"><strong>'+esc(p.hub_code||p.area_name||'—')+'</strong><small>HUB / Area</small></div></div><p>Aktivitas anggota ditampilkan berdasarkan Action dan Progress Update yang tercatat di sistem.</p></div>',true);return;}
    var create=event.target.closest&&event.target.closest('[data-wct-create-case]');if(create){if(window.openCaseForm)window.openCaseForm();return;}
    var newAction=event.target.closest&&event.target.closest('[data-wct-new-action]');if(newAction){var open=cases().filter(function(c){return c.status!=='closed';});if(!open.length){if(window.toast)window.toast('Buat Case terlebih dahulu sebelum menambahkan Action.');return;}var select='<div class="modal-head"><div><div class="eyebrow">NEW PICAPA ACTION</div><h2>Pilih Case</h2><p class="sub">Action harus terhubung ke Case.</p></div><button class="close" type="button" onclick="closeModal()">×</button></div><div class="modal-body"><div class="field"><label>Case</label><select id="wct-new-action-case">'+open.map(function(c){return '<option value="'+esc(c.id)+'">'+esc(c.case_code)+' · '+esc(c.title)+'</option>';}).join('')+'</select></div><div style="display:flex;gap:8px;margin-top:14px"><button type="button" class="btn btn-primary" data-wct-new-action-kind="'+newAction.dataset.wctNewAction+'">Lanjut Corrective</button><button type="button" class="btn" data-wct-new-action-kind="preventive">Lanjut Preventive</button></div></div>';window.openModal(select,true);return;}
    var kind=event.target.closest&&event.target.closest('[data-wct-new-action-kind]');if(kind){var caseId=$('wct-new-action-case')&&$('wct-new-action-case').value;var type=kind.dataset.wctNewActionKind; if(window.closeModal)window.closeModal();if(window.openActionForm&&caseId)window.openActionForm(caseId,type);return;}
    var goTeam=event.target.closest&&event.target.closest('[data-wct-go]');if(goTeam){go(goTeam.dataset.wctGo);return;}
    var nativePage=event.target.closest&&event.target.closest('[data-wct-open-native]');if(nativePage){var b=Array.from(document.querySelectorAll('.sidebar .nav button')).find(function(x){return /case monitoring/i.test(x.textContent||'');});if(b)b.click();return;}
    var range=event.target.closest&&event.target.closest('[data-wct-analytics-range]');if(range){analyticsRange=Number(range.dataset.wctAnalyticsRange)||30;renderAnalytics();return;}
    var exp=event.target.closest&&event.target.closest('[data-wct-analytics-export]');if(exp){var rows=[['KPI','Value'],['Total Case',cases().length],['Closed Case',cases().filter(function(c){return c.status==='closed';}).length],['Running Case',cases().filter(function(c){return c.status==='in_progress';}).length],['Progress Updates',rangeLogs().length],['Active PIC',profiles().filter(function(p){return p.active!==false&&p.deleted!==true;}).length]];var csv='\uFEFF'+rows.map(function(r){return r.map(function(v){return '"'+String(v).replace(/"/g,'""')+'"';}).join(';');}).join('\r\n');var a=document.createElement('a'),u=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.href=u;a.download='WCT_Analytics_'+todayKey+'.csv';a.click();URL.revokeObjectURL(u);return;}
    var theme=event.target.closest&&event.target.closest('[data-wct-theme]');if(theme){document.querySelectorAll('[data-wct-theme]').forEach(function(b){b.classList.toggle('active',b===theme);});applyTheme(theme.dataset.wctTheme);return;}
  },true);

  document.addEventListener('click',function(event){
    var invite=event.target.closest&&event.target.closest('[data-wct-invite-member]');
    if(invite){
      if(!isAdminSafe()){if(window.toast)window.toast('Hanya Admin yang dapat mengundang anggota.');return;}
      var inviteHtml='<div class="modal-head"><div><div class="eyebrow">TEAM / INVITE MEMBER</div><h2>Buat Akun Anggota</h2><p class="sub">Buat akun login untuk anggota tim. ID dan password dikelola oleh Admin.</p></div><button type="button" class="close" onclick="closeModal()">×</button></div>'+
        '<form onsubmit="submitUser(event)"><div class="modal-body"><div class="form-grid">'+
        '<div class="field"><label>Nama lengkap *</label><input name="full_name" required maxlength="120"></div>'+
        '<div class="field"><label>ID Pengguna *</label><input name="login_id" required minlength="3" maxlength="32" autocomplete="off"></div>'+
        '<div class="field"><label>Role *</label><select name="role" required><option value="coordinator">Koordinator</option><option value="member">PIC / Member</option><option value="viewer">Viewer</option><option value="admin">Admin</option></select></div>'+
        '<div class="field"><label>HUB / Area</label><input name="area_name" placeholder="Contoh: MKS / BPP / MND"></div>'+
        '<div class="field"><label>Employee ID</label><input name="employee_id" placeholder="Opsional"></div>'+
        '<div class="field"><label>Password awal *</label><input name="password" type="password" required minlength="8" maxlength="128" autocomplete="new-password"></div>'+
        '</div></div><div class="modal-foot"><button type="button" class="btn" onclick="closeModal()">Batal</button><button type="submit" class="btn btn-primary">Buat Akun</button></div></form>';
      if(window.openModal)window.openModal(inviteHtml,true);
      return;
    }
    var message=event.target.closest&&event.target.closest('[data-wct-member-message]');
    if(message){
      var member=person(message.dataset.wctMemberMessage);
      if(!member)return;
      var draft='Halo '+(member.full_name||'')+', saya ingin menindaklanjuti pekerjaan PICAPA yang menjadi tanggung jawabmu. Mohon berikan update progres terbaru, kendala yang dihadapi, dan rencana tindak lanjut. Terima kasih.';
      var messageHtml='<div class="modal-head"><div><div class="eyebrow">TEAM / MESSAGE</div><h2>Pesan untuk '+esc(member.full_name||'Anggota')+'</h2><p class="sub">Siapkan pesan lalu salin untuk dikirim melalui kanal komunikasi tim.</p></div><button type="button" class="close" onclick="closeModal()">×</button></div><div class="modal-body"><div class="field"><label>Draft pesan</label><textarea id="wct-message-draft" rows="5">'+esc(draft)+'</textarea></div><p class="sub">Belum tersedia chat internal; fitur ini menyiapkan dan menyalin pesan, bukan mengirimkannya.</p></div><div class="modal-foot"><button type="button" class="btn" onclick="closeModal()">Tutup</button><button type="button" class="btn btn-primary" data-wct-copy-message>Salin Pesan</button></div>';
      if(window.openModal)window.openModal(messageHtml,true);
      return;
    }
    var copyMessage=event.target.closest&&event.target.closest('[data-wct-copy-message]');
    if(copyMessage){
      var field=$('wct-message-draft'),value=field?field.value:'';
      if(navigator.clipboard&&navigator.clipboard.writeText){
        navigator.clipboard.writeText(value).then(function(){if(window.toast)window.toast('Pesan berhasil disalin.');}).catch(function(){if(field){field.select();document.execCommand('copy');if(window.toast)window.toast('Pesan disalin.');}});
      }else if(field){field.select();document.execCommand('copy');if(window.toast)window.toast('Pesan disalin.');}
      return;
    }
    var openAction=event.target.closest&&event.target.closest('[data-wct-open-action]');
    if(openAction){if(window.openUpdateForm)window.openUpdateForm(openAction.dataset.wctOpenAction);return;}
  },true);

  document.addEventListener('input',function(event){
    if(event.target.matches('[data-wct-task-search]')){taskSearch=event.target.value;var el=event.target,position=el.selectionStart;renderTasks();var next=document.querySelector('[data-wct-task-search]');if(next){next.focus();next.setSelectionRange(position,position);}return;}
    if(event.target.matches('[data-wct-team-search]')){teamSearch=event.target.value;var el2=event.target,pos=el2.selectionStart;renderTeam();var next2=document.querySelector('[data-wct-team-search]');if(next2){next2.focus();next2.setSelectionRange(pos,pos);}return;}
  });
  document.addEventListener('change',function(event){
    if(event.target.matches('[data-wct-team-role]')){teamRole=event.target.value;renderTeam();return;}
    if(event.target.matches('[data-wct-pref]')){savePrefs(event.target.dataset.wctPref,event.target.checked);}
    if(event.target.matches('[data-wct-week-start]')){savePrefs('weekStart',event.target.value);if(window.wctWorkspaceRoute==='calendar')renderCalendar();}
  });
  var draggedAction=null,taskMovePending=false;
  async function moveTaskActionStatus(actionId,nextStatus){
    var allowed=['open','in_progress','review','done'];
    if(allowed.indexOf(nextStatus)<0){toast('Status tujuan tidak valid.');return;}
    if(!isCoordinatorSafe()){toast('Hanya Admin atau Koordinator yang dapat memindahkan kartu. PIC gunakan Update Progress.');return;}
    var action=actions().find(function(item){return String(item.id)===String(actionId);});
    if(!action){toast('Action tidak ditemukan. Muat ulang papan Tasks.');return;}
    var parent=caseBy(action.case_id);
    if(!parent||parent.status==='closed'){toast('Case sudah diarsipkan. Action tidak dapat dipindahkan.');return;}
    if(action.status===nextStatus){renderTasks();return;}
    if(taskMovePending)return;
    var db=window.wctSupabase;
    if(!db||typeof db.from!=='function'){toast('Koneksi database belum tersedia.');return;}
    taskMovePending=true;
    var oldStatus=action.status;
    try{
      var result=await db.rpc('wct_move_action_status',{
        p_action_id:action.id,
        p_status:nextStatus
      });
      if(result.error)throw result.error;
      if(!result.data||result.data.ok!==true)throw new Error('Database belum mengonfirmasi perpindahan status.');
      if(typeof window.refreshData==='function')await window.refreshData();
      renderTasks();
      toast('Action dipindahkan ke '+statusLabel(nextStatus)+'.');
    }catch(error){
      action.status=oldStatus;
      renderTasks();
      console.error('Move Action status failed:',error);
      toast('Gagal memindahkan Action: '+(error&&error.message||error));
    }finally{
      taskMovePending=false;
      draggedAction=null;
    }
  }
  document.addEventListener('dragstart',function(event){
    var card=event.target.closest&&event.target.closest('[data-wct-drag-action]');
    if(!card||!event.dataTransfer)return;
    if(!isCoordinatorSafe()){event.preventDefault();toast('Hanya Admin atau Koordinator yang dapat memindahkan kartu.');return;}
    draggedAction=card.dataset.wctDragAction;
    event.dataTransfer.effectAllowed='move';
    event.dataTransfer.setData('text/plain',draggedAction);
    card.classList.add('is-dragging');
  });
  document.addEventListener('dragend',function(event){
    var card=event.target.closest&&event.target.closest('[data-wct-drag-action]');
    if(card)card.classList.remove('is-dragging');
    document.querySelectorAll('.wct-kanban-col.is-over').forEach(function(col){col.classList.remove('is-over');});
  });
  document.addEventListener('dragover',function(event){
    var col=event.target.closest&&event.target.closest('[data-wct-drop-status]');
    if(col&&isCoordinatorSafe()){event.preventDefault();if(event.dataTransfer)event.dataTransfer.dropEffect='move';col.classList.add('is-over');}
  });
  document.addEventListener('dragleave',function(event){
    var col=event.target.closest&&event.target.closest('[data-wct-drop-status]');
    if(col&&!col.contains(event.relatedTarget))col.classList.remove('is-over');
  });
  document.addEventListener('drop',function(event){
    var col=event.target.closest&&event.target.closest('[data-wct-drop-status]');
    if(!col||!isCoordinatorSafe())return;
    event.preventDefault();
    col.classList.remove('is-over');
    var id=(event.dataTransfer&&event.dataTransfer.getData('text/plain'))||draggedAction;
    var nextStatus=col.dataset.wctDropStatus;
    if(!id||!nextStatus)return;
    void moveTaskActionStatus(id,nextStatus);
  });
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
`;

  var out = html.replace('</body>', '<style id="wct-workspace-modules-style">' + css + '</style><script id="wct-workspace-modules">' + runtime + '</script></body>');
  return out;
};
