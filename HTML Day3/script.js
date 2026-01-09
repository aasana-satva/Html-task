function openModal() {
    customerModal.style.display = "flex";
}

function closeModal() {
    customerModal.style.display = "none";
}

function saveData() {
    const formFields = customerModal.querySelectorAll("input, textarea");

    for (let field of formFields) {
        if (!field.checkValidity()) {
            field.reportValidity();   // shows browser validation message
            return;
        }
    }

    alert("Customer Data saved");

    // Reset all fields
    formFields.forEach(field => field.value = "");

    closeModal();
}

//invoice

function openInvoiceModal() {
    document.getElementById("InvoiceModal").style.display = "flex";
}

function icloseModal() {
    document.getElementById("InvoiceModal").style.display = "none";
}

function isaveData() {
    const formFields = InvoiceModal.querySelectorAll("input, select");

    for (let field of formFields) {
        if (!field.checkValidity()) {
            field.reportValidity();   // shows browser validation message
            return;
        }
    }

    alert("Invoice data saved successfully!");

    // Clear the form
    inputs.forEach(field => field.value = "");

    closeModal();
}

//delete popup
let rowToDelete = null;

document.addEventListener("click", function (e) {
    if (e.target.classList.contains("bi-trash-fill")) {
        rowToDelete = e.target.closest("tr");
        document.getElementById("deleteModal").style.display = "flex";
    }
});

function closeDelete() {
    document.getElementById("deleteModal").style.display = "none";
    rowToDelete = null;
}

function confirmDelete() {

    closeDelete();
}
closeDelete();

