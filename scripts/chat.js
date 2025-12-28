// scripts/chat.js

const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");
const messagesBox = document.getElementById("messages");
const statusLabel = document.getElementById("status-label");
const newChatBtn = document.getElementById("newChatBtn");
const clearChatBtn = document.getElementById("clearChatBtn");
const introEl = document.getElementById("chat-intro");

const userName = localStorage.getItem("cyber_user_name") || "User";
const userGender = localStorage.getItem("cyber_user_gender") || "unspecified";

// Simple intro using stored name
if (introEl) {
  introEl.textContent =
    `Hi ${userName}! I’m your cyber safety assistant. ` +
    `Ask anything about hacking, online threats, privacy, social media issues and UAE cyber laws. ` +
    `I’ll give clear steps and mention UAE law context when possible. This is general information only, not official legal advice.`;
}

// detect if text contains Arabic characters
function isArabic(text) {
  return /[\u0600-\u06FF]/.test(text);
}

// Add bubble
function addBubble(text, type) {
  const wrap = document.createElement("div");
  wrap.className = type === "user" ? "msg user-msg" : "msg ai-msg";

  const p = document.createElement("p");
  p.textContent = text;
  wrap.appendChild(p);

  // voice button for AI messages
  if (type === "ai") {
    const btn = document.createElement("button");
    btn.className = "speak-btn";
    btn.textContent = "🔊 Listen";
    btn.addEventListener("click", () => {
      try {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = isArabic(text) ? "ar-AE" : "en-US";
        u.rate = 1.05;
        speechSynthesis.cancel();
        speechSynthesis.speak(u);
      } catch (e) {
        console.error("Speech error", e);
      }
    });
    wrap.appendChild(btn);
  }

  messagesBox.appendChild(wrap);
  messagesBox.scrollTop = messagesBox.scrollHeight;
}

// Save current chat to localStorage for history page if you need it
function saveCurrentChat() {
  const items = Array.from(messagesBox.querySelectorAll(".msg")).map(div => ({
    type: div.classList.contains("user-msg") ? "user" : "ai",
    text: div.querySelector("p") ? div.querySelector("p").textContent : div.textContent
  }));
  localStorage.setItem("cyber_chat_current", JSON.stringify(items));
}

// Load chat on open
function loadCurrentChat() {
  const raw = localStorage.getItem("cyber_chat_current");
  if (!raw) return;
  try {
    const arr = JSON.parse(raw);
    arr.forEach(m => addBubble(m.text, m.type));
  } catch (e) {
    console.warn("Could not load previous chat", e);
  }
}

// Submit handler
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  addBubble(text, "user");
  input.value = "";
  statusLabel.textContent = "Thinking…";

  const lang = isArabic(text) ? "ar" : "en";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        username: userName,
        gender: userGender,
        lang
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
      addBubble("⚠️ Unexpected response from AI.", "ai");
      statusLabel.textContent = "Error";
    }
  } catch (err) {
    console.error(err);
    addBubble("⚠️ Network error, please try again.", "ai");
    statusLabel.textContent = "Error";
  }

  saveCurrentChat();
});

// New chat
newChatBtn.addEventListener("click", () => {
  speechSynthesis.cancel();
  messagesBox.innerHTML = "";
  statusLabel.textContent = "New chat started";
  localStorage.removeItem("cyber_chat_current");
});

// Clear chat (delete)
clearChatBtn.addEventListener("click", () => {
  const ok = confirm("Delete all messages in this chat?");
  if (!ok) return;
  speechSynthesis.cancel();
  messagesBox.innerHTML = "";
  statusLabel.textContent = "Chat cleared";
  localStorage.removeItem("cyber_chat_current");
});

// Init
loadCurrentChat();
statusLabel.textContent = "Online";
