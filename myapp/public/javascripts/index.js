
$(document).ready(function () {
  //Phần xử lý giao diện
  // var path = window.location.pathname.split("/").pop();
  // if(path == ''){
  //   path='/';
  // }
  // $('nav.navCustom ul.custom>li>a[href="'+path+'"]').parent().addClass('active');

  //Phần lấy data
  let es = new EventSource('/stream');
  let chart1 = drawChart("#line-chartcanvas1");
  let chart2 = drawChart("#line-chartcanvas2");
  es.onerror = function (e) { console.error("Mất tín hiệu", e); };
  es.onopen = function (e) { console.log("Kế nối thành công", e); };
  es.onmessage = function (e) {
    console.log(e.data);
    let date = getCurrentTime();
    $('span.dateCurrent').text(date);
    let json = JSON.parse(e.data);
    if (json.id == "cb1") {
      if (json.status == 1) {
        $("span#statusSensor1").text("On");
        $("span#statusSensor1").css("background", "green");
        let time = json.time;
        let temp = json.temp;
        let humi = json.humi;
        $("span#humiSensor1").text(humi);
        $("span#tempSensor1").text(temp);
        addDataChart(chart1, temp, humi, time);
      }
      else if (json.status == 0) {
        $("span#statusSensor1").text("Off");
        $("span#statusSensor1").css("background", "red");

        console.log("Sensor 1 is offline");
      }
    }
    else if (json.id == "cb2") {
      if (json.status == 1) {
        $("span#statusSensor2").text("On");
        $("span#statusSensor2").css("background", "green");
        let time = json.time;
        let temp = json.temp;
        let humi = json.humi;
        $("span#humiSensor2").text(humi);
        $("span#tempSensor2").text(temp);
        addDataChart(chart2, temp, humi, time);
      }
      else if (json.status == 0) {
        $("span#statusSensor2").text("Off");
        $("span#statusSensor2").css("background", "red");
        console.log("Sensor 2 is offline");
      }
    }

  }
  //Vẽ biểu đồ 1
  function drawChart(idChart) {
    let ctx = $(idChart);
    let options = {
      title: {
        display: true,
        position: "top",
        text: "Biểu đồ nhiệt độ và độ ẩm",
        fontSize: 18,
        fontColor: "#111",
        backgroundColor: "#ff6384",
      },
      legend: {
        display: true,
        position: "bottom"
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            suggestedMin: 30,
            suggestedMax: 50
          }
        }]
      }
    }
    let data = {
      labels: [],
      datasets: [
        {
          label: "Nhiệt độ",
          lineTension: 0.1,
          data: [],
          backgroundColor: "#DF0029",
          borderColor: "#F5A89A",
          fill: false,
          pointRadius: 3,

        },
        {
          label: "Độ ẩm",
          lineTension: 0.1,
          data: [],
          backgroundColor: "blue",
          borderColor: "lightblue",
          fill: false,
          pointRadius: 3
        }

      ]
    };
    let lineChart = new Chart(ctx, {
      type: "line",
      data: data,
      options: options
    });
    return lineChart;
  }

  function addDataChart(lineChart, temp, humi, time) {
    let i = lineChart.data.datasets[0].data.length;
    lineChart.data.labels.push(time);
    lineChart.data.datasets[0].data.push(temp);
    lineChart.data.datasets[1].data.push(humi);
    // dataLabel.push(label);
    // dataHumi.push(humi);
    // dataTemp.push(temp);
    if (i >= 10) {
      lineChart.data.labels.shift();
      lineChart.data.datasets[0].data.shift();
      lineChart.data.datasets[1].data.shift();
    }
    lineChart.update();
  }
  function getCurrentTime() {
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    var hour = currentDate.getHours();
    var min = currentDate.getMinutes();
    var sec = currentDate.getSeconds();
    var date = day + "/" + month + "/" + year + " " + hour + ":" + min + ":" + sec;
    return date;

  }
});



