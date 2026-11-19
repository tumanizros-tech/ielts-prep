// Word building: negatives (level 1), suffix families (level 2), academic families (level 3).
// Level 1 rows: adjective|negative ; levels 2 and 3 rows: n=;v=;adj=;adv=;p=(person);ru=
const WB1=`happy|unhappy honest|dishonest possible|impossible legal|illegal polite|impolite patient|impatient fair|unfair kind|unkind comfortable|uncomfortable usual|unusual correct|incorrect regular|irregular responsible|irresponsible logical|illogical mature|immature literate|illiterate appear|disappear agree|disagree like|dislike obey|disobey approve|disapprove trust|distrust able|unable aware|unaware certain|uncertain familiar|unfamiliar healthy|unhealthy popular|unpopular successful|unsuccessful necessary|unnecessary relevant|irrelevant rational|irrational reliable|unreliable direct|indirect visible|invisible complete|incomplete formal|informal ethical|unethical moral|immoral personal|impersonal perfect|imperfect sensitive|insensitive equal|unequal employed|unemployed tidy|untidy active|inactive balanced|unbalanced efficient|inefficient dependent|independent accurate|inaccurate convenient|inconvenient expensive|inexpensive secure|insecure stable|unstable acceptable|unacceptable satisfied|dissatisfied advantage|disadvantage ability|disability order|disorder connect|disconnect`.split(' ').map(s=>s.split('|'));
const WB2=`n=decision;v=decide;adj=decisive;ru=решение;r=решение/решать/решительный
n=education;v=educate;adj=educational;adv=educationally;p=educator;ru=образование;r=образование/обучать/образовательный/в образовательном плане/педагог
n=creation;v=create;adj=creative;adv=creatively;p=creator;ru=создание;r=создание/создавать/творческий/творчески/создатель
n=competition;v=compete;adj=competitive;adv=competitively;p=competitor;ru=конкуренция;r=конкуренция/конкурировать/конкурентный/конкурентно/конкурент
n=action;v=act;adj=active;adv=actively;p=actor;ru=действие;r=действие/действовать/активный/активно/актёр
n=production;v=produce;adj=productive;p=producer;ru=производство;r=производство/производить/продуктивный/производитель
n=pollution;v=pollute;adj=polluted;p=polluter;ru=загрязнение;r=загрязнение/загрязнять/загрязнённый/загрязнитель
n=information;v=inform;adj=informative;adv=informatively;ru=информация;r=информация/информировать/информативный/информативно
n=communication;v=communicate;adj=communicative;adv=communicatively;ru=общение;r=общение/общаться/коммуникативный/коммуникативно
n=advertisement;v=advertise;p=advertiser;ru=реклама;r=реклама/рекламировать/рекламодатель
n=employment;v=employ;adj=employed;p=employer;ru=занятость;r=занятость/нанимать/трудоустроенный/работодатель
n=development;v=develop;adj=developed;p=developer;ru=развитие;r=развитие/развивать/развитый/разработчик
n=achievement;v=achieve;adj=achievable;ru=достижение;r=достижение/достигать/достижимый
n=improvement;v=improve;adj=improved;ru=улучшение;r=улучшение/улучшать/улучшенный
n=management;v=manage;adj=managerial;p=manager;ru=управление;r=управление/управлять/управленческий/менеджер
n=argument;v=argue;adj=arguable;adv=arguably;ru=довод, спор;r=довод/спорить/спорный/по-видимому, можно утверждать
n=assistance;v=assist;p=assistant;ru=помощь;r=помощь/помогать/помощник
n=dependence;v=depend;adj=dependent;adv=dependently;ru=зависимость;r=зависимость/зависеть/зависимый/зависимо
n=difference;v=differ;adj=different;adv=differently;ru=различие;r=различие/отличаться/разный/по-разному
n=importance;adj=important;adv=importantly;ru=важность;r=важность/важный/что важно
n=difficulty;adj=difficult;ru=трудность;r=трудность/трудный
n=safety;adj=safe;adv=safely;ru=безопасность;r=безопасность/безопасный/безопасно
n=strength;v=strengthen;adj=strong;adv=strongly;ru=сила;r=сила/усиливать/сильный/сильно
n=length;v=lengthen;adj=long;ru=длина;r=длина/удлинять/длинный
n=width;v=widen;adj=wide;adv=widely;ru=ширина;r=ширина/расширять/широкий/широко
n=height;v=heighten;adj=high;adv=highly;ru=высота;r=высота/повышать/высокий/весьма
n=depth;v=deepen;adj=deep;adv=deeply;ru=глубина;r=глубина/углублять/глубокий/глубоко
n=growth;v=grow;adj=growing;ru=рост;r=рост/расти/растущий
n=failure;v=fail;adj=failing;ru=неудача;r=неудача/терпеть неудачу/неудачный
n=loss;v=lose;adj=lost;p=loser;ru=потеря;r=потеря/терять/потерянный/неудачник
n=belief;v=believe;adj=believable;adv=believably;ru=вера, убеждение;r=вера/верить/правдоподобный/правдоподобно
n=proof;v=prove;adj=proven;ru=доказательство;r=доказательство/доказывать/доказанный
n=thought;v=think;adj=thoughtful;adv=thoughtfully;p=thinker;ru=мысль;r=мысль/думать/заботливый/задумчиво/мыслитель
n=speech;v=speak;adj=spoken;p=speaker;ru=речь;r=речь/говорить/устный/говорящий, оратор
n=knowledge;v=know;adj=knowledgeable;ru=знание;r=знание/знать/знающий
n=happiness;adj=happy;adv=happily;ru=счастье;r=счастье/счастливый/счастливо
n=kindness;adj=kind;adv=kindly;ru=доброта;r=доброта/добрый/ласково
n=anger;adj=angry;adv=angrily;ru=гнев;r=гнев/сердитый/сердито
n=fear;adj=fearful;adv=fearfully;ru=страх;r=страх/боязливый/испуганно
n=beauty;v=beautify;adj=beautiful;adv=beautifully;ru=красота;r=красота/украшать/красивый/красиво
n=help;adj=helpful;adv=helpfully;p=helper;ru=помощь;r=помощь/полезный (о помощи)/услужливо/помощник
n=use;adj=useful;adv=usefully;p=user;ru=польза;r=польза/полезный/с пользой/пользователь
n=care;adj=careful;adv=carefully;ru=забота;r=забота/осторожный/осторожно
n=success;v=succeed;adj=successful;adv=successfully;ru=успех;r=успех/добиться успеха/успешный/успешно
n=attraction;v=attract;adj=attractive;adv=attractively;ru=привлекательность;r=привлекательность/привлекать/привлекательный/привлекательно
n=protection;v=protect;adj=protective;adv=protectively;p=protector;ru=защита;r=защита/защищать/защитный/защитно/защитник
n=satisfaction;v=satisfy;adj=satisfactory;adv=satisfactorily;ru=удовлетворение;r=удовлетворение/удовлетворять/удовлетворительный/удовлетворительно
n=variety;v=vary;adj=various;ru=разнообразие;r=разнообразие/различаться/разнообразный
n=repetition;v=repeat;adj=repetitive;adv=repeatedly;ru=повторение;r=повторение/повторять/однообразный/неоднократно
n=suggestion;v=suggest;adj=suggestive;ru=предложение;r=предложение/предлагать/наводящий на мысль
n=application;v=apply;adj=applicable;p=applicant;ru=заявка, применение;r=заявка/применять/применимый/кандидат
n=discovery;v=discover;p=discoverer;ru=открытие;r=открытие/открывать/первооткрыватель
n=explanation;v=explain;adj=explanatory;ru=объяснение;r=объяснение/объяснять/объяснительный
n=organisation;v=organise;adj=organised;p=organiser;ru=организация;r=организация/организовывать/организованный/организатор`.split('\n').map(l=>Object.fromEntries(l.split(';').map(x=>x.split('='))));
const WB3=`n=economy;v=economise;adj=economic;adv=economically;p=economist;ru=экономика;r=экономика/экономить/экономический/экономически/экономист
n=environment;adj=environmental;adv=environmentally;p=environmentalist;ru=окружающая среда;r=окружающая среда/экологический/с точки зрения экологии/эколог
n=globalisation;v=globalise;adj=global;adv=globally;ru=глобализация;r=глобализация/глобализировать/глобальный/глобально
n=industry;v=industrialise;adj=industrial;p=industrialist;ru=промышленность;r=промышленность/индустриализировать/промышленный/промышленник
n=technology;adj=technological;adv=technologically;p=technologist;ru=технология;r=технология/технологический/технологически/технолог
n=analysis;v=analyse;adj=analytical;adv=analytically;p=analyst;ru=анализ;r=анализ/анализировать/аналитический/аналитически/аналитик
n=theory;v=theorise;adj=theoretical;adv=theoretically;p=theorist;ru=теория;r=теория/теоретизировать/теоретический/теоретически/теоретик
n=politics;adj=political;adv=politically;p=politician;ru=политика;r=политика/политический/политически/политик
n=science;adj=scientific;adv=scientifically;p=scientist;ru=наука;r=наука/научный/научно/учёный
n=society;adj=social;adv=socially;p=sociologist;ru=общество;r=общество/общественный/в обществе/социолог
n=culture;adj=cultural;adv=culturally;ru=культура;r=культура/культурный/в культурном плане
n=crime;v=criminalise;adj=criminal;adv=criminally;p=criminal;ru=преступление;r=преступление/криминализировать/преступный/преступно/преступник
n=danger;v=endanger;adj=dangerous;adv=dangerously;ru=опасность;r=опасность/подвергать опасности/опасный/опасно
n=value;adj=valuable;ru=ценность;r=ценность/ценный
n=significance;v=signify;adj=significant;adv=significantly;ru=значимость;r=значимость/означать/значительный/значительно
n=efficiency;adj=efficient;adv=efficiently;ru=эффективность;r=эффективность/эффективный/эффективно
n=sustainability;v=sustain;adj=sustainable;adv=sustainably;ru=устойчивость;r=устойчивость/поддерживать/устойчивый/устойчиво
n=consumption;v=consume;adj=consumable;p=consumer;ru=потребление;r=потребление/потреблять/потребляемый/потребитель
n=investigation;v=investigate;adj=investigative;p=investigator;ru=расследование;r=расследование/расследовать/следственный/следователь
n=prediction;v=predict;adj=predictable;adv=predictably;ru=прогноз;r=прогноз/прогнозировать/предсказуемый/предсказуемо
n=reliability;v=rely;adj=reliable;adv=reliably;ru=надёжность;r=надёжность/полагаться/надёжный/надёжно
n=reduction;v=reduce;adj=reduced;ru=сокращение;r=сокращение/сокращать/сниженный
n=contribution;v=contribute;adj=contributory;p=contributor;ru=вклад;r=вклад/вносить вклад/содействующий/вкладчик, автор
n=participation;v=participate;adj=participatory;p=participant;ru=участие;r=участие/участвовать/основанный на участии/участник
n=justification;v=justify;adj=justifiable;adv=justifiably;ru=обоснование;r=обоснование/обосновывать/оправданный/оправданно
n=regulation;v=regulate;adj=regulatory;p=regulator;ru=регулирование;r=регулирование/регулировать/регулирующий/регулятор
n=innovation;v=innovate;adj=innovative;p=innovator;ru=инновация;r=инновация/внедрять новое/инновационный/новатор
n=motivation;v=motivate;adj=motivated;ru=мотивация;r=мотивация/мотивировать/мотивированный
n=migration;v=migrate;adj=migratory;p=migrant;ru=миграция;r=миграция/мигрировать/миграционный/мигрант
n=dominance;v=dominate;adj=dominant;ru=господство;r=господство/господствовать/доминирующий
n=exploration;v=explore;adj=exploratory;p=explorer;ru=исследование;r=исследование/исследовать/исследовательский/исследователь
n=generalisation;v=generalise;adj=general;adv=generally;ru=обобщение;r=обобщение/обобщать/общий/в целом
n=assumption;v=assume;adj=assumed;ru=предположение;r=предположение/предполагать/предполагаемый
n=appreciation;v=appreciate;adj=appreciative;adv=appreciatively;ru=признательность;r=признательность/ценить/благодарный/с благодарностью
n=acceptance;v=accept;adj=acceptable;adv=acceptably;ru=принятие;r=принятие/принимать/приемлемый/приемлемо
n=influence;adj=influential;adv=influentially;ru=влияние;r=влияние/влиятельный/с влиянием
n=awareness;adj=aware;ru=осведомлённость;r=осведомлённость/осведомлённый
n=effectiveness;adj=effective;adv=effectively;ru=результативность;r=результативность/эффективный/результативно
n=survival;v=survive;adj=surviving;p=survivor;ru=выживание;r=выживание/выживать/выживающий/выживший
n=emphasis;v=emphasise;adj=emphatic;adv=emphatically;ru=акцент;r=акцент/подчёркивать/выразительный/выразительно
n=perception;v=perceive;adj=perceptive;adv=perceptively;ru=восприятие;r=восприятие/воспринимать/проницательный/проницательно
n=interpretation;v=interpret;adj=interpretive;p=interpreter;ru=толкование;r=толкование/толковать/интерпретирующий/переводчик
n=contradiction;v=contradict;adj=contradictory;ru=противоречие;r=противоречие/противоречить/противоречивый
n=precision;adj=precise;adv=precisely;ru=точность;r=точность/точный/точно
n=prosperity;v=prosper;adj=prosperous;ru=процветание;r=процветание/процветать/процветающий
n=conservation;v=conserve;adj=conservative;p=conservationist;ru=сохранение;r=сохранение/сохранять/консервативный/защитник природы`.split('\n').map(l=>Object.fromEntries(l.split(';').map(x=>x.split('='))));
const WBPOS={n:'существительное',v:'глагол',adj:'прилагательное',adv:'наречие',p:'человек (деятель)'};
function wbSplit(s){return s.split('/').map(x=>x.trim());}
const WB1RU='счастливый|несчастный;честный|нечестный;возможный|невозможный;законный|незаконный;вежливый|невежливый;терпеливый|нетерпеливый;справедливый|несправедливый;добрый|недобрый, злой;удобный|неудобный;обычный|необычный;правильный|неправильный;регулярный|нерегулярный;ответственный|безответственный;логичный|нелогичный;зрелый|незрелый;грамотный|неграмотный;появляться|исчезать;соглашаться|не соглашаться;любить, нравиться|не любить;подчиняться|не подчиняться;одобрять|не одобрять;доверять|не доверять;способный|неспособный;осознающий|не осознающий;уверенный|неуверенный, неопределённый;знакомый|незнакомый;здоровый|нездоровый;популярный|непопулярный;успешный|безуспешный;необходимый|ненужный;уместный|неуместный;рациональный|иррациональный;надёжный|ненадёжный;прямой|косвенный;видимый|невидимый;полный|неполный;официальный|неофициальный;этичный|неэтичный;нравственный|аморальный;личный|безличный;идеальный|несовершенный;чувствительный|нечуткий;равный|неравный;занятый (работой)|безработный;аккуратный|неряшливый;активный|неактивный, бездействующий;сбалансированный|несбалансированный;эффективный|неэффективный;зависимый|независимый;точный|неточный;удобный|неудобный;дорогой|недорогой;безопасный|ненадёжный, небезопасный;устойчивый|неустойчивый;приемлемый|неприемлемый;довольный|недовольный;преимущество|недостаток;способность|неспособность, инвалидность;порядок|беспорядок;соединять|разъединять'.split(';').map(x=>x.split('|'));
const WB1M=Object.fromEntries(WB1.map((p,i)=>[p[0],WB1RU[i]]));
function wbR(f,k){const ks=['n','v','adj','adv','p'].filter(x=>f[x]);const r=(f.r||'').split('/');return r[ks.indexOf(k)]||'';}
function wbFamily(f){return ['n','v','adj','adv','p'].filter(k=>f[k]).map(k=>`${f[k]} (${k})`).join(' · ');}
function wbFamRu(f){return ['n','v','adj','adv','p'].filter(k=>f[k]).map(k=>`<div><b>${esc(f[k])}</b> <span class="muted">${WBPOS[k]}</span> — ${esc(wbR(f,k))}</div>`).join('');}
function wbQuestions(level,n){
  const out=[];
  if(level===1){
    const rows=shuffle(WB1).slice(0,n);
    rows.forEach(([a,b],i)=>{
      const pre=b.slice(0,b.length-a.length),ru=WB1M[a]||['',''];
      const ex=`<div><b>${esc(a)}</b> — ${esc(ru[0])}</div><div><b>${esc(b)}</b> — ${esc(ru[1])}</div>`;
      if(i%2===0&&['un','in','im','ir','il','dis'].includes(pre)){
        const opts=shuffle(['un','in','im','ir','il','dis'].filter(x=>x!==pre)).slice(0,3).concat(pre);const sh=shuffle(opts);
        out.push({kind:'mc',opts:sh,ai:sh.indexOf(pre),prompt:`<div class="qlabel">Отрицательная приставка</div><div class="qtext">___${esc(a)}</div><div class="qsub">${esc(ru[0])}. Какая приставка нужна?</div>`,explain:`${ex}<div>${esc(pre)}- + ${esc(a)}</div>`});
      }else out.push({kind:'type',answer:[b],show:b,prompt:`<div class="qlabel">Противоположное слово</div><div class="qtext">${esc(a)} → ?</div><div class="qsub">${esc(ru[0])}. Добавь отрицательную приставку</div>`,hint:'Первая буква: '+b[0],explain:ex});
    });
    return out;
  }
  const src=level===2?WB2:WB3;
  shuffle(src).slice(0,n).forEach(f=>{
    const ks=['n','v','adj','adv','p'].filter(k=>f[k]);
    const from=ks[Math.floor(Math.random()*ks.length)];
    const to=shuffle(ks.filter(k=>k!==from&&wbSplit(f[k])[0]!==wbSplit(f[from])[0]))[0];
    if(!to)return;
    const ans=wbSplit(f[to]);
    out.push({kind:'type',answer:ans,show:ans[0],prompt:`<div class="qlabel">Словообразование</div><div class="qtext">${esc(wbSplit(f[from])[0])} <span class="muted">(${WBPOS[from]})</span> → ${WBPOS[to]}</div><div class="qsub">${esc(wbR(f,from))}</div>`,hint:'Первая буква: '+ans[0][0],explain:wbFamRu(f)});
  });
  return out;
}
let wbView=false,wbTheory=false;
const WB_TH=[
 ['Отрицательные приставки','Приставка меняет смысл на противоположный, часть речи не меняется. Выбор приставки зависит от первой буквы и от слова, строгого правила нет, поэтому лучше запоминать парами.',[
  ['un-','самая частая, к прилагательным, причастиям и глаголам','happy → unhappy (несчастный), usual → unusual, lock → unlock'],
  ['in-','латинские слова, часто на -ble, -ent, -ate','possible → impossible, direct → indirect, accurate → inaccurate'],
  ['im-','in- перед буквами m, p, b','polite → impolite, patient → impatient, mature → immature'],
  ['il-','in- перед l','legal → illegal, logical → illogical, literate → illiterate'],
  ['ir-','in- перед r','regular → irregular, relevant → irrelevant, responsible → irresponsible'],
  ['dis-','к глаголам и существительным, «отменить действие»','agree → disagree, appear → disappear, advantage → disadvantage'],
  ['non-, mis-','non- = «не относящийся к»; mis- = «неправильно»','non-fiction, non-smoking; misunderstand, misuse']]],
 ['Суффиксы существительных','Превращают глагол или прилагательное в «название». В Writing именно так делают текст более академичным.',[
  ['-tion / -sion','действие, результат (глагол → сущ.)','educate → education, decide → decision, protect → protection'],
  ['-ment','результат действия','develop → development, achieve → achievement, manage → management'],
  ['-ness','состояние (от прилагательного)','happy → happiness, kind → kindness, aware → awareness'],
  ['-ity / -y','свойство, качество','able → ability, safe → safety, difficult → difficulty'],
  ['-ance / -ence','состояние, процесс','depend → dependence, differ → difference, assist → assistance'],
  ['-er / -or / -ist / -ant','человек (деятель)','manage → manager, act → actor, science → scientist, apply → applicant'],
  ['-th и чередование корня','короткие слова с изменением корня','strong → strength, long → length, grow → growth']]],
 ['Суффиксы прилагательных','Превращают существительное или глагол в «описание». Следи за смыслом: -ful «полный чего-то», -less «без чего-то».',[
  ['-ful','полный чего-то','care → careful, help → helpful, success → successful'],
  ['-less','без чего-то','care → careless, help → helpless, use → useless'],
  ['-able / -ible','можно что-то сделать','achieve → achievable, accept → acceptable, visible'],
  ['-ous','обладающий качеством','danger → dangerous, variety → various, prosper → prosperous'],
  ['-ive','склонный, направленный на','create → creative, effect → effective, attract → attractive'],
  ['-al / -ic / -ical','относящийся к','economy → economic, culture → cultural, politics → political'],
  ['-ed / -ing','состояние / вызывающее состояние','interested (я заинтересован) и interesting (интересный)']]],
 ['Суффиксы глаголов и наречий','Глаголы образуют от прилагательных и существительных; наречие почти всегда получается из прилагательного добавлением -ly.',[
  ['-ise / -ize','сделать таким','global → globalise, economy → economise, organ → organise'],
  ['-en','делать более …','wide → widen, strength → strengthen, deep → deepen'],
  ['-ify','делать','simple → simplify, pure → purify, clear → clarify'],
  ['-ate','делать, совершать','motivate, migrate, participate'],
  ['-ly (наречие)','от прилагательного','careful → carefully, quick → quickly, effective → effectively'],
  ['особые случаи','правописание меняется','happy → happily (y → i), possible → possibly, economic → economically (-ally)']]]
];
const WB_TIPS=['Сначала определи, какая часть речи нужна на месте пропуска: после the / a / her нужно существительное, перед существительным прилагательное, после глагола to be прилагательное, после глагола наречие, после to глагол.','Проверь смысл: нужен ли минус (un-, dis-, -less) или плюс.','Проверь число: если перед пропуском стоит many или нет артикля, возможно, нужно множественное число (decisions).','Проверь написание: y → i (happy → happiness), убрать немое e (create → creation), удвоение согласной (begin → beginner).'];
function wbTheoryHtml(){
  return `<div class="qhead"><button class="link" id="wbt">Словообразование</button><span>Теория</span></div>
   <div class="intro">В английском новые слова часто собираются из корня, приставки и суффикса. Если знаешь значение приставки и суффикса, можешь «разобрать» незнакомое слово и собрать нужное. Ниже короткие таблицы: суффикс, зачем он нужен, примеры с переводом.</div>
   ${WB_TH.map(([h,t,rows])=>`<h2>${h}</h2><div class="note">${t}</div><div class="tbl">${rows.map(r=>`<div class="tr"><b>${esc(r[0])}</b><span>${esc(r[1])}</span><em>${esc(r[2])}</em></div>`).join('')}</div>`).join('')}
   <h2>Как решать задание на словообразование</h2><ol class="hl2">${WB_TIPS.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>
   <div class="row"><button class="btn" id="wbgo">Перейти к практике</button></div>`;
}
function renderWB(){
  if(wbTheory){$('main').innerHTML=`<div class="hub">${wbTheoryHtml()}</div>`;$('wbt').onclick=()=>{wbTheory=false;renderWB();};$('wbgo').onclick=()=>{wbTheory=false;renderWB();};return;}
  const lv=[['1','Уровень 1: отрицание','happy → unhappy, possible → impossible'],['2','Уровень 2: простые группы слов','decide → decision → decisive'],['3','Уровень 3: академические группы слов','economy → economic → economist']];
  $('main').innerHTML=`<div class="hub"><div class="qhead"><button class="link" id="wback">Лексика</button><span>Словообразование</span></div>
   <div class="intro">В IELTS и в Writing важно уметь собрать нужную форму слова: из глагола сделать существительное, из существительного прилагательное, из положительного отрицательное. Начни с теории, потом практика от простого к сложному. В каждом блоке 10 заданий, после ответа видны все формы слова с переводом.</div>
   <div class="row"><button class="btn" id="wth">📖 Теория: приставки и суффиксы</button></div>
   <div class="modes">${lv.map(l=>`<button class="mode" data-l="${l[0]}"><b>${l[1]}</b><span>${l[2]}</span><span class="gp">Пройдено блоков: ${(S.wbDone&&S.wbDone[l[0]])||0}</span></button>`).join('')}</div>
   <div class="row"><button class="btn ghost" id="wfam">Все слова с переводом</button><button class="btn ghost" id="wgen">✨ Предложения от Claude (как в тестах)</button></div><div id="wout"></div></div>`;
  $('wback').onclick=()=>{lexView=null;render();};
  $('wth').onclick=()=>{wbTheory=true;renderWB();};
  $('main').querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>wbSession(+b.dataset.l));
  $('wgen').onclick=()=>genLex('wb',THEMES[Math.floor(Math.random()*THEMES.length)],[],$('wout'),$('wgen'));
  $('wfam').onclick=()=>{
    const li=f=>`<li class="item"><div>${wbFamRu(f)}</div></li>`;
    $('main').innerHTML=`<div class="hub"><div class="qhead"><button class="link" id="wb2">Назад</button><span>Все слова с переводом</span></div><h2>Уровень 2</h2><ul class="list">${WB2.map(li).join('')}</ul><h2>Уровень 3</h2><ul class="list">${WB3.map(li).join('')}</ul></div>`;
    $('wb2').onclick=renderWB;
  };
}
function wbSession(level){
  const qs=wbQuestions(level,10),total=qs.length;let queue=qs.slice(),okN=0,xp=0,i=0;
  runQuiz({auto:true,onExit:()=>renderWB(),
    next(){return queue.shift()||null;},
    progress:()=>`Верно: ${okN} из ${total}`,
    onAnswer(q,ok){if(ok){okN++;xp+=4;}},
    onFinish(){addXP(xp);S.wbDone=S.wbDone||{};S.wbDone[level]=(S.wbDone[level]||0)+1;save();
      summary('Блок завершён',`<div class="qsub">Верно: ${okN} из ${total}. +${xp} XP.</div>`,[{t:'Ещё блок',f:()=>wbSession(level)},{t:'К уровням',ghost:true,f:renderWB}]);}});
}

// word-building cloze with Claude
function wbMoreBtn(){return '';}
