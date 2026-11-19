// Irregular verbs: pattern blocks, multiple choice at first, typing after that.
let gIrr=false;
const alts=s=>{const out=[];s.split('/').forEach(p=>{const m=p.match(/^(.*)\((.)\)$/);if(m){out.push(m[1]);out.push(m[1]+m[2]);}else out.push(p);});return out;};
const irrPat=r=>{const[a,b,c]=[r[0],alts(r[1])[0],alts(r[2])[0]];return a===b&&b===c?'AAA':a===c?'ABA':a===b?'AAB':b===c?'ABB':'ABC';};
const PATN={AAA:'Все три формы одинаковые (cut – cut – cut)',ABA:'V1 и V3 одинаковые (come – came – come)',AAB:'V1 и V2 одинаковые (beat – beat – beaten)',ABB:'V2 и V3 одинаковые (buy – bought – bought)',ABC:'Все три формы разные (go – went – gone)'};
function irrBlocks(){
  const g={};IRR.forEach(r=>{(g[irrPat(r)]=g[irrPat(r)]||[]).push(r);});
  const out=[];
  ['AAA','ABA','AAB','ABB','ABC'].forEach(p=>{const a=g[p]||[];for(let i=0;i<a.length;i+=8)out.push({id:p+(i/8+1),p,n:i/8+1,rows:a.slice(i,i+8)});});
  return out;
}
const irrBox=v=>(S.irr&&S.irr[v]!=null)?S.irr[v]:-1;
function renderIrr(){
  const bl=irrBlocks(),all=IRR.length,mast=IRR.filter(r=>irrBox(r[0])>=2).length;
  let h=`<div class="hub"><div class="qhead"><button class="link" id="iback">Все темы</button><span>Освоено ${mast} из ${all}</span></div>
   <div class="intro">Неправильные глаголы учатся по группам с похожей схемой. Блок на 8 глаголов занимает около 2 минут: сначала выбираешь форму из вариантов, а когда глагол освоен, вводишь её сама.</div>
   <div class="row"><button class="btn" id="inext">Следующий блок</button><button class="btn ghost" id="imix">Микс из 10 слабых</button></div>`;
  ['AAA','ABA','AAB','ABB','ABC'].forEach(p=>{
    const bs=bl.filter(b=>b.p===p);if(!bs.length)return;
    h+=`<h2>${p}: ${esc(PATN[p])}</h2><div class="modes">${bs.map(b=>{const m=b.rows.filter(r=>irrBox(r[0])>=2).length;return `<button class="mode" data-b="${b.id}"><b>Блок ${b.n}</b><span>${esc(b.rows.map(r=>r[0]).join(', '))}</span><span class="gp">${m} из ${b.rows.length}</span></button>`;}).join('')}</div>`;
  });
  h+=`<details class="fold"><summary>Таблица всех глаголов</summary><ul class="list">${IRR.map(r=>`<li class="item"><div><b>${esc(r[0])}</b> — ${esc(r[1])} — ${esc(r[2])}<div class="t">${esc(r[3])}</div></div><button class="link" data-say="${esc(r[0]+', '+alts(r[1])[0]+', '+alts(r[2])[0])}">Слушать</button></li>`).join('')}</ul></details></div>`;
  $('main').innerHTML=h;
  $('iback').onclick=()=>{gIrr=false;render();};
  $('main').querySelectorAll('[data-say]').forEach(b=>b.onclick=()=>speak(b.dataset.say));
  $('main').querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>irrSession(bl.find(x=>x.id===b.dataset.b).rows,'Блок '+b.dataset.b));
  $('inext').onclick=()=>{const b=bl.find(x=>x.rows.some(r=>irrBox(r[0])<2))||bl[0];irrSession(b.rows,'Блок '+b.id);};
  $('imix').onclick=()=>irrSession(shuffle(IRR).sort((a,b)=>irrBox(a[0])-irrBox(b[0])).slice(0,10),'Микс');
}
function irrQ(r,form){
  const[v1,v2,v3,ru,d]=r,ans=alts(form==='v2'?v2:v3),shown=form==='v2'?v2:v3;
  const label=form==='v2'?'Past Simple (V2)':'Past Participle (V3)';
  const head=`<div class="qlabel">${label}</div><div class="qtext">${esc(v1)} → ?</div><div class="qsub">${esc(ru)}</div>`;
  const expl=`<div><b>${esc(v1)} – ${esc(v2)} – ${esc(v3)}</b></div><div class="qsub">${esc(PATN[irrPat(r)])}</div><button class="link" data-say="${esc(v1+', '+alts(v2)[0]+', '+alts(v3)[0])}">Послушать</button>`;
  if(irrBox(v1)<1){
    const bad=new Set(),acc=new Set(ans);
    const reg=/e$/.test(v1)?v1+'d':/[^aeiou]y$/.test(v1)?v1.slice(0,-1)+'ied':v1+'ed';
    [v1,reg].forEach(x=>{if(!acc.has(x))bad.add(x);});
    shuffle(IRR).forEach(x=>{if(bad.size>=3)return;const c=alts(form==='v2'?x[1]:x[2])[0];if(!acc.has(c)&&c.indexOf(' ')<0)bad.add(c);});
    const opts=shuffle([ans[0],...[...bad].slice(0,3)]);
    return {kind:'mc',key:v1,opts,ai:opts.indexOf(ans[0]),prompt:head,explain:expl};
  }
  return {kind:'type',key:v1,answer:ans,show:shown,prompt:head,explain:expl};
}
function irrSession(rows,label){
  const qs=[];rows.forEach(r=>{qs.push({r,f:'v2'});qs.push({r,f:'v3'});});
  const total=qs.length;let queue=shuffle(qs),retry=[],okN=0,xp=0;const bad=new Set(),seen=new Set();
  runQuiz({auto:true,onExit:()=>render(),
    next(){if(!queue.length&&retry.length){queue=retry;retry=[];}const x=queue.shift();if(!x)return null;const q=irrQ(x.r,x.f);q.x=x;return q;},
    progress:()=>`${label}: ${okN} из ${total}`,
    onAnswer(q,ok){const x=q.x,id=x.r[0]+x.f,first=!seen.has(id);seen.add(id);
      if(ok){if(first){okN++;xp+=3;}}else{bad.add(x.r[0]);if(first)retry.push(x);}save();},
    onFinish(){
      S.irr=S.irr||{};
      rows.forEach(r=>{const b=Math.max(0,irrBox(r[0]));S.irr[r[0]]=bad.has(r[0])?0:Math.min(3,b+1);});
      addXP(xp);save();
      summary('Блок завершён',`<div class="qsub">С первой попытки верно: ${okN} из ${total}. +${xp} XP.${bad.size?' Повтори: '+[...bad].join(', ')+'.':''}</div>`,[{t:'Дальше',f:()=>{const bl=irrBlocks(),b=bl.find(x=>x.rows.some(r=>irrBox(r[0])<2))||bl[0];irrSession(b.rows,'Блок '+b.id);}},{t:'К блокам',ghost:true,f:()=>render()}]);}});
}
