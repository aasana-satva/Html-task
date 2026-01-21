$(document).ready(function () {

    const STORAGE_KEY = "studentRecords";

    const states = {
        Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
        Maharashtra: ["Mumbai", "Pune", "Nagpur"],
        Rajasthan: ["Jaipur", "Udaipur", "Jodhpur"],
        Karnataka: ["Bengaluru", "Mysuru", "Mangaluru"]
    };

    $("#state").autocomplete({
        source: Object.keys(states),
        minLength: 0,
        select: function (event, ui) {
            $("#city").val("");
            $("#city").autocomplete({
                source: states[ui.item.value],
                minLength: 0
            });
        }
    }).focus(function () {
        $(this).autocomplete("search", "");
    });

    $("#city").focus(function () {
        $(this).autocomplete("search", "");
    });


    $("#studyPeriod").daterangepicker({
        autoUpdateInput: true,
        locale: { format: "DD/MM/YYYY" },
        drops: "up"
    });

  
    $("#studentForm").validate({
        rules: {
            name: { required: true },
            mobile: { required: true, digits: true, minlength: 10, maxlength: 10 },
            email: { required: true, email: true },
            college: { required: true },
            cgpa: { required: true, min: 0, max: 10 },
            branch: { required: true },
            state: { required: true },
            city: { required: true },
            zip: { required: true, digits: true, minlength: 6, maxlength: 6 },
            studyPeriod: { required: true }
        },

        messages: {
            name: "Name is required",
            mobile: "Enter valid 10-digit mobile number",
            email: "Enter a valid email address",
            college: "College name is required",
            cgpa: "CGPA must be between 0 and 10",
            branch: "Please select a branch",
            state: "State is required",
            city: "City is required",
            zip: "Enter valid 6-digit zip code",
            studyPeriod: "Please select study period"
        },

        errorClass: "error",
        validClass: "valid",

        highlight: function (element) {
            $(element).addClass("error").removeClass("valid");
        },

        unhighlight: function (element) {
            $(element).removeClass("error").addClass("valid");
        },

        submitHandler: function (form) {

            let record = {
                name: $("#name").val(),
                mobile: $("#mobile").val(),
                email: $("#email").val(),
                college: $("#college").val(),
                cgpa: $("#cgpa").val(),
                branch: $("#branch").val(),
                state: $("#state").val(),
                city: $("#city").val(),
                zip: $("#zip").val(),
                studyPeriod: $("#studyPeriod").val()
            };

            let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            data.push(record);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

            alert("Record added successfully ");

            form.reset();
            $(".form-control, .form-select").removeClass("valid");
        }
    });

    /*  EXPORT */
    $("#export").on("click", function () {
        let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        let tbody = $("#tableData");
        tbody.empty();

        if (data.length === 0) {
            alert("No data found in storage");
            return;
        }

        $.each(data, function (index, item) {
            tbody.append(`
                <tr>
                    <td>${item.name}</td>
                    <td>${item.mobile}</td>
                    <td>${item.email}</td>
                    <td>${item.college}</td>
                    <td>${item.cgpa}</td>
                    <td>${item.branch}</td>
                    <td>${item.state}</td>
                    <td>${item.city}</td>
                    <td>${item.zip}</td>
                    <td>${item.studyPeriod}</td>
                </tr>
            `);
        });

        
    });

    /* CLEAR STORAGE  */
    $("#clear").on("click", function () {
        if (confirm("Are you sure you want to clear all records?")) {
            localStorage.removeItem(STORAGE_KEY);
            $("#tableData").empty();
            alert("Storage cleared successfully ");
        }

       
    });

});

/*  KEYPRESS RESTRICTIONS */

// Allow alphabets, space, comma
function onlyAlphabets(event) {
    let code = event.which || event.keyCode;
    return (
        (code >= 65 && code <= 90) ||   // A-Z
        (code >= 97 && code <= 122) ||  // a-z
        code === 32 ||                  // space
        code === 44                     // comma
    );
}

// Allow digits only
function onlyDigits(event) {
    let code = event.which || event.keyCode;
    return (code >= 48 && code <= 57);  // 0-9
}