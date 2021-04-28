<template>
    <div class='orderPage'>
        <Top>
            <div slot='right'></div>
        </Top>
        <div class='main'>
            <van-loading v-if='loading' class='m-loading' size='30px'>
                {{ $t('compLang.loading') }}
            </van-loading>
            <template v-else>
                <!-- <error-tips v-if="showErrorMsg(orderInfo.maxLoss)" :type="assetAboutInfo.colorClass" /> -->
                <div class='m-orderInfo'>
                    <div class='layout layout-1'>
                        <div class='item item-1' @click='toDetail(orderInfo)'>
                            <div class='left'>
                                <div class='name'>
                                    {{ orderInfo.simplified }}
                                </div>
                                <div v-if="language!=='en-US'" class='code'>
                                    {{ orderInfo.short_name }}
                                </div>
                            </div>
                        </div>
                        <div class='item item-2'>
                            <div class='col'>
                                <div class='sub'>
                                    {{ $t('trade.positionNetProfit') }}({{ symbolCode }})
                                </div>
                                <div
                                    class='name'
                                    :class="{
                                        'riseColor':orderInfo.profitOrLoss+ orderInfo.swap+orderInfo.commission >0,
                                        'fallColor':orderInfo.profitOrLoss+ orderInfo.swap+orderInfo.commission <0 }"
                                >
                                    {{ orderInfo.profitOrLoss+ orderInfo.swap+orderInfo.commission | moneyAccuracy }}
                                </div>
                            </div>
                            <div class='col'>
                                <div class='sub'>
                                    {{ $t('trade.positionProfit') }}({{ symbolCode }})
                                </div>
                                <div
                                    class='name'
                                    :class="{
                                        'riseColor':orderInfo.profitOrLoss>0,
                                        'fallColor':orderInfo.profitOrLoss<0 }"
                                >
                                    {{ orderInfo.profitOrLoss | moneyAccuracy }}
                                </div>
                            </div>
                            <div class='col'>
                                <div class='sub'>
                                    {{ $t('trade.swap_2') }}({{ symbolCode }})
                                </div>
                                <div class='name'>
                                    {{ orderInfo.swap | moneyAccuracy }}
                                </div>
                            </div>
                            <div class='col'>
                                <div class='sub'>
                                    {{ $t('trade.fee') }}({{ symbolCode }})
                                </div>
                                <div class='name'>
                                    {{ orderInfo.commission | moneyAccuracy }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class='layout layout-1'>
                        <div class='item item-2 van-hairline--bottom'>
                            <div class='col'>
                                <div
                                    class='sub'
                                    :class="{ 'riseColor':orderInfo.direction===1,'fallColor':orderInfo.direction===2 }"
                                >
                                    {{ orderInfo.direction | direction }}
                                </div>
                                <div class='name'>
                                    {{ orderInfo.volume }}{{ $t('trade.volumeUnit') }}
                                </div>
                            </div>
                            <div class='col'>
                                <div class='sub'>
                                    {{ $t('trade.positionPrice') }}
                                </div>
                                <div class='name'>
                                    {{ orderInfo.open_price }}
                                </div>
                            </div>
                            <div class='col'>
                                <div class='sub'>
                                    {{ $t('trade.currentPrice') }}
                                </div>
                                <div
                                    class='name'
                                    :class='orderInfo.direction === 1?orderInfo.sell_color:orderInfo.buy_color'
                                >
                                    <template v-if='orderInfo.direction === 1'>
                                        {{ orderInfo.sell_price || '--' }}
                                    </template>
                                    <template v-if='orderInfo.direction === 2'>
                                        {{ orderInfo.buy_price || '--' }}
                                    </template>
                                </div>
                            </div>
                        </div>
                        <div class='item item-2 van-hairline--bottom'>
                            <div class='col'>
                                <div class='sub'>
                                    {{ $t('trade.stopLossPrice') }}
                                </div>
                                <div class='name'>
                                    <span
                                        v-if='orderInfo.direction'
                                        :class="{
                                            'number':orderInfo.stop_loss ==0,
                                            'warn':Math.abs(orderInfo.direction === 1?orderInfo.sell_price-orderInfo.stop_loss:orderInfo.buy_price-orderInfo.stop_loss)<=orderInfo.groupSymbol.pip*5
                                        }"
                                    >
                                        {{ orderInfo.stop_loss != 0? orderInfo.stop_loss:$t('noSetup') }}
                                    </span>
                                </div>
                            </div>
                            <div class='col'>
                                <div class='sub'>
                                    {{ $t('trade.stopProfitPrice') }}
                                </div>
                                <div class='name'>
                                    <span
                                        v-if='orderInfo.direction'
                                        :class="{
                                            'number':orderInfo.take_profit ==0,
                                            'warn':Math.abs(orderInfo.direction === 1?orderInfo.sell_price-orderInfo.take_profit:orderInfo.buy_price-orderInfo.take_profit)<=orderInfo.groupSymbol.pip*5
                                        }"
                                    >
                                        {{ orderInfo.take_profit != 0? orderInfo.take_profit:$t('noSetup') }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- <div class="layout layout-2" @click="handleActivePosition('profit')">
                        <div class="item van-hairline--bottom">
                            <div class="left">{{$t('trade.stopProfitPrice')}}</div>
                            <div class="right">
                                <span
                                    v-if="orderInfo.direction"
                                    :class="{
                                        'number':orderInfo.take_profit !=0,
                                         'warn':Math.abs(orderInfo.direction === 1?orderInfo.sell_price-orderInfo.take_profit:orderInfo.buy_price-orderInfo.take_profit)<=orderInfo.groupSymbol.pip*5
                                        }"
                                >{{ orderInfo.take_profit != 0? orderInfo.take_profit:$t('noSetup') }}</span>
                                <i class="van-icon van-icon-arrow" />
                            </div>
                        </div>
                        <div class="item">
                            <div class="left">{{$t('trade.stopLossPrice')}}</div>
                            <div class="right">
                                <span
                                    v-if="orderInfo.direction"
                                    :class="{
                                        'number':orderInfo.stop_loss !=0,
                                        'warn':Math.abs(orderInfo.direction === 1?orderInfo.sell_price-orderInfo.stop_loss:orderInfo.buy_price-orderInfo.stop_loss)<=orderInfo.groupSymbol.pip*5
                                        }"
                                >{{ orderInfo.stop_loss != 0? orderInfo.stop_loss:$t('noSetup') }}</span>
                                <i class="van-icon van-icon-arrow" />
                            </div>
                        </div>
                    </div>-->
                    <div class='layout layout-3'>
                        <!--<div class="item van-hairline&#45;&#45;bottom">
                            <div class="left">
                                <div class="title">订单初始保证金({{ symbolCode }})</div>
                                <i data-type="1" class="van-icon van-icon-info-o"/>
                            </div>
                            <div class="right">{{ orderInfo.open_margin*orderInfo.volume | moneyAccuracy(false)}}</div>
                        </div>-->
                        <!--<div class="item van-hairline&#45;&#45;bottom">
                            <div class="left">
                                <div class="title">订单开仓价值($)</div>
                                <i data-type="1" class="van-icon van-icon-info-o"/>
                            </div>
                            <div class="right">50000</div>
                        </div>
                        <div class="item van-hairline&#45;&#45;bottom">
                            <div class="left">
                                <div class="title">订单当前价值($)</div>
                                <i data-type="1" class="van-icon van-icon-info-o"/>
                            </div>
                            <div class="right">45000</div>
                        </div>-->
                        <div class='item van-hairline--bottom'>
                            <div class='left'>
                                <div class='title'>
                                    {{ $t('closed.openPositionTime') }}
                                </div>
                                <!--                            <i data-type="1" class="van-icon van-icon-info-o"/>-->
                            </div>
                            <div class='right'>
                                {{ orderInfo.open_time | formatTimestamp }}
                            </div>
                        </div>
                        <div class='item'>
                            <div class='left'>
                                <div class='title'>
                                    {{ $t('trade.positionId') }}
                                </div>
                                <!--                            <i data-type="1" class="van-icon van-icon-info-o"/>-->
                            </div>
                            <div class='right'>
                                ID : {{ orderInfo.id }}
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <div class='submitBox'>
            <van-button
                :color='style.mainColor'
                plain
                @click="handleActivePosition('profit')"
            >
                {{ $t('trade.tackStopSetup') }}
            </van-button>
            <van-button
                :color='style.mainColor'
                :disabled='!orderInfo.cur_price'
                @click="handleActivePosition('sell')"
            >
                {{ $t('trade.closed') }}
            </van-button>
        </div>
        <DialogZyzs
            :direction='orderInfo.direction'
            :is-position='true'
            :product='orderInfo'
            :show.sync='showSetProfit'
            @submit='setProfitSuccess'
        />
        <DialogPc from='myOrderInfo' :orderid='orderInfo.id' :show.sync='showSell' />
        <!--        <popup-bottom-tip :show.sync="showTips" :content="tipContent"/>-->
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Top from '@m/layout/top'
// import PopupBottomTip from '@m/components/PopupBottomTip'
import DialogZyzs from '@m/components/DialogZyzs'
import DialogPc from '@m/components/DialogPc'
import ErrorTips from '@m/components/ErrorTips'
export default {
    name: 'MyOrderInfo',
    data () {
        return {
            active: 0,
            showSetProfit: false,
            showSell: false,
            // showTips: false,
            // tipContent: {
            //     title: '订单初始保证金',
            //     txt: '当前订单建仓时，您所付出的保证金额度。'
            // },
            loading: false,
            positionInfo: {}
        }
    },
    mounted () {
        if (this.orderInfo && this.orderInfo.code_id) this.$store.commit('ix_quote/UPDATE_PRODUCT_ACTIVATED_ID', this.orderInfo.code_id)
        this.getData()
    },
    methods: {
        ...mapActions({
            'symoblCanTrade': 'ix_baseInfo/symoblCanTrade'
        }),
        handleActivePosition (type) {
            this.symoblCanTrade(this.orderInfo.groupSymbol.id)
                .then(res => {
                    if (!res.mayTrade) {
                        this.$toast({ duration: 2000, message: this.$t('trade.marketIsClosed') })
                        return
                    }
                    if (!this.orderInfo.cur_price) {
                        return
                    }
                    if (type === 'sell') {
                        this.showSell = true
                    } else if (type === 'profit') {
                        this.showSetProfit = true
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        setProfitSuccess () {
            this.$mSocket.send('positions', {
                account_id: this.userLoginInfo.account_id
            })
                .then(() => {
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false
                })
        },
        // showErrorMsg(maxLoss) {
        //     if (maxLoss && this.assetAboutInfo.colorClass === 'stopout') {
        //         return true
        //     } else {
        //         return false
        //     }
        // },
        getData () {
            if (this.accountData.positionList.filter(item => (item.id === parseInt(this.$route.params.id))).length > 0) {
                return
            }
            this.loading = true
            this.$mSocket.send('positions', { account_id: this.userLoginInfo.account_id })
                .then((res) => {
                    this.loading = false
                    if (res.errorType) {
                        this.$alert(this.$te('retMsg.' + res.errorData.ret) ? this.$t('retMsg.' + res.errorData.ret) : res.remark)
                        return
                    }
                    const data = res.data_list || []
                    if (data.filter(item => (item.id == this.$route.params.id)).length <= 0) {
                        this.$router.replace({ name: 'PositionIndex' })
                        // this.$dialog.alert({
                        //     message: this.$t('trade.positionSearchEmpty')
                        // }).then(() => {
                        //     this.$router.replace({ name: 'TradeIndex' })
                        // })
                    }
                })
                .catch(() => {
                    console.log('timeOut')
                    this.loading = false
                })
        },
        toDetail (data) {
            this.$router.push({ name: 'ProductDetail', params: { id: data.code_id } })
        },
    },
    computed: {
        ...mapGetters(['style', 'accountData', 'symbolCode', 'assetAboutInfo']),
        userLoginInfo () {
            return this.$store.state.ix_user.userLoginInfo || {}
        },
        language () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.language
        },
        orderInfo () {
            return this.accountData.positionList.filter(item => (item.id === parseInt(this.$route.params.id)))[0] || {}
        }
    },
    components: {
        Top,
        DialogZyzs,
        DialogPc,
        ErrorTips
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
@import "~@m/sass/variables.scss";
.orderPage {
    position: relative;
    padding-top: rem(90px);
    font-size: rem(28px);
    height: 100%;
    .main {
        height: 100%;
        padding-bottom: rem(90px);
        overflow: auto;
        .m-loading {
            padding: rem(30px) 0;
            text-align: center;
        }
    }
    .submitBox {
        position: absolute;
        z-index: 1;
        left: 0;
        bottom: 0;
        width: 100%;
        display: flex;
        .van-button {
            font-size: rem(30px);
            height: rem(90px);
            flex: 1;
            border-radius: 0;
            border: none;
        }
    }
}
.m-orderInfo {
    padding: rem(20px) rem(20px) rem(7px) rem(20px);
    .layout {
        border-radius: 10px;
        background-color: #fff;
        margin-bottom: rem(20px);
        .item {
            padding: rem(32px) rem(30px);
            display: flex;
            justify-content: space-between;
            align-items: center;
            &.item-1 {
                padding-bottom: 0;
            }
        }
    }
    ::v-deep {
        .van-button {
            border-radius: rem(6px);
            &__text {
                color: #477fd3;
            }
            &--mini {
                font-size: rem(24px);
                width: rem(124px);
                height: rem(48px);
                line-height: rem(48px);
            }
        }
        .van-tag {
            padding: rem(4px) rem(6px);
            line-height: 1;
            font-size: rem(20px);
            top: -2px;
            &--danger {
                position: relative;
                margin-left: rem(20px);
                background-color: $red;
                &:after {
                    position: absolute;
                    right: 99%;
                    top: 50%;
                    margin-top: rem(-4px);
                    content: "";
                    @include triangle(left, rem(4px), rem(8px), $red);
                }
            }
        }
    }
    .layout-1 {
        .item-2 {
            .col {
                .name {
                    margin-bottom: rem(4px);
                }
                &:last-child {
                    text-align: right;
                }
            }
        }
        .name {
            color: #333333;
            font-size: rem(28px);
            .number {
                color: #999999;
            }
            .warn {
                background-color: $warn;
            }
        }
        .code {
            color: #999999;
            font-size: rem(20px);
        }
        .sub {
            color: #999999;
            font-size: rem(24px);
        }
        .active {
            color: #333333;
            font-size: rem(28px);
        }
    }
    // .layout-2 {
    //     font-size: rem(28px);
    //     color: #999999;
    //     .right {
    //         .number {
    //             color: #333;
    //         }
    //         .warn {
    //             background-color: $warn;
    //         }
    //         i {
    //             margin-left: rem(24px);
    //             color: #999999;
    //             font-size: rem(24px);
    //         }
    //     }
    // }
    .layout-3 {
        font-size: rem(28px);
        .left {
            color: #999999;
            .title {
                margin-right: rem(20px);
                display: inline-block;
            }
            i {
                position: relative;
                top: rem(6px);
                font-size: rem(30px);
            }
        }
        .right {
            text-align: right;
        }
    }
}
</style>
