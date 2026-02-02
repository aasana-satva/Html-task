const API_URL =
  "http://trainingsampleapi.satva.solutions/api/Reconciliation/GetTransaction";

const token = localStorage.getItem("jwtToken");
if (!token) window.location.href = "login.html";

/* ================= DOM ================= */
const container = document.getElementById("reconciliationContainer");
const company2List = document.getElementById("company2List");
const debitTotalEl = document.getElementById("debitTotal");
const creditTotalEl = document.getElementById("creditTotal");
const reconcileBtn = document.getElementById("reconcileBtn");
const excludeBtn = document.getElementById("excludeBtn");
const loadMoreBtn = document.getElementById("loadMoreBtn");

/* ================= STORAGE ================= */
const STORAGE_KEY = "reconciledTransactions";

/* ================= DATA ================= */
let allTransactions = [];
let c1ToC2Map = {};
let selectedC1 = null;

/* 🔹 LOAD MORE COUNTS */
let visibleC1 = 10;
let visibleC2 = 10;

/* ================= COMPANY 2 DRAG ================= */
Sortable.create(company2List, {
  group: { name: "transactions", pull: true, put: true },
  sort: true
});

/* ================= FETCH ================= */
fetch(API_URL, {
  headers: { Authorization: `Bearer ${token}` }
})
  .then(res => res.json())
  .then(data => {
    const c1 = data.fromCompanyTransaction.map(tx => mapTx(tx, "Company1"));
    const c2 = data.toCompanyTransaction.map(tx => mapTx(tx, "Company2"));
    allTransactions = [...c1, ...c2];
    render();
  });

/* ================= MAP TRANSACTION ================= */
function mapTx(tx, company) {
  let debit = 0, credit = 0;

  tx.lines.forEach(l =>
    l.isCredit ? credit += l.amount : debit += l.amount
  );

  return {
    id: tx.transactionId,
    company,
    date: tx.date,
    type: tx.transactionType,
    amount: debit || credit
  };
}

/* ================= EXCLUDED HELPERS ================= */
function getExcludedSet() {
  const excluded =
    JSON.parse(localStorage.getItem("excludedTransactions")) || [];
  return new Set(excluded.map(tx => `${tx.id}-${tx.company}`));
}

/* ================= RECONCILED HELPERS ================= */
function getReconciledSet() {
  const reconciled =
    JSON.parse(localStorage.getItem("reconciledTransactions")) || [];
  const reconciledSet = new Set();
  
  reconciled.forEach(rec => {
    reconciledSet.add(`${rec.transactionId}-Company1`);
    if (rec.matchedTransactions) {
      rec.matchedTransactions.forEach(mt => {
        reconciledSet.add(`${mt.id}-Company2`);
      });
    }
  });
  
  return reconciledSet;
}

/* ================= RENDER ================= */
function render() {
  container.innerHTML = "";
  company2List.innerHTML = "";

  c1ToC2Map = {}; // REQUIRED FIX

  const excludedSet = getExcludedSet();
  const reconciledSet = getReconciledSet();

  const company1Tx = allTransactions.filter(
    tx => tx.company === "Company1" && 
          !excludedSet.has(`${tx.id}-${tx.company}`) &&
          !reconciledSet.has(`${tx.id}-${tx.company}`)
  );

  const company2Tx = allTransactions.filter(
    tx => tx.company === "Company2" && 
          !excludedSet.has(`${tx.id}-${tx.company}`) &&
          !reconciledSet.has(`${tx.id}-${tx.company}`)
  );

  /* -------- Company 1 (LOAD MORE) -------- */
  company1Tx.slice(0, visibleC1).forEach(tx => {
    const row = document.createElement("div");
    row.className = "row mb-2 align-items-start";

    row.innerHTML = `
      <div class="col-md-4">
        <div class="transaction-card"
             data-id="${tx.id}"
             data-amount="${tx.amount}">
          <div class="fw-bold d-flex align-items-center gap-2">
            <input
              type="checkbox"
              class="exclude-checkbox"
              data-id="${tx.id}"
              data-company="${tx.company}">
            <span>${tx.type} | ${tx.date} | $${tx.amount}</span>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="transaction-list drop-zone"
             data-c1="${tx.id}">
        </div>
      </div>
    `;

    container.appendChild(row);
    initDrop(row.querySelector(".drop-zone"));
    bindSelect(row.querySelector(".transaction-card"));
  });

  /* -------- Company 2 (LOAD MORE) -------- */
  company2Tx.slice(0, visibleC2).forEach(tx => {
    const card = document.createElement("div");
    card.className = "transaction-card";
    card.dataset.amount = tx.amount;
    card.dataset.id = tx.id;

    card.innerHTML = `
      <div class="fw-bold d-flex align-items-center gap-2">
        <input
          type="checkbox"
          class="exclude-checkbox"
          data-id="${tx.id}"
          data-company="${tx.company}">
        <span>${tx.type} | ${tx.date} | $${tx.amount}</span>
      </div>
    `;

    company2List.appendChild(card);
  });

  /* -------- LOAD MORE BUTTON VISIBILITY -------- */
  // Show button if there are more transactions to load in EITHER list
  const hasMoreC1 = visibleC1 < company1Tx.length;
  const hasMoreC2 = visibleC2 < company2Tx.length;
  
  if (hasMoreC1 || hasMoreC2) {
    loadMoreBtn.style.display = "block";
    
    // Optional: Update button text to show remaining count
    const remainingC1 = Math.max(0, company1Tx.length - visibleC1);
    const remainingC2 = Math.max(0, company2Tx.length - visibleC2);
    const totalRemaining = remainingC1 + remainingC2;
    
    loadMoreBtn.textContent = `Load More (${totalRemaining} remaining)`;
  } else {
    loadMoreBtn.style.display = "none";
  }
}

/* ================= LOAD MORE ================= */
loadMoreBtn.addEventListener("click", () => {
  visibleC1 += 10;
  visibleC2 += 10;
  render();
});


/* ================= DROP ================= */
function initDrop(zone) {
  Sortable.create(zone, {
    group: "transactions",
    animation: 150,
    onAdd(evt) {
      const id = zone.dataset.c1;
      if (!c1ToC2Map[id]) c1ToC2Map[id] = [];
      c1ToC2Map[id].push(evt.item);
      updateTotals();
    },
    onRemove(evt) {
      const id = zone.dataset.c1;
      c1ToC2Map[id] =
        c1ToC2Map[id].filter(el => el !== evt.item);
      updateTotals();
    }
  });
}

/* ================= SELECT COMPANY 1 ================= */
function bindSelect(card) {
  card.onclick = () => {
    document
      .querySelectorAll(".transaction-card")
      .forEach(c => c.classList.remove("border-primary"));

    card.classList.add("border-primary");
    selectedC1 = card;
  };
}

/* ================= TOTALS ================= */
function updateTotals() {
  let debit = 0, credit = 0;

  for (const c1 in c1ToC2Map) {
    const matches = c1ToC2Map[c1];
    if (!matches.length) continue;

    const c1Card = document.querySelector(`[data-id="${c1}"]`);
    if (!c1Card) continue;

    credit += Number(c1Card.dataset.amount);
    debit += matches.reduce((sum, el) => sum + Number(el.dataset.amount), 0);
  }

  debitTotalEl.value = debit;
  creditTotalEl.value = credit;
  reconcileBtn.disabled = debit !== credit || debit === 0;
}

/* ================= RECONCILE ================= */
reconcileBtn.onclick = () => {
  const reconciled = [];

  for (const c1Id in c1ToC2Map) {
    if (!c1ToC2Map[c1Id].length) continue;

    const c1Tx = allTransactions.find(tx => tx.id == c1Id);

    reconciled.push({
      transactionId: c1Id,
      company: "Company1",
      type: c1Tx.type,
      date: c1Tx.date,
      amount: Number(c1Tx.amount),
      matchedTransactions: c1ToC2Map[c1Id].map(el => {
        const tx = allTransactions.find(
          t => String(t.id) === el.dataset.id && t.company === "Company2"
        );
        return {
          id: tx.id,
          company: tx.company,
          type: tx.type,
          date: tx.date,
          amount: tx.amount
        };
      })
    });
  }

  const previous =
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([...previous, ...reconciled])
  );

  // Remove reconciled transactions from allTransactions
  const reconciledIds = new Set();
  reconciled.forEach(rec => {
    reconciledIds.add(`${rec.transactionId}-Company1`);
    rec.matchedTransactions.forEach(mt => {
      reconciledIds.add(`${mt.id}-Company2`);
    });
  });

  allTransactions = allTransactions.filter(
    tx => !reconciledIds.has(`${tx.id}-${tx.company}`)
  );

  // Re-render to remove reconciled transactions from the UI
  visibleC1 = 10;
  visibleC2 = 10;
  render();

  // Show success alert
  Swal.fire({
    title: 'Success!',
    text: `✓ ${reconciled.length} transaction(s) reconciled successfully!`,
    icon: 'success',
    confirmButtonText: 'OK'
  }).then(() => {
    window.location.href="reconciled.html";
  });
};

/* ================= ENABLE EXCLUDE BUTTON ================= */
document.addEventListener("change", e => {
  if (e.target.classList.contains("exclude-checkbox")) {
    excludeBtn.disabled =
      document.querySelectorAll(".exclude-checkbox:checked").length === 0;
  }
});

/* ================= EXCLUDE ================= */
excludeBtn.addEventListener("click", () => {
  const checkedBoxes =
    document.querySelectorAll(".exclude-checkbox:checked");

  const excludeCount = checkedBoxes.length;

  let excluded =
    JSON.parse(localStorage.getItem("excludedTransactions")) || [];

  checkedBoxes.forEach(cb => {
    const tx = allTransactions.find(
      t => String(t.id) === cb.dataset.id && t.company === cb.dataset.company
    );
    if (tx && !excluded.some(e => e.id === tx.id && e.company === tx.company)) {
      excluded.push(tx);
    }
  });

  localStorage.setItem("excludedTransactions", JSON.stringify(excluded));
  
  // Show success alert
  Swal.fire({
    title: 'Success!',
    text: `✓ ${excludeCount} transaction(s) excluded successfully!`,
    icon: 'success',
    confirmButtonText: 'OK'
  }).then(() => {
    window.location.href = "exclude.html";
  });
});

/* ================= LOGOUT ================= */
document.getElementById("logoutbtn").addEventListener("click", () => {
  if (!confirm("Are you sure you want to logout?")) return;

  localStorage.clear();
  window.location.href = "login.html";
});