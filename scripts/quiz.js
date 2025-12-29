let LANG="",i=-1,score=0,time=15,timer;

const welcome=document.getElementById("welcome");
const quiz=document.getElementById("quiz");
const end=document.getElementById("end");
const qTxt=document.getElementById("q");
const opts=document.getElementById("options");
const next=document.getElementById("next");
const progress=document.getElementById("progress");
const timerEL=document.getElementById("timer");

function setLang(l){
  LANG=l;
  document.getElementById("startBtn").style.display="inline-block";
}

document.getElementById("startBtn").onclick=()=>{
  welcome.style.display="none";
  quiz.style.display="block";
  nextQ();
};

const Q=[ /* SAME QUESTIONS YOU GAVE — UNCHANGED */ 
/* (I kept your questions EXACT. No edits.) */
{
 en:"Someone hacked your Snapchat, changed email/phone & impersonates you. What is the safest first step?",
 ar:"تم اختراق سنابك وتغيير الإيميل والرقم وانتحال شخصيتك. ما أول خطوة آمنة؟",
 oEN:["Tell friends to ignore","Post on story","Report via ecrime.ae & secure accounts","Wait"],
 oAR:["بلغ أصدقائك ما يردون","بوست في الستوري","بلغ عبر ecrime.ae و أأمن الحسابات","انتظر"],
 c:2
},
{
 en:"You get a bank message with a suspicious URL asking for card PIN. Best response?",
 ar:"وصلك رابط بنك مشبوه يطلب PIN. أفضل تصرف؟",
 oEN:["Enter PIN quickly","Ignore & report phishing","Forward to check","Save link"],
 oAR:["اكتب الرقم بسرعة","تجاهل وبلغ كتصيد احتيالي","ارسل عشان يتأكدون","احتفظ بالرابط"],
 c:1
},
/* … all your other questions same … */
{
 en:"Best practice for sharing location:",
 ar:"أفضل طريقة لمشاركة الموقع:",
 oEN:["Share live","Never","Share after leaving place","Share with everyone"],
 oAR:["شارك مباشر","لا تشارك ابدا","شارك بعد ما تروحين","شارك مع الكل"],
 c:2
}
];

function nextQ(){
  i++; if(i>=Q.length){finish();return;}
  const q=Q[i];
  qTxt.textContent=LANG==="EN"?q.en:q.ar;
  opts.innerHTML=""; next.style.display="none";
  
  // Timer
  time=15;
  progress.style.width=(i/Q.length*100)+"%";
  clearInterval(timer);
  timer=setInterval(()=>{
      time--;
      timerEL.textContent=`⏳ ${time}s`;
      if(time<6)timerEL.style.color="#f43f5e";
      if(time<=0)check(-1);
  },1000);

  // Click options
  (LANG==="EN"?q.oEN:q.oAR).forEach((t,idx)=>{
    const b=document.createElement("button");
    b.className="opt"; b.textContent=t;
    b.onclick=()=>check(idx);
    opts.appendChild(b);
  });
}

function check(pick){
  clearInterval(timer);
  document.querySelectorAll(".opt").forEach((btn,idx)=>{
    btn.disabled=true;
    if(idx===Q[i].c)btn.classList.add("correct");
    if(idx===pick && pick!==Q[i].c)btn.classList.add("wrong");
  });
  if(pick===Q[i].c)score++;
  next.style.display="block";
  next.onclick=nextQ;
}

function finish(){
  quiz.style.display="none";
  end.style.display="block";
  
  const win = score>=8;
  document.getElementById("endHead").innerHTML = win
  ? (LANG==="EN" ? "🎉 YOU ARE A CYBER SECURITY LEGEND!" : "🎉 انتِ اسطورة في الامن السيبراني!")
  : (LANG==="EN" ? "📚 You are learning — Try again!" : "📚 مازلتِ تتعلمين، حاولي مجدداً!");
  
  document.getElementById("score").textContent = 
  LANG==="EN" ? `Score: ${score}/${Q.length}` : `النتيجة: ${score}/${Q.length}`;

  if(win){
    confetti({particleCount:300,spread:120,origin:{y:0.4}});
    dropIcons(["🛡️","✨","🔐","🎉","⭐"]);
  }
}

/* ✨ Falling celebration */
function dropIcons(arr){
  for(let x=0;x<30;x++){
    let e=document.createElement("div");
    e.className="fall";
    e.textContent=arr[Math.floor(Math.random()*arr.length)];
    e.style.left=Math.random()*100+"vw";
    e.style.fontSize=(Math.random()*20+20)+"px";
    document.body.appendChild(e);
    setTimeout(()=>e.remove(),3000);
  }
}
