// Grammar topics. q types: mc {q,o,a,e}, type {q,a:[...],e}, order {w:[tokens],a,ru,e}
const GR=[
{id:'articles',title:'Артикли',sub:'a / an / the / без артикля',
rule:`<p><b>a / an</b>: один из многих, первое упоминание, профессия. <i>an</i> ставим перед гласным <i>звуком</i>: an hour, an engineer, но a university.</p>
<p><b>the</b>: конкретный предмет, известный обоим собеседникам; единственный в своём роде (the sun, the Internet); повторное упоминание; превосходная степень и порядковые числа (the largest, the first); the + прилагательное для групп людей (the elderly, the poor).</p>
<p><b>Без артикля</b>: множественное число и неисчисляемые слова в общем смысле. <i>Education is important. Cars cause pollution.</i> Большинство стран и городов тоже без артикля, но the United States, the Netherlands.</p>`,
q:[
{t:'mc',q:'She works as ___ engineer in a large company.',o:['a','an','the','—'],a:1,e:'Профессию называют с a/an. Engineer начинается с гласного звука, поэтому an.'},
{t:'mc',q:'___ education is the key to economic growth.',o:['The','An','—','A'],a:2,e:'Education в общем смысле неисчисляемое слово, артикль не нужен.'},
{t:'mc',q:'I read a report yesterday. ___ report said that unemployment is falling.',o:['A','The','—','An'],a:1,e:'Отчёт уже упоминался, теперь он конкретный, поэтому the.'},
{t:'mc',q:'Which is ___ largest city in the country?',o:['a','the','—','an'],a:1,e:'Превосходная степень почти всегда с the.'},
{t:'mc',q:'He waited for ___ hour at the airport.',o:['a','the','an','—'],a:2,e:'Hour начинается с гласного звука (h не читается), поэтому an.'},
{t:'mc',q:'___ elderly often find new technology difficult.',o:['The','An','A','—'],a:0,e:'The + прилагательное обозначает группу людей: the elderly, the poor, the young.'},
{t:'mc',q:'Which sentence is correct?',o:['The life is full of surprises.','Life is full of surprises.','A life is full of surprises.','The lives is full of surprises.'],a:1,e:'Жизнь в общем смысле употребляется без артикля.'},
{t:'mc',q:'She is studying at ___ university in London.',o:['an','the','—','a'],a:3,e:'University начинается со звука /j/, который ведёт себя как согласный, поэтому a.'}
]},
{id:'perfect',title:'Present Perfect и Past Simple',sub:'have done или did',
rule:`<p><b>Past Simple</b>: завершённое действие в конкретное время в прошлом. Маркеры: yesterday, last year, in 2019, ago, when.</p>
<p><b>Present Perfect</b> (have / has + V3): связь с настоящим. Опыт (ever, never), результат, который важен сейчас (just, already, yet), период, который ещё не закончился (this week, so far, recently), длительность (for + период, since + момент).</p>
<p>Нельзя: <i>I have seen him yesterday</i>. С точным временем только Past Simple. Конструкция <i>This is the first time...</i> требует Present Perfect.</p>`,
q:[
{t:'mc',q:'Scientists ___ the first image of a black hole in 2019.',o:['took','have taken','take','were taking'],a:0,e:'Указано точное время (in 2019), значит Past Simple.'},
{t:'mc',q:'The number of cars in the city ___ rapidly since 2010.',o:['grew','has grown','grows','is growing'],a:1,e:'Since + момент в прошлом, рост продолжается до сих пор: Present Perfect.'},
{t:'mc',q:'I ___ to Japan.',o:['have never been','never was','never have been',"didn't never go"],a:0,e:'Жизненный опыт без указания времени: Present Perfect, have never been.'},
{t:'type',q:'She ___ (live) in Moscow for ten years.',a:['has lived','has been living'],e:'For + период, действие длится до сих пор: Present Perfect.'},
{t:'mc',q:'When ___ you first meet your best friend?',o:['have','did','do','are'],a:1,e:'When спрашивает про конкретный момент в прошлом, поэтому Past Simple: did you meet.'},
{t:'type',q:'We ___ (not / receive) the results yet.',a:['have not received',"haven't received"],e:'Yet обычно идёт с Present Perfect.'},
{t:'mc',q:'Which sentence is correct?',o:['I have visited Paris last summer.','I visited Paris last summer.','I have visit Paris last summer.','I am visiting Paris last summer.'],a:1,e:'Last summer это конкретное время, нужен Past Simple.'},
{t:'mc',q:'This is the first time I ___ sushi.',o:['eat','ate','have eaten','am eating'],a:2,e:'После This is the first time ставим Present Perfect.'}
]},
{id:'conditionals',title:'Условные предложения',sub:'if … will / would / would have',
rule:`<p><b>Zero</b>: If + Present, Present. Общие истины: <i>If you heat water, it boils.</i></p>
<p><b>First</b>: If + Present Simple, will + V. Реальная возможность: <i>If it rains, we will stay at home.</i> После if не ставим will.</p>
<p><b>Second</b>: If + Past Simple, would + V. Нереальная или маловероятная ситуация сейчас: <i>If I had more time, I would travel.</i> Для I/he/she обычно were: <i>If I were you...</i></p>
<p><b>Third</b>: If + Past Perfect, would have + V3. Нереальное прошлое: <i>If she had left earlier, she would have caught the train.</i></p>
<p><b>Unless</b> = if not.</p>`,
q:[
{t:'mc',q:'If the ice caps melt, sea levels ___.',o:['will rise','would rise','rose','would have risen'],a:0,e:'Реальная возможность в будущем: If + Present Simple, will + V.'},
{t:'mc',q:'If I ___ more time, I would learn another language.',o:['have','had','will have','would have'],a:1,e:'Второй тип: If + Past Simple, would + V.'},
{t:'mc',q:'If governments had acted earlier, the damage ___ less severe.',o:['would be','would have been','will be','had been'],a:1,e:'Третий тип: If + Past Perfect, would have + V3.'},
{t:'type',q:'If it ___ (rain) tomorrow, we will cancel the trip.',a:['rains'],e:'После if в первом типе стоит Present Simple, не will.'},
{t:'mc',q:"___ you study harder, you won't pass the exam.",o:['If','Unless','When','Although'],a:1,e:'Unless = if not: Unless you study harder = If you don\'t study harder.'},
{t:'mc',q:'If I ___ you, I would take that job.',o:['am','were','will be','would be'],a:1,e:'Во втором типе после I используем were: If I were you.'},
{t:'type',q:'Water ___ (boil) if you heat it to 100 degrees.',a:['boils'],e:'Общая истина: If + Present Simple, Present Simple.'},
{t:'mc',q:"If she hadn't missed the train, she ___ on time.",o:['would arrive','would have arrived','will arrive','had arrived'],a:1,e:'Третий тип: would have + V3.'}
]},
{id:'passive',title:'Пассивный залог',sub:'be + V3',
rule:`<p><b>Форма</b>: be + V3. Нужен, когда важен результат, а не тот, кто действует, или когда исполнитель неизвестен. Часто встречается в научном и формальном стиле.</p>
<ul><li>Present Simple: <i>is built</i></li><li>Past Simple: <i>was built</i></li><li>Present Perfect: <i>has been built</i></li><li>Future: <i>will be built</i></li><li>Continuous: <i>is being built</i></li><li>С модальными: <i>can be done</i></li></ul>
<p>Исполнителя добавляем через <b>by</b>, только если он важен: <i>The report was written by a student.</i></p>`,
q:[
{t:'mc',q:'The bridge ___ in 1932.',o:['built','was built','has built','is built'],a:1,e:'Прошедшее время в пассиве: was/were + V3.'},
{t:'mc',q:'A new vaccine ___ at the moment.',o:['is developing','is being developed','is developed','has developed'],a:1,e:'Continuous в пассиве: is/are being + V3.'},
{t:'type',q:'The results ___ (publish) next month.',a:['will be published','are going to be published'],e:'Будущее в пассиве: will be + V3.'},
{t:'mc',q:'Which sentence is correct?',o:['The problem solved by the engineers.','The problem was solved by the engineers.','The problem was solve by the engineers.','The problem is solving by the engineers.'],a:1,e:'Нужна форма was + V3 (solved).'},
{t:'type',q:'Hundreds of jobs ___ (lose) since the factory closed.',a:['have been lost'],e:'Present Perfect в пассиве: have/has been + V3.'},
{t:'mc',q:'Plastic ___ recycled if it is sorted correctly.',o:['can','can be','can been','be can'],a:1,e:'Модальный глагол в пассиве: can be + V3.'},
{t:'order',w:['The','report','was','written','by','a','student.'],a:'The report was written by a student.',ru:'Отчёт был написан студентом.',e:'Порядок: подлежащее + was + V3 + by + исполнитель.'},
{t:'mc',q:'Smoking ___ in public places.',o:['forbids','is forbidden','is forbidding','has forbid'],a:1,e:'Запрещает кто-то, а курение запрещено: is forbidden.'}
]},
{id:'relative',title:'Придаточные с who / which / that',sub:'относительные местоимения',
rule:`<p><b>who</b> — люди, <b>which</b> — вещи, <b>that</b> — люди или вещи (только без запятых), <b>whose</b> — принадлежность, <b>where</b> — место.</p>
<p><b>Defining</b> (без запятых): нужно для смысла, можно that. Если местоимение является дополнением, его можно опустить: <i>the film (that) we watched</i>.</p>
<p><b>Non-defining</b> (в запятых): дополнительная информация, that нельзя. <i>London, which is the capital of the UK, is huge.</i> Which может относиться ко всему предыдущему предложению: <i>She failed the test, which surprised everyone.</i></p>`,
q:[
{t:'mc',q:'The scientist ___ discovered the vaccine won a prize.',o:['which','whose','who','where'],a:2,e:'Речь о человеке, поэтому who.'},
{t:'mc',q:'Cities ___ populations are growing quickly need more housing.',o:['who','whose','which','that'],a:1,e:'Whose показывает принадлежность: populations of cities.'},
{t:'mc',q:'London, ___ is the capital of the UK, attracts millions of tourists.',o:['that','which','who','whose'],a:1,e:'Дополнительная информация в запятых: that нельзя, нужно which.'},
{t:'type',q:'That is the house ___ I was born.',a:['where','in which'],e:'Для места используем where.'},
{t:'mc',q:'Which sentence is correct?',o:['The book, that I bought, is excellent.','The book that I bought is excellent.','The book, what I bought, is excellent.','The book who I bought is excellent.'],a:1,e:'Без запятых можно that. What и who здесь не подходят.'},
{t:'mc',q:'The report, ___ was published last week, shows an increase.',o:['that','which','what','who'],a:1,e:'После запятой that не используется, для вещи нужно which.'},
{t:'mc',q:'She failed the test, ___ surprised everyone.',o:['that','what','which','who'],a:2,e:'Which относится ко всей предыдущей части предложения.'},
{t:'mc',q:'The film ___ we watched last night was boring. Which word is NOT possible?',o:['that','which','who','(nothing)'],a:2,e:'Who только для людей. That, which или пропуск возможны.'}
]},
{id:'comparison',title:'Сравнения',sub:'-er / more / the most / as … as',
rule:`<p>Короткие прилагательные: <i>tall, taller, the tallest</i>. Длинные: <i>more important, the most important</i>. Исключения: good, better, the best; bad, worse, the worst; far, further.</p>
<p>Сравнение с <b>than</b>; равенство <b>as … as</b>. Усилители перед сравнительной степенью: <i>much, far, considerably, slightly</i> (но не very).</p>
<p>Нельзя: <i>more better</i>, <i>most best</i>. Конструкция <i>The more …, the more …</i> означает «чем больше, тем больше».</p>`,
q:[
{t:'mc',q:'Online shopping is usually ___ than shopping in stores.',o:['more cheap','cheaper','cheapest','more cheaper'],a:1,e:'Cheap короткое: cheaper.'},
{t:'mc',q:'This is ___ interesting article I have read.',o:['the more','the most','most','more'],a:1,e:'Превосходная степень длинного прилагательного: the most.'},
{t:'mc',q:'The situation is getting ___.',o:['badder','worse','more bad','worst'],a:1,e:'Bad, worse, the worst: неправильная форма.'},
{t:'type',q:'The ___ (high) the price, the lower the demand.',a:['higher'],e:'Конструкция the + сравнительная, the + сравнительная.'},
{t:'mc',q:'Which is correct?',o:['more better','much better','most better','gooder'],a:1,e:'Better уже сравнительная форма, усиливаем через much.'},
{t:'mc',q:'She is not ___ tall as her brother.',o:['than','as','that','like'],a:1,e:'Конструкция not as … as.'},
{t:'mc',q:'Online shopping is ___ more popular than it was ten years ago.',o:['very','far','most','too'],a:1,e:'Перед сравнительной степенью ставим far/much, но не very.'},
{t:'type',q:'Of all the students, Anna is ___ (hard-working).',a:['the most hard-working','the most hardworking','the hardest-working','the hardest working','the most hard working'],e:'Превосходная степень: the most hard-working (или the hardest-working).'}
]},
{id:'linking',title:'Слова-связки',sub:'although / despite / however',
rule:`<p><b>Контраст</b>: <i>although / though + предложение</i>, <i>despite / in spite of + существительное или -ing</i>. <i>However</i> ставим в начале нового предложения с запятой. <i>Whereas / while</i> противопоставляют два факта.</p>
<p><b>Причина и следствие</b>: because + предложение, because of + существительное; therefore, as a result, consequently + запятая.</p>
<p><b>Добавление</b>: moreover, furthermore, in addition.</p>
<p>Нельзя: <i>Although …, but …</i> и <i>Despite he was tired</i>.</p>`,
q:[
{t:'mc',q:'___ the heavy rain, the match continued.',o:['Although','Despite','However','Because'],a:1,e:'После despite идёт существительное (the heavy rain).'},
{t:'mc',q:'___ he was tired, he finished the report.',o:['Despite','Although','Because of','However'],a:1,e:'Дальше идёт целое предложение (he was tired), поэтому although.'},
{t:'mc',q:'The roads were icy. ___, many accidents occurred.',o:['Although','Despite','As a result','Whereas'],a:2,e:'As a result вводит следствие в новом предложении.'},
{t:'mc',q:'Some people prefer cities, ___ others prefer the countryside.',o:['whereas','despite','because of','so'],a:0,e:'Whereas противопоставляет две группы.'},
{t:'type',q:'The flight was cancelled ___ the storm. (because / because of)',a:['because of'],e:'После существительного (the storm) нужно because of.'},
{t:'mc',q:'Which is correct?',o:['Although it was cold, but we went out.','Although it was cold, we went out.','Despite it was cold, we went out.','In spite it was cold, we went out.'],a:1,e:'Although и but вместе не используются.'},
{t:'mc',q:'Exercise is good for health. ___, it improves mood.',o:['Despite','Moreover','Although','Because'],a:1,e:'Moreover добавляет ещё один аргумент.'},
{t:'order',w:['However,','the','results','were','not','statistically','significant.'],a:'However, the results were not statistically significant.',ru:'Однако результаты не были статистически значимыми.',e:'However в начале предложения и после него запятая.'}
]},
{id:'quantity',title:'Количество и исчисляемые слова',sub:'much / many / fewer / less / a number of',
rule:`<p><b>many, few, fewer</b> с исчисляемыми во множественном числе; <b>much, little, less</b> с неисчисляемыми. <i>a lot of</i> подходит везде.</p>
<p><b>a few / a little</b> = немного, но хватает; <b>few / little</b> = почти нет.</p>
<p><b>a number of</b> + мн. число (<i>a number of problems are</i>); <b>the number of</b> + ед. число (<i>the number of tourists has</i>).</p>
<p>Неисчисляемые: information, advice, research, evidence, progress, traffic, news. Нет мн. числа и нет a.</p>
<p>Each и every всегда с единственным числом.</p>`,
q:[
{t:'mc',q:'There are ___ jobs available than last year.',o:['less','fewer','little','much'],a:1,e:'Jobs исчисляемое, поэтому fewer.'},
{t:'mc',q:'We have very ___ information about the cause.',o:['few','many','little','a few'],a:2,e:'Information неисчисляемое, поэтому little.'},
{t:'mc',q:'A large number of students ___ studying abroad.',o:['is','are','has','was'],a:1,e:'A number of + множественное число, глагол во мн. числе.'},
{t:'mc',q:'The number of tourists ___ increased.',o:['have','has','are','were'],a:1,e:'The number of + единственное число.'},
{t:'mc',q:'Which is correct?',o:['many advices','a lot of advice','an advice','advices'],a:1,e:'Advice неисчисляемое слово.'},
{t:'type',q:'Is there ___ traffic in your city? (much / many)',a:['much'],e:'Traffic неисчисляемое, поэтому much.'},
{t:'mc',q:'Recent research ___ that sleep affects memory.',o:['show','shows','are showing','have shown'],a:1,e:'Research неисчисляемое, глагол в единственном числе.'},
{t:'mc',q:'Every student ___ a different opinion.',o:['have','has','are','were'],a:1,e:'Every + единственное число.'}
]},
{id:'prepositions',title:'Предлоги с глаголами и существительными',sub:'depend on, contribute to, increase in',
rule:`<p>Многие слова требуют определённого предлога. Их надо учить вместе:</p>
<ul><li><b>on</b>: depend on, rely on, focus on, an effect on, an impact on</li><li><b>to</b>: contribute to, lead to, access to, a solution to, similar to</li><li><b>in</b>: result in, an increase / decrease in, interested in</li><li><b>for</b>: responsible for, a reason for, demand for</li><li><b>from</b>: differ from, suffer from, benefit from, different from</li><li><b>of</b>: aware of, capable of, afraid of</li><li><b>with</b>: cope with, deal with</li></ul>`,
q:[
{t:'mc',q:'Many countries depend ___ imported oil.',o:['on','of','from','to'],a:0,e:'Depend on.'},
{t:'mc',q:'Regular exercise contributes ___ better health.',o:['for','to','in','at'],a:1,e:'Contribute to.'},
{t:'mc',q:'There has been a sharp increase ___ the price of housing.',o:['of','on','in','at'],a:2,e:'An increase in.'},
{t:'mc',q:'Plastic waste has a serious effect ___ marine life.',o:['on','to','for','of'],a:0,e:'An effect on.'},
{t:'mc',q:'This approach differs ___ the traditional one.',o:['to','from','than','with'],a:1,e:'Differ from.'},
{t:'mc',q:'Young people are more aware ___ climate issues than before.',o:['about','of','on','for'],a:1,e:'Be aware of.'},
{t:'type',q:'The new policy resulted ___ lower unemployment.',a:['in'],e:'Result in = привести к.'},
{t:'type',q:'Poor diet is responsible ___ many health problems.',a:['for'],e:'Be responsible for.'}
]}
];
