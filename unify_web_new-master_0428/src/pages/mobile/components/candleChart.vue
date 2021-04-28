<template>
    <div ref='chart' class='lightweightCharts'>
        <div ref='norm' class='norm'>
            <div class='left'>
                <van-button class='maBtn' disabled size='mini' type='info'>
                    MA
                </van-button>
            </div>
            <div class='right'>
                <span class='typeval'>
                    (5,10,20,30,60)
                </span>
                <span class='maItem ma1_color'>
                    MA1:{{ ma1|priceDigit(priceFormat.precision) }}
                </span>
                <span class='maItem ma2_color'>
                    MA2:{{ ma2|priceDigit(priceFormat.precision) }}
                </span>
                <span class='maItem ma3_color'>
                    MA3:{{ ma3|priceDigit(priceFormat.precision) }}
                </span>
                <span class='maItem ma4_color'>
                    MA4:{{ ma4|priceDigit(priceFormat.precision) }}
                </span>
                <span class='maItem ma5_color'>
                    MA5:{{ ma5|priceDigit(priceFormat.precision) }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { createChart } from 'lightweight-charts'
import { maLineData, average_close } from '@/utils/klineData'
import { style } from '@/config'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
dayjs.extend(weekOfYear)
const timeZone = dayjs().utcOffset() // 时区，单位为分钟

// 防抖
function debounce (fn, timer) {
    return function () {
        const that = this
        const args = arguments
        clearTimeout(fn.id)
        fn.id = setTimeout(function () {
            fn.apply(that, args)
        }, timer || 400)
    }
}
const types = {
    '1min': 1 * 60,
    '5min': 5 * 60,
    '15min': 15 * 60,
    '30min': 30 * 60,
    '1hour': 60 * 60,
    '4hour': 4 * 60 * 60,
    'day': 1 * 24 * 60 * 60,
    'week': 7 * 24 * 60 * 60,
    'month': 31 * 24 * 60 * 60,
}
export default {
    name: 'CandleChart',
    props: {
        data: {
            type: Array,
            default: []
        },
        isapp: Boolean,
        product: Object,
        candleKType: String,
        priceFormat: {
            type: Object,
            default: { type: 'price', precision: 2 }
        },
        height: {
            type: Number,
            default: 150
        }
    },
    data () {
        return {
            crosshairVisible: false,
            ma1: '',
            ma2: '',
            ma3: '',
            ma4: '',
            ma5: '',
        }
    },
    computed: {
        chartData () {
            return this.data.map(el => Object.assign({}, el, { time: Math.round(el.time + timeZone * 60) }))
        },
        userConfigInfo () {
            return this.$store.state.userConfigInfo
        }
    },
    watch: {
        data (newval, oldval) {
            // if (newval == oldval) return;
            // const newList = JSON.parse(JSON.stringify(newval))
            // newList.forEach(el => {
            //     el.time = dayjs(el.time * 1000).format('YYYY-MM-DD HH:mm')
            //     if (!el.open || !el.high || !el.low || !el.close || !el.time) {
            //         console.log(11);
            //     }
            // })
            // console.log('newval', newList)
            this.setData()
        },
        'product.cur_price' (newval) {
            const series = this.series
            const tm = this.product.tm
            if (!series || !tm) return
            const last = series._series.data().bars().last()
            if (!last || !last.value) return
            const lastVal = last.value
            const lastTime = last.time.timestamp
            const newTime = lastTime
            let isSameCandleChart = false
            const candleKType = this.candleKType
            if (candleKType === 'month' && dayjs(lastTime * 1000).format('YYYY-MM') === dayjs(tm * 1000).format('YYYY-MM')) {
                isSameCandleChart = true
            } else if (candleKType === 'week' && dayjs(lastTime * 1000).week() === dayjs(tm * 1000).week()) {
                isSameCandleChart = true
            } else if (candleKType === 'day' && dayjs(lastTime * 1000).format('YYYY-MM-DD') === dayjs(tm * 1000).format('YYYY-MM-DD')) {
                isSameCandleChart = true
            } else if (tm + timeZone * 60 < lastTime) {
                isSameCandleChart = true
            }
            if (isSameCandleChart) {
                series.update({
                    time: lastTime,
                    close: newval * 1,
                    open: lastVal[0],
                    high: Math.max(newval, lastVal[1]),
                    low: Math.min(newval, lastVal[2])
                })
            } else if (types[this.candleKType]) {
                this.$emit('loadCandleLatelyData', lastTime - timeZone * 60 + types[this.candleKType]) // lastTime 值多了8个时区
            }
            if (!this.crosshairVisible) this.maDately()
        }
    },
    mounted () {
        this.createChart()
        if (process.env.NODE_ENV === 'development') window['chartVM'] = this
    },
    methods: {
        // 创建图表
        createChart () {
            const style = this.$store.getters.style
            const chartDOM = this.$refs.chart
            const norm = this.$refs.norm

            var container = document.createElement('div')
            chartDOM.appendChild(container)

            var width = chartDOM.clientWidth
            var height = this.height - norm.clientHeight
            var language = this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.language

            var chart = createChart(container, {
                priceScale: {
                    position: 'left',
                    borderColor: 'rgba(197, 203, 206, 1)',
                },
                handleScroll: { // 禁用图表上下滑动，让网页可以上下滑动
                    vertTouchDrag: false,
                },
                handleScale: { // 禁用图表上下缩放，让网页可以上下滑动
                    axisPressedMouseMove: false,
                },
                localization: {
                    dateFormat: 'yyyy-MM-dd',
                    locale: language === 'en-US' ? 'en-US' : 'zh-CN',
                },
                timeScale: {
                    timeVisible: /(min|hour)$/.test(this.candleKType),
                    secondsVisible: false,
                    borderColor: 'rgba(197, 203, 206, 1)',
                },
            })
            // console.log(this.userConfigInfo.type)
            // console.log(chart)
            chart.resize(height, width)
            this.chart = chart
            const data = this.chartData

            const priceFormat = this.priceFormat
            const precision = priceFormat.precision
            let upColor = style.riseColor
            let downColor = style.fallColor
            if (this.isapp && this.$route.query.up) {
                upColor = this.$route.query.up
            }
            if (this.isapp && this.$route.query.down) {
                downColor = this.$route.query.down
            }
            const series = chart.addCandlestickSeries({
                overlay: false,
                priceFormat: {
                    type: priceFormat.type,
                    precision: priceFormat.precision,
                    minMove: Math.pow(0.1, precision).toFixed(precision) * 1,
                },
                upColor: upColor,
                downColor: downColor,
                borderUpColor: upColor,
                borderDownColor: downColor,
                wickUpColor: upColor,
                wickDownColor: downColor
            })
            series.setData(data)
            this.series = series

            this.setData_maLine() // 设置ma均线
            this.bindEvent(container, chart, series)
        },
        // 滑动事件
        bindEvent (container, chart, series) {
            const that = this
            const style = this.$store.getters.style
            const chartDOM = this.$refs.chart
            var width = chartDOM.clientWidth
            var height = this.height
            // 加载旧数据
            function loadNewData (param) {
                const from = param.from // 可见数据范围内第一条数据的time
                const bars = series._series.data().bars()
                const barsData = bars.ai || bars.vi
                const fromIndex = barsData.findIndex(el => el.time.timestamp === from)
                if (fromIndex > 60) return
                // console.log('loadPrevData launch', from);
                that.$emit('loadPrevData')
            }
            var debounceAdd = debounce(loadNewData)
            // 监听可见数据范围发生变化
            chart.subscribeVisibleTimeRangeChange(debounceAdd)
            // window['chart'] = chart;
            // window['series'] = series;

            var toolTipMargin = 10
            var priceScaleWidth = 50
            var toolTip = document.createElement('div')
            toolTip.className = 'three-line-legend'
            container.appendChild(toolTip)

            function setLastBarText () {
                if (!data || data.length == 0) return
                var dateStr = data[data.length - 1].time.year + ' - ' + data[data.length - 1].time.month + ' - ' + data[data.length - 1].time.day
                toolTip.innerHTML = '<div style="font-size: 24px; margin: 4px 0px; color: #20262E"> AEROSPACE</div>' + '<div style="font-size: 22px; margin: 4px 0px; color: #20262E">' + data[data.length - 1].value + '</div>' +
                    '<div>' + dateStr + '</div>'
            }
            const priceFormat = this.priceFormat
            const precision = priceFormat.precision
            chart.subscribeCrosshairMove(function (param) {
                if (param === undefined || param.time === undefined || param.point.x < 0 || param.point.x > width || param.point.y < 0 || param.point.y > height) {
                    // setLastBarText();
                    toolTip.innerHTML = ''
                    that.crosshairVisible = false
                    that.maDately()
                } else {
                    // dateStr = param.time.year + ' - ' + param.time.month + ' - ' + param.time.day;
                    that.crosshairVisible = true
                    const seriesPrices = param.seriesPrices
                    const price = seriesPrices.get(series)
                    if (!price) return toolTip.innerHTML = ''
                    const close = getPrevClose(param.time)
                    const divStr = `<div>
                                        <span style="color:${getColor(close, price.open)}">${that.$t('chart.open')}:${price.open.toFixed(precision)}</span>
                                        <span style="color:${getColor(close, price.close)}"> ${that.$t('chart.close')}:${price.close.toFixed(precision)}</span>
                                        <span style="color:${getColor(close, price.high)}"> ${that.$t('chart.high')}:${price.high.toFixed(precision)}</span>
                                        <span style="color:${getColor(close, price.low)}"> ${that.$t('chart.low')}:${price.low.toFixed(precision)}</span>
                                    </div>`
                    toolTip.innerHTML = divStr
                    that.ma1 = seriesPrices.get(that.lineSeries_5)
                    that.ma2 = seriesPrices.get(that.lineSeries_10)
                    that.ma3 = seriesPrices.get(that.lineSeries_20)
                    that.ma4 = seriesPrices.get(that.lineSeries_30)
                    that.ma5 = seriesPrices.get(that.lineSeries_60)
                }
            })

            // 获取上一条数据的收盘价
            function getPrevClose (time) {
                if (!time) return false
                const bars = series._series.bars()
                const barsData = bars.ai || bars.vi
                const itemIndex = barsData.findIndex(el => el.time.timestamp === time)
                const item = barsData[itemIndex - 1]
                if (!item) return false
                return item.value[3] // item.value是个[开,高,低,收，null]的数组
            }

            // 获取开,高,低,收文字颜色
            function getColor (close, type) {
                if (close === type) {
                    return '#858c9a'
                } else if (close < type) {
                    return style.riseColor
                } else {
                    return style.fallColor
                }
            }
        },
        // 新增图表数据
        update (data) {
            const series = this.series
            if (!series) return
            // 插件是显示0时区的数据，所以这里是增加一个时区的长度
            series.update(Object.assign({}, data, { time: data.time + timeZone * 60 }))
        },
        // 设置图表数据
        setData () {
            const series = this.series
            if (!series) return
            this.chart.applyOptions({
                timeScale: {
                    timeVisible: /(min|hour)$/.test(this.candleKType),
                },
            })
            this.clearData()
            // 插件是显示0时区的数据，所以这里是增加一个时区的长度
            const data = this.data.map(el => Object.assign({}, el, { time: Math.round(el.time + timeZone * 60) }))
            series.setData(data)
            this.setData_maLine() // 设置ma均线
        },
        // 设置前先清理数据
        clearData () {
            const chart = this.chart
            if (this.lineSeries_5) chart.removeSeries(this.lineSeries_5)
            this.lineSeries_5 = null
            if (this.lineSeries_10) chart.removeSeries(this.lineSeries_10)
            this.lineSeries_10 = null
            if (this.lineSeries_20) chart.removeSeries(this.lineSeries_20)
            this.lineSeries_20 = null
            if (this.lineSeries_30) chart.removeSeries(this.lineSeries_30)
            this.lineSeries_30 = null
            if (this.lineSeries_60) chart.removeSeries(this.lineSeries_60)
            this.lineSeries_60 = null
        },
        // 设置ma均线
        setData_maLine () {
            const series = this.series
            const chart = this.chart
            const bars = series._series.data().bars()
            const barsData = bars.ai || bars.vi
            const digits = this.priceFormat.precision
            // 添加ma 5指标的均线
            if (!this.lineSeries_5) {
                this.lineSeries_5 = this.chart.addLineSeries({
                    priceLineColor: 'rgba(0,0,0, 0)',
                    color: '#0a74e0',
                    lineWidth: 1,
                    lastValueVisible: false,
                    crosshairMarkerRadius: 1,
                })
            }
            const lineSeries_5_data = maLineData(barsData, 5, digits)
            if (lineSeries_5_data.length > 0) {
                this.lineSeries_5.setData(lineSeries_5_data)
                this.ma1 = lineSeries_5_data[lineSeries_5_data.length - 1]['value']
            } else {
                chart.removeSeries(this.lineSeries_5)
                this.lineSeries_5.destroy()
                this.lineSeries_5 = null
            }

            // 添加ma 10指标的均线
            if (!this.lineSeries_10) {
                this.lineSeries_10 = this.chart.addLineSeries({
                    priceLineColor: 'rgba(0,0,0, 0)',
                    color: 'rgb(228, 146, 0)',
                    lineWidth: 1,
                    lastValueVisible: false,
                    crosshairMarkerRadius: 1,
                })
            }
            const lineSeries_10_data = maLineData(barsData, 10, digits)
            if (lineSeries_10_data.length > 0) {
                this.lineSeries_10.setData(lineSeries_10_data)
                this.ma2 = lineSeries_10_data[lineSeries_10_data.length - 1]['value']
            } else {
                chart.removeSeries(this.lineSeries_10)
                this.lineSeries_10.destroy()
                this.lineSeries_10 = null
            }

            // 添加ma 20指标的均线
            if (!this.lineSeries_20) {
                this.lineSeries_20 = this.chart.addLineSeries({
                    priceLineColor: 'rgba(0,0,0, 0)',
                    color: '#d604a4',
                    lineWidth: 1,
                    lastValueVisible: false,
                    crosshairMarkerRadius: 1,
                })
            }
            const lineSeries_20_data = maLineData(barsData, 20, digits)
            if (lineSeries_20_data.length > 0) {
                this.lineSeries_20.setData(lineSeries_20_data)
                this.ma3 = lineSeries_20_data[lineSeries_20_data.length - 1]['value']
            } else {
                chart.removeSeries(this.lineSeries_20)
                this.lineSeries_20.destroy()
                this.lineSeries_20 = null
            }

            // 添加ma 30指标的均线
            if (!this.lineSeries_30) {
                this.lineSeries_30 = this.chart.addLineSeries({
                    priceLineColor: 'rgba(0,0,0, 0)',
                    color: '#21a900',
                    lineWidth: 1,
                    lastValueVisible: false,
                    crosshairMarkerRadius: 1,
                })
            }
            const lineSeries_30_data = maLineData(barsData, 30, digits)
            if (lineSeries_30_data.length > 0) {
                this.lineSeries_30.setData(lineSeries_30_data)
                this.ma4 = lineSeries_30_data[lineSeries_30_data.length - 1]['value']
            } else {
                chart.removeSeries(this.lineSeries_30)
                this.lineSeries_30.destroy()
                this.lineSeries_30 = null
            }

            // 添加ma 60指标的均线
            if (!this.lineSeries_60) {
                this.lineSeries_60 = this.chart.addLineSeries({
                    priceLineColor: 'rgba(0,0,0, 0)',
                    color: '#780be4',
                    lineWidth: 1,
                    lastValueVisible: false,
                    crosshairMarkerRadius: 1,
                })
            }
            const lineSeries_60_data = maLineData(barsData, 60, digits)
            if (lineSeries_60_data.length > 0) {
                this.lineSeries_60.setData(lineSeries_60_data)
                this.ma5 = lineSeries_60_data[lineSeries_60_data.length - 1]['value']
            } else {
                chart.removeSeries(this.lineSeries_60)
                this.lineSeries_60.destroy()
                this.lineSeries_60 = null
            }
        },
        // 根据实时报价显示最近时间ma指标数据
        maDately () {
            const series = this.series
            const bars = series._series.data().bars()
            const barsData = bars.ai || bars.vi
            const lastBarsIndex = barsData.length - 1
            this.ma1 = average_close(barsData.slice(lastBarsIndex - 4))
            this.ma2 = average_close(barsData.slice(lastBarsIndex - 9))
            this.ma3 = average_close(barsData.slice(lastBarsIndex - 19))
            this.ma4 = average_close(barsData.slice(lastBarsIndex - 29))
            this.ma5 = average_close(barsData.slice(lastBarsIndex - 39))
        }
    },
}
</script>

<style lang="scss">
@import "~@m/sass/mixin.scss";
.tv-lightweight-charts {
    position: relative;
    z-index: 1;
}
.three-line-legend {
    display: block;
    right: 5px;
    top: 40px;
    position: absolute;
    z-index: 2;
    background: rgba(0, 0, 0, 0.05);
    padding: 1px 5px;
    font-size: 12px;
    color: #333;
}
.norm {
    display: flex;
    align-items: center;
    color: #666;
    padding: 5px;
    font-size: rem(20px);
    .left {
        width: auto;
    }
    .right {
        flex: 1;
        line-height: 1.2;
        padding-left: 5px;
    }
    .typeval {
        margin-right: 5px;
    }
    .maItem {
        margin-right: 5px;
        display: inline-block;
    }
    .maBtn {
        font-size: 12px;
    }
}

.ma1_color {
    color: #0a74e0;
}
.ma2_color {
    color: rgb(228, 146, 0);
}
.ma3_color {
    color: #d604a4;
}
.ma4_color {
    color: #21a900;
}
.ma5_color {
    color: #780be4;
}
</style>
