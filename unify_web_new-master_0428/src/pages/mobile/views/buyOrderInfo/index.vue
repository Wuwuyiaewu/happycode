<template>
    <div ref='orderPage' class='orderPage'>
        <Top>
            <div slot='right'></div>
        </Top>
        <div class='main'>
            <van-loading v-if='loading' class='m-loading' size='30px'>
                {{ $t('compLang.loading') }}
            </van-loading>
            <div v-else class='m-orderInfo'>
                <div class='layout layout-1'>
                    <div class='item item-1' @click='toDetail(showPendings.productData)'>
                        <div class='left'>
                            <div>
                                <span class='name'>
                                    {{ showPendings.simplified }}
                                </span>
                                <span v-if="language!=='en-US'" class='code'>
                                    {{ showPendings.short_name }}
                                </span>
                            </div>
                            <!-- <div class="tags">
                                <van-tag class="tag">{{ $t('trade.orderTypePending'+showPendings.type)}}</van-tag>
                                <van-tag
                                    v-if="showPendings.expire_type"
                                    class="tag"
                                >{{ showPendings.expire_type | expireType }}</van-tag>
                            </div>-->
                        </div>
                        <!-- <div class="right">
                            <div
                                class="money"
                                :class="showPendings.direction === 1?showPendings.productData.buy_color:showPendings.productData.sell_color"
                            >
                                <template
                                    v-if="showPendings.direction === 2"
                                >{{ showPendings.productData.sell_price || '--' }}</template>
                                <template
                                    v-else-if="showPendings.direction === 1"
                                >{{ showPendings.productData.buy_price || '--' }}</template>
                            </div>
                            <div class="now">{{$t('trade.currentPrice')}}</div>
                        </div>-->
                    </div>
                    <div class='item item-2'>
                        <div class='col'>
                            <div
                                class='sub'
                                :class="{ 'riseColor':showPendings.direction===1,'fallColor':showPendings.direction===2 }"
                            >
                                {{ showPendings.direction | direction }}
                            </div>
                            <div class='name'>
                                {{ showPendings.request_volume }}{{ $t('trade.volumeUnit') }}
                            </div>
                        </div>
                        <div class='col'>
                            <div class='sub'>
                                {{ $t('trade.pendingPrice') }}
                            </div>
                            <div class='name'>
                                <span
                                    class='number'
                                    :class="Math.abs(showPendings.direction === 1?showPendings.productData.buy_price-showPendings.request_price:showPendings.productData.sell_price-showPendings.request_price)<=showPendings.groupSymbol.pip*5?'warn':''"
                                >
                                    {{ showPendings.request_price }}
                                </span>
                            </div>
                        </div>
                        <div class='col'>
                            <div class='sub'>
                                {{ $t('trade.currentPrice') }}
                            </div>
                            <div
                                class='name'
                                :class='showPendings.direction === 1?showPendings.productData.buy_color:showPendings.productData.sell_color'
                            >
                                <template
                                    v-if='showPendings.direction === 2'
                                >
                                    {{ showPendings.productData.sell_price || '--' }}
                                </template>
                                <template
                                    v-else-if='showPendings.direction === 1'
                                >
                                    {{ showPendings.productData.buy_price || '--' }}
                                </template>
                            </div>
                        </div>
                    </div>
                    <div class='item item-2'>
                        <div class='col'>
                            <div class='sub'>
                                {{ $t('trade.stopLossPrice') }}
                            </div>
                            <div
                                class='name'
                                :class="{ 'number':showPendings.stop_loss ==0 }"
                            >
                                {{ showPendings.stop_loss != 0? showPendings.stop_loss:$t('noSetup') }}
                            </div>
                        </div>
                        <div class='col'>
                            <div class='sub'>
                                {{ $t('trade.stopProfitPrice') }}
                            </div>
                            <div
                                class='name'
                                :class="{ 'number':showPendings.take_profit ==0 }"
                            >
                                {{ showPendings.take_profit != 0? showPendings.take_profit:$t('noSetup') }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class='layout layout-3'>
                    <div class='item van-hairline--bottom'>
                        <div class='left'>
                            <div class='title'>
                                {{ $t('trade.expiryTime') }}
                            </div>
                            <!-- <i data-type="1" class="van-icon van-icon-info-o"/>-->
                        </div>
                        <div class='right'>
                            {{ showPendings.expireType | expireType }}
                        </div>
                    </div>
                    <div class='item van-hairline--bottom'>
                        <div class='left'>
                            <div class='title'>
                                {{ $t('trade.pendingTime') }}
                            </div>
                            <!-- <i data-type="1" class="van-icon van-icon-info-o"/>-->
                        </div>
                        <div class='right'>
                            {{ showPendings.request_time | formatTimestamp }}
                        </div>
                    </div>
                    <div class='item'>
                        <div class='left'>
                            <div class='title'>
                                {{ $t('closed.orderId') }}
                            </div>
                            <!-- <i data-type="1" class="van-icon van-icon-info-o"/>-->
                        </div>
                        <div class='right'>
                            ID : {{ $route.params.id }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if='!loading' class='submitBox'>
            <van-button :disabled='!isTrade' plain @click='handleShowCancelOrderTip'>
                {{ $t('trade.cancelPending') }}
            </van-button>
        </div>
        <DialogBottomTip
            :show.sync='showCancelOrderTip'
            :tips="$t('trade.cancelPendingConfirm')"
            :title="$t('trade.cancelPending')"
            @submit='cancelOrder'
        />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Top from '@m/layout/top'
import { msg_id } from '@/utils/index'
import { getDecimalNum } from '@/utils/calculation'
import DialogBottomTip from '@m/components/DialogBottomTip'
export default {
    name: 'BuyOrderInfo',
    data () {
        return {
            showCancelOrderTip: false,
            loading: false,
            pendingsInfo: {},
            showPendings: {
                groupSymbol: {},
                productData: {}
            },
            isTrade: true
        }
    },
    mounted () {
        const orderPage = this.$refs.orderPage
        orderPage.style.height = document.body.clientHeight + 'px'
        this.$options.sockets.onmessage = this.wsMessage
        this.getPendings()
    },
    beforeDestroy () {
        delete this.$options.sockets.onmessage
    },
    methods: {
        ...mapActions({
            'symoblCanTrade': 'ix_baseInfo/symoblCanTrade'
        }),
        handleShowCancelOrderTip () {
            this.showCancelOrderTip = true
        },
        cancelOrder () {
            this.$mSocket.send('cancelOrder', {
                id: this.showPendings.id,
                msgId: msg_id(),
                accountId: this.showPendings.account_id,
                groupId: this.showPendings.groupSymbol.group_id,
                positionId: this.showPendings.position_id,
                status: 5
            })
                .then(res => {
                    if (res.errorType) {
                        this.$toast(
                            {
                                duration: 1000,
                                message: this.$te('retMsg.' + res.errorData.ret) ? this.$t('retMsg.' + res.errorData.ret) : res.remark
                            })
                        return
                    }
                    this.showCancelOrderTip = false
                    this.$toast({ duration: 1000, message: this.$t('trade.cancelPendingSuccess'), onClose: () => { this.$router.go(-1) } })
                })
                .catch(error => {
                    this.$toast({ duration: 1000, message: this.$t('timeOut') })
                    console.log(error)
                })
        },
        wsMessage (evt) {
            if (typeof evt.data === 'object' || evt.data.indexOf('{') !== 0) {
                return
            }
            const { msg_code } = JSON.parse(evt.data)
            if (msg_code.toLowerCase() === 'OrderUpdateRet'.toLowerCase() ||
                msg_code.toLowerCase() === 'OrderCancelRet'.toLowerCase() ||
                msg_code.toLowerCase() === 'PositionAddRet'.toLowerCase()) {
                // 收到订单变化
                this.getPendings()
            }
        },
        getPendings () {
            this.loading = true
            this.$mSocket.send('pendings', {
                account_id: this.userLoginInfo.account_id,
                count: 200
            })
                .then(res => {
                    if (res.errorType) {
                        this.$toast(
                            {
                                duration: 1000,
                                message: this.$te('retMsg.' + res.errorData.ret) ? this.$t('retMsg.' + res.errorData.ret) : res.remark
                            })
                        this.loading = false
                        return
                    }
                    const data_list = res.data_list || []
                    this.pendingsInfo = data_list.filter(item => (item.id == this.$route.params.id))[0] || {}
                    this.loading = false

                    if (!this.pendingsInfo.id) {
                        this.$dialog.alert({
                            message: this.$t('trade.pendingSearchEmpty')
                        }).then(() => {
                            this.$router.go(-1)
                        })
                    } else {
                        const _baseInfo = this.productMap[this.pendingsInfo.symbol] || {}
                        this.pendingsInfo.request_price = this.pendingsInfo.request_price.toFixed(_baseInfo.groupSymbol.digits)
                        if (this.pendingsInfo.stop_loss) {
                            this.pendingsInfo.stop_loss = this.pendingsInfo.stop_loss.toFixed(_baseInfo.groupSymbol.digits)
                        }
                        if (this.pendingsInfo.take_profit) {
                            this.pendingsInfo.take_profit = this.pendingsInfo.take_profit.toFixed(_baseInfo.groupSymbol.digits)
                        }
                        this.showPendings = Object.assign({
                            productData: _baseInfo
                        }, _baseInfo, this.pendingsInfo)

                        this.showPendings.request_volume = (this.showPendings.request_volume / _baseInfo.groupSymbol.contract_size).toFixed(getDecimalNum(_baseInfo.groupSymbol.volumes_step))
                        this.$ws.send_addSubscription_proList([_baseInfo.code_id])
                        this.symoblCanTrade(this.showPendings.groupSymbol.id)
                            .then(res => {
                                this.isTrade = res.mayTrade
                                if (!this.isTrade) {
                                    this.$toast({ duration: 2000, message: this.$t('trade.marketIsClosed') })
                                }
                            })
                    }
                })
                .catch(error => {
                    console.log(error)
                    this.loading = false
                })
        },
        toDetail (data) {
            this.$router.push({ name: 'ProductDetail', params: { id: data.code_id } })
        }
    },
    destroyed () {
        if (this.$dialog) {
            this.$dialog.close()
        }
    },
    computed: {
        ...mapGetters(['style']),
        userLoginInfo () {
            return this.$store.state.ix_user.userLoginInfo || {}
        },
        language () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.language
        },
        productMap () {
            return this.$store.state.ix_quote.product_map
        }
    },
    components: {
        Top,
        DialogBottomTip
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
    .main {
        height: 100%;
        padding-bottom: rem(90px);
        overflow: auto;
        .itemNotice {
            height: rem(50px);
            font-size: rem(24px);
        }
        .m-loading {
            text-align: center;
            padding-top: rem(60px);
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
            border: none;
            border-radius: 0;
            height: rem(100px);
            font-size: rem(34px);
            &:last-child {
                flex: 1;
            }
        }
        .van-button--plain {
            color: #477fd3;
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
    }
    .layout-1 {
        .name {
            color: #333333;
            font-size: rem(28px);
            &.number {
                color: #999999;
            }
        }
        .warn {
            background-color: $warn;
        }
        .tags {
            display: inline-block;
            .tag {
                margin-right: rem(17px);
                background-color: #f9f9f9;
                color: #999;
                font-size: rem(20px);
            }
        }
        .code {
            padding-left: rem(5px);
            color: #999999;
            font-size: rem(20px);
        }
        .money {
            font-size: rem(34px);
        }
        .now {
            color: #999;
            font-size: rem(20px);
            text-align: right;
        }
    }
    .layout-2 {
        font-size: rem(28px);
        color: #999999;
        .right {
            .number {
                color: #333;
            }
            i {
                margin-left: rem(24px);
                color: #999999;
                font-size: rem(24px);
            }
        }
    }
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
