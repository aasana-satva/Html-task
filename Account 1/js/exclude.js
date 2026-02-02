const token = localStorage.getItem("jwtToken");
if (!token) window.location.href = "login.html";

/* ================= DOM ================= */
const excludeContainer = document.getElementById("excludeContainer");
const includeBtn = document.getElementById("includeBtn");

/* ================= LOAD EXCLUDED ================= */
let excluded =
  JSON.parse(localStorage.getItem("excludedTransactions")) || [];

render();

/* ================= RENDER ================= */
function render() {
  excludeContainer.innerHTML = "";

  if (!excluded.length) {
    excludeContainer.innerHTML =
      "<p class='text-muted'>No excluded transactions</p>";
    includeBtn.disabled = true;
    return;
  }

  const company1 = excluded.filter(tx => tx.company === "Company1");
  const company2 = excluded.filter(tx => tx.company === "Company2");

  const row = document.createElement("div");
  row.className = "row";

  /* ===== LEFT: COMPANY 1 ===== */
  const leftCol = document.createElement("div");
  leftCol.className = "col-md-6";
  leftCol.innerHTML = `
    <h5 class="d-flex align-items-center gap-2">
      <input type="checkbox" class="select-all" data-company="Company1">
      Company 1
    </h5>
  `;

  company1.forEach(tx => {
    leftCol.appendChild(createCard(tx));
  });

  /* ===== RIGHT: COMPANY 2 ===== */
  const rightCol = document.createElement("div");
  rightCol.className = "col-md-6";
  rightCol.innerHTML = `
    <h5 class="d-flex align-items-center gap-2">
      <input type="checkbox" class="select-all" data-company="Company2">
      Company 2
    </h5>
  `;

  company2.forEach(tx => {
    rightCol.appendChild(createCard(tx));
  });

  row.appendChild(leftCol);
  row.appendChild(rightCol);
  excludeContainer.appendChild(row);

  includeBtn.disabled = true;
}

/* ================= CARD CREATOR ================= */
function createCard(tx) {
  const card = document.createElement("div");
  card.className = "transaction-card mb-2";
  card.dataset.id = tx.id;
  card.dataset.company = tx.company;

  card.innerHTML = `
    <label class="fw-bold d-flex align-items-center gap-2">
      <input
        type="checkbox"
        class="include-checkbox"
        data-id="${tx.id}"
        data-company="${tx.company}"
      >
      ${tx.type} | ${tx.date} | $${tx.amount}
    </label>
  `;

  return card;
}

/* ================= ENABLE INCLUDE BUTTON ================= */
document.addEventListener("change", e => {
  if (e.target.classList.contains("include-checkbox")) {
    includeBtn.disabled =
      document.querySelectorAll(".include-checkbox:checked").length === 0;
  }
});

/* ================= SELECT ALL (COMPANY WISE) ================= */
document.addEventListener("change", e => {
  if (!e.target.classList.contains("select-all")) return;

  const company = e.target.dataset.company;
  const checked = e.target.checked;

  document
    .querySelectorAll(`.include-checkbox[data-company="${company}"]`)
    .forEach(cb => cb.checked = checked);

  includeBtn.disabled =
    document.querySelectorAll(".include-checkbox:checked").length === 0;
});

/* ================= INCLUDE (NO SIDE EFFECTS) ================= */
includeBtn.addEventListener("click", () => {
  const selected = Array.from(
    document.querySelectorAll(".include-checkbox:checked")
  ).map(cb => ({
    id: cb.dataset.id,
    company: cb.dataset.company
  }));

  const includeCount = selected.length;

  excluded = excluded.filter(
    tx =>
      !selected.some(
        s => String(s.id) === String(tx.id) && s.company === tx.company
      )
  );

  localStorage.setItem(
    "excludedTransactions",
    JSON.stringify(excluded)
  );

  // Show success alert
  Swal.fire({
    title: 'Success!',
    text: `✓ ${includeCount} transaction(s) included successfully!`,
    icon: 'success',
    confirmButtonText: 'OK'
  }).then(() => {
    window.location.href = "transaction.html";
  });
});
