// Router and startup.
let view='cards',mode=null,cleanup=null;
const MODES={flash:startFlash,learn:startLearn,tf:startTF,gap:startGap,match:startMatch,gravity:startGravity};

function go(v,m){
  view=v;mode=m||null;
  gTopic=null;gMap=false;gIrr=false;lexView=null;wbTheory=false;tplFrame=null;audMode='dict';spTopic=null;spellMode=null;
  render();
}
function renderStats(){
  const k=ROWS.filter(r=>S.marks[r.w]==='k').length,u=ROWS.filter(r=>S.marks[r.w]==='u').length,n=ROWS.length;
  $('stats').innerHTML=`<span class="pill">Всего ${n}</span><span class="pill yes">Знаю ${k}</span><span class="pill no">Не знаю ${u}</span><span class="pill">Осталось ${n-k-u}</span>`;
  $('bar').innerHTML=`<i class="b-yes" style="width:${k/n*100}%"></i><i class="b-no" style="width:${u/n*100}%"></i>`;
}
function render(){
  if(cleanup){cleanup();cleanup=null;}
  keyHandler=null;
  document.querySelectorAll('#tabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.v===view));
  const showStats=view==='cards'||view==='result';
  $('stats').hidden=!showStats;$('bar').hidden=!showStats;
  if(showStats)renderStats();
  renderHud();
  if(view==='cards')renderCards();
  else if(view==='result')renderResult();
  else if(view==='gram')renderGrammar();
  else if(view==='sp')renderSpeak();
  else if(view==='lex')renderLex();
  else if(view==='ielts')renderIelts();
  else if(view==='aud')renderAudio();
  else if(view==='tpl')renderTpl();
  else if(view==='wr')renderWriting();
  else if(view==='spell')renderSpell();
  else if(mode&&MODES[mode])MODES[mode]();
  else renderHub();
  if(typeof wbkSync==='function')wbkSync();
}
document.querySelectorAll('#tabs button').forEach(b=>b.onclick=()=>go(b.dataset.v,null));
document.addEventListener('keydown',e=>{
  if(['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return;
  if(keyHandler)keyHandler(e);
});
render();
