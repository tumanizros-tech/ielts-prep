// Match and Gravity games.

/* ---------- Match ---------- */
function startMatch(){
  let src=shuffle(poolRows(S.pool,true));
  if(src.length<6)src=shuffle(ROWS);
  const pick=[],seen=new Set();
  for(const r of src){const t=shortRu(r);if(seen.has(t))continue;seen.add(t);pick.push(r);if(pick.length===6)break;}
  const L=pick.map(r=>({w:r.w,t:base(r.w)})),R=shuffle(pick.map(r=>({w:r.w,t:shortRu(r)})));
  const tile=(x,side)=>`<button class="mt" data-side="${side}" data-w="${esc(x.w)}">${esc(x.t)}</button>`;
  $('main').innerHTML=`<div class="hub"><div class="qhead"><button class="link" id="mexit">К режимам</button><span>Время: <b id="mtime">0.0</b> с</span></div>
    <div class="note">Нажми слово слева, затем его перевод справа. Ошибка добавляет 2 секунды.</div>
    <div class="mgrid"><div class="mcol">${L.map(x=>tile(x,'L')).join('')}</div><div class="mcol">${R.map(x=>tile(x,'R')).join('')}</div></div></div>`;
  let sel=null,left=pick.length,pen=0;const t0=Date.now();
  const cur=()=>((Date.now()-t0)/1000+pen);
  const iv=setInterval(()=>{const el=$('mtime');if(el)el.textContent=cur().toFixed(1);},100);
  cleanup=()=>clearInterval(iv);
  $('mexit').onclick=()=>go('learn',null);
  $('main').querySelectorAll('.mt').forEach(b=>b.onclick=()=>{
    if(b.classList.contains('done'))return;
    if(!sel||sel.dataset.side===b.dataset.side){
      if(sel)sel.classList.remove('sel');
      sel=b;b.classList.add('sel');return;
    }
    if(sel.dataset.w===b.dataset.w){
      sel.classList.remove('sel');sel.classList.add('done');b.classList.add('done');
      sel.disabled=true;b.disabled=true;sel=null;left--;
      if(left===0)finish();
    }else{
      pen+=2;
      const a=sel,c=b;a.classList.remove('sel');a.classList.add('bad');c.classList.add('bad');
      setTimeout(()=>{a.classList.remove('bad');c.classList.remove('bad');},450);
      sel=null;
    }
  });
  function finish(){
    clearInterval(iv);
    const t=cur(),prev=S.best.match,rec=!prev||t<prev;
    if(rec)S.best.match=t;
    addXP(15+(rec?5:0));
    summary('Все пары найдены',`<div class="qsub">Время: ${t.toFixed(1)} с${rec?'. Новый рекорд!':prev?`. Рекорд: ${prev.toFixed(1)} с`:''}. Получено ${15+(rec?5:0)} XP.</div>`,[{t:'Ещё раунд',f:startMatch},{t:'К режимам',ghost:true,f:()=>go('learn',null)}]);
  }
}

/* ---------- Gravity ---------- */
function startGravity(){
  let src=poolRows(S.pool,true);
  if(src.length<8)src=ROWS.slice();
  src=shuffle(src);
  $('main').innerHTML=`<div class="hub"><div class="qhead"><button class="link" id="gexit">К режимам</button><span id="ghud"></span></div>
    <div class="gprompt" id="gp"></div>
    <canvas id="gc" width="640" height="400" aria-label="Игра Гравитация"></canvas>
    <div class="note">Нажимай на астероид со словом, которое подходит к подсказке сверху. Верно: +5 очков, серия даёт бонус. Ошибка: −2. Если нужное слово упало, теряешь жизнь.</div></div>`;
  const cv=$('gc'),cx=cv.getContext('2d'),W=640,H=400;
  let score=0,lives=3,streak=0,level=1,ast=[],fx=[],target=null,spawnT=0,over=false,raf=0,last=0;const missed=[];
  const stars=Array.from({length:60},()=>({x:Math.random()*W,y:Math.random()*H,s:Math.random()*1.5+.3}));
  cleanup=()=>{over=true;cancelAnimationFrame(raf);};
  $('gexit').onclick=()=>go('learn',null);

  const radiusFor=t=>{cx.font='600 16px Manrope, sans-serif';return Math.max(32,cx.measureText(t).width/2+14);};
  const speed=()=>36+9*(level-1);
  function spawn(r){
    const t=base(r.w),rad=radiusFor(t);
    ast.push({x:rad+Math.random()*(W-2*rad),y:-rad,r:rad,vy:speed()*(.85+Math.random()*.3),t,w:r.w,hue:200+Math.random()*120,ph:Math.random()*6});
  }
  function newTarget(){
    let r;
    do{r=src[Math.floor(Math.random()*src.length)];}while(target&&r.w===target.w&&src.length>1);
    target=r;
    $('gp').textContent=Math.random()<.4?r.def:r.ru;
    spawn(r);
  }
  function hud(){$('ghud').textContent=`Очки ${score} · Жизни ${lives} · Уровень ${level}${streak>1?` · Серия ×${(1+Math.min(streak-1,9)*.1).toFixed(1)}`:''}`;}
  function end(){
    over=true;cancelAnimationFrame(raf);
    const xp=Math.floor(score/10),prev=S.best.gravity||0,rec=score>prev;
    if(rec)S.best.gravity=score;
    addXP(xp);
    const ms=missed.length?`<div class="qsub">Слова, которые ты пропустила:</div><ul class="list">${missed.map(r=>`<li class="item"><div><b>${esc(base(r.w))}</b> <span class="r">${esc(r.ru)}</span></div></li>`).join('')}</ul>`:'';
    summary('Игра окончена',`<div class="qsub">Очки: ${score}${rec&&score>0?'. Новый рекорд!':prev?`. Рекорд: ${prev}`:''}. Получено ${xp} XP.</div>${ms}`,[{t:'Играть ещё',f:startGravity},{t:'К режимам',ghost:true,f:()=>go('learn',null)}]);
  }
  cv.addEventListener('pointerdown',e=>{
    if(over)return;
    const rc=cv.getBoundingClientRect(),x=(e.clientX-rc.left)*W/rc.width,y=(e.clientY-rc.top)*H/rc.height;
    for(let i=ast.length-1;i>=0;i--){
      const a=ast[i];
      if(Math.hypot(x-a.x,y-a.y)<=a.r){
        ast.splice(i,1);
        if(a.w===target.w){
          streak++;
          const gain=Math.round(5*(1+Math.min(streak-1,9)*.1));
          score+=gain;fx.push({x:a.x,y:a.y,t:0,txt:'+'+gain,c:'#7ce3a8'});
          level=1+Math.floor(score/100);
          newTarget();
        }else{
          score=Math.max(0,score-2);streak=0;fx.push({x:a.x,y:a.y,t:0,txt:'−2',c:'#ff9a78'});
        }
        hud();
        break;
      }
    }
  });
  function frame(ts){
    if(over)return;
    const dt=Math.min(.05,(ts-(last||ts))/1000);last=ts;
    spawnT+=dt;
    if(spawnT>Math.max(.9,2.1-.12*level)&&ast.length<7){
      spawnT=0;
      const onScreen=new Set(ast.map(a=>a.w));
      const c=src.filter(r=>r.w!==target.w&&!onScreen.has(r.w));
      if(c.length)spawn(c[Math.floor(Math.random()*c.length)]);
    }
    for(let i=ast.length-1;i>=0;i--){
      const a=ast[i];a.y+=a.vy*dt;a.ph+=dt;
      if(a.y-a.r>H){
        ast.splice(i,1);
        if(a.w===target.w){
          lives--;streak=0;missed.push(target);hud();
          if(lives<=0){end();return;}
          newTarget();
        }
      }
    }
    // draw
    cx.fillStyle='#0d1130';cx.fillRect(0,0,W,H);
    cx.fillStyle='#ffffff';
    stars.forEach(s=>{cx.globalAlpha=.4+.3*Math.sin(s.x+ts/700);cx.fillRect(s.x,(s.y+ts/60*s.s)%H,s.s,s.s);});
    cx.globalAlpha=1;
    ast.forEach(a=>{
      const g=cx.createRadialGradient(a.x-a.r*.3,a.y-a.r*.3,a.r*.1,a.x,a.y,a.r);
      g.addColorStop(0,`hsl(${a.hue},55%,48%)`);g.addColorStop(1,`hsl(${a.hue},55%,22%)`);
      cx.fillStyle=g;cx.beginPath();cx.arc(a.x,a.y,a.r+Math.sin(a.ph*2)*1.5,0,6.283);cx.fill();
      cx.fillStyle='#fff';cx.font='600 16px Manrope, sans-serif';cx.textAlign='center';cx.textBaseline='middle';cx.fillText(a.t,a.x,a.y);
    });
    fx.forEach(f=>{f.t+=dt;cx.globalAlpha=Math.max(0,1-f.t*1.6);cx.fillStyle=f.c;cx.font='700 22px Sora, sans-serif';cx.textAlign='center';cx.fillText(f.txt,f.x,f.y-f.t*40);});
    cx.globalAlpha=1;fx=fx.filter(f=>f.t<.65);
    raf=requestAnimationFrame(frame);
  }
  newTarget();hud();
  raf=requestAnimationFrame(frame);
}
