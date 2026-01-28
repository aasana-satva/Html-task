$(document).ready(function () {

    // Global loader for all AJAX calls
    $(document).ajaxStart(function () {
        $("#loader").fadeIn(100);
    });

    $(document).ajaxStop(function () {
        $("#loader").fadeOut(100);
    });
    
    // Disable state and city initially
    $("#state").prop("disabled", true);
    $("#city").prop("disabled", true);

    // Load countries
    $.ajax({
        url: "https://countriesnow.space/api/v0.1/countries/",
        method: "GET",
        success: function (response) {
            let countries = response.data;

            $.each(countries, function (index, country) {
                $("#country").append(
                    `<option value="${country.country}">${country.country}</option>`
                );
            });
        },

    });

    // 2 Country change → enable & load states
    $("#country").change(function () {

        let selectedCountry = $(this).val();

        $("#state").html('<option value="">Select State</option>');
        $("#city").html('<option value="">Select City</option>');
        $("#city").prop("disabled", true);

        if (selectedCountry === "") {
            $("#state").prop("disabled", true);
            return;
        }

        //  ENABLE STATE DROPDOWN (THIS WAS MISSING)
        $("#state").prop("disabled", false);

        $.ajax({
            url: "https://countriesnow.space/api/v0.1/countries/states",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                country: selectedCountry
            }),
            success: function (response) {
                let states = response.data.states;

                $.each(states, function (index, state) {
                    $("#state").append(
                        `<option value="${state.name}  ${state.state_code}">${state.name}  ${state.state_code}</option>`
                    );
                });
            },

        });
    });


    // 3️ When state changes → load cities
    $("#state").on("change", function () {

        let country = $("#country").val();
        let state = $(this).val();

        $("#city").html('<option value="">Select City</option>');

        if (state === "") {
            $("#city").prop("disabled", true);
            return;
        }

        // Enable city dropdown
        $("#city").prop("disabled", false);

        $.ajax({
            url: "https://countriesnow.space/api/v0.1/countries/state/cities",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                country: country,
                state: state
            }),
            success: function (response) {
                let cities = response.data;

                $.each(cities, function (index, city) {
                    $("#city").append(
                        `<option value="${city} ">${city}</option>`
                    );
                });
            },
        });
    });

});
