// "Лексика" tab: word building, collocations, phrasal verbs and the IELTS tests vocabulary.
let lexView=null;
function openLearn(topics){S.pool='sel';S.sel=topics;S.selU=false;selOpen=false;save();go('learn',null);}
function topicList(test){
  const st=topicStats();
  return [...st.keys()].filter(test).map(t=>({t,s:st.get(t)}));
}
function lexRow(t,s,id){
  return `<li class="item"><div><b>${esc(t)}</b><div class="t">Слов: ${s.n} · знаю ${s.k} · не знаю ${s.u}</div></div><div class="row"><button class="btn" data-open="${id}">Учить</button></div></li>`;
}
function renderLex(){
  if(lexView==='wb')return renderWB();
  if(lexView==='col'||lexView==='pv'||lexView==='book')return renderLexList(lexView);
  $('main').innerHTML=`<div class="hub"><div class="note">Лексика, которая нужна для Band 7–8: словообразование, коллокации (какие слова сочетаются друг с другом), фразовые глаголы и слова из твоих книг по IELTS. Любую тему можно учить во всех режимах и играх.</div>
   <div class="modes">
    <button class="mode" data-v="wb"><b>Словообразование</b><span>От простого к сложному: приставки, суффиксы, семьи слов</span></button>
    <button class="mode" data-v="col"><b>Коллокации</b><span>${topicList(t=>t.startsWith('Коллокации')).length} тем: сочетания слов по темам IELTS</span></button>
    <button class="mode" data-v="pv"><b>Фразовые глаголы</b><span>${topicList(t=>/PV|phrasal/i.test(t)).length} модулей по темам</span></button>
    <button class="mode" data-v="book"><b>IELTS-лексика из книги</b><span>Академические слова и выражения из тестов</span></button></div></div>`;
  $('main').querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{lexView=b.dataset.v;render();});
}
function renderLexList(v){
  const cfg={col:['Коллокации по темам',t=>t.startsWith('Коллокации'),'colloc'],pv:['Фразовые глаголы',t=>/PV|phrasal/i.test(t),'pv'],book:['IELTS-лексика из книги',t=>t.startsWith('Книга'),'words']}[v];
  const list=topicList(cfg[1]);
  $('main').innerHTML=`<div class="hub"><div class="qhead"><button class="link" id="lback">Лексика</button><span>${cfg[0]}</span></div>
   <div class="note">«Учить» открывает тему в режимах заучивания и играх. «✨ Задания от Claude» создаёт новые упражнения на лексике этой темы: каждый раз разные.</div>
   <ul class="list">${list.map(({t,s},i)=>`<li class="item"><div><b>${esc(t)}</b><div class="t">Слов: ${s.n} · знаю ${s.k} · не знаю ${s.u}</div></div><div class="row"><button class="btn" data-open="${i}">Учить</button><button class="btn ghost" data-gen="${i}">✨ Задания от Claude</button></div></li>`).join('')}</ul><div id="lout"></div></div>`;
  $('lback').onclick=()=>{lexView=null;render();};
  $('main').querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openLearn([list[+b.dataset.open].t]));
  $('main').querySelectorAll('[data-gen]').forEach(b=>b.onclick=()=>{
    const t=list[+b.dataset.gen].t,name=t.replace(/^.*· /,'');
    if(cfg[2]==='words'){const ws=shuffle(ROWS.filter(r=>r.topic===t)).slice(0,12).map(r=>base(r.w));genLex('words',name,ws,$('lout'),b);}
    else genLex(cfg[2],name,[],$('lout'),b);
  });
}
