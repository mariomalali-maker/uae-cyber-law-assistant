// scripts/chat.js

// ELEMENTS
const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");
const messagesBox = document.getElementById("messages");
const statusLabel = document.getElementById("status-label");
const typingHint = document.getElementById("typing-hint");
const newChatBtn = document.getElementById("new-chat-btn");
const clearChatBtn = document.getElementById("clear-chat-btn");
const speakBtn = document.getElementById("speak-btn");
const micBtn = document.getElementById("mic-btn");
const deleteAllBtn = document.getElementById("delete-all-history-btn"); // ← زر جديد لمسح كل شيء

// USER INFO
const userName = localStorage.getItem("cyber_user_name") || "User";
const userGender = localStorage.getItem("cyber_user_gender") || "other";

let lastAiText = "";
let currentConversation = [];

// SPEECH OUTPUT 🔊
function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = /[ء-ي]/.test(text) ? "ar-AE" : "en-US";  // Arabic detection
  utter.rate = 1;
  utter.pitch = 1;
  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}

// ADD MESSAGE
function addBubble(text, type) {
  const div = document.createElement("div");
  div.className = type === "user" ? "msg user-msg" : "msg ai-msg";
  div.textContent = text;

  if (type === "ai") {
    // READ BUTTON
    const readBtn = document.createElement("button");
    readBtn.textContent = "🔊 Listen";
    readBtn.className = "read-btn";
    readBtn.onclick = () => speak(text);

    div.appendChild(document.createElement("br"));
    div.appendChild(readBtn);

    lastAiText = text;
  }

  messagesBox.appendChild(div);
  messagesBox.scrollTop = messagesBox.scrollHeight;

  currentConversation.push({ role: type, content: text, time: Date.now() });
}

// SAVE HISTORY
function saveConversationToHistory() {
  if (!currentConversation.length) return;
  const history = JSON.parse(localStorage.getItem("cyber_history") || "[]");
  history.push({ time: Date.now(), messages: currentConversation });
  localStorage.setItem("cyber_history", JSON.stringify(history));
}

// GREETING
function greetUser() {
  const relation =
    userGender === "female" ? "أختي 🌸" :
    userGender === "male"   ? "أخوي 🤝" :
                              "صاحبي 🤍";

  const text = `مرحباً ${userName} ${relation}✨
أنا مساعدك للأمن السيبراني في الإمارات 🇦🇪  
اكتب مشكلتك أو سؤالك:

🟢 أمثلة:
- تهكر السناب شات، شو أسوي؟
- حد يهددني بصوري، وين أشتكي؟
- كيف أحمي حسابي من الاختراق؟

⚠️ المعلومات عامة وليست استشارة قانونية رسمية.
🎯 سأحاول إعطائك خطوات + قوانين إماراتية + روابط رسمية.`;

  addBubble(text, "ai");
}

greetUser();

// SEND MESSAGE
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  addBubble(text, "user");
  input.value = "";
  typingHint.style.display = "block";
  statusLabel.textContent = "Thinking...";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        username: userName,
        gender: userGender
      })
    });

    const data = await response.json();
    typingHint.style.display = "none";

    if (data.answer) addBubble(data.answer, "ai");
    else addBubble("⚠️ Error: " + data.error, "ai");

    statusLabel.textContent = "Online";
  } catch {
    typingHint.style.display = "none";
    addBubble("⚠️ Network error", "ai");
  }
});

// NEW CHAT
newChatBtn.onclick = () => {
  if (currentConversation.length) saveConversationToHistory();
  currentConversation = [];
  messagesBox.innerHTML = "";
  greetUser();
};

// CLEAR CURRENT CHAT
clearChatBtn.onclick = () => {
  if (!confirm("Clear chat without saving?")) return;
  currentConversation = [];
  messagesBox.innerHTML = "";
  greetUser();
};

// DELETE ALL HISTORY 🗑️
deleteAllBtn.onclick = () => {
  if (!confirm("⚠️ Delete all chat history? Not reversible!")) return;
  localStorage.removeItem("cyber_history");
  alert("History deleted successfully ✨");
};

// READ LAST ANSWER
speakBtn.onclick = () => {
  if (!lastAiText) return alert("No AI reply to read yet!");
  speak(lastAiText);
};

// MIC SPEECH TO TEXT
micBtn.onclick = () => {
  const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Rec) return alert("🎙 Browser not supported for voice input");

  const rec = new Rec();
  rec.lang = /[ء-ي]/.test(input.placeholder) ? "ar-AE" : "en-US";
  rec.onresult = e => input.value = e.results[0][0].transcript;
  rec.start();
};
