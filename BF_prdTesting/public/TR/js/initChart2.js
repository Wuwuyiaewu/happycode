// 基于准备好的dom，初始化echarts实例
var chartPanel2 = document.getElementById('chart-panel2')
var myChart2 = echarts.init(chartPanel2);
// 使用刚指定的配置项和数据显示图表。
// myChart.setOption(chartOption);

var chartTimer2 = 0

chartPanel2.addEventListener('touchend', function (params) {
    console.log('touchend')
    clearTimeout(chartTimer2)
    chartTimer2 = setTimeout(function() {
        myChart.dispatchAction({
            type: 'hideTip'
        })
    }, 1000);
});

chartPanel2.addEventListener('touchstart', function (params) {
    console.log('touchstart')
    clearTimeout(chartTimer2)
});
