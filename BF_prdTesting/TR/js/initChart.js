chartOption = {
    backgroundColor: "#fff",
    tooltip: {
        show: true,
        trigger: "axis",
        triggerOn: "mousemove|click",
        axisPointer: {
            type: "cross",
            label: {
                precision: 2,
                backgroundColor: 'rgba(0,0,0,0.4)'
            }
        },
        backgroundColor: 'rgba(0,0,0,0.4)',
        textStyle: {
            fontSize: 12
        },
        formatter: function(params, ticket, callback) {
            if (!params.length) {
                return
            }
            var name = params[0].name
            var data = params[0].data

            return `
                <div>${name}</div>
                <div>开: ${data[1]}</div>
                <div>收: ${data[2]}</div>
                <div>低: ${data[3]}</div>
                <div>高: ${data[4]}</div>
            `
        },
    },
    xAxis: [{
        show: true,
        scale: true,
        nameGap: 15,
        splitNumber: 5,
        boundaryGap: ['50%', '10%'],
        axisLine: {
            lineStyle: {
                color: '#4a657a'
            }
        },
        axisLabel: {
            show: true
        },
        axisTick: {
            show: true
        },
        data: data.times,
        axisPointer: {
            label: {
                padding: [2, 2, 2, 2],
                lineHeight: 0,
                margin: 0
            }
        }
    }],
    yAxis: [{
        position: "right",
        scale: true,
        axisLine: {
            lineStyle: {
                color: '#4a657a'
            }
        },
        axisLabel: {
            showMinLabel: false,
            inside: false,
            textStyle: {
                color: '#4a657a',
                fontSize: 10
            },
            formatter (value, index) {
                if (value === 0) {
                    return ''
                }
                return value
            }
        },
        splitLine: {
            show: true,
            lineStyle: {
                color: '#D0D0D0',
                type: 'dotted',
                opacity: 0.5
            }
        },
        axisTick: {
            inside: false,
            length: 4
        },
        axisPointer: {
            label: {
                padding: [2, 2, 2, 2],
                lineHeight: 0,
                margin: 0
            }
        }
    }],
    dataZoom: [{
        show: false,
        type: "inside",
    }],
    series: [{
        type: "candlestick",
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: data.datas,
        itemStyle: {
            color: riseColor,
            color0: fallColor,
            borderColor: riseColor,
            borderColor0: fallColor
        }
    }],
    grid: [{
        show: true,
        top: "10px",
        left: "0.5%",
        right: "0%",
        bottom: "20px",
        borderColor: 'transparent',
    }]
};

// 基于准备好的dom，初始化echarts实例
var chartPanel = document.getElementById('chart-panel')
var myChart = echarts.init(document.getElementById('chart-panel'));
// 使用刚指定的配置项和数据显示图表。
// myChart.setOption(chartOption);

var chartTimer = 0

chartPanel.addEventListener('touchend', function (params) {
    console.log('touchend')
    clearTimeout(chartTimer)
    chartTimer = setTimeout(function() {
        myChart.dispatchAction({
            type: 'hideTip'
        })
    }, 1000);
});

chartPanel.addEventListener('touchstart', function (params) {
    console.log('touchstart')
    clearTimeout(chartTimer)
});
