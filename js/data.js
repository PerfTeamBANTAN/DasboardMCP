const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbwrybL4k1v7f5iaUzhgE7uyrYyI6WOLZSXYrvVnqum6PDVIQHYwhA6q4WsIfvgwYUqL/exec";
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

  const headers = Object.keys(data[0]); // Ambil nama kolom dari object
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  headers.forEach(title => {
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
  data.forEach(rowObj => {
    const row = document.createElement("tr");
    row.dataset.id = rowObj["id_unik"]; // ID unik disimpan di atribut row

    headers.forEach((key, j) => {
  const td = document.createElement("td");
  const cell = rowObj[key];
  const isMediaColumn = j >= 14 && j <= 20;

  if (isMediaColumn && cell && cell.length > 10) {
    if (j <= 18) {
      // Tampilkan gambar
      const img = document.createElement("img");
      img.src = `https://drive.google.com/uc?export=view&id=${cell}`;
      img.style.maxWidth = "100px";
      img.style.borderRadius = "8px";
      img.style.margin = "4px 0";
      td.appendChild(img);
    } else {
      // Tampilkan video dengan iframe
      const iframe = document.createElement("iframe");
      iframe.src = `https://drive.google.com/file/d/${cell}/preview`;
      iframe.width = "200";
      iframe.height = "120";
      iframe.allowFullscreen = true;
      iframe.style.border = "none";
      td.appendChild(iframe);
    }
  } else {
    td.textContent = cell;
    td.contentEditable = user.role === 'admin' && !isMediaColumn;
  }

  row.appendChild(td);
});

    if (user.role === 'admin') {
      const tdAction = document.createElement("td");
      const saveBtn = document.createElement("button");
      saveBtn.textContent = "Simpan";
      saveBtn.className = "save-btn";
      saveBtn.onclick = () => saveRow(row, headers);
      tdAction.appendChild(saveBtn);
      row.appendChild(tdAction);
    }

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
}


function saveRow(row, headers) {
  const idUnik = row.dataset.id;
  const cells = row.querySelectorAll("td");

  const rowData = {};
  headers.forEach((key, index) => {
    const td = cells[index];
    rowData[key] = td.textContent;
  });

  fetch(SHEET_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idUnik: idUnik, row: rowData })
  })
    .then(res => res.text())
    .then(txt => alert("✅ Data berhasil disimpan!"))
    .catch(err => alert("❌ Gagal menyimpan data."));
}
