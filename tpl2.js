// Templates tab: Advanced (8-9) folder with practice fields, Basic folder, and the side word bank.
let tplMode='adv',tplPart='p1',tplFrame=null,wbkOpen=false,wbkQ='';
const TPARTS={p1:'Speaking Part 1',p2:'Speaking Part 2',p3:'Speaking Part 3',t1:'Writing Task 1',t2:'Writing Task 2'};
function tpGet(key){S.tp=S.tp||{};return S.tp[key]||(S.tp[key]={});}
function tpQs(key,pool,lvl){const o=tpGet(key);if(!o.q)o.q=[0,1,2].map(k=>(lvl*2+k*3)%pool.length);return o;}
function renderTpl(){
  const seg=`<div class="seg"><button data-tm="adv" class="${tplMode==='adv'?'on':''}">Advanced 8–9</button><button data-tm="basic" class="${tplMode==='basic'?'on':''}">Basic</button><button data-tm="str" class="${tplMode==='str'?'on':''}">Стратегии</button></div>`;
  $('main').innerHTML=`<div class="hub">${seg}<div id="tbody"></div></div>`;
  $('main').querySelectorAll('[data-tm]').forEach(b=>b.onclick=()=>{tplMode=b.dataset.tm;tplFrame=null;strOpen=null;renderTpl();});
  if(tplMode==='basic')basicUI($('tbody'));else if(tplMode==='str')strUI($('tbody'));else advUI($('tbody'));
}
function poolOf(f,lvl){return f.t[lvl][2]||f.q;}
/* Basic: same practice layout, questions from the learner's own speaking lists */
function basicFrames(){
  if(window._bf)return window._bf;
  const byId=Object.fromEntries(ADV.p1.map(f=>[f.id,f.q]));
  const map={'Прямой ответ + причина + пример':byId.yesno.concat(byId.opinion),'Привычка и частота':byId.habit,'Предпочтение':byId.prefer,'Про прошлое':byId.change,'Если нечего сказать':byId.hypo};
  const cards=(typeof SPX!=='undefined'?SPX:[]).filter(t=>t.p2),p2=cards.map(t=>t.p2[0]),p3=[].concat(...cards.map(t=>t.p3||[]));
  return window._bf=TPL.map((s,i)=>{
    const part=i===0?'Part 1':i===1?'Part 2':'Part 3';
    const fb=i===0?byId.opinion:i===1?p2:p3;
    return {id:'b'+i,n:s.t,d:'Базовые шаблоны',part,q:fb,t:s.c.map(c=>[c.x,'',i===0?(map[c.h]||fb):fb])};
  });
}
function basicUI(box){
  if(tplFrame&&tplFrame[0]==='b')return frameUI(box,basicFrames().find(f=>f.id===tplFrame));
  box.innerHTML=`<div class="note">Базовые шаблоны (Basic): простые рамки. Для каждого есть три вопроса из твоих списков, кнопка +, поле свободной практики и банк слов сбоку.</div>
   <div class="modes">${basicFrames().map(f=>`<button class="mode" data-fr="${f.id}"><b>${esc(f.n)}</b><span>${f.t.length} шаблонов</span></button>`).join('')}</div>`;
  box.querySelectorAll('[data-fr]').forEach(b=>b.onclick=()=>{tplFrame=b.dataset.fr;renderTpl();window.scrollTo(0,0);});
}
const PNOTE={
 p1:'Рамки для Part 1 по типам вопросов из твоих списков. В каждой 8 шаблонов от уверенного уровня до самого продвинутого. К шаблону три вопроса из разных тем, + добавляет ещё, ✕ убирает, есть поле для свободной практики. Сбоку банк слов.',
 p2:'Рамки для Part 2 по типам карточек. Шаблон это 1–2 предложения-заготовки для разных кусочков монолога: открытие, детали, история, чувства, итог. В вопросах твои карточки Describe… Выбери 3–4 шаблона разных уровней и склей из них свой монолог на 2 минуты.',
 p3:'Рамки для Part 3 по типам вопросов (мнение, плюсы и минусы, причины, изменения, прогноз, ответственность, сравнение и другие). Вопросы взяты из твоих списков Part 3. Ответ из 2–3 предложений: шаблон, причина, пример.',
 t1:'Writing Task 1: шаблоны предложений для интро, overview, трендов, сравнений, долей, процессов и карт. Вместо вопросов здесь типовые задания. Пиши по 2–3 предложения по шаблону и проверяй с Claude.',
 t2:'Writing Task 2: вступления под каждый тип эссе, начало абзаца, объяснение с примером, уступка, заключение и осторожные формулировки. Вместо вопросов здесь темы эссе. Пиши абзац по шаблону и проверяй с Claude.'};
const PWM={p1:['speak','Part 1'],p2:['speak','Part 2'],p3:['speak','Part 3'],t1:['write1','Task 1'],t2:['write','Task 2']};
function advUI(box){
  const parts=`<div class="chips">${Object.entries(TPARTS).map(([k,v])=>`<button class="chip${k===tplPart?' on':''}" data-tp="${k}">${v}</button>`).join('')}</div>`;
  const fr=ADV[tplPart]||[];
  if(tplFrame){const f=fr.find(x=>x.id===tplFrame);if(f){f.part=PWM[tplPart][1];f.wm=PWM[tplPart][0];return frameUI(box,f);}tplFrame=null;}
  box.innerHTML=parts+`<div class="note">${PNOTE[tplPart]||''}</div>
   <div class="modes">${fr.map(f=>`<button class="mode" data-fr="${f.id}"><b>${esc(f.n)}</b><span>${esc(f.d)}</span></button>`).join('')}</div>`;
  bindParts(box);box.querySelectorAll('[data-fr]').forEach(b=>b.onclick=()=>{tplFrame=b.dataset.fr;renderTpl();window.scrollTo(0,0);});
}
function bindParts(box){box.querySelectorAll('[data-tp]').forEach(b=>b.onclick=()=>{tplPart=b.dataset.tp;tplFrame=null;renderTpl();});}
function frameUI(box,f){
  box.innerHTML=`<div class="qhead"><button class="link" id="tfb">Назад</button><span>${esc(f.n)}</span></div>
   <div class="note">${esc(f.d)}.${f.t[0][1]?' Чем ниже шаблон, тем сложнее речь.':''} Подставляй простые слова в пропуски.</div>
   <div class="row"><button class="btn ghost" id="tcol">Свернуть все ответы</button><button class="btn ghost" id="texp">Развернуть все</button><button class="btn ghost" id="trst">Убрать лишние вопросы</button></div>
   ${f.t.map((t,lvl)=>tCard(f,t,lvl)).join('')}`;
  $('tfb').onclick=()=>{tplFrame=null;renderTpl();};
  const redraw=()=>{save();frameUI(box,f);};
  const setAll=v=>{f.t.forEach((t,l)=>{const o=tpQs(f.id+':'+l,poolOf(f,l),l);o.hid={};if(v){o.q.forEach(i=>o.hid[i]=true);o.fh=true;}else o.fh=false;});redraw();};
  const resetQ=(l)=>{const key=f.id+':'+l,o=tpGet(key),pool=poolOf(f,l),def=[0,1,2].map(k=>(l*2+k*3)%pool.length);(o.q||def).forEach(i=>{if(!def.includes(i)&&o.a)delete o.a[i];});o.q=def;if(o.hid)o.hid={};};
  $('tcol').onclick=()=>setAll(true);$('texp').onclick=()=>setAll(false);
  $('trst').onclick=()=>{f.t.forEach((t,l)=>resetQ(l));redraw();};
  box.querySelectorAll('[data-say]').forEach(b=>b.onclick=()=>speak(b.dataset.say));
  box.querySelectorAll('[data-copy]').forEach(b=>b.onclick=()=>copyText(b.dataset.copy,b));
  box.querySelectorAll('textarea[data-k]').forEach(ta=>ta.oninput=()=>{const [k,i]=ta.dataset.k.split('|');const o=tpGet(k);if(i==='free')o.free=ta.value;else{o.a=o.a||{};o.a[i]=ta.value;}save();});
  box.querySelectorAll('[data-tg]').forEach(b=>b.onclick=()=>{const [k,i]=b.dataset.tg.split('|');const o=tpGet(k);if(i==='free')o.fh=!o.fh;else{o.hid=o.hid||{};o.hid[i]=!o.hid[i];}redraw();});
  box.querySelectorAll('[data-plus]').forEach(b=>b.onclick=()=>{
    const [k,i]=b.dataset.plus.split('|'),lvl=+k.split(':')[1],pool=poolOf(f,lvl),o=tpQs(k,pool,lvl),pos=o.q.indexOf(+i);
    const nx=pool.map((_,j)=>j).find(j=>!o.q.includes(j));
    if(nx===undefined){b.textContent='Вопросы закончились';b.disabled=true;return;}
    o.q.splice(pos+1,0,nx);redraw();});
  box.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{
    const [k,i]=b.dataset.del.split('|'),o=tpGet(k),has=((o.a||{})[i]||'').trim();
    if(has&&b.dataset.sure!=='1'){b.dataset.sure='1';b.textContent='Удалить с ответом?';b.classList.add('warnb');setTimeout(()=>{if(b.isConnected){b.dataset.sure='';b.textContent='✕';b.classList.remove('warnb');}},3000);return;}
    o.q=(o.q||[]).filter(x=>x!==+i);if(o.a)delete o.a[i];redraw();});
  box.querySelectorAll('[data-clr]').forEach(b=>b.onclick=()=>{const [k,i]=b.dataset.clr.split('|'),o=tpGet(k);if(i==='free')o.free='';else if(o.a)delete o.a[i];redraw();});
  box.querySelectorAll('[data-rst]').forEach(b=>b.onclick=()=>{resetQ(+b.dataset.rst);redraw();});
  box.querySelectorAll('[data-chk]').forEach(b=>b.onclick=()=>{const [k,i]=b.dataset.chk.split('|'),lvl=+k.split(':')[1],o=tpGet(k),txt=i==='free'?(o.free||''):((o.a||{})[i]||'');
    const wm=f.wm||'speak',qq=i==='free'?'Free practice using the template: '+f.t[lvl][0]:poolOf(f,lvl)[+i];
    aiCheck({mode:wm,part:f.part||'Part 1',question:wm==='speak'?qq:'(This is a practice paragraph or a few sentences, not a full answer, and no data is given, so do not check numbers. Judge accuracy, vocabulary and how well the template is used.) '+qq,text:txt,out:document.getElementById('chk_'+k.replace(':','_')+'_'+i),btn:b,key:'tp:'+k+':'+i});});
}
function tCard(f,t,lvl){
  const key=f.id+':'+lvl,pool=poolOf(f,lvl),o=tpQs(key,pool,lvl),idn=key.replace(':','_');
  const qrow=i=>{const hid=o.hid&&o.hid[i],val=(o.a&&o.a[i])||'';
    return `<div class="tq"><div class="tqh"><b>${esc(pool[i])}</b><span class="tqb"><button class="ic" data-tg="${key}|${i}" title="Свернуть или развернуть">${hid?'▸':'▾'}</button><button class="ic" data-plus="${key}|${i}" title="Ещё похожий вопрос">+</button><button class="ic" data-del="${key}|${i}" title="Убрать вопрос">✕</button></span></div>
    ${hid?(val?`<div class="qsub tqprev">${esc(val.slice(0,80))}${val.length>80?'…':''}</div>`:''):`<textarea class="sa" rows="3" data-k="${key}|${i}" placeholder="Твой ответ по шаблону">${esc(val)}</textarea><div class="row"><button class="btn ghost sm" data-chk="${key}|${i}">Проверить с Claude</button><button class="btn ghost sm" data-clr="${key}|${i}">Очистить текст</button></div><div id="chk_${idn}_${i}"></div>`}</div>`;};
  return `<div class="qcard tpl"><div class="qlabel">Шаблон ${lvl+1} из ${f.t.length}</div><div class="qtext tx">${esc(t[0])}</div>${t[1]?`<div class="qsub">Пример: ${esc(t[1])}</div>`:''}
   <div class="row">${t[1]?`<button class="link" data-say="${esc(t[1])}">Послушать пример</button>`:`<button class="link" data-say="${esc(t[0].replace(/___/g,'...'))}">Послушать</button>`}<button class="link" data-copy="${esc(t[0])}">Копировать шаблон</button><button class="link" data-rst="${lvl}">Сбросить вопросы</button></div>
   ${o.q.map(qrow).join('')||'<div class="qsub">Вопросов нет. Нажми «Сбросить вопросы».</div>'}
   <div class="tq"><div class="tqh"><b>Свободная практика: свои фразы по этому шаблону</b><span class="tqb"><button class="ic" data-tg="${key}|free">${o.fh?'▸':'▾'}</button></span></div>
   ${o.fh?(o.free?`<div class="qsub tqprev">${esc(o.free.slice(0,80))}${o.free.length>80?'…':''}</div>`:''):`<textarea class="sa" rows="3" data-k="${key}|free" placeholder="Придумай свои предложения с этим шаблоном">${esc(o.free||'')}</textarea><div class="row"><button class="btn ghost sm" data-chk="${key}|free">Проверить с Claude</button><button class="btn ghost sm" data-clr="${key}|free">Очистить текст</button></div><div id="chk_${idn}_free"></div>`}</div></div>`;
}
/* ---------- side word bank ---------- */
function wbkSync(){
  let btn=document.getElementById('wbkBtn'),dr=document.getElementById('wbk');
  if(!btn){
    btn=document.createElement('button');btn.id='wbkBtn';btn.className='wbkbtn';btn.textContent='📚 Банк слов';
    dr=document.createElement('aside');dr.id='wbk';dr.className='wbk';dr.hidden=true;
    document.body.appendChild(btn);document.body.appendChild(dr);
    btn.onclick=()=>{wbkOpen=!wbkOpen;wbkSync();};
  }
  const show=['tpl','sp','ielts'].includes(view);
  btn.hidden=!show;dr.hidden=!(show&&wbkOpen);
  if(show&&wbkOpen)wbkRender(dr);
}
function wbkRender(dr){
  const cur=S.wbkTheme!=null?S.wbkTheme:0,q=wbkQ.trim().toLowerCase();
  const hit=(t)=>q?{w:t.w.filter(x=>(x[0]+' '+x[1].join(' ')+' '+x[2]).toLowerCase().includes(q)),i:t.i.filter(x=>x.join(' ').toLowerCase().includes(q))}:t;
  const themes=q?WBK.map(t=>({n:t.n,...hit(t)})).filter(t=>t.w.length||t.i.length):[WBK[cur]];
  dr.innerHTML=`<div class="wbkh"><b>Банк слов</b><button class="ic" id="wbkx" aria-label="Закрыть">✕</button></div>
   <select id="wbks">${WBK.map((t,i)=>`<option value="${i}"${i===cur?' selected':''}>${esc(t.n)}</option>`).join('')}</select>
   <input type="search" id="wbkq" placeholder="Поиск по всем темам" value="${esc(wbkQ)}" autocomplete="off">
   ${themes.map(t=>`<h3>${esc(t.n)}</h3>${t.w.length?`<div class="wbl">${t.w.map(x=>`<div class="wbr"><span class="b">${esc(x[0])}</span> → <span class="a">${esc(x[1].join(' · '))}</span><div class="r">${esc(x[2])}</div></div>`).join('')}</div>`:''}${t.i.length?`<div class="wbi"><b>Идиомы</b>${t.i.map(x=>`<div class="wbr"><span class="a">${esc(x[0])}</span> — ${esc(x[1])}${x[2]?`<div class="r">${esc(x[2])}</div>`:''}</div>`).join('')}</div>`:''}`).join('')||'<div class="note">Ничего не найдено.</div>'}`;
  $('wbkx').onclick=()=>{wbkOpen=false;wbkSync();};
  $('wbks').onchange=()=>{S.wbkTheme=+$('wbks').value;save();wbkRender(dr);};
  const inp=$('wbkq');inp.oninput=()=>{wbkQ=inp.value;const p=inp.selectionStart;wbkRender(dr);const n=$('wbkq');n.focus();n.setSelectionRange(p,p);};
}
