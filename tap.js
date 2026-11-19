// Double-tap any English word: small popup with part of speech and translation.
const TAPMAP=new Map();
(function(){
  const add=(k,r)=>{k=k.toLowerCase();if(!TAPMAP.has(k))TAPMAP.set(k,r);};
  ROWS.forEach(r=>{const b=base(r.w).toLowerCase();add(b,r);b.split(/\s+/).length===2&&/^(to|a|an|the)\s/.test(b)&&add(b.replace(/^(to|a|an|the)\s/,''),r);});
  if(typeof IRR!=='undefined')IRR.forEach(r=>{[r[1],r[2]].forEach(f=>f.split('/').forEach(x=>{x=x.replace(/\(.*\)/,'');if(x&&!TAPMAP.has(x))TAPMAP.set(x,{w:r[0],ru:r[3],pos:'verb',def:'форма глагола '+r[0],topic:'Неправильные глаголы'});}));if(!TAPMAP.has(r[0].toLowerCase()))TAPMAP.set(r[0].toLowerCase(),{w:r[0],ru:r[3],pos:'verb',def:'',topic:'Неправильные глаголы'});});
  Object.keys(GLOSS).forEach(k=>{if(!TAPMAP.has(k))TAPMAP.set(k,{w:k,ru:GLOSS[k][1],pos:GLOSS[k][0],def:''});});
  if(typeof WBK!=='undefined')WBK.forEach(t=>t.w.forEach(x=>{if(!TAPMAP.has(x[0].toLowerCase()))TAPMAP.set(x[0].toLowerCase(),{w:x[0],ru:x[2],pos:'',def:''});x[1].forEach(a=>{const k=a.toLowerCase();if(!TAPMAP.has(k))TAPMAP.set(k,{w:a,ru:x[2],pos:'',def:'синоним: '+x[0]});});}));
  const fam=(F)=>F.forEach(f=>{['n','v','adj','adv','p'].filter(k=>f[k]).forEach((k,i)=>{const r=(f.r||'').split('/')[i];f[k].split('/').forEach(w=>{w=w.trim().toLowerCase();if(w&&r&&!TAPMAP.has(w))TAPMAP.set(w,{w,ru:r,pos:({n:'noun',v:'verb',adj:'adjective',adv:'adverb',p:'noun'})[k],def:''});});});});
  if(typeof WB2!=='undefined'){fam(WB2);fam(WB3);}
  if(typeof WB1!=='undefined')WB1.forEach((p,i)=>{const r=WB1RU[i];if(r){if(!TAPMAP.has(p[0]))TAPMAP.set(p[0],{w:p[0],ru:r[0],pos:'',def:''});if(!TAPMAP.has(p[1]))TAPMAP.set(p[1],{w:p[1],ru:r[1],pos:'',def:''});}});
})();
const POSRU={article:'артикль',determiner:'определитель',numeral:'числ.',interjection:'межд.',name:'имя',letter:'буква',noun:'сущ.',verb:'глагол',adjective:'прил.',adverb:'нареч.',phrase:'фраза','phrasal verb':'фразовый гл.',preposition:'предлог',conjunction:'союз',pronoun:'мест.',idiom:'идиома'};
function guessPos(r){
  if(r.pos)return r.pos;
  const d=(r.def||'').toLowerCase();
  if(/^to /.test(d))return 'verb';
  if(/^(a|an|the|someone|something|a person|a place) /.test(d))return 'noun';
  if(/^(having|able|full of|very|not |relating|describing|showing)/.test(d))return 'adjective';
  return '';
}
function variants(w){
  const o=[w];
  if(/ies$/.test(w))o.push(w.slice(0,-3)+'y');
  if(/(es|s)$/.test(w)){o.push(w.replace(/es$/,''));o.push(w.replace(/s$/,''));}
  if(/ied$/.test(w))o.push(w.slice(0,-3)+'y');
  if(/ed$/.test(w)){o.push(w.slice(0,-2));o.push(w.slice(0,-1));if(/(.)\1ed$/.test(w))o.push(w.slice(0,-3));}
  if(/ing$/.test(w)){o.push(w.slice(0,-3));o.push(w.slice(0,-3)+'e');if(/(.)\1ing$/.test(w))o.push(w.slice(0,-4));}
  if(/ly$/.test(w)){o.push(w.slice(0,-2));o.push(w.slice(0,-3)+'le');}
  if(/(er|est)$/.test(w)){o.push(w.replace(/(er|est)$/,''));o.push(w.replace(/(er|est)$/,'')+'e');}
  if(/ier$|iest$/.test(w))o.push(w.replace(/(ier|iest)$/,'y'));
  if(/ness$|ment$/.test(w))o.push(w.replace(/(ness|ment)$/,''));
  return o;
}
function tapFind(w){
  w=w.toLowerCase().replace(/’/g,"'");
  for(const x of [w,w.replace(/'s$/,''),w.replace(/'$/,'')]){for(const v of variants(x)){const r=TAPMAP.get(v);if(r)return {word:w,ru:shortRu(r),pos:guessPos(r),row:r,def:r.def};}}
  return null;
}
function wordAt(x,y){
  let node,off;
  if(document.caretPositionFromPoint){const p=document.caretPositionFromPoint(x,y);if(p){node=p.offsetNode;off=p.offset;}}
  else if(document.caretRangeFromPoint){const r=document.caretRangeFromPoint(x,y);if(r){node=r.startContainer;off=r.startOffset;}}
  if(!node||node.nodeType!==3)return null;
  const t=node.textContent;let a=off,b=off;
  const L=/[A-Za-z'’-]/;
  while(a>0&&L.test(t[a-1]))a--;
  while(b<t.length&&L.test(t[b]))b++;
  const w=t.slice(a,b).replace(/^[-'’]+|[-'’]+$/g,'');
  if(!/^[A-Za-z][A-Za-z'’-]*$/.test(w)||w.length<2)return null;
  // sentence context
  let s=t;const ctxStart=Math.max(t.lastIndexOf('.',a),t.lastIndexOf('?',a),t.lastIndexOf('!',a))+1;
  const e=t.slice(b).search(/[.?!]/);s=t.slice(ctxStart,e<0?t.length:b+e+1).trim();
  return {w,ctx:s};
}
function closeTap(){const p=document.getElementById('tappop');if(p)p.remove();}
function showTap(x,y,hit){
  closeTap();
  const p=document.createElement('div');p.id='tappop';p.className='tappop';
  const word=hit.w;let f=tapFind(word);
  const draw=(f,loading)=>{
    p.innerHTML=`<div class="tw"><b>${esc(word)}</b>${f&&f.pos?`<span class="tpos">${esc(f.pos)}${POSRU[f.pos]?' · '+POSRU[f.pos]:''}</span>`:''}<button class="tx" aria-label="Закрыть">×</button></div>`+
     (f?`<div class="tr">${esc(f.ru)}</div>${f.def?`<div class="td">${esc(f.def)}</div>`:''}`:`<div class="tr">Нет в моём словаре. <a href="https://translate.google.com/?sl=en&tl=ru&text=${encodeURIComponent(word)}&op=translate" target="_blank" rel="noopener">Открыть переводчик</a></div>`)+
     `<div class="tb"><button class="link" data-a="say">Слушать</button>${f&&f.row&&S.marks[f.row.w]!=='u'?'<button class="link" data-a="u">В «Не знаю»</button>':''}</div>`;
    p.querySelector('.tx').onclick=closeTap;
    p.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{if(b.dataset.a==='say')speak(word);else{S.marks[f.row.w]='u';save();b.textContent='Добавлено';b.disabled=true;}});
  };
  document.body.appendChild(p);
  draw(f,false);
  const place=()=>{const r=p.getBoundingClientRect();let left=Math.min(Math.max(8,x-r.width/2),innerWidth-r.width-8),top=y+18;if(top+r.height>innerHeight-8)top=Math.max(8,y-r.height-18);p.style.left=left+'px';p.style.top=top+'px';};
  place();
}
(function(){
  let last={t:0,x:0,y:0},lastShow=0;
  const skip=e=>{const t=e.target;return !t||!t.closest||t.closest('input,textarea,select,.opt,.btn,.tile,.mode,.tappop,.seg,#tabs,.link');};
  const fire=(x,y,e)=>{
    if(Date.now()-lastShow<500)return;
    const h=wordAt(x,y);if(h){lastShow=Date.now();showTap(x,y,h);try{getSelection().removeAllRanges();}catch(_){}}
  };
  document.addEventListener('dblclick',e=>{if(skip(e))return;fire(e.clientX,e.clientY,e);});
  document.addEventListener('touchend',e=>{
    if(skip(e)||!e.changedTouches.length)return;
    const t=e.changedTouches[0],now=Date.now();
    if(now-last.t<380&&Math.abs(t.clientX-last.x)<24&&Math.abs(t.clientY-last.y)<24){fire(t.clientX,t.clientY,e);last.t=0;}
    else last={t:now,x:t.clientX,y:t.clientY};
  },{passive:true});
  document.addEventListener('click',e=>{if(!e.target.closest||!e.target.closest('#tappop'))closeTap();});
  window.addEventListener('scroll',closeTap,{passive:true});
})();
