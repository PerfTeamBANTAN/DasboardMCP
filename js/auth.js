
const USERS = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "viewer", password: "viewer123", role: "viewer" }
];

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();
      const user = USERS.find(
        (u) => u.username === username && u.password === password
      );
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "dashboard.html";
      } else {
        document.getElementById("login-error").textContent = "Login gagal";
      }
    });
  }
});

function logout() {
  localStorage.removeItem("user");
  location.href = "index.html";
}
