// -------- Game State (KEPT SAME) --------
let playerName = '';
let currentQuestion = 0;
let score = 0;
let timer = null;
let timeLeft = 15;
let leaderboard = [];

// -------- QUESTIONS ARRAY – EXACTLY AS YOU PROVIDED --------
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
}
];
// -------- END QUESTIONS --------


// -------- DOM ELEMENTS --------
let welcomeScreen, countdownScreen, quizScreen, resultScreen;
let playerNameInput, countdownDisplay;
let questionText, questionArabic, answersContainer;
let timerText, timerFill, currentQuestionSpan;
let finalScore, resultMessage, leaderboardEntries;


// -------- INITIALIZE DOM AFTER PAGE LOAD --------
function initializeDOM() {
  welcomeScreen = document.getElementById('welcome-screen');
  countdownScreen = document.getElementById('countdown-screen');
  quizScreen = document.getElementById('quiz-screen');
  resultScreen = document.getElementById('result-screen');

  playerNameInput = document.getElementById('player-name');
  countdownDisplay = document.getElementById('countdown-display');

  questionText = document.getElementById('question-text');
  questionArabic = document.getElementById('question-arabic');
  answersContainer = document.getElementById('answers-container');

  timerText = document.getElementById('timer-text');
  timerFill = document.getElementById('timer-fill');
  currentQuestionSpan = document.getElementById('current-question');

  leaderboardEntries = document.getElementById('leaderboard-entries');
}


// -------- SHOW QUESTION (SAME RESULT LOGIC) --------
function showQuestion() {
  initializeDOM();

  if (currentQuestion >= questions.length) {
    endGame();
    return;
  }

  const q = questions[currentQuestion];

  currentQuestionSpan.textContent = currentQuestion + 1;

  questionText.textContent = q.question;
  questionArabic.textContent = q.arabicQuestion;

  answersContainer.innerHTML = '';

  q.answers.forEach((a, i) => {
    const card = document.createElement('div');
    card.className = 'answer-card';

    card.innerHTML = `
      <p class="answer-text">${a.text}</p>
      <p class="answer-arabic">${a.arabic}</p>
    `;

    // CLICKING PART – FIXED ONLY
    card.addEventListener('click', () => selectAnswer(i));

    answersContainer.appendChild(card);
  });

  startTimer();
}


// -------- TIMER (SAME SYSTEM – ONLY FIXED ATTACH) --------
function startTimer() {
  clearInterval(timer);
  timeLeft = 15;
  updateTimerDisplay();

  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timer);
      nextQuestion();
    }
  }, 1000);
}


function updateTimerDisplay() {
  timerText.textContent = timeLeft;
  timerFill.style.width = ((timeLeft / 15) * 100) + '%';
}


function nextQuestion() {
  currentQuestion++;
  showQuestion();
}


function selectAnswer(i) {
  clearInterval(timer);

  if (i === questions[currentQuestion].correct) {
    score += 1000;
  }

  nextQuestion();
}


// -------- END GAME – KEPT SAME RESULT --------
function endGame() {
  initializeDOM();

  quizScreen.style.display = 'none';
  resultScreen.style.display = 'block';

  document.getElementById('final-score').textContent = score;

  document.getElementById('result-message').textContent =
    "Your game finished with " + score + " points";

  updateLeaderboard();
}


// -------- LEADERBOARD – SAME RULES --------
function updateLeaderboard() {
  leaderboard = leaderboard.map(x => ({ ...x, isCurrent: false }));

  leaderboard.push({
    name: playerName,
    score: score,
    isCurrent: true
  });

  leaderboard.sort((a, b) => b.score - a.score);

  leaderboard = leaderboard.slice(0, 10);

  localStorage.setItem('cyberQuizLeaderboard', JSON.stringify(leaderboard));

  displayLeaderboard();
}


function displayLeaderboard() {
  if (!leaderboardEntries) return;

  leaderboardEntries.innerHTML = '';

  leaderboard.forEach((entry, index) => {
    const div = document.createElement('div');
    div.className = 'leaderboard-entry ' +
      (entry.isCurrent ? 'current-player' : '');

    let rank = (index === 0) ? '🥇 ' :
               (index === 1) ? '🥈 ' :
               (index === 2) ? '🥉 ' :
               (index + 1) + '. ';

    div.innerHTML = `
      <span class="player-name">${rank}${entry.name}</span>
      <span class="player-score">${entry.score}</span>
    `;

    leaderboardEntries.appendChild(div);
  });
}


// -------- GLOBAL START BINDING (ONLY FIX) --------
function startGame() {
  initializeDOM();
  showQuestion();
}


// -------- RESTART – SAME BEHAVIOR --------
function restartGame() {
  initializeDOM();
  resultScreen.style.display = 'none';
  welcomeScreen.style.display = 'block';
}


// -------- INITIALIZE AFTER DOM READY --------
document.addEventListener('DOMContentLoaded', function() {
  initializeDOM();
  displayLeaderboard();

  const saved = localStorage.getItem('cyberQuizLeaderboard');
  if (saved) leaderboard = JSON.parse(saved);

  // Enter key support – same
  if (playerNameInput) {
    playerNameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') startGame();
    });
  }
});

// Expose only ONCE – SAME result
window.startGame = startGame;
window.restartGame = restartGame;
