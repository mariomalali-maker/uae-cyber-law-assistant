// scripts/scam.js

const textArea = document.getElementById("scam-text");
const checkBtn = document.getElementById("check-scam-btn");
const resultBox = document.getElementById("scam-result");

checkBtn.addEventListener("click", async () => {
  const text = textArea.value.trim();
  if (!text) {
    alert("Paste the message you want me to analyze.");
    return;
  }

  resultBox.textContent = "Thinking…";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        mode: "scam"
      })
    });

    const data = await res.json();
    if (data.answer) {
      resultBox.textContent = data.answer;
    } else if (data.error) {
      resultBox.textContent = "⚠️ AI error: " + data.error;
    } else {
      resultBox.textContent = "⚠️ Unexpected AI response.";
    }
  } catch (err) {
    console.error(err);
    resultBox.textContent = "⚠️ Network error, please try again.";
  }
});
