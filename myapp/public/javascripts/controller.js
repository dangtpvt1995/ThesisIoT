$(document).ready(function () {
    var i = 0;
    while (i <= 100) {
        i++;
    }
    var visionA = true;
    var visionB = true;
    var firstime = false;
    var es1 = new EventSource('/controller/stream');
    es1.addEventListener('open', function (event) {
        console.log("Kết nối đã được mở")
    }, false);
    es1.addEventListener('error', function (event) {
        console.log("Kết nối đã đóng")
    }, false);
    setInterval(function(err){
        let date=getCurrentTime();
        let dateTime= date[0]+"--"+date[1];
        $('#clock').text(dateTime);
    },1000);
    es1.addEventListener('message', function (e) {
        console.log(e.data.toString());
        var data = JSON.parse(e.data);
        var id = e.lastEventId;
        var content = data.content;
        if (data && id) {
            if (content == "ledRes") {
                var status = Number(data.status);
                console.log(status);
                if (id === "vdkA") {
                    if (visionA == true) {
                        if (status === 1) {
                            $("#imgledvdkA").attr("src", "/images/led-green-md.png");
                            $('#btnControllervdkA').prop("value", "OFF");
                            $('#btnControllervdkA').css("background", "red");
                            $('#btnControllervdkA').prop('disabled', false);
                        }
                        else {
                            $("#imgledvdkA").attr("src", "/images/red-led-off-md.png");
                            $('#btnControllervdkA').prop("value", "ON");
                            $('#btnControllervdkA').css("background", "green");
                            $('#btnControllervdkA').prop('disabled', false);

                        }
                    }

                }
                if (id === "vdkB") {
                    if (visionB == true) {
                        if (status === 1) {
                            $("#imgledvdkB").attr("src", "/images/led-green-md.png");
                            $('#btnControllervdkB').prop('disabled', false);
                            $('#btnControllervdkB').prop("value", "OFF");
                            $('#btnControllervdkB').css("background", "red");
                        }
                        else {
                            $("#imgledvdkB").attr("src", "/images/red-led-off-md.png");
                            $('#btnControllervdkB').prop('disabled', false);
                            $('#btnControllervdkB').prop("value", "ON");
                            $('#btnControllervdkB').css("background", "green");
                        }
                    }

                }
            }
            //Đây là content cấp cao nhất có quyền off mọi thứ khi status =0
            if (content == "supervision") {
                if (id == "vdkA") {
                    let id = data.id;
                    let status = Number(data.status);
                    let day = getCurrentTime();
                    $('#vdkAId').text(id);
                    if (status == 1) {
                        visionA = true;
                        $('#statusvdkA').css("background", "green");
                    }
                    else {
                        visionA = false;
                        $('#statusvdkA').css("background", "red");
                        $("#imgledvdkA").attr("src", "/images/red-led-off-md.png");
                        $("#vdkJob1A").attr("src", "/images/red-led-off-md.png");
                        $("#vdkJob3A").attr("src", "/images/red-led-off-md.png");
                        $('#msgvdkA').text("");
                    }
                }
                if (id == "vdkB") {
                    let id = data.id;
                    let status = Number(data.status);
                    let day = getCurrentTime();
                    $('#vdkBId').text(id);
                    if (status == 1) {
                        visionB = true;
                        $('#statusvdkB').css("background", "green");
                    }
                    else {
                        visionB = false;
                        $('#statusvdkB').css("background", "red");
                        $("#imgledvdkB").attr("src", "/images/red-led-off-md.png");
                        $("#vdkJob2B").attr("src", "/images/red-led-off-md.png");
                        $("#vdkJob4B").attr("src", "/images/red-led-off-md.png");
                        $('#msgvdkB').text("");
                    }
                }
                if (id == "webApp") {
                    let id = data.id;
                    let status = Number(data.status);
                    let day = getCurrentTime();
                    let date = day[1];
                    $('#appWebId').text(id);
                    if (status == 1) {
                        $('#statusWebApp').css("background", "green");
                        $('#timeWebApp').text(date);
                    }
                    else {
                        $('#timeOutWebApp').text(date);
                        $('#statusWebApp').css("background", "red");
                    }
                }
                if (id == "mobiApp") {
                    let id = data.id;
                    let status = Number(data.status);
                    let day = getCurrentTime();
                    let date = day[1];
                    $('#mobiAppId').text(id);
                    if (status == 1) {
                        $('#statusMobi').css("background", "green");
                        $('#timeMobi').text(date);
                        $('#timeOutMobi').text("");
                    }
                    else {
                        $('#timeOutMobi').text(date);
                        $('#statusMobi').css("background", "red");
                    }
                }
                firstime = false;
            }
            if (content === "err") {
                var errCode = data.errCode;
                if (id == "vdkA") {
                    if (visionA) {
                        if (errCode === "ERRSSDHT11OFF") {
                            $('#msgvdkA').css("color", "red");
                            $('#msgvdkA').text("Không nhận được tín hiệu từ cảm biến DHT11")
                        }
                    }
                }
                if (id == "vdkB") {
                    if (visionB) {
                        if (errCode === "ERRSSDHT11OFF") {
                            $('#msgvdkB').css("color", "red");
                            $('#msgvdkB').text("Không nhận được tín hiệu từ cảm biến DHT11")
                        }
                    }
                }
            }
            if (content == "vdkWork") {
                let status = (data.status);
                let count = data.countJobWork;
                $('#countWork').text(count);
                if (status == "0000") {
                    if (visionA) {
                        $("#vdkJob1A").attr("src", "/images/red-led-off-md.png");
                        $("#vdkJob3A").attr("src", "/images/red-led-off-md.png");
                    }
                    if (visionB) {
                        $("#vdkJob2B").attr("src", "/images/red-led-off-md.png");
                        $("#vdkJob4B").attr("src", "/images/red-led-off-md.png");
                    }
                }
                else if (status == "0001") {
                    if (visionA) {
                        $("#vdkJob1A").attr("src", "/images/led-green-md.png");
                    }
                }
                else if (status == "0011") {
                    if (visionA) {
                        $("#vdkJob1A").attr("src", "/images/led-green-md.png");
                    }
                    if (visionB) {
                        $("#vdkJob2B").attr("src", "/images/led-green-md.png");
                    }
                }
                else if (status == "0111") {
                    if (visionA) {
                        $("#vdkJob1A").attr("src", "/images/led-green-md.png");
                        $("#vdkJob3A").attr("src", "/images/led-green-md.png");
                    }
                    if (visionB) {
                        $("#vdkJob2B").attr("src", "/images/led-green-md.png");
                    }
                }
                else if (status == "1111") {
                    
                    if (visionA) {
                        $("#vdkJob1A").attr("src", "/images/led-green-md.png");
                        $("#vdkJob3A").attr("src", "/images/led-green-md.png");
                    }
                    else {
                        if (!firstime) {
                            alert("Vi điều khiển A không hoạt động");
                        }
                    }
                    if (visionB) {
                        $("#vdkJob2B").attr("src", "/images/led-green-md.png");
                        $("#vdkJob4B").attr("src", "/images/led-green-md.png");
                    }
                    else {
                        if (!firstime) {
                            alert("Vi điều khiển B không hoạt động");
                        }
                    }
                }
            }
            if (content === "checkSensor") {
                if (id == "vdkA") {
                    $('#msgvdkA').text("");
                }
                if (id == "vdkB") {
                    $('#msgvdkB').text("");
                }
            }
            if(content === "checkTime"){
                if(id=="vdkA"){
                    let timein = data.timein;
                    let timeout = data.timeout;
                    $('#timevdkA').text(timein);
                    $('#timeOutvdkA').text(timeout);
                }
                if(id=="vdkB"){
                    let timein = data.timein;
                    let timeout = data.timeout;
                    $('#timevdkB').text(timein);
                    $('#timeOutvdkB').text(timeout);
                }
               
            }
        }
        else {
            console.log("Lỗi tín hiệu");
        }

    });

    $("#btnControllervdkA").click(function () {
        var statusBtnConVdka = $('#btnControllervdkA').val();
        if (statusBtnConVdka === "ON") {
            var data = {
                id: "vdkA",
                status: 1
            };
            $('#btnControllervdkA').prop('disabled', true);
            $('#btnControllervdkA').prop("value", "....");
            $('#btnControllervdkA').css("background", "gray");

        }
        else {
            var data = {
                id: "vdkA",
                status: 0
            };
            $('#btnControllervdkA').prop('disabled', true);
            $('#btnControllervdkA').prop("value", "....");
            $('#btnControllervdkA').css("background", "gray");
        }
        $.ajax({
            url: "http://localhost:8000/controller",
            type: "post",
            data: data,
            dataType: "json",
            success: function (data) {
                console.log("Success");
            },
            error: function () {
                console.log("Error post data");
            }
        });
    });
    $("#btnControllervdkB").click(function () {
        var statusBtnConVdkb = $('#btnControllervdkB').val();
        if (statusBtnConVdkb === "ON") {
            var data = {
                id: "vdkB",
                status: 1
            };
            $('#btnControllervdkB').prop('disabled', true);
            $('#btnControllervdkB').prop("value", "....");
            $('#btnControllervdkB').css("background", "gray");
        }
        else {
            var data = {
                id: "vdkB",
                status: 0
            };
            $('#btnControllervdkB').prop('disabled', true);
            $('#btnControllervdkB').prop("value", "....");
            $('#btnControllervdkB').css("background", "gray");
        }

        console.log(data);
        $.ajax({
            url: "http://localhost:8000/controller",
            type: "post",
            data: data,
            dataType: "json",
            success: function (data) {
                console.log(data);
            },
            error: function () {
                console.log("Error post data");
            }
        });
    });
    $('#btnStart').click(function () {
        var data={
            id:"vdkReset",
            status:1
        }
        $.ajax({
            url: "http://localhost:8000/controller",
            type: "post",
            data: data,
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
    function getCurrentTime() {
        var currentDate = new Date();
        var day = currentDate.getDate();
        var month = (currentDate.getMonth() + 1) < 10 ? "0" + currentDate.getMonth() + 1 : currentDate.getMonth() + 1;
        var year = currentDate.getFullYear();
        var hour = currentDate.getHours() < 10 ? "0" + currentDate.getHours() : currentDate.getHours();
        var min = currentDate.getMinutes() < 10 ? "0" + currentDate.getMinutes() : currentDate.getMinutes();
        var sec = currentDate.getSeconds() < 10 ? "0" + currentDate.getSeconds() : currentDate.getSeconds();
        var date = year + "/" + month + "/" + day;
        var time = hour + ":" + min + ":" + sec
        var dateSend = [date, time]
        return dateSend;
    
    }
});
