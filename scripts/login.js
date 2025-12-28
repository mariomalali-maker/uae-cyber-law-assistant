function loginUser(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  localStorage.setItem("cyber_user", email);

  window.location.href = "chat.html";
}

function skipLogin(){
  localStorage.setItem("cyber_user", "Guest");
  window.location.href = "chat.html";
}
