<template>
    <div v-if='status.stalls ||status.deal' class='stallsAndDeal' :class='isPC && "pcCls"'>
        <Mobile
            v-if='!isPC'
            :buy-list='buyList'
            :deal-data='dealData'
            :sell-list='sellList'
            :status='status'
            :sums='sums'
            :volume-ratio-for-sell='volumeRatioForSell'
        />
        <PC
            v-else
            :buy-list='buyList'
            :deal-data='dealData'
            :sell-list='sellList'
            :status='status'
            :sums='sums'
            :volume-ratio-for-sell='volumeRatioForSell'
        />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Mobile from './components/Mobile'
import PC from './components/PC'
import { toFixed } from '@/utils/calculation'

export default {
    name: 'StallsAndDeal',
    components: {
        Mobile,
        PC
    },
    props: {
        status: {
            type: Object,
            default: () => ({
                stalls: false,
                deal: false
            })
        },
        stallsStr: {
            type: String,
            default: ''
        },
        dealStr: {
            type: String,
            default: ''
        },
        productId: {
            type: [String, Number],
            default: ''
        },
        digit: {
            type: Number,
            default: 2
        }
    },
    data () {
        return {
            tabActive: 'stalls',
            dealData: [],
            tempDealData: [],
            isDealDelaying: false,
            timer: 0
        }
    },
    computed: {
        ...mapGetters(['style']),
        stallsData () {
            if (!this.status.stalls) {
                return []
            }
            return this.getData(this.stallsStr).map(item => {
                item[0] = (item[0] * 1).toFixed(this.digit)
                item[1] = (item[1] * 1).toFixed(this.digit)
                return item
            })
        },
        sellList () {
            const result = []
            this.stallsData.forEach((item, i, arr) => {
                result.push(arr[arr.length - i - 1])
            })
            return result
        },
        buyList () {
            return this.stallsData
        },
        isPC () {
            return window['isPC']
        },
        // maxValue () {
        //     const sells = this.sellList.map(item => item[2])
        //     const buys = this.sellList.map(item => item[3])
        //     return {
        //         sell: Math.max(...sells),
        //         buy: Math.max(...buys),
        //     }
        // },
        // minValue () {
        //     const sells = this.sellList.map(item => item[2])
        //     const buys = this.sellList.map(item => item[3])
        //     return {
        //         sell: Math.min(...sells),
        //         buy: Math.min(...buys),
        //     }
        // },
        sums () {
            return {
                sell: this.sellList.reduce((total, item) => total + item[3], 0),
                buy: this.buyList.reduce((total, item) => total + item[2], 0),
            }
        },
        // 成交量比
        volumeRatioForSell () {
            return this.sums.sell / (this.sums.sell + this.sums.buy) * 100
        }
    },
    watch: {
        productId: {
            immediate: true,
            handler (val, oldval) {
                if (oldval) {
                    clearTimeout(this.timer)
                    this.dealData = []
                    this.tempDealData = []
                }
            }
        },
        dealStr: {
            immediate: true,
            handler (val) {
                if (!this.status.deal) {
                    return
                }
                let color = ''
                const newList = this.getData(val).map(item => {
                    item[2] = toFixed(item[2], this.digit)
                    if (item[5] > 0) {
                        color = [this.style.riseColor, this.style.fallColor][item[5] - 1]
                    }
                    item.color = color
                    return item
                })
                // const totalLen = this.tempDealData.length + newList.length
                // this.tempDealData.splice(0, totalLen - 20)
                this.tempDealData.push(...newList)
            }
        },
        tempDealData: {
            deep: true,
            immediate: true,
            handler (val, old) {
                if (!val.length) {
                    this.isDealDelaying = false
                }

                if (val.length && !this.isDealDelaying) {
                    this.isDealDelaying = true
                    this.delayMounted()
                    // console.log(val.length, 'delayMounted')
                }
            }
        }
    },
    methods: {
        getData (str) {
            const result = []
            try {
                str && result.push(...JSON.parse('[' + str + ']'))
            } catch (error) {
                console.log('error: ', error)
            }
            return result
        },
        delayMounted (time = 100) {
            requestAnimationFrame(() => {
                if (!this.tempDealData.length) {
                    return
                }
                if (this.tempDealData.length > 100) {
                    this.tempDealData.splice(0, this.tempDealData.length - 60)
                }
                if (this.dealData.length >= 50) {
                    this.dealData.shift()
                }
                this.dealData.push(this.tempDealData.splice(0, 1)[0])

                this.timer = setTimeout(() => {
                    this.delayMounted(100 / this.tempDealData.length)
                }, time)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";

.stallsAndDeal{
    min-width: rem(200px);
    border-top: 1px solid #ecedf2;
    border-left: 1px solid #ecedf2;
    &.pcCls{
        min-width: auto;
    }
}
</style>
