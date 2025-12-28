// scripts/chat.js

const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");
const messagesBox = document.getElementById("messages");
const statusLabel = document.getElementById("status-label");
const newChatBtn = document.getElementById("newChatBtn");
const clearChatBtn = document.getElementById("clearChatBtn");

const userName = localStorage.getItem("cyber_user_name") || "User";
const userGender = localStorage.getItem("cyber_user_gender") || "unspecified";
const langToggle = document.querySelector("[data-lang-toggle]"); // if you have EN/AR toggle

// helper: detect if text is mostly Arabic
function isArabic(text) {
  return /[\u0600-\u06FF]/.test(text);
}

// Add a bubble to the chat (user or AI)
function addBubble(text, type) {
  const wrap = document.createElement("div");
  wrap.className = type === "user" ? "msg user-msg" : "msg ai-msg";

  const p = document.createElement("p");
  p.textContent = text;
  wrap.appendChild(p);

  if (type === "ai") {
    // voice button
    const btn = document.createElement("button");
    btn.className = "speak-btn";
    btn.textContent = "🔊 Listen";
    btn.addEventListener("click", () => {
      try {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = isArabic(text) ? "ar-AE" : "en-US";
        u.rate = 1.05;
        speechSynthesis.cancel(); // stop any previous
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

// Save last conversation in case you want to use it later (history page)
function saveCurrentChat() {
  const items = Array.from(messagesBox.querySelectorAll(".msg")).map(div => ({
    type: div.classList.contains("user-msg") ? "user" : "ai",
    text: div.querySelector("p") ? div.querySelector("p").textContent : div.textContent
  }));
  localStorage.setItem("cyber_chat_current", JSON.stringify(items));
}

// Load last chat on page load (optional)
function loadCurrentChat() {
  const raw = localStorage.getItem("cyber_chat_current");
  if (!raw) return;
  try {
    const arr = JSON.parse(raw);
    arr.forEach(m => addBubble(m.text, m.type));
  } catch (e) {
    console.warn("Could not load old chat", e);
  }
}

// Handle the chat form
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  const lang = langToggle?.dataset?.lang || (isArabic(text) ? "ar" : "en");

  addBubble(text, "user");
  input.value = "";
  statusLabel.textContent = "Thinking…";

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

// New chat = clear messages but keep username & gender
if (newChatBtn) {
  newChatBtn.addEventListener("click", () => {
    speechSynthesis.cancel();
    messagesBox.innerHTML = "";
    statusLabel.textContent = "New chat started";
    localStorage.removeItem("cyber_chat_current");
  });
}

// Clear chat (same as delete)
if (clearChatBtn) {
  clearChatBtn.addEventListener("click", () => {
    const ok = confirm("Delete all messages in this chat?");
    if (!ok) return;
    speechSynthesis.cancel();
    messagesBox.innerHTML = "";
    localStorage.removeItem("cyber_chat_current");
    statusLabel.textContent = "Chat cleared";
  });
}

// load previous conversation when page opens
loadCurrentChat();
statusLabel.textContent = "Online";
