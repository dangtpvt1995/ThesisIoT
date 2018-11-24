$(document).ready(function () {

    $('#datetimepicker').datetimepicker({
        format: 'L',
        format: 'DD/MM/YYYY',
        locale: 'vi'
    });
    $('#datetimepicker6').datetimepicker({
        format: 'LT',
        locale: 'vi'
    });
    $('#datetimepicker7').datetimepicker({
        format: 'LT',
        locale: 'vi'
    });
    $('#datetimepicker').datetimepicker();
    $('#datetimepicker6').datetimepicker();
    $('#datetimepicker7').datetimepicker({
        useCurrent: false
    });
    $("#datetimepicker6").on("dp.change", function (e) {
        $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
    });
    $("#datetimepicker7").on("dp.change", function (e) {
        $('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
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
                for (var i = 0; i < data.length; i++) {
                    var a = new Date(data[i].date);
                    let day = a.getDate() < 10 ? "0" + a.getDate() : a.getDate();
                    let month = a.getMonth() + 1 < 10 ? "0" + a.getMonth() + 1 : a.getMonth() + 1;
                    let year = a.getFullYear();
                    let date = day + "/" + month + "/" + year;
                    data[i].date = date;
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
                    theme: 'striped',

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
    //Lấy data
    var datatable=$('#example').DataTable({
        "scrollY":        "470px",
        "scrollCollapse": true,
        "paging":         false,
      
       columns: [
           { title: "STT" },
           { title: "Nhiệt độ" },
           { title: "Độ ẩm" },
           { title: "Thời gian" },
           { title: "Ngày" }
       ],
       "language": {
        "lengthMenu": "Hiển thị _MENU_ dữ liệu trên mỗi trang",
        "zeroRecords": "Không tìm thấy dữ liệu",
        "info": "Trang số _PAGE_ trong tổng _PAGES_ trang",
        "infoEmpty": "Không tìm thấy dữ liệu",
        "paginate": {
            "first":      "Trang đầu",
            "last":       "Trang cuối",
            "next":       "Tiếp",
            "previous":   "Quay lại"
        },
        "search":         "Tìm kiếm:",
        "loadingRecords": "Đang xử lý...",
        "processing":     "Đang xử lý...",
        
    }
    });
   
    $('input#btnXacNhan').click(function (e) {
        console.log(datatable)
        var datePicker = $('input[name=date]').val();
        var frmTime = $('input[name=frmTime]').val();
        var toTime = $('input[name=toTime]').val();
        var dataSend = {
            datePicker: datePicker,
            frmTime: frmTime,
            toTime: toTime
        };
      
        $.ajax({
            url: "http://localhost:8000/sensor1",
            type: "post",
            data: dataSend,
            dataType: "json",
            success: function (data) {
                
                var dataSet = [];
                var data = data.data;

                console.log(data);
                var dataAll = data.dataAll;
                var dateFind = data.dateFind;
                var maxTemp = data.maxTemp;          
                var minTemp = data.minTemp;
                var avgTemp = data.avgTemp; 
                $('#dateFind').text(dateFind);
                $('#maxTemp').text(maxTemp+" °C");
                $('#minTemp').text(minTemp+" °C");
                $('#avgTemp').text(avgTemp+" °C");
                var maxHumi = data.maxHumi;             
                var minHumi = data.minHumi;
                var avgHumi = data.avgHumi; 
                $('#maxHumi').text(maxHumi+" %");
                $('#minHumi').text(minHumi+" %");
                $('#avgHumi').text(avgHumi+" %");
                var count=1;
                for (var i=0;i<dataAll.length;i++) {
                    var currentDate = new Date(dataAll[i].date);
                    var day = currentDate.getDate();
                    var month = currentDate.getMonth() + 1;
                    var year = currentDate.getFullYear();
                    var date = day + "/" + month + "/" + year;          
                    var object = [
                            count,
                         dataAll[i].temp,
                         dataAll[i].humi,
                        dataAll[i].time,
                        date
                    ]
                    dataSet.push(object);
                    count++;

                }
            datatable.clear();
            datatable.rows.add(dataSet);
            datatable.draw();
            },
            error: function () {
                console.log("Error post data");
            }

        });
    });
    //dialog
   
   


});