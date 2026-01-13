//REGISTRATION FORM
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  const btn = document.getElementById("registerBtn");
  const terms = document.getElementById("terms");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");

  // Enable button only if checkbox checked
  terms.addEventListener("change", () => {
    btn.disabled = !terms.checked;
  });

  // Live password match validation
  confirmPassword.addEventListener("input", () => {
    if (confirmPassword.value !== password.value) {
      confirmPassword.setCustomValidity("Passwords do not match");
    } else {
      confirmPassword.setCustomValidity("");
    }
  });

  // Submit validation
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    registerForm.classList.add("was-validated");

    if (!registerForm.checkValidity()) return;

    alert("Registration Successful!");

    registerForm.reset();
    btn.disabled = true;
    registerForm.classList.remove("was-validated");
  });
}


//EMPLOYEE FORM

const empForm = document.getElementById("empForm");

if (empForm) {
  const fileInput = document.getElementById("profilePic");
  const browseBtn = document.getElementById("browseBtn");
  const fileName = document.getElementById("fileName");

  // Open file dialog
  browseBtn.addEventListener("click", () => {
    fileInput.click();
  });

  // Image validation
  fileInput.addEventListener("change", function () {
    const file = this.files[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];

    if (file && !allowedTypes.includes(file.type)) {
      this.value = "";
      fileName.value = "";
      alert("Only image files are allowed (JPG, PNG, GIF, WEBP)");
    } else if (file) {
      fileName.value = file.name;
    }
  });

  // Submit validation
  empForm.addEventListener("submit", function (e) {
    e.preventDefault();
    empForm.classList.add("was-validated");

    if (!empForm.checkValidity()) return;

    alert("Employee data submitted successfully!");

    empForm.reset();
    fileName.value = "";
    empForm.classList.remove("was-validated");
  });
}


/* APPOINTMENT FORM */

const appointmentform = document.getElementById("appointmentForm");
const modalElement = document.getElementById("appointmentModal");

// Handle form submit
appointmentform.addEventListener("submit", function (e) {
    e.preventDefault();

    appointmentform.classList.add("was-validated");

    // Stop if form is invalid
    if (!appointmentform.checkValidity()) return;

    alert("Appointment Scheduled Successfully!");

    // Reset form after successful submit
    appointmentform.reset();
    appointmentform.classList.remove("was-validated");

    // Close modal
    const modal = bootstrap.Modal.getInstance(modalElement) 
               || new bootstrap.Modal(modalElement);

    modal.hide();
});

// Clear form whenever modal is closed
modalElement.addEventListener("hidden.bs.modal", function () {
    appointmentform.reset();
    appointmentform.classList.remove("was-validated");
});

