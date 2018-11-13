$(document).ready(function () {

    var es = new EventSource('/controller/stream');
    es.addEventListener('open', function (event) {
        console.log("Kết nối đã được mở")
    }, false);
    es.addEventListener('error', function (event) {
        console.log("Kết nối đã đóng")
    }, false);

    es.addEventListener('message', function (e) {
        console.log(e);
        var data = JSON.parse(e.data);
        var id=e.lastEventId;
        console.log(id);
        console.log(data);
        if (data && id) {
            if (id == "sensor1") {
                if (data.status==1) {
                    $("#imgledSenssor1").attr("src", "/images/led-green-md.png");
                }
                else {
                    $("#imgledSenssor1").attr("src", "/images/red-led-off-md.png");
               
                }

            }
            else if (id == "sensor2") {
                if (data.status==1) {
                    $("#imgledSenssor2").attr("src", "/images/led-green-md.png");
                }
                else {
                    $("#imgledSenssor2").attr("src", "/images/red-led-off-md.png");
                }

            }
        }
        else {
            console.log("Lỗi tín hiệu");
        }

    });
    $("#btnOnController1").click(function () {
        $.ajax({
            url: "http://localhost:8000/controller",
            type: "post",
            data: {
                id: "sensor1",
                status: 1
            },
            dataType: "json",
            success: function (data) {
                console.log(data);
            },
            error: function () {
                console.log("Error post data");
            }

        });
       // $("#imgledSenssor1").attr("src", "/images/led-green-md.png");
    });
    $("#btnOffController1").click(function () {
        $.ajax({
            url: "http://localhost:8000/controller",
            type: "post",
            data: {
                id: "sensor1",
                status: 0
            },
            dataType: "json",
            success: function (data) {
                console.log(data);
            },
            error: function () {
                console.log("Error post data");
            }
        });
      //  $("#imgledSenssor1").attr("src", "/images/red-led-off-md.png");

    });

    $("#btnOnController2").click(function () {
        $.ajax({
            url: "http://localhost:8000/controller",
            type: "post",
            data: {
                id: "sensor2",
                status: 1
            },
            dataType: "json",
            success: function (data) {
                console.log(data);
            },
            error: function () {
                console.log("Error post data");
            }
        });
        $("#imgledSenssor2").attr("src", "/images/led-green-md.png");
    });
    $("#btnOffController2").click(function () {
        $.ajax({
            url: "http://localhost:8000/controller",
            type: "post",
            data: {
                id: "sensor2",
                status: 0
            },
            dataType: "json",
            success: function (data) {
                console.log(data);
            },
            error: function () {
                console.log("Error post data");
            }
        });
        $("#imgledSenssor2").attr("src", "/images/red-led-off-md.png");
    });
});
