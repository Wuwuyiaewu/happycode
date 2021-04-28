<template>
    <div class='m-ccgd'>
        <van-loading v-if='loading' class='m-loading' size='30px'>
            {{ $t('compLang.loading') }}
        </van-loading>
        <template v-else>
            <template v-if='showPositionList.length>0'>
                <template v-if='isPC'>
                    <div id='table-scroll' class='table-scroll'>
                        <div class='table-wrap'>
                            <table class='main-table'>
                                <thead>
                                    <tr>
                                        <th>{{ $t('trade.nameCode') }}</th>
                                        <th>{{ $t('trade.direction') }}</th>
                                        <th>{{ $t('trade.positionNumber') }}({{ $t('trade.volumeUnit') }})</th>
                                        <th>{{ $t('trade.positionPrice') }}</th>
                                        <th>{{ $t('trade.currentPrice') }}</th>
                                        <th>{{ $t('trade.stopLossPrice') }}</th>
                                        <th>{{ $t('trade.stopProfitPrice') }}</th>
                                        <th>{{ $t('trade.netProfit') }}({{ symbolCode }})</th>
                                        <th>{{ $t('trade.profit') }}</th>
                                        <th>{{ $t('trade.swap') }}</th>
                                        <th>{{ $t('trade.fee') }}</th>
                                        <!-- <th>{{ $t('trade.originalMargin') }}</th> -->
                                        <th>{{ $t('trade.positionId') }}</th>
                                        <th>{{ $t('closed.openPositionTime') }}</th>
                                        <th class='fixed-side' scope='col'>
                                            {{ $t('trade.operating') }}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for='(item,i) in showPositionList' :key='i'>
                                        <td>
                                            <div class='name'>
                                                {{ item.simplified }}
                                            </div>
                                            <div v-if="language!=='en-US'" class='code'>
                                                {{ item.short_name }}
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                :class="{ 'riseColor':item.direction===1,'fallColor':item.direction===2 }"
                                            >
                                                {{ item.direction | direction }}
                                            </span>
                                        </td>
                                        <td>{{ item.volume }}</td>
                                        <td>{{ item.open_price }}</td>
                                        <td>
                                            <span :class='item.direction === 1?item.sell_color:item.buy_color'>
                                                <template v-if='item.direction === 1'>
                                                    {{ item.sell_price || '--' }}
                                                </template>
                                                <template v-else-if='item.direction === 2'>
                                                    {{ item.buy_price || '--' }}
                                                </template>
                                            </span>
                                        </td>

                                        <td>
                                            <span
                                                :class="Math.abs(item.direction === 1?item.sell_price-item.stop_loss:item.buy_price-item.stop_loss)<=item.groupSymbol.pip*5?'warn':''"
                                            >
                                                {{ item.stop_loss != 0? item.stop_loss:$t('noSetup') }}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                :class="Math.abs(item.direction === 1?item.sell_price-item.take_profit:item.buy_price-item.take_profit)<=item.groupSymbol.pip*5?'warn':''"
                                            >
                                                {{ item.take_profit != 0? item.take_profit:$t('noSetup') }}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                :class="{
                                                    'riseColor':item.profitOrLoss+ item.swap+item.commission >0,
                                                    'fallColor':item.profitOrLoss+ item.swap+item.commission <0 }"
                                            >
                                                {{ item.profitOrLoss+item.swap+item.commission | moneyAccuracy }}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                :class="{
                                                    'riseColor':item.profitOrLoss>0,
                                                    'fallColor':item.profitOrLoss<0 }"
                                            >
                                                {{ item.profitOrLoss | moneyAccuracy }}
                                            </span>
                                        </td>
                                        <td>{{ item.swap | moneyAccuracy }}</td>
                                        <td>{{ item.commission | moneyAccuracy }}</td>
                                        <!-- <td>--</td> -->
                                        <td>{{ item.id }}</td>
                                        <td>{{ item.open_time | formatTimestamp }}</td>
                                        <td class='fixed-side'>
                                            <van-button
                                                color='#477FD3'
                                                plain
                                                size='mini'
                                                @click.prevent="handleActivePosition(item,'profit')"
                                            >
                                                {{ $t('trade.tackStopSetup') }}
                                            </van-button>
                                            <van-button
                                                color='#477FD3'
                                                plain
                                                size='mini'
                                                @click.prevent="handleActivePosition(item,'sell')"
                                            >
                                                {{ $t('trade.closed') }}
                                            </van-button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class='m-orderBy'>
                        <van-button :class="{ 'mainColor':sortBy.key === 'time' }" @click="_collect('时间');sortOrder('time')">
                            {{ $t("trade.sortTime") }}
                            <i
                                v-if="sortBy.key === 'time'"
                                class='iconfont'
                                :class="{
                                    'icon_paixuxiaojiantou_xiangshang': sortBy.type === 'desc',
                                    'icon_paixuxiaojiantou_xiangxia': sortBy.type === 'asc' }"
                            ></i>
                        </van-button>
                        <van-button :class="{ 'mainColor':sortBy.key === 'profit' }" @click="_collect('时间');sortOrder('profit')">
                            {{ $t("trade.profit") }}
                            <i
                                v-if="sortBy.key === 'profit'"
                                class='iconfont'
                                :class="{
                                    'icon_paixuxiaojiantou_xiangshang': sortBy.type === 'desc',
                                    'icon_paixuxiaojiantou_xiangxia': sortBy.type === 'asc' }"
                            ></i>
                        </van-button>
                    </div>
                    <router-link
                        v-for='(item,i) in showPositionList'
                        :key='i'
                        class='link'
                        :to="{ name:'MyOrderInfo',params:{ id:item.id } }"
                        @click.native='routerClick($event)'
                    >
                        <Item
                            :index='i'
                            :item='item'
                            :language='language'
                            :show-tip='showTip'
                            @closeTip='closeTip'
                            @handleActivePosition='handleActivePosition'
                        />
                    </router-link>
                </template>
            </template>
            <ListEmpty v-else :txt="userLoginInfo.account_id?$t('trade.positionEmpty'):$t('trade.positionNotLogin')" />
        </template>
        <DialogPc :orderid='activeOrder.id' :show.sync='showSell' />
        <DialogZyzs
            :direction='activeOrder.direction'
            :is-position='true'
            :product='activeOrder'
            :show.sync='showSetProfit'
            @submit='setProfitSuccess'
        />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import DialogPc from '@m/components/DialogPc'
import DialogZyzs from '@m/components/DialogZyzs'
import ListEmpty from '@m/components/ListEmpty'
import Item from './positionListA_item'
import pcMixin from '@m/mixins/pc'
export default {
    name: 'PositionListAPc',
    components: {
        DialogPc,
        DialogZyzs,
        ListEmpty,
        Item
    },
    mixins: [pcMixin],
    data () {
        return {
            showSell: false,
            showSetProfit: false,
            loading: false,
            showTip: true,
            activeOrder: {},
            sortBy: {
                key: 'time',
                type: 'asc'
            }
        }
    },
    computed: {
        ...mapGetters(['accountData', 'assetAb outInfo', 'symbolCode']),
        userLoginInfo () {
            return this.$store.state.ix_user.userLoginInfo || {}
        },
        language () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.language
        },
        showPositionList () {
            const dataList = this.accountData.positionList
            let showList = []
            if (dataList.length > 1) {
                if (this.sortBy.key === 'time') {
                    if (this.sortBy.type === 'asc') {
                        showList = [].concat(dataList).reverse()
                    } else {
                        showList = [].concat(dataList)
                    }
                } else if (this.sortBy.key === 'profit') {
                    showList = dataList.sort((preItem, item) => {
                        if (this.sortBy.type === 'asc') {
                            return (preItem.profitOrLoss + preItem.swap + preItem.commission) - (item.profitOrLoss + item.swap + item.commission)
                        } else {
                            return (item.profitOrLoss + item.swap + item.commission) - (preItem.profitOrLoss + preItem.swap + preItem.commission)
                        }
                    })
                }
                // if (
                //     this.assetAboutInfo.colorClass === "stopout" &&
                //     this.sortBy.key !== "profit"
                // ) {
                //     const newArr = showList.map(item => item.profitOrLoss);
                //     const _index = []
                //         .concat(newArr)
                //         .lastIndexOf(newArr.sort((a, b) => a - b)[0]);
                //     showList = showList.splice(_index, 1).concat(showList); // 有提示的移动到第一位
                // }
            } else {
                showList = [].concat(dataList)
            }
            return showList
        }
    },
    activated () {
        this.showTip = true
        this.setProfitSuccess()
    },
    mounted () {
        this.setProfitSuccess()
    },
    methods: {
        ...mapActions({
            'symoblCanTrade': 'ix_baseInfo/symoblCanTrade'
        }),
        handleActivePosition (item, type) {
            this.symoblCanTrade(item.groupSymbol.id)
                .then(res => {
                    if (!res.mayTrade) {
                        this.$toast({ duration: 2000, message: this.$t('trade.marketIsClosed') })
                        return
                    }
                    if (!item.cur_price) {
                        return
                    }
                    this.activeOrder = item
                    if (type === 'sell') {
                        this.showSell = true
                    } else if (type === 'profit') {
                        this.showSetProfit = true
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        sortOrder (type) {
            if (this.sortBy.key === type) {
                this.sortBy.type = this.sortBy.type == 'asc' ? 'desc' : 'asc'
            } else {
                this.sortBy.key = type
                this.sortBy.type = 'asc'
            }
        },
        closeTip () {
            this.showTip = false
        },
        setProfitSuccess () {
            this.$mSocket
                .send('positions', {
                    account_id: this.userLoginInfo.account_id
                })
                .then((res) => {
                    const closeId = this.$route.query.close
                    // 存在内容需要弹起平仓窗口
                    if (closeId) {
                        const positionData = this.showPositionList.find(item => (item.id === Number(closeId)))
                        if (positionData) {
                            this.activeOrder = positionData
                            this.showSell = true
                        }
                    }
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false
                })
        },
        // 显示隐藏图表
        toggleMinuteChart () {
            // const chart
        },
        // 路由跳转统计
        routerClick ($event) {
            this._collect('交易_持仓_订单区域', true)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.m-ccgd {
    .m-orderBy {
        margin-bottom: rem(20px);
        ::v-deep {
            .van-button {
                font-size: rem(20px);
                color: #999999;
                border: none;
                margin-right: rem(10px);
                min-width: rem(110px);
                height: rem(48px);
                line-height: rem(48px);
                i {
                    font-size: rem(18px);
                }
            }
        }
    }
}
.table-scroll {
    position: relative;
    margin: auto;
    overflow-x: hidden;
    overflow-y: auto;
    @include scroll();
    .table-wrap {
        margin-right: 200px;
        overflow: auto;
        @include scroll();
    }
    table {
        border-collapse: separate;
        border-spacing: 0;
        width: 100%;
        .warn {
           background-color: $warn;
        }
        td,
        th {
            padding: 5px 10px;

            box-shadow: 0px -1px 0px 0px #ecedf2;
            background: #fff;
            white-space: nowrap;
            vertical-align: middle;
            height: 43px;
        }
        thead{
            .fixed-side{
                top:0;
            }
        }
        .fixed-side {
            position: absolute;
            width: 200px;
            text-align: center;
            right: 0;
            top: auto;
            line-height: 36px;
            div {
                line-height: 1;
            }
            ::v-deep{
                .van-button--mini{
                    font-size:12px;
                }
            }
        }
    }
}
</style>
