// Spelling trainer: dictation, find-the-error, Russian -> English, rules, personal error log.
const MS=`accommodation|accomodation achieve|acheive environment|enviroment government|goverment definitely|definately separate|seperate necessary|neccessary occurred|occured receive|recieve believe|beleive beginning|begining embarrass|embarass foreign|foriegn height|hieght independent|independant knowledge|knowlege library|libary millennium|millenium noticeable|noticable occasion|ocassion privilege|priviledge recommend|reccomend restaurant|restaraunt successful|succesful surprise|suprise tomorrow|tommorow until|untill weird|wierd writing|writting argument|arguement calendar|calender committee|commitee conscience|concience convenient|convinient disappoint|dissapoint existence|existance experience|experiance February|Febuary friend|freind grammar|grammer guarantee|garantee immediately|immediatly language|langauge licence|lisence maintenance|maintainance opportunity|oppurtunity particular|particuler physical|phisical possession|posession pronunciation|pronounciation psychology|phsychology queue|que rhythm|rythm schedule|shedule sufficient|sufficent temperature|temperture thorough|thorogh together|togather truly|truely unfortunately|unfortunatly Wednesday|Wensday which|wich advertisement|advertisment available|availible benefit|benifit business|buisness challenge|challange communicate|comunicate community|comunity develop|develope disease|desease education|educaton efficient|eficient especially|expecially essential|esential evidence|evidance exercise|excercise fascinating|fasinating forty|fourty happened|hapened important|importent increase|incerase individual|indevidual interfere|interfer literature|litrature marriage|marraige medicine|medecine ordinary|ordinery parliament|parliment peculiar|peculier permanent|permenent population|populaton profession|proffession relevant|relevent responsible|responsable sentence|sentance similar|similiar strength|strenght technology|tecnology variety|varierty vegetable|vegetible`.split(' ').map(s=>s.split('|'));
const RULES=[
 ['i before e, except after c','believe','beleive','receive','recieve','Правило: i перед e, кроме после c (receive), но weird, height, foreign — исключения.'],
 ['Удвоение согласной','beginning','begining','Короткий ударный слог перед -ing/-ed: begin → beginning.'],
 ['Удвоение согласной','occurred','occured','occur → occurred: ударение на последнем слоге.'],
 ['Без удвоения','visited','visitted','Ударение не на последнем слоге: visit → visited.'],
 ['Немое e перед -ing','writing','writeing','Немое e пропадает: write → writing.'],
 ['Немое e сохраняется','management','managment','После немого e суффикс -ment не убирает e: manage → management.'],
 ['y → ies','studies','studys','Согласная + y: study → studies.'],
 ['y после гласной','enjoys','enjoies','Гласная + y: просто -s.'],
 ['y → i','happiness','happyness','happy → happiness.'],
 ['Множественное -o','potatoes','potatos','potato → potatoes, но photos, pianos.'],
 ['-f → -ves','knives','knifes','knife → knives, leaf → leaves.'],
 ['-able / -ible','responsible','responsable','responsible, possible, flexible — -ible.'],
 ['-able / -ible','comfortable','comfortible','comfortable, reliable, available — -able.'],
 ['-ance / -ence','independence','independance','independent → independence.'],
 ['-ance / -ence','importance','importence','important → importance.'],
 ['-ise / -ize','realise','realize','В британском написании обычно -ise (realise, organise).'],
 ['Британская орфография','colour','color','Британский вариант: colour, favourite, neighbour.'],
 ['Британская орфография','centre','center','Британский вариант: centre, theatre.'],
 ['-ful','useful','usefull','Суффикс -ful с одной l.'],
 ['all- / al-','already','allready','already, always, almost — одна l.'],
 ['-ly','completely','completly','Прилагательное с e + ly: complete → completely.'],
 ['-ly','truly','truely','Исключение: true → truly.'],
 ['Приставки','disappear','dissapear','dis + appear: одна s, пара pp.'],
 ['Приставки','unnecessary','unecessary','un + necessary: двойная n.'],
 ['Приставки','irregular','iregular','ir + regular: двойная r.'],
 ['Омофоны','their','there','Принадлежность: their book. Место: there.'],
 ['Омофоны','whose','who\'s','who\'s = who is; whose = чей.'],
 ['Омофоны','affect','effect','affect — глагол (влиять), effect — существительное (эффект).'],
 ['Омофоны','principal','principle','principal — главный, principle — принцип.']
];
let spellMode=null;
const gold=w=>w;
function mutate(w){
  const out=new Set();
  const i=Math.max(1,Math.floor(w.length/2));
  out.add(w.slice(0,i)+w[i+1]+w[i]+w.slice(i+2));
  for(let k=1;k<w.length;k++)if(w[k]===w[k-1]){out.add(w.slice(0,k)+w.slice(k+1));break;}
  for(let k=1;k<w.length-1;k++)if(!/[aeiou]/.test(w[k])&&w[k]!==w[k+1]){out.add(w.slice(0,k)+w[k]+w.slice(k));break;}
  out.delete(w);return [...out];
}
function diffHtml(a,b){
  let p=0;while(p<a.length&&p<b.length&&a[p]===b[p])p++;
  let s=0;while(s<a.length-p&&s<b.length-p&&a[a.length-1-s]===b[b.length-1-s])s++;
  const f=(x)=>esc(x.slice(0,p))+'<mark>'+esc(x.slice(p,x.length-s))+'</mark>'+esc(x.slice(x.length-s));
  return f(a);
}
function logErr(w,ok){
  S.spErr=S.spErr||{};
  if(!ok)S.spErr[w]=(S.spErr[w]||0)+2;
  else if(S.spErr[w]){S.spErr[w]--;if(S.spErr[w]<=0)delete S.spErr[w];}
}
function typeQ(w,label,pre,sub){
  return {kind:'type',w,answer:[w],show:w,
    prompt:`<div class="qlabel">${label}</div>${pre}${sub?`<div class="qsub">${sub}</div>`:''}`,
    onShow(){const b=$('spk');if(b){b.onclick=()=>speak(w);setTimeout(()=>speak(w),150);}},
    explainFn(ok,typed){logErr(w,ok);save();
      return `<div>${!ok&&typed?`Ты написала: ${diffHtml(typed,w)}`:''}</div><button class="link" data-say="${esc(w)}">Послушать</button>`;}};
}
function poolWords(){
  let r=[];try{r=poolRows(S.pool,true);}catch(e){}
  if(!r.length)r=ROWS.filter(x=>TA.has(x.w));
  return r.filter(x=>/^[A-Za-z' -]+$/.test(base(x.w)));
}
function buildSpell(m){
  const n=10;
  if(m==='dict'){
    const src=shuffle(MS).slice(0,Math.ceil(n/2)).map(x=>x[0]).concat(shuffle(poolWords()).slice(0,Math.floor(n/2)).map(r=>base(r.w)));
    return shuffle(src).map(w=>{const r=byW[w];return typeQ(w,'Диктант','<div class="qtext">Послушай и напиши</div><button class="btn" id="spk">Слушать</button>',r?esc(shortRu(r)):'');});
  }
  if(m==='ru'){
    return shuffle(poolWords()).slice(0,n).map(r=>{const w=base(r.w);return typeQ(w,'С русского',`<div class="qtext">${esc(shortRu(r))}</div>`,esc(r.def||''));});
  }
  if(m==='find'){
    return shuffle(MS).slice(0,n).map(([c,w])=>{
      const opts=shuffle([c,w,...shuffle(mutate(c)).slice(0,2)].filter((x,i,a)=>a.indexOf(x)===i));
      return {kind:'mc',opts,ai:opts.indexOf(c),w:c,prompt:'<div class="qlabel">Найди ошибку</div><div class="qtext">Какое написание верное?</div>',
        explainFn(ok){logErr(c,ok);save();return `<div><b>${esc(c)}</b></div><button class="link" data-say="${esc(c)}">Послушать</button>`;}};
    });
  }
  if(m==='rules'){
    return shuffle(RULES).slice(0,n).map(([h,c,w,why])=>{
      const opts=shuffle([c,w]);
      return {kind:'mc',opts,ai:opts.indexOf(c),prompt:`<div class="qlabel">${esc(h)}</div><div class="qtext">Какое написание верное?</div>`,explain:`<div>${esc(why)}</div>`};
    });
  }
  if(m==='errs'){
    return shuffle(Object.keys(S.spErr||{})).slice(0,n).map(w=>{const r=byW[w];return typeQ(w,'Твои ошибки','<div class="qtext">Послушай и напиши</div><button class="btn" id="spk">Слушать</button>',r?esc(shortRu(r)):'');});
  }
  return [];
}
function renderSpell(){
  if(spellMode)return playSpell(spellMode);
  const ne=Object.keys(S.spErr||{}).length;
  $('main').innerHTML=`<div class="hub"><div class="note">Пиши по буквам, без подсказок автозамены. В ответ с ошибкой я подсвечиваю, где ты ошиблась. Слова, где были ошибки, попадают в «Мои ошибки».</div><div class="modes">
   <button class="mode" data-s="dict"><b>Диктант</b><span>Слушай и пиши</span></button>
   <button class="mode" data-s="find"><b>Найди ошибку</b><span>Частые ошибки в IELTS</span></button>
   <button class="mode" data-s="ru"><b>С русского</b><span>Слова из твоего списка</span></button>
   <button class="mode" data-s="rules"><b>Правила</b><span>Удвоение, -ie-, суффиксы</span></button>
   <button class="mode" data-s="errs"${ne?'':' disabled'}><b>Мои ошибки</b><span>${ne?ne+' слов':'пока пусто'}</span></button></div></div>`;
  $('main').querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{spellMode=b.dataset.s;render();});
}
function playSpell(m){
  const items=buildSpell(m),total=items.length;
  if(!total){spellMode=null;return render();}
  let queue=items.slice(),retry=[],okN=0,xp=0,first=new Set();
  runQuiz({auto:true,onExit:()=>{spellMode=null;render();},
    next(){if(!queue.length&&retry.length){queue=retry;retry=[];}return queue.shift()||null;},
    progress:()=>`Верно: ${okN} из ${total}`,
    onAnswer(q,ok){const id=q.w||q.prompt;if(!first.has(id)){first.add(id);if(ok){okN++;xp+=4;}else retry.push(q);}else if(ok)xp+=1;},
    onFinish(){addXP(xp);save();summary('Готово',`<div class="qsub">С первой попытки верно: ${okN} из ${total}. Получено ${xp} XP.</div>`,[{t:'Ещё раз',f:()=>playSpell(m)},{t:'К режимам',ghost:true,f:()=>{spellMode=null;render();}}]);}});
}
