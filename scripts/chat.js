
const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");
const messagesBox = document.getElementById("messages");
const statusLabel = document.getElementById("status-label");
const micBtn = document.getElementById("mic-btn");
const deleteAllBtn = document.getElementById("delete-all-history-btn");
const clearChatBtn = document.getElementById("clear-chat-btn") || document.getElementById("clear-chat");
const langEnBtn = document.getElementById("lang-en");
const langArBtn = document.getElementById("lang-ar");


const typingHint = document.getElementById("typing-hint");
const newChatBtn = document.getElementById("new-chat-btn");
const speakBtn = document.getElementById("speak-btn");


const userName = localStorage.getItem("cyber_user_name") || "User";
const userGender = localStorage.getItem("cyber_user_gender") || "other";
const LANGUAGE_KEY = "cyber_lang";
let currentLang = localStorage.getItem(LANGUAGE_KEY) || "en";

let lastAiText = "";
let currentConversation = [];


function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = /[ء-ي]/.test(text) ? "ar-AE" : "en-US";
  utter.rate = 1;
  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}


function addBubble(text, type) {
  const div = document.createElement("div");
  div.className = type === "user" ? "msg user-msg" : "msg ai-msg";
  div.textContent = text;

  if (type === "ai") {
    lastAiText = text;
    const readBtn = document.createElement("button");
    readBtn.textContent = "🔊 Listen";
    readBtn.style = "margin-top:5px;background:#22c55e;color:black;padding:6px;border-radius:6px;cursor:pointer;";
    readBtn.onclick = () => speak(text);
    div.appendChild(document.createElement("br"));
    div.appendChild(readBtn);
  }

  messagesBox.appendChild(div);
  messagesBox.scrollTop = messagesBox.scrollHeight;
  currentConversation.push({ role: type, content: text, time: Date.now() });
}


function greetUser() {
  const relation =
    userGender === "female" ? "أختي " :
    userGender === "male"   ? "أخوي "  : "صاحبي ";

  const arabic = `مرحباً ${userName} ${relation}✨
اكتب مشكلتك أو سؤالك:
- تهكر حسابي شو أسوي؟
- حد يهددني بصوري وين أشتكي؟
- كيف أحمي حساباتي من الاختراق؟
⚠️ معلومات عامة وليست استشارة قانونية رسمية.`;

  const english = `Hey ${userName}! ✨
Tell me your problem or question:
- my snap got hacked wallah help
- someone threatening me with pics
- how to protect instagram
⚠️ Not legal advice, general guidance.`;

  addBubble(currentLang === "ar" ? arabic : english, "ai");
}

window.addEventListener("load", () => {
  const history = localStorage.getItem("cyber_history");
  if (!history) greetUser();
});


if (langEnBtn) langEnBtn.onclick = () => {
  currentLang = "en";
  localStorage.setItem(LANGUAGE_KEY, "en");
  location.reload();
};
if (langArBtn) langArBtn.onclick = () => {
  currentLang = "ar";
  localStorage.setItem(LANGUAGE_KEY, "ar");
  location.reload();
};


form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addBubble(text, "user");
  input.value = "";
  statusLabel.textContent = "Thinking...";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, username: userName, language: currentLang })
    });

    const data = await res.json();
    if (data.answer) addBubble(data.answer, "ai");
    else addBubble("⚠️ AI error, try again.", "ai");

  } catch {
    addBubble("⚠️ Network Error", "ai");
  }

  statusLabel.textContent = "Online";
});


if (clearChatBtn) {
  clearChatBtn.onclick = () => {
    if (!confirm("Clear chat?")) return;
    currentConversation = [];
    messagesBox.innerHTML = "";
    greetUser();
  };
}


if (deleteAllBtn) {
  deleteAllBtn.onclick = () => {
    if (!confirm("Delete ALL saved chats?")) return;
    localStorage.removeItem("cyber_history");
    alert("History deleted.");
  };
}


micBtn.onclick = () => {
  const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Rec) return alert("🎙 Voice not supported here");

  const rec = new Rec();
  rec.lang = currentLang === "ar" ? "ar-AE" : "en-US";
  rec.onresult = (e) => input.value = e.results[0][0].transcript;
  rec.start();
};
