// scripts/chat.js

const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");
const messagesBox = document.getElementById("messages");
const statusLabel = document.getElementById("status-label");
const typingHint = document.getElementById("typing-hint");
const newChatBtn = document.getElementById("new-chat-btn");
const clearChatBtn = document.getElementById("clear-chat-btn");
const speakBtn = document.getElementById("speak-btn");
const micBtn = document.getElementById("mic-btn");

const userName = localStorage.getItem("cyber_user_name") || "User";
const userGender = localStorage.getItem("cyber_user_gender") || "other";

let lastAiText = "";
let currentConversation = [];

// Helpers
function addBubble(text, type) {
  const div = document.createElement("div");
  div.className = type === "user" ? "msg user-msg" : "msg ai-msg";
  div.textContent = text;

  if (type === "ai") {
    const readSpan = document.createElement("span");
    readSpan.textContent = "  🔊 Read";
    readSpan.className = "read-btn";
    readSpan.addEventListener("click", () => speak(text));
    div.appendChild(document.createElement("br"));
    div.appendChild(readSpan);
    lastAiText = text;
  }

  messagesBox.appendChild(div);
  messagesBox.scrollTop = messagesBox.scrollHeight;

  currentConversation.push({ role: type, content: text, time: Date.now() });
}

function speak(text) {
  if (!window.speechSynthesis) {
    alert("Speech not supported on this browser.");
    return;
  }
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = /[ء-ي]/.test(text) ? "ar-SA" : "en-US";
  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}

function saveConversationToHistory() {
  if (!currentConversation.length) return;
  const history = JSON.parse(localStorage.getItem("cyber_history") || "[]");
  history.push({ time: Date.now(), messages: currentConversation });
  localStorage.setItem("cyber_history", JSON.stringify(history));
}

// Greeting on load
function greetUser() {
  const genderWord =
    userGender === "female" ? "sister" :
    userGender === "male"   ? "brother" :
                              "friend";

  const text = `Hi ${userName}! I’m your cyber safety assistant. You can ask things like:
- "My Snapchat was hacked, what should I do?"
- "Someone is threatening me with my photos, what are my options in the UAE?"
- "How can I protect my data and avoid scams?"

I’ll give clear steps, mention UAE cybercrime laws when they apply, and add references to official UAE sources when possible. This is general information only, not official legal advice.`;

  addBubble(text, "ai");
}

greetUser();

// Chat submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  addBubble(text, "user");
  input.value = "";
  typingHint.style.display = "block";
  statusLabel.textContent = "Thinking…";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        username: userName,
        gender: userGender,
        mode: "chat"
      })
    });

    const data = await res.json();

    if (data.answer) {
      addBubble(data.answer, "ai");
      statusLabel.textContent = "Online";
    } else if (data.error) {
      addBubble("⚠️ AI error: " + data.error, "ai");
      statusLabel.textContent = "Error";
    } else {
      addBubble("⚠️ Unexpected AI response.", "ai");
      statusLabel.textContent = "Error";
    }
  } catch (err) {
    console.error(err);
    addBubble("⚠️ Network error, please try again.", "ai");
    statusLabel.textContent = "Error";
  } finally {
    typingHint.style.display = "none";
  }
});

// New chat: save old, clear current
newChatBtn.addEventListener("click", () => {
  if (currentConversation.length) saveConversationToHistory();
  currentConversation = [];
  messagesBox.innerHTML = "";
  greetUser();
});

// Clear chat: no saving
clearChatBtn.addEventListener("click", () => {
  if (confirm("Clear this conversation? It will not be saved to history.")) {
    currentConversation = [];
    messagesBox.innerHTML = "";
    greetUser();
  }
});

// Speak last answer
speakBtn.addEventListener("click", () => {
  if (!lastAiText) {
    alert("No answer yet to read.");
    return;
  }
  speak(lastAiText);
});

// Simple speech-to-text for input (optional)
micBtn.addEventListener("click", () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Voice input not supported in this browser.");
    return;
  }
  const rec = new SpeechRecognition();
  rec.lang = "en-US";
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  rec.onresult = (ev) => {
    const text = ev.results[0][0].transcript;
    input.value = text;
  };
  rec.start();
});
