let LANG = "";
let index = 0;
let score = 0;
let time = 15;
let timer;

const home = document.getElementById("home");
const quiz = document.getElementById("quiz");
const end = document.getElementById("end");
const q = document.getElementById("question");
const options = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const progress = document.getElementById("progress");
const timerEl = document.getElementById("timer");

/* LANGUAGE */
function setLang(l){
  LANG = l;
  document.getElementById("startBtn").style.display="inline-block";
}

/* START */
function startGame(){
  home.style.display="none";
  quiz.style.display="block";
  index=0; score=0;
  nextQ();
}

const Q = [
{en:"Someone hacked your Snapchat...", ar:"تم اختراق حساب سناب...", oEN:["Tell friends","Post","ecrime.ae & secure","Wait"], oAR:["اخبر الأصدقاء","بوست","بلغ ecrime","انتظر"], c:2},
{en:"Bank link asking for PIN?", ar:"رابط بنك يطلب PIN؟", oEN:["Enter","Report phishing","Forward","Save"], oAR:["ادخل","بلغ احتيال","ارسل","احتفظ"], c:1},
{en:"Threatening to leak pics?", ar:"تهديد بنشر صور؟", oEN:["Negotiate","Delete","Collect evidence & report","Pay"], oAR:["تفاوض","احذف","اجمع ادلة وبلغ","ادفع"], c:2},
{en:"Same password everywhere?", ar:"نفس كلمة السر للجميع؟", oEN:["Convenient","Low risk","High risk","Smart"], oAR:["سهل","بدون خطر","خطر عالي","ذكي"], c:2},
{en:"Public WiFi no password:", ar:"واي فاي بدون كلمة مرور:", oEN:["Use normally","Use VPN","Banking","Share"], oAR:["عادي","VPN","بنوك","شارك"], c:1},
{en:"2FA protects from:", ar:"التحقق بخطوتين:", oEN:["Viruses","Stolen password logins","Slow WiFi","Spam"], oAR:["فيروسات","دخول حتى مع سرقة كلمة السر","بطء","سبام"], c:1},
{en:"Sharing chats without consent:", ar:"نشر محادثات بدون إذن:", oEN:["Normal","Allowed","Punishable","Only wrong if reported"], oAR:["عادي","مسموح","يعاقب","اذا اشتكوا"], c:2},
{en:"ID expired fake link:", ar:"هوية منتهية ورابط وهمي:", oEN:["Pay","Check ICP","Forward","Ignore"], oAR:["ادفع","تحقق ICP","ارسل","طنش"], c:1},
{en:"Friend: is this you link:", ar:"هذا انتي بالرابط؟", oEN:["Click","Share","Contact friend elsewhere","Login"], oAR:["اضغط","ارسال","تواصلي معه","دخول"], c:2},
{en:"Share location:", ar:"مشاركة الموقع:", oEN:["Live share","Never","After leaving place","Everyone"], oAR:["مباشر","ابدا","بعد الخروج","للجميع"], c:2}
];

/* SHOW QUESTION */
function nextQ(){
  if(index >= Q.length) return finish();

  let data = Q[index];
  let txt = LANG==="EN" ? data.en : data.ar;
  q.textContent = txt;

  options.innerHTML = "";
  nextBtn.style.display="none";

  let ops = LANG==="EN" ? data.oEN : data.oAR;
  ops.forEach((t,i)=>{
    let btn = document.createElement("button");
    btn.className="opt";
    btn.textContent=t;
    btn.onclick=()=>check(i);
    options.appendChild(btn);
  });

  progress.style.width = (index/Q.length)*100 + "%";

  time = 15; timerEl.textContent = `⏳ ${time}s`;
  clearInterval(timer);
  timer = setInterval(()=>{
    time--;
    timerEl.textContent = `⏳ ${time}s`;
    if(time <= 0){ check(-1); }
  },1000);
}

/* CHECK */
function check(choice){
  clearInterval(timer);
  let correct = Q[index].c;
  let btns = document.querySelectorAll(".opt");

  btns.forEach((b,i)=>{
    b.disabled=true;
    if(i===correct) b.classList.add("correct");
    if(i===choice && choice!==correct) b.classList.add("wrong");
  });

  if(choice === correct) score++;

  index++;
  nextBtn.style.display="block";
  nextBtn.textContent = LANG==="EN" ? "Next ➜" : "التالي ➜";
}

/* END */
function finish(){
  quiz.style.display="none";
  end.style.display="block";
  let total = Q.length;

  if(score >= 8){
    endTitle.textContent = LANG==="EN" ? "🎉 Cybersecurity Legend!" : "🎉 أسطورة الأمن السيبراني!";
    winConfetti();
    dropEmojis();
  } else {
    endTitle.textContent = LANG==="EN" ? "📚 Still learning — Try again!" : "📚 مازلتِ تتعلمين — حاولي مرة أخرى!";
  }

  endScore.textContent = `${score}/${total}`;
}

/* EFFECTS */
function winConfetti(){
  confetti({particleCount:200,spread:100,origin:{y:0.7}});
}

function dropEmojis(){
  const emojis = ["🛡","🎯","✨","🔐","📱","🤍"];
  const drop = setInterval(()=>{
    const el=document.createElement("div");
    el.textContent=emojis[Math.floor(Math.random()*emojis.length)];
    el.style.position="fixed";
    el.style.left=Math.random()*100+"vw";
    el.style.top="-20px";
    el.style.fontSize="32px";
    el.style.animation="fall 3s linear forwards";
    document.body.appendChild(el);
    setTimeout(()=>el.remove(),3000);
  },300);
  setTimeout(()=>clearInterval(drop),3000);
}
