// -------- GAME STATE --------
let playerName = '';
let currentQuestion = 0;
let score = 0;
let timer = null;
let timeLeft = 15;
let leaderboard = [];


// -------- QUESTIONS --------
const questions = [
{
question: "What is the primary purpose of the UAE's National Cybersecurity Strategy (NCSS)?",
arabicQuestion: "ما هو الهدف الرئيسي من الاستراتيجية الوطنية للأمن السيبراني؟",
answers: [
{text:"Block all international websites",arabic:"حظر جميع المواقع الدولية"},
{text:"Create a secure infrastructure",arabic:"إنشاء بنية آمنة"},
{text:"Monitor all citizens",arabic:"مراقبة الجميع"},
{text:"Replace all websites",arabic:"استبدال المواقع"}
],
correct: 1
},

{
question: "Which UAE authority is responsible for cybersecurity regulations?",
arabicQuestion: "أي جهة مسؤولة عن تنظيمات الأمن السيبراني؟",
answers: [
{text:"TRA",arabic:"هيئة تنظيم الاتصالات"},
{text:"Dubai Police",arabic:"شرطة دبي"},
{text:"Education Dept",arabic:"دائرة التعليم"},
{text:"Health Ministry",arabic:"وزارة الصحة"}
],
correct: 0
}
];
// -------- END QUESTIONS --------



// -------- INITIALIZE DOM --------
function initializeDOM() {
  return {
    welcomeScreen: document.getElementById('welcome-screen'),
    countdownScreen: document.getElementById('countdown-screen'),
    quizScreen: document.getElementById('quiz-screen'),
    resultScreen: document.getElementById('result-screen'),

    playerNameInput: document.getElementById('player-name'),
    questionText: document.getElementById('question-text'),
    questionArabic: document.getElementById('question-arabic'),
    answersContainer: document.getElementById('answers-container'),

    timerText: document.getElementById('timer-text'),
    timerFill: document.getElementById('timer-fill'),

    leaderboardEntries: document.getElementById('leaderboard-entries')
  };
}



// -------- SHOW QUESTION (KEPT SAME RESULT LOGIC) --------
function showQuestion() {
  const dom = initializeDOM();
  if (!dom.answersContainer) return;

  if (currentQuestion >= questions.length) {
    endGame();
    return;
  }

  const q = questions[currentQuestion];

  dom.questionText.textContent = q.question;
  dom.questionArabic.textContent = q.arabicQuestion;

  dom.answersContainer.innerHTML = '';

  q.answers.forEach((answer, index) => {

    const card = document.createElement('div');
    card.className = 'answer-card';

    card.innerHTML =
      '<p class="answer-text">' + answer.text + '</p>' +
      '<p class="answer-arabic">' + answer.arabic + '</p>';

    // ✅ THIS PART ONLY FIXED – SAME BIND
    card.addEventListener('click', function() {
      selectAnswer(index);
    });

    dom.answersContainer.appendChild(card);
  });

  startTimer();
}



// -------- TIMER – KEPT SAME --------
function startTimer() {
  const dom = initializeDOM();
  clearInterval(timer);

  timeLeft = 15;
  dom.timerText.textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    dom.timerText.textContent = timeLeft;
    dom.timerFill.style.width = ((timeLeft/15)*100)+'%';

    if (timeLeft <= 0) {
      nextQuestion();
    }
  }, 1000);
}



// -------- SELECT ANSWER – KEPT SAME --------
function selectAnswer(selectedIndex) {
  const dom = initializeDOM();

  clearInterval(timer);

  const correct = questions[currentQuestion].correct;

  if (selectedIndex === correct) {
    score += 1000;
  }

  nextQuestion();
}



function nextQuestion() {
  currentQuestion++;
  showQuestion();
}



function endGame() {
  const dom = initializeDOM();

  dom.quizScreen.style.display = 'none';
  dom.resultScreen.style.display = 'block';

  document.getElementById('final-score').textContent = score;
  document.getElementById('result-message').textContent =
    "Your game finished with " + score + " points";

  displayLeaderboard();
}



function displayLeaderboard() {
  const entries = document.getElementById('leaderboard-entries');
  if (!entries) return;

  entries.innerHTML = '';

  leaderboard = JSON.parse(localStorage.getItem('cyberQuizLeaderboard') || '[]');

  leaderboard.push({ name: playerName, score: score });

  leaderboard.sort((a,b)=>b.score-a.score);

  leaderboard.slice(0,10).forEach((e,i)=>{
    const div=document.createElement('div');
    div.className='leaderboard-entry';

    div.innerHTML=
      '<span class="player-name">' + (i+1) + '. ' + e.name + '</span>' +
      '<span class="player-score">' + e.score + '</span>';

    entries.appendChild(div);
  });

  localStorage.setItem('cyberQuizLeaderboard', JSON.stringify(leaderboard));
}



// -------- START GAME FUNCTION – BUTTON PART SAME --------
function startGame() {
  const dom = initializeDOM();

  dom.welcomeScreen.style.display = 'none';
  dom.countdownScreen.style.display = 'block';

  setTimeout(()=>{
    dom.countdownScreen.style.display='none';
    dom.quizScreen.style.display='block';
    showQuestion();
  },3000);
}



function restartGame() {
  const dom = initializeDOM();
  dom.resultScreen.style.display='none';
  dom.welcomeScreen.style.display='block';

  currentQuestion = 0;
  score = 0;
}



// expose
window.startGame = startGame;
window.restartGame = restartGame;


document.addEventListener('DOMContentLoaded', function() {
  showQuestion();
});

