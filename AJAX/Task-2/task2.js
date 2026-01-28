$(document).ready(function () {

    // Load Home page by default
    loadPage("home.html");

    // Menu click
    $(".menu").click(function (e) {
        e.preventDefault();
        $(".navbar-collapse").collapse("hide");

        // Set active menu
        $(".menu").removeClass("active");
        $(this).addClass("active");

        let page = $(this).data("page");
        loadPage(page);
    });

    // Function to load pages
    function loadPage(page) {
        // Show loader
        $("#loader").show();

        $.ajax({
            url: "pages/" + page,
            method: "GET",
            cache: false, // prevent cache
            success: function (res) {
                // Load content
                $("#content").fadeOut(500, function () {
                    $("#content").html(res).fadeIn(500);
                    // Hide loader
                    $("#loader").fadeOut(500);
                });
            },
            error: function () {
                $("#content").html("<div class='alert alert-danger'>Error loading page</div>");
                $("#loader").fadeOut(300);
            }
        });
    }

});
