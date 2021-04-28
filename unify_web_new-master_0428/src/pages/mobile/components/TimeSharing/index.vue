<template>
    <div id='container'>
        <div id='chart-wrap' :style='{ opacity: isLoading ? 0 : 1 }'></div>
        <van-loading v-show='isLoading' class='loading-el' />
    </div>
</template>

<script>
import { InitChart } from './lib'
import dayjs from 'dayjs'

export default {
    data () {
        return {
            chartInstance: null,
            isLoading: true,
            tsData: {},
            selectedData: null
        }
    },
    created () {
    },
    mounted () {
        this.init()

        this.$emit('mounted')
    },
    beforeDestroy () {
        this.reset()
    },
    methods: {
        init () {
            this.isLoading = true
            this.chartInstance = new InitChart({
                el: '#chart-wrap',
            })

            ;['mouse_down', 'mouse_up', 'mouse_leave', 'cross'].forEach(e => {
                this.chartInstance.subscribe(e, (data = null) => {
                    this.selectedData = data
                    this.handleSelect(data)
                })
            })
        },
        handleSelect (data = null) {
            if (this.isLoading) {
                return
            }
            this.$emit('onSelected', data)
        },
        updateHistory () {
            const { schedule_day, chartData } = this.tsData
            if (chartData && schedule_day) {
                if (schedule_day && schedule_day.length > 0) {
                    // 交易时段从小到大排序
                    schedule_day[0].schedule_time.sort((a, b) => a.time_index - b.time_index)
                    const start_time = schedule_day[0].schedule_time[0].start_time * 1000
                    const end_time = schedule_day[0].schedule_time[schedule_day[0].schedule_time.length - 1].end_time * 1000

                    this.applyConfig({
                        schedule_day,
                        start_time: start_time,
                        end_time: end_time,
                        data: chartData
                    })
                }
            }
        },
        onTick (tick) {
            if (this.selectedData) {
                const tickTimeStr = dayjs(tick.time).format('YYYY/MM/DD HH:mm')
                const selectedTimeStr = dayjs(this.selectedData.time * 1000).format('YYYY/MM/DD HH:mm')
                if (tickTimeStr === selectedTimeStr) {
                    this.handleSelect({
                        ...tick,
                        time: Math.floor(tick.time / 1000)
                    })
                }
            }
            if (!(this.chartInstance && this.tsData.chartData)) {
                return
            }

            let lastTime = null
            const klist = this.tsData.chartData
            if (klist.length > 0) {
                lastTime = klist[klist.length - 1].time
            }
            if (lastTime && dayjs(tick.time).minute() === dayjs(lastTime * 1000).minute()) {
                klist.splice(klist.length - 1, 1, {
                    ...tick,
                    time: lastTime
                })
            } else {
                klist.push({
                    ...tick,
                    time: Math.floor(tick.time / 1000)
                })
            }

            this.applyConfig({
                data: klist
            })

            this.chartInstance.updateChart()
        },
        updateTSData (data) {
            console.log('watch: 分时图历史数据', data)
            this.tsData = data
            this.updateHistory()
            this.isLoading = false
        },
        updateChart () {
            this.chartInstance.updateChart()
        },

        reset () {
            this.isLoading = true
            this.tsData = {}
            this.chartInstance.resetGlobal()
            this.chartInstance.updateChart()
        },
        applyConfig (options) {
            this.chartInstance.applyConfig(options)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
    #container{
        position: relative;
        width: 100%;
        flex: 1;
    }
    #chart-wrap{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        flex: 1;
        cursor: crosshair;
    }

    .loading-el{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>
