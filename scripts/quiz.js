let LANG="",i=-1,score=0,time=15,timer;
const welcome=document.getElementById("welcome");
const quiz=document.getElementById("quiz");
const qTxt=document.getElementById("q");
const opts=document.getElementById("options");
const next=document.getElementById("next");
const progress=document.getElementById("progress");
const timerEL=document.getElementById("timer");
const endScreen=document.getElementById("end");

function setLang(l){
  LANG=l;
  startBtn.style.display="inline-block";
  wTitle.textContent=LANG==="EN"?"🎯 Cyber Security Quiz":"🎯 اختبار الأمن السيبراني";
  wDesc.textContent=LANG==="EN"?"UAE cyber quiz — 10 questions":"اختبار الأمن السيبراني — 10 أسئلة";
  startBtn.textContent=LANG==="EN"?"🚀 Start":"🚀 ابدأ";
}

startBtn.onclick=()=>{welcome.style.display="none";quiz.style.display="block";nextQ();};

const Q=[/* SAME QUESTIONS YOU GAVE */{
en:"Someone hacked your Snapchat, changed email/phone & impersonates you. What is the safest first step?",
ar:"تم اختراق سنابك وتغيير الإيميل والرقم وانتحال شخصيتك. ما أول خطوة آمنة؟",
oEN:["Tell friends","Post story","Report to ecrime.ae & secure","Wait"],
oAR:["بلغ الأصدقاء","بوست","بلغ ecrime.ae وأأمن الحسابات","انتظر"],
c:2
},/* ... rest unchanged ... */];

function nextQ(){
  i++; if(i>=Q.length){finish();return;}
  const q=Q[i]; qTxt.textContent=LANG==="EN"?q.en:q.ar;
  opts.innerHTML=""; next.style.display="none";
  progress.style.width=(i/Q.length*100)+"%";
  time=15; timerEL.textContent=`⏳ ${time}s`; timerEL.classList.remove("timerLow");

  clearInterval(timer);
  timer=setInterval(()=>{
    time--; timerEL.textContent=`⏳ ${time}s`;
    if(time<6) timerEL.classList.add("timerLow");
    if(time<=0) check(-1);
  },1000);

  (LANG==="EN"?q.oEN:q.oAR).forEach((t,idx)=>{
    const b=document.createElement("button");
    b.className="opt"; b.textContent=t;
    b.onclick=()=>check(idx);
    opts.appendChild(b);
  });
}

function check(p){
  clearInterval(timer);
  const b=[...document.querySelectorAll(".opt")];
  b.forEach((btn,idx)=>{
    btn.disabled=true;
    if(idx===Q[i].c)btn.classList.add("correct");
    if(idx===p && p!==Q[i].c)btn.classList.add("wrong");
  });
  if(p===Q[i].c)score++;
  next.style.display="inline-block"; next.textContent=LANG==="EN"?"Next ➜":"التالي ➜";
  next.onclick=nextQ;
}

function finish(){
  quiz.style.display="none";
  endScreen.style.display="block";

  if(score>=8){
    document.getElementById("resultTitle").innerHTML = LANG==="EN"
      ? "🎉 YOU ARE A <span class='legend'>CYBER SECURITY LEGEND!</span>"
      : "🎉 أنتِ <span class='legend'>أسطورة الأمن السيبراني!</span>";
    confetti({particleCount:350,spread:100,origin:{y:0.6}});
  } else {
    document.getElementById("resultTitle").innerHTML = LANG==="EN"
      ? "📚 YOU ARE LEARNING — TRY AGAIN!"
      : "📚 مازلتِ تتعلمين — حاولي مرة أخرى!";
  }

  document.getElementById("score").textContent = `${score}/10`;
}

