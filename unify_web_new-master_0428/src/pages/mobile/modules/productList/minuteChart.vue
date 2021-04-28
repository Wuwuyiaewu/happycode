<template>
    <LightweightChart v-if='visible' :data='chartData' :price-format='chartConfig' :product='product' />
</template>

<script>
import LightweightChart from '@m/components/lightweightChart.vue'
import dayjs from 'dayjs'
const timeZone = dayjs().utcOffset() // 时区，单位为分钟
export default {
    name: 'MinuteChart',
    components: {
        LightweightChart,
    },
    props: {
        product: {
            type: Object,
            default: 0
        },
        value: {
            type: String,
            default: 'hidden' // visible显示  hidden隐藏 loading 加载中  loaded加载完成
        }
    },
    data () {
        return {
            visible: false,
            chartData: [],
            chartConfig: {
                type: 'price',
                precision: 2
            },
        }
    },
    watch: {
        value (newval) {
            if (newval === 'loading') {
                const product = this.product
                this.chartConfig.precision = product.groupSymbol && product.groupSymbol.hasOwnProperty('digits') ? product.groupSymbol.digits : product.digit
                this.loadData()
            } else if (newval === 'hidden') {
                this.visible = false
                if (this.cycleTimer) clearTimeout(this.cycleTimer)
            }
        }
    },
    beforeDestroy () {
        if (this.cycleTimer) clearTimeout(this.cycleTimer)
    },
    methods: {
        // 显示隐藏图表
        loadData () {
            const dayTime = dayjs().format('YYYY-MM-DD')
            const params = {
                code_id: this.product.code_id,
                dayTime: dayTime,
            }
            const chartData = this.chartData
            const chartDataLen = chartData.length
            if (chartDataLen > 0) {
                let lastTime = chartData[chartDataLen - 1]['time']
                lastTime = lastTime - timeZone * 60
                params.dayExistTime = dayjs(lastTime * 1000).format('YYYY-MM-DD HH:mm:ss')
            }
            this.$mSocket.send('uptrend', params).then(res => {
                this.$emit('input', 'hidden')
                this.visible = true
                if (res.errorType) {
                    this.$toast({ duration: 1000, message: this.$te('retMsg.' + res.errorData.ret) ? this.$t('retMsg.' + res.errorData.ret) : res.msg })
                    return
                }
                if (res.uptrends && res.uptrends.length > 0) {
                    const dataList = res.uptrends.map(el => ({ time: el.time, value: el.average_price }))
                    this.chartData.push(...dataList)

                    this.$emit('input', 'visible')
                    if (this.cycleTimer) clearTimeout(this.cycleTimer)
                    this.cycleTimer = setTimeout(() => {
                        this.loadData()
                    }, 1000 * 60)
                } else {
                    this.$toast({ duration: 1000, message: this.$t('chart.chartEmpty') })
                }
            }).catch(error => {
                this.$emit('input', 'hidden')
                this.$toast({ duration: 1000, message: error.remark })
            })
        }
    },
}
</script>

<style lang="scss" scoped>
</style>
