<template>
    <!-- 修改挂单 -->
    <div ref='orderPage' class='orderPage'>
        <Top>
            <div slot='right'></div>
        </Top>
        <div class='main'>
            <van-loading v-if='loading' class='m-loading' size='30px'>
                {{ $t('compLang.loading') }}
            </van-loading>
            <template v-else>
                <div class='mtop'>
                    <div class='productInfo'>
                        <p class='name'>
                            {{ showPendings.simplified }}
                            <span
                                v-if="language!=='en-US'"
                                class='code'
                            >
                                {{ showPendings.short_name }}
                            </span>
                        </p>
                        <span
                            class='price'
                            :class='showPendings.direction === 1 ? showPendings.buy_color : showPendings.sell_color'
                        >
                            <template v-if='showPendings.direction === 2'>
                                {{ showPendings.sell_price || '--' }}
                            </template>
                            <template v-else-if='showPendings.direction === 1'>
                                {{ showPendings.buy_price || '--' }}
                            </template>
                        </span>
                    </div>
                </div>
                <div class='pendingOrder'>
                    <van-row class='pendingOrderSet' justify='space-between' type='flex'>
                        <van-col>
                            <p class='title'>
                                {{ $t('trade.tradeNum') }}
                            </p>
                            <p class='priceSecticon'>
                                {{ $t('trade.unitNum') }}
                            </p>
                        </van-col>
                        <van-col>
                            <van-stepper
                                v-model.trim='lotNum'
                                button-size='10.6667vw'
                                class='stepper'
                                :decimal-length='stepDigit'
                                disabled
                                input-width='24vw'
                                min='0'
                                :step='showPendings.groupSymbol.volumes_step'
                            />
                        </van-col>
                    </van-row>
                </div>
                <LimitPrice
                    v-if='direction'
                    ref='limitPrice'
                    class='limitPriceWrapper'
                    :config='limitConfig'
                    :direction='direction'
                    :hide-title-bar='true'
                    :product='product'
                    @priceChange='pendingOrderPrice = $event'
                />
                <ProfitlossSet
                    v-if='direction'
                    ref='profitloss'
                    class='profitlossWrapper'
                    :config='profitLossConfig'
                    :direction='direction'
                    :pending-order-price='pendingOrderPrice'
                    :product='product'
                />
            </template>
        </div>
        <div v-if='!loading' class='submitBox'>
            <van-button block :color='style.mainColor' type='primary' @click='modifyPendingOrder'>
                {{ $t('save') }}
            </van-button>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Top from '@m/layout/top'
import { msg_id } from '@/utils/index'
import ProfitlossSet from '@m/modules/profitLossSet/profitLossSet'
import LimitPrice from '@m/modules/limitPrice/limitPrice'
import { retMsg } from '@m/views/retMsg'

export default {
    name: 'ChangeBuyOrder',
    data () {
        return {
            loading: false,
            lotNum: '',
            pendingOrderPrice: '',
            direction: '',
            pendingsInfo: {},
            limitConfig: {},
            profitLossConfig: {},
            isTrade: true
        }
    },
    mounted () {
        const orderPage = this.$refs.orderPage
        orderPage.style.height = document.body.clientHeight + 'px'
    },
    methods: {
        ...mapActions({
            'symoblCanTrade': 'ix_baseInfo/symoblCanTrade'
        }),
        wsMessage (evt) {
            if (typeof evt.data === 'object' || evt.data.indexOf('{') !== 0) {
                return
            }
            const { msg_code, code } = JSON.parse(evt.data)
            if (msg_code.toLowerCase() === 'OrderAddRet'.toLowerCase() && code === '0000') {
                // 收到订单变化
                this.getPendings()
            }
        },
        getPendings () {
            this.loading = true
            this.$mSocket
                .send('pendings', {
                    account_id: this.userLoginInfo.account_id
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
                    this.pendingsInfo = data_list.filter(item => item.id == this.$route.params.id)[0] || {}
                    this.loading = false

                    if (!this.pendingsInfo.id) {
                        this.$dialog
                            .alert({
                                message: this.$t('trade.pendingSearchEmpty')
                            })
                            .then(() => {
                                this.$router.go(-1)
                            })
                    } else {
                        this.$ws.send_addSubscription_proList(this.pendingsInfo.code_id)
                        this.symoblCanTrade(this.showPendings.groupSymbol.id).then(res => {
                            this.isTrade = res.mayTrade
                            if (!this.isTrade) {
                                this.$toast({ duration: 3000, message: this.$t('trade.marketIsClosed') })
                            }
                        })
                        this.initOrderInfo(this.showPendings)
                    }
                })
                .catch(error => {
                    console.log('timeOut')
                    this.loading = false
                })
        },
        initOrderInfo (info) {
            console.log('pendingsInfo', JSON.parse(JSON.stringify(info)))
            this.lotNum = info.request_volume
            const config = {}
            config.defaultPrice = info.request_price
            config.type = info.type
            config.expire_type = info.expire_type
            this.limitConfig = config
            const profitLossConfig = {
                take_profit: info.take_profit,
                stop_loss: info.stop_loss
            }
            this.profitLossConfig = profitLossConfig
            this.direction = info.direction === 1 ? 'buy' : 'sell'
        },
        // 修改挂单
        modifyPendingOrder () {
            const userLoginInfo = this.userLoginInfo
            const pendingsInfo = this.pendingsInfo
            const product = this.product
            if (!userLoginInfo) return this.$toast(this.$t('loginTip.getUserInfoError'))
            const profitlossParams = this.$refs.profitloss.submit()
            const limitPriceParams = this.$refs.limitPrice.submit()
            if (profitlossParams === false || limitPriceParams === false) return
            if (limitPriceParams.request_price == pendingsInfo.request_price &&
                profitlossParams.stop_loss == pendingsInfo.stop_loss &&
                profitlossParams.take_profit == pendingsInfo.take_profit) {
                return this.$toast(this.$t('trade.orderNotChange'))
            }
            const params = {
                msg_id: msg_id(),
                account_id: userLoginInfo.account_id,
                group_id: userLoginInfo.group_id,
                direction: pendingsInfo.direction, // 交易方向买:1卖:2
                id: pendingsInfo.id, // 订单id
                type: 1, // 订单类型市价建仓（1）、限价建仓（2）、停损建仓（4）、市价平仓（8）
                status: 1, // 订单状态PLACED（1,等待）、FILLED（2,已执行）、PARTIAL_FILLED(3,不支持)、CANCELED（4,已取消）、REJECTED（5,已拒绝）、DELETED（6,已删除）
                client_type: 4, // 客户端类型WEBUI:4除）
                symbol: pendingsInfo.symbol, // 产品编码
                request_volume: this.lotNum * 1,
                request_price: product.cur_price,
                use_pips: false, // 是否使用止盈止损點數
                stop_loss_pips: 0,
                take_profit_pips: 0,
                stop_loss: 0,
                take_profit: 0,
                request_time: pendingsInfo.request_time,
                range: 100, // 根据已有数据分析，市价最大偏移默认100，不再做为用户主动设置条件
                expire_type: 1 // 过期类型1.当日有效2.当周有效3.指定时间
            }
            Object.assign(params, profitlossParams, limitPriceParams)
            this.submit(params)
            // this.wsOpenOrder(params)
            // this.$router.push({name:'OrderSuccess'})
        },
        submit (params) {
            this.submitLoading = this.$loading({ mask: true, duration: 0 })
            this.$mSocket
                .send('modifyOrder', params)
                .then(res => {
                    console.log(res)
                    this.submitLoading.clear()
                    if (res.errorType) {
                        this.$alert(this.$te('retMsg.' + res.errorData.ret) ? this.$t('retMsg.' + res.errorData.ret) : res.remark)
                        return
                    }
                    this.$alert(this.$t('trade.pendingChangeSuccess')).then(res => {
                        this.$router.replace({ name: 'PositionIndex' })
                    })
                })
                .catch(err => {
                    this.submitLoading.clear()
                    this.$alert(err && err.errorType ? err.errorType : err)
                    console.log(err)
                })
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
        },
        showPendings () {
            if (this.pendingsInfo.symbol) {
                const _baseInfo = this.productMap[this.pendingsInfo.symbol] || {}
                return Object.assign({}, _baseInfo, this.pendingsInfo)
            } else {
                return {
                    groupSymbol: {}
                }
            }
        },
        product () {
            if (this.pendingsInfo.symbol) {
                const product = this.productMap[this.pendingsInfo.symbol] || {}
                return product
            } else {
                return {
                    groupSymbol: {}
                }
            }
        },
        stepDigit () {
            return this.pendingsInfo && this.pendingsInfo.groupSymbol ? String(this.pendingsInfo.groupSymbol.volumes_step).split('.')[1].length : 2
        }
    },
    components: {
        Top,
        ProfitlossSet,
        LimitPrice
    },
    created () {
        this.getPendings()
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.orderPage {
    position: relative;
    box-sizing: border-box;
    padding-top: rem(90px);
    .main {
        height: 100%;
        overflow: auto;
        .m-loading {
            text-align: center;
            padding-top: rem(60px);
        }
    }

    .productInfo {
        padding: rem(28px) rem(30px);
        line-height: 1.5;
        background: #fff;
        position: relative;
        &::after {
            @include borderline();
            bottom: 0;
        }
        .name {
            font-size: rem(34px);
        }
        .code {
            font-size: rem(20px);
            color: #999;
        }
        .price {
            position: absolute;
            top: 50%;
            right: rem(30px);
            transform: translateY(-50%);
            font-size: rem(34px);
        }
    }
    .mtop {
        margin-top: rem(20px);
    }
    .mtop40 {
        margin-top: rem(40px);
    }
    .submitBox {
        position: absolute;
        z-index: 1;
        left: 0;
        bottom: 0;
        width: 100%;
        .van-button {
            flex: 1;
            border: none;
            border-radius: 0;
            height: rem(100px);
            font-size: rem(34px);
        }
    }
}

.pendingOrder {
    background-color: #fff;
    padding: rem(30px);
    align-items: center;
    line-height: 1.5;
    font-size: rem(28px);
    .priceSecticon {
        color: $muted;
        font-size: rem(20px);
    }
    .cellBar {
        align-items: center;
        margin-top: rem(40px);
    }
    .stepper {
        ::v-deep .van-stepper__input {
            margin: 0;
        }
    }
}
.profitlossWrapper {
    margin-top: rem(20px);
    margin-bottom: rem(100px);
}
</style>
