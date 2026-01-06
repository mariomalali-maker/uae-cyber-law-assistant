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
            ar: ["التفاوض مع المهاجم", "رفع بلاغ رسمي عبر المنصات المختصة وتأمين الحسابات المرتبطة فورًا", "حذف الحساب المخترق", "النشر عن المشكلة على العلن"]
        },
        correct: 1
    },
    {
        en: "A message claiming to be from the bank requests identity verification and includes a suspicious link. What is the correct response?",
        ar: "وردت رسالة تدّعي أنها من البنك وتطلب التحقق من الهوية عبر رابط غير موثوق. ما الإجراء الصحيح؟",
        options: {
            en: ["Open link to check", "Verify through the bank official channels and report phishing", "Forward link to friends", "Ignore everything"],
            ar: ["فتح الرابط", "التحقق عبر وسائل الاتصال الرسمية والإبلاغ عن تصيّد", "إرسال الرابط للآخرين", "التجاهل"]
        },
        correct: 1
    }
];

// Screen Management
function showScreen(screenName) {
    Object.values(screens).forEach(screen => {
        if (screen) screen.classList.add('hidden');
    });

    if (screens[screenName]) {
        screens[screenName].classList.remove('hidden');
    }
}

// Start Game
function startGame() {
    const nameInput = document.getElementById('playerName');
    playerName = nameInput.value.trim() || 'Anonymous';

    // Reset
    currentQuestion = 0;
    score = 0;
    correctAnswers = 0;
    wrongAnswers = 0;

    showScreen('countdown');
    runCountdown();
}

// Countdown
function runCountdown() {
    let count = 3;
    const countdownNumber = document.getElementById('countdownNumber');

    const interval = setInterval(() => {
        if (count > 0) {
            countdownNumber.textContent = count;
            count--;
        } else {
            clearInterval(interval);
            showScreen('quiz');
            loadQuestion();
        }
    }, 1000);
}

// Load Question
function loadQuestion() {
    hasAnswered = false;
    const lang = currentLanguage || 'EN';

    const questionText = document.getElementById('questionText');
    questionText.textContent = lang === 'EN' ? 
        questions[currentQuestion].en : 
        questions[currentQuestion].ar;

    // Options
    const options = lang === 'EN' ?
        questions[currentQuestion].options.en :
        questions[currentQuestion].options.ar;

    document.querySelectorAll('.option-btn').forEach((btn, i) => {
        const span = btn.querySelector('.option-text');
        if (span) span.textContent = options[i];
        btn.disabled = false;
    });

    startTimer();
}

// Timer
function startTimer() {
    timeLeft = 15;
    const timerFill = document.getElementById('timerFill');
    timerFill.style.width = '100%';

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timeLeft--;
        const percentage = (timeLeft / 15) * 100;
        timerFill.style.width = percentage + '%';

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);
}

// Timeout
function handleTimeout() {
    if (!hasAnswered) {
        hasAnswered = true;
        wrongAnswers++;
        showFeedback(false, 0);
    }
}

// Select Answer
function selectAnswer(index) {
    if (hasAnswered) return;

    hasAnswered = true;
    clearInterval(timerInterval);

    const isCorrect = index === questions[currentQuestion].correct;
    const points = isCorrect ? 1000 : 0;

    if (isCorrect) {
        correctAnswers++;
        score += points;
    } else {
        wrongAnswers++;
    }

    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.disabled = true;
    });

    showFeedback(isCorrect, points);
}

// Feedback
function showFeedback(isCorrect, points) {
    const overlay = document.getElementById('feedbackOverlay');
    const icon = document.getElementById('feedbackIcon');
    const text = document.getElementById('feedbackText');

    overlay.classList.remove('hidden');

    if (isCorrect) {
        icon.textContent = '🎉';
        text.textContent = 'CORRECT!';
    } else {
        icon.textContent = '😢';
        text.textContent = 'WRONG!';
    }

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

// Results Screen
function showResults() {
    showScreen('results');

    document.getElementById('finalScore').textContent = score;
    document.getElementById('correctCount').textContent = correctAnswers;
    document.getElementById('wrongCount').textContent = wrongAnswers;

    const acc = Math.round((correctAnswers / questions.length) * 100);
    document.getElementById('accuracy').textContent = acc + '%';
}

// Initialize
window.addEventListener('load', () => {
    console.log("QUIZ JS LOADED");
});
