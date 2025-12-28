// scripts/quiz.js

const quizData = [
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
    q: "Which website is commonly used in the UAE to report cybercrime incidents?",
    options: [
      "ecrime.ae",
      "uae-news.ae",
      "snapchat.com",
      "instagram.com"
    ],
    correct: 0
  },
  {
    q: "What is a strong password example?",
    options: [
      "omar123",
      "password",
      "Om1r_2025#UAE",
      "123456"
    ],
    correct: 2
  },
  {
    q: "A stranger sends you a link saying “you won an iPhone”. What should you do?",
    options: [
      "Click quickly before it expires",
      "Share it with friends",
      "Ignore/delete the message",
      "Send your ID first"
    ],
    correct: 2
  },
  {
    q: "Which is safer for login security?",
    options: [
      "Only password",
      "Two-factor authentication (2FA)",
      "Using the same password everywhere",
      "Writing password on paper in class"
    ],
    correct: 1
  },
  {
    q: "Someone threatens to leak your photos unless you pay. What should you do?",
    options: [
      "Pay them immediately",
      "Block them and stay silent",
      "Report to ecrime.ae or police and keep all evidence",
      "Delete your account and disappear"
    ],
    correct: 2
  },
  {
    q: "Public Wi-Fi in a café is…",
    options: [
      "Always 100% safe",
      "Risky, especially for logging into bank / email",
      "Only dangerous at home",
      "Safer than mobile data"
    ],
    correct: 1
  },
  {
    q: "Which info should you NEVER share with strangers online?",
    options: [
      "Favorite color",
      "Pet’s name",
      "Full home address and Emirates ID picture",
      "Favorite food"
    ],
    correct: 2
  },
  {
    q: "What is phishing?",
    options: [
      "Catching real fish",
      "Fake messages or websites trying to steal your data",
      "Playing games online",
      "Sending memes to friends"
    ],
    correct: 1
  },
  {
    q: "How long is each question available in this quiz (time limit)?",
    options: [
      "5 seconds",
      "10 seconds",
      "30 seconds",
      "No time limit"
    ],
    correct: 1
  }
];

let current = -1;
let score = 0;
let timerId = null;
const timePerQuestion = 10;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const scoreBox = document.getElementById("scoreBox");
const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("startQuizBtn");

function startTimer() {
  let timeLeft = timePerQuestion;
  timerEl.innerHTML = `Time Left: <strong>${timeLeft}</strong>s`;

  timerId = setInterval(() => {
    timeLeft--;
    timerEl.innerHTML = `Time Left: <strong>${timeLeft}</strong>s`;
    if (timeLeft <= 0) {
      clearInterval(timerId);
      timerEl.innerHTML = `Time's up!`;
      lockOptions();
      nextBtn.style.display = "inline-block";
    }
  }, 1000);
}

function lockOptions() {
  const btns = optionsEl.querySelectorAll("button");
  btns.forEach(b => b.disabled = true);
}

function loadQuestion() {
  current++;
  if (current >= quizData.length) {
    finishQuiz();
    return;
  }

  const item = quizData[current];
  questionEl.textContent = `Question ${current + 1}: ${item.q}`;
  optionsEl.innerHTML = "";
  nextBtn.style.display = "none";

  item.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "quiz-btn";
    btn.textContent = opt;
    btn.addEventListener("click", () => checkAnswer(idx));
    optionsEl.appendChild(btn);
  });

  clearInterval(timerId);
  startTimer();
}

function checkAnswer(chosenIndex) {
  const item = quizData[current];
  const btns = optionsEl.querySelectorAll("button");
  btns.forEach((b, idx) => {
    b.disabled = true;
    if (idx === item.correct) {
      b.style.backgroundColor = "#16a34a"; // green
    }
    if (idx === chosenIndex && idx !== item.correct) {
      b.style.backgroundColor = "#b91c1c"; // red
    }
  });

  if (chosenIndex === item.correct) {
    score++;
    scoreBox.style.display = "block";
    scoreBox.textContent = `✅ Correct! Score: ${score}/${quizData.length}`;
  } else {
    scoreBox.style.display = "block";
    scoreBox.textContent = `❌ Incorrect. Current score: ${score}/${quizData.length}`;
  }

  clearInterval(timerId);
  nextBtn.style.display = "inline-block";
}

function finishQuiz() {
  questionEl.textContent = "Quiz finished! 🎉";
  optionsEl.innerHTML = "";
  timerEl.textContent = "";
  nextBtn.style.display = "none";
  scoreBox.style.display = "block";
  scoreBox.textContent = `Your final score: ${score}/${quizData.length}.`;
}

nextBtn.addEventListener("click", () => {
  loadQuestion();
});

if (startBtn) {
  startBtn.addEventListener("click", () => {
    score = 0;
    current = -1;
    scoreBox.style.display = "none";
    startBtn.style.display = "none";
    loadQuestion();
  });
}


