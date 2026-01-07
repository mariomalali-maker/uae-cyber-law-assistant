// Game State
let playerName = '';
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 15;
let leaderboard = [];

// 15 Tricky Cybersecurity Questions about UAE Protections
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
    }
];

// Start Game Function
function startGame() {
    playerName = document.getElementById('player-name').value.trim();
    
    if (!playerName) {
        document.getElementById('player-name').style.borderColor = '#ef4444';
        return;
    }
    
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('countdown-screen').style.display = 'block';
    
    showQuestion();
}

// Show Question Function — same logic
function showQuestion() {

    if (currentQuestion >= questions.length) {
        endGame();
        return;
    }

    const q = questions[currentQuestion];

    document.getElementById('question-text').textContent = q.question;
    document.getElementById('question-arabic').textContent = q.arabicQuestion;

    const answersContainer = document.getElementById('answers-container');
    answersContainer.innerHTML = '';

    q.answers.forEach(function(answer, index) {

        const card = document.createElement('div');
        card.className = 'answer-card';

        card.innerHTML =
            '<p class="answer-text">' + answer.text + '</p>' +
            '<p class="answer-arabic">' + answer.arabic + '</p>';

        // FIXED ONLY CLICK PART
        card.addEventListener('click', function() {
            selectAnswer(index);
        });

        answersContainer.appendChild(card);

    });

    startTimer();
}

// Timer Function — same
function startTimer() {

    timeLeft = 15;
    const timerText = document.getElementById('timer-text');
    const timerFill = document.getElementById('timer-fill');

    timerText.textContent = timeLeft;

    timer = setInterval(function() {

        timeLeft--;
        timerText.textContent = timeLeft;

        // same width
        timerFill.style.width = (timeLeft / 15 * 100) + '%';

        if (timeLeft <= 0) {
            clearInterval(timer);
            timeUp();
        }

    }, 1000);

}

// Select Answer Function — same
function selectAnswer(selectedIndex) {

    clearInterval(timer);

    const cards = document.querySelectorAll('.answer-card');
    const correctAnswer = questions[currentQuestion].correct;

    cards.forEach(function(card) {
        card.classList.add('disabled');
    });

    if (selectedIndex === correctAnswer) {
        cards[selectedIndex].classList.add('correct');
        score += Math.round(timeLeft / 15 * 1000);
    } else {
        cards[selectedIndex].classList.add('wrong');
        cards[correctAnswer].classList.add('correct');
    }

    setTimeout(function() {
        currentQuestion++;
        showQuestion();
    }, 2000);

}

// Time Up Function — same
function timeUp() {

    const cards = document.querySelectorAll('.answer-card');
    const correctAnswer = questions[currentQuestion].correct;

    cards.forEach(function(card, index) {

        card.classList.add('disabled');

        if (index === correctAnswer) {
            card.classList.add('correct');
        }

    });

    setTimeout(function() {
        currentQuestion++;
        showQuestion();
    }, 2000);

}

// End Game Function — same
function endGame() {

    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';

    document.getElementById('final-score').textContent = score;
}

// Restart Game Function — same
function restartGame() {

    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('welcome-screen').style.display = 'block';

    document.getElementById('player-name').value = '';
}

// Make functions globally accessible — same as your html expects
window.startGame = startGame;
window.restartGame = restartGame;

// Initialize leaderboard — same
function loadLeaderboard() {

    const saved = localStorage.getItem('cyberQuizLeaderboard');

    if (saved) {
        leaderboard = JSON.parse(saved);
    }
}

// Display Leaderboard — same
function displayLeaderboard() {

    const leaderboardEntries = document.getElementById('leaderboard-entries');

    if (!leaderboardEntries) return;

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

// Initialize
loadLeaderboard();
displayLeaderboard();

