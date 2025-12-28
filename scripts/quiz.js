// scripts/quiz.js

const quizBox = document.getElementById("quiz-box");
const timerEl = document.getElementById("timer");
const nextBtn = document.getElementById("nextBtn");
const scoreBox = document.getElementById("scoreBox");
const leaderBoard = document.getElementById("leaderBoard");

let currentIndex = -1;
let score = 0;
let timeLeft = 10;
let timerId = null;

const QUIZ_KEY = "cyber_quiz_best_score";

const questions = [
  {
    q: "If someone hacks your Snapchat in the UAE, what is the safest first step?",
    options: [
      "Post about it on your story",
      "Give them your password so they stop",
      "Change your password and enable 2FA",
      "Do nothing and wait"
    ],
    correct: 2
  },
  {
    q: "Sharing someone’s private photos without consent online is:",
    options: [
      "Just a joke",
      "Allowed if they are your friend",
      "A serious crime under UAE cyber laws",
      "Only wrong if they complain"
    ],
    correct: 2
  },
  {
    q: "A message says: 'You won a free iPhone, click this link and enter your card details.' What is this?",
    options: [
      "Normal offer",
      "Phishing / scam",
      "Safe promotion",
      "Bank message"
    ],
    correct: 1
  },
  {
    q: "Which password is strongest?",
    options: [
      "mariam123",
      "Password2024",
      "@M!r1am_2025#",
      "qwerty"
    ],
    correct: 2
  },
  {
    q: "If someone is blackmailing you with your photos online in the UAE, you should:",
    options: [
      "Send them more pictures",
      "Delete all chats so no evidence",
      "Keep screenshots and report to ecrime.ae",
      "Pay them once"
    ],
    correct: 2
  },
  {
    q: "Two-factor authentication (2FA) means:",
    options: [
      "Using two phones",
      "Logging in from two countries",
      "Using password plus extra code / app / SMS",
      "Changing password daily"
    ],
    correct: 2
  },
  {
    q: "Posting rumours and fake news about others online in the UAE is:",
    options: [
      "Harmless fun",
      "Protected free speech",
      "Punishable under UAE cybercrime laws",
      "Only wrong on WhatsApp"
    ],
    correct: 2
  },
  {
    q: "Which Wi-Fi is safer for sensitive logins?",
    options: [
      "Random public Wi-Fi with no password",
      "Friend’s hotspot with password",
      "Any free Wi-Fi in the mall",
      "Unknown open Wi-Fi in the street"
    ],
    correct: 1
  },
  {
    q: "What should you NEVER share on social media publicly?",
    options: [
      "Cute coffee pictures",
      "Travel photos after you return",
      "Your full Emirates ID details",
      "Sunset views"
    ],
    correct: 2
  },
  {
    q: "If you receive a suspicious link from a 'friend' account that was probably hacked, you should:",
    options: [
      "Click it quickly",
      "Forward it to everyone",
      "Ignore it and warn your friend on another channel",
      "Type your password to log in"
    ],
    correct: 2
  }
];

function showStartScreen() {
  quizBox.innerHTML = `
    <h3>Ready to start the quiz?</h3>
    <p>You have 10 seconds for each question. Try to score as high as you can!</p>
    <p style="font-size:13px; opacity:0.8;">تقدر تجاوب وانت مرتاح، الهدف أنك تتعلم كيف تحمي نفسك إلكترونياً 💻🛡</p>
    <button class="quiz-btn start-btn" id="startQuizBtn">Start Quiz</button>
  `;
  timerEl.style.display = "none";
  nextBtn.style.display = "none";
  scoreBox.style.display = "none";
  leaderBoard.style.display = "none";

  const btn = document.getElementById("startQuizBtn");
  btn.addEventListener("click", () => {
    currentIndex = -1;
    score = 0;
    timerEl.style.display = "block";
    nextQuestion();
  });
}

function startTimer() {
  clearInterval(timerId);
  timeLeft = 10;
  updateTimerText();
  timerId = setInterval(() => {
    timeLeft--;
    updateTimerText();
    if (timeLeft <= 0) {
      clearInterval(timerId);
      lockOptions();
      nextBtn.style.display = "block";
    }
  }, 1000);
}

function updateTimerText() {
  timerEl.innerHTML = `Time Left: <strong>${timeLeft}</strong>s`;
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex >= questions.length) {
    endQuiz();
    return;
  }

  const qObj = questions[currentIndex];
  quizBox.innerHTML = `
    <h3>Question ${currentIndex + 1} of ${questions.length}</h3>
    <p style="margin-top:8px; margin-bottom:12px;">${qObj.q}</p>
    <div id="options"></div>
    <p id="feedback" style="margin-top:10px; font-size:14px;"></p>
  `;

  const optionsDiv = document.getElementById("options");
  qObj.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "quiz-btn";
    btn.textContent = opt;
    btn.dataset.index = idx;
    btn.addEventListener("click", () => handleAnswer(idx));
    optionsDiv.appendChild(btn);
  });

  nextBtn.style.display = "none";
  startTimer();
}

function handleAnswer(choiceIndex) {
  clearInterval(timerId);
  const qObj = questions[currentIndex];
  const feedback = document.getElementById("feedback");
  const optionsDiv = document.getElementById("options");
  const buttons = optionsDiv.querySelectorAll("button");

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === qObj.correct) {
      btn.style.background = "#16a34a";
    }
    if (i === choiceIndex && i !== qObj.correct) {
      btn.style.background = "#b91c1c";
    }
  });

  if (choiceIndex === qObj.correct) {
    score++;
    feedback.textContent = "✅ Correct! Nice job.";
    feedback.style.color = "#22c55e";
  } else {
    feedback.textContent = "❌ Wrong. It’s okay, you’re learning.";
    feedback.style.color = "#f97316";
  }

  nextBtn.style.display = "block";
}

function lockOptions() {
  const optionsDiv = document.getElementById("options");
  if (!optionsDiv) return;
  const buttons = optionsDiv.querySelectorAll("button");
  const qObj = questions[currentIndex];

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === qObj.correct) {
      btn.style.background = "#16a34a";
    }
  });

  const feedback = document.getElementById("feedback");
  if (feedback && !feedback.textContent) {
    feedback.textContent = "⏰ Time is up! The correct answer is highlighted in green.";
    feedback.style.color = "#f97316";
  }
}

function endQuiz() {
  quizBox.innerHTML = `
    <h3>Quiz Finished 🎉</h3>
    <p>You answered <strong>${score}</strong> out of <strong>${questions.length}</strong> correctly.</p>
  `;
  timerEl.style.display = "none";
  nextBtn.style.display = "none";
  scoreBox.style.display = "block";

  let message;
  let badge = "";
  if (score === questions.length) {
    message = "Perfect! You’re a true Cyber Guardian 🛡🔥";
    badge = "🏅 Platinum Cyber Guardian";
  } else if (score >= 8) {
    message = "Amazing! You’re very aware of cyber safety.";
    badge = "🥇 Gold Cyber Guardian";
  } else if (score >= 5) {
    message = "Good start! You know some key points, keep learning.";
    badge = "🥈 Silver Cyber Guardian";
  } else {
    message = "It’s okay. The goal is to learn and get safer online. Try again!";
    badge = "🥉 Cyber Learner";
  }

  scoreBox.textContent = message + "  " + badge;

  const prevBest = parseInt(localStorage.getItem(QUIZ_KEY) || "0", 10);
  if (score > prevBest) {
    localStorage.setItem(QUIZ_KEY, String(score));
  }

  const best = Math.max(score, prevBest);
  leaderBoard.style.display = "block";
  leaderBoard.textContent = `🏆 Your best score so far: ${best} / ${questions.length}`;

  const restartBtn = document.createElement("button");
  restartBtn.className = "quiz-btn start-btn";
  restartBtn.textContent = "Restart Quiz 🔁";
  restartBtn.addEventListener("click", () => {
    currentIndex = -1;
    score = 0;
    timerEl.style.display = "block";
    nextQuestion();
  });
  quizBox.appendChild(restartBtn);
}

nextBtn.addEventListener("click", () => {
  nextQuestion();
});

showStartScreen();
