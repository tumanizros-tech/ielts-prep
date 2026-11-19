// Shared state, helpers, word pools. Storage key is unchanged so earlier marks survive.
const KEY='ielts-vocab-v1';
const S={marks:{},log:[],learned:{},lvl:{},xp:0,streak:{last:'',n:0},best:{},gram:{},pool:'A',typed:false};
try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s)for(const k in s)S[k]=s[k];}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}

const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const norm=s=>String(s).toLowerCase().replace(/[’]/g,"'").replace(/\s+/g,' ').trim();

const ROWS=D.map(d=>({w:d[0],ru:d[1],def:d[2],ctx:d[3],topic:d[4],pos:d[5]||''}));
const byW=Object.fromEntries(ROWS.map(r=>[r.w,r]));
const base=w=>w.replace(/\s*\(.*?\)\s*/g,' ').replace(/\s+/g,' ').trim();
const shortRu=r=>r.ru.split(/[;,(]/)[0].trim();

function speak(t){
  try{const u=new SpeechSynthesisUtterance(t);u.lang='en-GB';u.rate=.9;speechSynthesis.cancel();speechSynthesis.speak(u);}catch(e){}
}

// XP and day streak
const dayStr=ms=>new Date(ms).toLocaleDateString('sv');
function addXP(n){
  if(!n)return;
  S.xp+=n;
  const t=dayStr(Date.now());
  if(S.streak.last!==t){S.streak.n=S.streak.last===dayStr(Date.now()-864e5)?S.streak.n+1:1;S.streak.last=t;}
  save();renderHud();
}
function renderHud(){
  const t=dayStr(Date.now()),y=dayStr(Date.now()-864e5);
  const n=(S.streak.last===t||S.streak.last===y)?S.streak.n:0;
  $('hud').innerHTML=`<span class="pill">Серия ${n} дн.</span><span class="pill">${S.xp} XP</span>`;
}

// Tiers and pools
const TNAME={A:'A · ядро',B:'B · по темам',C:'C · редкие'};
const tierOf=w=>TA.has(w)?'A':TC.has(w)?'C':(byW[w]&&byW[w].topic.startsWith('IELTS+'))?'A':'B';
function lall(){
  const st=new Set(UNK);
  ROWS.forEach(r=>{if(S.marks[r.w]==='u')st.add(r.w);});
  return [...st].filter(w=>byW[w]&&S.marks[w]!=='k');
}
function poolRows(key,incLearned){
  let ws;
  if(key==='deck')ws=ROWS.map(r=>r.w);
  else if(key==='sel'){const sel=new Set(S.sel||[]);ws=ROWS.filter(r=>sel.has(r.topic)&&S.marks[r.w]!=='k'&&(!S.selU||S.marks[r.w]==='u')).map(r=>r.w);}
  else{ws=lall();if(key!=='mine')ws=ws.filter(w=>tierOf(w)===key);}
  if(!incLearned)ws=ws.filter(w=>!S.learned[w]);
  return ws.map(w=>byW[w]);
}

// Example sentences
const exSurface=w=>{const m=EX[w]&&EX[w].match(/\{(.+?)\}/);return m?m[1]:base(w);};
const exBlank=w=>EX[w].replace(/\{.+?\}/,'_____');
const shape=s=>/\s/.test(s)?'mw':/ing$/.test(s)?'ing':/ed$/.test(s)?'ed':/ly$/.test(s)?'ly':/s$/.test(s)?'s':'b';
function exHtml(r){
  if(EX[r.w])return `<div class="qsub">${esc(EX[r.w]).replace(/\{(.+?)\}/,'<b>$1</b>')}</div>`;
  return r.ctx?`<div class="qsub">«${esc(r.ctx)}»</div>`:'';
}
function explainRow(r){
  return `<div><b>${esc(base(r.w))}</b>: ${esc(r.ru)}</div><div class="qsub">${esc(r.def)}</div>${exHtml(r)}<div><button class="speak" data-say="${esc(base(r.w))}" type="button">Прослушать</button></div>`;
}

// Answer options for multiple choice
function makeOpts(r,textOf,shapeOf){
  let src=poolRows(S.pool,true);
  if(src.length<12)src=ROWS;
  const own=textOf(r),seen=new Set([norm(own)]);
  let c=shuffle(src.filter(x=>x.w!==r.w));
  if(shapeOf){const sh=shapeOf(r);c=[...c.filter(x=>shapeOf(x)===sh),...c.filter(x=>shapeOf(x)!==sh)];}
  const out=[own];
  for(const x of c){const t=textOf(x);if(!t||seen.has(norm(t)))continue;seen.add(norm(t));out.push(t);if(out.length===4)break;}
  const opts=shuffle(out);
  return {opts,ai:opts.indexOf(own)};
}

// Question builders (used by Learn, Sentences, True/False)
function qDef(r){
  const o=makeOpts(r,x=>base(x.w));
  return {kind:'mc',row:r,prompt:`<div class="qlabel">Какое слово подходит под определение?</div><div class="qtext">${esc(r.def)}</div>`,opts:o.opts,ai:o.ai,explain:explainRow(r)};
}
function qWordRu(r){
  const o=makeOpts(r,x=>shortRu(x));
  return {kind:'mc',row:r,prompt:`<div class="qlabel">Выбери перевод</div><div class="qtext">${esc(base(r.w))}</div>`,opts:o.opts,ai:o.ai,explain:explainRow(r)};
}
function qRuWord(r){
  const o=makeOpts(r,x=>base(x.w));
  return {kind:'mc',row:r,prompt:`<div class="qlabel">Выбери слово</div><div class="qtext">${esc(r.ru)}</div>`,opts:o.opts,ai:o.ai,explain:explainRow(r)};
}
function qGap(r,showRu){
  const o=makeOpts(r,x=>exSurface(x.w),x=>shape(exSurface(x.w)));
  return {kind:'mc',row:r,prompt:`<div class="qlabel">Вставь подходящее слово</div><div class="qtext">${esc(exBlank(r.w))}</div>${showRu?`<div class="qsub">Подсказка: ${esc(shortRu(r))}</div>`:''}`,opts:o.opts,ai:o.ai,explain:explainRow(r)};
}
function qType(r){
  const b=base(r.w);
  if(EX[r.w]){
    const s=exSurface(r.w);
    return {kind:'type',row:r,prompt:`<div class="qlabel">Впиши слово</div><div class="qtext">${esc(exBlank(r.w))}</div><div class="qsub">Подсказка: ${esc(shortRu(r))}</div>`,answer:[s,b],show:s,hint:`Первая буква: ${s[0]}`,explain:explainRow(r)};
  }
  return {kind:'type',row:r,prompt:`<div class="qlabel">Впиши английское слово</div><div class="qtext">${esc(r.ru)}</div><div class="qsub">${esc(r.def)}</div>`,answer:[b],show:b,hint:`Первая буква: ${b[0]}`,explain:explainRow(r)};
}

// Summary screen
function summary(title,lines,btns){
  $('main').innerHTML=`<div class="hub"><div class="qcard"><div class="qtext">${title}</div>${lines}</div><div class="row">${btns.map((b,i)=>`<button class="btn${b.ghost?' ghost':''}" data-b="${i}">${esc(b.t)}</button>`).join('')}</div></div>`;
  $('main').querySelectorAll('[data-b]').forEach(el=>el.onclick=btns[+el.dataset.b].f);
}
