$(document).ready(function () {

    var es1 = new EventSource('/controller/stream');
    es1.addEventListener('open', function (event) {
        console.log("Kết nối đã được mở")
    }, false);
    es1.addEventListener('error', function (event) {
        console.log("Kết nối đã đóng")
    }, false);

    es1.addEventListener('message', function (e) {
        console.log(e.data);
        var data = JSON.parse(e.data);
        console.log(e.data);
        var id = e.lastEventId;
        var content = data.content;
        if (data && id) {
            if (content == "online") {
                var status = data.status;
                if (id == "led1") {
                    if (status == 1) {
                        $("#imgledSenssor1").attr("src", "/images/led-green-md.png");
                    }
                    else {
                        $("#imgledSenssor1").attr("src", "/images/red-led-off-md.png");

                    }

                }
                else if (id == "led2") {
                    if (status == 1) {
                        $("#imgledSenssor2").attr("src", "/images/led-green-md.png");
                    }
                    else {
                        $("#imgledSenssor2").attr("src", "/images/red-led-off-md.png");

                    }

                }
            }
            else if (content == "offline") {
               if(id=="led1"){
                $("#imgledSenssor1").attr("src", "/images/led-off.png");
               }
               else if(id=="led2"){
                $("#imgledSenssor2").attr("src", "/images/led-off.png");  
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
        // $("#imgledSenssor2").attr("src", "/images/led-green-md.png");
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
    });
    window.onload = function () {
        $.get('http://localhost:8000/controller/load', function () {
            console.log("Đã reconect");
        });
    }
});
