// ================================
// 🎯 Cyber Safety Quiz - Kahoot Style
// by Mariam (2025)
// ================================

// HTML Elements
const content = document.getElementById("content");
const timerEl = document.getElementById("timer");
const nextBtn = document.getElementById("next");
const progressBar = document.getElementById("progress");

// QUIZ DATA
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
    q: "A message says: 'You won a free iPhone, click this link and enter your card details.' This is:",
    options: ["Normal offer","Phishing / scam","Safe promotion","Bank message"],
    correct: 1
  },
  {
    q: "Which password is strongest?",
    options: ["Omar123","Password2024","@M!r1am_2025#","qwerty"],
    correct: 2
  },
  {
    q: "If someone is blackmailing you online in the UAE:",
    options: [
      "Send them more pictures",
      "Delete messages (evidence)",
      "Screenshot & report via ecrime.ae",
      "Pay them one time"
    ],
    correct: 2
  },
  {
    q: "Two-factor authentication (2FA) means:",
    options: [
      "Using two phones",
      "Login with extra code / app / SMS",
      "Changing password daily",
      "Different browser"
    ],
    correct: 1
  },
  {
    q: "Posting rumours and fake news about others online in the UAE is:",
    options: [
      "Harmless fun",
      "Protected free speech",
      "Illegal (cybercrime law)",
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
    q: "What should you NEVER share publicly?",
    options: [
      "Sunset photos",
      "Cute coffee pics",
      "Full Emirates ID details",
      "Vacation photos"
    ],
    correct: 2
  },
  {
    q: "If you receive a suspicious link from a 'friend' account that looks hacked:",
    options: [
      "Click it quickly",
      "Forward it to everyone",
      "Ignore & warn them on another app",
      "Reset your phone"
    ],
    correct: 2
  }
];

// QUIZ STATE
let index = -1;
let score = 0;
let timeLeft = 10;
let timer;

// 🎉 Confetti Animation
function confettiBurst(){
  const c = document.getElementById("confetti");
  const ctx = c.getContext("2d");
  c.style.display = "block";
  c.width = window.innerWidth;
  c.height = window.innerHeight;

  const pieces = Array.from({length:180}, () => ({
    x: Math.random()*c.width,
    y: Math.random()*c.height,
    r: Math.random()*8+4,
    c: `hsl(${Math.random()*360},100%,50%)`,
    s: Math.random()*3+1
  }));

  function draw(){
    ctx.clearRect(0,0,c.width,c.height);
    pieces.forEach(p =>{
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,2*Math.PI);
      ctx.fillStyle = p.c;
      ctx.fill();
      p.y += p.s;
      if(p.y>c.height)p.y=0;
    });
    requestAnimationFrame(draw);
  }

  draw();
  setTimeout(()=> c.style.display="none", 3500);
}

// 🟢 Start Screen
function startScreen(){
  content.innerHTML = `
    <h3>Ready to Start?</h3>
    <p style="opacity:.8;">10 questions • 10s each • UAE safety focused</p>
    <button class="quiz-option" style="background:#22c55e;font-weight:700;">
      Start Quiz 🚀
    </button>
  `;
  document.querySelector(".quiz-option").onclick = nextQuestion;
  timerEl.style.display = "none";
  nextBtn.style.display = "none";
}
startScreen();

// ⏳ Timer
function startTimer(){
  clearInterval(timer);
  timeLeft = 10;
  timerEl.innerHTML = `Time Left: <strong>${timeLeft}</strong>s`;

  timer = setInterval(()=>{
    timeLeft--;
    timerEl.innerHTML = `Time Left: <strong>${timeLeft}</strong>s`;
    if(timeLeft<=0){ clearInterval(timer); lock(); }
  },1000);
}

// 👉 Next Question
function nextQuestion(){
  index++;
  if(index >= questions.length) return finishQuiz();

  const q = questions[index];
  progressBar.style.width = `${((index)/questions.length)*100}%`;
  timerEl.style.display = "block";

  content.innerHTML = `
    <h3>Q ${index+1} / ${questions.length}</h3>
    <p style="margin:10px 0 18px;">${q.q}</p>
    ${q.options.map((o,i)=>`<button class="quiz-option" data-i="${i}">${o}</button>`).join("")}
    <p id="feedback" style="margin-top:10px;"></p>
  `;

  document.querySelectorAll(".quiz-option").forEach(btn=>{
    btn.onclick = ()=> answer(btn);
  });

  nextBtn.style.display="none";
  startTimer();
}

// ✔ Check Answer
function answer(btn){
  clearInterval(timer);
  const choice = Number(btn.dataset.i);
  const correct = questions[index].correct;
  const all = document.querySelectorAll(".quiz-option");

  all.forEach(b=>b.disabled = true);

  if(choice === correct){
    score++;
    btn.classList.add("correct");
    document.getElementById("feedback").innerHTML = "✅ Correct! Good job!";
  } else {
    btn.classList.add("wrong");
    all[correct].classList.add("correct");
    document.getElementById("feedback").innerHTML = "❌ Wrong — You're learning!";
  }

  nextBtn.style.display = "block";
}
nextBtn.onclick = nextQuestion;

// 🚩 Lock if time ends
function lock(){
  const correct = questions[index].correct;
  document.querySelectorAll(".quiz-option")[correct].classList.add("correct");
  document.querySelectorAll(".quiz-option").forEach(b=>b.disabled = true);
  document.getElementById("feedback").innerHTML = "⏰ Time's up!";
  nextBtn.style.display = "block";
}

// 🎉 Finish
function finishQuiz(){
  progressBar.style.width = "100%";
  timerEl.style.display = "none";
  nextBtn.style.display = "none";

  let msg = "";
  if(score === 10) msg = "🏆 Perfect! CYBER LEGEND!";
  else if(score >= 8) msg = "✨ Amazing! Cyber Guardian!";
  else if(score >= 5) msg = "🛡 Good! Keep practicing!";
  else msg = "📚 You got this — Try again!";

  content.innerHTML = `
    <h2>Quiz Complete 🎉</h2>
    <p>You scored: <strong>${score}/10</strong></p>
    <h3>${msg}</h3>
    <button class="quiz-option" onclick="location.reload()">Restart 🔁</button>
  `;

  confettiBurst();
}
