$(document).ready(function () {
  $('#datetimepicker').datetimepicker({
    format: 'L',
    format: 'DD/MM/YYYY',
    locale: 'vi'
  });
  $('#datetimepicker').datetimepicker();
  let chart1 = drawChart("#line-chartcanvas1");
  let chart2 = drawChart("#line-chartcanvas2");
  $('#btnXacNhan').on("click", function () {
    var datePicker = $('input[name=date]').val();
    var dataSend = {
      datePicker: datePicker,
    };
    $.ajax({
      type: "post",
      url: "http://localhost:8000/analysis/sensor1",
      data: dataSend,
      dataType: "json",
      success: function (data) {
        var dataGet = data.data;
        dataGet = JSON.parse(dataGet);
        var dataTemp=[32];
        var dataHumi = [70];
          for(var i=0;i<dataGet.tempFullDay.length;i++){
          let temp = Number(dataGet.tempFullDay[i]);
          dataTemp.push(temp);
        }
        for(var i=0;i<dataGet.humiFullDay.length;i++){
          let humi = Number(dataGet.humiFullDay[i]);
          dataHumi.push(humi);
        };
        addDataChart(chart1,dataTemp,dataHumi)
        console.log(dataTemp);
        console.log(dataHumi);

      },
      error: function (err) {
        console.log("Error post data");
      }
    });
    $.ajax({
      type: "post",
      url: "http://localhost:8000/analysis/sensor2",
      data: dataSend,
      dataType: "json",
      success: function (data) {
        var dataGet = data.data;
        dataGet = JSON.parse(dataGet);
        var dataTemp=[32];
        var dataHumi = [70];
          for(var i=0;i<dataGet.tempFullDay.length;i++){
          let temp = Number(dataGet.tempFullDay[i]);
          dataTemp.push(temp);
        }
        for(var i=0;i<dataGet.humiFullDay.length;i++){
          let humi = Number(dataGet.humiFullDay[i]);
          dataHumi.push(humi);
        };
        addDataChart(chart2,dataTemp,dataHumi)
        console.log(dataTemp);
        console.log(dataHumi);
      },
      error: function (err) {
        console.log("Error post data");
      }
    });
  });


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
      labels: ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00", "24:00"],
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
  function addDataChart(lineChart, tempArr, humiArr) {
    lineChart.data.datasets[0].data=tempArr;
    lineChart.data.datasets[1].data=humiArr;
 
    lineChart.update();
  }
});