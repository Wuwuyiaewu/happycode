<template>
    <div id='candleChartWrapper' ref='candleChartWrapper' class='candleChartWrapper'>
        <van-tabs
            ref='tabs'
            v-model='active'
            class='tabs'
            :color='style.mainColor'
            line-height='2'
            line-width='20'
            :title-active-color='style.mainColor'
            @change='change'
            @click='tabClick'
        >
            <van-tab :title="$t('chart.timeSharing')" />
            <van-tab v-for='(item,i) in candleKTypeList' :key='i' :title='item.title' />
            <van-tab :title="$t('chart.mins')">
                <div ref='activeBtn' slot='title' @click.stop='showChangeChartType'>
                    <van-loading v-if='loading' class='loadingIcon' color='#1989fa' size='18px' />
                    <template>
                        {{ customizeTypeText }}
                        <i class='icon_icon_arrow'></i>
                    </template>
                </div>
            </van-tab>
        </van-tabs>
        <LightweightChart
            v-if='klineData.length>0 && active===0'
            ref='kline'
            class='klineChart'
            :data='klineData'
            :height='klineHeight'
            :price-format='klinePriceFormat'
            :product='product'
        />
        <CandleChart
            v-if='candleData.length>0 && active>0'
            ref='candleChart'
            :candle-k-type='candleKType'
            class='candleChart'
            :data='candleData'
            :height='klineHeight'
            :isapp='isapp'
            :price-format='klinePriceFormat'
            :product='product'
            @loadCandleLatelyData='loadCandleLatelyData'
            @loadPrevData='queryCandleData'
        />
        <van-popup
            v-if='isapp'
            v-model='kTypeActionVisible'
            class='m-accountMenu'
            get-container='body'
            :overlay='false'
            @click='kTypeActionVisible=false'
        >
            <div class='menus chartTypes' :style="{ top:menuPosition.y+'px',left:menuPosition.x+'px' }">
                <div
                    v-for='item in kTypeActions'
                    :key='item.value'
                    class='item'
                    @click.stop='kTypeActionOnSelect(item)'
                >
                    {{ item.name }}
                </div>
            </div>
        </van-popup>
        <van-action-sheet
            v-else
            v-model='kTypeActionVisible'
            :actions='kTypeActions'
            :cancel-text="$t('compLang.cancel')"
            @select='kTypeActionOnSelect'
        />
    </div>
</template>

<script>
import { ActionSheet, Loading } from 'vant'
import { createChart } from 'lightweight-charts'
import LightweightChart from '@m/components/lightweightChart.vue'
import CandleChart from '@m/components/candleChart.vue'
import { mapGetters } from 'vuex'
import { kLineDataGroup } from '@/utils/klineData'
import { localSet, localGet, getElementPagePosition } from '@/utils'
import { toFixed } from '@/utils/calculation'
import dayjs from 'dayjs'

const timeZone = dayjs().utcOffset() // 时区，单位为分钟
export default {
    name: 'ProductDetailChart',
    props: {
        product: Object,
        height: Number,
        isapp: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapGetters(['style']),
        digit () {
            const product = this.product
            return product.groupSymbol && product.groupSymbol.hasOwnProperty('digits') ? product.groupSymbol.digits : product.digit
        }
    },
    data () {
        return {
            active: 0,
            loading: null,
            customizeTypeText: this.$t('chart.timeSharing'),
            klineHeight: 200,
            klineData: [],
            klinePriceFormat: {
                type: 'price',
                precision: 2
            },
            candleData: [],
            lastCandleDataTime: 0,
            candleKType: '',
            candleKTypeList: [{
                title: this.$t('chart.5min'),
                value: '5min'
            }, {
                title: this.$t('chart.30min'),
                value: '30min'
            }, {
                title: this.$t('chart.1hour'),
                value: '1hour'
            }, {
                title: this.$t('chart.day'),
                value: 'day'
            }, {
                title: this.$t('chart.week'),
                value: 'week'
            }, {
                title: this.$t('chart.month'),
                value: 'month'
            }],
            kTypeActionVisible: false,
            kTypeActions: [
                { name: this.$t('chart.1min'), value: '1min' },
                { name: this.$t('chart.15min'), value: '15min' },
                { name: this.$t('chart.4hour'), value: '4hour' }
            ],
            menuPosition: {
                x: 0,
                y: 0
            }
        }
    },
    created () {
        this.candleKTypeList.splice(4)
        this.initCache()
    },
    mounted () {
        this.klinePriceFormat.precision = this.digit
        const tabs = this.$refs.tabs.$el
        this.klineHeight = this.height - tabs.clientHeight
        if (this.active <= this.candleKTypeList.length) {
            this.change(this.active)
        } else {
            const kTypeAction = this.kTypeActions.find(el => el.value === this.candleKType)
            if (kTypeAction) {
                this.kTypeActionOnSelect(kTypeAction)
            } else {
                this.active = 0
                this.change(0)
            }
        }
    },
    beforeDestroy () {
        const kline = this.$refs.kline
        if (kline) kline.chart.remove()
        const candleChart = this.$refs.candleChart
        if (candleChart) candleChart.chart.remove()
        if (this.cycleQueryKline) clearTimeout(this.cycleQueryKline)
    },
    methods: {
        // 从缓存拉取上次访问详情页的k线类型
        initCache () {
            this.active = Number(localGet('productDetailKTypeActive')) || 0
            this.candleKType = localGet('productDetailKType') || ''
            this.customizeTypeText = localGet('productDetailCustomizeTypeText') || ''
        },
        /* 判断时间是不是需求单位的整数倍，否则向上取整 */
        ceilTimer (t, type = '1min') {
            let time = dayjs(t)
            const timeType = type.replace(/\d+/, '')
            const timeStep = parseInt(type)
            if (timeType === 'min') {
                let minute = time.minute()
                minute = Math.ceil(minute / timeStep) * timeStep
                time = time.minute(minute)
            } else if (timeType === 'hour') {
                let hour = time.hour() + 1
                hour = Math.ceil(hour / timeStep) * timeStep
                time = time.hour(hour).minute(0)
            }
            return time.format('YYYY-MM-DD HH:mm') + ':00'
        },
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
            const klineData = this.klineData
            if (klineData.length > 0) { // 如果已经有数据，从10分钟之前拉取最新的数据
                const lastLineTime = klineData[klineData.length - 1]['time']
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
                } else if (klineData.length === 0 && (!res.uptrends || res.uptrends.length === 0)) {
                    this.$toast({ duration: 1000, message: this.$t('chart.chartEmpty') })
                } else if (res.uptrends.length > 0) {
                    chartData = res.uptrends.map(el => ({ time: el.time, value: toFixed(el.average_price, this.digit) * 1 }))
                    if (klineData.length > 0) { // 新增的数据
                        const lastData = klineData[klineData.length - 1]
                        chartData = chartData.filter(el => el.time > lastData.time)
                    }
                    if (chartData.length > 0) klineData.push(...chartData)
                }
                this.cycleQueryKlineData()
            }).catch(error => {
                console.log(error)
                this.clearLoading()
                this.$toast({ duration: 1000, message: error.remark })
                return Promise.resolve(false)
            })
        },
        // 循环拉取数据
        cycleQueryKlineData () {
            if (this.cycleQueryKline) clearTimeout(this.cycleQueryKline)
            const active = this.active
            const fen = 1000 * 60 // 1分钟
            this.cycleQueryKline = setTimeout(() => {
                this.queryKlineData()
            }, active === 0 ? fen : fen * 5)
        },
        // 更新分时图图表数据
        updateKlineData (val) {
            const kline = this.$refs.kline
            if (this.active > 0 || !kline) return
            const localTimeDiffServer = this.$store.state.ix_baseInfo.localTimeDiffServer
            const curServeTime = dayjs().unix() - localTimeDiffServer
            kline.update({
                time: Math.round(curServeTime + timeZone * 60),
                value: val
            })
        },
        // 拉取K线图表数据
        queryCandleData () {
            const candleData = this.candleData
            const num = 240
            let ktype = this.candleKType
            if (ktype === '4hour') ktype = '1hour'
            const startTime = this.lastCandleDataTime
            this.loading = Date.now()
            this.$mSocket.send('klineHistoryData', {
                code_id: this.product.code_id,
                ktype: ktype,
                msg_id: Date.now(),
                num: num,
                flag: 0, // 取值0或1，0表示向历史方向请求，1表示向后请求, 比如 starttime = 2016-08-05 00:00:00，flag为0 请求数据往小于2016-08-05 方向， flag为1 ，请求数据往大于 2016-08-05方向
                startTime: startTime,
            }).then(res => {
                this.clearLoading()
                let chartData = []
                if (res.errorType) {
                    return this.$toast({ duration: 1000, message: res.remark })
                } else if (startTime === 0 && (!res.kline_data_list || res.kline_data_list.length === 0)) {
                    this.$toast({ duration: 1000, message: this.$t('chart.chartEmpty') })
                } else if (res.kline_data_list.length > 0) {
                    let dataList = res.kline_data_list
                    if (startTime !== 0) dataList.shift() // 第二页第一条数据和第一页最后一条数据相同，过滤掉
                    const lastData = dataList[dataList.length - 1]
                    if (lastData) this.lastCandleDataTime = lastData['time']
                    if (this.candleKType === '4hour') {
                        dataList = kLineDataGroup(dataList) // 4小时K线数据，需要由1小时的K线组装
                        this.lastCandleDataTime = dataList[dataList.length - 1]['time']
                    }
                    chartData = dataList.reverse().map(el => ({
                        time: dayjs(el.time).unix() + timeZone * 60,
                        open: el.open_price,
                        high: el.high_price,
                        low: el.low_price,
                        close: toFixed(el.close_price, this.digit) * 1
                    }))

                    const startTimeUnix = dayjs(startTime).unix() + timeZone * 60
                    if (startTime === 0) {
                        this.candleData = chartData
                    } else {
                        candleData.unshift(...chartData)
                    }
                }
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
        // 加载最新的K线数据
        loadCandleLatelyData (time) {
            this.lastCandleDataTime = 0
            this.queryCandleData()
        },
        // 选择k线类型
        kTypeActionOnSelect (val) {
            console.log(val)
            this.active = this.candleKTypeList.length + 1
            this.candleKType = val.value
            this.customizeTypeText = val.name
            this.kTypeActionVisible = false
            this.loadChartData()
            const kline = this.$refs.kline
            if (kline) kline.chart.remove()
        },
        // tab切换
        change (i) {
            const candleKTypeList = this.candleKTypeList
            const active = this.active
            if (i === 0) {
                this.candleKType = ''
            } else if (i <= candleKTypeList.length) {
                this.candleKType = candleKTypeList[i - 1]['value']
            } else {
                return
            }
            this.loadChartData()
        },
        // 点积分时K线类型, 在active变化之前清空图表缓存
        tabClick (i) {
            if (i === 0) {
                const candleChart = this.$refs.candleChart
                if (candleChart) candleChart.chart.remove()
            } else {
                const kline = this.$refs.kline
                if (kline) kline.chart.remove()
            }
        },
        // 加载对应tab的图表数据
        loadChartData () {
            const active = this.active
            // this.candleData = [];
            this.lastCandleDataTime = 0
            localSet('productDetailKTypeActive', active)
            localSet('productDetailKType', this.candleKType)
            localSet('productDetailCustomizeTypeText', this.customizeTypeText)
            if (active === 0) {
                if (this.cycleQueryKline) clearTimeout(this.cycleQueryKline)
                this.queryKlineData()
            } else {
                this.queryCandleData()
            }
        },
        showChangeChartType () {
            if (this.isapp) {
                const position = getElementPagePosition(this.$refs.activeBtn)
                this.menuPosition = {
                    x: position.x - 60,
                    y: position.y + this.$refs.activeBtn.offsetHeight
                }
                this.kTypeActionVisible = true
            } else {
                this.kTypeActionVisible = true
            }
        }
    },
    components: {
        LightweightChart,
        CandleChart,
        [ActionSheet.name]: ActionSheet,
        [Loading.name]: Loading,
    },
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.candleChartWrapper {
    position: relative;
}
.overlay {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.3);
}
.tabs {
    height: rem(70px);
    ::v-deep {
        .van-tab {
            line-height: rem(70px);
            font-size: rem(24px);
            flex: 1;
            flex-basis: auto !important;
        }
        .van-tabs__wrap {
            height: rem(70px);
        }
    }
}
.klineChart {
    position: absolute !important;
    left: 0;
    top: rem(70px);
    width: 100%;
    bottom: 0;
}
.candleChart {
    position: absolute !important;
    left: 0;
    top: rem(70px);
    width: 100%;
    bottom: 0;
}
.loadingIcon {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background: #fff;
    ::v-deep span {
        display: inline-block;
    }
}
.m-accountMenu {
    .chartTypes {
        width: rem(200px);
        border-radius: rem(5px);
        &::after {
            right: 20%;
        }
    }
}
</style>
