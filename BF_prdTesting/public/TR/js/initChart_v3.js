// ecahrt在线定制 https://echarts.apache.org/zh/builder.html
// 图表：折线图Line, K线图Candlestick
// 坐标系：直角坐标系Grid
// 组件：提示框Tooltip，数据区域缩放DataZoom
// 工具集+代码压缩

var defaultSeries = tagType === 'timeSharing' ? {
    type: 'line',
    smooth: true,
    symbol: 'none',
    sampling: 'average',
    itemStyle: {
        color: '#477fd3'
    },
    areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(71,127,211,0.3)'
        }, {
            offset: 1,
            color: 'rgba(71,127,211,0.1)'
        }])
    },
    data: data.datas
} : {
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
}

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
            fontSize: 10
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
            show: true,
            fontSize: 10,
            margin: 6
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
        },
    }],
    yAxis: [{
        position: "left",
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
            margin: 8,
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
    series: defaultSeries,
    grid: [
    //     {
    //     show: true,
    //     top: "10px",
    //     left: "18px",
    //     right: "0%",
    //     bottom: "20px",
    //     borderColor: 'transparent',
    // }
        {
            show: true,
            top: "6px",
            left: "30px",
            right: "2px",
            bottom: "18px",
            borderColor: 'transparent',
        }
    ]
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
