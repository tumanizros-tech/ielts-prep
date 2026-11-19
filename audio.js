// "Аудио" tab: dictation, your own lyrics/subtitles, YouGlish and outside listening sites.
let audMode='dict',dLevel=1,dList=null,dIdx=0;
const DICT_BUILT={
 1:['I usually get up at seven and have a cup of coffee.','She has lived in this city for about five years.','We missed the last bus, so we had to walk home.','Could you tell me where the nearest pharmacy is?','He promised to call me as soon as he arrived.','It was raining heavily, but they went out anyway.'],
 2:['Despite the heavy traffic, we managed to reach the airport on time.','If I had known about the delay, I would have taken the train.','The number of people working from home has risen sharply in recent years.','She is thinking of applying for a scholarship abroad next autumn.','Not only did he apologise, but he also offered to pay for the damage.','Whether we like it or not, technology is changing the way we learn.'],
 3:['Governments should invest more heavily in renewable energy rather than relying on fossil fuels.','The research suggests that a lack of sleep can seriously undermine concentration and memory.','Although the proposal sounds appealing, it would be extremely difficult to implement in practice.','Contrary to popular belief, the majority of volunteers were not retired but in full-time employment.','Had the authorities acted sooner, the consequences of the flood might have been far less severe.','What matters most is not how quickly you learn, but how consistently you practise.']
};
function diffWords(ans,key){
  const A=(ans.toLowerCase().replace(/[’]/g,"'").match(/[a-z0-9']+/g)||[]),K=(key.toLowerCase().replace(/[’]/g,"'").match(/[a-z0-9']+/g)||[]),O=key.match(/[A-Za-z0-9’']+|[^A-Za-z0-9’']+/g)||[];
  const n=A.length,m=K.length,dp=Array.from({length:n+1},()=>Array(m+1).fill(0));
  for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)dp[i][j]=A[i]===K[j]?dp[i+1][j+1]+1:Math.max(dp[i+1][j],dp[i][j+1]);
  const hit=new Set();let i=0,j=0;while(i<n&&j<m){if(A[i]===K[j]){hit.add(j);i++;j++;}else if(dp[i+1][j]>=dp[i][j+1])i++;else j++;}
  let wi=-1,ok=0;
  const html=O.map(t=>{if(!/[A-Za-z0-9]/.test(t))return esc(t);wi++;if(hit.has(wi)){ok++;return esc(t);}return `<mark class="miss">${esc(t)}</mark>`;}).join('');
  return {html,ok,total:m};
}
function sayText(t,rate){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='en-US';u.rate=rate||0.9;const v=(speechSynthesis.getVoices()||[]).find(v=>/en-US/i.test(v.lang));if(v)u.voice=v;speechSynthesis.speak(u);}catch(e){}}
function dictCard(list,idx,box,onNext,label){
  const s=list[idx];
  box.innerHTML=`<div class="qcard"><div class="qtext">${label||'Диктант'} · ${idx+1}/${list.length}</div>
   <div class="row"><button class="btn" id="dplay">▶ Слушать</button><button class="btn ghost" id="dslow">🐢 Медленно</button></div>
   <textarea class="sa" id="dta" rows="3" autocapitalize="off" spellcheck="false" placeholder="Напиши, что услышал"></textarea>
   <div class="row"><button class="btn" id="dchk">Проверить</button><button class="btn ghost" id="dnext" hidden>Дальше</button></div><div id="dres"></div></div>`;
  $('dplay').onclick=()=>sayText(s,.95);$('dslow').onclick=()=>sayText(s,.65);
  $('dchk').onclick=()=>{
    const r=diffWords($('dta').value,s),p=r.total?r.ok/r.total:0;
    $('dres').innerHTML=`<div class="rf ${p>=.9?'ok':'bad'}">${r.ok}/${r.total} слов. Пропущенные или неверные выделены:<div class="qsub dd">${r.html}</div></div>`;
    $('dnext').hidden=false;$('dchk').disabled=true;addXP(Math.round(p*3));
    S.dict=S.dict||{};S.dict.n=(S.dict.n||0)+1;save();
  };
  $('dnext').onclick=onNext;
}
function audioUI(){
  const seg=`<div class="seg">${[['dict','Диктанты'],['yg','YouGlish и сайты']].map(([k,n])=>`<button data-a="${k}" class="${k===audMode?'on':''}">${n}</button>`).join('')}</div>`;
  $('main').innerHTML=`<div class="hub">${seg}<div id="abody"></div></div>`;
  $('main').querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{audMode=b.dataset.a;try{speechSynthesis.cancel();}catch(e){}renderAudio();});
  if(audMode==='dict')dictUI();else ygUI();
}
function renderAudio(){audioUI();}
function dictUI(){
  const b=$('abody');
  b.innerHTML=`<div class="note">Диктант: слушаешь предложение, пишешь его, страница показывает, какие слова ты пропустил или написал неверно. Звук идёт от голоса браузера, поэтому он ровнее живой речи: для живой речи используй вкладку «YouGlish и сайты».</div>
   <div class="filter"><label for="dlv">Уровень</label><select id="dlv"><option value="1">1 · B1 простые</option><option value="2">2 · B2 сложнее</option><option value="3">3 · C1 академические</option></select></div>
   <div class="row"><button class="btn" id="dgo">Начать (встроенные)</button><button class="btn ghost" id="dgen">✨ Новые от Claude</button></div><div id="dout"></div><div id="dbox"></div>`;
  $('dlv').value=dLevel;$('dlv').onchange=()=>{dLevel=+$('dlv').value;};
  const run=list=>{dList=list;dIdx=0;step();};
  const step=()=>{if(dIdx>=dList.length){$('dbox').innerHTML=`<div class="qcard"><div class="qtext">Готово! Диктантов выполнено: ${dList.length}</div></div>`;return;}dictCard(dList,dIdx,$('dbox'),()=>{dIdx++;step();});};
  $('dgo').onclick=()=>run(shuffle(DICT_BUILT[dLevel]));
  $('dgen').onclick=async()=>{
    const out=$('dout');if(needAI(out))return;const btn=$('dgen');btn.disabled=true;btn.textContent='Готовлю…';out.innerHTML='';
    const lv={1:'B1, 8-12 words each',2:'B2, 12-18 words each',3:'C1 academic, 16-25 words each'}[dLevel];
    try{const r=await AI.json(`Write 8 original sentences for an English dictation for a Russian-speaking IELTS candidate, level ${lv}. Varied topics and grammar (conditionals, passive, relative clauses, linking words), natural, no names that are hard to spell, normal punctuation. Return ONLY a JSON array of 8 strings.`,{modelTier:'quick',cache:false});
      const a=(Array.isArray(r)?r:r.items||[]).filter(x=>typeof x==='string'&&x.length>15);if(a.length<3)throw 0;run(a);}
    catch(e){out.innerHTML='<div class="warn">Не получилось, попробуй ещё раз.</div>';}
    btn.disabled=false;btn.textContent='✨ Новые от Claude';
  };
}
function ygUI(){
  const b=$('abody');
  b.innerHTML=`<div class="note">YouGlish ищет твоё слово или фразу в тысячах реальных видео и показывает, как это произносят американцы. Встроить его внутрь этой страницы нельзя (так устроена защита страниц), поэтому кнопка откроет его в новой вкладке уже с американским произношением.</div>
   <div class="filter"><label for="ygq">Слово или фраза</label><input type="text" id="ygq" autocomplete="off" autocapitalize="off" placeholder="например: take for granted"></div>
   <div class="row"><button class="btn" id="yggo">Открыть в YouGlish (US)</button><button class="btn ghost" id="ygpick">Взять из моих слов</button></div><div id="ygl"></div>
   <div class="note">Песни и фильмы с упражнениями:</div>
   <ul class="list">
    <li class="item"><div><b>Lingoclip</b><div class="t">Песни, субтитры и упражнения на слова</div></div><div class="row"><a class="btn" target="_blank" rel="noopener" href="https://lingoclip.app/en">Открыть</a></div></li>
    <li class="item"><div><b>ListenInEnglish</b><div class="t">Отрывки из фильмов и сериалов с заданиями</div></div><div class="row"><a class="btn" target="_blank" rel="noopener" href="https://www.listeninenglish.com">Открыть</a></div></li>
    <li class="item"><div><b>Daily Dictation</b><div class="t">Диктанты по записям разной сложности</div></div><div class="row"><a class="btn" target="_blank" rel="noopener" href="https://dailydictation.com">Открыть</a></div></li>
    <li class="item"><div><b>mini-IELTS</b><div class="t">Reading по типам заданий</div></div><div class="row"><a class="btn" target="_blank" rel="noopener" href="https://mini-ielts.com/reading">Открыть</a></div></li></ul>
   <div class="qsub">Эти сайты нельзя включить в мою страницу: у них свои права на песни и клипы, и сторонние сайты не показываются внутри таких страниц. Смотри и слушай там, а незнакомые слова добавляй в свои карточки здесь.</div>`;
  const go=q=>{q=q.trim();if(!q)return;window.open('https://youglish.com/pronounce/'+encodeURIComponent(q)+'/english/us','_blank','noopener');};
  $('yggo').onclick=()=>go($('ygq').value);$('ygq').onkeydown=e=>{if(e.key==='Enter')go($('ygq').value);};
  $('ygpick').onclick=()=>{const pool=ROWS.filter(r=>S.marks&&S.marks[r.w]==='u');const src=pool.length?pool:ROWS;const r=src[Math.floor(Math.random()*src.length)];$('ygq').value=base(r.w);$('ygl').innerHTML=`<div class="qsub">${esc(r.ru)}</div>`;};
}
