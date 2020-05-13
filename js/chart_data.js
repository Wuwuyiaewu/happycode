let lineGold = [, 5030, 4090, 3450, 3260, 7000, ,];
let lineOil = [, 3100, 3300, 4200, 3900, 3600, ,];
let lineTech = [, 5166, 4146, 4330, 4596, 4880, ,];
function change(value) {
  lineGold[1] = value * 1;
  console.log(value, lineGold[1]);
  getChartData();
}
window.onload = function () {
  getChartData();
};
Chart.Legend.prototype.afterFit = function () {
  this.height = this.height + 0;
};
function getChartData() {
  const CHART_0 = document.getElementById("lineChart_0");
  let lineChart_0 = new Chart(CHART_0, {
    type: "line",
    data: {
      labels: ["", "PPI", "CPI", "PCE", "零售銷售", "GDP", ""],
      showInLegend: false,
      datasets: [
        {
          label: "黃金",
          fill: false,
          lineTension: 0,
          backgroundColor: "rgb(255, 255, 255)",
          borderColor: "rgb(231, 222, 191)",
          borderWidth: 7,
          spanGaps: true,
          data: lineGold,
        },
        {
          label: "美油",
          fill: false,
          lineTension: 0,
          backgroundColor: "rgb(255, 255, 255)",
          borderColor: "rgb(159, 157, 145)",
          borderWidth: 1,
          spanGaps: true,
          data: lineOil,
          // borderDash: [10, 10],
        },
        {
          label: "TECH100",
          fill: false,
          lineTension: 0,
          backgroundColor: "rgb(255, 255, 255)",
          borderColor: "rgb(192, 199, 207)",
          borderWidth: 1,
          spanGaps: true,
          data: lineTech,
          // borderDash: [10, 10],
        },
      ],
    },
    options: {
      scales: {
        xAxes: [
          {
            ticks: {
              fontSize: 16,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              max: 10000,
              min: 200,
            },
          },
        ],
      },
      legend: {
        display: false,
      },
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2,
    },
  });

  const CHART_1 = document.getElementById("lineChart_1");
  let lineChart_1 = new Chart(CHART_1, {
    type: "line",
    data: {
      labels: ["", "PPI", "CPI", "PCE", "零售銷售", "GDP", ""],
      datasets: [
        {
          label: "美油",
          fill: false,
          lineTension: 0,
          backgroundColor: "rgb(159, 157, 145)",
          borderColor: "rgb(159, 157, 145)",
          spanGaps: true,
          borderWidth: 7,
          data: lineOil,
        },
        {
          label: "黃金",
          fill: false,
          lineTension: 0,
          backgroundColor: "rgb(231, 222, 191)",
          borderColor: "rgb(231, 222, 191)",
          spanGaps: true,
          data: lineGold,
          // borderDash: [10, 10],
        },
        {
          label: "TECH100",
          fill: false,
          lineTension: 0,
          backgroundColor: "rgb(192, 199, 207)",
          borderColor: "rgb(192, 199, 207)",
          spanGaps: true,
          data: lineTech,
          // borderDash: [10, 10],
        },
      ],
    },
    options: {
      scales: {
        xAxes: [
          {
            ticks: {
              fontSize: 16,
            },
          },
        ],
      },
    },
  });

  const CHART_2 = document.getElementById("lineChart_2");
  let lineChart_2 = new Chart(CHART_2, {
    type: "line",
    data: {
      labels: ["", "PPI", "CPI", "PCE", "零售銷售", "GDP", ""],
      datasets: [
        {
          label: "TECH100",
          fill: false,
          lineTension: 0,
          backgroundColor: "rgb(192, 199, 207)",
          borderColor: "rgb(192, 199, 207)",
          spanGaps: true,
          borderWidth: 7,
          data: lineTech,
        },
        {
          label: "黃金",
          fill: false,
          lineTension: 0,
          backgroundColor: "rgb(231, 222, 191)",
          borderColor: "rgb(231, 222, 191)",
          spanGaps: true,
          data: lineGold,
          // borderDash: [10, 10],
        },
        {
          label: "美油",
          fill: false,
          lineTension: 0,
          backgroundColor: "rgb(159, 157, 145)",
          borderColor: "rgb(159, 157, 145)",
          spanGaps: true,
          data: lineOil,
          // borderDash: [10, 10],
        },
      ],
    },
    options: {
      scales: {
        xAxes: [
          {
            ticks: {
              fontSize: 16,
            },
          },
        ],
      },
    },
  });
}
