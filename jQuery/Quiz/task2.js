document.addEventListener('DOMContentLoaded', function () {
    let calendarEl = document.getElementById('calendar');
    let selectedSlot = null;
    let selectedEvent = null;

    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        selectable: true,
        editable: true,
        eventStartEditable: true,

        selectAllow: function(info) {
            let today = new Date();
            today.setHours(0, 0, 0, 0);
            return info.start >= today;
        },

        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },

        select: function (info) {
            selectedSlot = info;
            selectedEvent = null;

            $('#modalTitle').text('Book Appointment');
            $('#deleteEvent').hide();
            $('#saveEvent').text('Confirm Booking');

            new bootstrap.Modal(document.getElementById('eventModal')).show();
        },

        eventClick: function(info) {            
            selectedEvent = info.event;
            selectedSlot = null;

            let parts = info.event.title.match(/(.*)\s\((.*)\)/);
            $('#patientName').val(parts ? parts[1] : '');
            $('#mobileNumber').val(parts ? parts[2] : '');

            $('#modalTitle').text('Edit Appointment');
            $('#deleteEvent').show();
            $('#saveEvent').text('Update');

            new bootstrap.Modal(document.getElementById('eventModal')).show();
        }
    });

    calendar.render();

   
    $.validator.addMethod("lettersOnly", function (value) {
        return /^[a-zA-Z ]+$/.test(value);
    });

    $("#eventForm").validate({
        rules: {
            patientName: {
                required: true,
                lettersOnly: true,
                minlength: 2
            },
            mobileNumber: {
                required: true,
                digits: true,
                minlength: 10,
                maxlength: 10
            }
        },
        messages: {
            patientName: "Enter patient name",
            mobileNumber: "Enter valid 10 digit mobile number"
        },
        errorPlacement: function (error, element) {
            error.addClass('text-danger');   //  red error text
            error.insertAfter(element);
        },
        highlight: function (element) {
            $(element).addClass('is-invalid').removeClass('is-valid'); //  red border
        },
        unhighlight: function (element) {
            $(element).addClass('is-valid').removeClass('is-invalid');
        }
    });

    // SAVE / EDIT
    document.getElementById('saveEvent').addEventListener('click', function () {
        if (!$("#eventForm").valid()) return;

        let name = $('#patientName').val().trim();
        let mobile = $('#mobileNumber').val().trim();

        if (selectedEvent) {
            if (confirm("Are you sure you want to edit this event?")) {
                selectedEvent.setProp('title', name + ' (' + mobile + ')');
            }
        } else {
            calendar.addEvent({
                title: name + ' (' + mobile + ')',
                start: selectedSlot.start,
                end: selectedSlot.end
            });
        }

        bootstrap.Modal.getInstance(document.getElementById('eventModal')).hide();
        calendar.unselect();
    });

    // DELETE
    document.getElementById('deleteEvent').addEventListener('click', function () {
        if (!selectedEvent) return;

        if (confirm("Are you sure you want to delete this event?")) {
            selectedEvent.remove();
            bootstrap.Modal.getInstance(document.getElementById('eventModal')).hide();
        }
    });

    // RESET MODAL
    $('#eventModal').on('hidden.bs.modal', function () {
        const form = $('#eventForm');
        form[0].reset();
        form.find('.is-valid, .is-invalid').removeClass('is-valid is-invalid');
        form.validate().resetForm();

        selectedEvent = null;
        selectedSlot = null;
    });
});

// helpers
function onlyAlphabets(event) {
    let code = event.which || event.keyCode;
    return (code >= 65 && code <= 90) || (code >= 97 && code <= 122) || code === 32;
}

function onlyDigits(event) {
    let code = event.which || event.keyCode;
    return (code >= 48 && code <= 57);
}
