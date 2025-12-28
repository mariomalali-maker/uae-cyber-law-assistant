<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cyber Safety & UAE Law Assistant – Chat</title>
  <style>
    :root {
      --bg: #020617;
      --card: #020617;
      --card-inner: #020617;
      --accent: #22c55e;
      --accent-soft: rgba(34, 197, 94, 0.12);
      --danger: #f97373;
      --border: #1f2937;
      --text-main: #e5e7eb;
      --text-muted: #9ca3af;
      --pill: #111827;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
        sans-serif;
      background: radial-gradient(circle at top, #020617 0, #020617 55%, #000 100%);
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* NAVBAR */

    nav {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 18px;
      background: #020617;
      border-bottom: 1px solid rgba(15, 23, 42, 0.9);
      position: sticky;
      top: 0;
      z-index: 20;
    }

    nav a {
      color: var(--text-main);
      text-decoration: none;
      font-size: 0.9rem;
      padding: 6px 10px;
      border-radius: 999px;
      background: transparent;
      border: 1px solid transparent;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    nav a:hover {
      background: #0b1120;
      border-color: #111827;
    }

    nav a.active {
      background: var(--accent);
      color: #022c22;
    }

    nav .spacer {
      flex: 1;
    }

    /* PAGE LAYOUT */

    main {
      flex: 1;
      display: flex;
      justify-content: center;
      padding: 24px 12px 18px;
    }

    .chat-shell {
      width: 100%;
      max-width: 900px;
      background: rgba(15, 23, 42, 0.9);
      border-radius: 24px;
      border: 1px solid rgba(31, 41, 55, 0.9);
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.75);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .chat-header {
      padding: 16px 20px 10px;
      border-bottom: 1px solid rgba(31, 41, 55, 0.9);
    }

    .chat-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 4px;
    }

    .chat-sub {
      font-size: 0.82rem;
      color: var(--text-muted);
      margin: 0;
    }

    .chips-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 8px 20px 10px;
      border-bottom: 1px solid rgba(31, 41, 55, 0.9);
    }

    .chip {
      padding: 4px 9px;
      border-radius: 999px;
      font-size: 0.75rem;
      background: #020617;
      color: var(--text-muted);
      border: 1px solid #111827;
    }

    .chip.green {
      border-color: #22c55e33;
      background: #022c22;
      color: #bbf7d0;
    }

    /* MESSAGES AREA */

    .chat-body {
      flex: 1;
      padding: 14px 20px;
      overflow-y: auto;
      background: radial-gradient(circle at top, #020617 0, #020617 50%, #000 100%);
    }

    .msg {
      max-width: 78%;
      padding: 9px 11px;
      border-radius: 16px;
      margin-bottom: 8px;
      font-size: 0.9rem;
      line-height: 1.4;
      word-wrap: break-word;
      white-space: pre-wrap;
    }

    .msg-ai {
      background: #020617;
      border: 1px solid #111827;
    }

    .msg-user {
      margin-left: auto;
      background: #22c55e;
      color: #022c22;
      border-radius: 16px 16px 4px 16px;
      font-weight: 500;
    }

    .system-note {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 10px;
    }

    /* INPUT AREA */

    .chat-footer {
      padding: 10px 14px 14px;
      border-top: 1px solid rgba(31, 41, 55, 0.9);
      background: #020617;
    }

    .input-row {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #020617;
      border-radius: 999px;
      padding: 4px 4px 4px 12px;
      border: 1px solid #111827;
    }

    #userInput {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      color: var(--text-main);
      font-size: 0.9rem;
      padding: 8px 4px;
    }

    #userInput::placeholder {
      color: #6b7280;
    }

    #sendBtn {
      border: none;
      outline: none;
      border-radius: 999px;
      padding: 8px 18px;
      background: var(--accent);
      color: #022c22;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
    }

    #sendBtn:disabled {
      opacity: 0.5;
      cursor: default;
    }

    .status-row {
      margin-top: 6px;
      font-size: 0.78rem;
      color: var(--text-muted);
      display: flex;
      justify-content: space-between;
      gap: 8px;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: #22c55e;
      display: inline-block;
      margin-right: 4px;
    }

    .error-text {
      color: #fca5a5;
    }

    @media (max-width: 640px) {
      main {
        padding: 10px 6px 12px;
      }
      .chat-shell {
        border-radius: 18px;
      }
      .chat-header {
        padding: 12px 14px 6px;
      }
      .chips-row {
        padding-inline: 14px;
      }
      .chat-body {
        padding-inline: 14px;
      }
      .chat-footer {
        padding-inline: 10px;
      }
    }
  </style>
</head>
<body>

  <!-- NAVBAR -->
  <nav>
    <a href="index.html">🏠 Home</a>
    <a href="chat.html" class="active">💬 Chat</a>
    <a href="history.html">🕒 History</a>
    <a href="quiz.html">🧠 Cyber Quiz</a>
    <a href="scam.html">⚠️ Scam Detector</a>
    <span class="spacer"></span>
  </nav>

  <main>
    <section class="chat-shell">
      <header class="chat-header">
        <h1 class="chat-title">Cyber Safety & UAE Law Assistant</h1>
        <p class="chat-sub">
          Ask about hacked accounts, blackmail, online threats, privacy, cyberbullying & more.
        </p>
      </header>

      <div class="chips-row">
        <div class="chip">Understands slang & typos</div>
        <div class="chip">UAE cyber safety context</div>
        <div class="chip green">AI powered</div>
      </div>

      <div id="chat-body" class="chat-body">
        <div class="msg msg-ai">
Hi meme! I’m your cyber safety assistant for the UAE.  
You can ask things like:
- “my snap got hacked wallah help”  
- “someone is threatening me with my photos, what are my options in the UAE?”  
- “how do I avoid scams on Instagram?”  

I’ll try to give clear steps and mention UAE cybercrime laws and official UAE websites when they fit.
        </div>
      </div>

      <footer class="chat-footer">
        <div class="input-row">
          <input
            id="userInput"
            type="text"
            autocomplete="off"
            placeholder="Example: my Snapchat got hacked, what should I do?"
          />
          <button id="sendBtn">Send</button>
        </div>
        <div class="status-row">
          <div><span class="dot"></span><span id="statusText">Online</span></div>
          <div id="errorText" class="error-text"></div>
        </div>
        <p class="system-note">
          This assistant gives general information only, not official legal advice.
        </p>
      </footer>
    </section>
  </main>

  <script>
    const API_URL = "/api/chat"; // Vercel serverless function on same domain

    const chatBody = document.getElementById("chat-body");
    const inputEl = document.getElementById("userInput");
    const sendBtn = document.getElementById("sendBtn");
    const statusText = document.getElementById("statusText");
    const errorText = document.getElementById("errorText");

    function addMessage(text, who = "ai") {
      const div = document.createElement("div");
      div.className = "msg " + (who === "user" ? "msg-user" : "msg-ai");
      div.textContent = text;
      chatBody.appendChild(div);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    async function sendMessage() {
      const message = (inputEl.value || "").trim();
      if (!message) return;

      // show user message
      addMessage(message, "user");
      inputEl.value = "";
      errorText.textContent = "";
      statusText.textContent = "Thinking…";
      sendBtn.disabled = true;

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            username: "meme",
            gender: "female",
            mode: "chat"
          })
        });

        let data = null;
        try {
          data = await res.json();
        } catch (e) {
          console.error("JSON parse error:", e);
        }

        if (!res.ok) {
          console.error("API error:", res.status, data);
          const msg =
            (data && data.error) ||
            `Server error (${res.status}). Check API key / Vercel logs.`;
          addMessage("⚠️ " + msg, "ai");
          errorText.textContent = msg;
        } else {
          const answer = data && data.answer ? data.answer : "No answer from AI.";
          addMessage(answer, "ai");
        }
      } catch (err) {
        console.error("Network error:", err);
        const msg = "Network error talking to the server.";
        addMessage("⚠️ " + msg, "ai");
        errorText.textContent = msg;
      } finally {
        statusText.textContent = "Online";
        sendBtn.disabled = false;
      }
    }

    sendBtn.addEventListener("click", sendMessage);
    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendMessage();
    });
  </script>
</body>
</html>
