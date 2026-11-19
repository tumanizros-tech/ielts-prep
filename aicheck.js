// Checking answers with Claude (page capability "sample") and voice dictation (capability "dictation").
let AI=null,DICT=null,dictTarget=null,dictBtn=null;
(async()=>{
  try{if(typeof claude!=='undefined'&&claude.use){AI=await claude.use('sample');DICT=await claude.use('dictation');
    if(DICT){DICT.onFinal(({text})=>{if(!dictTarget)return;const t=dictTarget;t.value=(t.value+' '+text).trim();t.dispatchEvent(new Event('input'));});
      DICT.onState(({state})=>{if(dictBtn)dictBtn.textContent=state==='listening'?'⏹ Стоп':'🎙 Диктовать';});}
    if(typeof render==='function'&&(view==='sp'||view==='ielts'))render();}}catch(e){}
})();
const CRIT={
 speak:'IELTS Speaking (Fluency and Coherence, Lexical Resource, Grammatical Range and Accuracy). Pronunciation cannot be judged from text, so leave it out.',
 write:'IELTS Writing Task 2 (Task Response, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy).',
 write1:'IELTS Academic Writing Task 1 (Task Achievement, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy). Check that the data in the text matches the DATA given, that there is a clear overview, and that key features are compared. Mention wrong numbers as mistakes.'
};
async function aiCheck(o){
  const {mode,question,text,out,btn,part}=o;
  if(!AI){out.innerHTML='<div class="warn">Проверка работает, когда страница открыта внутри Claude (приложение или claude.ai). Здесь она недоступна.</div>';return;}
  if(text.trim().split(/\s+/).length<8){out.innerHTML='<div class="warn">Напиши хотя бы пару предложений.</div>';return;}
  btn.disabled=true;const old=btn.textContent;btn.textContent='Проверяю…';out.innerHTML='';
  const prompt=`You are a strict but fair IELTS examiner and English teacher. Assess the learner's answer by ${CRIT[mode]}
The learner is a Russian speaker, around B2 now, aiming for band 7 to 8. ${mode==='speak'?'This is a written draft of a spoken answer ('+(part||'')+'), so judge it as speech: natural, not bookish.':''}
Question or task: ${question}
Learner's text:
"""
${text}
"""
Rules: quote the wrong fragment exactly as written in the text. Find EVERY spelling mistake, typo, grammar error, wrong word choice and unnatural phrase (the learner often makes silly typos, so do not skip them). Do not invent mistakes. Be honest with the band estimate and do not inflate it; use half bands. Write all explanations in Russian, English fragments stay in English.
Return ONLY JSON:
{"bands":{"c1":number,"c2":number,"c3":number,${mode!=='speak'?'"c4":number,':''}"overall":number},
"mistakes":[{"wrong":"...","right":"...","type":"spelling|grammar|vocabulary|style","why":"short Russian explanation"}],
"strengths":["Russian, max 3"],
"upgrade":[{"basic":"...","better":"band 7-8 alternative","why":"Russian"}],
"rewrite":"the learner's text improved to about band 8, keeping her ideas",
"tips":["Russian, max 3 concrete things to practise next"]}
The band names in order: ${mode==='speak'?'c1 Fluency and Coherence, c2 Lexical Resource, c3 Grammatical Range and Accuracy':'c1 Task Response (Task Achievement for Task 1), c2 Coherence and Cohesion, c3 Lexical Resource, c4 Grammatical Range and Accuracy'}.`;
  try{
    const r=await AI.json(prompt,{modelTier:'default',cache:false});
    out.innerHTML=aiHtml(r,mode);
    S.ai=S.ai||{};S.ai[o.key||question.slice(0,40)]={t:Date.now(),overall:r.bands&&r.bands.overall};save();
    const ms=(r.mistakes||[]).filter(m=>m.type==='spelling').map(m=>m.right&&m.right.trim()).filter(w=>/^[A-Za-z']+$/.test(w||''));
    if(ms.length){S.spErr=S.spErr||{};ms.forEach(w=>S.spErr[w.toLowerCase()]=(S.spErr[w.toLowerCase()]||0)+2);save();}
  }catch(e){
    out.innerHTML=`<div class="warn">${e&&e.code==='not_granted'?'Доступ к проверке не разрешён.':e&&e.code==='rate_limited'?'Слишком много запросов, подожди минуту.':'Не получилось проверить, попробуй ещё раз.'}</div>`;
  }
  btn.disabled=false;btn.textContent=old;
}
function aiHtml(r,mode){
  const names=mode==='speak'?['Fluency & Coherence','Lexical Resource','Grammar']:[mode==='write1'?'Task Achievement':'Task Response','Coherence & Cohesion','Lexical Resource','Grammar'];
  const b=r.bands||{};
  const bands=names.map((n,i)=>`<div class="bd"><b>${b['c'+(i+1)]!=null?b['c'+(i+1)]:'–'}</b><span>${n}</span></div>`).join('')+`<div class="bd all"><b>${b.overall!=null?b.overall:'–'}</b><span>Итого (оценка примерная)</span></div>`;
  const ms=r.mistakes||[];
  return `<div class="aifb"><div class="bands">${bands}</div>
   <h3>Ошибки (${ms.length})</h3>${ms.length?ms.map(m=>`<div class="mis"><div><s>${esc(m.wrong||'')}</s> → <b>${esc(m.right||'')}</b> <em>${esc(m.type||'')}</em></div><div class="qsub">${esc(m.why||'')}</div></div>`).join(''):'<div class="qsub">Явных ошибок не найдено.</div>'}
   ${(r.strengths||[]).length?`<h3>Что хорошо</h3><ul>${r.strengths.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}
   ${(r.upgrade||[]).length?`<h3>Как звучать сильнее</h3>${r.upgrade.map(u=>`<div class="mis"><div>${esc(u.basic||'')} → <b>${esc(u.better||'')}</b></div><div class="qsub">${esc(u.why||'')}</div></div>`).join('')}`:''}
   ${r.rewrite?`<h3>Версия уровня 8</h3><div class="rw">${esc(r.rewrite)}</div>`:''}
   ${(r.tips||[]).length?`<h3>Что тренировать</h3><ul>${r.tips.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}</div>`;
}
function dictButton(btn,ta){
  if(!DICT){btn.hidden=true;return;}
  btn.hidden=false;
  btn.onclick=()=>{dictTarget=ta;dictBtn=btn;DICT.start().catch(()=>{});};
}
