$(document).ready(function(){
    const $form = $("#apiForm");
    const $method = $("#method");
    const $headersDiv = $("#headersDiv");
    const $bodyDiv = $("#bodyDiv");
    const $headers = $("#headers");
    const $body = $("#body");

    //hide and show header body

    function toggleFields() {
        const method = $method.val();
    
        if (["POST", "PUT", "PATCH"].includes(method)) {
          $headersDiv.removeClass("d-none");
          $bodyDiv.removeClass("d-none");
    
          $headers.prop("required", true);
          $body.prop("required", true);
        } else {
          $headersDiv.addClass("d-none");
          $bodyDiv.addClass("d-none");
    
          $headers.prop("required", false).val("")
            .removeClass("is-valid is-invalid");
          $body.prop("required", false).val("")
            .removeClass("is-valid is-invalid");
        }
      }
    
      toggleFields();
      $method.on("change", toggleFields);

      //validation
      function isValidJSON(value) {
        try {
          JSON.parse(value);
          return true;
        } catch {
          return false;
        }
      }

      //form submit

      $form.on("submit", function (e) {
        e.preventDefault();
    
        // Bootstrap validation
        if (!this.checkValidity()) {
          $form.addClass("was-validated");
          return;
        }
    
        // Validate JSON fields if visible
        if (!$headersDiv.hasClass("d-none")) {
    
          if (!isValidJSON($headers.val())) {
            $headers.addClass("is-invalid");
            return;
          } else {
            $headers.removeClass("is-invalid").addClass("is-valid");
          }
    
          if (!isValidJSON($body.val())) {
            $body.addClass("is-invalid");
            return;
          } else {
            $body.removeClass("is-invalid").addClass("is-valid");
          }
        }
    
        const url = $("#url").val();
        const method = $method.val();
    
        let ajaxOptions = {
          url: url,
          type: method,
          dataType: "text",
          success: function (response, status, xhr) {
            $("#statusCode").text(xhr.status);
    
            try {
              $("#responseOutput").text(
                JSON.stringify(JSON.parse(response), null, 2)
              );
            } catch {
              $("#responseOutput").text(response);
            }
          },
          error: function (xhr) {
            $("#statusCode").text(xhr.status || "Error");
            $("#responseOutput").text(
              xhr.responseText || xhr.statusText
            );
          }
        };
    
        if (["POST", "PUT", "PATCH"].includes(method)) {
          ajaxOptions.headers = JSON.parse($headers.val());
          ajaxOptions.data = JSON.stringify(JSON.parse($body.val()));
          ajaxOptions.contentType = "application/json";
        }
    
        $.ajax(ajaxOptions);
      });

})