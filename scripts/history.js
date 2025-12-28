function renderHistory() {
  const listEl = document.getElementById("historyList");
  const key = "cyberChatHistory";
  const raw = localStorage.getItem(key);

  if (!raw) {
    listEl.innerHTML = "<p style='color:#9ca3af;'>No history yet. Ask something in the chat first.</p>";
    return;
  }

  const items = JSON.parse(raw);
  if (!items.length) {
    listEl.innerHTML = "<p style='color:#9ca3af;'>No history yet. Ask something in the chat first.</p>";
    return;
  }

  listEl.innerHTML = "";
  items
    .slice()
    .reverse()
    .forEach((item, i) => {
      const div = document.createElement("div");
      div.className = "history-item";
      const time = new Date(item.time).toLocaleString();
      div.innerHTML = `
        <div style="font-size:0.8rem; color:#9ca3af; margin-bottom:4px;">
          #${items.length - i} • ${item.name || "User"} • ${time}
        </div>
        <div><strong>Q:</strong> ${item.question}</div>
        <div style="margin-top:4px;"><strong>A:</strong> ${item.answer}</div>
      `;
      listEl.appendChild(div);
    });
}

document.getElementById("clearBtn").addEventListener("click", () => {
  if (confirm("Clear all stored chat history on this device?")) {
    localStorage.removeItem("cyberChatHistory");
    renderHistory();
  }
});

window.onload = renderHistory;
