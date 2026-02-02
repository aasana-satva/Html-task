var email = document.getElementById("email");
var password = document.getElementById("password");

var loginForm = document.getElementById("loginForm");


//email validation
if (email) {
    email.addEventListener("input", function () {
        if (email.value === "") {
            email.classList.add("is-invalid");
            email.classList.remove("is-valid");
        } else {
            email.classList.remove("is-invalid");
            email.classList.add("is-valid");
        }
    });
}

//password
if (password) {
    password.addEventListener("input", function () {
        if (password.value === "Satva1213#") {
            password.classList.remove("is-invalid");
            password.classList.add("is-valid");
        } else {
            password.classList.add("is-invalid");
            password.classList.remove("is-valid");
        }
    });
}

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();  //prevent browser default 


        var isValid = true;

        if (email.value === "") {
            email.classList.add("is-invalid");
            isValid = false;
        }

        if (password.value !== "Satva1213#") {
            password.classList.add("is-invalid");
            isValid = false;
        }
        if (isValid === false) {
            return;
        }

        //ajax call

        var xhr = new XMLHttpRequest();

        xhr.open(
            "POST",
            "http://trainingsampleapi.satva.solutions/api/auth/login",
            true
        );
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);

                localStorage.setItem("jwtToken", response.token);
                Swal.fire({
                    title: 'Success!',
                    text: 'Login successful!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    window.location.href = "transaction.html";
                });
            }
        };
        xhr.send(JSON.stringify({
            Email: email.value,
            Password: "Satva1213#"
        }));

    });
}

