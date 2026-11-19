// Grammar: world map of topic clusters, short play sessions, spaced repetition, textbook coverage map.
let gTopic=null,gMap=false;
const G_DAYS=[0,1,3,7,14];
const cById=Object.fromEntries(GR2.map(c=>[c.id,c]));
const gKey=(c,i)=>c.id+':'+i;
const gItems=c=>c.q.map((q,i)=>({c,i,q,key:gKey(c,i)}));
const gBox=key=>S.g2&&S.g2[key]?S.g2[key].b:-1;
const dayAdd=n=>dayStr(Date.now()+n*864e5);
function gAll(){const a=[];GR2.forEach(c=>a.push(...gItems(c)));return a;}
function gDue(){const t=dayStr(Date.now());return gAll().filter(x=>S.g2&&S.g2[x.key]&&S.g2[x.key].d<=t);}
function gMastered(c){return gItems(c).filter(x=>gBox(x.key)>=2).length;}
function gStars(c){const f=gMastered(c)/c.q.length;return f>=1?3:f>=.7?2:f>=.4?1:0;}
function gSet(key,ok){
  S.g2=S.g2||{};
  const b=Math.max(0,gBox(key));
  const nb=ok?Math.min(4,b+1):0;
  S.g2[key]={b:nb,d:dayAdd(ok?G_DAYS[nb]:0)};
}

function renderGrammar(){
  if(gIrr)return renderIrr();
  if(gMap)return renderMap();
  if(gTopic)return renderCluster(gTopic);
  const due=gDue().length,all=gAll(),mast=all.filter(x=>gBox(x.key)>=2).length;
  let h=`<div class="hub">
    <div class="note">Тут только формулы и тренировка. Каждая тема собрана из нескольких юнитов Murphy и разделов Swan. Вопросы, на которых ошиблась, возвращаются раньше, верные — через 1, 3, 7 и 14 дней. Освоено вопросов: ${mast} из ${all.length}.</div>
    <div class="row"><button class="btn" id="gdue"${due?'':' disabled'}>Повторить сегодня (${due})</button><button class="btn ghost" id="gmix">Микс из 10</button><button class="btn ghost" id="gmap">Где это в учебниках</button></div>
    <div class="row"><button class="btn" id="gmetro">🚇 Блок на 2 минуты (${Object.keys(S.gb||{}).length} из ${allBlocks().length} пройдено)</button><button class="btn ghost" id="girr">Неправильные глаголы</button></div>
    <div class="row"><button class="btn" id="gex">📘 Упражнение как в учебнике (${Object.keys(S.gx||{}).length} из ${allEx().length} пройдено)</button></div>`;
  WORLDS.forEach(w=>{
    h+=`<h2>${esc(w.n)}</h2><div class="modes">${w.ids.map(id=>{
      const c=cById[id],m=gMastered(c),s=gStars(c);
      return `<button class="mode" data-c="${id}"><b>${esc(c.t)}</b><span>Освоено ${m} из ${c.q.length}</span><span class="gp">${'★'.repeat(s)}${'☆'.repeat(3-s)}</span></button>`;}).join('')}</div>`;
  });
  h+='</div>';
  $('main').innerHTML=h;
  $('main').querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{gTopic=b.dataset.c;render();});
  $('gdue').onclick=()=>session(shuffle(gDue()).slice(0,12),'Повторение');
  $('gmix').onclick=()=>session(shuffle(all).slice(0,10),'Микс');
  $('gmap').onclick=()=>{gMap=true;render();};
  $('gmetro').onclick=metro;$('gex').onclick=nextEx;$('girr').onclick=()=>{gIrr=true;render();};
}

function tlSvg(it){
  const X=p=>20+p*6,W=640,H=124,Y=70;let s=`<svg viewBox="0 0 ${W} ${H}" class="tl" role="img" aria-label="Временная шкала"><line x1="10" y1="${Y}" x2="630" y2="${Y}" class="ax"/><line x1="${X(50)}" y1="${Y-34}" x2="${X(50)}" y2="${Y+22}" class="nw"/><text x="${X(50)}" y="${Y+38}" class="lb" text-anchor="middle">сейчас</text><text x="16" y="${H-4}" class="lb dim">← прошлое</text><text x="624" y="${H-4}" class="lb dim" text-anchor="end">будущее →</text>`;
  it.forEach((x,i)=>{
    const up=i%2?30:44;
    if(x[0]==='d')s+=`<circle cx="${X(x[1])}" cy="${Y}" r="7" class="dt"/><text x="${X(x[1])}" y="${Y-up+(i%2?0:-2)}" class="lb" text-anchor="middle">${esc(x[2])}</text>`;
    else{const x1=X(x[1]),x2=x[0]==='a'?X(50):X(x[2]),lab=x[0]==='a'?x[2]:x[3];s+=`<rect x="${x1}" y="${Y-9}" width="${x2-x1}" height="18" rx="9" class="sp"/><text x="${(x1+x2)/2}" y="${Y-18}" class="lb" text-anchor="middle">${esc(lab)}</text>`;}
  });
  return s+'</svg>';
}
function fmHtml(f){
  return f.map(r=>`<div class="fm"><b class="sg s${r[0]==='+'?'p':r[0]==='−'?'m':r[0]==='?'?'q':'n'}">${esc(r[0]||'•')}</b><span>${r[1].split(' + ').map(t=>`<code>${esc(t)}</code>`).join('<i>+</i>')}</span></div>`).join('');
}
function theoryHtml(c){
  const t=TH[c.id];
  if(!t)return `<div class="rule"><ul>${c.f.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`;
  return `<div class="intro">${esc(t.intro)}</div>`+t.b.map(b=>`<section class="th"><h3><span class="em">${b.e}</span>${esc(b.h)}</h3>
    ${b.f&&b.f.length?`<div class="fms">${fmHtml(b.f)}</div>`:''}
    <p class="why">${esc(b.why)}</p>
    ${b.m?`<div class="mk"><span>Слова-маркеры:</span>${b.m.map(x=>`<em>${esc(x)}</em>`).join('')}</div>`:''}
    ${b.tl?tlSvg(b.tl):''}
    <div class="exs">${b.ex.map(x=>`<div class="ex"><span class="ee">${x[0]}</span><div><button class="say" data-say="${esc(x[1])}" type="button">${esc(x[1])}</button><i>${esc(x[2])}</i></div></div>`).join('')}</div>
    ${b.w?`<div class="warn">⚠️ ${esc(b.w)}</div>`:''}</section>`).join('');
}
function renderCluster(id){
  const c=cById[id],items=gItems(c);
  $('main').innerHTML=`<div class="hub"><div class="qhead"><button class="link" id="gback">Все темы</button><span>Освоено ${gMastered(c)} из ${c.q.length}</span></div>
    <div class="note">Всего в теме ${c.q.length+exList(c).length*6} готовых заданий: ${c.q.length} быстрых вопросов + ${exList(c).length*6} в упражнениях как в учебнике.</div>
    <div class="qcard"><div class="qtext">${esc(c.t)}</div><div class="qsub">${refLine(c)}</div></div>
    <div class="row"><button class="btn" id="gplay">Играть (8 вопросов)</button><button class="btn ghost" id="gall">Все вопросы темы (${c.q.length})</button></div>
    <div class="note">Короткие блоки по 5 вопросов</div><div class="row">${blocksOf(c).map(b=>`<button class="btn ghost" data-bk="${b.key}">Блок ${b.n}${(S.gb&&b.key in S.gb)?' · '+S.gb[b.key]+'/'+b.items.length:''}</button>`).join('')}</div>
    ${exList(c).length?`<div class="note">Упражнения как в учебнике: ${exList(c).length} блока по 6 пунктов (${exList(c).length*6} заданий). Они не зависят от Claude и работают без интернета.</div><div class="exl">${exList(c).map(e=>`<button class="btn ghost" data-ex="${e.key}">${esc(e.h.length>56?e.h.slice(0,54)+'…':e.h)}${(S.gx&&e.key in S.gx)?' · '+S.gx[e.key]+'/'+e.items.length:''}</button>`).join('')}</div>`:''}
    ${theoryHtml(c)}
    <div class="row"><button class="btn" id="gplay2">Теперь практика</button><button class="btn ghost" id="gmore">✨ Ещё 8 заданий от Claude</button></div><div id="gmoreout"></div></div>`;
  $('main').querySelectorAll('[data-say]').forEach(b=>b.onclick=()=>speak(b.dataset.say));
  $('gback').onclick=()=>{gTopic=null;render();};
  const play=()=>{
    const t=dayStr(Date.now());
    const score=x=>{const b=gBox(x.key);if(b<0)return 1+Math.random();const due=S.g2[x.key].d<=t;return (due?0:5)+b+Math.random();};
    session(items.slice().sort((a,b)=>score(a)-score(b)).slice(0,8),c.t);
  };
  $('gplay').onclick=play;$('gplay2').onclick=play;
  $('gmore').onclick=()=>genGrammar(c,$('gmoreout'),$('gmore'));
  $('main').querySelectorAll('[data-ex]').forEach(el=>el.onclick=()=>runEx(exList(c).find(e=>e.key===el.dataset.ex)));
  $('main').querySelectorAll('[data-bk]').forEach(el=>el.onclick=()=>runBlock(blocksOf(c).find(b=>b.key===el.dataset.bk)));
  $('gall').onclick=()=>session(shuffle(items),c.t);
}

function refLine(c){
  const m=c.ref.m.length?'Murphy: '+c.ref.m.map(r=>r[0]===r[1]?r[0]:r[0]+'–'+r[1]).join(', ')+' · ':'';
  return `${m}Swan: ${esc(c.ref.s)} · Рус. учебник: ${esc(c.ref.r)}`;
}

function renderMap(){
  const seen=new Set();
  GR2.forEach(c=>c.ref.m.forEach(r=>{for(let u=r[0];u<=r[1];u++)seen.add(u);}));
  const miss=[];for(let u=1;u<=145;u++)if(!seen.has(u))miss.push(u);
  $('main').innerHTML=`<div class="hub"><div class="qhead"><button class="link" id="gback">Все темы</button><span>Murphy: ${seen.size} из 145 юнитов</span></div>
    <div class="note">Каждый юнит Murphy и раздел Swan входит в одну из тем ниже. Если нужна теория, открой указанные юниты. Русский учебник даёт общую теорию по частям речи и синтаксису, а здесь она сведена к формулам.${miss.length?' Не вошли юниты: '+miss.join(', ')+'.':''}</div>
    <ul class="list">${GR2.map(c=>`<li class="item"><div><b>${esc(c.t)}</b><div class="t">${refLine(c)}</div></div></li>`).join('')}</ul></div>`;
  $('gback').onclick=()=>{gMap=false;render();};
}

function toQ(x){
  const q=x.q,label=`<div class="qlabel">${esc(x.h||x.c.t)}</div>`,why=`<div>${esc(q[q.length-1])}</div>`;
  if(q[0]==='m'||q[0]==='f'){
    const corr=q[0]==='m'?q[2]:q[1],opts=q[0]==='m'?q.slice(2,6):q.slice(1,5);
    const sh=shuffle(opts);
    const stem=q[0]==='m'?q[1]:'Выбери верное предложение';
    return {kind:'mc',key:x.key,prompt:`${label}<div class="qtext">${esc(stem)}</div>`,opts:sh,ai:sh.indexOf(corr),explain:why};
  }
  if(q[0]==='t'){
    const ans=q[2].split('|');
    return {kind:'type',key:x.key,prompt:`${label}<div class="qtext">${esc(q[1])}</div>`,answer:ans,show:ans[0],explain:why};
  }
  return {kind:'order',key:x.key,prompt:`${label}<div class="qtext">Составь предложение</div>`,w:q[1].split(' '),answer:[q[1]],ru:q[2],show:q[1],explain:why};
}

function session(items,label,opt){
  if(!items.length)return;
  const total=items.length;let queue=items.slice(),retry=[],first={},okN=0,xp=0;
  runQuiz({
    auto:true,
    onExit:()=>render(),
    next(){
      if(!queue.length&&retry.length){queue=retry;retry=[];}
      if(!queue.length)return null;
      const x=queue.shift();const q=toQ(x);q.item=x;return q;
    },
    progress:()=>`${label}: ${okN} / ${total}`,
    onAnswer(q,ok){
      const x=q.item,isFirst=!(x.key in first);
      if(isFirst){if(!x.h)gSet(x.key,ok);first[x.key]=ok;}
      if(ok){okN++;xp+=isFirst?6:1;}else if(isFirst)retry.push(x);
      save();
    },
    onFinish(){
      addXP(xp);
      const firstOk=Object.values(first).filter(Boolean).length;
      if(opt&&opt.key){const st=opt.ex?'gx':'gb';S[st]=S[st]||{};S[st][opt.key]=firstOk;save();}
      summary('Сессия завершена',`<div class="qsub">С первой попытки верно: ${firstOk} из ${total}. Получено ${xp} XP.</div>${firstOk<total?'<div class="qsub">Вопросы с ошибками вернутся в повторение уже сегодня.</div>':''}`,
        [...(opt&&opt.key?[{t:opt.ex?'Следующее упражнение':'Следующий блок',f:()=>opt.ex?nextEx():metro()}]:[]),{t:'Ещё сессию',f:()=>{const c=items[0].c;if(label==='Повторение'||label==='Микс')go('gram',null);else{gTopic=c.id;render();}}},{t:'К темам',ghost:true,f:()=>{gTopic=null;render();}}]);
    }
  });
}

/* ---------- Quick blocks (5 questions, about 2 minutes) ---------- */
const BSIZE=5;
function blocksOf(c){const a=gItems(c),out=[];for(let i=0;i<a.length;i+=BSIZE)out.push({key:c.id+':b'+(i/BSIZE+1),n:i/BSIZE+1,items:a.slice(i,i+BSIZE),c});return out;}
function allBlocks(){const out=[];WORLDS.forEach(w=>w.ids.forEach(id=>out.push(...blocksOf(cById[id]))));return out;}
function runBlock(b){session(b.items,b.c.t+' · блок '+b.n,{key:b.key});}
function metro(){
  const bl=allBlocks(),gb=S.gb||{};
  const b=bl.find(x=>!(x.key in gb))||bl.slice().sort((x,y)=>(gb[x.key]||0)-(gb[y.key]||0))[0];
  runBlock(b);
}

/* ---------- Textbook-style exercises ---------- */
function exList(c){return (EXR[c.id]||[]).map((e,ei)=>({key:c.id+':x'+ei,c,ei,h:e.h,items:e.q.map((q,i)=>({c,i,q,key:c.id+':x'+ei+':'+i,h:e.h}))}));}
function allEx(){const out=[];WORLDS.forEach(w=>w.ids.forEach(id=>out.push(...exList(cById[id]))));return out;}
function runEx(e){session(e.items,e.c.t,{key:e.key,ex:true});}
function nextEx(){
  const l=allEx(),gx=S.gx||{};
  runEx(l.find(x=>!(x.key in gx))||l.slice().sort((a,b)=>(gx[a.key]||0)-(gx[b.key]||0))[0]);
}
