$(document).ready(function () {
    var chartTemp1 = drawChart("#line-chartcanvasTemp1", "Nhiệt độ",  "#EC870E", "#EC870E");
    var chartHumi1 = drawChart("#line-chartcanvasHumi1", "Độ ẩm",  "#205AA7", "#205AA7");
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
    $('#downloadPdf').click(function () {
        var doc = new jsPDF("p", "mm", "A4");
        doc.setFont('courier', 'italic');
        doc.text(100, 100, "test");
        doc.addPage();
        doc.save('test.pdf');
    });
    $('#getData').click(function () {
        $.get("http://localhost:8000/vdkA/download",
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
                    margin: { top: 60 },
                    addPageContent: function (data) {
                        doc.text("SENSOR1", 250, 30);
                    }
                });
                doc.save('sensor1.pdf');
            });

    });
    //Lấy data
    var datatable = $('#example').DataTable({
        "scrollY": "350px",
        "scrollCollapse": true,
        "paging": true,

        columns: [
            { title: "STT" },
            { title: "Nhiệt độ" },
            { title: "Độ ẩm" },
            { title: "Thời gian" }
        ],
        "language": {
            "lengthMenu": "Hiển thị _MENU_ dữ liệu trên mỗi trang",
            "zeroRecords": "Không tìm thấy dữ liệu",
            "info": "Trang số _PAGE_ trong tổng _PAGES_ trang",
            "infoEmpty": "Không tìm thấy dữ liệu",
            "paginate": {
                "first": "Trang đầu",
                "last": "Trang cuối",
                "next": "Tiếp",
                "previous": "Quay lại"
            },
            "search": "Tìm kiếm:",
            "loadingRecords": "Đang xử lý...",
            "processing": "Đang xử lý...",

        }
    });

    $('input#btnXacNhan').click(function (e) {
        var ok = false;
        var datePicker = $('input[name=date]').val();
        var frmTime = $('input[name=frmTime]').val();
        var toTime = $('input[name=toTime]').val();
        var dataSend = {
            datePicker: datePicker,
            frmTime: frmTime,
            toTime: toTime
        };
        if (datePicker) {
            $('#dateFind').text(datePicker);
            if (frmTime) {
                if (toTime) {
                    if (frmTime >= toTime) {
                        alert("Vui lòng nhập lại thời gian tìm kiếm");
                    }
                    else {
                        let date = datePicker + "   " + frmTime + " -> " + toTime;
                        $('#dateFind').text(date);
                        ok = true;
                    }
                }
                else {
                    alert("Vui lòng nhập đủ dữ kiện thời gian");
                }
            }
            else {
                dataSend.frmTime = "00:00";
                dataSend.toTime = "23:59";
                ok = true;
            }
        }
        else {
            alert("Vui lòng chọn ngày tìm kiếm");
        }
        if (ok) {
            $.ajax({
                url: "http://localhost:8000/vdkA",
                type: "post",
                data: dataSend,
                dataType: "json",
                success: function (data) {
                    $('main').css('height',"200vh");
                    console.log(data);
                    var dataSet = [];
                    var data = data.data;
                    var dataAll = data.dataAll;
                    var maxTemp = data.maxTemp;
                    var minTemp = data.minTemp;
                    var avgTemp = data.avgTemp;
                    var dataReal = dataAll.length;
                    var dataTheory = dataAll[dataReal-1].number;
                    $('#variancesTemp').text(data.variancesTemp);
                    $('#standardTemp').text(data.standardTemp);
                    $('#theoryData').text(dataTheory);
                    $('#realData').text(dataReal);
                    $('#maxTemp').text(maxTemp + "°C");
                    $('#minTemp').text(minTemp + "°C");
                    $('#avgTemp').text(avgTemp + "°C");
                    var maxHumi = data.maxHumi;
                    var minHumi = data.minHumi;
                    var avgHumi = data.avgHumi;
                    $('#maxHumi').text(maxHumi + "%");
                    $('#minHumi').text(minHumi + "%");
                    $('#avgHumi').text(avgHumi + "%");
                    $('#variancesHumi').text(data.variancesHumi);
                    $('#standardHumi').text(data.standardHumi);
                    var count = 1;
                    for (var i = 0; i < dataAll.length; i++) {
                        var object = [
                            count,
                            dataAll[i].temp,
                            dataAll[i].humi,
                            dataAll[i].time
                        ]
                        dataSet.push(object);
                        count++;
                    }
                    datatable.clear();
                    datatable.rows.add(dataSet);
                    datatable.draw();

                    //Vẽ biểu đồ
                    var labelsRaw = data.labels;
                    var labels=[];
                    var tempArr = data.tempArr;
                    var humiArr = data.humiArr;
                    for(var i=0;i<labelsRaw.length;i++){
                        let hour = Math.floor(labelsRaw[i]/3600)<10?"0"+Math.floor(labelsRaw[i]/3600):Math.floor(labelsRaw[i]/3600);
                        let min = Math.floor((labelsRaw[i]-hour*3600)/60)<10?"0"+Math.floor((labelsRaw[i]-hour*3600)/60):Math.floor((labelsRaw[i]-hour*3600)/60);
                        let sec = Number(labelsRaw[i]-hour*3600-min*60)<10?"0"+(labelsRaw[i]-hour*3600-min*60):(labelsRaw[i]-hour*3600-min*60);
                        let label = hour+":"+min+":"+sec;
                        labels.push(label);
                    }
                    addDataChart(chartTemp1,tempArr,labels);
                    addDataChart(chartHumi1,humiArr,labels);
                },
                error: function () {
                    console.log("Error post data");
                }
            });
        }
    });
    function drawChart(idChart, label, borderColor, titleColor) {
        let ctx = $(idChart);
        let options = {
            title: {
                display: true,
                position: "top",
                text: label,
                fontSize: 18,
                fontColor: titleColor,
                backgroundColor: "#00A06B",
            },
            legend: {
                display: false,
                position: "bottom"
            },
            scales: {
                yAxes: [{
                    ticks: {
                        // suggestedMin: min,
                        // suggestedMax: max
                    }
                }]
            }
        }
        let data = {
            labels: [],
            datasets: [
                {
                    label: label,
                    lineTension: 0.1,
                    data: [],
                    backgroundColor: "#CAE5E8",
                    borderColor: borderColor,
                    fill: false,
                    pointRadius: 3,

                }]
        };
        let lineChart = new Chart(ctx, {
            type: "line",
            data: data,
            options: options
        });
        return lineChart;
    }

    function addDataChart(lineChart, arrVal, labels) {
        lineChart.data.datasets[0].data = arrVal;
        lineChart.data.labels=labels;
        lineChart.update();
    }
});