// Draft speaking templates for band 7-8. ph = key phrases we look for in her answers.
const TPL=[
{t:'Part 1: короткие ответы (2–4 предложения)',c:[
 {h:'Прямой ответ + причина + пример',x:'Yes, I\'d say so. ___ (answer). The main reason is that ___. For instance, ___.',ph:['the main reason is','for instance','i\'d say']},
 {h:'Привычка и частота',x:'I tend to ___ quite often, usually ___. It\'s become something of a routine for me.',ph:['i tend to','it\'s become','something of a']},
 {h:'Предпочтение',x:'I\'m more of a ___ person than a ___ one. I find it ___, whereas ___ feels a bit ___.',ph:['i\'m more of a','person than','whereas']},
 {h:'Про прошлое',x:'When I was younger, I used to ___, but nowadays I\'d rather ___. I suppose my priorities have changed.',ph:['used to','nowadays','my priorities']},
 {h:'Если нечего сказать',x:'To be honest, it\'s not something I\'ve given much thought to, but I\'d say ___.',ph:['to be honest','given much thought']}
]},
{t:'Part 2: монолог на 2 минуты',c:[
 {h:'Начало',x:'I\'d like to talk about ___. I\'ve chosen this because ___.',ph:['i\'d like to talk about','i\'ve chosen']},
 {h:'Описание (кто, что, где, когда)',x:'It was back in ___ when I ___. It took place in ___, which is ___. What stood out was ___.',ph:['it took place','stood out','back in']},
 {h:'Переходы',x:'To begin with, ___. On top of that, ___. What\'s more, ___. Looking back, ___.',ph:['to begin with','on top of that','what\'s more','looking back']},
 {h:'Чувства и значение',x:'It left a lasting impression on me because ___. I\'d say it was a turning point in ___.',ph:['lasting impression','turning point']},
 {h:'Концовка',x:'All in all, it\'s something I\'ll never forget, and I\'d love to ___ again.',ph:['all in all','i\'ll never forget']}
]},
{t:'Part 3: обсуждение, развёрнутый ответ',c:[
 {h:'Мнение',x:'In my view, ___. I\'d argue that ___ because ___.',ph:['in my view','i\'d argue','as far as i\'m concerned']},
 {h:'Две стороны',x:'There are two sides to this. On the one hand, ___. On the other hand, ___. Personally, I lean towards ___.',ph:['two sides','on the one hand','on the other hand','lean towards']},
 {h:'Причина и следствие',x:'This is largely due to ___, which in turn leads to ___. As a result, ___.',ph:['largely due to','in turn','as a result']},
 {h:'Сравнить прошлое и настоящее',x:'Compared with the past, people nowadays ___. Back then, ___, whereas now ___.',ph:['compared with','whereas','back then']},
 {h:'Прогноз',x:'I reckon that in the future ___. It\'s likely that ___ will become ___, although it\'s hard to say.',ph:['i reckon','it\'s likely that','hard to say']},
 {h:'Обобщение',x:'Generally speaking, ___. That said, there are exceptions, such as ___.',ph:['generally speaking','that said','such as']},
 {h:'Вежливо не согласиться',x:'I see what you mean, but I\'d have to disagree, because ___.',ph:['i see what you mean','i\'d have to disagree']},
 {h:'Пример',x:'A good example of this is ___. Take ___ for instance.',ph:['a good example','take']}
]},
{t:'Паузы и перефразирование',c:[
 {h:'Выиграть время',x:'That\'s an interesting question. Let me think... Well, ___.',ph:['that\'s an interesting question','let me think','well,']},
 {h:'Поправить себя',x:'Or rather, ___. What I mean is ___. Let me put it another way: ___.',ph:['or rather','what i mean is','put it another way']},
 {h:'Не знаю слова',x:'It\'s a kind of ___ that you use for ___. I can\'t think of the exact word, but ___.',ph:['it\'s a kind of','can\'t think of']}
]}
];
const TP=[].concat(...TPL.map(s=>[].concat(...s.c.map(c=>c.ph))));
function copyText(t,btn){
  const ok=()=>{if(btn){const o=btn.textContent;btn.textContent='Скопировано';setTimeout(()=>btn.textContent=o,1400);}};
  try{navigator.clipboard.writeText(t).then(ok,fb);}catch(e){fb();}
  function fb(){const a=document.createElement('textarea');a.value=t;document.body.appendChild(a);a.select();try{document.execCommand('copy');}catch(e){}a.remove();ok();}
}
function renderTplBasic(box){
  (box||$('main')).innerHTML=`<div class="hub"><div class="note">Это базовые шаблоны (Basic) уровня 7–8. Их стоит сделать своими: заменить на фразы, которые звучат естественно для тебя. Потом разберём их вместе. Вместо ___ подставляй своё содержание.</div>`+
   TPL.map(s=>`<h2>${esc(s.t)}</h2>`+s.c.map(c=>`<div class="qcard tpl"><div class="qlabel">${esc(c.h)}</div><div class="qtext tx">${esc(c.x)}</div><div class="row"><button class="link" data-say="${esc(c.x.replace(/___/g,'...'))}">Послушать</button></div></div>`).join('')).join('')+'</div>';
  (box||$('main')).querySelectorAll('[data-say]').forEach(b=>b.onclick=()=>speak(b.dataset.say));
}
