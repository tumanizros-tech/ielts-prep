// Speaking tabs: write answers by topic for Part 1, 2 and 3.
const SPT=[
{id:'home',n:'Дом и район',p1:['Do you live in a house or a flat?','What do you like most about your home?','Would you like to move somewhere else in the future?'],p2:['Describe a place where you like to spend time at home','You should say: where it is; what it looks like; what you do there; and explain why you like it'],p3:['How have homes changed in your country over the last few decades?','Why do some people prefer living in the city centre?','Should governments control the price of housing?']},
{id:'work',n:'Работа и учёба',p1:['Do you work or are you a student?','What do you find most interesting about your studies or job?','Would you like to change your job in the future?'],p2:['Describe a job you would like to do in the future','You should say: what the job is; what skills it needs; how you could prepare; and explain why it appeals to you'],p3:['What qualities make someone good at their job?','Is job satisfaction more important than salary?','How will technology change the world of work?']},
{id:'free',n:'Хобби и свободное время',p1:['What do you do in your free time?','Do you prefer spending time alone or with others?','Has your hobby changed since childhood?'],p2:['Describe a hobby you enjoy','You should say: what it is; how you started; how often you do it; and explain why you like it'],p3:['Why do people need hobbies?','Do people today have less free time than in the past?','Should schools encourage hobbies?']},
{id:'food',n:'Еда и кафе',p1:['What kind of food do you enjoy?','Do you cook at home often?','Do you think eating habits have changed in your country?'],p2:['Describe a meal you remember well','You should say: when and where you had it; who was there; what you ate; and explain why it was memorable'],p3:['Why is fast food so popular?','Should governments tax unhealthy food?','How important are family meals?']},
{id:'travel',n:'Путешествия',p1:['Do you like travelling?','What was the last place you visited?','Do you prefer travelling alone or with others?'],p2:['Describe a trip that you enjoyed','You should say: where you went; who you went with; what you did; and explain why it was enjoyable'],p3:['What are the benefits of travelling abroad?','Is mass tourism harmful to local communities?','Will people travel more or less in the future?']},
{id:'tech',n:'Технологии и интернет',p1:['How often do you use the internet?','What gadget do you use most?','Do you think you spend too much time on your phone?'],p2:['Describe a piece of technology you use often','You should say: what it is; how long you have had it; what you use it for; and explain why it is useful'],p3:['How has technology changed the way we communicate?','Is it a good idea to teach children to code?','What are the risks of relying on technology?']},
{id:'env',n:'Окружающая среда',p1:['Do you do anything to protect the environment?','Is there much pollution where you live?','Do you recycle?'],p2:['Describe a place with a lot of nature that you have visited','You should say: where it is; what you saw; what you did there; and explain how you felt'],p3:['Who should be responsible for protecting the environment, individuals or governments?','Why do some people ignore environmental problems?','Can economic growth and protecting nature go together?']},
{id:'edu',n:'Образование',p1:['What subject did you like at school?','Do you think your school prepared you well?','Would you like to study abroad?'],p2:['Describe a teacher who influenced you','You should say: who the teacher was; what they taught; what they were like; and explain how they influenced you'],p3:['What makes a good teacher?','Should university education be free?','Is online learning as effective as classroom learning?']},
{id:'health',n:'Здоровье и спорт',p1:['Do you do any sport?','What do you do to stay healthy?','Do you think people in your country are healthy?'],p2:['Describe something you do to stay healthy','You should say: what it is; how often you do it; how it began; and explain how it helps you'],p3:['Why do some people find it hard to exercise regularly?','Whose responsibility is public health?','How can employers help workers stay healthy?']},
{id:'people',n:'Семья и друзья',p1:['Are you close to your family?','How often do you see your friends?','What do you usually do with friends?'],p2:['Describe a close friend','You should say: who the friend is; how you met; what you do together; and explain why the friendship matters'],p3:['Is it harder to make friends as an adult?','How has family life changed over time?','Do you think online friendships are real friendships?']},
{id:'media',n:'Медиа и новости',p1:['Do you watch the news?','What do you like to read?','Do you use social media?'],p2:['Describe a book or film that made an impression on you','You should say: what it was; what it was about; when you read or saw it; and explain why it impressed you'],p3:['Can we trust the news today?','Do films and books influence how people behave?','Is reading declining among young people?']},
{id:'culture',n:'Традиции и культура',p1:['What festivals are popular in your country?','Do you follow any traditions?','Are traditions important to young people?'],p2:['Describe a traditional event in your country','You should say: what it is; when it happens; what people do; and explain why it matters'],p3:['Are traditions disappearing in modern life?','Should schools teach children about their cultural heritage?','How does globalisation affect local culture?']}
];
SPT.forEach(t=>t.g='Общие темы (черновик)');
const SPALL=()=>SPX.concat(SPT);
let spTopic=null,spPart=1;
const PART_INFO={
 1:{name:'Part 1',target:'30–50 слов на вопрос',hint:'Структура: ответ → причина → короткий пример. Не пересказывай вопрос.',min:30,max:55},
 2:{name:'Part 2',target:'150–200 слов',hint:'Структура: начало → детали по пунктам карточки → почему это важно → концовка. Говорить придётся около двух минут.',min:150,max:230},
 3:{name:'Part 3',target:'70–100 слов на вопрос',hint:'Структура: мнение → причина → пример → другая сторона. Здесь нужна абстрактная лексика.',min:70,max:110}
};
const spGet=k=>(S.sp&&S.sp[k])||'';
const wc=t=>(t.trim().match(/[A-Za-z']+/g)||[]).length;
function spQs(t,part){return part===1?(t.p1||[]).map(q=>({q})):part===3?(t.p3||[]).map(q=>({q})):(t.p2?[{q:t.p2[0],cue:t.p2[1]}]:[]);}
function segHtml(part){return `<div class="seg">${[1,2,3].map(p=>`<button data-part="${p}" class="${p===part?'on':''}">Part ${p}</button>`).join('')}</div>`;}
function renderSpeak(){
  const part=spPart;
  const info=PART_INFO[part];
  if(!spTopic){
    $('main').innerHTML=`<div class="hub">${segHtml(part)}<div class="note">${esc(info.name)}: выбери тему и напиши ответы так, как сказала бы вслух. ${esc(info.hint)} Цель: ${esc(info.target)}.</div>${(()=>{let g='',h='';SPALL().forEach(t=>{const qs=spQs(t,part);if(!qs.length)return;if(t.g!==g){if(g)h+='</div>';g=t.g;h+=`<h2>${esc(g)}</h2><div class="modes">`;}
      const done=qs.filter(x=>wc(spGet(part+':'+t.id+':'+x.q))>=info.min).length;
      h+=`<button class="mode" data-t="${t.id}"><b>${esc(t.n)}</b><span>Написано ${done} из ${qs.length}</span></button>`;});return h+'</div>';})()}</div>`;
    $('main').querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{spTopic=b.dataset.t;render();});
    $('main').querySelectorAll('[data-part]').forEach(b=>b.onclick=()=>{spPart=+b.dataset.part;render();});
    return;
  }
  const t=SPALL().find(x=>x.id===spTopic),qs=spQs(t,part);
  const pool=poolRows(S.pool,true).map(r=>base(r.w).toLowerCase()).filter(w=>/^[a-z]+$/.test(w)&&w.length>3);
  let bank=shuffle(pool).slice(0,8);
  $('main').innerHTML=`<div class="hub"><div class="qhead"><button class="link" id="sback">Все темы</button><span>${esc(info.name)}: ${esc(t.n)}</span></div>
   <div class="note">${esc(info.hint)} Цель: ${esc(info.target)}.</div>
   <div class="note" id="sbank"></div>
   ${qs.map((x,i)=>`<div class="qcard"><div class="qtext">${esc(x.q)}</div>${x.cue?`<div class="qsub">${esc(x.cue)}</div>`:''}
   <textarea class="sa" id="sa${i}" rows="${part===2?12:5}" spellcheck="true" placeholder="Пиши по-английски"></textarea>
   <div class="qsub" id="sc${i}"></div><div class="row"><button class="btn ghost" id="sm${i}" hidden>🎙 Диктовать</button><button class="btn" id="sx${i}">Проверить с Claude</button></div><div id="sf${i}"></div></div>`).join('')}
   <div class="row"><button class="btn" id="scopy">Скопировать всё, чтобы показать Claude</button></div></div>`;
  const bankEl=$('sbank');
  const drawBank=()=>{bankEl.innerHTML='Слова из твоего списка для этой темы: '+bank.map(w=>`<span class="pill">${esc(w)}</span>`).join(' ')+' <button class="link" id="sbk">Другие</button>';$('sbk').onclick=()=>{bank=shuffle(pool).slice(0,8);drawBank();};};
  if(pool.length)drawBank();else bankEl.hidden=true;
  const stats=i=>{
    const txt=$('sa'+i).value,n=wc(txt),low=txt.toLowerCase();
    const used=pool.filter(w=>new RegExp('\\b'+w.slice(0,Math.max(4,w.length-3))).test(low));
    const ph=TP.filter(p=>low.includes(p));
    const tag=n<info.min?'мало':n>info.max?'много':'в норме';
    $('sc'+i).textContent=`Слов: ${n} (${tag}). Слов из списка: ${used.length}${used.length?' ('+used.slice(0,6).join(', ')+')':''}. Шаблонных фраз: ${ph.length}.`;
  };
  qs.forEach((x,i)=>{
    const ta=$('sa'+i),k=part+':'+t.id+':'+x.q;
    ta.value=spGet(k);stats(i);
    ta.oninput=()=>{S.sp=S.sp||{};S.sp[k]=ta.value;save();stats(i);};
    dictButton($('sm'+i),ta);
    $('sx'+i).onclick=()=>aiCheck({mode:'speak',part:info.name,question:x.q+(x.cue?' ('+x.cue+')':''),text:ta.value,out:$('sf'+i),btn:$('sx'+i),key:k});
  });
  $('sback').onclick=()=>{spTopic=null;render();};
  $('scopy').onclick=e=>copyText(`${info.name}: ${t.n}\n\n`+qs.map((x,i)=>`Q: ${x.q}${x.cue?'\n'+x.cue:''}\nA: ${$('sa'+i).value}`).join('\n\n'),e.target);
}
