// Generic quiz runner. Question kinds: mc, tf, type, order.
// cfg: {next(), progress(), onAnswer(q,ok), onFinish(), onExit(), auto}
let keyHandler=null;
function runQuiz(cfg){
  let q=null,locked=false,timer=null,chosen=[],tokens=[];
  const clean=s=>norm(s).replace(/[.!?]+$/,'');
  const exit=()=>{clearTimeout(timer);(cfg.onExit||(()=>go('learn',null)))();};

  function nextQ(){
    clearTimeout(timer);
    q=cfg.next();
    if(!q){keyHandler=null;cfg.onFinish();return;}
    locked=false;chosen=[];
    let body='';
    if(q.kind==='mc'||q.kind==='tf'){
      body=`<div class="opts">${q.opts.map((o,i)=>`<button class="opt" data-i="${i}"><i>${i+1}</i><span>${esc(o)}</span></button>`).join('')}</div>${q.kind==='mc'?'<div><button class="link" id="qskip">Не знаю</button></div>':''}`;
    }else if(q.kind==='type'){
      body=`<div class="typed"><input id="qin" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Введи ответ"><button class="btn" id="qgo">Проверить</button></div>${q.hint?`<div class="note">${esc(q.hint)}</div>`:''}<div><button class="link" id="qskip">Не знаю</button></div>`;
    }else if(q.kind==='order'){
      tokens=shuffle(q.w);
      body=`<div class="qsub">${esc(q.ru||'')}</div><div class="tiles answerline" id="qline"></div><div class="tiles" id="qpool"></div><div class="row"><button class="btn" id="qgo">Проверить</button><button class="link" id="qskip">Не знаю</button></div>`;
    }
    $('main').innerHTML=`<div class="hub"><div class="qhead"><button class="link" id="qexit">Выйти</button><span>${esc(cfg.progress())}</span></div><div class="qcard">${q.prompt}${body}</div><div id="fb"></div></div>`;
    $('qexit').onclick=exit;
    if(q.kind==='mc'||q.kind==='tf'){
      $('main').querySelectorAll('.opt').forEach(b=>b.onclick=()=>pick(+b.dataset.i));
      if($('qskip'))$('qskip').onclick=()=>done(false,null);
    }else if(q.kind==='type'){
      const inp=$('qin');inp.focus();
      const check=()=>{const v=norm(inp.value);if(!v)return;done(q.answer.some(a=>norm(a)===v),null,inp.value);};
      inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();check();}};
      $('qgo').onclick=check;$('qskip').onclick=()=>done(false,null,'');
    }else if(q.kind==='order'){
      drawOrder();
      $('qgo').onclick=()=>{if(!chosen.length)return;done(q.answer.some(a=>clean(a)===clean(chosen.map(i=>tokens[i]).join(' '))),null);};
      $('qskip').onclick=()=>done(false,null);
    }
    if(q.onShow)q.onShow();
    keyHandler=e=>{
      if(locked){
        if((e.key==='Enter'||e.key===' ')&&e.target.tagName!=='BUTTON'){e.preventDefault();nextQ();}
        return;
      }
      if((q.kind==='mc'||q.kind==='tf')&&/^[1-4]$/.test(e.key)){const i=+e.key-1;if(i<q.opts.length)pick(i);}
    };
  }

  function drawOrder(){
    $('qline').innerHTML=chosen.map(i=>`<button class="tile" data-c="${i}">${esc(tokens[i])}</button>`).join('');
    $('qpool').innerHTML=tokens.map((t,i)=>chosen.includes(i)?'':`<button class="tile" data-p="${i}">${esc(t)}</button>`).join('');
    $('qline').querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{if(locked)return;chosen=chosen.filter(x=>x!==+b.dataset.c);drawOrder();});
    $('qpool').querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{if(locked)return;chosen.push(+b.dataset.p);drawOrder();});
  }

  function pick(i){if(!locked)done(i===q.ai,i);}

  function done(ok,picked,typed){
    if(locked)return;
    locked=true;
    if(q.kind==='mc'||q.kind==='tf'){
      document.querySelectorAll('.opt').forEach((b,i)=>{b.disabled=true;if(i===q.ai)b.classList.add('ok');else if(i===picked)b.classList.add('bad');});
    }
    if(q.kind==='type')$('qin').disabled=true;
    if(cfg.onAnswer)cfg.onAnswer(q,ok);
    const exp=q.explainFn?q.explainFn(ok,typed):q.explain;
    const ans=(q.kind==='type'||q.kind==='order')?`<div>Правильный ответ: <b>${esc(q.show||q.answer[0])}</b></div>`:'';
    $('fb').innerHTML=`<div class="fb ${ok?'ok':'bad'}"><div class="head">${ok?'Верно':'Неверно'}</div>${ans}${exp||''}</div><div class="row"><button class="btn" id="qnext">Дальше</button></div>`;
    $('fb').querySelectorAll('[data-say]').forEach(b=>b.onclick=()=>speak(b.dataset.say));
    $('qnext').onclick=nextQ;$('qnext').focus();
    if(ok&&cfg.auto)timer=setTimeout(nextQ,1700);
  }
  nextQ();
}
