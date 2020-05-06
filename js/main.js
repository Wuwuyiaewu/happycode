const CHART = document.getElementById("lineChart");
console.log(CHART);

let lineChart = new Chart(CHART, {
  type: "line",
  data: {
    labels: ["", "PPI", "CPI", "PCE", "零售銷售", "GDP", ""],
    datasets: [
      {
        label: "My First dataset",
        fill: false,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        spanGaps: true,
        data: [, 25, 33, 46, 71, 46, ,],
        borderDash: [10,5]
      },
      {
        label: "My Second dataset",
        fill: false,
        backgroundColor: "rgb(66, 22, 182)",
        borderColor: "rgb(182, 99, 66)",
        spanGaps: true,
        data: [, 80, 73, 52, 87, 50, ,],
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
