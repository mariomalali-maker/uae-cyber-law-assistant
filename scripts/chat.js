const user = localStorage.getItem("cyber_user") || "Guest";

async function sendMessage(){
  const msg = document.getElementById("message").value;
  if(!msg.trim()) return;

  const box = document.getElementById("chat-box");
  box.innerHTML += `<div class="user-msg">${user}: ${msg}</div>`;
  document.getElementById("message").value = "";

  box.innerHTML += `<div class="loading">typing...</div>`;

  const res = await fetch("/api/chat", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ message: msg, username: user })
  });

  const data = await res.json();
  document.querySelector(".loading").remove();
  box.innerHTML += `<div class="ai-msg">${data.answer}</div>`;

  localStorage.setItem(Date.now(), msg + " → " + data.answer);
}
