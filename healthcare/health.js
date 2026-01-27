$(function () {
    const STORAGE_KEY = "staffBookings";

    /* ===============================
       AUTOCOMPLETE CITY (Bloodhound)
       =============================== */

    var cityEngine = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: [
            "Ahmedabad",
            "Surat",
            "Vadodara",
            "Mumbai",
            "Pune",
            "Jaipur"
        ]
    });

    cityEngine.initialize();

    $("#city").typeahead(
        {
            hint: true,
            highlight: true,
            minLength: 1
        },
        {
            name: "cities",
            source: cityEngine
        }
    );

    /* ===============================
       DATE RANGE PICKER
       =============================== */

    $("#serviceDate").daterangepicker({
        locale: { format: "DD/MM/YYYY" },
        autoApply: true
    });

    /* ===============================
       FORM VALIDATION (UNCHANGED)
       =============================== */

    $("#bookingForm").validate({
        errorClass: "error",
        validClass: "valid",
        errorElement: "div",
        ignore: [],

        rules: {
            name: { required: true },
            mobile: { required: true, digits: true, minlength: 10, maxlength: 10 },
            city: { required: true },
            serviceDate: { required: true },
            staff: { required: true, min: 1 },
            address: { required: true }
        },

        messages: {
            name: "Please enter patient name",
            mobile: "Enter valid 10 digit number",
            city: "Select your city",
            serviceDate: "Choose service date",
            staff: "Minimum 1 staff required",
            address: "Enter address"
        },

        highlight: function (element) {
            $(element).addClass("error").removeClass("valid");
        },

        unhighlight: function (element) {
            $(element).addClass("valid").removeClass("error");
        },

        errorPlacement: function (error, element) {
            error.addClass("invalid-feedback").insertAfter(element);
        },

        /* ===============================
           ON CLICK BOOK STAFF BOOKING
           =============================== */
        submitHandler: function (form) {

            let data = {
                name: $("[name=name]").val(),
                mobile: $("[name=mobile]").val(),
                city: $("[name=city]").val(),
                serviceDate: $("[name=serviceDate]").val(),
                staff: $("[name=staff]").val(),
                address: $("[name=address]").val()
            };

            // ✅ Save to localStorage
            let records = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            records.push(data);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(records));

            // ✅ SweetAlert success
            Swal.fire({
                icon: "success",
                title: "Booking Confirmed",
                html: `
                    <b>${data.name}</b><br>
                    📞 ${data.mobile}<br>
                    📍 ${data.city}<br>
                    📅 ${data.serviceDate}
                `
            });

            form.reset();
            $(".form-control").removeClass("valid error");
        }
    });

    /* ===============================
       CLEAR STORAGE
       =============================== */

    $("#clear").click(function () {
        localStorage.removeItem(STORAGE_KEY);
        Swal.fire("Cleared", "All bookings removed", "warning");
    });
});

/* ===============================
   INPUT RESTRICTIONS (UNCHANGED)
   =============================== */

function onlyAlphabets(e) {
    let c = e.which || e.keyCode;
    return (c >= 65 && c <= 90) || (c >= 97 && c <= 122) || c === 32;
}

function onlyDigits(e) {
    let c = e.which || e.keyCode;
    return c >= 48 && c <= 57;
}
