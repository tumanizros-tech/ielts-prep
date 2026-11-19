// Textbook-style exercises (original). EXR[clusterId]=[{h:instruction, q:[items in grammar2 format]}]
const EXR={};
EXR.present=[
 {h:'A. Put the verb in brackets into the correct form (Present Simple or Continuous)',q:[
  ['t','My brother ___ (work) in a hospital. He is a nurse.','works','Постоянная работа: Present Simple, he + works.'],
  ['t','Please be quiet. The baby ___ (sleep).','is sleeping|\'s sleeping','Происходит сейчас: Present Continuous.'],
  ['t','How often ___ you ___ (go) to the gym?','do you go','How often + do + you + V1.'],
  ['t','She ___ (not / eat) meat. She is a vegetarian.','does not eat|doesn\'t eat','Постоянная привычка: does not + V1.'],
  ['t','Why ___ you ___ (wear) that coat? It\'s hot today.','are you wearing','Сейчас, конкретная ситуация: Present Continuous.'],
  ['t','The earth ___ (go) round the sun.','goes','Научный факт: Present Simple.']]},
 {h:'B. Choose the correct sentence',q:[
  ['f','He doesn\'t understand the question.','He isn\'t understanding the question.','He doesn\'t understands the question.','He not understand the question.','Understand — глагол состояния; после doesn\'t нет -s.'],
  ['f','I\'m looking for my keys.','I look for my keys now.','I\'m look for my keys.','I am looks for my keys.','Идёт поиск сейчас: am + V-ing.'],
  ['f','Do you know what time it is?','Are you knowing what time it is?','Do you knowing what time it is?','Know you what time it is?','Know без -ing.'],
  ['f','She usually takes the bus to work.','She usually is taking the bus to work.','She usually take the bus to work.','She is usually take the bus to work.','Usually — привычка: Present Simple.'],
  ['f','Prices are rising every year.','Prices is rising every year.','Prices are rise every year.','Prices rising every year.','Тенденция: are rising (подлежащее во мн. числе).'],
  ['f','What does this word mean?','What is this word meaning?','What does this word means?','What means this word?','Mean — состояние; does + V1.']]}];
EXR.past=[
 {h:'A. Put the verb in brackets into the correct form (Past Simple or Past Continuous)',q:[
  ['t','I ___ (see) Anna at the station yesterday.','saw','See, saw, seen.'],
  ['t','When the phone rang, I ___ (have) a shower.','was having','Процесс прерван коротким действием: was + V-ing.'],
  ['t','What ___ you ___ (do) at 8 o\'clock last night?','were you doing','Процесс в момент в прошлом: were + you + V-ing.'],
  ['t','He ___ (fall) asleep while he was watching TV.','fell','Короткое действие: Past Simple, fall → fell.'],
  ['t','We ___ (not / go) out last weekend because it rained.','did not go|didn\'t go','Отрицание: did not + V1.'],
  ['t','She ___ (use) to live in Spain, but now she lives in Italy.','used','used to + V1 — прошлая привычка.']]},
 {h:'B. Find the correct sentence',q:[
  ['f','Did you enjoy the party?','Did you enjoyed the party?','Do you enjoyed the party?','Were you enjoy the party?','После did — V1.'],
  ['f','I was reading when he came in.','I read when he was coming in.','I was reading when he was come in.','I were reading when he came in.','Процесс: was reading; короткое: came.'],
  ['f','They didn\'t have a car in those days.','They didn\'t had a car in those days.','They hadn\'t a car in those days.','They not had a car in those days.','didn\'t + V1.'],
  ['f','What were you doing at six?','What did you doing at six?','What you were doing at six?','What was you doing at six?','You — were.'],
  ['f','She used to be shy.','She use to be shy.','She was used to be shy.','She used be shy.','used to + V1.'],
  ['f','We met in 2015.','We have met in 2015.','We meeting in 2015.','We were meet in 2015.','Точный год: Past Simple.']]}];
EXR.perfect=[
 {h:'A. Put the verb in brackets into the correct form (Present Perfect)',q:[
  ['t','I ___ (live) here since 2019.','have lived|\'ve lived','Since + момент: Present Perfect.'],
  ['t','She ___ (not / finish) her homework yet.','has not finished|hasn\'t finished','Yet в отрицании: has not + V3.'],
  ['t','___ you ever ___ (try) sushi?','have you ever tried','Вопрос об опыте: Have you ever + V3.'],
  ['t','How long ___ they ___ (be) married?','have they been','How long + have + S + been.'],
  ['t','I ___ (work) all morning and I\'m tired.','have been working|\'ve been working','Процесс до сих пор: have been + V-ing.'],
  ['t','Look! Somebody ___ (break) the window.','has broken','Результат виден сейчас: has + V3.']]},
 {h:'B. Choose the correct word: for, since, ever, never, just, yet',q:[
  ['m','I haven\'t seen him ___ last Monday.','since','for','ago','from','Since + момент начала.'],
  ['m','We\'ve known each other ___ ten years.','for','since','from','during','For + длительность.'],
  ['m','Has she ___ been to Italy?','ever','yet','since','just','Ever в вопросе об опыте.'],
  ['m','The train has ___ left. You\'ve missed it.','just','ever','since','for','Just = только что.'],
  ['m','I have ___ heard of that band. Who are they?','never','yet','since','for','Never = ни разу.'],
  ['m','Have you finished your essay ___?','yet','since','ever','for','Yet в вопросах.']]}];
EXR.perfect2=[
 {h:'A. Present Perfect or Past Simple? Choose',q:[
  ['m','I ___ my wallet. Can you help me look for it?','have lost','lost','had lost','was losing','Результат важен сейчас.'],
  ['m','Mozart ___ more than 600 pieces of music.','wrote','has written','had written','was writing','Конкретный человек из прошлого: Past Simple.'],
  ['m','___ you ___ your homework yet?','Have, done','Did, done','Had, done','Are, doing','Yet + Present Perfect.'],
  ['m','I ___ in Paris last summer.','was','have been','had been','am','Last summer: Past Simple.'],
  ['m','She ___ three books this year.','has written','wrote','had written','writes','Период this year ещё идёт.'],
  ['m','When ___ you ___ him?','did, meet','have, met','had, met','do, meet','When — только Past Simple.']]},
 {h:'B. Put the verb into the Past Simple or Past Perfect',q:[
  ['t','When I got to the party, Tom ___ (already / leave).','had already left','Ушёл раньше, чем я пришла: Past Perfect.'],
  ['t','She felt tired because she ___ (not / sleep) well.','had not slept|hadn\'t slept','Причина раньше следствия: had not + V3.'],
  ['t','After he ___ (finish) his work, he went home.','had finished','Сначала закончил: had + V3.'],
  ['t','I ___ (never / see) snow before I moved to Canada.','had never seen','До переезда: had never + V3.'],
  ['t','The film ___ (start) when we arrived, so we missed the beginning.','had started','Фильм начался до нашего прихода.'],
  ['t','They ___ (wait) for an hour when the bus finally came.','had been waiting','Длительный процесс до момента в прошлом.']]}];
EXR.future=[
 {h:'A. Choose will or going to (or Present Continuous)',q:[
  ['m','I\'ve decided. I ___ study law next year.','am going to','will','study','am study','Решение уже принято: going to.'],
  ['m','"The phone is ringing." — "I ___ get it."','\'ll','am going to','am getting','get','Решение в момент речи: will.'],
  ['m','I ___ my dentist at 5 tomorrow. I made an appointment.','am seeing','will see','see','shall see','Договорённость: Present Continuous.'],
  ['m','Watch out! You ___ fall!','are going to','will','are going','fall','Признак перед глазами.'],
  ['m','I think Italy ___ win the match.','will','is going','is winning','wins','Мнение: I think + will.'],
  ['m','The film ___ at 9.15.','starts','are starting','starting','will starts','Расписание: Present Simple.']]},
 {h:'B. Put the verb in brackets into the correct form',q:[
  ['t','If it ___ (rain) tomorrow, we will cancel the picnic.','rains','После if: Present Simple.'],
  ['t','I will call you as soon as I ___ (arrive).','arrive','После as soon as: Present Simple.'],
  ['t','By next June I ___ (finish) my course.','will have finished|\'ll have finished','К моменту в будущем: will have + V3.'],
  ['t','This time tomorrow I ___ (fly) to London.','will be flying|\'ll be flying','Процесс в точке будущего.'],
  ['t','Don\'t worry. I ___ (not / tell) anyone.','will not tell|won\'t tell','Обещание: will + not.'],
  ['t','When she ___ (come), we will start.','comes','После when: Present Simple.']]}];
EXR.haveaux=[
 {h:'A. Complete with have, has, do, does or did',q:[
  ['t','___ you got a pen? (British English)','have','Have you got…?'],
  ['t','She ___ a shower every morning.','has','Have как действие: she has.'],
  ['t','___ they have a car?','do','Вопрос с have как с обычным глаголом: Do they have…?'],
  ['t','He ___ not like seafood.','does','He + does not.'],
  ['t','What time ___ the film start yesterday?','did','Past Simple вопрос: did.'],
  ['t','We ___ got any milk left.','haven\'t|have not','Have got в отрицании: haven\'t got.']]},
 {h:'B. Short answers and agreement',q:[
  ['m','"I\'m hungry." — "___ I."','So am','So do','Neither am','So have','Be: So am I.'],
  ['m','"I didn\'t sleep well." — "___ I."','Neither did','So did','Neither do','Nor was','Didn\'t: Neither did I.'],
  ['m','"Is he coming?" — "I hope ___."','so','it','yes','that','I hope so.'],
  ['m','"Has she left?" — "I don\'t ___."','think so','think it','think that','hope','I don\'t think so.'],
  ['m','"I love pizza." — "___ I."','So do','So am','Neither do','Too do','Love: So do I.'],
  ['m','"Will it rain?" — "I\'m afraid ___."','so','yes','that','it will','I\'m afraid so.']]}];
EXR.modal1=[
 {h:'A. Complete with can, could, was able to, be able to',q:[
  ['m','When I was a child, I ___ climb any tree.','could','can','will can','am able to','Умение в прошлом вообще.'],
  ['m','The firefighters ___ rescue everyone from the building.','were able to','could','can','are able to','Один результат: were able to.'],
  ['m','I haven\'t ___ to sleep well recently.','been able','can','could','able','Present Perfect: been able to.'],
  ['m','Next year I ___ drive.','will be able to','will can','can to','could','Будущее: will be able to.'],
  ['m','She ___ speak French when she was five.','could','is able','can','will be able','Умение в прошлом.'],
  ['m','He ___ walk after the accident, but now he can.','couldn\'t','can\'t','isn\'t able','wasn\'t can','Раньше не мог: couldn\'t.']]},
 {h:'B. Make polite requests and offers',q:[
  ['o','Could you open the window, please?','Вы не откроете окно?','Could + you + V1.'],
  ['o','Would you like some more tea?','Хотите ещё чаю?','Would you like + some…?'],
  ['o','Shall I help you with the bags?','Мне помочь с сумками?','Shall I + V1?'],
  ['m','___ you mind waiting a moment?','Would','Can','Do','Shall','Would you mind + -ing.'],
  ['m','Excuse me, ___ I use your phone?','could','do','am','will','Разрешение: could I.'],
  ['m','You ___ have called me. I was worried.','could','can','will','must to','Упрёк: could have + V3.']]}];
EXR.modal2=[
 {h:'A. Choose must, can\'t or might',q:[
  ['m','She\'s been driving for ten hours. She ___ be tired.','must','can\'t','might not','needn\'t','Вывод: почти уверена.'],
  ['m','He ___ be at home. I saw him leave an hour ago.','can\'t','must','might','will','Не может быть.'],
  ['m','I\'m not sure where Anna is. She ___ be in the library.','might','must','can\'t','should have','Возможно.'],
  ['m','They ___ have left already. Their car isn\'t here.','must','can','need','might to','Вывод о прошлом.'],
  ['m','It ___ be true. It\'s impossible!','can\'t','must','might','will','Невозможно.'],
  ['m','Take a coat. It ___ rain.','might','must','can\'t','would','Возможно.']]},
 {h:'B. Rewrite using must have, can\'t have or might have',q:[
  ['t','I\'m sure he forgot. → He ___ forgotten. (Write: must have)','must have','Уверена, что да: must have + V3.'],
  ['t','It\'s impossible that she saw us. → She ___ seen us. (Write: can\'t have)','can\'t have|cannot have','Невозможно в прошлом.'],
  ['t','Perhaps they got lost. → They ___ got lost. (Write: might have)','might have','Возможно: might have.'],
  ['t','I\'m sure she is Italian. → She ___ Italian. (Write: must be)','must be','Вывод о настоящем.'],
  ['t','I don\'t think it is Tom. → It ___ be Tom. (Write: can\'t)','can\'t|cannot','Не он: can\'t.'],
  ['t','Maybe he is sleeping. → He ___ sleeping. (Write: might be)','might be','Возможно: might + be.']]}];
EXR.modal3=[
 {h:'A. Choose must, mustn\'t, have to, don\'t have to, should',q:[
  ['m','Passengers ___ use mobile phones during take-off. It\'s forbidden.','mustn\'t','don\'t have to','needn\'t','shouldn\'t have','Запрет.'],
  ['m','You ___ wear a uniform at this school. It\'s a rule.','have to','should to','ought','must to','Правило: have to.'],
  ['m','It\'s a holiday tomorrow, so we ___ get up early.','don\'t have to','mustn\'t','can\'t','shouldn\'t to','Не нужно.'],
  ['m','You look tired. You ___ go to bed early.','should','have','must to','are','Совет.'],
  ['m','I ___ work late yesterday. It was awful.','had to','must','have to','should','Прошлое от have to.'],
  ['m','You ___ better take an umbrella.','had','have','should','would','had better.']]},
 {h:'B. Complete with the correct form',q:[
  ['t','It\'s time we ___ (leave).','left','It\'s time + Past Simple.'],
  ['t','I\'d rather ___ (stay) at home than go out.','stay','would rather + V1.'],
  ['t','You ___ (not / have to) pay. It\'s free.','don\'t have to|do not have to','Не нужно платить.'],
  ['t','We are supposed ___ (meet) at six.','to meet','be supposed to + V1.'],
  ['m','You ___ to apologise. It was your fault.','ought','must','should to','had','ought to + V1.'],
  ['m','Do I ___ to wear a tie?','have','must','should','need','Do I have to…?']]}];
EXR.cond=[
 {h:'A. Put the verb in brackets into the correct form (conditionals)',q:[
  ['t','If you ___ (heat) ice, it melts.','heat','Общая истина: Present Simple.'],
  ['t','If I ___ (have) more time, I would learn Spanish.','had','Тип 2: If + Past Simple.'],
  ['t','If she ___ (not / forget) her phone, she would have called us.','had not forgotten|hadn\'t forgotten','Тип 3: If + had + V3.'],
  ['t','I would buy that car if I ___ (be) rich.','were|was','Тип 2: if I were.'],
  ['t','Unless you ___ (hurry), you will miss the bus.','hurry','Unless + Present Simple.'],
  ['t','If it ___ (not / rain), we will go to the beach.','does not rain|doesn\'t rain','Тип 1: Present Simple.']]},
 {h:'B. Choose the correct sentence',q:[
  ['f','If I were you, I would apply.','If I was you, I will apply.','If I am you, I would apply.','If I were you, I will apply.','Тип 2: were + would.'],
  ['f','I wish I had a bigger flat.','I wish I have a bigger flat.','I wish I would have a bigger flat.','I wish I having a bigger flat.','wish + Past Simple.'],
  ['f','If he had known, he would have helped.','If he knew, he would have helped.','If he had known, he will help.','If he would know, he would help.','Тип 3.'],
  ['f','Take a map in case you get lost.','Take a map in case you will get lost.','Take a map if case you get lost.','Take a map in case you got lost.','In case + Present.'],
  ['f','She will come as long as you invite her.','She will come as long as you will invite her.','She will come as long you invite her.','She would come as long as you invite her.','As long as + Present.'],
  ['f','I wish it would stop raining.','I wish it will stop raining.','I wish it stops raining.','I wish it to stop raining.','wish + would.']]}];
EXR.passive=[
 {h:'A. Put the verb into the passive',q:[
  ['t','The room ___ (clean) every day.','is cleaned','Present Simple Passive.'],
  ['t','The letters ___ (post) yesterday.','were posted','Past Simple Passive.'],
  ['t','The bridge ___ (build) at the moment.','is being built','Present Continuous Passive.'],
  ['t','The problem ___ (solve) by next week.','will have been solved','Future Perfect Passive.'],
  ['t','Many houses ___ (destroy) in the storm last year.','were destroyed','Past Simple Passive, plural.'],
  ['t','This form must ___ (fill) in.','be filled','Модальный пассив: must be + V3.']]},
 {h:'B. Rewrite in the passive. Complete the sentence',q:[
  ['t','Someone stole my bike. → My bike ___ .','was stolen','Past Simple Passive.'],
  ['t','They are repairing the road. → The road ___ repaired.','is being','is being repaired.'],
  ['t','People say he is rich. → He ___ be rich. (is said to)','is said to','He is said to be…'],
  ['t','I paid a mechanic to repair my car. → I had my car ___ .','repaired','have + object + V3.'],
  ['t','Nobody has told me. → I have not ___ told.','been','have + been + V3.'],
  ['t','The police arrested him. → He got ___ .','arrested','get + V3.']]}];
EXR.reported=[
 {h:'A. Report the sentence',q:[
  ['t','"I live in Rome." → She said she ___ in Rome.','lived','Сдвиг назад: live → lived.'],
  ['t','"We are tired." → They said they ___ tired.','were','are → were.'],
  ['t','"I have seen it." → He said he ___ seen it.','had','have seen → had seen.'],
  ['t','"I will help you." → She said she ___ help me.','would','will → would.'],
  ['t','"I can swim." → He said he ___ swim.','could','can → could.'],
  ['t','"I was ill." → She said she ___ been ill.','had','was → had been.']]},
 {h:'B. Report the question or request',q:[
  ['m','"Where is the station?" → He asked me where ___.','the station was','was the station','is the station','the station is','Порядок как в утверждении, сдвиг: was.'],
  ['m','"Do you smoke?" → She asked me ___ I smoked.','if','that','what','do','Общий вопрос: if / whether.'],
  ['m','"Close the door." → He told me ___ the door.','to close','close','closing','that close','tell + object + to V1.'],
  ['m','"Don\'t touch it." → She told us ___ it.','not to touch','don\'t touch','to not touching','not touch','not to + V1.'],
  ['m','"What are you doing?" → She asked what I ___.','was doing','am doing','did','do','Сдвиг: was doing.'],
  ['m','"Have you finished?" → He asked if I ___ finished.','had','have','did','was','Present Perfect → Past Perfect.']]}];
EXR.questions=[
 {h:'A. Make questions',q:[
  ['o','Where did you go on holiday?','Куда ты ездила в отпуск?','Where + did + you + go…?'],
  ['o','How long have you lived here?','Как давно ты здесь живёшь?','How long + have + you + lived.'],
  ['o','Who wrote this book?','Кто написал эту книгу?','Вопрос к подлежащему: без did.'],
  ['o','Do you know what time it is?','Вы не знаете, который час?','Косвенный вопрос: it is.'],
  ['o','What are you looking at?','На что ты смотришь?','Предлог в конце.'],
  ['o','Which of these books did you like most?','Какая из этих книг тебе понравилась больше всего?','Which + of…']]},
 {h:'B. Add the question tag',q:[
  ['t','You\'re a student, ___?','aren\'t you','Утверждение → отрицательный tag.'],
  ['t','She doesn\'t smoke, ___?','does she','Отрицание → положительный tag.'],
  ['t','They have left, ___?','haven\'t they','Have → haven\'t.'],
  ['t','Let\'s start, ___?','shall we','Let\'s → shall we.'],
  ['t','He can swim, ___?','can\'t he','Can → can\'t.'],
  ['t','It rained yesterday, ___?','didn\'t it','Past Simple → didn\'t.']]}];
EXR.subj=[
 {h:'A. Complete with the correct form',q:[
  ['t','The doctor suggested that he ___ (rest) for a week.','rest','После suggest that — V1.'],
  ['t','It is vital that she ___ (be) here on time.','be','Subjunctive: be.'],
  ['t','The teacher demanded that every student ___ (submit) the essay.','submit','Demand that + V1.'],
  ['t','It\'s time you ___ (go) to bed.','went','It\'s time + Past Simple.'],
  ['t','If only I ___ (know) the answer!','knew','If only + Past Simple.'],
  ['m','He insisted that she ___ pay.','not','doesn\'t','didn\'t','wasn\'t to','Insist that + not + V1.']]},
 {h:'B. Choose the correct sentence',q:[
  ['f','I recommend that he apply for the job.','I recommend that he applies for the job.','I recommend that he to apply for the job.','I recommend that he applying for the job.','Subjunctive без -s.'],
  ['f','It is essential that rules be followed.','It is essential that rules are following.','It is essential that rules to be followed.','It is essential that rules been followed.','be followed.'],
  ['f','It\'s high time we left.','It\'s high time we leave.','It\'s high time we will leave.','It\'s high time we leaving.','Past Simple.'],
  ['f','If only she were here!','If only she is here!','If only she will be here!','If only she being here!','Past: were.'],
  ['f','They suggested that I take a break.','They suggested that I took a break to.','They suggested me to take a break.','They suggested that I taking a break.','suggest that + V1.'],
  ['f','I wish I knew his number.','I wish I know his number.','I wish I will know his number.','I wish I knowing his number.','wish + Past.']]}];
