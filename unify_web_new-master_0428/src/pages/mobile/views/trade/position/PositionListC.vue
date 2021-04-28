<template>
    <div class='m-ccgd' :class='{ pc:isPC }'>
        <div class='groupBtn'>
            <van-button
                :class="{ 'active': activeType===1,'mainColorBg': activeType ===1 }"
                size='small'
                @click='getTradeInfo(1)'
            >
                {{ $t('trade.filterToday') }}
            </van-button>
            <van-button
                :class="{ 'active': activeType===2,'mainColorBg': activeType ===2 }"
                size='small'
                @click='getTradeInfo(2)'
            >
                {{ $t('trade.filterweek') }}
            </van-button>
            <van-button
                :class="{ 'active': activeType===3,'mainColorBg': activeType ===3 }"
                size='small'
                @click='getTradeInfo(3)'
            >
                {{ $t('trade.filterMonth') }}
            </van-button>
        </div>
        <van-loading v-if='loading' class='m-loading' size='30px'>
            {{ $t('compLang.loading') }}
        </van-loading>
        <template v-else>
            <template v-if='dataList.length>0'>
                <template v-if='isPC'>
                    <div id='table-scroll' class='table-scroll'>
                        <div class='table-wrap'>
                            <table class='main-table'>
                                <thead>
                                    <tr>
                                        <th>{{ $t('trade.nameCode') }}</th>
                                        <th>{{ $t('trade.direction') }}</th>
                                        <th>{{ $t('trade.closedNum') }}({{ $t('trade.volumeUnit') }})</th>
                                        <th>{{ $t('trade.positionPrice') }}</th>
                                        <th>{{ $t('trade.closedPrice') }}</th>
                                        <th>{{ $t('closed.closedType') }}</th>
                                        <th>{{ $t('trade.netProfit') }}({{ symbolCode }})</th>
                                        <th>{{ $t('trade.profit') }}</th>
                                        <th>{{ $t('trade.swap') }}</th>
                                        <th>{{ $t('trade.fee') }}</th>
                                        <th>{{ $t('fundingDetails.orderId') }}</th>
                                        <th>{{ $t('closed.openPositionTime') }}</th>
                                        <th>{{ $t('closed.closedTime') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for='item in dataList' :key='item.id'>
                                        <td>
                                            <div>
                                                {{ item.simplified }}
                                            </div>
                                            <div v-if="language!=='en-US'">
                                                {{ item.short_name }}
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                :class="item.openDirection==='BUY'?'riseColor':'fallColor'"
                                            >
                                                {{ item.openDirection =='BUY'?$t('trade.buy'):$t('trade.sell') }}
                                            </span>
                                        </td>
                                        <td>{{ item.tradeVolume }}</td>
                                        <td>{{ item.openPrice }}</td>
                                        <td>{{ item.tradePrice }}</td>
                                        <td>{{ $t('dealReason.'+item.dealReason) }}</td>
                                        <td>
                                            <span
                                                :class="{ 'riseColor':item.profit+item.swap+item.commission>0,
                                                          'fallColor':item.profit+item.swap+item.commission<0 }"
                                            >
                                                {{ item.profit+item.swap+item.commission | moneyAccuracy }}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                :class="{ 'riseColor':item.profit>0,
                                                          'fallColor':item.profit<0 }"
                                            >
                                                {{ item.profit | moneyAccuracy }}
                                            </span>
                                        </td>
                                        <td>{{ item.swap | moneyAccuracy }}</td>
                                        <td>{{ item.commission | moneyAccuracy }}</td>
                                        <td>{{ item.dealId }}</td>
                                        <td>{{ item.openTime | formatTimesZone }}</td>
                                        <td>{{ item.tradeTime | formatTimesZone }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <router-link
                        v-for='item in dataList'
                        :key='item.id'
                        class='link'
                        :to="{ name:'SellOrderInfo',params:{ id:item.dealId } }"
                    >
                        <div class='item'>
                            <div class='cell'>
                                <div class='th'>
                                    <div class='name'>
                                        {{ item.simplified }}
                                    </div>
                                    <div v-if="language!=='en-US'" class='lot'>
                                        {{ item.short_name }}
                                    </div>
                                    <p>
                                        <span
                                            :class="item.openDirection==='BUY'?'riseColor':'fallColor'"
                                        >
                                            {{ item.openDirection =='BUY'?$t('trade.buy'):$t('trade.sell') }}
                                        </span>
                                        {{ item.tradeVolume }}{{ $t('trade.volumeUnit') }}
                                    </p>
                                </div>
                                <div class='ft'>
                                    <span
                                        class='amount'
                                        :class="{ 'riseColor':item.profit+item.swap+item.commission>0,
                                                  'fallColor':item.profit+item.swap+item.commission<0 }"
                                    >
                                        {{ (item.profit+item.swap+item.commission) | moneyAccuracy }}
                                    </span>
                                    <span class='currency'>
                                        {{ $t('trade.netProfit') }}({{ symbolCode }})
                                    </span>
                                </div>
                            </div>
                            <div class='cell bt-align'>
                                <div class='price'>
                                    <div>
                                        <div class='price_item'>
                                            <span class='title'>
                                                {{ $t('trade.positionPrice') }}
                                            </span>
                                            <span>{{ item.openPrice }}</span>
                                        </div>
                                        <div class='price_item'>
                                            <span class='title'>
                                                {{ $t('trade.swap_2') }}
                                            </span>
                                            <span>{{ item.swap | moneyAccuracy }} {{ symbolCode }}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div class='price_item'>
                                            <span class='title'>
                                                {{ $t('trade.closedPrice') }}
                                            </span>
                                            <span>{{ item.tradePrice }}</span>
                                        </div>

                                        <div class='price_item'>
                                            <span class='title'>
                                                {{ $t('trade.fee') }}
                                            </span>
                                            <span>{{ item.commission | moneyAccuracy }} {{ symbolCode }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class='ft'>
                                    <div class='time'>
                                        {{ item.tradeTime | formatTimesZone }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </router-link>
                </template>
            </template>
            <ListEmpty v-else :txt="userLoginInfo.account_id?$t('trade.closedEmpty'):$t('trade.positionNotLogin')" />
        </template>
    </div>
</template>

<script>
import ListEmpty from '@m/components/ListEmpty'
import { tradeInfo } from '@/api/base'
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
import pcMixin from '@m/mixins/pc'
export default {
    name: 'PositionListC',
    components: {
        ListEmpty
    },
    mixins: [pcMixin],
    filters: {
        formatTimesZone (val) {
            if (val) {
                return dayjs(new Date(val)).format('YYYY/MM/DD HH:mm:ss')
            } else {
                return '--'
            }
        }
    },
    data () {
        return {
            dataList: [],
            loading: false,
            activeType: 0
        }
    },
    computed: {
        ...mapGetters(['symbolCode']),
        userLoginInfo () {
            return this.$store.state.ix_user.userLoginInfo || {}
        },
        language () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.language
        },
    },
    mounted () {
        this.getTradeInfo(1)
    },
    methods: {
        getTradeData (params) {
            this.loading = true
            tradeInfo(params)
                .then(res => {
                    if (res.code !== 1) {
                        this.loading = false
                        this.$toast({ duration: 1000, message: res.msg })
                        return
                    }
                    const productMap = this.$store.state.ix_quote.product_map
                    const _arr = []
                    res.data.forEach(item => {
                        const _baseInfo = productMap[item.symbolName] || { groupSymbol: {} }
                        _arr.push(Object.assign(item, {
                            simplified: _baseInfo.simplified,
                            short_name: _baseInfo.short_name,
                            display_name: _baseInfo.groupSymbol.display_name,
                            openPrice: parseFloat(item.openPrice).toFixed(_baseInfo.groupSymbol.digits),
                            tradePrice: parseFloat(item.tradePrice).toFixed(_baseInfo.groupSymbol.digits),
                            // tradeVolume: item.tradeVolume / item.contractSize
                        }))
                    })
                    this.dataList = _arr
                    this.loading = false
                })
                .catch(error => {
                    this.loading = false
                    console.log('超时')
                    // this.$dialog.alert({
                    //     title: '超时提示',
                    //     message: '由于网络不稳定,获取平仓列表失败！',
                    //     confirmButtonText: '我知道了'
                    // })
                })
        },
        getTradeInfo (type) {
            if (type) { this.activeType = type }
            let beginTime = null
            if (type === 1) {
                beginTime = dayjs().format('YYYY-MM-DD')
            } else if (type === 2) {
                beginTime = dayjs().subtract(6, 'day').format('YYYY-MM-DD')
            } else if (type === 3) {
                beginTime = dayjs().subtract(30, 'day').format('YYYY-MM-DD')
            }
            this.getTradeData({
                gmt: dayjs().utcOffset() / 60,
                endTime: dayjs().format('YYYY-MM-DD'),
                beginTime
            })
        }
    }
}
</script>

<style scoped lang="scss">
@import "~@m/sass/mixin.scss";
.table-scroll {
    position: relative;
    // margin: auto;
    // overflow-x: hidden;
    // overflow-y: auto;
    .table-wrap {
        overflow: auto;
        @include scroll();
    }
    table {
        border-collapse: separate;
        border-spacing: 0;
        width: 100%;
        td,
        th {
            padding: 5px 10px;

            box-shadow: 0px -1px 0px 0px #ecedf2;
            background: #fff;
            white-space: nowrap;
            vertical-align: middle;
            height: 43px;
        }
        .fixed-side {
            position: absolute;
            width: 80px;
            text-align: center;
            right: 0;
            top: auto;
            line-height: 36px;
        }
    }
}
.m-ccgd{
    &.pc{
        .groupBtn {
            padding-left: 10px;
            margin-bottom: 0;
        }
    }
}
.groupBtn {
    margin-bottom: rem(30px);
    ::v-deep {
        .van-button {
            margin-right: rem(10px);
            color: #999999;
            height: rem(48px);
            line-height: rem(46px);
            border-radius: rem(6px);
        }
        .active {
            color: #fff;
        }
    }
}
.amount {
    position: absolute;
    top: rem(60px);
    right: rem(20px);
}
</style>
