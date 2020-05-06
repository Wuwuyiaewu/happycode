const CHART_0 = document.getElementById("lineChart_0");
let lineChart_0 = new Chart(CHART_0, {
  type: "line",
  data: {
    labels: ["", "PPI", "CPI", "PCE", "零售銷售", "GDP", ""],
    datasets: [
      {
        label: "黃金",
        fill: false,
        lineTension: 0,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(25,158,216)",
        borderWidth: 4,
        spanGaps: true,
        data: [, 5030, 4090, 3450, 3260, 2950, ,],
      },
      {
        label: "美油",
        fill: false,
        lineTension: 0,
        backgroundColor: "rgb(66, 22, 182)",
        borderColor: "rgb(204,153,0)",
        spanGaps: true,
        data: [, 3100, 3300, 4200, 3900, 3600, ,],
        borderDash: [10, 10],
      },
      {
        label: "TECH100",
        fill: false,
        lineTension: 0,
        backgroundColor: "rgb(66, 22, 182)",
        borderColor: "rgb(204,204,204)",
        spanGaps: true,
        data: [, 5166, 4146, 4330, 4596, 4880, ,],
        borderDash: [10, 10],
      },
    ],
  },
  options: {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
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
        backgroundColor: "rgb(66, 22, 182)",
        borderColor: "rgb(204,153,0)",
        spanGaps: true,
        borderWidth: 4,
        data: [, 3100, 3300, 4200, 3900, 3600, ,],
      },
      {
        label: "黃金",
        fill: false,
        lineTension: 0,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(25,158,216)",
        spanGaps: true,
        data: [, 5030, 4090, 3450, 3260, 2950, ,],
        borderDash: [10, 10],
      },
      {
        label: "TECH100",
        fill: false,
        lineTension: 0,
        backgroundColor: "rgb(66, 22, 182)",
        borderColor: "rgb(204,204,204)",
        spanGaps: true,
        data: [, 5166, 4146, 4330, 4596, 4880, ,],
        borderDash: [10, 10],
      },
    ],
  },
  options: {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
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
        backgroundColor: "rgb(66, 22, 182)",
        borderColor: "rgb(204,204,204)",
        spanGaps: true,
        borderWidth: 4,
        data: [, 5166, 4146, 4330, 4596, 4880, ,],
      },
      {
        label: "黃金",
        fill: false,
        lineTension: 0,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(25,158,216)",
        spanGaps: true,
        data: [, 5030, 4090, 3450, 3260, 2950, ,],
        borderDash: [10, 10],
      },
      {
        label: "美油",
        fill: false,
        lineTension: 0,
        backgroundColor: "rgb(66, 22, 182)",
        borderColor: "rgb(204,153,0)",
        spanGaps: true,
        data: [, 3100, 3300, 4200, 3900, 3600, ,],
        borderDash: [10, 10],
      },
    ],
  },
  options: {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  },
});
