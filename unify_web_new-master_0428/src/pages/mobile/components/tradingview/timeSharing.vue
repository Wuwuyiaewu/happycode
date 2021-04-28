<template>
    <div>
        <LightweightChart
            v-if='klineMinute.length>0'
            ref='kline'
            class='klineChart'
            :data='klineMinute'
            direction='right'
            :height='height'
            :price-format='klinePriceFormat'
            :product='product'
        />
    </div>
</template>

<script>
import LightweightChart from '@m/components/lightweightChart.vue'
import { toFixed } from '@/utils/calculation'
export default {
    components: {
        LightweightChart,
    },
    props: ['product', 'height', 'language', 'activeTab'],
    data () {
        return {
            klineMinute: [],
            klinePriceFormat: {
                type: 'price',
                precision: 2
            },
        }
    },
    computed: {
        digit () {
            const product = this.product
            if (!product) return 0
            return product.groupSymbol && product.groupSymbol.hasOwnProperty('digits') ? product.groupSymbol.digits : product.digit
        }
    },
    mounted () {
        this.klinePriceFormat.precision = this.digit
        this.queryKlineData()
    },
    methods: {
        // 获取分时图数据
        queryKlineData () {
            // let tradeServerTime = this.$store.state.ix_baseInfo.tradeServerTime || Date.now() / 1000;
            // tradeServerTime = tradeServerTime - timeZone * 60;      // 服务器是0时区，格式化时间需要减去时区
            // tradeServerTime = tradeServerTime - 24 * 60 * 60; // 周末使用，请求前一天数据
            const dayTime = dayjs().format('YYYY-MM-DD')
            const params = {
                code_id: this.product.code_id,
                dayTime: dayTime,
            }
            let dayExistTime = dayTime + ' 00:00:00'
            const klineMinute = this.klineMinute
            if (klineMinute.length > 0) { // 如果已经有数据，从10分钟之前拉取最新的数据
                const lastLineTime = klineMinute[klineMinute.length - 1]['time']
                const newTime = Math.round(lastLineTime - timeZone * 60 - 5 * 60) // 服务器是0时区，格式化时间需要减去时区
                dayExistTime = dayjs(newTime * 1000).format('YYYY-MM-DD HH:mm:ss')
                params.dayExistTime = dayExistTime
            }
            this.loading = Date.now()
            this.$mSocket.send('uptrend', params).then(res => {
                this.clearLoading()
                let chartData = []
                if (res.errorType) {
                    return this.$toast({ duration: 1000, message: res.remark })
                } else if (klineMinute.length === 0 && (!res.uptrends || res.uptrends.length === 0)) {
                    this.$toast({ duration: 1000, message: this.$t('chart.chartEmpty') })
                } else if (res.uptrends.length > 0) {
                    chartData = res.uptrends.map(el => ({ time: el.time, value: toFixed(el.average_price, this.digit) * 1 }))
                    if (klineMinute.length > 0) { // 新增的数据
                        const lastData = klineMinute[klineMinute.length - 1]
                        chartData = chartData.filter(el => el.time > lastData.time)
                    }
                    if (chartData.length > 0) klineMinute.push(...chartData)
                }
                // this.cycleQueryKlineData();
            }).catch(error => {
                console.log(error)
                this.clearLoading()
                this.$toast({ duration: 1000, message: error.remark })
                return Promise.resolve(false)
            })
        },
        clearLoading (starting) {
            const now = Date.now()
            const _t = now - this.loading < 1000 ? 400 : 0
            setTimeout(() => {
                this.loading = null
            }, _t)
        },
    },
}
</script>

<style lang="scss" scoped>
</style>
