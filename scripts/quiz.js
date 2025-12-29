/* ======================================================
   🎯 CYBER QUIZ (EN + AR)
   Author: Mariam - 2025
   Features:
   - English & Arabic UI + Questions
   - Timer
   - Score + Restart
====================================================== */

const content = document.getElementById("content");
const timerEl = document.getElementById("timer");
const nextBtn = document.getElementById("next");
const progressBar = document.getElementById("progress");
const bodyEl = document.getElementById("pageBody");
const titleEl = document.getElementById("title");
const subEl = document.getElementById("subText");
const enBtn = document.getElementById("enBtn");
const arBtn = document.getElementById("arBtn");

let lang = "EN"; // default
let index = 0;
let score = 0;
let timeLeft = 10;
let timer;

/* ===========================
   QUESTIONS (BILINGUAL)
=========================== */
const questions = [
  {
    en: {
      q: "If someone hacks your Snapchat in the UAE, what should you do first?",
      options: ["Ignore it", "Post about it", "Change password & enable 2FA", "Give hacker access"]
    },
    ar: {
      q: "إذا تم اختراق حساب سناب شات الخاص بك في الإمارات، ما أول خطوة تقوم بها؟",
      options: ["تجاهل الأمر", "نشر الموضوع للناس", "تغيير كلمة السر وتفعيل التحقق بخطوتين", "إعطاء المخترق الوصول للحساب"]
    },
    correct: 2
  },
  {
    en: {
      q: "Sharing someone's private photos without consent is:",
      options: ["Fine", "A joke", "Illegal & cybercrime", "Allowed if friends"]
    },
    ar: {
      q: "مشاركة صور خاصة لشخص بدون إذنه تعتبر:",
      options: ["شيء عادي", "مزحة فقط", "جريمة إلكترونية يعاقب عليها القانون", "مسموح إذا كنتم أصدقاء"]
    },
    correct: 2
  },
  {
    en: {
      q: "Message: 'You won a prize, enter card info' → This is:",
      options: ["Safe offer", "Scam / Phishing", "Bank alert", "Normal"]
    },
    ar: {
      q: "رسالة: 'ربحت جائزة، أدخل بيانات بطاقتك' → هذا يعتبر:",
      options: ["عرض آمن", "احتيال / تصيد", "تنبيه من البنك", "شيء طبيعي"]
    },
    correct: 1
  }
];

/* ===========================
   UI TEXT
=========================== */
const UI = {
  EN: {
    title: "🎯 Cyber Safety Quiz",
    subtitle: "Quick questions • Test yourself",
    start: "Start Quiz 🚀",
    next: "Next ➜",
    correct: "Correct! ✔️",
    wrong: "Wrong ❌",
    timesUp: "Time’s up ⏳",
    finished: "Quiz Finished 🎉",
    restart: "Restart 🔁"
  },
  AR: {
    title: "🎯 اختبار السلامة الإلكترونية",
    subtitle: "أسئلة سريعة • اختبر معرفتك",
    start: "ابدأ الاختبار 🚀",
    next: "التالي ➜",
    correct: "إجابة صحيحة ✔️",
    wrong: "إجابة خاطئة ❌",
    timesUp: "انتهى الوقت ⏳",
    finished: "انتهى الاختبار 🎉",
    restart: "إعادة المحاولة 🔁"
  }
};

/* ===========================
   LANGUAGE SWITCH
=========================== */
function switchLang(l) {
  lang = l;
  bodyEl.className = l === "AR" ? "lang-ar" : "lang-en";
  titleEl.textContent = UI[l].title;
  subEl.textContent = UI[l].subtitle;
  enBtn.classList.toggle("active", l==="EN");
  arBtn.classList.toggle("active", l==="AR");
}
enBtn.onclick = ()=>switchLang("EN");
arBtn.onclick = ()=>switchLang("AR");

/* ===========================
   START SCREEN
=========================== */
content.innerHTML = `<button class="quiz-option" onclick="startQuiz()">${UI.EN.start}</button>`;
timerEl.style.display = "none";

function startQuiz(){
  index = 0;
  score = 0;
  showQuestion();
  timerEl.style.display = "block";
}

/* ===========================
   TIMER
=========================== */
function startTimer(){
  clearInterval(timer);
  timeLeft = 10;
  timer = setInterval(()=>{
    timeLeft--;
    timerEl.innerHTML = `⏳ ${timeLeft}s`;
    if(timeLeft <= 0){
      clearInterval(timer);
      lockOptions(UI[lang].timesUp);
    }
  },1000);
}

/* ===========================
   SHOW QUESTION
=========================== */
function showQuestion(){
  const q = questions[index][lang.toLowerCase()];
  progressBar.style.width = `${(index/questions.length)*100}%`;

  content.innerHTML = `
    <h3>${q.q}</h3>
    ${q.options.map((o,i)=>`
      <button class="quiz-option" data-i="${i}" onclick="answer(this)">${o}</button>
    `).join("")}
    <p id="feedback"></p>
  `;
  nextBtn.style.display = "none";
  startTimer();
}

/* ===========================
   ANSWER
=========================== */
function answer(btn){
  clearInterval(timer);
  const choice = Number(btn.dataset.i);
  const correct = questions[index].correct;
  const feedback = document.getElementById("feedback");
  const all = document.querySelectorAll(".quiz-option");

  all.forEach(b=>b.disabled = true);

  if(choice === correct){
    score++;
    btn.classList.add("correct");
    feedback.textContent = UI[lang].correct;
  } else {
    btn.classList.add("wrong");
    all[correct].classList.add("correct");
    feedback.textContent = UI[lang].wrong;
  }
  nextBtn.textContent = UI[lang].next;
  nextBtn.style.display = "block";
  nextBtn.onclick = nextQuestion;
}

/* ===========================
   NEXT
=========================== */
function nextQuestion(){
  index++;
  if(index >= questions.length){ finishQuiz(); return; }
  showQuestion();
}

/* ===========================
   FINISH
=========================== */
function finishQuiz(){
  timerEl.style.display = "none";
  progressBar.style.width = "100%";
  content.innerHTML = `
    <h2>${UI[lang].finished}</h2>
    <p>${score} / ${questions.length}</p>
    <button class="quiz-option" onclick="location.reload()">${UI[lang].restart}</button>
  `;
}

/* export */
window.startQuiz = startQuiz;
window.answer = answer;
window.nextQuestion = nextQuestion;

