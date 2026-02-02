const token = localStorage.getItem("jwtToken");
if (!token) window.location.href = "login.html";


const reconciledContainer =
  document.getElementById("reconciledContainer");

const unreconcileBtn =
  document.getElementById("unreconcileBtn");

let reconciled =
  JSON.parse(localStorage.getItem("reconciledTransactions")) || [];

render();

/* ================= RENDER ================= */
function render() {
  reconciledContainer.innerHTML = "";

  if (!reconciled.length) {
    reconciledContainer.innerHTML =
      "<p class='text-muted'>No reconciled transactions</p>";
    unreconcileBtn.disabled = true;
    return;
  }

  reconciled.forEach((tx, index) => {
    const row = document.createElement("div");
    row.className = "row mb-3 align-items-start";

    row.innerHTML = `
      <div class="col-md-6">
        <div class="transaction-card bg-light border">
          <label class="fw-bold">
            <input
              type="checkbox"
              class="unreconcile-checkbox me-2"
              data-index="${index}"
            >
            Company 1
          </label>
          <div>
            ${tx.type} | Date: ${tx.date} | Amount: $${tx.amount}
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="transaction-card bg-success text-white">
          <div><strong>Company 2 (Matched)</strong></div>
          ${
            tx.matchedTransactions
              .map(
                m =>
                  `<div>${m.type} | Date: ${m.date || m.company2Date} | Amount: $${m.amount}</div>`
              )
              .join("")
          }
        </div>
      </div>
    `;

    reconciledContainer.appendChild(row);
  });

  bindCheckboxes();
  unreconcileBtn.disabled = true;
}

/* ================= BIND CHECKBOX EVENTS ================= */
function bindCheckboxes() {
  document
    .querySelectorAll(".unreconcile-checkbox")
    .forEach(cb => {
      cb.addEventListener("change", () => {
        const anyChecked =
          document.querySelectorAll(".unreconcile-checkbox:checked").length > 0;
        unreconcileBtn.disabled = !anyChecked;
      });
    });
}

/* ================= UNRECONCILE ================= */
unreconcileBtn.addEventListener("click", () => {
  const selectedIndexes = Array.from(
    document.querySelectorAll(".unreconcile-checkbox:checked")
  ).map(cb => Number(cb.dataset.index));

  if (!selectedIndexes.length) return;

  const unreconcileCount = selectedIndexes.length;

  reconciled = reconciled.filter(
    (_, index) => !selectedIndexes.includes(index)
  );

  localStorage.setItem(
    "reconciledTransactions",
    JSON.stringify(reconciled)
  );

  // Show success alert
  Swal.fire({
    title: 'Success!',
    text: `✓ ${unreconcileCount} transaction(s) unreconciled successfully!`,
    icon: 'success',
    confirmButtonText: 'OK'
  }).then(() => {
    // Back to unreconciled screen
    window.location.href = "transaction.html";
  });
});
