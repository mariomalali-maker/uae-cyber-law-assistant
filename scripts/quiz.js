// Game State
let playerName = '';
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 15;
let leaderboard = [];

// ===== QUESTIONS — EXACT SAME ARRAY FROM YOU =====
const questions = [
    {
        question: "What is the primary purpose of the UAE's National Cybersecurity Strategy (NCSS)?",
        arabicQuestion: "ما هو الهدف الرئيسي من الاستراتيجية الوطنية للأمن السيبراني في الإمارات؟",
        answers: [
            { text: "Block all international websites", arabic: "حظر جميع المواقع الدولية" },
            { text: "Create a secure and resilient cyber infrastructure", arabic: "إنشاء بنية تحتية سيبرانية آمنة ومقاومة" },
            { text: "Monitor all citizens' online activities", arabic: "مراقبة أنشطة جميع المواطنين عبر الإنترنت" },
            { text: "Replace all government websites with internal servers", arabic: "استبدال جميع المواقع الحكومية بخوادم داخلية" }
        ],
        correct: 1
    },

    {
        question: "Which UAE authority is responsible for cybersecurity regulations and policies?",
        arabicQuestion: "أي جهة إماراتية مسؤولة عن تنظيمات وسياسات الأمن السيبراني؟",
        answers: [
            { text: "Telecommunications Regulatory Authority (TRA)", arabic: "هيئة تنظيم الاتصالات" },
            { text: "Dubai Police", arabic: "شرطة دبي" },
            { text: "Abu Dhabi Department of Education", arabic: "دائرة التعليم والمعرفة في أبوظبي" },
            { text: "Ministry of Health", arabic: "وزارة الصحة" }
        ],
        correct: 0
    },

    {
        question: "What is the UAE's national cybersecurity hotline for reporting cyber incidents?",
        arabicQuestion: "ما هو الخط الساخن الوطني للأمن السيبراني للإبلاغ عن الحوادث السيبرانية؟",
        answers: [
            { text: "999", arabic: "999" },
            { text: "901", arabic: "901" },
            { text: "800 CRY (279)", arabic: "800 CRY (279)" },
            { text: "800 SAFE (7233)", arabic: "800 SAFE (7233)" }
        ],
        correct: 2
    },

    {
        question: "The UAE Cyber Security Council was established in which year?",
        arabicQuestion: "تم إنشاء مجلس الأمن السيبراني في الإمارات في أي عام؟",
        answers: [
            { text: "2015", arabic: "2015" },
            { text: "2018", arabic: "2018" },
            { text: "2020", arabic: "2020" },
            { text: "2022", arabic: "2022" }
        ],
        correct: 2
    },

    {
        question: "What does UAE's 'Cyber Pulse' initiative focus on?",
        arabicQuestion: "ما الذي يركز عليه مبادرة 'نبض السيبراني' في الإمارات؟",
        answers: [
            { text: "Creating video games for children", arabic: "إنشاء ألعاب فيديو للأطفال" },
            { text: "Building a national cybersecurity awareness platform", arabic: "بناء منصة وطنية للتوعية بالأمن السيبراني" },
            { text: "Developing antivirus software", arabic: "تطوير برامج مكافحة الفيروسات" },
            { text: "Monitoring social media only", arabic: "مراقبة وسائل التواصل الاجتماعي فقط" }
        ],
        correct: 1
    },

    {
        question: "Which UAE law criminalizes cybercrimes and defines penalties?",
        arabicQuestion: "أي قانون إماراتي يجرم الجرائم الإلكترونية ويحدد العقوبات؟",
        answers: [
            { text: "Labor Law", arabic: "قانون العمل" },
            { text: "Federal Decree-Law No. 5 of 2012 (Cybercrime Law)", arabic: "المرسوم بالقانون الاتحادي رقم 5 لسنة 2012 (قانون الجرائم الإلكترونية)" },
            { text: "Commercial Law", arabic: "قانون التجارة" },
            { text: "Traffic Law", arabic: "قانون المرور" }
        ],
        correct: 1
    },

    {
        question: "What is the UAE's National Electronic Security Authority (NESA) now called?",
        arabicQuestion: "ما هو الاسم الجديد لهيئة الأمن الإلكتروني الوطنية في الإمارات؟",
        answers: [
            { text: "Digital Dubai", arabic: "دبي الرقمية" },
            { text: "Cyber Security Council", arabic: "مجلس الأمن السيبراني" },
            { text: "TRA Cyber Unit", arabic: "وحدة السيبراني في هيئة تنظيم الاتصالات" },
            { text: "UAE Space Agency", arabic: "وكالة الفضاء الإماراتية" }
        ],
        correct: 1
    },

    {
        question: "What is the purpose of the UAE's 'Cyber Shield' program?",
        arabicQuestion: "ما هو الغرض من برنامج 'الدرع السيبراني' في الإمارات؟",
        answers: [
            { text: "To block VPN services completely", arabic: "لحظر خدمات VPN بالكامل" },
            { text: "To protect critical infrastructure from cyber threats", arabic: "لحماية البنية التحتية الحيوية من التهديدات السيبرانية" },
            { text: "Keep learning", arabic: "استمر في التعلم" }
        ],
        correct: 1
    },

    {
        question: "Which month is designated as UAE Cyber Security Awareness Month?",
        arabicQuestion: "أي شهر تم تعيينه كشهر للتوعية بالأمن السيبراني في الإمارات؟",
        answers: [
            { text: "January", arabic: "يناير" },
            { text: "June", arabic: "يونيو" },
            { text: "October", arabic: "أكتوبر" },
            { text: "December", arabic: "ديسمبر" }
        ],
        correct: 2
    },

    {
        question: "What does CERT provide in UAE?",
        arabicQuestion: "ما الذي توفره CERT في الإمارات؟",
        answers: [
            { text: "Incident response", arabic: "الاستجابة للحوادث" },
            { text: "Nothing", arabic: "لا شيء" }
        ],
        correct: 0
    }
];
// =================================================

// ===== FIXED FRONT END LOGIC =====

function startGame() {
    const input = document.getElementById('player-name');
    playerName = input.value.trim();

    if (!playerName) {
        input.style.borderColor = '#ef4444';
        input.placeholder = 'Please enter name';
        return;
    }

    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';

    currentQuestion = 0;
    score = 0;

    showQuestion();
}

function showQuestion() {

    if (currentQuestion >= questions.length) {
        endGame();
        return;
    }

    const q = questions[currentQuestion];

    document.getElementById('question-text').textContent = q.question;
    document.getElementById('question-arabic').textContent = q.arabicQuestion;

    const container = document.getElementById('answers-container');
    container.innerHTML = '';

    // ===== MAIN FIX: EVENT DELEGATION FOR BROWSERS =====
    q.answers.forEach(function(answer, index) {

        const card = document.createElement('div');
        card.className = 'answer-card';

        const p1 = document.createElement('p');
        p1.className = 'answer-text';
        p1.textContent = answer.text;

        const p2 = document.createElement('p');
        p2.className = 'answer-arabic';
        p2.textContent = answer.arabic;

        card.appendChild(p1);
        card.appendChild(p2);

        card.addEventListener('click', function() {
            selectAnswer(index);
        });

        container.appendChild(card);

    });

    startTimer();
}

function startTimer() {

    timeLeft = 15;
    const timerText = document.getElementById('timer-text');
    const timerFill = document.getElementById('timer-fill');

    timerText.textContent = timeLeft;

    timer = setInterval(function() {

        timeLeft--;

        timerText.textContent = timeLeft;
        timerFill.style.width = (timeLeft / 15 * 100) + '%';

        if (timeLeft <= 0) {
            clearInterval(timer);
            timeUp();
        }

    }, 1000);

}

function selectAnswer(selectedIndex) {

    clearInterval(timer);

    const cards = document.querySelectorAll('.answer-card');
    const correct = questions[currentQuestion].correct;

    cards.forEach(function(card) {
        card.classList.add('disabled');
    });

    if (selectedIndex === correct) {
        cards[selectedIndex].classList.add('correct');
        score += Math.round(timeLeft / 15 * 1000);
    } else {
        cards[selectedIndex].classList.add('wrong');
        cards[correct].classList.add('correct');
    }

    setTimeout(function() {
        currentQuestion++;
        showQuestion();
    }, 2000);

}

function timeUp() {
    const cards = document.querySelectorAll('.answer-card');
    const correct = questions[currentQuestion].correct;

    cards.forEach(function(card, index) {
        card.classList.add('disabled');
        if (index === correct) {
            card.classList.add('correct');
        }
    });

    setTimeout(function() {
        currentQuestion++;
        showQuestion();
    }, 2000);
}

function endGame() {
    endGame();
}

function endGame() {

    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';

    document.getElementById('final-score').textContent = score;
}

function restartGame() {

    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('welcome-screen').style.display = 'block';

    document.getElementById('player-name').value = '';
}

// ===== LEADERBOARD — SAME IDEA =====

function loadLeaderboard() {
    const saved = localStorage.getItem('cyberQuizLeaderboard');
    if (saved) leaderboard = JSON.parse(saved);
}

function displayLeaderboard() {

    const leaderboardEntries = document.getElementById('leaderboard-entries');
    leaderboardEntries.innerHTML = '';

    leaderboard.forEach(function(entry, index) {

        const entryDiv = document.createElement('div');
        entryDiv.className = 'leaderboard-entry';

        entryDiv.innerHTML =
            '<span class="player-name">' + (index + 1) + '. ' + entry.name + '</span>' +
            '<span class="player-score">' + entry.score + '</span>';

        leaderboardEntries.appendChild(entryDiv);

    });

}

// initialize
loadLeaderboard();
displayLeaderboard();

// expose globally exactly as your original wanted
window.startGame = startGame;
window.restartGame = restartGame;

