// Writing tab: IELTS Task 2 practice with Claude feedback.
const WR=[
 'Some people think that university education should be free for everyone. Others believe students should pay for it. Discuss both views and give your own opinion.',
 'Many people now work from home instead of going to an office. Do the advantages of this outweigh the disadvantages?',
 'Some people believe that governments should spend money on public transport rather than building new roads. To what extent do you agree or disagree?',
 'In many countries, people are living longer than before. What problems will this cause for society, and what can be done about them?',
 'Some say that children should start learning a foreign language at primary school. Others think it is better to begin later. Discuss both views and give your opinion.',
 'Social media has changed the way people communicate. Is this a positive or negative development?',
 'Plastic waste is a serious environmental problem. What are the causes, and what solutions can you suggest?',
 'Some people think that the best way to reduce crime is to give longer prison sentences. Others believe there are better alternatives. Discuss both views and give your opinion.',
 'Tourism brings many benefits to a country, but it can also cause problems. Do the advantages outweigh the disadvantages?',
 'Some people prefer to spend their money on experiences such as travel, while others prefer to buy things. Discuss both views and give your opinion.'
];
let wrIdx=0;
function renderWriting(box){
  const cur=wrIdx<0?(S.wrCustom||''):WR[wrIdx];
  const inner=`<div class="note">Task 2: 250 слов и больше, около 40 минут. Пиши полностью, как на экзамене. Claude найдёт ошибки и опечатки, объяснит их и оценит примерно по четырём критериям.</div>
   <div class="filter"><label for="wsel">Задание</label><select id="wsel">${WR.map((q,i)=>`<option value="${i}"${i===wrIdx?' selected':''}>${i+1}. ${esc(q.slice(0,60))}…</option>`).join('')}<option value="-1"${wrIdx<0?' selected':''}>Своё задание</option></select></div>
   ${wrIdx<0?`<textarea class="sa" id="wcus" rows="3" placeholder="Вставь текст задания">${esc(S.wrCustom||'')}</textarea>`:`<div class="qcard"><div class="qtext">${esc(cur)}</div></div>`}
   <textarea class="sa" id="wta" rows="16" placeholder="Начни писать здесь"></textarea>
   <div class="qsub" id="wcount"></div>
   <div class="row"><button class="btn ghost" id="wmic" hidden>🎙 Диктовать</button><button class="btn" id="wchk">Проверить с Claude</button><button class="btn ghost" id="wcopy">Скопировать</button></div>
   <div id="wfb"></div>`;
  if(box)box.innerHTML=inner;else $('main').innerHTML=`<div class="hub">${inner}</div>`;
  const ta=$('wta'),key='wr:'+(wrIdx<0?'custom':wrIdx);
  ta.value=(S.wr&&S.wr[key])||'';
  const upd=()=>{const n=(ta.value.match(/[A-Za-z']+/g)||[]).length;$('wcount').textContent=`Слов: ${n}${n<250?' (нужно 250+)':''}`;};
  upd();
  ta.oninput=()=>{S.wr=S.wr||{};S.wr[key]=ta.value;save();upd();};
  $('wsel').onchange=()=>{wrIdx=+$('wsel').value;if(box)renderWriting(box);else render();};
  if($('wcus'))$('wcus').oninput=()=>{S.wrCustom=$('wcus').value;save();};
  dictButton($('wmic'),ta);
  $('wcopy').onclick=e=>copyText(`${wrIdx<0?S.wrCustom||'':WR[wrIdx]}\n\n${ta.value}`,e.target);
  $('wchk').onclick=()=>aiCheck({mode:'write',question:wrIdx<0?(S.wrCustom||'Free topic'):WR[wrIdx],text:ta.value,out:$('wfb'),btn:$('wchk'),key});
}
