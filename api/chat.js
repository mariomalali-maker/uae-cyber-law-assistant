<script>
const API_URL = "https://uae-cyber-law-assistant-jirm32ss7-mariams-projects-6c30daf9.vercel.app/api/chat"; 

document.getElementById("sendBtn").addEventListener("click", async () => {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        username: "User",
        gender: "other",
        mode: "chat"
      }),
    });

    if (!res.ok) {
      throw new Error("Server Error");
    }

    const data = await res.json();
    displayMessage(data.answer);
  } catch (err) {
    displayMessage("⚠️ Network error, please try again.");
  }

  input.value = "";
});

function displayMessage(text) {
  const container = document.getElementById("chatMessages");
  const msg = document.createElement("div");
  msg.className = "msg-ai";
  msg.textContent = text;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}
</script>

