$(document).ready(function () {
    $(function () {
        $('.datetimepicker').datetimepicker({
            format: 'L',
            format: 'DD/MM/YYYY'
        });

        $('.datetimepicker-addon').on('click', function () {
            $(this).prev('input.datetimepicker').data('DateTimePicker').toggle();
        });
    });
});