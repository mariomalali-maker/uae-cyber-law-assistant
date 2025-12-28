const quizData = [
  {
    q: "What is the safest type of password?",
    a: [
      "Your name + birthdate",
      "At least 12 characters with letters, numbers & symbols",
      "12345678",
      "Password1"
    ],
    correct: 1
  },
  {
    q: "Someone sends you a link saying you won a prize. What should you do?",
    a: [
      "Click it quickly before it expires",
      "Share it with all friends",
      "Ignore it or check it only from the official website/app",
      "Give them your password to confirm"
    ],
    correct: 2
  },
  {
    q: "What is two-factor authentication (2FA)?",
    a: [
      "Logging in from two phones",
      "Using two passwords for the same account",
      "A second step like SMS/app code after the password",
      "Saving the password in the browser"
    ],
    correct: 2
  },
  {
    q: "If someone hacks your social media account, what is the FIRST thing you should try?",
    a: [
      "Argue with them in DMs",
      "Try to reset your password using email/phone",
      "Create a new account and ignore it",
      "Post your password publicly"
    ],
    correct: 1
  },
  {
    q: "Which of these is a sign of a phishing email?",
    a: [
      "Comes from official bank domain with correct style",
      "Has spelling mistakes and strange link asking for login",
      "Uses your real name only",
      "Is sent by a family member"
    ],
    correct: 1
  },
  {
    q: "Public Wi-Fi is safest when you:",
    a: [
      "Use it with no protection",
      "Log in to all banking apps",
      "Use a VPN and avoid sensitive logins",
      "Share it with strangers"
    ],
    correct: 2
  },
  {
    q: "What should you do if someone threatens to share your private photos online?",
    a: [
      "Send them more photos so they stop",
      "Pay whatever they ask",
      "Block them and keep it secret",
      "Save all evidence & report via ecrime.ae or the police"
    ],
    correct: 3
  },
  {
    q: "Which is the best way to store passwords?",
    a: [
      "Write them on paper in your bag",
      "Use the same password everywhere",
      "Use a trusted password manager",
      "Tell them to a close friend"
    ],
    correct: 2
  },
  {
    q: "What is personal data?",
    a: [
      "Only passwords",
      "Only photos",
      "Any info that can identify you (name, phone, ID, location, etc.)",
      "Only bank details"
    ],
    correct: 2
  },
  {
    q: "How often should you update important passwords (email, banking)?",
    a: [
      "Never, keep them forever",
      "Only when you forget them",
      "Regularly, and immediately if you suspect a breach",
      "Every day"
    ],
    correct: 2
  }
];

let index = 0;
let score = 0;
let timer = null;
let timeLeft = 10;

function startTimer() {
  clearInterval(timer);
  timeLeft = 10;
  document.getElementById("timer").innerHTML =
    'Time Left: <strong>' + timeLeft + '</strong>s';

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerHTML =
      'Time Left: <strong>' + timeLeft + '</strong>s';

    if (timeLeft <= 0) {
      clearInterval(timer);
      lockQuestion();
      showFeedback(false, "⏰ Time is up!");
    }
  }, 1000);
}

function loadQ() {
  const q = quizData[index];
  document.getElementById("qCounter").innerText =
    `Question ${index + 1} of ${quizData.length}`;
  document.getElementById("question").innerText = q.q;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  q.a.forEach((choice, i) => {
    const btn = document.createElement("button");
    btn.innerText = choice;
    btn.className = "quiz-btn";
    btn.onclick = () => checkAnswer(i, btn);
    optionsDiv.appendChild(btn);
  });

  document.getElementById("nextBtn").style.display = "none";
  document.getElementById("scoreBox").style.display = "none";
  document.getElementById("feedback").style.display = "none";

  startTimer();
}

function lockQuestion() {
  const buttons = document.querySelectorAll(".quiz-btn");
  buttons.forEach(b => (b.disabled = true));
  document.getElementById("nextBtn").style.display = "inline-block";
}

function showFeedback(correct, msg) {
  const fb = document.getElementById("feedback");
  fb.style.display = "block";
  fb.style.marginTop = "10px";
  fb.style.fontWeight = "600";
  fb.style.color = correct ? "#4ade80" : "#f97373";
  fb.innerText = msg;
}

function checkAnswer(i, btn) {
  clearInterval(timer);
  const q = quizData[index];

  const buttons = document.querySelectorAll(".quiz-btn");
  buttons.forEach((b, idx) => {
    b.disabled = true;
    if (idx === q.correct) b.classList.add("correct");
  });

  if (i === q.correct) {
    score++;
    btn.classList.add("correct");
    showFeedback(true, "✅ Correct!");
  } else {
    btn.classList.add("wrong");
    showFeedback(false, "❌ Not correct.");
  }

  document.getElementById("nextBtn").style.display = "inline-block";
}

function nextQuestion() {
  index++;
  if (index >= quizData.length) {
    endQuiz();
  } else {
    loadQ();
  }
}

function endQuiz() {
  document.getElementById("options").innerHTML = "";
  document.getElementById("question").innerText = "Quiz finished!";
  document.getElementById("nextBtn").style.display = "none";

  const scoreBox = document.getElementById("scoreBox");
  scoreBox.style.display = "block";
  scoreBox.innerText = `You scored ${score} out of ${quizData.length}.`;
}

window.onload = loadQ;
