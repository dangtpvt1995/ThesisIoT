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
    $('#downloadPdf').click(function () {
        var doc = new jsPDF("p", "mm", "A4");
        doc.setFont('courier', 'italic');
        doc.text(100, 100, "test");
        doc.addPage();
        doc.save('test.pdf');
    });
    $('#getData').click(function () {
        $.get("http://localhost:8000/sensor1/download",
            function (data, textStatus, jqXHR) {
                data = JSON.parse(data);
                for(var i=0;i<data.length;i++){
                    var a = new Date(data[i].date);
                    let day = a.getDate() < 10 ? "0" + a.getDate() : a.getDate();
                    let month = a.getMonth() + 1 < 10 ? "0" + a.getMonth() + 1 : a.getMonth() + 1;
                    let year = a.getFullYear();
                    let date = day + "/" + month + "/" + year;
                    data[i].date=date;
                }
                var columns = [
                    { title: "NUMBER", dataKey: "number" },
                    { title: "TEMP", dataKey: "temp" },
                    { title: "HUMI", dataKey: "humi" },
                    { title: "DATE", dataKey: "date" },
                    { title: "TIME", dataKey: "time" },

                ];
                var rows = data;
                var doc = new jsPDF('p', 'pt');
                doc.autoTable(columns, rows, {
                    theme:'striped',
                   
                    // styles: { fillColor: [100, 255, 255] },
                    // columnStyles: {
                    //     id: { fillColor: 255 }
                    // },
                    margin: { top: 60 },
                    addPageContent: function (data) {
                        doc.text("SENSOR1", 250, 30);
                    }
                });
                doc.save('sensor1.pdf');
            });
     
    });
});