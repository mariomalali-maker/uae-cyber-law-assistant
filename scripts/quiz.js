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

const Q=[ /* YOUR QUESTIONS EXACTLY */ 
{
 en:"Someone hacked your Snapchat. What is the first step?",
 ar:"تم اختراق سنابك. أول خطوة آمنة؟",
 oEN:["Tell friends to ignore","Report via ecrime.ae & secure accounts","Wait"],
 oAR:["بلغ أهلك وأصدقائك","بلغ عبر ecrime.ae و أأمن الحسابات","انتظر"],
 c:1
},
{
 en:"You get a bank message with a suspicious link...",
 ar:"وصلك رابط بنك مشبوه...",
 oEN:["Enter PIN","Ignore & report phishing","Send to friends"],
 oAR:["اكتب PIN","تجاهل وبلغ كتصيد","ارسل للكل"],
 c:1
},
{
 en:"Someone threatens to leak photos unless you pay.",
 ar:"شخص يبتزك بصورك",
 oEN:["Negotiate","Collect evidence & report","Pay once"],
 oAR:["تفاوض","احتفظ بالأدلة وبلغ","ادفع مرة"],
 c:1
},
{
 en:"Using same password everywhere is:",
 ar:"تكرار كلمة السر:",
 oEN:["Low risk","High risk","Smart if secret"],
 oAR:["خطر بسيط","خطر عالي","ذكي اذا سري"],
 c:1
},
{
 en:"Public Wi-Fi (no password). Best action?",
 ar:"واي فاي مجاني بدون كلمة مرور",
 oEN:["Use normally","Avoid logging in / VPN","Do banking"],
 oAR:["استعمله عادي","VPN وتجنب الحسابات","سوي معاملات بنكية"],
 c:1
},
{
 en:"2FA protects you from:",
 ar:"التحقق بخطوتين يحمي من:",
 oEN:["Slow wifi","Access even with stolen password","Spam"],
 oAR:["بطء النت","دخول للحساب حتى لو انسرقت كلمة السر","الرسائل"],
 c:1
},
{
 en:"Sharing screenshots without consent in UAE:",
 ar:"نشر محادثات بدون إذن:",
 oEN:["Allowed","Punishable by Cybercrime Law","Only wrong if someone reports"],
 oAR:["مسموح","يعاقب عليه قانون الجرائم الالكترونية","غلط اذا اشتكوا"],
 c:1
},
{
 en:"Message: Emirates ID expired — pay link",
 ar:"رسالة: الهوية منتهية ـ ادفع الرابط",
 oEN:["Pay","Verify via ICP official apps","Forward"],
 oAR:["ادفع","تحقق عبر التطبيقات الرسمية","ارسله"],
 c:1
},
{
 en:"Friend sends shady link 'is this you?'",
 ar:"صديق ارسل رابط 'هذا انتي؟'",
 oEN:["Click","Login & check","Contact friend elsewhere"],
 oAR:["اضغطي","سجلي دخول","تواصلي بطريقة ثانية"],
 c:2
},
{
 en:"Best location sharing practice:",
 ar:"أفضل مشاركة موقع:",
 oEN:["Share live","Never share","Share after leaving"],
 oAR:["مباشر","لا تشاركي","بعد ما تروحين"],
 c:2
}
];

function nextQ(){
  i++; if(i>=Q.length){finish();return;}
  
  const q=Q[i];
  qTxt.textContent=LANG==="EN"?q.en:q.ar;
  
  opts.innerHTML=""; next.style.display="none";
  time=15;
  progress.style.width=(i/Q.length*100)+"%";

  clearInterval(timer);
  timer=setInterval(()=>{
    time--;
    timerEL.textContent=`⏳ ${time}s`;
    timerEL.style.color=time<6?"#f87171":"#fff";
    if(time<=0) check(-1);
  },1000);

  const options = LANG==="EN"?q.oEN:q.oAR;
  options.forEach((text,idx)=>{
    const b=document.createElement('button');
    b.className="opt";
    b.textContent=text;
    b.onclick=()=>check(idx);
    opts.appendChild(b);
  });
}

function check(pick){
  clearInterval(timer);
  document.querySelectorAll(".opt").forEach((btn,idx)=>{
    btn.disabled=true;
    if(idx===Q[i].c) btn.classList.add("correct");
    if(idx===pick && pick!==Q[i].c) btn.classList.add("wrong");
  });
  if(pick===Q[i].c) score++;
  next.style.display="block";
  next.onclick=nextQ;
}

function finish(){
  quiz.style.display="none";
  end.style.display="block";

  const win = score>=8;
  document.getElementById("endHead").innerHTML = win
    ? (LANG==="EN"?"🎉 YOU ARE A CYBER SECURITY LEGEND!":"🎉 أنتِ أسطورة في الأمن السيبراني!")
    : (LANG==="EN"?"📚 You are learning — try again":"📚 تتعلمين — حاولي مرة ثانية");

  document.getElementById("score").textContent =
    LANG==="EN"?`Score: ${score}/10`:`النتيجة: ${score}/10`;

  if(win){
    confetti({particleCount:300,spread:100,origin:{y:.6}});
    drop(["🔐","🛡️","🎉","✨","⭐"]);
  }
}

/* falling emojis */
function drop(icons){
  for(let n=0;n<30;n++){
    let e=document.createElement("div");
    e.className="fall";
    e.textContent=icons[Math.floor(Math.random()*icons.length)];
    e.style.left=Math.random()*100+"vw";
    e.style.fontSize=(20+Math.random()*25)+"px";
    document.body.appendChild(e);
    setTimeout(()=>e.remove(),3000);
  }
}
