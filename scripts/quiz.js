
const quizData = [
  {
    q: "Which website is used in the UAE to report online cybercrime?",
    a: ["ecrime.ae", "cyberreport.com", "police.net", "safenet.uae"],
    c: 0
  },
  {
    q: "Sharing private photos of others without permission is:",
    a: ["Allowed", "Cybercrime in UAE", "Only illegal if famous", "Just bad manners"],
    c: 1
  },
  {
    q: "If someone hacks your account, what should you do first?",
    a: ["Ignore it", "Report to ecrime.ae", "Wait 1 week", "Tell your friends only"],
    c: 1
  },
  {
    q: "Federal Decree-Law No. 34 of 2021 in UAE is about:",
    a: ["Car license rules", "Cybercrime & Rumours", "Medical insurance", "Tourism policy"],
    c: 1
  },
  {
    q: "What number to call for emergencies in UAE?",
    a: ["999", "123", "500", "8080"],
    c: 0
  },
  {
    q: "Using someone’s photos without consent can lead to:",
    a: ["Nothing happens", "Fine + Jail", "Only a warning", "Temporary ban"],
    c: 1
  },
  {
    q: "Which password is stronger?",
    a: ["123456", "Password123", "M@r1am!94#", "MyName2025"],
    c: 2
  },
  {
    q: "What should you avoid clicking?",
    a: ["Bank website", "Unknown links", "Government apps", "VPN apps"],
    c: 1
  },
  {
    q: "Cyberbullying in UAE is:",
    a: ["Legal", "Punishable", "Only wrong if public", "Allowed for fun"],
    c: 1
  },
  {
    q: "Two-Factor Authentication makes accounts:",
    a: ["Weaker", "Stronger", "Slower only", "Optional always"],
    c: 1
  }
];

let index = 0;
let score = 0;
let timeLeft = 10;
let timer;

function startQuiz() {
  loadQ();
  startTimer();
}

function loadQ() {
  document.getElementById("question").innerText = quizData[index].q;
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  quizData[index].a.forEach((choice, i) => {
    const btn = document.createElement("button");
    btn.innerText = choice;
    btn.className = "quiz-btn";
    btn.onclick = () => checkAnswer(i);
    optionsDiv.appendChild(btn);
  });

  document.getElementById("nextBtn").style.display = "none";
}

function startTimer() {
  timeLeft = 10;
  document.getElementById("timer").innerHTML = "⏱️ Time Left: <strong>10</strong>s";
  
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerHTML = `⏱️ Time Left: <strong>${timeLeft}</strong>s`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      nextQuestion();
    }
  }, 1000);
}

function checkAnswer(selected) {
  clearInterval(timer);
  const question = quizData[index];
  
  if (selected === question.c) {
    score++;
  }

  Array.from(document.getElementsByClassName("quiz-btn")).forEach(btn => btn.disabled = true);
  document.getElementById("nextBtn").style.display = "block";
}

function nextQuestion() {
  index++;
  if (index >= quizData.length) {
    endQuiz();
  } else {
    loadQ();
    startTimer();
  }
}

function endQuiz() {
  document.getElementById("quiz-box").style.display = "none";
  document.getElementById("nextBtn").style.display = "none";
  document.getElementById("timer").style.display = "none";
  document.getElementById("scoreBox").style.display = "block";
  document.getElementById("scoreBox").innerText = `🎉 You scored ${score} / ${quizData.length}`;
}

startQuiz();
