
const SHEET_API_URL = "https://script.google.com/macros/s/https://script.google.com/macros/s/AKfycbwrybL4k1v7f5iaUzhgE7uyrYyI6WOLZSXYrvVnqum6PDVIQHYwhA6q4WsIfvgwYUqL/exec";
const user = JSON.parse(localStorage.getItem("user"));
if (!user) location.href = "index.html";

document.getElementById("info").textContent = `Login sebagai: ${user.username} (${user.role})`;

fetch(SHEET_API_URL)
  .then(res => res.json())
  .then(data => buildTable(data))
  .catch(err => alert("Gagal mengambil data dari spreadsheet"));

function buildTable(data) {
  const table = document.getElementById("data-table");
  table.innerHTML = "";

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  data[0].forEach(title => {
    const th = document.createElement("th");
    th.textContent = title;
    headerRow.appendChild(th);
  });
  if (user.role === 'admin') {
    const th = document.createElement("th");
    th.textContent = "Aksi";
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  for (let i = 1; i < data.length; i++) {
    const row = document.createElement("tr");
    row.dataset.id = data[i][3];

    data[i].forEach((cell, j) => {
      const td = document.createElement("td");
      td.contentEditable = user.role === 'admin' && j >= 4;
      td.textContent = cell;
      row.appendChild(td);
    });

    if (user.role === 'admin') {
      const tdAction = document.createElement("td");
      const saveBtn = document.createElement("button");
      saveBtn.textContent = "Simpan";
      saveBtn.className = "save-btn";
      saveBtn.onclick = () => saveRow(row);
      tdAction.appendChild(saveBtn);
      row.appendChild(tdAction);
    }

    tbody.appendChild(row);
  }
  table.appendChild(tbody);
}

function saveRow(row) {
  const idUnik = row.dataset.id;
  const cells = row.querySelectorAll("td");
  const values = Array.from(cells).map(td => td.textContent);

  fetch(SHEET_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idUnik: idUnik, row: values })
  })
    .then(res => res.text())
    .then(txt => alert("✅ Data berhasil disimpan!"))
    .catch(err => alert("❌ Gagal menyimpan data."));
}
