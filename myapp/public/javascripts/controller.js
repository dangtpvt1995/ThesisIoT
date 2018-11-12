$(document).ready(function () {

    var es = new EventSource('/controller/stream');
    es.addEventListener('open',function (event) { 
        console.log("Kết nối đã được mở")
     },false);
     es.addEventListener('error',function(event){
         console.log("Kết nối đã đóng")
     },false);
     
    es.addEventListener('message',function (e) {
        var data = JSON.parse(e.data);
        console.log(data);
        if (data) {
            if (data.isDone) {
                if (data.status == 1) {
                    if (data.id == "sensor1") {
                        $("#imgledSenssor1").attr("src", "/images/led-green-md.png");
                    }
                    else {
                        $("#imgledSenssor2").attr("src", "/images/led-green-md.png");
                    }

                }
                else if (data.status == 0) {
                    if (data.id == "sensor1") {
                        $("#imgledSenssor1").attr("src", "/images/red-led-off-md.png");
                    }
                    else {
                        $("#imgledSenssor2").attr("src", "/images/red-led-off-md.png");
                    }

                }
            }
            else {
                console.log("Lỗi tín hiệu");
            }
        }
        else {
            console.log("Không có data");
        }
    });
    $("#btnOnController1").click(function () {
        $.ajax({
            url:"http://localhost:8000/controller",
            type:"post",
            data:{
                id:"sensor1",
                status:1        
            },
            dataType:"json",
            success:function(data){
                console.log(data);
            },
            error:function(){
                console.log("Error post data");
            }

        });
        $("#imgledSenssor1").attr("src", "/images/led-green-md.png");
    });
    $("#btnOffController1").click(function () {
        $.ajax({
            url:"http://localhost:8000/controller",
            type:"post",
            data:{
                id:"sensor1",
                status:0
            },
            dataType:"json",
            success:function(data){
                console.log(data);
            },
            error:function(){
                console.log("Error post data");
            }
        });
        $("#imgledSenssor1").attr("src", "/images/red-led-off-md.png");
       
    });
    
    $("#btnOnController2").click(function () {
        $.ajax({
            url:"http://localhost:8000/controller",
            type:"post",
            data:{
                id:"sensor2",
                status:1        
            },
            dataType:"json",
            success:function(data){
                console.log(data);
            },
            error:function(){
                console.log("Error post data");
            }
        });
        $("#imgledSenssor2").attr("src", "/images/led-green-md.png");
    });
    $("#btnOffController2").click(function () {
        $.ajax({
            url:"http://localhost:8000/controller",
            type:"post",
            data:{
                id:"sensor2",
                status:0
            },
            dataType:"json",
            success:function(data){
                console.log(data);
            },
            error:function(){
                console.log("Error post data");
            }
        });
        $("#imgledSenssor2").attr("src", "/images/red-led-off-md.png");
    });
});
