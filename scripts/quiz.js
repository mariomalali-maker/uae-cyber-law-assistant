/* ==========================================
   🎯 Cyber Quiz by Mariam
   - 10 Questions
   - EN / AR switch
   - Kahoot style
   - Confetti on Win
========================================== */

let q = 0, score = 0, time = 15, timer, LANG = "EN";

const box = document.getElementById("quizBox");
const timerEl = document.getElementById("timer");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progress");
const langBtn = document.getElementById("langBtn");
const body = document.getElementById("body");
const title = document.getElementById("title");
const sub = document.getElementById("sub");

const DATA = [
  {en:"Snapchat hacked! First step?", ar:"تم اختراق سنابك! أول خطوة؟", o:["Cry","Post it","Change password + 2FA","Ignore"], c:2},
  {en:"Sharing private photos is:", ar:"مشاركة صور خاصة تعتبر:", o:["A joke","Legal","Cybercrime","Fine"], c:2},
  {en:"'You won! Enter card info' →", ar:"'ربحت! ادخل بيانات بطاقتك' →", o:["Real","Safe","Phishing","Bank"], c:2},
  {en:"Strong password?", ar:"أقوى كلمة مرور؟", o:["mariam123","@M!r1am_2025#","password","qwerty"], c:1},
  {en:"Blackmail → UAE?", ar:"ابتزاز → الإمارات؟", o:["Pay","Ignore","Report ecrime.ae","Delete chat"], c:2},
  {en:"2FA means:", ar:"التحقق بخطوتين يعني:", o:["VPN","Two phones","Password + code","Daily change"], c:2},
  {en:"Rumors online:", ar:"نشر الشائعات:", o:["Fun","Free speech","Punishable","Normal"], c:2},
  {en:"Best Wi-Fi?", ar:"أفضل واي فاي؟", o:["Public mall","Friend hotspot","Random open","Airport free"], c:1},
  {en:"Never share:", ar:"لا تشارك:", o:["Coffee pics","Travel live","Emirates ID","Sunset"], c:2},
  {en:"Friend sends weird link:", ar:"صديق يرسل رابط غريب:", o:["Click","Share","Warn them","Login"], c:2}
];

function load(){
  const item = DATA[q];
  progressBar.style.width = (q/DATA.length*100)+"%";
  box.innerHTML = `
    <h2>${LANG==="EN"?item.en:item.ar}</h2>
    ${item.o.map((a,i)=>`<button class="opt" onclick="answer(${i})">${a}</button>`).join("")}
    <p id="feed"></p>
  `;
  nextBtn.style.display="none";
  startTime();
}

function startTime(){
  clearInterval(timer); time = 15; timerEl.textContent = time;
  timer = setInterval(()=>{
    time--; timerEl.textContent = time;
    if(time<=0){ check(-1); }
  },1000);
}

function answer(i){ check(i); }

function check(i){
  clearInterval(timer);
  const item = DATA[q];
  const feed = document.getElementById("feed");
  const opts = document.querySelectorAll(".opt");

  opts.forEach((btn,n)=>{
    btn.disabled=true;
    if(n===item.c) btn.classList.add("correct");
    if(n===i && n!==item.c) btn.classList.add("wrong");
  });

  if(i===item.c){ score++; feed.textContent = LANG==="EN"?"Correct! ✔️":"صحيح ✔️"; }
  else{ feed.textContent = LANG==="EN"?"Wrong ❌":"خطأ ❌"; }

  nextBtn.style.display="block";
  nextBtn.onclick = ()=>{
    q++;
    if(q>=DATA.length) finish();
    else load();
  }
}

function finish(){
  progressBar.style.width="100%";
  timerEl.style.display="none";

  if(score>=8) confettiExplosion();

  box.innerHTML=`
    <h2>${LANG==="EN"?"🎉 Finished!":"🎉 انتهى!"}</h2>
    <p>${LANG==="EN"?"Score:":"النتيجة:"} <strong>${score}/${DATA.length}</strong></p>
    <button class="opt" onclick="location.reload()">${LANG==="EN"?"Restart 🔁":"إعادة 🔁"}</button>
  `;
  nextBtn.style.display="none";
}

function confettiExplosion(){
  confetti({particleCount:200,spread:90,origin:{y:0.6}});
}

/* LANGUAGE */
langBtn.onclick=()=>{
  LANG = LANG==="EN"?"AR":"EN";
  body.className = LANG==="AR"?"lang-ar":"";
  langBtn.textContent = LANG==="EN"?"🇬🇧 EN":"🇦🇪 عربي";
  title.textContent = LANG==="EN"?"🎯 Cyber Safety Quiz":"🎯 اختبار السلامة الإلكترونية";
  sub.textContent = LANG==="EN"?"10 questions • Kahoot style":"١٠ أسئلة • كاهوت ستايل";
  load();
};

load();
