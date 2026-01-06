// Quiz State
let currentLanguage = '';
let currentQuestion = 0;
let score = 0;
let playerName = 'Anonymous';
let timeLeft = 15;
let timerInterval = null;
let hasAnswered = false;
let correctAnswers = 0;
let wrongAnswers = 0;

const screens = {
    start: document.getElementById('startScreen'),
    countdown: document.getElementById('countdownScreen'),
    quiz: document.getElementById('quizScreen'),
    results: document.getElementById('resultsScreen')
};

// Questions Data
const questions = [
    {
        en: "A social media account was hacked and the attacker changed the recovery email and phone number. The attacker is contacting others and impersonating the owner to request money. What is the safest first action?",
        ar: "تم اختراق حساب على أحد مواقع التواصل الاجتماعي، وقام المهاجم بتغيير بيانات الاسترجاع والتواصل مع الآخرين منتحلًا الهوية لطلب المال. ما أول إجراء آمن يجب اتخاذه؟",
        options: {
            en: ["Negotiate with the attacker", "Submit an official report (ecrime.ae) and secure all linked accounts immediately", "Delete the hacked account", "Post about the issue publicly"],
            ar: ["التفاوض مع المهاجم", "رفع بلاغ رسمي عبر المنصات المختصة (مثل ecrime.ae) وتأمين الحسابات المرتبطة فورًا", "حذف الحساب المخترق", "النشر عن المشكلة على العلن"]
        },
        correct: 1
    },
    {
        en: "A message claiming to be from the bank requests identity verification and includes a link. The URL spelling is suspicious and does not match the bank's domain. What is the correct response?",
        ar: "وردت رسالة تدّعي أنها من البنك وتطلب التحقق من الهوية عبر رابط، لكن الرابط يحتوي على أخطاء إملائية ولا يتطابق مع النطاق الرسمي للبنك. ما الإجراء الصحيح؟",
        options: {
            en: ["Open link to check", "Verify through the bank's official contact channels and report phishing", "Forward link to friends", "Ignore everything"],
            ar: ["فتح الرابط للتأكد", "التحقق من الجهة عبر وسائل الاتصال الرسمية والإبلاغ عن محاولة تصيّد", "إرسال الرابط للآخرين", "تجاهل كل شيء دون إجراء"]
        },
        correct: 1
    },
    {
        en: "An individual threatens to publish private conversations if not paid a certain amount. They also claim to have 'connections' that can cause legal trouble. Which approach is most appropriate?",
        ar: "هناك من يهدد بنشر محادثات خاصة ما لم يتم دفع مبلغ مالي، ويدعي امتلاك علاقات يمكن أن تسبب مشكلات قانونية. ما الإجراء الأنسب؟",
        options: {
            en: ["Pay once to avoid escalation", "Respond aggressively", "Preserve evidence and file a report through authorized channels", "Attempt to hack their account"],
            ar: ["الدفع لتجنب التصعيد", "الرد بطريقة عدائية", "حفظ الأدلة ورفع بلاغ عبر الجهات المختصة", "محاولة اختراق حساب المهاجم"]
        },
        correct: 2
    },
    {
        en: "A login notification appears from another country at a time when the account owner was inactive. Access is still available. What is the most secure sequence of actions?",
        ar: "ظهرت إشعار بتسجيل دخول من دولة أخرى في وقت لم يكن فيه صاحب الحساب نشطًا، ولا يزال الوصول إلى الحساب ممكنًا. ما التسلسل الأكثر أمانًا للمعالجة؟",
        options: {
            en: ["Change password only", "Sign out of all devices → enable MFA → change password → review activity logs", "Disable the account", "Do nothing"],
            ar: ["تغيير كلمة المرور فقط", "تسجيل الخروج من جميع الأجهزة → تفعيل التحقق متعدد العوامل → تغيير كلمة المرور → مراجعة سجل النشاط", "تعطيل الحساب بالكامل", "عدم اتخاذ أي إجراء"]
        },
        correct: 1
    },
    {
        en: "A free Wi-Fi network in a public place requires installing an unknown configuration file before connecting. What is the safest choice?",
        ar: "شبكة واي فاي مجانية في مكان عام تطلب تثبيت ملف إعدادات مجهول قبل الاتصال. ما الخيار الأكثر أمانًا؟",
        options: {
            en: ["Install it; free Wi-Fi is harmless", "Avoid connecting and never install unknown files; use cellular data instead", "Ask nearby users if they installed it safely", "Test it on another device first"],
            ar: ["تثبيت الملف فالإنترنت مجاني", "تجنب الاتصال وعدم تثبيت ملفات مجهولة واستخدام بيانات الهاتف", "سؤال الموجودين إذا قاموا بتثبيته", "تجربته على جهاز آخر أولًا"]
        },
        correct: 1
    },
    {
        en: "What is the most secure method of storing sensitive identity documents digitally?",
        ar: "ما الطريقة الأكثر أمانًا لحفظ المستندات الحساسة رقميًا؟",
        options: {
            en: ["Screenshots in gallery", "Encrypted password manager or secure vault", "Email drafts", "Messaging app chat"],
            ar: ["لقطات شاشة في المعرض", "مدير كلمات مرور مشفر أو خزانة رقمية آمنة", "مسودات بريد إلكتروني", "رسائل تطبيق محادثة"]
        },
        correct: 1
    },
    {
        en: "A shortened link leads to an unknown website requesting login credentials. What is the recommended response?",
        ar: "رابط مختصر يؤدي إلى موقع غير معروف ويطلب بيانات تسجيل الدخول. ما الإجراء الموصى به؟",
        options: {
            en: ["Enter credentials to verify", "Contact the sender via a different channel to confirm authenticity", "Open on incognito mode", "Ignore without checking"],
            ar: ["إدخال البيانات للتحقق", "التواصل مع المرسل عبر قناة أخرى للتحقق من صحة الرابط", "فتحه عبر وضع التصفح الخفي", "التجاهل دون تحقق"]
        },
        correct: 1
    },
    {
        en: "Sharing private audio or chat messages without consent in the UAE is considered:",
        ar: "مشاركة رسائل صوتية أو محادثات خاصة دون موافقة في الإمارات تعتبر:",
        options: {
            en: ["A harmless action", "Allowed if truthful", "A violation punishable under UAE cybercrime regulations", "Allowed only if not monetized"],
            ar: ["فعل غير ضار", "مسموح إن كان المحتوى صحيحًا", "انتهاك يُعاقب عليه وفق أنظمة الجرائم الإلكترونية", "مسموح إن لم يكن الهدف ربحيًا"]
        },
        correct: 2
    },
    {
        en: "Using the same password for all critical accounts (email, social media, banking) and no 2FA leads to:",
        ar: "استخدام كلمة المرور نفسها لجميع الحسابات المهمة (البريد، التواصل الاجتماعي، الخدمات البنكية) دون تفعيل التحقق بخطوتين يؤدي إلى:",
        options: {
            en: ["No major risk", "High risk of complete account compromise if one account is breached", "Only email is at risk", "Loss of device data only"],
            ar: ["لا يوجد خطر كبير", "خطر عالي بانكشاف جميع الحسابات إذا تم اختراق أحدها", "الخطر يقتصر على البريد الإلكتروني فقط", "خسارة بيانات الجهاز فقط"]
        },
        correct: 1
    },
    {
        en: "A website pretending to be a government service threatens legal consequences unless payment is made. The domain is not official. The correct action is:",
        ar: "موقع ينتحل صفة جهة حكومية ويهدد بعواقب قانونية ما لم يتم الدفع، والموقع لا يستخدم نطاقًا رسميًا. ما الإجراء الصحيح؟",
        options: {
            en: ["Pay to avoid escalation", "Record evidence and report to official authorities", "Respond and argue", "Share with others to warn them"],
            ar: ["الدفع لتجنب التصعيد", "توثيق الأدلة ورفع بلاغ للجهات الرسمية", "الرد والمناقشة", "نشر الرابط لتحذير الآخرين"]
        },
        correct: 1
    }
];

// Sound Effects
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'correct') {
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); 
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); 
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); 
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
    } else if (type === 'wrong') {
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } else if (type === 'countdown') {
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
}

function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.add('hidden'));
    screens[screenName].classList.remove('hidden');
}

function setLanguage(lang) {
    currentLanguage = lang;
    document.body.classList.toggle('rtl', lang === 'AR');
    
    const startContainer = document.getElementById('startContainer');
    startContainer.classList.remove('hidden');
    setTimeout(() => startContainer.classList.add('visible'), 100);
    
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    playSound('correct');
}

function startGame() {
    const nameInput = document.getElementById('playerName');
    playerName = nameInput.value.trim() || 'Anonymous';
    
    currentQuestion = 0;
    score = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    
    showScreen('countdown');
    runCountdown(); // Fixed: function name must match
}

function runCountdown() { // Fixed: removed illegal bracket and fixed name
    let count = 3;
    const countdownNumber = document.getElementById('countdownNumber');
    
    const countdownInterval = setInterval(() => {
        if (count > 0) {
            countdownNumber.textContent = count;
            playSound('countdown');
            count--;
        } else {
            clearInterval(countdownInterval);
            showScreen('quiz');
            loadQuestion();
        }
    }, 1000);
}

function loadQuestion() {
    hasAnswered = false;
    const question = questions[currentQuestion];
    const lang = currentLanguage.toLowerCase();
    
    document.getElementById('currentQ').textContent = currentQuestion + 1;
    document.getElementById('totalQ').textContent = questions.length;
    document.getElementById('currentScore').textContent = score;
    
    const questionText = document.getElementById('questionText');
    questionText.textContent = question[lang];
    
    const options = question.options[lang];
    const optionButtons = document.querySelectorAll('.option-btn');
    
    optionButtons.forEach((btn, index) => {
        btn.disabled = false;
        btn.className = 'option-btn';
        btn.querySelector('.option-text').textContent = options[index];
    });
    
    startTimer();
}

function startTimer() {
    timeLeft = 15;
    const timerFill = document.getElementById('timerFill');
    timerFill.className = 'timer-fill';
    timerFill.style.width = '100%';
    
    clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        timeLeft--;
        const percentage = (timeLeft / 15) * 100;
        timerFill.style.width = percentage + '%';
        
        if (timeLeft <= 5) {
            timerFill.className = 'timer-fill danger';
        } else if (timeLeft <= 10) {
            timerFill.className = 'timer-fill warning';
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);
}

function handleTimeout() {
    if (!hasAnswered) {
        hasAnswered = true;
        wrongAnswers++;
        const correctAnswer = questions[currentQuestion].correct;
        const optionButtons = document.querySelectorAll('.option-btn');
        optionButtons.forEach((btn, index) => {
            btn.disabled = true;
            if (index === correctAnswer) {
                btn.classList.add('correct');
            }
        });
        playSound('wrong');
        showFeedback(false, 0);
    }
}

function selectAnswer(selectedIndex) {
    if (hasAnswered) return;
    hasAnswered = true;
    
    clearInterval(timerInterval);
    
    const question = questions[currentQuestion];
    const isCorrect = selectedIndex === question.correct;
    const timeBonus = Math.round((timeLeft / 15) * 500);
    const points = isCorrect ? 1000 + timeBonus : 0;
    
    if (isCorrect) {
        correctAnswers++;
        score += points;
        playSound('correct');
    } else {
        wrongAnswers++;
        playSound('wrong');
    }
    
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach((btn, index) => {
        btn.disabled = true;
        if (index === question.correct) {
            btn.classList.add('correct');
        } else if (index === selectedIndex && !isCorrect) {
            btn.classList.add('wrong');
        }
    });
    
    showFeedback(isCorrect, points);
}

function showFeedback(isCorrect, points) {
    const overlay = document.getElementById('feedbackOverlay');
    const icon = document.getElementById('feedbackIcon');
    const text = document.getElementById('feedbackText');
    const pointsText = document.getElementById('feedbackPoints');
    
    overlay.classList.remove('hidden');
    
    if (isCorrect) {
        icon.textContent = '🎉';
        text.textContent = currentLanguage === 'EN' ? 'CORRECT!' : 'صحيح!';
        text.style.color = '#22c55e';
        pointsText.textContent = '+' + points;
        
        if(typeof confetti === 'function') {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        }
    } else {
        icon.textContent = '😢';
        text.textContent = currentLanguage === 'EN' ? 'WRONG!' : 'خطأ!';
        text.style.color = '#e21b3c';
        pointsText.textContent = '+0';
    }
    
    setTimeout(() => {
        overlay.classList.add('hidden');
        nextQuestion();
    }, 2000);
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    showScreen('results');
    const accuracy = Math.round((correctAnswers / questions.length) * 100);
    
    document.getElementById('resultTitle').textContent = accuracy >= 80 ? 
        (currentLanguage === 'EN' ? 'CHAMPION!' : 'بطل!') : 
        (currentLanguage === 'EN' ? 'FINISH!' : 'انتهى!');
    
    const progressRing = document.getElementById('progressRing');
    const offset = 565.48 - (565.48 * accuracy / 100);
    progressRing.style.strokeDashoffset = offset;
    
    document.getElementById('finalScore').textContent = score;
    document.getElementById('playerNameDisplay').textContent = playerName;
    document.getElementById('correctCount').textContent = correctAnswers;
    document.getElementById('wrongCount').textContent = wrongAnswers;
    document.getElementById('accuracy').textContent = accuracy + '%';
}

function playAgain() {
    showScreen('start');
    document.getElementById('startContainer').classList.remove('visible');
    document.getElementById('playerName').value = '';
}

function goHome() {
    window.location.href = 'index.html';
}
