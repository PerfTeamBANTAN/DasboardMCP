const users = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "viewer", password: "viewer123", role: "viewer" }
];

document.getElementById("login-form")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const found = users.find(u => u.username === username && u.password === password);
  if (found) {
    localStorage.setItem("user", JSON.stringify(found));
    location.href = "data.html";
  } else {
    document.getElementById("login-error").textContent = "Username atau password salah!";
  }
});

function logout() {
  localStorage.removeItem("user");
  location.href = "index.html";
}
