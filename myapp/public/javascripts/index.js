
$(document).ready(function () {
  let es = new EventSource('/stream');
  let chartTemp1 = drawChart("#line-chartcanvasTemp1", "Nhiệt độ", 28, 35, "#EC870E", "#EC870E");
  let chartHumi1 = drawChart("#line-chartcanvasHumi1", "Độ ẩm", 70, 80, "#205AA7", "#205AA7");
  let chartTemp2 = drawChart("#line-chartcanvasTemp2", "Nhiệt độ", 28, 35, "#EC870E", "#EC870E");
  let chartHumi2 = drawChart("#line-chartcanvasHumi2", "Độ ẩm", 70, 80, "#205AA7", "#205AA7");
  setInterval(function () {
    var date = getCurrentTime();
    $('span.dateCurrent').text(date);
  }, 1000);
  es.onerror = function (e) { console.error("Mất tín hiệu", e); };
  es.onopen = function (e) { console.log("Kế nối thành công", e); };
  es.onmessage = function (e) {
    var data = JSON.parse(e.data);
    var content = data.content;
    var id = e.lastEventId;
    console.log(id);
    console.log(data.status)
    if (id === "vdkA") {
      if (content === "dataSensor") {
        $('#statusVdkASensor').css("background", "green");
        let time = data.time;
        let temp = data.temp;
        let humi = data.humi;
        $("span#humiSensor1").text(humi);
        $("span#tempSensor1").text(temp);
        addDataChart(chartTemp1, temp, time);
        addDataChart(chartHumi1, humi, time);
      }
      if (content === "clientStatus") {
        let status = Number(data.status);
        if (status === 1) {
          $('#statusVdkA').css("background", "green");
        }
        else {
          $('#statusVdkA').css("background", "red");
          $('#statusVdkASensor').css("background", "red");
          $('#statusVdkALed').css("background", "red");
        }
      }
      if (content === "err") {
        var errCode = data.errCode;
        if (errCode === "ERRSSDHT11OFF") {
          $('#statusVdkASensor').css("background", "red");
        }
      }
      if (content === "ledRes") {
        let status = Number(data.status);
        if (status === 1) {
          $('#statusVdkALed').css("background", "green");
        }
        else {
          $('#statusVdkALed').css("background", "red");
        }
      }
    }
    if (id === "vdkB") {
      if (content === "dataSensor") {
        $('#statusVdkBSensor').css("background", "green");
        let time = data.time;
        let temp = data.temp;
        let humi = data.humi;
        $("span#humiSensor2").text(humi);
        $("span#tempSensor2").text(temp);
        addDataChart(chartTemp2, temp, time);
        addDataChart(chartHumi2, humi, time);
      }
      if (content == "clientStatus") {
        let status = Number(data.status);
        if (status === 1) {
          $('#statusVdkB').css("background", "green");
        }
        else {
          $('#statusVdkB').css("background", "red");
          $('#statusVdkBSensor').css("background", "red");
          $('#statusVdkBLed').css("background", "red");
        }
      }
      if (content == "err") {
        var errCode = data.errCode;
        if (errCode === "ERRSSDHT11OFF") {
          // $('#statusVdkBSensor').text("OFF");
          $('#statusVdkBSensor').css("background", "red");
        }
      }
      if (content == "ledRes") {
        let status = Number(data.status);
        if (status === 1) {
          $('#statusVdkBLed').css("background", "green");
        }
        else {
          $('#statusVdkBLed').css("background", "red");
        }
      }
    }

  }
  //Vẽ biểu đồ 1
  function drawChart(idChart, label, min, max, borderColor, titleColor) {
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
            suggestedMin: min,
            suggestedMax: max
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

  function addDataChart(lineChart, value, time) {
    let i = lineChart.data.datasets[0].data.length;
    lineChart.data.labels.push(time);
    lineChart.data.datasets[0].data.push(value);
    if (i >= 10) {
      lineChart.data.labels.shift();
      lineChart.data.datasets[0].data.shift();
    }
    lineChart.update();
  }
  function getCurrentTime() {
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = (currentDate.getMonth() + 1) < 10 ? "0" + currentDate.getMonth() + 1 : currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    var hour = currentDate.getHours() < 10 ? "0" + currentDate.getHours() : currentDate.getHours();
    var min = currentDate.getMinutes() < 10 ? "0" + currentDate.getMinutes() : currentDate.getMinutes();
    var sec = currentDate.getSeconds() < 10 ? "0" + currentDate.getSeconds() : currentDate.getSeconds();
    var date = day + "/" + month + "/" + year + " " + hour + ":" + min + ":" + sec;
    return date;

  }
  window.onload = function () {
    $.get('http://localhost:8000/load', function () {
      console.log("Đã reconect");
    });
  }
});



