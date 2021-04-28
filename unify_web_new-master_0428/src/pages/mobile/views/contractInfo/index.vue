<template>
    <div class='m-contractInfo' ref="contractInfo" :class='{ pc:isPC }'>
        <Top>
            <template v-if='isPC'>
                <a slot='left' href='javascript:void(0);'></a>
                <a slot='right' href='javascript:void(0);' @click='goBackHome'>
                    <i class='icon_icon_close_big'></i>
                </a>
            </template>
            <template v-else>
                <a slot='left' href='javascript:void(0);' @click="$emit('close')">
                    <i class='icon_icon_close_big'></i>
                </a>
            </template>

            <div class='productTopInfo'>
                <p class='productName'>
                    {{ productInfo.simplified }}
                </p>
                <p v-if="language!=='en-US'" class='short_name'>
                    {{ productInfo.short_name }}
                </p>
            </div>
        </Top>

        <div class='m-info'>
            <van-loading v-if='loading' class='m-loading' size='30px'>
                {{ $t('compLang.loading') }}
            </van-loading>
            <template v-else-if='productInfo && productInfo.groupSymbol'>
                <div class='layout'>
                    <div class='title'>
                        {{ $t('productInfo.baseInfo') }}
                    </div>
                    <div class='content'>
                        <div class='item van-hairline--bottom'>
                            <div class='subTitle'>
                                {{ $t('productInfo.productName') }}
                            </div>
                            <div class='content'>
                                {{ productInfo.simplified }}
                            </div>
                        </div>
                        <div class='item van-hairline--bottom'>
                            <div class='subTitle'>
                                {{ $t('productInfo.productCode') }}
                            </div>
                            <div class='content'>
                                {{ productInfo.short_name }}
                            </div>
                        </div>
                        <div class='item van-hairline--bottom'>
                            <div class='subTitle'>
                                {{ $t('productInfo.contractType') }}
                            </div>
                            <div class='content' v-html='getContractType(groupSymbol)'></div>
                        </div>
                        <div class='item van-hairline--bottom'>
                            <div class='subTitle'>
                                {{ $t('productInfo.contractSize') }}
                            </div>
                            <div class='content'>
                                <span
                                    v-if='[8,13].includes(productInfo.market_id)'
                                >
                                    {{ groupSymbol.contract_size +' '+ groupSymbol.base_currency }}
                                </span>
                                <span
                                    v-else-if='[10,12,14,15].includes(productInfo.market_id)'
                                >
                                    {{ groupSymbol.contract_size }}
                                </span>
                                <span
                                    v-else-if='[11].includes(productInfo.market_id)'
                                >
                                    {{ groupSymbol.contract_size +' '+ $t('trade.indexPoint') }}
                                </span>
                                <span
                                    v-else-if='[0,1,2,9].includes(productInfo.market_id)'
                                >
                                    {{ groupSymbol.contract_size +' '+ $t('productInfo.gu') }}
                                </span>
                            </div>
                        </div>
                        <div class='item van-hairline--bottom'>
                            <div class='subTitle'>
                                {{ $t('productInfo.profitCurrency') }}
                            </div>
                            <div class='content'>
                                {{ groupSymbol.profit_currency }}
                            </div>
                        </div>
                        <div class='item van-hairline--bottom'>
                            <div class='subTitle'>
                                {{ $t('productInfo.pipExpress') }}
                            </div>
                            <div class='content'>
                                {{ $t('productInfo.priceFluctuation') +' '+ groupSymbol.pip }}
                            </div>
                        </div>
                        <div class='item van-hairline--bottom'>
                            <div class='subTitle'>
                                {{ $t('productInfo.pipVolumeVal') }}
                            </div>
                            <div class='content'>
                                {{ volumePips|priceDigit }} {{ groupSymbol.profit_currency }}
                                <span
                                    v-if='groupSymbol.profit_currency!==symbolCode'
                                >
                                    ，≈ {{ volumePipsAccount|priceDigit }} {{ symbolCode }}
                                </span>
                            </div>
                        </div>
                        <!-- <div class="item van-hairline--bottom">
                            <div class="subTitle">{{$t('productInfo.digits')}}</div>
                            <div class="content">{{ groupSymbol.digits }}</div>
                        </div>-->
                    </div>
                </div>
                <div class='layout'>
                    <div class='title'>
                        {{ $t('productInfo.tradeInfo') }}
                    </div>
                    <div class='content'>
                        <div class='item van-hairline--bottom'>
                            <div class='subTitle'>
                                {{ $t('productInfo.spread') }}
                            </div>
                            <div class='content'>
                                {{ $t('productInfo.spread0') }}
                            </div>
                        </div>
                        <div class='item van-hairline--bottom'>
                            <div class='subTitle'>
                                {{ $t('productInfo.volumesNum') }}
                            </div>
                            <div
                                class='content'
                            >
                                {{ groupSymbol.volumes_min }}~{{ groupSymbol.volumes_max }}{{ $t('trade.volumeUnit') }}
                            </div>
                        </div>
                        <div class='item van-hairline--bottom'>
                            <div class='subTitle'>
                                {{ $t('productInfo.volumeStep') }}
                            </div>
                            <div class='content'>
                                {{ groupSymbol.volumes_step }}{{ $t('trade.volumeUnit') }}
                            </div>
                        </div>
                        <div class='item van-hairline--bottom'>
                            <div class='subTitle'>
                                {{ $t('productInfo.minStepNum') }}
                            </div>
                            <div
                                class='content'
                            >
                                {{ groupSymbol.stop_level/groupSymbol.pips_ratio }} {{ $t('trade.point') }}
                            </div>
                        </div>
                        <template>
                            <van-collapse v-model='collapse_marginInital' class='collapse'>
                                <van-collapse-item
                                    class='marginCollapase'
                                    :disabled='marginList.length<=1'
                                    :is-link='marginList.length>1'
                                    name='1'
                                    :title="$t('productInfo.marginNum')"
                                    :value="lowerMargin('margin_initial')"
                                >
                                    <MarginLevel
                                        feild='margin_initial'
                                        :group-get='groupGet'
                                        :margin-list='marginList'
                                        :volumes_step='volumes_step'
                                    />
                                </van-collapse-item>
                            </van-collapse>
                        </template>
                        <!-- <div class="item van-hairline--bottom" v-else>
                            <div class="subTitle">{{$t('trade.originalMargin')}}</div>
                            <div class="content"></div>
                        </div>-->
                        <div v-if='groupSymbol.commission' class='item van-hairline--bottom'>
                            <div class='subTitle'>
                                {{ $t('productInfo.openOrderSwap') }}
                                <van-icon
                                    class='alignmiddle'
                                    name='question-o'
                                    size='14'
                                    @click="$alert($t('productInfo.openOrderSwapDesc'))"
                                />
                            </div>
                            <div class='content'>
                                <span
                                    v-if='groupSymbol.commission && groupSymbol.commission_type===1'
                                >
                                    {{ $t('trade.orderVolume') }} x {{ commission | priceDigit(2) }}%
                                </span>
                                <span
                                    v-else-if='groupSymbol.commission && groupSymbol.commission_type===0'
                                >
                                    {{ $t('productInfo.orderValue') }}({{ symbolCode }}) x {{ commission | priceDigit(2) }}%
                                </span>
                            </div>
                        </div>
                        <div class='item van-hairline--bottom'>
                            <div class='subTitle'>
                                {{ $t('productInfo.swap') }}
                            </div>
                            <div
                                class='content'
                            >
                                {{ groupSymbol.long_swap?groupSymbol.long_swap.toFixed(2):'--' }}%/{{ groupSymbol.short_swap?groupSymbol.short_swap.toFixed(2):'--' }}% ({{ $t('productInfo.yearRate') }})
                            </div>
                        </div>
                        <div v-if='groupSymbol.three_days_swap<7' class='item van-hairline--bottom'>
                            <div class='subTitle'>
                                {{ $t('productInfo.threeDaySwap') }}
                            </div>
                            <div class='content'>
                                {{ $t('week.'+groupSymbol.three_days_swap) }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class='layout'>
                    <div class='title'>
                        {{ $t('productInfo.tradeTime') }}
                    </div>
                    <div class='content'>
                        <div class='item van-hairline--bottom'>
                            <div class='subTitle'>
                                {{ $t('productInfo.zone') }}
                            </div>
                            <div class='content'>
                                GMT{{ timeZone>=0?'+':'' }}{{ timeZone }}
                            </div>
                        </div>
                        <div class='item van-hairline--bottom'>
                            <div class='subTitle'>
                                {{ $t('productInfo.tradeTime') }}
                            </div>
                            <div class='content fullRow' v-html='tradeTimeHtml'></div>
                        </div>
                        <!-- <div v-html="tradeTime()"></div> -->
                        <div class='item van-hairline--bottom'>
                            <div class='subTitle'>
                                {{ $t('productInfo.endTime') }}
                            </div>
                            <div class='content'>
                                <EndOfDay v-if='groupSymbol.eod_time' :eod_time='groupSymbol.eod_time' />
                            </div>
                        </div>
                        <div
                            v-if='[10,11,12,14,15].includes(productInfo.market_id) && groupSymbol.expiry_time'
                            class='item van-hairline--bottom'
                        >
                            <div class='subTitle'>
                                {{ $t('productInfo.expiryTime') }}
                            </div>
                            <div class='content'>
                                {{ groupSymbol.expiry_time | formatTimestamp }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class='tips'>
                    {{ $t('productInfo.tips') }}
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import Top from '@m/layout/top'
import { Collapse, CollapseItem } from 'vant'
import MarginLevel from './marginLevel'
import EndOfDay from './endOfDay'
import { getDecimalNum } from '@/utils/calculation'
import { volumePips, volumePipsAccount, profitToUSD } from '@/store/ix_utils'
import dayjs from 'dayjs'
import pcMixin from '@m/mixins/pc'
export default {
    name: 'ContractInfo',
    components: {
        Top,
        MarginLevel,
        EndOfDay,
        [Collapse.name]: Collapse,
        [CollapseItem.name]: CollapseItem
    },
    mixins: [pcMixin],
    // 获取到产品属性才能进入
    beforeRouteEnter (to, from, next) {
        const id = to.params.id
        const product = window.vm.$store.state.ix_quote.product_map[id]
        if (product && product.groupSymbol.volumes_step) {
            next(true)
        } else {
            window.vm.$store.dispatch('ix_quote/getProductInfo', id).then(res => {
                next(true)
            })
        }
    },
    data () {
        return {
            loading: false,
            collapse_marginInital: [],
            timeZone: 0,
            collapse_marginHoliday: [],
            tradeTimeHtml: ''
        }
    },
    mounted () {
        this.timeZone = dayjs().utcOffset() / 60
        this.countTradeTime()
        if(this.isPC){
        //     const pelem =this.$refs['contractInfo'].parentElement
        //    const ph= pelem.getBoundingClientRect().height
        //    pelem.style.height = parseInt(ph)+'px'
  //if (!this.profitToUSD.buy_price) this.$ws.send_addSubscription_proList([this.productId, this.profitToUSD.code_id])
            if(isNaN(this.volumePipsAccount)){
                this.$ws.send_addSubscription_proList([this.productInfo.groupSymbol.id, this.profitToUSD.code_id])
            }
        }
    },
    computed: {
        ...mapState({
            groupGet: state => state.ix_user.groupGet,
            product_list: state => state.ix_quote.product_list,
            product_toUSD: state => state.ix_quote.product_toUSD,
        }),
        ...mapGetters(['usdcnyRate', 'symbolCode']),
        language () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.language
        },
        productInfo () {
            if (this.$route.params && this.$route.params.id) {
                return this.$store.state.ix_quote.product_map[this.$route.params.id] || { groupSymbol: {} }
            } else {
                return { groupSymbol: {} }
            }
        },
        groupSymbol () {
            return this.productInfo.groupSymbol
        },
        groupSymbolMarginLeveMap () {
            return this.$store.getters['ix_quote/groupSymbolMarginLeveMap'][this.productInfo.groupSymbol.id] || {}
        },
        volumes_step () {
            return this.productInfo.groupSymbol.volumes_step
        },
        // 产品层级保证金列表
        marginList () {
            const marginLevelAll = this.$store.getters['ix_quote/groupSymbolMarginLeveMap']
            const id = String(this.productInfo.groupSymbol.id)
            const margin_type = this.groupGet.margin_type
            const list = margin_type && marginLevelAll && marginLevelAll[id] ? marginLevelAll[id] : []
            const groupSymbol = this.productInfo.groupSymbol
            const contract_size = groupSymbol.contract_size
            const newList = list.map(el => {
                return Object.assign({}, el, {
                    range_min: el.range_min / contract_size,
                    range_max: el.range_max / contract_size
                })
            })
            return newList
        },
        // 该产品盈利货币兑美元的币种
        profitToUSD () {
            return this.product_toUSD[this.groupSymbol.profit_currency + 'USD']
        },
        volumePips () {
            return volumePips(this.productInfo)
        },
        volumePipsAccount () {
            const p = volumePipsAccount('contract', this.productInfo, this.profitToUSD)
            return p * this.usdcnyRate
        },
        commission () {
            if (this.groupSymbol.commission_type === 0) { // 0 合约价值类型
                return this.groupSymbol.commission / 10000
            } else { // 1 交易数量类型
                return this.groupSymbol.commission * 100
            }
        }
    },
    methods: {
        ...mapActions({
            showTradeTime: 'ix_quote/showTradeTime'
        }),
        countTradeTime () {
            this.showTradeTime({
                symbolId: this.productInfo.groupSymbol.id,
                timeZone: this.timeZone
            })
                .then(res => {
                    const dataObj = res
                    const weekedArr = [0, 1, 2, 3, 4, 5, 6]
                    let _html = ''
                    weekedArr.forEach(week => {
                        if (dataObj[week] && dataObj[week].length > 0) {
                            const newData = dataObj[week].filter(el => el.start_time !== 0 || el.end_time !== 0)
                            if (newData && newData.length) _html += this.$t('week.' + week) + ':'
                            newData.forEach((info, index) => {
                                _html += `${this.minusToTime(info.start_time)}-${this.minusToTime(info.end_time)}${index < dataObj[week].length - 1 ? ', ' : ''}`
                            })
                            _html += '</br>'
                        }
                    })
                    this.tradeTimeHtml = _html
                })
        },
        /*  tradeTime() {
             const data = JSON.parse(JSON.stringify(this.$store.state.ix_baseInfo.groupTradeTimeListRet[this.productInfo.groupSymbol.id] || {}))
             const arr = [0, 1, 2, 3, 4, 5, 6]
             // 先把时间切割成+8时区的交易时间区间，再遍历生产html
             arr.forEach((item) => {
                 const tradeDayTime = data[item]
                 if (tradeDayTime && tradeDayTime.length > 0) {
                     for (let i = tradeDayTime.length - 1; i >= 0; i--) {
                         const startTime = tradeDayTime[i].start_time + this.timeZone * 60
                         const endTime = tradeDayTime[i].end_time + this.timeZone * 60
                         if (startTime > 1440) {
                             // 开始时间转换成+8时区大于1440，进入第二天
                             if (item === 6) {
                                 data[0].unshift(Object.assign({}, tradeDayTime[i], {
                                     start_time: startTime - this.timeZone * 60 - 1440,
                                     end_time: endTime - this.timeZone * 60 - 1440
                                 }))
                             } else {
                                 data[item + 1].unshift(Object.assign({}, tradeDayTime[i], {
                                     start_time: startTime - this.timeZone * 60 - 1440,
                                     end_time: endTime - this.timeZone * 60 - 1440
                                 }))
                             }
                             tradeDayTime.splice(i, 1)
                         } else if (endTime > 1440) {
                             // 结束时间转换成+8时区大于1440，进入第二天
                             tradeDayTime[i].end_time = 1440 - this.timeZone * 60
                             if (item === 6) {
                                 data[0].unshift(Object.assign({}, tradeDayTime[i], {
                                     start_time: -this.timeZone * 60,
                                     end_time: endTime - 1440 - this.timeZone * 60
                                 }))
                             } else {
                                 data[item + 1].unshift(Object.assign({}, tradeDayTime[i], {
                                     start_time: -this.timeZone * 60,
                                     end_time: endTime - 1440 - this.timeZone * 60
                                 }))
                             }
                         }
                     }
                 }
             })
             let _html = ''
             arr.forEach(item => {
                 if (data[item] && data[item].length > 0) {
                     data[item].sort((a, b) => (a.start_time - b.start_time))
                     _html += this.$t('week.' + item) + ':'
                     data[item].forEach((info, index) => {
                         _html += `${this.minusToTime(info.start_time + 480)}-${this.minusToTime(info.end_time + 480)}${index < data[item].length - 1 ? ', ' : ''}`
                     })
                     _html += '<br>'
                 }
             })
             return _html
         }, */
        minusToTime (num) {
            const number = num > 1440 ? num - 1440 : num
            const hours = (Math.floor(number / 60) > 9 ? '' : '0') + Math.floor(number / 60).toString()
            const minute = (number % 60 > 9 ? '' : '0') + (number % 60).toString()
            return hours + ':' + minute
        },
        // 最低层级保证金
        lowerMargin (type) {
            const marginList = this.marginList
            if (marginList.length === 0) return ''
            let value = marginList[0][type]
            value = value / 100
            const digit = getDecimalNum(this.volumes_step)
            let strLast = this.productInfo.groupSymbol.margin_currency + '/' + this.$t('trade.volumeUnit')
            strLast = `% *${this.$t('orderAmount')}(${this.symbolCode})`
            const lowest = marginList.length === 1 ? '' : this.$t('productInfo.lowest')
            return lowest + value + strLast
        },

        // 获取合约类型
        getContractType (groupSymbol = {}) {
            const { market_code, market_name, market_id, country_code = '', exchanger_code = '' } = groupSymbol
            let result = market_name

            const country_code_temp = country_code ? `${country_code}&nbsp;&nbsp;` : country_code

            if ([0, 1, 2, 9].includes(market_id) && (country_code_temp || exchanger_code)) {
                result += `(${country_code_temp}${exchanger_code})`
            } else if ([11].includes(market_id) && (country_code_temp || market_code)) {
                result += `(${country_code_temp}${market_code})`
            } else if ([8, 10, 12, 13, 14, 15].includes(market_id) && market_code) {
                result += `(${market_code})`
            }
            return result
        },
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.m-contractInfo {
    background: #f8f8f8;

    &.pc{
                display: flex;
    flex-direction: column;
    height: 100%;
        .m-info{
                padding-top: 0;
                flex:1;
                overflow-x: hidden;
                overflow-y: auto;
                @include scroll();
        }
    }
}
.m-loading {
    text-align: center;
    padding-top: rem(60px);
}
.productTopInfo {
    font-size: rem(34px);
    line-height: 1;
    .productName{
        white-space: nowrap;
    }
    .short_name {
        margin-top: rem(8px);
        font-size: rem(20px);
        color: $muted;
    }
}
.m-info {
    padding: rem(90px) rem(30px) 0;
    .layout {
        .title {
            font-size: rem(24px);
            color: #999;
            padding: rem(18px) 0 rem(18px) rem(10px);
        }
        .content {
            background-color: #fff;
            border-radius: rem(10px);
            .item {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                padding: rem(32px) rem(30px);
                font-size: rem(24px);
                .subTitle {
                    color: #999999;
                }
                .content {
                    color: #333333;
                }
                .fullRow {
                    text-align: right;
                    line-height: rem(50px);
                    max-width: 80%;
                    word-break: break-all;
                }
                &:last-child {
                    &::after {
                        border: none;
                    }
                }
            }
        }
    }
    .tips {
        padding: rem(30px) 0 rem(40px) rem(10px);
        font-size: rem(24px);
        color: #999999;
    }
    .collapse ::v-deep {
        .van-cell__title {
            font-size: rem(24px);
            color: #999;
        }
        .van-cell__value {
            font-size: rem(24px);
            color: #333333;
        }
    }
}
.marginCollapase {
    ::v-deep .van-cell__title {
        flex: initial;
    }
}
</style>
