// Cards (know / don't know), result list, study hub, flashcards, Learn, True/False, Sentences.

/* ---------- Cards: sort into know / don't know ---------- */
let cTopic='all',cFlip=false;
const topics=[...new Set(D.map(d=>d[4]))];
const cLeft=()=>ROWS.filter(r=>!S.marks[r.w]&&(cTopic==='all'||r.topic===cTopic));

function renderCards(){
  const q=cLeft();
  const opts=`<option value="all"${cTopic==='all'?' selected':''}>Все темы</option>`+topics.map(t=>{
    const n=ROWS.filter(r=>!S.marks[r.w]&&r.topic===t).length;
    return `<option value="${esc(t)}"${t===cTopic?' selected':''}>${esc(t)} (${n})</option>`;}).join('');
  let h=`<div class="filter"><label for="topic">Тема</label><select id="topic">${opts}</select></div>`;
  if(!q.length){
    h+=`<div class="empty">${ROWS.some(r=>!S.marks[r.w])?'В этой теме всё отмечено. Выбери другую тему.':'Все слова отмечены.'}<br><br><button class="btn" id="goLearn">Перейти к заучиванию</button></div>`;
    $('main').innerHTML=h+foldersHtml();bindFolders();
    $('topic').onchange=()=>{cTopic=$('topic').value;cFlip=false;render();};
    $('goLearn').onclick=()=>go('learn',null);
    return;
  }
  const c=q[0];
  h+=`<div class="hub">
  <div class="card" id="card" tabindex="0" role="button" aria-label="Перевернуть карточку">
    <div class="topic">${esc(c.topic)}</div>
    <div class="word">${esc(c.w)}</div>
    ${cFlip?`<div class="ru">${esc(c.ru)}</div><div class="def">${esc(c.def)}</div>${EX[c.w]?`<div class="ctx">${exHtml(c).replace(/<\/?div[^>]*>/g,'')}</div>`:(c.ctx?`<div class="ctx">${esc(c.ctx)}</div>`:'')}`:`<div class="hint">Нажми, чтобы увидеть перевод</div>`}
    <button class="speak" id="speak" type="button">Прослушать</button>
  </div>
  <div class="actions"><button class="btn-no" id="no">Не знаю</button><button class="btn-yes" id="yes">Знаю</button></div>
  <div class="sub"><button class="link" id="undo"${S.log.length?'':' disabled'}>Отменить последнюю</button><span>← не знаю, → знаю, пробел: перевернуть</span></div></div>`;
  $('main').innerHTML=h+foldersHtml();bindFolders();
  $('topic').onchange=()=>{cTopic=$('topic').value;cFlip=false;render();};
  const flip=()=>{cFlip=!cFlip;render();};
  $('card').onclick=e=>{if(e.target.id==='speak')return;flip();};
  $('card').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();flip();}};
  $('speak').onclick=e=>{e.stopPropagation();speak(base(c.w));};
  $('yes').onclick=()=>cMark('k');$('no').onclick=()=>cMark('u');$('undo').onclick=cUndo;
  keyHandler=e=>{
    if(e.key==='ArrowRight')cMark('k');
    else if(e.key==='ArrowLeft')cMark('u');
    else if(e.key===' '||e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();flip();}
    else if(e.key==='Backspace')cUndo();
  };
}
function cMark(v){const q=cLeft();if(!q.length)return;S.marks[q[0].w]=v;S.log.push(q[0].w);cFlip=false;save();render();}
function cUndo(){const w=S.log.pop();if(w){delete S.marks[w];cFlip=false;save();render();}}

/* ---------- Result list ---------- */
let copyOpen=false;
function renderResult(){
  const u=ROWS.filter(r=>S.marks[r.w]==='u'),k=ROWS.filter(r=>S.marks[r.w]==='k'),rest=ROWS.filter(r=>!S.marks[r.w]);
  const li=(r,to)=>`<li class="item"><div><b>${esc(r.w)}</b> <span class="r">${esc(r.ru)}</span><div class="t">${esc(r.def)} · ${esc(r.topic)}</div></div><button data-w="${esc(r.w)}" data-to="${to}">${to==='k'?'Знаю':'Не знаю'}</button></li>`;
  let h=`<div class="row"><button class="btn" id="copy"${u.length?'':' disabled'}>Копировать список (${u.length})</button><button class="btn ghost" id="back">К карточкам</button></div>`;
  if(copyOpen)h+=`<textarea id="ta" readonly>${esc(u.map(r=>r.w+' — '+r.ru).join('\n'))}</textarea>`;
  h+=`<h2>Нужно выучить (${u.length})</h2>`;
  h+=u.length?`<ul class="list">${u.map(r=>li(r,'k')).join('')}</ul>`:`<div class="empty">Пока нет слов, отмеченных «Не знаю».</div>`;
  if(rest.length)h+=`<div class="hint">Ещё не просмотрено: ${rest.length}</div>`;
  h+=`<details><summary>Знаю (${k.length})</summary><ul class="list">${k.map(r=>li(r,'u')).join('')}</ul></details>`;
  h+=`<div><button class="link" id="reset">Сбросить все отметки</button></div>`;
  $('main').innerHTML=h;
  $('main').querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>{S.marks[b.dataset.w]=b.dataset.to;save();render();});
  $('back').onclick=()=>go('cards',null);
  $('copy').onclick=async()=>{
    const t=u.map(r=>r.w+' — '+r.ru).join('\n');
    try{await navigator.clipboard.writeText(t);$('copy').textContent='Скопировано';}
    catch(e){copyOpen=true;render();const ta=$('ta');if(ta){ta.focus();ta.select();}}
  };
  $('reset').onclick=()=>{if($('reset').dataset.s){S.marks={};S.log=[];save();render();}else{$('reset').dataset.s=1;$('reset').textContent='Нажми ещё раз, чтобы стереть все отметки';}};
}

/* ---------- Study hub ---------- */
const POOLS={sel:'Выбранные темы и модули',A:'Ядро A',B:'Темы B',C:'Редкие C',mine:'Все «Не знаю»',deck:'Вся колода'};
let selOpen=false,selQ='';
function renderHub(){
  if(!POOLS[S.pool])S.pool='A';
  const opt=Object.keys(POOLS).map(k=>`<option value="${k}"${k===S.pool?' selected':''}>${POOLS[k]} (${poolRows(k,false).length} к изучению)</option>`).join('');
  const all=poolRows(S.pool,true),learnedN=all.filter(r=>S.learned[r.w]).length;
  const modes=[
    ['learn','Заучивание','Раунды по 7 слов: выбор, предложение, ввод слова'],
    ['gap','Предложения','Вставь слово в предложение, учим в контексте'],
    ['match','Подбор','Соедини слово и перевод на время'],
    ['gravity','Гравитация','Сбивай астероиды с нужным словом'],
    ['tf','Верно / неверно','Подходит ли значение слову?'],
    ['flash','Карточки','Перевернуть и оценить себя']
  ];
  $('main').innerHTML=`<div class="hub">
    <div class="filter"><label for="pool">Слова</label><select id="pool">${opt}</select></div>
    ${S.pool==='sel'?selHtml():''}
    <div class="note">Выучено в этой группе: ${learnedN} из ${all.length}. Слово считается выученным, когда ты верно ввела его в раунде заучивания.</div>
    <div class="modes">${modes.map(m=>`<button class="mode" data-m="${m[0]}"><b>${m[1]}</b><span>${m[2]}</span></button>`).join('')}</div>
    <label class="check"><input type="checkbox" id="typed"${S.typed?' checked':''}> В режиме «Предложения» вводить слово вручную</label>
  </div>`;
  $('pool').onchange=()=>{S.pool=$('pool').value;save();render();};
  if(S.pool==='sel')bindSel();
  $('typed').onchange=()=>{S.typed=$('typed').checked;save();};
  $('main').querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>go('learn',b.dataset.m));
}
function emptyPool(msg){
  summary('Здесь пока пусто',`<div class="qsub">${msg}</div>`,[{t:'К режимам',f:()=>go('learn',null)}]);
}

/* ---------- Flashcards of the pool ---------- */
let fFlip=false;const fSkip={};
function startFlash(){
  const q=poolRows(S.pool,false).sort((a,b)=>(fSkip[a.w]||0)-(fSkip[b.w]||0));
  let h=`<div class="qhead"><button class="link" id="fexit">К режимам</button><span>Осталось ${q.length}</span></div>`;
  if(!q.length){h+=`<div class="empty">В этой группе всё выучено.</div>`;$('main').innerHTML=`<div class="hub">${h}</div>`;$('fexit').onclick=()=>go('learn',null);return;}
  const c=q[0];
  h+=`<div class="card" id="lcard" tabindex="0" role="button" aria-label="Перевернуть карточку">
    <div class="topic">${esc(c.topic)}</div><div class="word">${esc(base(c.w))}</div>
    ${fFlip?`<div class="ru">${esc(c.ru)}</div><div class="def">${esc(c.def)}</div>${EX[c.w]?`<div class="ctx">${esc(EX[c.w]).replace(/\{(.+?)\}/,'<b>$1</b>')}</div>`:''}`:`<div class="hint">Вспомни перевод, потом нажми на карточку</div>`}
    <button class="speak" id="lspeak" type="button">Прослушать</button></div>
    <div class="actions"><button class="btn-no" id="lagain">Ещё раз</button><button class="btn-yes" id="ldone">Выучила</button></div>
    <div class="sub"><span>«Ещё раз» уводит слово в конец очереди. ← ещё раз, → выучила, пробел: перевернуть</span></div>`;
  $('main').innerHTML=`<div class="hub">${h}</div>`;
  $('fexit').onclick=()=>go('learn',null);
  const flip=()=>{fFlip=!fFlip;render();};
  $('lcard').onclick=e=>{if(e.target.id==='lspeak')return;flip();};
  $('lcard').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();flip();}};
  $('lspeak').onclick=e=>{e.stopPropagation();speak(base(c.w));};
  const mark=ok=>{if(ok){S.learned[c.w]=1;S.lvl[c.w]=3;addXP(3);}else fSkip[c.w]=Math.max(0,...Object.values(fSkip))+1;fFlip=false;save();render();};
  $('lagain').onclick=()=>mark(false);$('ldone').onclick=()=>mark(true);
  keyHandler=e=>{
    if(e.key==='ArrowRight')mark(true);else if(e.key==='ArrowLeft')mark(false);
    else if(e.key===' '||e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();flip();}
  };
}

/* ---------- Learn: rounds of 7 with growing difficulty ---------- */
function learnQ(r,retry){
  const lv=S.lvl[r.w]||0;
  let q;
  if(lv<=0)q=Math.random()<.5?qWordRu(r):qDef(r);
  else if(lv===1)q=EX[r.w]?qGap(r,true):qRuWord(r);
  else q=qType(r);
  q.retry=retry;
  return q;
}
function startLearn(){
  const pool=poolRows(S.pool,false);
  if(!pool.length)return emptyPool('Все слова в этой группе выучены. Выбери другую группу или повтори слова в других режимах.');
  const round=shuffle(pool).slice(0,7);
  let queue=round.slice(),retry=[],first={},okSet=new Set(),xp=0;
  runQuiz({
    auto:true,
    next(){
      if(!queue.length&&retry.length){queue=retry;retry=[];}
      if(!queue.length)return null;
      const r=queue.shift();
      return learnQ(r,r.w in first);
    },
    progress:()=>`${okSet.size} / ${round.length}`,
    onAnswer(q,ok){
      const w=q.row.w,isFirst=!(w in first);
      if(ok){
        if(isFirst){S.lvl[w]=Math.min(3,(S.lvl[w]||0)+1);xp+=10;}else xp+=3;
        okSet.add(w);
        if((S.lvl[w]||0)>=3)S.learned[w]=1;
      }else{
        if(isFirst)S.lvl[w]=Math.max(0,(S.lvl[w]||0)-1);
        retry.push(q.row);
      }
      if(isFirst)first[w]=ok;
      save();
    },
    onFinish(){
      addXP(xp);
      const nl=round.filter(r=>S.learned[r.w]).length;
      const lines=`<div class="qsub">Получено ${xp} XP. Выучено в этом раунде: ${nl}.</div><ul class="list">${round.map(r=>`<li class="item"><div><b>${esc(base(r.w))}</b> <span class="r">${esc(shortRu(r))}</span><div class="t">Уровень ${S.learned[r.w]?'3 из 3, выучено':(S.lvl[r.w]||0)+' из 3'}${first[r.w]?'':' · была ошибка'}</div></div></li>`).join('')}</ul>`;
      summary('Раунд закончен',lines,[{t:'Следующий раунд',f:startLearn},{t:'К режимам',ghost:true,f:()=>go('learn',null)}]);
    }
  });
}

/* ---------- True / False ---------- */
function startTF(){
  let src=poolRows(S.pool,true);
  if(src.length<6)src=ROWS.slice();
  const rows=shuffle(src).slice(0,10);
  let i=0,right=0;
  runQuiz({
    auto:true,
    next(){
      if(i>=rows.length)return null;
      const r=rows[i++];
      const truth=Math.random()<.5,useDef=Math.random()<.5;
      let other=rows.length>1?shuffle(src.filter(x=>x.w!==r.w))[0]:r;
      const text=x=>useDef?x.def:shortRu(x);
      const shown=truth?text(r):text(other);
      return {kind:'tf',row:r,opts:['Верно','Неверно'],ai:truth?0:1,
        prompt:`<div class="qlabel">Верно ли, что слово означает…?</div><div class="qtext">${esc(base(r.w))}</div><div class="qsub">= ${esc(shown)}</div>`,
        explain:explainRow(r)};
    },
    progress:()=>`${Math.min(i,rows.length)} / ${rows.length}`,
    onAnswer(q,ok){if(ok)right++;},
    onFinish(){
      const xp=right*5;addXP(xp);
      summary('Готово',`<div class="qsub">Верно ${right} из ${rows.length}. Получено ${xp} XP.</div>`,[{t:'Ещё раз',f:startTF},{t:'К режимам',ghost:true,f:()=>go('learn',null)}]);
    }
  });
}

/* ---------- Sentences (words in context) ---------- */
function startGap(){
  let src=poolRows(S.pool,true).filter(r=>EX[r.w]);
  if(src.length<4)src=ROWS.filter(r=>EX[r.w]);
  if(src.length<4)return emptyPool('Для этой группы пока нет предложений.');
  // prefer words not yet learned
  const fresh=shuffle(src.filter(r=>!S.learned[r.w])),rest=shuffle(src.filter(r=>S.learned[r.w]));
  const rows=fresh.concat(rest).slice(0,10);
  let i=0,right=0;
  runQuiz({
    auto:true,
    next(){
      if(i>=rows.length)return null;
      const r=rows[i++];
      return S.typed?qType(r):qGap(r,false);
    },
    progress:()=>`${Math.min(i,rows.length)} / ${rows.length}`,
    onAnswer(q,ok){if(ok)right++;},
    onFinish(){
      const xp=right*6;addXP(xp);
      summary('Готово',`<div class="qsub">Верно ${right} из ${rows.length}. Получено ${xp} XP.</div>`,[{t:'Ещё раз',f:startGap},{t:'К режимам',ghost:true,f:()=>go('learn',null)}]);
    }
  });
}

/* ---------- Pick any topics and modules ---------- */
function topicStats(){
  const m=new Map();
  ROWS.forEach(r=>{let t=m.get(r.topic);if(!t){t={n:0,u:0,k:0};m.set(r.topic,t);}t.n++;if(S.marks[r.w]==='u')t.u++;else if(S.marks[r.w]==='k')t.k++;});
  return m;
}
function selHtml(){
  const st=topicStats(),sel=new Set(S.sel||[]);
  const mods=[...st.keys()].filter(t=>t.startsWith('Модуль')),own=[...st.keys()].filter(t=>!t.startsWith('Модуль'));
  const item=t=>{const s=st.get(t);return `<label class="selrow" data-q="${esc(t.toLowerCase())}"><input type="checkbox" data-t="${esc(t)}"${sel.has(t)?' checked':''}><span>${esc(t)}</span><em>${s.n-s.k} к изучению</em></label>`;};
  return `<details class="selbox" id="selbox"${selOpen?' open':''}><summary>Выбрано тем и модулей: ${sel.size}</summary>
    <div class="row"><input type="search" id="selq" placeholder="Найти тему" value="${esc(selQ)}"><button class="link" id="selmods">Все модули</button><button class="link" id="selclear">Сбросить</button></div>
    <label class="check"><input type="checkbox" id="selu"${S.selU?' checked':''}> Только слова, отмеченные «Не знаю»</label>
    <div class="selgrid">${own.concat(mods).map(item).join('')}</div></details>`;
}
function bindSel(){
  const box=$('selbox');
  box.ontoggle=()=>{selOpen=box.open;};
  box.querySelectorAll('input[data-t]').forEach(i=>i.onchange=()=>{
    const s=new Set(S.sel||[]);i.checked?s.add(i.dataset.t):s.delete(i.dataset.t);S.sel=[...s];save();selOpen=true;render();});
  $('selu').onchange=()=>{S.selU=$('selu').checked;save();selOpen=true;render();};
  $('selmods').onclick=()=>{S.sel=[...new Set(ROWS.map(r=>r.topic))].filter(t=>t.startsWith('Модуль'));save();selOpen=true;render();};
  $('selclear').onclick=()=>{S.sel=[];save();selOpen=true;render();};
  const apply=()=>box.querySelectorAll('.selrow').forEach(l=>{l.hidden=!!selQ&&!l.dataset.q.includes(selQ.toLowerCase());});
  $('selq').oninput=()=>{selQ=$('selq').value;apply();};apply();
}

/* ---------- Folders of known / unknown words on the Cards tab ---------- */
const fOpen=new Set();
function foldersHtml(){
  const by={k:new Map(),u:new Map()};
  ROWS.forEach(r=>{const m=S.marks[r.w];if(m==='k'||m==='u'){if(!by[m].has(r.topic))by[m].set(r.topic,0);by[m].set(r.topic,by[m].get(r.topic)+1);}});
  const sec=(m,title)=>{
    const n=[...by[m].values()].reduce((a,b)=>a+b,0);
    return `<details class="fold" data-k="${m}"${fOpen.has(m)?' open':''}><summary>${title} (${n})</summary>${n?[...by[m]].map(([t,c])=>`<details class="fold2" data-s="${m}" data-t="${esc(t)}"${fOpen.has(m+'|'+t)?' open':''}><summary>${esc(t)} (${c})</summary><ul class="list"></ul></details>`).join(''):'<div class="hint">Пока пусто</div>'}</details>`;};
  return `<div class="folders"><h2>Папки</h2>${sec('u','Незнакомые слова')}${sec('k','Знакомые слова')}</div>`;
}
function fillFold(d){
  const s=d.dataset.s,t=d.dataset.t,ul=d.querySelector('ul');
  ul.innerHTML=ROWS.filter(r=>r.topic===t&&S.marks[r.w]===s).map(r=>`<li class="item"><div><b>${esc(r.w)}</b> <span class="r">${esc(r.ru)}</span><div class="t">${esc(r.def)}</div></div><div class="row"><button class="link" data-say="${esc(base(r.w))}">Слушать</button><button data-w="${esc(r.w)}" data-to="${s==='k'?'u':'k'}">${s==='k'?'Не знаю':'Знаю'}</button></div></li>`).join('');
  ul.querySelectorAll('[data-say]').forEach(b=>b.onclick=()=>speak(b.dataset.say));
  ul.querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>{S.marks[b.dataset.w]=b.dataset.to;save();render();});
}
function bindFolders(){
  document.querySelectorAll('.fold').forEach(d=>d.addEventListener('toggle',()=>{d.open?fOpen.add(d.dataset.k):fOpen.delete(d.dataset.k);}));
  document.querySelectorAll('.fold2').forEach(d=>{
    d.addEventListener('toggle',()=>{const k=d.dataset.s+'|'+d.dataset.t;if(d.open){fOpen.add(k);if(!d.dataset.f){d.dataset.f=1;fillFold(d);}}else fOpen.delete(k);});
    if(d.open){d.dataset.f=1;fillFold(d);}
  });
}
