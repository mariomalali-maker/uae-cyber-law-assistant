let LANG="",i=-1,score=0,time=15,timer;
const quiz=document.getElementById("quiz");
const welcome=document.getElementById("welcome");
const qTxt=document.getElementById("q");
const opts=document.getElementById("options");
const next=document.getElementById("next");
const progress=document.getElementById("progress");
const timerEL=document.getElementById("timer");

function setLang(l){
  LANG=l;
  document.getElementById("startBtn").style.display="inline-block";
  document.getElementById("w-title").textContent=LANG==="EN"?"🎯 Cyber Security Quiz":"🎯 اختبار الأمن السيبراني";
  document.getElementById("w-desc").textContent=LANG==="EN"?"Real UAE scenarios to protect yourself":"اختبار يعتمد على مواقف حقيقية في الإمارات";
  document.getElementById("startBtn").textContent=LANG==="EN"?"🚀 Start":"🚀 ابدأ";
}

document.getElementById("startBtn").onclick=()=>{
  welcome.style.display="none";
  quiz.style.display="block";
  nextQ();
};

const Q=[
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
{
 en:"Someone threatens to leak private photos unless you pay. What is recommended legally in UAE?",
 ar:"شخص يبتزك بصورك إذا لم تدفع. ماذا ينصح قانونياً بالإمارات؟",
 oEN:["Negotiate","Delete chat","Collect evidence & report official","Pay once"],
 oAR:["تفاوض","احذف المحادثة","احتفظ بالأدلة وبلغ الجهات","ادفع مرة"],
 c:2
},
{
 en:"Using same password for Snapchat/IG/Email/Bank is:",
 ar:"استخدام نفس كلمة المرور لكل التطبيقات:",
 oEN:["Convenient","Low risk","High risk (password reuse)","Smart if secret"],
 oAR:["سهل","مافي خطر","خطر عالي (تكرار)","ذكي إذا سري"],
 c:2
},
{
 en:"Public Wi-Fi named 'Free Mall WiFi' no password. Best practice?",
 ar:"واي فاي مجاني بالمول بدون كلمة مرور. أفضل تعامل؟",
 oEN:["Use normally","Use VPN / avoid logging into sensitive apps","Do banking","Share hotspot"],
 oAR:["استعمله عادي","استخدم VPN/تجنب الدخول لحسابات مهمة","سوي معاملات بنكية","شارك النت"],
 c:1
},
{
 en:"2FA mainly protects against:",
 ar:"التحقق بخطوتين يحمي من:",
 oEN:["Viruses","Account access even with stolen password","Slow Wi-Fi","Spam"],
 oAR:["الفيروسات","الدخول للحساب حتى لو انسرقت كلمة المرور","بطء الانترنت","الرسائل"],
 c:1
},
{
 en:"Sharing screenshots or voice notes without consent in UAE is:",
 ar:"مشاركة محادثات أو مقاطع صوتية بدون إذن يعتبر:",
 oEN:["Normal","Allowed","Punishable by Cybercrime Law","Only wrong if reported"],
 oAR:["طبيعي","مسموح","يعاقب عليه قانون الجرائم الإلكترونية","غلط اذا اشتكوا"],
 c:2
},
{
 en:"Message: 'Your Emirates ID expired, pay link to avoid ban'. Site is not .gov.ae",
 ar:"رسالة: 'هويتك منتهية ادفع بالرابط'. الموقع لا ينتهي بـ .gov.ae",
 oEN:["Pay to be safe","Check ICP official apps/sites","Forward to friends","Ignore forever"],
 oAR:["ادفع ","تحقق من تطبيقات/مواقع ICP الرسمية","ارسله للكل","طنش"],
 c:1
},
{
 en:"Friend sends 'Is this you in the video?' link.",
 ar:"صديق أرسل رابط 'هذا انتي بالفيديو؟'",
 oEN:["Click","Share","Contact friend on another channel","Login & check"],
 oAR:["اضغط","ارسل","تواصلي مع الصديق بطريقة ثانية","سجلي دخول"],
 c:2
},
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
  const q=Q[i]; qTxt.textContent=LANG==="EN"?q.en:q.ar;
  opts.innerHTML=""; next.style.display="none";
  progress.style.width=(i/Q.length*100)+"%";
  time=15; timerEL.textContent=`⏳ ${time}s`;
  clearInterval(timer); timer=setInterval(()=>{time--;timerEL.textContent=`⏳ ${time}s`;if(time<=0)check(-1);},1000);
  const op=LANG==="EN"?q.oEN:q.oAR;
  op.forEach((t,idx)=>{
    const b=document.createElement("button");
    b.className="opt"; b.textContent=t;
    b.onclick=()=>check(idx); opts.appendChild(b);
  });
}

function check(pick){
  clearInterval(timer);
  const b=document.querySelectorAll(".opt");
  b.forEach((btn,idx)=>{
    btn.disabled=true;
    if(idx===Q[i].c)btn.classList.add("correct");
    if(idx===pick && pick!==Q[i].c)btn.classList.add("wrong");
  });
  if(pick===Q[i].c)score++;
  next.textContent=LANG==="EN"?"Next ➜":"التالي ➜";
  next.style.display="block"; next.onclick=nextQ;
}

function finish(){
  quiz.style.display="none"; endScreen.style.display="block";
  document.getElementById("endHead").textContent=LANG==="EN"?"🎉 Finished!":"🎉 انتهيتِ!";
  document.getElementById("score").textContent=LANG==="EN"
    ?`Score: ${score}/${Q.length}`
    :`النتيجة: ${score}/${Q.length}`;
  if(score>=8)confetti({particleCount:200,spread:80,origin:{y:0.6}});
}

