// -------- GAME STATE (SAME SYSTEM) --------
let playerName = '';
let currentQuestion = 0;
let score = 0;
let timer = null;
let timeLeft = 15;
let leaderboard = [];


// -------- QUESTIONS ARRAY — KEPT EXACT --------
const questions = [
{
question:"What is the primary purpose of the UAE's National Cybersecurity Strategy (NCSS)?",
arabicQuestion:"ما هو الهدف الرئيسي من الاستراتيجية الوطنية للأمن السيبراني؟",
answers:[
{text:"Block all international websites",arabic:"حظر جميع المواقع الدولية"},
{text:"Create a secure and resilient cyber infrastructure",arabic:"إنشاء بنية آمنة ومقاومة"},
{text:"Monitor all citizens",arabic:"مراقبة جميع المستخدمين"},
{text:"Replace all websites",arabic:"استبدال المواقع الحكومية"}
],
correct:1
},
{
question:"Which UAE authority is responsible for cybersecurity regulations?",
arabicQuestion:"أي جهة مسؤولة عن تنظيمات الأمن السيبراني؟",
answers:[
{text:"TRA",arabic:"هيئة تنظيم الاتصالات"},
{text:"Dubai Police",arabic:"شرطة دبي"},
{text:"Education Dept",arabic:"دائرة التعليم"},
{text:"Health Ministry",arabic:"وزارة الصحة"}
],
correct:0
},
{
question:"What is the UAE national cybersecurity hotline?",
arabicQuestion:"ما هو الخط الساخن للإبلاغ عن الحوادث؟",
answers:[
{text:"999",arabic:"999"},
{text:"901",arabic:"901"},
{text:"800 CRY",arabic:"800 CRY"},
{text:"800 SAFE",arabic:"800 SAFE"}
],
correct:2
},
{
question:"The UAE Cyber Security Council was established in which year?",
arabicQuestion:"تم إنشاء مجلس الأمن السيبراني في أي عام؟",
answers:[
{text:"2015",arabic:"2015"},
{text:"2018",arabic:"2018"},
{text:"2020",arabic:"2020"},
{text:"2022",arabic:"2022"}
],
correct:2
},
{
question:"Which month is UAE Cyber Awareness Month?",
arabicQuestion:"أي شهر هو شهر التوعية؟",
answers:[
{text:"January",arabic:"يناير"},
{text:"June",arabic:"يونيو"},
{text:"October",arabic:"أكتوبر"},
{text:"December",arabic:"ديسمبر"}
],
correct:2
}
];
// -------- END QUESTIONS --------


// -------- DOM INITIALIZATION --------
function initializeDOM(){
return {
welcome:document.getElementById('welcome-screen'),
countdown:document.getElementById('countdown-screen'),
quiz:document.getElementById('quiz-screen'),
result:document.getElementById('result-screen'),
nameInput:document.getElementById('player-name'),
questionText:document.getElementById('question-text'),
questionArabic:document.getElementById('question-arabic'),
answers:document.getElementById('answers-container'),
timerText:document.getElementById('timer-text'),
timerFill:document.getElementById('timer-fill')
};
}


// -------- SHOW QUESTION — SAME RESULT --------
function showQuestion(){
const dom = initializeDOM();

if(!dom.quiz || !dom.answers) return;

if(currentQuestion >= questions.length){
endGame();
return;
}

const q = questions[currentQuestion];

dom.questionText.textContent = q.question;
dom.questionArabic.textContent = q.arabicQuestion;

dom.answers.innerHTML = '';

q.answers.forEach((a,i)=>{
const card=document.createElement('div');
card.className='answer-card';

card.innerHTML=
'<p class="answer-text">'+a.text+'</p>'+
'<p class="answer-arabic">'+a.arabic+'</p>';

card.addEventListener('click',()=>selectAnswer(i));

dom.answers.appendChild(card);
});

startTimer();
}


// -------- TIMER — SAME SYSTEM --------
function startTimer(){
const dom = initializeDOM();

clearInterval(timer);
timeLeft=15;

timer=setInterval(()=>{
timeLeft--;

dom.timerText.textContent=timeLeft;
dom.timerFill.style.width=((timeLeft/15)*100)+'%';

if(timeLeft<=0) nextQuestion();

},1000);
}


function selectAnswer(i){
clearInterval(timer);

if(i===questions[currentQuestion].correct){
score+=1000;
}

nextQuestion();
}


function nextQuestion(){
currentQuestion++;
showQuestion();
}


// -------- END GAME — KEPT SAME RESULT LOGIC --------
function endGame(){
const dom = initializeDOM();

if(!dom.result) return;

dom.quiz.style.display='none';
dom.result.style.display='block';

document.getElementById('final-score').textContent=score;
document.getElementById('result-message').textContent=
"Your game finished with "+score+" points";

updateLeaderboard();
}


// -------- LEADERBOARD — SAME BEHAVIOR --------
function updateLeaderboard(){
leaderboard = leaderboard.map(x=>({...x,isCurrent:false}));

leaderboard.push({
name:playerName,
score:score,
isCurrent:true
});

leaderboard.sort((a,b)=>b.score-a.score);
leaderboard=leaderboard.slice(0,10);

localStorage.setItem('cyberQuizLeaderboard',JSON.stringify(leaderboard));

displayLeaderboard();
}


function displayLeaderboard(){
const entries=document.getElementById('leaderboard-entries');
if(!entries) return;

entries.innerHTML='';

leaderboard.forEach((e,i)=>{
const div=document.createElement('div');
div.className='leaderboard-entry';

let rank=i<3?['🥇','🥈','🥉'][i]: (i+1)+'.';

div.innerHTML=
'<span class="player-name">'+rank+' '+e.name+'</span>'+
'<span class="player-score">'+e.score+'</span>';

entries.appendChild(div);
});
}


// -------- START GAME — SAME RESULT --------
function startGame(){
const dom=initializeDOM();

dom.welcome.style.display='none';
dom.countdown.style.display='block';

setTimeout(()=>{
dom.countdown.style.display='none';
dom.quiz.style.display='block';
showQuestion();
},3000);
}


function restartGame(){
const dom=initializeDOM();
dom.result.style.display='none';
dom.welcome.style.display='block';

currentQuestion=0;
score=0;
}


// -------- INITIAL LOAD --------
document.addEventListener('DOMContentLoaded',()=>{
const saved=localStorage.getItem('cyberQuizLeaderboard');
if(saved) leaderboard=JSON.parse(saved);

showQuestion();
});


// expose
window.startGame=startGame;
window.restartGame=restartGame;
