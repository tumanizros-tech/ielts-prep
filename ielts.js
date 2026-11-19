// IELTS tab: Reading, Listening and Writing task banks with progress and archive.
// Banks: RB (ielts_r1/r2.js), LB (ielts_l.js), T1B (ielts_w.js), WR (writing.js). Results live in S.tk.
let ieltsPart='read',rType='tfng',lType='form',wPart=1,iv=null,curT=null,curChk=false,lPlaying=false;
const RTYPES={tfng:'True / False / Not Given',mcq:'Multiple choice',gap:'Sentence completion',heads:'Matching headings',info:'Matching information'};
const LTYPES={form:'Form / note completion',sent:'Sentence completion',sum:'Summary completion',mcq:'Multiple choice',match:'Matching',map:'Plan / map labelling'};
const RINSTR={tfng:'Do the following statements agree with the information in the text? Write TRUE, FALSE or NOT GIVEN.',mcq:'Choose the correct letter, A, B, C or D.',gap:'Complete the sentences. Write NO MORE THAN ONE WORD from the text for each answer.',heads:'The text has four paragraphs, A to D. Choose the correct heading for each paragraph from the list of headings.',info:'Which paragraph contains the following information? Write the correct letter, A to D.'};
const ROM=['i','ii','iii','iv','v','vi','vii','viii','ix'];
const RTOPICS=['urban wildlife','the history of a common invention','renewable energy','the psychology of sleep','language learning in children','ocean plastic','the future of work','ancient trade routes','architecture and climate','memory and technology','food production and sustainability','the science of happiness'];
const TFW={T:'True',F:'False',N:'Not Given'};
function tkGet(id){S.tk=S.tk||{};return S.tk[id];}
function tkSave(id,ok,tot){S.tk=S.tk||{};const o=S.tk[id]||{n:0,best:0};o.n++;o.ok=ok;o.tot=tot;o.best=Math.max(o.best||0,ok);o.ts=Date.now();S.tk[id]=o;save();}
function tkLabel(id){const o=tkGet(id);return o?`✓ ${o.ok}/${o.tot} · пройдено ${o.n} раз`:'новое';}
function rData(i,type){
  const p=RB[i],L='ABCD';
  const d={title:p.t,paragraphs:p.p.map((t,k)=>({l:L[k],t})),type,instruction:RINSTR[type]};
  if(type==='tfng')d.items=p.tf.map(x=>({q:x[0],answer:TFW[x[1]],explain:x[2]}));
  else if(type==='gap')d.items=p.gp.map(x=>({q:x[0],answer:x[1],explain:x[2]}));
  else if(type==='mcq')d.items=p.mc.map(x=>({q:x[0],options:x[1],answer:'ABCD'[x[2]],explain:x[3]}));
  else if(type==='info')d.items=p.inf.map(x=>({q:x[0],answer:x[1],explain:x[2]}));
  else{d.headings=p.hd.h;d.items=p.hd.a.map((h,k)=>({q:'Paragraph '+L[k],answer:ROM[h],explain:'Заголовок: '+p.hd.h[h]}));}
  return d;
}
function lData(i,type){
  if(type==='map'){const m=MB[i];return {title:m.t,lines:m.l.map(x=>({s:x[0],t:x[1]})),kind:'sel',map:m,labels:Object.keys(m.boxes),instruction:'Label the plan. Write the correct letter, A-'+Object.keys(m.boxes).slice(-1)+', next to each place.',items:m.items.map(x=>({q:x[0],answer:x[1],explain:'Место на плане: '+x[1]}))};}
  const p=LB[i],d={title:p.t,lines:p.l.map(x=>({s:x[0],t:x[1]}))};
  if(type==='mcq'){d.kind='mcq';d.instruction='Choose the correct letter, A, B, C or D.';d.items=p.mc.map(x=>({q:x[0],options:x[1].slice(0,4),answer:'ABCD'[x[2]],explain:x[3]}));}
  else if(type==='match'){d.kind='sel';d.labels=p.match.o.map((_,k)=>'ABCDE'[k]);d.opts=p.match.o;d.instruction='Match each statement with the correct option, A-E.';d.items=p.match.i.map(x=>({q:x[0],answer:'ABCDE'[x[1]],explain:'Правильный вариант: '+p.match.o[x[1]]}));}
  else if(type==='sent'){d.kind='gap';d.instruction='Complete the sentences. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.';d.items=p.sent.map(x=>({q:x[0],answer:x[1],explain:x[2]}));}
  else if(type==='sum'){d.kind='gap';d.instruction='Complete the summary. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.';d.items=p.sum.map(x=>({q:x[0],answer:x[1],explain:x[2]}));}
  else{d.kind='gap';d.instruction='Complete the notes. Write ONE WORD AND/OR A NUMBER for each answer.';d.items=p.form.map(x=>({q:x[0],answer:x[1],explain:x[2]}));}
  return d;
}
function mapSvg(m){
  let s=`<svg viewBox="0 0 ${m.w} ${m.h}" class="chart" role="img" aria-label="${esc(m.t)}"><rect x="1" y="1" width="${m.w-2}" height="${m.h-2}" fill="none" stroke="currentColor" opacity=".3" rx="8"/>`;
  (m.path||[]).forEach(p=>{s+=`<line x1="${p[0]}" y1="${p[1]}" x2="${p[2]}" y2="${p[3]}" stroke="currentColor" stroke-width="22" opacity=".12" stroke-linecap="round"/>`;});
  if(m.lake)s+=`<ellipse cx="${m.lake[0]}" cy="${m.lake[1]}" rx="${m.lake[2]}" ry="${m.lake[3]}" fill="#5aa9e6" opacity=".35"/><text x="${m.lake[0]}" y="${m.lake[1]+4}" text-anchor="middle" class="ct">LAKE</text>`;
  (m.fixed||[]).forEach(f=>{s+=`<rect x="${f.x}" y="${f.y}" width="${f.w}" height="${f.h}" rx="5" fill="currentColor" opacity=".15"/><text x="${f.x+f.w/2}" y="${f.y+f.h/2+4}" text-anchor="middle" class="ct">${esc(f.l)}</text>`;});
  Object.entries(m.boxes).forEach(([k,b])=>{s+=`<rect x="${b[0]}" y="${b[1]}" width="${b[2]}" height="${b[3]}" rx="6" fill="none" stroke="var(--accent,#4a6cf7)" stroke-width="2"/><text x="${b[0]+b[2]/2}" y="${b[1]+b[3]/2+6}" text-anchor="middle" style="font-size:18px;font-weight:700;fill:var(--accent,#4a6cf7)">${k}</text>`;});
  return s+'</svg>';
}
/* ---------- shared question renderer ---------- */
function itemHtml(it,i,type,ctx){
  let inp='';
  if(type==='tfng')inp=['True','False','Not Given'].map(o=>`<label class="rad"><input type="radio" name="q${i}" value="${o}"> ${o}</label>`).join('');
  else if(type==='mcq')inp=(it.options||[]).map((o,k)=>`<label class="rad"><input type="radio" name="q${i}" value="${'ABCD'[k]}"> <b>${'ABCD'[k]}</b> ${esc(o)}</label>`).join('');
  else if(type==='heads')inp=`<select name="q${i}"><option value="">—</option>${ctx.headings.map((h,k)=>`<option value="${ROM[k]}">${ROM[k]}. ${esc(h)}</option>`).join('')}</select>`;
  else if(type==='info')inp=`<select name="q${i}"><option value="">—</option>${ctx.labels.map(l=>`<option value="${l}">${l}</option>`).join('')}</select>`;
  else inp=`<input type="text" name="q${i}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="ответ">`;
  const q=type==='gap'||type==='sent'||type==='form'?esc(it.q).replace('___','<span class="blank">______</span>'):esc(it.q);
  return `<div class="qi" id="qi${i}"><div class="qn">${i+1}</div><div class="qb"><div>${q}</div><div class="inp">${inp}</div><div class="rf" id="rf${i}"></div></div></div>`;
}
function getAns(i){
  const r=document.querySelector(`input[name="q${i}"]:checked`);if(r)return r.value;
  const e=document.querySelector(`[name="q${i}"]`);return e?e.value.trim():'';
}
function isRight(type,it,a){
  if(!a)return false;
  if(type==='tfng')return norm(a)===norm(it.answer)||(/^ng$/i.test(it.answer)&&a==='Not Given');
  if(type==='mcq'||type==='heads'||type==='info')return norm(a)===norm(it.answer);
  return String(it.answer).split('|').some(x=>norm(x)===norm(a));
}
function bandOf(p){return p>=.88?'8':p>=.75?'7':p>=.6?'6':p>=.45?'5':'4';}
function checkItems(items,type,fb,id){
  let ok=0;
  items.forEach((it,i)=>{
    const a=getAns(i),r=isRight(type,it,a);if(r)ok++;
    const box=document.getElementById('rf'+i);
    box.className='rf '+(r?'ok':'bad');
    box.innerHTML=`${r?'✓ Верно':'✗ Неверно'}${r?'':`. Правильный ответ: <b>${esc(String(it.answer).split('|')[0])}</b>`}${it.explain?`<div class="qsub">${esc(it.explain)}</div>`:''}${it.evidence?`<div class="qsub">«${esc(it.evidence)}»</div>`:''}`;
    document.querySelectorAll(`[name="q${i}"]`).forEach(e=>e.disabled=true);
  });
  const p=ok/items.length;addXP(ok*2);if(id)tkSave(id,ok,items.length);
  fb.innerHTML=`<div class="aifb"><div class="bands"><div class="bd all"><b>${ok}/${items.length}</b><span>верно</span></div><div class="bd"><b>~${bandOf(p)}</b><span>примерный Band (по малому числу вопросов)</span></div></div></div>`;
  return ok;
}

function renderIelts(){
  const seg=`<div class="seg">${[['read','Reading'],['listen','Listening'],['write','Writing']].map(([k,n])=>`<button data-p="${k}" class="${k===ieltsPart?'on':''}">${n}</button>`).join('')}</div>`;
  $('main').innerHTML=`<div class="hub">${seg}<div id="ibody"></div></div>`;
  $('main').querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{ieltsPart=b.dataset.p;iv=null;curT=null;voiceTok++;try{speechSynthesis.cancel();}catch(e){}render();});
  if(ieltsPart==='read')readUI();else if(ieltsPart==='listen')listenUI();else writeUI();
}
function chips(map,cur,attr){return `<div class="chips">${Object.entries(map).map(([k,v])=>`<button class="chip${k===cur?' on':''}" data-${attr}="${k}">${v}</button>`).join('')}</div>`;}
// shared list: entries [{id,title,sub}] split into new and archive
function listHtml(entries,openAttr){
  const nw=entries.filter(e=>!tkGet(e.id)),dn=entries.filter(e=>tkGet(e.id));
  const li=e=>`<li class="item"><div><b>${esc(e.title)}</b><div class="t">${esc(e.sub||'')} ${tkGet(e.id)?'· '+tkLabel(e.id):''}</div></div><div class="row"><button class="btn${tkGet(e.id)?' ghost':''}" data-${openAttr}="${e.i}">${tkGet(e.id)?'Ещё раз':'Начать'}</button></div></li>`;
  return `<div class="note">Новых: ${nw.length}. Пройдено: ${dn.length} из ${entries.length}. Пройденные задания уходят в архив, результат сохраняется, и их можно пройти заново.</div>
   ${nw.length?`<div class="row"><button class="btn" data-${openAttr}="${nw[0].i}">▶ Следующее новое</button></div><h2>Новые</h2><ul class="list">${nw.map(li).join('')}</ul>`:'<div class="note">Все задания этого типа пройдены. Выбери из архива, чтобы пройти заново.</div>'}
   ${dn.length?`<h2>Архив</h2><ul class="list">${dn.map(li).join('')}</ul>`:''}`;
}
function nextNew(entries){const e=entries.find(e=>!tkGet(e.id));return e?e.i:null;}
/* ---------- Reading ---------- */
function rEntries(){return RB.map((p,i)=>({i,id:'r:'+rType+':'+i,title:`Текст ${i+1}: ${p.t}`,sub:RTYPES[rType]}));}
function readUI(){
  const b=$('ibody');
  if(curT&&iv&&iv.k==='r')return readTask(b);
  b.innerHTML=`<div class="note">Тип заданий выбираешь сам. Тексты и вопросы уже встроены, они работают без Claude. «✨» создаёт дополнительный новый текст.</div>${chips(RTYPES,rType,'rt')}<div id="rlist">${listHtml(rEntries(),'ro')}</div>
   <div class="row"><button class="btn ghost" id="rgen">✨ Ещё текст от Claude (не сохраняется в архиве)</button></div><div id="rout"></div>`;
  b.querySelectorAll('[data-rt]').forEach(x=>x.onclick=()=>{rType=x.dataset.rt;readUI();});
  b.querySelectorAll('[data-ro]').forEach(x=>x.onclick=()=>{const i=+x.dataset.ro;iv={k:'r',i,id:'r:'+rType+':'+i};curT=rData(i,rType);curChk=false;readUI();window.scrollTo(0,0);});
  $('rgen').onclick=()=>genReading();
}
function readTask(b){
  const R=curT;
  b.innerHTML=`<div class="qhead"><button class="link" id="tback">К списку</button><span>${RTYPES[R.type]}</span></div>
   <div class="passage"><h3>${esc(R.title)}</h3>${R.paragraphs.map(p=>`<p><b>${esc(p.l)}</b>&nbsp; ${esc(p.t)}</p>`).join('')}</div>
   <div class="instr">${esc(R.instruction||'')}${R.headings?`<ol class="hl">${R.headings.map((x,k)=>`<li><b>${ROM[k]}</b> ${esc(x)}</li>`).join('')}</ol>`:''}</div>
   <div class="qs">${R.items.map((it,i)=>itemHtml(it,i,R.type,{headings:R.headings,labels:R.paragraphs.map(p=>p.l)})).join('')}</div>
   <div class="row"><button class="btn" id="rchk">Проверить</button></div><div id="rfb"></div>`;
  $('tback').onclick=()=>{curT=null;iv=null;readUI();};
  $('rchk').onclick=()=>{$('rchk').disabled=true;const ok=checkItems(R.items,R.type,$('rfb'),iv&&iv.id);after($('rfb'),rEntries,'r',ok);};
}
function after(fb,entriesFn,kind,ok){
  const nx=iv&&iv.id?nextNew(entriesFn()):null;
  fb.insertAdjacentHTML('beforeend',`<div class="row">${nx!=null?'<button class="btn" id="anx">Следующее новое задание</button>':''}<button class="btn ghost" id="aretry">Пройти заново</button><button class="btn ghost" id="alist">К списку</button></div>`);
  if($('anx'))$('anx').onclick=()=>{
    if(kind==='r'){iv={k:'r',i:nx,id:'r:'+rType+':'+nx};curT=rData(nx,rType);curChk=false;readUI();}
    else{iv={k:'l',i:nx,id:'l:'+lType+':'+nx};curT=lData(nx,lType);listenUI();}
    window.scrollTo(0,0);};
  $('aretry').onclick=()=>{if(kind==='r'){curT=rData(iv.i,rType);readUI();}else listenUI();window.scrollTo(0,0);};
  $('alist').onclick=()=>{curT=null;iv=null;voiceTok++;try{speechSynthesis.cancel();}catch(e){}if(kind==='r')readUI();else listenUI();};
}
async function genReading(){
  const out=$('rout'),btn=$('rgen');if(needAI(out))return;
  btn.disabled=true;btn.textContent='Пишу текст…';out.innerHTML='';
  const topic=RTOPICS[Math.floor(Math.random()*RTOPICS.length)];
  const spec={
   tfng:'8 statements for TRUE / FALSE / NOT GIVEN. Each item {"q":statement,"answer":"True"|"False"|"Not Given","explain":"Russian explanation","evidence":"short quote or empty"}. Use all three answers.',
   mcq:'6 multiple-choice questions with 4 options. Each item {"q":question,"options":[4 strings],"answer":"A"|"B"|"C"|"D","explain":"Russian explanation","evidence":"quote"}.',
   gap:'8 sentence-completion items. Each item {"q":sentence with ___,"answer":"accepted answers separated by |, one or two words from the text","explain":"Russian explanation","evidence":"quote"}.',
   heads:'"headings": 7 headings (one per paragraph plus distractors) and one item per paragraph {"q":"Paragraph X","answer":"roman numeral i-vii","explain":"Russian explanation"}.',
   info:'6 items {"q":"statement","answer":"paragraph letter","explain":"Russian explanation","evidence":"quote"}.'}[rType];
  const prompt=`Write an original IELTS Academic Reading passage on "${topic}" for a candidate aiming for band 7-8: 380-450 words, formal style, paragraphs labelled A-E. Then write the questions: ${spec}
Return ONLY JSON: {"title":"...","paragraphs":[{"l":"A","t":"..."}],"instruction":"official-style instruction in English"${rType==='heads'?',"headings":["..."]':''},"items":[...]}`;
  try{
    const r=await AI.json(prompt,{modelTier:'default',cache:false});
    if(!r||!Array.isArray(r.paragraphs)||r.paragraphs.length<3||!Array.isArray(r.items)||r.items.length<4)throw new Error('bad');
    r.type=rType;if(rType==='heads'&&!Array.isArray(r.headings))throw new Error('bad');
    iv={k:'r',i:-1,id:null};curT=r;readUI();
  }catch(e){out.innerHTML=`<div class="warn">${e&&e.code==='rate_limited'?'Слишком много запросов, подожди минуту.':'Не получилось создать текст, попробуй ещё раз.'}</div>`;btn.disabled=false;btn.textContent='✨ Ещё текст от Claude (не сохраняется в архиве)';}
}
/* ---------- Listening ---------- */
let voiceTok=0;
function speakLines(lines,onEnd){
  const tok=++voiceTok;try{speechSynthesis.cancel();}catch(e){return;}
  const vs=(speechSynthesis.getVoices()||[]).filter(v=>/^en/i.test(v.lang));
  const pick=i=>vs.filter(v=>/en-GB/i.test(v.lang))[i%2]||vs[i%Math.max(1,vs.length)];
  const spk={};let n=0;
  const next=i=>{
    if(tok!==voiceTok)return;
    if(i>=lines.length){lPlaying=false;onEnd&&onEnd();return;}
    const u=new SpeechSynthesisUtterance(lines[i].t);u.lang='en-GB';u.rate=.92;
    if(!(lines[i].s in spk))spk[lines[i].s]=n++;
    const idx=spk[lines[i].s];const v=pick(idx);if(v)u.voice=v;u.pitch=idx?1.25:0.95;
    u.onend=()=>next(i+1);u.onerror=()=>next(i+1);speechSynthesis.speak(u);
  };
  lPlaying=true;next(0);
}

function lEntries(){if(lType==='map')return MB.map((p,i)=>({i,id:'l:map:'+i,title:`Карта ${i+1}: ${p.t}`,sub:LTYPES.map}));return LB.map((p,i)=>({i,id:'l:'+lType+':'+i,title:`Запись ${i+1}: ${p.t}`,sub:LTYPES[lType]}));}
function listenUI(){
  const b=$('ibody');
  if(curT&&iv&&iv.k==='l'){
    const L=curT;
    b.innerHTML=`<div class="qhead"><button class="link" id="tback">К списку</button><span>${LTYPES[lType]}</span></div>
     <div class="qcard"><div class="qtext">${esc(L.title)}</div><div class="row"><button class="btn" id="lplay">▶ Слушать</button><button class="btn ghost" id="lstop">■ Стоп</button></div><div class="qsub">${esc(L.instruction||'')} В экзамене запись звучит один раз.</div></div>
     ${L.map?`<div class="qcard">${mapSvg(L.map)}</div>`:''}${L.opts?`<ol class="hl" type="A">${L.opts.map(o=>`<li>${esc(o)}</li>`).join('')}</ol>`:''}
     <div class="qs">${L.items.map((it,i)=>itemHtml(it,i,L.kind==='mcq'?'mcq':L.kind==='sel'?'info':'gap',{labels:L.labels})).join('')}</div>
     <div class="row"><button class="btn" id="lchk">Проверить</button></div><div id="lfb"></div>
     <details class="fold"><summary>Скрипт (откроешь после проверки)</summary><div id="lscript" class="rw">Сначала проверь ответы.</div></details>`;
    $('tback').onclick=()=>{voiceTok++;try{speechSynthesis.cancel();}catch(e){}curT=null;iv=null;listenUI();};
    $('lplay').onclick=()=>speakLines(L.lines);
    $('lstop').onclick=()=>{voiceTok++;try{speechSynthesis.cancel();}catch(e){}};
    $('lchk').onclick=()=>{voiceTok++;try{speechSynthesis.cancel();}catch(e){}$('lchk').disabled=true;const ok=checkItems(L.items,L.kind==='mcq'?'mcq':L.kind==='sel'?'info':'gap',$('lfb'),iv&&iv.id);$('lscript').textContent=L.lines.map(x=>x.t).join('\n\n');after($('lfb'),lEntries,'l',ok);};
    return;
  }
  b.innerHTML=`<div class="note">Listening: запись читает голос браузера (он ровнее живой речи, поэтому для настоящего слуха смотри вкладку «Аудио»). Громкость включи. Вопросы проверяются сразу, скрипт открывается после ответов.</div>${chips(LTYPES,lType,'lt')}<div id="llist">${listHtml(lEntries(),'lo')}</div>
   <div class="row"><button class="btn ghost" id="lgen">✨ Ещё запись от Claude (не сохраняется в архиве)</button></div><div id="lout"></div>`;
  b.querySelectorAll('[data-lt]').forEach(x=>x.onclick=()=>{lType=x.dataset.lt;listenUI();});
  b.querySelectorAll('[data-lo]').forEach(x=>x.onclick=()=>{const i=+x.dataset.lo;iv={k:'l',i,id:'l:'+lType+':'+i};curT=lData(i,lType);listenUI();window.scrollTo(0,0);});
  $('lgen').onclick=()=>genListening();
}
async function genListening(){
  const out=$('lout'),btn=$('lgen');if(needAI(out))return;
  btn.disabled=true;btn.textContent='Пишу запись…';out.innerHTML='';
  const topic=RTOPICS.concat(['booking a hotel','a university tutorial','a library membership','a local museum tour','a part-time job enquiry'])[Math.floor(Math.random()*17)];
  const spec=(lType==='mcq')?'6 multiple-choice items {"q":question,"options":[3 or 4 strings],"answer":"A"|"B"|"C"|"D","explain":"Russian explanation"}.':'8 form/note completion items. Each {"q":"label of the form with ___ for the missing detail","answer":"accepted answers separated by | (one or two words or a number)","explain":"Russian explanation with the phrase from the recording"}.';
  const prompt=`Write an original IELTS Listening recording on "${topic}" (${lType==='mcq'?'a conversation between two people':'a conversation or a monologue'}), 220-300 words in total, natural spoken English with distractors (corrections, changes of mind). Split it into short lines with the speaker letter. Then write the questions: ${spec}
Return ONLY JSON: {"title":"...","instruction":"official-style instruction","lines":[{"s":"A","t":"..."}],"items":[...]}`;
  try{
    const r=await AI.json(prompt,{modelTier:'default',cache:false});
    if(!r||!Array.isArray(r.lines)||r.lines.length<2||!Array.isArray(r.items)||r.items.length<4)throw new Error('bad');
    r.kind=lType==='mcq'?'mcq':'gap';iv={k:'l',i:-1,id:null};curT=r;listenUI();
  }catch(e){out.innerHTML=`<div class="warn">${e&&e.code==='rate_limited'?'Слишком много запросов, подожди минуту.':'Не получилось создать запись, попробуй ещё раз.'}</div>`;btn.disabled=false;btn.textContent='✨ Ещё запись от Claude (не сохраняется в архиве)';}
}
/* ---------- Writing ---------- */
function chartSvg(d){
  const W=640,H=300,pl=48,pr=12,pt=20,pb=60,pw=W-pl-pr,ph=H-pt-pb;
  const cols=['var(--accent)','#e07a5f','#3d9970','#9b6bd1'];
  const all=d.series.flatMap(s=>s.values),mx=Math.max(...all),max=Math.ceil(mx*1.1/10)*10||10,n=d.categories.length,m=d.series.length;
  let s=`<svg viewBox="0 0 ${W} ${H}" class="chart" role="img" aria-label="${esc(d.title)}">`;
  for(let i=0;i<=4;i++){const y=pt+ph-ph*i/4;s+=`<line x1="${pl}" x2="${W-pr}" y1="${y}" y2="${y}" class="gl"/><text x="${pl-6}" y="${y+4}" text-anchor="end" class="ct">${Math.round(max*i/4)}</text>`;}
  if(d.kind==='line'){
    d.series.forEach((se,k)=>{const pts=se.values.map((v,i)=>[pl+pw*(n===1?.5:i/(n-1)),pt+ph-ph*v/max]);s+=`<polyline fill="none" stroke="${cols[k%4]}" stroke-width="3" points="${pts.map(p=>p.join(',')).join(' ')}"/>`+pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="${cols[k%4]}"/>`).join('');});
    d.categories.forEach((c,i)=>{s+=`<text x="${pl+pw*(n===1?.5:i/(n-1))}" y="${H-pb+16}" text-anchor="middle" class="ct">${esc(c)}</text>`;});
  }else{
    const gw=pw/n,bw=Math.min(40,gw*.7/m);
    d.categories.forEach((c,i)=>{
      d.series.forEach((se,k)=>{const x=pl+gw*i+(gw-bw*m)/2+bw*k,h=ph*se.values[i]/max;s+=`<rect x="${x}" y="${pt+ph-h}" width="${bw-2}" height="${h}" fill="${cols[k%4]}" rx="3"/><text x="${x+bw/2-1}" y="${pt+ph-h-4}" text-anchor="middle" class="ct">${se.values[i]}</text>`;});
      s+=`<text x="${pl+gw*i+gw/2}" y="${H-pb+16}" text-anchor="middle" class="ct">${esc(c)}</text>`;
    });
  }
  s+=d.series.map((se,k)=>`<rect x="${pl+k*130}" y="${H-22}" width="12" height="12" fill="${cols[k%4]}"/><text x="${pl+k*130+18}" y="${H-12}" class="ct">${esc(se.name)}</text>`).join('')+'</svg>';
  return s;
}

function t1Data(i){const d=T1B[i];return {title:d.t,kind:d.kind,unit:d.unit,categories:d.c,series:d.s.map(x=>({name:x[0],values:x[1]})),task:d.task+' Summarise the information by selecting and reporting the main features, and make comparisons where relevant.'};}
function wStatus(key){const a=S.ai&&S.ai[key],t=S.wr&&S.wr[key];return a?`✓ проверено Claude, Band ${a.overall!=null?a.overall:'–'}`:(t&&t.trim()?'черновик сохранён':'новое');}
function writeUI(){
  const b=$('ibody');
  if(iv&&iv.k==='w1'){return task1UI(b,iv.i);}
  if(iv&&iv.k==='w2'){b.innerHTML=`<div class="qhead"><button class="link" id="tback">К списку</button><span>Task 2</span></div><div id="wbody"></div>`;$('tback').onclick=()=>{iv=null;writeUI();};wrIdx=iv.i;renderWriting($('wbody'));return;}
  const l1=T1B.map((d,i)=>({i,key:'wr1:'+i,title:`График ${i+1}: ${d.t}`})),l2=WR.map((q,i)=>({i,key:'wr:'+i,title:`Тема ${i+1}: ${q.slice(0,70)}…`}));
  const li=(e,att)=>{const st=wStatus(e.key),done=st.startsWith('✓');return `<li class="item"><div><b>${esc(e.title)}</b><div class="t">${esc(st)}</div></div><div class="row"><button class="btn${done?' ghost':''}" data-${att}="${e.i}">${done?'Ещё раз':st==='новое'?'Начать':'Продолжить'}</button></div></li>`;};
  const next=(ls)=>{const e=ls.find(e=>wStatus(e.key)==='новое');return e;};
  const seg=`<div class="seg"><button data-w="1" class="${wPart===1?'on':''}">Task 1: график</button><button data-w="2" class="${wPart===2?'on':''}">Task 2: эссе</button></div>`;
  const ls=wPart===1?l1:l2,att=wPart===1?'w1o':'w2o',nx=next(ls);
  b.innerHTML=`${seg}<div class="note">${wPart===1?'Task 1: опиши график за 20 минут, минимум 150 слов.':'Task 2: эссе за 40 минут, минимум 250 слов.'} Черновики сохраняются. Проверка Claude работает внутри Claude, результат попадает в архив.</div>
   ${nx?`<div class="row"><button class="btn" data-${att}="${nx.i}">▶ Следующее новое</button></div>`:''}<ul class="list">${ls.map(e=>li(e,att)).join('')}</ul>
   ${wPart===1?'<div class="row"><button class="btn ghost" id="t1gen">✨ Ещё график от Claude (не сохраняется)</button></div><div id="t1out"></div>':''}`;
  b.querySelectorAll('[data-w]').forEach(x=>x.onclick=()=>{wPart=+x.dataset.w;writeUI();});
  b.querySelectorAll('[data-w1o]').forEach(x=>x.onclick=()=>{iv={k:'w1',i:+x.dataset.w1o};writeUI();window.scrollTo(0,0);});
  b.querySelectorAll('[data-w2o]').forEach(x=>x.onclick=()=>{iv={k:'w2',i:+x.dataset.w2o};writeUI();window.scrollTo(0,0);});
  if($('t1gen'))$('t1gen').onclick=genTask1;
}
function task1UI(b,i){
  const d=i>=0?t1Data(i):T1X,key=i>=0?'wr1:'+i:'wr1:gen';
  b.innerHTML=`<div class="qhead"><button class="link" id="tback">К списку</button><span>Task 1</span></div>
   <div class="qcard"><div class="qtext">${esc(d.title)}</div>${chartSvg(d)}<div class="qsub">${esc(d.task)}</div></div>
   <textarea class="sa" id="t1ta" rows="12" placeholder="Начни писать здесь"></textarea><div class="qsub" id="t1c"></div>
   <div class="row"><button class="btn ghost" id="t1mic" hidden>🎙 Диктовать</button><button class="btn" id="t1chk">Проверить с Claude</button><button class="btn ghost" id="t1clr">Очистить</button></div><div id="t1fb"></div>`;
  $('tback').onclick=()=>{iv=null;writeUI();};
  const ta=$('t1ta');ta.value=(S.wr&&S.wr[key])||'';
  const upd=()=>{const n=(ta.value.match(/[A-Za-z']+/g)||[]).length;$('t1c').textContent=`Слов: ${n}${n<150?' (нужно 150+)':''}`;};upd();
  ta.oninput=()=>{S.wr=S.wr||{};S.wr[key]=ta.value;save();upd();};
  dictButton($('t1mic'),ta);
  $('t1clr').onclick=()=>{ta.value='';S.wr=S.wr||{};S.wr[key]='';save();upd();};
  $('t1chk').onclick=()=>aiCheck({mode:'write1',question:d.task+' DATA: '+JSON.stringify({categories:d.categories,series:d.series,unit:d.unit}),text:ta.value,out:$('t1fb'),btn:$('t1chk'),key});
}
let T1X=null;
async function genTask1(){
  const out=$('t1out'),btn=$('t1gen');if(needAI(out))return;
  btn.disabled=true;btn.textContent='Готовлю график…';out.innerHTML='';
  const k=Math.random()<.5?'bar':'line';
  const prompt=`Invent realistic data for an IELTS Academic Writing Task 1 ${k} chart about a social or economic topic. Use 3 to 5 categories and 2 or 3 series, values in a clear unit. Return ONLY JSON: {"title":"short chart title with unit","kind":"${k}","unit":"%","categories":["..."],"series":[{"name":"...","values":[numbers]}],"task":"official-style Task 1 instruction in English ending with: Summarise the information by selecting and reporting the main features, and make comparisons where relevant."}`;
  try{
    const r=await AI.json(prompt,{modelTier:'quick',cache:false});
    if(!r||!Array.isArray(r.categories)||!Array.isArray(r.series)||!r.series.every(s=>Array.isArray(s.values)&&s.values.length===r.categories.length&&s.values.every(v=>typeof v==='number')))throw new Error('bad');
    r.kind=r.kind==='line'?'line':'bar';T1X=r;iv={k:'w1',i:-1};writeUI();
  }catch(e){out.innerHTML=`<div class="warn">Не получилось создать график, попробуй ещё раз.</div>`;btn.disabled=false;btn.textContent='✨ Ещё график от Claude (не сохраняется)';}
}
