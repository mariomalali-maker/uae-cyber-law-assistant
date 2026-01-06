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

// DOM Elements
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

// Sound Effects (using Web Audio API)
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'correct') {
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
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
    } else if (type === 'win') {
        const frequencies = [523.25, 659.25, 783.99, 1046.50];
        frequencies.forEach((freq, i) => {
            setTimeout(() => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.frequency.setValueAtTime(freq, audioContext.currentTime);
                gain.gain.setValueAtTime(0.2, audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                osc.start(audioContext.currentTime);
                osc.stop(audioContext.currentTime + 0.3);
            }, i * 100);
        });
    }
}

// Screen Management
function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.add('hidden'));
    screens[screenName].classList.remove('hidden');
}

// Language Selection
function setLanguage(lang) {
    currentLanguage = lang;
    document.body.classList.toggle('rtl', lang === 'AR');
    
    const startContainer = document.getElementById('startContainer');
    startContainer.classList.remove('hidden');
    setTimeout(() => startContainer.classList.add('visible'), 100);
    
    playSound('correct');
}

// Start Game
function startGame() {
    const nameInput = document.getElementById('playerName');
    playerName = nameInput.value.trim() || 'Anonymous';
    
    // Reset game state
    currentQuestion = 0;
    score = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    
    showScreen('countdown');
    startCountdown();
}

// Countdown
function startCountdown() {
    let count = 3;
    const countdownNumber = document.getElementById('countdownNumber');
    const countdownText = document.getElementById('countdownText');
    
    const countdownInterval = setInterval(() => {
        if (count > 0) {
            countdownNumber.textContent = count;
            countdownNumber.style.animation = 'none';
            countdownNumber.offsetHeight; // Trigger reflow
            countdownNumber.style.animation = 'countPulse 1s ease-in-out';
            playSound('countdown');
            count--;
        } else {
            clearInterval(countdownInterval);
            showScreen('quiz');
            loadQuestion();
        }
    }, 1000);
}

// Load Question
function loadQuestion() {
    hasAnswered = false;
    const question = questions[currentQuestion];
    const lang = currentLanguage;
    
    // Update question counter
    document.getElementById('currentQ').textContent = currentQuestion + 1;
    document.getElementById('totalQ').textContent = questions.length;
    
    // Update score display
    document.getElementById('currentScore').textContent = score;
    
    // Update question text with animation
    const questionText = document.getElementById('questionText');
    questionText.textContent = question[lang.toLowerCase()];
    questionText.style.animation = 'none';
    questionText.offsetHeight; // Trigger reflow
    questionText.style.animation = 'slideIn 0.5s ease-out';
    
    // Update options
    const options = question.options[lang.toLowerCase()];
    const optionButtons = document.querySelectorAll('.option-btn');
    
    optionButtons.forEach((btn, index) => {
        btn.disabled = false;
        btn.className = 'option-btn';
        btn.querySelector('.option-text').textContent = options[index];
    });
    
    // Start timer
    startTimer();
}

// Timer
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
        
        // Change color based on time
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

// Handle Timeout
function handleTimeout() {
    if (!hasAnswered) {
        hasAnswered = true;
        wrongAnswers++;
        const correctAnswer = questions[currentQuestion].correct;
        
        // Highlight correct answer
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

// Select Answer
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
    
    // Update button styles
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

// Show Feedback
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
        
        // Mini confetti for correct answer
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 }
        });
    } else {
        icon.textContent = '😢';
        text.textContent = currentLanguage === 'EN' ? 'WRONG!' : 'خطأ!';
        text.style.color = '#e21b3c';
        pointsText.textContent = '+0';
    }
    
    // Auto-advance after delay
    setTimeout(() => {
        overlay.classList.add('hidden');
        nextQuestion();
    }, 2000);
}

// Next Question
function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

// Show Results
function showResults() {
    showScreen('results');
    
    const accuracy = Math.round((correctAnswers / questions.length) * 100);
    
    // Determine result message
    const resultEmoji = document.getElementById('resultEmoji');
    const resultTitle = document.getElementById('resultTitle');
    
    if (accuracy >= 80) {
        resultEmoji.textContent = '🏆';
        resultTitle.textContent = currentLanguage === 'EN' ? 'CYBER SECURITY CHAMPION!' : 'بطل الأمن السيبراني!';
        playSound('win');
        launchConfetti();
    } else if (accuracy >= 60) {
        resultEmoji.textContent = '🎉';
        resultTitle.textContent = currentLanguage === 'EN' ? 'GREAT JOB!' : 'عمل رائع!';
        playSound('win');
    } else if (accuracy >= 40) {
        resultEmoji.textContent = '👍';
        resultTitle.textContent = currentLanguage === 'EN' ? 'GOOD EFFORT!' : 'جيد!';
    } else {
        resultEmoji.textContent = '📚';
        resultTitle.textContent = currentLanguage === 'EN' ? 'KEEP LEARNING!' : 'استمري في التعلم!';
    }
    
    // Animate score circle
    setTimeout(() => {
        const progressRing = document.getElementById('progressRing');
        const offset = 565.48 - (565.48 * accuracy / 100);
        progressRing.style.setProperty('--offset', offset);
        progressRing.classList.add('animate');
    }, 500);
    
    // Update stats
    document.getElementById('finalScore').textContent = score;
    document.getElementById('totalScore').textContent = '10';
    document.getElementById('playerNameDisplay').textContent = playerName;
    document.getElementById('correctCount').textContent = correctAnswers;
    document.getElementById('wrongCount').textContent = wrongAnswers;
    document.getElementById('accuracy').textContent = accuracy + '%';
}

// Launch Confetti
function launchConfetti() {
    const duration = 3000;
    const end = Date.now() + duration;
    
    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
        });
        
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

// Play Again
function playAgain() {
    showScreen('start');
    document.getElementById('startContainer').classList.remove('visible');
    document.getElementById('playerName').value = '';
}

// Go Home
function goHome() {
    window.location.href = 'index.html';
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (screens.quiz.classList.contains('hidden')) return;
    if (hasAnswered) return;
    
    const key = e.key.toLowerCase();
    const keyMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3 };
    
    if (keyMap.hasOwnProperty(key)) {
        selectAnswer(keyMap[key]);
    }
});

// Touch feedback for mobile
document.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
    });
    
    btn.addEventListener('touchend', function() {
        this.style.transform = '';
    });
});

// Initialize on load
window.addEventListener('load', () => {
    // Pre-warm audio context on first interaction
    document.body.addEventListener('click', () => {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }, { once: true });
});
