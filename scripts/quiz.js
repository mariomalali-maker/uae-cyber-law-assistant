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
{
 en: "A social media account was hacked and the attacker changed the recovery email and phone number. The attacker is contacting others and impersonating the owner to request money. What is the safest first action?",
 ar: "تم اختراق حساب على أحد مواقع التواصل الاجتماعي، وقام المهاجم بتغيير بيانات الاسترجاع والتواصل مع الآخرين منتحلًا الهوية لطلب المال. ما أول إجراء آمن يجب اتخاذه؟",
 oEN: ["Negotiate with the attacker", "Submit an official report (ecrime.ae) and secure all linked accounts immediately", "Delete the hacked account", "Post about the issue publicly"],
 oAR: ["التفاوض مع المهاجم", "رفع بلاغ رسمي عبر المنصات المختصة (مثل ecrime.ae) وتأمين الحسابات المرتبطة فورًا", "حذف الحساب المخترق", "النشر عن المشكلة على العلن"],
 c: 1
},
{
 en: "A message claiming to be from the bank requests identity verification and includes a link. The URL spelling is suspicious and does not match the bank’s domain. What is the correct response?",
 ar: "وردت رسالة تدّعي أنها من البنك وتطلب التحقق من الهوية عبر رابط، لكن الرابط يحتوي على أخطاء إملائية ولا يتطابق مع النطاق الرسمي للبنك. ما الإجراء الصحيح؟",
 oEN: ["Open link to check", "Verify through the bank’s official contact channels and report phishing", "Forward link to friends", "Ignore everything"],
 oAR: ["فتح الرابط للتأكد", "التحقق من الجهة عبر وسائل الاتصال الرسمية والإبلاغ عن محاولة تصيّد", "إرسال الرابط للآخرين", "تجاهل كل شيء دون إجراء"],
 c: 1
},
{
 en: "An individual threatens to publish private conversations if not paid a certain amount. They also claim to have 'connections' that can cause legal trouble. Which approach is most appropriate?",
 ar: "هناك من يهدد بنشر محادثات خاصة ما لم يتم دفع مبلغ مالي، ويدعي امتلاك علاقات يمكن أن تسبب مشكلات قانونية. ما الإجراء الأنسب؟",
 oEN: ["Pay once to avoid escalation", "Respond aggressively", "Preserve evidence and file a report through authorized channels", "Attempt to hack their account"],
 oAR: ["الدفع لتجنب التصعيد", "الرد بطريقة عدائية", "حفظ الأدلة ورفع بلاغ عبر الجهات المختصة", "محاولة اختراق حساب المهاجم"],
 c: 2
},
{
 en: "A login notification appears from another country at a time when the account owner was inactive. Access is still available. What is the most secure sequence of actions?",
 ar: "ظهرت إشعار بتسجيل دخول من دولة أخرى في وقت لم يكن فيه صاحب الحساب نشطًا، ولا يزال الوصول إلى الحساب ممكنًا. ما التسلسل الأكثر أمانًا للمعالجة؟",
 oEN: ["Change password only", "Sign out of all devices → enable MFA → change password → review activity logs", "Disable the account", "Do nothing"],
 oAR: ["تغيير كلمة المرور فقط", "تسجيل الخروج من جميع الأجهزة → تفعيل التحقق متعدد العوامل → تغيير كلمة المرور → مراجعة سجل النشاط", "تعطيل الحساب بالكامل", "عدم اتخاذ أي إجراء"],
 c: 1
},
{
 en: "A free Wi-Fi network in a public place requires installing an unknown configuration file before connecting. What is the safest choice?",
 ar: "شبكة واي فاي مجانية في مكان عام تطلب تثبيت ملف إعدادات مجهول قبل الاتصال. ما الخيار الأكثر أمانًا؟",
 oEN: ["Install it; free Wi-Fi is harmless", "Avoid connecting and never install unknown files; use cellular data instead", "Ask nearby users if they installed it safely", "Test it on another device first"],
 oAR: ["تثبيت الملف فالإنترنت مجاني", "تجنب الاتصال وعدم تثبيت ملفات مجهولة واستخدام بيانات الهاتف", "سؤال الموجودين إذا قاموا بتثبيته", "تجربته على جهاز آخر أولًا"],
 c: 1
},
{
 en: "What is the most secure method of storing sensitive identity documents digitally?",
 ar: "ما الطريقة الأكثر أمانًا لحفظ المستندات الحساسة رقميًا؟",
 oEN: ["Screenshots in gallery", "Encrypted password manager or secure vault", "Email drafts", "Messaging app chat"],
 oAR: ["لقطات شاشة في المعرض", "مدير كلمات مرور مشفر أو خزانة رقمية آمنة", "مسودات بريد إلكتروني", "رسائل تطبيق محادثة"],
 c: 1
},
{
 en: "A shortened link leads to an unknown website requesting login credentials. What is the recommended response?",
 ar: "رابط مختصر يؤدي إلى موقع غير معروف ويطلب بيانات تسجيل الدخول. ما الإجراء الموصى به؟",
 oEN: ["Enter credentials to verify", "Contact the sender via a different channel to confirm authenticity", "Open on incognito mode", "Ignore without checking"],
 oAR: ["إدخال البيانات للتحقق", "التواصل مع المرسل عبر قناة أخرى للتحقق من صحة الرابط", "فتحه عبر وضع التصفح الخفي", "التجاهل دون تحقق"],
 c: 1
},
{
 en: "Sharing private audio or chat messages without consent in the UAE is considered:",
 ar: "مشاركة رسائل صوتية أو محادثات خاصة دون موافقة في الإمارات تعتبر:",
 oEN: ["A harmless action", "Allowed if truthful", "A violation punishable under UAE cybercrime regulations", "Allowed only if not monetized"],
 oAR: ["فعل غير ضار", "مسموح إن كان المحتوى صحيحًا", "انتهاك يُعاقب عليه وفق أنظمة الجرائم الإلكترونية", "مسموح إن لم يكن الهدف ربحيًا"],
 c: 2
},
{
 en: "Using the same password for all critical accounts (email, social media, banking) and no 2FA leads to:",
 ar: "استخدام كلمة المرور نفسها لجميع الحسابات المهمة (البريد، التواصل الاجتماعي، الخدمات البنكية) دون تفعيل التحقق بخطوتين يؤدي إلى:",
 oEN: ["No major risk", "High risk of complete account compromise if one account is breached", "Only email is at risk", "Loss of device data only"],
 oAR: ["لا يوجد خطر كبير", "خطر عالي بانكشاف جميع الحسابات إذا تم اختراق أحدها", "الخطر يقتصر على البريد الإلكتروني فقط", "خسارة بيانات الجهاز فقط"],
 c: 1
},
{
 en: "A website pretending to be a government service threatens legal consequences unless payment is made. The domain is not official. The correct action is:",
 ar: "موقع ينتحل صفة جهة حكومية ويهدد بعواقب قانونية ما لم يتم الدفع، والموقع لا يستخدم نطاقًا رسميًا. ما الإجراء الصحيح؟",
 oEN: ["Pay to avoid escalation", "Record evidence and report to official authorities", "Respond and argue", "Share with others to warn them"],
 oAR: ["الدفع لتجنب التصعيد", "توثيق الأدلة ورفع بلاغ للجهات الرسمية", "الرد والمناقشة", "نشر الرابط لتحذير الآخرين"],
 c: 1
}
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
