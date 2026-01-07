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
            { text: "To monitor only government employees", arabic: "لمراقبة الموظفين الحكوميين فقط" },
            { text: "To create a social media platform", arabic: "لإنشاء منصة تواصل اجتماعي" }
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
        question: "What is the UAE's Digital Government Strategy focused on regarding cybersecurity?",
        arabicQuestion: "ما الذي تركز عليه استراتيجية الحكومة الرقمية الإماراتية فيما يتعلق بالأمن السيبراني؟",
        answers: [
            { text: "Eliminating all paper documents", arabic: "إلغاء جميع المستندات الورقية" },
            { text: "Building trust through secure digital services", arabic: "بناء الثقة من خلال الخدمات الرقمية الآمنة" },
            { text: "Creating a separate internet for UAE only", arabic: "إنشاء إنترنت منفصل للإمارات فقط" },
            { text: "Blocking all social media", arabic: "حظر جميع وسائل التواصل الاجتماعي" }
        ],
        correct: 1
    },
    {
        question: "The UAE Cyber Security Council works under which ministry?",
        arabicQuestion: "يعمل مجلس الأمن السيبراني الإماراتي تحت أي وزارة؟",
        answers: [
            { text: "Ministry of Interior", arabic: "وزارة الداخلية" },
            { text: "Ministry of Economy", arabic: "وزارة الاقتصاد" },
            { text: "Cabinet of the UAE", arabic: "مجلس الوزراء الإماراتي" },
            { text: "Ministry of Foreign Affairs", arabic: "وزارة الخارجية" }
        ],
        correct: 2
    },
    {
        question: "What is the UAE's policy on data protection and privacy?",
        arabicQuestion: "ما هي سياسة الإمارات فيما يتعلق بحماية البيانات والخصوصية؟",
        answers: [
            { text: "No data protection laws exist", arabic: "لا توجد قوانين لحماية البيانات" },
            { text: "Federal Law No. 2 of 2019 (Data Protection Law)", arabic: "القانون الاتحادي رقم 2 لسنة 2019 (قانون حماية البيانات)" },
            { text: "Only companies need data protection", arabic: "فقط الشركات تحتاج لحماية البيانات" },
            { text: "Data protection is optional", arabic: "حماية البيانات اختيارية" }
        ],
        correct: 1
    },
    {
        question: "What does CERT (Computer Emergency Response Team) in UAE provide?",
        arabicQuestion: "ما الذي توفره فريق الاستجابة للطوارئ الحاسوبية (CERT) في الإمارات؟",
        answers: [
            { text: "Only antivirus software", arabic: "فقط برامج مكافحة الفيروسات" },
            { text: "Incident response and cybersecurity coordination", arabic: "الاستجابة للحوادث وتنسيق الأمن السيبراني" },
            { text: "IT hardware support only", arabic: "دعم الأجهزة فقط" },
            { text: "Website hosting services", arabic: "خدمات استضافة المواقع" }
        ],
        correct: 1
    },
    {
        question: "The UAE's 'Smart Dubai' initiative includes which cybersecurity component?",
        arabicQuestion: "ما هو مكون الأمن السيبراني في مبادرة 'دبي الذكية'؟",
        answers: [
            { text: "Dubai Electronic Security Center (DESC)", arabic: "مركز دبي للأمن الإلكتروني" },
            { text: "Dubai Police Cyber Unit", arabic: "وحدة السيبراني في شرطة دبي" },
            { text: "Dubai Internet City Security", arabic: "أمن مدينة دبي للإنترنت" },
            { text: "Dubai Mall Security Cameras", arabic: "كاميرات أمن دبي مول" }
        ],
        correct: 0
    },
    {
        question: "What is the UAE's stance on international cybersecurity cooperation?",
        arabicQuestion: "ما هو موقف الإمارات من التعاون الدولي في مجال الأمن السيبراني؟",
        answers: [
            { text: "Complete isolation from global cybersecurity efforts", arabic: "عزل تام عن الجهود العالمية للأمن السيبراني" },
            { text: "Active participation in global cybersecurity initiatives", arabic: "المشاركة النشطة في المبادرات العالمية للأمن السيبراني" },
            { text: "Only cooperation with neighboring countries", arabic: "التعاون فقط مع الدول المجاورة" },
            { text: "No international agreements signed", arabic: "لم يتم توقيع أي اتفاقات دولية" }
        ],
        correct: 1
    }
];

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const countdownScreen = document.getElementById('countdown-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const playerNameInput = document.getElementById('player-name');
const countdownDisplay = document.getElementById('countdown-display');
const questionText = document.getElementById('question-text');
const questionArabic = document.getElementById('question-arabic');
const answersContainer = document.getElementById('answers-container');
const timerText = document.getElementById('timer-text');
const timerFill = document.getElementById('timer-fill');
const currentQuestionSpan = document.getElementById('current-question');
const finalScore = document.getElementById('final-score');
const resultMessage = document.getElementById('result-message');
const leaderboardEntries = document.getElementById('leaderboard-entries');

// Start Game Function
function startGame() {
    playerName = playerNameInput.value.trim();
    
    if (!playerName) {
        playerNameInput.style.borderColor = '#ef4444';
        playerNameInput.placeholder = 'Please enter your name / الرجاء إدخال اسمك';
        return;
    }
    
    playerNameInput.style.borderColor = '#a855f7';
    showCountdown();
}

// Show Countdown Function
function showCountdown() {
    welcomeScreen.style.display = 'none';
    countdownScreen.style.display = 'block';
    
    let count = 3;
    countdownDisplay.textContent = count;
    countdownDisplay.className = 'countdown-number';
    
    const countdownInterval = setInterval(() => {
        count--;
        
        if (count > 0) {
            countdownDisplay.textContent = count;
            countdownDisplay.style.animation = 'none';
            countdownDisplay.offsetHeight; // Trigger reflow
            countdownDisplay.style.animation = 'pulse 1s ease-in-out';
        } else if (count === 0) {
            countdownDisplay.textContent = 'GO!';
            countdownDisplay.className = 'go-text';
        } else {
            clearInterval(countdownInterval);
            countdownScreen.style.display = 'none';
            quizScreen.style.display = 'block';
            currentQuestion = 0;
            score = 0;
            showQuestion();
        }
    }, 1000);
}

// Show Question Function
function showQuestion() {
    if (currentQuestion >= questions.length) {
        endGame();
        return;
    }
    
    const question = questions[currentQuestion];
    
    // Update question counter
    currentQuestionSpan.textContent = currentQuestion + 1;
    
    // Display question
    questionText.textContent = question.question;
    questionArabic.textContent = question.arabicQuestion;
    
    // Generate answers
    answersContainer.innerHTML = '';
    
    question.answers.forEach((answer, index) => {
        const answerCard = document.createElement('div');
        answerCard.className = 'answer-card';
        answerCard.style.animationDelay = `${index * 0.1}s`;
        
        answerCard.innerHTML = `
            <p class="answer-text">${answer.text}</p>
            <p class="answer-arabic">${answer.arabic}</p>
        `;
        
        answerCard.addEventListener('click', () => selectAnswer(index));
        answersContainer.appendChild(answerCard);
    });
    
    // Start timer
    startTimer();
}

// Timer Function
function startTimer() {
    timeLeft = 15;
    updateTimerDisplay();
    
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            timeUp();
        }
    }, 1000);
}

// Update Timer Display
function updateTimerDisplay() {
    timerText.textContent = timeLeft;
    const percentage = (timeLeft / 15) * 100;
    timerFill.style.width = percentage + '%';
    
    // Change color as time runs out
    if (timeLeft <= 5) {
        timerFill.style.background = 'linear-gradient(90deg, #ef4444, #dc2626)';
        timerText.style.color = '#ef4444';
    } else {
        timerFill.style.background = 'linear-gradient(90deg, #a855f7, #ec4899)';
        timerText.style.color = '#ec4899';
    }
}

// Time Up Function
function timeUp() {
    const answerCards = answersContainer.querySelectorAll('.answer-card');
    const correctAnswer = questions[currentQuestion].correct;
    
    // Show correct answer
    answerCards.forEach((card, index) => {
        card.classList.add('disabled');
        if (index === correctAnswer) {
            card.classList.add('correct');
        }
    });
    
    // Move to next question after delay
    setTimeout(() => {
        currentQuestion++;
        showQuestion();
    }, 2000);
}

// Select Answer Function
function selectAnswer(selectedIndex) {
    clearInterval(timer);
    
    const answerCards = answersContainer.querySelectorAll('.answer-card');
    const correctAnswer = questions[currentQuestion].correct;
    
    // Disable all cards
    answerCards.forEach(card => card.classList.add('disabled'));
    
    // Show correct/wrong
    if (selectedIndex === correctAnswer) {
        answerCards[selectedIndex].classList.add('correct');
        // Calculate score based on time remaining (max 1000 points)
        const points = Math.round((timeLeft / 15) * 1000);
        score += points;
    } else {
        answerCards[selectedIndex].classList.add('wrong');
        answerCards[correctAnswer].classList.add('correct');
    }
    
    // Move to next question after delay
    setTimeout(() => {
        currentQuestion++;
        showQuestion();
    }, 2000);
}

// End Game Function
function endGame() {
    quizScreen.style.display = 'none';
    resultScreen.style.display = 'block';
    
    // Display score
    finalScore.textContent = score;
    
    // Generate result message
    let message = '';
    if (score >= 12000) {
        message = "Excellent! You're a Cyber Security Expert! ";
    } else if (score >= 9000) {
        message = "Great job! You know your cyber security well! 👏";
    } else if (score >= 6000) {
        message = "Good effort! Keep learning! 💪";
    } else {
        message = "Keep practicing! Cyber security is important! ";
    }
    resultMessage.textContent = message;
    
    // Update leaderboard
    updateLeaderboard();
}

// Update Leaderboard Function
function updateLeaderboard() {
    // Add current player to leaderboard
    leaderboard.push({
        name: playerName,
        score: score,
        isCurrent: true
    });
    
    // Sort by score (highest first)
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Keep only top 10
    leaderboard = leaderboard.slice(0, 10);
    
    // Save to localStorage
    localStorage.setItem('cyberQuizLeaderboard', JSON.stringify(leaderboard));
    
    // Display leaderboard
    displayLeaderboard();
}

// Display Leaderboard Function
function displayLeaderboard() {
    leaderboardEntries.innerHTML = '';
    
    leaderboard.forEach((entry, index) => {
        const entryDiv = document.createElement('div');
        entryDiv.className = `leaderboard-entry ${entry.isCurrent ? 'current-player' : ''}`;
        
        // Add rank emoji
        let rankEmoji = '';
        if (index === 0) rankEmoji = '🥇 ';
        else if (index === 1) rankEmoji = '🥈 ';
        else if (index === 2) rankEmoji = '🥉 ';
        else rankEmoji = `${index + 1}. `;
        
        entryDiv.innerHTML = `
            <span class="player-name">${rankEmoji}${entry.name}</span>
            <span class="player-score">${entry.score}</span>
        `;
        
        leaderboardEntries.appendChild(entryDiv);
    });
}

// Load Leaderboard Function
function loadLeaderboard() {
    const saved = localStorage.getItem('cyberQuizLeaderboard');
    if (saved) {
        leaderboard = JSON.parse(saved);
    }
}

// Restart Game Function
function restartGame() {
    resultScreen.style.display = 'none';
    welcomeScreen.style.display = 'block';
    playerNameInput.value = '';
    playerNameInput.style.borderColor = '#a855f7';
    playerNameInput.placeholder = 'Enter your name / أدخل اسمك';
}

// Initialize
loadLeaderboard();
displayLeaderboard();

// Handle Enter key on name input
playerNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        startGame();
    }
});
