// scripts/quiz.js

const questions = [
  {
    q: "If someone hacks your Snapchat in the UAE, what is the BEST first step?",
    options: [
      "Post about it on your story",
      "Immediately change your password and enable 2FA",
      "Ignore it and hope it stops",
      "Give them money to leave your account"
    ],
    correct: 1
  },
  {
    q: "Someone is threatening to leak your private photos unless you pay. What should you do?",
    options: [
      "Pay once so they stop",
      "Block them and never report",
      "Save evidence and report through ecrime.ae or the police",
      "Delete your account and disappear"
    ],
    correct: 2
  },
  {
    q: "Which password is safest?",
    options: [
      "omar123",
      "P@ssword",
      "Q!3kz#89qLm!2",
      "snapchatpassword"
    ],
    correct: 2
  },
  {
    q: "A bank sends you a link on WhatsApp to update your card. What do you do?",
    options: [
      "Click and enter your card details",
      "Forward to friends so they also check",
      "Call the official bank number to verify before doing anything",
      "Ignore but keep the link for later"
    ],
    correct: 2
  },
  {
    q: "What does 2FA (two-factor authentication) do?",
    options: [
      "Makes your account public",
      "Adds an extra step like SMS or app code to log in",
      "Deletes old messages automatically",
      "Saves your password to the cloud"
    ],
    correct: 1
  },
  {
    q: "You’re using public Wi-Fi in a café. What’s safest?",
    options: [
      "Log in to all your banking apps",
      "Use a VPN and avoid sensitive accounts",
      "Share the Wi-Fi password on your story",
      "Turn off all security settings"
    ],
    correct: 1
  },
  {
    q: "A stranger keeps making new accounts to harass you. Best step?",
    options: [
      "Keep replying so they get bored",
      "Change your name and disappear",
      "Collect screenshots and report the accounts",
      "Send them your location"
    ],
    correct: 2
  },
  {
    q: "Which file is MOST suspicious to download?",
    options: [
      "Homework.pdf from your teacher",
      "Invoice.exe from an unknown email",
      "Bank statement.pdf from official bank app",
      "Your own photo from gallery"
    ],
    correct: 1
  },
  {
    q: "What is a strong sign that a DM is a scam?",
    options: [
      "It comes from your close friend",
      "It says you won a big prize and asks for your password",
      "It uses polite language",
      "It has emojis"
    ],
    correct: 1
  },
  {
    q: "Why is it risky to reuse the same password everywhere?",
    options: [
      "It’s hard to remember",
      "One leak can give attackers access to all your accounts",
      "Websites don’t allow it",
      "It makes your phone slow"
    ],
    correct: 1
  }
];

let currentIndex = 0;
let score = 0;
let timerId = null;
let timeLeft = 10;

const startBox = document.getElementById("quiz-start");
const quizMain = document.getElementById("quiz-main");
const timerEl = document.getElementById("timer");
const qTitle = document.getElementById("question-title");
const optionsBox = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const scoreBox = document.getElementById("scoreBox");
const nextBtn = document.getElementById("nextBtn");
const startBtn = document.getElementById("start-quiz-btn");

startBtn.addEventListener("click", () => {
  startBox.style.display = "none";
  quizMain.style.display = "block";
  currentIndex = 0;
  score = 0;
  showQuestion();
});

function showQuestion() {
  clearInterval(timerId);
  timeLeft = 10;
  timerEl.innerHTML = `Time Left: <strong>${timeLeft}</strong>s`;
  timerId = setInterval(() => {
    timeLeft--;
    timerEl.innerHTML = `Time Left: <strong>${timeLeft}</strong>s`;
    if (timeLeft <= 0) {
      clearInterval(timerId);
      lockOptions();
      feedbackEl.textContent = "⏰ Time’s up!";
      nextBtn.style.display = "inline-block";
    }
  }, 1000);

  const q = questions[currentIndex];
  qTitle.textContent = `Question ${currentIndex + 1}: ${q.q}`;
  optionsBox.innerHTML = "";
  feedbackEl.textContent = "";
  nextBtn.style.display = "none";

  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "quiz-btn";
    btn.textContent = opt;
    btn.addEventListener("click", () => handleAnswer(btn, idx));
    optionsBox.appendChild(btn);
  });
}

function lockOptions() {
  [...optionsBox.querySelectorAll("button")].forEach(b => {
    b.disabled = true;
  });
}

function handleAnswer(btn, idx) {
  if (btn.disabled) return;
  clearInterval(timerId);
  const correct = questions[currentIndex].correct;

  lockOptions();

  if (idx === correct) {
    btn.classList.add("correct");
    feedbackEl.textContent = "✅ Correct! Nice job protecting yourself.";
    score++;
  } else {
    btn.classList.add("wrong");
    const allBtns = [...optionsBox.querySelectorAll("button")];
    allBtns[correct].classList.add("correct");
    feedbackEl.textContent = "❌ Not the safest choice. Check the green answer.";
  }

  nextBtn.style.display = "inline-block";
}

nextBtn.addEventListener("click", () => {
  currentIndex++;
  if (currentIndex >= questions.length) {
    endQuiz();
  } else {
    showQuestion();
  }
});

function endQuiz() {
  quizMain.style.display = "none";
  scoreBox.style.display = "block";
  scoreBox.textContent = `You scored ${score} / ${questions.length}.`;
}
