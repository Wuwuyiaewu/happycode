<template>
    <div ref='chart' class='lightweightChart'></div>
</template>

<script>
import { createChart } from 'lightweight-charts'
import dayjs from 'dayjs'
const timeZone = dayjs().utcOffset() // 时区，单位为分钟
export default {
    name: 'LightweightChart',
    props: {
        data: Array,
        product: Object,
        direction: String,
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
            key: 'value'
        }
    },
    watch: {
        data (newval, oldval) {
            const series = this.series
            if (!series) return
            // 插件是显示0时区的数据，所以这里是增加一个时区的长度
            const data = this.data.map(el => Object.assign({}, el, { time: Math.round(el.time + timeZone * 60) }))
            series.setData(data)
        },
        'product.cur_price' (newPrice) {
            const series = this.series
            const tm = this.product.tm // 报价时间
            if (!series || !tm) return
            const m = tm % 60
            this.update({ value: newPrice * 1, time: tm - m + 60 })
        }
    },
    mounted () {
        this.init()
    },
    methods: {
        init () {
            const chartDOM = this.$refs.chart

            var container = document.createElement('div')
            chartDOM.appendChild(container)

            var width = container.clientWidth
            var height = this.height

            var chart = createChart(container, {
                localization: {
                    dateFormat: 'yyyy-MM-dd',
                },
                handleScroll: { // 禁用图表上下滑动，让网页可以上下滑动
                    vertTouchDrag: false,
                },
                handleScale: { // 禁用图表上下缩放，让网页可以上下滑动
                    axisPressedMouseMove: false,
                },
                priceScale: {
                    position: this.direction || 'left',
                    borderColor: 'rgba(197, 203, 206, 1)',
                },
                timeScale: {
                    fixLeftEdge: true,
                    timeVisible: true,
                    secondsVisible: false,
                    borderColor: 'rgba(197, 203, 206, 1)',
                },
                layout: {
                    backgroundColor: '#ffffff',
                    textColor: '#333',
                },
                grid: {
                    horzLines: {
                        color: '#eee',
                    },
                    vertLines: {
                        color: '#ffffff',
                    },
                },
            })

            chart.resize(height, width)

            const priceFormat = this.priceFormat
            const precision = priceFormat.precision
            var series = chart.addAreaSeries({
                topColor: 'rgba(247, 217, 158, 1)',
                bottomColor: 'rgba(247, 217, 158, 0)',
                lineColor: '#d5af64',
                lineWidth: 2,
                priceFormat: {
                    type: priceFormat.type,
                    precision: priceFormat.precision,
                    minMove: Math.pow(0.1, precision).toFixed(precision) * 1,
                },
            })
            // 插件是显示0时区的数据，所以这里是增加一个时区的长度
            const data = this.data.map(el => Object.assign({}, el, { time: Math.round(el.time + timeZone * 60) }))
            series.setData(data)
            this.series = series
            this.chart = chart
        },
        update (data) {
            const series = this.series
            if (!series) return
            // 插件是显示0时区的数据，所以这里是增加一个时区的长度
            series.update(Object.assign({}, data, { time: data.time + timeZone * 60 }))
        },
        setData (data) {
            this.series.setData(data)
        }
    },
}
</script>

<style lang="scss" >
@import "~@m/sass/mixin.scss";
.lightweightChart {
    position: relative;
    // height: rem(300px);
    .floating-tooltip-2 {
        width: 96px;
        height: 50px;
        position: absolute;
        display: none;
        padding: 2px 8px;
        box-sizing: border-box;
        font-size: 12px;
        color: #131722;
        background-color: rgba(255, 255, 255, 1);
        text-align: left;
        z-index: 1000;
        top: 12px;
        left: 12px;
        pointer-events: none;
        border: 1px solid rgba(0, 150, 136, 1);
        border-radius: 2px;
    }
}
</style>
