const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");
const messagesBox = document.getElementById("messages");
const statusLabel = document.getElementById("status-label");
const micBtn = document.getElementById("mic-btn");
const deleteAllBtn = document.getElementById("delete-all-history-btn");
const clearChatBtn = document.getElementById("clear-chat");

// OPTIONAL BUTTONS (may not exist in HTML)
const typingHint = document.getElementById("typing-hint");
const newChatBtn = document.getElementById("new-chat-btn");
const speakBtn = document.getElementById("speak-btn");

const userName = localStorage.getItem("cyber_user_name") || "User";
const userGender = localStorage.getItem("cyber_user_gender") || "other";

let lastAiText = "";
let currentConversation = [];

// SPEAK FUNCTION
function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = /[ء-ي]/.test(text) ? "ar-AE" : "en-US";
  utter.rate = 1;
  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}

// ADD MESSAGE BUBBLE
function addBubble(text, type) {
  const div = document.createElement("div");
  div.className = type === "user" ? "msg user-msg" : "msg ai-msg";
  div.textContent = text;

  if (type === "ai") {
    lastAiText = text;
    const readBtn = document.createElement("button");
    readBtn.textContent = "🔊 Listen";
    readBtn.className = "read-btn";
    readBtn.onclick = () => speak(text);
    div.appendChild(document.createElement("br"));
    div.appendChild(readBtn);
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
    userGender === "male" ? "أخوي 🤝" : "صاحبي 🤍";

  const arabic = `مرحباً ${userName} ${relation}✨
اكتب مشكلتك أو سؤالك:

- تهكر حسابي شو أسوي؟
- حد يهددني بصوري وين أشتكي؟
- كيف أحمي حساباتي من الاختراق؟

⚠️ معلومات عامة وليست استشارة قانونية رسمية`;

  const english = `Hey ${userName}! ✨
Tell me your problem or question:

- my snap got hacked wallah help
- someone threatening me with pics
- how to protect my insta from hacker

⚠️ Not legal advice, general guidance`;

  addBubble(/[ء-ي]/.test(document.body.innerText) ? arabic : english, "ai");
}

greetUser();

// CHAT
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  addBubble(text, "user");
  input.value = "";

  if (typingHint) typingHint.style.display = "block";
  statusLabel.textContent = "Thinking...";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, username: userName })
    });

    const data = await res.json();
    if (typingHint) typingHint.style.display = "none";

    if (data.answer) addBubble(data.answer, "ai");
    else addBubble("⚠️ Error", "ai");

    statusLabel.textContent = "Online";
  } catch {
    if (typingHint) typingHint.style.display = "none";
    addBubble("⚠️ Network Error", "ai");
  }
});

// CLEAR CHAT ✔ FIXED
if (clearChatBtn) {
  clearChatBtn.onclick = () => {
    if (!confirm("Clear chat?")) return;
    messagesBox.innerHTML = "";
    currentConversation = [];
    greetUser();
  };
}

// DELETE ALL HISTORY
if (deleteAllBtn) {
  deleteAllBtn.onclick = () => {
    if (!confirm("Delete all history?")) return;
    localStorage.removeItem("cyber_history");
    alert("History deleted");
  };
}

// NEW CHAT (only if exists)
if (newChatBtn) {
  newChatBtn.onclick = () => {
    saveConversationToHistory();
    currentConversation = [];
    messagesBox.innerHTML = "";
    greetUser();
  };
}

// SPEAK LAST AI
if (speakBtn) {
  speakBtn.onclick = () => {
    if (!lastAiText) return;
    speak(lastAiText);
  };
}

// MIC SPEECH INPUT
micBtn.onclick = () => {
  const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Rec) return alert("🎙 Not supported here");

  const rec = new Rec();
  rec.lang = /[ء-ي]/.test(input.placeholder) ? "ar-AE" : "en-US";
  rec.onresult = (e) => input.value = e.results[0][0].transcript;
  rec.start();
};

